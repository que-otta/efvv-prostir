"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export type HeaderBuyKits = Record<string, { href: string; label: string }>;

/** Кнопка покупки в шапці: на сторінці комплекту веде в Telegram із текстом саме цього комплекту, на решті сторінок — до вибору комплекту. */
export default function HeaderBuy({ kits }: { kits: HeaderBuyKits }) {
  const pathname = usePathname() ?? "";
  const id = pathname.match(/^\/komplekty\/([^/]+)\/?$/)?.[1];
  const kit = id ? kits[id] : undefined;

  if (kit) {
    return (
      <a className="btn btn--primary header-buy header-buy--kit" href={kit.href} target="_blank" rel="noopener noreferrer">
        {kit.label}
      </a>
    );
  }
  return (
    <Link className="btn btn--primary header-buy" href="/#komplekty">
      Купити
    </Link>
  );
}
