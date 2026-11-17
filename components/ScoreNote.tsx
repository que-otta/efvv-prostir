import { SCORE_NOTE } from "@/data/subjects";

/** Ключові фрази застереження: «170+» і «не гарантуємо» підсвічуються в помаранчевому блоці. */
const KEY_PHRASES = /(170\+|не гарантуємо)/;

/** Застереження про рівень, на який розрахований зміст: помаранчевий блок із підсвіченими «170+» і «не гарантуємо». */
export default function ScoreNote({ compact = false }: { compact?: boolean }) {
  const parts = SCORE_NOTE.split(KEY_PHRASES);
  return (
    <p className={compact ? "notice notice--warn notice--compact" : "notice notice--warn"}>
      {parts.map((part, index) => (index % 2 === 1 ? <mark key={index}>{part}</mark> : part))}
    </p>
  );
}
