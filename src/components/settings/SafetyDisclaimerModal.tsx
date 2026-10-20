import React from 'react'
import { X, ShieldAlert, Heart, Activity, AlertTriangle } from 'lucide-react'

interface SafetyDisclaimerModalProps {
  isOpen: boolean
  onClose: () => void
}

export const SafetyDisclaimerModal: React.FC<SafetyDisclaimerModalProps> = ({
  isOpen,
  onClose
}) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-[#0f172a] border-t sm:border border-slate-800 rounded-t-3xl sm:rounded-3xl w-full max-w-lg max-h-[88vh] flex flex-col shadow-2xl overflow-hidden animate-in slide-in-from-bottom-6 duration-200">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between sticky top-0 bg-[#0f172a] z-10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Fitness & Health Disclaimer</h2>
              <p className="text-[11px] text-slate-400">Important safety & medical boundaries</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-4 text-xs text-slate-300 leading-relaxed">
          <div className="p-3.5 rounded-2xl bg-amber-950/30 border border-amber-800/40 text-amber-200 text-xs">
            <strong>General Fitness Guidance Only:</strong> This application is a self-directed exercise tracker and general fitness reference. It does not provide medical care, clinical diagnosis, or individualized physical therapy treatment.
          </div>

          <div className="space-y-3">
            <div className="flex items-start gap-2.5">
              <Heart className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white block">Immediate Stop Signals:</strong>
                If you ever experience sharp or sudden pain, chest tightness, palpitations, dizziness, lightheadedness, nausea, or severe breathing distress, immediately stop exercising and seek prompt medical attention.
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <Activity className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white block">Machine Ergonomics & Staff Assistance:</strong>
                At Anytime Fitness, selectorized machines have adjustable seats, pivot points, and footplates. Always adjust seat height so machine pivot axes align with your joints. Do not hesitate to ask gym staff to demonstrate unfamiliar machines.
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white block">Spot Reduction Myth & Expectations:</strong>
                Abdominal machine crunches strengthen abdominal wall musculature but do not selectively burn belly fat. Body recomposition occurs globally through progressive resistance training, caloric balance, adequate protein, and sleep.
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <ShieldAlert className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white block">Sleep & Auto-Regulation:</strong>
                Progression is based on recovery, not calendar week alone. When sleep is under 6 hours or life stress is elevated, maintain or reduce machine weights rather than forcing progression.
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-[#0f172a]">
          <button
            onClick={onClose}
            className="w-full py-3 rounded-xl bg-sky-500 hover:bg-sky-400 text-xs font-bold text-slate-950 shadow-lg shadow-sky-500/20"
          >
            I Understand & Agree
          </button>
        </div>
      </div>
    </div>
  )
}
