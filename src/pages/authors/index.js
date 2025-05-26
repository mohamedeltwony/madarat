import Link from 'next/link';
import { getAllAuthors, authorPathByName } from '@/lib/users';
import { getPostsByAuthorSlug } from '@/lib/posts';
import { getSiteMetadata } from '@/lib/site';
import { getAllMenus } from '@/lib/menus';

import Layout from '@/components/Layout';
import Header from '@/components/Header';
import Section from '@/components/Section';
import Container from '@/components/Container';
import SectionTitle from '@/components/SectionTitle';
import Image from 'next/legacy/image';
import styles from '@/styles/pages/Authors.module.scss';

export default function AuthorIndex({ metadata, menus, authors, error }) {
  if (error) {
    return (
      <Layout metadata={metadata} menus={menus}>
        <Header>
          <Container>
            <h1>الكتّاب</h1>
          </Container>
        </Header>
        <Section>
          <Container>
            <div className={styles.error}>
              <h2>عذراً، حدث خطأ</h2>
              <p>{error}</p>
              <button 
                onClick={() => window.location.reload()}
                className={styles.retryButton}
              >
                إعادة المحاولة
              </button>
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
          <div className={styles.heroContent}>
            <h1>تعرف على كتّابنا</h1>
            <p className={styles.heroDescription}>
              اكتشف فريق الكتّاب المتميزين في مدارات الكون واقرأ مقالاتهم الشيقة حول السفر والسياحة
            </p>
            <div className={styles.heroStats}>
              <div className={styles.statItem}>
                <span className={styles.statNumber}>{authors.length}</span>
                <span className={styles.statLabel}>كاتب</span>
              </div>
              <div className={styles.statItem}>
                <span className={styles.statNumber}>
                  {authors.reduce((sum, author) => sum + (author.postCount || 0), 0)}
                </span>
                <span className={styles.statLabel}>مقالة منشورة</span>
              </div>
            </div>
          </div>
        </Container>
      </Header>

      <Section>
        <Container>
          {authors.length > 0 ? (
            <div className={styles.authorsGrid}>
              {authors.map((author) => {
                const { name, description, slug, avatar } = author;
                const { postCount } = author;

                return (
                  <div key={slug} className={styles.authorCard}>
                    <Link
                      href={authorPathByName(name)}
                      className={styles.authorLink}
                    >
                      <div className={styles.authorAvatar}>
                        {avatar ? (
                          <Image
                            src={avatar.url}
                            alt={`صورة ${name}`}
                            width={80}
                            height={80}
                            layout="fixed"
                            className={styles.avatar}
                          />
                        ) : (
                          <div className={styles.avatarPlaceholder}>
                            {name.charAt(0)}
                          </div>
                        )}
                      </div>
                      <h2 className={styles.authorName}>{name}</h2>
                    </Link>
                    {description && (
                      <p className={styles.authorDescription}>{description}</p>
                    )}
                    <div className={styles.authorMeta}>
                      <p className={styles.authorPostCount}>
                        {postCount || 0} {(postCount || 0) === 1 ? 'مقالة' : 'مقالة'}
                      </p>
                      <Link 
                        href={authorPathByName(name)}
                        className={styles.viewProfileLink}
                      >
                        عرض الملف الشخصي
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className={styles.emptyState}>
              <h3>لا يوجد كتّاب متاحون حالياً</h3>
              <p>نعمل على إضافة كتّاب جدد قريباً. تابعونا للحصول على آخر التحديثات.</p>
            </div>
          )}
        </Container>
      </Section>
    </Layout>
  );
}

export async function getStaticProps() {
  try {
    // Fetch metadata, menus, and authors data
    const [
      { metadata },
      { menus },
      { authors }
    ] = await Promise.all([
      getSiteMetadata(),
      getAllMenus(),
      getAllAuthors()
    ]);

    // Get post count for each author
    const authorsWithPostCount = await Promise.all(
      authors.map(async (author) => {
        try {
          const { posts } = await getPostsByAuthorSlug({
            slug: author.slug,
            queryIncludes: 'index',
          });

          return {
            ...author,
            postCount: posts.length,
          };
        } catch (error) {
          console.error(`Error fetching posts for author ${author.slug}:`, error);
          return {
            ...author,
            postCount: 0,
          };
        }
      })
    );

    // Sort authors by post count (desc)
    const sortedAuthors = authorsWithPostCount.sort(
      (a, b) => (b.postCount || 0) - (a.postCount || 0)
    );

    // Construct page metadata
    const pageMetadata = {
      title: 'الكتّاب - مدارات الكون',
      description: `تعرف على فريق الكتّاب المتميزين في مدارات الكون. ${sortedAuthors.length} كاتب يشاركونك خبراتهم في السفر والسياحة`,
      canonical: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://madaratalkon.com'}/authors`,
      robots: 'index, follow',
      og: {
        title: 'الكتّاب - مدارات الكون',
        description: `تعرف على فريق الكتّاب المتميزين في مدارات الكون. ${sortedAuthors.length} كاتب يشاركونك خبراتهم في السفر والسياحة`,
        type: 'website',
        url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://madaratalkon.com'}/authors`,
        siteName: 'مدارات الكون',
        image: sortedAuthors[0]?.avatar?.url || `${process.env.NEXT_PUBLIC_SITE_URL || 'https://madaratalkon.com'}/images/authors-og.jpg`,
      },
      twitter: {
        card: 'summary_large_image',
        title: 'الكتّاب - مدارات الكون',
        description: `تعرف على فريق الكتّاب المتميزين في مدارات الكون. ${sortedAuthors.length} كاتب يشاركونك خبراتهم في السفر والسياحة`,
        image: sortedAuthors[0]?.avatar?.url || `${process.env.NEXT_PUBLIC_SITE_URL || 'https://madaratalkon.com'}/images/authors-og.jpg`,
      },
    };

    return {
      props: {
        metadata: { ...metadata, ...pageMetadata },
        menus: menus || [],
        authors: sortedAuthors,
        error: null,
      },
      revalidate: 1800, // Revalidate every 30 minutes as per plan
    };
  } catch (error) {
    console.error('Error in authors getStaticProps:', error);
    
    // Fetch basic metadata for error state
    const [{ metadata }, { menus }] = await Promise.all([
      getSiteMetadata().catch(() => ({ metadata: {} })),
      getAllMenus().catch(() => ({ menus: [] })),
    ]);

    const pageMetadata = {
      title: 'الكتّاب - مدارات الكون',
      description: 'تعرف على فريق الكتّاب المتميزين في مدارات الكون واقرأ مقالاتهم الشيقة حول السفر والسياحة',
    };

    return {
      props: {
        metadata: { ...metadata, ...pageMetadata },
        menus: menus || [],
        authors: [],
        error: 'حدث خطأ أثناء تحميل بيانات الكتّاب. يرجى المحاولة مرة أخرى لاحقاً.',
      },
      revalidate: 60, // Retry more frequently on error
    };
  }
}
