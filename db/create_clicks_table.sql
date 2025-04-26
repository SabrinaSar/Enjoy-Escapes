-- Create the clicks_data table for tracking anonymous escape clicks
CREATE TABLE IF NOT EXISTS public.clicks_data (
  id BIGSERIAL PRIMARY KEY,
  escape_id BIGINT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  source TEXT,
  user_agent TEXT,
  referrer TEXT,
  
  -- Add foreign key reference to escapes_data
  CONSTRAINT fk_escape
    FOREIGN KEY (escape_id)
    REFERENCES public.escapes_data(id)
    ON DELETE CASCADE
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_clicks_escape_id ON public.clicks_data(escape_id);
CREATE INDEX IF NOT EXISTS idx_clicks_created_at ON public.clicks_data(created_at);

-- Set up RLS (Row Level Security) policies
ALTER TABLE public.clicks_data ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anonymous inserts (for tracking without auth)
CREATE POLICY "Allow anonymous inserts" ON public.clicks_data
  FOR INSERT TO anon
  WITH CHECK (true);

-- Create policy to allow only admins to view click data
CREATE POLICY "Allow admin read access" ON public.clicks_data
  FOR SELECT TO authenticated
  USING (auth.jwt() ->> 'user_role' = 'admin');

-- Create function to get click count for an escape
CREATE OR REPLACE FUNCTION public.get_escape_click_count(escape_id BIGINT)
RETURNS BIGINT
LANGUAGE SQL
SECURITY DEFINER
AS $$
  SELECT COUNT(*) FROM public.clicks_data WHERE escape_id = $1;
$$; 