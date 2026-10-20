import { describe, it, expect } from 'vitest'
import { evaluateExerciseProgression, getProgramPhase } from './progressionEngine'
import { Exercise, WorkoutSession } from '../types'

const mockExercise: Exercise = {
  id: 'mach-chest-press',
  name: 'Machine Chest Press',
  category: 'upper',
  targetMuscles: ['Chest'],
  primaryMuscle: 'Chest',
  equipment: 'Chest Press Machine',
  setupInstructions: ['Setup'],
  executionInstructions: ['Push'],
  breathingCues: 'Exhale',
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
  tags: ['upper']
}

describe('Progression Engine', () => {
  it('returns Phase 1 guidelines for Week 1 and 2', () => {
    const phase1 = getProgramPhase(1)
    expect(phase1.phaseNumber).toBe(1)
    expect(phase1.phaseName).toContain('Re-entry')
  })

  it('returns Phase 3 Progressive Overload for Week 5', () => {
    const phase3 = getProgramPhase(5)
    expect(phase3.phaseNumber).toBe(3)
    expect(phase3.phaseName).toContain('Progressive Overload')
  })

  it('suggests sleep warning when sleep average is under 5.8 hours', () => {
    const evalResult = evaluateExerciseProgression(
      mockExercise,
      [],
      [{ id: '1', date: '2026-10-19', steps: 4000, cardioMinutes: 15, sleepHours: 4.5 }],
      3
    )
    expect(evalResult.recommendationType).toBe('sleep_warning')
    expect(evalResult.reason).toContain('sleep averaged 4.5 hrs')
  })

  it('recommends weight increase in Week 4 when user hits 12 reps on all sets with good RIR', () => {
    const mockSession: WorkoutSession = {
      id: 'sess-1',
      templateId: 'workout-upper-a',
      templateName: 'Upper Body A',
      date: '2026-10-18',
      startTime: '2026-10-18T10:00:00.000Z',
      durationSeconds: 3000,
      status: 'completed',
      warmUpCompleted: true,
      exercises: [
        {
          exerciseId: 'mach-chest-press',
          order: 1,
          isSubstituted: false,
          skipped: false,
          sets: [
            {
              id: 's1',
              setNumber: 1,
              isWarmup: false,
              targetWeightKg: 40,
              targetReps: 12,
              actualWeightKg: 40,
              actualReps: 12,
              effortRatingRpe: 8,
              repsInReserve: 2,
              completed: true,
              completedAt: '2026-10-18T10:10:00.000Z'
            },
            {
              id: 's2',
              setNumber: 2,
              isWarmup: false,
              targetWeightKg: 40,
              targetReps: 12,
              actualWeightKg: 40,
              actualReps: 12,
              effortRatingRpe: 8,
              repsInReserve: 2,
              completed: true,
              completedAt: '2026-10-18T10:15:00.000Z'
            }
          ]
        }
      ]
    }

    const evalResult = evaluateExerciseProgression(
      mockExercise,
      [mockSession],
      [{ id: '1', date: '2026-10-19', steps: 6000, cardioMinutes: 20, sleepHours: 7.2 }],
      4 // Week 4
    )

    expect(evalResult.recommendationType).toBe('weight_increase')
    expect(evalResult.suggestedWeightKg).toBe(42.5) // 40 + 2.5
    expect(evalResult.suggestedAction).toContain('Increase resistance by 2.5 kg to 42.5 kg')
  })
})
