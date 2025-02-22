import ClassName from '@/models/classname';

import styles from './Section.module.scss';

const Section = ({ children, className }) => {
  const sectionClassName = new ClassName(styles.section);

  if (className) {
    sectionClassName.add(className);
  }

  return <section className={sectionClassName.toString()}>{children}</section>;
};

export default Section;
