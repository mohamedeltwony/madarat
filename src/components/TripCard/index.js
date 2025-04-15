import Link from 'next/link';
import Image from 'next/image';

export default function TripCard({ trip }) {
  const {
    title,
    slug,
    excerpt,
    featuredImage,
    tripSettings,
  } = trip;

  const imageUrl = featuredImage?.node?.sourceUrl || '/images/placeholder.jpg';
  const duration = tripSettings?.duration?.days || 0;
  const price = tripSettings?.price?.amount;
  const currency = tripSettings?.price?.currency || 'SAR';

  return (
    <Link href={`/trips/${slug}`} className="block">
      <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-105">
        <div className="relative h-48">
          <Image
            src={imageUrl}
            alt={title}
            fill
            className="object-cover"
            onError={(e) => {
              e.target.src = '/images/placeholder.jpg';
              console.error(`Error loading image for trip ${title}:`, e);
            }}
          />
        </div>
        <div className="p-4">
          <h2 className="text-xl font-semibold mb-2">{title}</h2>
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">{excerpt}</p>
          <div className="flex justify-between items-center">
            <span className="text-gray-500">
              {duration} {duration === 1 ? 'يوم' : 'أيام'}
            </span>
            <span className="text-primary font-semibold">
              {price ? `${price} ${currency}` : 'السعر غير متوفر'}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
} 