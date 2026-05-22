import type { Metadata } from "next";
import Link from "next/link";
import { ArticleCard } from "@/components/article-card";
import { PageHero } from "@/components/page-hero";
import { Reveal } from "@/components/reveal";
import { VlogEmbed } from "@/components/vlog-embed";
import { formatDate, getEntries } from "@/lib/content";

export const metadata: Metadata = {
  title: "Knowledge",
  description: "Policies, blogs, and vlogs on carbon markets and corporate decarbonisation.",
};

function SectionHeading({
  label,
  title,
  intro,
  count,
}: {
  label: string;
  title: string;
  intro: string;
  count: number;
}) {
  return (
    <div className="lg:sticky lg:top-28">
      <div className="flex items-center gap-3">
        <span className="eyebrow-plain text-[color:var(--gold)]">{label}</span>
        <span className="font-mono text-[11px] font-bold text-[color:var(--ink)]/35">
          {String(count).padStart(2, "0")}
        </span>
      </div>
      <h2 className="font-display mt-3 text-balance text-[1.8rem] leading-[1.1] text-[color:var(--ink)] sm:text-[2.1rem]">
        {title}
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-[color:var(--ink)]/72">{intro}</p>
    </div>
  );
}

function EmptyState({ label }: { label: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-[var(--mint-2)] bg-white/50 p-8 text-center text-sm font-medium text-[color:var(--ink)]/66">
      New {label} will appear here once published.
    </div>
  );
}

export default function KnowledgePage() {
  const policies = getEntries("policies");
  const blogs = getEntries("blogs");
  const vlogs = getEntries("vlogs");

  return (
    <>
      <PageHero
        eyebrow="Knowledge"
        title="Knowledge"
        description="Policies, blogs, and vlogs that help buyers and suppliers move from climate intent to procurement confidence."
      />

      {/* Policies */}
      <section className="py-16 md:py-20">
        <div className="container-shell grid gap-8 lg:grid-cols-[300px_1fr] lg:gap-14">
          <Reveal>
            <SectionHeading
              label="Policies"
              title="Carbon market policies."
              intro="Policy references and market signals that shape credible carbon procurement."
              count={policies.length}
            />
          </Reveal>
          <div>
            {policies.length ? (
              <div className="grid gap-5 sm:grid-cols-2">
                {policies.map((entry, index) => (
                  <Reveal key={entry.slug} delay={index * 0.06}>
                    <ArticleCard entry={entry} preload={index === 0} />
                  </Reveal>
                ))}
              </div>
            ) : (
              <EmptyState label="policies" />
            )}
          </div>
        </div>
      </section>

      {/* Blogs */}
      <section className="border-y border-[var(--line)] bg-[var(--surface)]/60 py-16 md:py-20">
        <div className="container-shell grid gap-8 lg:grid-cols-[300px_1fr] lg:gap-14">
          <Reveal>
            <SectionHeading
              label="Blogs"
              title="Notes from the carbon market."
              intro="Editorial perspectives on project quality, buyer education, and decarbonisation strategy."
              count={blogs.length}
            />
          </Reveal>
          <div>
            {blogs.length ? (
              <div className="grid gap-5 sm:grid-cols-2">
                {blogs.map((entry, index) => (
                  <Reveal key={entry.slug} delay={index * 0.06}>
                    <ArticleCard entry={entry} />
                  </Reveal>
                ))}
              </div>
            ) : (
              <EmptyState label="blogs" />
            )}
          </div>
        </div>
      </section>

      {/* Vlogs */}
      <section className="py-16 md:py-20">
        <div className="container-shell grid gap-8 lg:grid-cols-[300px_1fr] lg:gap-14">
          <Reveal>
            <SectionHeading
              label="Vlogs"
              title="Watch the projects and stories."
              intro="Video-led field notes, project walk-throughs, and buyer education."
              count={vlogs.length}
            />
          </Reveal>
          <div>
            {vlogs.length ? (
              <div className="grid gap-6 sm:grid-cols-2">
                {vlogs.map((entry, index) => (
                  <Reveal key={entry.slug} delay={index * 0.06}>
                    <div className="flex flex-col gap-3.5">
                      <VlogEmbed videoUrl={entry.videoUrl} title={entry.title} poster={entry.image} />
                      <div>
                        <div className="mb-1.5 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.16em] text-[color:var(--gold)]">
                          <span>{entry.category || "Video"}</span>
                          {entry.date ? <span aria-hidden>•</span> : null}
                          <span>{formatDate(entry.date)}</span>
                        </div>
                        <Link
                          href={`/vlogs/${entry.slug}`}
                          className="font-display text-lg leading-snug text-[color:var(--ink)] transition-colors hover:text-[color:var(--forest-2)]"
                        >
                          {entry.title}
                        </Link>
                        <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-[color:var(--ink)]/72">
                          {entry.summary}
                        </p>
                      </div>
                    </div>
                  </Reveal>
                ))}
              </div>
            ) : (
              <EmptyState label="vlogs" />
            )}
          </div>
        </div>
      </section>
    </>
  );
}
