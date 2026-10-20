import React, { useState } from 'react'
import {
  Utensils,
  Plus,
  Trash2,
  Droplet,
  Search,
  Sparkles,
  Check,
  X,
  PieChart,
  Flame,
  Info
} from 'lucide-react'
import {
  NutritionEntry,
  FoodItem,
  WaterEntry,
  AppSettings,
  MealType
} from '../../types'

interface NutritionTabProps {
  appSettings: AppSettings
  nutritionEntries: NutritionEntry[]
  waterEntries: WaterEntry[]
  customFoods: FoodItem[]
  onAddNutritionEntry: (entry: Omit<NutritionEntry, 'id'>) => void
  onDeleteNutritionEntry: (id: string) => void
  onAddCustomFood: (food: FoodItem) => void
  onAddWater: (amountMl: number) => void
  onDeleteWater: (id: string) => void
  onUpdateTargets: (proteinTargetG: number, calorieTarget: number, waterTargetMl: number) => void
}

export const NutritionTab: React.FC<NutritionTabProps> = ({
  appSettings,
  nutritionEntries,
  waterEntries,
  customFoods,
  onAddNutritionEntry,
  onDeleteNutritionEntry,
  onAddCustomFood,
  onAddWater,
  onDeleteWater,
  onUpdateTargets
}) => {
  const [selectedMealType, setSelectedMealType] = useState<MealType>('lunch')
  const [showAddFoodModal, setShowAddFoodModal] = useState<boolean>(false)
  const [showCustomFoodModal, setShowCustomFoodModal] = useState<boolean>(false)
  const [showTargetsModal, setShowTargetsModal] = useState<boolean>(false)
  const [searchQuery, setSearchQuery] = useState<string>('')

  // Quick targets modal state
  const [editProteinTarget, setEditProteinTarget] = useState<number>(appSettings.dailyProteinTargetG || 140)
  const [editCalorieTarget, setEditCalorieTarget] = useState<number>(appSettings.dailyCalorieTarget || 2100)
  const [editWaterTarget, setEditWaterTarget] = useState<number>(appSettings.dailyWaterTargetMl || 3000)

  // Custom food form
  const [customName, setCustomName] = useState<string>('')
  const [customServing, setCustomServing] = useState<string>('1 serving')
  const [customCalories, setCustomCalories] = useState<number>(150)
  const [customProtein, setCustomProtein] = useState<number>(20)
  const [customCarbs, setCustomCarbs] = useState<number>(10)
  const [customFat, setCustomFat] = useState<number>(3)

  // Today's date filter
  const today = new Date().toISOString().split('T')[0]
  const todaysEntries = nutritionEntries.filter(n => n.date === today)
  const todaysWater = waterEntries.filter(w => w.date === today)

  // Totals
  const totalCalories = todaysEntries.reduce((sum, n) => sum + (n.calories || 0), 0)
  const totalProtein = todaysEntries.reduce((sum, n) => sum + (n.proteinG || 0), 0)
  const totalCarbs = todaysEntries.reduce((sum, n) => sum + (n.carbsG || 0), 0)
  const totalFat = todaysEntries.reduce((sum, n) => sum + (n.fatG || 0), 0)
  const totalWaterMl = todaysWater.reduce((sum, w) => sum + w.amountMl, 0)

  const proteinTarget = appSettings.dailyProteinTargetG || 140
  const calorieTarget = appSettings.dailyCalorieTarget || 2100
  const waterTarget = appSettings.dailyWaterTargetMl || 3000

  const proteinPct = Math.min(100, Math.round((totalProtein / proteinTarget) * 100))
  const caloriePct = Math.min(100, Math.round((totalCalories / calorieTarget) * 100))
  const waterPct = Math.min(100, Math.round((totalWaterMl / waterTarget) * 100))

  const mealTypes: { type: MealType; label: string }[] = [
    { type: 'breakfast', label: 'Breakfast' },
    { type: 'lunch', label: 'Lunch' },
    { type: 'dinner', label: 'Dinner' },
    { type: 'snack', label: 'Snack' },
    { type: 'post_workout', label: 'Post-Workout' }
  ]

  // Filtered food catalog
  const filteredFoods = customFoods.filter(f =>
    f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    f.category.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleSelectFoodToLog = (food: FoodItem) => {
    const now = new Date()
    const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`

    onAddNutritionEntry({
      date: today,
      time: timeStr,
      mealType: selectedMealType,
      foodName: food.name,
      portion: food.servingSize,
      calories: food.calories,
      proteinG: food.proteinG,
      carbsG: food.carbsG,
      fatG: food.fatG
    })
    setShowAddFoodModal(false)
  }

  const handleCreateCustomFood = () => {
    if (!customName.trim()) return

    const newFood: FoodItem = {
      id: `food-custom-${Date.now()}`,
      name: customName.trim(),
      servingSize: customServing.trim() || '1 portion',
      calories: Number(customCalories) || 0,
      proteinG: Number(customProtein) || 0,
      carbsG: Number(customCarbs) || 0,
      fatG: Number(customFat) || 0,
      category: 'other',
      isCustom: true
    }

    onAddCustomFood(newFood)
    handleSelectFoodToLog(newFood)
    setShowCustomFoodModal(false)
    setCustomName('')
  }

  const handleSaveTargets = () => {
    onUpdateTargets(editProteinTarget, editCalorieTarget, editWaterTarget)
    setShowTargetsModal(false)
  }

  return (
    <div className="space-y-4 pb-24 px-4 pt-3 max-w-lg mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black text-white tracking-tight">Nutrition & Hydration</h2>
          <p className="text-xs text-slate-400">Offline recomposition meal tracker</p>
        </div>
        <button
          onClick={() => setShowTargetsModal(true)}
          className="text-xs font-bold text-sky-400 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700"
        >
          Edit Targets
        </button>
      </div>

      {/* Recomposition Nutrition Summary Card */}
      <div className="p-4 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
        {/* Protein Priority Banner */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-sky-400" />
              Daily Protein Target ({proteinTarget}g)
            </span>
            <span className="text-sm font-black text-sky-400">
              {totalProtein} <span className="text-xs font-normal text-slate-400">/ {proteinTarget}g</span>
            </span>
          </div>
          <div className="w-full bg-slate-950 rounded-full h-3 overflow-hidden p-0.5 border border-slate-800">
            <div
              style={{ width: `${proteinPct}%` }}
              className="bg-gradient-to-r from-sky-400 to-cyan-400 h-full rounded-full transition-all duration-500"
            />
          </div>
          <span className="text-[10px] text-slate-400 mt-1 block">
            Target range: 125–155g to build muscle and support abdominal fat recomposition.
          </span>
        </div>

        {/* Calories & Macro Breakdown */}
        <div className="grid grid-cols-4 gap-2 pt-3 border-t border-slate-800 text-center">
          <div className="p-2 rounded-2xl bg-slate-950/80 border border-slate-800/80">
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">Calories</span>
            <span className="text-base font-black text-white">{totalCalories}</span>
            <span className="text-[9px] text-slate-500 block">/ {calorieTarget}</span>
          </div>
          <div className="p-2 rounded-2xl bg-slate-950/80 border border-slate-800/80">
            <span className="text-[10px] text-sky-400 uppercase font-semibold block">Protein</span>
            <span className="text-base font-black text-sky-400">{totalProtein}g</span>
            <span className="text-[9px] text-slate-500 block">{Math.round(totalProtein * 4)} kcal</span>
          </div>
          <div className="p-2 rounded-2xl bg-slate-950/80 border border-slate-800/80">
            <span className="text-[10px] text-amber-400 uppercase font-semibold block">Carbs</span>
            <span className="text-base font-black text-amber-300">{totalCarbs}g</span>
            <span className="text-[9px] text-slate-500 block">{Math.round(totalCarbs * 4)} kcal</span>
          </div>
          <div className="p-2 rounded-2xl bg-slate-950/80 border border-slate-800/80">
            <span className="text-[10px] text-emerald-400 uppercase font-semibold block">Fat</span>
            <span className="text-base font-black text-emerald-300">{totalFat}g</span>
            <span className="text-[9px] text-slate-500 block">{Math.round(totalFat * 9)} kcal</span>
          </div>
        </div>

        {/* Recomposition Note */}
        <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 text-[10px] text-slate-400 flex items-start gap-1.5">
          <Info className="w-3.5 h-3.5 text-slate-500 shrink-0 mt-0.5" />
          <span>
            Balanced Philippine nutrition: Rice provides clean training energy. Do not eliminate rice or carbs; pair portions with grilled chicken inasal, bangus, eggs, or tokwa.
          </span>
        </div>
      </div>

      {/* Hydration Card */}
      <div className="p-4 rounded-3xl bg-slate-900 border border-slate-800">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
              <Droplet className="w-4 h-4 fill-current" />
            </div>
            <div>
              <span className="text-xs font-bold text-white block">Water Intake</span>
              <span className="text-[10px] text-slate-400">Target: {(waterTarget / 1000).toFixed(1)}L per day</span>
            </div>
          </div>
          <div className="text-right">
            <span className="text-sm font-black text-cyan-400">{totalWaterMl} ml</span>
            <span className="text-[10px] text-slate-500 block">{waterPct}%</span>
          </div>
        </div>

        <div className="w-full bg-slate-950 rounded-full h-2.5 overflow-hidden border border-slate-800">
          <div
            style={{ width: `${waterPct}%` }}
            className="bg-cyan-400 h-full rounded-full transition-all duration-300"
          />
        </div>

        {/* Quick Add Water Buttons */}
        <div className="grid grid-cols-3 gap-2 mt-3">
          <button
            onClick={() => onAddWater(250)}
            className="py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-cyan-300 border border-slate-700"
          >
            +250 ml (Glass)
          </button>
          <button
            onClick={() => onAddWater(500)}
            className="py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-cyan-300 border border-slate-700"
          >
            +500 ml (Bottle)
          </button>
          <button
            onClick={() => onAddWater(750)}
            className="py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-cyan-300 border border-slate-700"
          >
            +750 ml (Large)
          </button>
        </div>
      </div>

      {/* Meals Section by Category */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Meals Logged Today
          </h3>
          <button
            onClick={() => {
              setSelectedMealType('lunch')
              setShowAddFoodModal(true)
            }}
            className="flex items-center gap-1 text-xs font-bold text-sky-400 hover:text-sky-300"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Food</span>
          </button>
        </div>

        {mealTypes.map(m => {
          const entriesForMeal = todaysEntries.filter(n => n.mealType === m.type)
          const mealCalories = entriesForMeal.reduce((sum, e) => sum + e.calories, 0)
          const mealProtein = entriesForMeal.reduce((sum, e) => sum + e.proteinG, 0)

          return (
            <div key={m.type} className="p-4 rounded-3xl bg-slate-900 border border-slate-800">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-white">{m.label}</span>
                  {entriesForMeal.length > 0 && (
                    <span className="text-[10px] text-slate-400">
                      ({mealCalories} kcal • {mealProtein}g protein)
                    </span>
                  )}
                </div>
                <button
                  onClick={() => {
                    setSelectedMealType(m.type)
                    setShowAddFoodModal(true)
                  }}
                  className="p-1 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
                  title={`Add to ${m.label}`}
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              {entriesForMeal.length === 0 ? (
                <p className="text-xs text-slate-500 italic py-1">No items logged yet.</p>
              ) : (
                <div className="space-y-1.5 mt-2">
                  {entriesForMeal.map(item => (
                    <div
                      key={item.id}
                      className="p-2.5 rounded-xl bg-slate-950 border border-slate-800/80 flex items-center justify-between text-xs"
                    >
                      <div>
                        <span className="font-semibold text-slate-200 block">{item.foodName}</span>
                        <span className="text-[10px] text-slate-400">
                          {item.portion} • {item.proteinG}g protein • {item.calories} kcal
                        </span>
                      </div>
                      <button
                        onClick={() => onDeleteNutritionEntry(item.id)}
                        className="p-1.5 text-slate-500 hover:text-rose-400"
                        title="Delete entry"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Add Food Modal (with Philippine starter catalog) */}
      {showAddFoodModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-[#0f172a] border-t sm:border border-slate-800 rounded-t-3xl sm:rounded-3xl w-full max-w-md max-h-[88vh] flex flex-col shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="p-4 border-b border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white">Log Food to {selectedMealType.toUpperCase()}</h3>
                <p className="text-[11px] text-slate-400">Select starter food or create custom item</p>
              </div>
              <button
                onClick={() => setShowAddFoodModal(false)}
                className="p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Search and custom trigger */}
            <div className="p-4 border-b border-slate-800/80 space-y-2">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="Search chicken, bangus, eggs, rice..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
                />
              </div>

              <button
                onClick={() => {
                  setShowAddFoodModal(false)
                  setShowCustomFoodModal(true)
                }}
                className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-sky-400 border border-slate-700 flex items-center justify-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Create Custom Food Entry</span>
              </button>
            </div>

            {/* Food Catalog List */}
            <div className="p-4 overflow-y-auto space-y-2 max-h-[50vh]">
              {filteredFoods.map(food => (
                <div
                  key={food.id}
                  onClick={() => handleSelectFoodToLog(food)}
                  className="p-3 rounded-2xl bg-slate-900 border border-slate-800 hover:border-sky-500/50 cursor-pointer transition-all flex items-center justify-between"
                >
                  <div>
                    <span className="text-xs font-bold text-white block">{food.name}</span>
                    <span className="text-[10px] text-slate-400">{food.servingSize}</span>
                    <div className="flex gap-2 mt-1 text-[10px]">
                      <span className="text-sky-400 font-bold">{food.proteinG}g protein</span>
                      <span className="text-slate-400">{food.calories} kcal</span>
                      <span className="text-amber-400">{food.carbsG}g C</span>
                      <span className="text-emerald-400">{food.fatG}g F</span>
                    </div>
                  </div>
                  <Plus className="w-4 h-4 text-sky-400" />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Custom Food Creation Modal */}
      {showCustomFoodModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0f172a] border border-slate-800 rounded-3xl w-full max-w-sm p-5 shadow-2xl">
            <h3 className="text-base font-bold text-white mb-3">Create Custom Food</h3>
            <div className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Food Name</label>
                <input
                  type="text"
                  placeholder="e.g. Grilled Salmon Belly"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Portion / Serving Size</label>
                <input
                  type="text"
                  placeholder="e.g. 150g portion"
                  value={customServing}
                  onChange={(e) => setCustomServing(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-400 block mb-1">Calories (kcal)</label>
                  <input
                    type="number"
                    value={customCalories}
                    onChange={(e) => setCustomCalories(parseFloat(e.target.value) || 0)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-white font-bold"
                  />
                </div>
                <div>
                  <label className="text-sky-400 block mb-1 font-bold">Protein (g)</label>
                  <input
                    type="number"
                    value={customProtein}
                    onChange={(e) => setCustomProtein(parseFloat(e.target.value) || 0)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-sky-400 font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-400 block mb-1">Carbs (g)</label>
                  <input
                    type="number"
                    value={customCarbs}
                    onChange={(e) => setCustomCarbs(parseFloat(e.target.value) || 0)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Fat (g)</label>
                  <input
                    type="number"
                    value={customFat}
                    onChange={(e) => setCustomFat(parseFloat(e.target.value) || 0)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-white"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-2 mt-5">
              <button
                onClick={() => setShowCustomFoodModal(false)}
                className="flex-1 py-2.5 rounded-xl bg-slate-800 text-xs font-semibold text-slate-300"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateCustomFood}
                disabled={!customName.trim()}
                className="flex-1 py-2.5 rounded-xl bg-sky-500 text-xs font-bold text-slate-950 disabled:opacity-40"
              >
                Save & Log
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Targets Modal */}
      {showTargetsModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0f172a] border border-slate-800 rounded-3xl w-full max-w-sm p-5 shadow-2xl">
            <h3 className="text-base font-bold text-white mb-2">Adjust Nutrition Goals</h3>
            <p className="text-xs text-slate-400 mb-3">
              Initial targets are conservative estimates for body recomposition. Adjust based on your schedule and hunger.
            </p>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-sky-400 block mb-1 font-bold">Daily Protein Target (grams)</label>
                <input
                  type="number"
                  value={editProteinTarget}
                  onChange={(e) => setEditProteinTarget(parseInt(e.target.value) || 140)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white font-bold"
                />
                <span className="text-[10px] text-slate-500 mt-0.5 block">Recommended range: 125–155g</span>
              </div>

              <div>
                <label className="text-slate-300 block mb-1 font-semibold">Estimated Daily Calories (kcal)</label>
                <input
                  type="number"
                  value={editCalorieTarget}
                  onChange={(e) => setEditCalorieTarget(parseInt(e.target.value) || 2100)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white font-bold"
                />
              </div>

              <div>
                <label className="text-slate-300 block mb-1 font-semibold">Daily Water Goal (ml)</label>
                <input
                  type="number"
                  step="250"
                  value={editWaterTarget}
                  onChange={(e) => setEditWaterTarget(parseInt(e.target.value) || 3000)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white font-bold"
                />
              </div>
            </div>

            <div className="flex gap-2 mt-5">
              <button
                onClick={() => setShowTargetsModal(false)}
                className="flex-1 py-2.5 rounded-xl bg-slate-800 text-xs font-semibold text-slate-300"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveTargets}
                className="flex-1 py-2.5 rounded-xl bg-sky-500 text-xs font-bold text-slate-950"
              >
                Save Goals
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
