import type { CSSProperties } from "react";
import { BUY_STEPS } from "@/components/BuySteps";
import { formatPrice, kitMessage, kitStats, REFUND_NOTE, subjects } from "@/data/subjects";
import { sizeText } from "@/lib/sizeText";
import { telegramLink } from "@/lib/urls";
import CopyMessage from "./CopyMessage";
import { Telegram } from "./Icons";
import SubjectIcon from "./SubjectIcon";

/**
 * «Як купити» в резервному оформленні «graphite»: три кроки, рядок на комплект і застереження про повернення коштів.
 * Рядок має сталу висоту: запасний шлях (копіювання тексту) — окрема кнопка поруч із «Купити», без блоку, що розгортається.
 */
export default function BuyListGraphite({ withHeadings = false }: { withHeadings?: boolean }) {
  const anyReady = subjects.some((subject) => subject.kit.ready);
  return (
    <div className="v2">
      {anyReady && withHeadings && <h2 className="v2-sub">Як це працює</h2>}
      {anyReady && (
        <ol className="v2-steps">
          {BUY_STEPS.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
      )}
      {withHeadings && <h2 className="v2-sub v2-sub--list" id="buy-list-title">Обери комплект</h2>}
      <ul className="v2-buy">
        {subjects.map((subject) => {
          const message = kitMessage(subject);
          const stats = kitStats(subject);
          return (
            <li key={subject.id} style={{ "--c": subject.neon } as CSSProperties}>
              <SubjectIcon id={subject.id} className="v2-avatar v2-avatar--row" />
              <div className="v2-buy__info">
                <strong>{subject.title}</strong>
                <span className="v2-meta">
                  {subject.kit.ready ? [sizeText(stats.files, stats.pages), subject.kit.price ? formatPrice(subject.kit.price) : null].filter(Boolean).join(" · ") : "Комплект готується"}
                </span>
              </div>
              <div className="v2-buy__act">
                <CopyMessage text={message} />
                <a className="v2-btn v2-btn--p v2-btn--s" href={telegramLink(message)} target="_blank" rel="noopener noreferrer">
                  <Telegram /> {subject.kit.ready ? "Купити" : "Повідомити"}
                </a>
              </div>
            </li>
          );
        })}
      </ul>
      <p className="v2-hint">
        Кнопка «Купити» відкриває Telegram із готовим повідомленням. Якщо воно не з’явилося, скопіюй текст кнопкою «Скопіювати текст» і встав у чат — або просто напиши назву комплекту.
      </p>
      {anyReady && <p className="notice notice--warn">{REFUND_NOTE}</p>}
    </div>
  );
}
