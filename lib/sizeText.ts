import { plural } from "./plural";

/** «10 PDF · 140 сторінок»; кількість сторінок може бути невідомою. */
export function sizeText(files: number, pages: number | null): string {
  return [`${files} PDF`, pages !== null ? `${pages} ${plural(pages, "сторінка", "сторінки", "сторінок")}` : null].filter(Boolean).join(" · ");
}
