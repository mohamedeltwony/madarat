import React, { useState } from 'react';
import styles from './LeadMagnets.module.scss';
import SparkleButton from '@/components/UI/SparkleButton';

export default function LeadForm({
  title,
  subtitle,
  buttonText,
  onSuccess,
  formStyle,
}) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user types
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'الرجاء إدخال الاسم';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'الرجاء إدخال رقم الهاتف';
    } else if (!/^[0-9]{10,15}$/.test(formData.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'الرجاء إدخال رقم هاتف صحيح';
    }

    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'الرجاء إدخال بريد إلكتروني صحيح';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validate()) {
      setIsSubmitting(true);

      // Simulate API call
      setTimeout(() => {
        setIsSubmitting(false);
        setIsSuccess(true);
        if (onSuccess) {
          onSuccess(formData);
        }
      }, 1500);
    }
  };

  return (
    <div className={`${styles.leadForm} ${formStyle ? styles[formStyle] : ''}`}>
      {!isSuccess ? (
        <>
          {title && <h3 className={styles.formTitle}>{title}</h3>}
          {subtitle && <p className={styles.formSubtitle}>{subtitle}</p>}

          <form onSubmit={handleSubmit}>
            <div className={styles.formGroup}>
              <label htmlFor="name">الاسم الكامل*</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="أدخل اسمك الكامل"
                className={errors.name ? styles.inputError : ''}
              />
              {errors.name && (
                <span className={styles.errorText}>{errors.name}</span>
              )}
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="phone">رقم الهاتف*</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="أدخل رقم هاتفك"
                className={errors.phone ? styles.inputError : ''}
              />
              {errors.phone && (
                <span className={styles.errorText}>{errors.phone}</span>
              )}
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="email">البريد الإلكتروني (اختياري)</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="أدخل بريدك الإلكتروني"
                className={errors.email ? styles.inputError : ''}
              />
              {errors.email && (
                <span className={styles.errorText}>{errors.email}</span>
              )}
            </div>

            <div className={styles.formActions}>
              <SparkleButton
                type="submit"
                disabled={isSubmitting}
                fullWidth={true}
              >
                {isSubmitting ? 'جاري الإرسال...' : buttonText || 'إرسال'}
              </SparkleButton>
            </div>
          </form>
        </>
      ) : (
        <div className={styles.successMessage}>
          <div className={styles.successIcon}>✓</div>
          <h3>تم استلام بياناتك بنجاح!</h3>
          <p>سنقوم بالتواصل معك في أقرب وقت ممكن.</p>
        </div>
      )}
    </div>
  );
}
