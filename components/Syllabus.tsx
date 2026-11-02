import type { CSSProperties } from "react";
import { fileForTopic, topicCode, type Subject } from "@/data/subjects";
import LevelPips from "./LevelPips";
import WeightBar from "./WeightBar";

/** Розділи програми й підрозділи: вага розділу смужкою; у рядку підрозділу — колонки «вага · рівні · файл комплекту». */
export default function Syllabus({ subject }: { subject: Subject }) {
  const hasWeight = Boolean(subject.topicWeights);
  const hasFile = subject.kit.files.length > 0;
  const columns = ["minmax(0, 1fr)", hasWeight ? "5.5rem" : null, "7rem", hasFile ? "9.5rem" : null].filter(Boolean).join(" ");

  return (
    <div className="syllabus" style={{ "--syl-cols": columns } as CSSProperties}>
      {subject.syllabus.map((group) => (
        <section className="syllabus__group" key={group.title}>
          <h3 className="syllabus__title">{group.title}</h3>
          <WeightBar weight={group.weight} />
          <div className="syllabus__legend" aria-hidden="true">
            <span>Підрозділ</span>
            {hasWeight && <span className="is-right">Вага</span>}
            <span>Рівні</span>
            {hasFile && <span>Файл</span>}
          </div>
          <ul className="syllabus__list">
            {group.topics.map((topic) => {
              const code = topicCode(topic);
              const file = fileForTopic(subject, topic);
              const weight = subject.topicWeights?.[code];
              return (
                <li className="syllabus__row" key={topic}>
                  <span className="syllabus__name">{topic}</span>
                  {hasWeight && <span className="syllabus__weight" title="Вага підрозділу в програмі">{weight ?? ""}</span>}
                  <span className="syllabus__levels"><LevelPips counts={subject.levelCounts[code]} /></span>
                  {hasFile && <span className="syllabus__file">{file ? `Файл ${file.code}${typeof file.pages === "number" ? ` · ${file.pages} стор.` : ""}` : ""}</span>}
                </li>
              );
            })}
          </ul>
        </section>
      ))}
    </div>
  );
}