import React, { useState } from 'react'
import {
  X,
  CheckCircle,
  AlertTriangle,
  Shield,
  Sparkles,
  Wind,
  Layers,
  Video,
  ExternalLink,
  Wifi,
  WifiOff,
  Image as ImageIcon
} from 'lucide-react'
import { Exercise } from '../../types'
import { ExerciseVisual } from '../common/ExerciseVisual'

interface ExerciseDetailModalProps {
  exercise: Exercise | null
  isOpen: boolean
  onClose: () => void
  onSubstitute?: () => void
  defaultTab?: 'guide' | 'video'
}

export const ExerciseDetailModal: React.FC<ExerciseDetailModalProps> = ({
  exercise,
  isOpen,
  onClose,
  onSubstitute,
  defaultTab = 'guide'
}) => {
  const [activeTab, setActiveTab] = useState<'guide' | 'video'>(defaultTab)

  if (!isOpen || !exercise) return null

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-[#0f172a] border-t sm:border border-slate-800 rounded-t-3xl sm:rounded-3xl w-full max-w-lg max-h-[92vh] flex flex-col shadow-2xl overflow-hidden animate-in slide-in-from-bottom-6 duration-200">
        {/* Header */}
        <div className="p-4 border-b border-slate-800/80 flex items-center justify-between sticky top-0 bg-[#0f172a]/95 backdrop-blur-md z-10">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-sky-950 text-sky-400 border border-sky-800/60">
                {exercise.primaryMuscle}
              </span>
              <span className="text-[11px] text-slate-400 font-medium">
                {exercise.equipment}
              </span>
            </div>
            <h2 className="text-lg font-bold text-white mt-1 leading-snug">{exercise.name}</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
            aria-label="Close details"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher: Guide & Visual vs Video Demo */}
        <div className="px-4 pt-3 pb-2 bg-[#0f172a] border-b border-slate-800/60 flex gap-2">
          <button
            onClick={() => setActiveTab('guide')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'guide'
                ? 'bg-sky-500 text-slate-950 shadow-md shadow-sky-500/20'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span>Diagram & Instructions</span>
          </button>

          <button
            onClick={() => setActiveTab('video')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'video'
                ? 'bg-sky-500 text-slate-950 shadow-md shadow-sky-500/20'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <Video className="w-3.5 h-3.5" />
            <span>Video Demonstration</span>
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-5 overflow-y-auto space-y-5 text-sm">
          {/* TAB 1: GUIDE & VISUAL DIAGRAM */}
          {activeTab === 'guide' && (
            <>
              {/* Visual Machine Anatomy Diagram (Works 100% Offline) */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                    <Layers className="w-3.5 h-3.5 text-sky-400" />
                    Machine Biomechanical Illustration
                  </span>
                  <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
                    <WifiOff className="w-3 h-3" /> Offline Ready
                  </span>
                </div>
                <ExerciseVisual exerciseId={exercise.id} className="w-full h-48" />
              </div>

              {/* Quick Targets Bar */}
              <div className="grid grid-cols-3 gap-2 p-3 rounded-2xl bg-slate-900 border border-slate-800/80 text-center">
                <div>
                  <span className="text-[10px] text-slate-500 uppercase tracking-wide block">Prescribed</span>
                  <span className="text-base font-bold text-white">{exercise.recommendedSets} sets</span>
                </div>
                <div className="border-x border-slate-800">
                  <span className="text-[10px] text-slate-500 uppercase tracking-wide block">Rep Range</span>
                  <span className="text-base font-bold text-sky-400">
                    {exercise.recommendedRepsMin}–{exercise.recommendedRepsMax}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 uppercase tracking-wide block">Rest Time</span>
                  <span className="text-base font-bold text-slate-300">{exercise.recommendedRestSec}s</span>
                </div>
              </div>

              {/* Video Quick Link Callout */}
              {exercise.media?.videoUrl && (
                <div
                  onClick={() => setActiveTab('video')}
                  className="p-3 rounded-2xl bg-gradient-to-r from-sky-950/50 to-slate-900 border border-sky-800/60 flex items-center justify-between cursor-pointer hover:border-sky-500 transition-all"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center">
                      <Video className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-white block">Watch Video Demonstration</span>
                      <span className="text-[10px] text-slate-400">{exercise.media.videoChannel || 'Form Video Guide'}</span>
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-sky-400">Watch &rarr;</span>
                </div>
              )}

              {/* Machine Setup Instructions */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5 mb-2.5">
                  <Layers className="w-4 h-4 text-sky-400" />
                  Machine Setup & Ergonomics
                </h3>
                <ul className="space-y-2">
                  {exercise.setupInstructions.map((step, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-slate-300 text-xs leading-relaxed">
                      <span className="w-4 h-4 rounded-full bg-slate-800 text-sky-400 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Step-by-Step Execution */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5 mb-2.5">
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  Movement Execution
                </h3>
                <ul className="space-y-2">
                  {exercise.executionInstructions.map((step, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-slate-300 text-xs leading-relaxed">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0 mt-1.5" />
                      <span>{step}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Breathing Cues */}
              <div className="p-3.5 rounded-2xl bg-sky-950/30 border border-sky-800/40">
                <h3 className="text-xs font-bold text-sky-300 flex items-center gap-1.5 mb-1">
                  <Wind className="w-4 h-4 text-sky-400" />
                  Breathing Cue
                </h3>
                <p className="text-xs text-sky-100/90 leading-relaxed">{exercise.breathingCues}</p>
              </div>

              {/* Common Mistakes */}
              {exercise.commonMistakes.length > 0 && (
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5 mb-2">
                    <AlertTriangle className="w-4 h-4 text-amber-400" />
                    Common Technique Mistakes
                  </h3>
                  <ul className="space-y-1.5">
                    {exercise.commonMistakes.map((mistake, idx) => (
                      <li key={idx} className="text-xs text-slate-400 flex items-start gap-2">
                        <span className="text-amber-400 font-bold shrink-0">✕</span>
                        <span>{mistake}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Beginner Modifications */}
              {exercise.beginnerModifications.length > 0 && (
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5 mb-2">
                    <Sparkles className="w-4 h-4 text-cyan-400" />
                    Beginner-Friendly Cues
                  </h3>
                  <ul className="space-y-1.5">
                    {exercise.beginnerModifications.map((tip, idx) => (
                      <li key={idx} className="text-xs text-slate-300 flex items-start gap-2">
                        <span className="text-cyan-400 font-bold shrink-0">✓</span>
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Safety Notes */}
              {exercise.safetyNotes.length > 0 && (
                <div className="p-3.5 rounded-2xl bg-amber-950/30 border border-amber-800/40">
                  <h3 className="text-xs font-bold text-amber-300 flex items-center gap-1.5 mb-1">
                    <Shield className="w-4 h-4 text-amber-400" />
                    Safety Guardrail
                  </h3>
                  {exercise.safetyNotes.map((note, idx) => (
                    <p key={idx} className="text-xs text-amber-100/90 leading-relaxed">
                      {note}
                    </p>
                  ))}
                </div>
              )}
            </>
          )}

          {/* TAB 2: EMBEDDED VIDEO DEMONSTRATION */}
          {activeTab === 'video' && (
            <div className="space-y-4">
              {/* Online streaming disclaimer banner */}
              <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 flex items-start gap-2.5 text-xs text-slate-400">
                <Wifi className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                <span>
                  Video streaming requires an active internet connection. If gym connectivity is weak, the illustration and step-by-step setup in the <strong>Diagram & Instructions</strong> tab are fully available offline.
                </span>
              </div>

              {/* Responsive Video Embed Player */}
              {exercise.media?.videoUrl ? (
                <div className="rounded-2xl overflow-hidden border border-slate-800 bg-black aspect-video relative shadow-2xl">
                  <iframe
                    src={exercise.media.videoUrl}
                    title={exercise.media.videoTitle || `${exercise.name} Demonstration`}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              ) : (
                <div className="p-8 rounded-2xl bg-slate-900 text-center text-slate-500">
                  No video stream registered for this movement.
                </div>
              )}

              {/* Video Title and Coaching Cue Note */}
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-white">
                      {exercise.media?.videoTitle || `${exercise.name} Guide`}
                    </h4>
                    <span className="text-[10px] text-sky-400 font-semibold block mt-0.5">
                      Channel: {exercise.media?.videoChannel || 'Form Video Guide'}
                    </span>
                  </div>

                  {exercise.media?.externalUrl && (
                    <a
                      href={exercise.media.externalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center gap-1 text-[10px] font-semibold"
                    >
                      <span>YouTube</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>

                {exercise.media?.videoNote && (
                  <p className="text-xs text-slate-300 leading-relaxed bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                    💡 <strong>Coaching Cue:</strong> {exercise.media.videoNote}
                  </p>
                )}
              </div>

              {/* Fallback diagram preview */}
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                  Static Biomechanical Reference
                </span>
                <ExerciseVisual exerciseId={exercise.id} className="w-full h-40" />
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-800 bg-[#0f172a] flex items-center justify-between gap-3">
          {onSubstitute && (
            <button
              onClick={onSubstitute}
              className="flex-1 py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 border border-slate-700 transition-colors"
            >
              Substitute Machine
            </button>
          )}
          <button
            onClick={onClose}
            className="flex-1 py-3 px-4 rounded-xl bg-sky-500 hover:bg-sky-400 text-xs font-bold text-slate-950 transition-colors shadow-lg shadow-sky-500/20"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  )
}
