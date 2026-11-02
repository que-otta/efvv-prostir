import { faq } from "@/data/faq";

export default function Faq() {
  return (
    <div className="faq">
      {faq.map((item) => (
        <details className="faq__item" key={item.question}>
          <summary>{item.question}</summary>
          <p>{item.answer}</p>
        </details>
      ))}
    </div>
  );
}