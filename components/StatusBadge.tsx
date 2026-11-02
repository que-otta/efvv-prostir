export default function StatusBadge({ ready }: { ready: boolean }) {
  return <span className={ready ? "badge badge--ready" : "badge badge--soon"}>{ready ? "Комплект готовий" : "Комплект готується"}</span>;
}
