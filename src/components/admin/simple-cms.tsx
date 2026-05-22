"use client";

import Image from "next/image";
import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  BookOpen,
  CheckCircle2,
  Eye,
  FileText,
  Film,
  FolderKanban,
  ImagePlus,
  Loader2,
  Lock,
  Plus,
  RefreshCw,
  Save,
  Search,
  Trash2,
} from "lucide-react";
import { CMS_COLLECTIONS, type CmsCollection, type CmsCollectionName, type CmsField } from "@/lib/cms-schema";

type CmsEntry = Record<string, unknown> & {
  collection: CmsCollectionName;
  slug: string;
  title?: string;
  body?: string;
};

type EntryGroups = Array<{
  collection: CmsCollectionName;
  entries: CmsEntry[];
}>;

type SaveState = "idle" | "loading" | "saving" | "success" | "error";

const passwordStorageKey = "triochar-cms-password";

const collectionCopy: Record<
  CmsCollectionName,
  {
    description: string;
    guide: string;
  }
> = {
  portfolio: {
    description: "Projects shown on the portfolio page.",
    guide: "Add project basics, location, credit type, and one strong image.",
  },
  policies: {
    description: "Policy explainers and market notes.",
    guide: "Keep the summary short and put the full explanation in the body.",
  },
  blogs: {
    description: "Editorial articles for the knowledge page.",
    guide: "Use a clear title, readable summary, and helpful tags.",
  },
  vlogs: {
    description: "YouTube-linked video content.",
    guide: "Paste the YouTube URL and add a short text description.",
  },
};

function emptyEntry(collection: CmsCollection): CmsEntry {
  const today = new Date().toISOString().slice(0, 10);
  const entry: CmsEntry = {
    collection: collection.name,
    slug: "",
    title: "",
    summary: "",
    date: today,
    tags: [],
    featured: false,
    draft: true,
    body: "",
  };

  for (const field of collection.fields) {
    if (entry[field.name] !== undefined) {
      continue;
    }

    if (field.type === "boolean") {
      entry[field.name] = false;
    } else if (field.type === "tags") {
      entry[field.name] = [];
    } else {
      entry[field.name] = "";
    }
  }

  return entry;
}

function asTagText(value: unknown) {
  return Array.isArray(value) ? value.join(", ") : "";
}

function asString(value: unknown) {
  return typeof value === "string" ? value : value === undefined || value === null ? "" : String(value);
}

function collectionEntries(groups: EntryGroups, collection: CmsCollectionName) {
  return groups.find((group) => group.collection === collection)?.entries || [];
}

function fieldValue(entry: CmsEntry, name: string) {
  return asString(entry[name]);
}

