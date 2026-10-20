import React, { useState, useEffect, useRef } from 'react'
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  ExternalLink,
  Wifi,
  WifiOff,
  Maximize2,
  Sparkles,
  RotateCcw,
  Gauge,
  Film
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
  autoPlay = true,
  className = '',
  showNotes = true
}) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(autoPlay)
  const [isMuted, setIsMuted] = useState<boolean>(true)
  const [playbackRate, setPlaybackRate] = useState<number>(1)
  const [viewMode, setViewMode] = useState<'offline' | 'online'>('offline')
  const [isOnline, setIsOnline] = useState<boolean>(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  )
  const videoRef = useRef<HTMLVideoElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Track online/offline status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => {
      setIsOnline(false)
      setViewMode('offline') // Always force offline player when disconnected
    }

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  // Auto-play local video when component mounts or exercise changes
  useEffect(() => {
    if (videoRef.current && viewMode === 'offline') {
      videoRef.current.playbackRate = playbackRate
      if (autoPlay) {
        videoRef.current
          .play()
          .then(() => setIsPlaying(true))
          .catch(() => {
            // Browser autoplay policy might require manual interaction if unmuted
            setIsPlaying(false)
          })
      }
    }
  }, [exercise.id, viewMode, autoPlay])

  const media = exercise.media
  const localVideo = media?.localVideoPath || `/videos/${exercise.id}.mp4`
  const videoId = media?.videoId
  const shortsUrl = media?.shortsUrl || (videoId ? `https://www.youtube.com/shorts/${videoId}` : media?.externalUrl)
  const embedUrl = videoId
    ? `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1&playsinline=1`
    : media?.videoUrl

  const togglePlay = () => {
    if (!videoRef.current) return
    if (isPlaying) {
      videoRef.current.pause()
      setIsPlaying(false)
    } else {
      videoRef.current.play()
      setIsPlaying(true)
    }
  }

  const toggleMute = () => {
    if (!videoRef.current) return
    const nextMute = !isMuted
    videoRef.current.muted = nextMute
    setIsMuted(nextMute)
  }

  const cycleSpeed = () => {
    if (!videoRef.current) return
    const nextSpeed = playbackRate === 1 ? 0.75 : playbackRate === 0.75 ? 0.5 : 1
    videoRef.current.playbackRate = nextSpeed
    setPlaybackRate(nextSpeed)
  }

  const toggleFullscreen = () => {
    if (!containerRef.current) return
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(() => {})
    } else {
      document.exitFullscreen().catch(() => {})
    }
  }

  return (
    <div className={`flex flex-col space-y-3 ${className}`}>
      {/* Mode Switcher Bar */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[11px] font-bold text-emerald-400 flex items-center gap-1">
            <WifiOff className="w-3 h-3" />
            <span>100% Offline Video</span>
          </span>
        </div>

        {/* Online stream toggle option */}
        {isOnline && videoId && (
          <div className="flex items-center gap-1 bg-slate-900 p-0.5 rounded-xl border border-slate-800 text-[10px]">
            <button
              onClick={() => setViewMode('offline')}
              className={`px-2 py-0.5 rounded-lg font-bold transition-all ${
                viewMode === 'offline'
                  ? 'bg-sky-500 text-slate-950'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Offline Reel
            </button>
            <button
              onClick={() => setViewMode('online')}
              className={`px-2 py-0.5 rounded-lg font-bold transition-all flex items-center gap-1 ${
                viewMode === 'online'
                  ? 'bg-sky-500 text-slate-950'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Wifi className="w-2.5 h-2.5" />
              <span>Stream</span>
            </button>
          </div>
        )}
      </div>

      {/* Main Video Reel Viewport */}
      <div
        ref={containerRef}
        className="relative w-full rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 shadow-2xl group aspect-[9/14] sm:aspect-video max-h-[58vh]"
      >
        {viewMode === 'offline' ? (
          // NATIVE OFFLINE HTML5 VIDEO (Plays with 0 Internet Connection)
          <div className="w-full h-full relative cursor-pointer" onClick={togglePlay}>
            <video
              ref={videoRef}
              src={localVideo}
              playsInline
              loop
              muted={isMuted}
              className="w-full h-full object-contain bg-black"
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
            />

            {/* Play/Pause Center Indicator when paused */}
            {!isPlaying && (
              <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-[2px] flex items-center justify-center transition-opacity">
                <div className="w-16 h-16 rounded-full bg-sky-500/90 hover:bg-sky-400 text-slate-950 flex items-center justify-center shadow-xl shadow-sky-500/40 scale-100 hover:scale-110 transition-transform">
                  <Play className="w-7 h-7 fill-slate-950 ml-1" />
                </div>
              </div>
            )}

            {/* Gradient Overlays for contrast */}
            <div className="absolute top-0 inset-x-0 h-16 bg-gradient-to-b from-black/80 to-transparent pointer-events-none" />
            <div className="absolute bottom-0 inset-x-0 h-20 bg-gradient-to-t from-black/90 via-black/50 to-transparent pointer-events-none" />

            {/* Top Reel Badges */}
            <div className="absolute top-3 inset-x-3 flex items-center justify-between z-10 pointer-events-none">
              <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-slate-950/80 text-sky-400 border border-sky-800/80 backdrop-blur-md flex items-center gap-1">
                <Film className="w-3 h-3 text-sky-400" />
                <span>Offline Form Reel</span>
              </span>

              {playbackRate !== 1 && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/90 text-slate-950 backdrop-blur-md">
                  {playbackRate}x Slow-Mo
                </span>
              )}
            </div>

            {/* Bottom Overlay Controls */}
            <div
              className="absolute bottom-3 inset-x-3 flex items-center justify-between z-10"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-2">
                <button
                  onClick={togglePlay}
                  className="p-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-white backdrop-blur-md border border-slate-700/80 transition-all active:scale-95"
                  title={isPlaying ? 'Pause' : 'Play'}
                  aria-label="Play or pause"
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-white" />}
                </button>

                <button
                  onClick={toggleMute}
                  className="p-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-white backdrop-blur-md border border-slate-700/80 transition-all active:scale-95"
                  title={isMuted ? 'Unmute' : 'Mute'}
                  aria-label="Mute or unmute"
                >
                  {isMuted ? <VolumeX className="w-4 h-4 text-slate-400" /> : <Volume2 className="w-4 h-4 text-sky-400" />}
                </button>

                <button
                  onClick={cycleSpeed}
                  className="px-2.5 py-1.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-300 hover:text-white backdrop-blur-md border border-slate-700/80 text-[11px] font-bold flex items-center gap-1 transition-all active:scale-95"
                  title="Change playback speed"
                >
                  <Gauge className="w-3.5 h-3.5 text-sky-400" />
                  <span>{playbackRate}x</span>
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={toggleFullscreen}
                  className="p-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-white backdrop-blur-md border border-slate-700/80 transition-all active:scale-95"
                  title="Fullscreen"
                  aria-label="Fullscreen"
                >
                  <Maximize2 className="w-4 h-4 text-slate-300" />
                </button>
              </div>
            </div>
          </div>
        ) : (
          // ONLINE YOUTUBE STREAM (Available when online)
          <div className="w-full h-full relative">
            <iframe
              src={embedUrl}
              title={media?.videoTitle || `${exercise.name} demonstration`}
              className="w-full h-full border-0 absolute inset-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>
        )}
      </div>

      {/* Video Details & Form Focus */}
      {showNotes && (
        <div className="space-y-2">
          {/* Machine Technique Focus Note */}
          <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-start gap-3">
            <div className="p-2 rounded-xl bg-sky-950 text-sky-400 shrink-0 mt-0.5 border border-sky-800/40">
              <Sparkles className="w-4 h-4" />
            </div>
            <div className="text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white block">Key Machine Focus:</span>
                <span className="text-[10px] text-emerald-400 font-semibold bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-800/50">
                  Ready Offline
                </span>
              </div>
              <p className="text-slate-300 mt-1 leading-relaxed">
                {media?.videoNote ||
                  exercise.setupInstructions[0] ||
                  'Adjust seat height so handles align with mid-chest. Avoid locking joints completely.'}
              </p>
            </div>
          </div>

          {/* External YouTube link for deeper online exploration */}
          {shortsUrl && (
            <div className="flex items-center justify-between px-1 text-[11px] text-slate-400">
              <span>Looking for full video on YouTube?</span>
              <a
                href={shortsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sky-400 font-bold hover:underline flex items-center gap-1"
              >
                <span>Open YouTube Short</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
