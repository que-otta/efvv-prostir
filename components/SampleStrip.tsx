import Link from "next/link";
import { samplePath, type Sample } from "@/data/samples";
import { ArrowRight } from "./Icons";
import Pic from "./Pic";

/** Ряд справжніх сторінок із прикладу комплекту: кожна веде до переглядача на цій сторінці. Титульну сторінку не показує — вона вже є в шапці комплекту. */
export default function SampleStrip({ sample, limit = 6 }: { sample: Sample; limit?: number }) {
  const shown = sample.pages.slice(1, limit + 1);
  return (
    <>
      <ul className="sample-strip">
        {shown.map((page, index) => (
          <li key={page.image}>
            <Link href={samplePath(sample, index + 2)}>
              <Pic src={page.image} alt={page.alt} width={page.width} height={page.height} sizes="(min-width: 64em) 11rem, 9.5rem" loading="lazy" />
              <span>{page.label}</span>
            </Link>
          </li>
        ))}
      </ul>
      <p className="sample-strip__more">
        <Link className="btn btn--ghost" href={samplePath(sample)}>
          Переглянути всі {sample.pages.length} сторінок прикладу <ArrowRight />
        </Link>
      </p>
    </>
  );
}
