import Link from 'next/link';
import { getAllAuthors, authorPathByName } from '@/lib/users';
import { getPostsByAuthorSlug } from '@/lib/posts';
import usePageMetadata from '@/hooks/use-page-metadata';

import Layout from '@/components/Layout';
import Header from '@/components/Header';
import Section from '@/components/Section';
import Container from '@/components/Container';
import SectionTitle from '@/components/SectionTitle';
import Image from 'next/legacy/image';
import styles from '@/styles/pages/Authors.module.scss';

export default function AuthorIndex({ authors }) {
  const { metadata } = usePageMetadata({
    metadata: {
      title: 'Authors',
      description: 'Browse all our authors and their articles',
    },
  });

  return (
    <Layout metadata={metadata}>
      <Header>
        <Container>
          <h1>Authors</h1>
        </Container>
      </Header>

      <Section>
        <Container>
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
                      {avatar && (
                        <Image
                          src={avatar.url}
                          alt={`Avatar for ${name}`}
                          width={80}
                          height={80}
                          layout="fixed"
                          className={styles.avatar}
                        />
                      )}
                    </div>
                    <h2 className={styles.authorName}>{name}</h2>
                  </Link>
                  {description && (
                    <p className={styles.authorDescription}>{description}</p>
                  )}
                  <p className={styles.authorPostCount}>
                    {postCount} {postCount === 1 ? 'article' : 'articles'}
                  </p>
                </div>
              );
            })}
          </div>
        </Container>
      </Section>
    </Layout>
  );
}

export async function getStaticProps() {
  const { authors } = await getAllAuthors();

  // Get post count for each author
  const authorsWithPostCount = await Promise.all(
    authors.map(async (author) => {
      const { posts } = await getPostsByAuthorSlug({
        slug: author.slug,
        queryIncludes: 'index',
      });

      return {
        ...author,
        postCount: posts.length,
      };
    })
  );

  // Sort authors by post count (desc)
  const sortedAuthors = authorsWithPostCount.sort(
    (a, b) => b.postCount - a.postCount
  );

  return {
    props: {
      authors: sortedAuthors,
    },
  };
}
