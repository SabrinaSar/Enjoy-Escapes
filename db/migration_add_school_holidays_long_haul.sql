-- Add new columns to escapes_data table
ALTER TABLE public.escapes_data 
ADD COLUMN IF NOT EXISTS school_holidays BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS long_haul BOOLEAN DEFAULT FALSE;

-- Update existing records to have default values
UPDATE public.escapes_data 
SET school_holidays = FALSE, long_haul = FALSE 
WHERE school_holidays IS NULL OR long_haul IS NULL;

-- Add comment to explain the columns
COMMENT ON COLUMN public.escapes_data.school_holidays IS 'Flag indicating if the escape is available during school holidays';
COMMENT ON COLUMN public.escapes_data.long_haul IS 'Flag indicating if the escape is to a long haul destination'; 