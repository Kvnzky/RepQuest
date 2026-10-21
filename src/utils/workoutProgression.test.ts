import { describe, it, expect } from 'vitest'
import {
  resolveSessionExercise,
  ensureSessionExerciseIds,
  getNextIncompleteExerciseIndex,
  isWorkoutComplete,
  getInitialWorkoutExerciseIndex,
  insertExerciseIntoSession,
  reorderSessionExercises,
  removeExerciseFromSession
} from './workoutProgression'
import { Exercise, SessionExercise, WorkoutSession } from '../types'

const catalogExercises: Exercise[] = [
  {
    id: 'mach-chest-press',
    name: 'Chest Press Machine',
    category: 'upper',
    targetMuscles: ['Chest', 'Anterior Deltoid', 'Triceps'],
    primaryMuscle: 'Chest',
    equipment: 'Selectorized Chest Press',
    setupInstructions: ['Adjust seat height so handles align with mid-chest.'],
    executionInstructions: ['Push forward smoothly without locking elbows.'],
    breathingCues: 'Exhale on press, inhale on return.',
    recommendedSets: 2,
    recommendedRepsMin: 10,
    recommendedRepsMax: 12,
    recommendedRestSec: 90,
    defaultWeightKg: 40,
    weightIncrementKg: 2.5,
    commonMistakes: [],
    beginnerModifications: [],
    safetyNotes: [],
    alternativeExerciseIds: [],
    tags: ['chest', 'upper']
  },
  {
    id: 'mach-lat-pulldown',
    name: 'Lat Pulldown Machine',
    category: 'upper',
    targetMuscles: ['Latissimus Dorsi', 'Biceps'],
    primaryMuscle: 'Back',
    equipment: 'Cable Lat Pulldown',
    setupInstructions: ['Adjust thigh pad securely.'],
    executionInstructions: ['Pull bar down to upper chest.'],
    breathingCues: 'Exhale down, inhale up.',
    recommendedSets: 2,
    recommendedRepsMin: 10,
    recommendedRepsMax: 12,
    recommendedRestSec: 90,
    defaultWeightKg: 35,
    weightIncrementKg: 2.5,
    commonMistakes: [],
    beginnerModifications: [],
    safetyNotes: [],
    alternativeExerciseIds: [],
    tags: ['back', 'upper']
  },
  {
    id: 'mach-leg-press',
    name: 'Leg Press Machine',
    category: 'lower',
    targetMuscles: ['Quadriceps', 'Glutes'],
    primaryMuscle: 'Quads',
    equipment: 'Seated Leg Press',
    setupInstructions: ['Place feet shoulder-width apart on platform.'],
    executionInstructions: ['Press away without locking knees.'],
    breathingCues: 'Inhale descending, exhale pushing.',
    recommendedSets: 3,
    recommendedRepsMin: 10,
    recommendedRepsMax: 12,
    recommendedRestSec: 120,
    defaultWeightKg: 60,
    weightIncrementKg: 5,
    commonMistakes: [],
    beginnerModifications: [],
    safetyNotes: [],
    alternativeExerciseIds: [],
    tags: ['legs', 'lower']
  }
]

