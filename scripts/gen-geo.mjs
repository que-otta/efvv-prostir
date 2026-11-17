// Генерує app/geo.css: фонові узори graphite з «предметів» за темами екзаменів (як на медальйонах-значках).
// Запуск: node scripts/gen-geo.mjs  (результат — app/geo.css, у репозиторії зберігається готовим; node_modules не потрібні).
// Малюнки — прості лінійні каракулі 48×48, колір і прозорість задаються під час збирання плитки.
import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const OUT = fileURLToPath(new URL("../app/geo.css", import.meta.url));

/* ---------- кольори (ті самі, що в кольорах предметів на сайті) ---------- */
const COLORS = { ped: "#5b92ff", psy: "#a47bff", mgmt: "#2fd4b0", met: "#6fdc7e", gold: "#f5b84a" };

/* ---------- значки (лише обводка, 48×48) ---------- */
const r1 = (n) => Math.round(n * 10) / 10;
const polar = (cx, cy, r, deg) => [cx + r * Math.cos((deg * Math.PI) / 180), cy + r * Math.sin((deg * Math.PI) / 180)];

function gearPath() {
  const pts = [];
  for (let i = 0; i < 8; i++) {
    const a = i * 45;
    for (const [d, r] of [[-12, 13], [-7, 17.5], [7, 17.5], [12, 13]]) pts.push(polar(24, 24, r, a + d));
  }
  return "M" + pts.map(([x, y]) => `${r1(x)} ${r1(y)}`).join("L") + "z";
}
function spiralPath() {
  const pts = [];
  for (let t = 0; t <= 3.6 * Math.PI; t += 0.22) pts.push(polar(24, 24, 1.8 * t + 1, (t * 180) / Math.PI));
  return "M" + pts.map(([x, y]) => `${r1(x)} ${r1(y)}`).join("L");
}
function dnaPath() {
  const a = [], b = [], rungs = [];
  for (let y = 5; y <= 43; y += 1.5) {
    const s = 9 * Math.sin(((y - 5) / 38) * 3 * Math.PI);
    a.push(`${r1(24 + s)} ${r1(y)}`);
    b.push(`${r1(24 - s)} ${r1(y)}`);
  }
  for (const y of [9, 14.5, 20, 26, 31.5, 37, 42]) {
    const s = 9 * Math.sin(((y - 5) / 38) * 3 * Math.PI);
    rungs.push(`M${r1(24 + s)} ${y}L${r1(24 - s)} ${y}`);
  }
  return `<path d="M${a.join("L")}"/><path d="M${b.join("L")}"/><path d="${rungs.join("")}"/>`;
}

