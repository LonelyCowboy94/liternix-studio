"use client";

import React, { useState, useEffect, useRef, useId } from 'react';
import { Play, Pause, AlertCircle } from 'lucide-react';
import Image from 'next/image';

interface YTPlayerOptions {
  videoId?: string;
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
}

export default function StudioPlayer({ videoUrl }: { videoUrl: string }) {
  // Generate a unique ID to prevent conflicts in lists (e.g., Admin panel)
  const generatedId = useId().replace(/:/g, ""); 
  const playerElementId = `yt-player-${generatedId}`;

  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [hasStarted, setHasStarted] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [isMounted, setIsMounted] = useState<boolean>(false);
  
  const playerRef = useRef<YTPlayer | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const timelineRef = useRef<HTMLDivElement>(null);

  const getYoutubeId = (url: string): string | null => {
    const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[7].length === 11) ? match[7] : null;
  };

  const videoId = getYoutubeId(videoUrl);

  useEffect(() => {
    const mountPlayer = () => {
    setIsMounted(true);
    };
    mountPlayer();

    const initPlayer = () => {
      // Check if API is ready and element exists in DOM
      if (window.YT && window.YT.Player && videoId && !playerRef.current) {
        playerRef.current = new window.YT.Player(playerElementId, {
          events: {
            onReady: (e: YTEvent) => {
              setDuration(e.target.getDuration());
            },
            onStateChange: (e: YTEvent) => {
              // YT.PlayerState.PLAYING = 1
              if (e.data === 1) {
                setIsPlaying(true);
                setHasStarted(true);
                if (e.target.setPlaybackQuality) {
                  e.target.setPlaybackQuality('hd1080');
                }
              } else {
                setIsPlaying(false);
              }
            },
          },
        });
      }
    };

    if (!window.YT || !window.YT.Player) {
      // Load script if not already present
      if (!document.getElementById('youtube-sdk')) {
        const tag = document.createElement('script');
        tag.id = 'youtube-sdk';
        tag.src = "https://www.youtube.com/iframe_api";
        document.body.appendChild(tag);
      }
      
      // Hook into the global callback
      const previousCallback = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => {
        if (previousCallback) previousCallback();
        initPlayer();
      };
    } else {
      initPlayer();
    }

    return () => {
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
        if (playerRef.current && typeof playerRef.current.getCurrentTime === 'function') {
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
    return [h, m, s, f].map(v => v.toString().padStart(2, '0')).join(':');
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!playerRef.current || duration === 0 || typeof playerRef.current.seekTo !== 'function') return;
    const rect = timelineRef.current?.getBoundingClientRect();
    if (rect) {
      const x = e.clientX - rect.left;
      const clickedValue = (x / rect.width) * duration;
      playerRef.current.seekTo(clickedValue, true);
      setCurrentTime(clickedValue);
    }
  };

  const togglePlayback = (): void => {
    if (playerRef.current && typeof playerRef.current.playVideo === 'function') {
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
        <span className="text-xs font-black uppercase tracking-widest italic">Invalid Source</span>
      </div>
    );
  }

  const origin =
  typeof window !== "undefined"
    ? `${window.location.protocol}//${window.location.host}`
    : "";

  return (
    <div className="group relative aspect-video bg-black rounded-[2.5rem] overflow-hidden border border-zinc-800 shadow-2xl transition-all duration-500 hover:border-[#afff00]/30">
      
      {/* LAYER 1: ENGINE */}
      <div className="absolute inset-0 w-full h-full z-0 pointer-events-none">
       {isMounted && (
  <iframe
    id={playerElementId}
    className="w-full h-full"
    src={`https://www.youtube.com/embed/${videoId}?enablejsapi=1&origin=${encodeURIComponent(origin)}&controls=0&rel=0&modestbranding=1`}
    allow="autoplay; encrypted-media; picture-in-picture"
    frameBorder="0"
  />
)}
      </div>

      {/* LAYER 2: INTERFACE OVERLAY */}
      <div 
        className={`absolute inset-0 z-20 transition-all duration-500 flex items-center justify-center bg-black/40 backdrop-blur-[2px]
        ${isPlaying ? 'opacity-0 pointer-events-none' : 'opacity-100 pointer-events-auto'}`}
      >
        {!hasStarted && (
          <Image
            fill 
            src={`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`} 
            className="absolute inset-0 w-full h-full object-cover opacity-60"
            alt="Master Preview"
            loading='eager'
          />
        )}
        <div className="absolute inset-0 bg-linear-to-t from-black via-transparent to-transparent opacity-80" />
        
        <button onClick={togglePlayback} className="relative group/btn cursor-pointer outline-none">
          <div className="absolute inset-0 bg-[#afff00] blur-3xl opacity-20 group-hover/btn:opacity-40 transition-opacity duration-500" />
          <div className="w-24 h-24 rounded-full bg-[#afff00] text-black flex items-center justify-center shadow-[0_8px_0_0_#76ad00] active:translate-y-2 active:shadow-none transition-all duration-75">
            <div className="absolute inset-0 rounded-full shadow-[inset_0_2px_4px_rgba(255,255,255,0.5)] opacity-40" />
            <Play size={40} fill="black" className="ml-1.5" />
          </div>
        </button>
      </div>

      {/* LAYER 3: PAUSE TRIGGER */}
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
          style={{ width: `${duration > 0 ? (currentTime / duration) * 100 : 0}%` }}
        />
      </div>

      {/* LAYER 5: HUD */}
      <div className="absolute inset-0 pointer-events-none z-40">
        <div className="absolute top-10 left-10 flex items-center gap-3">
           <div className={`w-2.5 h-2.5 rounded-full ${isPlaying ? 'bg-red-600 animate-pulse shadow-[0_0_15px_red]' : 'bg-zinc-700'}`} />
           <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 italic">
             {isPlaying ? 'ACTIVE_CUT_RENDER' : 'STANDBY_MODE'}
           </span>
        </div>

        <div className="absolute bottom-10 right-10 flex flex-col items-end">
          <span className="text-[9px] font-bold text-[#afff00] uppercase tracking-widest mb-1 italic">Master Clock</span>
          <div className="px-5 py-2 bg-black/60 backdrop-blur-xl border border-white/10 rounded-xl font-mono text-sm text-[#afff00] shadow-2xl">
            {formatTimecode(currentTime)}
          </div>
        </div>
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