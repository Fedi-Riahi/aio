"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { TicketsSheet } from "./TicketsSheet";
import { ProfileDrawer } from "./ProfileDrawer";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { IconMenuDeep } from '@tabler/icons-react';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { DialogTitle } from "@radix-ui/react-dialog";

export default function Navbar() {
  const { data: session } = useSession();
  const [scrolling, setScrolling] = useState(false);
  const [openTicketDrawer, setOpenTicketDrawer] = useState(false);
  const [openProfileDrawer, setOpenProfileDrawer] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolling(window.scrollY > 0);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleMobileAction = (action: 'tickets' | 'profile') => {
    setIsMobileMenuOpen(false);
    if (action === 'tickets') {
      setOpenTicketDrawer(true);
    } else {
      setOpenProfileDrawer(true);
    }
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
          scrolling ? "bg-black/30 backdrop-blur-xl" : "bg-transparent"
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
                  priority
                />
              </Link>
            </div>


            <div className="hidden md:flex space-x-6 items-center">
              {session ? (
                <>
                  <Button
                    variant="ghost"
                    onClick={() => setOpenTicketDrawer(true)}
                    className="text-md text-foreground hover:text-foreground/90 font-medium tracking-wider"
                  >
                    Tickets
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => setOpenProfileDrawer(true)}
                    className="text-md text-foreground hover:text-foreground/90 font-medium tracking-wider"
                  >
                    Profile
                  </Button>
                </>
              ) : (
                <Button
                  onClick={() => setOpenProfileDrawer(true)}
                  className="text-md text-white bg-main hover:bg-main/90 font-medium tracking-wider"
                >
                  Sign In
                </Button>
              )}
            </div>


            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild className="md:hidden">
                  <IconMenuDeep className="w-8 h-8 text-foreground" />
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px] p-0">
                <div className="flex flex-col h-full">

                  <div className="p-4 ">
                    <div className="text-2xl flex items-center justify-between">
                      <DialogTitle>
                        Menu
                      </DialogTitle>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="hover:bg-muted rounded-full text-sm text-main hover:text-main/90 transition duration-300"
                        >
                        Close
                      </Button>
                    </div>
                  </div>


                  <div className="flex-1 py-4">
                    <div className="px-4 space-y-3">
                      {session ? (
                        <>
                          <Button
                            variant="ghost"
                            onClick={() => handleMobileAction('tickets')}
                            className="w-full justify-start text-lg font-medium"
                            >
                            Tickets
                          </Button>
                          <Button
                            variant="ghost"
                            onClick={() => handleMobileAction('profile')}
                            className="w-full justify-start text-lg font-medium"
                            >
                            Profile
                          </Button>

                        </>
                      ) : (
                        <Button
                        onClick={() => handleMobileAction('profile')}
                        className="w-full text-lg font-medium bg-main hover:bg-main/90"
                        >
                          Sign In
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>


      <TicketsSheet open={openTicketDrawer} onOpenChange={setOpenTicketDrawer} />
      <ProfileDrawer open={openProfileDrawer} onOpenChange={setOpenProfileDrawer} />
    </>
  );
}