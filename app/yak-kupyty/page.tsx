import Breadcrumbs from "@/components/Breadcrumbs";
import BuyList from "@/components/BuyList";
import EditionNote from "@/components/EditionNote";
import { Check } from "@/components/Icons";
import ScoreNote from "@/components/ScoreNote";
import { REFUND_NOTE, subjects } from "@/data/subjects";
import { terms } from "@/data/terms";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Як купити PDF-конспекти до ЄФВВ через Telegram",
  description: "Як купити комплект PDF-конспектів до ЄФВВ: напиши в Telegram, оплати комплект переказом і отримай файли в особисті повідомлення. Без акаунтів і платіжних систем на сайті.",
  path: "/yak-kupyty/",
});

export default function HowToBuyPage() {
  const ready = subjects.filter((subject) => subject.kit.ready);
  return (
    <>
      <section className="page-head dark">
        <div className="container">
          <Breadcrumbs items={[{ href: "/", label: "Головна" }, { label: "Як купити" }]} />
          <h1>Як купити комплект</h1>
          <p className="lead">
            Без акаунтів і платіжних систем: усе відбувається в Telegram. Обери комплект і напиши — текст повідомлення вже підготовлено.
          </p>
        </div>
      </section>

      <section className="section dark" aria-labelledby="buy-list-title">
        <div className="container">
          <h2 id="buy-list-title">Комплекти</h2>
          <BuyList />
        </div>
      </section>

      <section className="section" aria-labelledby="before-title">
        <div className="container">
          <h2 id="before-title">Що варто знати перед покупкою</h2>
          <p className="prose">Для якої програми підготовлено кожен комплект і на який результат розрахований його зміст.</p>
          <div className="grid grid--3">
            {ready.map((subject) => (
              <div className="panel" key={subject.id}>
                <h3>{subject.title}</h3>
                <EditionNote subject={subject} />
              </div>
            ))}
          </div>
          <ScoreNote />
        </div>
      </section>

      <section className="section section--alt" aria-labelledby="terms-title">
        <div className="container">
          <h2 id="terms-title">Умови придбання й користування</h2>
          <ul className="checklist">
            {terms.map((term) => (
              <li key={term}>
                <Check />
                <span>{term}</span>
              </li>
            ))}
          </ul>
          <p className="notice notice--warn">{REFUND_NOTE}</p>
        </div>
      </section>
    </>
  );
}
