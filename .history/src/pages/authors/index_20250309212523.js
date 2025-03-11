import Link from 'next/link';
import { getAllAuthors } from '@/lib/users';
import { authorPathByName } from '@/lib/users';
import usePageMetadata from '@/hooks/use-page-metadata';

import Layout from '@/components/Layout';
import Container from '@/components/Container';
import Section from '@/components/Section';
import Meta from '@/components/Meta';

export default function AuthorIndex({ authors }) {
  const { metadata } = usePageMetadata({
    metadata: {
      title: 'Authors',
      description: 'Browse all authors and their content',
    },
  });

  return (
    <Layout>
      <Meta
        title={metadata.title}
        description={metadata.description}
      />

      <Section>
        <Container>
          <h1 className="text-3xl font-bold mb-8">Authors</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {authors.map((author) => (
              <Link 
                key={author.id} 
                href={authorPathByName(author.name)}
              >
                <a className="block bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                  <div className="flex items-center mb-4">
                    {author.avatar && (
                      <img 
                        src={author.avatar.url}
                        alt={author.name}
                        className="w-16 h-16 rounded-full mr-4 object-cover"
                      />
                    )}
                    <h2 className="text-xl font-semibold">{author.name}</h2>
                  </div>
                  
                  {author.description && (
                    <p className="text-gray-600 mb-4 line-clamp-3">{author.description}</p>
                  )}
                  
                  <div className="text-blue-600 font-medium">
                    {author.posts} article{author.posts !== 1 ? 's' : ''}
                  </div>
                </a>
              </Link>
            ))}
          </div>
        </Container>
      </Section>
    </Layout>
  );
}

export async function getStaticProps() {
  const authors = await getAllAuthors();
  
  // Count posts for each author
  const authorsWithCounts = authors.map((author) => {
    return {
      ...author,
      posts: author.posts?.length || 0,
    };
  });
  
  // Sort by post count (most active first)
  authorsWithCounts.sort((a, b) => b.posts - a.posts);

  return {
    props: {
      authors: authorsWithCounts,
    },
  };
} 