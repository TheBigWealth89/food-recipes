import { useNavigate } from "react-router-dom";
import { Recipe } from "../types/recipes";
import { useRecipeStore } from "../store/useRecipeStore";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, Clock, Users, Star } from "lucide-react";

interface RecipeCardProps {
  recipe: Recipe;
}

export default function RecipeCard({ recipe }: RecipeCardProps) {
  const navigate = useNavigate();
  const { toggleFavorite, isFavorite } = useRecipeStore();

  const isRecipeFavorited = isFavorite(recipe.id);

  const handleCardClick = () => {
    navigate(`/recipe/${recipe.id}`);
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFavorite(recipe);
  };

  return (
    <div className="recipe-card cursor-pointer group" onClick={handleCardClick}>
      {/* Image Container */}
      <div className="relative overflow-hidden">
        <img
          src={recipe.image}
          alt={recipe.title}
          className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
        />

        {/* Favorite Button */}
        <Button
          variant="secondary"
          size="sm"
          className="absolute top-3 right-3 h-8 w-8 p-0 bg-white/90 hover:bg-white backdrop-blur-sm"
          onClick={handleFavoriteClick}
        >
          <Heart
            className={`h-4 w-4 transition-colors ${
              isRecipeFavorited ? "text-red-500 fill-current" : "text-gray-600"
            }`}
          />
        </Button>

        {/* Quick Info Overlay */}
        <div className="absolute bottom-3 left-3 right-3 text-white">
          <div className="flex items-center gap-3 text-sm">
            <div className="flex items-center gap-1 bg-black/40 backdrop-blur-sm rounded-full px-2 py-1">
              <Clock className="h-3 w-3" />
              {recipe.readyInMinutes}m
            </div>
            <div className="flex items-center gap-1 bg-black/40 backdrop-blur-sm rounded-full px-2 py-1">
              <Users className="h-3 w-3" />
              {recipe.servings}
            </div>
            <div className="flex items-center gap-1 bg-black/40 backdrop-blur-sm rounded-full px-2 py-1">
              <Star className="h-3 w-3 fill-current" />
              {recipe.spoonacularScore}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Title */}
        <h3 className="font-semibold text-lg leading-tight text-card-foreground group-hover:text-primary transition-colors line-clamp-2">
          {recipe.title}
        </h3>

        {/* Summary */}
        <p className="text-muted-foreground text-sm leading-relaxed line-clamp-2">
          {recipe.summary.replace(/<[^>]*>/g, "")}
        </p>

        {/* Diet Badges */}
        <div className="flex flex-wrap gap-2">
          {recipe.vegetarian && (
            <Badge variant="secondary" className="recipe-badge-success text-xs">
              Vegetarian
            </Badge>
          )}
          {recipe.vegan && (
            <Badge variant="secondary" className="recipe-badge-success text-xs">
              Vegan
            </Badge>
          )}
          {recipe.glutenFree && (
            <Badge variant="secondary" className="recipe-badge-primary text-xs">
              Gluten Free
            </Badge>
          )}
          {recipe.dairyFree && (
            <Badge variant="secondary" className="recipe-badge-primary text-xs">
              Dairy Free
            </Badge>
          )}
        </div>

        {/* Cuisine */}
        {recipe.cuisines.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {recipe.cuisines.slice(0, 2).map((cuisine) => (
              <Badge key={cuisine} variant="outline" className="text-xs">
                {cuisine}
              </Badge>
            ))}
            {recipe.cuisines.length > 2 && (
              <Badge variant="outline" className="text-xs">
                +{recipe.cuisines.length - 2} more
              </Badge>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
