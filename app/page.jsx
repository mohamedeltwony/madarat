import React from "react";
import Firstpage from "./(homes)/home-1/page";
import dynamic from "next/dynamic";
import TourSlderOne from "@/components/homes/tours/TourSlderOne";
import DestinationSlider from "@/components/homes/destinations/DestinationSlider";

export const metadata = {
  title: "Home-1 || ViaTour - Travel & Tour React NextJS Template",
  description: "ViaTour - Travel & Tour React NextJS Template",
};

export default function page() {
  return (
    <>
      <Firstpage />
      <DestinationSlider />
      <TourSlderOne />
    </>
  );
}
