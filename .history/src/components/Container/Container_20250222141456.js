import ClassName from 'models/classname';
import styles from './Container.module.scss';

const Container = ({ children, className }) => {
  const containerClassName = ClassName.create(styles.container);

  if (className) {
    containerClassName.add(className);
  }

  return <div className={containerClassName.toString()}>{children}</div>;
};

export default Container;
