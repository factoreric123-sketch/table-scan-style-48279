-- Fix foreign key constraint duplication issue
-- Drop the newly added FK constraints that conflict with existing ones

-- Drop new FK constraints (keep the original auto-generated ones)
ALTER TABLE public.categories DROP CONSTRAINT IF EXISTS fk_categories_restaurant;
ALTER TABLE public.subcategories DROP CONSTRAINT IF EXISTS fk_subcategories_category;
ALTER TABLE public.dishes DROP CONSTRAINT IF EXISTS fk_dishes_subcategory;
ALTER TABLE public.dish_options DROP CONSTRAINT IF EXISTS fk_dish_options_dish;
ALTER TABLE public.dish_modifiers DROP CONSTRAINT IF EXISTS fk_dish_modifiers_dish;

-- Ensure original FK constraints have CASCADE behavior
-- First drop original constraints
ALTER TABLE public.categories DROP CONSTRAINT IF EXISTS categories_restaurant_id_fkey;
ALTER TABLE public.subcategories DROP CONSTRAINT IF EXISTS subcategories_category_id_fkey;
ALTER TABLE public.dishes DROP CONSTRAINT IF EXISTS dishes_subcategory_id_fkey;
ALTER TABLE public.dish_options DROP CONSTRAINT IF EXISTS dish_options_dish_id_fkey;
ALTER TABLE public.dish_modifiers DROP CONSTRAINT IF EXISTS dish_modifiers_dish_id_fkey;

-- Recreate with ON DELETE CASCADE
ALTER TABLE public.categories 
  ADD CONSTRAINT categories_restaurant_id_fkey 
  FOREIGN KEY (restaurant_id) 
  REFERENCES public.restaurants(id) 
  ON DELETE CASCADE;

ALTER TABLE public.subcategories 
  ADD CONSTRAINT subcategories_category_id_fkey 
  FOREIGN KEY (category_id) 
  REFERENCES public.categories(id) 
  ON DELETE CASCADE;

ALTER TABLE public.dishes 
  ADD CONSTRAINT dishes_subcategory_id_fkey 
  FOREIGN KEY (subcategory_id) 
  REFERENCES public.subcategories(id) 
  ON DELETE CASCADE;

ALTER TABLE public.dish_options 
  ADD CONSTRAINT dish_options_dish_id_fkey 
  FOREIGN KEY (dish_id) 
  REFERENCES public.dishes(id) 
  ON DELETE CASCADE;

ALTER TABLE public.dish_modifiers 
  ADD CONSTRAINT dish_modifiers_dish_id_fkey 
  FOREIGN KEY (dish_id) 
  REFERENCES public.dishes(id) 
  ON DELETE CASCADE;