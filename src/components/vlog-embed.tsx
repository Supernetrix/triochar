"use client";

import Link from "next/link";
import { Play } from "lucide-react";
import { youTubeId } from "@/lib/youtube";

/**
 * Responsive YouTube embed. Falls back to a poster image + link
 * when the video URL is missing or not a recognisable YouTube link.
 */
export function VlogEmbed({
  videoUrl,
  title,
  poster,
}: {
  videoUrl?: string;
  title: string;
  poster?: string;
}) {
  const id = youTubeId(videoUrl);

  if (id) {
    return (
      <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-[var(--line)] bg-black">
        <iframe
          className="absolute inset-0 h-full w-full"
          src={`https://www.youtube-nocookie.com/embed/${id}`}
          title={title}
          loading="lazy"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        />
      </div>
    );
  }

  return (
    <Link
      href={videoUrl || "#"}
      target={videoUrl ? "_blank" : undefined}
      rel={videoUrl ? "noopener noreferrer" : undefined}
      className="group relative flex aspect-video w-full items-center justify-center overflow-hidden rounded-xl border border-[var(--line)] bg-[var(--mint)]"
      style={
        poster
          ? { backgroundImage: `url(${poster})`, backgroundSize: "cover", backgroundPosition: "center" }
          : undefined
      }
    >
      <div className="absolute inset-0 bg-[var(--forest)]/45 transition-colors group-hover:bg-[var(--forest)]/55" />
      <span className="relative grid h-14 w-14 place-items-center rounded-full bg-white/90 text-[color:var(--forest)] shadow-md transition-transform group-hover:scale-105">
        <Play size={20} className="translate-x-0.5" fill="currentColor" />
      </span>
    </Link>
  );
}
