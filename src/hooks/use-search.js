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

export default function useSearch(initialPosts = [], initialFilters = {}) {
  const [posts, setPosts] = useState(initialPosts);
  const [filteredPosts, setFilteredPosts] = useState(initialPosts);
  const [activeFilters, setActiveFilters] = useState(initialFilters);

  useEffect(() => {
    setPosts(initialPosts);
    setFilteredPosts(initialPosts);
  }, [initialPosts]);

  useEffect(() => {
    let filtered = [...posts];

    if (activeFilters.search) {
      const searchQuery = activeFilters.search.toLowerCase();
      filtered = filtered.filter((post) => {
        const searchString = `${post.title} ${post.excerpt || ''} ${
          post.content || ''
        }`.toLowerCase();
        return searchString.includes(searchQuery);
      });
    }

    if (activeFilters.category) {
      filtered = filtered.filter((post) =>
        post.categories?.some(
          (category) =>
            category.slug === activeFilters.category ||
            category.id === activeFilters.category
        )
      );
    }

    if (activeFilters.author) {
      filtered = filtered.filter(
        (post) =>
          post.author?.slug === activeFilters.author ||
          post.author?.id === activeFilters.author
      );
    }

    if (activeFilters.tag) {
      filtered = filtered.filter((post) =>
        post.tags?.some(
          (tag) => tag.slug === activeFilters.tag || tag.id === activeFilters.tag
        )
      );
    }

    setFilteredPosts(filtered);
  }, [posts, activeFilters]);

  const updateFilter = (filterName, value) => {
    setActiveFilters((currentFilters) => ({
      ...currentFilters,
      [filterName]: value,
    }));
  };

  return {
    posts: filteredPosts,
    activeFilters,
    updateFilter,
  };
}
