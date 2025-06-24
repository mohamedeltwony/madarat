-- TikTok Events API (CAPI) Environment Setup and Database Documentation
-- Execute this in your Supabase SQL Editor to document the TikTok integration

-- =============================================================================
-- TIKTOK EVENTS API INTEGRATION DOCUMENTATION
-- =============================================================================

-- Create a table to track TikTok Events API configurations and logs
-- This is optional but useful for monitoring and debugging

CREATE TABLE IF NOT EXISTS public.tiktok_events_log (
    id BIGSERIAL PRIMARY KEY,
    event_name VARCHAR(50) NOT NULL,
    event_id VARCHAR(100) UNIQUE NOT NULL,
    user_identifier VARCHAR(255), -- Hashed user identifier for privacy
    event_data JSONB,
    response_status INTEGER,
    response_data JSONB,
    error_message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    ip_address INET,
    user_agent TEXT
);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_tiktok_events_event_name ON public.tiktok_events_log(event_name);
CREATE INDEX IF NOT EXISTS idx_tiktok_events_created_at ON public.tiktok_events_log(created_at);
CREATE INDEX IF NOT EXISTS idx_tiktok_events_response_status ON public.tiktok_events_log(response_status);

-- Add RLS (Row Level Security) policies if needed
ALTER TABLE public.tiktok_events_log ENABLE ROW LEVEL SECURITY;

-- Create a policy for service role access (for API operations)
CREATE POLICY "TikTok events log service access" ON public.tiktok_events_log
FOR ALL USING (auth.role() = 'service_role');

-- Create a view for TikTok events analytics (last 30 days)
CREATE OR REPLACE VIEW public.tiktok_events_analytics AS
SELECT 
    event_name,
    COUNT(*) as event_count,
    COUNT(CASE WHEN response_status BETWEEN 200 AND 299 THEN 1 END) as successful_events,
    COUNT(CASE WHEN response_status >= 400 THEN 1 END) as failed_events,
    ROUND(
        COUNT(CASE WHEN response_status BETWEEN 200 AND 299 THEN 1 END)::numeric / 
        COUNT(*)::numeric * 100, 2
    ) as success_rate_percent,
    MIN(created_at) as first_event,
    MAX(created_at) as last_event
FROM public.tiktok_events_log
WHERE created_at >= NOW() - INTERVAL '30 days'
GROUP BY event_name
ORDER BY event_count DESC;

-- =============================================================================
-- ENVIRONMENT VARIABLES DOCUMENTATION
-- =============================================================================

