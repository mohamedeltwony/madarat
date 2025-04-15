import Head from 'next/head';

/**
 * Meta component to replace react-helmet
 * This provides a similar API to what was used with react-helmet
 */
const Meta = ({
  title,
  description,
  link = [],
  meta = [],
  script = [],
  htmlAttributes = {},
  bodyAttributes = {},
}) => {
  // Apply HTML attributes
  if (typeof window !== 'undefined' && htmlAttributes) {
    Object.keys(htmlAttributes).forEach((key) => {
      document.documentElement.setAttribute(key, htmlAttributes[key]);
    });
  }

  // Apply body attributes
  if (typeof window !== 'undefined' && bodyAttributes) {
    Object.keys(bodyAttributes).forEach((key) => {
      document.body.setAttribute(key, bodyAttributes[key]);
    });
  }

  return (
    <Head>
      {title && <title key="title">{title}</title>}
      {description && (
        <meta name="description" content={description} key="description" />
      )}

      {/* Render all meta tags */}
      {meta.map((metaItem, i) => {
        const key = `meta-${i}`;
        // If the meta tag uses the 'property' attribute (e.g., for Open Graph)
        if (metaItem.property) {
          return (
            <meta
              property={metaItem.property}
              content={metaItem.content}
              key={key}
            />
          );
        }
        // If the meta tag uses the regular 'name' attribute
        return (
          <meta name={metaItem.name} content={metaItem.content} key={key} />
        );
      })}

      {/* Render all link tags */}
      {link.map((linkItem, i) => {
        const key = `link-${i}`;
        return <link {...linkItem} key={key} />;
      })}

      {/* Render all script tags */}
      {script.map((scriptItem, i) => {
        const key = `script-${i}`;
        // For inline scripts with content (like JSON-LD)
        if (scriptItem.innerHTML) {
          return (
            <script
              type={scriptItem.type}
              key={key}
              dangerouslySetInnerHTML={{ __html: scriptItem.innerHTML }}
            />
          );
        }
        // For external scripts or other script tags
        return <script {...scriptItem} key={key} />;
      })}
    </Head>
  );
};

export default Meta;
