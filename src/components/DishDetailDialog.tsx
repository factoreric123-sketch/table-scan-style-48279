import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { X, Flame, Wheat, Milk, Egg, Fish, Shell, Nut, Sprout, Beef, Bird, Leaf } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface DishDetail {
  id: string;
  name: string;
  description: string;
  price: string;
  image: string;
  allergens?: string[];
  calories?: number;
  isVegetarian?: boolean;
  isVegan?: boolean;
  isSpicy?: boolean;
}

interface DishDetailDialogProps {
  dish: DishDetail | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const allergenIconMap: Record<string, any> = {
  gluten: Wheat,
  dairy: Milk,
  eggs: Egg,
  fish: Fish,
  shellfish: Shell,
  nuts: Nut,
  soy: Sprout,
  pork: Beef,
  beef: Beef,
  poultry: Bird,
};

export const DishDetailDialog = ({ dish, open, onOpenChange }: DishDetailDialogProps) => {
  if (!dish) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl p-0 gap-0 bg-background overflow-hidden">
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-4 top-4 z-10 rounded-full bg-background/80 backdrop-blur-sm transition-all duration-150 active:scale-95"
          onClick={() => onOpenChange(false)}
        >
          <X className="h-4 w-4" />
        </Button>

        <div className="relative w-full aspect-square bg-dish-card">
          <img
            src={dish.image}
            alt={dish.name}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="p-6 space-y-4">
          {/* Allergen badges */}
          {dish.allergens && dish.allergens.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {dish.allergens.map((allergen) => {
                const Icon = allergenIconMap[allergen.toLowerCase()] || Sprout;
                return (
                  <Badge
                    key={allergen}
                    variant="secondary"
                    className="px-3 py-1 text-sm flex items-center gap-1.5"
                  >
                    <Icon className="h-3.5 w-3.5" />
                    {allergen.charAt(0).toUpperCase() + allergen.slice(1)}
                  </Badge>
                );
              })}
            </div>
          )}

          {/* Dietary badges */}
          <div className="flex flex-wrap gap-2">
            {dish.isVegan && (
              <Badge variant="outline" className="bg-ios-green/10 text-ios-green border-ios-green/20 flex items-center gap-1.5">
                <Sprout className="h-3.5 w-3.5" />
                Vegan
              </Badge>
            )}
            {dish.isVegetarian && !dish.isVegan && (
              <Badge variant="outline" className="bg-ios-green/10 text-ios-green border-ios-green/20 flex items-center gap-1.5">
                <Leaf className="h-3.5 w-3.5" />
                Vegetarian
              </Badge>
            )}
            {dish.isSpicy && (
              <Badge variant="outline" className="bg-ios-red/10 text-ios-red border-ios-red/20 flex items-center gap-1.5">
                <Flame className="h-3.5 w-3.5" />
                Spicy
              </Badge>
            )}
          </div>

          {/* Dish info */}
          <div>
            <h2 className="text-3xl font-semibold text-foreground mb-2">{dish.name}</h2>
            <p className="text-muted-foreground leading-relaxed">{dish.description}</p>
          </div>

          {/* Price and calories */}
          <div className="flex items-center justify-between pt-4 border-t border-border">
            <div className="text-3xl font-semibold text-foreground">{dish.price}</div>
            {dish.calories && (
              <div className="text-sm text-muted-foreground">
                {dish.calories} calories
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
