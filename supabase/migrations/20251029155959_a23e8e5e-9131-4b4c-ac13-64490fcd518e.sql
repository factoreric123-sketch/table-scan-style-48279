-- Phase 4: Optimized Full Menu Fetching
-- Returns restaurant + categories + subcategories + dishes in a single nested query

CREATE OR REPLACE FUNCTION get_restaurant_full_menu(p_restaurant_id UUID)
RETURNS JSON
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  result JSON;
BEGIN
  SELECT json_build_object(
    'restaurant', (
      SELECT row_to_json(r) 
      FROM restaurants r 
      WHERE r.id = p_restaurant_id
    ),
    'categories', (
      SELECT COALESCE(json_agg(
        json_build_object(
          'id', c.id,
          'name', c.name,
          'restaurant_id', c.restaurant_id,
          'order_index', c.order_index,
          'created_at', c.created_at,
          'subcategories', (
            SELECT COALESCE(json_agg(
              json_build_object(
                'id', s.id,
                'name', s.name,
                'category_id', s.category_id,
                'order_index', s.order_index,
                'created_at', s.created_at,
                'dishes', (
                  SELECT COALESCE(json_agg(
                    json_build_object(
                      'id', d.id,
                      'name', d.name,
                      'description', d.description,
                      'price', d.price,
                      'image_url', d.image_url,
                      'is_new', d.is_new,
                      'order_index', d.order_index,
                      'subcategory_id', d.subcategory_id,
                      'created_at', d.created_at
                    ) ORDER BY d.order_index
                  ), '[]'::json)
                  FROM dishes d
                  WHERE d.subcategory_id = s.id
                )
              ) ORDER BY s.order_index
            ), '[]'::json)
            FROM subcategories s
            WHERE s.category_id = c.id
          )
        ) ORDER BY c.order_index
      ), '[]'::json)
      FROM categories c
      WHERE c.restaurant_id = p_restaurant_id
    )
  ) INTO result;
  
  RETURN result;
END;
$$;