-- Migration to remove author fields from blog_posts table
-- Since this is a single-author site, we don't need these fields

-- Remove author-related columns from blog_posts table
ALTER TABLE blog_posts 
  DROP COLUMN IF EXISTS author_id,
  DROP COLUMN IF EXISTS author_name,
  DROP COLUMN IF EXISTS author_email;

-- Update the structured data in comments to reflect the single author site
-- No additional schema changes needed since we're simplifying 