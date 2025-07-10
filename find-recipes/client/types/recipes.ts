export interface Recipe {
  id: number;
  title: string;
  image: string;
  readyInMinutes: number;
  servings: number;
  summary: string;
  extendedIngredients: Ingredient[];
  instructions: string;
  cuisines: string[];
  dishTypes: string[];
  diets: string[];
  vegetarian: boolean;
  vegan: boolean;
  glutenFree: boolean;
  dairyFree: boolean;
  spoonacularScore: number;
  healthScore: number;
}

export interface Ingredient {
  id: number;
  name: string;
  amount: number;
  unit: string;
  original: string;
}

export interface RecipeSearchResult {
  results: Recipe[];
  offset: number;
  number: number;
  totalResults: number;
}

export interface SearchFilters {
  diet?: string;
  intolerances?: string;
  cuisine?: string;
  type?: string;
  sort?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
}
