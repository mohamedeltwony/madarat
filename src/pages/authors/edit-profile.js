import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import usePageMetadata from '@/hooks/use-page-metadata';

import Layout from '@/components/Layout';
import Header from '@/components/Header';
import Section from '@/components/Section';
import Container from '@/components/Container';
import Image from 'next/legacy/image';
import Link from 'next/link';
import styles from '@/styles/pages/AuthorEdit.module.scss';

export default function AuthorProfileEdit() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    avatar: null,
    avatarPreview: null,
    email: '',
    website: '',
    social: {
      twitter: '',
      facebook: '',
      instagram: '',
      linkedin: '',
    },
  });

  // Mock authentication - in a real app, this would check if the user is logged in
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Simulate checking authentication
    const checkAuth = () => {
      // This is a mock - in a real app, you would check if the user is logged in
      // For demo purposes, we'll just set it to true after a delay
      setTimeout(() => {
        setIsAuthenticated(true);

        // Mock loading user data
        setFormData({
          name: 'محمد أحمد',
          description: 'كاتب ومحرر محتوى متخصص في السفر والسياحة',
          avatar: null,
          avatarPreview: 'https://via.placeholder.com/150',
          email: 'mohamed@example.com',
          website: 'https://example.com',
          social: {
            twitter: 'https://twitter.com/mohamed',
            facebook: 'https://facebook.com/mohamed',
            instagram: 'https://instagram.com/mohamed',
            linkedin: 'https://linkedin.com/in/mohamed',
          },
        });
      }, 1000);
    };

    checkAuth();
  }, []);

  const { metadata } = usePageMetadata({
    metadata: {
      title: 'تعديل الملف الشخصي',
      description: 'قم بتحديث معلومات ملفك الشخصي',
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.includes('.')) {
      // Handle nested objects (social media)
      const [parent, child] = name.split('.');
      setFormData({
        ...formData,
        [parent]: {
          ...formData[parent],
          [child]: value,
        },
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({
          ...formData,
          avatar: file,
          avatarPreview: reader.result,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ type: '', text: '' });

    try {
      // Simulate API call to update profile
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Success message
      setMessage({
        type: 'success',
        text: 'تم تحديث الملف الشخصي بنجاح!',
      });
    } catch (error) {
      // Error message
      setMessage({
        type: 'error',
        text: 'حدث خطأ أثناء تحديث الملف الشخصي. يرجى المحاولة مرة أخرى.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <Layout metadata={metadata}>
        <Header>
          <Container>
            <h1>تعديل الملف الشخصي</h1>
          </Container>
        </Header>
        <Section>
          <Container>
            <div className={styles.loadingContainer}>
              <div className={styles.spinner}></div>
              <p>جاري التحميل...</p>
            </div>
          </Container>
        </Section>
      </Layout>
    );
  }

  return (
    <Layout metadata={metadata}>
      <Header>
        <Container>
          <div className={styles.profileHeader}>
            <Link href="/authors" className={styles.backLink}>
              ← العودة إلى قائمة الكتّاب
            </Link>
            <h1>تعديل الملف الشخصي</h1>
          </div>
        </Container>
      </Header>

      <Section>
        <Container>
          <form className={styles.profileForm} onSubmit={handleSubmit}>
            {message.text && (
              <div className={`${styles.message} ${styles[message.type]}`}>
                {message.text}
              </div>
            )}

            <div className={styles.formGrid}>
              <div className={styles.avatarSection}>
                <div className={styles.avatarContainer}>
                  {formData.avatarPreview && (
                    <Image
                      src={formData.avatarPreview}
                      alt="صورة الملف الشخصي"
                      width={150}
                      height={150}
                      layout="fixed"
                      className={styles.avatar}
                    />
                  )}
                </div>
                <div className={styles.avatarUpload}>
                  <label htmlFor="avatar" className={styles.uploadButton}>
                    تغيير الصورة
                  </label>
                  <input
                    type="file"
                    id="avatar"
                    name="avatar"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className={styles.fileInput}
                  />
                  <p className={styles.uploadHint}>
                    يفضل استخدام صورة مربعة بأبعاد 300×300 بكسل
                  </p>
                </div>
              </div>

              <div className={styles.formFields}>
                <div className={styles.formGroup}>
                  <label htmlFor="name">الاسم</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="email">البريد الإلكتروني</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="website">الموقع الإلكتروني</label>
                  <input
                    type="url"
                    id="website"
                    name="website"
                    value={formData.website}
                    onChange={handleChange}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="description">نبذة تعريفية</label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={4}
                  />
                </div>

                <h3 className={styles.socialHeading}>
                  حسابات التواصل الاجتماعي
                </h3>

                <div className={styles.formGroup}>
                  <label htmlFor="social.twitter">تويتر</label>
                  <input
                    type="url"
                    id="social.twitter"
                    name="social.twitter"
                    value={formData.social.twitter}
                    onChange={handleChange}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="social.facebook">فيسبوك</label>
                  <input
                    type="url"
                    id="social.facebook"
                    name="social.facebook"
                    value={formData.social.facebook}
                    onChange={handleChange}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="social.instagram">انستغرام</label>
                  <input
                    type="url"
                    id="social.instagram"
                    name="social.instagram"
                    value={formData.social.instagram}
                    onChange={handleChange}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="social.linkedin">لينكد إن</label>
                  <input
                    type="url"
                    id="social.linkedin"
                    name="social.linkedin"
                    value={formData.social.linkedin}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            <div className={styles.formActions}>
              <button
                type="submit"
                className={styles.submitButton}
                disabled={isLoading}
              >
                {isLoading ? 'جاري الحفظ...' : 'حفظ التغييرات'}
              </button>
              <Link href="/authors" className={styles.cancelButton}>
                إلغاء
              </Link>
            </div>
          </form>
        </Container>
      </Section>
    </Layout>
  );
}
