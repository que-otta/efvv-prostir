import Breadcrumbs from "@/components/Breadcrumbs";
import ProgramBlock from "@/components/ProgramBlock";
import { subjects } from "@/data/subjects";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Програма ЄФВВ: розділи, ваги й рівні складності за предметами",
  description: `Розділи й підрозділи офіційних програм предметних тестів ЄФВВ (${subjects.map((subject) => subject.title).join("; ")}): вага розділів, рівні завдань A–D та посилання на накази МОН.`,
  path: "/programa/",
});

export default function ProgramPage() {
  return (
    <>
      <section className="page-head dark">
        <div className="container">
          <Breadcrumbs items={[{ href: "/", label: "Головна" }, { label: "Програма" }]} />
          <h1>Програма: з яких розділів складається підготовка</h1>
        </div>
      </section>

      <section className="section" aria-label="Розділи програм за предметами">
        <div className="container">
          <ProgramBlock />
        </div>
      </section>
    </>
  );
}
