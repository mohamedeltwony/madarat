import Head from 'next/head';

/**
 * JsonLd component to replace the react-helmet based JSON-LD implementation
 * This provides a cleaner API for JSON-LD structured data
 */
const JsonLd = ({ data }) => {
  return (
    <Head>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
      />
    </Head>
  );
};

export default JsonLd;
