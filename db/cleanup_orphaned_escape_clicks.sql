-- Cleanup orphaned escape clicks
-- Deletes click records for escapes that no longer exist
-- Only targets records with item_type = 'escape' to avoid deleting banner clicks

DELETE FROM public.clicks_data
WHERE (item_type = 'escape' OR item_type IS NULL)
AND escape_id NOT IN (SELECT id FROM public.escapes_data);

