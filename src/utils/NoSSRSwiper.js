import dynamic from "next/dynamic";

// Dynamically load only on the client to keep Swiper (~110 kB) out of the SSR bundle
export const Swiper = dynamic(() => import("swiper/react").then((m) => m.Swiper), {
  ssr: false,
});

export const SwiperSlide = dynamic(
  () => import("swiper/react").then((m) => m.SwiperSlide),
  {
    ssr: false,
  },
); 