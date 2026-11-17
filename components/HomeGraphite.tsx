import Link from "next/link";
import type { CSSProperties } from "react";
import BuyListGraphite from "@/components/BuyListGraphite";
import { ArrowDown, ArrowRight, Telegram } from "@/components/Icons";
import KitCardGraphite from "@/components/KitCardGraphite";
import Pic from "@/components/Pic";
import ScoreNote from "@/components/ScoreNote";
import { faq } from "@/data/faq";
import { samplePath, samples } from "@/data/samples";
import { formatPrice, kitStats, levelsMeaning, subjects } from "@/data/subjects";
import { plural } from "@/lib/plural";
import { sizeText } from "@/lib/sizeText";
import { TELEGRAM_URL } from "@/site.config";

/** Три переваги: кожна з фрагментом справжньої сторінки з прикладів (вирізки з тих самих сторінок, що вже є на сайті). */
const PILLARS = [
  {
    color: "#6c9eff",
    img: { src: "/img/pillar-schemes.webp", width: 984, height: 615, alt: "Фрагмент сторінки комплекту «Управління та адміністрування»: схема організації як відкритої системи" },
    title: "Схеми замість стіни тексту",
    text: "Тема розкладена на схеми, таблиці й опорні блоки.",
  },
  {
    color: "#f5b84a",
    img: { src: "/img/pillar-marks.webp", width: 986, height: 618, alt: "Фрагмент сторінки комплекту «Психологія та соціологія»: головне з кольоровими виділеннями й таблиця" },
    title: "Ключове виділено",
    text: "Терміни й акценти виділено, щоб важливе було видно одразу.",
  },
  {
    color: "#5fc9a6",
    img: { src: "/img/pillar-program.webp", width: 1050, height: 659, alt: "Фрагмент сторінки комплекту «Педагогіка та психологія»: підрозділи 1.1.1–1.1.6 і що треба вміти" },
    title: "Усе за програмою",
    text: "Файл = підрозділ офіційної програми, видно рівні A–D.",
  },
] as const;

