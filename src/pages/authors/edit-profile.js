import { useState } from 'react';
import { useRouter } from 'next/router';
import { getSiteMetadata } from '@/lib/site';
import { getAllMenus } from '@/lib/menus';

import Layout from '@/components/Layout';
import Header from '@/components/Header';
import Section from '@/components/Section';
import Container from '@/components/Container';
import Image from 'next/legacy/image';
import Link from 'next/link';
import styles from '@/styles/pages/AuthorEdit.module.scss';

export default function AuthorProfileEdit({ 
  metadata, 
  menus, 
  initialFormData, 
  isAuthenticated,
  error 
}) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Form state initialized with server data
  const [formData, setFormData] = useState(initialFormData || {
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
      // Create FormData for file upload
      const submitData = new FormData();
      Object.keys(formData).forEach(key => {
        if (key === 'social') {
          submitData.append(key, JSON.stringify(formData[key]));
        } else if (key === 'avatar' && formData[key]) {
          submitData.append(key, formData[key]);
        } else if (key !== 'avatarPreview') {
          submitData.append(key, formData[key]);
        }
      });

      // Simulate API call to update profile
      const response = await fetch('/api/authors/update-profile', {
        method: 'POST',
        body: submitData,
      });

      if (response.ok) {
        setMessage({
          type: 'success',
          text: 'تم تحديث الملف الشخصي بنجاح!',
        });
        
        // Redirect to dashboard after successful update
        setTimeout(() => {
          router.push('/authors/dashboard');
        }, 2000);
      } else {
        throw new Error('Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      setMessage({
        type: 'error',
        text: 'حدث خطأ أثناء تحديث الملف الشخصي. يرجى المحاولة مرة أخرى.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (error) {
    return (
      <Layout metadata={metadata} menus={menus}>
        <Header>
          <Container>
            <h1>تعديل الملف الشخصي</h1>
          </Container>
        </Header>
        <Section>
          <Container>
            <div className={styles.errorContainer}>
              <p className={styles.errorMessage}>{error}</p>
              <Link href="/authors/dashboard" className={styles.actionButton}>
                العودة إلى لوحة التحكم
              </Link>
            </div>
          </Container>
        </Section>
      </Layout>
    );
  }

  if (!isAuthenticated) {
    return (
      <Layout metadata={metadata} menus={menus}>
        <Header>
          <Container>
            <h1>تعديل الملف الشخصي</h1>
          </Container>
        </Header>
        <Section>
          <Container>
            <div className={styles.authContainer}>
              <div className={styles.authMessage}>
                <h2>يجب تسجيل الدخول لتعديل الملف الشخصي</h2>
                <p>يرجى تسجيل الدخول للوصول إلى صفحة تعديل الملف الشخصي.</p>
                <div className={styles.authActions}>
                  <Link href="/login" className={styles.actionButton}>
                    تسجيل الدخول
                  </Link>
                  <Link href="/register" className={styles.actionButton}>
                    إنشاء حساب جديد
                  </Link>
                </div>
              </div>
            </div>
          </Container>
        </Section>
      </Layout>
    );
  }

  return (
    <Layout metadata={metadata} menus={menus}>
      <Header>
        <Container>
          <div className={styles.profileHeader}>
            <Link href="/authors/dashboard" className={styles.backLink}>
              ← العودة إلى لوحة التحكم
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
                  <p className={styles.uploadNote}>
                    الحد الأقصى لحجم الملف: 2 ميجابايت
                  </p>
                </div>
              </div>

              <div className={styles.formFields}>
                <div className={styles.fieldGroup}>
                  <label htmlFor="name" className={styles.fieldLabel}>
                    الاسم الكامل *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className={styles.fieldInput}
                    placeholder="أدخل اسمك الكامل"
                  />
                </div>

                <div className={styles.fieldGroup}>
                  <label htmlFor="email" className={styles.fieldLabel}>
                    البريد الإلكتروني *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className={styles.fieldInput}
                    placeholder="أدخل بريدك الإلكتروني"
                  />
                </div>

                <div className={styles.fieldGroup}>
                  <label htmlFor="description" className={styles.fieldLabel}>
                    نبذة شخصية
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={4}
                    className={styles.fieldTextarea}
                    placeholder="اكتب نبذة مختصرة عن نفسك وخبراتك"
                  />
                </div>

                <div className={styles.fieldGroup}>
                  <label htmlFor="website" className={styles.fieldLabel}>
                    الموقع الشخصي
                  </label>
                  <input
                    type="url"
                    id="website"
                    name="website"
                    value={formData.website}
                    onChange={handleChange}
                    className={styles.fieldInput}
                    placeholder="https://example.com"
                  />
                </div>
              </div>
            </div>

            <div className={styles.socialSection}>
              <h3 className={styles.sectionTitle}>روابط التواصل الاجتماعي</h3>
              <div className={styles.socialGrid}>
                <div className={styles.fieldGroup}>
                  <label htmlFor="social.twitter" className={styles.fieldLabel}>
                    تويتر
                  </label>
                  <input
                    type="url"
                    id="social.twitter"
                    name="social.twitter"
                    value={formData.social.twitter}
                    onChange={handleChange}
                    className={styles.fieldInput}
                    placeholder="https://twitter.com/username"
                  />
                </div>

                <div className={styles.fieldGroup}>
                  <label htmlFor="social.facebook" className={styles.fieldLabel}>
                    فيسبوك
                  </label>
                  <input
                    type="url"
                    id="social.facebook"
                    name="social.facebook"
                    value={formData.social.facebook}
                    onChange={handleChange}
                    className={styles.fieldInput}
                    placeholder="https://facebook.com/username"
                  />
                </div>

                <div className={styles.fieldGroup}>
                  <label htmlFor="social.instagram" className={styles.fieldLabel}>
                    إنستغرام
                  </label>
                  <input
                    type="url"
                    id="social.instagram"
                    name="social.instagram"
                    value={formData.social.instagram}
                    onChange={handleChange}
                    className={styles.fieldInput}
                    placeholder="https://instagram.com/username"
                  />
                </div>

                <div className={styles.fieldGroup}>
                  <label htmlFor="social.linkedin" className={styles.fieldLabel}>
                    لينكد إن
                  </label>
                  <input
                    type="url"
                    id="social.linkedin"
                    name="social.linkedin"
                    value={formData.social.linkedin}
                    onChange={handleChange}
                    className={styles.fieldInput}
                    placeholder="https://linkedin.com/in/username"
                  />
                </div>
              </div>
            </div>

            <div className={styles.formActions}>
              <button
                type="submit"
                disabled={isLoading}
                className={`${styles.submitButton} ${isLoading ? styles.loading : ''}`}
              >
                {isLoading ? 'جاري الحفظ...' : 'حفظ التغييرات'}
              </button>
              <Link href="/authors/dashboard" className={styles.cancelButton}>
                إلغاء
              </Link>
            </div>
          </form>
        </Container>
      </Section>
    </Layout>
  );
}

export async function getServerSideProps(context) {
  try {
    // Check authentication
    const { req } = context;
    const isAuthenticated = checkAuthentication(req);
    
    // Fetch basic metadata and menus
    const [{ metadata }, { menus }] = await Promise.all([
      getSiteMetadata(),
      getAllMenus(),
    ]);

    const pageMetadata = {
      title: 'تعديل الملف الشخصي - مدارات الكون',
      description: 'قم بتحديث معلومات ملفك الشخصي وبياناتك',
      robots: 'noindex, nofollow', // Don't index profile edit pages
    };

    if (!isAuthenticated) {
      return {
        props: {
          metadata: { ...metadata, ...pageMetadata },
          menus: menus || [],
          initialFormData: null,
          isAuthenticated: false,
          error: null,
        },
      };
    }

    // Get current user info
    const currentUser = getCurrentUser(req);
    
    if (!currentUser) {
      return {
        props: {
          metadata: { ...metadata, ...pageMetadata },
          menus: menus || [],
          initialFormData: null,
          isAuthenticated: false,
          error: 'لم يتم العثور على بيانات المستخدم',
        },
      };
    }

    // Prepare initial form data
    const initialFormData = {
      name: currentUser.name || '',
      description: currentUser.description || '',
      avatar: null,
      avatarPreview: currentUser.avatar || 'https://via.placeholder.com/150',
      email: currentUser.email || '',
      website: currentUser.website || '',
      social: {
        twitter: currentUser.social?.twitter || '',
        facebook: currentUser.social?.facebook || '',
        instagram: currentUser.social?.instagram || '',
        linkedin: currentUser.social?.linkedin || '',
      },
    };

    return {
      props: {
        metadata: { ...metadata, ...pageMetadata },
        menus: menus || [],
        initialFormData,
        isAuthenticated: true,
        error: null,
      },
    };
  } catch (error) {
    console.error('Error in edit-profile getServerSideProps:', error);
    
    // Fetch basic metadata for error state
    const [{ metadata }, { menus }] = await Promise.all([
      getSiteMetadata().catch(() => ({ metadata: {} })),
      getAllMenus().catch(() => ({ menus: [] })),
    ]);

    const pageMetadata = {
      title: 'تعديل الملف الشخصي - مدارات الكون',
      description: 'قم بتحديث معلومات ملفك الشخصي وبياناتك',
      robots: 'noindex, nofollow',
    };

    return {
      props: {
        metadata: { ...metadata, ...pageMetadata },
        menus: menus || [],
        initialFormData: null,
        isAuthenticated: false,
        error: 'حدث خطأ أثناء تحميل البيانات. يرجى المحاولة مرة أخرى.',
      },
    };
  }
}

// Helper functions for authentication
function checkAuthentication(req) {
  // Mock authentication check
  const authHeader = req.headers.authorization;
  const sessionCookie = req.cookies.session;
  
  return !!(authHeader || sessionCookie);
}

function getCurrentUser(req) {
  // Mock user data - In a real app, this would decode JWT or fetch from session
  return {
    id: 1,
    name: 'محمد أحمد',
    description: 'كاتب ومحرر محتوى متخصص في السفر والسياحة',
    avatar: 'https://via.placeholder.com/150',
    email: 'mohamed@example.com',
    website: 'https://example.com',
    social: {
      twitter: 'https://twitter.com/mohamed',
      facebook: 'https://facebook.com/mohamed',
      instagram: 'https://instagram.com/mohamed',
      linkedin: 'https://linkedin.com/in/mohamed',
    },
  };
}
