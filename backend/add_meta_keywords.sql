ALTER TABLE opportunities ADD COLUMN IF NOT EXISTS meta_keywords TEXT;
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS meta_keywords TEXT;
