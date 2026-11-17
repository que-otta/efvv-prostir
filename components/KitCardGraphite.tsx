import Link from "next/link";
import type { CSSProperties } from "react";
import { formatPrice, kitMessage, kitStats, type Subject } from "@/data/subjects";
import { sizeText } from "@/lib/sizeText";
import { telegramLink } from "@/lib/urls";
import { ArrowRight, Telegram } from "./Icons";
import Pic from "./Pic";
import SubjectIcon from "./SubjectIcon";

/** Картка комплекту в резервному оформленні «graphite»: банер, значок і колір предмета, ціна, кнопка. Потрібен предок із класом `v2`. */
export default function KitCardGraphite({ subject }: { subject: Subject }) {
  const { ready, price } = subject.kit;
  const stats = kitStats(subject);
  const href = `/komplekty/${subject.id}/`;
  return (
    <article className="v2-card" style={{ "--c": subject.neon } as CSSProperties}>
      <Link className="v2-card__img" href={href} tabIndex={-1} aria-hidden="true">
        <Pic src={subject.preview.src} alt="" width={subject.preview.width} height={subject.preview.height} sizes="(min-width: 64em) 34rem, (min-width: 48em) 45vw, 90vw" loading="lazy" />
      </Link>
      <div className="v2-card__body">
        <div className="v2-card__head">
          <SubjectIcon id={subject.id} className="v2-avatar" />
          <div>
            <div className="v2-tags">
              <span><i className="v2-dot" />{ready ? `${subject.exam} · ${subject.edition.label}` : "Готується"}</span>
              {ready && subject.edition.freeUpdate && <span className="v2-free">оновлення безкоштовно</span>}
            </div>
            <h3><Link href={href}>{subject.title}</Link></h3>
          </div>
        </div>
        <p className="v2-desc">{subject.description}</p>
        <div className="v2-card__foot">
          <div className="v2-meta">
            {ready && price ? <b>{formatPrice(price)}</b> : null}
            {ready ? sizeText(stats.files, stats.pages) : "Склад і ціну буде вказано, коли комплект буде готовий."}
          </div>
          <div className="v2-card__act">
            <Link className="v2-link" href={href}>
              Про комплект <ArrowRight />
            </Link>
            {ready && (
              <a className="v2-btn v2-btn--p v2-btn--s" href={telegramLink(kitMessage(subject))} target="_blank" rel="noopener noreferrer">
                <Telegram /> Купити
              </a>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
