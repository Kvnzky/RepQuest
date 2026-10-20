import { describe, it, expect, beforeEach } from 'vitest'
import {
  DEFAULT_USER_PROFILE,
  DEFAULT_APP_SETTINGS,
  exportDatabaseToJson,
  importDatabaseFromJson
} from './index'
import { DEFAULT_EXERCISES } from '../data/exercises'
import { DEFAULT_TEMPLATES } from '../data/templates'

describe('Data Models and Defaults', () => {
  it('has preconfigured user profile matching requirements', () => {
    expect(DEFAULT_USER_PROFILE.age).toBe(38)
    expect(DEFAULT_USER_PROFILE.sex).toBe('male')
    expect(DEFAULT_USER_PROFILE.heightCm).toBe(170)
    expect(DEFAULT_USER_PROFILE.currentWeightKg).toBe(78)
    expect(DEFAULT_USER_PROFILE.trainingExperience).toBe('beginner')
    expect(DEFAULT_USER_PROFILE.trainingAvailabilityDays).toBe(5)
    expect(DEFAULT_USER_PROFILE.maxSessionDurationMinutes).toBe(60)
    expect(DEFAULT_USER_PROFILE.gymName).toBe('Anytime Fitness')
  })

  it('has preconfigured app settings and defaults', () => {
    expect(DEFAULT_APP_SETTINGS.appName).toBe('Kinetiq')
    expect(DEFAULT_APP_SETTINGS.dailyProteinTargetG).toBe(140)
    expect(DEFAULT_APP_SETTINGS.dailyWaterTargetMl).toBe(3000)
    expect(DEFAULT_APP_SETTINGS.dailyStepTarget).toBe(6000)
    expect(DEFAULT_APP_SETTINGS.autoTimerStart).toBe(true)
    expect(DEFAULT_APP_SETTINGS.timerSoundEnabled).toBe(true)
    expect(DEFAULT_APP_SETTINGS.timerVibrateEnabled).toBe(true)
  })

  it('includes all 5 gym workout sessions plus 2 rest days in templates', () => {
    expect(DEFAULT_TEMPLATES.length).toBe(7)
    const upperA = DEFAULT_TEMPLATES.find(t => t.id === 'workout-upper-a')
    const lowerA = DEFAULT_TEMPLATES.find(t => t.id === 'workout-lower-a')
    const cardioMobility = DEFAULT_TEMPLATES.find(t => t.id === 'workout-cardio-mobility')
    const upperB = DEFAULT_TEMPLATES.find(t => t.id === 'workout-upper-b')
    const lowerB = DEFAULT_TEMPLATES.find(t => t.id === 'workout-lower-b')

    expect(upperA).toBeDefined()
    expect(lowerA).toBeDefined()
    expect(cardioMobility).toBeDefined()
    expect(upperB).toBeDefined()
    expect(lowerB).toBeDefined()

    // Warm-up is defined for resistance sessions
    expect(upperA?.warmUp).toBeDefined()
    expect(upperA?.warmUp?.cardioMinutes).toBeGreaterThanOrEqual(5)
  })

  it('has substitutions configured for exercises', () => {
    const chestPress = DEFAULT_EXERCISES.find(e => e.id === 'mach-chest-press')
    expect(chestPress).toBeDefined()
    expect(chestPress?.alternativeExerciseIds).toContain('mach-incline-chest-press')

    const legPress = DEFAULT_EXERCISES.find(e => e.id === 'mach-leg-press')
    expect(legPress).toBeDefined()
    expect(legPress?.alternativeExerciseIds).toContain('mach-hack-squat')

    const gluteDrive = DEFAULT_EXERCISES.find(e => e.id === 'mach-glute-drive')
    expect(gluteDrive).toBeDefined()
    expect(gluteDrive?.alternativeExerciseIds).toContain('bw-glute-bridge')
  })

  it('validates json structure during import', async () => {
    const invalidJson = '{"notAValidBackup": true}'
    const result = await importDatabaseFromJson(invalidJson, 'replace')
    expect(result.success).toBe(false)
    expect(result.message).toContain('Invalid backup file')
  })
})
