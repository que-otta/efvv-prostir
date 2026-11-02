import Breadcrumbs from "@/components/Breadcrumbs";
import KitCard from "@/components/KitCard";
import ScoreNote from "@/components/ScoreNote";
import { subjects } from "@/data/subjects";
import { buildMetadata } from "@/lib/seo";

const names = subjects.map((subject) => `«${subject.title}»`).join(", ");

export const metadata = buildMetadata({
  title: "Комплекти PDF-конспектів до ЄФВВ за предметами",
  description: `Комплекти PDF-конспектів до ЄФВВ: ${names}. Склад за розділами програми, кількість сторінок, ціна та приклад сторінок кожного комплекту.`,
  path: "/komplekty/",
});

export default function KitsPage() {
  return (
    <>
      <section className="page-head dark">
        <div className="container">
          <Breadcrumbs items={[{ href: "/", label: "Головна" }, { label: "Комплекти" }]} />
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
          <div className="grid grid--kits">
            {subjects.map((subject) => (
              <KitCard key={subject.id} subject={subject} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