/** Головна сторінка в резервному оформленні «graphite»: нейтральний темний графіт, синій акцент, кольори предметів, справжні сторінки конспектів. */
export default function HomeGraphite() {
  const featured = subjects.find((subject) => subject.kit.ready) ?? subjects[0];
  const featuredStats = kitStats(featured);
  const featuredSample = samples.find((sample) => sample.subjectId === featured.id);
  const readyKits = subjects.filter((subject) => subject.kit.ready);
  const prices = [...new Set(readyKits.map((subject) => subject.kit.price).filter((price): price is number => typeof price === "number"))];
  const soonKits = subjects.filter((subject) => !subject.kit.ready);
  const names = (list: typeof subjects) => list.map((subject) => `«${subject.title}»`).join(", ");
  const kitsIntro = soonKits.length === 0
    ? "По одному комплекту на предмет. Усередині — PDF-файли за підрозділами офіційної програми. Біля кожного комплекту вказано, для якої програми його підготовлено."
    : `Зараз доступно: ${readyKits.length ? names(readyKits) : "поки нічого"}. Готуються: ${names(soonKits)} — можна залишити заявку, і ми повідомимо, коли комплект буде готовий.`;

  return (
    <div className="v2">
      <section className="v2-hero">
        <div className="v2-wrap v2-hero__in">
          <div>
            <h1>
              Візуальні конспекти до ЄФВВ та ЄВВ: <span className="v2-hl">схеми й таблиці</span> замість суцільного тексту
            </h1>
            <p className="v2-lead">
              Кожен підрозділ офіційної програми зібрано у візуальний конспект: схеми, таблиці й виділені акценти, щоб матеріал було
              легше запам’ятати й повторити. Обираєш предмет, дивишся приклад сторінок і купуєш комплект у Telegram.
            </p>
            <div className="v2-acts">
              <Link className="v2-btn v2-btn--p" href="/#komplekty">
                Обрати комплект <ArrowDown />
              </Link>
              <Link className="v2-btn" href="/pryklady/">
                Подивитися приклад <ArrowRight />
              </Link>
            </div>
            <p className="v2-facts">
              {subjects.length} {plural(subjects.length, "комплект", "комплекти", "комплектів")}
              {prices.length > 0 && <> · <b>{prices.length === 1 ? formatPrice(prices[0]) : `від ${formatPrice(Math.min(...prices))}`}</b> за комплект</>} · PDF-файли в Telegram
            </p>
          </div>
          <figure className="v2-shot">
            <Link href={featuredSample ? samplePath(featuredSample) : `/komplekty/${featured.id}/`} aria-label={featuredSample ? `Відкрити приклад сторінок комплекту «${featured.title}»` : `Відкрити комплект «${featured.title}»`}>
              <Pic
                src={featured.preview.src}
                alt={`Превʼю комплекту «${featured.title}»: структуровані схеми, тестові маркери, міні-кейси та зручний формат PDF`}
                width={featured.preview.width}
                height={featured.preview.height}
                sizes="(min-width: 64em) 34rem, (min-width: 48em) 24rem, 90vw"
                loading="eager"
                fetchPriority="high"
              />
            </Link>
            <figcaption>
              Комплект «{featured.title}» — {sizeText(featuredStats.files, featuredStats.pages)}
            </figcaption>
          </figure>
        </div>
      </section>

      <section className="v2-sec v2-alt" id="komplekty" aria-labelledby="kits-title">
        <div className="v2-wrap">
          <div className="v2-shead">
            <h2 id="kits-title">Комплекти за предметами</h2>
            <p>{kitsIntro}</p>
          </div>
          {readyKits.length > 0 && <ScoreNote />}
          <div className="v2-grid">
            {subjects.map((subject) => (
              <KitCardGraphite key={subject.id} subject={subject} />
            ))}
          </div>
        </div>
      </section>

      <section className="v2-sec" aria-labelledby="diff-title">
        <div className="v2-wrap">
          <div className="v2-shead">
            <h2 id="diff-title">Візуальний конспект, а не стіна тексту</h2>
            <p>
              Візуальний конспект для підготовки: тема розкладена на схеми, таблиці й опорні блоки, а не викладена суцільним текстом. Один
              файл — підрозділ або кілька споріднених підрозділів офіційної програми.
            </p>
          </div>
          <ul className="v2-pillars">
            {PILLARS.map((pillar) => (
              <li key={pillar.title} style={{ "--c": pillar.color } as CSSProperties}>
                <span className="v2-pillar__img">
                  <Pic src={pillar.img.src} alt={pillar.img.alt} width={pillar.img.width} height={pillar.img.height} sizes="(min-width: 64em) 24rem, 90vw" loading="lazy" />
                </span>
                <span className="v2-pillar__body">
                  <b>{pillar.title}</b>
                  <span>{pillar.text}</span>
                </span>
              </li>
            ))}
          </ul>
          <div className="v2-after">
            <ul className="v2-lv" aria-label="Рівні завдань у програмі">
              {levelsMeaning.map((item) => (
                <li key={item.level}>
                  <em className={`v2-lv__${item.level}`}>{item.level}</em>
                  {item.label}
                </li>
              ))}
            </ul>
            <Link className="v2-btn" href="/pryklady/">
              Погортати приклади <ArrowRight />
            </Link>
          </div>
        </div>
      </section>

      <section className="v2-sec v2-alt" id="yak-kupyty" aria-labelledby="buy-title">
        <div className="v2-wrap">
          <div className="v2-shead">
            <h2 id="buy-title">Як купити</h2>
            <p>Без акаунтів і платіжних систем: усе відбувається в Telegram. Обери комплект і напиши — текст повідомлення вже підготовлено.</p>
          </div>
          <BuyListGraphite />
        </div>
      </section>

      <section className="v2-sec" id="pytannia" aria-labelledby="faq-title">
        <div className="v2-wrap v2-faq">
          <div>
            <h2 id="faq-title">Часті запитання</h2>
            <p className="v2-faq__ask">Не знайшов відповіді на своє питання? Напиши в Telegram.</p>
            <a className="v2-btn v2-btn--s" href={TELEGRAM_URL} target="_blank" rel="noopener noreferrer">
              <Telegram /> Написати в Telegram
            </a>
          </div>
          <div>
            {faq.map((item) => (
              <details key={item.question}>
                <summary>{item.question}</summary>
                <p>{item.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
