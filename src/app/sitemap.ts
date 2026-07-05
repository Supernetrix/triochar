import type { MetadataRoute } from "next";
import { collectionMeta, getEntries, type CollectionName } from "@/lib/content";
import { absoluteUrl } from "@/lib/seo";

const collections: CollectionName[] = ["portfolio", "policies", "blogs", "vlogs"];

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const staticRoutes = [
    { path: "/", priority: 1 },
    { path: "/portfolio/", priority: 0.9 },
    { path: "/supplier/", priority: 0.8 },
    { path: "/buyer/", priority: 0.8 },
    { path: "/knowledge/", priority: 0.7 },
    { path: "/contact/", priority: 0.7 },
  ].map((route) => ({
    url: absoluteUrl(route.path),
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: route.priority,
  }));

  const contentPriority: Record<CollectionName, number> = {
    portfolio: 0.8,
    policies: 0.6,
    blogs: 0.6,
    vlogs: 0.5,
  };

  const contentRoutes = collections.flatMap((collection) =>
    getEntries(collection).map((entry) => ({
      url: absoluteUrl(`${collectionMeta[collection].href}/${entry.slug}/`),
      lastModified: entry.date ? new Date(entry.date) : now,
      changeFrequency: "monthly" as const,
      priority: contentPriority[collection],
    })),
  );

  return [...staticRoutes, ...contentRoutes];
}
