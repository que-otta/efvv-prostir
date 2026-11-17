import { subjects, type Subject } from "@/data/subjects";
import Pic from "./Pic";

/** Круглий значок предмета — власна ілюстрація-медальйон (`subject.icon`). Розмір і рамку задає клас (`v2-avatar` у graphite.css). */
export default function SubjectIcon({ id, className }: { id: Subject["id"]; className?: string }) {
  const subject = subjects.find((item) => item.id === id);
  if (!subject) return null;
  return (
    <span className={className} aria-hidden="true">
      <Pic src={subject.icon} alt="" width={144} height={144} loading="lazy" />
    </span>
  );
}
