import Breadcrumbs from "@/components/Breadcrumbs";
import KitCard from "@/components/KitCard";
import KitCardGraphite from "@/components/KitCardGraphite";
import PageArt from "@/components/PageArt";
import ScoreNote from "@/components/ScoreNote";
import { subjects } from "@/data/subjects";
import { buildMetadata } from "@/lib/seo";
import { DESIGN } from "@/site.config";

const names = subjects.map((subject) => `«${subject.title}»`).join(", ");

export const metadata = buildMetadata({
  title: "Комплекти PDF-конспектів до ЄФВВ та ЄВВ за предметами",
  description: `Комплекти PDF-конспектів до ЄФВВ та ЄВВ: ${names}. Склад за розділами програми, кількість сторінок, ціна та приклад сторінок кожного комплекту.`,
  path: "/komplekty/",
});

export default function KitsPage() {
  return (
    <>
      <section className="page-head dark">
        <div className="container">
          <Breadcrumbs items={[{ href: "/", label: "Головна" }, { label: "Комплекти" }]} />
          <PageArt ids={["management", "psychology", "methodology"]} />
          <h1>Комплекти за предметами</h1>
          <p className="lead">
            По одному комплекту на предмет: {names}. Усередині — PDF-файли за підрозділами офіційної програми. Біля кожного комплекту
            вказано, для якої програми його підготовлено.
          </p>
        </div>
      </section>

      <section className="section dark" aria-label="Список комплектів">
        <div className="container">
          {subjects.some((subject) => subject.kit.ready) && <ScoreNote />}
          {DESIGN === "graphite" ? (
            <div className="v2">
              <div className="v2-grid">
                {subjects.map((subject) => (
                  <KitCardGraphite key={subject.id} subject={subject} />
                ))}
              </div>
            </div>
          ) : (
            <div className="grid grid--kits">
              {subjects.map((subject) => (
                <KitCard key={subject.id} subject={subject} />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
