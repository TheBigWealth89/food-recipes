import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useRecipeStore } from "../store/useRecipeStore";
import { recipeApi, isUsingRealApi } from "../services/recipeApi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Heart,
  User,
  Clock,
  Star,
  TrendingUp,
  ChefHat,
  Sparkles,
  Filter,
} from "lucide-react";
import RecipeCard from "../components/RecipeCard";

export default function Index() {
  const navigate = useNavigate();
  const {
    searchQuery,
    searchResults,
    isSearching,
    searchError,
    user,
    favorites,
    recentSearches,
    performSearch,
    setSearchQuery,
    addRecentSearch,
    setSearchFilters,
    searchFilters,
  } = useRecipeStore();

  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery);
  const [featuredRecipes, setFeaturedRecipes] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [categories, setCategories] = useState<string[]>([]);
  const [areas, setAreas] = useState<string[]>([]);

  // Load featured recipes, categories, and areas on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        // Load featured recipes
        const featured = await recipeApi.getFeaturedRecipes();
        setFeaturedRecipes(featured);

        // Load categories and areas for filters
        const [categoriesData, areasData] = await Promise.all([
          recipeApi.getCategories(),
          recipeApi.getAreas(),
        ]);
        setCategories(categoriesData);
        setAreas(areasData);
      } catch (error) {
        console.error("Failed to load data:", error);
      }
    };

    loadData();

    // Load random recipes if no search has been performed
    if (searchResults.length === 0 && !searchQuery) {
      performSearch("", {});
    }
  }, []);

  const handleSearch = async (query: string) => {
    await performSearch(query, searchFilters);
    if (query.trim()) {
      addRecentSearch(query);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch(localSearchQuery);
  };

  const handleQuickSearch = (query: string) => {
    setLocalSearchQuery(query);
    handleSearch(query);
  };

  const handleFilterChange = (filterType: string, value: string) => {
    const newFilters = { ...searchFilters, [filterType]: value || undefined };
    setSearchFilters(newFilters);
    performSearch(localSearchQuery, newFilters);
  };

  const clearFilters = () => {
    setSearchFilters({});
    performSearch(localSearchQuery, {});
  };

  const quickSearchTerms = [
    "chicken",
    "vegetarian",
    "pasta",
    "healthy",
    "quick meals",
    "dessert",
  ];

  const cuisineOptions = [
    { value: "", label: "All Cuisines" },
    ...areas.map((area) => ({ value: area, label: area })),
  ];

  const typeOptions = [
    { value: "", label: "All Categories" },
    ...categories.map((category) => ({ value: category, label: category })),
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="bg-primary p-2 rounded-xl">
                <ChefHat className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">
                  Recipe Finder
                </h1>
                <p className="text-xs text-muted-foreground">
                  Discover amazing recipes
                </p>
              </div>
            </div>

            {/* User Actions */}
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/favorites")}
                className="flex items-center gap-2"
              >
                <Heart className="h-4 w-4" />
                <span className="hidden sm:inline">
                  Favorites ({favorites.length})
                </span>
              </Button>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <User className="h-4 w-4" />
                <span className="hidden sm:inline">
                  {user?.name || "Guest"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <section className="text-center mb-12">
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="space-y-4">
              <h2 className="text-4xl md:text-6xl font-bold text-foreground">
                Find Your Perfect <span className="text-primary">Recipe</span>
              </h2>
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
                Discover thousands of delicious recipes tailored to your taste.
                Search by ingredients, cuisine, or dietary preferences.
              </p>
            </div>

            {/* Search Bar */}
            <form
              onSubmit={handleSearchSubmit}
              className="relative max-w-2xl mx-auto"
            >
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Search for recipes, ingredients, or cuisines..."
                  value={localSearchQuery}
                  onChange={(e) => setLocalSearchQuery(e.target.value)}
                  className="search-input text-lg pr-20"
                />
                <Button
                  type="submit"
                  size="lg"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-primary hover:bg-primary/90"
                  disabled={isSearching}
                >
                  {isSearching ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                  ) : (
                    "Search"
                  )}
                </Button>
              </div>
            </form>

            {/* Filter Button */}
            <div className="flex justify-center">
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2"
              >
                <Filter className="h-4 w-4" />
                Filters
                {Object.keys(searchFilters).some(
                  (key) => searchFilters[key],
                ) && (
                  <Badge
                    variant="secondary"
                    className="ml-1 h-5 w-5 p-0 text-xs"
                  >
                    {Object.values(searchFilters).filter(Boolean).length}
                  </Badge>
                )}
              </Button>
            </div>

            {/* Filters Panel */}
            {showFilters && (
              <div className="bg-card border border-border rounded-xl p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      Cuisine
                    </label>
                    <Select
                      value={searchFilters.cuisine || ""}
                      onValueChange={(value) =>
                        handleFilterChange("cuisine", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select cuisine" />
                      </SelectTrigger>
                      <SelectContent>
                        {cuisineOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      Category
                    </label>
                    <Select
                      value={searchFilters.type || ""}
                      onValueChange={(value) =>
                        handleFilterChange("type", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {typeOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex justify-center">
                  <Button variant="outline" onClick={clearFilters} size="sm">
                    Clear All Filters
                  </Button>
                </div>
              </div>
            )}

            {/* Quick Search Tags */}
            <div className="flex flex-wrap justify-center gap-2">
              {quickSearchTerms.map((term) => (
                <Button
                  key={term}
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuickSearch(term)}
                  className="rounded-full"
                >
                  {term}
                </Button>
              ))}
            </div>

            {/* Recent Searches */}
            {recentSearches.length > 0 && (
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-2">
                  Recent searches:
                </p>
                <div className="flex flex-wrap justify-center gap-2">
                  {recentSearches.slice(0, 5).map((search, index) => (
                    <Button
                      key={index}
                      variant="ghost"
                      size="sm"
                      onClick={() => handleQuickSearch(search)}
                      className="text-xs"
                    >
                      {search}
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Error State */}
        {searchError && (
          <div className="max-w-2xl mx-auto mb-8">
            <div className="bg-destructive/10 border border-destructive/20 rounded-xl p-4 text-center">
              <p className="text-destructive">{searchError}</p>
            </div>
          </div>
        )}

        {/* Loading State */}
        {isSearching && (
          <section className="text-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
            <p className="text-muted-foreground">Searching for recipes...</p>
          </section>
        )}

        {/* Search Results */}
        {!isSearching && searchResults.length > 0 && (
          <section className="mb-12">
            {searchQuery && (
              <div className="flex items-center gap-3 mb-6">
                <h3 className="text-2xl font-semibold text-foreground">
                  Search Results {searchQuery && `for "${searchQuery}"`}
                </h3>
                <Badge variant="secondary">
                  {searchResults.length} recipes
                </Badge>
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {searchResults.map((recipe, index) => (
                <RecipeCard
                  key={`search-${recipe.id}-${index}`}
                  recipe={recipe}
                />
              ))}
            </div>
          </section>
        )}

        {/* No Results */}
        {!isSearching && searchQuery && searchResults.length === 0 && (
          <section className="text-center py-16">
            <div className="max-w-md mx-auto">
              <h3 className="text-2xl font-semibold text-foreground mb-4">
                No recipes found
              </h3>
              <p className="text-muted-foreground mb-8">
                Try searching with different keywords or adjust your filters.
              </p>
            </div>
          </section>
        )}

        {/* Featured Recipes */}
        {!searchQuery && featuredRecipes.length > 0 && !isSearching && (
          <section className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <Sparkles className="h-5 w-5 text-primary" />
              <h3 className="text-2xl font-semibold text-foreground">
                Featured Recipes
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredRecipes.map((recipe, index) => (
                <RecipeCard
                  key={`featured-${recipe.id}-${index}`}
                  recipe={recipe}
                />
              ))}
            </div>
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-border mt-16 py-8">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="bg-primary p-1.5 rounded-lg">
              <ChefHat className="h-4 w-4 text-white" />
            </div>
            <span className="font-semibold text-foreground">Recipe Finder</span>
          </div>
          <p className="text-sm text-muted-foreground">
            Discover, cook, and share amazing recipes from around the world.
          </p>
        </div>
      </footer>
    </div>
  );
}
