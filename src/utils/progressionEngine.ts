import {
  WorkoutSession,
  DailyActivity,
  Exercise,
  UserRecommendation
} from '../types'

export interface ProgressionEvaluation {
  recommendationType: 'weight_increase' | 'weight_decrease' | 'maintain_weight' | 'recovery_deload' | 'sleep_warning'
  title: string
  reason: string
  suggestedAction: string
  suggestedWeightKg?: number
}

/**
 * Calculates the current 8-week program phase and characteristics based on the active week
 */
export function getProgramPhase(week: number): {
  phaseNumber: number
  phaseName: string
  description: string
  workingSetsGuideline: string
  rirGuideline: string
  focus: string
} {
  if (week <= 2) {
    return {
      phaseNumber: 1,
      phaseName: 'Re-entry & Machine Setup',
      description: 'Establish baseline movement patterns and machine ergonomics. Avoid lifting to failure.',
      workingSetsGuideline: '1–2 working sets per exercise',
      rirGuideline: '3–4 Repetitions in Reserve (RIR)',
      focus: 'Controlled tempos, zero failure, learning seat & pad adjustments.'
    }
  } else if (week <= 4) {
    return {
      phaseNumber: 2,
      phaseName: 'Consistency & Repetition Expansion',
      description: 'Solidify weekly consistency. Focus on reaching the upper rep limit before adding load.',
      workingSetsGuideline: '2 working sets (optional 3rd set on compound machines if recovery allows)',
      rirGuideline: '2–3 Repetitions in Reserve (RIR)',
      focus: 'Building rep capacity toward 12 reps with clean execution.'
    }
  } else if (week <= 6) {
    return {
      phaseNumber: 3,
      phaseName: 'Progressive Overload',
      description: 'Systematic load increases when top repetition targets are met cleanly.',
      workingSetsGuideline: '2–3 working sets for compounds, 2 sets for accessories',
      rirGuideline: '1–2 Repetitions in Reserve (RIR)',
      focus: 'Micro-load increments (1.25–2.5kg for upper body; 2.5–5kg for lower body).'
    }
  } else {
    return {
      phaseNumber: 4,
      phaseName: 'Consolidation & Recovery Review',
      description: 'Lock in strength gains, assess waist and weight recomposition metrics, and consolidate habits.',
      workingSetsGuideline: '2 working sets at solid sustainable loads',
      rirGuideline: '2–3 Repetitions in Reserve (RIR)',
      focus: 'Maintain volume, evaluate body composition shifts, and prepare next cycle.'
    }
  }
}

/**
 * Analyzes exercise performance across recent sessions and recovery indicators to generate deterministic recommendations
 */
