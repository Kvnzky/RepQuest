import { ReminderSetting } from '../types'

export const DEFAULT_REMINDERS: ReminderSetting[] = [
  {
    id: 'reminder-workout',
    title: 'Workout Session',
    category: 'workout',
    time: '07:00',
    daysOfWeek: [1, 2, 3, 4, 5], // Mon to Fri
    enabled: true
  },
  {
    id: 'reminder-weigh-in',
    title: 'Morning Body Weigh-In',
    category: 'weigh_in',
    time: '07:15',
    daysOfWeek: [1, 5], // Mon and Fri
    enabled: true
  },
  {
    id: 'reminder-waist',
    title: 'Weekly Waist Circumference',
    category: 'waist',
    time: '07:20',
    daysOfWeek: [1], // Monday
    enabled: true
  },
  {
    id: 'reminder-water-midday',
    title: 'Hydration Check (Drink 500ml)',
    category: 'water',
    time: '11:00',
    daysOfWeek: [0, 1, 2, 3, 4, 5, 6],
    enabled: true
  },
  {
    id: 'reminder-protein-evening',
    title: 'Protein Target Check (140g Goal)',
    category: 'protein',
    time: '20:00',
    daysOfWeek: [0, 1, 2, 3, 4, 5, 6],
    enabled: true
  },
  {
    id: 'reminder-sleep-routine',
    title: 'Sleep Wind-Down (Target 7+ hrs)',
    category: 'sleep',
    time: '22:30',
    daysOfWeek: [0, 1, 2, 3, 4, 5, 6],
    enabled: true
  },
  {
    id: 'reminder-weekly-review',
    title: 'Weekly Recomp & Recovery Review',
    category: 'weekly_review',
    time: '18:00',
    daysOfWeek: [0], // Sunday
    enabled: true
  }
]
