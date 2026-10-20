import { FoodItem } from '../types'

export const DEFAULT_FOOD_CATALOG: FoodItem[] = [
  // --- HIGH PROTEIN / FILIPINO MEALS ---
  {
    id: 'food-chicken-inasal',
    name: 'Grilled Chicken Breast / Inasal (Skinless)',
    servingSize: '150g cooked portion',
    calories: 220,
    proteinG: 38,
    carbsG: 1,
    fatG: 5,
    category: 'filipino_staple'
  },
  {
    id: 'food-bangus-grilled',
    name: 'Grilled Bangus (Milkfish, Boneless)',
    servingSize: '150g fillet',
    calories: 240,
    proteinG: 32,
    carbsG: 0,
    fatG: 11,
    category: 'filipino_staple'
  },
  {
    id: 'food-tilapia-steamed',
    name: 'Steamed / Grilled Tilapia',
    servingSize: '150g fillet',
    calories: 175,
    proteinG: 35,
    carbsG: 0,
    fatG: 3.5,
    category: 'filipino_staple'
  },
  {
    id: 'food-tuna-water',
    name: 'Canned Tuna in Water (Drained)',
    servingSize: '1 can (130g drained)',
    calories: 140,
    proteinG: 30,
    carbsG: 0,
    fatG: 1,
    category: 'protein'
  },
  {
    id: 'food-eggs-boiled',
    name: 'Boiled Eggs (Large)',
    servingSize: '2 whole eggs (100g)',
    calories: 145,
    proteinG: 12.6,
    carbsG: 0.8,
    fatG: 9.8,
    category: 'protein'
  },
  {
    id: 'food-egg-whites',
    name: 'Egg Whites (Boiled / Scrambled with spray)',
    servingSize: '3 large whites (100g)',
    calories: 52,
    proteinG: 11,
    carbsG: 0.7,
    fatG: 0.2,
    category: 'protein'
  },
  {
    id: 'food-tokwa-tofu',
    name: 'Firm Tokwa / Tofu (Pan-seared / Stir-fry)',
    servingSize: '150g block',
    calories: 140,
    proteinG: 16,
    carbsG: 4,
    fatG: 8,
    category: 'filipino_staple'
  },
  {
    id: 'food-lean-beef-bistek',
    name: 'Lean Beef Sirloin / Bistek Tagalog Style',
    servingSize: '130g cooked lean',
    calories: 230,
    proteinG: 34,
    carbsG: 3,
    fatG: 8,
    category: 'filipino_staple'
  },
  {
    id: 'food-monggo-soup',
    name: 'Ginisang Monggo (Mung Bean Stew, Light Oil)',
    servingSize: '1 standard bowl (240ml)',
    calories: 190,
    proteinG: 12,
    carbsG: 28,
    fatG: 4,
    category: 'filipino_staple'
  },
  {
    id: 'food-whey-protein',
    name: 'Whey Protein Isolate / Concentrate',
    servingSize: '1 scoop (30g powder)',
    calories: 120,
    proteinG: 24,
    carbsG: 2,
    fatG: 1.5,
    category: 'protein'
  },

  // --- CARBS & ENERGY ---
  {
    id: 'food-white-rice',
    name: 'Cooked White Jasmine / Sinandomeng Rice',
    servingSize: '1 cup (160g cooked)',
    calories: 210,
    proteinG: 4.2,
    carbsG: 45,
    fatG: 0.5,
    category: 'carb'
  },
  {
    id: 'food-brown-rice',
    name: 'Cooked Brown Rice',
    servingSize: '1 cup (160g cooked)',
    calories: 215,
    proteinG: 5,
    carbsG: 44,
    fatG: 1.8,
    category: 'carb'
  },
  {
    id: 'food-kamote-sweet-potato',
    name: 'Boiled Kamote (Sweet Potato)',
    servingSize: '1 medium (130g)',
    calories: 115,
    proteinG: 2,
    carbsG: 27,
    fatG: 0.2,
    category: 'carb'
  },
  {
    id: 'food-rolled-oats',
    name: 'Rolled Oats (Dry measure)',
    servingSize: '1/2 cup (40g dry)',
    calories: 150,
    proteinG: 5,
    carbsG: 27,
    fatG: 2.5,
    category: 'carb'
  },

  // --- DAIRY & PRODUCE ---
  {
    id: 'food-lowfat-milk',
    name: 'Low-Fat Cow Milk / Fresh Milk',
    servingSize: '1 glass (240ml)',
    calories: 110,
    proteinG: 8.5,
    carbsG: 12,
    fatG: 2.5,
    category: 'dairy'
  },
  {
    id: 'food-greek-yogurt',
    name: 'Plain Greek Yogurt (Low-Fat)',
    servingSize: '1 cup (170g)',
    calories: 130,
    proteinG: 17,
    carbsG: 6,
    fatG: 2.5,
    category: 'dairy'
  },
  {
    id: 'food-banana-lakatan',
    name: 'Fresh Banana (Lakatan / Cavendish)',
    servingSize: '1 medium piece (110g)',
    calories: 95,
    proteinG: 1.2,
    carbsG: 24,
    fatG: 0.3,
    category: 'produce'
  },
  {
    id: 'food-papaya-fresh',
    name: 'Fresh Ripe Papaya Slices',
    servingSize: '1 cup cubes (140g)',
    calories: 60,
    proteinG: 0.8,
    carbsG: 15,
    fatG: 0.4,
    category: 'produce'
  },
  {
    id: 'food-kangkong-spinach',
    name: 'Sautéed Kangkong (Water Spinach) with Garlic',
    servingSize: '1 cup cooked (120g)',
    calories: 45,
    proteinG: 2.5,
    carbsG: 4,
    fatG: 2,
    category: 'produce'
  }
]
