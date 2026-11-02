"use client";

import Link from "next/link";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type MouseEvent,
  type PointerEvent,
  type ReactNode,
} from "react";
import { withBase } from "@/lib/urls";
import { ArrowLeft, ArrowRight, Collapse, Expand, Minus, Plus } from "./Icons";
import Pic from "./Pic";

export type ViewerPage = {
  image: string;
  thumb: string;
  width: number;
  height: number;
  label: string;
  alt: string;
};

export type ViewerContentsItem = { page: number; title: string };

type PageViewerProps = {
  pages: ViewerPage[];
  /** Адреса кожної сторінки (без basePath) — для посилань і адресного рядка. */
  hrefs: string[];
  contents: ViewerContentsItem[];
  /** Індекс сторінки, яку відкрито зі сервера (з нуля). */
  initial: number;
  /** Хлібні крихти й заголовок — рендеряться на сервері. */
  children?: ReactNode;
};

const STEPS = [1, 1.25, 1.5, 2, 2.5, 3, 4];
/** Відступи сцени (8px з кожного боку), які віднімаються від доступного місця. */
const PAD = 16;

const noop = () => () => {};
const isClient = () => true;
const isServer = () => false;

function isInteractive(target: EventTarget | null): boolean {
  const element = target as HTMLElement | null;
  return Boolean(element && (element.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(element.tagName)));
}

/**
 * Переглядач сторінок: сторінка завжди вміщується в сцену повністю; кнопки зуму й «На весь екран» —
 * лише покращення. Без JavaScript працюють звичайні посилання «Назад» / «Далі».
 */
