import { getCategoriesREST } from '@/lib/rest-api';

/**
 * categoryPathBySlug
 */

export function categoryPathBySlug(slug) {
  return `/categories/${slug}`;
}

/**
 * getAllCategories
 */

export async function getAllCategories() {
  try {
    const response = await fetch(
      'https://madaratalkon.com/wp-json/wp/v2/categories',
      {
        headers: {
          'Content-Type': 'application/json',
          'User-Agent':
            'Mozilla/5.0 (compatible; MadaratBot/1.0; +https://madaratalkon.com)',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch categories: ${response.status}`);
    }

    const data = await response.json();

    const categories = data.map((category) => ({
      id: category.id,
      databaseId: category.id,
      name: category.name || '',
      slug: category.slug || '',
      count: category.count || 0,
      description: category.description || '',
      parent: category.parent || null,
    }));

    return { categories };
  } catch (error) {
    console.error('[getAllCategories] Error:', error);
    return { categories: [] };
  }
}

/**
 * getCategoryBySlug
 */

export async function getCategoryBySlug(slug) {
  try {
    const response = await fetch(
      `https://madaratalkon.com/wp-json/wp/v2/categories?slug=${slug}`,
      {
        headers: {
          'Content-Type': 'application/json',
          'User-Agent':
            'Mozilla/5.0 (compatible; MadaratBot/1.0; +https://madaratalkon.com)',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch category: ${response.status}`);
    }

    const data = await response.json();

    if (data.length === 0) {
      return { category: undefined };
    }

    const category = {
      id: data[0].id,
      databaseId: data[0].id,
      name: data[0].name || '',
      slug: data[0].slug || '',
      count: data[0].count || 0,
      description: data[0].description || '',
      seo: {
        title: data[0].name,
        metaDesc: data[0].description || `Browse all posts in ${data[0].name}`,
      },
    };

    return { category };
  } catch (error) {
    console.error(
      `[getCategoryBySlug] Error fetching category with slug ${slug}:`,
      error
    );
    return { category: undefined };
  }
}

/**
 * getCategories
 */

export async function getCategories({ count } = {}) {
  const { categories } = await getAllCategories();
  return {
    categories: categories.slice(0, count),
  };
}

/**
 * mapCategoryData
 */

export function mapCategoryData(category = {}) {
  const data = { ...category };
  return data;
}
