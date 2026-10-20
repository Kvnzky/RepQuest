import React, { useState, useEffect, useRef } from 'react'
import {
  ChevronLeft,
  ChevronRight,
  Clock,
  CheckCircle,
  Undo2,
  Info,
  RefreshCw,
  FastForward,
  Play,
  Pause,
  Flame,
  Check,
  Timer as TimerIcon
} from 'lucide-react'
import {
  WorkoutSession,
  Exercise,
  LoggedSet,
  SessionExercise
} from '../../types'
import { db } from '../../db'
import { audioTimer } from '../../utils/audioTimer'
import { RestTimerModal } from './RestTimerModal'
import { ExerciseDetailModal } from './ExerciseDetailModal'
import { MachineSubstituteModal } from './MachineSubstituteModal'
import { WorkoutSummaryModal } from './WorkoutSummaryModal'

interface WorkoutModeProps {
  session: WorkoutSession
  availableExercises: Exercise[]
  autoTimerStart: boolean
  timerSoundEnabled: boolean
  timerVibrateEnabled: boolean
  defaultRestSec: number
  onExitWorkout: () => void
  onWorkoutCompleted: (completedSession: WorkoutSession) => void
}

export const WorkoutMode: React.FC<WorkoutModeProps> = ({
  session: initialSession,
  availableExercises,
  autoTimerStart,
  timerSoundEnabled,
  timerVibrateEnabled,
  defaultRestSec,
  onExitWorkout,
  onWorkoutCompleted
}) => {
  const [session, setSession] = useState<WorkoutSession>(initialSession)
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState<number>(0)
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(initialSession.durationSeconds || 0)
  const [isTimerPaused, setIsTimerPaused] = useState<boolean>(false)

  // Modals
  const [isRestTimerOpen, setIsRestTimerOpen] = useState<boolean>(false)
  const [restTimerDuration, setRestTimerDuration] = useState<number>(defaultRestSec)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState<boolean>(false)
  const [isSubstituteModalOpen, setIsSubstituteModalOpen] = useState<boolean>(false)
  const [isSummaryModalOpen, setIsSummaryModalOpen] = useState<boolean>(false)

  // Current set inputs
  const [inputWeight, setInputWeight] = useState<number>(40)
  const [inputReps, setInputReps] = useState<number>(10)
  const [inputRir, setInputRir] = useState<number>(2) // Reps in reserve
  const [isLoggingSet, setIsLoggingSet] = useState<boolean>(false)

  // Active exercise & meta
  const currentSessionEx: SessionExercise | undefined = session.exercises[currentExerciseIndex]
  const currentExerciseData: Exercise | undefined = availableExercises.find(
    e => e.id === currentSessionEx?.exerciseId
  )

  // Target sets count
  const targetWorkingSets = currentExerciseData?.recommendedSets || 2
  const completedWorkingSets = currentSessionEx?.sets.filter(s => s.completed && !s.isWarmup) || []
  const currentSetNumber = completedWorkingSets.length + 1

  // Synchronize inputs when changing exercises
  useEffect(() => {
    if (currentExerciseData) {
      // Find latest completed set in this exercise, or default target
      const lastSet = currentSessionEx?.sets.filter(s => s.completed).slice(-1)[0]
      if (lastSet) {
        setInputWeight(lastSet.actualWeightKg)
        setInputReps(lastSet.actualReps)
        setInputRir(lastSet.repsInReserve ?? 2)
      } else {
        setInputWeight(currentExerciseData.defaultWeightKg || 40)
        setInputReps(currentExerciseData.recommendedRepsMin || 10)
        setInputRir(2)
      }
    }
  }, [currentExerciseIndex, currentExerciseData, currentSessionEx])

  // Workout duration timer
  const elapsedRef = useRef(elapsedSeconds)
  elapsedRef.current = elapsedSeconds

  useEffect(() => {
    const interval = setInterval(() => {
      if (!isTimerPaused) {
        setElapsedSeconds(prev => {
          const next = prev + 1
          // Periodically save elapsed time to IndexedDB
          if (next % 10 === 0) {
            db.workoutSessions.update(session.id, { durationSeconds: next }).catch(() => {})
          }
          return next
        })
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [isTimerPaused, session.id])

  // Mark Warmup complete
  const handleToggleWarmUp = async () => {
    const nextStatus = !session.warmUpCompleted
    const updated = { ...session, warmUpCompleted: nextStatus }
    setSession(updated)
    await db.workoutSessions.update(session.id, { warmUpCompleted: nextStatus })
    audioTimer.playSetLoggedTone()
  }

  // Set Logging action (with debounce guard against double clicks)
  const handleLogSet = async () => {
    if (isLoggingSet || !currentSessionEx || !currentExerciseData) return
    setIsLoggingSet(true)

    try {
      const newSet: LoggedSet = {
        id: `set-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        setNumber: currentSetNumber,
        isWarmup: false,
        targetWeightKg: currentExerciseData.defaultWeightKg,
        targetReps: currentExerciseData.recommendedRepsMax,
        actualWeightKg: Number(inputWeight) || 0,
        actualReps: Number(inputReps) || 0,
        repsInReserve: Number(inputRir),
        effortRatingRpe: 10 - Number(inputRir),
        completed: true,
        completedAt: new Date().toISOString()
      }

      const updatedExercises = [...session.exercises]
      const exIndex = currentExerciseIndex
      const exToUpdate = { ...updatedExercises[exIndex] }
      exToUpdate.sets = [...exToUpdate.sets, newSet]
      updatedExercises[exIndex] = exToUpdate

      const updatedSession: WorkoutSession = {
        ...session,
        exercises: updatedExercises,
        durationSeconds: elapsedRef.current
      }

      setSession(updatedSession)
      await db.workoutSessions.put(updatedSession)

      // Audio feedback
      audioTimer.playSetLoggedTone()
      if (timerVibrateEnabled) audioTimer.vibrate(80)

      // Trigger rest timer if enabled
      if (autoTimerStart) {
        setRestTimerDuration(currentExerciseData.recommendedRestSec || defaultRestSec)
        setIsRestTimerOpen(true)
      }
    } finally {
      setTimeout(() => setIsLoggingSet(false), 400)
    }
  }

  // Undo last logged set
  const handleUndoSet = async () => {
    if (!currentSessionEx || currentSessionEx.sets.length === 0) return

    const updatedExercises = [...session.exercises]
    const exIndex = currentExerciseIndex
    const exToUpdate = { ...updatedExercises[exIndex] }
    exToUpdate.sets = exToUpdate.sets.slice(0, -1)
    updatedExercises[exIndex] = exToUpdate

    const updatedSession: WorkoutSession = {
      ...session,
      exercises: updatedExercises,
      durationSeconds: elapsedRef.current
    }

    setSession(updatedSession)
    await db.workoutSessions.put(updatedSession)
  }

  // Skip exercise
  const handleSkipExercise = async () => {
    if (!currentSessionEx) return

    const updatedExercises = [...session.exercises]
    const exIndex = currentExerciseIndex
    updatedExercises[exIndex] = {
      ...updatedExercises[exIndex],
      skipped: true,
      skipReason: 'Skipped to preserve workout time / machine busy'
    }

    const updatedSession: WorkoutSession = {
      ...session,
      exercises: updatedExercises,
      durationSeconds: elapsedRef.current
    }

    setSession(updatedSession)
    await db.workoutSessions.put(updatedSession)

    // Advance to next exercise if available
    if (currentExerciseIndex < session.exercises.length - 1) {
      setCurrentExerciseIndex(prev => prev + 1)
    }
  }

  // Handle machine substitution
  const handleSubstituteMachine = async (substituteExercise: Exercise, reason: string) => {
    if (!currentSessionEx) return

    const updatedExercises = [...session.exercises]
    const exIndex = currentExerciseIndex
    updatedExercises[exIndex] = {
      ...updatedExercises[exIndex],
      originalExerciseId: updatedExercises[exIndex].originalExerciseId || updatedExercises[exIndex].exerciseId,
      exerciseId: substituteExercise.id,
      isSubstituted: true,
      substitutionReason: reason
    }

    const updatedSession: WorkoutSession = {
      ...session,
      exercises: updatedExercises,
      durationSeconds: elapsedRef.current
    }

    setSession(updatedSession)
    await db.workoutSessions.put(updatedSession)

    // Reset input weight for new machine leverage
    setInputWeight(substituteExercise.defaultWeightKg || 30)
    setInputReps(substituteExercise.recommendedRepsMin || 10)
  }

  // End workout prompt
  const handleFinishWorkoutClick = () => {
    setIsSummaryModalOpen(true)
  }

  // Save and complete workout
  const handleSaveAndComplete = async (notes: string, rating: number) => {
    const finalSession: WorkoutSession = {
      ...session,
      status: 'completed',
      durationSeconds: elapsedRef.current,
      endTime: new Date().toISOString(),
      notes,
      rating
    }

    await db.workoutSessions.put(finalSession)
    setIsSummaryModalOpen(false)
    onWorkoutCompleted(finalSession)
  }

  const formatElapsed = (sec: number) => {
    const m = Math.floor(sec / 60)
    const s = sec % 60
    return `${m}:${s < 10 ? '0' : ''}${s}`
  }

  return (
    <div className="fixed inset-0 z-40 bg-[#090d16] flex flex-col text-slate-100 overflow-hidden select-none">
      {/* Top Distraction-Free Header */}
      <div className="bg-[#0f172a] border-b border-slate-800 px-4 py-3 flex items-center justify-between z-10">
        <div className="flex items-center gap-2">
          <button
            onClick={onExitWorkout}
            className="p-2 -ml-1 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300"
            title="Minimize workout"
            aria-label="Back / Minimize"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-sm font-bold text-white line-clamp-1">{session.templateName}</h1>
            <div className="flex items-center gap-2 text-[11px] text-slate-400">
              <span className="flex items-center gap-1 font-mono text-sky-400 font-semibold">
                <Clock className="w-3.5 h-3.5" />
                {formatElapsed(elapsedSeconds)}
              </span>
              <span>•</span>
              <span>
                Exercise {currentExerciseIndex + 1} of {session.exercises.length}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsTimerPaused(!isTimerPaused)}
            className={`p-2 rounded-xl text-xs font-semibold border ${
              isTimerPaused
                ? 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                : 'bg-slate-800 text-slate-400 border-slate-700'
            }`}
            title={isTimerPaused ? 'Resume Elapsed Timer' : 'Pause Elapsed Timer'}
          >
            {isTimerPaused ? <Play className="w-4 h-4 fill-current" /> : <Pause className="w-4 h-4 fill-current" />}
          </button>

          <button
            onClick={() => {
              setRestTimerDuration(currentExerciseData?.recommendedRestSec || defaultRestSec)
              setIsRestTimerOpen(true)
            }}
            className="flex items-center gap-1 px-3 py-2 rounded-xl bg-sky-950/80 border border-sky-800 text-sky-300 text-xs font-bold hover:bg-sky-900 transition-colors"
          >
            <TimerIcon className="w-4 h-4 text-sky-400" />
            <span>Rest</span>
          </button>

          <button
            onClick={handleFinishWorkoutClick}
            className="px-3 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-extrabold shadow-lg shadow-emerald-500/20"
          >
            Finish
          </button>
        </div>
      </div>

      {/* Main Exercise Content Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-28">
        {/* Warmup Status Banner (Essential prompt requirement) */}
        <div className={`p-3.5 rounded-2xl border transition-all ${
          session.warmUpCompleted
            ? 'bg-emerald-950/30 border-emerald-800/40'
            : 'bg-slate-900 border-sky-800/60 ring-1 ring-sky-500/30'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                session.warmUpCompleted ? 'bg-emerald-500/20 text-emerald-400' : 'bg-sky-500/20 text-sky-400'
              }`}>
                <Flame className="w-4 h-4 fill-current" />
              </div>
              <div>
                <span className="text-xs font-bold text-white block">
                  {session.warmUpCompleted ? 'Warm-up Complete' : 'Pre-Workout Warm-Up'}
                </span>
                <span className="text-[11px] text-slate-400 block">
                  5–8 min treadmill/bike + dynamic mobility + practice sets
                </span>
              </div>
            </div>

            <button
              onClick={handleToggleWarmUp}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 ${
                session.warmUpCompleted
                  ? 'bg-emerald-500 text-slate-950'
                  : 'bg-sky-500 hover:bg-sky-400 text-slate-950'
              }`}
            >
              <Check className="w-3.5 h-3.5 stroke-[3]" />
              <span>{session.warmUpCompleted ? 'Done' : 'Mark Ready'}</span>
            </button>
          </div>
        </div>

        {/* Current Exercise Header Card */}
        {currentExerciseData && (
          <div className="p-4 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl relative overflow-hidden">
            {/* Top row */}
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-sky-950 text-sky-400 border border-sky-800/60">
                    {currentExerciseData.primaryMuscle}
                  </span>
                  {currentSessionEx?.isSubstituted && (
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-950 text-amber-400 border border-amber-800/60">
                      Substituted
                    </span>
                  )}
                  {currentSessionEx?.skipped && (
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-red-950 text-red-400 border border-red-800/60">
                      Skipped
                    </span>
                  )}
                </div>
                <h2 className="text-xl font-extrabold text-white leading-tight">
                  {currentExerciseData.name}
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">{currentExerciseData.equipment}</p>
              </div>

              <div className="flex gap-1.5">
                <button
                  onClick={() => setIsDetailModalOpen(true)}
                  className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700"
                  title="Exercise Instructions & Cues"
                  aria-label="Instructions"
                >
                  <Info className="w-4 h-4 text-sky-400" />
                </button>
                <button
                  onClick={() => setIsSubstituteModalOpen(true)}
                  className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700"
                  title="Substitute Machine (Occupied / Unavailable)"
                  aria-label="Substitute"
                >
                  <RefreshCw className="w-4 h-4 text-amber-400" />
                </button>
              </div>
            </div>

            {/* Target Prescriptions */}
            <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
              <div className="flex items-center gap-4">
                <div>
                  <span className="text-[10px] text-slate-500 uppercase block font-semibold">Target</span>
                  <span className="text-sm font-bold text-sky-400">
                    {targetWorkingSets} sets × {currentExerciseData.recommendedRepsMin}–{currentExerciseData.recommendedRepsMax} reps
                  </span>
                </div>
                <div className="border-l border-slate-800 pl-4">
                  <span className="text-[10px] text-slate-500 uppercase block font-semibold">Rest</span>
                  <span className="text-sm font-bold text-slate-300">
                    {currentExerciseData.recommendedRestSec}s
                  </span>
                </div>
              </div>

              {/* Set Progress Indicator */}
              <div className="flex items-center gap-1.5">
                {Array.from({ length: targetWorkingSets }).map((_, idx) => {
                  const isDone = idx < completedWorkingSets.length
                  const isCurrent = idx === completedWorkingSets.length
                  return (
                    <div
                      key={idx}
                      className={`w-7 h-7 rounded-xl flex items-center justify-center font-bold text-xs ${
                        isDone
                          ? 'bg-emerald-500 text-slate-950 font-black'
                          : isCurrent
                          ? 'bg-sky-500/20 border-2 border-sky-400 text-sky-300'
                          : 'bg-slate-800 text-slate-500'
                      }`}
                    >
                      {idx + 1}
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        )}

        {/* Input Interface: Weight, Reps, RIR (Optimized for One-Hand Mobile Tap Targets) */}
        <div className="p-4 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Set #{currentSetNumber} Details
            </span>
            {completedWorkingSets.length > 0 && (
              <span className="text-xs text-emerald-400 font-semibold">
                {completedWorkingSets.length} of {targetWorkingSets} logged
              </span>
            )}
          </div>

          {/* Weight Controls */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-bold text-slate-300">Machine Weight (kg)</label>
              <div className="flex gap-1">
                {[2.5, 5, 10].map(inc => (
                  <button
                    key={inc}
                    onClick={() => setInputWeight(prev => Math.max(0, prev + inc))}
                    className="px-2 py-0.5 rounded bg-slate-800 text-[10px] font-bold text-slate-300 hover:bg-slate-700"
                  >
                    +{inc}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setInputWeight(prev => Math.max(0, prev - (currentExerciseData?.weightIncrementKg || 2.5)))}
                className="w-14 h-14 rounded-2xl bg-slate-800 hover:bg-slate-700 active:scale-95 text-xl font-bold text-slate-200 border border-slate-700 flex items-center justify-center"
              >
                -
              </button>
              <input
                type="number"
                step="1.25"
                min="0"
                value={inputWeight}
                onChange={(e) => setInputWeight(Math.max(0, parseFloat(e.target.value) || 0))}
                className="flex-1 h-14 rounded-2xl bg-slate-950 border border-slate-800 text-center text-3xl font-black text-sky-400 font-mono focus:outline-none focus:border-sky-500"
              />
              <button
                onClick={() => setInputWeight(prev => prev + (currentExerciseData?.weightIncrementKg || 2.5))}
                className="w-14 h-14 rounded-2xl bg-slate-800 hover:bg-slate-700 active:scale-95 text-xl font-bold text-slate-200 border border-slate-700 flex items-center justify-center"
              >
                +
              </button>
            </div>
          </div>

          {/* Reps Controls */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-bold text-slate-300">Reps Completed</label>
              <div className="flex gap-1">
                {[10, 12, 15].map(target => (
                  <button
                    key={target}
                    onClick={() => setInputReps(target)}
                    className="px-2 py-0.5 rounded bg-slate-800 text-[10px] font-bold text-slate-300 hover:bg-slate-700"
                  >
                    {target}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setInputReps(prev => Math.max(1, prev - 1))}
                className="w-14 h-14 rounded-2xl bg-slate-800 hover:bg-slate-700 active:scale-95 text-xl font-bold text-slate-200 border border-slate-700 flex items-center justify-center"
              >
                -
              </button>
              <input
                type="number"
                min="1"
                max="99"
                value={inputReps}
                onChange={(e) => setInputReps(Math.max(1, parseInt(e.target.value) || 1))}
                className="flex-1 h-14 rounded-2xl bg-slate-950 border border-slate-800 text-center text-3xl font-black text-white font-mono focus:outline-none focus:border-sky-500"
              />
              <button
                onClick={() => setInputReps(prev => prev + 1)}
                className="w-14 h-14 rounded-2xl bg-slate-800 hover:bg-slate-700 active:scale-95 text-xl font-bold text-slate-200 border border-slate-700 flex items-center justify-center"
              >
                +
              </button>
            </div>
          </div>

          {/* RIR (Reps in Reserve) Selector */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-slate-300">
                Reps in Reserve (RIR)
              </label>
              <span className="text-[11px] text-sky-400 font-semibold">
                {inputRir === 0 ? '0 (Max failure)' : `${inputRir} reps left in tank`}
              </span>
            </div>
            <div className="grid grid-cols-5 gap-1.5">
              {[0, 1, 2, 3, 4].map(rir => (
                <button
                  key={rir}
                  onClick={() => setInputRir(rir)}
                  className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                    inputRir === rir
                      ? 'bg-sky-500 text-slate-950 border-sky-400 font-black'
                      : 'bg-slate-800 text-slate-300 border-slate-700 hover:border-slate-600'
                  }`}
                >
                  {rir} {rir === 0 ? '(0 RIR)' : 'RIR'}
                </button>
              ))}
            </div>
          </div>

          {/* Giant Mark-Set-Complete Action Button */}
          <button
            onClick={handleLogSet}
            disabled={isLoggingSet}
            className="w-full h-16 rounded-2xl bg-gradient-to-r from-sky-400 to-cyan-400 hover:from-sky-300 hover:to-cyan-300 active:scale-[0.98] text-slate-950 font-black text-lg flex items-center justify-center gap-2 shadow-xl shadow-sky-500/20 transition-all disabled:opacity-50"
          >
            <CheckCircle className="w-6 h-6 stroke-[2.5]" />
            <span>Complete Set #{currentSetNumber}</span>
          </button>
        </div>

        {/* Previously Logged Sets for Current Exercise */}
        {completedWorkingSets.length > 0 && (
          <div className="p-4 rounded-3xl bg-slate-900 border border-slate-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Logged Sets This Session
              </span>
              <button
                onClick={handleUndoSet}
                className="flex items-center gap-1 text-xs text-rose-400 hover:text-rose-300"
              >
                <Undo2 className="w-3.5 h-3.5" />
                <span>Undo Last</span>
              </button>
            </div>

            <div className="space-y-1.5">
              {completedWorkingSets.map((st, idx) => (
                <div
                  key={st.id || idx}
                  className="p-2.5 rounded-xl bg-slate-950 border border-slate-800/80 flex items-center justify-between text-xs font-medium"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-md bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center text-[10px]">
                      #{idx + 1}
                    </span>
                    <span className="font-bold text-white">
                      {st.actualWeightKg} kg × {st.actualReps} reps
                    </span>
                  </div>
                  <span className="text-slate-400 text-[11px]">
                    RIR: {st.repsInReserve ?? '—'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Persistent Bottom Exercise Navigation Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-[#0f172a] border-t border-slate-800 px-4 py-3 flex items-center justify-between z-20">
        <button
          onClick={() => setCurrentExerciseIndex(prev => Math.max(0, prev - 1))}
          disabled={currentExerciseIndex === 0}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:pointer-events-none text-xs font-bold text-slate-300"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Previous</span>
        </button>

        <button
          onClick={handleSkipExercise}
          className="flex items-center gap-1 px-3 py-2.5 rounded-xl bg-slate-800/60 hover:bg-slate-800 text-xs font-semibold text-slate-400 hover:text-slate-200"
          title="Skip this exercise if machine is taken and you're pressed for time"
        >
          <FastForward className="w-3.5 h-3.5" />
          <span>Skip</span>
        </button>

        <button
          onClick={() => setCurrentExerciseIndex(prev => Math.min(session.exercises.length - 1, prev + 1))}
          disabled={currentExerciseIndex === session.exercises.length - 1}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 disabled:opacity-30 disabled:pointer-events-none text-xs font-bold text-slate-950 shadow-md shadow-sky-500/10"
        >
          <span>Next</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Rest Timer Modal */}
      <RestTimerModal
        isOpen={isRestTimerOpen}
        initialDurationSec={restTimerDuration}
        soundEnabled={timerSoundEnabled}
        vibrateEnabled={timerVibrateEnabled}
        onClose={() => setIsRestTimerOpen(false)}
        exerciseName={currentExerciseData?.name}
        nextExerciseName={session.exercises[currentExerciseIndex + 1]?.exerciseId}
      />

      {/* Exercise Details Modal */}
      <ExerciseDetailModal
        isOpen={isDetailModalOpen}
        exercise={currentExerciseData || null}
        onClose={() => setIsDetailModalOpen(false)}
        onSubstitute={() => {
          setIsDetailModalOpen(false)
          setIsSubstituteModalOpen(true)
        }}
      />

      {/* Machine Substitute Modal */}
      <MachineSubstituteModal
        isOpen={isSubstituteModalOpen}
        currentExercise={currentExerciseData || null}
        availableExercises={availableExercises}
        onClose={() => setIsSubstituteModalOpen(false)}
        onSelectSubstitute={handleSubstituteMachine}
      />

      {/* Workout Completion Summary Modal */}
      <WorkoutSummaryModal
        session={session}
        isOpen={isSummaryModalOpen}
        onSaveAndFinish={handleSaveAndComplete}
        onDismiss={() => setIsSummaryModalOpen(false)}
      />
    </div>
  )
}
