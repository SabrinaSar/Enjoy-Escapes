-- Create a table for promotional banners
CREATE TABLE IF NOT EXISTS banners (
  id SERIAL PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  title TEXT NOT NULL,
  description TEXT,
  image TEXT NOT NULL,  -- URL to the banner image
  link TEXT,            -- Optional link for the banner
  active BOOLEAN DEFAULT true,  -- Whether the banner is currently active
  start_date TIMESTAMP WITH TIME ZONE,  -- Optional start date for time-limited banners
  end_date TIMESTAMP WITH TIME ZONE,    -- Optional end date for time-limited banners
  position INTEGER DEFAULT 0,  -- Optional position for ordering multiple banners
  background_color TEXT DEFAULT '#FFFFFF',  -- Optional background color
  text_color TEXT DEFAULT '#000000'        -- Optional text color
);

-- Add an index on active status for performance
CREATE INDEX IF NOT EXISTS idx_banners_active ON banners(active);

-- Add an index on dates for filtering
CREATE INDEX IF NOT EXISTS idx_banners_dates ON banners(start_date, end_date); 