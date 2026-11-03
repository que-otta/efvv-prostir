// Перевірка зібраного сайту в out/: npm run verify
// — немає PDF і заборонених слів, усі внутрішні посилання ведуть на наявні сторінки,
// — SEO-мета на кожній сторінці, noindex і sitemap узгоджені, розмір не перевищує 20 МБ,
// — готові комплекти мають ціну, файли й сторінки.
// Попередження (⚠) не зупиняють перевірку, але з VERIFY_STRICT=1 (так запущено в GitHub Actions) вона завершується помилкою:
// сайт із заглушками USERNAME або недописаним комплектом не опублікується.
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { extname, join, relative, resolve, sep } from "node:path";
import { pathToFileURL } from "node:url";

const root = resolve(process.argv[2] ?? "out");
const basePath = (process.env.NEXT_PUBLIC_BASE_PATH ?? "").replace(/\/$/, "");
// Запобіжник від випадково доданих важких файлів (ліміт GitHub Pages — 1 ГБ). 20 МБ, бо сторінки прикладів і банери лежать у нативній якості.
const MAX_BYTES = 20 * 1024 * 1024;
const BANNED = [/тренажер/i, /практик/i, /завантажити/i, /демо-пита/i, /chatgpt/i, /cloudflare/i, /openai/i, /прототип/i, /сундук/i, /версія 2/i];
const TEXT_EXT = new Set([".html", ".txt", ".xml", ".json", ".css", ".js", ".svg"]);

const strict = process.env.VERIFY_STRICT === "1";
const errors = [];
const warnings = [];
const notes = [];
const fail = (message) => errors.push(message);

if (!existsSync(root)) {
  console.error(`Немає папки ${root}. Спочатку виконайте npm run build.`);
  process.exit(1);
}

function walk(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = join(dir, entry.name);
    return entry.isDirectory() ? walk(full) : [full];
  });
}

const files = walk(root);
const rel = (file) => relative(root, file).split(sep).join("/");
const totalBytes = files.reduce((sum, file) => sum + statSync(file).size, 0);

// 1. Розмір і PDF
if (totalBytes > MAX_BYTES) fail(`out/ важить ${(totalBytes / 1048576).toFixed(1)} МБ — більше за ${MAX_BYTES / 1048576} МБ`);
for (const file of files) if (extname(file).toLowerCase() === ".pdf") fail(`PDF у збірці: ${rel(file)}`);

// На сайті мають бути лише три приклади (по одному на предмет) — жодних сторінок чи уривків із повних файлів комплектів.
const ALLOWED_MATERIALS = ["materials/management/", "materials/psychology/", "materials/pedagogy/demo/"];
for (const file of files) {
  const path = rel(file);
  if (path.startsWith("materials/") && !ALLOWED_MATERIALS.some((prefix) => path.startsWith(prefix))) fail(`зображення поза трьома прикладами: ${path}`);
}

// 2. Заборонені слова (лише текстові файли)
for (const file of files) {
  if (!TEXT_EXT.has(extname(file))) continue;
  // У поліфілах Next.js (core-js) є службові рядки "Cloudflare-Workers" / "CLOUDFLARE" — це не наш код.
  let text = readFileSync(file, "utf8");
  if (text.includes("Cloudflare-Workers")) text = text.replaceAll("Cloudflare-Workers", "").replaceAll("CLOUDFLARE", "");
  for (const pattern of BANNED) {
    const match = text.match(pattern);
    if (match) fail(`«${match[0]}» знайдено у ${rel(file)}`);
  }
}

// 3. Сторінки
const htmlFiles = files.filter((file) => extname(file) === ".html");
const pages = new Map(); // шлях сторінки ("/komplekty/pedagogy/") → html
for (const file of htmlFiles) {
  const path = rel(file);
  if (path === "404.html" || /^google[0-9a-f]+\.html$/.test(path)) continue;
  const url = path === "index.html" ? "/" : `/${path.replace(/index\.html$/, "")}`;
  pages.set(url, readFileSync(file, "utf8"));
}