function slugifyClient(value: string) {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function formatDate(value: unknown) {
  const raw = asString(value);

  if (!raw) {
    return "No date";
  }

  const date = new Date(raw);

  if (Number.isNaN(date.getTime())) {
    return raw.slice(0, 10);
  }

  return date.toLocaleDateString("en", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function dateInputValue(value: unknown) {
  const raw = asString(value);

  if (!raw) {
    return "";
  }

  if (/^\d{4}-\d{2}-\d{2}/.test(raw)) {
    return raw.slice(0, 10);
  }

  const date = new Date(raw);
  return Number.isNaN(date.getTime()) ? "" : date.toISOString().slice(0, 10);
}

function previewPath(collection: CmsCollection, entry: CmsEntry) {
  return `${collection.publicPath}/${entry.slug}/`;
}

function CollectionIcon({ name, size = 18 }: { name: CmsCollectionName; size?: number }) {
  if (name === "portfolio") {
    return <FolderKanban size={size} />;
  }

  if (name === "policies") {
    return <FileText size={size} />;
  }

  if (name === "blogs") {
    return <BookOpen size={size} />;
  }

  return <Film size={size} />;
}

function splitFields(collection: CmsCollection) {
  const basic = new Set(["title", "slug", "summary"]);
  const content = new Set(["videoUrl", "body"]);
  const media = new Set(["image"]);
  const grouped = new Set([...basic, ...content, ...media]);

  const basicFields = collection.fields.filter((field) => basic.has(field.name));
  const contentFields = collection.fields.filter((field) => content.has(field.name));
  const mediaFields = collection.fields.filter((field) => media.has(field.name));
  const detailFields = collection.fields.filter((field) => !grouped.has(field.name));

  return [
    {
      title: "Start Here",
      description: "The title, URL slug, and short summary are what users see first.",
      fields: basicFields,
    },
    {
      title: collection.name === "vlogs" ? "Video And Body" : "Main Content",
      description:
        collection.name === "vlogs"
          ? "Paste the YouTube link, then add a few lines of context."
          : "Write the main page content. Markdown headings, bullets, and links are supported.",
      fields: contentFields,
    },
    {
      title: "Image",
      description: "Upload one clear image for cards and detail pages.",
      fields: mediaFields,
    },
    {
      title: "Publishing Details",
      description: "Choose whether this is public, featured, tagged, and correctly categorized.",
      fields: detailFields,
    },
  ].filter((section) => section.fields.length > 0);
}

export function SimpleCms() {
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeCollectionName, setActiveCollectionName] = useState<CmsCollectionName>("portfolio");
  const [groups, setGroups] = useState<EntryGroups>([]);
  const [selectedEntry, setSelectedEntry] = useState<CmsEntry | null>(null);
  const [originalSlug, setOriginalSlug] = useState("");
  const [status, setStatus] = useState<SaveState>("idle");
  const [message, setMessage] = useState("");
  const [mode, setMode] = useState<"local" | "github" | "">("");
  const [searchQuery, setSearchQuery] = useState("");

  const activeCollection = useMemo(
    () => CMS_COLLECTIONS.find((collection) => collection.name === activeCollectionName) || CMS_COLLECTIONS[0],
    [activeCollectionName],
  );

  const entries = collectionEntries(groups, activeCollection.name);
  const filteredEntries = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    if (!query) {
      return entries;
    }

    return entries.filter((entry) =>
      [entry.title, entry.slug, entry.summary, entry.category, entry.status, entry.location]
        .map(asString)
        .join(" ")
        .toLowerCase()
        .includes(query),
    );
  }, [entries, searchQuery]);

  const draftCount = entries.filter((entry) => Boolean(entry.draft)).length;
  const publishedCount = entries.length - draftCount;
  const selectedIsNew = !originalSlug;
  const selectedIsDraft = Boolean(selectedEntry?.draft);
  const fieldSections = useMemo(() => splitFields(activeCollection), [activeCollection]);

  useEffect(() => {
    const savedPassword = window.sessionStorage.getItem(passwordStorageKey);

    if (!savedPassword) {
      return;
    }

    const restoredPassword = savedPassword;
    let cancelled = false;

    async function restoreSession() {
      setStatus("loading");

      try {
        const authResult = (await fetch("/api/cms/auth/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ password: restoredPassword }),
        }).then((response) => response.json())) as { ok: boolean; mode?: "local" | "github"; message?: string };

        if (!authResult.ok) {
          throw new Error(authResult.message || "Invalid password.");
        }

        const entriesResponse = await fetch("/api/cms/entries/", {
          headers: { "x-cms-password": restoredPassword },
        });
        const entriesResult = (await entriesResponse.json()) as {
          ok: boolean;
          mode?: "local" | "github";
          groups?: EntryGroups;
          message?: string;
        };

        if (!entriesResponse.ok || !entriesResult.ok) {
          throw new Error(entriesResult.message || "Unable to load entries.");
        }

        if (cancelled) {
          return;
        }

        const initialCollection = CMS_COLLECTIONS[0];
        const nextGroups = entriesResult.groups || [];
        const firstEntry = collectionEntries(nextGroups, initialCollection.name)[0] || null;

        setPassword(restoredPassword);
        setIsAuthenticated(true);
        setMode(entriesResult.mode || authResult.mode || "");
        setGroups(nextGroups);
        setActiveCollectionName(initialCollection.name);
        setSelectedEntry(firstEntry || emptyEntry(initialCollection));
        setOriginalSlug(firstEntry?.slug || "");
        setStatus("idle");
        setMessage("");
      } catch {
        if (!cancelled) {
          window.sessionStorage.removeItem(passwordStorageKey);
          setStatus("idle");
        }
      }
    }

    void restoreSession();

    return () => {
      cancelled = true;
    };
  }, []);

  async function api<T>(url: string, init: RequestInit = {}) {
    const response = await fetch(url, {
      ...init,
      headers: {
        "x-cms-password": password,
        ...(init.body instanceof FormData ? {} : { "Content-Type": "application/json" }),
        ...(init.headers || {}),
      },
    });
    const result = (await response.json().catch(() => ({}))) as T & { ok?: boolean; message?: string };

    if (!response.ok || result.ok === false) {
      throw new Error(result.message || "CMS request failed.");
    }

    return result;
  }

  async function authenticate(value = password, silent = false) {
    if (!value) {
      setMessage("Enter the CMS password.");
      return;
    }

    setStatus("loading");
    setMessage("");

    try {
      const result = (await fetch("/api/cms/auth/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: value }),
      }).then((response) => response.json())) as { ok: boolean; mode?: "local" | "github"; message?: string };

      if (!result.ok) {
        throw new Error(result.message || "Invalid password.");
      }

      window.sessionStorage.setItem(passwordStorageKey, value);
      setPassword(value);
      setIsAuthenticated(true);
      setMode(result.mode || "");
      await loadEntries(value);
      setStatus("idle");
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Unable to login.");
      window.sessionStorage.removeItem(passwordStorageKey);
      if (silent) {
        setPassword("");
      }
    }
  }

  async function loadEntries(passwordOverride?: string) {
    const response = await fetch("/api/cms/entries/", {
      headers: { "x-cms-password": passwordOverride || password },
    });
    const result = (await response.json()) as {
      ok: boolean;
      mode?: "local" | "github";
      groups?: EntryGroups;
      message?: string;
    };

    if (!response.ok || !result.ok) {
      throw new Error(result.message || "Unable to load entries.");
    }

    const nextGroups = result.groups || [];
    const nextEntries = collectionEntries(nextGroups, activeCollectionName);
    const preservedEntry =
      selectedEntry?.slug && nextEntries.find((entry) => entry.slug === selectedEntry.slug)
        ? nextEntries.find((entry) => entry.slug === selectedEntry.slug) || null
        : null;
    const firstEntry = preservedEntry || nextEntries[0] || null;

    setGroups(nextGroups);
    setMode(result.mode || "");
    setSelectedEntry(firstEntry || emptyEntry(activeCollection));
    setOriginalSlug(firstEntry?.slug || "");
  }

  function selectCollection(collectionName: CmsCollectionName) {
    const collection = CMS_COLLECTIONS.find((item) => item.name === collectionName) || CMS_COLLECTIONS[0];
    const nextEntry = collectionEntries(groups, collectionName)[0] || null;
    setActiveCollectionName(collectionName);
    setSearchQuery("");
    setSelectedEntry(nextEntry || emptyEntry(collection));
    setOriginalSlug(nextEntry?.slug || "");
    setMessage("");
  }

  function createEntry() {
    setSelectedEntry(emptyEntry(activeCollection));
    setOriginalSlug("");
    setMessage("");
  }

  function updateField(field: CmsField, value: unknown) {
    setSelectedEntry((current) => {
      if (!current) {
        return current;
      }

      const next = {
        ...current,
        [field.name]: value,
      };

      if (field.name === "title" && !originalSlug && !fieldValue(current, "slug")) {
        next.slug = slugifyClient(asString(value));
      }

      return next;
    });
  }

  function setDraft(value: boolean) {
    setSelectedEntry((current) => (current ? { ...current, draft: value } : current));
  }

  function handleInput(field: CmsField, event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    if (field.type === "boolean" && event.target instanceof HTMLInputElement) {
      updateField(field, event.target.checked);
      return;
    }

    if (field.type === "tags") {
      updateField(
        field,
        event.target.value
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean),
      );
      return;
    }

    updateField(field, event.target.value);
  }

  async function uploadImage(field: CmsField, event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    setStatus("saving");
    setMessage("Uploading image...");

    try {
      const result = await api<{ path: string }>("/api/cms/media/", {
        method: "POST",
        body: formData,
      });
      updateField(field, result.path);
      setStatus("success");
      setMessage("Image uploaded. Remember to save the entry.");
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Image upload failed.");
    } finally {
      event.target.value = "";
    }
  }

  async function saveEntry(event?: FormEvent<HTMLFormElement>) {
    event?.preventDefault();

    if (!selectedEntry) {
      return;
    }

    setStatus("saving");
    setMessage("");

    try {
      const result = await api<{ entry: CmsEntry }>("/api/cms/entry/", {
        method: "POST",
        body: JSON.stringify({
          collection: activeCollection.name,
          originalSlug,
          entry: selectedEntry,
        }),
      });
      setStatus("success");
      setMessage(mode === "github" ? "Saved to GitHub. Vercel will redeploy from this commit." : "Saved locally.");
      await loadEntries();
      setSelectedEntry(result.entry);
      setOriginalSlug(result.entry.slug);
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Unable to save entry.");
    }
  }

  async function deleteEntry() {
    if (!selectedEntry?.slug || !window.confirm(`Delete "${selectedEntry.title || selectedEntry.slug}"?`)) {
      return;
    }

    setStatus("saving");
    setMessage("");

    try {
      await api(`/api/cms/entry/?collection=${activeCollection.name}&slug=${encodeURIComponent(selectedEntry.slug)}`, {
        method: "DELETE",
      });
      setStatus("success");
      setMessage(mode === "github" ? "Deleted from GitHub. Vercel will redeploy from this commit." : "Deleted locally.");
      await loadEntries();
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Unable to delete entry.");
    }
  }

  async function refreshEntries() {
    setStatus("loading");
    setMessage("");

    try {
      await loadEntries();
      setStatus("idle");
      setMessage("Content refreshed.");
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Unable to refresh content.");
    }
  }

  if (!isAuthenticated) {
    return (
      <main className="grid min-h-screen place-items-center bg-[#eefbe8] px-6 text-[#1c2620]">
        <form
          onSubmit={(event) => {
            event.preventDefault();
            void authenticate();
          }}
          className="w-full max-w-md overflow-hidden rounded-[1.75rem] border border-[#2c5f3a]/12 bg-white shadow-[0_24px_70px_-42px_rgba(28,38,32,0.55)]"
        >
          <div className="border-b border-[#2c5f3a]/10 bg-[#f7fcf4] px-8 py-7">
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-[#1d2a22] text-[#dcfed2]">
              <Lock size={20} />
            </div>
            <p className="mt-6 text-xs font-bold uppercase tracking-[0.24em] text-[#9a7a44]">Triochar CMS</p>
            <h1 className="mt-2 font-serif text-4xl font-bold text-[#1c2620]">Welcome back</h1>
            <p className="mt-3 text-sm leading-relaxed text-[#1c2620]/68">
              Edit portfolio projects, policies, blogs, and vlogs from one simple dashboard.
            </p>
          </div>
          <div className="px-8 py-7">
            <label className="grid gap-2 text-xs font-bold uppercase tracking-wider text-[#1d2a22]/70">
              Admin Password
              <input
                autoFocus
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="h-13 rounded-2xl border border-[#2c5f3a]/16 bg-[#f6fbf5] px-4 text-base font-semibold outline-none transition focus:border-[#2c5f3a] focus:bg-white focus:ring-4 focus:ring-[#dcfed2]"
              />
            </label>
            <button
              type="submit"
              disabled={status === "loading"}
              className="mt-5 inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-[#1d2a22] text-xs font-bold uppercase tracking-widest text-white transition hover:bg-[#2c5f3a] disabled:opacity-60"
            >
              {status === "loading" ? <Loader2 size={15} className="animate-spin" /> : <Lock size={15} />}
              Enter Dashboard
            </button>
            {message ? (
              <p className="mt-4 rounded-2xl bg-red-50 p-3 text-sm font-semibold text-red-800">{message}</p>
            ) : null}
            <p className="mt-4 text-xs leading-relaxed text-[#1c2620]/50">
              Local development password defaults to <span className="font-bold">admin</span>. Production uses the
              password configured in Vercel.
            </p>
          </div>
        </form>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#eefbe8] text-[#1c2620]">
      <header className="border-b border-[#2c5f3a]/10 bg-white/82 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1480px] flex-col gap-5 px-5 py-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#9a7a44]">Triochar CMS</p>
            <h1 className="mt-1 font-serif text-4xl font-bold leading-none text-[#1c2620]">Content Dashboard</h1>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[#1c2620]/62">
              Choose a content type, select an entry, make edits, then save. Draft items stay hidden from public pages.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-2 rounded-full border border-[#2c5f3a]/12 bg-[#f6fbf5] px-4 py-2 text-xs font-bold uppercase tracking-wider text-[#1d2a22]/72">
              <span className="h-2 w-2 rounded-full bg-[#5e8d48]" />
              {mode === "github" ? "GitHub Sync" : "Local Files"}
            </span>
            <button
              type="button"
              onClick={() => void refreshEntries()}
              className="inline-flex items-center gap-2 rounded-full border border-[#2c5f3a]/12 bg-white px-4 py-2 text-xs font-bold uppercase tracking-wider text-[#1d2a22] transition hover:bg-[#f6fbf5]"
            >
              <RefreshCw size={14} />
              Refresh
            </button>
            <button
              type="button"
              onClick={() => {
                window.sessionStorage.removeItem(passwordStorageKey);
                setIsAuthenticated(false);
                setPassword("");
              }}
              className="rounded-full border border-[#2c5f3a]/12 bg-white px-4 py-2 text-xs font-bold uppercase tracking-wider text-[#1d2a22] transition hover:bg-[#f6fbf5]"
            >
              Lock
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-[1480px] gap-5 px-5 py-6 lg:grid-cols-[240px_330px_minmax(0,1fr)] 2xl:grid-cols-[280px_380px_minmax(0,1fr)]">
        <aside className="h-fit rounded-[1.35rem] border border-[#2c5f3a]/10 bg-white p-4 shadow-[0_14px_36px_-30px_rgba(28,38,32,0.6)] lg:sticky lg:top-5">
          <div className="flex items-center justify-between px-2">
            <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#9a7a44]">Content Types</p>
            <span className="rounded-full bg-[#dcfed2] px-2.5 py-1 text-[10px] font-bold text-[#1d2a22]/70">
              {groups.reduce((count, group) => count + group.entries.length, 0)} total
            </span>
          </div>
          <div className="mt-4 grid gap-2">
            {CMS_COLLECTIONS.map((collection) => {
              const count = collectionEntries(groups, collection.name).length;
              const drafts = collectionEntries(groups, collection.name).filter((entry) => Boolean(entry.draft)).length;
              const isActive = activeCollection.name === collection.name;

              return (
                <button
                  key={collection.name}
                  type="button"
                  onClick={() => selectCollection(collection.name)}
                  className={`group rounded-2xl border p-4 text-left transition ${
                    isActive
                      ? "border-[#1d2a22] bg-[#1d2a22] text-white shadow-sm"
                      : "border-[#2c5f3a]/8 bg-[#f7fbf5] text-[#1d2a22] hover:border-[#b9e2a9] hover:bg-[#effbe9]"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <span
                      className={`grid h-10 w-10 place-items-center rounded-xl ${
                        isActive ? "bg-white/12 text-[#dcfed2]" : "bg-white text-[#2c5f3a]"
                      }`}
                    >
                      <CollectionIcon name={collection.name} />
                    </span>
                    <span
                      className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${
                        isActive ? "bg-white/12 text-white" : "bg-[#dcfed2] text-[#1d2a22]/72"
                      }`}
                    >
                      {count}
                    </span>
                  </div>
                  <h2 className="mt-3 text-sm font-extrabold">{collection.label}</h2>
                  <p className={`mt-1 text-xs leading-relaxed ${isActive ? "text-white/68" : "text-[#1c2620]/58"}`}>
                    {collectionCopy[collection.name].description}
                  </p>
                  {drafts > 0 ? (
                    <p className={`mt-2 text-[10px] font-bold uppercase tracking-wider ${isActive ? "text-[#dcfed2]" : "text-[#9a7a44]"}`}>
                      {drafts} draft{drafts === 1 ? "" : "s"}
                    </p>
                  ) : null}
                </button>
              );
            })}
          </div>
        </aside>

        <aside className="h-fit rounded-[1.35rem] border border-[#2c5f3a]/10 bg-white p-4 shadow-[0_14px_36px_-30px_rgba(28,38,32,0.6)] lg:sticky lg:top-5">
          <div className="flex items-start justify-between gap-3 px-1">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#9a7a44]">
                {activeCollection.label}
              </p>
              <p className="mt-1 text-xs leading-relaxed text-[#1c2620]/56">{collectionCopy[activeCollection.name].guide}</p>
            </div>
            <button
              type="button"
              onClick={createEntry}
              className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-[#dcfed2] px-4 py-2 text-[11px] font-bold uppercase tracking-wider text-[#1d2a22] transition hover:bg-[#c8efbb]"
            >
              <Plus size={13} />
              New
            </button>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2">
            <div className="rounded-2xl bg-[#f6fbf5] p-3">
              <p className="text-[10px] font-bold uppercase tracking-wider text-[#1c2620]/48">Published</p>
              <p className="mt-1 text-2xl font-bold">{publishedCount}</p>
            </div>
            <div className="rounded-2xl bg-[#fff8ed] p-3">
              <p className="text-[10px] font-bold uppercase tracking-wider text-[#9a7a44]">Drafts</p>
              <p className="mt-1 text-2xl font-bold">{draftCount}</p>
            </div>
          </div>

          <label className="mt-4 flex h-11 items-center gap-2 rounded-2xl border border-[#2c5f3a]/12 bg-[#f7fbf5] px-3 text-[#1c2620]/56 focus-within:border-[#2c5f3a] focus-within:bg-white">
            <Search size={15} />
            <input
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder={`Search ${activeCollection.singular.toLowerCase()}s`}
              className="h-full min-w-0 flex-1 bg-transparent text-sm font-semibold text-[#1c2620] outline-none placeholder:text-[#1c2620]/38"
            />
          </label>

          <div className="mt-4 grid max-h-[62vh] gap-2 overflow-auto pr-1">
            {filteredEntries.length ? (
              filteredEntries.map((entry) => {
                const isSelected = selectedEntry?.slug === entry.slug && originalSlug;

                return (
                  <button
                    key={entry.slug}
                    type="button"
                    onClick={() => {
                      setSelectedEntry(entry);
                      setOriginalSlug(entry.slug);
                      setMessage("");
                    }}
                    className={`rounded-2xl border p-4 text-left transition ${
                      isSelected
                        ? "border-[#2c5f3a]/35 bg-[#e8fbdf]"
                        : "border-[#2c5f3a]/9 bg-[#f8fbf6] hover:border-[#b9e2a9] hover:bg-[#f0fbe9]"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <h2 className="text-sm font-extrabold leading-snug">{String(entry.title || entry.slug)}</h2>
                      <span
                        className={`rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider ${
                          entry.draft ? "bg-[#9a7a44]/12 text-[#9a7a44]" : "bg-[#dcfed2] text-[#2c5f3a]"
                        }`}
                      >
                        {entry.draft ? "Draft" : "Live"}
                      </span>
                    </div>
                    <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-[#1c2620]/60">
                      {String(entry.summary || "No summary yet.")}
                    </p>
                    <div className="mt-3 flex flex-wrap items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-[#1c2620]/42">
                      <span>{formatDate(entry.date)}</span>
                      {entry.featured ? <span className="text-[#9a7a44]">Featured</span> : null}
                    </div>
                  </button>
                );
              })
            ) : (
              <div className="rounded-2xl border border-dashed border-[#2c5f3a]/16 bg-[#f8fbf6] p-6 text-center">
                <Search className="mx-auto text-[#9a7a44]" size={18} />
                <h2 className="mt-3 text-sm font-bold">No matching entries</h2>
                <p className="mt-1 text-xs leading-relaxed text-[#1c2620]/55">Try a different search or create a new entry.</p>
              </div>
            )}
          </div>
        </aside>

        <section className="min-w-0 rounded-[1.35rem] border border-[#2c5f3a]/10 bg-white shadow-[0_14px_36px_-30px_rgba(28,38,32,0.6)]">
          {selectedEntry ? (
            <form onSubmit={(event) => void saveEntry(event)} className="min-w-0">
              <div className="border-b border-[#2c5f3a]/10 p-5 sm:p-7">
                <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-[#dcfed2] px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[#1d2a22]">
                        {selectedIsNew ? "New Entry" : "Editing"}
                      </span>
                      <span
                        className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider ${
                          selectedIsDraft ? "bg-[#fff4df] text-[#9a7a44]" : "bg-[#eefbe8] text-[#2c5f3a]"
                        }`}
                      >
                        {selectedIsDraft ? "Draft hidden from site" : "Published on site"}
                      </span>
                    </div>
                    <h2 className="mt-3 max-w-2xl font-serif text-4xl font-bold leading-tight text-[#1c2620]">
                      {String(selectedEntry.title || "Untitled")}
                    </h2>
                    <p className="mt-2 text-sm text-[#1c2620]/56">
                      {selectedIsNew ? "Fill the required fields, then save it as a draft or publish it." : previewPath(activeCollection, selectedEntry)}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {originalSlug ? (
                      <a
                        href={previewPath(activeCollection, selectedEntry)}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 rounded-full border border-[#2c5f3a]/14 bg-white px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-[#1d2a22] transition hover:bg-[#f6fbf5]"
                      >
                        <Eye size={14} />
                        Preview
                      </a>
                    ) : null}
                    {originalSlug ? (
                      <button
                        type="button"
                        onClick={() => void deleteEntry()}
                        className="inline-flex items-center gap-2 rounded-full border border-red-200 bg-red-50 px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-red-800 transition hover:bg-red-100"
                      >
                        <Trash2 size={14} />
                        Delete
                      </button>
                    ) : null}
                  </div>
                </div>

                <div className="mt-6 grid gap-3 rounded-2xl border border-[#2c5f3a]/10 bg-[#f7fbf5] p-3 sm:grid-cols-[1fr_auto] sm:items-center">
                  <div>
                    <p className="text-sm font-bold text-[#1c2620]">Publishing state</p>
                    <p className="text-xs leading-relaxed text-[#1c2620]/56">
                      Drafts are saved in the CMS but hidden from public pages.
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-2 rounded-full bg-white p-1">
                    <button
                      type="button"
                      onClick={() => setDraft(true)}
                      className={`rounded-full px-4 py-2 text-xs font-bold uppercase tracking-wider transition ${
                        selectedIsDraft ? "bg-[#1d2a22] text-white" : "text-[#1c2620]/60 hover:bg-[#f6fbf5]"
                      }`}
                    >
                      Draft
                    </button>
                    <button
                      type="button"
                      onClick={() => setDraft(false)}
                      className={`rounded-full px-4 py-2 text-xs font-bold uppercase tracking-wider transition ${
                        !selectedIsDraft ? "bg-[#2c5f3a] text-white" : "text-[#1c2620]/60 hover:bg-[#f6fbf5]"
                      }`}
                    >
                      Publish
                    </button>
                  </div>
                </div>
              </div>

              {message ? (
                <div
                  className={`mx-5 mt-5 flex items-start gap-3 rounded-2xl border p-4 text-sm font-semibold sm:mx-7 ${
                    status === "error"
                      ? "border-red-200 bg-red-50 text-red-800"
                      : status === "success"
                        ? "border-[#b9e2a9] bg-[#effbe9] text-[#1d2a22]"
                        : "border-[#2c5f3a]/10 bg-[#f6fbf5] text-[#1d2a22]/70"
                  }`}
                  role="status"
                >
                  {status === "error" ? <AlertCircle size={18} /> : <CheckCircle2 size={18} />}
                  <span>{message}</span>
                </div>
              ) : null}

              <div className="grid gap-5 p-5 sm:p-7">
                {fieldSections.map((section) => (
                  <section key={section.title} className="rounded-[1.15rem] border border-[#2c5f3a]/10 bg-[#fbfdf9] p-5">
                    <div className="mb-5 border-b border-[#2c5f3a]/8 pb-4">
                      <h3 className="font-serif text-2xl font-bold text-[#1c2620]">{section.title}</h3>
                      <p className="mt-1 text-sm leading-relaxed text-[#1c2620]/58">{section.description}</p>
                    </div>
                    <div className="grid gap-5">
                      {section.fields.map((field) => (
                        <FieldControl
                          key={field.name}
                          field={field}
                          entry={selectedEntry}
                          onChange={handleInput}
                          onUpload={uploadImage}
                        />
                      ))}
                    </div>
                  </section>
                ))}

                <div className="sticky bottom-4 z-10 flex flex-col gap-3 rounded-2xl border border-[#2c5f3a]/12 bg-white/95 p-3 shadow-[0_18px_50px_-30px_rgba(28,38,32,0.6)] backdrop-blur sm:flex-row sm:items-center sm:justify-between">
                  <div className="px-1">
                    <p className="text-sm font-bold text-[#1c2620]">{selectedIsDraft ? "Save draft" : "Save published entry"}</p>
                    <p className="text-xs text-[#1c2620]/56">
                      {mode === "github" ? "Saving commits this change to GitHub." : "Saving writes this change locally."}
                    </p>
                  </div>
                  <button
                    type="submit"
                    disabled={status === "saving"}
                    className="inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-full bg-[#1d2a22] px-7 py-3.5 text-xs font-bold uppercase tracking-wider text-white transition hover:bg-[#2c5f3a] disabled:opacity-60"
                  >
                    {status === "saving" ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                    {status === "saving" ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </div>
            </form>
          ) : (
            <div className="grid min-h-[520px] place-items-center p-8 text-center">
              <div>
                <FolderKanban className="mx-auto text-[#9a7a44]" />
                <h2 className="mt-4 font-serif text-3xl font-bold">Choose an entry</h2>
                <p className="mt-2 text-sm text-[#1c2620]/65">Select existing content or create a new entry.</p>
              </div>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

function FieldControl({
  field,
  entry,
  onChange,
  onUpload,
}: {
  field: CmsField;
  entry: CmsEntry;
  onChange: (field: CmsField, event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  onUpload: (field: CmsField, event: ChangeEvent<HTMLInputElement>) => Promise<void>;
}) {
  const inputClass =
    "w-full rounded-2xl border border-[#2c5f3a]/14 bg-white px-4 text-sm font-semibold text-[#1c2620] outline-none transition placeholder:text-[#1c2620]/35 focus:border-[#2c5f3a] focus:ring-4 focus:ring-[#dcfed2]";
  const label = (
    <span className="text-xs font-extrabold uppercase tracking-wider text-[#1d2a22]/70">
      {field.label} {field.required ? <span className="text-[#9a7a44]">*</span> : null}
    </span>
  );

  if (field.type === "boolean") {
    return (
      <label className="flex items-center justify-between gap-4 rounded-2xl border border-[#2c5f3a]/10 bg-white p-4">
        <span>
          {label}
          <span className="mt-1 block text-xs leading-relaxed text-[#1c2620]/52">
            {field.name === "draft"
              ? "Turn on to keep this hidden from public pages."
              : "Turn on to highlight this entry where supported."}
          </span>
        </span>
        <input
          type="checkbox"
          checked={Boolean(entry[field.name])}
          onChange={(event) => onChange(field, event)}
          className="h-5 w-5 shrink-0 accent-[#1d2a22]"
        />
      </label>
    );
  }

  if (field.type === "select") {
    return (
      <label className="grid gap-2">
        {label}
        <select
          value={fieldValue(entry, field.name)}
          onChange={(event) => onChange(field, event)}
          className={`${inputClass} h-12`}
        >
          <option value="">Select...</option>
          {field.options?.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </label>
    );
  }

  if (field.type === "textarea" || field.type === "markdown") {
    return (
      <label className="grid gap-2">
        {label}
        <textarea
          required={field.required}
          rows={field.type === "markdown" ? 14 : 4}
          value={fieldValue(entry, field.name)}
          onChange={(event) => onChange(field, event)}
          placeholder={field.type === "markdown" ? "Write the full content here..." : field.hint}
          className={`${inputClass} resize-y px-4 py-3 leading-relaxed`}
        />
        {field.type === "markdown" ? (
          <span className="text-xs text-[#1c2620]/52">Tip: use ## for headings, - for bullets, and blank lines between paragraphs.</span>
        ) : null}
      </label>
    );
  }

  if (field.type === "image") {
    const value = fieldValue(entry, field.name);

    return (
      <div className="grid gap-2">
        {label}
        <div className="grid gap-4 rounded-2xl border border-[#2c5f3a]/10 bg-white p-4">
          {value ? (
            <div className="relative aspect-[16/8] overflow-hidden rounded-xl border border-[#2c5f3a]/10 bg-[#eefbe8]">
              <Image src={value} alt="" fill sizes="(max-width: 900px) 100vw, 720px" className="object-cover" />
            </div>
          ) : (
            <div className="grid aspect-[16/8] place-items-center rounded-xl border border-dashed border-[#2c5f3a]/18 bg-[#f7fbf5] text-center">
              <div>
                <ImagePlus className="mx-auto text-[#9a7a44]" size={20} />
                <p className="mt-2 text-xs font-bold text-[#1c2620]/56">No image selected</p>
              </div>
            </div>
          )}
          <input
            value={value}
            onChange={(event) => onChange(field, event)}
            placeholder="/uploads/project-image.jpg"
            className={`${inputClass} h-11`}
          />
          <label className="inline-flex w-fit cursor-pointer items-center gap-2 rounded-full bg-[#1d2a22] px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-white transition hover:bg-[#2c5f3a]">
            <ImagePlus size={14} />
            Upload Image
            <input type="file" accept="image/*" className="hidden" onChange={(event) => void onUpload(field, event)} />
          </label>
        </div>
      </div>
    );
  }

  if (field.type === "tags") {
    const rawTags = entry[field.name];
    const tags = Array.isArray(rawTags) ? rawTags.map(asString).filter(Boolean) : [];

    return (
      <label className="grid gap-2">
        {label}
        <input
          value={asTagText(entry[field.name])}
          onChange={(event) => onChange(field, event)}
          placeholder="Biochar, Agriculture, India"
          className={`${inputClass} h-12`}
        />
        {tags.length ? (
          <span className="flex flex-wrap gap-1.5">
            {tags.map((tag) => (
              <span key={tag} className="rounded-full bg-[#dcfed2] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[#1d2a22]/72">
                {tag}
              </span>
            ))}
          </span>
        ) : (
          <span className="text-xs text-[#1c2620]/52">Separate tags with commas.</span>
        )}
      </label>
    );
  }

  return (
    <label className="grid gap-2">
      {label}
      <input
        required={field.required}
        type={field.type === "date" ? "date" : "text"}
        value={field.type === "date" ? dateInputValue(entry[field.name]) : fieldValue(entry, field.name)}
        onChange={(event) => onChange(field, event)}
        placeholder={field.hint}
        className={`${inputClass} h-12`}
      />
      {field.hint ? <span className="text-xs text-[#1c2620]/52">{field.hint}</span> : null}
    </label>
  );
}
