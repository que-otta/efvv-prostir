import { levelsMeaning } from "@/data/subjects";

/** Загальні рівні A–D: формулювання програм МОН і коротке пояснення. */
export default function LevelsBlock() {
  return (
    <dl className="levels">
      {levelsMeaning.map((item) => (
        <div className="levels__item" key={item.level}>
          <dt>
            <span className="levels__letter">{item.level}</span> {item.label}
          </dt>
          <dd>
            <span className="levels__official">{item.official}</span>
            {item.meaning}
          </dd>
        </div>
      ))}
    </dl>
  );
}