export function evaluateExerciseProgression(
  exercise: Exercise,
  pastSessions: WorkoutSession[],
  recentActivities: DailyActivity[],
  currentWeek: number
): ProgressionEvaluation {
  // Check recent sleep recovery first
  const latestActivity = recentActivities[recentActivities.length - 1]
  const avgSleep = recentActivities.length > 0
    ? recentActivities.slice(-3).reduce((acc, a) => acc + (a.sleepHours || 5.5), 0) / Math.min(recentActivities.length, 3)
    : 5.5

  if (avgSleep < 5.8) {
    return {
      recommendationType: 'sleep_warning',
      title: `Sleep Recovery Caution: ${exercise.name}`,
      reason: `Your recorded sleep averaged ${avgSleep.toFixed(1)} hrs over recent nights (under the 7-hour recovery threshold). Under-recovery reduces tendon resilience and neurological readiness.`,
      suggestedAction: `Maintain your current working load (${exercise.defaultWeightKg} kg) and prioritize form quality. Do not increase weight while under-recovered.`
    }
  }

  // Find logged sets for this exercise across recent completed sessions
  const relevantSets = pastSessions
    .filter(s => s.status === 'completed')
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .flatMap(s => {
      const sessEx = s.exercises.find(e => e.exerciseId === exercise.id && !e.skipped)
      return sessEx ? sessEx.sets.filter(st => st.completed && !st.isWarmup) : []
    })

  if (relevantSets.length === 0) {
    return {
      recommendationType: 'maintain_weight',
      title: `Baseline Session: ${exercise.name}`,
      reason: 'No completed session history recorded for this machine yet.',
      suggestedAction: `Start with the baseline target of ${exercise.defaultWeightKg} kg for ${exercise.recommendedSets} sets of ${exercise.recommendedRepsMin}–${exercise.recommendedRepsMax} reps. Keep 3–4 reps in reserve.`,
      suggestedWeightKg: exercise.defaultWeightKg
    }
  }

  // Check the most recent session's working sets
  const recentSessionSets = relevantSets.slice(0, exercise.recommendedSets)
  const allSetsCompleted = recentSessionSets.length >= exercise.recommendedSets
  const maxRepTarget = exercise.recommendedRepsMax
  const minRepTarget = exercise.recommendedRepsMin

  const allHitTopReps = allSetsCompleted && recentSessionSets.every(s => s.actualReps >= maxRepTarget)
  const missedMinReps = recentSessionSets.some(s => s.actualReps < minRepTarget)
  const latestWeight = recentSessionSets[0]?.actualWeightKg || exercise.defaultWeightKg

  // Week 1-2: Re-entry - Do not increase load even if reps are high
  if (currentWeek <= 2) {
    if (allHitTopReps) {
      return {
        recommendationType: 'maintain_weight',
        title: `Technique Consolidation: ${exercise.name}`,
        reason: `You hit ${maxRepTarget} reps on all sets at ${latestWeight} kg! During the Phase 1 Re-entry window (Weeks 1–2), we prioritize ligament and joint conditioning over fast weight increases.`,
        suggestedAction: `Maintain ${latestWeight} kg for one more session to lock in posture and movement groove before advancing in Week 3.`,
        suggestedWeightKg: latestWeight
      }
    }
  }

  // Week 3+: Progressive Overload logic
  if (allHitTopReps) {
    // Check if effort was too close to failure (RPE 9.5+ or RIR 0)
    const highExertion = recentSessionSets.some(s => (s.effortRatingRpe && s.effortRatingRpe >= 9.5) || s.repsInReserve === 0)

    if (highExertion) {
      return {
        recommendationType: 'maintain_weight',
        title: `Form Integrity Check: ${exercise.name}`,
        reason: `You completed all ${maxRepTarget} repetitions at ${latestWeight} kg, but logged maximum effort (RPE 9.5+ / 0 RIR). Progressive overload requires clean form with reps in reserve.`,
        suggestedAction: `Maintain ${latestWeight} kg until you can complete all ${maxRepTarget} reps with at least 1–2 reps in reserve.`,
        suggestedWeightKg: latestWeight
      }
    }

    const increment = exercise.weightIncrementKg || (exercise.category === 'lower' ? 5 : 2.5)
    const nextWeight = latestWeight + increment

    return {
      recommendationType: 'weight_increase',
      title: `Ready for Progression: ${exercise.name}`,
      reason: `You comfortably reached the upper target of ${maxRepTarget} repetitions across all sets at ${latestWeight} kg with clean form and controlled cadence.`,
      suggestedAction: `Increase resistance by ${increment} kg to ${nextWeight} kg. Target ${minRepTarget} repetitions on your next session.`,
      suggestedWeightKg: nextWeight
    }
  }

  if (missedMinReps) {
    return {
      recommendationType: 'maintain_weight',
      title: `Repetition Building: ${exercise.name}`,
      reason: `One or more sets fell below the minimum target of ${minRepTarget} reps at ${latestWeight} kg.`,
      suggestedAction: `Keep resistance at ${latestWeight} kg. Focus on steady breathing and rest 90s between sets until you achieve at least ${minRepTarget} solid repetitions.`,
      suggestedWeightKg: latestWeight
    }
  }

  return {
    recommendationType: 'maintain_weight',
    title: `Steady Progress: ${exercise.name}`,
    reason: `Logged repetitions (${recentSessionSets.map(s => s.actualReps).join(', ')}) fall within the target working window (${minRepTarget}–${maxRepTarget} reps).`,
    suggestedAction: `Maintain ${latestWeight} kg and aim to add 1 more repetition per set next time.`,
    suggestedWeightKg: latestWeight
  }
}

/**
 * Generates actionable recommendations across all program exercises
 */
export function generateAllAdaptiveRecommendations(
  exercises: Exercise[],
  sessions: WorkoutSession[],
  activities: DailyActivity[],
  currentWeek: number
): UserRecommendation[] {
  const recommendations: UserRecommendation[] = []
  const today = new Date().toISOString().split('T')[0]

  for (const ex of exercises) {
    const evalResult = evaluateExerciseProgression(ex, sessions, activities, currentWeek)
    // Only surface weight increases or critical recovery warnings as active notifications
    if (evalResult.recommendationType === 'weight_increase' || evalResult.recommendationType === 'sleep_warning') {
      recommendations.push({
        id: `rec-${ex.id}-${today}`,
        date: today,
        exerciseId: ex.id,
        exerciseName: ex.name,
        type: evalResult.recommendationType,
        title: evalResult.title,
        reason: evalResult.reason,
        suggestedAction: evalResult.suggestedAction,
        status: 'pending',
        createdAt: new Date().toISOString()
      })
    }
  }

  return recommendations
}
