import { Exercise, SessionExercise, WorkoutSession } from '../types'

/**
 * Resolves a session exercise to a fully populated Exercise object,
 * whether it originates from the predefined catalog or was manually added/configured.
 */
export function resolveSessionExercise(
  sessionEx: SessionExercise | undefined,
  availableExercises: Exercise[]
): Exercise {
  if (!sessionEx) {
    return {
      id: 'unknown-exercise',
      name: 'Exercise',
      category: 'upper',
      targetMuscles: ['General'],
      primaryMuscle: 'General',
      equipment: 'Gym Equipment',
      setupInstructions: ['Prepare equipment and maintain comfortable, stable posture.'],
      executionInstructions: ['Perform repetitions with controlled tempo and smooth breathing.'],
      breathingCues: 'Exhale during effort; inhale during return.',
      recommendedSets: 2,
      recommendedRepsMin: 10,
      recommendedRepsMax: 12,
      recommendedRestSec: 90,
      defaultWeightKg: 20,
      weightIncrementKg: 2.5,
      commonMistakes: ['Rushing reps', 'Excessive momentum'],
      beginnerModifications: ['Use lighter load to master proper movement plane'],
      safetyNotes: ['Stop if experiencing joint or tendon discomfort'],
      alternativeExerciseIds: [],
      tags: ['custom']
    }
  }

  const catalogEx = availableExercises.find(e => e.id === sessionEx.exerciseId)

  if (catalogEx) {
    return {
      ...catalogEx,
      name: sessionEx.customExerciseName || catalogEx.name,
      equipment: sessionEx.customEquipment || catalogEx.equipment,
      category: sessionEx.customCategory || catalogEx.category,
      recommendedSets: sessionEx.targetSets ?? catalogEx.recommendedSets ?? 2,
      recommendedRepsMin: sessionEx.targetRepsMin ?? catalogEx.recommendedRepsMin ?? 10,
      recommendedRepsMax: sessionEx.targetRepsMax ?? catalogEx.recommendedRepsMax ?? 12,
      recommendedRestSec: sessionEx.targetRestSec ?? catalogEx.recommendedRestSec ?? 90,
      defaultWeightKg: sessionEx.targetWeightKg ?? catalogEx.defaultWeightKg ?? 20,
      durationSeconds: sessionEx.targetDurationSeconds ?? catalogEx.durationSeconds
    }
  }

  // Synthesize custom / manually added exercise
  const category = sessionEx.customCategory || 'upper'
  const primaryMuscle =
    category === 'upper'
      ? 'Upper Body'
      : category === 'lower'
      ? 'Lower Body'
      : category === 'core'
      ? 'Core'
      : category === 'cardio'
      ? 'Cardio'
      : 'Mobility'

  return {
    id: sessionEx.exerciseId,
    name: sessionEx.customExerciseName || 'Custom Exercise',
    category,
    targetMuscles: [primaryMuscle],
    primaryMuscle,
    equipment: sessionEx.customEquipment || 'Selectorized / Free Weight',
    setupInstructions: [
      'Adjust seat height, pad, and safety pin so joint axis aligns naturally.',
      'Maintain an upright or braced spine with feet planted firmly on the floor.'
    ],
    executionInstructions: [
      'Initiate movement smoothly without jerking the weight stack.',
      'Control the 2–3 second eccentric negative for maximum muscle stimulation.',
      'Pause briefly at peak contraction without forcefully locking joints.'
    ],
    breathingCues: 'Exhale on the concentric push/pull; inhale on the eccentric return.',
    recommendedSets: sessionEx.targetSets ?? 2,
    recommendedRepsMin: sessionEx.targetRepsMin ?? 10,
    recommendedRepsMax: sessionEx.targetRepsMax ?? 12,
    recommendedRestSec: sessionEx.targetRestSec ?? 90,
    defaultWeightKg: sessionEx.targetWeightKg ?? 20,
    weightIncrementKg: 2.5,
    durationSeconds: sessionEx.targetDurationSeconds,
    commonMistakes: ['Rushing the repetition tempo', 'Allowing elbows or knees to hyperextend'],
    beginnerModifications: ['Start with a light pin setting to establish movement groove'],
    safetyNotes: ['Cease exercise immediately if you experience sharp or unnatural joint pain'],
    alternativeExerciseIds: [],
    tags: ['custom', category]
  }
}

/**
 * Ensures all session exercises have a stable unique ID and normalized order.
 */
export function ensureSessionExerciseIds(exercises: SessionExercise[]): SessionExercise[] {
  return exercises.map((ex, idx) => ({
    ...ex,
    id: ex.id || `sex-${Date.now()}-${idx}-${Math.random().toString(36).substr(2, 5)}`,
    order: idx
  }))
}

/**
 * Finds the index of the next incomplete, unskipped exercise in sequence.
 * Searches ahead first (currentIndex + 1 to end), then wraps around (0 to currentIndex - 1).
 * Returns -1 if all exercises in the workout are complete or skipped.
 */
