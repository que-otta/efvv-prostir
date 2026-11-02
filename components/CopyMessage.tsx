"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";

const noop = () => () => {};

/** Кнопка «Скопіювати текст»: запасний шлях, якщо Telegram не підставив повідомлення сам. З’являється лише з JavaScript. */
export default function CopyMessage({ text }: { text: string }) {
  const jsReady = useSyncExternalStore(noop, () => true, () => false);
  const [copied, setCopied] = useState(false);
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  if (!jsReady) return null;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const area = document.createElement("textarea");
      area.value = text;
      area.setAttribute("readonly", "");
      area.style.position = "fixed";
      area.style.opacity = "0";
      document.body.appendChild(area);
      area.select();
      document.execCommand("copy");
      area.remove();
    }
    setCopied(true);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setCopied(false), 2200);
  };

  return (
    <button type="button" className="copy-btn" onClick={copy}>
      {copied ? "Скопійовано ✓" : "Скопіювати текст"}
    </button>
  );
}