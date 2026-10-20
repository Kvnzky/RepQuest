import React from 'react'

interface ExerciseVisualProps {
  exerciseId: string
  className?: string
}

export const ExerciseVisual: React.FC<ExerciseVisualProps> = ({ exerciseId, className = 'w-full h-44' }) => {
  // Render specific SVG diagram based on exercise ID
  const renderDiagram = () => {
    switch (exerciseId) {
      // 1. Machine Chest Press
      case 'mach-chest-press':
        return (
          <svg viewBox="0 0 320 200" className="w-full h-full">
            <defs>
              <linearGradient id="cp-grad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#38bdf8" />
                <stop offset="100%" stopColor="#0284c7" />
              </linearGradient>
            </defs>
            {/* Machine frame */}
            <rect x="40" y="30" width="12" height="140" rx="4" fill="#334155" />
            <rect x="40" y="160" width="240" height="10" rx="3" fill="#334155" />
            {/* Weight stack on back */}
            <rect x="48" y="50" width="30" height="90" rx="4" fill="#1e293b" stroke="#475569" strokeWidth="2" />
            <line x1="63" y1="40" x2="63" y2="150" stroke="#94a3b8" strokeWidth="3" />
            {/* Machine seat and backrest pad */}
            <rect x="110" y="65" width="14" height="75" rx="5" fill="#475569" />
            <rect x="110" y="130" width="45" height="12" rx="4" fill="#475569" />
            {/* Seated torso */}
            <circle cx="132" cy="50" r="14" fill="#cbd5e1" />
            <path d="M125 65 L135 125 L160 128 L180 160" stroke="#cbd5e1" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            {/* Chest muscle highlight */}
            <path d="M136 75 C146 75, 152 82, 148 92 C142 98, 134 96, 134 85 Z" fill="#38bdf8" />
            {/* Machine pressing lever arm */}
            <line x1="85" y1="45" x2="160" y2="85" stroke="#64748b" strokeWidth="6" strokeLinecap="round" />
            <rect x="156" y="80" width="8" height="24" rx="3" fill="#38bdf8" />
            {/* Arm pushing forward */}
            <path d="M134 78 L160 88 L185 86" stroke="#93c5fd" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            {/* Motion arrow */}
            <path d="M165 60 L200 60 M195 54 L203 60 L195 66" stroke="#38bdf8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <text x="160" y="185" fill="#94a3b8" fontSize="10" fontWeight="bold" textAnchor="middle">
              Machine Chest Press (Horizontal Press)
            </text>
          </svg>
        )

      // 2. Incline Chest Press Machine
      case 'mach-incline-chest-press':
        return (
          <svg viewBox="0 0 320 200" className="w-full h-full">
            {/* Machine frame */}
            <rect x="35" y="30" width="12" height="140" rx="4" fill="#334155" />
            <rect x="35" y="160" width="250" height="10" rx="3" fill="#334155" />
            {/* 45-degree angled backrest */}
            <line x1="95" y1="135" x2="135" y2="65" stroke="#475569" strokeWidth="14" strokeLinecap="round" />
            <rect x="100" y="132" width="40" height="12" rx="4" fill="#475569" />
            {/* Person sitting at 45 degree incline */}
            <circle cx="145" cy="48" r="13" fill="#cbd5e1" />
            <line x1="132" y1="62" x2="115" y2="130" stroke="#cbd5e1" strokeWidth="12" strokeLinecap="round" />
            <line x1="115" y1="130" x2="155" y2="135" stroke="#cbd5e1" strokeWidth="10" strokeLinecap="round" />
            <line x1="155" y1="135" x2="175" y2="160" stroke="#cbd5e1" strokeWidth="10" strokeLinecap="round" />
            {/* Upper chest muscle highlighted */}
            <circle cx="138" cy="74" r="9" fill="#38bdf8" />
            {/* Arm pressing upward and forward */}
            <path d="M132 72 L165 65 L195 50" stroke="#93c5fd" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            {/* Incline lever handle */}
            <rect x="190" y="42" width="10" height="22" rx="3" fill="#38bdf8" />
            {/* Upward motion arrow */}
            <path d="M180 80 L205 50 M195 48 L207 48 L207 60" stroke="#38bdf8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <text x="160" y="185" fill="#94a3b8" fontSize="10" fontWeight="bold" textAnchor="middle">
              Incline Chest Press (Clavicular Pectoralis Focus)
            </text>
          </svg>
        )

      // 3. Seated Row Machine
      case 'mach-seated-row':
      case 'mach-chest-supported-row':
        return (
          <svg viewBox="0 0 320 200" className="w-full h-full">
            {/* Machine frame */}
            <rect x="240" y="40" width="12" height="130" rx="4" fill="#334155" />
            <rect x="50" y="160" width="220" height="10" rx="3" fill="#334155" />
            {/* Chest support pad facing forward */}
            <rect x="175" y="70" width="12" height="65" rx="4" fill="#475569" />
            <rect x="120" y="130" width="50" height="12" rx="4" fill="#475569" />
            {/* Weight stack in front */}
            <rect x="215" y="60" width="24" height="80" rx="4" fill="#1e293b" stroke="#475569" strokeWidth="2" />
            {/* Torso resting on pad */}
            <circle cx="150" cy="52" r="13" fill="#cbd5e1" />
            <line x1="155" y1="65" x2="155" y2="128" stroke="#cbd5e1" strokeWidth="12" strokeLinecap="round" />
            <path d="M155 128 L180 135 L200 160" stroke="#cbd5e1" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            {/* Back muscles highlighted */}
            <path d="M145 70 C138 75, 138 95, 145 105 Z" fill="#38bdf8" />
            {/* Arm pulling elbow backward */}
            <path d="M155 75 L115 85 L180 88" stroke="#93c5fd" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <rect x="180" y="80" width="8" height="18" rx="2" fill="#38bdf8" />
            {/* Pull backward arrow */}
            <path d="M140 60 L105 60 M113 54 L103 60 L113 66" stroke="#38bdf8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <text x="160" y="185" fill="#94a3b8" fontSize="10" fontWeight="bold" textAnchor="middle">
              Seated Row Machine (Elbows Driving Backward)
            </text>
          </svg>
        )

      // 4. Lat Pulldown Machine
      case 'mach-lat-pulldown':
      case 'mach-neutral-lat-pulldown':
      case 'mach-assisted-pullup':
        return (
          <svg viewBox="0 0 320 200" className="w-full h-full">
            {/* Overhead pulley crane */}
            <path d="M70 170 L70 30 L160 30" stroke="#334155" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            {/* Pulley wheel and cable */}
            <circle cx="160" cy="30" r="10" fill="#64748b" />
            <line x1="160" y1="30" x2="160" y2="60" stroke="#cbd5e1" strokeWidth="3" />
            {/* Wide Lat bar */}
            <line x1="110" y1="62" x2="210" y2="62" stroke="#38bdf8" strokeWidth="7" strokeLinecap="round" />
            {/* Thigh anchor pad and seat */}
            <rect x="140" y="115" width="40" height="12" rx="4" fill="#475569" />
            <rect x="130" y="135" width="45" height="12" rx="4" fill="#475569" />
            {/* Person seated tall */}
            <circle cx="158" cy="75" r="13" fill="#cbd5e1" />
            <line x1="158" y1="88" x2="152" y2="135" stroke="#cbd5e1" strokeWidth="12" strokeLinecap="round" />
            <path d="M152 135 L175 130 L185 165" stroke="#cbd5e1" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            {/* Latissimus Dorsi muscle wings highlighted */}
            <path d="M148 90 C138 95, 138 115, 150 120 Z" fill="#38bdf8" />
            <path d="M162 90 C172 95, 172 115, 160 120 Z" fill="#38bdf8" />
            {/* Arms reaching up gripping bar */}
            <path d="M152 90 L130 78 L125 65" stroke="#93c5fd" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <path d="M164 90 L185 78 L195 65" stroke="#93c5fd" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            {/* Downward pull arrows */}
            <path d="M120 75 L120 100 M115 93 L120 102 L125 93" stroke="#38bdf8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <path d="M200 75 L200 100 M195 93 L200 102 L205 93" stroke="#38bdf8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <text x="160" y="185" fill="#94a3b8" fontSize="10" fontWeight="bold" textAnchor="middle">
              Lat Pulldown (Pull Down to Upper Chest Collarbones)
            </text>
          </svg>
        )

      // 5. Machine Shoulder Press
      case 'mach-shoulder-press':
        return (
          <svg viewBox="0 0 320 200" className="w-full h-full">
            {/* Machine frame */}
            <rect x="50" y="30" width="12" height="140" rx="4" fill="#334155" />
            <rect x="50" y="160" width="220" height="10" rx="3" fill="#334155" />
            {/* Upright backrest & seat */}
            <rect x="125" y="60" width="12" height="75" rx="4" fill="#475569" />
            <rect x="125" y="130" width="45" height="12" rx="4" fill="#475569" />
            {/* Person sitting upright */}
            <circle cx="145" cy="45" r="13" fill="#cbd5e1" />
            <line x1="145" y1="58" x2="145" y2="130" stroke="#cbd5e1" strokeWidth="12" strokeLinecap="round" />
            <path d="M145 130 L175 133 L185 160" stroke="#cbd5e1" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            {/* Deltoid shoulder caps highlighted */}
            <circle cx="145" cy="62" r="9" fill="#38bdf8" />
            {/* Overhead handles & arms pressing straight up */}
            <path d="M145 65 L170 50 L168 30" stroke="#93c5fd" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <rect x="160" y="24" width="16" height="8" rx="2" fill="#38bdf8" />
            {/* Upward motion arrow */}
            <path d="M185 55 L185 25 M180 32 L185 23 L190 32" stroke="#38bdf8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <text x="160" y="185" fill="#94a3b8" fontSize="10" fontWeight="bold" textAnchor="middle">
              Machine Shoulder Press (Overhead Press Trajectory)
            </text>
          </svg>
        )

      // 6. Lateral Raise Machine / Reverse Pec Deck
      case 'mach-lateral-raise':
      case 'mach-reverse-pec-deck':
        return (
          <svg viewBox="0 0 320 200" className="w-full h-full">
            <rect x="60" y="160" width="200" height="10" rx="3" fill="#334155" />
            <rect x="145" y="80" width="30" height="80" rx="5" fill="#475569" />
            <circle cx="160" cy="50" r="14" fill="#cbd5e1" />
            <line x1="160" y1="64" x2="160" y2="125" stroke="#cbd5e1" strokeWidth="14" strokeLinecap="round" />
            {/* Shoulder caps */}
            <circle cx="145" cy="72" r="8" fill="#38bdf8" />
            <circle cx="175" cy="72" r="8" fill="#38bdf8" />
            {/* Arms lifting out to sides to 90 degrees */}
            <path d="M145 72 L110 72 L95 85" stroke="#93c5fd" strokeWidth="8" strokeLinecap="round" fill="none" />
            <path d="M175 72 L210 72 L225 85" stroke="#93c5fd" strokeWidth="8" strokeLinecap="round" fill="none" />
            {/* Machine lever pads */}
            <rect x="100" y="68" width="15" height="12" rx="3" fill="#38bdf8" />
            <rect x="205" y="68" width="15" height="12" rx="3" fill="#38bdf8" />
            {/* Arc motion arrows */}
            <path d="M85 105 C85 85, 95 65, 115 58" stroke="#38bdf8" strokeWidth="2.5" strokeLinecap="round" fill="none" />
            <path d="M235 105 C235 85, 225 65, 205 58" stroke="#38bdf8" strokeWidth="2.5" strokeLinecap="round" fill="none" />
            <text x="160" y="185" fill="#94a3b8" fontSize="10" fontWeight="bold" textAnchor="middle">
              Side & Rear Deltoid Machine (Abduction Arc)
            </text>
          </svg>
        )

      // 7. Arms: Biceps Curl & Triceps Pushdown
      case 'mach-biceps-curl':
      case 'cable-triceps-pushdown':
        return (
          <svg viewBox="0 0 320 200" className="w-full h-full">
            {/* Arm focus illustration */}
            <rect x="60" y="160" width="200" height="10" rx="3" fill="#334155" />
            {/* Preacher incline pad */}
            <path d="M130 140 L165 95 L180 95 L145 140 Z" fill="#475569" />
            <circle cx="125" cy="65" r="13" fill="#cbd5e1" />
            <line x1="125" y1="78" x2="135" y2="135" stroke="#cbd5e1" strokeWidth="12" strokeLinecap="round" />
            {/* Upper arm rested on pad */}
            <line x1="135" y1="85" x2="165" y2="105" stroke="#cbd5e1" strokeWidth="9" strokeLinecap="round" />
            {/* Biceps muscle bulge highlighted */}
            <ellipse cx="150" cy="92" rx="10" ry="7" fill="#38bdf8" transform="rotate(-30 150 92)" />
            {/* Forearm curling upward */}
            <line x1="165" y1="105" x2="152" y2="70" stroke="#93c5fd" strokeWidth="8" strokeLinecap="round" />
            <rect x="146" y="65" width="12" height="10" rx="2" fill="#38bdf8" />
            {/* Curl arrow */}
            <path d="M175 110 C185 95, 175 75, 160 68 M167 65 L158 68 L165 74" stroke="#38bdf8" strokeWidth="2.5" strokeLinecap="round" fill="none" />
            <text x="160" y="185" fill="#94a3b8" fontSize="10" fontWeight="bold" textAnchor="middle">
              Arm Isolation: Elbow Joint Pinned for Strict Tension
            </text>
          </svg>
        )

      // 8. Leg Press Machine (45 Degree Sled)
      case 'mach-leg-press':
        return (
          <svg viewBox="0 0 320 200" className="w-full h-full">
            {/* Sled rail at 45 degree angle */}
            <line x1="50" y1="160" x2="270" y2="40" stroke="#334155" strokeWidth="8" strokeLinecap="round" />
            <rect x="50" y="160" width="230" height="10" rx="3" fill="#334155" />
            {/* Angled seat bucket at bottom */}
            <path d="M65 145 L85 115 L105 135" stroke="#475569" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            {/* Person sitting in sled */}
            <circle cx="75" cy="105" r="12" fill="#cbd5e1" />
            <path d="M82 116 L95 130" stroke="#cbd5e1" strokeWidth="11" strokeLinecap="round" />
            {/* Glutes & Hips */}
            <circle cx="98" cy="132" r="8" fill="#38bdf8" />
            {/* Thigh (Quadriceps) highlighted */}
            <line x1="98" y1="132" x2="140" y2="95" stroke="#38bdf8" strokeWidth="10" strokeLinecap="round" />
            {/* Lower leg extending to footplate */}
            <line x1="140" y1="95" x2="190" y2="85" stroke="#93c5fd" strokeWidth="8" strokeLinecap="round" />
            {/* Sled Footplate */}
            <rect x="188" y="70" width="12" height="36" rx="3" fill="#64748b" transform="rotate(-30 194 88)" />
            {/* Heavy weight plates on sled */}
            <circle cx="210" cy="70" r="14" fill="#1e293b" stroke="#38bdf8" strokeWidth="3" />
            <circle cx="218" cy="65" r="14" fill="#1e293b" stroke="#38bdf8" strokeWidth="3" />
            {/* Push direction arrow */}
            <path d="M150 75 L185 55 M177 54 L187 54 L186 64" stroke="#38bdf8" strokeWidth="2.5" strokeLinecap="round" fill="none" />
            <text x="160" y="185" fill="#94a3b8" fontSize="10" fontWeight="bold" textAnchor="middle">
              Leg Press (Push Sled Away; Never Lock Knees at Apex)
            </text>
          </svg>
        )

      // 9. Hack Squat Machine
      case 'mach-hack-squat':
        return (
          <svg viewBox="0 0 320 200" className="w-full h-full">
            {/* Incline linear guide rail */}
            <line x1="80" y1="165" x2="240" y2="35" stroke="#334155" strokeWidth="8" strokeLinecap="round" />
            {/* Foot platform */}
            <rect x="65" y="155" width="50" height="12" rx="3" fill="#64748b" transform="rotate(-15 90 161)" />
            {/* Sliding carriage back pad & shoulder pads */}
            <line x1="150" y1="105" x2="185" y2="75" stroke="#475569" strokeWidth="14" strokeLinecap="round" />
            <rect x="180" y="65" width="20" height="12" rx="3" fill="#64748b" />
            {/* Person in hack squat */}
            <circle cx="195" cy="55" r="12" fill="#cbd5e1" />
            <line x1="185" y1="75" x2="155" y2="102" stroke="#cbd5e1" strokeWidth="11" strokeLinecap="round" />
            {/* Quads and knees descending */}
            <line x1="155" y1="102" x2="125" y2="125" stroke="#38bdf8" strokeWidth="11" strokeLinecap="round" />
            <line x1="125" y1="125" x2="95" y2="155" stroke="#93c5fd" strokeWidth="9" strokeLinecap="round" />
            {/* Motion arrow */}
            <path d="M175 115 L200 95 M192 95 L202 93 L200 103" stroke="#38bdf8" strokeWidth="2.5" strokeLinecap="round" fill="none" />
            <text x="160" y="185" fill="#94a3b8" fontSize="10" fontWeight="bold" textAnchor="middle">
              Hack Squat Machine (Quadriceps Loaded Squat Path)
            </text>
          </svg>
        )

      // 10. Seated Leg Curl & Leg Extension
      case 'mach-seated-leg-curl':
      case 'mach-leg-extension':
        return (
          <svg viewBox="0 0 320 200" className="w-full h-full">
            <rect x="50" y="160" width="220" height="10" rx="3" fill="#334155" />
            <rect x="100" y="70" width="14" height="70" rx="4" fill="#475569" />
            <rect x="100" y="125" width="55" height="14" rx="4" fill="#475569" />
            <circle cx="120" cy="52" r="13" fill="#cbd5e1" />
            <line x1="120" y1="65" x2="120" y2="125" stroke="#cbd5e1" strokeWidth="12" strokeLinecap="round" />
            {/* Thigh flat on seat */}
            <line x1="120" y1="125" x2="160" y2="125" stroke="#38bdf8" strokeWidth="11" strokeLinecap="round" />
            {/* Leg Curl/Extension Pivot Joint */}
            <circle cx="160" cy="125" r="7" fill="#f59e0b" />
            {/* Lower leg */}
            <line x1="160" y1="125" x2="165" y2="160" stroke="#93c5fd" strokeWidth="9" strokeLinecap="round" />
            <rect x="155" y="150" width="18" height="10" rx="3" fill="#38bdf8" />
            {/* Curl/Extension arc indicator */}
            <path d="M180 135 C185 145, 175 160, 155 162 M163 158 L154 163 L162 167" stroke="#38bdf8" strokeWidth="2.5" strokeLinecap="round" fill="none" />
            <text x="160" y="185" fill="#94a3b8" fontSize="10" fontWeight="bold" textAnchor="middle">
              Leg Curl / Extension (Align Knee Joint with Machine Pivot)
            </text>
          </svg>
        )

      // 11. Glute Drive Machine & Bridge
      case 'mach-glute-drive':
      case 'bw-glute-bridge':
        return (
          <svg viewBox="0 0 320 200" className="w-full h-full">
            <rect x="50" y="160" width="220" height="10" rx="3" fill="#334155" />
            {/* Upper back pivot bench */}
            <rect x="90" y="105" width="30" height="30" rx="6" fill="#475569" />
            {/* Feet planted flat */}
            <rect x="200" y="155" width="30" height="8" rx="2" fill="#64748b" />
            {/* Bridged body position */}
            <circle cx="95" cy="95" r="12" fill="#cbd5e1" />
            <line x1="105" y1="105" x2="155" y2="105" stroke="#cbd5e1" strokeWidth="11" strokeLinecap="round" />
            {/* Glutes highlighted in full extension */}
            <circle cx="155" cy="105" r="10" fill="#38bdf8" />
            <line x1="155" y1="105" x2="210" y2="155" stroke="#93c5fd" strokeWidth="10" strokeLinecap="round" />
            {/* Belt pad across hips */}
            <rect x="145" y="98" width="18" height="8" rx="2" fill="#f59e0b" />
            {/* Upward thrust arrow */}
            <path d="M155 130 L155 85 M150 93 L155 83 L160 93" stroke="#38bdf8" strokeWidth="2.5" strokeLinecap="round" fill="none" />
            <text x="160" y="185" fill="#94a3b8" fontSize="10" fontWeight="bold" textAnchor="middle">
              Glute Drive (Thrust Hips Up to Full Glute Contraction)
            </text>
          </svg>
        )

      // 12. Ab Crunch Machine & Pallof Press
      case 'mach-ab-crunch':
      case 'cable-pallof-press':
        return (
          <svg viewBox="0 0 320 200" className="w-full h-full">
            <rect x="50" y="160" width="220" height="10" rx="3" fill="#334155" />
            <rect x="110" y="125" width="45" height="12" rx="4" fill="#475569" />
            <circle cx="135" cy="65" r="13" fill="#cbd5e1" />
            {/* Curled spine */}
            <path d="M135 78 C120 90, 120 115, 130 128" stroke="#cbd5e1" strokeWidth="12" strokeLinecap="round" fill="none" />
            {/* Abdominal wall rectus abdominis highlighted */}
            <path d="M132 85 C125 95, 125 110, 130 120" stroke="#38bdf8" strokeWidth="6" strokeLinecap="round" fill="none" />
            {/* Machine crunch handles */}
            <path d="M135 75 L150 90 L140 105" stroke="#93c5fd" strokeWidth="7" strokeLinecap="round" fill="none" />
            <rect x="135" y="98" width="10" height="14" rx="2" fill="#38bdf8" />
            {/* Downward curling arrow */}
            <path d="M155 70 C165 85, 160 105, 145 115 M152 113 L143 116 L147 107" stroke="#38bdf8" strokeWidth="2.5" strokeLinecap="round" fill="none" />
            <text x="160" y="185" fill="#94a3b8" fontSize="10" fontWeight="bold" textAnchor="middle">
              Core: Curl Ribcage Toward Pelvis (Do Not Yank Neck)
            </text>
          </svg>
        )

      // Default: Universal Anytime Fitness machine selectorized icon
      default:
        return (
          <svg viewBox="0 0 320 200" className="w-full h-full">
            <rect x="40" y="40" width="240" height="120" rx="16" fill="#0f172a" stroke="#334155" strokeWidth="2" />
            <circle cx="160" cy="90" r="30" fill="#38bdf8" fillOpacity="0.1" stroke="#38bdf8" strokeWidth="2" strokeDasharray="4 4" />
            <path d="M140 90 L180 90 M150 80 L140 90 L150 100 M170 80 L180 90 L170 100" stroke="#38bdf8" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            <text x="160" y="145" fill="#cbd5e1" fontSize="11" fontWeight="bold" textAnchor="middle">
              Anytime Fitness Machine Guidance
            </text>
            <text x="160" y="185" fill="#64748b" fontSize="10" textAnchor="middle">
              Adjust seat pins to align joint axes before beginning
            </text>
          </svg>
        )
    }
  }

  return (
    <div className={`bg-gradient-to-b from-slate-900 via-[#0d1524] to-[#090d16] rounded-2xl border border-slate-800/80 p-2 flex items-center justify-center overflow-hidden shadow-inner ${className}`}>
      {renderDiagram()}
    </div>
  )
}
