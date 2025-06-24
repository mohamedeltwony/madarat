# 🚀 Lead Magnet Development Guide - Part 4

## 🎯 Landing Page Templates

### `src/pages/index.js` - Main Landing Page Template

```javascript
import React, { useEffect } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import { trackPageView } from '@/lib/gtm';
import LeadForm from '@/components/LeadForm/LeadForm';
import styles from '@/styles/LandingPage.module.scss';

const LandingPage = () => {
  // Track page view on component mount
  useEffect(() => {
    trackPageView({
      page_category: 'landing_page',
      page_type: 'lead_magnet'
    });
  }, []);

  // Handle form success
  const handleFormSuccess = (userData) => {
    console.log('Form submitted successfully:', userData);
    // Additional success handling if needed
  };

  return (
    <>
      <Head>
        {/* Replace with your actual content */}
        <title>Free Guide: [YOUR_LEAD_MAGNET_TITLE] | [YOUR_BRAND_NAME]</title>
        <meta
          name="description"
          content="Download our free guide and discover [YOUR_VALUE_PROPOSITION]. Get instant access to expert insights and actionable strategies."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="robots" content="index, follow" />
        
        {/* Open Graph Tags */}
        <meta property="og:title" content="Free Guide: [YOUR_LEAD_MAGNET_TITLE]" />
        <meta property="og:description" content="Download our free guide and discover [YOUR_VALUE_PROPOSITION]" />
        <meta property="og:image" content="/images/og-image.jpg" />
        <meta property="og:url" content={process.env.NEXT_PUBLIC_SITE_URL} />
        <meta property="og:type" content="website" />
        
        {/* Twitter Card Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Free Guide: [YOUR_LEAD_MAGNET_TITLE]" />
        <meta name="twitter:description" content="Download our free guide and discover [YOUR_VALUE_PROPOSITION]" />
        <meta name="twitter:image" content="/images/twitter-image.jpg" />
        
        <link rel="canonical" href={process.env.NEXT_PUBLIC_SITE_URL} />
      </Head>

      <main className={styles.landingPage}>
        {/* Hero Section */}
        <section className={styles.hero}>
          <div className={styles.container}>
            <div className={styles.heroContent}>
              <div className={styles.heroText}>
                <h1 className={styles.headline}>
                  Get Your Free Guide: 
                  <span className={styles.highlight}>[YOUR_LEAD_MAGNET_TITLE]</span>
                </h1>
                
                <p className={styles.subheadline}>
                  Discover the secrets to [YOUR_VALUE_PROPOSITION] with our comprehensive guide. 
                  Join thousands of satisfied customers who have transformed their [INDUSTRY/NICHE].
                </p>
                
                <div className={styles.benefitsList}>
                  <div className={styles.benefit}>
                    <span className={styles.checkmark}>✓</span>
                    <span>Learn [SPECIFIC_BENEFIT_1]</span>
                  </div>
                  <div className={styles.benefit}>
                    <span className={styles.checkmark}>✓</span>
                    <span>Master [SPECIFIC_BENEFIT_2]</span>
                  </div>
                  <div className={styles.benefit}>
                    <span className={styles.checkmark}>✓</span>
                    <span>Implement [SPECIFIC_BENEFIT_3]</span>
                  </div>
                </div>
              </div>
              
              <div className={styles.heroForm}>
                <LeadForm
                  title="Download Your Free Guide"
                  description="Enter your details below to get instant access"
                  buttonText="Get Free Access Now"
                  onSuccess={handleFormSuccess}
                  fields={['name', 'email', 'phone']}
                  leadMagnetName="[YOUR_LEAD_MAGNET_NAME]"
                  conversionValue={5}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Social Proof Section */}
        <section className={styles.socialProof}>
          <div className={styles.container}>
            <h2 className={styles.sectionTitle}>Trusted by [NUMBER] Professionals</h2>
            <div className={styles.stats}>
              <div className={styles.stat}>
                <div className={styles.statNumber}>[NUMBER]+</div>
                <div className={styles.statLabel}>Happy Customers</div>
              </div>
              <div className={styles.stat}>
                <div className={styles.statNumber}>[NUMBER]%</div>
                <div className={styles.statLabel}>Success Rate</div>
              </div>
              <div className={styles.stat}>
                <div className={styles.statNumber}>[NUMBER]+</div>
                <div className={styles.statLabel}>Downloads</div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className={styles.features}>
          <div className={styles.container}>
            <h2 className={styles.sectionTitle}>What You'll Learn</h2>
            <div className={styles.featuresGrid}>
              <div className={styles.feature}>
                <div className={styles.featureIcon}>📚</div>
                <h3 className={styles.featureTitle}>[FEATURE_1_TITLE]</h3>
                <p className={styles.featureDescription}>
                  [FEATURE_1_DESCRIPTION]
                </p>
              </div>
              <div className={styles.feature}>
                <div className={styles.featureIcon}>🚀</div>
                <h3 className={styles.featureTitle}>[FEATURE_2_TITLE]</h3>
                <p className={styles.featureDescription}>
                  [FEATURE_2_DESCRIPTION]
                </p>
              </div>
              <div className={styles.feature}>
                <div className={styles.featureIcon}>💡</div>
                <h3 className={styles.featureTitle}>[FEATURE_3_TITLE]</h3>
                <p className={styles.featureDescription}>
                  [FEATURE_3_DESCRIPTION]
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className={styles.testimonials}>
          <div className={styles.container}>
            <h2 className={styles.sectionTitle}>What Our Customers Say</h2>
            <div className={styles.testimonialsGrid}>
              <div className={styles.testimonial}>
                <div className={styles.testimonialContent}>
                  "[TESTIMONIAL_1_CONTENT]"
                </div>
                <div className={styles.testimonialAuthor}>
                  <strong>[CUSTOMER_1_NAME]</strong>
                  <span>[CUSTOMER_1_TITLE]</span>
                </div>
              </div>
              <div className={styles.testimonial}>
                <div className={styles.testimonialContent}>
                  "[TESTIMONIAL_2_CONTENT]"
                </div>
                <div className={styles.testimonialAuthor}>
                  <strong>[CUSTOMER_2_NAME]</strong>
                  <span>[CUSTOMER_2_TITLE]</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className={styles.finalCta}>
          <div className={styles.container}>
            <div className={styles.ctaContent}>
              <h2 className={styles.ctaTitle}>Ready to Get Started?</h2>
              <p className={styles.ctaDescription}>
                Join thousands of professionals who have already downloaded our guide
              </p>
              <LeadForm
                title=""
                description="Last chance to get your free guide!"
                buttonText="Download Now - It's Free!"
                onSuccess={handleFormSuccess}
                fields={['name', 'email']}
                leadMagnetName="[YOUR_LEAD_MAGNET_NAME]"
                conversionValue={7}
              />
            </div>
          </div>
        </section>
      </main>
    </>
  );
};

export default LandingPage;
```

