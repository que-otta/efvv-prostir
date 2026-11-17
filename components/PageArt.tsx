import { samples } from "@/data/samples";
import type { Subject } from "@/data/subjects";
import { DESIGN } from "@/site.config";
import Pic from "./Pic";

/**
 * Декор шапки внутрішньої сторінки в резервному оформленні «graphite»: віялом три справжні сторінки з прикладів,
 * що визирають знизу праворуч. Лише для широких екранів, для скрінрідерів приховано. У «classic» нічого не виводить.
 */
export default function PageArt({ ids }: { ids: Subject["id"][] }) {
  if (DESIGN !== "graphite") return null;
  const items = ids.flatMap((id) => {
    const page = samples.find((sample) => sample.subjectId === id)?.pages[1];
    return page ? [{ id, page }] : [];
  });
  return (
    <div className="page-art" aria-hidden="true">
      {items.map(({ id, page }, index) => (
        <Pic key={id} src={page.image} alt="" width={page.width} height={page.height} sizes="10rem" loading="lazy" className={`page-art__img page-art__img--${index}`} />
      ))}
    </div>
  );
}
