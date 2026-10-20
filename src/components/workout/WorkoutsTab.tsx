import React, { useState } from 'react'
import {
  Calendar,
  Dumbbell,
  BookOpen,
  History,
  Play,
  Search,
  Filter,
  ArrowRightLeft,
  ChevronRight,
  Clock,
  CheckCircle2,
  Layers,
  Sparkles,
  Activity,
  Video
} from 'lucide-react'
import { WorkoutTemplate, Exercise, WorkoutSession } from '../../types'
import { getProgramPhase } from '../../utils/progressionEngine'
import { ExerciseDetailModal } from './ExerciseDetailModal'
import { ExerciseVisual } from '../common/ExerciseVisual'

interface WorkoutsTabProps {
  currentWeek: number
  templates: WorkoutTemplate[]
  exercises: Exercise[]
  pastSessions: WorkoutSession[]
  onStartWorkout: (template: WorkoutTemplate) => void
  onUpdateTemplateDay: (templateId: string, newDayOfWeek: number) => void
  onSetCurrentWeek: (week: number) => void
}

export const WorkoutsTab: React.FC<WorkoutsTabProps> = ({
  currentWeek,
  templates,
  exercises,
  pastSessions,
  onStartWorkout,
  onUpdateTemplateDay,
  onSetCurrentWeek
}) => {
  const [subView, setSubView] = useState<'schedule' | 'exercises' | 'history'>('schedule')
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null)
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  // Move workout modal state
  const [movingTemplate, setMovingTemplate] = useState<WorkoutTemplate | null>(null)
  const [targetDay, setTargetDay] = useState<number>(1)

  const phaseInfo = getProgramPhase(currentWeek)

  // Day of week labels (0 = Sun, 1 = Mon ... 6 = Sat)
  const days = [
    { num: 1, name: 'Monday' },
    { num: 2, name: 'Tuesday' },
    { num: 3, name: 'Wednesday' },
    { num: 4, name: 'Thursday' },
    { num: 5, name: 'Friday' },
    { num: 6, name: 'Saturday' },
    { num: 0, name: 'Sunday' }
  ]

  // Filter exercises
  const filteredExercises = exercises.filter(ex => {
    const matchesCategory = selectedCategory === 'all' || ex.category === selectedCategory
    const matchesSearch =
      ex.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ex.equipment.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ex.targetMuscles.some(m => m.toLowerCase().includes(searchQuery.toLowerCase()))
    return matchesCategory && matchesSearch
  })

  return (
    <div className="space-y-4 pb-24 px-4 pt-3 max-w-lg mx-auto">
      {/* Sub-navigation tabs */}
      <div className="grid grid-cols-3 gap-1 p-1 bg-slate-900 border border-slate-800 rounded-2xl">
        <button
          onClick={() => setSubView('schedule')}
          className={`py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
            subView === 'schedule'
              ? 'bg-sky-500 text-slate-950 shadow-md'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Calendar className="w-3.5 h-3.5" />
          <span>Schedule</span>
        </button>

        <button
          onClick={() => setSubView('exercises')}
          className={`py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
            subView === 'exercises'
              ? 'bg-sky-500 text-slate-950 shadow-md'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>Catalog</span>
        </button>

        <button
          onClick={() => setSubView('history')}
          className={`py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
            subView === 'history'
              ? 'bg-sky-500 text-slate-950 shadow-md'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <History className="w-3.5 h-3.5" />
          <span>History</span>
        </button>
      </div>

      {/* 8-Week Program Phase Header Banner */}
      <div className="p-4 rounded-3xl bg-slate-900 border border-slate-800">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-sky-400 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-sky-400" /> 8-Week Progression Engine
          </span>
          {/* Week Selector */}
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5, 6, 7, 8].map(w => (
              <button
                key={w}
                onClick={() => onSetCurrentWeek(w)}
                className={`w-6 h-6 rounded-lg text-[10px] font-black transition-all ${
                  currentWeek === w
                    ? 'bg-sky-500 text-slate-950 scale-105'
                    : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                }`}
                title={`Select Week ${w}`}
              >
                W{w}
              </button>
            ))}
          </div>
        </div>

        <h3 className="text-base font-black text-white">
          Phase {phaseInfo.phaseNumber}: {phaseInfo.phaseName}
        </h3>
        <p className="text-xs text-slate-400 mt-1 leading-relaxed">{phaseInfo.description}</p>

        <div className="mt-3 pt-2.5 border-t border-slate-800/80 grid grid-cols-2 gap-2 text-[11px]">
          <div>
            <span className="text-slate-500 block">Sets per exercise:</span>
            <span className="text-slate-200 font-semibold">{phaseInfo.workingSetsGuideline}</span>
          </div>
          <div>
            <span className="text-slate-500 block">Effort guideline:</span>
            <span className="text-sky-400 font-semibold">{phaseInfo.rirGuideline}</span>
          </div>
        </div>
      </div>

      {/* VIEW 1: WEEKLY SCHEDULE */}
      {subView === 'schedule' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Weekly Routine (5 Gym Days + 2 Rest)
            </h3>
            <span className="text-[10px] text-slate-500">Tap to start or move</span>
          </div>

          {days.map(d => {
            const template = templates.find(t => t.dayOfWeek === d.num)
            return (
              <div
                key={d.num}
                className={`p-4 rounded-3xl border transition-all ${
                  template?.isRestDay
                    ? 'bg-slate-900/50 border-slate-800/60'
                    : 'bg-slate-900 border-slate-800'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[11px] font-bold text-sky-400 uppercase tracking-wide">
                        {d.name}
                      </span>
                      {template?.isRestDay ? (
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800/50 font-bold">
                          Rest Day
                        </span>
                      ) : (
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-semibold">
                          ~{template?.estimatedDurationMinutes || 55} min
                        </span>
                      )}
                    </div>
                    <h4 className="text-sm font-bold text-white">{template?.name || 'Rest'}</h4>
                    <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">
                      {template?.description || 'Recovery and rest day'}
                    </p>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {template && (
                      <button
                        onClick={() => {
                          setMovingTemplate(template)
                          setTargetDay(template.dayOfWeek)
                        }}
                        className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
                        title="Move to another day"
                        aria-label="Move Day"
                      >
                        <ArrowRightLeft className="w-3.5 h-3.5" />
                      </button>
                    )}
                    {template && !template.isRestDay && (
                      <button
                        onClick={() => onStartWorkout(template)}
                        className="px-3 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 text-xs font-bold flex items-center gap-1 shadow-md shadow-sky-500/20"
                      >
                        <Play className="w-3.5 h-3.5 fill-current" />
                        <span>Start</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Exercises preview pills */}
                {template && template.exercises.length > 0 && (
                  <div className="mt-3 pt-2.5 border-t border-slate-800/60 flex flex-wrap gap-1.5">
                    {template.exercises.map((e, idx) => {
                      const exData = exercises.find(ex => ex.id === e.exerciseId)
                      return (
                        <button
                          key={idx}
                          onClick={() => exData && setSelectedExercise(exData)}
                          className="px-2 py-1 rounded-lg bg-slate-950/80 border border-slate-800 text-[10px] text-slate-300 hover:border-sky-500/50 transition-colors flex items-center gap-1"
                        >
                          <span>{exData?.name || e.exerciseId}</span>
                        </button>
                      )
                    })}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* VIEW 2: EXERCISE CATALOG */}
      {subView === 'exercises' && (
        <div className="space-y-3">
          {/* Search bar */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              placeholder="Search exercise, muscle, or machine..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
            />
          </div>

          {/* Category filter pills */}
          <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {['all', 'upper', 'lower', 'core', 'cardio', 'mobility'].map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap capitalize transition-colors ${
                  selectedCategory === cat
                    ? 'bg-sky-500 text-slate-950'
                    : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Exercise list */}
          <div className="space-y-2.5">
            {filteredExercises.map(ex => (
              <div
                key={ex.id}
                onClick={() => setSelectedExercise(ex)}
                className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 cursor-pointer transition-all flex items-center justify-between gap-3 group"
              >
                <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 border border-slate-800/80 bg-slate-950 relative flex items-center justify-center">
                  {ex.media?.localVideoPath ? (
                    <>
                      <video
                        src={ex.media.localVideoPath}
                        autoPlay
                        muted
                        loop
                        playsInline
                        className="w-full h-full object-cover opacity-85 group-hover:scale-105 transition-transform"
                      />
                      <div className="absolute inset-0 bg-slate-950/30 flex items-center justify-center pointer-events-none">
                        <Play className="w-3.5 h-3.5 fill-white text-white drop-shadow" />
                      </div>
                    </>
                  ) : ex.media?.videoId ? (
                    <>
                      <img
                        src={`https://i.ytimg.com/vi/${ex.media.videoId}/hqdefault.jpg`}
                        alt={ex.name}
                        className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform"
                        loading="lazy"
                        onError={(e) => {
                          ;(e.target as HTMLElement).style.display = 'none'
                        }}
                      />
                      <div className="absolute inset-0 bg-slate-950/40 flex items-center justify-center">
                        <Play className="w-4 h-4 fill-white text-white drop-shadow" />
                      </div>
                    </>
                  ) : (
                    <ExerciseVisual exerciseId={ex.id} className="w-full h-full scale-125" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-sky-950 text-sky-400 border border-sky-800/60">
                      {ex.primaryMuscle}
                    </span>
                    <span className="text-[9px] font-bold text-emerald-400 flex items-center gap-0.5 bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-800/50">
                      <Video className="w-2.5 h-2.5 text-emerald-400" />
                      <span>Offline Reel</span>
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-white truncate">{ex.name}</h4>
                  <p className="text-[10px] text-slate-400 truncate">{ex.equipment}</p>
                  <span className="text-[10px] text-slate-500 mt-0.5 block">
                    {ex.recommendedSets} sets × {ex.recommendedRepsMin}–{ex.recommendedRepsMax} reps • Rest: {ex.recommendedRestSec}s
                  </span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-500 shrink-0 group-hover:text-sky-400 transition-colors" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VIEW 3: WORKOUT HISTORY */}
      {subView === 'history' && (
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 px-1">
            Logged Sessions ({pastSessions.length})
          </h3>

          {pastSessions.length === 0 ? (
            <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 text-center">
              <Dumbbell className="w-10 h-10 text-slate-600 mx-auto mb-2" />
              <h4 className="text-sm font-bold text-slate-300">No completed workouts yet</h4>
              <p className="text-xs text-slate-500 mt-1">
                Completed workout sessions and set logs will appear here. Start your first session from the Schedule tab!
              </p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {pastSessions
                .slice()
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                .map(s => {
                  const durationMin = Math.round(s.durationSeconds / 60)
                  const completedSets = s.exercises.reduce((acc, e) => acc + e.sets.filter(st => st.completed).length, 0)
                  return (
                    <div
                      key={s.id}
                      className="p-4 rounded-2xl bg-slate-900 border border-slate-800"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <span className="text-[10px] font-bold text-sky-400 block">{s.date}</span>
                          <h4 className="text-sm font-bold text-white">{s.templateName}</h4>
                        </div>
                        <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800/60">
                          Completed
                        </span>
                      </div>

                      <div className="mt-2.5 flex items-center gap-4 text-xs text-slate-400">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-slate-500" /> {durationMin} min
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> {completedSets} sets
                        </span>
                        {s.rating && (
                          <>
                            <span>•</span>
                            <span className="text-amber-400 font-bold">★ {s.rating}/5</span>
                          </>
                        )}
                      </div>

                      {s.notes && (
                        <p className="text-xs text-slate-300 italic mt-2 p-2 rounded-xl bg-slate-950 border border-slate-800/80">
                          "{s.notes}"
                        </p>
                      )}
                    </div>
                  )
                })}
            </div>
          )}
        </div>
      )}

      {/* Move Template Modal */}
      {movingTemplate && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0f172a] border border-slate-800 rounded-3xl w-full max-w-xs p-5 shadow-2xl">
            <h3 className="text-sm font-bold text-white mb-2">Move Workout Day</h3>
            <p className="text-xs text-slate-400 mb-3">
              Move <span className="text-white font-semibold">{movingTemplate.name}</span> to:
            </p>
            <div className="space-y-1.5 mb-4">
              {days.map(d => (
                <button
                  key={d.num}
                  onClick={() => setTargetDay(d.num)}
                  className={`w-full p-2.5 rounded-xl text-xs font-semibold flex items-center justify-between border ${
                    targetDay === d.num
                      ? 'bg-sky-500 text-slate-950 border-sky-400 font-bold'
                      : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <span>{d.name}</span>
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setMovingTemplate(null)}
                className="flex-1 py-2.5 rounded-xl bg-slate-800 text-xs font-semibold text-slate-300"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onUpdateTemplateDay(movingTemplate.id, targetDay)
                  setMovingTemplate(null)
                }}
                className="flex-1 py-2.5 rounded-xl bg-sky-500 text-xs font-bold text-slate-950"
              >
                Confirm Move
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Exercise Detail Modal */}
      <ExerciseDetailModal
        isOpen={Boolean(selectedExercise)}
        exercise={selectedExercise}
        onClose={() => setSelectedExercise(null)}
      />
    </div>
  )
}
