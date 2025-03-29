import React from "react";

import Events from "@/components/Events";
import Prompt from "@/components/Prompt";

const Home: React.FC = () => {
  return (
    <div className="min-h-screen ">
      {/* <div className="min-h-screen max-w-7xl justify-center items-center mx-auto ">
        <Intro />
        </div> */}
      <Prompt />
      <div className="mx-auto min-h-screen max-w-7xl my-40  ">
        <div className="flex items-center justify-center flex-col gap-6">
          <span className="text-foreground font-medium text-3xl ">
            <span className="text-main">Toutes<span className="text-foreground"> En </span>Une</span> Aventure
          </span>
          <span className="text-foreground/80 font-regular text-sm md:text-lg text-center px-8">
            Réservez des billets pour des concerts, des spectacles ou des festivals en quelques clics
          </span>
        </div>
        <Events />
      </div>
    </div>
  );
};

export default Home;
