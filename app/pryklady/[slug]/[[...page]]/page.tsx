import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Breadcrumbs from "@/components/Breadcrumbs";
import BuyBlock from "@/components/BuyBlock";
import PageViewer from "@/components/PageViewer";
import { getSubject } from "@/data/subjects";
import { getSample, sampleIsReady, samplePath, samples } from "@/data/samples";
import { buildMetadata } from "@/lib/seo";

type Params = { slug: string; page?: string[] };

export const dynamicParams = false;

export function generateStaticParams(): Params[] {
  return samples.flatMap((sample) =>
    sample.pages.map((_, index) => ({ slug: sample.slug, page: index === 0 ? [] : [String(index + 1)] })),
  );
}

/** Сторінка 1 — `/pryklady/slug/`, далі — `/pryklady/slug/2/` тощо. Повертає номер або `undefined`, якщо адреса хибна. */
function resolvePage(segments: string[] | undefined, total: number): number | undefined {
  if (!segments || segments.length === 0) return 1;
  if (segments.length > 1 || !/^\d+$/.test(segments[0])) return undefined;
  const number = Number(segments[0]);
  return number >= 2 && number <= total ? number : undefined;
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug, page } = await params;
  const sample = getSample(slug);
  const number = sample ? resolvePage(page, sample.pages.length) : undefined;
  if (!sample || !number) return {};

  const current = sample.pages[number - 1];
  return buildMetadata({
    title: number === 1 ? sample.title : `${sample.title} — ${current.label}`,
    description: sample.description,
    path: samplePath(sample, number),
    // Індексується лише перша сторінка зразка готового комплекту.
    noindex: !sampleIsReady(sample) || number > 1,
    ogImage: getSubject(sample.subjectId)?.og,
  });
}

export default async function SamplePage({ params }: { params: Promise<Params> }) {
  const { slug, page } = await params;
  const sample = getSample(slug);
  const number = sample ? resolvePage(page, sample.pages.length) : undefined;
  if (!sample || !number) notFound();

  const subject = getSubject(sample.subjectId);
  const hrefs = sample.pages.map((_, index) => samplePath(sample, index + 1));

  return (
    <>
      <section className="viewer-page dark">
        <PageViewer pages={sample.pages} hrefs={hrefs} contents={sample.contents} initial={number - 1}>
          <Breadcrumbs items={[{ href: "/", label: "Головна" }, { href: "/pryklady/", label: "Приклади" }, { label: subject?.title ?? "Перегляд" }]} />
          <h1 className="pv__title">{sample.title}</h1>
        </PageViewer>
      </section>

      {subject && (
        <section className="section section--alt" aria-labelledby="sample-cta">
          <div className="container">
            <h2 id="sample-cta">{subject.kit.ready ? "Потрібен весь комплект?" : "Комплект ще готується"}</h2>
            <p className="prose">
              {subject.kit.ready
                ? <>Комплект «{subject.title}» — це {subject.kit.files.length} PDF-файлів за всіма розділами програми. <Link href={`/komplekty/${subject.id}/`}>Склад, ціна й умови</Link>.</>
                : <>Комплект «{subject.title}» ще готується. <Link href={`/komplekty/${subject.id}/`}>Про комплект</Link> — а якщо хочеш дізнатися першим, напиши в Telegram.</>}
            </p>
            <BuyBlock subject={subject} />
          </div>
        </section>
      )}
    </>
  );
}