function targetExists(urlPath) {
  const clean = decodeURIComponent(urlPath);
  const direct = join(root, clean);
  if (existsSync(direct) && statSync(direct).isFile()) return true;
  return existsSync(join(direct, "index.html"));
}

function stripBase(pathname) {
  if (!basePath) return pathname;
  if (pathname === basePath) return "/";
  return pathname.startsWith(`${basePath}/`) ? pathname.slice(basePath.length) : null;
}

const siteConfig = readFileSync(resolve("site.config.ts"), "utf8");
const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || siteConfig.match(/NEXT_PUBLIC_SITE_URL (?:\?\?|\|\|) "([^"]+)"/)?.[1] || "").replace(/\/$/, "");
const telegramUrl = siteConfig.match(/TELEGRAM_URL = "([^"]+)"/)?.[1] ?? "";

// Дані комплектів (data/subjects.ts читається напряму: потрібен Node 22.18+ або 24, де TypeScript запускається без збірки).
let subjectsData = null;
try {
  subjectsData = await import(pathToFileURL(resolve("data/subjects.ts")).href);
} catch (error) {
  notes.push(`дані комплектів не прочитано (${error.code ?? error.message}) — перевірку готовності комплектів пропущено; потрібен Node 22.18+`);
}
const subjectById = new Map((subjectsData?.subjects ?? []).map((subject) => [subject.id, subject]));

