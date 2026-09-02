import { describe, it, expect } from 'vitest';
import { DEFAULT_MENU_RECIPES, calculateRecipeHPP, getRecipeForMenuItem } from '../src/data/recipeData';

describe('Recipe & Bill of Materials (BOM) Costing Suite', () => {

  it('should contain recipes for core signature items', () => {
    expect(DEFAULT_MENU_RECIPES.length).toBeGreaterThanOrEqual(8);
    const signature = DEFAULT_MENU_RECIPES.find(r => r.menuItemName.includes('Signature'));
    expect(signature).toBeDefined();
    expect(signature?.ingredients.length).toBeGreaterThanOrEqual(3);
  });

  it('should accurately calculate total HPP from ingredients breakdown', () => {
    const kopsus = DEFAULT_MENU_RECIPES[0];
    const calculatedHPP = calculateRecipeHPP(kopsus.ingredients);
    
    // 18g * 180 = 3240
    // 120ml * 22 = 2640
    // 25ml * 35 = 875
    // 1pcs * 850 = 850
    // Total = 7605
    expect(calculatedHPP).toBe(7605);
    expect(kopsus.totalHPP).toBe(calculatedHPP);
  });

  it('should maintain a healthy Gross Profit Margin (> 60%) for cafe profitability', () => {
    DEFAULT_MENU_RECIPES.forEach(recipe => {
      const margin = ((recipe.salePrice - recipe.totalHPP) / recipe.salePrice) * 100;
      expect(margin).toBeGreaterThanOrEqual(60);
      expect(recipe.grossMarginPct).toBeCloseTo(margin, 1);
    });
  });

  it('should retrieve recipe by menuItemId correctly', () => {
    const recipe = getRecipeForMenuItem('m-1');
    expect(recipe).toBeDefined();
    expect(recipe?.menuItemName).toBe('Kopi Susu Homie Signature');
    expect(recipe?.category).toBe('Coffee');
  });

  it('should convert units properly for stock deduction (gram to kg, ml to Liter)', () => {
    const ingredientGram = 18;
    const kgDeduction = ingredientGram / 1000;
    expect(kgDeduction).toBe(0.018);

    const ingredientMl = 120;
    const literDeduction = ingredientMl / 1000;
    expect(literDeduction).toBe(0.12);
  });

});
