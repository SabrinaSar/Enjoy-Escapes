-- Migration to remove blog comments functionality
-- Drop the blog_comments table since we're not implementing comments

-- Drop the table if it exists
DROP TABLE IF EXISTS blog_comments;

-- Remove comment-related types from the check constraint if they exist
-- (This is a safety measure in case the table had different constraints)

-- Add a comment to document the change
COMMENT ON SCHEMA public IS 'Blog comments functionality removed - using external systems for user feedback'; 