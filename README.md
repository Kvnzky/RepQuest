# Kinetiq — Personalized Gym Companion & 8-Week Recomposition Engine

> **A high-performance, offline-first Progressive Web App (PWA) tailored for Anytime Fitness workouts, progressive machine training, set logging, rest timing, body recomposition metrics, and nutrition tracking.**

---

## 1. App Name & Branding Rationale

### Five Curated Name Candidates
1. **Kinetiq** *(Recommended & Default)* — Derived from *kinetic* (the energy of bodily motion) and *intelligent tracking*. Short, memorable, modern, and focused on biomechanical progression and precision.
2. **FormaFit** — Emphasizes posture, machine ergonomics, and movement execution.
3. **PulseRecomp** — Direct focus on body recomposition and steady rhythm.
4. **IronPace** — Evokes measured, unhurried strength progression with steady overload.
5. **AuraGym** — Modern, mindful personal pocket companion.

### Branding Architecture
All branding parameters (app name, short name, tagline, subtitle, theme, and accent colors) are managed centrally in `src/config/branding.ts` and stored in IndexedDB. Users can switch name suggestions or define a custom name directly within **Settings** without touching multiple files.

*Note: This application is an independent training companion designed for use at Anytime Fitness and is not affiliated with or endorsed by Anytime Fitness.*

---

## 2. Core Features & Capabilities

### 📱 Distraction-Free Workout Mode
- **Optimized for One-Hand Mobile Use:** High-contrast tap buttons, large numerical readouts, and minimal scrolling during active sets.
- **Warm-Up Guidance:** Structured 5–8 min cardio warmup (treadmill or stationary bike) + dynamic joint mobility + practice sets. Warm-up sets are clearly distinguished from working sets and excluded from working volume calculations.
- **Set Logging:** Instant logging with weight (kg/lbs), reps, and Reps in Reserve (RIR / RPE). Includes double-tap debounce prevention and undo controls.
- **Machine Substitution:** One-tap equipment swap if a machine is occupied, out of order, or uncomfortable. Automatically suggests biomechanically aligned alternatives without mutating original program templates.
- **Session Recovery:** In-progress workouts persist to IndexedDB immediately after every set. Browser refreshes, phone orientation changes, or lock-screen interruptions will never lose active workout progress.

### ⏱️ Resilient Rest Timer
- **Absolute Timestamp Architecture:** Uses `targetEndTime = Date.now() + durationMs` to calculate remaining time upon foreground wake-up, ensuring the countdown stays accurate even if backgrounded or locked.
- **Synthesized Audio Bell:** Employs the Web Audio API to synthesize clean warning countdown ticks (3, 2, 1) and a double chime bell tone. Operates **100% offline with zero external audio file dependencies**.
- **Haptic Vibration:** Uses `navigator.vibrate` on supported devices.
- **Automatic or Manual Modes:** Configurable auto-start upon set completion with quick `+15s`, `+30s`, `+60s` extension buttons.

### 📈 8-Week Body Recomposition Progression Engine
- **Deterministic, Explainable Rules:** Programmed progression logic based on logged performance and sleep recovery:
  - **Weeks 1–2 (Re-entry):** 1–2 working sets, 3–4 RIR, focus on machine ergonomics. No failure lifting.
  - **Weeks 3–4 (Consistency):** 2 working sets, 2–3 RIR, expanding repetition capacity toward 12 reps.
  - **Weeks 5–6 (Progressive Overload):** 2–3 working sets. Suggests smallest practical increment (e.g. +2.5 kg on upper body, +5 kg on lower body) when 12 reps are completed across all sets with clean form.
  - **Weeks 7–8 (Consolidation):** Evaluates fatigue, adherence, waist circumference, and weight trends to recommend sustainable maintenance or deload.
- **Sleep & Recovery Guardrail:** When sleep averages under 6 hours, the engine issues an under-recovery advisory recommending maintaining current loads to protect connective tissues.