export default function PageViewer({ pages, hrefs, contents, initial, children }: PageViewerProps) {
  const [index, setIndex] = useState(initial);
  const [zoom, setZoom] = useState(1);
  const [full, setFull] = useState(false);
  const [stage, setStage] = useState<{ w: number; h: number } | null>(null);
  const jsReady = useSyncExternalStore(noop, isClient, isServer);

  const rootRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const openRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const keepCenter = useRef<{ x: number; y: number } | null>(null);
  const drag = useRef<{ x: number; y: number; left: number; top: number } | null>(null);
  const swipe = useRef<{ x: number; y: number } | null>(null);

  const last = pages.length - 1;
  const page = pages[index];

  // --- розмір сцени ---
  useEffect(() => {
    const element = stageRef.current;
    if (!element) return;
    const observer = new ResizeObserver(() => setStage({ w: element.clientWidth, h: element.clientHeight }));
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  let size: { width: number; height: number } | undefined;
  if (stage) {
    const ratio = page.width / page.height;
    const availableW = Math.max(stage.w - PAD, 60);
    const availableH = Math.max(stage.h - PAD, 60);
    const fitW = Math.min(availableW, availableH * ratio);
    size = { width: Math.round(fitW * zoom), height: Math.round((fitW / ratio) * zoom) };
  }

  // --- навігація ---
  const go = useCallback(
    (target: number) => {
      const next = Math.min(Math.max(target, 0), last);
      setIndex(next);
      stageRef.current?.scrollTo(0, 0);
      window.history.replaceState(null, "", withBase(hrefs[next]));
    },
    [hrefs, last],
  );

  const onLink = (event: MouseEvent<HTMLAnchorElement>, target: number) => {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    go(target);
  };

  // сусідні сторінки завантажуються наперед
  useEffect(() => {
    for (const neighbour of [index - 1, index + 1]) {
      if (neighbour < 0 || neighbour > last) continue;
      const preload = new window.Image();
      preload.src = withBase(pages[neighbour].image);
    }
  }, [index, last, pages]);

  // --- зум ---
  const changeZoom = useCallback((next: number) => {
    const element = stageRef.current;
    if (element && element.scrollWidth > 0 && element.scrollHeight > 0) {
      keepCenter.current = {
        x: (element.scrollLeft + element.clientWidth / 2) / element.scrollWidth,
        y: (element.scrollTop + element.clientHeight / 2) / element.scrollHeight,
      };
    }
    setZoom(next);
  }, []);

  useLayoutEffect(() => {
    const element = stageRef.current;
    const center = keepCenter.current;
    if (!element || !center) return;
    keepCenter.current = null;
    element.scrollLeft = center.x * element.scrollWidth - element.clientWidth / 2;
    element.scrollTop = center.y * element.scrollHeight - element.clientHeight / 2;
  }, [zoom]);

  const zoomIn = useCallback(() => {
    const next = STEPS.find((step) => step > zoom + 0.001);
    if (next) changeZoom(next);
  }, [zoom, changeZoom]);

  const zoomOut = useCallback(() => {
    const next = [...STEPS].reverse().find((step) => step < zoom - 0.001);
    if (next) changeZoom(next);
  }, [zoom, changeZoom]);

  // --- на весь екран ---
  const enterFull = useCallback(() => {
    setFull(true);
    rootRef.current?.requestFullscreen?.().catch(() => {});
  }, []);

  const exitFull = useCallback(() => {
    setFull(false);
    if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
  }, []);

  useEffect(() => {
    const onChange = () => {
      if (!document.fullscreenElement) setFull(false);
    };
    document.addEventListener("fullscreenchange", onChange);
    return () => document.removeEventListener("fullscreenchange", onChange);
  }, []);

  useEffect(() => {
    if (!full) return;
    const previous = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    const close = closeRef.current;
    const open = openRef.current;
    close?.focus();
    return () => {
      document.documentElement.style.overflow = previous;
      open?.focus();
    };
  }, [full]);

  // --- клавіатура ---
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.altKey || event.ctrlKey || event.metaKey || isInteractive(event.target)) return;
      switch (event.key) {
        case "ArrowLeft":
          if (index > 0) go(index - 1);
          break;
        case "ArrowRight":
          if (index < last) go(index + 1);
          break;
        case "+":
        case "=":
          zoomIn();
          break;
        case "-":
        case "_":
          zoomOut();
          break;
        case "0":
          changeZoom(1);
          break;
        case "f":
        case "F":
          if (full) exitFull();
          else enterFull();
          break;
        case "Escape":
          if (full) exitFull();
          break;
        default:
          return;
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [index, last, full, go, zoomIn, zoomOut, changeZoom, enterFull, exitFull]);

  // --- перетягування збільшеної сторінки мишею; свайп пальцем гортає сторінки, коли масштаб 100% ---
  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === "touch") {
      swipe.current = zoom === 1 && event.isPrimary ? { x: event.clientX, y: event.clientY } : null;
      return;
    }
    if (zoom <= 1 || event.pointerType !== "mouse" || event.button !== 0) return;
    const element = event.currentTarget;
    drag.current = { x: event.clientX, y: event.clientY, left: element.scrollLeft, top: element.scrollTop };
    element.setPointerCapture(event.pointerId);
  };
  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const start = drag.current;
    if (!start) return;
    event.currentTarget.scrollLeft = start.left - (event.clientX - start.x);
    event.currentTarget.scrollTop = start.top - (event.clientY - start.y);
  };
  const onPointerEnd = (event: PointerEvent<HTMLDivElement>) => {
    drag.current = null;
    const start = swipe.current;
    swipe.current = null;
    if (!start || event.type !== "pointerup") return;
    const dx = event.clientX - start.x;
    const dy = event.clientY - start.y;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5) go(index + (dx < 0 ? 1 : -1));
  };

  // На телефоні дотик до сторінки відкриває її на весь екран.
  const onStageClick = () => {
    if (!full && zoom === 1 && window.matchMedia("(max-width: 47.99em)").matches) enterFull();
  };

  const canZoomIn = zoom < STEPS[STEPS.length - 1] - 0.001;
  const canZoomOut = zoom > 1.001;

  return (
    <div
      ref={rootRef}
      className={`pv${full ? " pv--full" : ""}`}
      role={full ? "dialog" : undefined}
      aria-modal={full ? true : undefined}
      aria-label={full ? "Перегляд сторінки на весь екран" : undefined}
    >
      <div className="container pv__top">
        {!full && <div className="pv__heading">{children}</div>}
        <div className="pv__bar">
          <div className="pv__nav">
            {index > 0 ? (
              <Link className="pv-btn" href={hrefs[index - 1]} rel="prev" prefetch={false} onClick={(event) => onLink(event, index - 1)}>
                <ArrowLeft /> <span className="pv-btn__text">Назад</span>
              </Link>
            ) : (
              <span className="pv-btn pv-btn--off" aria-disabled="true"><ArrowLeft /> <span className="pv-btn__text">Назад</span></span>
            )}
            <span className="pv__count" aria-live="polite"><span className="sr-only">Сторінка </span>{index + 1} з {pages.length}</span>
            {index < last ? (
              <Link className="pv-btn pv-btn--primary" href={hrefs[index + 1]} rel="next" prefetch={false} onClick={(event) => onLink(event, index + 1)}>
                <span className="pv-btn__text">Далі</span> <ArrowRight />
              </Link>
            ) : (
              <span className="pv-btn pv-btn--primary pv-btn--off" aria-disabled="true"><span className="pv-btn__text">Далі</span> <ArrowRight /></span>
            )}
          </div>
          {jsReady && (
            <div className="pv__tools" role="group" aria-label="Масштаб і повний екран">
              <button type="button" className="pv-btn pv-btn--icon" onClick={zoomOut} disabled={!canZoomOut} aria-label="Зменшити" title="Зменшити (−)">
                <Minus />
              </button>
              <button type="button" className="pv-btn pv__zoom" onClick={() => changeZoom(1)} disabled={zoom === 1} title="Вмістити на екран (0)">
                {Math.round(zoom * 100)}%
              </button>
              <button type="button" className="pv-btn pv-btn--icon" onClick={zoomIn} disabled={!canZoomIn} aria-label="Збільшити" title="Збільшити (+)">
                <Plus />
              </button>
              {full ? (
                <button type="button" ref={closeRef} className="pv-btn pv-btn--accent" onClick={exitFull} aria-label="Закрити" title="Закрити (Esc)">
                  <Collapse /> <span className="pv__long">Закрити</span>
                </button>
              ) : (
                <button type="button" ref={openRef} className="pv-btn pv-btn--accent" onClick={enterFull} aria-label="На весь екран" title="На весь екран (F)">
                  <Expand /> <span className="pv__long">На весь екран</span><span className="pv__short" aria-hidden="true">Екран</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="container pv__body">
        <div className="pv__stagewrap">
          <div
            ref={stageRef}
            className={`pv__stage${zoom > 1 ? " is-zoomed" : ""}`}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerEnd}
            onPointerCancel={onPointerEnd}
            onClick={onStageClick}
            onDoubleClick={() => changeZoom(zoom > 1 ? 1 : 2)}
          >
            <div className="pv__sheet">
              <Pic
                src={page.image}
                alt={page.alt}
                width={page.width}
                height={page.height}
                sizes="(min-width: 64em) 44rem, 100vw"
                loading="eager"
                fetchPriority="high"
                draggable={false}
                className={`pv__img${size ? " is-sized" : ""}`}
                style={size}
              />
            </div>
          </div>
        </div>

        {!full && (
          <aside className="pv__side" aria-label="Зміст і сторінки">
            <h2 className="pv__heading-small">Зміст</h2>
            <ol className="pv__contents">
              {contents.map((item, position) => {
                const nextStart = contents[position + 1]?.page ?? pages.length + 1;
                const current = index + 1 >= item.page && index + 1 < nextStart;
                return (
                  <li key={item.page}>
                    <Link href={hrefs[item.page - 1]} prefetch={false} aria-current={current ? "true" : undefined} onClick={(event) => onLink(event, item.page - 1)}>
                      <span className="pv__contents-page">{item.page}</span> {item.title}
                    </Link>
                  </li>
                );
              })}
            </ol>
            <h2 className="pv__heading-small">Сторінки</h2>
            <ul className="pv__thumbs">
              {pages.map((item, position) => (
                <li key={item.image}>
                  <Link
                    href={hrefs[position]}
                    prefetch={false}
                    aria-current={position === index ? "page" : undefined}
                    aria-label={`Сторінка ${position + 1} з ${pages.length}`}
                    onClick={(event) => onLink(event, position)}
                  >
                    <Pic src={item.thumb} alt="" width={120} height={Math.round((120 * item.height) / item.width)} loading="lazy" />
                    <span>{position + 1}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </aside>
        )}
      </div>
    </div>
  );
}