import React from 'react'
import { Home, Dumbbell, TrendingUp, UtensilsCrossed, Settings, LucideIcon } from 'lucide-react'

export type TabType = 'home' | 'workouts' | 'progress' | 'nutrition' | 'settings'

interface NavTabItem {
  id: TabType
  label: string
  icon: LucideIcon
  hasBadge?: boolean
}

interface BottomNavProps {
  activeTab: TabType
  onTabChange: (tab: TabType) => void
  hasActiveWorkout?: boolean
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onTabChange,
  hasActiveWorkout
}) => {
  const tabs: NavTabItem[] = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'workouts', label: 'Workouts', icon: Dumbbell, hasBadge: hasActiveWorkout },
    { id: 'progress', label: 'Progress', icon: TrendingUp },
    { id: 'nutrition', label: 'Nutrition', icon: UtensilsCrossed },
    { id: 'settings', label: 'Settings', icon: Settings }
  ]

  return (
    <nav
      aria-label="Bottom Navigation"
      className="fixed bottom-0 left-0 right-0 z-40 bg-[#090d16]/95 backdrop-blur-lg border-t border-slate-800/80 px-2 pb-[max(env(safe-area-inset-bottom),0.5rem)] pt-1"
    >
      <div className="max-w-md mx-auto flex items-center justify-around">
        {tabs.map((tab) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`relative flex flex-col items-center justify-center py-2 px-3 min-w-[56px] min-h-[50px] rounded-xl transition-all ${
                isActive
                  ? 'text-sky-400 font-semibold scale-105'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              aria-current={isActive ? 'page' : undefined}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 transition-transform ${isActive ? 'stroke-[2.5px]' : 'stroke-2'}`} />
                {tab.hasBadge && (
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-sky-400 rounded-full animate-ping" />
                )}
              </div>
              <span className="text-[10px] mt-1 tracking-tight leading-none">{tab.label}</span>
              {isActive && (
                <span className="absolute bottom-0 w-6 h-0.5 bg-sky-400 rounded-full" />
              )}
            </button>
          )
        })}
      </div>
    </nav>
  )
}
