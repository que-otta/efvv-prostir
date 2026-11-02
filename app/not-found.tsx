import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Сторінку не знайдено",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <section className="page-head dark">
      <div className="container">
        <h1>Сторінку не знайдено</h1>
        <p className="lead">Можливо, адреса змінилася. Почни з головної або переглянь комплекти.</p>
        <div className="actions">
          <Link className="btn btn--primary" href="/">На головну</Link>
          <Link className="btn btn--ghost" href="/komplekty/">Комплекти</Link>
        </div>
      </div>
    </section>
  );
}