const ICONS = {
  book: '<path d="M24 13c-4-3-11-3-16-1v25c5-2 12-2 16 1 4-3 11-3 16-1V12c-5-2-12-2-16 1z"/><path d="M24 13v25"/>',
  cap: '<path d="M3 18 24 8l21 10-21 10z"/><path d="M12 23v9c0 3 5.5 6 12 6s12-3 12-6v-9M45 18v13"/>',
  bulb: '<path d="M17 30c-4-3-5-7-4-12 1-6 6-10 11-10s10 4 11 10c1 5 0 9-4 12v4H17z"/><path d="M18 39h12M21 43h6M24 22v8M20 22l4-3 4 3"/>',
  puzzle: '<path d="M8 16h10c-3-6 1-9 6-9s9 3 6 9h10v9c-6-3-10 1-10 5s4 8 10 5v8H8z"/>',
  target: '<circle cx="22" cy="26" r="15"/><circle cx="22" cy="26" r="9"/><circle cx="22" cy="26" r="3"/><path d="M22 26 40 8M34 8h6v6"/>',
  clipboard: '<rect x="10" y="9" width="28" height="34" rx="3"/><path d="M18 6h12v7H18zM16 23l3 3 5-6M28 23h6M16 34l3 3 5-6M28 34h6"/>',
  pencil: '<path d="M9 39l2-8L32 10l7 7-21 21z"/><path d="M27 15l7 7M11 31l7 7"/>',
  chat: '<path d="M7 9h34v22H27l-8 8v-8H7z"/><path d="M14 17h20M14 24h12"/>',
  people: '<circle cx="24" cy="15" r="6"/><path d="M12 40c0-9 6-13 12-13s12 4 12 13z"/><circle cx="9" cy="22" r="4"/><circle cx="39" cy="22" r="4"/><path d="M2 38c0-6 3-9 7-9M46 38c0-6-3-9-7-9"/>',
  heart: '<path d="M24 41C9 30 7 19 12 13c4-4 10-3 12 2 2-5 8-6 12-2 5 6 3 17-12 28z"/>',
  books: '<path d="M7 41h34v-9H7zM10 32v-8h28v8M13 24v-8h22v8M14 36.5h6"/>',
  doc: '<path d="M12 6h18l8 8v28H12z"/><path d="M30 6v8h8M18 24h14M18 30h14M18 36h8"/>',
  brain: '<path d="M17 36c-5 0-8-4-7-8-4-2-5-8-1-11 0-5 5-9 10-7 3-3 8-3 10 0 5-1 9 3 8 8 4 3 3 9-2 11 0 4-4 8-9 6-2 2-6 2-9 1z"/><path d="M24 10v26M17 20c3 0 5 2 5 4M31 20c-3 0-5 2-5 4M17 30c3 0 5-2 5-4M31 30c-3 0-5-2-5-4"/>',
  scales: '<path d="M24 7v33M14 41h20M9 13h30M9 13 3 27h12zM39 13l-6 14h12z"/><path d="M3 27c0 5 12 5 12 0M33 27c0 5 12 5 12 0"/>',
  spiral: `<path d="${spiralPath()}"/>`,
  network: '<path d="M10 14 24 8l14 7-8 13-16 4zM24 8l6 20M10 14l4 18M30 28l8 12"/><circle cx="10" cy="14" r="3"/><circle cx="24" cy="8" r="3"/><circle cx="38" cy="15" r="3"/><circle cx="30" cy="28" r="3"/><circle cx="14" cy="32" r="3"/><circle cx="38" cy="40" r="3"/>',
  magnifier: '<circle cx="21" cy="21" r="12"/><path d="M30 30l12 12M16 21a5 5 0 0 1 5-5"/>',
  hourglass: '<path d="M13 6h22M13 42h22M15 6c0 10 9 12 9 18s-9 8-9 18M33 6c0 10-9 12-9 18s9 8 9 18"/>',
  question: '<path d="M17 17c0-5 3-8 7-8s8 3 8 7c0 6-8 6-8 12"/><circle cx="24" cy="39" r="1.6"/>',
  briefcase: '<rect x="5" y="15" width="38" height="25" rx="3"/><path d="M17 15v-5h14v5M5 27h38M21 27v4h6v-4"/>',
  orgchart: '<rect x="16" y="5" width="16" height="10" rx="1.5"/><path d="M24 15v7M9 22h30M9 22v6M24 22v6M39 22v6"/><rect x="3" y="28" width="12" height="9" rx="1.5"/><rect x="18" y="28" width="12" height="9" rx="1.5"/><rect x="33" y="28" width="12" height="9" rx="1.5"/>',
  barchart: '<path d="M5 41h38M9 41V31h7v10M20 41V23h7v18M31 41V15h7v26M8 22l9-7 6 4 13-12M30 7h6v6"/>',
  bank: '<path d="M4 18 24 6l20 12zM8 41h32M6 37h36M12 22v12M20 22v12M28 22v12M36 22v12"/>',
  gear: `<path d="${gearPath()}"/><circle cx="24" cy="24" r="5.5"/>`,
  calendar: '<rect x="6" y="10" width="36" height="31" rx="3"/><path d="M6 19h36M15 6v7M33 6v7M14 26h4M22 26h4M30 26h4M14 33h4M22 33h4"/>',
  clock: '<circle cx="24" cy="24" r="17"/><path d="M24 13v11l7 5"/>',
  medal: '<circle cx="24" cy="19" r="10"/><path d="M18 28l-4 15 10-5 10 5-4-15M24 14v10M20 19h8"/>',
  microscope: '<path d="M19 5l7 3-5 14-7-3z"/><path d="M23 17c8 1 13 7 12 14-1 5-5 8-11 8H12M8 43h32M16 31h8"/>',
  flask: '<path d="M19 5h10M21 5v14L9 38c-1 3 1 5 4 5h22c3 0 5-2 4-5L27 19V5M14 31h20"/><circle cx="21" cy="36" r="1.6"/><circle cx="28" cy="34" r="1.2"/>',
  atom: '<ellipse cx="24" cy="24" rx="19" ry="7"/><ellipse cx="24" cy="24" rx="19" ry="7" transform="rotate(60 24 24)"/><ellipse cx="24" cy="24" rx="19" ry="7" transform="rotate(120 24 24)"/><circle cx="24" cy="24" r="2.5"/>',
  bell: '<path d="M3 38c10 0 12-28 21-28s11 28 21 28M3 41h42M24 10v31"/>',
  sigma: '<path d="M35 9H13l13 15L13 39h22"/>',
  histogram: '<path d="M6 41h36M9 41V32h6v9M15 41V20h6v21M21 41V12h6v29M27 41V22h6v19M33 41V31h6v10"/>',
  testtubes: '<path d="M14 6h8v28a4 4 0 0 1-8 0zM28 10h8v24a4 4 0 0 1-8 0zM14 22h8M28 24h8"/>',
  dna: dnaPath(),
  ptext: "text:p&lt;0,05",
};

