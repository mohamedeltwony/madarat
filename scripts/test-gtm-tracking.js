#!/usr/bin/env node

/**
 * Test script to verify GTM dataLayer tracking implementation
 * This script will test the dataLayer events after form submissions
 */

const puppeteer = require('puppeteer');
const chalk = require('chalk');

async function testGTMTracking() {
  console.log(chalk.blue('🧪 Testing GTM DataLayer Tracking...'));
  
  let browser;
  try {
    browser = await puppeteer.launch({ 
      headless: false, // Set to true for CI/CD
      devtools: true 
    });
    
    const page = await browser.newPage();
    
    // Enable console logging
    page.on('console', msg => {
      if (msg.text().includes('GTM') || msg.text().includes('dataLayer')) {
        console.log(chalk.yellow('🔍 Browser Log:'), msg.text());
      }
    });
    
    // Navigate to a trip page
    console.log(chalk.blue('📍 Navigating to Italy trip page...'));
    await page.goto('http://localhost:3000/italy-trip', { 
      waitUntil: 'networkidle2' 
    });
    
    // Wait for GTM to load
    await page.waitForTimeout(2000);
    
    // Check if dataLayer exists and GTM is loaded
    const gtmStatus = await page.evaluate(() => {
      return {
        dataLayerExists: typeof window.dataLayer !== 'undefined',
        dataLayerLength: window.dataLayer ? window.dataLayer.length : 0,
        gtmLoaded: typeof window.google_tag_manager !== 'undefined'
      };
    });
    
    console.log(chalk.green('✅ GTM Status:'), gtmStatus);
    
    // Monitor dataLayer events
    await page.evaluate(() => {
      // Override dataLayer.push to log events
      const originalPush = window.dataLayer.push;
      window.dataLayer.push = function(...args) {
        console.log('🎯 DataLayer Event:', JSON.stringify(args[0], null, 2));
        return originalPush.apply(window.dataLayer, args);
      };
    });
    
    // Test form interaction
    console.log(chalk.blue('📝 Testing form interaction...'));
    
    // Fill out the form
    await page.type('input[name="name"]', 'Test User');
    await page.waitForTimeout(500);
    
    await page.type('input[name="phone"]', '0501234567');
    await page.waitForTimeout(500);
    
    await page.type('input[name="email"]', 'test@example.com');
    await page.waitForTimeout(500);
    
    // Select nationality
    await page.select('select[name="nationality"]', 'مواطن');
    await page.waitForTimeout(500);
    
    console.log(chalk.blue('🚀 Submitting form...'));
    
    // Submit the form (this should trigger dataLayer events)
    await page.click('button[type="submit"]');
    
    // Wait for events to be tracked
    await page.waitForTimeout(3000);
    
    // Check what events were tracked
    const dataLayerEvents = await page.evaluate(() => {
      return window.dataLayer.filter(event => 
        event.event && (
          event.event.includes('form_submit') || 
          event.event.includes('trip_booking') ||
          event.event.includes('purchase_intent')
        )
      );
    });
    
    console.log(chalk.green('📊 Tracked Events:'));
    dataLayerEvents.forEach((event, index) => {
      console.log(chalk.cyan(`Event ${index + 1}:`), JSON.stringify(event, null, 2));
    });
    
    if (dataLayerEvents.length > 0) {
      console.log(chalk.green('✅ GTM tracking is working correctly!'));
    } else {
      console.log(chalk.red('❌ No form submission events detected in dataLayer'));
    }
    
  } catch (error) {
    console.error(chalk.red('❌ Test failed:'), error.message);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

// Run the test
testGTMTracking().catch(console.error); 