"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

/** Кожна вкладка — окрема сторінка з власною адресою, щоб її можна було індексувати як самостійну. */
const items = [
  { label: "Комплекти", href: "/komplekty/" },
  { label: "Програма", href: "/programa/" },
  { label: "Приклади", href: "/pryklady/" },
  { label: "Як купити", href: "/yak-kupyty/" },
];

/** Основне меню: підсвічує вкладку поточного розділу сайту. */
export default function MainNav() {
  const pathname = usePathname() ?? "";

  return (
    <nav aria-label="Основне меню" className="main-nav">
      <ul>
        {items.map((item) => (
          <li key={item.href}>
            <Link href={item.href} aria-current={pathname.startsWith(item.href.replace(/\/$/, "")) ? "page" : undefined}>
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
