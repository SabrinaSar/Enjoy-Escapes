-- Migration: Add support for tracking different item types (escapes and banners)
-- This allows the clicks_data table to track clicks on both escapes and banners

-- Step 1: Add item_type column to clicks_data
ALTER TABLE public.clicks_data 
ADD COLUMN IF NOT EXISTS item_type TEXT DEFAULT 'escape';

-- Step 2: Drop the existing foreign key constraint that requires escape_id to exist
ALTER TABLE public.clicks_data 
DROP CONSTRAINT IF EXISTS fk_escape;

-- Step 3: We won't add a strict constraint because:
-- - It would slow down inserts (subquery check on every insert)
-- - If a deal/banner is deleted, old clicks would prevent deletion
-- - Our application validates the IDs before inserting
-- Instead, we rely on application-level validation in the API route

-- Step 4: Create index on item_type for faster queries
CREATE INDEX IF NOT EXISTS idx_clicks_item_type ON public.clicks_data(item_type);

-- Step 5: Drop existing functions if they exist (to handle signature changes)
DROP FUNCTION IF EXISTS public.get_click_counts_by_escape();
DROP FUNCTION IF EXISTS public.get_click_counts_by_banner();

-- Step 6: Create function to get click counts by escape (including item_type)
CREATE OR REPLACE FUNCTION public.get_click_counts_by_escape()
RETURNS TABLE (
  escape_id BIGINT,
  click_count BIGINT,
  item_type TEXT
)
LANGUAGE SQL
SECURITY DEFINER
AS $$
  SELECT 
    escape_id,
    COUNT(*) as click_count,
    item_type
  FROM public.clicks_data 
  WHERE item_type = 'escape'
  GROUP BY escape_id, item_type
  ORDER BY click_count DESC;
$$;

-- Step 7: Create function to get click counts by banner
CREATE OR REPLACE FUNCTION public.get_click_counts_by_banner()
RETURNS TABLE (
  banner_id BIGINT,
  click_count BIGINT,
  item_type TEXT
)
LANGUAGE SQL
SECURITY DEFINER
AS $$
  SELECT 
    escape_id as banner_id,
    COUNT(*) as click_count,
    item_type
  FROM public.clicks_data 
  WHERE item_type = 'banner'
  GROUP BY escape_id, item_type
  ORDER BY click_count DESC;
$$;

-- Step 8: Grant execute permissions
GRANT EXECUTE ON FUNCTION public.get_click_counts_by_escape() TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_click_counts_by_banner() TO authenticated;

-- Step 9: Update RLS policies to include item_type
-- The existing policies should still work, but let's make sure
-- Policy for anonymous inserts already exists and allows all inserts
-- Policy for admin reads already exists

-- Add comment for documentation
COMMENT ON COLUMN public.clicks_data.item_type IS 'Type of item being tracked: escape, banner, etc.';