### 🥗 Nutrition & Hydration Tracker
- **Philippine Meal Catalog:** Built-in starter database with approximate values for Grilled Chicken Inasal, Grilled Bangus (Milkfish), Steamed Tilapia, Canned Tuna in water, Boiled Eggs, Tokwa (Tofu), Ginisang Monggo, Bistek Tagalog, White & Brown Rice, Kamote, Low-Fat Milk, Greek Yogurt, and fresh fruit.
- **Balanced Guidance:** Does not demonize carbohydrates or mandate eliminating rice; guides balanced portions paired with high protein.
- **Custom Food Creator:** Easily add personal foods and recipes.
- **Quick Hydration:** Fast `+250ml`, `+500ml`, `+750ml` water buttons against an editable daily target (default: 3,000 ml).

### 📊 Progress Analytics & Private Photo Vault
- **Visual Trends:** High-performance dark-mode SVG charts for Body Weight, Waist Circumference, Machine-Specific Strength Progression, and 7-day Protein Adherence.
- **Circumference Log:** Track waist, chest, arms, hips, and thighs over time.
- **Private Photo Gallery:** Store front, side, and back progress photos locally as base64 data URLs in IndexedDB. Photos are **never uploaded to any server or cloud**.

### 🔒 Privacy, Backup & Offline PWA
- **Local-First Persistence:** Full IndexedDB storage via Dexie.js. Zero mandatory cloud accounts, no third-party tracking, and zero subscription paywalls.
- **Full Data Portability:** Single-click JSON backup export and validated JSON import with replace or merge options.
- **Safety Disclaimer:** Prominent medical and fitness guardrails outlining stop signals, joint alignment cues, and spot reduction realities.

---

## 3. Preconfigured User Profile

The app comes preconfigured with the requested baseline:
- **Age:** 38 | **Sex:** Male | **Height:** 170 cm
- **Current Weight:** 78.0 kg | **Goal Weight:** 72.0 kg
- **Current Waist:** 94.0 cm
- **Experience:** Beginner (returning after 7-month training break)
- **Primary Goal:** Body recomposition (reduce abdominal fat, preserve/build muscle)
- **Home Gym:** Anytime Fitness
- **Availability:** 5 gym visits per week | **Max Duration:** ~60 minutes
- **Preferred Equipment:** Selectorized machines, cable towers, treadmill, stationary bike
- **Average Sleep:** 5.5 hours (< 6 hours recorded; recovery alerts active)
- *All details and targets are fully editable in the Settings tab.*

---

## 4. Default 8-Week Weekly Routine

| Day | Workout Session | Primary Focus & Exercises |
| :--- | :--- | :--- |
| **Mon** | **Workout A: Upper Body A** | Chest Press, Seated Row, Lat Pulldown, Shoulder Press, Biceps Curl, Triceps Pushdown |
| **Tue** | **Workout B: Lower Body A + Core** | Leg Press, Seated Leg Curl, Leg Extension, Calf Raise, Ab Crunch Machine, Cable Pallof Press |
| **Wed** | **Workout C: Cardio + Mobility** | Incline Treadmill Walk / Bike (20–30 min) + Hip 90/90, Ankle & Thoracic Drills |
| **Thu** | **Workout D: Upper Body B** | Incline Chest Press, Neutral Lat Pulldown, Chest-Supported Row, Reverse Pec Deck, Lateral Raise, Biceps Curl |
| **Fri** | **Workout E: Lower Body B + Core** | Hack Squat, Seated Leg Curl, Glute Drive Machine, Leg Extension, Ab Crunch Machine, Cable Pallof Press |
| **Sat** | **Active Recovery** | Rest or optional easy walking (3,000–5,000 steps) |
| **Sun** | **Full Rest** | Mental replenishment, sleep priority, weekly reflection review |

---

## 5. Technology Stack

