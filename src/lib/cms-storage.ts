import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import { normalizeCmsImagePath } from "@/lib/cms-media";
import { CMS_COLLECTIONS, getCmsCollection, type CmsCollectionName } from "@/lib/cms-schema";

export type CmsEntry = Record<string, unknown> & {
  collection: CmsCollectionName;
  sourceFile: string;
  slug: string;
  body: string;
};

const contentRoot = path.join(process.cwd(), "content");
const uploadRoot = path.join(process.cwd(), "public", "uploads");

function gitHubConfig() {
  return {
    token: process.env.GITHUB_TOKEN || process.env.GH_TOKEN || "",
    repo: process.env.GITHUB_REPO || "",
    branch: process.env.GITHUB_BRANCH || "main",
    committerName: process.env.GITHUB_COMMITTER_NAME || "Climate Assets CMS",
    committerEmail: process.env.GITHUB_COMMITTER_EMAIL || "Partnerships@climate-assets.com",
  };
}

function shouldUseGitHub() {
  const config = gitHubConfig();
  return Boolean(config.token && config.repo);
}

export function getCmsMode() {
  return shouldUseGitHub() ? "github" : "local";
}

export function getAdminPassword() {
  return process.env.CMS_ADMIN_PASSWORD || (process.env.NODE_ENV === "production" ? "" : "admin");
}

export function assertCmsPassword(password: string | null) {
  const configuredPassword = getAdminPassword();

  if (!configuredPassword) {
    return {
      ok: false,
      message: "CMS_ADMIN_PASSWORD is not configured.",
    };
  }

  if (password !== configuredPassword) {
    return {
      ok: false,
      message: "Invalid CMS password.",
    };
  }

  return { ok: true, message: "" };
}

export function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function collectionPath(collection: CmsCollectionName) {
  const meta = getCmsCollection(collection);

  if (!meta) {
    throw new Error(`Unknown collection: ${collection}`);
  }

  return `content/${meta.directory}`;
}

function entryPath(collection: CmsCollectionName, slug: string) {
  const meta = getCmsCollection(collection);

  if (meta?.singleton && meta.singletonFile) {
    return `${collectionPath(collection)}/${meta.singletonFile}`;
  }

  return `${collectionPath(collection)}/${slugify(slug)}.md`;
}

function entryPathFromSourceFile(collection: CmsCollectionName, sourceFile: string) {
  const fileName = path.basename(sourceFile);

  if (fileName !== sourceFile || path.extname(fileName).toLowerCase() !== ".md") {
    throw new Error("Invalid CMS source file.");
  }

  return `${collectionPath(collection)}/${fileName}`;
}

function localEntryPath(collection: CmsCollectionName, slug: string) {
  return path.join(process.cwd(), entryPath(collection, slug));
}

function localEntryPathFromSourceFile(collection: CmsCollectionName, sourceFile: string) {
  return path.join(process.cwd(), entryPathFromSourceFile(collection, sourceFile));
}

function parseMarkdown(collection: CmsCollectionName, filePath: string, markdown: string): CmsEntry {
  const parsed = matter(markdown);
  const fileSlug = path.basename(filePath, ".md");
  const slug = typeof parsed.data.slug === "string" && parsed.data.slug ? parsed.data.slug : fileSlug;

  return {
    ...parsed.data,
    collection,
    sourceFile: path.basename(filePath),
    slug,
    body: parsed.content.trim(),
  };
}

function cleanEntryForMarkdown(entry: CmsEntry) {
  const frontmatter: Record<string, unknown> = { ...entry };
  const body = typeof frontmatter.body === "string" ? frontmatter.body : "";
  const cleaned: Record<string, unknown> = {};
  delete frontmatter.body;
  delete frontmatter.collection;
  delete frontmatter.sourceFile;

  for (const [key, value] of Object.entries(frontmatter)) {
    if (value === undefined || value === null) {
      continue;
    }

    cleaned[key] = value;
  }

  return matter.stringify(body || "", cleaned);
}

function normalizeEntryImageFields(collection: CmsCollectionName, entry: CmsEntry): CmsEntry {
  const fields = getCmsCollection(collection)?.fields || [];
  const normalized: CmsEntry = { ...entry };

  for (const field of fields) {
    if (field.type === "image") {
      normalized[field.name] = normalizeCmsImagePath(normalized[field.name]);
    }
  }

  return normalized;
}

