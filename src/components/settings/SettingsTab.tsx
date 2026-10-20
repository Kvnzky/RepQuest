import React, { useState } from 'react'
import {
  Settings as SettingsIcon,
  User,
  Bell,
  Timer,
  Download,
  Upload,
  RotateCcw,
  Trash2,
  ShieldCheck,
  Palette,
  Check,
  AlertTriangle,
  Sparkles
} from 'lucide-react'
import {
  UserProfile,
  AppSettings,
  ReminderSetting
} from '../../types'
import { NAME_SUGGESTIONS } from '../../config/branding'
import { exportDatabaseToJson, importDatabaseFromJson } from '../../db'
import { SafetyDisclaimerModal } from './SafetyDisclaimerModal'

interface SettingsTabProps {
  userProfile: UserProfile
  appSettings: AppSettings
  reminders: ReminderSetting[]
  onUpdateProfile: (updatedProfile: UserProfile) => void
  onUpdateSettings: (updatedSettings: AppSettings) => void
  onToggleReminder: (reminderId: string, enabled: boolean) => void
  onResetProgram: () => void
  onClearAllData: () => void
}

export const SettingsTab: React.FC<SettingsTabProps> = ({
  userProfile,
  appSettings,
  reminders,
  onUpdateProfile,
  onUpdateSettings,
  onToggleReminder,
  onResetProgram,
  onClearAllData
}) => {
  const [profileForm, setProfileForm] = useState<UserProfile>(userProfile)
  const [settingsForm, setSettingsForm] = useState<AppSettings>(appSettings)
  const [showDisclaimer, setShowDisclaimer] = useState<boolean>(false)

  // Confirmation modals
  const [showResetConfirm, setShowResetConfirm] = useState<boolean>(false)
  const [showClearConfirm, setShowClearConfirm] = useState<boolean>(false)
  const [importStatus, setImportStatus] = useState<{ message: string; isError?: boolean } | null>(null)

  // Save profile changes
  const handleSaveProfile = () => {
    onUpdateProfile({
      ...profileForm,
      updatedAt: new Date().toISOString()
    })
  }

  // Save settings changes
  const handleSaveSettings = (newSettings?: Partial<AppSettings>) => {
    const updated = {
      ...settingsForm,
      ...(newSettings || {}),
      updatedAt: new Date().toISOString()
    }
    setSettingsForm(updated)
    onUpdateSettings(updated)
  }

  // Export JSON file
  const handleExportData = async () => {
    try {
      const json = await exportDatabaseToJson()
      const blob = new Blob([json], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
      a.href = url
      a.download = `repquest-gym-backup-${timestamp}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (err) {
      alert('Export failed: ' + String(err))
    }
  }

  // Import JSON file
  const handleImportFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = async (event) => {
      const content = event.target?.result as string
      if (!content) return
      const result = await importDatabaseFromJson(content, 'replace')
      if (result.success) {
        setImportStatus({ message: 'Backup restored successfully! Refreshing view...' })
        setTimeout(() => window.location.reload(), 1200)
      } else {
        setImportStatus({ message: result.message, isError: true })
      }
    }
    reader.readAsText(file)
  }

  // Request browser notification permission only when enabled
  const handleReminderToggleWithPermission = async (reminderId: string, currentEnabled: boolean) => {
    const nextState = !currentEnabled
    if (nextState && 'Notification' in window && Notification.permission !== 'granted') {
      try {
        await Notification.requestPermission()
      } catch {
        // Notification permission rejected
      }
    }
    onToggleReminder(reminderId, nextState)
  }

  return (
    <div className="space-y-4 pb-24 px-4 pt-3 max-w-lg mx-auto">
      {/* Header */}
      <div>
        <h2 className="text-xl font-black text-white tracking-tight">App & Profile Settings</h2>
        <p className="text-xs text-slate-400">Configure your training companion and preferences</p>
      </div>

      {/* 1. App Branding & Name Selection */}
      <div className="p-4 rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
        <div className="flex items-center gap-2">
          <Palette className="w-4 h-4 text-sky-400" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
            App Name & Branding
          </h3>
        </div>

        <div className="space-y-2">
          <label className="text-xs text-slate-400 block">Curated Name Suggestions</label>
          <div className="space-y-1.5">
            {NAME_SUGGESTIONS.map(sug => {
              const isSelected = settingsForm.appName === sug.name
              return (
                <div
                  key={sug.name}
                  onClick={() => {
                    handleSaveSettings({ appName: sug.name })
                  }}
                  className={`p-3 rounded-2xl border cursor-pointer transition-all flex items-start justify-between ${
                    isSelected
                      ? 'bg-sky-950/70 border-sky-400 ring-1 ring-sky-400'
                      : 'bg-slate-950/80 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white">{sug.name}</span>
                      {sug.name === 'RepQuest' && (
                        <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.2 rounded bg-sky-500/20 text-sky-400 border border-sky-500/40">
                          Recommended
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-slate-400 mt-0.5 block">{sug.tagline}</span>
                    <span className="text-[10px] text-slate-500 mt-0.5 block">{sug.description}</span>
                  </div>
                  {isSelected && <Check className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />}
                </div>
              )
            })}
          </div>

          <div className="pt-2">
            <label className="text-xs text-slate-400 block mb-1">Custom App Title</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={settingsForm.appName}
                onChange={(e) => setSettingsForm({ ...settingsForm, appName: e.target.value })}
                className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-500"
              />
              <button
                onClick={() => handleSaveSettings({ appName: settingsForm.appName })}
                className="px-4 py-2 rounded-xl bg-sky-500 text-slate-950 text-xs font-bold"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 2. User Profile Editor */}
      <div className="p-4 rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
        <div className="flex items-center gap-2">
          <User className="w-4 h-4 text-sky-400" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
            User Profile & Goals
          </h3>
        </div>

        <div className="space-y-3 text-xs">
          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="text-slate-400 block mb-1">Age</label>
              <input
                type="number"
                value={profileForm.age}
                onChange={(e) => setProfileForm({ ...profileForm, age: parseInt(e.target.value) || 38 })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
              />
            </div>
            <div>
              <label className="text-slate-400 block mb-1">Height (cm)</label>
              <input
                type="number"
                value={profileForm.heightCm}
                onChange={(e) => setProfileForm({ ...profileForm, heightCm: parseInt(e.target.value) || 170 })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="text-slate-400 block mb-1">Current Weight (kg)</label>
              <input
                type="number"
                step="0.1"
                value={profileForm.currentWeightKg}
                onChange={(e) => setProfileForm({ ...profileForm, currentWeightKg: parseFloat(e.target.value) || 78 })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white font-bold"
              />
            </div>
            <div>
              <label className="text-slate-400 block mb-1">Target Weight (kg)</label>
              <input
                type="number"
                step="0.1"
                value={profileForm.targetWeightKg || 72}
                onChange={(e) => setProfileForm({ ...profileForm, targetWeightKg: parseFloat(e.target.value) || 72 })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-emerald-400 font-bold"
              />
            </div>
          </div>

          <div>
            <label className="text-slate-400 block mb-1">Primary Fitness Goal</label>
            <input
              type="text"
              value={profileForm.mainGoal}
              onChange={(e) => setProfileForm({ ...profileForm, mainGoal: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="text-slate-400 block mb-1">Training Frequency</label>
              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 font-semibold">
                {profileForm.trainingAvailabilityDays} gym visits / week
              </div>
            </div>
            <div>
              <label className="text-slate-400 block mb-1">Session Target</label>
              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 font-semibold">
                ~{profileForm.maxSessionDurationMinutes} minutes max
              </div>
            </div>
          </div>

          <div>
            <label className="text-slate-400 block mb-1">Average Sleep Hours</label>
            <input
              type="number"
              step="0.5"
              value={profileForm.averageSleepHours}
              onChange={(e) => setProfileForm({ ...profileForm, averageSleepHours: parseFloat(e.target.value) || 5.5 })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
            />
          </div>

          <button
            onClick={handleSaveProfile}
            className="w-full py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs"
          >
            Save Profile Updates
          </button>
        </div>
      </div>

      {/* 3. Rest Timer & Audio Behavior */}
      <div className="p-4 rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
        <div className="flex items-center gap-2">
          <Timer className="w-4 h-4 text-sky-400" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
            Rest Timer & Audio Preferences
          </h3>
        </div>

        <div className="space-y-2.5 text-xs">
          {/* Auto Start Toggle */}
          <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
            <div>
              <span className="font-semibold text-white block">Auto-Start Rest Timer</span>
              <span className="text-[10px] text-slate-400">Begins countdown immediately when a set is logged</span>
            </div>
            <button
              onClick={() => handleSaveSettings({ autoTimerStart: !settingsForm.autoTimerStart })}
              className={`w-12 h-6 rounded-full transition-colors relative p-0.5 ${
                settingsForm.autoTimerStart ? 'bg-sky-500' : 'bg-slate-800'
              }`}
            >
              <div className={`w-5 h-5 rounded-full bg-white transition-transform ${
                settingsForm.autoTimerStart ? 'translate-x-6' : 'translate-x-0'
              }`} />
            </button>
          </div>

          {/* Audio Chime Toggle */}
          <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
            <div>
              <span className="font-semibold text-white block">Synthesized Audio Bell</span>
              <span className="text-[10px] text-slate-400">Web Audio synthesis chime (works 100% offline)</span>
            </div>
            <button
              onClick={() => handleSaveSettings({ timerSoundEnabled: !settingsForm.timerSoundEnabled })}
              className={`w-12 h-6 rounded-full transition-colors relative p-0.5 ${
                settingsForm.timerSoundEnabled ? 'bg-sky-500' : 'bg-slate-800'
              }`}
            >
              <div className={`w-5 h-5 rounded-full bg-white transition-transform ${
                settingsForm.timerSoundEnabled ? 'translate-x-6' : 'translate-x-0'
              }`} />
            </button>
          </div>

          {/* Vibration Toggle */}
          <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
            <div>
              <span className="font-semibold text-white block">Vibration Alerts</span>
              <span className="text-[10px] text-slate-400">Haptic vibration pulses when supported by device</span>
            </div>
            <button
              onClick={() => handleSaveSettings({ timerVibrateEnabled: !settingsForm.timerVibrateEnabled })}
              className={`w-12 h-6 rounded-full transition-colors relative p-0.5 ${
                settingsForm.timerVibrateEnabled ? 'bg-sky-500' : 'bg-slate-800'
              }`}
            >
              <div className={`w-5 h-5 rounded-full bg-white transition-transform ${
                settingsForm.timerVibrateEnabled ? 'translate-x-6' : 'translate-x-0'
              }`} />
            </button>
          </div>
        </div>
      </div>

      {/* 4. Local Reminders Management */}
      <div className="p-4 rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
        <div className="flex items-center gap-2">
          <Bell className="w-4 h-4 text-sky-400" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
            Habit & Workout Reminders
          </h3>
        </div>

        <div className="space-y-2">
          {reminders.map(rem => (
            <div
              key={rem.id}
              className="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs"
            >
              <div>
                <span className="font-semibold text-white block">{rem.title}</span>
                <span className="text-[10px] text-slate-400">Scheduled for {rem.time}</span>
              </div>
              <button
                onClick={() => handleReminderToggleWithPermission(rem.id, rem.enabled)}
                className={`w-11 h-6 rounded-full transition-colors relative p-0.5 ${
                  rem.enabled ? 'bg-sky-500' : 'bg-slate-800'
                }`}
              >
                <div className={`w-5 h-5 rounded-full bg-white transition-transform ${
                  rem.enabled ? 'translate-x-5' : 'translate-x-0'
                }`} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* 5. Data Backup, Export & Import */}
      <div className="p-4 rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
        <div className="flex items-center gap-2">
          <Download className="w-4 h-4 text-sky-400" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
            Offline Data Management
          </h3>
        </div>

        <p className="text-xs text-slate-400 leading-relaxed">
          All your workout logs, body measurements, nutrition, and private photos are stored in offline IndexedDB storage on this device.
        </p>

        {importStatus && (
          <div className={`p-3 rounded-xl text-xs font-semibold ${
            importStatus.isError ? 'bg-rose-950 text-rose-300 border border-rose-800' : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
          }`}>
            {importStatus.message}
          </div>
        )}

        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={handleExportData}
            className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 flex items-center justify-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5 text-sky-400" />
            <span>Export Backup</span>
          </button>

          <label className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 flex items-center justify-center gap-1.5 cursor-pointer">
            <Upload className="w-3.5 h-3.5 text-emerald-400" />
            <span>Import Backup</span>
            <input
              type="file"
              accept=".json,application/json"
              onChange={handleImportFile}
              className="hidden"
            />
          </label>
        </div>
      </div>

      {/* 6. Program Reset and Danger Zone */}
      <div className="p-4 rounded-3xl bg-slate-900 border border-rose-950/40 space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-rose-400">
          Program Reset & Danger Zone
        </h3>

        <div className="space-y-2">
          <button
            onClick={() => setShowResetConfirm(true)}
            className="w-full py-2.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 text-slate-300 text-xs font-semibold flex items-center justify-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
            <span>Reset 8-Week Program to Factory Default</span>
          </button>

          <button
            onClick={() => setShowClearConfirm(true)}
            className="w-full py-2.5 rounded-xl bg-rose-950/40 hover:bg-rose-950/70 border border-rose-800/60 text-rose-300 text-xs font-bold flex items-center justify-center gap-1.5"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Delete All Stored Local Data</span>
          </button>
        </div>
      </div>

      {/* 7. Safety Disclaimer link & PWA Version */}
      <div className="pt-2 text-center space-y-2">
        <button
          onClick={() => setShowDisclaimer(true)}
          className="text-xs text-slate-400 hover:text-slate-200 flex items-center justify-center gap-1 mx-auto"
        >
          <ShieldCheck className="w-3.5 h-3.5 text-sky-400" />
          <span>View Safety & Medical Disclaimer</span>
        </button>
        <p className="text-[11px] text-slate-600">
          {settingsForm.appName} v1.0.0 • Offline-First PWA • Anytime Fitness Companion
        </p>
      </div>

      {/* Reset Confirmation Modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0f172a] border border-slate-800 rounded-3xl w-full max-w-xs p-5 shadow-2xl">
            <h3 className="text-base font-bold text-white mb-2">Reset Workout Program?</h3>
            <p className="text-xs text-slate-400 mb-4 leading-relaxed">
              This resets the 8-week workout templates and exercise catalog to factory settings. Your logged workout sessions and measurements will be safely kept.
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="flex-1 py-2.5 rounded-xl bg-slate-800 text-xs font-semibold text-slate-300"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onResetProgram()
                  setShowResetConfirm(false)
                }}
                className="flex-1 py-2.5 rounded-xl bg-amber-500 text-xs font-bold text-slate-950"
              >
                Reset Plan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Clear All Data Confirmation Modal */}
      {showClearConfirm && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0f172a] border border-rose-900 rounded-3xl w-full max-w-xs p-5 shadow-2xl">
            <div className="w-10 h-10 rounded-2xl bg-rose-500/20 text-rose-400 flex items-center justify-center mb-3">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white mb-1">Delete All Local Data?</h3>
            <p className="text-xs text-slate-400 mb-4 leading-relaxed">
              This will permanently delete all workout history, logged sets, photos, measurements, and custom foods from this device's storage. This action cannot be undone.
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setShowClearConfirm(false)}
                className="flex-1 py-2.5 rounded-xl bg-slate-800 text-xs font-semibold text-slate-300"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onClearAllData()
                  setShowClearConfirm(false)
                }}
                className="flex-1 py-2.5 rounded-xl bg-rose-500 text-xs font-bold text-white shadow-lg shadow-rose-500/20"
              >
                Delete All
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Safety Disclaimer Modal */}
      <SafetyDisclaimerModal
        isOpen={showDisclaimer}
        onClose={() => setShowDisclaimer(false)}
      />
    </div>
  )
}
