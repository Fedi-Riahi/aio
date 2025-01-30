
import React from "react";


import Events from "@/components/Events";






const Home: React.FC = () => {
  return (
    <div className="min-h-screen  ">
      {/* <div className="min-h-screen max-w-7xl justify-center items-center mx-auto ">
        <Intro />
      </div> */}

      <div className="mx-auto min-h-screen max-w-7xl my-40 ">
        <div className="flex items-center justify-center flex-col gap-6">
          <span className="text-foreground font-medium text-3xl "><span className="text-main">All<span className="text-foreground"> In </span>One</span> Adventure</span>
          <span className="text-foreground/80 font-regular text-sm md:text-lg">
            Book tickets for concerts, performances, or festivals in just a few clicks
          </span>
        </div>
        <Events />
      </div>
    </div>
  );
};

export default Home;
