"use client";

import React, { useState, useEffect, useRef, useId } from "react";
import { Play, Pause, AlertCircle, RefreshCw, Terminal } from "lucide-react";
import Image from "next/image";

/**
 * YouTube API Interfaces - Strict Typing
 */
interface YTPlayerVars {
  autoplay?: 0 | 1;
  controls?: 0 | 1;
  rel?: 0 | 1;
  showinfo?: 0 | 1;
  modestbranding?: 1;
  enablejsapi?: 1;
  origin?: string;
  disablekb?: 1;
  widgetid?: number;
}

interface YTPlayerOptions {
  videoId?: string;
  playerVars?: YTPlayerVars;
  events: {
    onReady?: (event: YTEvent) => void;
    onStateChange?: (event: YTEvent) => void;
  };
}

interface YTPlayer {
  playVideo(): void;
  pauseVideo(): void;
  seekTo(seconds: number, allowSeekAhead: boolean): void;
  setPlaybackQuality(suggestedQuality: string): void;
  getCurrentTime(): number;
  getDuration(): number;
  destroy(): void;
}

interface YTEvent {
  target: YTPlayer;
  data: number;
}

interface YTNamespace {
  Player: new (elementId: string, options: YTPlayerOptions) => YTPlayer;
  PlayerState: {
    PLAYING: number;
    PAUSED: number;
    ENDED: number;
    BUFFERING: number;
    CUED: number;
  };
}

