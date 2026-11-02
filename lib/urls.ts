import { BASE_PATH, SITE_URL, TELEGRAM_URL } from "@/site.config";

/** Шлях до файлу з `public/` з урахуванням basePath (для `<Image>` і мета-тегів). */
export function withBase(path: string): string {
  return `${BASE_PATH}${path.startsWith("/") ? path : `/${path}`}`;
}

/** Абсолютна адреса сторінки або файлу — для canonical, Open Graph, sitemap, JSON-LD. */
export function absoluteUrl(path = "/"): string {
  return `${SITE_URL.replace(/\/+$/, "")}${withBase(path)}`;
}

/** Посилання на Telegram із заготовленим повідомленням. */
export function telegramLink(text: string): string {
  const separator = TELEGRAM_URL.includes("?") ? "&" : "?";
  return `${TELEGRAM_URL}${separator}text=${encodeURIComponent(text)}`;
}