export function getNextIncompleteExerciseIndex(
  exercises: SessionExercise[],
  currentIndex: number
): number {
  if (!exercises || exercises.length === 0) return -1

  // 1. Check forwards from currentIndex + 1
  for (let i = currentIndex + 1; i < exercises.length; i++) {
    const ex = exercises[i]
    if (!ex.completed && !ex.skipped) {
      return i
    }
  }

  // 2. Wrap around from 0 to currentIndex - 1
  for (let i = 0; i < currentIndex; i++) {
    const ex = exercises[i]
    if (!ex.completed && !ex.skipped) {
      return i
    }
  }

  return -1
}

/**
 * Checks if all exercises in the workout session are finished (completed or skipped).
 */
export function isWorkoutComplete(exercises: SessionExercise[]): boolean {
  if (!exercises || exercises.length === 0) return true
  return exercises.every(ex => Boolean(ex.completed || ex.skipped))
}

/**
 * Restores the initial exercise index upon opening or refreshing the app (Test F).
 */
export function getInitialWorkoutExerciseIndex(session: WorkoutSession): number {
  if (!session.exercises || session.exercises.length === 0) return 0

  // If session has a saved currentExerciseIndex pointing to an incomplete exercise
  if (
    typeof session.currentExerciseIndex === 'number' &&
    session.currentExerciseIndex >= 0 &&
    session.currentExerciseIndex < session.exercises.length
  ) {
    const savedEx = session.exercises[session.currentExerciseIndex]
    if (savedEx && !savedEx.completed && !savedEx.skipped) {
      return session.currentExerciseIndex
    }
  }

  // Otherwise locate the first incomplete exercise
  const firstIncomplete = session.exercises.findIndex(e => !e.completed && !e.skipped)
  if (firstIncomplete !== -1) {
    return firstIncomplete
  }

  return 0
}

/**
 * Inserts a new exercise into the session at a specific position ('next', 'end', or explicit index).
 */
export function insertExerciseIntoSession(
  exercises: SessionExercise[],
  newExercise: SessionExercise,
  position: 'next' | 'end' | number,
  currentIndex: number
): { updatedExercises: SessionExercise[]; newIndex: number } {
  const normalized = ensureSessionExerciseIds(exercises)
  const preparedNewEx: SessionExercise = {
    ...newExercise,
    id: newExercise.id || `sex-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
    completed: false,
    skipped: false,
    sets: newExercise.sets || []
  }

  const updated = [...normalized]

  if (position === 'next') {
    const insertIdx = Math.min(currentIndex + 1, updated.length)
    updated.splice(insertIdx, 0, preparedNewEx)
  } else if (position === 'end') {
    updated.push(preparedNewEx)
  } else if (typeof position === 'number') {
    const clamped = Math.max(0, Math.min(position, updated.length))
    updated.splice(clamped, 0, preparedNewEx)
  }

  const reindexed = ensureSessionExerciseIds(updated)

  // Current active index remains currentIndex unless the list was empty
  const activeIdx = Math.max(0, Math.min(currentIndex, reindexed.length - 1))

  return {
    updatedExercises: reindexed,
    newIndex: activeIdx
  }
}

/**
 * Reorders exercises in the session and preserves tracking of the active exercise by ID.
 */
export function reorderSessionExercises(
  exercises: SessionExercise[],
  fromIndex: number,
  toIndex: number,
  currentActiveId?: string
): { updatedExercises: SessionExercise[]; newCurrentIndex: number } {
  if (
    fromIndex < 0 ||
    fromIndex >= exercises.length ||
    toIndex < 0 ||
    toIndex >= exercises.length ||
    fromIndex === toIndex
  ) {
    return {
      updatedExercises: exercises,
      newCurrentIndex: Math.max(0, Math.min(fromIndex, exercises.length - 1))
    }
  }

  const updated = [...exercises]
  const [moved] = updated.splice(fromIndex, 1)
  updated.splice(toIndex, 0, moved)

  const reindexed = ensureSessionExerciseIds(updated)

  // Track active exercise by its stable ID
  let newCurrentIndex = 0
  if (currentActiveId) {
    const foundIdx = reindexed.findIndex(e => e.id === currentActiveId)
    if (foundIdx !== -1) {
      newCurrentIndex = foundIdx
    }
  } else {
    newCurrentIndex = toIndex
  }

  return {
    updatedExercises: reindexed,
    newCurrentIndex
  }
}

/**
 * Removes an exercise from the session and safely adjusts the active index.
 */
export function removeExerciseFromSession(
  exercises: SessionExercise[],
  removeIndex: number,
  currentIndex: number
): { updatedExercises: SessionExercise[]; newCurrentIndex: number } {
  if (removeIndex < 0 || removeIndex >= exercises.length) {
    return { updatedExercises: exercises, newCurrentIndex: currentIndex }
  }

  const updated = [...exercises]
  updated.splice(removeIndex, 1)

  const reindexed = ensureSessionExerciseIds(updated)

  let newCurrentIndex = currentIndex
  if (reindexed.length === 0) {
    newCurrentIndex = 0
  } else if (removeIndex < currentIndex) {
    newCurrentIndex = currentIndex - 1
  } else if (removeIndex === currentIndex) {
    // If we removed the current exercise, clamp to valid range
    newCurrentIndex = Math.min(currentIndex, reindexed.length - 1)
  }

  return {
    updatedExercises: reindexed,
    newCurrentIndex
  }
}
