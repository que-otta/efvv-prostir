import Link from "next/link";
import type { CSSProperties } from "react";
import { subjects } from "@/data/subjects";
import Pic from "./Pic";

/** Три предмети з неоновими іконками — швидкий вхід до сторінок комплектів. */
export default function SubjectChips() {
  return (
    <ul className="subject-chips" aria-label="Предмети">
      {subjects.map((subject) => (
        <li key={subject.id}>
          <Link href={`/komplekty/${subject.id}/`} style={{ "--subject-neon": subject.neon } as CSSProperties}>
            <Pic src={subject.icon} alt="" width={144} height={144} loading="eager" />
            <span>{subject.title}</span>
          </Link>
        </li>
      ))}
    </ul>
  );
}