import { knowledgePoints, type Subject } from "@/data/subjects";
import { Check } from "./Icons";

/** Що треба знати загалом — тези з підсумку програми у вигляді списку з позначками. */
export default function KnowledgeList({ subject }: { subject: Subject }) {
  return (
    <ul className="knowledge">
      {knowledgePoints(subject).map((point) => (
        <li key={point}>
          <Check />
          <span>{point}</span>
        </li>
      ))}
    </ul>
  );
}