### `src/pages/thank-you.js` - Thank You Page

```javascript
import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { trackPageView, sendGTMEvent } from '@/lib/gtm';
import { sendAllPixelEvents } from '@/lib/pixelTracking';
import styles from '@/styles/ThankYou.module.scss';

const ThankYouPage = () => {
  const router = useRouter();
  const [userData, setUserData] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Get user data from URL parameters
    const { email, name, phone, eventId, source } = router.query;
    
    const userInfo = {
      email: email || '',
      name: name || '',
      phone: phone || '',
      eventId: eventId || '',
      source: source || 'unknown'
    };
    
    setUserData(userInfo);
    setIsLoading(false);

    // Track page view
    trackPageView({
      page_category: 'conversion',
      page_type: 'thank_you',
      conversion_source: source
    });

    // Track conversion event
    if (email || name) {
      const conversionEventId = crypto.randomUUID();
      
      // Send GTM event
      sendGTMEvent({
        event: 'conversion',
        event_category: 'lead_magnet',
        event_action: 'download',
        event_label: source,
        event_id: conversionEventId,
        user_email: email,
        user_name: name,
        user_phone: phone
      });

      // Send pixel events
      sendAllPixelEvents('lead', {
        email,
        phone,
        firstName: name?.split(' ')[0],
        lastName: name?.split(' ')[1] || ''
      }, {
        content_name: source,
        value: 10,
        currency: 'USD'
      }, conversionEventId);
    }
  }, [router.query]);

  if (isLoading) {
    return <div className={styles.loading}>Loading...</div>;
  }

  return (
    <>
      <Head>
        <title>Thank You - Download Your Free Guide | {process.env.NEXT_PUBLIC_BRAND_NAME}</title>
        <meta
          name="description"
          content="Thank you for downloading our free guide. Check your email for the download link."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <main className={styles.thankYouPage}>
        <div className={styles.container}>
          <div className={styles.content}>
            {/* Success Icon */}
            <div className={styles.successIcon}>
              <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
                <circle cx="40" cy="40" r="40" fill="#10B981" />
                <path d="M25 40L35 50L55 30" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>

            {/* Thank You Message */}
            <h1 className={styles.title}>
              Thank You{userData.name ? `, ${userData.name.split(' ')[0]}` : ''}!
            </h1>
            
            <p className={styles.subtitle}>
              Your free guide is on its way to your inbox.
            </p>

            {/* Next Steps */}
            <div className={styles.nextSteps}>
              <h2 className={styles.nextStepsTitle}>What happens next?</h2>
              
              <div className={styles.step}>
                <div className={styles.stepNumber}>1</div>
                <div className={styles.stepContent}>
                  <h3>Check Your Email</h3>
                  <p>We've sent your free guide to {userData.email || 'your email address'}</p>
                </div>
              </div>
              
              <div className={styles.step}>
                <div className={styles.stepNumber}>2</div>
                <div className={styles.stepContent}>
                  <h3>Download Your Guide</h3>
                  <p>Click the download link in the email to access your guide</p>
                </div>
              </div>
              
              <div className={styles.step}>
                <div className={styles.stepNumber}>3</div>
                <div className={styles.stepContent}>
                  <h3>Start Implementing</h3>
                  <p>Use the strategies in the guide to achieve your goals</p>
                </div>
              </div>
            </div>

            {/* Additional CTA */}
            <div className={styles.additionalCta}>
              <h3 className={styles.ctaTitle}>Want More?</h3>
              <p className={styles.ctaDescription}>
                Get personalized advice and premium resources by booking a free consultation.
              </p>
              <a 
                href="/book-consultation" 
                className={styles.ctaButton}
                onClick={() => {
                  sendGTMEvent({
                    event: 'button_click',
                    button_name: 'book_consultation',
                    button_location: 'thank_you_page'
                  });
                }}
              >
                Book Free Consultation
              </a>
            </div>

            {/* Social Sharing */}
            <div className={styles.socialSharing}>
              <p className={styles.shareText}>Love what you're learning? Share it with your network:</p>
              <div className={styles.shareButtons}>
                <a 
                  href={`https://twitter.com/intent/tweet?text=Just downloaded this amazing free guide from ${process.env.NEXT_PUBLIC_BRAND_NAME}! Check it out: ${process.env.NEXT_PUBLIC_SITE_URL}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.shareButton}
                >
                  Share on Twitter
                </a>
                <a 
                  href={`https://www.linkedin.com/sharing/share-offsite/?url=${process.env.NEXT_PUBLIC_SITE_URL}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.shareButton}
                >
                  Share on LinkedIn
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default ThankYouPage;
```

## 🎨 Styling Templates

### `src/styles/LandingPage.module.scss`

```scss
.landingPage {
  min-height: 100vh;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

.hero {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 4rem 0;
  min-height: 100vh;
  display: flex;
  align-items: center;
}

.heroContent {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: center;
}

.headline {
  font-size: 3rem;
  font-weight: 800;
  line-height: 1.1;
  margin-bottom: 1.5rem;
}

.highlight {
  color: #ffd700;
  display: block;
}

.subheadline {
  font-size: 1.25rem;
  line-height: 1.6;
  margin-bottom: 2rem;
  opacity: 0.9;
}

.benefitsList {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.benefit {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 1.1rem;
}

.checkmark {
  background: #10b981;
  color: white;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.875rem;
  font-weight: bold;
}

.socialProof {
  padding: 4rem 0;
  background: #f8fafc;
  text-align: center;
}

.sectionTitle {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 3rem;
  color: #1a202c;
}

.stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
  max-width: 800px;
  margin: 0 auto;
}

.stat {
  text-align: center;
}

.statNumber {
  font-size: 3rem;
  font-weight: 800;
  color: #667eea;
  display: block;
}

.statLabel {
  font-size: 1.1rem;
  color: #4a5568;
  margin-top: 0.5rem;
}

.features {
  padding: 4rem 0;
}

.featuresGrid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 3rem;
  margin-top: 3rem;
}

.feature {
  text-align: center;
  padding: 2rem;
  border-radius: 12px;
  background: white;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.featureIcon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.featureTitle {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1a202c;
  margin-bottom: 1rem;
}

.featureDescription {
  color: #4a5568;
  line-height: 1.6;
}

.testimonials {
  padding: 4rem 0;
  background: #f8fafc;
}

.testimonialsGrid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 3rem;
  margin-top: 3rem;
}

.testimonial {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.testimonialContent {
  font-style: italic;
  font-size: 1.1rem;
  line-height: 1.6;
  margin-bottom: 1.5rem;
  color: #2d3748;
}

.testimonialAuthor {
  display: flex;
  flex-direction: column;
  
  strong {
    color: #1a202c;
    margin-bottom: 0.25rem;
  }
  
  span {
    color: #718096;
    font-size: 0.9rem;
  }
}

.finalCta {
  padding: 4rem 0;
  background: linear-gradient(135deg, #1a202c 0%, #2d3748 100%);
  color: white;
  text-align: center;
}

.ctaContent {
  max-width: 600px;
  margin: 0 auto;
}

.ctaTitle {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
}

.ctaDescription {
  font-size: 1.25rem;
  margin-bottom: 3rem;
  opacity: 0.9;
}

// Responsive Design
@media (max-width: 768px) {
  .heroContent {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
  
  .headline {
    font-size: 2rem;
  }
  
  .stats {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
  
  .featuresGrid,
  .testimonialsGrid {
    grid-template-columns: 1fr;
  }
}
```

## 🚀 Deployment Instructions

### Quick Setup Checklist

1. **Clone the template structure**
2. **Replace all placeholder values**:
   - `[YOUR_BRAND_NAME]` → Your actual brand name
   - `[YOUR_LEAD_MAGNET_TITLE]` → Your lead magnet title
   - `[YOUR_VALUE_PROPOSITION]` → Your unique value proposition
   - Pixel IDs and access tokens
   - Content and copy

3. **Configure environment variables**:
   ```bash
   cp .env.local.example .env.local
   # Edit .env.local with your actual values
   ```

4. **Install dependencies**:
   ```bash
   npm install
   # or
   yarn install
   ```

5. **Run development server**:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

6. **Test all integrations**:
   - Submit test leads
   - Verify pixel firing
   - Check webhook delivery
   - Test email notifications

7. **Deploy to production**:
   - Vercel: `vercel --prod`
   - Netlify: `netlify deploy --prod`
   - Or your preferred platform

### 🔍 Testing Your Integration

Before going live, test everything:

1. **Form Submission Test**:
   - Fill out the form
   - Check console for pixel events
   - Verify webhook delivery
   - Confirm email receipt

2. **Pixel Verification**:
   - Use Facebook Pixel Helper browser extension
   - Use browser dev tools to check network requests
   - Verify events in ad platform dashboards

3. **GTM Verification**:
   - Use GTM Preview mode
   - Check dataLayer events
   - Verify tag firing

---

## 🎯 Final Notes

This template provides everything needed to create a high-converting lead magnet website with complete pixel integration and tracking. Simply replace the placeholder content with your brand information and you're ready to start capturing leads!

**Remember to**:
- Update all placeholder content
- Set up proper SSL certificates
- Configure proper domain settings
- Test thoroughly before launch
- Monitor conversion tracking

Need help with implementation? Contact your development team with this complete guide! 