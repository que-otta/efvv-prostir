import HomeClassic from "@/components/HomeClassic";
import HomeGraphite from "@/components/HomeGraphite";
import { faq } from "@/data/faq";
import { buildMetadata, faqJsonLd, JsonLd, websiteJsonLd } from "@/lib/seo";
import { DESIGN, SITE_DESCRIPTION, SITE_NAME, SITE_TAGLINE } from "@/site.config";

export const metadata = buildMetadata({
  title: `${SITE_NAME} — ${SITE_TAGLINE}`,
  description: SITE_DESCRIPTION,
  path: "/",
  absoluteTitle: true,
});

/** Головна: тексти й розмітка для пошуку однакові, оформлення залежить від DESIGN у site.config.ts. */
export default function HomePage() {
  return (
    <>
      <JsonLd data={websiteJsonLd} />
      <JsonLd data={faqJsonLd(faq)} />
      {DESIGN === "graphite" ? <HomeGraphite /> : <HomeClassic />}
    </>
  );
}
