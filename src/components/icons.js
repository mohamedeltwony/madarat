import dynamic from 'next/dynamic';

// Dynamically import react-icons to reduce initial bundle size
// Only load icon sets that are actually used in the application

// Font Awesome icons (Fa)
export const FaChevronLeft = dynamic(() =>
  import('react-icons/fa').then((mod) => mod.FaChevronLeft)
);
export const FaChevronRight = dynamic(() =>
  import('react-icons/fa').then((mod) => mod.FaChevronRight)
);
export const FaStar = dynamic(() =>
  import('react-icons/fa').then((mod) => mod.FaStar)
);
export const FaStarHalfAlt = dynamic(() =>
  import('react-icons/fa').then((mod) => mod.FaStarHalfAlt)
);
export const FaRegStar = dynamic(() =>
  import('react-icons/fa').then((mod) => mod.FaRegStar)
);

// Feather icons (Fi)
export const FiChevronRight = dynamic(() =>
  import('react-icons/fi').then((mod) => mod.FiChevronRight)
);

// Add other icons as needed
