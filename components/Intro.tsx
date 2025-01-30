import React from 'react'
import { BackgroundLines } from './ui/background-lines'
import { HeroScrollDemo } from './HeroScrollDemo'

const Intro = () => {
  return (
    <BackgroundLines>
      <div className="flex flex-col-reverse md:flex-row items-center justify-between my-0 w-full h-screen px-8">

        <div className="flex flex-col justify-center w-full gap-6 text-center md:text-left">
          <span className="text-main font-semibold text-3xl md:text-5xl">
            Events around Tunisia
          </span>
          <span className="text-black font-regular text-sm md:text-lg">
            Book tickets for concerts, performances, or festivals in just a few clicks
          </span>
          <div className="flex flex-col md:flex-row items-center justify-start gap-6 md:gap-10">
            <button className="w-32 md:w-40 h-10 rounded-xl bg-main/90 font-medium transition duration-300 text-white text-sm cursor-pointer">
              Get Now
            </button>
            <button className="w-32 md:w-40 h-10 rounded-xl text-black border-2 border-main font-medium text-sm cursor-pointer">
              Browse Events
            </button>
          </div>
        </div>


        <div className="hidden md:flex justify-center items-center w-full max-w-[500px]">
          <HeroScrollDemo />
        </div>
      </div>
    </BackgroundLines>
  )
}

export default Intro;