async function localListEntries(collection: CmsCollectionName) {
  const dir = path.join(contentRoot, getCmsCollection(collection)?.directory || "");
  const meta = getCmsCollection(collection);

  try {
    if (meta?.singleton && meta.singletonFile) {
      const filePath = path.join(dir, meta.singletonFile);
      return [parseMarkdown(collection, meta.singletonFile, await fs.readFile(filePath, "utf8"))];
    }

    const files = await fs.readdir(dir);
    const entries = await Promise.all(
      files
        .filter((file) => file.endsWith(".md"))
        .map(async (file) => parseMarkdown(collection, file, await fs.readFile(path.join(dir, file), "utf8"))),
    );

    return sortEntries(entries);
  } catch {
    return [];
  }
}

async function localSaveEntry(
  collection: CmsCollectionName,
  entry: CmsEntry,
  originalSlug?: string,
  originalSourceFile?: string,
) {
  const meta = getCmsCollection(collection);
  const finalSlug = meta?.singleton ? "home" : slugify(entry.slug || String(entry.title || "untitled"));
  const finalEntry = normalizeEntryImageFields(collection, { ...entry, slug: finalSlug });
  const targetPath = localEntryPath(collection, finalSlug);
  const originalPath = originalSourceFile
    ? localEntryPathFromSourceFile(collection, originalSourceFile)
    : originalSlug
      ? localEntryPath(collection, originalSlug)
      : targetPath;

  await fs.mkdir(path.dirname(targetPath), { recursive: true });
  await fs.writeFile(targetPath, cleanEntryForMarkdown(finalEntry), "utf8");

  if (originalPath !== targetPath) {
    await fs.rm(originalPath, { force: true });
  }

  return parseMarkdown(collection, `${finalSlug}.md`, await fs.readFile(targetPath, "utf8"));
}

async function localDeleteEntry(collection: CmsCollectionName, sourceFile: string) {
  if (getCmsCollection(collection)?.singleton) {
    return false;
  }

  try {
    await fs.unlink(localEntryPathFromSourceFile(collection, sourceFile));
    return true;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      return false;
    }

    throw error;
  }
}

async function localSaveMedia(file: File) {
  const safeName = safeFileName(file.name);
  const fileName = `${Date.now()}-${safeName}`;
  const targetPath = path.join(uploadRoot, fileName);
  await fs.mkdir(uploadRoot, { recursive: true });
  await fs.writeFile(targetPath, Buffer.from(await file.arrayBuffer()));
  return `/uploads/${fileName}`;
}

function sortEntries(entries: CmsEntry[]) {
  return entries.sort((a, b) => {
    const aFeatured = Boolean(a.featured);
    const bFeatured = Boolean(b.featured);

    if (aFeatured !== bFeatured) {
      return aFeatured ? -1 : 1;
    }

    return new Date(String(b.date || "2000-01-01")).getTime() - new Date(String(a.date || "2000-01-01")).getTime();
  });
}

function gitHubHeaders() {
  return {
    Authorization: `Bearer ${gitHubConfig().token}`,
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    "Content-Type": "application/json",
  };
}

function encodeRepoPath(filePath: string) {
  return filePath.split("/").map(encodeURIComponent).join("/");
}

async function gitHubRequest<T>(filePath: string, init?: RequestInit) {
  const config = gitHubConfig();
  const queryStart = filePath.indexOf("?");
  const rawPath = queryStart >= 0 ? filePath.slice(0, queryStart) : filePath;
  const query = queryStart >= 0 ? filePath.slice(queryStart) : "";
  const url = `https://api.github.com/repos/${config.repo}/contents/${encodeRepoPath(rawPath)}${query}`;
  const response = await fetch(url, {
    ...init,
    headers: {
      ...gitHubHeaders(),
      ...(init?.headers || {}),
    },
  });

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`GitHub API failed (${response.status}): ${text}`);
  }

  return (await response.json()) as T;
}

type GitHubFile = {
  path: string;
  name: string;
  type: "file" | "dir";
  sha: string;
  content?: string;
  encoding?: string;
};

async function gitHubReadFile(filePath: string) {
  const file = await gitHubRequest<GitHubFile>(`${filePath}?ref=${encodeURIComponent(gitHubConfig().branch)}`);

  if (!file?.content) {
    return null;
  }

  return Buffer.from(file.content, "base64").toString("utf8");
}

async function gitHubListEntries(collection: CmsCollectionName) {
  const meta = getCmsCollection(collection);

  if (meta?.singleton && meta.singletonFile) {
    const filePath = `${collectionPath(collection)}/${meta.singletonFile}`;
    const content = await gitHubReadFile(filePath);
    return content ? [parseMarkdown(collection, filePath, content)] : [];
  }

  const dirPath = `${collectionPath(collection)}?ref=${encodeURIComponent(gitHubConfig().branch)}`;
  const files = await gitHubRequest<GitHubFile[]>(dirPath);

  if (!Array.isArray(files)) {
    return [];
  }

  const entries = await Promise.all(
    files
      .filter((file) => file.type === "file" && file.name.endsWith(".md"))
      .map(async (file) => parseMarkdown(collection, file.path, (await gitHubReadFile(file.path)) || "")),
  );

  return sortEntries(entries);
}

