import { REFUND_NOTE } from "@/data/subjects";

/** Кроки покупки й застереження про повернення коштів. */
export default function BuySteps() {
  return (
    <>
      <ol className="buy__steps">
        <li>Напиши в Telegram — текст повідомлення вже підготовлено.</li>
        <li>Оплати комплект переказом.</li>
        <li>Отримай PDF-файли в особисті повідомлення.</li>
      </ol>
      <p className="notice notice--warn buy__refund">{REFUND_NOTE}</p>
    </>
  );
}
