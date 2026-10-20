export type TrainingExperience = 'beginner' | 'intermediate' | 'advanced'
export type Sex = 'male' | 'female' | 'other'
export type WeightUnit = 'kg' | 'lbs'
export type DistanceUnit = 'km' | 'mi'
export type ThemeMode = 'dark' | 'light'

export interface UserProfile {
  id: string
  age: number
  sex: Sex
  heightCm: number
  currentWeightKg: number
  targetWeightKg?: number
  currentWaistCm?: number
  trainingExperience: TrainingExperience
  previousTrainingBreak: string
  mainGoal: string
  gymName: string
  preferredEquipment: string[]
  trainingAvailabilityDays: number
  maxSessionDurationMinutes: number
  activityOutsideGym: 'low' | 'moderate' | 'high'
  reportedLimitations: string
  averageSleepHours: number
  programStartWeek: number
  createdAt: string
  updatedAt: string
}

export interface AppSettings {
  id: string
  appName: string
  theme: ThemeMode
  weightUnit: WeightUnit
  distanceUnit: DistanceUnit
  autoTimerStart: boolean
  timerSoundEnabled: boolean
  timerVibrateEnabled: boolean
  defaultRestDurationSec: number
  restPresetsSec: number[]
  dailyWaterTargetMl: number
  dailyStepTarget: number
  dailyProteinTargetG: number
  dailyCalorieTarget: number
  accentColor: string
  updatedAt: string
}

export interface ExerciseMedia {
  thumbnailSvg?: string
  videoUrl?: string
  isExternal?: boolean
  videoNote?: string
}

export interface Exercise {
  id: string
  name: string
  category: 'upper' | 'lower' | 'core' | 'cardio' | 'mobility'
  targetMuscles: string[]
  primaryMuscle: string
  equipment: string
  setupInstructions: string[]
  executionInstructions: string[]
  breathingCues: string
  recommendedSets: number
  recommendedRepsMin: number
  recommendedRepsMax: number
  recommendedRestSec: number
  defaultWeightKg: number
  weightIncrementKg: number
  commonMistakes: string[]
  beginnerModifications: string[]
  safetyNotes: string[]
  media?: ExerciseMedia
  alternativeExerciseIds: string[]
  tags: string[]
}

export interface TemplateExercise {
  exerciseId: string
  order: number
  targetSets: number
  targetRepsMin: number
  targetRepsMax: number
  targetRestSec: number
  targetWeightKg?: number
  notes?: string
}

export interface WarmUpRoutine {
  cardioMinutes: number
  cardioType: string
  mobilityDrills: string[]
  practiceSetsNote: string
}

export interface WorkoutTemplate {
  id: string
  name: string
  dayOfWeek: number // 0 = Sun, 1 = Mon, ..., 6 = Sat
  category: 'upper' | 'lower' | 'cardio_mobility' | 'rest'
  phaseWeekRange: [number, number]
  estimatedDurationMinutes: number
  warmUp?: WarmUpRoutine
  exercises: TemplateExercise[]
  description: string
  isRestDay?: boolean
}

export interface LoggedSet {
  id: string
  setNumber: number
  isWarmup: boolean
  targetWeightKg: number
  targetReps: number
  actualWeightKg: number
  actualReps: number
  effortRatingRpe?: number
  repsInReserve?: number
  completed: boolean
  completedAt: string
  notes?: string
}

export interface SessionExercise {
  exerciseId: string
  originalExerciseId?: string
  isSubstituted: boolean
  substitutionReason?: string
  order: number
  sets: LoggedSet[]
  skipped: boolean
  skipReason?: string
}

export type WorkoutSessionStatus = 'in_progress' | 'completed' | 'abandoned'

export interface WorkoutSession {
  id: string
  templateId: string
  templateName: string
  date: string // YYYY-MM-DD
  startTime: string // ISO
  endTime?: string // ISO
  durationSeconds: number
  status: WorkoutSessionStatus
  warmUpCompleted: boolean
  exercises: SessionExercise[]
  totalVolumeKg?: number
  totalRepsCompleted?: number
  notes?: string
  rating?: number
}

export interface BodyMeasurement {
  id: string
  date: string // YYYY-MM-DD
  timestamp: string // ISO
  weightKg?: number
  waistCm?: number
  chestCm?: number
  armsCm?: number
  hipsCm?: number
  thighsCm?: number
  notes?: string
}

export interface FoodItem {
  id: string
  name: string
  servingSize: string
  calories: number
  proteinG: number
  carbsG: number
  fatG: number
  category: 'protein' | 'carb' | 'produce' | 'dairy' | 'beverage' | 'filipino_staple' | 'other'
  isCustom?: boolean
}

export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack' | 'post_workout'

export interface NutritionEntry {
  id: string
  date: string // YYYY-MM-DD
  time: string // HH:mm
  mealType: MealType
  foodName: string
  portion: string
  calories: number
  proteinG: number
  carbsG: number
  fatG: number
  notes?: string
}

export interface WaterEntry {
  id: string
  date: string // YYYY-MM-DD
  timestamp: string // ISO
  amountMl: number
}

export interface DailyActivity {
  id: string
  date: string // YYYY-MM-DD
  steps: number
  cardioMinutes: number
  cardioType?: string
  sleepHours: number
  energyLevel?: number // 1-5
  notes?: string
}

export interface ProgressPhoto {
  id: string
  date: string // YYYY-MM-DD
  timestamp: string // ISO
  photoDataUrl: string
  pose: 'front' | 'side' | 'back'
  notes?: string
}

export type RecommendationType =
  | 'weight_increase'
  | 'weight_decrease'
  | 'maintain_weight'
  | 'recovery_deload'
  | 'sleep_warning'
  | 'consistency_kudos'

export interface UserRecommendation {
  id: string
  date: string // YYYY-MM-DD
  exerciseId?: string
  exerciseName?: string
  type: RecommendationType
  title: string
  reason: string
  suggestedAction: string
  status: 'pending' | 'accepted' | 'dismissed'
  createdAt: string
}

export type ReminderCategory =
  | 'workout'
  | 'weigh_in'
  | 'waist'
  | 'water'
  | 'protein'
  | 'sleep'
  | 'weekly_review'

export interface ReminderSetting {
  id: string
  title: string
  category: ReminderCategory
  time: string // HH:mm
  daysOfWeek: number[] // 0-6
  enabled: boolean
}
