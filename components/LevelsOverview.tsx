import { LEVELS, levelSummary, levelsMeaning, type Subject } from "@/data/subjects";
import { Check } from "./Icons";

/** Рівні A–D для предмета: які є в програмі, яку частку пунктів програми займають, приклад формулювання. */
export default function LevelsOverview({ subject }: { subject: Subject }) {
  const { counts, shares, total } = levelSummary(subject);
  return (
    <>
      <div className="level-grid">
        {LEVELS.map((level) => {
          const definition = levelsMeaning.find((item) => item.level === level)!;
          const count = counts[level];
          const present = count > 0;
          const example = subject.levels.find((item) => item.level === level)?.example;
          return (
            <article className={`level-card level-card--${level}${present ? " is-on" : " is-off"}`} key={level}>
              <header className="level-card__head">
                <span className="level-card__letter">{level}</span>
                <h3>{definition.label}</h3>
                <span className="level-card__mark">
                  {present ? <><Check /> є в програмі</> : "немає в програмі"}
                </span>
              </header>
              <p className="level-card__official">{definition.official}</p>
              <div className="level-card__stat">
                <strong>{shares[level]}%</strong>
                <span>пунктів програми · {count} із {total}</span>
              </div>
              <div className="level-card__bar" aria-hidden="true">
                <span style={{ width: `${shares[level]}%` }} />
              </div>
              {present && example ? (
                <p className="level-card__example">Приклад завдання: {example}</p>
              ) : (
                <p className="level-card__example">{present ? definition.meaning : "У детальній структурі цього предмета немає пунктів такого рівня."}</p>
              )}
            </article>
          );
        })}
      </div>
      <p className="note">
        Відсотки показують частку пунктів детальної структури програми МОН, для яких визначено цей рівень, а не точну частку завдань у тесті:
        у програмі не вказано, скільки завдань кожного рівня буде в тесті. Кожен наступний рівень включає попередні.{" "}
        <a href={subject.officialSource} target="_blank" rel="noopener noreferrer">{subject.sourceLabel}</a> (сайт МОН, відкриється в новій вкладці).
      </p>
    </>
  );
}