- **Frontend Framework:** React 19 + TypeScript
- **Build Tool & Bundler:** Vite 8
- **Styling System:** Tailwind CSS v4
- **Database & Storage:** Dexie.js (IndexedDB wrapper) + `dexie-react-hooks`
- **PWA & Offline Shell:** `vite-plugin-pwa` + custom cache-first Service Worker + Web App Manifest
- **Audio Synthesis:** Web Audio API (`AudioContext`, OscillatorNode, GainNode)
- **Icons:** Lucide React
- **Test Runner:** Vitest

---

## 6. Repository Structure

```text
├── public/
│   ├── gym-icon.svg             # Vector application branding icon
│   ├── pwa-192x192.png          # 192x192 PWA launcher icon
│   ├── pwa-512x512.png          # 512x512 PWA launcher icon
│   ├── apple-touch-icon.png     # iOS home screen touch icon
│   ├── manifest.webmanifest     # Web App Manifest
│   └── sw.js                    # Offline-first Service Worker
├── scripts/
│   └── generate-icons.js        # Script generating PNG icons from canvas/buffers
├── src/
│   ├── components/
│   │   ├── common/
│   │   │   ├── Header.tsx       # Top bar with week indicator & active workout status
│   │   │   ├── BottomNav.tsx    # 5-tab persistent bottom navigation
│   │   │   └── Charts.tsx       # Zero-dependency SVG trend & consistency charts
│   │   ├── home/
│   │   │   └── HomeDashboard.tsx # Daily hub, quick logs, weekly consistency dots
│   │   ├── workout/
│   │   │   ├── WorkoutMode.tsx  # Distraction-free gym set logging interface
│   │   │   ├── WorkoutsTab.tsx  # Weekly schedule, phase selector, catalog browser
│   │   │   ├── RestTimerModal.tsx # Radial countdown with Web Audio chime
│   │   │   ├── ExerciseDetailModal.tsx # Setup instructions, execution, breathing
│   │   │   ├── MachineSubstituteModal.tsx # Fast occupied-machine replacements
│   │   │   └── WorkoutSummaryModal.tsx # Session volume, duration, PBs & ratings
│   │   ├── progress/
│   │   │   └── ProgressTab.tsx  # Weight & waist graphs, machine strength, photos
│   │   ├── nutrition/
│   │   │   └── NutritionTab.tsx # Philippine meals, macros, water, custom foods
│   │   └── settings/
│   │       ├── SettingsTab.tsx  # Profile, units, timer, data export/import
│   │       └── SafetyDisclaimerModal.tsx # Medical & safety guardrails
│   ├── config/
│   │   └── branding.ts          # Central branding configuration & name options
│   ├── data/
│   │   ├── exercises.ts         # Complete exercise catalog with setup & cues
│   │   ├── templates.ts         # 8-week workout program templates & warmups
│   │   ├── nutrition.ts         # Philippine food starter database
│   │   └── reminders.ts         # Habit & weigh-in reminder definitions
│   ├── db/
│   │   ├── index.ts             # Dexie database class, migrations, export/import
│   │   └── db.test.ts           # Database model & backup verification tests
│   ├── types/
│   │   └── index.ts             # Strict TypeScript data models & interfaces
│   ├── utils/
│   │   ├── audioTimer.ts        # Pure Web Audio chime & vibration synthesizer
│   │   ├── progressionEngine.ts # Deterministic progression & sleep rule engine
│   │   └── progressionEngine.test.ts # Progression rule unit tests
│   ├── App.tsx                  # Root state orchestration & router
│   ├── index.css                # Tailwind v4 styles & safe-area insets
│   └── main.tsx                 # React DOM mount & Service Worker registration
├── package.json
├── tsconfig.json
├── tsconfig.app.json
├── vite.config.ts
└── README.md
```

---

## 7. Installation & Local Development

### Prerequisites
- Node.js (version 18 or newer; recommended: 20+ or 24+)
- npm or pnpm

### 1. Install Dependencies
```bash
npm install
```