export default function StudioPlayer({ videoUrl }: { videoUrl: string }) {
  const generatedId = useId().replace(/:/g, "");
  const playerElementId = `yt-player-${generatedId}`;

  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [hasStarted, setHasStarted] = useState<boolean>(false);
  const [isReady, setIsReady] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [isMounted, setIsMounted] = useState<boolean>(false);

  const playerRef = useRef<YTPlayer | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const timelineRef = useRef<HTMLDivElement>(null);

  const getYoutubeId = (url: string): string | null => {
    const regExp =
      /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[7].length === 11 ? match[7] : null;
  };

  const videoId = getYoutubeId(videoUrl);

  useEffect(() => {
    const mount = () => {
      setIsMounted(true);
    };
    mount();

    if (typeof window !== "undefined" && !window.YT) {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      tag.id = "youtube-sdk";
      const firstScriptTag = document.getElementsByTagName("script")[0];
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
    }

    // Polling mehanizam za detekciju API-ja bez refreshovanja
    const checkYT = setInterval(() => {
      if (window.YT && window.YT.Player && videoId && !playerRef.current) {
        const player = new window.YT.Player(playerElementId, {
          events: {
            onReady: (e: YTEvent) => {
              setDuration(e.target.getDuration());
              setIsReady(true);
            },
            onStateChange: (e: YTEvent) => {
              if (e.data === 1) {
                // 1 = PLAYING
                setIsPlaying(true);
                setHasStarted(true);
              } else {
                setIsPlaying(false);
              }
            },
          },
        });
        playerRef.current = player;
        clearInterval(checkYT);
      }
    }, 100);

    return () => {
      clearInterval(checkYT);
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (playerRef.current) {
        playerRef.current.destroy();
        playerRef.current = null;
      }
    };
  }, [videoId, playerElementId]);

  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        if (
          playerRef.current &&
          typeof playerRef.current.getCurrentTime === "function"
        ) {
          setCurrentTime(playerRef.current.getCurrentTime());
        }
      }, 100);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  }, [isPlaying]);

  const formatTimecode = (seconds: number): string => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    const f = Math.floor((seconds % 1) * 24);
    return [h, m, s, f].map((v) => v.toString().padStart(2, "0")).join(":");
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!playerRef.current || !isReady || duration === 0) return;
    const rect = timelineRef.current?.getBoundingClientRect();
    if (rect) {
      const x = e.clientX - rect.left;
      const clickedValue = (x / rect.width) * duration;
      playerRef.current.seekTo(clickedValue, true);
      setCurrentTime(clickedValue);
    }
  };

  const togglePlayback = (): void => {
    if (
      playerRef.current &&
      isReady &&
      typeof playerRef.current.playVideo === "function"
    ) {
      if (isPlaying) {
        playerRef.current.pauseVideo();
      } else {
        playerRef.current.playVideo();
      }
    }
  };

  if (!videoId) {
    return (
      <div className="aspect-video bg-zinc-900 rounded-[2.5rem] flex flex-col items-center justify-center text-red-500 gap-2 border border-red-500/20">
        <AlertCircle size={32} />
        <span className="text-xs font-black uppercase tracking-widest italic">
          Invalid_Source_Link
        </span>
      </div>
    );
  }

  return (
    <div className="group relative aspect-video bg-black rounded-[2.5rem] overflow-hidden border border-zinc-800 shadow-2xl transition-all duration-500 hover:border-[#afff00]/30">
      {/* LAYER 1: ENGINE */}
      <div
        className={`absolute inset-0 w-full h-full z-0 pointer-events-none transition-opacity duration-1000 ${hasStarted ? "opacity-100" : "opacity-0"}`}
      >
        {isMounted && (
          <iframe
            id={playerElementId}
            className="w-full h-full"
            src={`https://www.youtube.com/embed/${videoId}?enablejsapi=1&origin=${encodeURIComponent(typeof window !== "undefined" ? window.location.origin : "")}&controls=0&rel=0&modestbranding=1&disablekb=1&widgetid=1`}
            allow="autoplay; encrypted-media; picture-in-picture"
            frameBorder="0"
          />
        )}
      </div>

     {/* LAYER 2: INTERFACE / LOADING / RESUME OVERLAY */}
<div
  className={`absolute inset-0 z-20 transition-all duration-700 flex flex-col items-center justify-center bg-black/40
  ${isPlaying ? "opacity-0 pointer-events-none" : "opacity-100 pointer-events-auto"}`}
>
  {/* Thumbnail - prikazujemo samo dok video NIJE startovao uopšte */}
  {!hasStarted && (
    <Image
      fill
      src={`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`}
      className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${isReady ? "opacity-40 grayscale group-hover:grayscale-0" : "opacity-10"}`}
      alt="Master Preview"
      loading="eager"
      unoptimized
    />
  )}

  {/* Loader dok se API ne učita */}
  {!isReady ? (
    <div className="flex flex-col items-center gap-4 z-30">
      <RefreshCw className="text-[#afff00] animate-spin" size={40} />
      <div className="flex flex-col items-center">
        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#afff00] animate-pulse">
          Initializing_System
        </span>
      </div>
    </div>
  ) : (
    /* PLAY DUGME: Prikazuje se uvek kada video NIJE "isPlaying" (bilo da je na početku ili pauziran) */
    !isPlaying && (
      <button
        onClick={togglePlayback}
        className="relative group/btn cursor-pointer outline-none animate-in fade-in zoom-in duration-500 z-30"
      >
        <div className="absolute inset-0 bg-[#afff00] blur-3xl opacity-20 group-hover/btn:opacity-40 transition-opacity duration-500" />
        <div className="w-24 h-24 rounded-full bg-[#afff00] text-black flex items-center justify-center shadow-[0_8px_0_0_#76ad00] active:translate-y-2 active:shadow-none transition-all duration-75">
          <div className="absolute inset-0 rounded-full shadow-[inset_0_2px_4px_rgba(255,255,255,0.5)] opacity-40" />
          <Play size={40} fill="black" className="ml-1.5" />
        </div>
      </button>
    )
  )}
</div>

{/* LAYER 3: PAUSE TRIGGER (Samo dok video aktivno ide - na hover) */}
{isPlaying && (
  <div
    onClick={togglePlayback}
    className="absolute inset-0 z-30 flex items-center justify-center bg-black/20 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer"
  >
    <div className="w-24 h-24 rounded-full bg-[#afff00] text-black flex items-center justify-center shadow-[0_8px_0_0_#76ad00] active:translate-y-2 active:shadow-none transition-all duration-75">
      <div className="absolute inset-0 rounded-full shadow-[inset_0_2px_4px_rgba(255,255,255,0.5)] opacity-40" />
      <Pause size={40} fill="black" />
    </div>
  </div>
)}

      {/* LAYER 4: TIMELINE */}
      <div
        ref={timelineRef}
        onClick={handleSeek}
        className="absolute bottom-0 left-0 w-full h-4 z-50 cursor-crosshair group/timeline"
      >
        <div className="absolute bottom-0 left-0 w-full h-1.5 bg-white/10 group-hover/timeline:h-2 transition-all duration-300" />
        <div
          className="absolute bottom-0 left-0 h-1.5 bg-[#afff00] shadow-[0_0_15px_#afff00] group-hover/timeline:h-2 transition-all duration-300"
          style={{
            width: `${duration > 0 ? (currentTime / duration) * 100 : 0}%`,
          }}
        />
      </div>

      {/* LAYER 5: HUD */}
      <div className="absolute inset-0 pointer-events-none z-40">
        <div className="absolute top-10 left-10 flex items-center gap-3">
          <div
            className={`w-2.5 h-2.5 rounded-full ${isPlaying ? "bg-red-600 animate-pulse shadow-[0_0_15px_red]" : "bg-zinc-700"}`}
          />
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 italic">
            {isPlaying
              ? "ACTIVE_CUT_RENDER"
              : isReady
                ? "SYSTEM_READY"
                : "ESTABLISHING_LINK"}
          </span>
        </div>

        <div className="absolute bottom-10 right-10 flex flex-col items-end">
          <span className="text-[9px] font-bold text-[#afff00] uppercase tracking-widest mb-1 italic">
            Master Clock
          </span>
          <div className="px-5 py-2 bg-black/60 backdrop-blur-xl border border-white/10 rounded-xl font-mono text-sm text-[#afff00] shadow-2xl tracking-tighter">
            {formatTimecode(currentTime)}
          </div>
        </div>
        <Terminal
          size={16}
          className="absolute top-10 right-10 text-zinc-800"
        />
      </div>
    </div>
  );
}

declare global {
  interface Window {
    YT: YTNamespace;
    onYouTubeIframeAPIReady: () => void;
  }
}
