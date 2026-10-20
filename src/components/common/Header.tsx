import React from 'react'
import { Dumbbell, ShieldCheck } from 'lucide-react'

interface HeaderProps {
  appName: string
  currentWeek: number
  hasActiveWorkout?: boolean
  onResumeWorkout?: () => void
  onOpenDisclaimer?: () => void
}

export const Header: React.FC<HeaderProps> = ({
  appName,
  currentWeek,
  hasActiveWorkout,
  onResumeWorkout,
  onOpenDisclaimer
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#090d16]/95 backdrop-blur-md border-b border-slate-800/80 px-4 py-3 flex items-center justify-between">
      <div className="flex items-center space-x-2.5">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-sky-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-sky-500/20">
          <Dumbbell className="w-5 h-5 text-slate-950 font-bold" />
        </div>
        <div>
          <div className="flex items-center space-x-1.5">
            <h1 className="font-bold text-lg text-white tracking-tight">{appName}</h1>
            <span className="text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded bg-sky-950/80 text-sky-400 border border-sky-800/50">
              Week {currentWeek}
            </span>
          </div>
          <p className="text-[11px] text-slate-400 font-medium">Anytime Fitness Companion</p>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        {hasActiveWorkout && onResumeWorkout && (
          <button
            onClick={onResumeWorkout}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-sky-500/20 hover:bg-sky-500/30 text-sky-400 border border-sky-500/40 text-xs font-semibold animate-pulse-subtle"
          >
            <span className="w-2 h-2 rounded-full bg-sky-400 animate-ping" />
            <span>In Workout</span>
          </button>
        )}

        <button
          onClick={onOpenDisclaimer}
          title="Safety & Guidance Disclaimer"
          className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
          aria-label="Safety Disclaimer"
        >
          <ShieldCheck className="w-4 h-4" />
        </button>
      </div>
    </header>
  )
}
