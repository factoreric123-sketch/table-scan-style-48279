-- Phase 2: Batch Update Order Indexes Function
-- Allows updating multiple order_index values in a single database call

CREATE OR REPLACE FUNCTION batch_update_order_indexes(
  table_name TEXT,
  updates JSONB
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  item JSONB;
BEGIN
  -- Validate table name to prevent SQL injection
  IF table_name NOT IN ('categories', 'subcategories', 'dishes') THEN
    RAISE EXCEPTION 'Invalid table name: %', table_name;
  END IF;

  -- Update each item's order_index
  FOR item IN SELECT * FROM jsonb_array_elements(updates)
  LOOP
    EXECUTE format(
      'UPDATE %I SET order_index = $1 WHERE id = $2',
      table_name
    ) USING (item->>'order_index')::INTEGER, (item->>'id')::UUID;
  END LOOP;
END;
$$;