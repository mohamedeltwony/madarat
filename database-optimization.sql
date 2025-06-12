-- WordPress Database Optimization Script
-- Run this in your Supabase SQL Editor to optimize performance

-- 1. Add indexes for trip queries
CREATE INDEX IF NOT EXISTS idx_posts_post_type_status ON wp_posts(post_type, post_status);
CREATE INDEX IF NOT EXISTS idx_posts_slug ON wp_posts(post_name);
CREATE INDEX IF NOT EXISTS idx_posts_modified ON wp_posts(post_modified);

-- 2. Add indexes for metadata queries
CREATE INDEX IF NOT EXISTS idx_postmeta_post_id ON wp_postmeta(post_id);
CREATE INDEX IF NOT EXISTS idx_postmeta_key_value ON wp_postmeta(meta_key, meta_value(255));

-- 3. Add indexes for taxonomy queries
CREATE INDEX IF NOT EXISTS idx_term_relationships_object_id ON wp_term_relationships(object_id);
CREATE INDEX IF NOT EXISTS idx_term_taxonomy_taxonomy ON wp_term_taxonomy(taxonomy);

-- 4. Optimize trip-specific queries
CREATE INDEX IF NOT EXISTS idx_trips_featured_media ON wp_posts(post_type, featured_media) 
WHERE post_type = 'trip';

-- 5. Clean up old revisions (keep only latest 3)
DELETE FROM wp_posts 
WHERE post_type = 'revision' 
AND post_date < DATE_SUB(NOW(), INTERVAL 30 DAY);

-- 6. Clean up spam and trash
DELETE FROM wp_posts 
WHERE post_status IN ('spam', 'trash') 
AND post_date < DATE_SUB(NOW(), INTERVAL 7 DAY);

-- 7. Optimize tables
OPTIMIZE TABLE wp_posts;
OPTIMIZE TABLE wp_postmeta;
OPTIMIZE TABLE wp_term_relationships;

-- 8. Update table statistics
ANALYZE TABLE wp_posts;
ANALYZE TABLE wp_postmeta;
ANALYZE TABLE wp_term_relationships;

-- Performance monitoring query
SELECT 
    post_type,
    post_status,
    COUNT(*) as count,
    AVG(CHAR_LENGTH(post_content)) as avg_content_length
FROM wp_posts 
GROUP BY post_type, post_status
ORDER BY count DESC; 