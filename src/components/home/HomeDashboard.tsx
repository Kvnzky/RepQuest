import React, { useState } from 'react'
import {
  Play,
  TrendingUp,
  Dumbbell,
  CheckCircle2,
  Calendar,
  AlertCircle,
  Plus,
  Scale,
  Footprints,
  Utensils,
  Droplet,
  Moon,
  ChevronRight,
  Flame,
  Lightbulb,
  Check,
  X
} from 'lucide-react'
import {
  UserProfile,
  AppSettings,
  WorkoutTemplate,
  WorkoutSession,
  BodyMeasurement,
  DailyActivity,
  NutritionEntry,
  WaterEntry,
  UserRecommendation
} from '../../types'
import { getProgramPhase } from '../../utils/progressionEngine'
import { TrendLineChart } from '../common/Charts'

interface HomeDashboardProps {
  userProfile: UserProfile
  appSettings: AppSettings
  todayTemplate: WorkoutTemplate | null
  nextTemplate: WorkoutTemplate | null
  activeSession: WorkoutSession | null
  completedSessionsThisWeek: WorkoutSession[]
  recentMeasurements: BodyMeasurement[]
  todayActivity: DailyActivity | null
  todayNutrition: NutritionEntry[]
  todayWater: WaterEntry[]
  recommendations: UserRecommendation[]
  onStartWorkout: (template: WorkoutTemplate) => void
  onResumeWorkout: () => void
  onQuickLogWeight: (weightKg: number, waistCm?: number) => void
  onQuickLogSteps: (steps: number) => void
  onQuickAddWater: (amountMl: number) => void
  onQuickLogSleep: (hours: number) => void
  onDismissRecommendation: (recId: string) => void
  onNavigateToTab: (tab: 'workouts' | 'progress' | 'nutrition' | 'settings') => void
}

