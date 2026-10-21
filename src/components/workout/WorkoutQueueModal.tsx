import React, { useState } from 'react'
import {
  X,
  Plus,
  ArrowUp,
  ArrowDown,
  Trash2,
  Edit3,
  CheckCircle2,
  Clock,
  Dumbbell,
  Play,
  RotateCcw,
  Sparkles,
  Check,
  ChevronRight
} from 'lucide-react'
import { SessionExercise, Exercise } from '../../types'
import { resolveSessionExercise } from '../../utils/workoutProgression'

interface WorkoutQueueModalProps {
  isOpen: boolean
  exercises: SessionExercise[]
  availableExercises: Exercise[]
  currentIndex: number
  onClose: () => void
  onSelectExercise: (index: number) => void
  onMoveExercise: (fromIndex: number, toIndex: number) => void
  onRemoveExercise: (index: number) => void
  onUpdateExercise: (index: number, updated: Partial<SessionExercise>) => void
  onOpenAddModal: () => void
}

export const WorkoutQueueModal: React.FC<WorkoutQueueModalProps> = ({
  isOpen,
  exercises,
  availableExercises,
  currentIndex,
  onClose,
  onSelectExercise,
  onMoveExercise,
  onRemoveExercise,
  onUpdateExercise,
  onOpenAddModal
}) => {
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [editSets, setEditSets] = useState<number>(2)
  const [editRepsMin, setEditRepsMin] = useState<number>(10)
  const [editRepsMax, setEditRepsMax] = useState<number>(12)
  const [editWeightKg, setEditWeightKg] = useState<number>(20)
  const [editRestSec, setEditRestSec] = useState<number>(90)
  const [editDurationSec, setEditDurationSec] = useState<number>(60)

  if (!isOpen) return null

  const handleStartEdit = (index: number, ex: SessionExercise) => {
    const resolved = resolveSessionExercise(ex, availableExercises)
    setEditingIndex(index)
    setEditSets(ex.targetSets ?? resolved.recommendedSets ?? 2)
    setEditRepsMin(ex.targetRepsMin ?? resolved.recommendedRepsMin ?? 10)
    setEditRepsMax(ex.targetRepsMax ?? resolved.recommendedRepsMax ?? 12)
    setEditWeightKg(ex.targetWeightKg ?? resolved.defaultWeightKg ?? 20)
    setEditRestSec(ex.targetRestSec ?? resolved.recommendedRestSec ?? 90)
    setEditDurationSec(ex.targetDurationSeconds ?? resolved.durationSeconds ?? 60)
  }

  const handleSaveEdit = (index: number) => {
    onUpdateExercise(index, {
      targetSets: editSets,
      targetRepsMin: editRepsMin,
      targetRepsMax: editRepsMax,
      targetWeightKg: editWeightKg,
      targetRestSec: editRestSec,
      targetDurationSeconds: editDurationSec
    })
    setEditingIndex(null)
  }

  const handleCancelEdit = () => {
    setEditingIndex(null)
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
      <div className="bg-[#0f172a] border border-slate-800 rounded-3xl w-full max-w-lg max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/60">
          <div>
            <h2 className="text-base font-extrabold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-sky-400" />
              <span>Workout Exercise Queue</span>
            </h2>
            <p className="text-xs text-slate-400">
              {exercises.length} exercises • Reorder, customize setups, or add moves
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Exercises List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
          {exercises.map((ex, index) => {
            const resolved = resolveSessionExercise(ex, availableExercises)
            const isActive = index === currentIndex
            const isCompleted = Boolean(ex.completed)
            const isSkipped = Boolean(ex.skipped)
            const completedSetsCount = ex.sets?.filter(s => s.completed && !s.isWarmup).length || 0
            const targetSetsCount = ex.targetSets ?? resolved.recommendedSets ?? 2
            const isEditing = editingIndex === index

            return (
              <div
                key={ex.id || `queue-ex-${index}`}
                className={`p-3.5 rounded-2xl border transition-all ${
                  isActive
                    ? 'bg-sky-950/40 border-sky-500/80 ring-1 ring-sky-500/40 shadow-lg shadow-sky-500/10'
                    : isCompleted
                    ? 'bg-emerald-950/20 border-emerald-800/40 opacity-90'
                    : isSkipped
                    ? 'bg-red-950/20 border-red-800/40 opacity-70'
                    : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
                }`}
              >
                {/* Main Card Info */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-2.5 flex-1 min-w-0">
                    <div
                      className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-black shrink-0 mt-0.5 ${
                        isActive
                          ? 'bg-sky-500 text-slate-950 shadow-md shadow-sky-500/30'
                          : isCompleted
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : isSkipped
                          ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {isCompleted ? <Check className="w-4 h-4 stroke-[3]" /> : index + 1}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className="font-extrabold text-sm text-white truncate">
                          {resolved.name}
                        </span>
                        {isActive && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-sky-500 text-slate-950">
                            Active Now
                          </span>
                        )}
                        {isCompleted && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                            Completed
                          </span>
                        )}
                        {isSkipped && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-500/20 text-red-300 border border-red-500/30">
                            Skipped
                          </span>
                        )}
                        {ex.isCustom && (
                          <span className="px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-purple-950 text-purple-300 border border-purple-800/60">
                            Custom Setup
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-slate-400 truncate">
                        {resolved.equipment} • {resolved.primaryMuscle}
                      </p>

                      <div className="flex items-center gap-3 mt-1.5 text-xs text-slate-300">
                        {ex.targetDurationSeconds ? (
                          <span className="flex items-center gap-1 font-mono text-sky-400">
                            <Clock className="w-3.5 h-3.5" />
                            {ex.targetDurationSeconds}s duration
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 font-mono text-sky-400">
                            <Dumbbell className="w-3.5 h-3.5" />
                            {targetSetsCount} sets × {resolved.recommendedRepsMin}–{resolved.recommendedRepsMax} reps
                          </span>
                        )}
                        <span className="text-slate-500">•</span>
                        <span className="text-slate-400">
                          {completedSetsCount}/{targetSetsCount} logged
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Move & Actions */}
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => onMoveExercise(index, index - 1)}
                      disabled={index === 0}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-20 text-slate-300 transition-colors"
                      title="Move up in order"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onMoveExercise(index, index + 1)}
                      disabled={index === exercises.length - 1}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-20 text-slate-300 transition-colors"
                      title="Move down in order"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => (isEditing ? handleCancelEdit() : handleStartEdit(index, ex))}
                      className={`p-1.5 rounded-lg transition-colors ${
                        isEditing
                          ? 'bg-amber-500 text-slate-950 font-bold'
                          : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                      }`}
                      title="Edit sets, reps, weight, or rest"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    {exercises.length > 1 && (
                      <button
                        onClick={() => onRemoveExercise(index)}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-900/60 text-slate-400 hover:text-rose-300 transition-colors"
                        title="Remove exercise from workout"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Inline Edit Form */}
                {isEditing && (
                  <div className="mt-3 pt-3 border-t border-slate-800/80 space-y-3 bg-slate-950/60 p-3 rounded-xl">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      <div>
                        <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                          Sets
                        </label>
                        <input
                          type="number"
                          min="1"
                          max="10"
                          value={editSets}
                          onChange={e => setEditSets(Math.max(1, parseInt(e.target.value) || 1))}
                          className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs font-bold text-white text-center"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                          Weight (kg)
                        </label>
                        <input
                          type="number"
                          step="2.5"
                          min="0"
                          value={editWeightKg}
                          onChange={e => setEditWeightKg(Math.max(0, parseFloat(e.target.value) || 0))}
                          className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs font-bold text-white text-center"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                          Reps Range
                        </label>
                        <div className="flex items-center gap-1">
                          <input
                            type="number"
                            min="1"
                            value={editRepsMin}
                            onChange={e => setEditRepsMin(Math.max(1, parseInt(e.target.value) || 1))}
                            className="w-1/2 px-1.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs font-bold text-white text-center"
                          />
                          <span className="text-slate-500 text-xs">-</span>
                          <input
                            type="number"
                            min="1"
                            value={editRepsMax}
                            onChange={e => setEditRepsMax(Math.max(editRepsMin, parseInt(e.target.value) || 1))}
                            className="w-1/2 px-1.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs font-bold text-white text-center"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                          Rest (s)
                        </label>
                        <input
                          type="number"
                          step="15"
                          min="15"
                          value={editRestSec}
                          onChange={e => setEditRestSec(Math.max(15, parseInt(e.target.value) || 60))}
                          className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs font-bold text-white text-center"
                        />
                      </div>
                    </div>

                    {ex.targetDurationSeconds !== undefined && (
                      <div>
                        <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                          Duration (seconds)
                        </label>
                        <input
                          type="number"
                          step="15"
                          min="10"
                          value={editDurationSec}
                          onChange={e => setEditDurationSec(Math.max(10, parseInt(e.target.value) || 60))}
                          className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs font-bold text-white text-center"
                        />
                      </div>
                    )}

                    <div className="flex items-center justify-end gap-2 pt-1">
                      <button
                        onClick={handleCancelEdit}
                        className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleSaveEdit(index)}
                        className="px-3 py-1.5 rounded-lg bg-sky-500 hover:bg-sky-400 text-xs font-extrabold text-slate-950 flex items-center gap-1"
                      >
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                        <span>Save Setup</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* Jump to Exercise Button if not currently active */}
                {!isActive && (
                  <div className="mt-2.5 pt-2 border-t border-slate-800/60 flex items-center justify-end">
                    <button
                      onClick={() => {
                        onSelectExercise(index)
                        onClose()
                      }}
                      className="px-3 py-1 rounded-xl bg-slate-800 hover:bg-sky-500/20 hover:text-sky-300 text-slate-300 text-xs font-semibold flex items-center gap-1 transition-all"
                    >
                      <span>Jump to this exercise</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/60 flex items-center justify-between gap-3">
          <button
            onClick={() => {
              onClose()
              onOpenAddModal()
            }}
            className="flex-1 py-3 px-4 rounded-2xl bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-400 hover:to-cyan-400 text-slate-950 font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-sky-500/20 active:scale-98 transition-all"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>+ Add Exercise / Custom Setup</span>
          </button>
          <button
            onClick={onClose}
            className="px-5 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs sm:text-sm font-bold"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  )
}
