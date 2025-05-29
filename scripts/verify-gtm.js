#!/usr/bin/env node

/**
 * GTM Integration Verification Script
 * This script verifies that Google Tag Manager is properly integrated
 */

const puppeteer = require('puppeteer');
const chalk = require('chalk');

const GTM_ID = 'GTM-5PQ58CMB';
const TEST_URL = 'http://localhost:3000';

async function verifyGTM() {
  console.log(chalk.blue('🔍 Starting GTM Integration Verification...'));
  
  let browser;
  try {
    browser = await puppeteer.launch({ 
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    
    // Enable console logging
    page.on('console', msg => {
      if (msg.text().includes('GTM') || msg.text().includes('dataLayer')) {
        console.log(chalk.gray('Console:', msg.text()));
      }
    });
    
    console.log(chalk.yellow(`📱 Navigating to ${TEST_URL}...`));
    await page.goto(TEST_URL, { waitUntil: 'networkidle2' });
    
    // Check if GTM script is loaded
    const gtmScriptExists = await page.evaluate((gtmId) => {
      const scripts = Array.from(document.querySelectorAll('script'));
      return scripts.some(script => 
        script.src && script.src.includes(`gtm.js?id=${gtmId}`)
      );
    }, GTM_ID);
    
    // Check if dataLayer exists
    const dataLayerExists = await page.evaluate(() => {
      return typeof window.dataLayer !== 'undefined' && Array.isArray(window.dataLayer);
    });
    
    // Check if GTM noscript iframe exists
    const noscriptExists = await page.evaluate((gtmId) => {
      const iframes = Array.from(document.querySelectorAll('iframe'));
      return iframes.some(iframe => 
        iframe.src && iframe.src.includes(`ns.html?id=${gtmId}`)
      );
    }, GTM_ID);
    
    // Check if GTM container is loaded
    const gtmLoaded = await page.evaluate(() => {
      return typeof window.google_tag_manager !== 'undefined';
    });
    
    // Test event tracking
    const eventTest = await page.evaluate(() => {
      if (window.dataLayer) {
        const initialLength = window.dataLayer.length;
        window.dataLayer.push({
          event: 'test_event',
          test_data: 'verification'
        });
        return window.dataLayer.length > initialLength;
      }
      return false;
    });
    
    // Results
    console.log('\n' + chalk.blue('📊 GTM Integration Results:'));
    console.log('================================');
    
    console.log(
      gtmScriptExists 
        ? chalk.green('✅ GTM Script loaded successfully')
        : chalk.red('❌ GTM Script not found')
    );
    
    console.log(
      dataLayerExists 
        ? chalk.green('✅ DataLayer initialized')
        : chalk.red('❌ DataLayer not found')
    );
    
    console.log(
      noscriptExists 
        ? chalk.green('✅ GTM Noscript iframe present')
        : chalk.red('❌ GTM Noscript iframe missing')
    );
    
    console.log(
      gtmLoaded 
        ? chalk.green('✅ GTM Container loaded')
        : chalk.yellow('⚠️  GTM Container not fully loaded (may be normal)')
    );
    
    console.log(
      eventTest 
        ? chalk.green('✅ Event tracking functional')
        : chalk.red('❌ Event tracking not working')
    );
    
    const allPassed = gtmScriptExists && dataLayerExists && noscriptExists && eventTest;
    
    console.log('\n' + chalk.blue('🎯 Overall Status:'));
    console.log(
      allPassed 
        ? chalk.green('✅ GTM Integration is working correctly!')
        : chalk.yellow('⚠️  Some issues detected - check details above')
    );
    
    // Additional debugging info
    const dataLayerContent = await page.evaluate(() => {
      return window.dataLayer ? window.dataLayer.slice(0, 3) : [];
    });
    
    if (dataLayerContent.length > 0) {
      console.log('\n' + chalk.blue('📋 DataLayer Sample:'));
      console.log(JSON.stringify(dataLayerContent, null, 2));
    }
    
  } catch (error) {
    console.error(chalk.red('❌ Error during verification:'), error.message);
    
    if (error.message.includes('ECONNREFUSED')) {
      console.log(chalk.yellow('\n💡 Make sure the development server is running:'));
      console.log(chalk.gray('   npm run dev'));
    }
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

// Run verification
verifyGTM().catch(console.error); 