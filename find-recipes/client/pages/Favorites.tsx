import { useNavigate } from "react-router-dom";
import { useRecipeStore } from "../store/useRecipeStore";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Heart } from "lucide-react";
import RecipeCard from "../components/RecipeCard";

export default function Favorites() {
  const navigate = useNavigate();
  const { favorites, user } = useRecipeStore();

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
              Back to Home
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Heart className="h-8 w-8 text-primary fill-current" />
            <h1 className="text-4xl font-bold text-foreground">
              Your Favorite Recipes
            </h1>
          </div>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            {user?.name && `Welcome back, ${user.name}! `}
            Here are all the recipes you've saved for later.
          </p>
        </div>

        {/* Favorites Grid */}
        {favorites.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {favorites.map((recipe, index) => (
              <RecipeCard
                key={`favorite-${recipe.id}-${index}`}
                recipe={recipe}
              />
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="text-center py-16">
            <div className="max-w-md mx-auto">
              <Heart className="h-16 w-16 text-muted-foreground mx-auto mb-6" />
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                No favorites yet
              </h2>
              <p className="text-muted-foreground mb-8">
                Start exploring recipes and click the heart icon to save your
                favorites here.
              </p>
              <Button
                onClick={() => navigate("/")}
                className="bg-primary hover:bg-primary/90"
              >
                Discover Recipes
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
