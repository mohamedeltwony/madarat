# 🚀 Lead Magnet Development Guide - Part 3

## 📝 Lead Form Components

### `src/components/LeadForm/LeadForm.js` - Main Lead Form Component

```javascript
import React, { useState, useEffect } from 'react';
import { trackFormSubmission } from '@/lib/gtm';
import { sendAllPixelEvents } from '@/lib/pixelTracking';
import { saveUserProfile, getUserDataFromURL } from '@/utils/userIdentification';
import styles from './LeadForm.module.scss';

const LeadForm = ({ 
  title = "Get Your Free Guide",
  description = "Enter your details to receive your free guide",
  buttonText = "Download Now",
  onSuccess = () => {},
  fields = ['name', 'email', 'phone'], // Configurable fields
  leadMagnetName = "Lead Magnet",
  conversionValue = 1
}) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    message: ''
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [formStarted, setFormStarted] = useState(false);

  // Auto-populate from URL parameters (for ad traffic)
  useEffect(() => {
    const urlData = getUserDataFromURL();
    if (Object.keys(urlData).length > 0) {
      setFormData(prev => ({
        ...prev,
        ...urlData
      }));
    }
  }, []);

  // Validate form
  const validateForm = () => {
    const newErrors = {};
    
    if (fields.includes('name') && !formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (fields.includes('email') && !formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (fields.includes('email') && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    if (fields.includes('phone') && !formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear errors for this field
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }

    // Track form initiation
    if (!formStarted && value.trim() !== '') {
      setFormStarted(true);
      
      // Track initiation event
      const eventId = crypto.randomUUID();
      sendAllPixelEvents('initiate', {
        email: formData.email,
        phone: formData.phone,
        firstName: formData.name.split(' ')[0],
        lastName: formData.name.split(' ')[1] || ''
      }, {
        content_name: leadMagnetName,
        value: conversionValue,
        currency: 'USD'
      }, eventId);
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm() || isLoading) return;
    
    setIsLoading(true);
    
    try {
      const eventId = crypto.randomUUID();
      const userId = crypto.randomUUID();
      
      // Prepare user data
      const userData = {
        email: formData.email,
        phone: formData.phone,
        firstName: formData.name.split(' ')[0],
        lastName: formData.name.split(' ')[1] || '',
        name: formData.name,
        company: formData.company,
        message: formData.message
      };

      // Save user profile for persistence
      await saveUserProfile({
        ...userData,
        leadMagnet: leadMagnetName,
        conversionValue,
        userId,
        eventId
      });

      // Track form submission
      await trackFormSubmission('lead_form', {
        ...userData,
        leadMagnet: leadMagnetName,
        value: conversionValue,
        event_id: eventId
      });

      // Send pixel events
      sendAllPixelEvents('lead', userData, {
        content_name: leadMagnetName,
        value: conversionValue,
        currency: 'USD'
      }, eventId);

      // Submit to webhook/API
      const response = await fetch('/api/submit-lead', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          leadMagnet: leadMagnetName,
          eventId,
          userId,
          timestamp: new Date().toISOString(),
          source: 'lead_form'
        }),
      });

      if (response.ok) {
        // Success callback
        onSuccess({
          ...userData,
          eventId,
          userId
        });
        
        // Reset form
        setFormData({
          name: '',
          email: '',
          phone: '',
          company: '',
          message: ''
        });
        
        // Redirect to thank you page
        const queryParams = new URLSearchParams({
          email: formData.email,
          name: formData.name,
          phone: formData.phone,
          eventId,
          source: leadMagnetName
        });
        
        window.location.href = `/thank-you?${queryParams.toString()}`;
        
      } else {
        throw new Error('Failed to submit form');
      }
      
    } catch (error) {
      console.error('Form submission error:', error);
      alert('There was an error submitting your form. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.leadForm}>
      <div className={styles.formHeader}>
        <h2 className={styles.title}>{title}</h2>
        <p className={styles.description}>{description}</p>
      </div>
      
      <form onSubmit={handleSubmit} className={styles.form}>
        {fields.includes('name') && (
          <div className={styles.formGroup}>
            <label htmlFor="name" className={styles.label}>
              Full Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className={`${styles.input} ${errors.name ? styles.error : ''}`}
              placeholder="Enter your full name"
              required
            />
            {errors.name && <span className={styles.errorText}>{errors.name}</span>}
          </div>
        )}
        
        {fields.includes('email') && (
          <div className={styles.formGroup}>
            <label htmlFor="email" className={styles.label}>
              Email Address *
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className={`${styles.input} ${errors.email ? styles.error : ''}`}
              placeholder="Enter your email"
              required
            />
            {errors.email && <span className={styles.errorText}>{errors.email}</span>}
          </div>
        )}
        
        {fields.includes('phone') && (
          <div className={styles.formGroup}>
            <label htmlFor="phone" className={styles.label}>
              Phone Number *
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className={`${styles.input} ${errors.phone ? styles.error : ''}`}
              placeholder="Enter your phone number"
              required
            />
            {errors.phone && <span className={styles.errorText}>{errors.phone}</span>}
          </div>
        )}
        
        {fields.includes('company') && (
          <div className={styles.formGroup}>
            <label htmlFor="company" className={styles.label}>
              Company Name
            </label>
            <input
              type="text"
              id="company"
              name="company"
              value={formData.company}
              onChange={handleInputChange}
              className={styles.input}
              placeholder="Enter your company name"
            />
          </div>
        )}
        
        {fields.includes('message') && (
          <div className={styles.formGroup}>
            <label htmlFor="message" className={styles.label}>
              Message
            </label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleInputChange}
              className={styles.textarea}
              placeholder="Tell us about your needs..."
              rows="4"
            />
          </div>
        )}
        
        <button
          type="submit"
          disabled={isLoading}
          className={`${styles.submitButton} ${isLoading ? styles.loading : ''}`}
        >
          {isLoading ? 'Submitting...' : buttonText}
        </button>
        
        <p className={styles.privacy}>
          By submitting this form, you agree to our 
          <a href="/privacy-policy" target="_blank"> Privacy Policy</a> and 
          <a href="/terms-of-service" target="_blank"> Terms of Service</a>.
        </p>
      </form>
    </div>
  );
};

export default LeadForm;
```

