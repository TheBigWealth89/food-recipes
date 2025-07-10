import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Recipe, SearchFilters, User } from "../types/recipes";
import { recipeApi } from "../services/recipeApi";

interface RecipeStore {
  // Search state
  searchQuery: string;
  searchResults: Recipe[];
  searchFilters: SearchFilters;
  isSearching: boolean;
  searchError: string | null;

  // Favorites
  favorites: Recipe[];

  // User
  user: User | null;

  // Recent searches
  recentSearches: string[];

  // Actions
  setSearchQuery: (query: string) => void;
  performSearch: (query: string, filters?: SearchFilters) => Promise<void>;
  setSearchFilters: (filters: SearchFilters) => void;
  clearSearchResults: () => void;

  // Favorites actions
  toggleFavorite: (recipe: Recipe) => void;
  isFavorite: (recipeId: number) => boolean;

  // User actions
  setUser: (user: User) => void;
  logout: () => void;

  // Recent searches actions
  addRecentSearch: (query: string) => void;
  clearRecentSearches: () => void;

  // Recipe details
  getRecipe: (id: number) => Promise<Recipe | null>;
}

export const useRecipeStore = create<RecipeStore>()(
  persist(
    (set, get) => ({
      // Initial state
      searchQuery: "",
      searchResults: [],
      searchFilters: {},
      isSearching: false,
      searchError: null,
      favorites: [],
      user: {
        id: "guest-user",
        name: "Guest User",
        email: "guest@recipeapp.com",
      },
      recentSearches: [],

      // Search actions
      setSearchQuery: (query: string) => set({ searchQuery: query }),

      performSearch: async (query: string, filters?: SearchFilters) => {
        set({ isSearching: true, searchError: null });

        try {
          const results = await recipeApi.searchRecipes(query, filters || {});

          set({
            searchResults: results,
            searchQuery: query,
            searchFilters: filters || {},
            isSearching: false,
          });

          // Add to recent searches if not empty
          if (query.trim()) {
            get().addRecentSearch(query.trim());
          }
        } catch (error) {
          set({
            searchError: "Failed to search recipes. Please try again.",
            isSearching: false,
          });
        }
      },

      setSearchFilters: (filters: SearchFilters) =>
        set({ searchFilters: filters }),

      clearSearchResults: () =>
        set({ searchResults: [], searchQuery: "", searchError: null }),

      // Favorites actions
      toggleFavorite: (recipe: Recipe) => {
        const currentFavorites = get().favorites;
        const isCurrentlyFavorite = currentFavorites.some(
          (fav) => fav.id === recipe.id,
        );

        if (isCurrentlyFavorite) {
          set({
            favorites: currentFavorites.filter((fav) => fav.id !== recipe.id),
          });
        } else {
          set({
            favorites: [...currentFavorites, recipe],
          });
        }
      },

      isFavorite: (recipeId: number) => {
        return get().favorites.some((fav) => fav.id === recipeId);
      },

      // User actions
      setUser: (user: User) => set({ user }),

      logout: () =>
        set({
          user: null,
          favorites: [],
          recentSearches: [],
          searchResults: [],
          searchQuery: "",
        }),

      // Recent searches actions
      addRecentSearch: (query: string) => {
        const current = get().recentSearches;
        const filtered = current.filter((search) => search !== query);
        const updated = [query, ...filtered].slice(0, 10); // Keep only last 10
        set({ recentSearches: updated });
      },

      clearRecentSearches: () => set({ recentSearches: [] }),

      // Recipe details
      getRecipe: async (id: number) => {
        return await recipeApi.getRecipeById(id);
      },
    }),
    {
      name: "recipe-app-storage",
      partialize: (state) => ({
        favorites: state.favorites,
        user: state.user,
        recentSearches: state.recentSearches,
      }),
    },
  ),
);
