import { Recipe, SearchFilters } from "../types/recipes";

// TheMealDB API Configuration
const BASE_URL = "https://www.themealdb.com/api/json/v1/1";

// TheMealDB API response interfaces
interface TheMealDBMeal {
  idMeal: string;
  strMeal: string;
  strDrinkAlternate?: string;
  strCategory: string;
  strArea: string;
  strInstructions: string;
  strMealThumb: string;
  strTags?: string;
  strYoutube?: string;
  strIngredient1?: string;
  strIngredient2?: string;
  strIngredient3?: string;
  strIngredient4?: string;
  strIngredient5?: string;
  strIngredient6?: string;
  strIngredient7?: string;
  strIngredient8?: string;
  strIngredient9?: string;
  strIngredient10?: string;
  strIngredient11?: string;
  strIngredient12?: string;
  strIngredient13?: string;
  strIngredient14?: string;
  strIngredient15?: string;
  strIngredient16?: string;
  strIngredient17?: string;
  strIngredient18?: string;
  strIngredient19?: string;
  strIngredient20?: string;
  strMeasure1?: string;
  strMeasure2?: string;
  strMeasure3?: string;
  strMeasure4?: string;
  strMeasure5?: string;
  strMeasure6?: string;
  strMeasure7?: string;
  strMeasure8?: string;
  strMeasure9?: string;
  strMeasure10?: string;
  strMeasure11?: string;
  strMeasure12?: string;
  strMeasure13?: string;
  strMeasure14?: string;
  strMeasure15?: string;
  strMeasure16?: string;
  strMeasure17?: string;
  strMeasure18?: string;
  strMeasure19?: string;
  strMeasure20?: string;
  strSource?: string;
  strImageSource?: string;
  strCreativeCommonsConfirmed?: string;
  dateModified?: string;
}

interface TheMealDBResponse {
  meals: TheMealDBMeal[] | null;
}

interface TheMealDBCategory {
  idCategory: string;
  strCategory: string;
  strCategoryThumb: string;
  strCategoryDescription: string;
}

interface TheMealDBArea {
  strArea: string;
}

// Transform TheMealDB meal to our Recipe interface
const transformMealToRecipe = (meal: TheMealDBMeal): Recipe => {
  // Extract ingredients and measurements
  const ingredients = [];
  for (let i = 1; i <= 20; i++) {
    const ingredient = meal[
      `strIngredient${i}` as keyof TheMealDBMeal
    ] as string;
    const measure = meal[`strMeasure${i}` as keyof TheMealDBMeal] as string;

    if (ingredient && ingredient.trim()) {
      ingredients.push({
        id: i,
        name: ingredient.trim(),
        amount: parseFloat(measure?.match(/\d+(\.\d+)?/)?.[0] || "1") || 1,
        unit: measure?.replace(/\d+(\.\d+)?/g, "").trim() || "",
        original: `${measure || ""} ${ingredient}`.trim(),
      });
    }
  }

  // Determine dietary information based on category and ingredients
  const category = meal.strCategory.toLowerCase();
  const ingredientNames = ingredients
    .map((ing) => ing.name.toLowerCase())
    .join(" ");

  const isVegetarian =
    category.includes("vegetarian") ||
    (!ingredientNames.includes("chicken") &&
      !ingredientNames.includes("beef") &&
      !ingredientNames.includes("pork") &&
      !ingredientNames.includes("fish") &&
      !ingredientNames.includes("lamb") &&
      !ingredientNames.includes("turkey") &&
      !ingredientNames.includes("meat"));

  const isVegan =
    isVegetarian &&
    !ingredientNames.includes("cheese") &&
    !ingredientNames.includes("milk") &&
    !ingredientNames.includes("cream") &&
    !ingredientNames.includes("butter") &&
    !ingredientNames.includes("egg");

  return {
    id: parseInt(meal.idMeal),
    title: meal.strMeal,
    image: meal.strMealThumb,
    readyInMinutes: 30, // TheMealDB doesn't provide this, so we estimate
    servings: 4, // TheMealDB doesn't provide this, so we estimate
    summary: `A delicious ${meal.strCategory} dish from ${meal.strArea}.`,
    extendedIngredients: ingredients,
    instructions: meal.strInstructions,
    cuisines: [meal.strArea],
    dishTypes: [meal.strCategory.toLowerCase()],
    diets: [
      ...(isVegetarian ? ["vegetarian"] : []),
      ...(isVegan ? ["vegan"] : []),
    ],
    vegetarian: isVegetarian,
    vegan: isVegan,
    glutenFree: false, // Can't determine from TheMealDB data
    dairyFree: isVegan,
    spoonacularScore: 75, // Default score
    healthScore: isVegetarian ? 80 : 70, // Higher score for vegetarian meals
  };
};

// API call wrapper with error handling
const apiCall = async (url: string): Promise<any> => {
  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("TheMealDB API call failed:", error);
    throw error;
  }
};

