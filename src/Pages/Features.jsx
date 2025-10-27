import React from "react";
import FeatureHeroSection from "../Component/Features/FeatureHeroSection";
import CoreFeaturesSection from "../Component/Features/CoreFeaturesSection";
import HighlightSection from "../Component/Features/HighlightSection";

export default function Features() {
  return (
    <div className="font-sans bg-white text-black">
      <FeatureHeroSection />
      <CoreFeaturesSection />
      <HighlightSection />
    </div>
  );
}