### 2. Run the Development Server
```bash
npm run dev
```
Open `http://localhost:5173` in your browser.

### 3. Run Automated Tests
```bash
npm test
```
Executes Vitest unit tests covering progression rules, sleep recovery advisories, data models, and JSON backup imports.

### 4. Build for Production
```bash
npm run build
```
Generates an optimized, minified production build in the `dist/` directory with precached assets, service worker, and web app manifest.

### 5. Preview the Production Build Locally
```bash
npm run preview
```

---

## 8. Installing as a PWA on Mobile Devices

Kinetiq is built to run as a native-like app on your smartphone without an app store download.

### On Android (Chrome / Edge / Samsung Internet):
1. Open the deployed application URL in Chrome.
2. Tap the browser menu (**⋮**) in the top-right corner.
3. Tap **"Install app"** or **"Add to Home screen"**.
4. Confirm installation. The Kinetiq icon will appear on your phone's home screen and app drawer, opening in standalone full-screen mode without browser address bars.

### On iOS (Apple Safari):
1. Open the deployed application URL in Safari.
2. Tap the **Share** button (box with an upward arrow) at the bottom toolbar.
3. Scroll down and tap **"Add to Home Screen"**.
4. Tap **"Add"** in the top-right corner.
5. Launch Kinetiq directly from your home screen. It will open in standalone mode with full safe-area support for notches and dynamic islands.

---

## 9. Offline Behavior & Limitations

- **100% Offline Core Functionality:** After initial loading, the complete app shell, workout schedule, exercise catalog, set logging, rest timer, weight tracking, nutrition logs, and SVG progress charts function without an active internet connection.
- **Audio Chimes Offline:** Rest timer sound effects use on-device Web Audio oscillator synthesis rather than audio streaming, guaranteeing chimes sound even in gym basement dead zones.
- **External Video Demonstrations:** Video previews linked to external video services require an active cellular/Wi-Fi connection. Step-by-step text instructions, breathing cues, and machine setup guides remain fully accessible offline.
- **OS Background Restrictions:** Mobile operating systems (especially iOS Safari) throttle background timers and audio when the screen is locked. Kinetiq resolves this by using absolute timestamps (`targetEndTime = Date.now() + ms`) to instantly recalculate remaining rest the millisecond you reopen or wake your device.
- **Storage Durability:** All records reside in browser IndexedDB. While persistent, users are encouraged to use the **Settings > Export Backup** feature periodically to store a copy of their progress file.

---

## 10. Data Backup & Restore

### Exporting Your Data
1. Navigate to **Settings** (gear icon in the bottom navigation).
2. Under **Offline Data Management**, tap **"Export Backup"**.
3. A versioned JSON file (`kinetiq-gym-backup-[timestamp].json`) will be downloaded to your device containing all user metrics, sessions, sets, photos, and custom foods.

### Importing or Restoring
1. In **Settings**, tap **"Import Backup"**.
2. Select your previously downloaded backup JSON file.
3. The app validates the version schema and restores your records into IndexedDB.

---

## 11. Deployment Instructions

Kinetiq compiles to static files in `dist/` and can be hosted on any HTTPS-enabled static hosting platform.

### Deploying to Cloudflare Pages:
```bash
# Build command:
npm run build

# Output directory:
dist
```

### Deploying to Vercel:
1. Import the Git repository in Vercel.
2. Framework Preset: **Vite**
3. Build Command: `npm run build`
4. Output Directory: `dist`

### Deploying to Netlify:
Create a `netlify.toml` or set in the Netlify Dashboard:
- Build command: `npm run build`
- Publish directory: `dist`

---

## 12. Safety & Medical Notice

The workout and nutrition suggestions provided in Kinetiq are for general physical conditioning and educational purposes only. Always consult a qualified medical professional before starting any new training or nutrition regimen, especially following an extended training hiatus. If you experience dizziness, sharp pain, chest discomfort, or shortness of breath, stop exercising immediately.
