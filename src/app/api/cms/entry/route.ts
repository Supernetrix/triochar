import { NextResponse } from "next/server";
import { isCmsCollectionName } from "@/lib/cms-schema";
import { assertCmsPassword, deleteCmsEntry, saveCmsEntry, slugify, type CmsEntry } from "@/lib/cms-storage";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const auth = assertCmsPassword(request.headers.get("x-cms-password"));

  if (!auth.ok) {
    return NextResponse.json({ ok: false, message: auth.message }, { status: 401 });
  }

  const body = (await request.json().catch(() => ({}))) as {
    collection?: string;
    originalSlug?: string;
    originalSourceFile?: string;
    entry?: Partial<CmsEntry>;
  };

  if (!body.collection || !isCmsCollectionName(body.collection)) {
    return NextResponse.json({ ok: false, message: "Invalid collection." }, { status: 400 });
  }

  const rawEntry = body.entry || {};
  const title = typeof rawEntry.title === "string" ? rawEntry.title.trim() : "";
  const slug = slugify(typeof rawEntry.slug === "string" && rawEntry.slug ? rawEntry.slug : title);

  if (!title || !slug) {
    return NextResponse.json({ ok: false, message: "Title and slug are required." }, { status: 400 });
  }

  const entry = await saveCmsEntry(
    body.collection,
    {
      ...rawEntry,
      collection: body.collection,
      sourceFile: typeof rawEntry.sourceFile === "string" ? rawEntry.sourceFile : "",
      slug,
      title,
      body: typeof rawEntry.body === "string" ? rawEntry.body : "",
    },
    body.originalSlug,
    body.originalSourceFile,
  );

  return NextResponse.json({ ok: true, entry });
}

export async function DELETE(request: Request) {
  const auth = assertCmsPassword(request.headers.get("x-cms-password"));

  if (!auth.ok) {
    return NextResponse.json({ ok: false, message: auth.message }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const collection = searchParams.get("collection");
  const slug = searchParams.get("slug");
  const sourceFile = searchParams.get("sourceFile") || (slug ? `${slugify(slug)}.md` : "");

  if (!collection || !isCmsCollectionName(collection) || !sourceFile) {
    return NextResponse.json({ ok: false, message: "Collection and source file are required." }, { status: 400 });
  }

  const deleted = await deleteCmsEntry(collection, sourceFile);

  if (!deleted) {
    return NextResponse.json(
      { ok: false, message: "This entry no longer exists. Refresh the CMS to load the latest content." },
      { status: 404 },
    );
  }

  return NextResponse.json({ ok: true });
}
