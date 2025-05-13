import ClassName from '@/models/classname';

import styles from './Section.module.scss';

const Section = ({ 
  children, 
  className, 
  withPadding, 
  smallPadding, 
  contentSection, 
  heroSection,
  pageSection,
  ...rest 
}) => {
  const sectionClassName = new ClassName(styles.section);

  if (className) {
    sectionClassName.add(className);
  }

  // Add the appropriate padding class based on props
  if (withPadding) {
    sectionClassName.add(styles.withPadding);
  } else if (smallPadding) {
    sectionClassName.add(styles.smallPadding);
  } else if (contentSection) {
    sectionClassName.add(styles.contentSection);
  } else if (heroSection) {
    sectionClassName.add(styles.heroSection);
  } else if (pageSection) {
    sectionClassName.add(styles.pageSection);
  }

  return <section className={sectionClassName.toString()} {...rest}>{children}</section>;
};

export default Section;
