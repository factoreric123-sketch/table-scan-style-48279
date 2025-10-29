-- Phase 1: Add Performance Indexes
-- Composite indexes for foreign key + order_index queries

-- Categories: Fast lookup by restaurant + ordering
CREATE INDEX IF NOT EXISTS idx_categories_restaurant_order 
ON categories(restaurant_id, order_index);

-- Subcategories: Fast lookup by category + ordering
CREATE INDEX IF NOT EXISTS idx_subcategories_category_order 
ON subcategories(category_id, order_index);

-- Dishes: Fast lookup by subcategory + ordering
CREATE INDEX IF NOT EXISTS idx_dishes_subcategory_order 
ON dishes(subcategory_id, order_index);

-- Restaurants: Fast lookup by owner
CREATE INDEX IF NOT EXISTS idx_restaurants_owner 
ON restaurants(owner_id);

-- Restaurants: Fast public menu lookup by slug
CREATE INDEX IF NOT EXISTS idx_restaurants_slug 
ON restaurants(slug);