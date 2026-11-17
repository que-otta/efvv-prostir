import { REFUND_NOTE } from "@/data/subjects";

/** Кроки покупки (використовуються тут і на головній сторінці). */
export const BUY_STEPS = [
  "Напиши в Telegram — текст повідомлення вже підготовлено.",
  "Оплати комплект переказом на банківську картку (Mono або Приват) — номер картки надішлемо в Telegram.",
  "Отримай PDF-файли в особисті повідомлення.",
];

/** Кроки покупки й застереження про повернення коштів. */
export default function BuySteps() {
  return (
    <>
      <ol className="buy__steps">
        {BUY_STEPS.map((step) => (
          <li key={step}>{step}</li>
        ))}
      </ol>
      <p className="notice notice--warn buy__refund">{REFUND_NOTE}</p>
    </>
  );
}
