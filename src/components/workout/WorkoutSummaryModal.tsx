import React, { useState } from 'react'
import { Trophy, Clock, CheckCircle2, Dumbbell, Save, AlertCircle } from 'lucide-react'
import { WorkoutSession } from '../../types'

interface WorkoutSummaryModalProps {
  session: WorkoutSession
  isOpen: boolean
  onSaveAndFinish: (notes: string, rating: number) => void
  onDismiss: () => void
}

export const WorkoutSummaryModal: React.FC<WorkoutSummaryModalProps> = ({
  session,
  isOpen,
  onSaveAndFinish,
  onDismiss
}) => {
  const [notes, setNotes] = useState<string>(session.notes || '')
  const [rating, setRating] = useState<number>(5)

  if (!isOpen) return null

  // Calculate statistics
  const completedExercises = session.exercises.filter(e => !e.skipped)
  const totalCompletedSets = session.exercises.reduce((acc, e) => {
    return acc + e.sets.filter(s => s.completed && !s.isWarmup).length
  }, 0)
  const totalSkippedSets = session.exercises.reduce((acc, e) => {
    return acc + (e.skipped ? e.sets.length : e.sets.filter(s => !s.completed).length)
  }, 0)
  const totalReps = session.exercises.reduce((acc, e) => {
    return acc + e.sets.filter(s => s.completed && !s.isWarmup).reduce((rAcc, s) => rAcc + s.actualReps, 0)
  }, 0)
  const totalVolume = session.exercises.reduce((acc, e) => {
    return acc + e.sets.filter(s => s.completed && !s.isWarmup).reduce((vAcc, s) => vAcc + (s.actualWeightKg * s.actualReps), 0)
  }, 0)

  const durationMin = Math.round(session.durationSeconds / 60)

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#0f172a] border border-slate-800 rounded-3xl w-full max-w-md max-h-[92vh] flex flex-col shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Celebration Header */}
        <div className="p-6 text-center border-b border-slate-800/80 bg-gradient-to-b from-sky-950/40 to-transparent">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-sky-400 to-emerald-400 flex items-center justify-center mx-auto mb-3 shadow-lg shadow-sky-500/20 text-slate-950">
            <Trophy className="w-8 h-8 fill-current" />
          </div>
          <span className="text-xs uppercase font-extrabold tracking-wider text-emerald-400 bg-emerald-950/80 px-3 py-1 rounded-full border border-emerald-800/60 inline-block mb-1">
            Workout Complete!
          </span>
          <h2 className="text-xl font-black text-white mt-1">{session.templateName}</h2>
          <p className="text-xs text-slate-400 mt-1">Session logged locally to your device</p>
        </div>

        {/* Scrollable Stats */}
        <div className="p-5 overflow-y-auto space-y-4 text-xs">
          {/* Key Metric Cards */}
          <div className="grid grid-cols-2 gap-2.5">
            <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800">
              <span className="text-[11px] text-slate-400 flex items-center gap-1 mb-1">
                <Clock className="w-3.5 h-3.5 text-sky-400" /> Duration
              </span>
              <span className="text-xl font-extrabold text-white">{durationMin} min</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800">
              <span className="text-[11px] text-slate-400 flex items-center gap-1 mb-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Sets Completed
              </span>
              <span className="text-xl font-extrabold text-emerald-400">
                {totalCompletedSets} <span className="text-xs font-normal text-slate-500">sets</span>
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800">
              <span className="text-[11px] text-slate-400 flex items-center gap-1 mb-1">
                <Dumbbell className="w-3.5 h-3.5 text-sky-400" /> Total Repetitions
              </span>
              <span className="text-xl font-extrabold text-white">
                {totalReps} <span className="text-xs font-normal text-slate-500">reps</span>
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800">
              <span className="text-[11px] text-slate-400 flex items-center gap-1 mb-1">
                <Trophy className="w-3.5 h-3.5 text-amber-400" /> Total Weight Load
              </span>
              <span className="text-xl font-extrabold text-sky-300">
                {Math.round(totalVolume).toLocaleString()} <span className="text-xs font-normal text-slate-500">kg</span>
              </span>
            </div>
          </div>

          {/* Calorie Disclaimer as required */}
          <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 text-[10px] text-slate-400 flex items-start gap-1.5">
            <AlertCircle className="w-3.5 h-3.5 text-slate-500 shrink-0 mt-0.5" />
            <span>
              Weight machine volume reflects mechanical resistance load, not calories burned. Caloric expenditure in resistance training varies by metabolism and is not estimated here.
            </span>
          </div>

          {/* Exercise Breakdown List */}
          <div>
            <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
              Exercise Breakdown ({completedExercises.length} completed)
            </h3>
            <div className="space-y-1.5">
              {session.exercises.map((e, idx) => {
                const completedCount = e.sets.filter(s => s.completed && !s.isWarmup).length
                return (
                  <div
                    key={idx}
                    className="p-2.5 rounded-xl bg-slate-900 border border-slate-800/80 flex items-center justify-between"
                  >
                    <div>
                      <span className="text-xs font-semibold text-slate-200 block">
                        {e.exerciseId.replace('mach-', '').replace(/-/g, ' ').toUpperCase()}
                      </span>
                      {e.isSubstituted && (
                        <span className="text-[10px] text-amber-400">Substituted machine</span>
                      )}
                      {e.skipped && (
                        <span className="text-[10px] text-red-400">Skipped: {e.skipReason || 'Time constraint'}</span>
                      )}
                    </div>
                    <span className="text-xs font-bold text-sky-400">
                      {completedCount} sets
                    </span>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Session Rating */}
          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
              How did today feel?
            </label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-colors ${
                    rating >= star
                      ? 'bg-sky-500/20 border-sky-500 text-sky-300'
                      : 'bg-slate-900 border-slate-800 text-slate-500'
                  }`}
                >
                  ★ {star}
                </button>
              ))}
            </div>
          </div>

          {/* Workout Notes */}
          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
              Session Notes & Machine Pin Reminders
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Chest press seat pin #4 felt optimal; left shoulder felt smooth."
              rows={2}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-sky-500"
            />
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-800 bg-[#0f172a] flex items-center gap-3">
          <button
            onClick={onDismiss}
            className="py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-400"
          >
            Review Later
          </button>
          <button
            onClick={() => onSaveAndFinish(notes, rating)}
            className="flex-1 py-3 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-xs font-bold text-slate-950 shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-1.5"
          >
            <Save className="w-4 h-4" />
            <span>Save & Finish Session</span>
          </button>
        </div>
      </div>
    </div>
  )
}
