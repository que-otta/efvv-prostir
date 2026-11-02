import type { Subject } from "@/data/subjects";

/** Для якої програми підготовлено матеріали й що буде при її зміні — виділений блок. */
export default function EditionNote({ subject }: { subject: Subject }) {
  const { label, note, update } = subject.edition;
  return (
    <div className="edition">
      <p className="pill">{label}</p>
      <p className="edition__note">{note}</p>
      {update && <p className="edition__update">{update}</p>}
    </div>
  );
}
