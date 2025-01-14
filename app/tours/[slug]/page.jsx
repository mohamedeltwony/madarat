import { getTourBySlug } from '@/utils/wordpress';
import Header1 from "@/components/layout/header/Header1";
import FooterOne from "@/components/layout/footers/FooterOne";
import SingleThree from "@/components/tourSingle/pages/SingleThree";
import PageHeader from "@/components/tourSingle/PageHeader";
import TourSlider from "@/components/tourSingle/TourSlider";

export async function generateMetadata({ params }) {
  const tour = await getTourBySlug(params.slug);
  return {
    title: tour?.title || 'Tour Details',
    description: tour?.excerpt || '',
  };
}

export default async function TourPage({ params }) {
  const tour = await getTourBySlug(params.slug);

  if (!tour) {
    return <div>Tour not found</div>;
  }

  // Convert any undefined values to their defaults to ensure serializability
  const serializedTour = {
    ...tour,
    rating: tour.rating || 0,
    price: tour.price || 0,
    gallery: Array.isArray(tour.gallery) ? tour.gallery : [],
    description: tour.description || '',
    highlights: tour.highlights || '',
    // Keep itinerary as a string if it's a string, otherwise convert to string
    itinerary: typeof tour.itinerary === 'string' ? tour.itinerary : JSON.stringify(tour.itinerary),
    inclusions: Array.isArray(tour.inclusions) ? tour.inclusions : [],
    exclusions: Array.isArray(tour.exclusions) ? tour.exclusions : [],
  };

  // Log the serialized tour data
  console.log('=== Serialized Tour Data ===');
  console.log('Tour:', serializedTour);
  console.log('Itinerary type:', typeof serializedTour.itinerary);
  console.log('Itinerary length:', serializedTour.itinerary?.length);

  return (
    <main>
      <Header1 />
      <PageHeader />
      <SingleThree tour={serializedTour} />
      <TourSlider />
      <FooterOne />
    </main>
  );
} 