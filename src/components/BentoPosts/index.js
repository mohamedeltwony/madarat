import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import styles from './BentoPosts.module.scss';

const BentoPosts = ({ posts = [] }) => {
  return (
    <div className={styles.container}>
      {posts.map((post) => (
        <Link href={`/posts/${post.slug}`} key={post.id} className={styles.post}>
          <div className={styles.imageWrapper}>
            <Image src={post.image} alt={post.title} className={styles.image} />
          </div>
          <div className={styles.content}>
            <h3 className={styles.title}>{post.title}</h3>
            <p className={styles.excerpt}>{post.excerpt}</p>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default BentoPosts;
