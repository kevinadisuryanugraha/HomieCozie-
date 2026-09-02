import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  UtensilsCrossed, 
  Search, 
  DollarSign, 
  Percent, 
  TrendingUp, 
  Layers, 
  Plus, 
  Edit3, 
  ChevronRight, 
  Sparkles, 
  Package, 
  CheckCircle2,
  Info,
  Sliders,
  History,
  Trash2,
  Save,
  X,
  AlertTriangle,
  Flame,
  Coffee,
  Check,
  RefreshCw,
  Scale
} from 'lucide-react';
import { MenuRecipe, RecipeIngredient, BOMDeductionLog, InventoryItem } from '../../types';
import { useAppStore } from '../../store/useAppStore';
import { INITIAL_MENU_ITEMS } from '../../data/mockData';

export const RecipeBOMManager: React.FC = () => {
  const recipes = useAppStore(s => s.recipes);
  const inventory = useAppStore(s => s.inventory);
  const deductionLogs = useAppStore(s => s.deductionLogs);
  const addRecipe = useAppStore(s => s.addRecipe);
  const updateRecipe = useAppStore(s => s.updateRecipe);
  const deleteRecipe = useAppStore(s => s.deleteRecipe);

  const [selectedRecipeId, setSelectedRecipeId] = useState<string>(recipes[0]?.id || 'rec-1');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<'recipes' | 'simulation' | 'deductions'>('recipes');

  // Modals
  const [isEditIngredientsOpen, setIsEditIngredientsOpen] = useState<boolean>(false);
  const [isAddRecipeOpen, setIsAddRecipeOpen] = useState<boolean>(false);
  const [newRecipeMenuItemId, setNewRecipeMenuItemId] = useState<string>(INITIAL_MENU_ITEMS[0]?.id || 'm-1');
  const [newRecipePrepNotes, setNewRecipePrepNotes] = useState<string>('');

  // Cost Simulation State (% inflation)
  const [coffeeCostDeltaPct, setCoffeeCostDeltaPct] = useState<number>(0);
  const [dairyCostDeltaPct, setDairyCostDeltaPct] = useState<number>(0);
  const [meatCostDeltaPct, setMeatCostDeltaPct] = useState<number>(0);

  const selectedRecipe = recipes.find(r => r.id === selectedRecipeId) || recipes[0];

  const formatRupiah = (val: number) => `Rp ${Math.round(val).toLocaleString('id-ID')}`;

  // Filter recipes
  const filteredRecipes = recipes.filter(r => {
    const matchSearch = r.menuItemName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        r.ingredients.some(i => i.ingredientName.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchCategory = selectedCategory === 'all' || r.category.toLowerCase().includes(selectedCategory.toLowerCase());
    return matchSearch && matchCategory;
  });

  const categories = ['all', 'Coffee', 'Manual Brew', 'Kitchen Mains', 'Pasta', 'Light Bites', 'Pastry'];

  // Average Cafe Gross Margin
  const avgMargin = recipes.length > 0 
    ? Math.round(recipes.reduce((acc, r) => acc + r.grossMarginPct, 0) / recipes.length)
    : 0;

  // Local editing copy of ingredients
  const [editIngredients, setEditIngredients] = useState<RecipeIngredient[]>([]);

  const handleOpenEdit = () => {
    if (!selectedRecipe) return;
    setEditIngredients([...selectedRecipe.ingredients]);
    setIsEditIngredientsOpen(true);
  };

  const handleSaveIngredients = () => {
    if (!selectedRecipe) return;
    const recalculatedIngredients = editIngredients.map(ing => ({
      ...ing,
      subtotalCost: Math.round(ing.quantity * ing.costPerUnit)
    }));
    const totalHPP = recalculatedIngredients.reduce((acc, it) => acc + it.subtotalCost, 0);
    const grossMarginPct = Math.round(((selectedRecipe.salePrice - totalHPP) / selectedRecipe.salePrice) * 1000) / 10;

    updateRecipe(selectedRecipe.id, {
      ingredients: recalculatedIngredients,
      totalHPP,
      grossMarginPct
    });

    setIsEditIngredientsOpen(false);
  };

  const handleAddIngredientRow = () => {
    const defaultInv = inventory[0];
    const newIng: RecipeIngredient = {
      inventoryId: defaultInv?.id || 'inv-custom',
      ingredientName: defaultInv?.name || 'Bahan Baku Baru',
      quantity: 10,
      unit: defaultInv?.unit || 'gram',
      costPerUnit: 150,
      subtotalCost: 1500
    };
    setEditIngredients([...editIngredients, newIng]);
  };

  const handleRemoveIngredientRow = (index: number) => {
    setEditIngredients(editIngredients.filter((_, idx) => idx !== index));
  };

  // Helper for simulated HPP
  const getSimulatedRecipeHPP = (recipe: MenuRecipe) => {
    return recipe.ingredients.reduce((acc, ing) => {
      let multiplier = 1;
      const name = ing.ingredientName.toLowerCase();
      if (name.includes('arabika') || name.includes('bean') || name.includes('kopi')) {
        multiplier += coffeeCostDeltaPct / 100;
      } else if (name.includes('milk') || name.includes('susu') || name.includes('cream')) {
        multiplier += dairyCostDeltaPct / 100;
      } else if (name.includes('beef') || name.includes('daging') || name.includes('ayam')) {
        multiplier += meatCostDeltaPct / 100;
      }
      return acc + (ing.quantity * ing.costPerUnit * multiplier);
    }, 0);
  };

  return (
    <div className="p-3.5 sm:p-6 lg:p-8 space-y-5 sm:space-y-6 max-w-7xl mx-auto w-full pb-24 lg:pb-8">
      
      {/* 1. Header & Summary Stats */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 bg-white p-4 sm:p-6 rounded-3xl border border-[#EAE2D8] shadow-xs w-full min-w-0">
        <div className="space-y-1.5 min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-50 text-amber-900 border border-amber-200 uppercase shrink-0">
              Kitchen BOM Engine
            </span>
            <span className="text-[11px] text-[#8C7E72] font-mono shrink-0">• Bill of Materials v2.4</span>
          </div>
          <h2 className="text-lg sm:text-2xl font-display font-black text-[#1F1A16] leading-tight">
            Resep Bahan Baku & Otomasi HPP
          </h2>
          <p className="text-xs text-[#5C5248] max-w-xl leading-relaxed">
            Sistem Bill of Materials (BOM) otomatis memotong stok bahan baku setiap transaksi POS/QRIS dan mengawasi margin laba kotor 70%.
          </p>
        </div>

        {/* Quick KPI Stats & Actions */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3 w-full lg:w-auto shrink-0">
          <div className="grid grid-cols-2 gap-2 sm:flex sm:items-center sm:gap-2.5">
            <div className="px-3.5 py-2.5 rounded-2xl bg-[#FAF7F2] border border-[#EAE2D8] text-left sm:text-right">
              <div className="text-[10px] font-mono text-[#8C7E72] uppercase font-bold tracking-tight">Rata-rata Margin</div>
              <div className="text-base sm:text-lg font-mono font-black text-emerald-700 leading-tight mt-0.5">{avgMargin}%</div>
            </div>
            <div className="px-3.5 py-2.5 rounded-2xl bg-[#FAF7F2] border border-[#EAE2D8] text-left sm:text-right">
              <div className="text-[10px] font-mono text-[#8C7E72] uppercase font-bold tracking-tight">Menu Terdaftar</div>
              <div className="text-base sm:text-lg font-mono font-black text-[#1F1A16] leading-tight mt-0.5">{recipes.length} Resep</div>
            </div>
          </div>

          <button
            onClick={() => setIsAddRecipeOpen(true)}
            className="w-full sm:w-auto px-4 py-2.5 rounded-2xl bg-[#C84B27] hover:bg-[#B23E1C] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer active:scale-95 whitespace-nowrap shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Resep Menu</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-[#EAE2D8] pb-1 overflow-x-auto scrollbar-none">
        <button
          onClick={() => setActiveTab('recipes')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shrink-0 ${
            activeTab === 'recipes'
              ? 'bg-[#1F1A16] text-white shadow-xs'
              : 'bg-white text-[#5C5248] hover:text-[#1F1A16] border border-[#EAE2D8]'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Katalog Resep & Komposisi ({recipes.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('simulation')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shrink-0 ${
            activeTab === 'simulation'
              ? 'bg-[#1F1A16] text-white shadow-xs'
              : 'bg-white text-[#5C5248] hover:text-[#1F1A16] border border-[#EAE2D8]'
          }`}
        >
          <Sliders className="w-4 h-4 text-amber-500" />
          <span>Simulasi Fluktuasi Harga Pasar</span>
        </button>

        <button
          onClick={() => setActiveTab('deductions')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shrink-0 ${
            activeTab === 'deductions'
              ? 'bg-[#1F1A16] text-white shadow-xs'
              : 'bg-white text-[#5C5248] hover:text-[#1F1A16] border border-[#EAE2D8]'
          }`}
        >
          <History className="w-4 h-4 text-emerald-600" />
          <span>Log Pemotongan Stok Otomatis ({deductionLogs.length})</span>
        </button>
      </div>

      {/* Tab 1: Recipes List & Detail Split View */}
      {activeTab === 'recipes' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Column: Menu Items List (5 Cols) */}
          <div className="lg:col-span-5 bg-white p-4 sm:p-5 rounded-3xl border border-[#EAE2D8] shadow-xs space-y-4 flex flex-col max-h-[750px]">
            
            {/* Search & Filter */}
            <div className="space-y-2.5">
              <div className="relative">
                <Search className="w-4 h-4 text-[#8C7E72] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari resep menu atau bahan..."
                  className="w-full pl-9 pr-3 py-2 text-xs bg-[#FAF7F2] border border-[#EAE2D8] rounded-2xl text-[#1F1A16] placeholder:text-[#8C7E72] focus:outline-none focus:border-[#C84B27]"
                />
              </div>

              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                {categories.map((cat, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1 rounded-xl text-[11px] font-bold shrink-0 transition-colors cursor-pointer ${
                      selectedCategory === cat
                        ? 'bg-[#C84B27] text-white shadow-2xs'
                        : 'bg-[#FAF7F2] text-[#5C5248] hover:bg-stone-200 border border-[#EAE2D8]'
                    }`}
                  >
                    {cat === 'all' ? 'Semua' : cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Recipes List */}
            <div className="space-y-2 overflow-y-auto flex-1 pr-1">
              {filteredRecipes.map((rec) => {
                const isSelected = selectedRecipe?.id === rec.id;
                const marginColor = rec.grossMarginPct >= 70 
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200' 
                  : rec.grossMarginPct >= 60 
                    ? 'bg-amber-50 text-amber-800 border-amber-200' 
                    : 'bg-rose-50 text-rose-800 border-rose-200';

                return (
                  <div
                    key={rec.id}
                    onClick={() => setSelectedRecipeId(rec.id)}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer space-y-2 ${
                      isSelected
                        ? 'bg-amber-50/70 border-amber-400 shadow-xs'
                        : 'bg-[#FAF7F2] border-[#EAE2D8] hover:bg-stone-50'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <span className="text-[10px] font-mono text-amber-800 font-bold uppercase block truncate">
                          {rec.category}
                        </span>
                        <h4 className="font-display font-bold text-xs text-[#1F1A16] leading-snug truncate">
                          {rec.menuItemName}
                        </h4>
                      </div>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold border shrink-0 ${marginColor}`}>
                        Margin {rec.grossMarginPct}%
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[11px] font-mono pt-1.5 border-t border-[#EAE2D8]/60">
                      <span className="text-[#8C7E72]">
                        HPP: <strong className="text-[#1F1A16]">{formatRupiah(rec.totalHPP)}</strong>
                      </span>
                      <span className="text-[#8C7E72]">
                        Jual: <strong className="text-[#C84B27]">{formatRupiah(rec.salePrice)}</strong>
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

          </div>

          {/* Right Column: Recipe Detail & Ingredients Table (7 Cols) */}
          {selectedRecipe && (
            <div className="lg:col-span-7 bg-white p-5 sm:p-6 rounded-3xl border border-[#EAE2D8] shadow-xs space-y-6">
              
              {/* Detail Header */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-[#EAE2D8]">
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-stone-900 text-amber-300 uppercase">
                      {selectedRecipe.category}
                    </span>
                    <span className="text-xs text-[#8C7E72] font-mono truncate">ID: #{selectedRecipe.menuItemId}</span>
                  </div>
                  <h3 className="font-display font-black text-xl text-[#1F1A16] truncate">
                    {selectedRecipe.menuItemName}
                  </h3>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleOpenEdit}
                    className="px-3.5 py-2 rounded-xl bg-[#FAF7F2] hover:bg-stone-200 border border-[#EAE2D8] text-xs font-bold text-[#1F1A16] flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
                  >
                    <Edit3 className="w-3.5 h-3.5 text-[#C84B27]" />
                    <span>Ubah Komposisi</span>
                  </button>

                  <button
                    onClick={() => deleteRecipe(selectedRecipe.id)}
                    className="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 transition-colors cursor-pointer"
                    title="Hapus Resep"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Pricing & Cost Breakdown Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3.5 rounded-2xl bg-[#FAF7F2] border border-[#EAE2D8] space-y-1">
                  <div className="text-[10px] font-mono text-[#8C7E72] uppercase font-bold">Harga Jual Menu</div>
                  <div className="text-base font-mono font-bold text-[#1F1A16]">{formatRupiah(selectedRecipe.salePrice)}</div>
                </div>
                <div className="p-3.5 rounded-2xl bg-amber-50/50 border border-amber-200 space-y-1">
                  <div className="text-[10px] font-mono text-amber-900 uppercase font-bold">Total HPP / Bahan</div>
                  <div className="text-base font-mono font-bold text-[#C84B27]">{formatRupiah(selectedRecipe.totalHPP)}</div>
                </div>
                <div className="p-3.5 rounded-2xl bg-emerald-50/50 border border-emerald-200 space-y-1">
                  <div className="text-[10px] font-mono text-emerald-800 uppercase font-bold">Laba Kotor / Porsi</div>
                  <div className="text-base font-mono font-bold text-emerald-700">
                    {formatRupiah(selectedRecipe.salePrice - selectedRecipe.totalHPP)} ({selectedRecipe.grossMarginPct}%)
                  </div>
                </div>
              </div>

              {/* Bill of Materials Table */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-display font-black text-sm text-[#1F1A16] flex items-center gap-2">
                    <Layers className="w-4 h-4 text-amber-700" />
                    <span>Rincian Komposisi Bahan Baku (BOM)</span>
                  </h4>
                  <span className="text-[11px] font-mono text-[#8C7E72] font-bold">
                    {selectedRecipe.ingredients.length} Bahan Baku
                  </span>
                </div>

                <div className="border border-[#EAE2D8] rounded-2xl overflow-x-auto">
                  <table className="w-full text-left text-xs min-w-[450px]">
                    <thead className="bg-[#FAF7F2] text-[#8C7E72] font-mono text-[10px] uppercase border-b border-[#EAE2D8]">
                      <tr>
                        <th className="p-3">Bahan Baku</th>
                        <th className="p-3 text-center">Kuantitas</th>
                        <th className="p-3 text-right">Biaya / Satuan</th>
                        <th className="p-3 text-right">Subtotal HPP</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#EAE2D8]">
                      {selectedRecipe.ingredients.map((ing, idx) => (
                        <tr key={idx} className="hover:bg-[#FAF7F2]/50 transition-colors">
                          <td className="p-3 font-semibold text-[#1F1A16]">
                            {ing.ingredientName}
                          </td>
                          <td className="p-3 text-center font-mono font-bold text-[#5C5248]">
                            {ing.quantity} {ing.unit}
                          </td>
                          <td className="p-3 text-right font-mono text-[#8C7E72]">
                            {formatRupiah(ing.costPerUnit)} / {ing.unit}
                          </td>
                          <td className="p-3 text-right font-mono font-bold text-[#1F1A16]">
                            {formatRupiah(ing.subtotalCost)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="bg-[#FAF7F2] font-mono font-bold text-xs border-t border-[#EAE2D8]">
                      <tr>
                        <td colSpan={3} className="p-3 text-right uppercase text-[#8C7E72]">
                          Total Food & Beverage Cost (HPP):
                        </td>
                        <td className="p-3 text-right text-[#C84B27]">
                          {formatRupiah(selectedRecipe.totalHPP)}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>

              {/* Preparation & Barista Standard Notes */}
              {selectedRecipe.preparationNotes && (
                <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 space-y-1.5">
                  <div className="text-[10px] font-mono font-bold text-amber-900 uppercase flex items-center gap-1.5">
                    <Info className="w-3.5 h-3.5 text-amber-700" />
                    <span>Standar Racikan Barista & Dapur:</span>
                  </div>
                  <p className="text-xs text-[#5C5248] leading-relaxed">
                    {selectedRecipe.preparationNotes}
                  </p>
                </div>
              )}

            </div>
          )}

        </div>
      )}

      {/* Tab 2: Interactive Cost Shock & Market Fluctuation Simulator */}
      {activeTab === 'simulation' && (
        <div className="bg-white p-4 sm:p-6 rounded-3xl border border-[#EAE2D8] shadow-xs space-y-6 w-full min-w-0">
          <div className="border-b border-[#EAE2D8] pb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-start sm:items-center gap-3 min-w-0 flex-1">
              <div className="w-10 h-10 rounded-2xl bg-amber-50 border border-amber-200 text-amber-700 flex items-center justify-center shrink-0 shadow-2xs mt-0.5 sm:mt-0">
                <Sliders className="w-5 h-5" />
              </div>
              <div className="min-w-0 flex-1 space-y-0.5">
                <h3 className="font-display font-black text-base sm:text-lg text-[#1F1A16] leading-tight">
                  Simulator Sensitivitas Biaya Bahan Baku Pasar
                </h3>
                <p className="text-xs text-[#5C5248] leading-relaxed">
                  Uji dampak kenaikan atau penurunan harga komoditas pangan terhadap margin laba kotor seluruh resep menu.
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                setCoffeeCostDeltaPct(0);
                setDairyCostDeltaPct(0);
                setMeatCostDeltaPct(0);
              }}
              className="w-full sm:w-auto px-4 py-2 rounded-xl bg-[#FAF7F2] hover:bg-stone-200 text-xs font-bold text-[#1F1A16] border border-[#EAE2D8] flex items-center justify-center gap-2 cursor-pointer shadow-2xs shrink-0 active:scale-95 transition-all"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset Simulasi</span>
            </button>
          </div>

          {/* Slider Controls */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-4 rounded-2xl bg-[#FAF7F2] border border-[#EAE2D8]">
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold">
                <span>Biji Kopi Arabika / Robusta:</span>
                <span className={coffeeCostDeltaPct > 0 ? 'text-rose-600' : coffeeCostDeltaPct < 0 ? 'text-emerald-600' : 'text-stone-700'}>
                  {coffeeCostDeltaPct > 0 ? `+${coffeeCostDeltaPct}%` : `${coffeeCostDeltaPct}%`}
                </span>
              </div>
              <input
                type="range"
                min="-30"
                max="50"
                value={coffeeCostDeltaPct}
                onChange={(e) => setCoffeeCostDeltaPct(Number(e.target.value))}
                className="w-full accent-[#C84B27] cursor-pointer"
              />
              <div className="text-[10px] text-[#8C7E72] flex justify-between font-mono">
                <span>-30%</span>
                <span>Normal (0%)</span>
                <span>+50%</span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold">
                <span>Susu Segar & Cooking Cream:</span>
                <span className={dairyCostDeltaPct > 0 ? 'text-rose-600' : dairyCostDeltaPct < 0 ? 'text-emerald-600' : 'text-stone-700'}>
                  {dairyCostDeltaPct > 0 ? `+${dairyCostDeltaPct}%` : `${dairyCostDeltaPct}%`}
                </span>
              </div>
              <input
                type="range"
                min="-30"
                max="50"
                value={dairyCostDeltaPct}
                onChange={(e) => setDairyCostDeltaPct(Number(e.target.value))}
                className="w-full accent-[#C84B27] cursor-pointer"
              />
              <div className="text-[10px] text-[#8C7E72] flex justify-between font-mono">
                <span>-30%</span>
                <span>Normal (0%)</span>
                <span>+50%</span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold">
                <span>Daging Sapi, Ayam & Protein:</span>
                <span className={meatCostDeltaPct > 0 ? 'text-rose-600' : meatCostDeltaPct < 0 ? 'text-emerald-600' : 'text-stone-700'}>
                  {meatCostDeltaPct > 0 ? `+${meatCostDeltaPct}%` : `${meatCostDeltaPct}%`}
                </span>
              </div>
              <input
                type="range"
                min="-30"
                max="50"
                value={meatCostDeltaPct}
                onChange={(e) => setMeatCostDeltaPct(Number(e.target.value))}
                className="w-full accent-[#C84B27] cursor-pointer"
              />
              <div className="text-[10px] text-[#8C7E72] flex justify-between font-mono">
                <span>-30%</span>
                <span>Normal (0%)</span>
                <span>+50%</span>
              </div>
            </div>
          </div>

          {/* Simulation Results Table */}
          <div className="border border-[#EAE2D8] rounded-2xl overflow-x-auto">
            <table className="w-full text-left text-xs min-w-[600px]">
              <thead className="bg-[#FAF7F2] text-[#8C7E72] font-mono text-[10px] uppercase border-b border-[#EAE2D8]">
                <tr>
                  <th className="p-3">Menu</th>
                  <th className="p-3 text-right">Harga Jual</th>
                  <th className="p-3 text-right">HPP Semula</th>
                  <th className="p-3 text-right">HPP Tersimulasi</th>
                  <th className="p-3 text-center">Margin Semula</th>
                  <th className="p-3 text-center">Margin Baru</th>
                  <th className="p-3 text-center">Rekomendasi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EAE2D8]">
                {recipes.map((rec) => {
                  const simulatedHPP = getSimulatedRecipeHPP(rec);
                  const newMargin = Math.round(((rec.salePrice - simulatedHPP) / rec.salePrice) * 1000) / 10;
                  const deltaMargin = Math.round((newMargin - rec.grossMarginPct) * 10) / 10;

                  return (
                    <tr key={rec.id} className="hover:bg-[#FAF7F2]/40 transition-colors">
                      <td className="p-3 font-semibold text-[#1F1A16]">
                        {rec.menuItemName}
                      </td>
                      <td className="p-3 text-right font-mono font-bold text-[#1F1A16]">
                        {formatRupiah(rec.salePrice)}
                      </td>
                      <td className="p-3 text-right font-mono text-[#8C7E72]">
                        {formatRupiah(rec.totalHPP)}
                      </td>
                      <td className="p-3 text-right font-mono font-bold text-[#C84B27]">
                        {formatRupiah(simulatedHPP)}
                      </td>
                      <td className="p-3 text-center font-mono">
                        {rec.grossMarginPct}%
                      </td>
                      <td className="p-3 text-center font-mono font-bold">
                        <span className={newMargin < 65 ? 'text-rose-600' : 'text-emerald-700'}>
                          {newMargin}%
                        </span>
                        {deltaMargin !== 0 && (
                          <span className={`text-[10px] ml-1 ${deltaMargin > 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                            ({deltaMargin > 0 ? `+${deltaMargin}%` : `${deltaMargin}%`})
                          </span>
                        )}
                      </td>
                      <td className="p-3 text-center">
                        {newMargin < 60 ? (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-rose-50 text-rose-700 border border-rose-200">
                            Naikkan Harga Jual
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            Aman & Optimal
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Real-Time BOM Deduction Logs */}
      {activeTab === 'deductions' && (
        <div className="bg-white p-4 sm:p-6 rounded-3xl border border-[#EAE2D8] shadow-xs space-y-4 w-full min-w-0">
          <div className="border-b border-[#EAE2D8] pb-4 flex items-start sm:items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center shrink-0 shadow-2xs mt-0.5 sm:mt-0">
              <History className="w-5 h-5" />
            </div>
            <div className="min-w-0 flex-1 space-y-0.5">
              <h3 className="font-display font-black text-base sm:text-lg text-[#1F1A16] leading-tight">
                Log Riwayat Pemotongan Stok Bahan Baku Otomatis (Kitchen BOM)
              </h3>
              <p className="text-xs text-[#5C5248] leading-relaxed">
                Setiap kali pesanan baru diproses oleh kasir POS atau QRIS Meja, resep BOM secara otomatis mengurangi gramasi bahan baku riil di gudang.
              </p>
            </div>
          </div>

          <div className="space-y-3.5">
            {deductionLogs.map((log) => (
              <div key={log.id} className="p-4 sm:p-5 rounded-2xl sm:rounded-3xl border border-[#EAE2D8] bg-[#FAF7F2]/80 space-y-3 shadow-2xs">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#EAE2D8] pb-2.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-[#C84B27] text-white shadow-2xs">
                      Order #{log.orderNumber}
                    </span>
                    <span className="text-xs sm:text-sm font-bold text-[#1F1A16]">
                      {log.customerName}
                    </span>
                  </div>
                  <span className="text-xs font-mono text-[#5C5248] whitespace-nowrap">
                    Waktu: <strong>{log.timestamp}</strong>
                  </span>
                </div>

                <div className="space-y-2.5">
                  {log.items.map((item, idx) => (
                    <div key={idx} className="bg-white p-3.5 rounded-2xl border border-[#EAE2D8] space-y-2 shadow-2xs">
                      <div className="text-xs font-bold text-[#1F1A16] flex flex-wrap items-center justify-between gap-2">
                        <span className="text-sm font-bold text-[#1F1A16]">{item.quantity}x {item.menuItemName}</span>
                        <span className="text-[10px] font-mono font-bold text-amber-950 bg-amber-100 px-2.5 py-0.5 rounded-full border border-amber-300 whitespace-nowrap shrink-0 shadow-2xs">
                          {item.deductions.length} Bahan Terpotong
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 pt-1">
                        {item.deductions.map((deduct, dIdx) => (
                          <div key={dIdx} className="p-2.5 rounded-xl bg-stone-50 border border-stone-200/80 text-xs shadow-2xs">
                            <div className="text-[11px] font-bold text-[#1F1A16] truncate">{deduct.ingredientName}</div>
                            <div className="flex justify-between items-center text-[10px] font-mono mt-1 gap-1">
                              <span className="text-rose-600 font-bold whitespace-nowrap">-{deduct.deductAmount} {deduct.unit}</span>
                              <span className="text-[#8C7E72] whitespace-nowrap">Sisa: {deduct.stockRemaining} {deduct.inventoryUnit}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Edit Ingredients Modal */}
      <AnimatePresence>
        {isEditIngredientsOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl p-6 shadow-2xl border border-[#EAE2D8] max-w-2xl w-full space-y-5 my-auto"
            >
              <div className="flex items-center justify-between border-b border-[#EAE2D8] pb-3">
                <div>
                  <h3 className="font-display font-black text-lg text-[#1F1A16]">
                    Ubah Komposisi Bahan: {selectedRecipe.menuItemName}
                  </h3>
                  <p className="text-xs text-[#8C7E72]">
                    Atur takaran gramasi, mililiter, dan estimasi biaya per satuan bahan.
                  </p>
                </div>
                <button
                  onClick={() => setIsEditIngredientsOpen(false)}
                  className="p-1.5 rounded-xl hover:bg-stone-100 text-[#5C5248] cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3 max-h-[50vh] overflow-y-auto pr-1">
                {editIngredients.map((ing, idx) => (
                  <div key={idx} className="p-3.5 rounded-2xl bg-[#FAF7F2] border border-[#EAE2D8] grid grid-cols-12 gap-2 items-center">
                    <div className="col-span-4">
                      <label className="text-[10px] font-mono text-[#8C7E72] uppercase font-bold block mb-1">Nama Bahan</label>
                      <input
                        type="text"
                        value={ing.ingredientName}
                        onChange={(e) => {
                          const next = [...editIngredients];
                          next[idx].ingredientName = e.target.value;
                          setEditIngredients(next);
                        }}
                        className="w-full px-2.5 py-1.5 bg-white border border-[#EAE2D8] rounded-xl text-xs font-semibold focus:outline-none focus:border-[#C84B27]"
                      />
                    </div>

                    <div className="col-span-2">
                      <label className="text-[10px] font-mono text-[#8C7E72] uppercase font-bold block mb-1">Jumlah</label>
                      <input
                        type="number"
                        value={ing.quantity}
                        onChange={(e) => {
                          const next = [...editIngredients];
                          next[idx].quantity = Number(e.target.value);
                          setEditIngredients(next);
                        }}
                        className="w-full px-2.5 py-1.5 bg-white border border-[#EAE2D8] rounded-xl text-xs font-mono font-bold text-center focus:outline-none focus:border-[#C84B27]"
                      />
                    </div>

                    <div className="col-span-2">
                      <label className="text-[10px] font-mono text-[#8C7E72] uppercase font-bold block mb-1">Satuan</label>
                      <select
                        value={ing.unit}
                        onChange={(e) => {
                          const next = [...editIngredients];
                          next[idx].unit = e.target.value;
                          setEditIngredients(next);
                        }}
                        className="w-full px-2 py-1.5 bg-white border border-[#EAE2D8] rounded-xl text-xs font-mono font-bold cursor-pointer"
                      >
                        <option value="gram">gram</option>
                        <option value="ml">ml</option>
                        <option value="pcs">pcs</option>
                        <option value="porsi">porsi</option>
                      </select>
                    </div>

                    <div className="col-span-3">
                      <label className="text-[10px] font-mono text-[#8C7E72] uppercase font-bold block mb-1">Biaya / Unit (Rp)</label>
                      <input
                        type="number"
                        value={ing.costPerUnit}
                        onChange={(e) => {
                          const next = [...editIngredients];
                          next[idx].costPerUnit = Number(e.target.value);
                          setEditIngredients(next);
                        }}
                        className="w-full px-2.5 py-1.5 bg-white border border-[#EAE2D8] rounded-xl text-xs font-mono font-bold text-right focus:outline-none focus:border-[#C84B27]"
                      />
                    </div>

                    <div className="col-span-1 text-center pt-4">
                      <button
                        onClick={() => handleRemoveIngredientRow(idx)}
                        className="text-rose-500 hover:text-rose-700 p-1 cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between border-t border-[#EAE2D8] pt-4">
                <button
                  onClick={handleAddIngredientRow}
                  className="px-3.5 py-2 rounded-xl bg-[#FAF7F2] hover:bg-stone-200 text-xs font-bold text-[#1F1A16] border border-[#EAE2D8] flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5 text-[#C84B27]" />
                  <span>+ Tambah Baris Bahan</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsEditIngredientsOpen(false)}
                    className="px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-xs font-bold text-[#5C5248] cursor-pointer"
                  >
                    Batal
                  </button>
                  <button
                    onClick={handleSaveIngredients}
                    className="px-5 py-2 rounded-xl bg-[#C84B27] hover:bg-[#B23E1C] text-white text-xs font-bold flex items-center gap-2 shadow-xs cursor-pointer active:scale-95"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Simpan Perubahan</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Add New Recipe Modal */}
      <AnimatePresence>
        {isAddRecipeOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl p-6 shadow-2xl border border-[#EAE2D8] max-w-lg w-full space-y-4"
            >
              <div className="flex items-center justify-between border-b border-[#EAE2D8] pb-3">
                <h3 className="font-display font-black text-lg text-[#1F1A16]">
                  Tambah Resep & BOM Menu Baru
                </h3>
                <button
                  onClick={() => setIsAddRecipeOpen(false)}
                  className="p-1.5 rounded-xl hover:bg-stone-100 text-[#5C5248] cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="text-xs font-bold text-[#1F1A16] block mb-1">Pilih Menu dari Katalog:</label>
                  <select
                    value={newRecipeMenuItemId}
                    onChange={(e) => setNewRecipeMenuItemId(e.target.value)}
                    className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#EAE2D8] rounded-xl text-xs font-bold cursor-pointer"
                  >
                    {INITIAL_MENU_ITEMS.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.name} ({item.category}) - {formatRupiah(item.price)}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-[#1F1A16] block mb-1">Standar Racikan / Catatan Koki:</label>
                  <textarea
                    value={newRecipePrepNotes}
                    onChange={(e) => setNewRecipePrepNotes(e.target.value)}
                    rows={3}
                    placeholder="Contoh: Ekstraksi espresso 30ml suhu 92°C, steam susu 65°C..."
                    className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#EAE2D8] rounded-xl text-xs focus:outline-none focus:border-[#C84B27]"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 border-t border-[#EAE2D8] pt-3">
                <button
                  onClick={() => setIsAddRecipeOpen(false)}
                  className="px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-xs font-bold text-[#5C5248] cursor-pointer"
                >
                  Batal
                </button>
                <button
                  onClick={() => {
                    const targetMenu = INITIAL_MENU_ITEMS.find(m => m.id === newRecipeMenuItemId);
                    if (!targetMenu) return;

                    const newRec: MenuRecipe = {
                      id: `rec-${Date.now()}`,
                      menuItemId: targetMenu.id,
                      menuItemName: targetMenu.name,
                      category: targetMenu.category,
                      salePrice: targetMenu.price,
                      ingredients: [
                        { inventoryId: 'inv-1', ingredientName: 'Arabika House Blend Beans', quantity: 18, unit: 'gram', costPerUnit: 180, subtotalCost: 3240 },
                        { inventoryId: 'inv-2', ingredientName: 'Fresh Milk Pasteurized', quantity: 120, unit: 'ml', costPerUnit: 22, subtotalCost: 2640 }
                      ],
                      totalHPP: 5880,
                      grossMarginPct: Math.round(((targetMenu.price - 5880) / targetMenu.price) * 1000) / 10,
                      preparationNotes: newRecipePrepNotes || 'Racikan standar barista Homie Cozie.',
                      updatedAt: new Date().toISOString().slice(0, 10)
                    };

                    addRecipe(newRec);
                    setSelectedRecipeId(newRec.id);
                    setIsAddRecipeOpen(false);
                  }}
                  className="px-5 py-2 rounded-xl bg-[#C84B27] hover:bg-[#B23E1C] text-white text-xs font-bold flex items-center gap-1.5 shadow-xs cursor-pointer active:scale-95"
                >
                  <Check className="w-4 h-4" />
                  <span>Simpan Resep Menu</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
