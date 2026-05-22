import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { collectionMeta, formatDate, type ContentEntry } from "@/lib/content";

export function ArticleCard({ entry, preload = false }: { entry: ContentEntry; preload?: boolean }) {
  const href = `${collectionMeta[entry.collection].href}/${entry.slug}`;
  const label = entry.category || entry.region || collectionMeta[entry.collection].singular;

  return (
    <Link
      href={href}
      className="group flex flex-col overflow-hidden rounded-2xl border border-[var(--line)] bg-white transition-all duration-300 hover:border-[var(--mint-2)] hover:shadow-md"
    >
      {entry.image ? (
        <div className="relative aspect-[16/10] overflow-hidden bg-[var(--mint)]">
          <Image
            src={entry.image}
            alt={entry.title}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            preload={preload}
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
          <span className="absolute left-3 top-3 rounded bg-white/90 px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider text-[color:var(--forest)] shadow-sm">
            {label}
          </span>
        </div>
      ) : null}
      <div className="flex flex-1 flex-col p-6">
        <div className="mb-3 flex items-center justify-between gap-3 text-[10px] font-bold uppercase tracking-[0.18em] text-[color:var(--gold)]">
          <span>{formatDate(entry.date || entry.effectiveDate) || label}</span>
          <ArrowUpRight
            size={14}
            className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
          />
        </div>
        <h3 className="text-base font-bold leading-snug tracking-tight text-[color:var(--forest)] transition-colors group-hover:text-[color:var(--forest-2)]">
          {entry.title}
        </h3>
        <p className="mt-2.5 line-clamp-3 text-xs leading-relaxed text-[color:var(--forest)]/72">
          {entry.summary}
        </p>
        {entry.tags.length ? (
          <div className="mt-4 flex flex-wrap gap-1.5">
            {entry.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="rounded bg-[var(--mint)] px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-[color:var(--forest)]"
              >
                {tag}
              </span>
            ))}
          </div>
        ) : null}
      </div>
    </Link>
  );
}
