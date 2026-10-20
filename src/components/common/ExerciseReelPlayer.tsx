import React, { useState, useEffect } from 'react'
import {
  Play,
  ExternalLink,
  WifiOff,
  Maximize2,
  RefreshCw,
  Sparkles,
  Volume2,
  CheckCircle2,
  ShieldAlert
} from 'lucide-react'
import { Exercise } from '../../types'

interface ExerciseReelPlayerProps {
  exercise: Exercise
  autoPlay?: boolean
  className?: string
  showNotes?: boolean
}

export const ExerciseReelPlayer: React.FC<ExerciseReelPlayerProps> = ({
  exercise,
  autoPlay = false,
  className = '',
  showNotes = true
}) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(autoPlay)
  const [isOnline, setIsOnline] = useState<boolean>(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  )
  const [loadError, setLoadError] = useState<boolean>(false)

  // Track online/offline status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  const media = exercise.media
  const videoId = media?.videoId || (media?.videoUrl ? media.videoUrl.split('/').pop()?.split('?')[0] : null)
  const shortsUrl = media?.shortsUrl || (videoId ? `https://www.youtube.com/shorts/${videoId}` : media?.externalUrl)
  const embedUrl = videoId
    ? `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=${isPlaying ? '1' : '0'}&rel=0&modestbranding=1&playsinline=1`
    : media?.videoUrl

  if (!videoId && !media?.videoUrl) {
    return (
      <div className={`rounded-2xl bg-slate-900 border border-slate-800 p-6 text-center ${className}`}>
        <p className="text-xs text-slate-400">No video reel available for this exercise yet.</p>
      </div>
    )
  }

  return (
    <div className={`flex flex-col space-y-3 ${className}`}>
      {/* Video Reel Frame Container */}
      <div className="relative w-full rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 shadow-xl group aspect-video sm:aspect-[16/10]">
        {!isOnline ? (
          // Offline Banner Fallback
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-slate-950/95 z-20">
            <div className="w-12 h-12 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center mb-3 text-amber-400">
              <WifiOff className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-bold text-white mb-1">Offline Mode</h4>
            <p className="text-xs text-slate-400 max-w-xs leading-relaxed mb-3">
              Streaming video reels requires an internet connection. Use the step-by-step machine setup guide below.
            </p>
            <div className="flex items-center gap-1.5 text-[11px] text-sky-400 font-semibold bg-sky-950/60 px-3 py-1.5 rounded-full border border-sky-800/50">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Full setup steps available offline</span>
            </div>
          </div>
        ) : !isPlaying ? (
          // Pre-play Thumbnail Poster with Play Reel Button
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-slate-950">
            {/* Background Thumbnail preview */}
            <img
              src={`https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`}
              alt={exercise.name}
              className="absolute inset-0 w-full h-full object-cover opacity-50 filter blur-[1px] group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
              onError={(e) => {
                // If thumbnail fails, gracefully hide image
                ;(e.target as HTMLElement).style.display = 'none'
              }}
            />
            {/* Dark gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-slate-950/40" />

            {/* Play Button & Reel Banner */}
            <div className="relative z-10 flex flex-col items-center text-center p-4">
              <button
                onClick={() => setIsPlaying(true)}
                className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-sky-500 hover:bg-sky-400 text-slate-950 flex items-center justify-center shadow-lg shadow-sky-500/30 hover:scale-105 transition-all mb-3 active:scale-95"
                aria-label="Play video reel"
              >
                <Play className="w-6 h-6 sm:w-7 sm:h-7 fill-slate-950 ml-1" />
              </button>

              <span className="text-[11px] font-black uppercase tracking-wider text-sky-400 bg-sky-950/80 px-2.5 py-0.5 rounded-full border border-sky-800/60 mb-1">
                Real How-To Reel
              </span>
              <h3 className="text-sm sm:text-base font-bold text-white max-w-sm drop-shadow line-clamp-1">
                {media?.videoTitle || exercise.name}
              </h3>
              <p className="text-[11px] text-slate-300 mt-1 flex items-center gap-1">
                <span>Tap to watch demonstration</span>
              </p>
            </div>
          </div>
        ) : (
          // Active YouTube Video Embed
          <div className="w-full h-full relative">
            <iframe
              src={embedUrl}
              title={media?.videoTitle || `${exercise.name} demonstration`}
              className="w-full h-full border-0 absolute inset-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              onError={() => setLoadError(true)}
            />
          </div>
        )}

        {/* Quick External Shorts Link Pill */}
        {shortsUrl && (
          <a
            href={shortsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="absolute top-2.5 right-2.5 z-20 px-2.5 py-1 rounded-full bg-slate-900/90 hover:bg-slate-800 text-slate-300 hover:text-white text-[10px] font-bold border border-slate-700/80 flex items-center gap-1 backdrop-blur-md shadow-md transition-all active:scale-95"
            title="Open reel in YouTube"
          >
            <ExternalLink className="w-3 h-3 text-sky-400" />
            <span>Open Reel</span>
          </a>
        )}
      </div>

      {/* Video Details & Coaching Notes */}
      {showNotes && (
        <div className="space-y-2">
          {/* Key Form Cue */}
          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-start gap-2.5">
            <div className="p-1.5 rounded-lg bg-sky-950 text-sky-400 shrink-0 mt-0.5 border border-sky-800/40">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
            <div className="text-xs">
              <span className="font-bold text-white block">Key Machine Focus:</span>
              <p className="text-slate-300 mt-0.5 leading-relaxed">
                {media?.videoNote ||
                  exercise.setupInstructions[0] ||
                  'Keep posture locked with chest elevated and feet planted firmly.'}
              </p>
            </div>
          </div>

          {/* Quick External Backup if embed is blocked */}
          {loadError && (
            <div className="p-2.5 rounded-xl bg-amber-950/40 border border-amber-800/60 flex items-center justify-between text-xs text-amber-200">
              <span className="flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-amber-400" />
                Player blocked? Open on YouTube:
              </span>
              <a
                href={shortsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="underline font-bold text-amber-300 hover:text-white"
              >
                Watch Externally &rarr;
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
