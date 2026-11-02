import { fileCovers, fileLevelCounts, fileWeight, filesForGroup, kitStats, type Subject } from "@/data/subjects";
import { plural } from "@/lib/plural";
import LevelPips from "./LevelPips";
import WeightBar from "./WeightBar";

/** Склад готового комплекту: файли за розділами програми (назва, сторінки, вага, рівні) — без вмісту самих файлів. */
export default function FileGallery({ subject }: { subject: Subject }) {
  const totalPages = kitStats(subject).pages;
  return (
    <div className="gallery">
      {subject.syllabus.map((group) => {
        const files = filesForGroup(subject, group);
        const pagesKnown = files.length > 0 && files.every((file) => typeof file.pages === "number");
        const pages = files.reduce((sum, file) => sum + (file.pages ?? 0), 0);
        const summary = [
          `${files.length} ${plural(files.length, "файл", "файли", "файлів")}`,
          pagesKnown ? `${pages} стор.` : null,
        ].filter(Boolean).join(" · ");
        return (
          <section className="gallery__group" key={group.title}>
            <header className="gallery__head">
              <h3 className="syllabus__title">{group.title}</h3>
              <p className="gallery__pages">
                {summary}
                {pagesKnown && totalPages ? ` — ${Math.round((pages / totalPages) * 100)}% комплекту` : ""}
              </p>
            </header>
            <WeightBar weight={group.weight} label="Вага розділу в програмі" />
            <ul className="file-grid">
              {files.map((file) => {
                const covers = fileCovers(file);
                const weight = fileWeight(subject, file);
                const meta = [
                  typeof file.pages === "number" ? `${file.pages} стор.` : null,
                  weight ? `${covers.length > 1 ? "загальна вага" : "вага"} ${weight}` : null,
                ].filter(Boolean).join(" · ");
                return (
                  <li className="file-card" key={file.code}>
                    <div className="file-card__ph" aria-hidden="true">
                      <span>{file.code}</span>
                    </div>
                    <div className="file-card__body">
                      <span className="chip chip--code">Файл {file.code}</span>
                      <h4 className="file-card__title">{file.title}</h4>
                      {covers.length > 1 && (
                        <p className="file-card__covers">
                          {plural(covers.length, "Підрозділ", "Підрозділи", "Підрозділів")} {covers.join(" · ")}
                        </p>
                      )}
                      {meta && <p className="file-card__meta">{meta}</p>}
                      <LevelPips counts={fileLevelCounts(subject, file)} />
                    </div>
                  </li>
                );
              })}
            </ul>
          </section>
        );
      })}
    </div>
  );
}
