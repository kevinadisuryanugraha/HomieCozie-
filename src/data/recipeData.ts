import { MenuRecipe } from '../types';

export const DEFAULT_MENU_RECIPES: MenuRecipe[] = [
  {
    id: 'rec-1',
    menuItemId: 'm-1',
    menuItemName: 'Kopi Susu Homie Signature',
    category: 'Coffee',
    salePrice: 24000,
    ingredients: [
      { inventoryId: 'inv-1', ingredientName: 'Arabika House Blend Beans', quantity: 18, unit: 'gram', costPerUnit: 180, subtotalCost: 3240 },
      { inventoryId: 'inv-2', ingredientName: 'Fresh Milk Pasteurized', quantity: 120, unit: 'ml', costPerUnit: 22, subtotalCost: 2640 },
      { inventoryId: 'inv-4', ingredientName: 'Gula Aren Organik Cair', quantity: 25, unit: 'ml', costPerUnit: 35, subtotalCost: 875 },
      { inventoryId: 'inv-pkg-1', ingredientName: 'Paper Cup & Lid 12oz', quantity: 1, unit: 'pcs', costPerUnit: 850, subtotalCost: 850 }
    ],
    totalHPP: 7605,
    grossMarginPct: 68.3,
    preparationNotes: 'Ekstraksi espresso 30ml (ratio 1:2 dalam 27 detik). Steam susu hingga 65°C.',
    updatedAt: '2026-08-31'
  },
  {
    id: 'rec-2',
    menuItemId: 'm-2',
    menuItemName: 'Aren Cremosa Cozie',
    category: 'Coffee',
    salePrice: 28000,
    ingredients: [
      { inventoryId: 'inv-1', ingredientName: 'Arabika House Blend Beans', quantity: 20, unit: 'gram', costPerUnit: 180, subtotalCost: 3600 },
      { inventoryId: 'inv-2', ingredientName: 'Fresh Milk Pasteurized', quantity: 100, unit: 'ml', costPerUnit: 22, subtotalCost: 2200 },
      { inventoryId: 'inv-crm-1', ingredientName: 'Creamer & Whipping Base', quantity: 30, unit: 'ml', costPerUnit: 45, subtotalCost: 1350 },
      { inventoryId: 'inv-4', ingredientName: 'Gula Aren Organik Cair', quantity: 20, unit: 'ml', costPerUnit: 35, subtotalCost: 700 },
      { inventoryId: 'inv-pkg-1', ingredientName: 'Paper Cup & Lid 12oz', quantity: 1, unit: 'pcs', costPerUnit: 850, subtotalCost: 850 }
    ],
    totalHPP: 8700,
    grossMarginPct: 68.9,
    preparationNotes: 'Top dengan cold foam kental sebelum disajikan.',
    updatedAt: '2026-08-31'
  },
  {
    id: 'rec-3',
    menuItemId: 'm-3',
    menuItemName: 'Manual Brew V60 (Aceh Gayo / Flores)',
    category: 'Manual Brew',
    salePrice: 30000,
    ingredients: [
      { inventoryId: 'inv-so-1', ingredientName: 'Single Origin Aceh Gayo Beans', quantity: 15, unit: 'gram', costPerUnit: 320, subtotalCost: 4800 },
      { inventoryId: 'inv-flt-1', ingredientName: 'V60 Paper Filter 01', quantity: 1, unit: 'pcs', costPerUnit: 900, subtotalCost: 900 },
      { inventoryId: 'inv-pkg-2', ingredientName: 'Server Glass / Takeaway Cup', quantity: 1, unit: 'pcs', costPerUnit: 850, subtotalCost: 850 }
    ],
    totalHPP: 6550,
    grossMarginPct: 78.2,
    preparationNotes: 'Suhu air 92°C, pour 225ml dalam 4x pour (45s blooming).',
    updatedAt: '2026-08-31'
  },
  {
    id: 'rec-4',
    menuItemId: 'm-4',
    menuItemName: 'Berry Hibiscus Citrus Sparkler',
    category: 'Non-Coffee',
    salePrice: 26000,
    ingredients: [
      { inventoryId: 'inv-hb-1', ingredientName: 'Hibiscus Tea Concentrate', quantity: 60, unit: 'ml', costPerUnit: 30, subtotalCost: 1800 },
      { inventoryId: 'inv-sod-1', ingredientName: 'Sparkling Soda Water', quantity: 150, unit: 'ml', costPerUnit: 12, subtotalCost: 1800 },
      { inventoryId: 'inv-syr-1', ingredientName: 'Wild Berry Syrup', quantity: 20, unit: 'ml', costPerUnit: 40, subtotalCost: 800 },
      { inventoryId: 'inv-lem-1', ingredientName: 'Fresh Lemon Slices & Mint', quantity: 1, unit: 'porsi', costPerUnit: 600, subtotalCost: 600 },
      { inventoryId: 'inv-pkg-1', ingredientName: 'Paper Cup & Lid 12oz', quantity: 1, unit: 'pcs', costPerUnit: 850, subtotalCost: 850 }
    ],
    totalHPP: 5850,
    grossMarginPct: 77.5,
    preparationNotes: 'Shake dengan es batu, tuang soda di akhir, garnish lemon slice.',
    updatedAt: '2026-08-31'
  },
  {
    id: 'rec-5',
    menuItemId: 'm-5',
    menuItemName: 'Nasi Goreng Kampung Homie',
    category: 'Kitchen Mains',
    salePrice: 36000,
    ingredients: [
      { inventoryId: 'inv-rice-1', ingredientName: 'Beras Pulen Super (Masak)', quantity: 150, unit: 'gram', costPerUnit: 18, subtotalCost: 2700 },
      { inventoryId: 'inv-3', ingredientName: 'Daging Sapi Smoked Beef & Ayam', quantity: 80, unit: 'gram', costPerUnit: 75, subtotalCost: 6000 },
      { inventoryId: 'inv-egg-1', ingredientName: 'Telur Ayam Omega', quantity: 1, unit: 'pcs', costPerUnit: 2400, subtotalCost: 2400 },
      { inventoryId: 'inv-spc-1', ingredientName: 'Bumbu Racik Terasi & Sambal', quantity: 1, unit: 'porsi', costPerUnit: 1200, subtotalCost: 1200 },
      { inventoryId: 'inv-krup-1', ingredientName: 'Kerupuk Udang & Acar', quantity: 1, unit: 'porsi', costPerUnit: 800, subtotalCost: 800 }
    ],
    totalHPP: 13100,
    grossMarginPct: 63.6,
    preparationNotes: 'Wok hei api besar, telur ceplok setengah matang on top.',
    updatedAt: '2026-08-31'
  },
  {
    id: 'rec-6',
    menuItemId: 'm-6',
    menuItemName: 'Creamy Truffle Beef Fettuccine',
    category: 'Pasta',
    salePrice: 42000,
    ingredients: [
      { inventoryId: 'inv-pst-1', ingredientName: 'Fettuccine Pasta (Al Dente)', quantity: 120, unit: 'gram', costPerUnit: 35, subtotalCost: 4200 },
      { inventoryId: 'inv-3', ingredientName: 'Smoked Beef Strips', quantity: 60, unit: 'gram', costPerUnit: 75, subtotalCost: 4500 },
      { inventoryId: 'inv-crm-2', ingredientName: 'Heavy Cooking Cream', quantity: 80, unit: 'ml', costPerUnit: 40, subtotalCost: 3200 },
      { inventoryId: 'inv-trf-1', ingredientName: 'White Truffle Oil & Herb', quantity: 5, unit: 'ml', costPerUnit: 350, subtotalCost: 1750 },
      { inventoryId: 'inv-prm-1', ingredientName: 'Grated Parmesan Cheese', quantity: 15, unit: 'gram', costPerUnit: 120, subtotalCost: 1800 }
    ],
    totalHPP: 15450,
    grossMarginPct: 63.2,
    preparationNotes: 'Truffle oil diteteskan di akhir sesaat sebelum disajikan ke meja.',
    updatedAt: '2026-08-31'
  },
  {
    id: 'rec-7',
    menuItemId: 'm-7',
    menuItemName: 'Platter Nongkrong #PITSTOP',
    category: 'Light Bites',
    salePrice: 38000,
    ingredients: [
      { inventoryId: 'inv-fr-1', ingredientName: 'French Fries Shoestring', quantity: 150, unit: 'gram', costPerUnit: 25, subtotalCost: 3750 },
      { inventoryId: 'inv-sos-1', ingredientName: 'Sosis Sapi Bratwurst', quantity: 2, unit: 'pcs', costPerUnit: 3000, subtotalCost: 6000 },
      { inventoryId: 'inv-nug-1', ingredientName: 'Chicken Karaage Bites', quantity: 80, unit: 'gram', costPerUnit: 45, subtotalCost: 3600 },
      { inventoryId: 'inv-sau-1', ingredientName: 'Spicy Mayo & BBQ Dip', quantity: 2, unit: 'porsi', costPerUnit: 600, subtotalCost: 1200 }
    ],
    totalHPP: 14550,
    grossMarginPct: 61.7,
    preparationNotes: 'Goreng garing dalam minyak panas 175°C, tabur bumbu seaweed.',
    updatedAt: '2026-08-31'
  },
  {
    id: 'rec-8',
    menuItemId: 'm-8',
    menuItemName: 'Flaky Croissant Butter with Gelato',
    category: 'Pastry',
    salePrice: 32000,
    ingredients: [
      { inventoryId: 'inv-crs-1', ingredientName: 'French Butter Croissant Dough', quantity: 1, unit: 'pcs', costPerUnit: 7500, subtotalCost: 7500 },
      { inventoryId: 'inv-glt-1', ingredientName: 'Artisan Vanilla Gelato Scoop', quantity: 1, unit: 'scoop', costPerUnit: 3500, subtotalCost: 3500 },
      { inventoryId: 'inv-alm-1', ingredientName: 'Toasted Almond Flakes & Caramel', quantity: 1, unit: 'porsi', costPerUnit: 800, subtotalCost: 800 }
    ],
    totalHPP: 11800,
    grossMarginPct: 63.1,
    preparationNotes: 'Bake ulang 3 menit hingga renyah hangat, beri scoop gelato dingin.',
    updatedAt: '2026-08-31'
  }
];

export function calculateRecipeHPP(ingredients: { quantity: number; costPerUnit: number }[]): number {
  return ingredients.reduce((acc, it) => acc + (it.quantity * it.costPerUnit), 0);
}

export function getRecipeForMenuItem(menuItemId: string): MenuRecipe | undefined {
  return DEFAULT_MENU_RECIPES.find(r => r.menuItemId === menuItemId);
}
