import React, { useState } from 'react'
import { X, RefreshCw, Check, AlertCircle } from 'lucide-react'
import { Exercise } from '../../types'

interface MachineSubstituteModalProps {
  isOpen: boolean
  currentExercise: Exercise | null
  availableExercises: Exercise[]
  onClose: () => void
  onSelectSubstitute: (substituteExercise: Exercise, reason: string) => void
}

export const MachineSubstituteModal: React.FC<MachineSubstituteModalProps> = ({
  isOpen,
  currentExercise,
  availableExercises,
  onClose,
  onSelectSubstitute
}) => {
  const [selectedReason, setSelectedReason] = useState<string>('Machine is occupied by another member')
  const [selectedExerciseId, setSelectedExerciseId] = useState<string>('')

  if (!isOpen || !currentExercise) return null

  const reasons = [
    'Machine is occupied by another member',
    'Machine is out of order / under maintenance',
    'Feels uncomfortable on joints / prefers alternative',
    'Custom equipment preference today'
  ]

  // Suggested alternatives from exercise definition first
  const directAlternatives = availableExercises.filter(e =>
    currentExercise.alternativeExerciseIds.includes(e.id)
  )

  // Other exercises matching category
  const sameCategory = availableExercises.filter(e =>
    e.category === currentExercise.category &&
    e.id !== currentExercise.id &&
    !currentExercise.alternativeExerciseIds.includes(e.id)
  )

  const handleConfirm = () => {
    const chosen = availableExercises.find(e => e.id === (selectedExerciseId || directAlternatives[0]?.id))
    if (chosen) {
      onSelectSubstitute(chosen, selectedReason)
      onClose()
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-[#0f172a] border-t sm:border border-slate-800 rounded-t-3xl sm:rounded-3xl w-full max-w-md max-h-[88vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-[#0f172a]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-sky-500/10 text-sky-400 flex items-center justify-center">
              <RefreshCw className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Substitute Machine</h2>
              <p className="text-[11px] text-slate-400 line-clamp-1">Replacing: {currentExercise.name}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-4 overflow-y-auto space-y-4 text-xs">
          {/* Reason Selection */}
          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
              Reason for Substitution
            </label>
            <div className="space-y-1.5">
              {reasons.map((r, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedReason(r)}
                  className={`w-full text-left p-2.5 rounded-xl border text-xs transition-colors flex items-center justify-between ${
                    selectedReason === r
                      ? 'bg-sky-950/60 border-sky-500 text-sky-200 font-medium'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <span>{r}</span>
                  {selectedReason === r && <Check className="w-4 h-4 text-sky-400 shrink-0" />}
                </button>
              ))}
            </div>
          </div>

          {/* Recommended Direct Alternatives */}
          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
              Recommended Biomechanical Matches
            </label>
            {directAlternatives.length === 0 ? (
              <p className="text-xs text-slate-500 italic p-2">No direct preset alternatives mapped.</p>
            ) : (
              <div className="space-y-2">
                {directAlternatives.map((alt) => {
                  const isSelected = (selectedExerciseId || directAlternatives[0]?.id) === alt.id
                  return (
                    <div
                      key={alt.id}
                      onClick={() => setSelectedExerciseId(alt.id)}
                      className={`p-3 rounded-2xl border cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-sky-950/70 border-sky-400 ring-1 ring-sky-400'
                          : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="text-sm font-bold text-white block">{alt.name}</span>
                          <span className="text-[11px] text-slate-400 mt-0.5 block">{alt.equipment}</span>
                        </div>
                        {isSelected && (
                          <span className="p-1 rounded-full bg-sky-500 text-slate-950">
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                          </span>
                        )}
                      </div>
                      <div className="mt-2 flex items-center gap-2 text-[10px] text-slate-400">
                        <span className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
                          {alt.recommendedSets} sets × {alt.recommendedRepsMin}–{alt.recommendedRepsMax} reps
                        </span>
                        <span className="text-sky-400">Target: {alt.primaryMuscle}</span>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {/* Other options in same category */}
          {sameCategory.length > 0 && (
            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                Other Available Options ({currentExercise.category})
              </label>
              <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                {sameCategory.map((alt) => {
                  const isSelected = selectedExerciseId === alt.id
                  return (
                    <div
                      key={alt.id}
                      onClick={() => setSelectedExerciseId(alt.id)}
                      className={`p-2.5 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                        isSelected
                          ? 'bg-sky-950/70 border-sky-400 ring-1 ring-sky-400'
                          : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div>
                        <span className="text-xs font-semibold text-slate-200 block">{alt.name}</span>
                        <span className="text-[10px] text-slate-400">{alt.equipment}</span>
                      </div>
                      {isSelected && <Check className="w-4 h-4 text-sky-400" />}
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Session Isolation Notice */}
          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-start gap-2 text-[10px] text-slate-400">
            <AlertCircle className="w-3.5 h-3.5 text-sky-400 shrink-0 mt-0.5" />
            <span>
              This substitution applies solely to this active session. Your original program template remains unchanged. Starting weights will not be blindly copied if leverage differs.
            </span>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-800 bg-[#0f172a] flex items-center gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="flex-1 py-3 rounded-xl bg-sky-500 hover:bg-sky-400 text-xs font-bold text-slate-950 shadow-lg shadow-sky-500/20"
          >
            Confirm Swap
          </button>
        </div>
      </div>
    </div>
  )
}
