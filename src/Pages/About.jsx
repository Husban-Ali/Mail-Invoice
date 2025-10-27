import React from "react";
import AboutHeroSection from "../Component/About/AboutHeroSection";
import MissionSection from "../Component/About/MissionSection";
import TeamSection from "../Component/About/TeamSection";

export default function About() {
  return (
    <div className="font-sans bg-white text-black">
      <AboutHeroSection />
      <MissionSection />
      <TeamSection />
    </div>
  );
}