### `src/components/LeadForm/LeadForm.module.scss` - Form Styles

```scss
.leadForm {
  max-width: 500px;
  margin: 0 auto;
  padding: 2rem;
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  border: 1px solid #e2e8f0;
}

.formHeader {
  text-align: center;
  margin-bottom: 2rem;
}

.title {
  font-size: 1.75rem;
  font-weight: 700;
  color: #1a202c;
  margin-bottom: 0.5rem;
  line-height: 1.2;
}

.description {
  color: #4a5568;
  font-size: 1rem;
  line-height: 1.5;
  margin: 0;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.formGroup {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.label {
  font-weight: 600;
  color: #2d3748;
  font-size: 0.875rem;
  margin-bottom: 0.25rem;
}

.input,
.textarea {
  padding: 0.75rem 1rem;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.2s ease;
  background: #ffffff;
  
  &:focus {
    outline: none;
    border-color: #3182ce;
    box-shadow: 0 0 0 3px rgba(49, 130, 206, 0.1);
  }
  
  &.error {
    border-color: #e53e3e;
    
    &:focus {
      border-color: #e53e3e;
      box-shadow: 0 0 0 3px rgba(229, 62, 62, 0.1);
    }
  }
  
  &::placeholder {
    color: #a0aec0;
  }
}

.textarea {
  resize: vertical;
  min-height: 100px;
}

.errorText {
  color: #e53e3e;
  font-size: 0.875rem;
  margin-top: 0.25rem;
}

.submitButton {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 1rem 2rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  
  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
  }
  
  &:active:not(:disabled) {
    transform: translateY(0);
  }
  
  &.loading,
  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    transform: none;
  }
}

.privacy {
  font-size: 0.75rem;
  color: #718096;
  text-align: center;
  line-height: 1.4;
  margin-top: 1rem;
  
  a {
    color: #3182ce;
    text-decoration: none;
    
    &:hover {
      text-decoration: underline;
    }
  }
}

// Responsive design
@media (max-width: 768px) {
  .leadForm {
    padding: 1.5rem;
    margin: 1rem;
  }
  
  .title {
    font-size: 1.5rem;
  }
  
  .description {
    font-size: 0.875rem;
  }
}
```

