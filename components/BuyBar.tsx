import { telegramLink } from "@/lib/urls";
import { formatPrice, kitMessage, type Subject } from "@/data/subjects";
import { Telegram } from "./Icons";

/** Закріплена панель покупки на телефоні (на ширших екранах приховується). */
export default function BuyBar({ subject }: { subject: Subject }) {
  if (!subject.kit.ready) return null;
  const { price, files } = subject.kit;
  return (
    <>
      <div className="buy-bar-spacer" aria-hidden="true" />
      <div className="buy-bar">
        <div className="buy-bar__text">
          <strong>{subject.title}</strong>
          <span>{files.length} PDF{price ? ` · ${formatPrice(price)}` : ""}</span>
        </div>
        <a className="btn btn--primary" href={telegramLink(kitMessage(subject))} target="_blank" rel="noopener noreferrer">
          <Telegram /> Купити
        </a>
      </div>
    </>
  );
}