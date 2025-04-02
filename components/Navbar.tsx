"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { TicketsSheet } from "./TicketsSheet";
import { ProfileDrawer } from "./ProfileDrawer";
import { Button } from "@/components/ui/button";
import { IconMenuDeep, IconBell } from "@tabler/icons-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { DialogTitle } from "@radix-ui/react-dialog";
import { useNavbar } from "../hooks/useNavbar";
import AdBanner from "./AdBanner";

export default function Navbar() {
  const {
    session,
    scrolling,
    openTicketDrawer,
    setOpenTicketDrawer,
    openProfileDrawer,
    setOpenProfileDrawer,
    unreadNotificationsCount,
    isMobileMenuOpen,
    setIsMobileMenuOpen,
    handleMobileAction,
  } = useNavbar();

  // Check if the user is an organizer based on userData state
  const userData = typeof window !== "undefined" ? JSON.parse(localStorage.getItem("userData") || "{}") : {};
  const isOrganizer = userData.state === "Organizer" || userData.is_org === true;

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
                  alt="Logo AIO Events"
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
                    Billets
                  </Button>
                  {isOrganizer ? (
                    <Link href="https://organizer.aio.events/">
                      <Button
                        variant="ghost"
                        className="text-md text-foreground hover:text-foreground/90 font-medium tracking-wider"
                      >
                        Dashboard
                      </Button>
                    </Link>
                  ) : (
                    <Link href="/complete-organizer-details">
                      <Button
                        variant="ghost"
                        className="text-md text-foreground hover:text-foreground/90 font-medium tracking-wider"
                      >
                        Devenir organisateur
                      </Button>
                    </Link>
                  )}
                  <Button
                    variant="ghost"
                    onClick={() => setOpenProfileDrawer(true)}
                    className="text-md text-foreground hover:text-foreground/90 font-medium tracking-wider"
                  >
                    Profil
                  </Button>
                  <div className="relative mt-2 group">
                    <button
                      className="text-md text-foreground hover:text-foreground/90 font-medium tracking-wider"
                    >
                      <IconBell size={24} />
                    </button>
                    {unreadNotificationsCount > 0 && (
                      <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {unreadNotificationsCount}
                      </span>
                    )}
                    <div className="absolute left-1/2 transform -translate-x-1/2 top-10 bg-background text-white text-sm px-3 w-[200px] py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                      Visitez l&apos;application pour voir les notifications
                    </div>
                  </div>
                </>
              ) : (
                <Button
                  onClick={() => setOpenProfileDrawer(true)}
                  className="text-md text-white bg-main hover:bg-main/90 font-medium tracking-wider"
                >
                  Se connecter
                </Button>
              )}
            </div>

            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild className="md:hidden">
                <IconMenuDeep className="w-8 h-8 text-foreground" />
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px] p-0">
                <div className="flex flex-col h-full">
                  <div className="p-4">
                    <div className="text-2xl flex items-center justify-between">
                      <DialogTitle>Menu</DialogTitle>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="hover:bg-muted rounded-full text-sm text-main hover:text-main/90 transition duration-300"
                      >
                        Fermer
                      </Button>
                    </div>
                  </div>

                  <div className="flex-1 py-4">
                    <div className="px-4 space-y-3">
                      {session ? (
                        <>
                          <Button
                            variant="ghost"
                            onClick={() => handleMobileAction("tickets")}
                            className="w-full justify-start text-lg font-medium"
                          >
                            Billets
                          </Button>
                          {isOrganizer ? (
                            <Link href="/https://organizer.aio.events/">
                              <Button
                                variant="ghost"
                                className="w-full justify-start text-lg font-medium"
                              >
                                Dashboard
                              </Button>
                            </Link>
                          ) : (
                            <Link href="/complete-organizer-details">
                              <Button
                                variant="ghost"
                                className="w-full justify-start text-lg font-medium"
                              >
                                Devenir organisateur
                              </Button>
                            </Link>
                          )}
                          <Button
                            variant="ghost"
                            onClick={() => handleMobileAction("profile")}
                            className="w-full justify-start text-lg font-medium"
                          >
                            Profil
                          </Button>
                          <div>
                            <Button
                              variant="ghost"
                              className="w-full justify-start text-lg font-medium relative"
                            >
                              Notifications
                              {unreadNotificationsCount >= 0 && (
                                <span className="ml-2 bg-red-500 text-white text-3xl rounded-full h-5 w-5 flex items-center justify-center">
                                  {unreadNotificationsCount}
                                </span>
                              )}
                            </Button>
                          </div>
                        </>
                      ) : (
                        <Button
                          onClick={() => handleMobileAction("profile")}
                          className="w-full text-lg font-medium bg-main hover:bg-main/90"
                        >
                          Se connecter
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

      <AdBanner />

      <TicketsSheet open={openTicketDrawer} onOpenChange={setOpenTicketDrawer} />
      <ProfileDrawer open={openProfileDrawer} onOpenChange={setOpenProfileDrawer} />
    </>
  );
}
