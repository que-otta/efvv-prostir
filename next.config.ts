import type { NextConfig } from "next";

// Для проєктного GitHub Pages (https://USERNAME.github.io/REPO/) basePath = "/REPO".
// У workflow він підставляється автоматично; локально залишається порожнім.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
  ...(basePath ? { basePath } : {}),
};

export default nextConfig;
