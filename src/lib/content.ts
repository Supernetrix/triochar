import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";

export type CollectionName = "portfolio" | "blogs" | "vlogs" | "policies";

export type ContentEntry = {
  collection: CollectionName;
  slug: string;
  title: string;
  summary: string;
  body: string;
  html?: string;
  date?: string;
  image?: string;
  gallery?: string[];
  tags: string[];
  draft: boolean;
  featured: boolean;
  seoTitle?: string;
  seoDescription?: string;
  projectType?: string;
  location?: string;
  carbonCreditType?: string;
  status?: string;
  registryId?: string;
  category?: string;
  author?: string;
  region?: string;
  effectiveDate?: string;
  videoUrl?: string;
  filterLocations: string[];
  filterEligibility: string[];
  filterStandards: string[];
  filterTypes: string[];
};

export type Taxonomy = {
  locationOptions: string[];
  eligibilityOptions: string[];
  standardOptions: string[];
  typeOptions: string[];
};

export const collectionMeta: Record<
  CollectionName,
  { label: string; singular: string; href: string; directory: string; description: string }
> = {
  portfolio: {
    label: "Portfolio",
    singular: "Project",
    href: "/portfolio",
    directory: "portfolio",
    description: "Bankable carbon credit projects with clear ownership, geography, and credit logic.",
  },
  policies: {
    label: "Policies",
    singular: "Policy",
    href: "/policies",
    directory: "policies",
    description: "Policy references and market signals that shape credible carbon procurement.",
  },
  blogs: {
    label: "Blogs",
    singular: "Post",
    href: "/blogs",
    directory: "blogs",
    description: "Editorial notes on carbon markets, project quality, and corporate decarbonisation.",
  },
  vlogs: {
    label: "Vlogs",
    singular: "Video",
    href: "/vlogs",
    directory: "vlogs",
    description: "Video-led field notes, project stories, and buyer education.",
  },
};

const contentRoot = path.join(process.cwd(), "content");

function readMarkdownFile(filePath: string): { data: Record<string, unknown>; body: string } {
  const raw = fs.readFileSync(filePath, "utf8");
  const parsed = matter(raw);
  return {
    data: parsed.data,
    body: parsed.content.trim(),
  };
}

function asString(value: unknown, fallback = "") {
  if (value instanceof Date) {
    return value.toISOString();
  }

  return typeof value === "string" && value.trim().length > 0 ? value : fallback;
}

function asBoolean(value: unknown, fallback = false) {
  return typeof value === "boolean" ? value : fallback;
}

function asStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter((item): item is string => typeof item === "string" && item.trim().length > 0);
}

function collectionDir(collection: CollectionName) {
  return path.join(contentRoot, collectionMeta[collection].directory);
}

function normalizeEntry(collection: CollectionName, filePath: string): ContentEntry {
  const { data, body } = readMarkdownFile(filePath);
  const fileSlug = path.basename(filePath, path.extname(filePath));
  const slug = asString(data.slug, fileSlug);

  return {
    collection,
    slug,
    title: asString(data.title, slug),
    summary: asString(data.summary),
    body,
    date: asString(data.date),
    image: asString(data.image),
    gallery: asStringArray(data.gallery),
    tags: asStringArray(data.tags),
    draft: asBoolean(data.draft),
    featured: asBoolean(data.featured),
    seoTitle: asString(data.seoTitle),
    seoDescription: asString(data.seoDescription),
    projectType: asString(data.projectType),
    location: asString(data.location),
    carbonCreditType: asString(data.carbonCreditType),
    status: asString(data.status),
    registryId: asString(data.registryId),
    category: asString(data.category),
    author: asString(data.author),
    region: asString(data.region),
    effectiveDate: asString(data.effectiveDate),
    videoUrl: asString(data.videoUrl),
    filterLocations: asStringArray(data.filterLocations),
    filterEligibility: asStringArray(data.filterEligibility),
    filterStandards: asStringArray(data.filterStandards),
    filterTypes: asStringArray(data.filterTypes),
  };
}

export function getTaxonomy(): Taxonomy {
  const filePath = path.join(contentRoot, "site", "filters.md");

  const empty: Taxonomy = {
    locationOptions: [],
    eligibilityOptions: [],
    standardOptions: [],
    typeOptions: [],
  };

  if (!fs.existsSync(filePath)) {
    return empty;
  }

  const { data } = readMarkdownFile(filePath);

  return {
    locationOptions: asStringArray(data.locationOptions),
    eligibilityOptions: asStringArray(data.eligibilityOptions),
    standardOptions: asStringArray(data.standardOptions),
    typeOptions: asStringArray(data.typeOptions),
  };
}

export function getEntries(collection: CollectionName, options: { includeDrafts?: boolean } = {}) {
  const dir = collectionDir(collection);

  if (!fs.existsSync(dir)) {
    return [];
  }

  return fs
    .readdirSync(dir)
    .filter((file) => file.endsWith(".md"))
    .map((file) => normalizeEntry(collection, path.join(dir, file)))
    .filter((entry) => options.includeDrafts || !entry.draft)
    .sort((a, b) => {
      if (a.featured !== b.featured) {
        return a.featured ? -1 : 1;
      }

      return new Date(b.date || "2000-01-01").getTime() - new Date(a.date || "2000-01-01").getTime();
    });
}

export async function markdownToHtml(markdown: string) {
  const processed = await remark().use(html, { sanitize: false }).process(markdown);
  return processed.toString();
}

export async function getEntryBySlug(collection: CollectionName, slug: string) {
  const entry = getEntries(collection, { includeDrafts: false }).find((item) => item.slug === slug);

  if (!entry) {
    return null;
  }

  return {
    ...entry,
    html: await markdownToHtml(entry.body),
  };
}

export function formatDate(value?: string) {
  if (!value) {
    return "";
  }

  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}
