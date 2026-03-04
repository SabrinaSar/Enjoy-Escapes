-- 1. Create a composite index for faster aggregation
-- This is the most important part for performance
CREATE INDEX IF NOT EXISTS idx_clicks_optimization 
ON public.clicks_data(item_type, escape_id);

-- 2. Update get_click_counts_by_escape to be more efficient and support pagination
-- This version handles the aggregation much faster due to the index above
CREATE OR REPLACE FUNCTION public.get_click_counts_by_escape(
  page_size INT DEFAULT 1000, 
  offset_val INT DEFAULT 0
)
RETURNS TABLE (
  escape_id BIGINT,
  click_count BIGINT
)
LANGUAGE SQL
SECURITY DEFINER
AS $$
  SELECT 
    cd.escape_id,
    COUNT(*) as click_count
  FROM public.clicks_data cd
  WHERE (cd.item_type = 'escape' OR cd.item_type IS NULL) AND cd.escape_id IS NOT NULL
  GROUP BY cd.escape_id
  ORDER BY click_count DESC
  LIMIT page_size OFFSET offset_val;
$$;

-- 3. Update get_click_counts_by_banner to be efficient
CREATE OR REPLACE FUNCTION public.get_click_counts_by_banner()
RETURNS TABLE (
  banner_id BIGINT,
  click_count BIGINT
)
LANGUAGE SQL
SECURITY DEFINER
AS $$
  SELECT 
    cd.escape_id as banner_id,
    COUNT(*) as click_count
  FROM public.clicks_data cd
  WHERE cd.item_type = 'banner' AND cd.escape_id IS NOT NULL
  GROUP BY cd.escape_id
  ORDER BY click_count DESC;
$$;

-- 4. Helper to get total unique items count (for pagination)
CREATE OR REPLACE FUNCTION public.get_unique_items_count(p_item_type TEXT)
RETURNS BIGINT
LANGUAGE SQL
SECURITY DEFINER
AS $$
  SELECT COUNT(DISTINCT escape_id) 
  FROM public.clicks_data 
  WHERE (item_type = p_item_type OR (p_item_type = 'escape' AND item_type IS NULL))
  AND escape_id IS NOT NULL;
$$;

-- 5. Helper to get total clicks for a type (for the stats box)
CREATE OR REPLACE FUNCTION public.get_total_clicks_by_type(p_item_type TEXT)
RETURNS BIGINT
LANGUAGE SQL
SECURITY DEFINER
AS $$
  SELECT COUNT(*) 
  FROM public.clicks_data 
  WHERE (item_type = p_item_type OR (p_item_type = 'escape' AND item_type IS NULL))
  AND escape_id IS NOT NULL;
$$;

-- Grant permissions
GRANT EXECUTE ON FUNCTION public.get_click_counts_by_escape(INT, INT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_click_counts_by_banner() TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_unique_items_count(TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_total_clicks_by_type(TEXT) TO authenticated;
