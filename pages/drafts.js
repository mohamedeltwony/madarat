import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

import { getDraftPosts } from '@/lib/posts';
import usePageMetadata from '@/hooks/use-page-metadata';

import Layout from '@/components/Layout';
import Container from '@/components/Container';
import Section from '@/components/Section';
import PostCard from '@/components/PostCard';
import Meta from '@/components/Meta';

export default function Drafts({ posts }) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');

  const { metadata } = usePageMetadata({
    metadata: {
      title: 'Draft Posts',
      description: 'Preview unpublished content',
    },
  });

  // Simple password authentication for drafts
  // In a real app, you'd want to use a proper authentication system
  useEffect(() => {
    const checkAuth = () => {
      const savedAuth = localStorage.getItem('draft_auth');
      if (savedAuth === 'true') {
        setIsAuthenticated(true);
      }
    };

    checkAuth();
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    // This is a simple example - replace with your own authentication logic
    // NOTE: In production, use a proper auth system, not this placeholder
    if (password === 'draftaccess') {
      localStorage.setItem('draft_auth', 'true');
      setIsAuthenticated(true);
    } else {
      alert('Invalid password');
    }
  };

  return (
    <Layout>
      <Meta
        title={metadata.title}
        description={metadata.description}
        url={`${process.env.NEXT_PUBLIC_SITE_URL}/drafts/`}
      />

      <Section>
        <Container>
          <h1 className="text-3xl font-bold mb-8">Draft Posts</h1>

          {!isAuthenticated ? (
            <div className="max-w-md mx-auto p-6 bg-gray-100 rounded-lg">
              <h2 className="text-xl font-semibold mb-4">
                Authentication Required
              </h2>
              <p className="mb-4">
                Please enter the password to view draft posts.
              </p>
              <form onSubmit={handleLogin}>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  className="w-full p-2 mb-4 border border-gray-300 rounded"
                />
                <button
                  type="submit"
                  className="w-full py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Access Drafts
                </button>
              </form>
            </div>
          ) : posts && posts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {posts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          ) : (
            <p>No draft posts available.</p>
          )}
        </Container>
      </Section>
    </Layout>
  );
}

export async function getServerSideProps() {
  // Use server-side rendering for drafts to ensure fresh content
  const { posts } = await getDraftPosts({
    queryIncludes: 'archive',
  });

  return {
    props: {
      posts,
    },
  };
}
