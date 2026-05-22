import { NextResponse } from "next/server";
import { CMS_COLLECTIONS, isCmsCollectionName } from "@/lib/cms-schema";
import { assertCmsPassword, getCmsMode, listCmsEntries } from "@/lib/cms-storage";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const auth = assertCmsPassword(request.headers.get("x-cms-password"));

  if (!auth.ok) {
    return NextResponse.json({ ok: false, message: auth.message }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const collection = searchParams.get("collection");
  const entries = await listCmsEntries(collection && isCmsCollectionName(collection) ? collection : undefined);

  return NextResponse.json({
    ok: true,
    mode: getCmsMode(),
    collections: CMS_COLLECTIONS,
    groups: entries,
  });
}
