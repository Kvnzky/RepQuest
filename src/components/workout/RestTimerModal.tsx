import React, { useState, useEffect, useRef, useCallback } from 'react'
import { Play, Pause, RotateCcw, X, Volume2, VolumeX, Smartphone, AlertCircle, Plus } from 'lucide-react'
import { audioTimer } from '../../utils/audioTimer'

interface RestTimerProps {
  isOpen: boolean
  initialDurationSec: number
  soundEnabled: boolean
  vibrateEnabled: boolean
  onClose: () => void
  onToggleSound?: (enabled: boolean) => void
  onToggleVibrate?: (enabled: boolean) => void
  exerciseName?: string
  nextExerciseName?: string
}

export const RestTimerModal: React.FC<RestTimerProps> = ({
  isOpen,
  initialDurationSec,
  soundEnabled,
  vibrateEnabled,
  onClose,
  onToggleSound,
  onToggleVibrate,
  exerciseName,
  nextExerciseName
}) => {
  const [totalDuration, setTotalDuration] = useState<number>(initialDurationSec || 90)
  const [remainingSec, setRemainingSec] = useState<number>(initialDurationSec || 90)
  const [isActive, setIsActive] = useState<boolean>(true)
  const [isMuted, setIsMuted] = useState<boolean>(!soundEnabled)
  const [isVibrateOn, setIsVibrateOn] = useState<boolean>(vibrateEnabled)

  // Absolute end timestamp ref for lock screen / background resilience
  const targetEndTimeRef = useRef<number>(Date.now() + (initialDurationSec || 90) * 1000)
  const warnedTicksRef = useRef<{ [sec: number]: boolean }>({})

  // Reset target when initial duration changes or timer opens
  useEffect(() => {
    if (isOpen) {
      const dur = initialDurationSec || 90
      setTotalDuration(dur)
      setRemainingSec(dur)
      setIsActive(true)
      targetEndTimeRef.current = Date.now() + dur * 1000
      warnedTicksRef.current = {}
    }
  }, [isOpen, initialDurationSec])

  // Recalculate time on foreground / visibility change
  const syncWithAbsoluteTime = useCallback(() => {
    if (!isActive) return
    const now = Date.now()
    const diffMs = targetEndTimeRef.current - now
    const nextSec = Math.max(0, Math.ceil(diffMs / 1000))
    setRemainingSec(nextSec)

    if (nextSec === 0) {
      setIsActive(false)
      if (!isMuted) audioTimer.playTimerCompleteChime()
      if (isVibrateOn) audioTimer.vibrate([300, 150, 300])
    }
  }, [isActive, isMuted, isVibrateOn])

  useEffect(() => {
    const handleVisibility = () => {
      if (document.visibilityState === 'visible') {
        syncWithAbsoluteTime()
      }
    }
    window.addEventListener('visibilitychange', handleVisibility)
    window.addEventListener('focus', syncWithAbsoluteTime)
    return () => {
      window.removeEventListener('visibilitychange', handleVisibility)
      window.removeEventListener('focus', syncWithAbsoluteTime)
    }
  }, [syncWithAbsoluteTime])

  // Core countdown interval
  useEffect(() => {
    if (!isOpen || !isActive) return

    const interval = setInterval(() => {
      const now = Date.now()
      const diffMs = targetEndTimeRef.current - now
      const nextSec = Math.max(0, Math.ceil(diffMs / 1000))

      setRemainingSec(nextSec)

      // Warning ticks at 3, 2, 1
      if (nextSec <= 3 && nextSec > 0 && !warnedTicksRef.current[nextSec]) {
        warnedTicksRef.current[nextSec] = true
        if (!isMuted) audioTimer.playWarningTick()
        if (isVibrateOn) audioTimer.vibrate(80)
      }

      if (nextSec === 0) {
        setIsActive(false)
        if (!isMuted) audioTimer.playTimerCompleteChime()
        if (isVibrateOn) audioTimer.vibrate([300, 150, 300])
      }
    }, 250)

    return () => clearInterval(interval)
  }, [isOpen, isActive, isMuted, isVibrateOn])

  if (!isOpen) return null

  const handlePauseResume = () => {
    if (isActive) {
      // Pause: target is now relative to current remaining
      setIsActive(false)
    } else {
      // Resume: reset absolute end time based on current remaining
      targetEndTimeRef.current = Date.now() + remainingSec * 1000
      setIsActive(true)
    }
  }

  const handleReset = () => {
    setRemainingSec(totalDuration)
    targetEndTimeRef.current = Date.now() + totalDuration * 1000
    warnedTicksRef.current = {}
    setIsActive(true)
  }

  const handleAddSeconds = (seconds: number) => {
    const nextTotal = Math.max(5, remainingSec + seconds)
    setRemainingSec(nextTotal)
    setTotalDuration(prev => Math.max(prev, nextTotal))
    targetEndTimeRef.current = Date.now() + nextTotal * 1000
  }

  const progressPct = totalDuration > 0 ? Math.min(100, Math.max(0, ((totalDuration - remainingSec) / totalDuration) * 100)) : 0
  const minutes = Math.floor(remainingSec / 60)
  const seconds = remainingSec % 60
  const formattedTime = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`

  // SVG Circle dimensions
  const strokeWidth = 10
  const radius = 90
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (progressPct / 100) * circumference

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#0f172a] border border-slate-800 rounded-3xl w-full max-w-sm p-6 shadow-2xl relative flex flex-col items-center">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2.5 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          aria-label="Close Rest Timer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Exercise Context */}
        <div className="text-center mt-1 mb-4 px-6">
          <span className="text-xs uppercase font-bold tracking-wider text-sky-400 bg-sky-950/80 px-2.5 py-1 rounded-full border border-sky-800/60 inline-block mb-1.5">
            Rest Period
          </span>
          {exerciseName && (
            <h2 className="text-sm font-semibold text-slate-200 line-clamp-1">{exerciseName}</h2>
          )}
          {nextExerciseName && (
            <p className="text-[11px] text-slate-400 mt-0.5">Next: {nextExerciseName}</p>
          )}
        </div>

        {/* Radial Progress Timer */}
        <div className="relative w-[210px] h-[210px] flex items-center justify-center my-2">
          <svg className="w-full h-full transform -rotate-90">
            {/* Background Circle */}
            <circle
              cx="105"
              cy="105"
              r={radius}
              stroke="#1e293b"
              strokeWidth={strokeWidth}
              fill="transparent"
            />
            {/* Animated Progress Circle */}
            <circle
              cx="105"
              cy="105"
              r={radius}
              stroke={remainingSec === 0 ? '#10b981' : '#38bdf8'}
              strokeWidth={strokeWidth}
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
              className="transition-all duration-300 ease-linear"
            />
          </svg>

          {/* Time Display */}
          <div className="absolute flex flex-col items-center justify-center">
            <span className="text-5xl font-black text-white tracking-tight tabular-nums font-mono">
              {formattedTime}
            </span>
            <span className="text-xs font-medium text-slate-400 mt-1">
              {remainingSec === 0 ? 'Ready for next set!' : isActive ? 'Resting...' : 'Paused'}
            </span>
          </div>
        </div>

        {/* Quick Add Presets */}
        <div className="flex gap-2 my-3 w-full justify-center">
          <button
            onClick={() => handleAddSeconds(15)}
            className="px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-xs font-semibold text-slate-300 flex items-center gap-1 border border-slate-700"
          >
            <Plus className="w-3.5 h-3.5" /> 15s
          </button>
          <button
            onClick={() => handleAddSeconds(30)}
            className="px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-xs font-semibold text-slate-300 flex items-center gap-1 border border-slate-700"
          >
            <Plus className="w-3.5 h-3.5" /> 30s
          </button>
          <button
            onClick={() => handleAddSeconds(60)}
            className="px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-xs font-semibold text-slate-300 flex items-center gap-1 border border-slate-700"
          >
            <Plus className="w-3.5 h-3.5" /> 60s
          </button>
        </div>

        {/* Control Buttons */}
        <div className="flex items-center justify-center gap-4 w-full mt-2 mb-3">
          <button
            onClick={handleReset}
            className="p-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
            title="Reset Rest Timer"
            aria-label="Reset Timer"
          >
            <RotateCcw className="w-5 h-5" />
          </button>

          <button
            onClick={handlePauseResume}
            className={`px-8 py-3.5 rounded-2xl font-bold flex items-center gap-2 text-base shadow-lg transition-transform active:scale-95 ${
              isActive
                ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-amber-500/20'
                : 'bg-sky-500 hover:bg-sky-400 text-slate-950 shadow-sky-500/20'
            }`}
          >
            {isActive ? (
              <>
                <Pause className="w-5 h-5 fill-current" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="w-5 h-5 fill-current" />
                <span>Resume</span>
              </>
            )}
          </button>

          <button
            onClick={onClose}
            className="px-4 py-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700"
          >
            Skip
          </button>
        </div>

        {/* Sound & Vibrate Preferences */}
        <div className="flex items-center justify-between w-full pt-3 border-t border-slate-800/80 px-2 text-xs text-slate-400">
          <button
            onClick={() => {
              const next = !isMuted
              setIsMuted(next)
              onToggleSound?.(!next)
            }}
            className={`flex items-center gap-1.5 py-1 px-2.5 rounded-lg transition-colors ${
              !isMuted ? 'text-sky-400 bg-sky-950/60' : 'text-slate-500'
            }`}
          >
            {!isMuted ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            <span>{!isMuted ? 'Sound On' : 'Muted'}</span>
          </button>

          <button
            onClick={() => {
              const next = !isVibrateOn
              setIsVibrateOn(next)
              onToggleVibrate?.(next)
              if (next) audioTimer.vibrate(100)
            }}
            className={`flex items-center gap-1.5 py-1 px-2.5 rounded-lg transition-colors ${
              isVibrateOn ? 'text-sky-400 bg-sky-950/60' : 'text-slate-500'
            }`}
          >
            <Smartphone className="w-4 h-4" />
            <span>{isVibrateOn ? 'Vibrate On' : 'Vibrate Off'}</span>
          </button>
        </div>

        {/* Background Disclaimer */}
        <div className="mt-3 text-[10px] text-slate-500 flex items-start gap-1 px-1">
          <AlertCircle className="w-3.5 h-3.5 text-slate-500 shrink-0 mt-0.5" />
          <span>
            Mobile browsers may restrict sound/vibration while locked. The timer keeps absolute time in the background.
          </span>
        </div>
      </div>
    </div>
  )
}
