import Link from "next/link";
import { SITE_NAME, TELEGRAM_URL } from "@/site.config";

export default function SiteFooter() {
  return (
    <footer className="site-footer dark">
      <div className="container site-footer__inner">
        <div>
          <p className="site-footer__brand">{SITE_NAME}</p>
          <p className="site-footer__note">
            Неофіційний навчальний проєкт: не пов’язаний з МОН чи УЦОЯО. Офіційні програми — за посиланнями в розділі «Програма».
          </p>
        </div>
        <nav aria-label="Додаткові посилання" className="site-footer__nav">
          <ul>
            <li><Link href="/komplekty/">Комплекти</Link></li>
            <li><Link href="/programa/">Програма</Link></li>
            <li><Link href="/pryklady/">Приклади</Link></li>
            <li><Link href="/yak-kupyty/">Як купити</Link></li>
            <li><a href={TELEGRAM_URL} target="_blank" rel="noopener noreferrer">Telegram</a></li>
          </ul>
        </nav>
      </div>
      <div className="container site-footer__copy">© {new Date().getFullYear()} {SITE_NAME}</div>
    </footer>
  );
}
