import { WorkoutTemplate } from '../types'

export const DEFAULT_TEMPLATES: WorkoutTemplate[] = [
  // --- MONDAY: UPPER BODY A ---
  {
    id: 'workout-upper-a',
    name: 'Workout A: Upper Body A',
    dayOfWeek: 1, // Monday
    category: 'upper',
    phaseWeekRange: [1, 8],
    estimatedDurationMinutes: 55,
    description: 'Horizontal pushing & pulling with vertical overhead & pull emphasis on selectorized machines.',
    warmUp: {
      cardioMinutes: 6,
      cardioType: 'Treadmill easy walk (4.5 km/h, 2% incline) or Stationary Bike (Level 3-4)',
      mobilityDrills: [
        'Arm circles forward & backward (10 reps each)',
        'Chest openers against wall / doorway (30 sec)',
        'Thoracic Cat-Cow / T-spine rotations (6 reps)'
      ],
      practiceSetsNote: '1–2 light practice sets (approx. 50% working weight) on Machine Chest Press before working sets.'
    },
    exercises: [
      {
        exerciseId: 'mach-chest-press',
        order: 1,
        targetSets: 2,
        targetRepsMin: 10,
        targetRepsMax: 12,
        targetRestSec: 90,
        targetWeightKg: 40,
        notes: 'Keep shoulder blades tucked back against the pad. 2-3 reps in reserve.'
      },
      {
        exerciseId: 'mach-seated-row',
        order: 2,
        targetSets: 2,
        targetRepsMin: 10,
        targetRepsMax: 12,
        targetRestSec: 90,
        targetWeightKg: 35,
        notes: 'Squeeze shoulder blades for 1 second at full contraction.'
      },
      {
        exerciseId: 'mach-lat-pulldown',
        order: 3,
        targetSets: 2,
        targetRepsMin: 10,
        targetRepsMax: 12,
        targetRestSec: 85,
        targetWeightKg: 40,
        notes: 'Pull to upper chest collarbone. Smooth controlled 3-second negative.'
      },
      {
        exerciseId: 'mach-shoulder-press',
        order: 4,
        targetSets: 2,
        targetRepsMin: 10,
        targetRepsMax: 12,
        targetRestSec: 85,
        targetWeightKg: 25,
        notes: 'Brace core; avoid hyperextending lower back.'
      },
      {
        exerciseId: 'mach-biceps-curl',
        order: 5,
        targetSets: 2,
        targetRepsMin: 12,
        targetRepsMax: 15,
        targetRestSec: 60,
        targetWeightKg: 20,
        notes: 'Keep elbows firmly planted on pad.'
      },
      {
        exerciseId: 'cable-triceps-pushdown',
        order: 6,
        targetSets: 2,
        targetRepsMin: 12,
        targetRepsMax: 15,
        targetRestSec: 60,
        targetWeightKg: 20,
        notes: 'Elbows pinned to ribcage; full lockout without shoulder swing.'
      }
    ]
  },

  // --- TUESDAY: LOWER BODY A + CORE ---
  {
    id: 'workout-lower-a',
    name: 'Workout B: Lower Body A + Core',
    dayOfWeek: 2, // Tuesday
    category: 'lower',
    phaseWeekRange: [1, 8],
    estimatedDurationMinutes: 55,
    description: 'Quadriceps, hamstrings, calves, and core stability on selectorized & cable stations.',
    warmUp: {
      cardioMinutes: 6,
      cardioType: 'Stationary Bike (cadence 75-80 RPM) or Treadmill walking',
      mobilityDrills: [
        'Bodyweight air squats (10 gentle reps)',
        'Leg swings front-to-back & side-to-side (10 reps each)',
        'Ankle dorsiflexion pulses against wall (10 reps per leg)'
      ],
      practiceSetsNote: '1–2 light practice sets (unloaded sled or 50% working weight) on Leg Press before starting working sets.'
    },
    exercises: [
      {
        exerciseId: 'mach-leg-press',
        order: 1,
        targetSets: 2,
        targetRepsMin: 10,
        targetRepsMax: 12,
        targetRestSec: 105,
        targetWeightKg: 80,
        notes: 'Do NOT lock knees at top. Keep lower back pinned to backrest.'
      },
      {
        exerciseId: 'mach-seated-leg-curl',
        order: 2,
        targetSets: 2,
        targetRepsMin: 10,
        targetRepsMax: 15,
        targetRestSec: 75,
        targetWeightKg: 35,
        notes: 'Lap pad locked firmly over thighs; hold 1-second squeeze.'
      },
      {
        exerciseId: 'mach-leg-extension',
        order: 3,
        targetSets: 2,
        targetRepsMin: 12,
        targetRepsMax: 15,
        targetRestSec: 70,
        targetWeightKg: 35,
        notes: 'Controlled tempo. Squeeze quads for 1 second at top.'
      },
      {
        exerciseId: 'mach-calf-raise',
        order: 4,
        targetSets: 2,
        targetRepsMin: 12,
        targetRepsMax: 15,
        targetRestSec: 60,
        targetWeightKg: 40,
        notes: 'Full deep stretch at bottom for 1 full second.'
      },
      {
        exerciseId: 'mach-ab-crunch',
        order: 5,
        targetSets: 2,
        targetRepsMin: 12,
        targetRepsMax: 15,
        targetRestSec: 60,
        targetWeightKg: 25,
        notes: 'Curl ribcage downward toward pelvis. Exhale on contraction.'
      },
      {
        exerciseId: 'cable-pallof-press',
        order: 6,
        targetSets: 2,
        targetRepsMin: 10,
        targetRepsMax: 10,
        targetRestSec: 50,
        targetWeightKg: 10,
        notes: '10 reps each side. Hold extended position for 2 full seconds.'
      }
    ]
  },

  // --- WEDNESDAY: CARDIO + MOBILITY ---
  {
    id: 'workout-cardio-mobility',
    name: 'Workout C: Cardio + Mobility',
    dayOfWeek: 3, // Wednesday
    category: 'cardio_mobility',
    phaseWeekRange: [1, 8],
    estimatedDurationMinutes: 40,
    description: 'Active recovery session to enhance cardiovascular baseline and joint health without fatigue.',
    warmUp: {
      cardioMinutes: 3,
      cardioType: 'Slow easy walking warmup',
      mobilityDrills: ['Gentle shoulder rolls', 'Deep diaphragmatic breathing'],
      practiceSetsNote: 'No heavy weights today. Pure recovery and joint restoration.'
    },
    exercises: [
      {
        exerciseId: 'cardio-treadmill',
        order: 1,
        targetSets: 1,
        targetRepsMin: 20,
        targetRepsMax: 30, // minutes
        targetRestSec: 0,
        targetWeightKg: 0,
        notes: 'Incline brisk walk (4.5–5.0 km/h, 2–3% incline) or stationary bike at conversation pace.'
      },
      {
        exerciseId: 'mobility-hips',
        order: 2,
        targetSets: 2,
        targetRepsMin: 30,
        targetRepsMax: 45, // seconds
        targetRestSec: 15,
        targetWeightKg: 0,
        notes: '90/90 stretch & half-kneeling hip flexor opener.'
      },
      {
        exerciseId: 'mobility-ankles',
        order: 3,
        targetSets: 2,
        targetRepsMin: 10,
        targetRepsMax: 12, // pulses
        targetRestSec: 15,
        targetWeightKg: 0,
        notes: 'Ankle wall mobilization pulses.'
      },
      {
        exerciseId: 'mobility-spine',
        order: 4,
        targetSets: 2,
        targetRepsMin: 6,
        targetRepsMax: 8,
        targetRestSec: 15,
        targetWeightKg: 0,
        notes: 'Cat-Cow and Thoracic rotations for upper spine & chest.'
      }
    ]
  },

  // --- THURSDAY: UPPER BODY B ---
  {
    id: 'workout-upper-b',
    name: 'Workout D: Upper Body B',
    dayOfWeek: 4, // Thursday
    category: 'upper',
    phaseWeekRange: [1, 8],
    estimatedDurationMinutes: 55,
    description: 'Upper chest angle, neutral lats, rear delts, side delts, and arms.',
    warmUp: {
      cardioMinutes: 6,
      cardioType: 'Treadmill walking or stationary bike',
      mobilityDrills: [
        'Band or bodyweight chest expansion',
        'Wall slide overhead reaches (10 reps)',
        'Shoulder circles'
      ],
      practiceSetsNote: '1–2 light practice sets on Incline Chest Press Machine before working sets.'
    },
    exercises: [
      {
        exerciseId: 'mach-incline-chest-press',
        order: 1,
        targetSets: 2,
        targetRepsMin: 10,
        targetRepsMax: 12,
        targetRestSec: 90,
        targetWeightKg: 35,
        notes: 'Upper chest focus. Smooth controlled descent.'
      },
      {
        exerciseId: 'mach-neutral-lat-pulldown',
        order: 2,
        targetSets: 2,
        targetRepsMin: 10,
        targetRepsMax: 12,
        targetRestSec: 90,
        targetWeightKg: 40,
        notes: 'Neutral grip protects shoulders and emphasizes mid/lower lats.'
      },
      {
        exerciseId: 'mach-chest-supported-row',
        order: 3,
        targetSets: 2,
        targetRepsMin: 10,
        targetRepsMax: 12,
        targetRestSec: 80,
        targetWeightKg: 30,
        notes: 'Chest firmly against pad; pull elbows back smoothly.'
      },
      {
        exerciseId: 'mach-reverse-pec-deck',
        order: 4,
        targetSets: 2,
        targetRepsMin: 12,
        targetRepsMax: 15,
        targetRestSec: 70,
        targetWeightKg: 25,
        notes: 'Slight elbow bend locked in place. Feel rear deltoids burn.'
      },
      {
        exerciseId: 'mach-lateral-raise',
        order: 5,
        targetSets: 2,
        targetRepsMin: 12,
        targetRepsMax: 15,
        targetRestSec: 60,
        targetWeightKg: 20,
        notes: 'Lead with elbows to parallel. Controlled negative.'
      },
      {
        exerciseId: 'mach-biceps-curl',
        order: 6,
        targetSets: 2,
        targetRepsMin: 12,
        targetRepsMax: 15,
        targetRestSec: 60,
        targetWeightKg: 20,
        notes: 'Finish biceps with strict form; avoid swaying.'
      }
    ]
  },

  // --- FRIDAY: LOWER BODY B + CORE ---
  {
    id: 'workout-lower-b',
    name: 'Workout E: Lower Body B + Core',
    dayOfWeek: 5, // Friday
    category: 'lower',
    phaseWeekRange: [1, 8],
    estimatedDurationMinutes: 55,
    description: 'Hack squat, posterior chain glute drive, hamstrings, and anti-rotation core.',
    warmUp: {
      cardioMinutes: 6,
      cardioType: 'Stationary Bike or gentle Treadmill walk',
      mobilityDrills: [
        'Hip 90/90 rotations',
        'Glute bridge activations on mat (10 reps)',
        'Ankle dorsiflexion pulses'
      ],
      practiceSetsNote: '1–2 light practice sets on Hack Squat Machine before working sets.'
    },
    exercises: [
      {
        exerciseId: 'mach-hack-squat',
        order: 1,
        targetSets: 2,
        targetRepsMin: 10,
        targetRepsMax: 12,
        targetRestSec: 105,
        targetWeightKg: 40,
        notes: 'Smooth descent to 90 degrees. Never lock knees at top.'
      },
      {
        exerciseId: 'mach-seated-leg-curl',
        order: 2,
        targetSets: 2,
        targetRepsMin: 10,
        targetRepsMax: 15,
        targetRestSec: 75,
        targetWeightKg: 35,
        notes: 'Thigh pad snug; curl heels firmly under seat.'
      },
      {
        exerciseId: 'mach-glute-drive',
        order: 3,
        targetSets: 2,
        targetRepsMin: 10,
        targetRepsMax: 12,
        targetRestSec: 90,
        targetWeightKg: 30,
        notes: 'Drive through heels. 1-second pause at top hip extension.'
      },
      {
        exerciseId: 'mach-leg-extension',
        order: 4,
        targetSets: 2,
        targetRepsMin: 12,
        targetRepsMax: 15,
        targetRestSec: 70,
        targetWeightKg: 35,
        notes: 'Controlled isolation for quadriceps.'
      },
      {
        exerciseId: 'mach-ab-crunch',
        order: 5,
        targetSets: 2,
        targetRepsMin: 12,
        targetRepsMax: 15,
        targetRestSec: 60,
        targetWeightKg: 25,
        notes: 'Curl ribcage down toward navel. 1s pause.'
      },
      {
        exerciseId: 'cable-pallof-press',
        order: 6,
        targetSets: 2,
        targetRepsMin: 10,
        targetRepsMax: 10,
        targetRestSec: 50,
        targetWeightKg: 10,
        notes: '10 reps each side; fight the rotation with core braced.'
      }
    ]
  },

  // --- SATURDAY: REST OR OPTIONAL WALKING ---
  {
    id: 'workout-rest-sat',
    name: 'Saturday: Rest or Optional Easy Walking',
    dayOfWeek: 6, // Saturday
    category: 'rest',
    phaseWeekRange: [1, 8],
    estimatedDurationMinutes: 30,
    isRestDay: true,
    description: 'Prioritize physiological recovery. Take an easy outdoor stroll (3,000–5,000 steps) or relax completely.',
    warmUp: {
      cardioMinutes: 0,
      cardioType: 'None needed',
      mobilityDrills: ['Gentle stretching if desired'],
      practiceSetsNote: 'No gym workout needed. Rest and recharge.'
    },
    exercises: []
  },

  // --- SUNDAY: FULL REST ---
  {
    id: 'workout-rest-sun',
    name: 'Sunday: Full Rest & Recovery',
    dayOfWeek: 0, // Sunday
    category: 'rest',
    phaseWeekRange: [1, 8],
    estimatedDurationMinutes: 0,
    isRestDay: true,
    description: 'Complete recovery day. Focus on adequate sleep, protein intake, and mental replenishment before Week kicks off Monday.',
    warmUp: {
      cardioMinutes: 0,
      cardioType: 'None',
      mobilityDrills: ['Optional relaxation'],
      practiceSetsNote: 'Prepare gym bag and mindset for Monday Upper Body A.'
    },
    exercises: []
  }
]
