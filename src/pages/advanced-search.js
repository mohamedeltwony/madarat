import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import useSearch from '@/hooks/use-search';
import usePageMetadata from '@/hooks/use-page-metadata';
import { getCategories } from '@/lib/categories';
import { getYearArchives } from '@/lib/posts';
import { getMonthName } from '@/lib/datetime';
import { getSiteMetadata } from '@/lib/site';
import { getAllMenus } from '@/lib/menus';

import Layout from '@/components/Layout';
import Container from '@/components/Container';
import Section from '@/components/Section';
import PostCard from '@/components/PostCard';
import Meta from '@/components/Meta';

export default function AdvancedSearch({ categories, years, metadata: siteMetadata, menus }) {
  const router = useRouter();
  const { q, category, year, month, author } = router.query;

  const [searchQuery, setSearchQuery] = useState(q || '');
  const [searchFilters, setSearchFilters] = useState({
    category: category || '',
    year: year || '',
    month: month || '',
    author: author || '',
  });

  // When URL parameters change, update our state
  useEffect(() => {
    setSearchQuery(q || '');
    setSearchFilters({
      category: category || '',
      year: year || '',
      month: month || '',
      author: author || '',
    });
  }, [q, category, year, month, author]);

  // Use our enhanced search hook
  const { results, search, clearSearch, state } = useSearch({
    defaultQuery: searchQuery,
    filters: searchFilters,
  });

  const { metadata } = usePageMetadata({
    metadata: {
      title: 'Advanced Search',
      description: 'Search posts with advanced filtering options',
    },
  });

  // Handle search form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    // Update URL with search parameters for shareable links
    const params = new URLSearchParams();
    if (searchQuery) params.append('q', searchQuery);
    if (searchFilters.category)
      params.append('category', searchFilters.category);
    if (searchFilters.year) params.append('year', searchFilters.year);
    if (searchFilters.month) params.append('month', searchFilters.month);
    if (searchFilters.author) params.append('author', searchFilters.author);

    const queryString = params.toString();
    router.push(`/advanced-search${queryString ? `?${queryString}` : ''}`);

    // Execute search
    search({
      query: searchQuery,
      filters: searchFilters,
    });
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'query') {
      setSearchQuery(value);
    } else {
      setSearchFilters({
        ...searchFilters,
        [name]: value,
      });
    }
  };

  // Clear all filters and search
  const handleClearAll = () => {
    setSearchQuery('');
    setSearchFilters({
      category: '',
      year: '',
      month: '',
      author: '',
    });
    clearSearch();
    router.push('/advanced-search');
  };

  return (
    <Layout metadata={siteMetadata} menus={menus}>
      <Meta title={metadata.title} description={metadata.description} />

      <Section>
        <Container>
          <h1 className="text-3xl font-bold mb-8">Advanced Search</h1>

          <div className="bg-gray-100 p-6 rounded-lg mb-8">
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Search Query */}
                <div className="col-span-1 md:col-span-3">
                  <label
                    htmlFor="query"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Search Query
                  </label>
                  <input
                    id="query"
                    name="query"
                    type="text"
                    value={searchQuery}
                    onChange={handleInputChange}
                    placeholder="Enter search terms..."
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {/* Category Filter */}
                <div className="col-span-1">
                  <label
                    htmlFor="category"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Category
                  </label>
                  <select
                    id="category"
                    name="category"
                    value={searchFilters.category}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">All Categories</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.slug}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Year Filter */}
                <div className="col-span-1">
                  <label
                    htmlFor="year"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Year
                  </label>
                  <select
                    id="year"
                    name="year"
                    value={searchFilters.year}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">All Years</option>
                    {years.map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Month Filter */}
                <div className="col-span-1">
                  <label
                    htmlFor="month"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Month
                  </label>
                  <select
                    id="month"
                    name="month"
                    value={searchFilters.month}
                    onChange={handleInputChange}
                    disabled={!searchFilters.year}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">All Months</option>
                    {Array.from({ length: 12 }, (_, i) => i + 1).map(
                      (month) => (
                        <option key={month} value={month}>
                          {getMonthName(month)}
                        </option>
                      )
                    )}
                  </select>
                </div>
              </div>

              <div className="mt-6 flex justify-between">
                <button
                  type="button"
                  onClick={handleClearAll}
                  className="py-2 px-4 bg-gray-500 text-white rounded-md hover:bg-gray-600"
                >
                  Clear All
                </button>
                <button
                  type="submit"
                  className="py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Search
                </button>
              </div>
            </form>
          </div>

          <div className="search-results">
            {state === 'LOADING' && <p>Loading...</p>}

            {state === 'LOADED' && (
              <>
                <h2 className="text-xl font-semibold mb-4">
                  {results.length === 0
                    ? 'No results found'
                    : `Found ${results.length} result${results.length === 1 ? '' : 's'}`}
                </h2>

                {results.length > 0 && (
                  <div className="grid grid-cols-1 gap-8">
                    {results.map((post) => (
                      <PostCard key={post.id} post={post} />
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </Container>
      </Section>
    </Layout>
  );
}

export async function getStaticProps() {
  // Fetch layout data
  const { metadata } = await getSiteMetadata();
  const { menus } = await getAllMenus();
  
  // Fetch page-specific data
  const { categories } = await getCategories({
    count: 100, // Get all available categories
  });

  const { years } = await getYearArchives();
  
  // Sanitize data to remove undefined values
  const sanitizedMetadata = JSON.parse(JSON.stringify(metadata || {}));
  const sanitizedMenus = JSON.parse(JSON.stringify(menus || {}));
  const sanitizedCategories = JSON.parse(JSON.stringify(categories || []));
  const sanitizedYears = JSON.parse(JSON.stringify(years || []));

  return {
    props: {
      categories: sanitizedCategories,
      years: sanitizedYears,
      metadata: sanitizedMetadata,
      menus: sanitizedMenus
    },
    // Add ISR with a reasonable revalidation period
    revalidate: 600 // Revalidate every 10 minutes
  };
}
