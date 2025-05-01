import Link from 'next/link';

import { categoryPathBySlug } from '@/lib/categories';
import { authorPathByName } from '@/lib/users';
import ClassName from '@/models/classname';

import { FaMapPin } from 'react-icons/fa';
import styles from './Metadata.module.scss';

const DEFAULT_METADATA_OPTIONS = {
  compactCategories: true,
};

const formatDate = (date) => {
  const dateFormatter = new Intl.DateTimeFormat('ar-EG', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    calendar: 'gregory',
    numberingSystem: 'arab',
  });

  return date ? dateFormatter.format(new Date(date)).replace('،', '') : '';
};

const Metadata = ({
  className,
  author,
  date,
  categories,
  options = DEFAULT_METADATA_OPTIONS,
  isSticky = false,
}) => {
  const metadataClassName = new ClassName(styles.metadata);

  metadataClassName.addIf(className, className);

  const { compactCategories } = options;

  return (
    <ul className={metadataClassName.toString()}>
      {author && (
        <li className={styles.metadataAuthor}>
          <address>
            {author.avatar && (
              <img
                width={author.avatar.width}
                height={author.avatar.height}
                src={author.avatar.url}
                alt="Author Avatar"
              />
            )}
            By{' '}
            <Link href={authorPathByName(author.name)} rel="author">
              {author.name}
            </Link>
          </address>
        </li>
      )}
      {date && (
        <li>
          <time datetime={date}>
            {formatDate(date)}
          </time>
        </li>
      )}
      {Array.isArray(categories) && categories[0] && (
        <li className={styles.metadataCategories}>
          {compactCategories && (
            <p title={categories.map(({ name }) => name).join(', ')}>
              <Link href={categoryPathBySlug(categories[0].slug)}>
                {categories[0].name}
              </Link>
              {categories.length > 1 && ' and more'}
            </p>
          )}
          {!compactCategories && (
            <ul>
              {categories.map((category) => {
                return (
                  <li key={category.slug}>
                    <Link href={categoryPathBySlug(category.slug)}>
                      {category.name}
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </li>
      )}
      {isSticky && (
        <li className={styles.metadataSticky}>
          <FaMapPin aria-label="Sticky Post" />
        </li>
      )}
    </ul>
  );
};

export default Metadata;
