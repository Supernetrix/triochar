import { NextResponse } from "next/server";
import { assertCmsPassword, getCmsMode } from "@/lib/cms-storage";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as { password?: string };
  const result = assertCmsPassword(body.password || null);

  if (!result.ok) {
    return NextResponse.json({ ok: false, message: result.message }, { status: 401 });
  }

  return NextResponse.json({ ok: true, mode: getCmsMode() });
}