-- Create a documentation table for environment variables
CREATE TABLE IF NOT EXISTS public.environment_variables_doc (
    id SERIAL PRIMARY KEY,
    service VARCHAR(50) NOT NULL,
    variable_name VARCHAR(100) NOT NULL,
    description TEXT,
    is_required BOOLEAN DEFAULT TRUE,
    example_value TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert TikTok environment variables documentation
INSERT INTO public.environment_variables_doc (service, variable_name, description, is_required, example_value, notes)
VALUES 
    ('tiktok', 'TIKTOK_ACCESS_TOKEN', 'TikTok Events API access token for server-side events', TRUE, 'c8947ce24f6cd19daf4073304848a6b9d0cd89ca', 'Keep this secure - used for API authentication'),
    ('tiktok', 'TIKTOK_PIXEL_ID', 'TikTok Pixel ID for event tracking', TRUE, 'D17TA5JC77UDOT6CA5FG', 'Must match the pixel ID in your TikTok Ads Manager'),
    ('tiktok', 'TIKTOK_DEBUG', 'Enable debug mode for TikTok events', FALSE, 'false', 'Set to true for development environment only')
ON CONFLICT (service, variable_name) DO UPDATE SET
    description = EXCLUDED.description,
    example_value = EXCLUDED.example_value,
    notes = EXCLUDED.notes,
    updated_at = NOW();

-- =============================================================================
-- ENVIRONMENT SETUP QUERIES
-- =============================================================================

-- Query to check all TikTok-related environment variables
SELECT 
    service,
    variable_name,
    description,
    is_required,
    CASE 
        WHEN is_required AND example_value IS NOT NULL THEN '⚠️ REQUIRED - Add to .env.local'
        WHEN NOT is_required THEN '📝 OPTIONAL'
        ELSE '✅ CONFIGURED'
    END as setup_status,
    example_value,
    notes
FROM public.environment_variables_doc 
WHERE service = 'tiktok'
ORDER BY is_required DESC, variable_name;

-- =============================================================================
-- MONITORING QUERIES
-- =============================================================================

-- Query to monitor TikTok Events API performance (last 24 hours)
SELECT 
    event_name,
    COUNT(*) as total_events,
    COUNT(CASE WHEN response_status BETWEEN 200 AND 299 THEN 1 END) as successful,
    COUNT(CASE WHEN response_status >= 400 THEN 1 END) as failed,
    ROUND(AVG(CASE WHEN response_status BETWEEN 200 AND 299 THEN 1.0 ELSE 0.0 END) * 100, 2) as success_rate,
    string_agg(DISTINCT error_message, '; ') FILTER (WHERE error_message IS NOT NULL) as error_messages
FROM public.tiktok_events_log 
WHERE created_at >= NOW() - INTERVAL '24 hours'
GROUP BY event_name
ORDER BY total_events DESC;

-- Query to check recent TikTok events with errors
SELECT 
    created_at,
    event_name,
    event_id,
    response_status,
    error_message,
    LEFT(user_agent, 50) as user_agent_preview
FROM public.tiktok_events_log 
WHERE response_status >= 400 
    AND created_at >= NOW() - INTERVAL '1 hour'
ORDER BY created_at DESC
LIMIT 10;

-- =============================================================================
-- MAINTENANCE QUERIES
-- =============================================================================

-- Clean up old TikTok events logs (keep last 90 days)
-- Run this periodically to manage storage
DELETE FROM public.tiktok_events_log 
WHERE created_at < NOW() - INTERVAL '90 days';

-- Update analytics view (if needed)
REFRESH MATERIALIZED VIEW IF EXISTS public.tiktok_events_analytics_materialized;

-- =============================================================================
-- COMMENTS AND DOCUMENTATION
-- =============================================================================

COMMENT ON TABLE public.tiktok_events_log IS 'Logs for TikTok Events API calls for monitoring and debugging';
COMMENT ON COLUMN public.tiktok_events_log.event_name IS 'TikTok event type (ViewContent, Lead, Purchase, etc.)';
COMMENT ON COLUMN public.tiktok_events_log.event_id IS 'Unique event ID for deduplication';
COMMENT ON COLUMN public.tiktok_events_log.user_identifier IS 'Hashed user identifier for privacy compliance';
COMMENT ON COLUMN public.tiktok_events_log.event_data IS 'JSON data sent to TikTok Events API';
COMMENT ON COLUMN public.tiktok_events_log.response_data IS 'Response received from TikTok Events API';

COMMENT ON VIEW public.tiktok_events_analytics IS 'Analytics view for TikTok Events API performance (last 30 days)';

COMMENT ON TABLE public.environment_variables_doc IS 'Documentation for all environment variables used in the application';

-- =============================================================================
-- GRANT PERMISSIONS
-- =============================================================================

-- Grant necessary permissions for the application to use these tables
GRANT SELECT, INSERT ON public.tiktok_events_log TO authenticated;
GRANT SELECT ON public.tiktok_events_analytics TO authenticated;
GRANT SELECT ON public.environment_variables_doc TO authenticated;

-- Grant service role full access for API operations
GRANT ALL ON public.tiktok_events_log TO service_role;
GRANT ALL ON public.environment_variables_doc TO service_role;

-- =============================================================================
-- COMPLETION MESSAGE
-- =============================================================================

-- This will display a completion message
DO $$
BEGIN
    RAISE NOTICE '✅ TikTok Events API database setup completed successfully!';
    RAISE NOTICE '';
    RAISE NOTICE '📋 Next steps:';
    RAISE NOTICE '1. Add environment variables to your .env.local file:';
    RAISE NOTICE '   TIKTOK_ACCESS_TOKEN=c8947ce24f6cd19daf4073304848a6b9d0cd89ca';
    RAISE NOTICE '   TIKTOK_PIXEL_ID=D17TA5JC77UDOT6CA5FG';
    RAISE NOTICE '';
    RAISE NOTICE '2. Test the integration:';
    RAISE NOTICE '   node test-tiktok-capi-integration.js';
    RAISE NOTICE '';
    RAISE NOTICE '3. Monitor events with:';
    RAISE NOTICE '   SELECT * FROM public.tiktok_events_analytics;';
    RAISE NOTICE '';
    RAISE NOTICE '🔗 TikTok Pixel ID: D17TA5JC77UDOT6CA5FG';
    RAISE NOTICE '🔑 Access Token: c8947ce24f6cd19daf4073304848a6b9d0cd89ca';
END $$; 