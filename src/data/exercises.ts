import { Exercise } from '../types'

export const DEFAULT_EXERCISES: Exercise[] = [
  // --- UPPER BODY ---
  {
    id: 'mach-chest-press',
    name: 'Machine Chest Press',
    category: 'upper',
    targetMuscles: ['Pectoralis Major', 'Anterior Deltoid', 'Triceps'],
    primaryMuscle: 'Chest',
    equipment: 'Selectorized Chest Press Machine',
    setupInstructions: [
      'Adjust seat height so handles align directly across mid-chest (nipple line).',
      'Plant feet flat and firm on the floor, shoulder-width apart.',
      'Slightly arch lower back naturally while keeping shoulder blades pinched back against pad.',
      'Grip handles evenly with neutral wrists (knuckles forward, not bent back).'
    ],
    executionInstructions: [
      'Inhale to brace core before pushing.',
      'Press handles forward smoothly until arms are extended, without locking elbows.',
      'Pause for 1 second at full chest contraction.',
      'Lower weight stack slowly under control over 2–3 seconds until hands are just outside chest.'
    ],
    breathingCues: 'Exhale during the press; inhale deeply as you return weights.',
    recommendedSets: 2,
    recommendedRepsMin: 10,
    recommendedRepsMax: 12,
    recommendedRestSec: 90,
    defaultWeightKg: 40,
    weightIncrementKg: 2.5,
    commonMistakes: [
      'Setting seat too low so elbows flare higher than shoulders (impingement risk).',
      'Bouncing the weight stack at the bottom.',
      'Rounding shoulders forward off the backrest at full extension.'
    ],
    beginnerModifications: [
      'Start with a lighter pin setting to master elbow angle (approx. 45-60 degrees from torso).',
      'Use single pin increment or add-on 1.25kg micro-plate if available.'
    ],
    safetyNotes: [
      'Never allow the handles to overstretch your shoulders behind the torso plane if you feel anterior shoulder strain.'
    ],
    alternativeExerciseIds: ['mach-incline-chest-press', 'cable-pallof-press'],
    tags: ['upper', 'chest', 'compound', 'machine']
  },
  {
    id: 'mach-incline-chest-press',
    name: 'Incline Chest Press Machine',
    category: 'upper',
    targetMuscles: ['Clavicular Pectoralis (Upper Chest)', 'Anterior Deltoid', 'Triceps'],
    primaryMuscle: 'Upper Chest',
    equipment: 'Selectorized Incline Chest Press Machine',
    setupInstructions: [
      'Adjust the seat so handles rest at upper chest collarbone level.',
      'Keep head, upper back, and hips pressed firmly against backrest.',
      'Firmly plant feet on floor for leg drive stability.'
    ],
    executionInstructions: [
      'Press upward and forward along the machine guide path.',
      'Avoid shrugging shoulders toward ears; keep lats engaged.',
      'Lower slowly over 2–3 seconds until handles reach upper chest level.'
    ],
    breathingCues: 'Exhale on press; inhale smoothly as weights return.',
    recommendedSets: 2,
    recommendedRepsMin: 10,
    recommendedRepsMax: 12,
    recommendedRestSec: 90,
    defaultWeightKg: 35,
    weightIncrementKg: 2.5,
    commonMistakes: [
      'Arching excessively to turn it into a flat press.',
      'Allowing elbows to flare straight out sideways at 90 degrees.'
    ],
    beginnerModifications: [
      'Select a conservative starting weight to maintain strict upper chest engagement.'
    ],
    safetyNotes: [
      'Stop pressing before the elbows aggressively lock out.'
    ],
    alternativeExerciseIds: ['mach-chest-press'],
    tags: ['upper', 'chest', 'compound', 'machine']
  },
  {
    id: 'mach-seated-row',
    name: 'Seated Row Machine',
    category: 'upper',
    targetMuscles: ['Latissimus Dorsi', 'Rhomboids', 'Middle Trapezius', 'Biceps'],
    primaryMuscle: 'Upper & Mid Back',
    equipment: 'Selectorized Seated Row Machine',
    setupInstructions: [
      'Adjust the chest pad so you can reach handles with arms fully extended without rounding forward.',
      'Adjust seat height so handles pull toward the lower ribcage/navel area.',
      'Sit tall with chest resting lightly against chest pad (do not collapse on it).'
    ],
    executionInstructions: [
      'Retract shoulder blades back first before pulling with arms.',
      'Drive elbows straight backward past your torso.',
      'Squeeze shoulder blades together for 1 full second at peak contraction.',
      'Control the return forward over 2–3 seconds to feel a gentle lat stretch.'
    ],
    breathingCues: 'Exhale as you pull elbows back; inhale as handles return forward.',
    recommendedSets: 2,
    recommendedRepsMin: 10,
    recommendedRepsMax: 12,
    recommendedRestSec: 90,
    defaultWeightKg: 35,
    weightIncrementKg: 2.5,
    commonMistakes: [
      'Using torso momentum to rock backward.',
      'Shrugging shoulders into neck during pull.'
    ],
    beginnerModifications: [
      'Use a neutral horizontal grip if wrist mobility is limited.'
    ],
    safetyNotes: [
      'Maintain an upright spine; never round lumbar spine under load.'
    ],
    alternativeExerciseIds: ['mach-chest-supported-row', 'mach-lat-pulldown'],
    tags: ['upper', 'back', 'compound', 'machine']
  },
  {
    id: 'mach-chest-supported-row',
    name: 'Chest-Supported Row Machine',
    category: 'upper',
    targetMuscles: ['Upper Back', 'Rhomboids', 'Rear Deltoids', 'Lats'],
    primaryMuscle: 'Upper Back',
    equipment: 'Chest-Supported Row Machine',
    setupInstructions: [
      'Position chest securely on inclined or vertical support pad.',
      'Feet anchored behind or on foot pegs.',
      'Grip handles with palms facing inward or neutral.'
    ],
    executionInstructions: [
      'Pull elbows back in a sweeping motion, driving elbows behind ribs.',
      'Hold contraction for 1 second at top.',
      'Slowly extend arms until back muscles are comfortably lengthened.'
    ],
    breathingCues: 'Exhale pulling back; inhale returning weights.',
    recommendedSets: 2,
    recommendedRepsMin: 10,
    recommendedRepsMax: 12,
    recommendedRestSec: 75,
    defaultWeightKg: 30,
    weightIncrementKg: 2.5,
    commonMistakes: ['Lifting chest off pad to cheat reps.'],
    beginnerModifications: ['Focus on slow controlled 3-second negative.'],
    safetyNotes: ['Pad protects lower back; keep torso glued to pad.'],
    alternativeExerciseIds: ['mach-seated-row', 'mach-lat-pulldown'],
    tags: ['upper', 'back', 'machine']
  },
  {
    id: 'mach-lat-pulldown',
    name: 'Lat Pulldown',
    category: 'upper',
    targetMuscles: ['Latissimus Dorsi', 'Teres Major', 'Biceps', 'Brachialis'],
    primaryMuscle: 'Lats',
    equipment: 'Lat Pulldown Cable Machine',
    setupInstructions: [
      'Adjust thigh pad snugly over thighs so feet stay flat on floor.',
      'Grip bar just wider than shoulder width with overhand grip.',
      'Sit down, anchor thighs under pad, and lean back slightly (10-15 degrees).'
    ],
    executionInstructions: [
      'Depress shoulder blades down before bending elbows.',
      'Pull bar down smoothly toward upper collarbones, leading with elbows.',
      'Briefly touch or bring bar 2 inches from upper chest.',
      'Resist weight back to full overhead arm extension under control.'
    ],
    breathingCues: 'Exhale as you pull downward; inhale slowly reaching top.',
    recommendedSets: 2,
    recommendedRepsMin: 10,
    recommendedRepsMax: 12,
    recommendedRestSec: 85,
    defaultWeightKg: 40,
    weightIncrementKg: 2.5,
    commonMistakes: [
      'Pulling bar behind the neck (dangerous cervical spine shear).',
      'Swinging whole body backward past 45 degrees.'
    ],
    beginnerModifications: [
      'Use neutral-grip MAG or V-bar attachment if shoulder external rotation is tight.'
    ],
    safetyNotes: ['Always pull strictly to front of chest.'],
    alternativeExerciseIds: ['mach-neutral-lat-pulldown', 'mach-assisted-pullup'],
    tags: ['upper', 'back', 'cable']
  },
  {
    id: 'mach-neutral-lat-pulldown',
    name: 'Neutral-Grip Lat Pulldown',
    category: 'upper',
    targetMuscles: ['Latissimus Dorsi', 'Lower Lats', 'Biceps'],
    primaryMuscle: 'Lats',
    equipment: 'Lat Pulldown Machine with Neutral Attachment',
    setupInstructions: [
      'Attach neutral grip handle (parallel palms) to cable.',
      'Anchor thighs under roller pads.',
      'Slight chest lift with upright spine.'
    ],
    executionInstructions: [
      'Drive elbows downward straight toward your hips.',
      'Keep forearms in plane with cable pull.',
      'Pause at bottom for full lat contraction.',
      'Return smoothly over 3 seconds.'
    ],
    breathingCues: 'Exhale on pull; inhale as arms reach overhead.',
    recommendedSets: 2,
    recommendedRepsMin: 10,
    recommendedRepsMax: 12,
    recommendedRestSec: 90,
    defaultWeightKg: 40,
    weightIncrementKg: 2.5,
    commonMistakes: ['Pulling elbows too far behind back losing lat tension.'],
    beginnerModifications: ['Very joint-friendly grip for shoulders and wrists.'],
    safetyNotes: ['Maintain neutral spine without violent jerking.'],
    alternativeExerciseIds: ['mach-lat-pulldown', 'mach-seated-row'],
    tags: ['upper', 'back', 'cable']
  },
  {
    id: 'mach-assisted-pullup',
    name: 'Assisted Pull-Up Machine',
    category: 'upper',
    targetMuscles: ['Latissimus Dorsi', 'Biceps', 'Core'],
    primaryMuscle: 'Lats',
    equipment: 'Counterbalance Assisted Pull-Up Machine',
    setupInstructions: [
      'Select counterweight (heavier weight = easier assistance).',
      'Place knees or feet centered on assistance pad.',
      'Hold overhead handles firmly.'
    ],
    executionInstructions: [
      'Pull chest up toward handles by driving elbows toward floor.',
      'Hold chin above handle level for 1 second.',
      'Lower slowly until arms are lengthened.'
    ],
    breathingCues: 'Exhale rising; inhale lowering.',
    recommendedSets: 2,
    recommendedRepsMin: 8,
    recommendedRepsMax: 10,
    recommendedRestSec: 90,
    defaultWeightKg: 35, // counterbalance
    weightIncrementKg: 2.5,
    commonMistakes: ['Dropping down abruptly.'],
    beginnerModifications: ['Use more counterbalance weight until 10 smooth reps are achieved.'],
    safetyNotes: ['Step off slowly; let pad rise completely before releasing grips.'],
    alternativeExerciseIds: ['mach-lat-pulldown'],
    tags: ['upper', 'back', 'machine']
  },
  {
    id: 'mach-shoulder-press',
    name: 'Machine Shoulder Press',
    category: 'upper',
    targetMuscles: ['Anterior Deltoid', 'Lateral Deltoid', 'Triceps'],
    primaryMuscle: 'Shoulders',
    equipment: 'Selectorized Overhead Shoulder Press Machine',
    setupInstructions: [
      'Adjust seat so handles are at ear or chin height in bottom position.',
      'Sit back flush against the upright pad with feet grounded.',
      'Grip handles with neutral or pronated grip depending on shoulder comfort.'
    ],
    executionInstructions: [
      'Engage abdominal muscles to protect lower back.',
      'Press handles directly overhead until arms are nearly straight.',
      'Do not lock elbows violently at apex.',
      'Lower under steady control over 2 seconds to ear level.'
    ],
    breathingCues: 'Exhale pressing overhead; inhale lowering handles.',
    recommendedSets: 2,
    recommendedRepsMin: 10,
    recommendedRepsMax: 12,
    recommendedRestSec: 85,
    defaultWeightKg: 25,
    weightIncrementKg: 2.5,
    commonMistakes: [
      'Arching lower back heavily away from backrest (hyperextending spine).',
      'Letting handles drop below comfortable shoulder depth.'
    ],
    beginnerModifications: [
      'Use neutral parallel handles to decrease anterior shoulder capsule pressure.'
    ],
    safetyNotes: ['Never press behind neck; always in scapular plane.'],
    alternativeExerciseIds: ['mach-lateral-raise'],
    tags: ['upper', 'shoulders', 'compound', 'machine']
  },
  {
    id: 'mach-lateral-raise',
    name: 'Lateral Raise Machine',
    category: 'upper',
    targetMuscles: ['Lateral Deltoid (Side Shoulder)'],
    primaryMuscle: 'Side Delts',
    equipment: 'Seated Lateral Raise Machine',
    setupInstructions: [
      'Adjust seat height so shoulder rotation joint aligns with machine axis of rotation.',
      'Rest forearms/elbows against padded lever arms.',
      'Sit tall with chest high and feet firmly grounded.'
    ],
    executionInstructions: [
      'Raise elbows out to sides until upper arms are parallel to floor.',
      'Pause for a fraction of a second at parallel.',
      'Control descent slowly down to starting position without letting weights clack.'
    ],
    breathingCues: 'Exhale raising elbows; inhale lowering arms.',
    recommendedSets: 2,
    recommendedRepsMin: 12,
    recommendedRepsMax: 15,
    recommendedRestSec: 60,
    defaultWeightKg: 20,
    weightIncrementKg: 1.25,
    commonMistakes: [
      'Shrugging traps up to ears instead of leading with elbows.',
      'Lifting elbows way above shoulder height.'
    ],
    beginnerModifications: ['Keep weights light; side delts respond best to strict form and higher reps.'],
    safetyNotes: ['Stop at 90-degree shoulder abduction.'],
    alternativeExerciseIds: ['cable-lateral-raise', 'mach-shoulder-press'],
    tags: ['upper', 'shoulders', 'isolation', 'machine']
  },
  {
    id: 'mach-reverse-pec-deck',
    name: 'Reverse Pec Deck (Rear Delt Fly)',
    category: 'upper',
    targetMuscles: ['Posterior Deltoid', 'Rhomboids', 'Infraspinatus'],
    primaryMuscle: 'Rear Delts',
    equipment: 'Pec Deck / Rear Delt Machine',
    setupInstructions: [
      'Set seat height so handles are level with your shoulders.',
      'Face into the machine pad with chest pressed gently against support.',
      'Set machine arms to rear position and grip handles with neutral or pronated palms.'
    ],
    executionInstructions: [
      'With elbows slightly bent and locked in place, sweep arms outward and backward in an arc.',
      'Squeeze the back of your shoulders at peak extension.',
      'Return slowly forward resisting the stack.'
    ],
    breathingCues: 'Exhale opening arms backward; inhale returning forward.',
    recommendedSets: 2,
    recommendedRepsMin: 12,
    recommendedRepsMax: 15,
    recommendedRestSec: 65,
    defaultWeightKg: 25,
    weightIncrementKg: 2.5,
    commonMistakes: [
      'Bending and straightening elbows like a tricep kickback.',
      'Squeezing shoulder blades too early rather than leading with rear delts.'
    ],
    beginnerModifications: ['Keep arm bend stationary throughout entire movement.'],
    safetyNotes: ['Avoid excessive hyper-extension behind the back plane.'],
    alternativeExerciseIds: ['mach-seated-row'],
    tags: ['upper', 'shoulders', 'rear-delts', 'machine']
  },
  {
    id: 'mach-biceps-curl',
    name: 'Biceps Curl Machine',
    category: 'upper',
    targetMuscles: ['Biceps Brachii', 'Brachialis'],
    primaryMuscle: 'Biceps',
    equipment: 'Selectorized Biceps Curl Machine / Preacher Curl Machine',
    setupInstructions: [
      'Adjust seat so your armpits rest comfortably over upper edge of preacher pad.',
      'Ensure machine pivot axis aligns with your elbow joints.',
      'Grip handles underhand with wrists straight.'
    ],
    executionInstructions: [
      'Curl handles upward toward chin smoothly.',
      'Contract biceps firmly at top of range for 1 second.',
      'Lower handles under strict control until arms are almost fully straight (keep tension).'
    ],
    breathingCues: 'Exhale curling up; inhale lowering down.',
    recommendedSets: 2,
    recommendedRepsMin: 12,
    recommendedRepsMax: 15,
    recommendedRestSec: 60,
    defaultWeightKg: 20,
    weightIncrementKg: 2.5,
    commonMistakes: [
      'Lifting elbows off the pad during the curl.',
      'Leaning torso backward to cheat the weight up.'
    ],
    beginnerModifications: ['Use lighter load with strict 3-second negative.'],
    safetyNotes: ['Do not hyperextend elbows violently at bottom of preacher pad.'],
    alternativeExerciseIds: ['cable-biceps-curl'],
    tags: ['upper', 'arms', 'isolation', 'machine']
  },
  {
    id: 'cable-triceps-pushdown',
    name: 'Cable Triceps Pushdown',
    category: 'upper',
    targetMuscles: ['Triceps Brachii (All 3 Heads)'],
    primaryMuscle: 'Triceps',
    equipment: 'Cable Tower with Straight Bar or Rope Attachment',
    setupInstructions: [
      'Attach rope or straight/angled bar to high pulley.',
      'Stand with athletic knee bend, slight forward hinge at hips (10 degrees).',
      'Pin elbows tight against your ribcage.'
    ],
    executionInstructions: [
      'Keeping upper arms pinned stationary, extend forearms down until arms are straight.',
      'Spread rope handles slightly apart at bottom (if rope) and squeeze triceps for 1 second.',
      'Slowly allow forearms to rise back up until elbows reach 90 degrees.'
    ],
    breathingCues: 'Exhale pushing down; inhale returning up.',
    recommendedSets: 2,
    recommendedRepsMin: 12,
    recommendedRepsMax: 15,
    recommendedRestSec: 60,
    defaultWeightKg: 20,
    weightIncrementKg: 2.5,
    commonMistakes: [
      'Allowing elbows to drift forward and backward (turning it into a lat pullover).',
      'Rounding shoulders forward over the cable.'
    ],
    beginnerModifications: ['Use straight bar if wrist control with rope is fatiguing.'],
    safetyNotes: ['Keep elbows glued to sides; do not let elbows flare wide.'],
    alternativeExerciseIds: ['mach-chest-press'],
    tags: ['upper', 'arms', 'isolation', 'cable']
  },

  // --- LOWER BODY & CORE ---
  {
    id: 'mach-leg-press',
    name: 'Leg Press (45-Degree or Horizontal)',
    category: 'lower',
    targetMuscles: ['Quadriceps', 'Gluteus Maximus', 'Adductors', 'Hamstrings'],
    primaryMuscle: 'Quadriceps & Glutes',
    equipment: '45-Degree Sled Leg Press or Incline Machine',
    setupInstructions: [
      'Sit deep into the seat with hips fully pressed back against lower back cushion.',
      'Place feet shoulder-width apart in middle of platform, toes pointing slightly outward (10-15°).',
      'Disengage safety levers while holding side handles firmly.'
    ],
    executionInstructions: [
      'Inhale to brace core abdominal wall.',
      'Lower sled smoothly until knees bend to approximately 90 degrees.',
      'Ensure lower back does NOT peel away or round off pad at bottom.',
      'Drive platform away through whole foot (midfoot & heel) until legs extend.',
      'DO NOT lock knees at top — keep soft knee bend.'
    ],
    breathingCues: 'Inhale lowering platform; exhale driving platform away.',
    recommendedSets: 2,
    recommendedRepsMin: 10,
    recommendedRepsMax: 12,
    recommendedRestSec: 105,
    defaultWeightKg: 80,
    weightIncrementKg: 5,
    commonMistakes: [
      'Locking knees violently at the top (massive joint shear).',
      'Lowering too deep causing pelvis to tuck under (butt wink / lower back strain).',
      'Knees caving inward (valgus collapse).'
    ],
    beginnerModifications: [
      'Start with sled weight or single light plate to establish safe comfortable depth.'
    ],
    safetyNotes: [
      'NEVER lock knees out fully. Always keep hands on side grips and keep safety pins in reach.'
    ],
    alternativeExerciseIds: ['mach-hack-squat'],
    tags: ['lower', 'legs', 'compound', 'machine']
  },
  {
    id: 'mach-hack-squat',
    name: 'Hack Squat Machine',
    category: 'lower',
    targetMuscles: ['Quadriceps (Vastus Lateralis & Medialis)', 'Glutes'],
    primaryMuscle: 'Quadriceps',
    equipment: 'Linear Incline Hack Squat Machine',
    setupInstructions: [
      'Step onto platform with shoulder pads resting securely on traps.',
      'Feet shoulder-width apart, toes slightly flared outward.',
      'Back and hips completely flush against pad.',
      'Release safety handles.'
    ],
    executionInstructions: [
      'Descend slowly by bending knees and hips, tracking knees in line with toes.',
      'Lower until thighs reach parallel with platform.',
      'Drive back up through midfoot to starting position without locking knees.'
    ],
    breathingCues: 'Inhale bracing descent; exhale pushing up.',
    recommendedSets: 2,
    recommendedRepsMin: 10,
    recommendedRepsMax: 12,
    recommendedRestSec: 105,
    defaultWeightKg: 40,
    weightIncrementKg: 5,
    commonMistakes: [
      'Heels lifting off platform during descent.',
      'Lower back arching off back pad.'
    ],
    beginnerModifications: ['Place feet slightly higher on platform to ease knee flexion load.'],
    safetyNotes: ['Ensure safety catch pins are adjusted to catch carriage if needed.'],
    alternativeExerciseIds: ['mach-leg-press'],
    tags: ['lower', 'legs', 'compound', 'machine']
  },
  {
    id: 'mach-seated-leg-curl',
    name: 'Seated Leg Curl',
    category: 'lower',
    targetMuscles: ['Hamstrings (Biceps Femoris, Semitendinosus, Semimembranosus)'],
    primaryMuscle: 'Hamstrings',
    equipment: 'Selectorized Seated Leg Curl Machine',
    setupInstructions: [
      'Align knee joints directly with machine pivot axis.',
      'Adjust backrest so lower thighs rest comfortably on seat.',
      'Position lower leg pad just below calves/Achilles tendon.',
      'Lock thigh lap pad snugly down over lower quads to eliminate hip lifting.'
    ],
    executionInstructions: [
      'Hold side handles to anchor pelvis.',
      'Curl heels downward and backward smoothly toward your seat.',
      'Hold peak hamstring squeeze for 1 second.',
      'Control the return upward over 2–3 seconds without letting weight stack crash.'
    ],
    breathingCues: 'Exhale curling downward; inhale letting legs rise.',
    recommendedSets: 2,
    recommendedRepsMin: 10,
    recommendedRepsMax: 15,
    recommendedRestSec: 75,
    defaultWeightKg: 35,
    weightIncrementKg: 2.5,
    commonMistakes: [
      'Allowing hips to rise up off seat during curl.',
      'Letting weights drop with momentum.'
    ],
    beginnerModifications: [
      'Seated position creates better stretch than lying leg curl; start conservative.'
    ],
    safetyNotes: ['Ensure knee is aligned with red pivot marker on machine.'],
    alternativeExerciseIds: ['mach-leg-extension'],
    tags: ['lower', 'hamstrings', 'isolation', 'machine']
  },
  {
    id: 'mach-leg-extension',
    name: 'Leg Extension',
    category: 'lower',
    targetMuscles: ['Quadriceps (Rectus Femoris, Vasti Group)'],
    primaryMuscle: 'Quadriceps',
    equipment: 'Selectorized Leg Extension Machine',
    setupInstructions: [
      'Set back pad so your knee joint aligns perfectly with the machine pivot.',
      'Adjust lower shin pad so it rests right above ankles/shin.',
      'Grip side handles firmly to keep hips pinned into seat.'
    ],
    executionInstructions: [
      'Extend legs smoothly until knees are straight.',
      'Squeeze quadriceps hard at the top for 1 full second.',
      'Lower weights smoothly over 2–3 seconds to starting angle (approx 90°).'
    ],
    breathingCues: 'Exhale extending legs up; inhale lowering slowly.',
    recommendedSets: 2,
    recommendedRepsMin: 12,
    recommendedRepsMax: 15,
    recommendedRestSec: 70,
    defaultWeightKg: 35,
    weightIncrementKg: 2.5,
    commonMistakes: [
      'Kicking up explosively and snapping knee joints.',
      'Hips lifting up off seat.'
    ],
    beginnerModifications: [
      'Keep movement tempo controlled (2s up, 1s pause, 2s down).'
    ],
    safetyNotes: ['Avoid heavy 1-5 rep maximum attempts on leg extensions.'],
    alternativeExerciseIds: ['mach-leg-press'],
    tags: ['lower', 'quads', 'isolation', 'machine']
  },
  {
    id: 'mach-glute-drive',
    name: 'Glute Drive Machine (Hip Thrust)',
    category: 'lower',
    targetMuscles: ['Gluteus Maximus', 'Hamstrings'],
    primaryMuscle: 'Glutes',
    equipment: 'Dedicated Glute Drive Machine or Hip Thrust Bench with Belt',
    setupInstructions: [
      'Sit on seat with upper back against swivel pivot backrest.',
      'Fasten padded waist belt snugly across hips (iliac crest).',
      'Position feet flat on platform shoulder-width apart, knees stacked above ankles at top.'
    ],
    executionInstructions: [
      'Drive through heels and push hips upward toward ceiling.',
      'Release safety catch lever at top.',
      'Contract glutes powerfully at peak hip extension for 1-2 seconds with neutral spine.',
      'Lower hips down slowly until glutes lightly graze seat.'
    ],
    breathingCues: 'Exhale thrusting upward; inhale descending.',
    recommendedSets: 2,
    recommendedRepsMin: 10,
    recommendedRepsMax: 12,
    recommendedRestSec: 90,
    defaultWeightKg: 30,
    weightIncrementKg: 5,
    commonMistakes: [
      'Over-arching lumbar spine instead of driving with glutes.',
      'Placing feet too close or too far away.'
    ],
    beginnerModifications: ['Substitute with bodyweight glute bridge if machine is busy.'],
    safetyNotes: ['Keep chin tucked slightly forward toward chest during entire thrust.'],
    alternativeExerciseIds: ['bw-glute-bridge'],
    tags: ['lower', 'glutes', 'compound', 'machine']
  },
  {
    id: 'bw-glute-bridge',
    name: 'Bodyweight Glute Bridge (Mat Alternative)',
    category: 'lower',
    targetMuscles: ['Gluteus Maximus', 'Hamstrings', 'Core'],
    primaryMuscle: 'Glutes',
    equipment: 'Gym Exercise Mat',
    setupInstructions: [
      'Lie flat on back on comfortable mat with knees bent at 90 degrees.',
      'Feet flat on floor, hip-width apart.',
      'Arms flat at sides for stability.'
    ],
    executionInstructions: [
      'Drive heels through floor and lift hips upward.',
      'Hold a straight line from knees to shoulders and squeeze glutes hard for 2 seconds.',
      'Lower hips down smoothly without collapsing.'
    ],
    breathingCues: 'Exhale at top contraction; inhale lowering.',
    recommendedSets: 2,
    recommendedRepsMin: 15,
    recommendedRepsMax: 20,
    recommendedRestSec: 60,
    defaultWeightKg: 0,
    weightIncrementKg: 0,
    commonMistakes: ['Arching lower back off floor prematurely.'],
    beginnerModifications: ['Hold top contraction for 3 seconds per rep.'],
    safetyNotes: ['Joint friendly; zero spinal compression.'],
    alternativeExerciseIds: ['mach-glute-drive'],
    tags: ['lower', 'glutes', 'mat', 'bodyweight']
  },
  {
    id: 'mach-calf-raise',
    name: 'Calf Raise Machine (Standing or Seated)',
    category: 'lower',
    targetMuscles: ['Gastrocnemius', 'Soleus'],
    primaryMuscle: 'Calves',
    equipment: 'Standing or Seated Calf Raise Machine',
    setupInstructions: [
      'Place balls of feet on footstep with heels hanging free over edge.',
      'Rest shoulder pads snugly or knee pad snugly across thighs.',
      'Keep core braced and spine neutral.'
    ],
    executionInstructions: [
      'Lower heels down slowly until you feel a deep, comfortable calf stretch (hold 1s).',
      'Push through balls of feet and raise heels as high as possible.',
      'Hold top contraction on tiptoes for 1-2 seconds.',
      'Lower under control over 2–3 seconds.'
    ],
    breathingCues: 'Exhale rising on toes; inhale dropping heels into stretch.',
    recommendedSets: 2,
    recommendedRepsMin: 12,
    recommendedRepsMax: 15,
    recommendedRestSec: 60,
    defaultWeightKg: 40,
    weightIncrementKg: 5,
    commonMistakes: [
      'Bouncing up and down quickly using Achilles tendon reflex.',
      'Cutting the bottom stretch short.'
    ],
    beginnerModifications: ['Emphasize the 2-second pause at the bottom stretch.'],
    safetyNotes: ['Keep balls of feet securely centered on edge to prevent slipping.'],
    alternativeExerciseIds: ['mach-leg-press'],
    tags: ['lower', 'calves', 'isolation', 'machine']
  },
  {
    id: 'mach-ab-crunch',
    name: 'Abdominal Crunch Machine',
    category: 'core',
    targetMuscles: ['Rectus Abdominis'],
    primaryMuscle: 'Abdominals',
    equipment: 'Selectorized Ab Crunch Machine',
    setupInstructions: [
      'Adjust seat so your abdominal axis of flexion matches the machine pivot.',
      'Place feet behind ankle rollers or on foot pegs.',
      'Grip upper chest or shoulder handles comfortably.'
    ],
    executionInstructions: [
      'Curl your ribcage downward toward your pelvis using your abs.',
      'Do not pull with your arms or neck; initiate from the core.',
      'Exhale completely as you curl and hold contraction for 1 second.',
      'Return slowly to starting position under control.'
    ],
    breathingCues: 'Exhale fully during crunch; inhale as torso unrolls.',
    recommendedSets: 2,
    recommendedRepsMin: 12,
    recommendedRepsMax: 15,
    recommendedRestSec: 60,
    defaultWeightKg: 25,
    weightIncrementKg: 2.5,
    commonMistakes: [
      'Pulling with arms rather than crunching spine.',
      'Flung momentum causing lower back hyperextension on return.'
    ],
    beginnerModifications: ['Use moderate weight; remember spot reduction of belly fat is a myth.'],
    safetyNotes: ['Do not yank neck forward.'],
    alternativeExerciseIds: ['cable-pallof-press'],
    tags: ['core', 'abs', 'machine']
  },
  {
    id: 'cable-pallof-press',
    name: 'Cable Pallof Press',
    category: 'core',
    targetMuscles: ['Transverse Abdominis', 'Internal & External Obliques'],
    primaryMuscle: 'Anti-Rotation Core',
    equipment: 'Cable Tower with Single D-Handle or Resistance Band',
    setupInstructions: [
      'Set cable pulley to mid-chest height.',
      'Grip handle with both hands, clasping fingers together.',
      'Step 3-4 feet away perpendicular to cable tower to create tension.',
      'Stand with feet shoulder-width apart, slight knee bend, chest proud.'
    ],
    executionInstructions: [
      'Bring handle to center of chest.',
      'Press hands straight forward away from chest, resisting the cable trying to twist your torso.',
      'Hold arms locked straight out in front for 2 full seconds.',
      'Bring hands slowly back to chest.',
      'Complete all reps on one side, then turn around and train the other side.'
    ],
    breathingCues: 'Exhale as you press hands forward; breathe steadily holding tension.',
    recommendedSets: 2,
    recommendedRepsMin: 10,
    recommendedRepsMax: 10,
    recommendedRestSec: 50,
    defaultWeightKg: 10,
    weightIncrementKg: 1.25,
    commonMistakes: [
      'Allowing torso or hips to twist toward the cable stack.',
      'Shrugging shoulders up toward ears.'
    ],
    beginnerModifications: [
      'Widen foot stance for greater base of support if balance is challenged.'
    ],
    safetyNotes: ['Brace abs as if about to be tapped on stomach.'],
    alternativeExerciseIds: ['mach-ab-crunch'],
    tags: ['core', 'obliques', 'anti-rotation', 'cable']
  },

  // --- CARDIO & MOBILITY ---
  {
    id: 'cardio-treadmill',
    name: 'Treadmill Incline Walking',
    category: 'cardio',
    targetMuscles: ['Cardiovascular System', 'Calves', 'Glutes'],
    primaryMuscle: 'Cardio',
    equipment: 'Anytime Fitness Treadmill',
    setupInstructions: [
      'Step onto side rails before starting belt.',
      'Select speed between 4.0 and 5.2 km/h (moderate brisk walking pace).',
      'Set gentle incline between 2.0% and 4.0% to increase muscular activation without joint impact.'
    ],
    executionInstructions: [
      'Walk with upright posture, natural arm swing, and eyes forward.',
      'Maintain an easy-to-moderate conversation pace (you can speak in full sentences).',
      'Aim for 20–30 minutes total.'
    ],
    breathingCues: 'Breathe rhythmically through nose and mouth.',
    recommendedSets: 1,
    recommendedRepsMin: 20,
    recommendedRepsMax: 30, // in minutes
    recommendedRestSec: 0,
    defaultWeightKg: 0,
    weightIncrementKg: 0,
    commonMistakes: ['Holding onto handrails tightly and leaning backward.'],
    beginnerModifications: ['Start flat at 0% incline if shin splints occur.'],
    safetyNotes: ['Attach safety emergency clip to clothing.'],
    alternativeExerciseIds: ['cardio-bike'],
    tags: ['cardio', 'aerobic', 'recovery', 'treadmill']
  },
  {
    id: 'cardio-bike',
    name: 'Stationary Bike (Upright / Recumbent)',
    category: 'cardio',
    targetMuscles: ['Cardiovascular System', 'Quadriceps'],
    primaryMuscle: 'Cardio',
    equipment: 'Anytime Fitness Stationary Bike',
    setupInstructions: [
      'Adjust seat height so when pedal is at bottom, knee has a slight comfortable 10-15° bend.',
      'Set resistance to light-moderate (level 3 to 6).'
    ],
    executionInstructions: [
      'Pedal smoothly at 70–85 RPM cadence.',
      'Keep breathing steady and shoulders relaxed.'
    ],
    breathingCues: 'Steady continuous nasal/oral breathing.',
    recommendedSets: 1,
    recommendedRepsMin: 20,
    recommendedRepsMax: 30,
    recommendedRestSec: 0,
    defaultWeightKg: 0,
    weightIncrementKg: 0,
    commonMistakes: ['Seat too low causing front knee compression.'],
    beginnerModifications: ['Use recumbent bike if lower back prefers back support.'],
    safetyNotes: ['Great zero-impact alternative to treadmill.'],
    alternativeExerciseIds: ['cardio-treadmill'],
    tags: ['cardio', 'aerobic', 'recovery', 'bike']
  },
  {
    id: 'mobility-hips',
    name: 'Comfortable Hip Mobility (90/90 & Half-Kneeling Stretch)',
    category: 'mobility',
    targetMuscles: ['Hip Rotators', 'Hip Flexors (Psoas)', 'Gluteus Medius'],
    primaryMuscle: 'Hips',
    equipment: 'Gym Exercise Mat',
    setupInstructions: [
      'Sit on mat in 90/90 position: front leg at 90 degrees, back leg bent at 90 degrees.',
      'Keep torso tall.'
    ],
    executionInstructions: [
      'Hinge gently forward over front shin to stretch outer hip for 30 seconds.',
      'Transition smoothly to half-kneeling hip flexor stretch, gently tucking tailbone forward.',
      'Hold 30 seconds per side. Never force deep pain.'
    ],
    breathingCues: 'Deep calm belly breaths; exhale to relax into stretch.',
    recommendedSets: 2,
    recommendedRepsMin: 30,
    recommendedRepsMax: 45, // seconds
    recommendedRestSec: 15,
    defaultWeightKg: 0,
    weightIncrementKg: 0,
    commonMistakes: ['Aggressively forcing the knee down.'],
    beginnerModifications: ['Place hands behind you on floor for support.'],
    safetyNotes: ['No pinching sensations in groin; back off if sharp pinch occurs.'],
    alternativeExerciseIds: ['mobility-spine'],
    tags: ['mobility', 'hips', 'recovery']
  },
  {
    id: 'mobility-ankles',
    name: 'Ankle Dorsiflexion Wall Mobilization',
    category: 'mobility',
    targetMuscles: ['Gastrocnemius', 'Soleus', 'Achilles Tendon'],
    primaryMuscle: 'Ankles',
    equipment: 'Wall or Gym Rig Post',
    setupInstructions: [
      'Stand facing wall, place toes of front foot 3–4 inches from baseboard.',
      'Hands flat on wall at chest height.'
    ],
    executionInstructions: [
      'Drive front knee straight forward toward wall, keeping front heel glued to floor.',
      'Touch knee to wall, hold 1-2 seconds, and return.',
      'Repeat 10 smooth pulses per leg.'
    ],
    breathingCues: 'Breathe naturally with rhythmic pulses.',
    recommendedSets: 2,
    recommendedRepsMin: 10,
    recommendedRepsMax: 12,
    recommendedRestSec: 15,
    defaultWeightKg: 0,
    weightIncrementKg: 0,
    commonMistakes: ['Heel popping off floor.'],
    beginnerModifications: ['Move foot closer to wall if heel lifts.'],
    safetyNotes: ['Gentle stretch at back of lower leg, no joint impingement.'],
    alternativeExerciseIds: ['mach-calf-raise'],
    tags: ['mobility', 'ankles', 'recovery']
  },
  {
    id: 'mobility-spine',
    name: 'Chest & Upper-Back Mobility (Cat-Cow & T-Spine Rotations)',
    category: 'mobility',
    targetMuscles: ['Thoracic Spine', 'Pectoralis Minor', 'Rhomboids'],
    primaryMuscle: 'Upper Spine & Chest',
    equipment: 'Gym Exercise Mat',
    setupInstructions: [
      'Begin on all fours on mat with wrists under shoulders, knees under hips.'
    ],
    executionInstructions: [
      'Inhale: arch back gently, drop belly, look slightly forward (Cow).',
      'Exhale: press through hands, round spine toward ceiling, tuck chin (Cat).',
      'Perform 6–8 slow cycles.',
      'Place one hand behind head and rotate elbow open toward ceiling for thoracic rotation (6 reps per side).'
    ],
    breathingCues: 'Inhale on extension, exhale on flexion and rotation.',
    recommendedSets: 2,
    recommendedRepsMin: 6,
    recommendedRepsMax: 8,
    recommendedRestSec: 15,
    defaultWeightKg: 0,
    weightIncrementKg: 0,
    commonMistakes: ['Moving from lower back rather than thoracic mid-spine.'],
    beginnerModifications: ['Perform seated on bench if wrists dislike floor pressure.'],
    safetyNotes: ['Promotes shoulder health for pressing machines.'],
    alternativeExerciseIds: ['mobility-hips'],
    tags: ['mobility', 'spine', 'chest', 'recovery']
  }
]
