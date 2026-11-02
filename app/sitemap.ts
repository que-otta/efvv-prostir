import type { MetadataRoute } from "next";
import { samplePath, sampleIsReady, samples } from "@/data/samples";
import { subjects } from "@/data/subjects";
import { absoluteUrl } from "@/lib/urls";

export const dynamic = "force-static";

/** У sitemap потрапляють лише готові комплекти й зразки до них; решта — `noindex`. */
export default function sitemap(): MetadataRoute.Sitemap {
  const urls = [
    "/",
    "/komplekty/",
    "/programa/",
    "/pryklady/",
    "/yak-kupyty/",
    ...subjects.filter((subject) => subject.kit.ready).map((subject) => `/komplekty/${subject.id}/`),
    ...samples.filter(sampleIsReady).map((sample) => samplePath(sample)),
  ];
  return urls.map((path) => ({ url: absoluteUrl(path) }));
}