/* ---------- набори ---------- */
const GROUPS = {
  ped: ["book", "cap", "bulb", "puzzle", "target", "pencil", "people", "books", "doc"],
  psy: ["brain", "scales", "spiral", "network", "heart", "chat", "hourglass", "question", "magnifier"],
  mgmt: ["briefcase", "orgchart", "barchart", "bank", "gear", "calendar", "clock", "medal", "clipboard"],
  met: ["microscope", "flask", "atom", "bell", "sigma", "ptext", "histogram", "testtubes", "dna"],
};
const SUBJECT_SETS = {
  pedagogy: { color: COLORS.ped, icons: ["book", "cap", "bulb", "puzzle", "target", "clipboard", "pencil", "chat", "people", "heart", "books", "doc"] },
  psychology: { color: COLORS.psy, icons: ["brain", "scales", "spiral", "network", "magnifier", "hourglass", "heart", "chat", "bulb", "puzzle", "people", "question"] },
  management: { color: COLORS.mgmt, icons: ["briefcase", "orgchart", "barchart", "bank", "gear", "calendar", "clock", "target", "people", "clipboard", "medal", "doc"] },
  methodology: { color: COLORS.met, icons: ["microscope", "flask", "atom", "magnifier", "ptext", "bell", "sigma", "clipboard", "histogram", "testtubes", "dna", "bulb"] },
};

