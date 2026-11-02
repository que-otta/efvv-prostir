import { parseWeight } from "@/lib/weights";

type WeightBarProps = {
  weight: string;
  label?: string;
};

/** Вага розділу: суцільна частина — нижня межа діапазону, штрихована — до верхньої межі. Шкала — від 0 до 100% програми. */
export default function WeightBar({ weight, label = "Вага розділу в програмі" }: WeightBarProps) {
  const { min, max } = parseWeight(weight);
  return (
    <div className="weight" role="img" aria-label={`${label}: ${weight}`}>
      <span className="weight__track" aria-hidden="true">
        <span className="weight__fill" style={{ width: `${min}%` }} />
        <span className="weight__range" style={{ left: `${min}%`, width: `${Math.max(max - min, 0)}%` }} />
      </span>
      <span className="weight__label" aria-hidden="true">{weight}</span>
    </div>
  );
}