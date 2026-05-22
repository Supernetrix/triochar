import type { Metadata } from "next";
import { ContentDetailPage } from "@/components/content-detail-page";
import { getEntries, getEntryBySlug } from "@/lib/content";

export const dynamicParams = false;

export function generateStaticParams() {
  return getEntries("vlogs").map((entry) => ({ slug: entry.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const entry = await getEntryBySlug("vlogs", slug);
  return {
    title: entry?.seoTitle || entry?.title,
    description: entry?.seoDescription || entry?.summary,
  };
}

export default async function VlogDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <ContentDetailPage collection="vlogs" slug={slug} />;
}
