import { getUserByNameSlug, getAllAuthors, userSlugByName } from '@/lib/users';
import { getPostsByAuthorSlug } from '@/lib/posts';
import { AuthorJsonLd } from 'lib/json-ld';
import usePageMetadata from 'hooks/use-page-metadata';

import Layout from '@/components/Layout';
import Header from '@/components/Header';
import Section from '@/components/Section';
import Container from '@/components/Container';
import PostCard from '@/components/PostCard';
import AuthorStats from '@/components/AuthorStats';
import AuthorSocial from '@/components/AuthorSocial';
import Image from 'next/legacy/image';
import Link from 'next/link';
import styles from '@/styles/pages/AuthorDetail.module.scss';

export default function Author({ user, posts }) {
  const { title, name, avatar, description, slug } = user;

  // Mock social data - in a real app, this would come from the API
  const mockSocial = {
    twitter: 'https://twitter.com/username',
    facebook: 'https://facebook.com/username',
    instagram: 'https://instagram.com/username',
    linkedin: 'https://linkedin.com/in/username',
  };

  const mockWebsite = 'https://example.com';

  const { metadata } = usePageMetadata({
    metadata: {
      ...user,
      title,
      description:
        description ||
        user.og?.description ||
        `Read ${posts.length} posts from ${name}`,
    },
  });

  const postOptions = {
    excludeMetadata: ['author'],
  };

  return (
    <Layout metadata={metadata}>
      <AuthorJsonLd author={user} />

      <Header>
        <Container>
          <div className={styles.authorHeader}>
            <Link href="/authors" className={styles.backLink}>
              ← All Authors
            </Link>

            <div className={styles.authorInfo}>
              {avatar && (
                <div className={styles.avatarContainer}>
                  <Image
                    src={avatar.url}
                    alt={`Avatar for ${name}`}
                    width={120}
                    height={120}
                    layout="fixed"
                    className={styles.avatar}
                  />
                </div>
              )}

              <div className={styles.authorMeta}>
                <h1 className={styles.authorName}>{name}</h1>
                {description && (
                  <p className={styles.authorDescription}>{description}</p>
                )}
                <p className={styles.postCount}>
                  {posts.length} {posts.length === 1 ? 'article' : 'articles'}
                </p>

                <div className={styles.authorActions}>
                  <Link
                    href="/authors/edit-profile"
                    className={styles.editButton}
                  >
                    تعديل الملف الشخصي
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </Header>

      <Section>
        <Container>
          <div className={styles.contentGrid}>
            <div className={styles.mainContent}>
              <h2 className={styles.sectionTitle}>Articles by {name}</h2>

              {posts.length > 0 ? (
                <>
                  <div className={styles.postsGrid}>
                    {posts.map((post) => (
                      <PostCard
                        key={post.slug}
                        post={post}
                        options={postOptions}
                      />
                    ))}
                  </div>
                </>
              ) : (
                <p className={styles.noPosts}>No posts found by this author.</p>
              )}
            </div>

            <div className={styles.sidebar}>
              <AuthorStats authorSlug={slug} />
              <AuthorSocial social={mockSocial} website={mockWebsite} />
            </div>
          </div>
        </Container>
      </Section>
    </Layout>
  );
}

export async function getStaticProps({ params = {} } = {}) {
  const { user } = await getUserByNameSlug(params?.slug);

  if (!user) {
    return {
      props: {},
      notFound: true,
    };
  }

  const { posts } = await getPostsByAuthorSlug({
    slug: user?.slug,
    queryIncludes: 'archive',
  });

  return {
    props: {
      user,
      posts,
    },
  };
}

export async function getStaticPaths() {
  // For better performance in production, we'll pre-render the most active authors
  // but allow other author pages to be generated on-demand

  const { authors } = await getAllAuthors();

  // Get the top 10 authors (or all if less than 10)
  const topAuthors = authors.slice(0, 10);

  const paths = topAuthors.map((author) => {
    const { name } = author;
    return {
      params: {
        slug: userSlugByName(name),
      },
    };
  });

  return {
    paths,
    fallback: 'blocking',
  };
}
