import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useRecipeStore } from "../store/useRecipeStore";
import { recipeApi } from "../services/recipeApi";
import { Recipe } from "../types/recipes";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Heart, Clock, Users, Star } from "lucide-react";

export default function RecipeDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toggleFavorite, isFavorite } = useRecipeStore();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadRecipe = async () => {
      if (!id) return;

      setLoading(true);
      try {
        const recipeData = await recipeApi.getRecipeById(parseInt(id));
        setRecipe(recipeData);
      } catch (error) {
        console.error("Failed to load recipe:", error);
      } finally {
        setLoading(false);
      }
    };

    loadRecipe();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading recipe...</p>
        </div>
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">
            Recipe Not Found
          </h1>
          <Button onClick={() => navigate("/")} variant="outline">
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  const isRecipeFavorited = isFavorite(recipe.id);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/")}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Recipes
            </Button>
            <Button
              variant={isRecipeFavorited ? "default" : "outline"}
              size="sm"
              onClick={() => toggleFavorite(recipe)}
              className="flex items-center gap-2"
            >
              <Heart
                className={`h-4 w-4 ${isRecipeFavorited ? "fill-current" : ""}`}
              />
              {isRecipeFavorited ? "Favorited" : "Add to Favorites"}
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Hero Image and Title */}
        <div className="relative rounded-2xl overflow-hidden mb-8">
          <img
            src={recipe.image}
            alt={recipe.title}
            className="w-full h-64 md:h-96 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          <div className="absolute bottom-6 left-6 right-6 text-white">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              {recipe.title}
            </h1>
            <div className="flex flex-wrap gap-4 text-sm">
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {recipe.readyInMinutes} mins
              </div>
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                {recipe.servings} servings
              </div>
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-current" />
                {recipe.spoonacularScore}/100
              </div>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="md:col-span-2 space-y-8">
            {/* Summary */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">About This Recipe</h2>
              <p className="text-muted-foreground leading-relaxed">
                {recipe.summary}
              </p>
            </section>

            {/* Instructions */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">Instructions</h2>
              <div className="bg-card rounded-xl p-6 border border-border">
                <div className="whitespace-pre-line text-card-foreground leading-relaxed">
                  {recipe.instructions}
                </div>
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Ingredients */}
            <section>
              <h3 className="text-xl font-semibold mb-4">Ingredients</h3>
              <div className="bg-card rounded-xl p-6 border border-border space-y-3">
                {recipe.extendedIngredients.map((ingredient) => (
                  <div
                    key={ingredient.id}
                    className="flex justify-between items-start"
                  >
                    <span className="text-card-foreground font-medium">
                      {ingredient.name}
                    </span>
                    <span className="text-muted-foreground text-sm ml-2">
                      {ingredient.amount} {ingredient.unit}
                    </span>
                  </div>
                ))}
              </div>
            </section>

            {/* Diet Info */}
            <section>
              <h3 className="text-xl font-semibold mb-4">
                Dietary Information
              </h3>
              <div className="space-y-3">
                <div className="flex flex-wrap gap-2">
                  {recipe.vegetarian && (
                    <Badge variant="secondary" className="recipe-badge-success">
                      Vegetarian
                    </Badge>
                  )}
                  {recipe.vegan && (
                    <Badge variant="secondary" className="recipe-badge-success">
                      Vegan
                    </Badge>
                  )}
                  {recipe.glutenFree && (
                    <Badge variant="secondary" className="recipe-badge-primary">
                      Gluten Free
                    </Badge>
                  )}
                  {recipe.dairyFree && (
                    <Badge variant="secondary" className="recipe-badge-primary">
                      Dairy Free
                    </Badge>
                  )}
                </div>

                {recipe.cuisines.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2">Cuisines</h4>
                    <div className="flex flex-wrap gap-2">
                      {recipe.cuisines.map((cuisine) => (
                        <Badge key={cuisine} variant="outline">
                          {cuisine}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {recipe.dishTypes.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2">Dish Types</h4>
                    <div className="flex flex-wrap gap-2">
                      {recipe.dishTypes.map((type) => (
                        <Badge key={type} variant="outline">
                          {type}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </section>

            {/* Health Score */}
            <section>
              <h3 className="text-xl font-semibold mb-4">Health & Nutrition</h3>
              <div className="bg-card rounded-xl p-6 border border-border space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-card-foreground">Health Score</span>
                    <span className="font-bold">{recipe.healthScore}/100</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className="bg-success h-2 rounded-full transition-all"
                      style={{ width: `${recipe.healthScore}%` }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-card-foreground">Recipe Score</span>
                    <span className="font-bold">
                      {recipe.spoonacularScore}/100
                    </span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full transition-all"
                      style={{ width: `${recipe.spoonacularScore}%` }}
                    />
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
