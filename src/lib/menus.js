import { getTopLevelPages } from '@/lib/pages';

export const MENU_LOCATION_NAVIGATION_DEFAULT = 'DEFAULT_NAVIGATION';

/**
 * mapMenuData
 */

export function mapMenuData(menu = {}) {
  if (!menu) {
    return undefined;
  }

  const { node } = menu;
  const data = { ...menu };

  if (node) {
    data.menuItems = data.menuItems || node.menuItems;
  }

  return data;
}

/**
 * mapPagesToMenuItems
 */

export function mapPagesToMenuItems(pages) {
  return pages.map(({ id, uri, title }) => {
    return {
      label: title,
      path: uri,
      id,
    };
  });
}

/**
 * createMenuFromPages
 */

export function createMenuFromPages({ locations, pages }) {
  return {
    menuItems: mapPagesToMenuItems(pages),
    locations,
  };
}

/**
 * parseHierarchicalMenu
 */
export const parseHierarchicalMenu = (
  data = [],
  { idKey = 'id', parentKey = 'parentId', childrenKey = 'children' } = {}
) => {
  const tree = [];
  const childrenOf = {};

  data.forEach((item) => {
    const newItem = { ...item };
    const { [idKey]: id, [parentKey]: parentId = 0 } = newItem;
    childrenOf[id] = childrenOf[id] || [];
    newItem[childrenKey] = childrenOf[id];
    parentId
      ? (childrenOf[parentId] = childrenOf[parentId] || []).push(newItem)
      : tree.push(newItem);
  });
  return tree;
};

/**
 * mapMenuLocation
 */

export function mapMenuLocation(menu) {
  return menu.locations?.includes('PRIMARY') || menu.locations?.includes('MAIN_MENU')
    ? 'PRIMARY_MENU'
    : menu.locations?.includes('FOOTER') || menu.locations?.includes('FOOTER_MENU')
    ? 'FOOTER_MENU'
    : undefined;
}

/**
 * findMenuByLocation
 */

export function findMenuByLocation(menus, location) {
  if (!Array.isArray(menus) || !menus.length) {
    return undefined;
  }
  
  return menus.find((menu) => {
    return menu.locations?.includes(location) ||
      // Map different location format strings to support various plugins
      (location === 'PRIMARY_MENU' && (menu.locations?.includes('PRIMARY') || menu.locations?.includes('MAIN_MENU'))) ||
      (location === 'FOOTER_MENU' && (menu.locations?.includes('FOOTER') || menu.locations?.includes('FOOTER_MENU')));
  });
}
