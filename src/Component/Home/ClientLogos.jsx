import React from "react";
import Marquee from "react-fast-marquee";

import acme from "../../assets/acme.png";
import quantum from "../../assets/quantum.png";
import echo from "../../assets/echo.png";
import celestial from "../../assets/celestia.png";
import pulse from "../../assets/pulse.png";
import apex from "../../assets/apex.png";

export default function ClientLogos() {
  const logos = [
    { name: "Acme Corp", src: acme },
    { name: "Quantum", src: quantum },
    { name: "Echo Valley", src: echo },
    { name: "Celestial", src: celestial },
    { name: "Pulse", src: pulse },
    { name: "Apex", src: apex },
  ];

  return (
    <section className="w-full py-10 bg-white">
      {/* <h2 className="text-2xl font-bold text-center mb-6">Our Clients</h2> */}
      <Marquee className="flex items-center">
        {[...logos, ...logos].map((logo, index) => (
          <div key={index} className="mx-8 flex flex-col items-center">
            <img src={logo.src} alt={logo.name} className="h-12 w-auto mb-2" />
            {/* <span className="text-gray-600 font-medium">{logo.name}</span> */}
          </div>
        ))}
      </Marquee>
    </section>
  );
}
