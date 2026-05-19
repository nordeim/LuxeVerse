"use client";

import { useRef, useState } from "react";
import { cn } from "@luxeverse/utils";
import { Play } from "lucide-react";

export interface VideoPlayerProps {
  src: string;
  poster: string;
  autoplayOnHover?: boolean;
  className?: string;
}

export function VideoPlayer({ src, poster, autoplayOnHover = true, className }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const handleHover = (): void => {
    if (!autoplayOnHover || !videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play().catch(() => {});
      setIsPlaying(true);
    }
  };

  const handleLeave = (): void => {
    if (!autoplayOnHover || !videoRef.current) return;
    videoRef.current.pause();
    setIsPlaying(false);
  };

  return (
    <div className={cn("relative aspect-video overflow-hidden rounded-xl bg-obsidian-100", className)}>
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        muted
        loop
        playsInline
        className="h-full w-full object-cover"
        onMouseEnter={handleHover}
        onMouseLeave={handleLeave}
        aria-label="Product video"
      />
      {!isPlaying && (
        <button
          type="button"
          onClick={() => videoRef.current?.play()}
          className="absolute inset-0 flex items-center justify-center bg-obsidian-950/20 backdrop-blur-sm transition-opacity hover:bg-obsidian-950/30"
          aria-label="Play video"
        >
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-obsidian-50/90 text-obsidian-950 shadow-md">
            <Play className="h-5 w-5" />
          </span>
        </button>
      )}
    </div>
  );
}
