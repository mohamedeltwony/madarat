/**
 * Snapchat Phone Validation Debug Tool
 * Run this in the browser console to diagnose validation issues
 */

window.SnapchatDebugger = {
  
  // Check if user is coming from Snapchat
  checkSnapchatTraffic() {
    console.log('🔍 Checking Snapchat Traffic...');
    
    const results = {
      isSnapchatTraffic: false,
      indicators: {
        urlParams: {},
        referrer: document.referrer || 'none',
        userAgent: navigator.userAgent,
        cookies: {}
      }
    };
    
    // Check URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    ['sc_click_id', 'snapchat_click_id', 'utm_source', 'utm_medium'].forEach(param => {
      const value = urlParams.get(param);
      if (value) {
        results.indicators.urlParams[param] = value;
        if (param.includes('sc_') || param.includes('snapchat') || value === 'snapchat') {
          results.isSnapchatTraffic = true;
        }
      }
    });
    
    // Check referrer
    if (results.indicators.referrer.includes('snapchat.com') || 
        results.indicators.referrer.includes('sc-static.net')) {
      results.isSnapchatTraffic = true;
    }
    
    // Check user agent
    if (results.indicators.userAgent.includes('Snapchat') || 
        results.indicators.userAgent.includes('SNAP')) {
      results.isSnapchatTraffic = true;
    }
    
    // Check cookies
    document.cookie.split(';').forEach(cookie => {
      const [name, value] = cookie.trim().split('=');
      if (name.includes('sc') || name.includes('snap')) {
        results.indicators.cookies[name] = value;
        results.isSnapchatTraffic = true;
      }
    });
    
    console.log('📱 Snapchat Traffic Results:', results);
    return results;
  },
  
  // Test phone validation
  testPhoneValidation(phoneNumber) {
    console.log(`📞 Testing phone validation for: ${phoneNumber}`);
    
    const tests = {
      original: /^(0|5|966)([0-9]{8,12})$/.test(phoneNumber),
      international: /^(\+?966|0)?[5][0-9]{8}$/.test(phoneNumber),
      numbersOnly: (() => {
        const numbers = phoneNumber.replace(/[^0-9]/g, '');
        return {
          value: numbers,
          length: numbers.length,
          validPatterns: {
            mobile9: numbers.length === 9 && numbers.startsWith('5'),
            mobile10: numbers.length === 10 && numbers.startsWith('05'),
            international12: numbers.length === 12 && numbers.startsWith('966') && numbers.substring(3).startsWith('5'),
            international13: numbers.length === 13 && numbers.startsWith('+966') && numbers.substring(4).startsWith('5')
          }
        };
      })()
    };
    
    const isValid = tests.original || 
                   tests.international || 
                   tests.numbersOnly.validPatterns.mobile9 ||
                   tests.numbersOnly.validPatterns.mobile10 ||
                   tests.numbersOnly.validPatterns.international12 ||
                   tests.numbersOnly.validPatterns.international13;
    
    console.log('✅ Validation Results:', { ...tests, isValid });
    return { ...tests, isValid };
  },
  
  // Check form state
  checkFormState() {
    console.log('📝 Checking form state...');
    
    const phoneInputs = document.querySelectorAll('input[type="tel"], input[name="phone"]');
    const results = [];
    
    phoneInputs.forEach((input, index) => {
      const result = {
        index,
        element: input,
        value: input.value,
        name: input.name,
        id: input.id,
        classes: input.className,
        validation: this.testPhoneValidation(input.value),
        events: {
          hasChangeListener: input.onchange !== null,
          hasInputListener: input.oninput !== null,
          hasBlurListener: input.onblur !== null
        }
      };
      results.push(result);
    });
    
    console.log('📋 Form State Results:', results);
    return results;
  },
  
  // Monitor validation events
  monitorValidation() {
    console.log('👀 Starting validation monitoring...');
    
    const phoneInputs = document.querySelectorAll('input[type="tel"], input[name="phone"]');
    
    phoneInputs.forEach((input, index) => {
      const originalHandlers = {
        change: input.onchange,
        input: input.oninput,
        blur: input.onblur
      };
      
      // Wrap existing handlers with logging
      input.addEventListener('input', (e) => {
        console.log(`📝 Phone input ${index} changed:`, {
          value: e.target.value,
          validation: this.testPhoneValidation(e.target.value),
          snapchatTraffic: this.checkSnapchatTraffic().isSnapchatTraffic
        });
      });
      
      input.addEventListener('blur', (e) => {
        console.log(`👁️ Phone input ${index} blurred:`, {
          value: e.target.value,
          validation: this.testPhoneValidation(e.target.value)
        });
      });
    });
    
    console.log('✅ Monitoring active for', phoneInputs.length, 'phone inputs');
  },
  
  // Auto-populate phone for testing
  testPhoneInput(phoneNumber = '0555123456') {
    console.log(`🧪 Testing phone input with: ${phoneNumber}`);
    
    const phoneInputs = document.querySelectorAll('input[type="tel"], input[name="phone"]');
    
    if (phoneInputs.length > 0) {
      const input = phoneInputs[0];
      
      // Set value
      input.value = phoneNumber;
      
      // Trigger events
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.dispatchEvent(new Event('change', { bubbles: true }));
      input.dispatchEvent(new Event('blur', { bubbles: true }));
      
      console.log('✅ Test input completed');
      
      // Check validation result
      setTimeout(() => {
        console.log('📊 Final validation state:', this.checkFormState());
      }, 500);
    } else {
      console.error('❌ No phone inputs found');
    }
  },
  
  // Run full diagnostic
  runFullDiagnostic() {
    console.log('🚀 Running full Snapchat validation diagnostic...');
    console.log('='.repeat(60));
    
    this.checkSnapchatTraffic();
    console.log('');
    
    this.checkFormState();
    console.log('');
    
    // Test common phone formats
    const testPhones = [
      '0555123456',
      '555123456',
      '966555123456',
      '+966555123456',
      '05 5512 3456',
      '966 55 512 3456'
    ];
    
    console.log('🧪 Testing common phone formats:');
    testPhones.forEach(phone => {
      this.testPhoneValidation(phone);
    });
    
    console.log('');
    this.monitorValidation();
    
    console.log('='.repeat(60));
    console.log('✅ Diagnostic complete. Try entering a phone number now to see real-time validation.');
  }
};

// Auto-run diagnostic if this is a Snapchat traffic
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    const snapchatTraffic = window.SnapchatDebugger.checkSnapchatTraffic();
    if (snapchatTraffic.isSnapchatTraffic) {
      console.log('🚨 Snapchat traffic detected! Run SnapchatDebugger.runFullDiagnostic() for detailed analysis.');
    }
  });
} else {
  const snapchatTraffic = window.SnapchatDebugger.checkSnapchatTraffic();
  if (snapchatTraffic.isSnapchatTraffic) {
    console.log('🚨 Snapchat traffic detected! Run SnapchatDebugger.runFullDiagnostic() for detailed analysis.');
  }
}

console.log('🔧 Snapchat Debugger loaded. Available commands:');
console.log('- SnapchatDebugger.runFullDiagnostic()');
console.log('- SnapchatDebugger.checkSnapchatTraffic()');
console.log('- SnapchatDebugger.testPhoneValidation("0555123456")');
console.log('- SnapchatDebugger.checkFormState()');
console.log('- SnapchatDebugger.monitorValidation()');
console.log('- SnapchatDebugger.testPhoneInput("0555123456")'); 