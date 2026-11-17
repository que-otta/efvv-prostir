import Breadcrumbs from "@/components/Breadcrumbs";
import PageArt from "@/components/PageArt";
import ProgramBlock from "@/components/ProgramBlock";
import { subjects } from "@/data/subjects";
import { buildMetadata } from "@/lib/seo";
import { DESIGN } from "@/site.config";

export const metadata = buildMetadata({
  title: "Програма ЄФВВ та ЄВВ: розділи, ваги й рівні складності за предметами",
  description: `Розділи й підрозділи офіційних програм предметних тестів ЄФВВ та єдиного вступного випробування ЄВВ (${subjects.map((subject) => subject.title).join("; ")}): вага розділів, рівні завдань A–D та посилання на накази МОН.`,
  path: "/programa/",
});

export default function ProgramPage() {
  return (
    <>
      <section className="page-head dark">
        <div className="container">
          <Breadcrumbs items={[{ href: "/", label: "Головна" }, { label: "Програма" }]} />
          <PageArt ids={["pedagogy", "methodology", "psychology"]} />
          <h1>Програма: з яких розділів складається підготовка</h1>
          {DESIGN === "graphite" && (
            <p className="lead">Розділи й підрозділи офіційних програм, вага кожного розділу та рівні завдань A–D — для кожного предмета.</p>
          )}
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
