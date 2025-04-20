-- Migration to remove the validFrom column from escapes_data table
-- This migration is based on the decision to use created_at instead for determining new deals

-- Drop the validFrom column
ALTER TABLE public.escapes_data DROP COLUMN IF EXISTS "validFrom";

-- Add a comment to the table explaining the change
COMMENT ON TABLE public.escapes_data IS 'Contains travel deals data. New deals are determined by created_at timestamp (deals created within last 24 hours)'; 