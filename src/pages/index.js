export default function Home() {
  return (
    <div>
      <h1>مدارات الكون</h1>
      <p>موقع السفر والرحلات الأول في الوطن العربي</p>
    </div>
  );
}

export async function getStaticProps() {
  return {
    props: {},
    revalidate: 1800,
  };
} 