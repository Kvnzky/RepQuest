import Dexie, { type Table } from 'dexie'
import {
  UserProfile,
  AppSettings,
  Exercise,
  WorkoutTemplate,
  WorkoutSession,
  BodyMeasurement,
  NutritionEntry,
  FoodItem,
  WaterEntry,
  DailyActivity,
  ProgressPhoto,
  UserRecommendation,
  ReminderSetting
} from '../types'
import { DEFAULT_EXERCISES } from '../data/exercises'
import { DEFAULT_TEMPLATES } from '../data/templates'
import { DEFAULT_FOOD_CATALOG } from '../data/nutrition'
import { DEFAULT_REMINDERS } from '../data/reminders'
import { DEFAULT_BRANDING } from '../config/branding'

export class KinetiqDatabase extends Dexie {
  userProfile!: Table<UserProfile, string>
  appSettings!: Table<AppSettings, string>
  exercises!: Table<Exercise, string>
  workoutTemplates!: Table<WorkoutTemplate, string>
  workoutSessions!: Table<WorkoutSession, string>
  bodyMeasurements!: Table<BodyMeasurement, string>
  nutritionEntries!: Table<NutritionEntry, string>
  customFoods!: Table<FoodItem, string>
  waterEntries!: Table<WaterEntry, string>
  dailyActivities!: Table<DailyActivity, string>
  progressPhotos!: Table<ProgressPhoto, string>
  recommendations!: Table<UserRecommendation, string>
  reminders!: Table<ReminderSetting, string>

  constructor() {
    super('KinetiqGymDB')

    this.version(1).stores({
      userProfile: 'id',
      appSettings: 'id',
      exercises: 'id, category, primaryMuscle',
      workoutTemplates: 'id, dayOfWeek, category',
      workoutSessions: 'id, date, status, templateId, startTime',
      bodyMeasurements: 'id, date, timestamp',
      nutritionEntries: 'id, date, mealType',
      customFoods: 'id, name, category',
      waterEntries: 'id, date, timestamp',
      dailyActivities: 'id, date',
      progressPhotos: 'id, date, timestamp',
      recommendations: 'id, date, exerciseId, status',
      reminders: 'id, category'
    })
  }
}

export const db = new KinetiqDatabase()

export const DEFAULT_USER_PROFILE: UserProfile = {
  id: 'current',
  age: 38,
  sex: 'male',
  heightCm: 170,
  currentWeightKg: 78.0,
  targetWeightKg: 72.0,
  currentWaistCm: 94.0,
  trainingExperience: 'beginner',
  previousTrainingBreak: 'Seven months',
  mainGoal: 'Body recomposition — reduce abdominal fat while building or preserving muscle',
  gymName: 'Anytime Fitness',
  preferredEquipment: ['Selectorized weight machines', 'Cable machines', 'Treadmill', 'Stationary bike'],
  trainingAvailabilityDays: 5,
  maxSessionDurationMinutes: 60,
  activityOutsideGym: 'low',
  reportedLimitations: 'None reported',
  averageSleepHours: 5.5,
  programStartWeek: 1,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
}

export const DEFAULT_APP_SETTINGS: AppSettings = {
  id: 'current',
  appName: DEFAULT_BRANDING.appName,
  theme: 'dark',
  weightUnit: 'kg',
  distanceUnit: 'km',
  autoTimerStart: true,
  timerSoundEnabled: true,
  timerVibrateEnabled: true,
  defaultRestDurationSec: 90,
  restPresetsSec: [45, 60, 75, 90, 120],
  dailyWaterTargetMl: 3000,
  dailyStepTarget: 6000,
  dailyProteinTargetG: 140,
  dailyCalorieTarget: 2100,
  accentColor: DEFAULT_BRANDING.accentColor,
  updatedAt: new Date().toISOString()
}

export async function initDatabase(): Promise<void> {
  const existingProfile = await db.userProfile.get('current')
  if (!existingProfile) {
    await db.userProfile.put(DEFAULT_USER_PROFILE)
  }

  const existingSettings = await db.appSettings.get('current')
  if (!existingSettings) {
    await db.appSettings.put(DEFAULT_APP_SETTINGS)
  }

  const exerciseCount = await db.exercises.count()
  if (exerciseCount === 0) {
    await db.exercises.bulkPut(DEFAULT_EXERCISES)
  }

  const templateCount = await db.workoutTemplates.count()
  if (templateCount === 0) {
    await db.workoutTemplates.bulkPut(DEFAULT_TEMPLATES)
  }

  const foodCount = await db.customFoods.count()
  if (foodCount === 0) {
    await db.customFoods.bulkPut(DEFAULT_FOOD_CATALOG)
  }

  const reminderCount = await db.reminders.count()
  if (reminderCount === 0) {
    await db.reminders.bulkPut(DEFAULT_REMINDERS)
  }

  // Baseline measurement if empty
  const measurementCount = await db.bodyMeasurements.count()
  if (measurementCount === 0) {
    const today = new Date().toISOString().split('T')[0]
    await db.bodyMeasurements.put({
      id: `meas-baseline-${Date.now()}`,
      date: today,
      timestamp: new Date().toISOString(),
      weightKg: 78.0,
      waistCm: 94.0,
      notes: 'Initial baseline assessment before Week 1.'
    })
  }

  // Baseline activity for today if empty
  const today = new Date().toISOString().split('T')[0]
  const todayActivity = await db.dailyActivities.get(today)
  if (!todayActivity) {
    await db.dailyActivities.put({
      id: today,
      date: today,
      steps: 0,
      cardioMinutes: 0,
      sleepHours: 5.5,
      notes: 'Baseline check-in'
    })
  }
}

