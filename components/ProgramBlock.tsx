import Link from "next/link";
import { kitIsOneToOne, subjects } from "@/data/subjects";
import { ArrowRight } from "./Icons";
import LevelsBlock from "./LevelsBlock";
import ProgramDonut from "./ProgramDonut";
import StatusBadge from "./StatusBadge";
import Syllabus from "./Syllabus";

function sectionsWord(count: number): string {
  const lastTwo = count % 100;
  const last = count % 10;
  if (lastTwo >= 11 && lastTwo <= 14) return "розділів";
  if (last === 1) return "розділ";
  if (last >= 2 && last <= 4) return "розділи";
  return "розділів";
}

export default function ProgramBlock() {
  const modular = subjects.filter((subject) => subject.kit.ready && !kitIsOneToOne(subject));
  return (
    <>
      <div className="prose">
        <p>
          Предметний тест будується за офіційною програмою. Вона поділена на розділи, а розділи — на підрозділи з номерами
          (наприклад, 1.1 або 4.3). Для кожного розділу програма вказує вагу — діапазон у відсотках від усієї програми.
        </p>
        <p>
          Комплекти повторюють цю структуру. Здебільшого один підрозділ — один PDF-файл із тим самим номером (підрозділ 1.1 →
          файл 1.1)
          {modular.length > 0 && (
            <>
              ; у {modular.map((subject) => `«${subject.title}»`).join(", ")} файли — модулі, кожен охоплює кілька споріднених
              підрозділів, а біля підрозділу видно, у якому файлі його шукати
            </>
          )}
          .
        </p>
      </div>

      <div className="program-list">
        {subjects.map((subject, index) => (
          <details className="program" key={subject.id} open={index === 0}>
            <summary>
              <span className="program__title">{subject.title}</span>
              <span className="program__meta">
                {subject.syllabus.length} {sectionsWord(subject.syllabus.length)} <StatusBadge ready={subject.kit.ready} />
              </span>
            </summary>
            <div className="program__body">
              <p className="prose">{subject.overview}</p>
              <ProgramDonut subject={subject} />
              <Syllabus subject={subject} />
              <p className="prose">
                <strong>Що треба знати загалом.</strong> {subject.summary}
              </p>
              <p className="program__links">
                <a href={subject.officialSource} target="_blank" rel="noopener noreferrer">
                  Офіційна програма: {subject.sourceLabel} (сайт МОН, відкриється в новій вкладці)
                </a>
                <Link href={`/komplekty/${subject.id}/`}>
                  Сторінка комплекту <ArrowRight />
                </Link>
              </p>
            </div>
          </details>
        ))}
      </div>
      <p className="note">
        Назви розділів і діапазони ваг відтворено за програмами МОН. Суцільна частина смужки — нижня межа діапазону, штрихована —
        до верхньої межі. Біля підрозділів показано рівні пунктів програми (A–D) і, де вказано, вагу самого підрозділу; повна
        деталізація тем — в оригінальних документах за посиланнями.
      </p>

      <h3 className="subheading">Рівні складності завдань</h3>
      <p className="prose">
        Кожен пункт детальної структури програми МОН позначено одним із чотирьох когнітивних рівнів — від простого знання до
        аналізу й оцінювання; кожен наступний рівень включає попередні. Скільки пунктів якого рівня у кожному предметі — на
        сторінках комплектів.
      </p>
      <LevelsBlock />
    </>
  );
}