async function gitHubPutFile(filePath: string, content: Buffer | string, message: string) {
  const config = gitHubConfig();
  const currentFile = await gitHubRequest<GitHubFile>(`${filePath}?ref=${encodeURIComponent(config.branch)}`);
  const payload: Record<string, unknown> = {
    message,
    content: Buffer.isBuffer(content) ? content.toString("base64") : Buffer.from(content).toString("base64"),
    branch: config.branch,
    committer: {
      name: config.committerName,
      email: config.committerEmail,
    },
  };

  if (currentFile?.sha) {
    payload.sha = currentFile.sha;
  }

  await gitHubRequest(filePath, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

async function gitHubDeleteFile(filePath: string, message: string) {
  const config = gitHubConfig();
  const currentFile = await gitHubRequest<GitHubFile>(`${filePath}?ref=${encodeURIComponent(config.branch)}`);

  if (!currentFile?.sha) {
    return false;
  }

  await gitHubRequest(filePath, {
    method: "DELETE",
    body: JSON.stringify({
      message,
      sha: currentFile.sha,
      branch: config.branch,
      committer: {
        name: config.committerName,
        email: config.committerEmail,
      },
    }),
  });

  return true;
}

async function gitHubSaveEntry(
  collection: CmsCollectionName,
  entry: CmsEntry,
  originalSlug?: string,
  originalSourceFile?: string,
) {
  const meta = getCmsCollection(collection);
  const finalSlug = meta?.singleton ? "home" : slugify(entry.slug || String(entry.title || "untitled"));
  const finalEntry = normalizeEntryImageFields(collection, { ...entry, slug: finalSlug });
  const targetPath = entryPath(collection, finalSlug);
  const originalPath = originalSourceFile
    ? entryPathFromSourceFile(collection, originalSourceFile)
    : originalSlug
      ? entryPath(collection, originalSlug)
      : targetPath;
  const message = `chore(cms): update ${collection}/${finalSlug}`;

  await gitHubPutFile(targetPath, cleanEntryForMarkdown(finalEntry), message);

  if (!meta?.singleton && originalPath !== targetPath) {
    await gitHubDeleteFile(originalPath, `chore(cms): remove ${collection}/${path.basename(originalPath, ".md")}`);
  }

  return { ...finalEntry, sourceFile: path.basename(targetPath) };
}

async function gitHubSaveMedia(file: File) {
  const safeName = safeFileName(file.name);
  const fileName = `${Date.now()}-${safeName}`;
  const filePath = `public/uploads/${fileName}`;
  await gitHubPutFile(filePath, Buffer.from(await file.arrayBuffer()), `chore(cms): upload ${fileName}`);
  return `/uploads/${fileName}`;
}

function safeFileName(value: string) {
  const extension = path.extname(value).toLowerCase();
  const base = path.basename(value, extension);
  const safeBase = slugify(base) || "upload";
  const safeExtension = extension.replace(/[^a-z0-9.]/g, "") || ".bin";
  return `${safeBase}${safeExtension}`;
}

export async function listCmsEntries(collection?: CmsCollectionName) {
  const collections = collection ? [collection] : CMS_COLLECTIONS.map((item) => item.name);
  const entries = await Promise.all(
    collections.map(async (collectionName) => ({
      collection: collectionName,
      entries: shouldUseGitHub() ? await gitHubListEntries(collectionName) : await localListEntries(collectionName),
    })),
  );

  return entries;
}

export async function saveCmsEntry(
  collection: CmsCollectionName,
  entry: CmsEntry,
  originalSlug?: string,
  originalSourceFile?: string,
) {
  return shouldUseGitHub()
    ? gitHubSaveEntry(collection, entry, originalSlug, originalSourceFile)
    : localSaveEntry(collection, entry, originalSlug, originalSourceFile);
}

export async function deleteCmsEntry(collection: CmsCollectionName, sourceFile: string) {
  if (getCmsCollection(collection)?.singleton) {
    return false;
  }

  return shouldUseGitHub()
    ? gitHubDeleteFile(
        entryPathFromSourceFile(collection, sourceFile),
        `chore(cms): delete ${collection}/${path.basename(sourceFile, ".md")}`,
      )
    : localDeleteEntry(collection, sourceFile);
}

export async function saveCmsMedia(file: File) {
  return shouldUseGitHub() ? gitHubSaveMedia(file) : localSaveMedia(file);
}
