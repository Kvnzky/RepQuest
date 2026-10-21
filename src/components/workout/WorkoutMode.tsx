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
  Timer as TimerIcon,
  Video,
  WifiOff,
  Plus,
  ListOrdered,
  RotateCcw
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
import { AddExerciseModal } from './AddExerciseModal'
import { WorkoutQueueModal } from './WorkoutQueueModal'
import { ExerciseVisual } from '../common/ExerciseVisual'
import { getLocalVideoUrl } from '../../utils/media'
import {
  resolveSessionExercise,
  ensureSessionExerciseIds,
  getNextIncompleteExerciseIndex,
  getInitialWorkoutExerciseIndex,
  insertExerciseIntoSession,
  reorderSessionExercises,
  removeExerciseFromSession,
  isWorkoutComplete
} from '../../utils/workoutProgression'

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
  // Normalize exercises to guarantee stable IDs
  const normalizedInitial = {
    ...initialSession,
    exercises: ensureSessionExerciseIds(initialSession.exercises || [])
  }

  const [session, setSession] = useState<WorkoutSession>(normalizedInitial)
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState<number>(() =>
    getInitialWorkoutExerciseIndex(normalizedInitial)
  )
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(initialSession.durationSeconds || 0)
  const [isTimerPaused, setIsTimerPaused] = useState<boolean>(false)

  // Modals
  const [isRestTimerOpen, setIsRestTimerOpen] = useState<boolean>(false)
  const [restTimerDuration, setRestTimerDuration] = useState<number>(defaultRestSec)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState<boolean>(false)
  const [detailModalTab, setDetailModalTab] = useState<'video' | 'guide' | 'cadence'>('video')
  const [isSubstituteModalOpen, setIsSubstituteModalOpen] = useState<boolean>(false)
  const [isSummaryModalOpen, setIsSummaryModalOpen] = useState<boolean>(false)
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false)
  const [isQueueModalOpen, setIsQueueModalOpen] = useState<boolean>(false)

  // Active exercise & metadata
  const currentSessionEx: SessionExercise | undefined = session.exercises[currentExerciseIndex]
  const currentExerciseData: Exercise = resolveSessionExercise(currentSessionEx, availableExercises)

  const isDurationBased = Boolean(
    currentSessionEx?.targetDurationSeconds ||
    currentExerciseData.category === 'cardio' ||
    currentExerciseData.durationSeconds
  )

  // Target sets and sets status
  const targetWorkingSets = currentSessionEx?.targetSets ?? currentExerciseData.recommendedSets ?? 2
  const completedWorkingSets = currentSessionEx?.sets?.filter(s => s.completed && !s.isWarmup) || []
  const currentSetNumber = completedWorkingSets.length + 1
  const isTargetSetsMet = completedWorkingSets.length >= targetWorkingSets

  // Current set inputs
  const [inputWeight, setInputWeight] = useState<number>(40)
  const [inputReps, setInputReps] = useState<number>(10)
  const [inputRir, setInputRir] = useState<number>(2) // Reps in reserve
  const [inputDurationSec, setInputDurationSec] = useState<number>(60)
  const [isLoggingSet, setIsLoggingSet] = useState<boolean>(false)

  // Live stopwatch for duration exercises
  const [stopwatchSeconds, setStopwatchSeconds] = useState<number>(0)
  const [isStopwatchRunning, setIsStopwatchRunning] = useState<boolean>(false)

  // Ref guards to prevent double transitions
  const isTransitioningRef = useRef<boolean>(false)
  const elapsedRef = useRef(elapsedSeconds)
  elapsedRef.current = elapsedSeconds

  // Synchronize inputs when active exercise changes
  useEffect(() => {
    if (currentSessionEx) {
      const resolved = resolveSessionExercise(currentSessionEx, availableExercises)
      const lastSet = currentSessionEx.sets?.filter(s => s.completed).slice(-1)[0]
      if (lastSet) {
        setInputWeight(lastSet.actualWeightKg ?? currentSessionEx.targetWeightKg ?? resolved.defaultWeightKg ?? 20)
        setInputReps(lastSet.actualReps ?? currentSessionEx.targetRepsMin ?? resolved.recommendedRepsMin ?? 10)
        setInputRir(lastSet.repsInReserve ?? 2)
        setInputDurationSec(
          lastSet.durationSeconds ??
          currentSessionEx.targetDurationSeconds ??
          resolved.durationSeconds ??
          60
        )
      } else {
        setInputWeight(currentSessionEx.targetWeightKg ?? resolved.defaultWeightKg ?? 20)
        setInputReps(currentSessionEx.targetRepsMin ?? resolved.recommendedRepsMin ?? 10)
        setInputRir(2)
        setInputDurationSec(
          currentSessionEx.targetDurationSeconds ??
          resolved.durationSeconds ??
          60
        )
      }
      setStopwatchSeconds(0)
      setIsStopwatchRunning(false)
    }
  }, [currentExerciseIndex, currentSessionEx?.id, currentSessionEx?.exerciseId])

  // Workout duration timer
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isTimerPaused) {
        setElapsedSeconds(prev => {
          const next = prev + 1
          if (next % 10 === 0) {
            db.workoutSessions.update(session.id, { durationSeconds: next }).catch(() => {})
          }
          return next
        })
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [isTimerPaused, session.id])

  // Duration stopwatch effect
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null
    if (isStopwatchRunning) {
      interval = setInterval(() => {
        setStopwatchSeconds(prev => {
          const next = prev + 1
          setInputDurationSec(next)
          return next
        })
      }, 1000)
    }
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isStopwatchRunning])

  // Mark Warmup complete
  const handleToggleWarmUp = async () => {
    const nextStatus = !session.warmUpCompleted
    const updated = { ...session, warmUpCompleted: nextStatus }
    setSession(updated)
    await db.workoutSessions.update(session.id, { warmUpCompleted: nextStatus })
    audioTimer.playSetLoggedTone()
  }

  // Set Logging action (with automatic progression upon completing target sets)
  const handleLogSet = async () => {
    if (isLoggingSet || isTransitioningRef.current || !currentSessionEx) return
    setIsLoggingSet(true)

    try {
      const isDuration = isDurationBased
      const durationVal = isDuration ? (Number(inputDurationSec) || stopwatchSeconds || 60) : undefined

      const newSet: LoggedSet = {
        id: `set-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        setNumber: currentSetNumber,
        isWarmup: false,
        targetWeightKg: currentSessionEx.targetWeightKg ?? currentExerciseData.defaultWeightKg ?? 20,
        targetReps: currentSessionEx.targetRepsMax ?? currentExerciseData.recommendedRepsMax ?? 12,
        actualWeightKg: isDuration ? 0 : (Number(inputWeight) || 0),
        actualReps: isDuration ? 0 : (Number(inputReps) || 0),
        durationSeconds: durationVal,
        repsInReserve: Number(inputRir),
        effortRatingRpe: 10 - Number(inputRir),
        completed: true,
        completedAt: new Date().toISOString()
      }

      const updatedExercises = [...session.exercises]
      const exIndex = currentExerciseIndex
      const exToUpdate = { ...updatedExercises[exIndex] }
      const updatedSets = [...(exToUpdate.sets || []), newSet]
      exToUpdate.sets = updatedSets

      // Check if all target working sets for this exercise are completed
      const workingSetsDone = updatedSets.filter(s => s.completed && !s.isWarmup).length
      const willCompleteExercise = workingSetsDone >= targetWorkingSets

      if (willCompleteExercise) {
        exToUpdate.completed = true
        exToUpdate.completedAt = new Date().toISOString()
      }

      updatedExercises[exIndex] = exToUpdate

      let nextIndex = currentExerciseIndex
      if (willCompleteExercise) {
        nextIndex = getNextIncompleteExerciseIndex(updatedExercises, currentExerciseIndex)
      }

      const updatedSession: WorkoutSession = {
        ...session,
        exercises: updatedExercises,
        currentExerciseIndex: nextIndex !== -1 ? nextIndex : currentExerciseIndex,
        durationSeconds: elapsedRef.current
      }

      setSession(updatedSession)
      await db.workoutSessions.put(updatedSession)

      // Audio & haptic feedback
      audioTimer.playSetLoggedTone()
      if (timerVibrateEnabled) audioTimer.vibrate(80)

      if (willCompleteExercise) {
        if (nextIndex !== -1) {
          setCurrentExerciseIndex(nextIndex)
          if (autoTimerStart) {
            const nextEx = resolveSessionExercise(updatedExercises[nextIndex], availableExercises)
            setRestTimerDuration(nextEx.recommendedRestSec || defaultRestSec)
            setIsRestTimerOpen(true)
          }
        } else {
          // All exercises finished!
          setIsSummaryModalOpen(true)
        }
      } else {
        // Inter-set rest timer
        if (autoTimerStart) {
          setRestTimerDuration(currentExerciseData.recommendedRestSec || defaultRestSec)
          setIsRestTimerOpen(true)
        }
      }
    } finally {
      setTimeout(() => setIsLoggingSet(false), 400)
    }
  }

  // Explicit Complete Exercise button handler
  const handleCompleteExercise = async (targetIndex = currentExerciseIndex) => {
    if (isTransitioningRef.current || !session.exercises[targetIndex]) return
    isTransitioningRef.current = true

    try {
      const updatedExercises = [...session.exercises]
      const exIndex = targetIndex
      const exToUpdate = { ...updatedExercises[exIndex] }
      exToUpdate.completed = true
      exToUpdate.completedAt = new Date().toISOString()
      updatedExercises[exIndex] = exToUpdate

      // Find next incomplete exercise
      const nextIndex = getNextIncompleteExerciseIndex(updatedExercises, exIndex)

      const updatedSession: WorkoutSession = {
        ...session,
        exercises: updatedExercises,
        currentExerciseIndex: nextIndex !== -1 ? nextIndex : exIndex,
        durationSeconds: elapsedRef.current
      }

      setSession(updatedSession)
      await db.workoutSessions.put(updatedSession)

      audioTimer.playSetLoggedTone()
      if (timerVibrateEnabled) audioTimer.vibrate([100, 50, 100])

      if (nextIndex !== -1) {
        setCurrentExerciseIndex(nextIndex)
        if (autoTimerStart) {
          const nextEx = resolveSessionExercise(updatedExercises[nextIndex], availableExercises)
          setRestTimerDuration(nextEx.recommendedRestSec || defaultRestSec)
          setIsRestTimerOpen(true)
        }
      } else {
        // Final exercise completed -> show summary modal
        setIsSummaryModalOpen(true)
      }
    } finally {
      setTimeout(() => {
        isTransitioningRef.current = false
      }, 400)
    }
  }

  // Undo last logged set
  const handleUndoSet = async () => {
    if (!currentSessionEx || !currentSessionEx.sets || currentSessionEx.sets.length === 0) return

    const updatedExercises = [...session.exercises]
    const exIndex = currentExerciseIndex
    const exToUpdate = { ...updatedExercises[exIndex] }
    exToUpdate.sets = exToUpdate.sets.slice(0, -1)
    if (exToUpdate.completed) {
      exToUpdate.completed = false
      delete exToUpdate.completedAt
    }
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
    if (isTransitioningRef.current || !currentSessionEx) return
    isTransitioningRef.current = true

    try {
      const updatedExercises = [...session.exercises]
      const exIndex = currentExerciseIndex
      updatedExercises[exIndex] = {
        ...updatedExercises[exIndex],
        skipped: true,
        skipReason: 'Skipped to preserve workout time / machine busy'
      }

      const nextIndex = getNextIncompleteExerciseIndex(updatedExercises, exIndex)

      const updatedSession: WorkoutSession = {
        ...session,
        exercises: updatedExercises,
        currentExerciseIndex: nextIndex !== -1 ? nextIndex : exIndex,
        durationSeconds: elapsedRef.current
      }

      setSession(updatedSession)
      await db.workoutSessions.put(updatedSession)

      if (nextIndex !== -1) {
        setCurrentExerciseIndex(nextIndex)
      } else {
        if (isWorkoutComplete(updatedExercises)) {
          setIsSummaryModalOpen(true)
        }
      }
    } finally {
      setTimeout(() => {
        isTransitioningRef.current = false
      }, 400)
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
      customExerciseName: substituteExercise.name,
      customEquipment: substituteExercise.equipment,
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

    setInputWeight(substituteExercise.defaultWeightKg || 30)
    setInputReps(substituteExercise.recommendedRepsMin || 10)
  }

  // Add exercise into queue
  const handleAddExercise = async (newEx: SessionExercise, position: 'next' | 'end') => {
    const result = insertExerciseIntoSession(session.exercises, newEx, position, currentExerciseIndex)
    const updatedSession: WorkoutSession = {
      ...session,
      exercises: result.updatedExercises,
      currentExerciseIndex: result.newIndex,
      durationSeconds: elapsedRef.current
    }
    setSession(updatedSession)
    setCurrentExerciseIndex(result.newIndex)
    await db.workoutSessions.put(updatedSession)
  }

  // Reorder exercises in queue
  const handleReorderExercises = async (fromIndex: number, toIndex: number) => {
    const currentActiveId = session.exercises[currentExerciseIndex]?.id
    const result = reorderSessionExercises(session.exercises, fromIndex, toIndex, currentActiveId)
    const updatedSession: WorkoutSession = {
      ...session,
      exercises: result.updatedExercises,
      currentExerciseIndex: result.newCurrentIndex,
      durationSeconds: elapsedRef.current
    }
    setSession(updatedSession)
    setCurrentExerciseIndex(result.newCurrentIndex)
    await db.workoutSessions.put(updatedSession)
  }

  // Remove exercise from queue
  const handleRemoveExercise = async (removeIndex: number) => {
    const result = removeExerciseFromSession(session.exercises, removeIndex, currentExerciseIndex)
    const updatedSession: WorkoutSession = {
      ...session,
      exercises: result.updatedExercises,
      currentExerciseIndex: result.newCurrentIndex,
      durationSeconds: elapsedRef.current
    }
    setSession(updatedSession)
    setCurrentExerciseIndex(result.newCurrentIndex)
    await db.workoutSessions.put(updatedSession)
  }

  // Update exercise settings from queue modal
  const handleUpdateExercise = async (index: number, updatedFields: Partial<SessionExercise>) => {
    const updatedExercises = [...session.exercises]
    if (index >= 0 && index < updatedExercises.length) {
      updatedExercises[index] = {
        ...updatedExercises[index],
        ...updatedFields
      }
      const updatedSession: WorkoutSession = {
        ...session,
        exercises: updatedExercises,
        durationSeconds: elapsedRef.current
      }
      setSession(updatedSession)
      await db.workoutSessions.put(updatedSession)
    }
  }

  // Direct selection from queue
  const handleSelectExercise = async (index: number) => {
    if (index >= 0 && index < session.exercises.length) {
      setCurrentExerciseIndex(index)
      const updatedSession: WorkoutSession = {
        ...session,
        currentExerciseIndex: index,
        durationSeconds: elapsedRef.current
      }
      setSession(updatedSession)
      await db.workoutSessions.put(updatedSession)
    }
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
      <div className="bg-[#0f172a] border-b border-slate-800 px-3 sm:px-4 py-2.5 sm:py-3 flex items-center justify-between z-10">
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

        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Queue & Reorder Button */}
          <button
            onClick={() => setIsQueueModalOpen(true)}
            className="p-2 rounded-xl bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700 transition-colors flex items-center gap-1 text-xs font-semibold"
            title="View Exercise Queue & Reorder"
          >
            <ListOrdered className="w-4 h-4 text-sky-400" />
            <span className="hidden sm:inline">Queue</span>
          </button>

          {/* Pause / Play Timer */}
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

          {/* Rest Timer Button */}
          <button
            onClick={() => {
              setRestTimerDuration(currentExerciseData.recommendedRestSec || defaultRestSec)
              setIsRestTimerOpen(true)
            }}
            className="flex items-center gap-1 px-2.5 sm:px-3 py-2 rounded-xl bg-sky-950/80 border border-sky-800 text-sky-300 text-xs font-bold hover:bg-sky-900 transition-colors"
          >
            <TimerIcon className="w-4 h-4 text-sky-400" />
            <span className="hidden sm:inline">Rest</span>
          </button>

          {/* Finish Button */}
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
        {/* Warmup Status Banner */}
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
        <div className="p-4 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl relative overflow-hidden">
          {/* Top row */}
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-1.5 flex-wrap mb-1">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-sky-950 text-sky-400 border border-sky-800/60">
                  {currentExerciseData.primaryMuscle}
                </span>
                {currentSessionEx?.isCustom && (
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-purple-950 text-purple-300 border border-purple-800/60">
                    Custom Setup
                  </span>
                )}
                {currentSessionEx?.isSubstituted && (
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-950 text-amber-400 border border-amber-800/60">
                    Substituted
                  </span>
                )}
                {currentSessionEx?.completed && (
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800/60">
                    Completed
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

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => {
                  setDetailModalTab('video')
                  setIsDetailModalOpen(true)
                }}
                className="py-2 px-3 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-black flex items-center gap-1.5 text-xs shadow-md shadow-sky-500/20 active:scale-95 transition-all"
                title="Watch Video How-To Reel"
                aria-label="Watch Video Reel"
              >
                <Video className="w-3.5 h-3.5 fill-slate-950" />
                <span>Reel</span>
              </button>
              <button
                onClick={() => {
                  setDetailModalTab('guide')
                  setIsDetailModalOpen(true)
                }}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
                title="Exercise Setup & Form Cues"
                aria-label="Instructions"
              >
                <Info className="w-4 h-4 text-sky-400" />
              </button>
              <button
                onClick={() => setIsSubstituteModalOpen(true)}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
                title="Substitute Machine (Occupied / Unavailable)"
                aria-label="Substitute"
              >
                <RefreshCw className="w-4 h-4 text-amber-400" />
              </button>
            </div>
          </div>

          {/* Interactive Video Reel / Exercise Preview Card */}
          <div
            onClick={() => {
              setDetailModalTab('video')
              setIsDetailModalOpen(true)
            }}
            className="mt-3 relative rounded-2xl overflow-hidden bg-slate-950 border border-slate-800/90 cursor-pointer group hover:border-sky-500/50 transition-all shadow-lg"
            title="Tap to watch real video reel tutorial"
          >
            <div className="relative h-36 sm:h-40 w-full overflow-hidden bg-slate-950">
              {currentExerciseData.media?.localVideoPath ? (
                <video
                  src={getLocalVideoUrl(currentExerciseData.media.localVideoPath)}
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="w-full h-full object-cover opacity-70 group-hover:scale-105 group-hover:opacity-85 transition-all duration-500"
                />
              ) : currentExerciseData.media?.videoId ? (
                <img
                  src={`https://i.ytimg.com/vi/${currentExerciseData.media.videoId}/hqdefault.jpg`}
                  alt={currentExerciseData.name}
                  className="w-full h-full object-cover opacity-60 group-hover:scale-105 group-hover:opacity-75 transition-all duration-300"
                  loading="lazy"
                  onError={(e) => {
                    ;(e.target as HTMLElement).style.display = 'none'
                  }}
                />
              ) : (
                <ExerciseVisual exerciseId={currentExerciseData.id} className="w-full h-full" animated={true} />
              )}

              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-transparent" />

              {/* Center Play Button Overlay */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-12 h-12 rounded-full bg-sky-500/90 text-slate-950 flex items-center justify-center shadow-lg shadow-sky-500/40 group-hover:scale-110 group-hover:bg-sky-400 transition-all">
                  <Play className="w-5 h-5 fill-slate-950 ml-0.5" />
                </div>
              </div>

              {/* Top Badges */}
              <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                <span className="text-[10px] uppercase font-black tracking-wider px-2 py-0.5 rounded-full bg-sky-950/90 text-sky-400 border border-sky-800/80 backdrop-blur-md flex items-center gap-1">
                  <Video className="w-3 h-3 text-sky-400" />
                  <span>How-To Reel</span>
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-950/90 text-emerald-400 border border-emerald-800/80 backdrop-blur-md flex items-center gap-1">
                  <WifiOff className="w-2.5 h-2.5" />
                  <span>100% Offline</span>
                </span>
              </div>

              {/* Bottom Title & Cue */}
              <div className="absolute bottom-2 inset-x-2.5 flex items-end justify-between">
                <div className="max-w-[76%]">
                  <p className="text-xs font-bold text-white truncate drop-shadow">
                    {currentExerciseData.media?.videoTitle || currentExerciseData.name}
                  </p>
                  <p className="text-[10px] text-sky-300/90 truncate">
                    {currentExerciseData.media?.videoNote || 'Tap to watch real human form & machine setup'}
                  </p>
                </div>
                <span className="text-[10px] text-sky-400 font-bold shrink-0 flex items-center gap-0.5 bg-slate-950/85 px-2 py-0.5 rounded-full border border-slate-800">
                  <span>Watch</span> &rarr;
                </span>
              </div>
            </div>
          </div>

          {/* Target Prescriptions */}
          <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
            <div className="flex items-center gap-4">
              <div>
                <span className="text-[10px] text-slate-500 uppercase block font-semibold">Target</span>
                <span className="text-sm font-bold text-sky-400">
                  {isDurationBased ? (
                    `${currentSessionEx?.targetDurationSeconds || currentExerciseData.durationSeconds || 60}s duration`
                  ) : (
                    `${targetWorkingSets} sets × ${currentExerciseData.recommendedRepsMin}–${currentExerciseData.recommendedRepsMax} reps`
                  )}
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
                    className={`w-7 h-7 rounded-xl flex items-center justify-center font-bold text-xs transition-all ${
                      isDone
                        ? 'bg-emerald-500 text-slate-950 font-black'
                        : isCurrent
                        ? 'bg-sky-500/20 border-2 border-sky-400 text-sky-300'
                        : 'bg-slate-800 text-slate-500'
                    }`}
                  >
                    {isDone ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : idx + 1}
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Input Interface: Weight / Reps / Duration / RIR */}
        <div className="p-4 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              {isDurationBased ? `Timed Effort #${currentSetNumber}` : `Set #${currentSetNumber} Details`}
            </span>
            {completedWorkingSets.length > 0 && (
              <span className="text-xs text-emerald-400 font-semibold">
                {completedWorkingSets.length} of {targetWorkingSets} logged
              </span>
            )}
          </div>

          {/* Conditional Input: Duration Stopwatch or Weight/Reps */}
          {isDurationBased ? (
            <div className="space-y-3">
              {/* Duration Live Stopwatch */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col items-center justify-center">
                <span className="text-4xl font-black font-mono text-sky-400 mb-2">
                  {formatElapsed(stopwatchSeconds || inputDurationSec)}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsStopwatchRunning(!isStopwatchRunning)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                      isStopwatchRunning
                        ? 'bg-amber-500 hover:bg-amber-400 text-slate-950'
                        : 'bg-sky-500 hover:bg-sky-400 text-slate-950'
                    }`}
                  >
                    {isStopwatchRunning ? (
                      <>
                        <Pause className="w-3.5 h-3.5 fill-current" />
                        <span>Pause</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-3.5 h-3.5 fill-current" />
                        <span>Start Timer</span>
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => {
                      setIsStopwatchRunning(false)
                      setStopwatchSeconds(0)
                      setInputDurationSec(currentSessionEx?.targetDurationSeconds || 60)
                    }}
                    className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300"
                    title="Reset Stopwatch"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Quick Duration Presets */}
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-300">Target Duration (seconds)</label>
                <div className="flex gap-1">
                  {[30, 45, 60, 90, 120].map(sec => (
                    <button
                      key={sec}
                      onClick={() => {
                        setInputDurationSec(sec)
                        setStopwatchSeconds(sec)
                      }}
                      className="px-2 py-0.5 rounded bg-slate-800 text-[10px] font-bold text-slate-300 hover:bg-slate-700"
                    >
                      {sec}s
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setInputDurationSec(prev => Math.max(10, prev - 15))}
                  className="w-14 h-14 rounded-2xl bg-slate-800 hover:bg-slate-700 active:scale-95 text-xl font-bold text-slate-200 border border-slate-700 flex items-center justify-center"
                >
                  -15s
                </button>
                <input
                  type="number"
                  step="15"
                  min="5"
                  value={inputDurationSec}
                  onChange={(e) => setInputDurationSec(Math.max(5, parseInt(e.target.value) || 5))}
                  className="flex-1 h-14 rounded-2xl bg-slate-950 border border-slate-800 text-center text-3xl font-black text-sky-400 font-mono focus:outline-none focus:border-sky-500"
                />
                <button
                  onClick={() => setInputDurationSec(prev => prev + 15)}
                  className="w-14 h-14 rounded-2xl bg-slate-800 hover:bg-slate-700 active:scale-95 text-xl font-bold text-slate-200 border border-slate-700 flex items-center justify-center"
                >
                  +15s
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Weight Controls */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-slate-300">Weight (kg)</label>
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
                    onClick={() => setInputWeight(prev => Math.max(0, prev - (currentExerciseData.weightIncrementKg || 2.5)))}
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
                    onClick={() => setInputWeight(prev => prev + (currentExerciseData.weightIncrementKg || 2.5))}
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
            </>
          )}

          {/* Action Buttons: Log Set + Complete Exercise */}
          <div className="space-y-2 pt-1">
            <button
              onClick={handleLogSet}
              disabled={isLoggingSet}
              className="w-full h-15 rounded-2xl bg-gradient-to-r from-sky-400 to-cyan-400 hover:from-sky-300 hover:to-cyan-300 active:scale-[0.98] text-slate-950 font-black text-base sm:text-lg flex items-center justify-center gap-2 shadow-xl shadow-sky-500/20 transition-all disabled:opacity-50"
            >
              <CheckCircle className="w-5 h-5 stroke-[2.5]" />
              <span>
                {isDurationBased
                  ? `Log Timed Set #${currentSetNumber}`
                  : `Complete Set #${currentSetNumber}`}
              </span>
            </button>

            {/* Explicit "Complete Exercise" Button (Always accessible, highlighted when target sets met) */}
            <button
              onClick={() => handleCompleteExercise(currentExerciseIndex)}
              className={`w-full py-3 rounded-2xl font-black text-xs sm:text-sm flex items-center justify-center gap-2 transition-all active:scale-[0.98] border ${
                isTargetSetsMet || currentSessionEx?.completed
                  ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-lg shadow-emerald-500/20'
                  : 'bg-slate-800/80 hover:bg-slate-800 text-slate-200 border-slate-700'
              }`}
            >
              <Check className="w-4 h-4 stroke-[3]" />
              <span>
                {currentSessionEx?.completed
                  ? 'Exercise Completed (Advance Next)'
                  : isTargetSetsMet
                  ? 'All Target Sets Done • Complete Exercise & Advance'
                  : 'Complete Exercise & Move to Next'}
              </span>
            </button>
          </div>
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
                      {st.durationSeconds
                        ? `${st.durationSeconds}s duration`
                        : `${st.actualWeightKg} kg × ${st.actualReps} reps`}
                    </span>
                  </div>
                  <span className="text-slate-400 text-[11px]">
                    {st.repsInReserve !== undefined ? `RIR: ${st.repsInReserve}` : 'Completed'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Persistent Bottom Exercise Navigation Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-[#0f172a] border-t border-slate-800 px-3 sm:px-4 py-3 flex items-center justify-between gap-2 z-20">
        <button
          onClick={() => setCurrentExerciseIndex(prev => Math.max(0, prev - 1))}
          disabled={currentExerciseIndex === 0}
          className="flex items-center gap-1 px-3 sm:px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:pointer-events-none text-xs font-bold text-slate-300 shrink-0"
        >
          <ChevronLeft className="w-4 h-4" />
          <span className="hidden xs:inline">Prev</span>
        </button>

        <div className="flex items-center gap-1.5">
          {/* Add Exercise Modal Trigger */}
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-1 px-2.5 sm:px-3 py-2.5 rounded-xl bg-slate-800/90 hover:bg-slate-800 text-xs font-bold text-sky-400 hover:text-sky-300 border border-sky-800/40 transition-colors"
            title="Add an exercise or custom setup to workout"
          >
            <Plus className="w-3.5 h-3.5 stroke-[3]" />
            <span className="hidden sm:inline">Add</span>
          </button>

          {/* Queue Modal Trigger */}
          <button
            onClick={() => setIsQueueModalOpen(true)}
            className="flex items-center gap-1 px-2.5 sm:px-3 py-2.5 rounded-xl bg-slate-800/90 hover:bg-slate-800 text-xs font-bold text-slate-300 hover:text-white border border-slate-700 transition-colors"
            title="View and reorder exercise sequence"
          >
            <ListOrdered className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden sm:inline">Queue</span>
          </button>

          {/* Skip Exercise */}
          <button
            onClick={handleSkipExercise}
            className="flex items-center gap-1 px-2.5 sm:px-3 py-2.5 rounded-xl bg-slate-800/60 hover:bg-slate-800 text-xs font-semibold text-slate-400 hover:text-slate-200 transition-colors"
            title="Skip this exercise if machine is taken and you're pressed for time"
          >
            <FastForward className="w-3.5 h-3.5" />
            <span>Skip</span>
          </button>
        </div>

        <button
          onClick={() => {
            const nextIdx = Math.min(session.exercises.length - 1, currentExerciseIndex + 1)
            setCurrentExerciseIndex(nextIdx)
          }}
          disabled={currentExerciseIndex === session.exercises.length - 1}
          className="flex items-center gap-1 px-3 sm:px-4 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 disabled:opacity-30 disabled:pointer-events-none text-xs font-bold text-slate-950 shadow-md shadow-sky-500/10 shrink-0"
        >
          <span className="hidden xs:inline">Next</span>
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
        nextExerciseName={
          session.exercises[currentExerciseIndex + 1]
            ? resolveSessionExercise(session.exercises[currentExerciseIndex + 1], availableExercises).name
            : undefined
        }
      />

      {/* Exercise Details Modal */}
      <ExerciseDetailModal
        isOpen={isDetailModalOpen}
        exercise={currentExerciseData || null}
        defaultTab={detailModalTab}
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

      {/* Add Exercise Modal (Catalog & Custom Setup) */}
      <AddExerciseModal
        isOpen={isAddModalOpen}
        availableExercises={availableExercises}
        currentExerciseIndex={currentExerciseIndex}
        totalExercises={session.exercises.length}
        onClose={() => setIsAddModalOpen(false)}
        onAddExercise={handleAddExercise}
      />

      {/* Workout Queue & Reorder Modal */}
      <WorkoutQueueModal
        isOpen={isQueueModalOpen}
        exercises={session.exercises}
        availableExercises={availableExercises}
        currentIndex={currentExerciseIndex}
        onClose={() => setIsQueueModalOpen(false)}
        onSelectExercise={handleSelectExercise}
        onMoveExercise={handleReorderExercises}
        onRemoveExercise={handleRemoveExercise}
        onUpdateExercise={handleUpdateExercise}
        onOpenAddModal={() => setIsAddModalOpen(true)}
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
