-- Performance Monitoring Analysis Script for Supabase
-- Run this in your Supabase SQL editor to analyze performance metrics

-- 1. Create table for storing performance metrics (if not exists)
CREATE TABLE IF NOT EXISTS performance_metrics (
    id SERIAL PRIMARY KEY,
    metric_name VARCHAR(50) NOT NULL,
    metric_value DECIMAL(10,3) NOT NULL,
    metric_rating VARCHAR(20) NOT NULL,
    page_url TEXT NOT NULL,
    user_agent TEXT,
    resource_name TEXT, -- For slow resource events
    resource_type VARCHAR(50), -- For slow resource events
    resource_size BIGINT, -- For slow resource events
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    session_id UUID -- Optional: to group metrics by session
);

-- 2. Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_performance_metrics_name ON performance_metrics(metric_name);
CREATE INDEX IF NOT EXISTS idx_performance_metrics_created_at ON performance_metrics(created_at);
CREATE INDEX IF NOT EXISTS idx_performance_metrics_rating ON performance_metrics(metric_rating);
CREATE INDEX IF NOT EXISTS idx_performance_metrics_url ON performance_metrics(page_url);

-- 3. Query to analyze slow resource patterns
SELECT 
    resource_type,
    COUNT(*) as occurrences,
    AVG(metric_value) as avg_load_time,
    MIN(metric_value) as min_load_time,
    MAX(metric_value) as max_load_time,
    ARRAY_AGG(DISTINCT SUBSTRING(resource_name FROM '[^/]*$')) as common_resources
FROM performance_metrics 
WHERE metric_name = 'Slow Resource'
    AND created_at >= NOW() - INTERVAL '7 days'
GROUP BY resource_type
ORDER BY occurrences DESC;

-- 4. Query to get Core Web Vitals summary
SELECT 
    metric_name,
    metric_rating,
    COUNT(*) as count,
    AVG(metric_value) as avg_value,
    PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY metric_value) as median_value,
    PERCENTILE_CONT(0.75) WITHIN GROUP (ORDER BY metric_value) as p75_value,
    PERCENTILE_CONT(0.95) WITHIN GROUP (ORDER BY metric_value) as p95_value
FROM performance_metrics 
WHERE metric_name IN ('LCP', 'FID', 'CLS', 'FCP', 'TTFB')
    AND created_at >= NOW() - INTERVAL '24 hours'
GROUP BY metric_name, metric_rating
ORDER BY metric_name, 
    CASE metric_rating 
        WHEN 'good' THEN 1 
        WHEN 'needs-improvement' THEN 2 
        WHEN 'poor' THEN 3 
    END;

-- 5. Query to identify pages with performance issues
SELECT 
    page_url,
    COUNT(CASE WHEN metric_rating = 'poor' THEN 1 END) as poor_metrics,
    COUNT(CASE WHEN metric_rating = 'needs-improvement' THEN 1 END) as needs_improvement,
    COUNT(CASE WHEN metric_rating = 'good' THEN 1 END) as good_metrics,
    COUNT(*) as total_metrics,
    ROUND(
        COUNT(CASE WHEN metric_rating = 'poor' THEN 1 END) * 100.0 / COUNT(*), 
        2
    ) as poor_percentage
FROM performance_metrics 
WHERE created_at >= NOW() - INTERVAL '24 hours'
GROUP BY page_url
HAVING COUNT(CASE WHEN metric_rating = 'poor' THEN 1 END) > 0
ORDER BY poor_percentage DESC, poor_metrics DESC
LIMIT 20;

-- 6. Query to track performance trends over time
SELECT 
    DATE_TRUNC('hour', created_at) as hour,
    metric_name,
    AVG(metric_value) as avg_value,
    COUNT(*) as metric_count
FROM performance_metrics 
WHERE metric_name IN ('LCP', 'FCP', 'TTFB')
    AND created_at >= NOW() - INTERVAL '24 hours'
GROUP BY DATE_TRUNC('hour', created_at), metric_name
ORDER BY hour DESC, metric_name;

-- 7. Clean up old performance data (optional - run periodically)
-- DELETE FROM performance_metrics WHERE created_at < NOW() - INTERVAL '30 days';

-- 8. View to get latest performance summary
CREATE OR REPLACE VIEW performance_summary AS
SELECT 
    metric_name,
    COUNT(*) as total_reports,
    COUNT(CASE WHEN metric_rating = 'good' THEN 1 END) as good_count,
    COUNT(CASE WHEN metric_rating = 'needs-improvement' THEN 1 END) as needs_improvement_count,
    COUNT(CASE WHEN metric_rating = 'poor' THEN 1 END) as poor_count,
    ROUND(AVG(metric_value), 2) as avg_value,
    MIN(created_at) as first_recorded,
    MAX(created_at) as last_recorded
FROM performance_metrics 
WHERE created_at >= NOW() - INTERVAL '7 days'
GROUP BY metric_name
ORDER BY total_reports DESC;

-- Query the summary view
SELECT * FROM performance_summary; 