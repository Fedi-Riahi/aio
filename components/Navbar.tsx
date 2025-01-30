"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

export default function Navbar() {
  const [isSignedIn, setIsSignedIn] = useState(false); 
  const [scrolling, setScrolling] = useState(false);



  useEffect(() => {

    setIsSignedIn(false); 
  }, []);


  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setScrolling(true);
      } else {
        setScrolling(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);



  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300  ${
        scrolling ? " backdrop-blur-xl" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <Link href="/">
              <Image
                src="/aio-events-logo.png"
                alt="AIO Events Logo"
                width={80}
                height={80}
                className="hover:opacity-80 transition-opacity duration-300"
              />
            </Link>
          </div>


          <div className="hidden md:flex space-x-6 items-center">
            {isSignedIn ? (
              <>
                <Link
                  href="/tickets"
                  className="text-md text-black hover:text-black/90 font-medium tracking-wider px-6 py-2 rounded-xl transition duration-300"
                >
                  Tickets
                </Link>
                <Link
                  href="/profile"
                  className="text-md text-black hover:text-black/90 font-medium tracking-wider px-6 py-2 rounded-xl transition duration-300"
                >
                  Profile
                </Link>
              </>
            ) : (
              <Link
                href="/signin"
                className="text-md text-white bg-main hover:bg-main/90  font-normal tracking-wider px-6 py-2 rounded-md transition duration-300"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}