import { NextResponse } from "next/server";
import { assertCmsPassword, saveCmsMedia } from "@/lib/cms-storage";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const auth = assertCmsPassword(request.headers.get("x-cms-password"));

  if (!auth.ok) {
    return NextResponse.json({ ok: false, message: auth.message }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ ok: false, message: "No file uploaded." }, { status: 400 });
  }

  if (!file.type.startsWith("image/")) {
    return NextResponse.json({ ok: false, message: "Only image uploads are supported." }, { status: 400 });
  }

  const publicPath = await saveCmsMedia(file);
  return NextResponse.json({ ok: true, path: publicPath });
}
