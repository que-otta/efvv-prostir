import Link from "next/link";
import MainNav from "./MainNav";

export default function SiteHeader() {
  return (
    <header className="site-header dark">
      <div className="container site-header__inner">
        <Link href="/" className="brand">
          <span className="brand__mark" aria-hidden="true">Є</span>
          <span className="brand__name">ЄФВВ <b>Простір</b></span>
        </Link>
        <MainNav />
      </div>
    </header>
  );
}