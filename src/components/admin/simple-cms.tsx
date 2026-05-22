"use client";

import { ChangeEvent, FormEvent, useMemo, useState } from "react";
import { Edit3, Eye, ImagePlus, Loader2, Lock, Plus, Save, Trash2 } from "lucide-react";
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

function emptyEntry(collection: CmsCollection): CmsEntry {
  const now = new Date().toISOString();
  const entry: CmsEntry = {
    collection: collection.name,
    slug: "",
    title: "",
    summary: "",
    date: now,
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

function collectionEntries(groups: EntryGroups, collection: CmsCollectionName) {
  return groups.find((group) => group.collection === collection)?.entries || [];
}

function fieldValue(entry: CmsEntry, name: string) {
  const value = entry[name];
  return typeof value === "string" ? value : "";
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

  const activeCollection = useMemo(
    () => CMS_COLLECTIONS.find((collection) => collection.name === activeCollectionName) || CMS_COLLECTIONS[0],
    [activeCollectionName],
  );
  const entries = collectionEntries(groups, activeCollection.name);

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
      const result = await fetch("/api/cms/auth/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: value }),
      }).then((response) => response.json()) as { ok: boolean; mode?: "local" | "github"; message?: string };

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

    setGroups(result.groups || []);
    setMode(result.mode || "");
    const firstEntry = collectionEntries(result.groups || [], activeCollectionName)[0] || null;
    setSelectedEntry(firstEntry);
    setOriginalSlug(firstEntry?.slug || "");
  }

  function selectCollection(collectionName: CmsCollectionName) {
    const collection = CMS_COLLECTIONS.find((item) => item.name === collectionName) || CMS_COLLECTIONS[0];
    const nextEntry = collectionEntries(groups, collectionName)[0] || null;
    setActiveCollectionName(collectionName);
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

      return {
        ...current,
        [field.name]: value,
      };
    });
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
      setMessage("Image uploaded.");
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Image upload failed.");
    } finally {
      event.target.value = "";
    }
  }

  async function saveEntry(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

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

  if (!isAuthenticated) {
    return (
      <main className="grid min-h-screen place-items-center bg-[#dcfed2] px-6">
        <form
          onSubmit={(event) => {
            event.preventDefault();
            void authenticate();
          }}
          className="w-full max-w-md rounded-2xl border border-[#2c5f3a]/15 bg-white p-8 shadow-[0_24px_60px_-36px_rgba(28,38,32,0.5)]"
        >
          <div className="grid h-12 w-12 place-items-center rounded-xl bg-[#1d2a22] text-[#dcfed2]">
            <Lock size={20} />
          </div>
          <h1 className="mt-6 font-serif text-3xl font-bold text-[#1c2620]">Triochar CMS</h1>
          <p className="mt-2 text-sm leading-relaxed text-[#1c2620]/70">
            Enter the admin password to edit portfolio projects, policies, blogs, and vlogs.
          </p>
          <label className="mt-7 grid gap-2 text-xs font-bold uppercase tracking-wider text-[#1d2a22]/70">
            Password
            <input
              autoFocus
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="h-12 rounded-xl border border-[#2c5f3a]/16 bg-[#f6fbf5] px-4 text-base font-semibold outline-none transition focus:border-[#2c5f3a]"
            />
          </label>
          <button
            type="submit"
            disabled={status === "loading"}
            className="mt-5 inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-[#1d2a22] text-xs font-bold uppercase tracking-widest text-white transition hover:bg-[#2c5f3a] disabled:opacity-60"
          >
            {status === "loading" ? <Loader2 size={15} className="animate-spin" /> : <Lock size={15} />}
            Enter CMS
          </button>
          {message ? <p className="mt-4 rounded-xl bg-red-50 p-3 text-sm font-semibold text-red-800">{message}</p> : null}
          <p className="mt-4 text-xs leading-relaxed text-[#1c2620]/52">
            Local development password defaults to <span className="font-bold">admin</span>. Production uses the
            password configured in Vercel.
          </p>
        </form>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#dcfed2] text-[#1c2620]">
      <header className="border-b border-[#2c5f3a]/12 bg-[#eaf9e1]/85 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-5 py-5 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#9a7a44]">Triochar CMS</p>
            <h1 className="mt-1 font-serif text-3xl font-bold">Content Dashboard</h1>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-full border border-[#2c5f3a]/14 bg-white/70 px-4 py-2 text-xs font-bold uppercase tracking-wider text-[#1d2a22]/70">
              Mode: {mode || "checking"}
            </span>
            <button
              type="button"
              onClick={() => {
                window.sessionStorage.removeItem(passwordStorageKey);
                setIsAuthenticated(false);
                setPassword("");
              }}
              className="rounded-full border border-[#2c5f3a]/14 bg-white px-4 py-2 text-xs font-bold uppercase tracking-wider text-[#1d2a22] transition hover:bg-[#f6fbf5]"
            >
              Lock
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-7xl gap-6 px-5 py-6 lg:grid-cols-[260px_330px_1fr]">
        <aside className="rounded-2xl border border-[#2c5f3a]/12 bg-white p-4 shadow-sm">
          <p className="px-2 text-[11px] font-bold uppercase tracking-[0.2em] text-[#9a7a44]">Collections</p>
          <div className="mt-4 grid gap-2">
            {CMS_COLLECTIONS.map((collection) => (
              <button
                key={collection.name}
                type="button"
                onClick={() => selectCollection(collection.name)}
                className={`rounded-xl px-4 py-3 text-left text-sm font-bold transition ${
                  activeCollection.name === collection.name
                    ? "bg-[#1d2a22] text-white"
                    : "bg-[#f6fbf5] text-[#1d2a22]/72 hover:bg-[#dcfed2]"
                }`}
              >
                {collection.label}
              </button>
            ))}
          </div>
        </aside>

        <aside className="rounded-2xl border border-[#2c5f3a]/12 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#9a7a44]">{activeCollection.label}</p>
            <button
              type="button"
              onClick={createEntry}
              className="inline-flex items-center gap-1.5 rounded-full bg-[#dcfed2] px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-[#1d2a22]"
            >
              <Plus size={13} />
              New
            </button>
          </div>
          <div className="mt-4 grid max-h-[70vh] gap-2 overflow-auto pr-1">
            {entries.map((entry) => (
              <button
                key={entry.slug}
                type="button"
                onClick={() => {
                  setSelectedEntry(entry);
                  setOriginalSlug(entry.slug);
                  setMessage("");
                }}
                className={`rounded-xl border p-4 text-left transition ${
                  selectedEntry?.slug === entry.slug && originalSlug
                    ? "border-[#2c5f3a]/24 bg-[#dcfed2]/60"
                    : "border-[#2c5f3a]/10 bg-[#f6fbf5] hover:bg-[#eefbe8]"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <h2 className="text-sm font-bold leading-snug">{String(entry.title || entry.slug)}</h2>
                  {entry.draft ? (
                    <span className="rounded bg-[#9a7a44]/12 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-[#9a7a44]">
                      Draft
                    </span>
                  ) : null}
                </div>
                <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-[#1c2620]/65">
                  {String(entry.summary || "No summary yet.")}
                </p>
              </button>
            ))}
          </div>
        </aside>

        <section className="rounded-2xl border border-[#2c5f3a]/12 bg-white p-5 shadow-sm">
          {selectedEntry ? (
            <form onSubmit={saveEntry}>
              <div className="flex flex-col gap-4 border-b border-[#2c5f3a]/12 pb-5 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#9a7a44]">
                    {originalSlug ? "Edit entry" : "New entry"}
                  </p>
                  <h2 className="mt-1 font-serif text-3xl font-bold">{String(selectedEntry.title || "Untitled")}</h2>
                </div>
                <div className="flex flex-wrap gap-2">
                  {originalSlug ? (
                    <a
                      href={`${activeCollection.publicPath}/${selectedEntry.slug}`}
                      target="_blank"
                      className="inline-flex items-center gap-2 rounded-full border border-[#2c5f3a]/14 px-4 py-2 text-xs font-bold uppercase tracking-wider text-[#1d2a22]"
                    >
                      <Eye size={14} />
                      Preview
                    </a>
                  ) : null}
                  {originalSlug ? (
                    <button
                      type="button"
                      onClick={() => void deleteEntry()}
                      className="inline-flex items-center gap-2 rounded-full border border-red-200 bg-red-50 px-4 py-2 text-xs font-bold uppercase tracking-wider text-red-800"
                    >
                      <Trash2 size={14} />
                      Delete
                    </button>
                  ) : null}
                  <button
                    type="submit"
                    disabled={status === "saving"}
                    className="inline-flex items-center gap-2 rounded-full bg-[#1d2a22] px-5 py-2 text-xs font-bold uppercase tracking-wider text-white transition hover:bg-[#2c5f3a] disabled:opacity-60"
                  >
                    {status === "saving" ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                    Save
                  </button>
                </div>
              </div>

              {message ? (
                <p
                  className={`mt-4 rounded-xl p-4 text-sm font-semibold ${
                    status === "error"
                      ? "bg-red-50 text-red-800"
                      : status === "success"
                      ? "bg-[#dcfed2] text-[#1d2a22]"
                      : "bg-[#f6fbf5] text-[#1d2a22]/70"
                  }`}
                >
                  {message}
                </p>
              ) : null}

              <div className="mt-6 grid gap-5">
                {activeCollection.fields.map((field) => (
                  <FieldControl
                    key={field.name}
                    field={field}
                    entry={selectedEntry}
                    onChange={handleInput}
                    onUpload={uploadImage}
                  />
                ))}
              </div>
            </form>
          ) : (
            <div className="grid min-h-[420px] place-items-center text-center">
              <div>
                <Edit3 className="mx-auto text-[#9a7a44]" />
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
  const label = (
    <span className="text-xs font-bold uppercase tracking-wider text-[#1d2a22]/72">
      {field.label} {field.required ? <span className="text-[#9a7a44]">*</span> : null}
    </span>
  );

  if (field.type === "boolean") {
    return (
      <label className="flex items-center gap-3 rounded-xl border border-[#2c5f3a]/12 bg-[#f6fbf5] p-4">
        <input
          type="checkbox"
          checked={Boolean(entry[field.name])}
          onChange={(event) => onChange(field, event)}
          className="h-4 w-4 accent-[#1d2a22]"
        />
        {label}
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
          className="h-12 rounded-xl border border-[#2c5f3a]/14 bg-[#f6fbf5] px-4 text-sm font-semibold outline-none focus:border-[#2c5f3a]"
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
          rows={field.type === "markdown" ? 12 : 4}
          value={fieldValue(entry, field.name)}
          onChange={(event) => onChange(field, event)}
          className="rounded-xl border border-[#2c5f3a]/14 bg-[#f6fbf5] px-4 py-3 text-sm font-medium leading-relaxed outline-none focus:border-[#2c5f3a]"
        />
      </label>
    );
  }

  if (field.type === "image") {
    return (
      <div className="grid gap-2">
        {label}
        <div className="grid gap-3 rounded-xl border border-[#2c5f3a]/12 bg-[#f6fbf5] p-4">
          <input
            value={fieldValue(entry, field.name)}
            onChange={(event) => onChange(field, event)}
            placeholder="/uploads/project-image.jpg"
            className="h-11 rounded-lg border border-[#2c5f3a]/14 bg-white px-3 text-sm font-semibold outline-none focus:border-[#2c5f3a]"
          />
          <label className="inline-flex w-fit cursor-pointer items-center gap-2 rounded-full bg-[#1d2a22] px-4 py-2 text-xs font-bold uppercase tracking-wider text-white transition hover:bg-[#2c5f3a]">
            <ImagePlus size={14} />
            Upload Image
            <input type="file" accept="image/*" className="hidden" onChange={(event) => void onUpload(field, event)} />
          </label>
        </div>
      </div>
    );
  }

  return (
    <label className="grid gap-2">
      {label}
      <input
        required={field.required}
        type={field.type === "date" ? "text" : "text"}
        value={field.type === "tags" ? asTagText(entry[field.name]) : fieldValue(entry, field.name)}
        onChange={(event) => onChange(field, event)}
        placeholder={field.hint}
        className="h-12 rounded-xl border border-[#2c5f3a]/14 bg-[#f6fbf5] px-4 text-sm font-semibold outline-none focus:border-[#2c5f3a]"
      />
      {field.hint ? <span className="text-xs text-[#1c2620]/55">{field.hint}</span> : null}
    </label>
  );
}
