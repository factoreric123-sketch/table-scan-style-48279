import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Category } from "./useCategories";
import type { Subcategory } from "./useSubcategories";
import type { Dish } from "./useDishes";

interface Restaurant {
  id: string;
  name: string;
  slug: string;
  tagline: string | null;
  hero_image_url: string | null;
  owner_id: string;
  published: boolean;
  theme: any;
  created_at: string;
  updated_at: string;
}

interface FullMenuData {
  restaurant: Restaurant;
  categories: Category[];
  subcategories: Subcategory[];
  dishes: Dish[];
}

export const useRestaurantFullMenu = (restaurantId: string) => {
  return useQuery({
    queryKey: ["restaurant-full-menu", restaurantId],
    queryFn: async (): Promise<FullMenuData> => {
      const { data, error } = await supabase.rpc("get_restaurant_full_menu", {
        p_restaurant_id: restaurantId,
      });

      if (error) throw error;
      if (!data) throw new Error("No data returned");

      // Type assertion for the nested JSON structure
      const menuData = data as any;

      // Parse nested JSON into flat arrays for easier consumption
      const restaurant = menuData.restaurant;
      const categories: Category[] = [];
      const subcategories: Subcategory[] = [];
      const dishes: Dish[] = [];

      if (menuData.categories) {
        for (const cat of menuData.categories) {
          categories.push({
            id: cat.id,
            name: cat.name,
            restaurant_id: cat.restaurant_id,
            order_index: cat.order_index,
            created_at: cat.created_at,
          });

          if (cat.subcategories) {
            for (const sub of cat.subcategories) {
              subcategories.push({
                id: sub.id,
                name: sub.name,
                category_id: sub.category_id,
                order_index: sub.order_index,
                created_at: sub.created_at,
              });

              if (sub.dishes) {
                for (const dish of sub.dishes) {
                  dishes.push({
                    id: dish.id,
                    name: dish.name,
                    description: dish.description,
                    price: dish.price,
                    image_url: dish.image_url,
                    is_new: dish.is_new,
                    order_index: dish.order_index,
                    subcategory_id: dish.subcategory_id,
                    created_at: dish.created_at,
                  });
                }
              }
            }
          }
        }
      }

      return {
        restaurant,
        categories,
        subcategories,
        dishes,
      };
    },
    enabled: !!restaurantId,
  });
};
