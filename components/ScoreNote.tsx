import { SCORE_NOTE } from "@/data/subjects";

const KEY_PHRASE = "170 балів і більше";

/** Застереження про рівень, на який розрахований зміст: помаранчевий блок із підкресленим «170 балів і більше». */
export default function ScoreNote({ compact = false }: { compact?: boolean }) {
  const [before, after] = SCORE_NOTE.split(KEY_PHRASE);
  return (
    <p className={compact ? "notice notice--warn notice--compact" : "notice notice--warn"}>
      {before}
      <mark>{KEY_PHRASE}</mark>
      {after}
    </p>
  );
}
