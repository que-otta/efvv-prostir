import Link from "next/link";
import type { CSSProperties } from "react";
import { formatPrice, kitMessage, kitStats, type Subject } from "@/data/subjects";
import { samples } from "@/data/samples";
import { plural } from "@/lib/plural";
import { telegramLink } from "@/lib/urls";
import { ArrowRight, Telegram } from "./Icons";
import Pic from "./Pic";
import StatusBadge from "./StatusBadge";

export function coverFor(subject: Subject) {
  return samples.find((item) => item.subjectId === subject.id)?.cover;
}

export default function KitCard({ subject }: { subject: Subject }) {
  const { ready, price } = subject.kit;
  const stats = kitStats(subject);
  const href = `/komplekty/${subject.id}/`;
  const size = ready
    ? [`${stats.files} PDF`, stats.pages !== null ? `${stats.pages} ${plural(stats.pages, "сторінка", "сторінки", "сторінок")}` : null].filter(Boolean).join(" · ")
    : "Склад і ціну буде вказано, коли комплект буде готовий.";

  return (
    <article className="kit-card" style={{ "--subject-accent": subject.accent, "--subject-neon": subject.neon } as CSSProperties}>
      <div className="kit-card__media kit-card__media--banner" aria-hidden="true">
        <Pic src={subject.preview.src} alt="" width={subject.preview.width} height={subject.preview.height} sizes="(min-width: 64em) 24rem, (min-width: 40em) 45vw, 90vw" loading="lazy" />
      </div>
      <div className="kit-card__body">
        <Pic src={subject.icon} alt="" width={144} height={144} className="kit-card__avatar" loading="lazy" />
        {!ready && <StatusBadge ready={ready} />}
        <h3 className="kit-card__title">
          <Link href={href}>{subject.title}</Link>
        </h3>
        <p>{subject.description}</p>
        <p className="kit-card__facts">
          {ready && price ? <strong className="kit-card__price">{formatPrice(price)}</strong> : null}
          <span>{size}</span>
        </p>
        {ready && (
          <p className="kit-card__edition">
            <span className="pill">{subject.edition.label}</span>
            {subject.edition.freeUpdate && <span className="kit-card__free">оновлення безкоштовно</span>}
          </p>
        )}
        <div className="kit-card__actions">
          {ready && (
            <a className="btn btn--primary btn--sm" href={telegramLink(kitMessage(subject))} target="_blank" rel="noopener noreferrer">
              <Telegram /> Купити
            </a>
          )}
          <Link className="kit-card__link" href={href}>
            Про комплект <ArrowRight />
          </Link>
        </div>
      </div>
    </article>
  );
}