export const recipeApi = {
  // Search recipes by name
  searchRecipes: async (
    query: string,
    filters: SearchFilters = {},
  ): Promise<Recipe[]> => {
    try {
      let meals: TheMealDBMeal[] = [];

      // If there's a search query, search by name
      if (query.trim()) {
        const url = `${BASE_URL}/search.php?s=${encodeURIComponent(query)}`;
        const data: TheMealDBResponse = await apiCall(url);
        meals = data.meals || [];
      }
      // If filtering by category
      else if (filters.type) {
        const url = `${BASE_URL}/filter.php?c=${encodeURIComponent(filters.type)}`;
        const data: TheMealDBResponse = await apiCall(url);
        meals = data.meals || [];
      }
      // If filtering by area (cuisine)
      else if (filters.cuisine) {
        const url = `${BASE_URL}/filter.php?a=${encodeURIComponent(filters.cuisine)}`;
        const data: TheMealDBResponse = await apiCall(url);
        meals = data.meals || [];
      }
      // Default: get random meals
      else {
        // Get multiple random meals
        const randomPromises = Array(20) // Get more to account for duplicates
          .fill(null)
          .map(() => apiCall(`${BASE_URL}/random.php`));
        const randomResponses = await Promise.all(randomPromises);
        const allMeals = randomResponses
          .filter((response) => response.meals)
          .map((response) => response.meals[0]);

        // Remove duplicates by ID and limit to 12
        meals = Array.from(
          new Map(allMeals.map((meal) => [meal.idMeal, meal])).values(),
        ).slice(0, 12);
      }

      // Get full details for each meal if we only have basic info
      const detailedMeals = await Promise.all(
        meals.slice(0, 12).map(async (meal) => {
          // If meal doesn't have instructions, fetch full details
          if (!meal.strInstructions) {
            try {
              const detailUrl = `${BASE_URL}/lookup.php?i=${meal.idMeal}`;
              const detailData: TheMealDBResponse = await apiCall(detailUrl);
              return detailData.meals?.[0] || meal;
            } catch {
              return meal;
            }
          }
          return meal;
        }),
      );

      return detailedMeals.map(transformMealToRecipe);
    } catch (error) {
      console.error("Search failed:", error);
      throw new Error("Failed to search recipes. Please try again.");
    }
  },

  // Get recipe by ID
  getRecipeById: async (id: number): Promise<Recipe | null> => {
    try {
      const url = `${BASE_URL}/lookup.php?i=${id}`;
      const data: TheMealDBResponse = await apiCall(url);

      if (!data.meals || data.meals.length === 0) {
        return null;
      }

      return transformMealToRecipe(data.meals[0]);
    } catch (error) {
      console.error("Get recipe by ID failed:", error);
      return null;
    }
  },

  // Get random recipes
  getRandomRecipes: async (count: number = 6): Promise<Recipe[]> => {
    try {
      const randomPromises = Array(count * 2) // Get more than needed to account for duplicates
        .fill(null)
        .map(() => apiCall(`${BASE_URL}/random.php`));

      const responses = await Promise.all(randomPromises);
      const meals = responses
        .filter((response) => response.meals)
        .map((response) => response.meals[0]);

      // Remove duplicates by ID and limit to requested count
      const uniqueMeals = Array.from(
        new Map(meals.map((meal) => [meal.idMeal, meal])).values(),
      ).slice(0, count);

      return uniqueMeals.map(transformMealToRecipe);
    } catch (error) {
      console.error("Get random recipes failed:", error);
      throw new Error("Failed to get random recipes. Please try again.");
    }
  },

  // Get featured recipes (popular categories)
  getFeaturedRecipes: async (): Promise<Recipe[]> => {
    try {
      // Get meals from popular categories
      const categories = [
        "Chicken",
        "Beef",
        "Pasta",
        "Seafood",
        "Vegetarian",
        "Dessert",
      ];
      const promises = categories.map(async (category) => {
        try {
          const url = `${BASE_URL}/filter.php?c=${category}`;
          const data: TheMealDBResponse = await apiCall(url);
          // Get first meal from each category and fetch full details
          if (data.meals && data.meals.length > 0) {
            const mealId = data.meals[0].idMeal;
            const detailUrl = `${BASE_URL}/lookup.php?i=${mealId}`;
            const detailData: TheMealDBResponse = await apiCall(detailUrl);
            return detailData.meals?.[0];
          }
          return null;
        } catch {
          return null;
        }
      });

      const meals = (await Promise.all(promises)).filter(
        Boolean,
      ) as TheMealDBMeal[];
      return meals.map(transformMealToRecipe).slice(0, 6);
    } catch (error) {
      console.error("Get featured recipes failed:", error);
      throw new Error("Failed to get featured recipes. Please try again.");
    }
  },

  // Get available categories
  getCategories: async (): Promise<string[]> => {
    try {
      const url = `${BASE_URL}/list.php?c=list`;
      const data = await apiCall(url);
      return data.meals?.map((cat: TheMealDBCategory) => cat.strCategory) || [];
    } catch (error) {
      console.error("Get categories failed:", error);
      return [];
    }
  },

  // Get available areas (cuisines)
  getAreas: async (): Promise<string[]> => {
    try {
      const url = `${BASE_URL}/list.php?a=list`;
      const data = await apiCall(url);
      return data.meals?.map((area: TheMealDBArea) => area.strArea) || [];
    } catch (error) {
      console.error("Get areas failed:", error);
      return [];
    }
  },
};

export const isUsingRealApi = () => true; // TheMealDB is always available