export const HomeDashboard: React.FC<HomeDashboardProps> = ({
  userProfile,
  appSettings,
  todayTemplate,
  nextTemplate,
  activeSession,
  completedSessionsThisWeek,
  recentMeasurements,
  todayActivity,
  todayNutrition,
  todayWater,
  recommendations,
  onStartWorkout,
  onResumeWorkout,
  onQuickLogWeight,
  onQuickLogSteps,
  onQuickAddWater,
  onQuickLogSleep,
  onDismissRecommendation,
  onNavigateToTab
}) => {
  // Local state for inline quick modals
  const [showWeightModal, setShowWeightModal] = useState<boolean>(false)
  const [modalWeight, setModalWeight] = useState<number>(userProfile.currentWeightKg || 78)
  const [modalWaist, setModalWaist] = useState<number>(userProfile.currentWaistCm || 94)

  const [showStepsModal, setShowStepsModal] = useState<boolean>(false)
  const [modalSteps, setModalSteps] = useState<number>(todayActivity?.steps || 0)

  const [showSleepModal, setShowSleepModal] = useState<boolean>(false)
  const [modalSleep, setModalSleep] = useState<number>(todayActivity?.sleepHours || 5.5)

  // Current program phase information
  const currentWeek = userProfile.programStartWeek || 1
  const phaseInfo = getProgramPhase(currentWeek)

  // Current date formatted nicely
  const today = new Date()
  const dateFormatted = today.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric'
  })

  // Greeting
  const hour = today.getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening'

  // Weekly consistency dots (Monday = 1, Sunday = 0)
  // Mapping days 1..7 (Mon to Sun)
  const dayLabels = ['M', 'T', 'W', 'T', 'F', 'S', 'S']
  const weekDayIndex = (today.getDay() + 6) % 7 // 0 = Mon, 6 = Sun

  const weeklyCompletionMap = dayLabels.map((label, idx) => {
    // Check if any completed session corresponds to day idx (Mon=1 ... Sun=0)
    const targetDayOfWeek = idx === 6 ? 0 : idx + 1
    const isCompleted = completedSessionsThisWeek.some(s => {
      const sDay = new Date(s.date).getDay()
      return sDay === targetDayOfWeek && s.status === 'completed'
    })
    const isToday = idx === weekDayIndex
    return { label, isCompleted, isToday }
  })

  // Nutrition calculations
  const totalProteinG = todayNutrition.reduce((sum, n) => sum + (n.proteinG || 0), 0)
  const proteinTargetG = appSettings.dailyProteinTargetG || 140
  const proteinPct = Math.min(100, Math.round((totalProteinG / proteinTargetG) * 100))

  // Water calculations
  const totalWaterMl = todayWater.reduce((sum, w) => sum + w.amountMl, 0)
  const waterTargetMl = appSettings.dailyWaterTargetMl || 3000
  const waterPct = Math.min(100, Math.round((totalWaterMl / waterTargetMl) * 100))

  // Weight Trend Data for Chart
  const weightChartData = recentMeasurements
    .filter(m => m.weightKg !== undefined)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .map(m => ({
      date: m.date.slice(5), // MM-DD
      value: m.weightKg!
    }))

  const latestWeight = recentMeasurements[recentMeasurements.length - 1]?.weightKg ?? userProfile.currentWeightKg
  const latestWaist = recentMeasurements[recentMeasurements.length - 1]?.waistCm ?? userProfile.currentWaistCm

  // Sleep status
  const sleepHours = todayActivity?.sleepHours ?? 5.5
  const isSleepLow = sleepHours < 6.0

  return (
    <div className="space-y-4 pb-24 px-4 pt-3 max-w-lg mx-auto">
      {/* Greeting & Date Header */}
      <div className="flex items-start justify-between">
        <div>
          <span className="text-xs font-semibold text-sky-400 tracking-wide uppercase">
            {dateFormatted}
          </span>
          <h2 className="text-2xl font-black text-white tracking-tight">
            {greeting}!
          </h2>
        </div>

        {/* 8-Week Program Phase Badge */}
        <div
          onClick={() => onNavigateToTab('workouts')}
          className="cursor-pointer text-right p-2 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-colors"
        >
          <span className="text-[10px] font-bold uppercase tracking-wider text-sky-400 block">
            Phase {phaseInfo.phaseNumber}: Week {currentWeek}
          </span>
          <span className="text-xs font-semibold text-slate-300 block line-clamp-1 max-w-[140px]">
            {phaseInfo.phaseName}
          </span>
        </div>
      </div>

      {/* Adaptive Training / Recovery Alert if Sleep is Low */}
      {isSleepLow && (
        <div className="p-3.5 rounded-2xl bg-amber-950/40 border border-amber-800/60 flex items-start gap-3">
          <Moon className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div className="flex-1">
            <h4 className="text-xs font-bold text-amber-300">Under-Recovery Caution ({sleepHours}h Sleep)</h4>
            <p className="text-[11px] text-amber-100/80 mt-0.5 leading-relaxed">
              Recorded sleep is under 6 hours. Maintain current machine weights and focus on strict form; avoid max-effort training today.
            </p>
          </div>
          <button
            onClick={() => setShowSleepModal(true)}
            className="text-[10px] font-bold text-amber-400 bg-amber-950/80 px-2 py-1 rounded-lg border border-amber-800/80"
          >
            Update
          </button>
        </div>
      )}

      {/* Pending Adaptive Recommendations */}
      {recommendations.length > 0 && (
        <div className="space-y-2">
          {recommendations.slice(0, 1).map((rec) => (
            <div
              key={rec.id}
              className="p-3.5 rounded-2xl bg-sky-950/40 border border-sky-800/70 flex items-start justify-between gap-3 shadow-lg"
            >
              <div className="flex items-start gap-2.5">
                <div className="w-7 h-7 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center shrink-0 mt-0.5">
                  <Lightbulb className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-sky-200">{rec.title}</h4>
                  <p className="text-[11px] text-slate-300 mt-0.5 leading-relaxed">{rec.reason}</p>
                  <p className="text-[11px] text-sky-400 font-semibold mt-1">💡 {rec.suggestedAction}</p>
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <button
                  onClick={() => onDismissRecommendation(rec.id)}
                  className="p-1 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
                  title="Dismiss suggestion"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Prominent Today's Workout Card */}
      <div className="p-5 rounded-3xl bg-gradient-to-br from-slate-900 to-[#0e1626] border border-slate-800 shadow-2xl relative overflow-hidden">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-sky-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Today's Planned Session
            </span>
          </div>
          {todayTemplate?.isRestDay && (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800/50">
              Active Recovery
            </span>
          )}
        </div>

        {todayTemplate ? (
          <div>
            <h3 className="text-xl font-black text-white tracking-tight">{todayTemplate.name}</h3>
            <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
              {todayTemplate.description}
            </p>

            {todayTemplate.exercises.length > 0 && (
              <div className="flex items-center gap-3 mt-3 text-xs text-slate-300">
                <span className="flex items-center gap-1 font-semibold text-sky-400">
                  <Dumbbell className="w-3.5 h-3.5" />
                  {todayTemplate.exercises.length} Exercises
                </span>
                <span>•</span>
                <span>~{todayTemplate.estimatedDurationMinutes} Minutes</span>
                <span>•</span>
                <span className="text-emerald-400 font-medium">Anytime Fitness</span>
              </div>
            )}

            {/* Action Button: Start or Resume */}
            <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between">
              {activeSession ? (
                <button
                  onClick={onResumeWorkout}
                  className="w-full py-3.5 px-4 rounded-2xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg shadow-sky-500/25 active:scale-[0.99] transition-all"
                >
                  <Play className="w-5 h-5 fill-current" />
                  <span>Resume In-Progress Workout</span>
                </button>
              ) : todayTemplate.isRestDay ? (
                <div className="w-full flex items-center justify-between text-xs text-slate-400">
                  <span>Take a brisk outdoor walk or rest completely today.</span>
                  <button
                    onClick={() => onStartWorkout(todayTemplate)}
                    className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
                  >
                    Log Activity
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => onStartWorkout(todayTemplate)}
                  className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-sky-400 to-cyan-400 hover:from-sky-300 hover:to-cyan-300 text-slate-950 font-black text-sm flex items-center justify-center gap-2 shadow-xl shadow-sky-500/20 active:scale-[0.99] transition-all"
                >
                  <Play className="w-5 h-5 fill-current" />
                  <span>Start Workout Session</span>
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="py-4 text-center">
            <p className="text-sm font-semibold text-slate-300">No scheduled workout for today</p>
            <p className="text-xs text-slate-500 mt-1">Review the weekly plan or select a workout from catalog.</p>
          </div>
        )}
      </div>

      {/* Next Scheduled Session Preview */}
      {nextTemplate && (
        <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Calendar className="w-4 h-4 text-slate-400" />
            <div>
              <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wide block">Next Session</span>
              <span className="text-xs font-bold text-slate-200">{nextTemplate.name}</span>
            </div>
          </div>
          <button
            onClick={() => onNavigateToTab('workouts')}
            className="text-xs text-sky-400 font-semibold flex items-center gap-0.5"
          >
            <span>Schedule</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Current Week Consistency Dots */}
      <div className="p-4 rounded-3xl bg-slate-900 border border-slate-800">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            This Week's Consistency
          </span>
          <span className="text-xs font-bold text-emerald-400">
            {completedSessionsThisWeek.length} of 5 visits
          </span>
        </div>

        <div className="grid grid-cols-7 gap-2 text-center">
          {weeklyCompletionMap.map((d, idx) => (
            <div key={idx} className="flex flex-col items-center">
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold transition-all ${
                  d.isCompleted
                    ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                    : d.isToday
                    ? 'bg-sky-500/20 border-2 border-sky-400 text-sky-300'
                    : 'bg-slate-800/80 text-slate-500'
                }`}
              >
                {d.isCompleted ? <Check className="w-4 h-4 stroke-[3]" /> : d.label}
              </div>
              <span className={`text-[10px] mt-1 font-medium ${d.isToday ? 'text-sky-400' : 'text-slate-500'}`}>
                {d.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Body Recomposition Metrics: Weight & Waist */}
      <div className="grid grid-cols-2 gap-3">
        {/* Weight Card */}
        <div className="p-4 rounded-3xl bg-slate-900 border border-slate-800 relative">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wide flex items-center gap-1">
              <Scale className="w-3.5 h-3.5 text-sky-400" /> Body Weight
            </span>
            <button
              onClick={() => setShowWeightModal(true)}
              className="p-1 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
              title="Log Weight"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-black text-white">{latestWeight}</span>
            <span className="text-xs font-semibold text-slate-400">kg</span>
          </div>
          <span className="text-[10px] text-slate-500 mt-1 block">
            Target: {userProfile.targetWeightKg || 72} kg
          </span>
        </div>

        {/* Waist Card */}
        <div className="p-4 rounded-3xl bg-slate-900 border border-slate-800 relative">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wide flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-400" /> Waist Circ.
            </span>
            <button
              onClick={() => setShowWeightModal(true)}
              className="p-1 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
              title="Log Waist"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-black text-white">{latestWaist || '—'}</span>
            <span className="text-xs font-semibold text-slate-400">cm</span>
          </div>
          <span className="text-[10px] text-slate-500 mt-1 block">
            Recomp progress indicator
          </span>
        </div>
      </div>

      {/* Weight Trend Chart Preview */}
      <TrendLineChart
        data={weightChartData}
        unit="kg"
        title="Body Weight Trend"
        subtitle="Weekly weigh-in progress"
        targetValue={userProfile.targetWeightKg || 72}
        targetLabel="Goal"
        emptyMessage="No body weight entries recorded yet. Tap + to record your baseline."
      />

      {/* Daily Activity, Nutrition & Hydration Trackers */}
      <div className="space-y-3">
        {/* Daily Protein Card */}
        <div className="p-4 rounded-3xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-xl bg-sky-500/10 text-sky-400 flex items-center justify-center">
                <Utensils className="w-3.5 h-3.5" />
              </div>
              <div>
                <span className="text-xs font-bold text-white block">Today's Protein</span>
                <span className="text-[10px] text-slate-400">Target range: 125–155g</span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-sm font-black text-sky-400">{totalProteinG}g</span>
              <span className="text-xs text-slate-500"> / {proteinTargetG}g</span>
            </div>
          </div>
          {/* Progress Bar */}
          <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden">
            <div
              style={{ width: `${proteinPct}%` }}
              className="bg-gradient-to-r from-sky-400 to-cyan-400 h-full rounded-full transition-all duration-500"
            />
          </div>
          <div className="mt-2.5 flex items-center justify-between text-[11px]">
            <span className="text-slate-400">{proteinPct}% of daily goal</span>
            <button
              onClick={() => onNavigateToTab('nutrition')}
              className="text-sky-400 font-semibold hover:underline"
            >
              + Log Food / Meal
            </button>
          </div>
        </div>

        {/* Daily Steps & Water Quick Row */}
        <div className="grid grid-cols-2 gap-3">
          {/* Steps */}
          <div className="p-4 rounded-3xl bg-slate-900 border border-slate-800">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[11px] font-bold text-slate-400 uppercase flex items-center gap-1">
                <Footprints className="w-3.5 h-3.5 text-emerald-400" /> Daily Steps
              </span>
              <button
                onClick={() => setShowStepsModal(true)}
                className="p-1 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
              >
                <Plus className="w-3 h-3" />
              </button>
            </div>
            <div className="text-xl font-black text-white">
              {(todayActivity?.steps || 0).toLocaleString()}
            </div>
            <span className="text-[10px] text-slate-500 mt-0.5 block">
              Goal: {(appSettings.dailyStepTarget || 6000).toLocaleString()}
            </span>
          </div>

          {/* Water */}
          <div className="p-4 rounded-3xl bg-slate-900 border border-slate-800">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[11px] font-bold text-slate-400 uppercase flex items-center gap-1">
                <Droplet className="w-3.5 h-3.5 text-cyan-400" /> Water Intake
              </span>
              <span className="text-[10px] font-bold text-cyan-400">{waterPct}%</span>
            </div>
            <div className="text-xl font-black text-white">
              {(totalWaterMl / 1000).toFixed(1)} <span className="text-xs font-normal text-slate-400">L</span>
            </div>
            <div className="flex gap-1.5 mt-2">
              <button
                onClick={() => onQuickAddWater(250)}
                className="flex-1 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-[10px] font-bold text-slate-300"
              >
                +250ml
              </button>
              <button
                onClick={() => onQuickAddWater(500)}
                className="flex-1 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-[10px] font-bold text-slate-300"
              >
                +500ml
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Weight Modal */}
      {showWeightModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0f172a] border border-slate-800 rounded-3xl w-full max-w-xs p-5 shadow-2xl">
            <h3 className="text-base font-bold text-white mb-3">Record Measurements</h3>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-slate-400 block mb-1">Body Weight (kg)</label>
                <input
                  type="number"
                  step="0.1"
                  value={modalWeight}
                  onChange={(e) => setModalWeight(parseFloat(e.target.value) || 0)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-lg font-bold text-white text-center focus:outline-none focus:border-sky-500"
                />
              </div>
              <div>
                <label className="text-xs text-slate-400 block mb-1">Waist Circumference (cm)</label>
                <input
                  type="number"
                  step="0.5"
                  value={modalWaist}
                  onChange={(e) => setModalWaist(parseFloat(e.target.value) || 0)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-lg font-bold text-white text-center focus:outline-none focus:border-sky-500"
                />
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <button
                onClick={() => setShowWeightModal(false)}
                className="flex-1 py-2.5 rounded-xl bg-slate-800 text-xs font-semibold text-slate-300"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onQuickLogWeight(modalWeight, modalWaist)
                  setShowWeightModal(false)
                }}
                className="flex-1 py-2.5 rounded-xl bg-sky-500 text-xs font-bold text-slate-950"
              >
                Save Log
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Quick Steps Modal */}
      {showStepsModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0f172a] border border-slate-800 rounded-3xl w-full max-w-xs p-5 shadow-2xl">
            <h3 className="text-base font-bold text-white mb-3">Enter Daily Steps</h3>
            <p className="text-xs text-slate-400 mb-3">
              Manual step entry from your pedometer, phone, or fitness band.
            </p>
            <input
              type="number"
              step="100"
              value={modalSteps}
              onChange={(e) => setModalSteps(parseInt(e.target.value) || 0)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-2xl font-bold text-white text-center focus:outline-none focus:border-sky-500"
            />
            <div className="flex gap-2 mt-4">
              <button
                onClick={() => setShowStepsModal(false)}
                className="flex-1 py-2.5 rounded-xl bg-slate-800 text-xs font-semibold text-slate-300"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onQuickLogSteps(modalSteps)
                  setShowStepsModal(false)
                }}
                className="flex-1 py-2.5 rounded-xl bg-emerald-500 text-xs font-bold text-slate-950"
              >
                Save Steps
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Quick Sleep Modal */}
      {showSleepModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0f172a] border border-slate-800 rounded-3xl w-full max-w-xs p-5 shadow-2xl">
            <h3 className="text-base font-bold text-white mb-2">Record Last Night's Sleep</h3>
            <p className="text-xs text-slate-400 mb-3">
              Recovery sleep is critical for progressive overload adaptation.
            </p>
            <div className="flex items-center justify-center gap-2 mb-4">
              <input
                type="number"
                step="0.5"
                min="0"
                max="14"
                value={modalSleep}
                onChange={(e) => setModalSleep(parseFloat(e.target.value) || 0)}
                className="w-24 bg-slate-950 border border-slate-800 rounded-xl p-3 text-3xl font-black text-white text-center focus:outline-none focus:border-sky-500"
              />
              <span className="text-sm font-bold text-slate-400">hours</span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowSleepModal(false)}
                className="flex-1 py-2.5 rounded-xl bg-slate-800 text-xs font-semibold text-slate-300"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onQuickLogSleep(modalSleep)
                  setShowSleepModal(false)
                }}
                className="flex-1 py-2.5 rounded-xl bg-sky-500 text-xs font-bold text-slate-950"
              >
                Save Sleep
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
