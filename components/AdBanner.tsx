"use client";

import React from "react";

const AdBanner = () => {
  return (
    <div
      className="fixed top-16 left-0 w-full z-40 bg-main text-white py-2 overflow-hidden"
      style={{ backgroundColor: "#D30641" }}
    >
      <div className="animate-marquee whitespace-nowrap">
        <span className="text-lg font-semibold mx-4">
          Téléchargez notre application AIO Events dès maintenant pour la meilleure expérience événementielle !
        </span>
      </div>
    </div>
  );
};

export default AdBanner;
