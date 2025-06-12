/**
 * Health Check API Endpoint
 * Monitors lambda function performance and external API connectivity
 */

export default async function handler(req, res) {
  const startTime = Date.now();
  
  try {
    // Basic health check data
    const healthData = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'unknown',
      memory: process.memoryUsage(),
      uptime: process.uptime(),
    };

    // Test external API connectivity
    const apiTests = [];
    
    // Test WordPress API
    try {
      const wpResponse = await fetch(
        'https://en4ha1dlwxxhwad.madaratalkon.com/wp-json/wp/v2/trip?per_page=1',
        { 
          method: 'HEAD',
          timeout: 5000 
        }
      );
      apiTests.push({
        name: 'WordPress API',
        status: wpResponse.ok ? 'healthy' : 'unhealthy',
        responseTime: Date.now() - startTime,
        statusCode: wpResponse.status
      });
    } catch (error) {
      apiTests.push({
        name: 'WordPress API',
        status: 'error',
        error: error.message,
        responseTime: Date.now() - startTime
      });
    }

    // Add performance metrics
    const responseTime = Date.now() - startTime;
    
    return res.status(200).json({
      ...healthData,
      apiTests,
      responseTime,
      performance: {
        responseTime,
        status: responseTime < 1000 ? 'optimal' : responseTime < 3000 ? 'acceptable' : 'slow'
      }
    });

  } catch (error) {
    return res.status(500).json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: error.message,
      responseTime: Date.now() - startTime
    });
  }
} 