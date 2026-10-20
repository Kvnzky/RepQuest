class AudioTimerService {
  private audioCtx: AudioContext | null = null

  private getAudioContext(): AudioContext | null {
    if (typeof window === 'undefined') return null
    if (!this.audioCtx) {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
      if (AudioCtxClass) {
        this.audioCtx = new AudioCtxClass()
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume().catch(() => {})
    }
    return this.audioCtx
  }

  /**
   * Short subtle tick for countdown (3, 2, 1)
   */
  playWarningTick(): void {
    try {
      const ctx = this.getAudioContext()
      if (!ctx) return
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()

      osc.type = 'sine'
      osc.frequency.setValueAtTime(600, ctx.currentTime)
      gain.gain.setValueAtTime(0.08, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1)

      osc.connect(gain)
      gain.connect(ctx.destination)

      osc.start()
      osc.stop(ctx.currentTime + 0.1)
    } catch {
      // Audio might be blocked by browser policy until user gesture
    }
  }

  /**
   * Resonant boxing bell / double chime when rest timer completes
   */
  playTimerCompleteChime(): void {
    try {
      const ctx = this.getAudioContext()
      if (!ctx) return
      const now = ctx.currentTime

      // First chime tone (high frequency bell chime)
      const osc1 = ctx.createOscillator()
      const gain1 = ctx.createGain()
      osc1.type = 'triangle'
      osc1.frequency.setValueAtTime(880, now) // A5
      gain1.gain.setValueAtTime(0.25, now)
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.6)
      osc1.connect(gain1)
      gain1.connect(ctx.destination)
      osc1.start(now)
      osc1.stop(now + 0.6)

      // Second harmonic chime tone slightly delayed
      const osc2 = ctx.createOscillator()
      const gain2 = ctx.createGain()
      osc2.type = 'sine'
      osc2.frequency.setValueAtTime(1174.66, now + 0.15) // D6
      gain2.gain.setValueAtTime(0.3, now + 0.15)
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.9)
      osc2.connect(gain2)
      gain2.connect(ctx.destination)
      osc2.start(now + 0.15)
      osc2.stop(now + 0.9)
    } catch {
      // Audio playback fallback
    }
  }

  /**
   * Set completion subtle confirmation beep
   */
  playSetLoggedTone(): void {
    try {
      const ctx = this.getAudioContext()
      if (!ctx) return
      const now = ctx.currentTime

      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'sine'
      osc.frequency.setValueAtTime(523.25, now) // C5
      osc.frequency.exponentialRampToValueAtTime(659.25, now + 0.12) // E5
      gain.gain.setValueAtTime(0.12, now)
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2)
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start(now)
      osc.stop(now + 0.2)
    } catch {
      // Audio playback fallback
    }
  }

  /**
   * Device vibration feedback when supported
   */
  vibrate(pattern: number | number[] = [200, 100, 200]): void {
    if (typeof window !== 'undefined' && 'navigator' in window && 'vibrate' in navigator) {
      try {
        navigator.vibrate(pattern)
      } catch {
        // Vibrate not supported or disabled by OS
      }
    }
  }
}

export const audioTimer = new AudioTimerService()
