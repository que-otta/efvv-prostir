import { plural } from "@/lib/plural";
import { telegramLink } from "@/lib/urls";
import { formatPrice, kitMessage, kitStats, subjects } from "@/data/subjects";
import { buyLabel } from "./BuyBlock";
import BuySteps from "./BuySteps";
import CopyMessage from "./CopyMessage";
import { Telegram } from "./Icons";

/** «Як купити» на головній: по кнопці на кожен комплект і спільні кроки. */
export default function BuyList() {
  const anyReady = subjects.some((subject) => subject.kit.ready);
  return (
    <>
      <ul className="buy-list">
        {subjects.map((subject) => {
          const message = kitMessage(subject);
          const stats = kitStats(subject);
          const facts = subject.kit.ready
            ? [`${stats.files} PDF`, stats.pages !== null ? `${stats.pages} ${plural(stats.pages, "сторінка", "сторінки", "сторінок")}` : null, subject.kit.price ? formatPrice(subject.kit.price) : null].filter(Boolean).join(" · ")
            : "Комплект готується";
          return (
            <li className="buy-row" key={subject.id}>
              <div className="buy-row__info">
                <strong>{subject.title}</strong>
                <span>{facts}</span>
                <span className="buy-row__message">
                  Текст повідомлення: <q>{message}</q> <CopyMessage text={message} />
                </span>
              </div>
              <a className="btn btn--primary" href={telegramLink(message)} target="_blank" rel="noopener noreferrer">
                <Telegram />
                {buyLabel(subject)}
              </a>
            </li>
          );
        })}
      </ul>
      {anyReady && <BuySteps />}
    </>
  );
}