import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Breadcrumbs from "@/components/Breadcrumbs";
import BuyBar from "@/components/BuyBar";
import BuyBlock from "@/components/BuyBlock";
import EditionNote from "@/components/EditionNote";
import FileGallery from "@/components/FileGallery";
import { ArrowRight, Check } from "@/components/Icons";
import KnowledgeList from "@/components/KnowledgeList";
import { coverFor } from "@/components/KitCard";
import LevelsOverview from "@/components/LevelsOverview";
import Pic from "@/components/Pic";
import ProgramDonut from "@/components/ProgramDonut";
import StatusBadge from "@/components/StatusBadge";
import Syllabus from "@/components/Syllabus";
import ScoreNote from "@/components/ScoreNote";
import { formatPrice, getSubject, kitIsOneToOne, kitStats, REFUND_NOTE, SCORE_NOTE, subjects } from "@/data/subjects";
import { samplePath, samples } from "@/data/samples";
import { terms, updateTerm } from "@/data/terms";
import { buildMetadata, JsonLd, productJsonLd } from "@/lib/seo";
import { plural } from "@/lib/plural";

type Params = { id: string };

export const dynamicParams = false;

export function generateStaticParams(): Params[] {
  return subjects.map((subject) => ({ id: subject.id }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { id } = await params;
  const subject = getSubject(id);
  if (!subject) return {};
  const { ready, price } = subject.kit;
  const stats = kitStats(subject);
  const files = `${stats.files} ${plural(stats.files, "PDF-файл", "PDF-файли", "PDF-файлів")}`;
  const sheets = stats.pages !== null ? `, ${stats.pages} ${plural(stats.pages, "сторінка", "сторінки", "сторінок")}` : "";
  return buildMetadata({
    title: ready ? `${subject.title}: PDF-конспекти до ЄФВВ` : `${subject.title}: комплект готується`,
    description: ready
      ? `${files}${sheets} конспектів до ЄФВВ з предмета «${subject.title}» за розділами програми. ${price ? `Ціна — ${formatPrice(price)}, покупка` : "Покупка"} через Telegram.`
      : `Комплект PDF-конспектів до ЄФВВ з предмета «${subject.title}» ще готується. ${subject.description}`,
    path: `/komplekty/${subject.id}/`,
    noindex: !ready,
    ogImage: subject.og,
  });
}

export default async function KitPage({ params }: { params: Promise<Params> }) {
  const { id } = await params;
  const subject = getSubject(id);
  if (!subject) notFound();

  const { ready, price } = subject.kit;
  const stats = kitStats(subject);
  const cover = coverFor(subject);
  const sample = samples.find((item) => item.subjectId === subject.id);
  const oneToOne = kitIsOneToOne(subject);
  const path = `/komplekty/${subject.id}/`;
  const others = subjects.filter((item) => item.id !== subject.id);

  return (
    <>
      {ready && price && (
        <JsonLd
          data={productJsonLd({
            name: `Комплект PDF-конспектів до ЄФВВ: ${subject.title}`,
            description: `${subject.overview} ${SCORE_NOTE}`,
            path,
            image: subject.preview.src,
            price,
          })}
        />
      )}

      <section className="page-head dark">
        <div className="container">
          <Breadcrumbs items={[{ href: "/", label: "Головна" }, { href: "/komplekty/", label: "Комплекти" }, { label: subject.title }]} />
          <div className="kit-hero">
            <div className="kit-hero__copy">
              <StatusBadge ready={ready} />
              <h1>{subject.title}</h1>
              <p className="lead">{subject.overview}</p>

              {ready ? (
                <dl className="facts">
                  <div><dt>Файлів</dt><dd>{stats.files}</dd></div>
                  {stats.pages !== null && <div><dt>Сторінок</dt><dd>{stats.pages}</dd></div>}
                  <div><dt>Формат</dt><dd>PDF</dd></div>
                  {price && <div><dt>Ціна</dt><dd>{formatPrice(price)}</dd></div>}
                </dl>
              ) : (
                <p className="callout">
                  Комплект готується. Склад і ціну буде вказано тут, щойно він буде готовий.
                </p>
              )}

              {ready && (
                <>
                  <EditionNote subject={subject} />
                  <ScoreNote />
                </>
              )}

              <BuyBlock subject={subject} />
            </div>
            <div className="kit-hero__media">
              {cover ? (
                <Pic
                  src={cover.src}
                  alt={`Сторінка зі схемами з комплекту «${subject.title}»`}
                  width={cover.width}
                  height={cover.height}
                  sizes="(min-width: 64em) 20rem, (min-width: 48em) 16rem, 70vw"
                  loading="eager"
                  fetchPriority="high"
                />
              ) : (
                <Pic src={subject.icon} alt="" width={144} height={144} className="kit-hero__icon" loading="eager" />
              )}
            </div>
          </div>
          <figure className="kit-banner">
            <Pic
              src={subject.preview.src}
              alt={`Огляд комплекту «${subject.title}»: структуровані схеми, тестові маркери, міні-кейси та зручний формат PDF`}
              width={subject.preview.width}
              height={subject.preview.height}
              sizes="(min-width: 75em) 70rem, 100vw"
              loading="lazy"
            />
          </figure>
        </div>
      </section>

      <section className="section" id="shcho-znaty" aria-labelledby="know-title">
        <div className="container">
          <h2 id="know-title">Що треба знати і з чого складається програма</h2>
          <p className="prose">
            Кільце показує, яку частину програми займає кожен розділ; праворуч — головні теми, які перевіряє тест із предмета «{subject.title}».
          </p>
          <div className="kit-visual">
            <ProgramDonut subject={subject} />
            <div className="kit-visual__know">
              <h3>Що треба знати загалом</h3>
              <KnowledgeList subject={subject} />
              <p className="note">
                Назви розділів і діапазони ваг — з програми МОН:{" "}
                <a href={subject.officialSource} target="_blank" rel="noopener noreferrer">{subject.sourceLabel}</a> (сайт МОН, відкриється в новій вкладці).
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="section section--alt" id="sklad" aria-labelledby="contents-title">
        <div className="container">
          <h2 id="contents-title">{ready ? "Склад комплекту за розділами програми" : "Розділи програми"}</h2>
          <p className="prose">
            {ready
              ? oneToOne
                ? "Кожному підрозділу програми відповідає окремий файл із тим самим номером: підрозділ 1.1 → файл 1.1. Біля кожного файлу — кількість сторінок, вага підрозділу в програмі й рівні пунктів (A–D)."
                : `Комплект складається з ${stats.files} файлів-модулів: кожен охоплює кілька споріднених підрозділів програми, їхні номери вказано біля файлу. Біля кожного файлу — кількість сторінок, загальна вага підрозділів у програмі й рівні пунктів (A–D).`
              :"Комплект готується за розділами цієї програми. Смужка показує вагу розділу, мітки A–D — рівні пунктів програми, а де офіційний текст вказує вагу підрозділу, вона стоїть окремим значком."}
          </p>
          {ready ? <FileGallery subject={subject} /> : <Syllabus subject={subject} />}
        </div>
      </section>

      {sample && (
        <section className="section" aria-labelledby="sample-title">
          <div className="container">
            <h2 id="sample-title">Приклад матеріалу</h2>
            <div className="sample-teaser">
              <Pic src={sample.cover.src} alt="" width={sample.cover.width} height={sample.cover.height} sizes="10rem" loading="lazy" className="sample-teaser__img" />
              <div>
                <p className="prose">{sample.lead}</p>
                <Link className="btn btn--ghost" href={samplePath(sample)}>
                  Переглянути приклад <ArrowRight />
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      <section className="section section--alt" id="rivni" aria-labelledby="levels-title">
        <div className="container">
          <h2 id="levels-title">Рівні складності завдань</h2>
          <p className="prose">
            Кожен пункт детальної структури програми МОН має когнітивний рівень A–D. Нижче — які рівні є в цьому предметі й яку частку
            пунктів програми вони займають.
          </p>
          <LevelsOverview subject={subject} />
        </div>
      </section>

      {ready && (
        <section className="section" aria-labelledby="terms-title">
          <div className="container">
            <h2 id="terms-title">Умови користування</h2>
            <ul className="checklist">
              {(subject.edition.freeUpdate ? [...terms, updateTerm] : terms).map((term) => (
                <li key={term}>
                  <Check />
                  <span>{term}</span>
                </li>
              ))}
            </ul>
            <p className="notice notice--warn">{REFUND_NOTE}</p>
          </div>
        </section>
      )}

      <section className={ready ? "section section--alt" : "section"} aria-labelledby="other-title">
        <div className="container">
          <h2 id="other-title">Інші комплекти</h2>
          <ul className="link-list">
            {others.map((item) => (
              <li key={item.id}>
                <Link href={`/komplekty/${item.id}/`}>{item.title}</Link>
                <StatusBadge ready={item.kit.ready} />
              </li>
            ))}
          </ul>
        </div>
      </section>

      <BuyBar subject={subject} />
    </>
  );
}
