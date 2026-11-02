import Link from "next/link";
import { JsonLd } from "@/lib/seo";
import { absoluteUrl } from "@/lib/urls";

type Crumb = { href?: string; label: string };

/** Навігаційний ланцюжок; для пошукових систем додатково виводить розмітку BreadcrumbList. */
export default function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: items.map((item, index) => ({
            "@type": "ListItem",
            position: index + 1,
            name: item.label,
            ...(item.href ? { item: absoluteUrl(item.href) } : {}),
          })),
        }}
      />
      <nav aria-label="Навігаційний ланцюжок" className="breadcrumbs">
        <ol>
          {items.map((item, index) => (
            <li key={item.label}>
              {item.href && index < items.length - 1 ? <Link href={item.href}>{item.label}</Link> : <span aria-current="page">{item.label}</span>}
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
}
