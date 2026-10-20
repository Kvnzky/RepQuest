import React, { useState } from 'react'
import { Play, Pause, Zap } from 'lucide-react'

interface ExerciseVisualProps {
  exerciseId: string
  className?: string
  animated?: boolean
  showControls?: boolean
}

export const ExerciseVisual: React.FC<ExerciseVisualProps> = ({
  exerciseId,
  className = 'w-full h-44',
  animated = true,
  showControls = false
}) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(true)
  const [isSlowMo, setIsSlowMo] = useState<boolean>(false)

  const animClass = !animated || !isPlaying ? 'anim-paused' : isSlowMo ? 'anim-slow' : ''

  const renderDiagram = () => {
    switch (exerciseId) {
      // 1. Machine Chest Press
      case 'mach-chest-press':
        return (
          <svg viewBox="0 0 320 200" className={`w-full h-full ${animClass}`}>
            <rect x="40" y="30" width="12" height="140" rx="4" fill="#334155" />
            <rect x="40" y="160" width="240" height="10" rx="3" fill="#334155" />

            {/* Moving Weight Stack */}
            <g className="anim-weights">
              <rect x="48" y="55" width="28" height="85" rx="3" fill="#1e293b" stroke="#38bdf8" strokeWidth="1.5" />
              <line x1="62" y1="40" x2="62" y2="150" stroke="#94a3b8" strokeWidth="2.5" />
            </g>

            {/* Machine seat and backrest pad */}
            <rect x="110" y="65" width="14" height="75" rx="5" fill="#475569" />
            <rect x="110" y="130" width="45" height="12" rx="4" fill="#475569" />

            {/* Seated torso */}
            <circle cx="132" cy="50" r="14" fill="#cbd5e1" />
            <path d="M125 65 L135 125 L160 128 L180 160" stroke="#cbd5e1" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" fill="none" />

            {/* Glowing active Pectoralis Chest Muscle */}
            <path d="M136 75 C146 75, 152 82, 148 92 C142 98, 134 96, 134 85 Z" fill="#38bdf8" className="anim-muscle" />

            {/* Moving Press Handles & Arms */}
            <g className="anim-push-h">
              {/* Lever arm */}
              <line x1="90" y1="48" x2="160" y2="85" stroke="#64748b" strokeWidth="6" strokeLinecap="round" />
              <rect x="156" y="80" width="9" height="24" rx="3" fill="#38bdf8" />
              {/* Arm pushing forward */}
              <path d="M134 78 L160 88 L185 86" stroke="#93c5fd" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            </g>

            <text x="160" y="186" fill="#94a3b8" fontSize="10" fontWeight="bold" textAnchor="middle">
              Chest Press: Press Forward Smoothly &rarr; Controlled 3s Negative Return
            </text>
          </svg>
        )

      // 2. Incline Chest Press Machine
      case 'mach-incline-chest-press':
        return (
          <svg viewBox="0 0 320 200" className={`w-full h-full ${animClass}`}>
            <rect x="35" y="30" width="12" height="140" rx="4" fill="#334155" />
            <rect x="35" y="160" width="250" height="10" rx="3" fill="#334155" />

            {/* Moving Weight stack */}
            <g className="anim-weights">
              <rect x="43" y="55" width="26" height="85" rx="3" fill="#1e293b" stroke="#38bdf8" strokeWidth="1.5" />
            </g>

            {/* 45-degree angled backrest */}
            <line x1="95" y1="135" x2="135" y2="65" stroke="#475569" strokeWidth="14" strokeLinecap="round" />
            <rect x="100" y="132" width="40" height="12" rx="4" fill="#475569" />

            {/* Seated figure */}
            <circle cx="145" cy="48" r="13" fill="#cbd5e1" />
            <line x1="132" y1="62" x2="115" y2="130" stroke="#cbd5e1" strokeWidth="12" strokeLinecap="round" />
            <line x1="115" y1="130" x2="155" y2="135" stroke="#cbd5e1" strokeWidth="10" strokeLinecap="round" />
            <line x1="155" y1="135" x2="175" y2="160" stroke="#cbd5e1" strokeWidth="10" strokeLinecap="round" />

            {/* Upper Chest Muscle Glow */}
            <circle cx="138" cy="74" r="9" fill="#38bdf8" className="anim-muscle" />

            {/* Incline Pressing Motion */}
            <g className="anim-push-inc">
              <path d="M132 72 L165 65 L195 50" stroke="#93c5fd" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
              <rect x="190" y="42" width="10" height="22" rx="3" fill="#38bdf8" />
            </g>

            <text x="160" y="186" fill="#94a3b8" fontSize="10" fontWeight="bold" textAnchor="middle">
              Incline Press: Upward & Forward Angle (Upper Chest Focus)
            </text>
          </svg>
        )

      // 3. Seated Row Machine & Chest Supported Row
      case 'mach-seated-row':
      case 'mach-chest-supported-row':
        return (
          <svg viewBox="0 0 320 200" className={`w-full h-full ${animClass}`}>
            <rect x="240" y="40" width="12" height="130" rx="4" fill="#334155" />
            <rect x="50" y="160" width="220" height="10" rx="3" fill="#334155" />

            {/* Moving Weight stack */}
            <g className="anim-weights">
              <rect x="215" y="60" width="24" height="80" rx="4" fill="#1e293b" stroke="#38bdf8" strokeWidth="1.5" />
            </g>

            {/* Chest support pad */}
            <rect x="175" y="70" width="12" height="65" rx="4" fill="#475569" />
            <rect x="120" y="130" width="50" height="12" rx="4" fill="#475569" />

            {/* Torso on pad */}
            <circle cx="150" cy="52" r="13" fill="#cbd5e1" />
            <line x1="155" y1="65" x2="155" y2="128" stroke="#cbd5e1" strokeWidth="12" strokeLinecap="round" />
            <path d="M155 128 L180 135 L200 160" stroke="#cbd5e1" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" fill="none" />

            {/* Latissimus & Rhomboids muscle glow */}
            <path d="M145 70 C138 75, 138 95, 145 105 Z" fill="#38bdf8" className="anim-muscle" />

            {/* Moving Rowing Arms & Handles */}
            <g className="anim-pull-h">
              <path d="M155 75 L115 85 L180 88" stroke="#93c5fd" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
              <rect x="178" y="80" width="8" height="20" rx="3" fill="#38bdf8" />
            </g>

            <text x="160" y="186" fill="#94a3b8" fontSize="10" fontWeight="bold" textAnchor="middle">
              Seated Row: Drive Elbows Back & Squeeze Shoulder Blades
            </text>
          </svg>
        )

      // 4. Lat Pulldown Machine
      case 'mach-lat-pulldown':
      case 'mach-neutral-lat-pulldown':
      case 'mach-assisted-pullup':
        return (
          <svg viewBox="0 0 320 200" className={`w-full h-full ${animClass}`}>
            <path d="M70 170 L70 30 L160 30" stroke="#334155" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <circle cx="160" cy="30" r="10" fill="#64748b" />

            {/* Moving Weight stack */}
            <g className="anim-weights">
              <rect x="78" y="60" width="26" height="85" rx="3" fill="#1e293b" stroke="#38bdf8" strokeWidth="1.5" />
            </g>

            {/* Thigh pad and seat */}
            <rect x="140" y="115" width="40" height="12" rx="4" fill="#475569" />
            <rect x="130" y="135" width="45" height="12" rx="4" fill="#475569" />

            {/* Seated body */}
            <circle cx="158" cy="75" r="13" fill="#cbd5e1" />
            <line x1="158" y1="88" x2="152" y2="135" stroke="#cbd5e1" strokeWidth="12" strokeLinecap="round" />
            <path d="M152 135 L175 130 L185 165" stroke="#cbd5e1" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" fill="none" />

            {/* Wide Lat Wings Muscle Glow */}
            <path d="M148 90 C138 95, 138 115, 150 120 Z" fill="#38bdf8" className="anim-muscle" />
            <path d="M162 90 C172 95, 172 115, 160 120 Z" fill="#38bdf8" className="anim-muscle" />

            {/* Moving Lat Bar & Arms */}
            <g className="anim-pull-v">
              <line x1="160" y1="30" x2="160" y2="60" stroke="#cbd5e1" strokeWidth="3" />
              <line x1="105" y1="62" x2="215" y2="62" stroke="#38bdf8" strokeWidth="7" strokeLinecap="round" />
              <path d="M152 90 L130 78 L125 65" stroke="#93c5fd" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" fill="none" />
              <path d="M164 90 L185 78 L195 65" stroke="#93c5fd" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            </g>

            <text x="160" y="186" fill="#94a3b8" fontSize="10" fontWeight="bold" textAnchor="middle">
              Lat Pulldown: Pull to Collarbones &rarr; Full Controlled Overhead Stretch
            </text>
          </svg>
        )

      // 5. Machine Shoulder Press
      case 'mach-shoulder-press':
        return (
          <svg viewBox="0 0 320 200" className={`w-full h-full ${animClass}`}>
            <rect x="50" y="30" width="12" height="140" rx="4" fill="#334155" />
            <rect x="50" y="160" width="220" height="10" rx="3" fill="#334155" />

            <g className="anim-weights">
              <rect x="58" y="55" width="26" height="85" rx="3" fill="#1e293b" stroke="#38bdf8" strokeWidth="1.5" />
            </g>

            <rect x="125" y="60" width="12" height="75" rx="4" fill="#475569" />
            <rect x="125" y="130" width="45" height="12" rx="4" fill="#475569" />

            <circle cx="145" cy="45" r="13" fill="#cbd5e1" />
            <line x1="145" y1="58" x2="145" y2="130" stroke="#cbd5e1" strokeWidth="12" strokeLinecap="round" />
            <path d="M145 130 L175 133 L185 160" stroke="#cbd5e1" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" fill="none" />

            {/* Deltoid muscle glow */}
            <circle cx="145" cy="62" r="9" fill="#38bdf8" className="anim-muscle" />

            {/* Overhead Pressing Handles & Arms */}
            <g className="anim-press-up">
              <path d="M145 65 L170 50 L168 30" stroke="#93c5fd" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
              <rect x="160" y="24" width="16" height="8" rx="2" fill="#38bdf8" />
            </g>

            <text x="160" y="186" fill="#94a3b8" fontSize="10" fontWeight="bold" textAnchor="middle">
              Shoulder Press: Press Overhead Smoothly; Soft Lock at Apex
            </text>
          </svg>
        )

      // 6. Lateral Raise Machine
      case 'mach-lateral-raise':
      case 'mach-reverse-pec-deck':
        return (
          <svg viewBox="0 0 320 200" className={`w-full h-full ${animClass}`}>
            <rect x="60" y="160" width="200" height="10" rx="3" fill="#334155" />
            <rect x="145" y="80" width="30" height="80" rx="5" fill="#475569" />
            <circle cx="160" cy="50" r="14" fill="#cbd5e1" />
            <line x1="160" y1="64" x2="160" y2="125" stroke="#cbd5e1" strokeWidth="14" strokeLinecap="round" />

            {/* Deltoid caps glowing */}
            <circle cx="145" cy="72" r="8" fill="#38bdf8" className="anim-muscle" />
            <circle cx="175" cy="72" r="8" fill="#38bdf8" className="anim-muscle" />

            {/* Animated left arm abduction */}
            <g className="anim-raise-left">
              <path d="M145 72 L110 72 L95 85" stroke="#93c5fd" strokeWidth="8" strokeLinecap="round" fill="none" />
              <rect x="100" y="68" width="15" height="12" rx="3" fill="#38bdf8" />
            </g>

            {/* Animated right arm abduction */}
            <g className="anim-raise-right">
              <path d="M175 72 L210 72 L225 85" stroke="#93c5fd" strokeWidth="8" strokeLinecap="round" fill="none" />
              <rect x="205" y="68" width="15" height="12" rx="3" fill="#38bdf8" />
            </g>

            <text x="160" y="186" fill="#94a3b8" fontSize="10" fontWeight="bold" textAnchor="middle">
              Lateral Raise: Lead with Elbows to Parallel &rarr; Controlled Descent
            </text>
          </svg>
        )

      // 7. Arms: Biceps Curl & Triceps Pushdown
      case 'mach-biceps-curl':
      case 'cable-triceps-pushdown':
        return (
          <svg viewBox="0 0 320 200" className={`w-full h-full ${animClass}`}>
            <rect x="60" y="160" width="200" height="10" rx="3" fill="#334155" />
            <path d="M130 140 L165 95 L180 95 L145 140 Z" fill="#475569" />
            <circle cx="125" cy="65" r="13" fill="#cbd5e1" />
            <line x1="125" y1="78" x2="135" y2="135" stroke="#cbd5e1" strokeWidth="12" strokeLinecap="round" />
            <line x1="135" y1="85" x2="165" y2="105" stroke="#cbd5e1" strokeWidth="9" strokeLinecap="round" />

            {/* Biceps Peak Glow */}
            <ellipse cx="150" cy="92" rx="10" ry="7" fill="#38bdf8" className="anim-muscle" transform="rotate(-30 150 92)" />

            {/* Moving Forearm Curl */}
            <g className="anim-curl">
              <line x1="165" y1="105" x2="152" y2="70" stroke="#93c5fd" strokeWidth="8" strokeLinecap="round" />
              <rect x="146" y="65" width="12" height="10" rx="2" fill="#38bdf8" />
            </g>

            <text x="160" y="186" fill="#94a3b8" fontSize="10" fontWeight="bold" textAnchor="middle">
              Biceps: Lock Elbows to Pad &rarr; Squeeze Peak &rarr; 3-Second Negative
            </text>
          </svg>
        )

      // 8. Leg Press Machine
      case 'mach-leg-press':
        return (
          <svg viewBox="0 0 320 200" className={`w-full h-full ${animClass}`}>
            <line x1="50" y1="160" x2="270" y2="40" stroke="#334155" strokeWidth="8" strokeLinecap="round" />
            <rect x="50" y="160" width="230" height="10" rx="3" fill="#334155" />

            <path d="M65 145 L85 115 L105 135" stroke="#475569" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <circle cx="75" cy="105" r="12" fill="#cbd5e1" />
            <path d="M82 116 L95 130" stroke="#cbd5e1" strokeWidth="11" strokeLinecap="round" />

            <circle cx="98" cy="132" r="8" fill="#38bdf8" className="anim-muscle" />

            {/* Moving Leg Press Sled Platform & Extending Legs */}
            <g className="anim-leg-press">
              <line x1="98" y1="132" x2="140" y2="95" stroke="#38bdf8" strokeWidth="10" strokeLinecap="round" />
              <line x1="140" y1="95" x2="190" y2="85" stroke="#93c5fd" strokeWidth="8" strokeLinecap="round" />
              <rect x="188" y="70" width="12" height="36" rx="3" fill="#64748b" transform="rotate(-30 194 88)" />
              <circle cx="210" cy="70" r="14" fill="#1e293b" stroke="#38bdf8" strokeWidth="3" />
            </g>

            <text x="160" y="186" fill="#94a3b8" fontSize="10" fontWeight="bold" textAnchor="middle">
              Leg Press: Drive Sled Away &rarr; Keep Soft Knees at Top (No Lockout)
            </text>
          </svg>
        )

      // 9. Hack Squat Machine
      case 'mach-hack-squat':
        return (
          <svg viewBox="0 0 320 200" className={`w-full h-full ${animClass}`}>
            <line x1="80" y1="165" x2="240" y2="35" stroke="#334155" strokeWidth="8" strokeLinecap="round" />
            <rect x="65" y="155" width="50" height="12" rx="3" fill="#64748b" transform="rotate(-15 90 161)" />

            {/* Moving Carriage & Squatting Body */}
            <g className="anim-leg-press">
              <line x1="150" y1="105" x2="185" y2="75" stroke="#475569" strokeWidth="14" strokeLinecap="round" />
              <rect x="180" y="65" width="20" height="12" rx="3" fill="#64748b" />
              <circle cx="195" cy="55" r="12" fill="#cbd5e1" />
              <line x1="185" y1="75" x2="155" y2="102" stroke="#cbd5e1" strokeWidth="11" strokeLinecap="round" />
              <line x1="155" y1="102" x2="125" y2="125" stroke="#38bdf8" strokeWidth="11" strokeLinecap="round" className="anim-muscle" />
              <line x1="125" y1="125" x2="95" y2="155" stroke="#93c5fd" strokeWidth="9" strokeLinecap="round" />
            </g>

            <text x="160" y="186" fill="#94a3b8" fontSize="10" fontWeight="bold" textAnchor="middle">
              Hack Squat: Smooth Descent to Parallel &rarr; Drive Up Through Midfoot
            </text>
          </svg>
        )

      // 10. Seated Leg Curl & Leg Extension
      case 'mach-seated-leg-curl':
      case 'mach-leg-extension':
        return (
          <svg viewBox="0 0 320 200" className={`w-full h-full ${animClass}`}>
            <rect x="50" y="160" width="220" height="10" rx="3" fill="#334155" />
            <rect x="100" y="70" width="14" height="70" rx="4" fill="#475569" />
            <rect x="100" y="125" width="55" height="14" rx="4" fill="#475569" />
            <circle cx="120" cy="52" r="13" fill="#cbd5e1" />
            <line x1="120" y1="65" x2="120" y2="125" stroke="#cbd5e1" strokeWidth="12" strokeLinecap="round" />
            <line x1="120" y1="125" x2="160" y2="125" stroke="#38bdf8" strokeWidth="11" strokeLinecap="round" className="anim-muscle" />
            <circle cx="160" cy="125" r="7" fill="#f59e0b" />

            {/* Rotating Lower Leg Pad */}
            <g className={exerciseId === 'mach-seated-leg-curl' ? 'anim-leg-curl' : 'anim-leg-ext'}>
              <line x1="160" y1="125" x2="165" y2="160" stroke="#93c5fd" strokeWidth="9" strokeLinecap="round" />
              <rect x="155" y="150" width="18" height="10" rx="3" fill="#38bdf8" />
            </g>

            <text x="160" y="186" fill="#94a3b8" fontSize="10" fontWeight="bold" textAnchor="middle">
              {exerciseId === 'mach-seated-leg-curl' ? 'Leg Curl: Curl Under Seat & Squeeze Hamstrings' : 'Leg Extension: Extend Legs & Hold 1s Peak Contraction'}
            </text>
          </svg>
        )

      // 11. Glute Drive Machine & Bridge
      case 'mach-glute-drive':
      case 'bw-glute-bridge':
        return (
          <svg viewBox="0 0 320 200" className={`w-full h-full ${animClass}`}>
            <rect x="50" y="160" width="220" height="10" rx="3" fill="#334155" />
            <rect x="90" y="105" width="30" height="30" rx="6" fill="#475569" />
            <rect x="200" y="155" width="30" height="8" rx="2" fill="#64748b" />

            {/* Upward Thrusting Glute Bridge Motion */}
            <g className="anim-glute">
              <circle cx="95" cy="95" r="12" fill="#cbd5e1" />
              <line x1="105" y1="105" x2="155" y2="105" stroke="#cbd5e1" strokeWidth="11" strokeLinecap="round" />
              <circle cx="155" cy="105" r="10" fill="#38bdf8" className="anim-muscle" />
              <line x1="155" y1="105" x2="210" y2="155" stroke="#93c5fd" strokeWidth="10" strokeLinecap="round" />
              <rect x="145" y="98" width="18" height="8" rx="2" fill="#f59e0b" />
            </g>

            <text x="160" y="186" fill="#94a3b8" fontSize="10" fontWeight="bold" textAnchor="middle">
              Glute Drive: Thrust Hips Up &rarr; Hard 2s Glute Squeeze at Apex
            </text>
          </svg>
        )

      // 12. Ab Crunch Machine & Pallof Press
      case 'mach-ab-crunch':
      case 'cable-pallof-press':
        return (
          <svg viewBox="0 0 320 200" className={`w-full h-full ${animClass}`}>
            <rect x="50" y="160" width="220" height="10" rx="3" fill="#334155" />
            <rect x="110" y="125" width="45" height="12" rx="4" fill="#475569" />

            {/* Curled Crunching Spine */}
            <g className="anim-crunch">
              <circle cx="135" cy="65" r="13" fill="#cbd5e1" />
              <path d="M135 78 C120 90, 120 115, 130 128" stroke="#cbd5e1" strokeWidth="12" strokeLinecap="round" fill="none" />
              <path d="M132 85 C125 95, 125 110, 130 120" stroke="#38bdf8" strokeWidth="6" strokeLinecap="round" fill="none" className="anim-muscle" />
              <path d="M135 75 L150 90 L140 105" stroke="#93c5fd" strokeWidth="7" strokeLinecap="round" fill="none" />
              <rect x="135" y="98" width="10" height="14" rx="2" fill="#38bdf8" />
            </g>

            <text x="160" y="186" fill="#94a3b8" fontSize="10" fontWeight="bold" textAnchor="middle">
              Ab Crunch: Curl Ribcage Toward Navel &rarr; Exhale on Squeeze
            </text>
          </svg>
        )

      // 13. Cardio: Treadmill & Bike
      case 'cardio-treadmill':
        return (
          <svg viewBox="0 0 320 200" className={`w-full h-full ${animClass}`}>
            <line x1="40" y1="160" x2="260" y2="145" stroke="#334155" strokeWidth="10" strokeLinecap="round" />
            <path d="M70 155 L90 70 L120 70" stroke="#475569" strokeWidth="8" strokeLinecap="round" fill="none" />
            <circle cx="155" cy="55" r="13" fill="#cbd5e1" />
            <line x1="155" y1="68" x2="155" y2="120" stroke="#cbd5e1" strokeWidth="12" strokeLinecap="round" />
            {/* Walking Legs Cadence */}
            <g className="anim-walk">
              <line x1="155" y1="120" x2="140" y2="152" stroke="#38bdf8" strokeWidth="10" strokeLinecap="round" />
              <line x1="155" y1="120" x2="175" y2="150" stroke="#93c5fd" strokeWidth="10" strokeLinecap="round" />
            </g>
            <text x="160" y="186" fill="#94a3b8" fontSize="10" fontWeight="bold" textAnchor="middle">
              Incline Walk: Upright Posture, Arm Swing, Conversation Pace
            </text>
          </svg>
        )

      case 'cardio-bike':
        return (
          <svg viewBox="0 0 320 200" className={`w-full h-full ${animClass}`}>
            <path d="M100 160 L140 100 L180 100 L210 160" stroke="#334155" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <circle cx="160" cy="65" r="13" fill="#cbd5e1" />
            <line x1="160" y1="78" x2="150" y2="125" stroke="#cbd5e1" strokeWidth="12" strokeLinecap="round" />
            {/* Rotating Pedal Cranks */}
            <g className="anim-pedal">
              <circle cx="160" cy="145" r="14" fill="#475569" />
              <line x1="160" y1="135" x2="160" y2="155" stroke="#38bdf8" strokeWidth="4" strokeLinecap="round" />
            </g>
            <text x="160" y="186" fill="#94a3b8" fontSize="10" fontWeight="bold" textAnchor="middle">
              Stationary Bike: Smooth Cadence (70–85 RPM), Low Joint Impact
            </text>
          </svg>
        )

      default:
        return (
          <svg viewBox="0 0 320 200" className={`w-full h-full ${animClass}`}>
            <rect x="40" y="40" width="240" height="120" rx="16" fill="#0f172a" stroke="#334155" strokeWidth="2" />
            <circle cx="160" cy="90" r="30" fill="#38bdf8" fillOpacity="0.1" stroke="#38bdf8" strokeWidth="2" className="anim-muscle" />
            <text x="160" y="145" fill="#cbd5e1" fontSize="11" fontWeight="bold" textAnchor="middle">
              Selectorized Machine Movement
            </text>
            <text x="160" y="186" fill="#64748b" fontSize="10" textAnchor="middle">
              Align joint axes with machine pivot before starting sets
            </text>
          </svg>
        )
    }
  }

  return (
    <div className="flex flex-col rounded-2xl border border-slate-800/80 bg-gradient-to-b from-slate-900 via-[#0d1524] to-[#090d16] overflow-hidden shadow-inner">
      <div className={`p-2 flex items-center justify-center ${className}`}>
        {renderDiagram()}
      </div>

      {/* Cadence & Repetition Phase Indicator with Speed / Pause Controls */}
      {showControls && (
        <div className="bg-[#0b101b] border-t border-slate-800/80 px-3 py-2 flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-[11px] font-semibold text-slate-300">
              {isPlaying ? (isSlowMo ? 'Slow-Motion (0.5x)' : 'Repetition Loop (1x)') : 'Animation Paused'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsSlowMo(!isSlowMo)}
              className={`px-2 py-1 rounded-lg text-[10px] font-bold border transition-colors flex items-center gap-1 ${
                isSlowMo ? 'bg-sky-500/20 text-sky-300 border-sky-500/40' : 'bg-slate-800 text-slate-400 border-slate-700'
              }`}
            >
              <Zap className="w-3 h-3" />
              <span>{isSlowMo ? '0.5x Slow' : '1x Normal'}</span>
            </button>

            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700"
              title={isPlaying ? 'Pause animation' : 'Play animation'}
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
