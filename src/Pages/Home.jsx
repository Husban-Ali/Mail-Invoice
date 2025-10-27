import React from "react";
import HeroSection from "../Component/Home/HeroSection";
import ClientLogos from "../Component/Home/ClientLogos";
import VideoSection from "../Component/Home/VideoSection";
import DashboardSection from "../Component/Home/DashboardSection";
import ResourcesSection from "../Component/Home/ResourcesSection";
import PricingSection from "../Component/Home/PricingSection";

export default function Home() {
  return (
    <div className="font-sans bg-white text-black">
      <HeroSection />
      {/* <ClientLogos /> */}
      {/* <VideoSection /> */}
      <DashboardSection/>
      <ResourcesSection/>
      <PricingSection/>
      
    </div>
  );
}