export interface BackupData {
  version: number
  exportedAt: string
  userProfile?: UserProfile
  appSettings?: AppSettings
  exercises?: Exercise[]
  workoutTemplates?: WorkoutTemplate[]
  workoutSessions?: WorkoutSession[]
  bodyMeasurements?: BodyMeasurement[]
  nutritionEntries?: NutritionEntry[]
  customFoods?: FoodItem[]
  waterEntries?: WaterEntry[]
  dailyActivities?: DailyActivity[]
  progressPhotos?: ProgressPhoto[]
  recommendations?: UserRecommendation[]
  reminders?: ReminderSetting[]
}

export async function exportDatabaseToJson(): Promise<string> {
  const backup: BackupData = {
    version: 1,
    exportedAt: new Date().toISOString(),
    userProfile: await db.userProfile.get('current'),
    appSettings: await db.appSettings.get('current'),
    exercises: await db.exercises.toArray(),
    workoutTemplates: await db.workoutTemplates.toArray(),
    workoutSessions: await db.workoutSessions.toArray(),
    bodyMeasurements: await db.bodyMeasurements.toArray(),
    nutritionEntries: await db.nutritionEntries.toArray(),
    customFoods: await db.customFoods.toArray(),
    waterEntries: await db.waterEntries.toArray(),
    dailyActivities: await db.dailyActivities.toArray(),
    progressPhotos: await db.progressPhotos.toArray(),
    recommendations: await db.recommendations.toArray(),
    reminders: await db.reminders.toArray()
  }

  return JSON.stringify(backup, null, 2)
}

export async function importDatabaseFromJson(jsonString: string, mode: 'merge' | 'replace'): Promise<{ success: boolean; message: string }> {
  try {
    const data: BackupData = JSON.parse(jsonString)
    if (!data.version || typeof data.version !== 'number') {
      return { success: false, message: 'Invalid backup file: missing or invalid version.' }
    }

    await db.transaction('rw', [
      db.userProfile,
      db.appSettings,
      db.exercises,
      db.workoutTemplates,
      db.workoutSessions,
      db.bodyMeasurements,
      db.nutritionEntries,
      db.customFoods,
      db.waterEntries,
      db.dailyActivities,
      db.progressPhotos,
      db.recommendations,
      db.reminders
    ], async () => {
      if (mode === 'replace') {
        await Promise.all([
          db.userProfile.clear(),
          db.appSettings.clear(),
          db.exercises.clear(),
          db.workoutTemplates.clear(),
          db.workoutSessions.clear(),
          db.bodyMeasurements.clear(),
          db.nutritionEntries.clear(),
          db.customFoods.clear(),
          db.waterEntries.clear(),
          db.dailyActivities.clear(),
          db.progressPhotos.clear(),
          db.recommendations.clear(),
          db.reminders.clear()
        ])
      }

      if (data.userProfile) await db.userProfile.put(data.userProfile)
      if (data.appSettings) await db.appSettings.put(data.appSettings)
      if (data.exercises?.length) await db.exercises.bulkPut(data.exercises)
      if (data.workoutTemplates?.length) await db.workoutTemplates.bulkPut(data.workoutTemplates)
      if (data.workoutSessions?.length) await db.workoutSessions.bulkPut(data.workoutSessions)
      if (data.bodyMeasurements?.length) await db.bodyMeasurements.bulkPut(data.bodyMeasurements)
      if (data.nutritionEntries?.length) await db.nutritionEntries.bulkPut(data.nutritionEntries)
      if (data.customFoods?.length) await db.customFoods.bulkPut(data.customFoods)
      if (data.waterEntries?.length) await db.waterEntries.bulkPut(data.waterEntries)
      if (data.dailyActivities?.length) await db.dailyActivities.bulkPut(data.dailyActivities)
      if (data.progressPhotos?.length) await db.progressPhotos.bulkPut(data.progressPhotos)
      if (data.recommendations?.length) await db.recommendations.bulkPut(data.recommendations)
      if (data.reminders?.length) await db.reminders.bulkPut(data.reminders)
    })

    return { success: true, message: 'Data imported successfully!' }
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err)
    return { success: false, message: `Import failed: ${errorMsg}` }
  }
}

export async function resetProgramToDefaults(): Promise<void> {
  await db.transaction('rw', [db.exercises, db.workoutTemplates], async () => {
    await db.exercises.clear()
    await db.exercises.bulkPut(DEFAULT_EXERCISES)
    await db.workoutTemplates.clear()
    await db.workoutTemplates.bulkPut(DEFAULT_TEMPLATES)
  })
}

export async function clearAllLocalData(): Promise<void> {
  await db.delete()
  await db.open()
  await initDatabase()
}
