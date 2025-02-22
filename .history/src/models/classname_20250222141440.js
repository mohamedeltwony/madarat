/**
 * Utility class for handling className concatenation
 */
export default class ClassName {
  constructor(classes) {
    this.classes = classes;
  }

  /**
   * Add additional classes
   * @param {string|array} classes Additional classes to add
   * @returns {ClassName} Returns instance for chaining
   */
  add(classes) {
    if (!classes) return this;

    if (typeof classes === 'string') {
      this.classes.push(classes);
    } else if (Array.isArray(classes)) {
      this.classes = [...this.classes, ...classes];
    }

    return this;
  }

  /**
   * Remove classes
   * @param {string|array} classes Classes to remove
   * @returns {ClassName} Returns instance for chaining
   */
  remove(classes) {
    if (!classes) return this;

    const removeClasses = Array.isArray(classes) ? classes : [classes];
    this.classes = this.classes.filter((className) => !removeClasses.includes(className));

    return this;
  }

  /**
   * Convert to string
   * @returns {string} Space-separated class string
   */
  toString() {
    return this.classes.filter(Boolean).join(' ');
  }

  /**
   * Create a new ClassName instance
   * @param {string|array} classes Initial classes
   * @returns {ClassName} New ClassName instance
   */
  static create(classes) {
    const initialClasses = Array.isArray(classes) ? classes : classes ? [classes] : [];
    return new ClassName(initialClasses);
  }
}
