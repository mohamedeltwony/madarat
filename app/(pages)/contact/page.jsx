import FooterOne from "@/components/layout/footers/FooterOne";
import Header1 from "@/components/layout/header/Header1";
import ContactForm from "@/components/pages/contact/ContactForm";
import Locations from "@/components/pages/contact/Locations";
import dynamic from "next/dynamic";
import React from "react";

const Map = dynamic(() => import("@/components/pages/contact/Map"), {
  ssr: false,
  loading: () => <div style={{height:400}} />,
});

export const metadata = {
  title: "Contact || ViaTour - Travel & Tour React NextJS Template",
  description: "ViaTour - Travel & Tour React NextJS Template",
};

export default function page() {
  return (
    <>
      <main>
        <Header1 />
        <Map />
        <Locations />
        <ContactForm />

        <FooterOne />
      </main>
    </>
  );
}
