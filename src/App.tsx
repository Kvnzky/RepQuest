import React, { useState, useEffect } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import {
  db,
  initDatabase,
  resetProgramToDefaults,
  clearAllLocalData
} from './db'
import {
  WorkoutTemplate,
  WorkoutSession,
  BodyMeasurement,
  DailyActivity,
  NutritionEntry,
  FoodItem,
  ProgressPhoto,
  UserProfile,
  AppSettings
} from './types'
import { generateAllAdaptiveRecommendations } from './utils/progressionEngine'

// Components
import { Header } from './components/common/Header'
import { BottomNav, TabType } from './components/common/BottomNav'
import { HomeDashboard } from './components/home/HomeDashboard'
import { WorkoutsTab } from './components/workout/WorkoutsTab'
import { WorkoutMode } from './components/workout/WorkoutMode'
import { ProgressTab } from './components/progress/ProgressTab'
import { NutritionTab } from './components/nutrition/NutritionTab'
import { SettingsTab } from './components/settings/SettingsTab'
import { SafetyDisclaimerModal } from './components/settings/SafetyDisclaimerModal'

export function App() {
  const [activeTab, setActiveTab] = useState<TabType>('home')
  const [isWorkoutModeActive, setIsWorkoutModeActive] = useState<boolean>(false)
  const [isDisclaimerOpen, setIsDisclaimerOpen] = useState<boolean>(false)
  const [dbReady, setDbReady] = useState<boolean>(false)

  // Initialize Dexie IndexedDB
  useEffect(() => {
    initDatabase()
      .then(() => setDbReady(true))
      .catch((err) => console.error('Database initialization error:', err))
  }, [])

  // Reactive IndexedDB Queries
  const userProfile = useLiveQuery(() => db.userProfile.get('current'))
  const appSettings = useLiveQuery(() => db.appSettings.get('current'))
  const workoutTemplates = useLiveQuery(() => db.workoutTemplates.toArray()) || []
  const exercises = useLiveQuery(() => db.exercises.toArray()) || []
  const workoutSessions = useLiveQuery(() => db.workoutSessions.toArray()) || []
  const bodyMeasurements = useLiveQuery(() => db.bodyMeasurements.toArray()) || []
  const dailyActivities = useLiveQuery(() => db.dailyActivities.toArray()) || []
  const nutritionEntries = useLiveQuery(() => db.nutritionEntries.toArray()) || []
  const waterEntries = useLiveQuery(() => db.waterEntries.toArray()) || []
  const customFoods = useLiveQuery(() => db.customFoods.toArray()) || []
  const progressPhotos = useLiveQuery(() => db.progressPhotos.toArray()) || []
  const reminders = useLiveQuery(() => db.reminders.toArray()) || []
  const storedRecommendations = useLiveQuery(() => db.recommendations.toArray()) || []

  // Active in-progress workout session check
  const activeSession = workoutSessions.find(s => s.status === 'in_progress') || null

  // Today's scheduled workout
  const todayDayOfWeek = new Date().getDay() // 0 = Sun, 1 = Mon ... 6 = Sat
  const todayTemplate = workoutTemplates.find(t => t.dayOfWeek === todayDayOfWeek) || null

  // Next scheduled workout
  const tomorrowDayOfWeek = (todayDayOfWeek + 1) % 7
  const nextTemplate = workoutTemplates.find(t => t.dayOfWeek === tomorrowDayOfWeek) || null

  // Completed sessions this current calendar week
  const completedSessionsThisWeek = workoutSessions.filter(s => {
    if (s.status !== 'completed') return false
    const sDate = new Date(s.date)
    const now = new Date()
    const diffDays = Math.floor((now.getTime() - sDate.getTime()) / (1000 * 60 * 60 * 24))
    return diffDays >= 0 && diffDays < 7
  })

  // Today's activity record
  const todayStr = new Date().toISOString().split('T')[0]
  const todayActivity = dailyActivities.find(a => a.date === todayStr) || null

  // Today's nutrition & water
  const todayNutrition = nutritionEntries.filter(n => n.date === todayStr)
  const todayWater = waterEntries.filter(w => w.date === todayStr)

  // Current program week
  const currentWeek = userProfile?.programStartWeek || 1

  // Recommendations: combine stored + engine-evaluated
  const liveRecommendations = React.useMemo(() => {
    if (exercises.length === 0) return []
    const generated = generateAllAdaptiveRecommendations(
      exercises,
      workoutSessions,
      dailyActivities,
      currentWeek
    )
    // Filter out dismissed recommendations
    const dismissedIds = new Set(
      storedRecommendations.filter(r => r.status === 'dismissed').map(r => r.id)
    )
    return generated.filter(r => !dismissedIds.has(r.id))
  }, [exercises, workoutSessions, dailyActivities, currentWeek, storedRecommendations])

  // Start new workout
  const handleStartWorkout = async (template: WorkoutTemplate) => {
    const newSessionId = `session-${Date.now()}`
    const newSession: WorkoutSession = {
      id: newSessionId,
      templateId: template.id,
      templateName: template.name,
      date: todayStr,
      startTime: new Date().toISOString(),
      durationSeconds: 0,
      status: 'in_progress',
      warmUpCompleted: false,
      exercises: template.exercises.map(te => ({
        exerciseId: te.exerciseId,
        isSubstituted: false,
        order: te.order,
        skipped: false,
        sets: []
      }))
    }

    await db.workoutSessions.put(newSession)
    setIsWorkoutModeActive(true)
  }

  // Resume active workout
  const handleResumeWorkout = () => {
    if (activeSession) {
      setIsWorkoutModeActive(true)
    }
  }

  // Quick weight/waist log from dashboard
  const handleQuickLogWeight = async (weightKg: number, waistCm?: number) => {
    const measurementId = `meas-${Date.now()}`
    const newMeas: BodyMeasurement = {
      id: measurementId,
      date: todayStr,
      timestamp: new Date().toISOString(),
      weightKg,
      waistCm,
      notes: 'Logged from home dashboard'
    }

    await db.bodyMeasurements.put(newMeas)
    if (userProfile) {
      await db.userProfile.update('current', {
        currentWeightKg: weightKg,
        ...(waistCm !== undefined ? { currentWaistCm: waistCm } : {}),
        updatedAt: new Date().toISOString()
      })
    }
  }

  // Quick steps log
  const handleQuickLogSteps = async (steps: number) => {
    if (todayActivity) {
      await db.dailyActivities.update(todayActivity.id, { steps })
    } else {
      await db.dailyActivities.put({
        id: todayStr,
        date: todayStr,
        steps,
        cardioMinutes: 0,
        sleepHours: userProfile?.averageSleepHours || 5.5
      })
    }
  }

  // Quick water add
  const handleQuickAddWater = async (amountMl: number) => {
    const waterEntryId = `water-${Date.now()}`
    await db.waterEntries.put({
      id: waterEntryId,
      date: todayStr,
      timestamp: new Date().toISOString(),
      amountMl
    })
  }

  // Quick sleep update
  const handleQuickLogSleep = async (hours: number) => {
    if (todayActivity) {
      await db.dailyActivities.update(todayActivity.id, { sleepHours: hours })
    } else {
      await db.dailyActivities.put({
        id: todayStr,
        date: todayStr,
        steps: 0,
        cardioMinutes: 0,
        sleepHours: hours
      })
    }
    if (userProfile) {
      await db.userProfile.update('current', { averageSleepHours: hours })
    }
  }

  // Dismiss recommendation
  const handleDismissRecommendation = async (recId: string) => {
    await db.recommendations.put({
      id: recId,
      date: todayStr,
      type: 'maintain_weight',
      title: 'Dismissed',
      reason: 'User dismissed suggestion',
      suggestedAction: 'None',
      status: 'dismissed',
      createdAt: new Date().toISOString()
    })
  }

  // Workouts Tab actions
  const handleUpdateTemplateDay = async (templateId: string, newDayOfWeek: number) => {
    await db.workoutTemplates.update(templateId, { dayOfWeek: newDayOfWeek })
  }

  const handleSetCurrentWeek = async (week: number) => {
    if (userProfile) {
      await db.userProfile.update('current', { programStartWeek: week })
    }
  }

  // Progress Tab actions
  const handleAddMeasurement = async (measurement: Omit<BodyMeasurement, 'id' | 'timestamp'>) => {
    const id = `meas-${Date.now()}`
    await db.bodyMeasurements.put({
      ...measurement,
      id,
      timestamp: new Date().toISOString()
    })
    if (measurement.weightKg && userProfile) {
      await db.userProfile.update('current', {
        currentWeightKg: measurement.weightKg,
        ...(measurement.waistCm ? { currentWaistCm: measurement.waistCm } : {})
      })
    }
  }

  const handleDeleteMeasurement = async (id: string) => {
    await db.bodyMeasurements.delete(id)
  }

  const handleAddPhoto = async (photoDataUrl: string, pose: 'front' | 'side' | 'back', notes?: string) => {
    const id = `photo-${Date.now()}`
    await db.progressPhotos.put({
      id,
      date: todayStr,
      timestamp: new Date().toISOString(),
      photoDataUrl,
      pose,
      notes
    })
  }

  const handleDeletePhoto = async (id: string) => {
    await db.progressPhotos.delete(id)
  }

  // Nutrition Tab actions
  const handleAddNutritionEntry = async (entry: Omit<NutritionEntry, 'id'>) => {
    const id = `nutr-${Date.now()}`
    await db.nutritionEntries.put({ ...entry, id })
  }

  const handleDeleteNutritionEntry = async (id: string) => {
    await db.nutritionEntries.delete(id)
  }

  const handleAddCustomFood = async (food: FoodItem) => {
    await db.customFoods.put(food)
  }

  const handleDeleteWater = async (id: string) => {
    await db.waterEntries.delete(id)
  }

  const handleUpdateNutritionTargets = async (
    proteinTargetG: number,
    calorieTarget: number,
    waterTargetMl: number
  ) => {
    if (appSettings) {
      await db.appSettings.update('current', {
        dailyProteinTargetG: proteinTargetG,
        dailyCalorieTarget: calorieTarget,
        dailyWaterTargetMl: waterTargetMl
      })
    }
  }

  // Settings Tab actions
  const handleUpdateProfile = async (updated: UserProfile) => {
    await db.userProfile.put(updated)
  }

  const handleUpdateSettings = async (updated: AppSettings) => {
    await db.appSettings.put(updated)
  }

  const handleToggleReminder = async (reminderId: string, enabled: boolean) => {
    await db.reminders.update(reminderId, { enabled })
  }

  if (!dbReady || !userProfile || !appSettings) {
    return (
      <div className="min-h-screen bg-[#090d16] flex flex-col items-center justify-center text-slate-400 p-6 text-center">
        <div className="w-12 h-12 rounded-2xl bg-sky-500/20 border border-sky-500/40 animate-pulse flex items-center justify-center mb-4">
          <span className="text-sky-400 text-lg font-black">R</span>
        </div>
        <h2 className="text-base font-bold text-white tracking-tight">RepQuest Gym Companion</h2>
        <p className="text-xs text-slate-500 mt-1">Initializing offline storage...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex flex-col font-sans selection:bg-sky-500 selection:text-slate-950">
      {/* Top Header */}
      <Header
        appName={appSettings.appName || 'RepQuest'}
        currentWeek={currentWeek}
        hasActiveWorkout={Boolean(activeSession)}
        onResumeWorkout={handleResumeWorkout}
        onOpenDisclaimer={() => setIsDisclaimerOpen(true)}
      />

      {/* Main View Area */}
      <main className="flex-1 w-full max-w-md mx-auto">
        {activeTab === 'home' && (
          <HomeDashboard
            userProfile={userProfile}
            appSettings={appSettings}
            todayTemplate={todayTemplate}
            nextTemplate={nextTemplate}
            activeSession={activeSession}
            completedSessionsThisWeek={completedSessionsThisWeek}
            recentMeasurements={bodyMeasurements}
            todayActivity={todayActivity}
            todayNutrition={todayNutrition}
            todayWater={todayWater}
            recommendations={liveRecommendations}
            onStartWorkout={handleStartWorkout}
            onResumeWorkout={handleResumeWorkout}
            onQuickLogWeight={handleQuickLogWeight}
            onQuickLogSteps={handleQuickLogSteps}
            onQuickAddWater={handleQuickAddWater}
            onQuickLogSleep={handleQuickLogSleep}
            onDismissRecommendation={handleDismissRecommendation}
            onNavigateToTab={(tab) => setActiveTab(tab)}
          />
        )}

        {activeTab === 'workouts' && (
          <WorkoutsTab
            currentWeek={currentWeek}
            templates={workoutTemplates}
            exercises={exercises}
            pastSessions={workoutSessions}
            onStartWorkout={handleStartWorkout}
            onUpdateTemplateDay={handleUpdateTemplateDay}
            onSetCurrentWeek={handleSetCurrentWeek}
          />
        )}

        {activeTab === 'progress' && (
          <ProgressTab
            measurements={bodyMeasurements}
            sessions={workoutSessions}
            activities={dailyActivities}
            nutrition={nutritionEntries}
            photos={progressPhotos}
            exercises={exercises}
            onAddMeasurement={handleAddMeasurement}
            onDeleteMeasurement={handleDeleteMeasurement}
            onAddPhoto={handleAddPhoto}
            onDeletePhoto={handleDeletePhoto}
          />
        )}

        {activeTab === 'nutrition' && (
          <NutritionTab
            appSettings={appSettings}
            nutritionEntries={nutritionEntries}
            waterEntries={waterEntries}
            customFoods={customFoods}
            onAddNutritionEntry={handleAddNutritionEntry}
            onDeleteNutritionEntry={handleDeleteNutritionEntry}
            onAddCustomFood={handleAddCustomFood}
            onAddWater={handleQuickAddWater}
            onDeleteWater={handleDeleteWater}
            onUpdateTargets={handleUpdateNutritionTargets}
          />
        )}

        {activeTab === 'settings' && (
          <SettingsTab
            userProfile={userProfile}
            appSettings={appSettings}
            reminders={reminders}
            onUpdateProfile={handleUpdateProfile}
            onUpdateSettings={handleUpdateSettings}
            onToggleReminder={handleToggleReminder}
            onResetProgram={resetProgramToDefaults}
            onClearAllData={clearAllLocalData}
          />
        )}
      </main>

      {/* Distraction-Free Workout Mode Overlay */}
      {isWorkoutModeActive && activeSession && (
        <WorkoutMode
          session={activeSession}
          availableExercises={exercises}
          autoTimerStart={appSettings.autoTimerStart}
          timerSoundEnabled={appSettings.timerSoundEnabled}
          timerVibrateEnabled={appSettings.timerVibrateEnabled}
          defaultRestSec={appSettings.defaultRestDurationSec || 90}
          onExitWorkout={() => setIsWorkoutModeActive(false)}
          onWorkoutCompleted={() => {
            setIsWorkoutModeActive(false)
            setActiveTab('home')
          }}
        />
      )}

      {/* Safety & Medical Disclaimer Modal */}
      <SafetyDisclaimerModal
        isOpen={isDisclaimerOpen}
        onClose={() => setIsDisclaimerOpen(false)}
      />

      {/* Persistent Bottom Navigation */}
      <BottomNav
        activeTab={activeTab}
        onTabChange={(tab) => {
          setActiveTab(tab)
          window.scrollTo({ top: 0, behavior: 'smooth' })
        }}
        hasActiveWorkout={Boolean(activeSession)}
      />
    </div>
  )
}

export default App
