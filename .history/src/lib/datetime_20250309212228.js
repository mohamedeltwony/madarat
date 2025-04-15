import { format } from 'date-fns';

/**
 * formatDate
 */

export function formatDate(date, pattern = 'PPP') {
  return format(new Date(date), pattern);
}

/**
 * sortObjectsByDate
 */

export function sortObjectsByDate(array, { key = 'date' } = {}) {
  return array.sort((a, b) => new Date(b[key]) - new Date(a[key]));
}

/**
 * getMonthName
 */
export function getMonthName(monthNumber) {
  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
  return months[parseInt(monthNumber) - 1] || '';
}

/**
 * getArchiveMonthLink
 */
export function getArchiveMonthLink(year, month) {
  return `/archives/${year}/${month.toString().padStart(2, '0')}`;
}

/**
 * getArchiveDayLink
 */
export function getArchiveDayLink(year, month, day) {
  return `/archives/${year}/${month.toString().padStart(2, '0')}/${day.toString().padStart(2, '0')}`;
}

/**
 * getArchiveTitle
 */
export function getArchiveTitle({ year, month, day }) {
  if (year && month && day) {
    return `${getMonthName(month)} ${day}, ${year}`;
  } else if (year && month) {
    return `${getMonthName(month)} ${year}`;
  } else if (year) {
    return `${year}`;
  }
  return 'Archives';
}
