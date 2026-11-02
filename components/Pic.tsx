import Image, { type ImageProps } from "next/image";
import { withBase } from "@/lib/urls";

type PicProps = Omit<ImageProps, "src" | "alt"> & { src: string; alt: string };

/** `next/image` для файлів із `public/` — додає basePath, який `unoptimized`-режим сам не підставляє. */
export default function Pic({ src, alt, ...props }: PicProps) {
  return <Image src={withBase(src)} alt={alt} {...props} />;
}