## 🔗 API Endpoints

### `src/pages/api/submit-lead.js` - Lead Submission API

```javascript
import { NextResponse } from 'next/server';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const {
      name,
      email,
      phone,
      company,
      message,
      leadMagnet,
      eventId,
      userId,
      timestamp,
      source
    } = req.body;

    // Validate required fields
    if (!email || !name) {
      return res.status(400).json({ error: 'Email and name are required' });
    }

    // Prepare lead data
    const leadData = {
      name,
      email,
      phone,
      company,
      message,
      leadMagnet,
      eventId,
      userId,
      timestamp,
      source,
      userAgent: req.headers['user-agent'],
      ipAddress: req.connection.remoteAddress || req.socket.remoteAddress,
      referrer: req.headers.referer || 'direct'
    };

    // Send to Zapier webhook
    if (process.env.ZAPIER_WEBHOOK_URL) {
      try {
        const zapierResponse = await fetch(process.env.ZAPIER_WEBHOOK_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(leadData),
        });

        if (!zapierResponse.ok) {
          console.error('Zapier webhook failed:', zapierResponse.status);
        }
      } catch (zapierError) {
        console.error('Zapier webhook error:', zapierError);
      }
    }

    // Send email notification
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      try {
        const emailResponse = await fetch('/api/send-notification-email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(leadData),
        });

        if (!emailResponse.ok) {
          console.error('Email notification failed:', emailResponse.status);
        }
      } catch (emailError) {
        console.error('Email notification error:', emailError);
      }
    }

    // Send to Facebook Conversions API
    if (process.env.FB_ACCESS_TOKEN) {
      try {
        const fbResponse = await fetch('/api/facebook-conversion', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            eventName: 'Lead',
            eventId,
            userData: {
              em: email,
              ph: phone?.replace(/[^0-9]/g, ''),
              fn: name.split(' ')[0],
              ln: name.split(' ')[1] || '',
            },
            customData: {
              content_name: leadMagnet,
              value: 1,
              currency: 'USD'
            }
          }),
        });

        if (!fbResponse.ok) {
          console.error('Facebook CAPI failed:', fbResponse.status);
        }
      } catch (fbError) {
        console.error('Facebook CAPI error:', fbError);
      }
    }

    // Send to Snapchat Conversions API
    if (process.env.SNAPCHAT_ACCESS_TOKEN) {
      try {
        const snapResponse = await fetch('/api/snapchat-conversion', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            eventName: 'SIGN_UP',
            userData: {
              user_email: email,
              user_phone_number: phone?.replace(/[^0-9]/g, ''),
            },
            customData: {
              content_name: leadMagnet
            }
          }),
        });

        if (!snapResponse.ok) {
          console.error('Snapchat CAPI failed:', snapResponse.status);
        }
      } catch (snapError) {
        console.error('Snapchat CAPI error:', snapError);
      }
    }

    // Return success response
    res.status(200).json({
      success: true,
      message: 'Lead submitted successfully',
      eventId,
      userId
    });

  } catch (error) {
    console.error('Lead submission error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
}
```

### `src/pages/api/facebook-conversion.js` - Facebook Conversions API

```javascript
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { eventName, eventId, userData, customData } = req.body;
    
    const pixelId = process.env.FB_PIXEL_ID;
    const accessToken = process.env.FB_ACCESS_TOKEN;

    if (!pixelId || !accessToken) {
      return res.status(400).json({ error: 'Facebook configuration missing' });
    }

    const eventData = {
      data: [{
        event_name: eventName,
        event_time: Math.floor(Date.now() / 1000),
        event_id: eventId,
        user_data: userData,
        custom_data: customData,
        event_source_url: req.headers.referer || 'https://your-site.com',
        action_source: 'website'
      }]
    };

    const response = await fetch(
      `https://graph.facebook.com/v17.0/${pixelId}/events?access_token=${accessToken}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(eventData),
      }
    );

    const result = await response.json();

    if (response.ok) {
      res.status(200).json({ success: true, result });
    } else {
      res.status(400).json({ error: 'Facebook API error', details: result });
    }

  } catch (error) {
    console.error('Facebook Conversions API error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
```

---

*Continue to Part 4 for landing page templates and thank you page implementations.* 