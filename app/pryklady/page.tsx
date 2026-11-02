import Link from "next/link";
import Breadcrumbs from "@/components/Breadcrumbs";
import { ArrowRight } from "@/components/Icons";
import Pic from "@/components/Pic";
import StatusBadge from "@/components/StatusBadge";
import { getSubject, SAMPLES_NOTE } from "@/data/subjects";
import { samplePath, samples } from "@/data/samples";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Приклади сторінок PDF-конспектів до ЄФВВ",
  description: "Погортай справжні сторінки з PDF-файлів комплектів: схеми, таблиці, карти розділів. Повні файли надсилаємо після покупки в Telegram.",
  path: "/pryklady/",
});

export default function SamplesPage() {
  return (
    <>
      <section className="page-head dark">
        <div className="container">
          <Breadcrumbs items={[{ href: "/", label: "Головна" }, { label: "Приклади" }]} />
          <h1>Приклади матеріалів</h1>
          <p className="lead">
            Це справжні сторінки з PDF-файлів. Гортай їх по одній, зі змістом і кнопками «Назад» та «Далі». Повні файли сайт не
            роздає — їх надсилають у Telegram після покупки.
          </p>
          <p className="notice notice--info">{SAMPLES_NOTE}</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="grid grid--2">
            {samples.map((sample) => {
              const subject = getSubject(sample.subjectId);
              return (
                <article className="sample-card" key={sample.slug}>
                  <Pic src={sample.cover.src} alt="" width={sample.cover.width} height={sample.cover.height} sizes="(min-width: 40em) 10rem, 35vw" loading="lazy" className="sample-card__img" />
                  <div>
                    {subject && <StatusBadge ready={subject.kit.ready} />}
                    <h2 className="sample-card__title">
                      <Link href={samplePath(sample)}>{sample.shortTitle}</Link>
                    </h2>
                    <p>{sample.lead}</p>
                    <p className="sample-card__meta">{sample.pages.length} сторінок у перегляді</p>
                    <Link className="btn btn--ghost" href={samplePath(sample)}>
                      Відкрити приклад <ArrowRight />
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
