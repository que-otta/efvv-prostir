import type { Subject } from "@/data/subjects";
import { normalizedShares } from "@/lib/weights";
import Pic from "./Pic";

export const PALETTE = ["#4da3ff", "#b78bff", "#2ee6c7", "#ffc43d", "#ff7aa8", "#8fe9ff"];

const RADIUS = 42;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
const GAP = 1.6;

/** Кільцева діаграма: з яких розділів складається програма й яку частину займає кожен. */
export default function ProgramDonut({ subject }: { subject: Subject }) {
  const shares = normalizedShares(subject.syllabus.map((group) => group.weight));
  const arcs = shares.map((share) => (share / 100) * CIRCUMFERENCE);
  const segments = arcs.map((full, index) => ({
    length: Math.max(full - GAP, 0.5),
    offset: arcs.slice(0, index).reduce((sum, value) => sum + value, 0),
    color: PALETTE[index % PALETTE.length],
  }));

  return (
    <figure className="donut">
      <div className="donut__chart">
        <svg viewBox="0 0 120 120" role="img" aria-label={`Розподіл програми «${subject.title}» за розділами`}>
          <circle cx="60" cy="60" r={RADIUS} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="15" />
          {segments.map((segment, index) => (
            <circle
              key={index}
              cx="60"
              cy="60"
              r={RADIUS}
              fill="none"
              stroke={segment.color}
              strokeWidth="15"
              strokeDasharray={`${segment.length} ${CIRCUMFERENCE - segment.length}`}
              strokeDashoffset={-segment.offset}
              transform="rotate(-90 60 60)"
            />
          ))}
        </svg>
        <Pic src={subject.icon} alt="" width={144} height={144} className="donut__icon" loading="lazy" />
      </div>
      <figcaption>
        <ol className="donut__legend">
          {subject.syllabus.map((group, index) => (
            <li key={group.title}>
              <span className="donut__dot" style={{ background: segments[index].color }} aria-hidden="true" />
              <span className="donut__name">{group.title.replace(/^\d+\.\s*/, "")}</span>
              <span className="donut__weight">{group.weight}</span>
            </li>
          ))}
        </ol>
      </figcaption>
    </figure>
  );
}