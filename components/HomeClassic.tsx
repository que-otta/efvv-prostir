import Link from "next/link";
import BuyList from "@/components/BuyList";
import Faq from "@/components/Faq";
import { ArrowDown, ArrowRight } from "@/components/Icons";
import KitCard from "@/components/KitCard";
import Pic from "@/components/Pic";
import ScoreNote from "@/components/ScoreNote";
import SubjectChips from "@/components/SubjectChips";
import { samplePath, samples } from "@/data/samples";
import { formatPrice, kitStats, subjects } from "@/data/subjects";
import { plural } from "@/lib/plural";

/** Головна сторінка в поточному («classic») оформленні: темно-синє з неоновим світінням. */
export default function HomeClassic() {
  const featured = subjects.find((subject) => subject.kit.ready) ?? subjects[0];
  const featuredStats = kitStats(featured);
  const featuredSample = samples.find((sample) => sample.subjectId === featured.id);
  const readyKits = subjects.filter((subject) => subject.kit.ready);
  const prices = [...new Set(readyKits.map((subject) => subject.kit.price).filter((price): price is number => typeof price === "number"))];
  const priceText = prices.length === 1 ? `${formatPrice(prices[0])} за комплект` : prices.length > 1 ? `від ${formatPrice(Math.min(...prices))}` : null;
  const soonKits = subjects.filter((subject) => !subject.kit.ready);
  const names = (list: typeof subjects) => list.map((subject) => `«${subject.title}»`).join(", ");
  const kitsIntro = soonKits.length === 0
    ? "По одному комплекту на предмет. Усередині — PDF-файли за підрозділами офіційної програми. Біля кожного комплекту вказано, для якої програми його підготовлено."
    : `Зараз доступно: ${readyKits.length ? names(readyKits) : "поки нічого"}. Готуються: ${names(soonKits)} — можна залишити заявку, і ми повідомимо, коли комплект буде готовий.`;

  return (
    <>
      <section className="hero dark">
        <div className="container hero__inner">
          <div className="hero__copy">
            <p className="eyebrow">Візуальні конспекти до ЄФВВ та ЄВВ</p>
            <h1>
              Візуальні конспекти до ЄФВВ та ЄВВ: <span className="neon-text">схеми й таблиці</span> замість суцільного тексту
            </h1>
            <p className="lead">
              Кожен підрозділ офіційної програми зібрано у візуальний конспект: схеми, таблиці й виділені акценти, щоб матеріал було
              легше запам’ятати й повторити. Обираєш предмет, дивишся приклад сторінок і купуєш комплект у Telegram.
            </p>
            <ul className="hero__facts" aria-label="Коротко про комплекти">
              <li>{subjects.length} {plural(subjects.length, "комплект", "комплекти", "комплектів")}</li>
              <li>PDF-файли в Telegram</li>
              {priceText && <li className="hero__price">{priceText}</li>}
            </ul>
            <div className="actions">
              <Link className="btn btn--primary" href="/#komplekty">
                Обрати комплект <ArrowDown />
              </Link>
              <Link className="btn btn--ghost" href="/pryklady/">
                Подивитися приклад <ArrowRight />
              </Link>
            </div>
            <SubjectChips />
          </div>
          <figure className="hero__figure">
            <Link href={featuredSample ? samplePath(featuredSample) : `/komplekty/${featured.id}/`} aria-label={featuredSample ? `Відкрити приклад сторінок комплекту «${featured.title}»` : `Відкрити комплект «${featured.title}»`}>
              <Pic
                src={featured.preview.src}
                alt={`Превʼю комплекту «${featured.title}»: структуровані схеми, тестові маркери, міні-кейси та зручний формат PDF`}
                width={featured.preview.width}
                height={featured.preview.height}
                sizes="(min-width: 64em) 30rem, (min-width: 48em) 22rem, 90vw"
                loading="eager"
                fetchPriority="high"
              />
            </Link>
            <figcaption>
              Комплект «{featured.title}»: {featuredStats.files} PDF{featuredStats.pages !== null ? `, ${featuredStats.pages} ${plural(featuredStats.pages, "сторінка", "сторінки", "сторінок")}` : ""}
            </figcaption>
          </figure>
        </div>
      </section>

      <section className="section dark" id="komplekty" aria-labelledby="kits-title">
        <div className="container">
          <h2 id="kits-title">Комплекти за предметами</h2>
          <p className="prose">{kitsIntro}</p>
          {readyKits.length > 0 && <ScoreNote />}
          <div className="grid grid--kits">
            {subjects.map((subject) => (
              <KitCard key={subject.id} subject={subject} />
            ))}
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="what-title">
        <div className="container">
          <h2 id="what-title">Що це і для кого</h2>
          <div className="grid grid--3">
            <div className="panel">
              <h3>Що це</h3>
              <p>
                Візуальний конспект для підготовки: тема розкладена на схеми, таблиці й опорні блоки, а не викладена суцільним текстом.
                Один файл — підрозділ або кілька споріднених підрозділів офіційної програми.
              </p>
            </div>
            <div className="panel">
              <h3>Для кого</h3>
              <p>Для тих, хто складає ЄФВВ або ЄВВ (вступ до аспірантури) і хоче пройти програму предмета послідовно, а не збирати конспекти з різних джерел.</p>
            </div>
            <div className="panel">
              <h3>Що отримуєш</h3>
              <p>Набір PDF-файлів у Telegram. Файли залишаються в тебе назавжди, користуватися ними можна для власної підготовки.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section section--alt" id="yak-vybraty" aria-labelledby="choose-title">
        <div className="container">
          <h2 id="choose-title">Як вибрати комплект</h2>
          <ol className="steps">
            <li>
              <strong>Визнач предмет.</strong> Який предметний тест потрібен, залежить від програми вступу — це можна уточнити в
              правилах прийому закладу, куди ти вступаєш.
            </li>
            <li>
              <strong>Подивись програму.</strong> На сторінці <Link href="/programa/">«Програма»</Link> розписано розділи кожного предмета та їхню вагу.
            </li>
            <li>
              <strong>Подивись приклад.</strong> На сторінці <Link href="/pryklady/">«Приклади»</Link> можна погортати справжні
              сторінки з файлів.
            </li>
            <li>
              <strong>Обери комплект</strong> і напиши в Telegram.
            </li>
          </ol>
        </div>
      </section>

      <section className="section dark" id="yak-kupyty" aria-labelledby="buy-title">
        <div className="container">
          <h2 id="buy-title">Як купити</h2>
          <p className="prose">
            Без акаунтів і платіжних систем: усе відбувається в Telegram. Обери комплект і напиши — текст повідомлення вже
            підготовлено.
          </p>
          <BuyList />
        </div>
      </section>

      <section className="section" id="programa" aria-labelledby="program-title">
        <div className="container">
          <h2 id="program-title">Програма: з яких розділів складається підготовка</h2>
          <p className="prose">
            Предметний тест будується за офіційною програмою: розділи, підрозділи з номерами і вага кожного розділу. Повні розклади
            розділів, ваги підрозділів і рівні завдань для кожного предмета зібрано на сторінці <Link href="/programa/">«Програма»</Link>.
          </p>
          <ul className="link-list">
            {subjects.map((subject) => (
              <li key={subject.id}>
                <Link href={`/komplekty/${subject.id}/#shcho-znaty`}>{subject.title}</Link>
                <span>
                  {subject.syllabus.length} {plural(subject.syllabus.length, "розділ", "розділи", "розділів")}
                </span>
              </li>
            ))}
          </ul>
          <p>
            <Link className="btn btn--ghost" href="/programa/">
              Уся програма <ArrowRight />
            </Link>
          </p>
        </div>
      </section>

      <section className="section section--alt" id="pytannia" aria-labelledby="faq-title">
        <div className="container">
          <h2 id="faq-title">Часті запитання</h2>
          <Faq />
        </div>
      </section>
    </>
  );
}
