/**
 * Єдине місце, де задаються адреси й назва сайту.
 * TELEGRAM_URL треба замінити на свій (https://t.me/нікнейм). SITE_URL у GitHub Actions підставляється сам
 * (змінна NEXT_PUBLIC_SITE_URL); тут його варто міняти лише для збірки поза GitHub Pages.
 */

/** Адреса сайту без шляху: `https://USERNAME.github.io` (або власний домен). */
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://USERNAME.github.io";

/** Telegram, куди ведуть кнопки «Купити» та «Повідомити, коли буде готово». */
export const TELEGRAM_URL = "https://t.me/rftgyhokuya";

export const SITE_NAME = "ЄФВВ Простір";
export const SITE_TAGLINE = "Візуальні PDF-конспекти для підготовки до ЄФВВ та ЄВВ";
export const SITE_DESCRIPTION =
  "Візуальні PDF-конспекти до іспитів ЄФВВ та ЄВВ: комплекти за розділами офіційної програми, приклади сторінок і проста покупка через Telegram.";

export type Design = "classic" | "graphite";

/**
 * Оформлення сайту. Тексти й дані в обох версіях однакові, змінюється лише вигляд.
 *  - "graphite" — поточне (з 11.11.2026): спокійний темний графіт, синій акцент, кольори предметів, фон-узор із предметів по темах;
 *  - "classic"  — попереднє: темно-синє з неоновим світінням.
 * Щоб повернути попереднє, змініть DEFAULT_DESIGN на "classic". Для разової перевірки без правки файлу —
 * змінна середовища NEXT_PUBLIC_DESIGN=graphite (або classic).
 */
const DEFAULT_DESIGN: Design = "graphite";
const fromEnv = process.env.NEXT_PUBLIC_DESIGN;
export const DESIGN: Design = fromEnv === "graphite" || fromEnv === "classic" ? fromEnv : DEFAULT_DESIGN;

/**
 * Префікс шляху для проєктного GitHub Pages (`/назва-репозиторію`).
 * Задається змінною середовища; для користувацького сайту й власного домену — порожній.
 */
export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