describe('Gym Program Exercise Progression Logic', () => {
  // Test A: Complete a predefined exercise and confirm the next exercise loads
  it('Test A: completing a predefined exercise correctly advances to the next exercise', () => {
    const exercises: SessionExercise[] = ensureSessionExerciseIds([
      {
        exerciseId: 'mach-chest-press',
        order: 0,
        isSubstituted: false,
        skipped: false,
        completed: false,
        sets: []
      },
      {
        exerciseId: 'mach-lat-pulldown',
        order: 1,
        isSubstituted: false,
        skipped: false,
        completed: false,
        sets: []
      }
    ])

    // Currently at index 0 (Chest Press)
    const currentIndex = 0
    expect(exercises[currentIndex].exerciseId).toBe('mach-chest-press')

    // Mark exercise 0 as completed
    exercises[currentIndex].completed = true
    exercises[currentIndex].completedAt = new Date().toISOString()

    // Query next incomplete exercise
    const nextIndex = getNextIncompleteExerciseIndex(exercises, currentIndex)
    expect(nextIndex).toBe(1)
    expect(exercises[nextIndex].exerciseId).toBe('mach-lat-pulldown')

    // Verify resolved exercise details match the next exercise
    const resolvedNext = resolveSessionExercise(exercises[nextIndex], catalogExercises)
    expect(resolvedNext.name).toBe('Lat Pulldown Machine')
    expect(resolvedNext.equipment).toBe('Cable Lat Pulldown')
  })

  // Test B: Manually add an exercise between two predefined exercises, complete it, and confirm following exercise loads
  it('Test B: manually adding an exercise between two predefined exercises progresses in exact sequence', () => {
    let exercises: SessionExercise[] = ensureSessionExerciseIds([
      {
        exerciseId: 'mach-chest-press',
        order: 0,
        isSubstituted: false,
        skipped: false,
        completed: false,
        sets: []
      },
      {
        exerciseId: 'mach-leg-press',
        order: 1,
        isSubstituted: false,
        skipped: false,
        completed: false,
        sets: []
      }
    ])

    // User is on exercise 0 (Chest Press) and adds a custom setup "between" (position 'next')
    const customSetup: SessionExercise = {
      exerciseId: 'custom-lateral-raise-cable',
      customExerciseName: 'Cable Lateral Raise',
      customEquipment: 'Dual Cable Column',
      customCategory: 'upper',
      targetSets: 3,
      targetRepsMin: 12,
      targetRepsMax: 15,
      targetWeightKg: 7.5,
      targetRestSec: 60,
      isCustom: true,
      isSubstituted: false,
      order: 0,
      sets: [],
      skipped: false,
      completed: false
    }

    const insertion = insertExerciseIntoSession(exercises, customSetup, 'next', 0)
    exercises = insertion.updatedExercises

    expect(exercises.length).toBe(3)
    expect(exercises[0].exerciseId).toBe('mach-chest-press')
    expect(exercises[1].customExerciseName).toBe('Cable Lateral Raise')
    expect(exercises[2].exerciseId).toBe('mach-leg-press')

    // Step 1: Complete Chest Press
    exercises[0].completed = true
    const nextAfterFirst = getNextIncompleteExerciseIndex(exercises, 0)
    expect(nextAfterFirst).toBe(1)
    expect(exercises[nextAfterFirst].customExerciseName).toBe('Cable Lateral Raise')

    // Step 2: Complete the manually added setup
    exercises[1].completed = true
    const nextAfterCustom = getNextIncompleteExerciseIndex(exercises, 1)
    expect(nextAfterCustom).toBe(2)
    expect(exercises[nextAfterCustom].exerciseId).toBe('mach-leg-press')
  })

  // Test C: Manually add several exercises and verify correct sequence
  it('Test C: handles multiple manually added exercises maintaining stable IDs and correct sequence', () => {
    let exercises: SessionExercise[] = ensureSessionExerciseIds([
      {
        exerciseId: 'mach-chest-press',
        order: 0,
        isSubstituted: false,
        skipped: false,
        completed: false,
        sets: []
      }
    ])

    const custom1: SessionExercise = {
      exerciseId: 'custom-incline-db-press',
      customExerciseName: 'Incline Dumbbell Press',
      targetSets: 3,
      targetRepsMin: 10,
      targetRepsMax: 12,
      isCustom: true,
      isSubstituted: false,
      order: 0,
      sets: [],
      skipped: false
    }

    const custom2: SessionExercise = {
      exerciseId: 'custom-pec-deck-fly',
      customExerciseName: 'Pec Deck Fly',
      targetSets: 2,
      targetRepsMin: 12,
      targetRepsMax: 15,
      isCustom: true,
      isSubstituted: false,
      order: 0,
      sets: [],
      skipped: false
    }

    // Insert custom1 at end
    exercises = insertExerciseIntoSession(exercises, custom1, 'end', 0).updatedExercises
    // Insert custom2 at end
    exercises = insertExerciseIntoSession(exercises, custom2, 'end', 0).updatedExercises

    expect(exercises.length).toBe(3)
    expect(exercises[0].exerciseId).toBe('mach-chest-press')
    expect(exercises[1].customExerciseName).toBe('Incline Dumbbell Press')
    expect(exercises[2].customExerciseName).toBe('Pec Deck Fly')

    // Verify each has a distinct unique ID
    const ids = exercises.map(e => e.id)
    const uniqueIds = new Set(ids)
    expect(uniqueIds.size).toBe(3)

    // Complete first
    exercises[0].completed = true
    expect(getNextIncompleteExerciseIndex(exercises, 0)).toBe(1)

    // Complete second
    exercises[1].completed = true
    expect(getNextIncompleteExerciseIndex(exercises, 1)).toBe(2)

    // Complete third
    exercises[2].completed = true
    expect(getNextIncompleteExerciseIndex(exercises, 2)).toBe(-1)
  })

  // Test D: Complete final manually added exercise and confirm workout completion
  it('Test D: completing the final manually added exercise detects workout completion', () => {
    const exercises: SessionExercise[] = ensureSessionExerciseIds([
      {
        exerciseId: 'mach-chest-press',
        order: 0,
        isSubstituted: false,
        skipped: false,
        completed: true,
        sets: []
      },
      {
        exerciseId: 'custom-finish-burnout',
        customExerciseName: 'Finisher Push-ups',
        targetSets: 2,
        isCustom: true,
        isSubstituted: false,
        order: 1,
        skipped: false,
        completed: false,
        sets: []
      }
    ])

    // Before completion
    expect(isWorkoutComplete(exercises)).toBe(false)
    expect(getNextIncompleteExerciseIndex(exercises, 0)).toBe(1)

    // Complete the final manually added exercise
    exercises[1].completed = true
    exercises[1].completedAt = new Date().toISOString()

    // After completion
    expect(getNextIncompleteExerciseIndex(exercises, 1)).toBe(-1)
    expect(isWorkoutComplete(exercises)).toBe(true)
  })

  // Test E: Edit, remove, or reorder a manually added exercise and verify progression remains correct
  it('Test E: reordering, editing, and removing exercises preserves active tracking and progression index', () => {
    let exercises: SessionExercise[] = ensureSessionExerciseIds([
      {
        id: 'sex-ex-0',
        exerciseId: 'mach-chest-press',
        order: 0,
        isSubstituted: false,
        skipped: false,
        completed: false,
        sets: []
      },
      {
        id: 'sex-ex-1',
        exerciseId: 'custom-row',
        customExerciseName: 'Cable Row Custom',
        targetSets: 2,
        targetWeightKg: 40,
        targetRepsMin: 10,
        targetRepsMax: 12,
        isCustom: true,
        isSubstituted: false,
        order: 1,
        skipped: false,
        completed: false,
        sets: []
      },
      {
        id: 'sex-ex-2',
        exerciseId: 'mach-lat-pulldown',
        order: 2,
        isSubstituted: false,
        skipped: false,
        completed: false,
        sets: []
      }
    ])

    // Reorder: Move custom exercise (index 1) to top (index 0) while tracking 'custom-row' as active
    const reordered = reorderSessionExercises(exercises, 1, 0, 'sex-ex-1')
    exercises = reordered.updatedExercises
    expect(reordered.newCurrentIndex).toBe(0)
    expect(exercises[0].id).toBe('sex-ex-1')
    expect(exercises[1].id).toBe('sex-ex-0')
    expect(exercises[2].id).toBe('sex-ex-2')

    // Edit setup of custom exercise
    exercises[0].targetSets = 4
    exercises[0].targetWeightKg = 55
    const resolvedEdited = resolveSessionExercise(exercises[0], catalogExercises)
    expect(resolvedEdited.recommendedSets).toBe(4)
    expect(resolvedEdited.defaultWeightKg).toBe(55)

    // Remove exercise at index 2 (mach-lat-pulldown)
    const removed = removeExerciseFromSession(exercises, 2, 0)
    exercises = removed.updatedExercises
    expect(exercises.length).toBe(2)
    expect(removed.newCurrentIndex).toBe(0)
    expect(exercises.some(e => e.id === 'sex-ex-2')).toBe(false)

    // Complete the first exercise in the reordered queue
    exercises[0].completed = true
    const nextIdx = getNextIncompleteExerciseIndex(exercises, 0)
    expect(nextIdx).toBe(1)
    expect(exercises[nextIdx].id).toBe('sex-ex-0')
  })

  // Test F: Refresh or reopen the app during a workout and verify current exercise and progress are restored
  it('Test F: restores active incomplete exercise index when reopening session', () => {
    const session: WorkoutSession = {
      id: 'sess-restore-test',
      templateId: 'tpl-1',
      templateName: 'Upper Body A',
      date: '2026-10-21',
      startTime: '2026-10-21T10:00:00.000Z',
      durationSeconds: 1200,
      status: 'in_progress',
      warmUpCompleted: true,
      currentExerciseIndex: 1,
      exercises: ensureSessionExerciseIds([
        {
          exerciseId: 'mach-chest-press',
          order: 0,
          isSubstituted: false,
          skipped: false,
          completed: true,
          sets: [
            {
              id: 's1',
              setNumber: 1,
              isWarmup: false,
              targetWeightKg: 40,
              targetReps: 12,
              actualWeightKg: 40,
              actualReps: 12,
              completed: true,
              completedAt: '2026-10-21T10:10:00.000Z'
            }
          ]
        },
        {
          exerciseId: 'custom-lateral-raise',
          customExerciseName: 'Lateral Raises',
          order: 1,
          isCustom: true,
          isSubstituted: false,
          skipped: false,
          completed: false,
          sets: []
        },
        {
          exerciseId: 'mach-lat-pulldown',
          order: 2,
          isSubstituted: false,
          skipped: false,
          completed: false,
          sets: []
        }
      ])
    }

    // Reopening the session should restore to index 1 (the saved in-progress custom exercise)
    const initialIndex = getInitialWorkoutExerciseIndex(session)
    expect(initialIndex).toBe(1)
    expect(session.exercises[initialIndex].customExerciseName).toBe('Lateral Raises')

    // If currentExerciseIndex was pointing to completed index 0, should auto-locate first incomplete (index 1)
    const sessionBadIndex: WorkoutSession = { ...session, currentExerciseIndex: 0 }
    expect(getInitialWorkoutExerciseIndex(sessionBadIndex)).toBe(1)
  })

  // Test G: Verify completing an exercise does not skip the next exercise or trigger multiple transitions
  it('Test G: prevents duplicate transitions from skipping exercises in queue', () => {
    const exercises: SessionExercise[] = ensureSessionExerciseIds([
      {
        exerciseId: 'mach-chest-press',
        order: 0,
        isSubstituted: false,
        skipped: false,
        completed: false,
        sets: []
      },
      {
        exerciseId: 'mach-lat-pulldown',
        order: 1,
        isSubstituted: false,
        skipped: false,
        completed: false,
        sets: []
      },
      {
        exerciseId: 'mach-leg-press',
        order: 2,
        isSubstituted: false,
        skipped: false,
        completed: false,
        sets: []
      }
    ])

    // Completing exercise 0
    exercises[0].completed = true
    const nextIdx = getNextIncompleteExerciseIndex(exercises, 0)
    expect(nextIdx).toBe(1) // Points to exactly lat-pulldown (no skip to leg-press)

    // Repeated call with the same index should still resolve safely without skipping
    const repeatedNextIdx = getNextIncompleteExerciseIndex(exercises, 0)
    expect(repeatedNextIdx).toBe(1)
  })

  // Test H: Test exercises that use sets and reps, timed durations, and rest periods
  it('Test H: resolves and tracks both sets/reps and timed duration setups with custom rest periods', () => {
    // 1. Sets & Reps setup
    const repsExercise: SessionExercise = {
      exerciseId: 'custom-cable-bicep-curl',
      customExerciseName: 'Cable Bicep Curl',
      customEquipment: 'Low Cable Pulley',
      customCategory: 'upper',
      targetSets: 3,
      targetRepsMin: 12,
      targetRepsMax: 15,
      targetWeightKg: 20,
      targetRestSec: 60,
      isCustom: true,
      isSubstituted: false,
      order: 0,
      sets: [],
      skipped: false
    }

    const resolvedReps = resolveSessionExercise(repsExercise, catalogExercises)
    expect(resolvedReps.name).toBe('Cable Bicep Curl')
    expect(resolvedReps.recommendedSets).toBe(3)
    expect(resolvedReps.recommendedRepsMin).toBe(12)
    expect(resolvedReps.recommendedRepsMax).toBe(15)
    expect(resolvedReps.defaultWeightKg).toBe(20)
    expect(resolvedReps.recommendedRestSec).toBe(60)

    // 2. Timed duration setup (e.g. cardio, plank, stretch)
    const durationExercise: SessionExercise = {
      exerciseId: 'custom-treadmill-hiit',
      customExerciseName: 'Treadmill Incline Intervals',
      customEquipment: 'Anytime Fitness Treadmill',
      customCategory: 'cardio',
      targetSets: 1,
      targetDurationSeconds: 600, // 10 minutes
      targetRestSec: 120,
      isCustom: true,
      isSubstituted: false,
      order: 1,
      sets: [],
      skipped: false
    }

    const resolvedDuration = resolveSessionExercise(durationExercise, catalogExercises)
    expect(resolvedDuration.name).toBe('Treadmill Incline Intervals')
    expect(resolvedDuration.category).toBe('cardio')
    expect(resolvedDuration.durationSeconds).toBe(600)
    expect(resolvedDuration.recommendedRestSec).toBe(120)
    expect(resolvedDuration.setupInstructions.length).toBeGreaterThan(0)
  })
})
