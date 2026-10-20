import React, { useState } from 'react'
import {
  TrendingUp,
  Scale,
  Dumbbell,
  Camera,
  Plus,
  Trash2,
  Calendar,
  Lock,
  ChevronRight,
  ShieldCheck
} from 'lucide-react'
import {
  BodyMeasurement,
  WorkoutSession,
  DailyActivity,
  NutritionEntry,
  ProgressPhoto,
  Exercise
} from '../../types'
import { TrendLineChart, ConsistencyBarChart } from '../common/Charts'

interface ProgressTabProps {
  measurements: BodyMeasurement[]
  sessions: WorkoutSession[]
  activities: DailyActivity[]
  nutrition: NutritionEntry[]
  photos: ProgressPhoto[]
  exercises: Exercise[]
  onAddMeasurement: (measurement: Omit<BodyMeasurement, 'id' | 'timestamp'>) => void
  onDeleteMeasurement: (id: string) => void
  onAddPhoto: (photoDataUrl: string, pose: 'front' | 'side' | 'back', notes?: string) => void
  onDeletePhoto: (id: string) => void
}

export const ProgressTab: React.FC<ProgressTabProps> = ({
  measurements,
  sessions,
  activities,
  nutrition,
  photos,
  exercises,
  onAddMeasurement,
  onDeleteMeasurement,
  onAddPhoto,
  onDeletePhoto
}) => {
  const [timeRange, setTimeRange] = useState<'7d' | '4w' | '8w' | 'all'>('8w')
  const [selectedExerciseId, setSelectedExerciseId] = useState<string>(exercises[0]?.id || 'mach-chest-press')
  const [showMeasureModal, setShowMeasureModal] = useState<boolean>(false)
  const [showPhotoModal, setShowPhotoModal] = useState<boolean>(false)

  // Form states for new measurement
  const [weightInput, setWeightInput] = useState<string>('78.0')
  const [waistInput, setWaistInput] = useState<string>('94.0')
  const [chestInput, setChestInput] = useState<string>('')
  const [armsInput, setArmsInput] = useState<string>('')
  const [hipsInput, setHipsInput] = useState<string>('')
  const [thighsInput, setThighsInput] = useState<string>('')
  const [dateInput, setDateInput] = useState<string>(new Date().toISOString().split('T')[0])

  // Photo form
  const [photoDataUrl, setPhotoDataUrl] = useState<string>('')
  const [photoPose, setPhotoPose] = useState<'front' | 'side' | 'back'>('front')

  // Filter data by time range
  const filterByDate = <T extends { date: string }>(items: T[]): T[] => {
    if (timeRange === 'all') return items
    const now = new Date()
    const daysLimit = timeRange === '7d' ? 7 : timeRange === '4w' ? 28 : 56
    const cutoff = new Date(now.getTime() - daysLimit * 24 * 60 * 60 * 1000)
    return items.filter(item => new Date(item.date) >= cutoff)
  }

  // Weight Trend Data
  const weightData = filterByDate(
    measurements
      .filter(m => m.weightKg !== undefined)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
  ).map(m => ({
    date: m.date.slice(5),
    value: m.weightKg!
  }))

  // Waist Trend Data
  const waistData = filterByDate(
    measurements
      .filter(m => m.waistCm !== undefined)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
  ).map(m => ({
    date: m.date.slice(5),
    value: m.waistCm!
  }))

  // Strength Progression for selected exercise
  const strengthData: { date: string; value: number }[] = []
  sessions
    .filter(s => s.status === 'completed')
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .forEach(s => {
      const ex = s.exercises.find(e => e.exerciseId === selectedExerciseId && !e.skipped)
      if (ex) {
        const workingSets = ex.sets.filter(st => st.completed && !st.isWarmup)
        if (workingSets.length > 0) {
          const maxWeight = Math.max(...workingSets.map(st => st.actualWeightKg))
          strengthData.push({
            date: s.date.slice(5),
            value: maxWeight
          })
        }
      }
    })

  // Protein consistency past 7 days
  const last7Days = Array.from({ length: 7 }).map((_, idx) => {
    const d = new Date()
    d.setDate(d.getDate() - (6 - idx))
    const dateStr = d.toISOString().split('T')[0]
    const dayName = d.toLocaleDateString('en-US', { weekday: 'narrow' })
    const dayProtein = nutrition
      .filter(n => n.date === dateStr)
      .reduce((sum, n) => sum + (n.proteinG || 0), 0)
    return {
      label: dayName,
      value: dayProtein,
      target: 140
    }
  })

  // Photo file upload helper
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setPhotoDataUrl(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSaveMeasurement = () => {
    onAddMeasurement({
      date: dateInput,
      weightKg: weightInput ? parseFloat(weightInput) : undefined,
      waistCm: waistInput ? parseFloat(waistInput) : undefined,
      chestCm: chestInput ? parseFloat(chestInput) : undefined,
      armsCm: armsInput ? parseFloat(armsInput) : undefined,
      hipsCm: hipsInput ? parseFloat(hipsInput) : undefined,
      thighsCm: thighsInput ? parseFloat(thighsInput) : undefined
    })
    setShowMeasureModal(false)
  }

  const handleSavePhoto = () => {
    if (photoDataUrl) {
      onAddPhoto(photoDataUrl, photoPose)
      setPhotoDataUrl('')
      setShowPhotoModal(false)
    }
  }

  return (
    <div className="space-y-4 pb-24 px-4 pt-3 max-w-lg mx-auto">
      {/* Header and Time Range Selector */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-black text-white tracking-tight">Progress & Trends</h2>
        <div className="flex gap-1 p-1 bg-slate-900 border border-slate-800 rounded-xl">
          {(['7d', '4w', '8w', 'all'] as const).map(range => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase transition-all ${
                timeRange === range
                  ? 'bg-sky-500 text-slate-950 font-black'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      {/* Body Weight Chart */}
      <TrendLineChart
        data={weightData}
        unit="kg"
        title="Body Weight Progress"
        subtitle="Tracking body recomposition trends"
        targetValue={72}
        targetLabel="Goal"
        emptyMessage="No body weight entries in this time range."
      />

      {/* Waist Circumference Chart */}
      <TrendLineChart
        data={waistData}
        unit="cm"
        color="#10b981"
        title="Waist Circumference"
        subtitle="Key visceral and abdominal fat metric"
        emptyMessage="No waist circumference records logged yet."
      />

      {/* Strength Progression by Machine */}
      <div className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Machine Strength Progression
          </h3>
          <select
            value={selectedExerciseId}
            onChange={(e) => setSelectedExerciseId(e.target.value)}
            className="bg-slate-900 border border-slate-800 rounded-xl px-2.5 py-1 text-xs text-sky-400 font-semibold focus:outline-none focus:border-sky-500 max-w-[180px] truncate"
          >
            {exercises.map(ex => (
              <option key={ex.id} value={ex.id}>
                {ex.name}
              </option>
            ))}
          </select>
        </div>

        <TrendLineChart
          data={strengthData}
          unit="kg"
          color="#38bdf8"
          title={exercises.find(e => e.id === selectedExerciseId)?.name || 'Machine Strength'}
          subtitle="Top working set weight across completed sessions"
          emptyMessage="No logged sessions with this machine yet. Complete a workout to start tracking progressive overload!"
        />
      </div>

      {/* 7-Day Protein Consistency */}
      <ConsistencyBarChart
        data={last7Days}
        unit="g"
        title="Protein Adherence (Last 7 Days)"
        subtitle="Target: 140g daily for muscle building & preservation"
      />

      {/* Body Measurements Log Table */}
      <div className="p-4 rounded-3xl bg-slate-900 border border-slate-800">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Measurement Log History
            </h3>
            <span className="text-[10px] text-slate-500">Circumference and scale logs</span>
          </div>
          <button
            onClick={() => setShowMeasureModal(true)}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 text-xs font-bold"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Record</span>
          </button>
        </div>

        <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
          {measurements
            .slice()
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
            .map(m => (
              <div
                key={m.id}
                className="p-3 rounded-2xl bg-slate-950 border border-slate-800/80 flex items-center justify-between text-xs"
              >
                <div>
                  <span className="text-[10px] text-slate-400 block font-semibold">{m.date}</span>
                  <div className="flex items-center gap-3 text-slate-200 mt-0.5">
                    {m.weightKg !== undefined && (
                      <span>Weight: <strong className="text-white">{m.weightKg} kg</strong></span>
                    )}
                    {m.waistCm !== undefined && (
                      <span>Waist: <strong className="text-emerald-400">{m.waistCm} cm</strong></span>
                    )}
                    {m.chestCm !== undefined && (
                      <span>Chest: <strong>{m.chestCm} cm</strong></span>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => onDeleteMeasurement(m.id)}
                  className="p-1.5 text-slate-500 hover:text-rose-400"
                  title="Delete log"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
        </div>
      </div>

      {/* Private Progress Photos Section */}
      <div className="p-4 rounded-3xl bg-slate-900 border border-slate-800">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <Camera className="w-4 h-4 text-sky-400" />
              Private Progress Gallery
            </h3>
            <span className="text-[10px] text-slate-500 flex items-center gap-1 mt-0.5">
              <Lock className="w-3 h-3 text-emerald-400" /> Stored 100% locally on your phone (never uploaded)
            </span>
          </div>
          <button
            onClick={() => setShowPhotoModal(true)}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add</span>
          </button>
        </div>

        {photos.length === 0 ? (
          <div className="py-6 text-center text-xs text-slate-500">
            No progress photos saved yet. Private, non-judgmental tracking for posture and recomposition.
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-2 mt-3">
            {photos.map(p => (
              <div key={p.id} className="relative rounded-2xl overflow-hidden border border-slate-800 group aspect-square">
                <img
                  src={p.photoDataUrl}
                  alt={`Progress on ${p.date}`}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-2 text-[10px] text-white">
                  <span className="capitalize font-bold text-sky-300">{p.pose}</span>
                  <span className="text-slate-400 text-[9px]">{p.date}</span>
                </div>
                <button
                  onClick={() => onDeletePhoto(p.id)}
                  className="absolute top-1 right-1 p-1 rounded-full bg-black/60 text-slate-400 hover:text-rose-400 opacity-80 hover:opacity-100"
                  title="Delete photo"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Record Measurement Modal */}
      {showMeasureModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0f172a] border border-slate-800 rounded-3xl w-full max-w-sm p-5 shadow-2xl">
            <h3 className="text-base font-bold text-white mb-3">Record Body Measurements</h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Date</label>
                <input
                  type="date"
                  value={dateInput}
                  onChange={(e) => setDateInput(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-400 block mb-1">Weight (kg)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={weightInput}
                    onChange={(e) => setWeightInput(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-white font-bold"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Waist (cm)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={waistInput}
                    onChange={(e) => setWaistInput(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-emerald-400 font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-400 block mb-1">Chest (cm)</label>
                  <input
                    type="number"
                    step="0.5"
                    placeholder="Optional"
                    value={chestInput}
                    onChange={(e) => setChestInput(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Arms (cm)</label>
                  <input
                    type="number"
                    step="0.5"
                    placeholder="Optional"
                    value={armsInput}
                    onChange={(e) => setArmsInput(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-400 block mb-1">Hips (cm)</label>
                  <input
                    type="number"
                    step="0.5"
                    placeholder="Optional"
                    value={hipsInput}
                    onChange={(e) => setHipsInput(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Thighs (cm)</label>
                  <input
                    type="number"
                    step="0.5"
                    placeholder="Optional"
                    value={thighsInput}
                    onChange={(e) => setThighsInput(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-white"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-2 mt-5">
              <button
                onClick={() => setShowMeasureModal(false)}
                className="flex-1 py-2.5 rounded-xl bg-slate-800 text-xs font-semibold text-slate-300"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveMeasurement}
                className="flex-1 py-2.5 rounded-xl bg-sky-500 text-xs font-bold text-slate-950"
              >
                Save Log
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Photo Modal */}
      {showPhotoModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0f172a] border border-slate-800 rounded-3xl w-full max-w-xs p-5 shadow-2xl">
            <h3 className="text-base font-bold text-white mb-2">Import Progress Photo</h3>
            <p className="text-xs text-slate-400 mb-3">
              Stored securely on your device only.
            </p>

            <div className="space-y-3">
              <div>
                <label className="text-xs text-slate-400 block mb-1">Pose</label>
                <div className="flex gap-1.5">
                  {(['front', 'side', 'back'] as const).map(pose => (
                    <button
                      key={pose}
                      onClick={() => setPhotoPose(pose)}
                      className={`flex-1 py-1.5 rounded-xl text-xs font-bold capitalize border ${
                        photoPose === pose
                          ? 'bg-sky-500 text-slate-950 border-sky-400'
                          : 'bg-slate-900 border-slate-800 text-slate-400'
                      }`}
                    >
                      {pose}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">Select Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="w-full text-xs text-slate-400 file:mr-2 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-slate-800 file:text-slate-200 hover:file:bg-slate-700"
                />
              </div>

              {photoDataUrl && (
                <div className="w-full h-36 rounded-xl overflow-hidden border border-slate-800 mt-2">
                  <img src={photoDataUrl} alt="Preview" className="w-full h-full object-cover" />
                </div>
              )}
            </div>

            <div className="flex gap-2 mt-4">
              <button
                onClick={() => {
                  setPhotoDataUrl('')
                  setShowPhotoModal(false)
                }}
                className="flex-1 py-2.5 rounded-xl bg-slate-800 text-xs font-semibold text-slate-300"
              >
                Cancel
              </button>
              <button
                onClick={handleSavePhoto}
                disabled={!photoDataUrl}
                className="flex-1 py-2.5 rounded-xl bg-sky-500 text-xs font-bold text-slate-950 disabled:opacity-40"
              >
                Save Photo
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
