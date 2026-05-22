import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { VlogEmbed } from "@/components/vlog-embed";
import { collectionMeta, formatDate, getEntryBySlug, type CollectionName } from "@/lib/content";

export async function ContentDetailPage({
  collection,
  slug,
}: {
  collection: CollectionName;
  slug: string;
}) {
  const entry = await getEntryBySlug(collection, slug);
  const meta = collectionMeta[collection];

  if (!entry) {
    notFound();
  }

  const isVlog = collection === "vlogs";

  return (
    <article>
      <section className="relative overflow-hidden border-b border-[var(--line)]">
        <div className="hero-veil pointer-events-none absolute inset-0" aria-hidden />
        <div className="container-shell relative py-16 md:py-18">
          <Link
            href="/knowledge"
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[color:var(--ink)]/68 transition-colors hover:text-[color:var(--gold)]"
          >
            <ArrowLeft size={15} />
            Back to Knowledge
          </Link>
          <div className="mt-9 max-w-3xl">
            <div className="eyebrow">{entry.category || entry.region || meta.singular}</div>
            <h1 className="font-display mt-5 text-balance text-4xl leading-[1.06] text-[color:var(--ink)] md:text-6xl">
              {entry.title}
            </h1>
            <p className="mt-6 text-base leading-relaxed text-[color:var(--ink)]/72">{entry.summary}</p>
            <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-xs font-semibold text-[color:var(--ink)]/62">
              {entry.date || entry.effectiveDate ? (
                <span>{formatDate(entry.date || entry.effectiveDate)}</span>
              ) : null}
              {entry.author ? <span>{entry.author}</span> : null}
            </div>
          </div>
        </div>
      </section>

      <div className="container-shell -mt-10">
        {isVlog ? (
          <VlogEmbed videoUrl={entry.videoUrl} title={entry.title} poster={entry.image} />
        ) : entry.image ? (
          <div className="relative aspect-[16/7] overflow-hidden rounded-2xl border border-[var(--line)] bg-[var(--mint)] shadow-[0_24px_60px_-30px_rgba(28,38,32,0.5)]">
            <Image src={entry.image} alt={entry.title} fill loading="eager" sizes="100vw" className="object-cover" />
          </div>
        ) : null}
      </div>

      <section className="section-pad">
        <div className="container-shell grid gap-10 lg:grid-cols-[minmax(0,760px)_1fr]">
          <div className="cms-body soft-card rounded-2xl p-7 md:p-10">
            <div dangerouslySetInnerHTML={{ __html: entry.html || "" }} />
          </div>

          <aside className="soft-card h-fit rounded-2xl p-6">
            <h2 className="font-display border-b border-[var(--line)] pb-3 text-lg text-[color:var(--ink)]">
              Details
            </h2>
            <div className="mt-5 flex flex-wrap gap-2">
              {entry.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded bg-[var(--mint)] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[color:var(--forest)]"
                >
                  {tag}
                </span>
              ))}
            </div>
            <Link
              href="/contact"
              className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[var(--forest)] px-5 py-3.5 text-xs font-bold uppercase tracking-widest text-white transition hover:bg-[var(--forest-2)]"
            >
              Contact Us
            </Link>
          </aside>
        </div>
      </section>
    </article>
  );
}
