import ScrollToTop from "@/components/common/ScrollToTop";
import dynamic from "next/dynamic";
import "../public/css/style.css";
import "../public/css/destination-slider.css";

import { DM_Sans } from "next/font/google";

// Dynamic imports for performance
const ScrollTopBehaviour = dynamic(() => import("@/components/common/ScrollTopBehavier"), {
  ssr: false,
});

const Wrapper = dynamic(() => import("@/components/layout/Wrapper"), {
  ssr: false,
});

const dmsans = DM_Sans({
  weight: ["400", "500", "700"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  display: "swap",
  preload: true,
  fallback: ['system-ui', 'arial'],
});

// Optimize Bootstrap loading
if (typeof window !== "undefined") {
  import("bootstrap/dist/js/bootstrap.bundle.min.js");
}

export const metadata = {
  title: "ViaTour - Travel & Tour NextJS Template",
  description: "Professional travel and tour booking platform built with Next.js",
  keywords: "travel, tour, booking, vacation, destinations",
  authors: [{ name: "ViaTour Team" }],
  creator: "ViaTour",
  publisher: "ViaTour",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://viatour.com',
    siteName: 'ViaTour',
    title: 'ViaTour - Travel & Tour NextJS Template',
    description: 'Professional travel and tour booking platform',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ViaTour - Travel & Tour NextJS Template',
    description: 'Professional travel and tour booking platform',
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#000000' },
  ],
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* DNS Prefetch for external domains */}
        <link rel="dns-prefetch" href="//madaratalkon.com" />
        <link rel="dns-prefetch" href="//eydmsroo88e.exactdn.com" />
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="dns-prefetch" href="//fonts.gstatic.com" />
        
        {/* Preload critical resources */}
        <link rel="preload" href="/css/style.css" as="style" />
        <link rel="preload" href="/css/main.css" as="style" />
        
        {/* Favicon and icons */}
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        
        {/* Performance hints */}
        <meta name="robots" content="index, follow" />
        <meta name="googlebot" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
      </head>
      <body className={dmsans.className}>
        <Wrapper>{children}</Wrapper>
        <ScrollToTop />
        <ScrollTopBehaviour />
      </body>
    </html>
  );
}