/* ---------- плитка ---------- */
function mulberry32(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const CELL = 84;
const N = 6;
const W = CELL * N; // 504

/** Вміст значка для <defs>, зсунутий так, щоб центр 48×48 був у (0,0); колір і прозорість успадковуються від <use>. */
function glyph(name) {
  const icon = ICONS[name];
  const inner = icon.startsWith("text:")
    ? `<text x='24' y='29' text-anchor='middle' font-family='Inter,Arial,sans-serif' font-size='15' font-weight='600' stroke='none'>${icon.slice(5)}</text>`
    : icon.replace(/"/g, "'");
  return `<g id='${name}' transform='translate(-24 -24)'>${inner}</g>`;
}

/** items: масив {name, color} довжиною N*N у порядку рядків. */
function tile({ items, seed, opacity }) {
  const rnd = mulberry32(seed);
  const byColor = new Map(); // колір → <use>, щоб обводку й прозорість задати один раз на групу
  const extras = []; // золоті іскри й цятки
  const used = [...new Set(items.map((item) => item.name))];
  const defs = used.map(glyph).join("") + "<path id='sp' d='M0-6C1-2 2-1 6 0 2 1 1 2 0 6-1 2-2 1-6 0-2-1-1-2 0-6z'/>";
  const place = (x, y, margin, draw) => {
    for (const dx of [-W, 0, W]) for (const dy of [-W, 0, W]) {
      const X = x + dx, Y = y + dy;
      if (X > -margin && X < W + margin && Y > -margin && Y < W + margin) draw(r1(X), r1(Y));
    }
  };
  for (let r = 0; r < N; r++) {
    for (let c = 0; c < N; c++) {
      const { name, color } = items[r * N + c];
      let x = (c + 0.5) * CELL + (r % 2 ? CELL / 2 : 0) + (rnd() * 16 - 8);
      const y = (r + 0.5) * CELL + (rnd() * 16 - 8);
      x = ((x % W) + W) % W;
      const rot = Math.round(rnd() * 50 - 25);
      const s = r1(0.82 + rnd() * 0.26);
      const fillAttr = ICONS[name].startsWith("text:") ? ` fill='${color}'` : ""; // підпис p<0,05 — залитий текст
      if (!byColor.has(color)) byColor.set(color, []);
      place(x, y, 42, (X, Y) => byColor.get(color).push(`<use href='#${name}' transform='translate(${X} ${Y}) rotate(${rot}) scale(${s})'${fillAttr}/>`));
    }
  }
  // дрібні золоті «іскри» й цятки в проміжках, як на медальйонах
  for (let r = 0; r < N; r++) {
    for (let c = 0; c < N; c++) {
      if (rnd() > 0.6) continue;
      const x = (((c + (r % 2 ? 0.5 : 0)) * CELL) % W + W) % W;
      const y = (r + 0.5) * CELL + (rnd() * 12 - 6);
      if (rnd() < 0.55) {
        const k = r1((4.5 + rnd() * 3) / 6);
        place(x, y, 12, (X, Y) => extras.push(`<use href='#sp' transform='translate(${X} ${Y}) scale(${k})'/>`));
      } else {
        place(x, y, 6, (X, Y) => extras.push(`<circle cx='${X}' cy='${Y}' r='1.5'/>`));
      }
    }
  }
  const groups = [...byColor].map(([color, list]) => `<g stroke='${color}' stroke-opacity='${opacity}' fill-opacity='${opacity}'>${list.join("")}</g>`).join("");
  const sparks = `<g fill='${COLORS.gold}' fill-opacity='${r1(opacity * 1.6)}' stroke='none'>${extras.join("")}</g>`;
  return `<svg xmlns='http://www.w3.org/2000/svg' width='${W}' height='${W}' viewBox='0 0 ${W} ${W}' fill='none' stroke-width='1.7' stroke-linecap='round' stroke-linejoin='round'><defs>${defs}</defs>${groups}${sparks}</svg>`;
}
const toUrl = (svg) => 'url("data:image/svg+xml,' + svg.replace(/%/g, "%25").replace(/</g, "%3C").replace(/>/g, "%3E").replace(/#/g, "%23").replace(/\s+/g, " ") + '")';

/** Змішаний набір: по 9 значків від кожного предмета, кольори чергуються. */
function mixItems() {
  const keys = ["ped", "psy", "mgmt", "met"];
  const out = [];
  for (let i = 0; i < 9; i++) for (const k of keys) out.push({ name: GROUPS[k][i], color: COLORS[k] });
  return out;
}
/** Набір одного предмета: кожен значок рівно по 3 рази, розкладені навмання, але без однакових сусідів (з урахуванням «зсуву» рядків і стику плиток). */
function subjectItems(set, seed) {
  const rnd = mulberry32(seed);
  const idx = (r, c) => (((r % N) + N) % N) * N + (((c % N) + N) % N);
  // сусіди клітинки (r, c); у непарних рядках значки зсунуті вправо на пів клітинки
  const neighbours = (r, c) => {
    const diag = r % 2 ? [c, c + 1] : [c - 1, c]; // два найближчі значки в сусідньому рядку (N парне, тож парність рядків не ламається на стику)
    return [idx(r, c - 1), idx(r, c + 1), idx(r - 2, c), idx(r + 2, c), ...diag.map((x) => idx(r - 1, x)), ...diag.map((x) => idx(r + 1, x))];
  };
  const left = new Map(set.icons.map((name) => [name, 3]));
  const list = new Array(N * N).fill(null);
  // розкладання з поверненням: кожен значок рівно по 3 рази, жодних однакових сусідів
  const fill = (k) => {
    if (k === N * N) return true;
    const r = Math.floor(k / N), c = k % N;
    const options = set.icons.filter((name) => left.get(name) > 0 && !neighbours(r, c).some((n) => list[n] === name));
    for (let i = options.length - 1; i > 0; i--) {
      const j = Math.floor(rnd() * (i + 1));
      [options[i], options[j]] = [options[j], options[i]];
    }
    for (const name of options) {
      list[k] = name;
      left.set(name, left.get(name) - 1);
      if (fill(k + 1)) return true;
      left.set(name, left.get(name) + 1);
      list[k] = null;
    }
    return false;
  };
  if (!fill(0)) throw new Error("не вдалося розкласти значки без однакових сусідів");
  return list.map((name) => ({ name, color: set.color }));
}

const tokens = {
  "--geo-mix": toUrl(tile({ items: mixItems(), seed: 11, opacity: 0.15 })), // для всього сайту: ледь помітний (у hero головної шарується двічі — вийде яскравіше)
};
for (const [id, set] of Object.entries(SUBJECT_SETS)) tokens[`--geo-${id}`] = toUrl(tile({ items: subjectItems(set, 7 + id.length), seed: 3 + id.length, opacity: 0.5 }));

const css =
  "/* Згенеровано scripts/gen-geo.mjs — не редагувати вручну (node scripts/gen-geo.mjs). Розмір плитки — 504×504 px. */\n" +
  'html[data-design="graphite"] {\n' +
  Object.entries(tokens).map(([k, v]) => `  ${k}: ${v};`).join("\n") +
  "\n}\n";
writeFileSync(OUT, css);
console.log(`app/geo.css: ${(css.length / 1024).toFixed(1)} КБ, ${Object.keys(tokens).length} узорів`);
