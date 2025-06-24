#!/usr/bin/env node

/**
 * Performance Monitoring Script for Vercel Lambda Functions
 * Run this script to monitor your app's health and performance
 */

const https = require('https');

const BASE_URL = 'https://madaratalkon.com';
const ENDPOINTS = [
  '/',
  '/api/health',
  '/trips/من-براغ-إلى-باريس',
  '/destinations/spain',
  '/schengen-visa-trip'
];

async function makeRequest(url) {
  return new Promise((resolve, reject) => {
    const startTime = Date.now();
    
    const req = https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        const endTime = Date.now();
        resolve({
          url,
          statusCode: res.statusCode,
          responseTime: endTime - startTime,
          contentLength: data.length,
          headers: res.headers
        });
      });
    });
    
    req.on('error', (error) => {
      reject({
        url,
        error: error.message,
        responseTime: Date.now() - startTime
      });
    });
    
    req.setTimeout(30000, () => {
      req.destroy();
      reject({
        url,
        error: 'Timeout (30s)',
        responseTime: 30000
      });
    });
  });
}

async function runMonitoring() {
  console.log('🔍 Starting Performance Monitoring...\n');
  console.log(`📅 Timestamp: ${new Date().toISOString()}`);
  console.log(`🌐 Base URL: ${BASE_URL}\n`);
  
  const results = [];
  
  for (const endpoint of ENDPOINTS) {
    const url = `${BASE_URL}${endpoint}`;
    console.log(`Testing: ${endpoint}`);
    
    try {
      const result = await makeRequest(url);
      results.push(result);
      
      const status = result.statusCode === 200 ? '✅' : 
                    result.statusCode < 400 ? '⚠️' : '❌';
      
      const performanceStatus = result.responseTime < 1000 ? '🚀' :
                               result.responseTime < 3000 ? '⚡' : '🐌';
      
      console.log(`  ${status} ${performanceStatus} ${result.statusCode} - ${result.responseTime}ms`);
      
    } catch (error) {
      results.push(error);
      console.log(`  ❌ Error: ${error.error}`);
    }
  }
  
  // Summary
  console.log('\n📊 Performance Summary:');
  const successful = results.filter(r => !r.error && r.statusCode === 200);
  const failed = results.filter(r => r.error || r.statusCode >= 400);
  const avgResponseTime = successful.reduce((sum, r) => sum + r.responseTime, 0) / successful.length;
  
  console.log(`✅ Successful: ${successful.length}/${results.length}`);
  console.log(`❌ Failed: ${failed.length}/${results.length}`);
  console.log(`⏱️  Average Response Time: ${Math.round(avgResponseTime)}ms`);
  
  // Alert for issues
  if (failed.length > 0) {
    console.log('\n🚨 Issues Detected:');
    failed.forEach(result => {
      console.log(`  • ${result.url}: ${result.error || `Status ${result.statusCode}`}`);
    });
  }
  
  // Performance warnings
  const slowEndpoints = successful.filter(r => r.responseTime > 3000);
  if (slowEndpoints.length > 0) {
    console.log('\n🐌 Slow Endpoints (>3s):');
    slowEndpoints.forEach(result => {
      console.log(`  • ${result.url}: ${result.responseTime}ms`);
    });
  }
  
  console.log('\n✨ Monitoring Complete!\n');
  
  // Exit with error code if issues found
  if (failed.length > 0 || slowEndpoints.length > 0) {
    process.exit(1);
  }
}

// Handle script execution
if (require.main === module) {
  runMonitoring().catch(error => {
    console.error('💥 Monitoring script failed:', error);
    process.exit(1);
  });
}

module.exports = { runMonitoring, makeRequest }; 