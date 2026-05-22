import Link from "next/link";

export default function NotFound() {
  return (
    <section className="section-pad">
      <div className="container-shell">
        <div className="soft-card mx-auto max-w-xl rounded-2xl p-10 text-center">
          <div className="eyebrow-plain">404</div>
          <h1 className="font-display mt-4 text-4xl text-[color:var(--ink)]">
            This page is not published.
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-[color:var(--ink)]/72">
            The content may be in draft, unpublished, or moved.
          </p>
          <Link
            href="/"
            className="mt-8 inline-flex rounded-full bg-[var(--forest)] px-6 py-3 text-xs font-bold uppercase tracking-widest text-white transition hover:bg-[var(--forest-2)]"
          >
            Return Home
          </Link>
        </div>
      </div>
    </section>
  );
}
