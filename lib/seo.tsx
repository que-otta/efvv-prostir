import type { Metadata } from "next";
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/site.config";
import { absoluteUrl } from "./urls";

export const OG_IMAGE = { path: "/og.jpg", width: 1200, height: 630 };

type PageMetaOptions = {
  title: string;
  description: string;
  path: string;
  /** `true` — сторінка не потрапляє в пошук (комплекти, що ще готуються). */
  noindex?: boolean;
  /** Не додавати до заголовка назву сайту (для головної). */
  absoluteTitle?: boolean;
  /** Зображення для попереднього перегляду посилання; без нього — загальне `/og.jpg`. */
  ogImage?: { path: string; width: number; height: number };
};

export function buildMetadata({ title, description, path, noindex = false, absoluteTitle = false, ogImage = OG_IMAGE }: PageMetaOptions): Metadata {
  const url = absoluteUrl(path);
  const fullTitle = absoluteTitle ? title : `${title} — ${SITE_NAME}`;
  const image = absoluteUrl(ogImage.path);

  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: { canonical: url },
    ...(noindex ? { robots: { index: false, follow: true } } : {}),
    openGraph: {
      type: "website",
      locale: "uk_UA",
      siteName: SITE_NAME,
      title: fullTitle,
      description,
      url,
      images: [{ url: image, width: ogImage.width, height: ogImage.height, alt: SITE_NAME }],
    },
    twitter: { card: "summary_large_image", title: fullTitle, description, images: [image] },
  };
}

export const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: SITE_NAME,
  url: absoluteUrl("/"),
  description: SITE_DESCRIPTION,
  inLanguage: "uk",
};

export function productJsonLd(options: { name: string; description: string; path: string; image: string; price: number }) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: options.name,
    description: options.description,
    image: absoluteUrl(options.image),
    url: absoluteUrl(options.path),
    brand: { "@type": "Brand", name: SITE_NAME },
    offers: {
      "@type": "Offer",
      url: absoluteUrl(options.path),
      price: String(options.price),
      priceCurrency: "UAH",
      availability: "https://schema.org/InStock",
      seller: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
    },
  };
}

export function faqJsonLd(items: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };
}

export function JsonLd({ data }: { data: object }) {
  // `<` екранується, щоб розмітка не могла «закрити» тег script.
  const json = JSON.stringify(data).replace(/</g, "\\u003c");
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />;
}
