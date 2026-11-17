import { DESIGN } from "@/site.config";

export default function StatusBadge({ ready }: { ready: boolean }) {
  // У резервному оформленні «graphite» про готовність готових комплектів не пишемо; про комплекти, що готуються, — так.
  if (DESIGN === "graphite" && ready) return null;
  return <span className={ready ? "badge badge--ready" : "badge badge--soon"}>{ready ? "Комплект готовий" : "Комплект готується"}</span>;
}
