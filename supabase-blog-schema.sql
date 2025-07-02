-- Blog Posts Table
CREATE TABLE blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  excerpt TEXT,
  content TEXT NOT NULL,
  featured_image_url TEXT,
  featured_image_alt TEXT,
  author_id UUID REFERENCES auth.users(id),
  author_name TEXT,
  author_email TEXT,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  publish_date TIMESTAMP WITH TIME ZONE,
  seo_title TEXT,
  seo_description TEXT,
  seo_keywords TEXT[],
  reading_time INTEGER, -- estimated reading time in minutes
  view_count INTEGER DEFAULT 0,
  is_featured BOOLEAN DEFAULT false,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Blog Categories Table
CREATE TABLE blog_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  color TEXT DEFAULT '#3B82F6', -- Hex color for category styling
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Blog Post Categories Junction Table (Many-to-Many)
CREATE TABLE blog_post_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  blog_post_id UUID REFERENCES blog_posts(id) ON DELETE CASCADE,
  blog_category_id UUID REFERENCES blog_categories(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(blog_post_id, blog_category_id)
);

-- Blog Tags Table
CREATE TABLE blog_tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Blog Post Tags Junction Table (Many-to-Many)
CREATE TABLE blog_post_tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  blog_post_id UUID REFERENCES blog_posts(id) ON DELETE CASCADE,
  blog_tag_id UUID REFERENCES blog_tags(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(blog_post_id, blog_tag_id)
);

-- Image Gallery Table
CREATE TABLE image_gallery (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  filename TEXT NOT NULL,
  original_filename TEXT NOT NULL,
  file_path TEXT NOT NULL,
  public_url TEXT NOT NULL,
  alt_text TEXT,
  caption TEXT,
  file_size INTEGER, -- in bytes
  mime_type TEXT,
  width INTEGER,
  height INTEGER,
  is_featured BOOLEAN DEFAULT false,
  upload_folder TEXT DEFAULT 'blog',
  uploaded_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Blog Comments Table (for future use)
CREATE TABLE blog_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  blog_post_id UUID REFERENCES blog_posts(id) ON DELETE CASCADE,
  parent_comment_id UUID REFERENCES blog_comments(id) ON DELETE CASCADE,
  author_name TEXT NOT NULL,
  author_email TEXT NOT NULL,
  author_website TEXT,
  content TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'spam', 'rejected')),
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create indexes for better performance
CREATE INDEX idx_blog_posts_status ON blog_posts(status);
CREATE INDEX idx_blog_posts_publish_date ON blog_posts(publish_date DESC);
CREATE INDEX idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX idx_blog_posts_author ON blog_posts(author_id);
CREATE INDEX idx_blog_posts_featured ON blog_posts(is_featured);
CREATE INDEX idx_blog_categories_active ON blog_categories(is_active);
CREATE INDEX idx_blog_tags_active ON blog_tags(is_active);
CREATE INDEX idx_image_gallery_folder ON image_gallery(upload_folder);
CREATE INDEX idx_blog_comments_post ON blog_comments(blog_post_id);
CREATE INDEX idx_blog_comments_status ON blog_comments(status);

-- Enable Row Level Security
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_post_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_post_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE image_gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_comments ENABLE ROW LEVEL SECURITY;

-- RLS Policies for blog_posts
CREATE POLICY "Allow public read access to published posts" ON blog_posts
  FOR SELECT USING (status = 'published');

CREATE POLICY "Allow authenticated users full access to blog posts" ON blog_posts
  FOR ALL USING (auth.role() = 'authenticated');

-- RLS Policies for blog_categories
CREATE POLICY "Allow public read access to active categories" ON blog_categories
  FOR SELECT USING (is_active = true);

CREATE POLICY "Allow authenticated users full access to blog categories" ON blog_categories
  FOR ALL USING (auth.role() = 'authenticated');

-- RLS Policies for blog_post_categories
CREATE POLICY "Allow public read access to post categories" ON blog_post_categories
  FOR SELECT USING (true);

CREATE POLICY "Allow authenticated users full access to post categories" ON blog_post_categories
  FOR ALL USING (auth.role() = 'authenticated');

-- RLS Policies for blog_tags
CREATE POLICY "Allow public read access to active tags" ON blog_tags
  FOR SELECT USING (is_active = true);

CREATE POLICY "Allow authenticated users full access to blog tags" ON blog_tags
  FOR ALL USING (auth.role() = 'authenticated');

-- RLS Policies for blog_post_tags
CREATE POLICY "Allow public read access to post tags" ON blog_post_tags
  FOR SELECT USING (true);

CREATE POLICY "Allow authenticated users full access to post tags" ON blog_post_tags
  FOR ALL USING (auth.role() = 'authenticated');

-- RLS Policies for image_gallery
CREATE POLICY "Allow public read access to images" ON image_gallery
  FOR SELECT USING (true);

CREATE POLICY "Allow authenticated users full access to image gallery" ON image_gallery
  FOR ALL USING (auth.role() = 'authenticated');

-- RLS Policies for blog_comments
CREATE POLICY "Allow public read access to approved comments" ON blog_comments
  FOR SELECT USING (status = 'approved');

CREATE POLICY "Allow authenticated users full access to blog comments" ON blog_comments
  FOR ALL USING (auth.role() = 'authenticated');

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply the trigger to all tables
CREATE TRIGGER update_blog_posts_updated_at BEFORE UPDATE ON blog_posts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_blog_categories_updated_at BEFORE UPDATE ON blog_categories
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_blog_tags_updated_at BEFORE UPDATE ON blog_tags
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_image_gallery_updated_at BEFORE UPDATE ON image_gallery
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_blog_comments_updated_at BEFORE UPDATE ON blog_comments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert some default blog categories
INSERT INTO blog_categories (name, slug, description, color) VALUES
  ('Travel Tips', 'travel-tips', 'Helpful tips and advice for travelers', '#10B981'),
  ('Destinations', 'destinations', 'Featured destinations and travel guides', '#3B82F6'),
  ('Food & Culture', 'food-culture', 'Local cuisine and cultural experiences', '#F59E0B'),
  ('Adventure', 'adventure', 'Adventure travel and outdoor activities', '#EF4444'),
  ('Budget Travel', 'budget-travel', 'Money-saving tips and budget-friendly options', '#8B5CF6');

-- Insert some default blog tags
INSERT INTO blog_tags (name, slug, description) VALUES
  ('Beach', 'beach', 'Beach destinations and activities'),
  ('Mountain', 'mountain', 'Mountain destinations and hiking'),
  ('City Break', 'city-break', 'Urban destinations and city experiences'),
  ('Family Friendly', 'family-friendly', 'Family-oriented travel content'),
  ('Solo Travel', 'solo-travel', 'Solo travel tips and experiences'),
  ('Luxury', 'luxury', 'Luxury travel experiences'),
  ('Backpacking', 'backpacking', 'Backpacking and budget travel'),
  ('Photography', 'photography', 'Travel photography tips and spots'); 