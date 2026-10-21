import React, { useState } from 'react'
import {
  X,
  Plus,
  Search,
  Dumbbell,
  Clock,
  Sparkles,
  Check,
  Layers,
  ArrowRight
} from 'lucide-react'
import { Exercise, SessionExercise } from '../../types'

interface AddExerciseModalProps {
  isOpen: boolean
  availableExercises: Exercise[]
  currentExerciseIndex: number
  totalExercises: number
  onClose: () => void
  onAddExercise: (newExercise: SessionExercise, position: 'next' | 'end') => void
}

export const AddExerciseModal: React.FC<AddExerciseModalProps> = ({
  isOpen,
  availableExercises,
  currentExerciseIndex,
  totalExercises,
  onClose,
  onAddExercise
}) => {
  const [tab, setTab] = useState<'catalog' | 'custom'>('catalog')
  const [position, setPosition] = useState<'next' | 'end'>('next')

  // Catalog search & filter state
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedCatalogEx, setSelectedCatalogEx] = useState<Exercise | null>(null)

  // Custom exercise form state
  const [customName, setCustomName] = useState<string>('')
  const [customEquipment, setCustomEquipment] = useState<string>('Selectorized Machine')
  const [customCategory, setCustomCategory] = useState<'upper' | 'lower' | 'core' | 'cardio' | 'mobility'>('upper')
  const [customType, setCustomType] = useState<'reps' | 'duration'>('reps')
  const [customSets, setCustomSets] = useState<number>(2)
  const [customRepsMin, setCustomRepsMin] = useState<number>(10)
  const [customRepsMax, setCustomRepsMax] = useState<number>(12)
  const [customDurationSec, setCustomDurationSec] = useState<number>(60)
  const [customWeightKg, setCustomWeightKg] = useState<number>(25)
  const [customRestSec, setCustomRestSec] = useState<number>(90)
  const [customNotes, setCustomNotes] = useState<string>('')

  if (!isOpen) return null

  const filteredCatalog = availableExercises.filter(ex => {
    const matchesCat = selectedCategory === 'all' || ex.category === selectedCategory
    const matchesSearch =
      ex.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ex.equipment.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ex.primaryMuscle.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCat && matchesSearch
  })

  const handleAddFromCatalog = () => {
    if (!selectedCatalogEx) return

    const newEx: SessionExercise = {
      id: `sex-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      exerciseId: selectedCatalogEx.id,
      customExerciseName: selectedCatalogEx.name,
      customEquipment: selectedCatalogEx.equipment,
      customCategory: selectedCatalogEx.category,
      targetSets: selectedCatalogEx.recommendedSets || 2,
      targetRepsMin: selectedCatalogEx.recommendedRepsMin || 10,
      targetRepsMax: selectedCatalogEx.recommendedRepsMax || 12,
      targetDurationSeconds: selectedCatalogEx.durationSeconds,
      targetWeightKg: selectedCatalogEx.defaultWeightKg || 25,
      targetRestSec: selectedCatalogEx.recommendedRestSec || 90,
      isCustom: false,
      isSubstituted: false,
      order: 0,
      sets: [],
      skipped: false,
      completed: false
    }

    onAddExercise(newEx, position)
    onClose()
  }

  const handleAddCustom = () => {
    const trimmedName = customName.trim() || 'Custom Exercise'
    const customId = `custom-setup-${Date.now()}`

    const newEx: SessionExercise = {
      id: `sex-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      exerciseId: customId,
      customExerciseName: trimmedName,
      customEquipment: customEquipment.trim() || 'Gym Equipment',
      customCategory,
      targetSets: Number(customSets) || 2,
      targetRepsMin: customType === 'reps' ? Number(customRepsMin) || 10 : undefined,
      targetRepsMax: customType === 'reps' ? Number(customRepsMax) || 12 : undefined,
      targetDurationSeconds: customType === 'duration' ? Number(customDurationSec) || 60 : undefined,
      targetWeightKg: Number(customWeightKg) || 0,
      targetRestSec: Number(customRestSec) || 90,
      isCustom: true,
      isSubstituted: false,
      order: 0,
      sets: [],
      skipped: false,
      completed: false,
      notes: customNotes.trim()
    }

    onAddExercise(newEx, position)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-[#0f172a] border-t sm:border border-slate-800 rounded-t-3xl sm:rounded-3xl w-full max-w-lg max-h-[92vh] flex flex-col shadow-2xl overflow-hidden animate-in slide-in-from-bottom-6 duration-200">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-[#0f172a] sticky top-0 z-10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-sky-500/10 text-sky-400 flex items-center justify-center">
              <Plus className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white leading-tight">Add Exercise to Workout</h2>
              <p className="text-[11px] text-slate-400">Insert custom or catalog exercises into active session</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab & Placement Bar */}
        <div className="p-4 bg-slate-900/60 border-b border-slate-800 space-y-3">
          {/* Tab Selection */}
          <div className="grid grid-cols-2 gap-1.5 p-1 bg-slate-950 rounded-2xl border border-slate-800">
            <button
              onClick={() => setTab('catalog')}
              className={`py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                tab === 'catalog'
                  ? 'bg-sky-500 text-slate-950 shadow-md font-black'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Dumbbell className="w-3.5 h-3.5" />
              <span>Exercise Catalog</span>
            </button>
            <button
              onClick={() => setTab('custom')}
              className={`py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                tab === 'custom'
                  ? 'bg-sky-500 text-slate-950 shadow-md font-black'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Custom Setup</span>
            </button>
          </div>

          {/* Position Selector */}
          <div className="flex items-center justify-between text-xs px-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Insert Position:
            </span>
            <div className="flex gap-1.5">
              <button
                onClick={() => setPosition('next')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 border ${
                  position === 'next'
                    ? 'bg-sky-950 border-sky-400 text-sky-300'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <span>Next in Workout</span>
                <span className="text-[10px] text-slate-500 font-normal">
                  (Slot {currentExerciseIndex + 2})
                </span>
              </button>
              <button
                onClick={() => setPosition('end')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 border ${
                  position === 'end'
                    ? 'bg-sky-950 border-sky-400 text-sky-300'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <span>At the End</span>
                <span className="text-[10px] text-slate-500 font-normal">
                  (Slot {totalExercises + 1})
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="p-4 overflow-y-auto space-y-4 text-xs flex-1">
          {tab === 'catalog' ? (
            <div className="space-y-3">
              {/* Search Bar */}
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  placeholder="Search catalog by name, muscle, machine..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-2xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
                />
              </div>

              {/* Category Pills */}
              <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                {['all', 'upper', 'lower', 'core', 'cardio', 'mobility'].map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-2.5 py-1 rounded-xl text-[11px] font-bold capitalize transition-colors whitespace-nowrap ${
                      selectedCategory === cat
                        ? 'bg-sky-500 text-slate-950'
                        : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-white'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Exercise Selection List */}
              <div className="space-y-1.5 max-h-[42vh] overflow-y-auto pr-1">
                {filteredCatalog.map(ex => {
                  const isSelected = selectedCatalogEx?.id === ex.id
                  return (
                    <div
                      key={ex.id}
                      onClick={() => setSelectedCatalogEx(ex)}
                      className={`p-3 rounded-2xl border cursor-pointer transition-all flex items-center justify-between gap-3 ${
                        isSelected
                          ? 'bg-sky-950/70 border-sky-400 ring-1 ring-sky-400'
                          : 'bg-slate-900/80 border-slate-800/80 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 mb-0.5">
                          <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.2 rounded-full bg-sky-950 text-sky-400 border border-sky-800/60">
                            {ex.primaryMuscle}
                          </span>
                          <span className="text-[10px] text-slate-400 truncate">{ex.equipment}</span>
                        </div>
                        <h4 className="text-xs font-bold text-white truncate">{ex.name}</h4>
                        <span className="text-[10px] text-slate-500 block mt-0.5">
                          {ex.recommendedSets} sets × {ex.recommendedRepsMin}–{ex.recommendedRepsMax} reps • Rest: {ex.recommendedRestSec}s
                        </span>
                      </div>
                      {isSelected ? (
                        <div className="w-5 h-5 rounded-full bg-sky-500 text-slate-950 flex items-center justify-center shrink-0">
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </div>
                      ) : (
                        <span className="text-[11px] text-slate-500 font-semibold shrink-0">Select</span>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          ) : (
            /* Custom Exercise Setup Form */
            <div className="space-y-3.5">
              {/* Name */}
              <div>
                <label className="text-[11px] font-bold text-slate-300 block mb-1">
                  Exercise Name <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Incline Dumbbell Press, Plank, Cable Fly"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 font-medium"
                />
              </div>

              {/* Category & Equipment Row */}
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="text-[11px] font-bold text-slate-300 block mb-1">Target Category</label>
                  <select
                    value={customCategory}
                    onChange={(e) => setCustomCategory(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-sky-500 capitalize"
                  >
                    <option value="upper">Upper Body</option>
                    <option value="lower">Lower Body</option>
                    <option value="core">Core</option>
                    <option value="cardio">Cardio</option>
                    <option value="mobility">Mobility</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-300 block mb-1">Equipment</label>
                  <input
                    type="text"
                    placeholder="e.g. Cable Machine, Dumbbells"
                    value={customEquipment}
                    onChange={(e) => setCustomEquipment(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
                  />
                </div>
              </div>

              {/* Mode Toggle: Sets & Reps vs Timed Duration */}
              <div>
                <label className="text-[11px] font-bold text-slate-300 block mb-1">Tracking Format</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setCustomType('reps')}
                    className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                      customType === 'reps'
                        ? 'bg-sky-500 text-slate-950 border-sky-400 font-black'
                        : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    Weight & Reps (Sets)
                  </button>
                  <button
                    type="button"
                    onClick={() => setCustomType('duration')}
                    className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                      customType === 'duration'
                        ? 'bg-sky-500 text-slate-950 border-sky-400 font-black'
                        : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    Timed Duration (Seconds)
                  </button>
                </div>
              </div>

              {/* Sets, Reps/Duration, Weight, Rest inputs */}
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="text-[11px] font-bold text-slate-300 block mb-1">Target Sets</label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={customSets}
                    onChange={(e) => setCustomSets(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-500 font-mono"
                  />
                </div>

                {customType === 'reps' ? (
                  <div>
                    <label className="text-[11px] font-bold text-slate-300 block mb-1">Target Reps</label>
                    <div className="flex items-center gap-1">
                      <input
                        type="number"
                        min="1"
                        value={customRepsMin}
                        onChange={(e) => setCustomRepsMin(Math.max(1, parseInt(e.target.value) || 1))}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-2 text-xs text-center text-white focus:outline-none focus:border-sky-500 font-mono"
                      />
                      <span className="text-slate-500">–</span>
                      <input
                        type="number"
                        min="1"
                        value={customRepsMax}
                        onChange={(e) => setCustomRepsMax(Math.max(1, parseInt(e.target.value) || 1))}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-2 text-xs text-center text-white focus:outline-none focus:border-sky-500 font-mono"
                      />
                    </div>
                  </div>
                ) : (
                  <div>
                    <label className="text-[11px] font-bold text-slate-300 block mb-1">Duration (seconds)</label>
                    <input
                      type="number"
                      step="5"
                      min="5"
                      value={customDurationSec}
                      onChange={(e) => setCustomDurationSec(Math.max(5, parseInt(e.target.value) || 30))}
                      className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-500 font-mono"
                    />
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="text-[11px] font-bold text-slate-300 block mb-1">Starting Weight (kg)</label>
                  <input
                    type="number"
                    step="1.25"
                    min="0"
                    value={customWeightKg}
                    onChange={(e) => setCustomWeightKg(Math.max(0, parseFloat(e.target.value) || 0))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-500 font-mono"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-300 block mb-1">Rest Period (sec)</label>
                  <input
                    type="number"
                    step="15"
                    min="0"
                    value={customRestSec}
                    onChange={(e) => setCustomRestSec(Math.max(0, parseInt(e.target.value) || 60))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-500 font-mono"
                  />
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="text-[11px] font-bold text-slate-300 block mb-1">Setup / Ergonomics Cues (Optional)</label>
                <textarea
                  rows={2}
                  placeholder="e.g. Pin 4, bench at 30 degrees, focus on lat squeeze"
                  value={customNotes}
                  onChange={(e) => setCustomNotes(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-800 bg-[#0f172a] flex items-center gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={tab === 'catalog' ? handleAddFromCatalog : handleAddCustom}
            disabled={tab === 'catalog' && !selectedCatalogEx}
            className="flex-1 py-3 px-4 rounded-xl bg-sky-500 hover:bg-sky-400 disabled:opacity-40 text-xs font-bold text-slate-950 transition-all flex items-center justify-center gap-1.5 shadow-lg shadow-sky-500/20 active:scale-95"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Add Exercise</span>
          </button>
        </div>
      </div>
    </div>
  )
}