let linkCount = 0;
const SERVICE_PAGES = new Set(["/404/", "/_not-found/"]);
for (const [url, html] of pages) {
  if (SERVICE_PAGES.has(url)) continue;
  const meta = (pattern) => pattern.test(html);
  if (!meta(/<title>[^<]{5,}<\/title>/)) fail(`${url}: немає <title>`);
  if (!meta(/<meta name="description" content="[^"]{20,}"/)) fail(`${url}: немає description`);
  if (!meta(/<link rel="canonical" href="https?:\/\/[^"]+"/)) fail(`${url}: немає canonical`);
  if (!meta(/<meta property="og:title"/) || !meta(/<meta property="og:image"/)) fail(`${url}: немає Open Graph`);
  if (!meta(/<html lang="uk"/)) fail(`${url}: немає lang="uk"`);

  // Next.js додає <link rel="preconnect" href="/"> без basePath — це не посилання на сторінку.
  const markup = html.replace(/<link rel="preconnect"[^>]*>/g, "");
  const hrefs = [...markup.matchAll(/\s(?:href|src)="([^"]+)"/g)].map((match) => match[1]);
  for (const raw of hrefs) {
    const value = raw.replace(/&amp;/g, "&");
    if (/^(mailto:|tel:|data:|javascript:)/.test(value)) continue;
    let pathname;
    let hash = "";
    if (value.startsWith("/") && !value.startsWith("//")) {
      const parsed = new URL(value, "http://local");
      pathname = parsed.pathname;
      hash = parsed.hash.slice(1);
    } else if (siteUrl && value.toLowerCase().startsWith(siteUrl.toLowerCase())) {
      const parsed = new URL(value);
      pathname = parsed.pathname;
      hash = parsed.hash.slice(1);
    } else {
      continue; // зовнішнє посилання
    }
    const local = stripBase(pathname);
    if (local === null) {
      fail(`${url}: посилання поза basePath → ${raw}`);
      continue;
    }
    linkCount += 1;
    if (!targetExists(local)) fail(`${url}: бите посилання → ${raw}`);
    else if (hash) {
      const targetHtml = pages.get(local.endsWith("/") ? local : `${local}/`) ?? (local === "/" ? pages.get("/") : undefined);
      if (targetHtml && !new RegExp(`\\sid="${hash}"`).test(targetHtml)) fail(`${url}: немає якоря #${hash} на ${local}`);
    }
    if (/\.pdf($|\?)/i.test(local)) fail(`${url}: посилання на PDF → ${raw}`);
  }
}

// 4. noindex ↔ sitemap
const noindexPages = new Set([...pages].filter(([, html]) => /<meta name="robots" content="[^"]*noindex/.test(html)).map(([url]) => url));
const sitemapPath = join(root, "sitemap.xml");
if (!existsSync(sitemapPath)) fail("немає sitemap.xml");
else {
  const locs = [...readFileSync(sitemapPath, "utf8").matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => new URL(match[1]).pathname);
  const sitemapPages = new Set(locs.map((pathname) => stripBase(pathname) ?? pathname));
  for (const url of sitemapPages) {
    if (!pages.has(url)) fail(`sitemap: сторінки немає в out/ → ${url}`);
    if (noindexPages.has(url)) fail(`sitemap: сторінка з noindex → ${url}`);
  }
  for (const url of pages.keys()) {
    if (SERVICE_PAGES.has(url)) continue;
    if (!noindexPages.has(url) && !sitemapPages.has(url)) fail(`сторінка індексується, але її немає в sitemap → ${url}`);
  }
}
if (!existsSync(join(root, "robots.txt"))) fail("немає robots.txt");
if (!existsSync(join(root, ".nojekyll"))) fail("немає .nojekyll");

// 5. JSON-LD
const jsonLd = (html) => [...html.matchAll(/<script type="application\/ld\+json">([^<]*)<\/script>/g)].map((match) => JSON.parse(match[1].replace(/\\u003c/g, "<")));
const home = jsonLd(pages.get("/") ?? "");
if (!home.some((item) => item["@type"] === "WebSite")) fail("головна: немає JSON-LD WebSite");
if (!home.some((item) => item["@type"] === "FAQPage" && item.mainEntity?.length > 0)) fail("головна: немає JSON-LD FAQPage");
for (const [url, html] of pages) {
  if (!url.startsWith("/komplekty/") || url === "/komplekty/") continue; // індекс комплектів — не сторінка товару
  const hasProduct = jsonLd(html).some((item) => item["@type"] === "Product" && item.offers?.["@type"] === "Offer");
  const subject = subjectById.get(url.split("/")[2]);
  if (noindexPages.has(url) && hasProduct) fail(`${url}: Product у комплекті, що готується`);
  // Без ціни розмітку Product не виводимо (без вигаданих цін) — про це окреме попередження нижче.
  if (!noindexPages.has(url) && !hasProduct && (!subject || subject.kit.price)) fail(`${url}: готовий комплект без Product/Offer`);
}

// 6. Нагадування: заглушки й недописані комплекти
if (/USERNAME/.test(siteUrl)) warnings.push("SITE_URL ще містить заглушку USERNAME (у site.config.ts; у GitHub Actions підставляється автоматично)");
if (/USERNAME/.test(telegramUrl)) warnings.push("TELEGRAM_URL у site.config.ts ще містить заглушку USERNAME");
else if (telegramUrl && !/^https:\/\/t\.me\/[A-Za-z0-9_]{4,}$/.test(telegramUrl)) {
  notes.push(`TELEGRAM_URL («${telegramUrl}») не схожий на https://t.me/нікнейм — параметр ?text= із готовим повідомленням працює лише для такого посилання`);
}
if (subjectsData) {
  for (const subject of subjectsData.subjects) {
    for (const issue of subjectsData.kitIssues(subject)) warnings.push(`комплект «${subject.title}» позначено готовим, але ${issue}`);
  }
}

console.log(`Сторінок: ${pages.size} · внутрішніх посилань перевірено: ${linkCount} · розмір out/: ${(totalBytes / 1048576).toFixed(2)} МБ`);
for (const warning of warnings) console.warn(`⚠ ${warning}`);
for (const note of notes) console.log(`ℹ ${note}`);
if (errors.length) {
  console.error(`\nЗнайдено помилок: ${errors.length}`);
  for (const error of errors) console.error(`✗ ${error}`);
  process.exit(1);
}
if (strict && warnings.length) {
  console.error(`\nVERIFY_STRICT=1: публікацію зупинено — залишилося попереджень: ${warnings.length}. Заповніть дані й запустіть знову.`);
  process.exit(1);
}
console.log("✓ Перевірка out/ пройдена");
