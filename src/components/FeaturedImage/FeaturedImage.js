import ClassName from '@/models/classname';
import Image from '@/components/Image';

import styles from './FeaturedImage.module.scss';

const FeaturedImage = ({
  className,
  alt,
  priority = false,
  aboveTheFold = false,
  ...rest
}) => {
  const featuredImageClassName = new ClassName(styles.featuredImage);

  featuredImageClassName.addIf(className, className);

  // Set priority to true for images that are above the fold
  // This will make them load immediately without lazy loading
  const shouldPrioritize = priority || aboveTheFold;

  return (
    <Image
      className={featuredImageClassName}
      alt={alt}
      priority={shouldPrioritize}
      {...rest}
    />
  );
};

export default FeaturedImage;
