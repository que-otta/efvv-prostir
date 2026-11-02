import { LEVELS, type LevelCounts } from "@/data/subjects";

/** Мітки рівнів біля підрозділу: «B ×6 · C ×1». */
export default function LevelPips({ counts }: { counts?: LevelCounts }) {
  if (!counts) return null;
  const present = LEVELS.filter((level) => (counts[level] ?? 0) > 0);
  if (!present.length) return null;
  const description = present.map((level) => `рівень ${level}: ${counts[level]}`).join(", ");
  return (
    <span className="pips" title={`Пункти програми за рівнями — ${description}`}>
      {present.map((level) => (
        <span className={`pip pip--${level}`} key={level}>
          {level}<small>×{counts[level]}</small>
        </span>
      ))}
    </span>
  );
}