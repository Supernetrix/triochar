import type { Metadata } from "next";
import { ContentDetailPage } from "@/components/content-detail-page";
import { getEntries, getEntryBySlug } from "@/lib/content";
import { createPageMetadata } from "@/lib/seo";

export const dynamicParams = false;

export function generateStaticParams() {
  return getEntries("vlogs").map((entry) => ({ slug: entry.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const entry = await getEntryBySlug("vlogs", slug);
  return createPageMetadata({
    title: entry?.seoTitle || entry?.title,
    description: entry?.seoDescription || entry?.summary,
    path: `/vlogs/${slug}/`,
    image: entry?.image || undefined,
  });
}

export default async function VlogDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <ContentDetailPage collection="vlogs" slug={slug} />;
}
