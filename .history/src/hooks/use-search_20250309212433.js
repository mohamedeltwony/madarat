import { useState, createContext, useContext, useEffect } from 'react';
import Fuse from 'fuse.js';

import { getSearchData } from '@/lib/search';

const SEARCH_KEYS = ['slug', 'title', 'excerpt', 'content'];

export const SEARCH_STATE_LOADING = 'LOADING';
export const SEARCH_STATE_READY = 'READY';
export const SEARCH_STATE_ERROR = 'ERROR';
export const SEARCH_STATE_LOADED = 'LOADED';

export const SearchContext = createContext();

export const SearchProvider = (props) => {
  const search = useSearchState();
  return <SearchContext.Provider value={search} {...props} />;
};

export function useSearchState() {
  const [state, setState] = useState(SEARCH_STATE_READY);
  const [data, setData] = useState(null);

  let client;

  if (data) {
    client = new Fuse(data.posts, {
      keys: SEARCH_KEYS,
      isCaseSensitive: false,
      includeScore: true,
      threshold: 0.4,
    });
  }

  // On load, we want to immediately pull in the search index, which we're
  // storing clientside and gets built at compile time

  useEffect(() => {
    (async function getData() {
      setState(SEARCH_STATE_LOADING);

      let searchData;

      try {
        searchData = await getSearchData();
      } catch (e) {
        setState(SEARCH_STATE_ERROR);
        return;
      }

      setData(searchData);
      setState(SEARCH_STATE_LOADED);
    })();
  }, []);

  return {
    state,
    data,
    client,
  };
}

export default function useSearch({ 
  defaultQuery = null, 
  maxResults,
  filters = {} 
} = {}) {
  const search = useContext(SearchContext);
  const { client, data } = search;

  const [query, setQuery] = useState(defaultQuery);
  const [activeFilters, setActiveFilters] = useState(filters);

  let results = [];

  // If we have a client and data, process search and filters
  if (client && data) {
    // First, get all the posts or search results
    let postsToFilter = data.posts;
    
    if (query) {
      postsToFilter = client.search(query).map(({ item }) => item);
    }
    
    // Then apply filters if any
    if (activeFilters && Object.keys(activeFilters).length > 0) {
      // Filter by date (year, month)
      if (activeFilters.year) {
        postsToFilter = postsToFilter.filter(post => {
          const postDate = new Date(post.date);
          return postDate.getFullYear() === parseInt(activeFilters.year);
        });
        
        if (activeFilters.month) {
          postsToFilter = postsToFilter.filter(post => {
            const postDate = new Date(post.date);
            return postDate.getMonth() + 1 === parseInt(activeFilters.month);
          });
        }
      }
      
      // Filter by category
      if (activeFilters.category) {
        postsToFilter = postsToFilter.filter(post => {
          if (!post.categories) return false;
          return post.categories.some(category => 
            category.slug === activeFilters.category || 
            category.id === activeFilters.category
          );
        });
      }
      
      // Filter by author
      if (activeFilters.author) {
        postsToFilter = postsToFilter.filter(post => {
          if (!post.author) return false;
          return post.author.slug === activeFilters.author || 
                 post.author.id === activeFilters.author;
        });
      }
      
      // Filter by tag (if available in your data structure)
      if (activeFilters.tag && post.tags) {
        postsToFilter = postsToFilter.filter(post => {
          if (!post.tags) return false;
          return post.tags.some(tag => 
            tag.slug === activeFilters.tag || 
            tag.id === activeFilters.tag
          );
        });
      }
    }
    
    results = postsToFilter;
  }

  if (maxResults && results.length > maxResults) {
    results = results.slice(0, maxResults);
  }

  // If the defaultQuery argument changes, the hook should reflect
  // that update and set that as the new state
  useEffect(() => setQuery(defaultQuery), [defaultQuery]);
  
  // Same for filters
  useEffect(() => setActiveFilters(filters), [filters]);

  /**
   * handleSearch
   */
  function handleSearch({ query, filters = {} }) {
    setQuery(query);
    
    // If filters are provided, update them
    if (Object.keys(filters).length > 0) {
      setActiveFilters(currentFilters => ({
        ...currentFilters,
        ...filters
      }));
    }
  }

  /**
   * handleClearSearch
   */
  function handleClearSearch() {
    setQuery(null);
    setActiveFilters({});
  }
  
  /**
   * handleFilterChange
   */
  function handleFilterChange(filters) {
    setActiveFilters(filters);
  }

  return {
    ...search,
    query,
    filters: activeFilters,
    results,
    search: handleSearch,
    clearSearch: handleClearSearch,
    setFilters: handleFilterChange
  };
}
