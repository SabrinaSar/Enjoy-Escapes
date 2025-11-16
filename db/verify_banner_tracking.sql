-- Verification queries for banner click tracking
-- Run these queries to check if banner tracking is working

-- 1. Check if item_type column exists
SELECT column_name, data_type, column_default 
FROM information_schema.columns 
WHERE table_name = 'clicks_data' 
AND column_name = 'item_type';

-- 2. Check recent clicks and their types
SELECT 
  id,
  escape_id,
  item_type,
  source,
  created_at
FROM public.clicks_data 
ORDER BY created_at DESC 
LIMIT 20;

-- 3. Count clicks by item type
SELECT 
  item_type,
  COUNT(*) as total_clicks
FROM public.clicks_data 
GROUP BY item_type;

-- 4. Get all banner clicks
SELECT 
  escape_id as banner_id,
  COUNT(*) as click_count,
  MAX(created_at) as last_click
FROM public.clicks_data 
WHERE item_type = 'banner'
GROUP BY escape_id
ORDER BY click_count DESC;

-- 5. Verify the banner tracking functions exist
SELECT routine_name, routine_type
FROM information_schema.routines 
WHERE routine_name IN ('get_click_counts_by_escape', 'get_click_counts_by_banner')
AND routine_schema = 'public';

-- 6. Test the banner function directly
SELECT * FROM public.get_click_counts_by_banner();

-- 7. Check for any clicks with NULL escape_id (data integrity issue)
SELECT COUNT(*) as null_escape_id_count
FROM public.clicks_data 
WHERE escape_id IS NULL;

-- 8. Check for any clicks with invalid/NULL item_type
SELECT 
  item_type,
  COUNT(*) as count
FROM public.clicks_data 
WHERE item_type IS NULL OR item_type NOT IN ('escape', 'banner')
GROUP BY item_type;

