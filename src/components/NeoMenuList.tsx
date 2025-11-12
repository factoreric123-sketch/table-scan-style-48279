import { useState, memo, useCallback } from "react";
import { Badge } from "@/components/ui/badge";
import { DishDetailDialog, DishDetail } from "./DishDetailDialog";
import { Flame } from "lucide-react";

export interface Dish {
  id: string;
  name: string;
  description: string;
  price: string;
  image: string;
  isNew?: boolean;
  isSpecial?: boolean;
  isPopular?: boolean;
  isChefRecommendation?: boolean;
  category?: string;
  subcategory?: string;
  allergens?: string[];
  calories?: number | null;
  isVegetarian?: boolean;
  isVegan?: boolean;
  isSpicy?: boolean;
}

interface NeoMenuListProps {
  dishes: Dish[];
  sectionTitle: string;
}

const NeoMenuList = memo(({ dishes, sectionTitle }: NeoMenuListProps) => {
  const [selectedDish, setSelectedDish] = useState<DishDetail | null>(null);

  const handleDishClick = useCallback((dish: Dish) => {
    setSelectedDish({
      id: dish.id,
      name: dish.name,
      description: dish.description,
      price: dish.price,
      image: dish.image,
      allergens: dish.allergens,
      calories: dish.calories,
      isVegetarian: dish.isVegetarian,
      isVegan: dish.isVegan,
      isSpicy: dish.isSpicy,
    });
  }, []);

  if (dishes.length === 0) {
    return (
      <div className="px-6 py-12 text-center">
        <p className="text-muted-foreground">No dishes available in this category.</p>
      </div>
    );
  }

  return (
    <>
      <div className="px-5 py-6" style={{ contentVisibility: 'auto' }}>
        <h2 className="text-2xl font-bold text-foreground mb-5 px-1">{sectionTitle}</h2>
        <div className="space-y-0">
          {dishes.map((dish, index) => (
            <div key={dish.id}>
              <button
                onClick={() => handleDishClick(dish)}
                className="w-full flex items-start gap-4 py-5 px-1 text-left hover:bg-muted/30 transition-colors rounded-lg"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-start gap-2 mb-1">
                    <h3 className="text-lg font-semibold text-foreground leading-tight">
                      {dish.name}
                    </h3>
                    {dish.isSpicy && (
                      <Flame className="h-4 w-4 text-orange-500 flex-shrink-0 mt-0.5" />
                    )}
                  </div>
                  
                  {/* Badges */}
                  {(dish.isNew || dish.isSpecial || dish.isPopular || dish.isChefRecommendation) && (
                    <div className="flex flex-wrap gap-1.5 mb-2">
                      {dish.isPopular && (
                        <Badge variant="secondary" className="text-xs px-2 py-0 h-5">
                          🔥 Bestseller
                        </Badge>
                      )}
                      {dish.isNew && (
                        <Badge variant="secondary" className="text-xs px-2 py-0 h-5">
                          ✨ New
                        </Badge>
                      )}
                      {dish.isSpecial && (
                        <Badge variant="secondary" className="text-xs px-2 py-0 h-5">
                          ⭐ Special
                        </Badge>
                      )}
                      {dish.isChefRecommendation && (
                        <Badge variant="secondary" className="text-xs px-2 py-0 h-5">
                          👨‍🍳 Chef's Pick
                        </Badge>
                      )}
                      {dish.isVegan && (
                        <Badge variant="secondary" className="text-xs px-2 py-0 h-5">
                          🌱 Vegan
                        </Badge>
                      )}
                      {!dish.isVegan && dish.isVegetarian && (
                        <Badge variant="secondary" className="text-xs px-2 py-0 h-5">
                          🥬 Vegetarian
                        </Badge>
                      )}
                    </div>
                  )}
                  
                  <p className="text-[15px] text-muted-foreground leading-relaxed mb-2 line-clamp-2">
                    {dish.description}
                  </p>
                  
                  <p className="text-base font-semibold text-foreground">
                    {dish.price}
                  </p>
                </div>
                
                {dish.image && (
                  <div className="flex-shrink-0">
                    <img
                      src={dish.image}
                      alt={dish.name}
                      className="w-24 h-24 object-cover rounded-xl"
                    />
                  </div>
                )}
              </button>
              
              {index < dishes.length - 1 && (
                <div className="border-b border-border mx-1" />
              )}
            </div>
          ))}
        </div>
      </div>

      <DishDetailDialog
        dish={selectedDish}
        open={!!selectedDish}
        onOpenChange={(open) => !open && setSelectedDish(null)}
      />
    </>
  );
});

NeoMenuList.displayName = 'NeoMenuList';

export default NeoMenuList;
