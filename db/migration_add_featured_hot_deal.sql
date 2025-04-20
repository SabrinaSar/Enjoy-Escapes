-- Add featured and hot_deal columns to escapes_data table
-- featured - Boolean flag to mark deals that should be displayed at the top
-- hot_deal - Boolean flag to mark deals that should have animated/highlighted styling

-- Add the featured column with default value false
ALTER TABLE escapes_data
ADD COLUMN featured BOOLEAN DEFAULT false;

-- Add the hot_deal column with default value false
ALTER TABLE escapes_data
ADD COLUMN hot_deal BOOLEAN DEFAULT false;

-- Update the comment on the escapes_data table
COMMENT ON TABLE escapes_data IS 'Table storing all escape deals with featured and hot deal flags'; 