import { telegramLink } from "@/lib/urls";
import { formatPrice, kitMessage, type Subject } from "@/data/subjects";
import BuySteps from "./BuySteps";
import CopyMessage from "./CopyMessage";
import { Telegram } from "./Icons";

export function buyLabel(subject: Subject): string {
  const { ready, price } = subject.kit;
  if (!ready) return "Повідомити, коли буде готово";
  return price ? `Купити в Telegram · ${formatPrice(price)}` : "Купити в Telegram";
}

/** `only="button"` — лише кнопка; `only="how"` — кроки, застереження й текст повідомлення без кнопки; без `only` — усе разом. */
export default function BuyBlock({ subject, only }: { subject: Subject; only?: "button" | "how" }) {
  const { ready } = subject.kit;
  const message = kitMessage(subject);

  return (
    <div className="buy">
      {only !== "how" && (
        <a className="btn btn--primary" href={telegramLink(message)} target="_blank" rel="noopener noreferrer">
          <Telegram />
          {buyLabel(subject)}
        </a>
      )}
      {only !== "button" && (
        <>
          {ready ? (
            <BuySteps />
          ) : (
            <p className="buy__note">
              Напиши в Telegram — повідомимо, щойно комплект буде готовий. Платити зараз нічого не треба.
            </p>
          )}
          <details className="buy__message">
            <summary>Не відкривається Telegram?</summary>
            <p>
              Текст повідомлення: <q>{message}</q> <CopyMessage text={message} />
            </p>
          </details>
        </>
      )}
    </div>
  );
}
