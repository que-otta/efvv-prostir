import Link from "next/link";
import { formatPrice, kitMessage, subjects } from "@/data/subjects";
import { telegramLink } from "@/lib/urls";
import HeaderBuy, { type HeaderBuyKits } from "./HeaderBuy";
import MainNav from "./MainNav";

const kits: HeaderBuyKits = Object.fromEntries(
  subjects
    .filter((subject) => subject.kit.ready)
    .map((subject) => [
      subject.id,
      { href: telegramLink(kitMessage(subject)), label: subject.kit.price ? `Купити · ${formatPrice(subject.kit.price)}` : "Купити" },
    ]),
);

export default function SiteHeader() {
  return (
    <header className="site-header dark">
      <div className="container site-header__inner">
        <Link href="/" className="brand">
          <span className="brand__mark" aria-hidden="true">Є</span>
          <span className="brand__name">ЄФВВ <b>Простір</b></span>
        </Link>
        <MainNav />
        <HeaderBuy kits={kits} />
      </div>
    </header>
  );
}
