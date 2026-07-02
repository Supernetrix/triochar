import type { MetadataRoute } from "next";
import { collectionMeta, getEntries, type CollectionName } from "@/lib/content";

const baseUrl = "https://climate-assets.com";
const collections: CollectionName[] = ["portfolio", "policies", "blogs", "vlogs"];

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = ["", "knowledge", "portfolio", "supplier", "buyer", "contact"].map((route) => ({
    url: `${baseUrl}/${route}`,
    lastModified: new Date(),
  }));

  const contentRoutes = collections.flatMap((collection) =>
    getEntries(collection).map((entry) => ({
      url: `${baseUrl}${collectionMeta[collection].href}/${entry.slug}`,
      lastModified: entry.date ? new Date(entry.date) : new Date(),
    })),
  );

  return [...staticRoutes, ...contentRoutes];
}
