-- Create a function to get click counts by escape efficiently
-- This replaces the inefficient method of fetching all clicks and counting in JavaScript

CREATE OR REPLACE FUNCTION public.get_click_counts_by_escape()
RETURNS TABLE (
  escape_id BIGINT,
  click_count BIGINT
)
LANGUAGE SQL
SECURITY DEFINER
AS $$
  SELECT 
    escape_id,
    COUNT(*) as click_count
  FROM public.clicks_data 
  GROUP BY escape_id
  ORDER BY click_count DESC;
$$;

-- Grant execute permission to authenticated users (admins)
GRANT EXECUTE ON FUNCTION public.get_click_counts_by_escape() TO authenticated; 