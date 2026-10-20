export interface BrandingConfig {
  appName: string
  shortName: string
  tagline: string
  subtitle: string
  accentColor: string
  theme: 'dark' | 'light'
}

export const NAME_SUGGESTIONS = [
  {
    name: 'RepQuest',
    tagline: 'Your Personal Gym Quest & Recomposition Companion',
    description: 'Frames every workout and rep as a milestone quest toward body recomposition and steady progression.'
  },
  {
    name: 'Kinetiq',
    tagline: 'Precision Gym Companion & Recomposition Engine',
    description: 'Blends kinetic motion with intelligent tracking. Modern, high-performance, and memorable.'
  },
  {
    name: 'FormaFit',
    tagline: 'Machine Precision & Structured Progression',
    description: 'Emphasizes correct machine posture, controlled movement, and biomechanical form.'
  },
  {
    name: 'PulseRecomp',
    tagline: 'Targeted Body Recomposition Tracker',
    description: 'Focuses directly on fat reduction, muscle preservation, and workout rhythm.'
  },
  {
    name: 'IronPace',
    tagline: 'Disciplined Progression for Anytime Fitness',
    description: 'Evokes structured, unhurried strength development with steady progressive overload.'
  }
] as const

export const DEFAULT_BRANDING: BrandingConfig = {
  appName: 'RepQuest',
  shortName: 'RepQuest',
  tagline: 'Personal Gym Companion',
  subtitle: 'Anytime Fitness 8-Week Recomposition & Progression Engine',
  accentColor: '#38bdf8', // Vibrant Sky / Cyan
  theme: 'dark'
}
