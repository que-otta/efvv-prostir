// Мінімальний статичний сервер для перегляду `out/` локально: npm run preview
// Підтримує basePath: NEXT_PUBLIC_BASE_PATH=/repo npm run preview
import { createReadStream, existsSync, statSync } from "node:fs";
import { createServer } from "node:http";
import { extname, join, normalize, resolve } from "node:path";

const root = resolve(process.argv[2] ?? "out");
const port = Number(process.env.PORT ?? process.argv[3] ?? 4173);
const basePath = (process.env.NEXT_PUBLIC_BASE_PATH ?? "").replace(/\/$/, "");

const types = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
  ".xml": "application/xml; charset=utf-8",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".woff2": "font/woff2",
  ".ico": "image/x-icon",
};

function resolveFile(urlPath) {
  const clean = normalize(decodeURIComponent(urlPath)).replace(/^([/\\])+/, "");
  const candidate = join(root, clean);
  if (!candidate.startsWith(root)) return null;
  if (existsSync(candidate) && statSync(candidate).isFile()) return candidate;
  const index = join(candidate, "index.html");
  if (existsSync(index)) return index;
  // Next.js на Windows кладе файли префетчу вкладено (`__next.a/$d$b.txt`), а клієнт просить `__next.a.$d$b.txt`.
  // На Linux (GitHub Actions) імена збігаються, тому це лише допомога для локального перегляду.
  const name = clean.split(/[\\/]/).pop() ?? "";
  if (name.startsWith("__next.") && name.endsWith(".txt")) {
    const [head, ...rest] = name.slice("__next.".length, -".txt".length).split(".");
    const nested = join(root, clean.slice(0, clean.length - name.length), `__next.${head}`, `${rest.join("/")}.txt`);
    if (rest.length && existsSync(nested)) return nested;
  }
  return null;
}

createServer((request, response) => {
  let pathname = new URL(request.url ?? "/", "http://localhost").pathname;
  if (basePath) {
    if (!pathname.startsWith(basePath)) pathname = "/__outside_base_path__";
    else pathname = pathname.slice(basePath.length) || "/";
  }
  const file = resolveFile(pathname);
  if (file) {
    response.writeHead(200, { "content-type": types[extname(file)] ?? "application/octet-stream" });
    createReadStream(file).pipe(response);
    return;
  }
  const notFound = join(root, "404.html");
  response.writeHead(404, { "content-type": types[".html"] });
  if (existsSync(notFound)) createReadStream(notFound).pipe(response);
  else response.end("Not found");
}).listen(port, () => console.log(`out/ → http://localhost:${port}${basePath}/`));
