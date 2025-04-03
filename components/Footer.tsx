"use client";

import Link from "next/link";
import Image from "next/image";
import { IconBrandFacebook, IconBrandInstagram, IconBrandTwitter } from '@tabler/icons-react';

const Footer = () => {
  return (
    <footer className="border-t bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="flex flex-col items-center md:items-start space-y-6">
            <Link
              href="/"
              className="transition-transform duration-300 hover:scale-105"
            >
              <Image
                src="/iden2.png"
                alt="Logo"
                width={160}
                height={160}
                className="h-16 w-auto"
                quality={100}
                priority
              />
            </Link>
            {/* <nav className="flex gap-8">
              <Link
                href="/about"
                className="text-muted-foreground hover:text-primary transition-colors duration-200 text-sm font-medium"
              >
                A Propos
              </Link>
              <Link
                href="/contact"
                className="text-muted-foreground hover:text-primary transition-colors duration-200 text-sm font-medium"
              >
                Contact
              </Link>
            </nav> */}
          </div>

          <div className="flex flex-col items-center space-y-4">
            <p className="text-muted-foreground font-medium">Download Our App</p>
            <div className="flex items-center">
              <Link
                href="https://play.google.com/store/apps/details?id=com.aio.aioevents&pcampaignid=web_share"
                target="_blank"
                className="transform hover:scale-105 transition-transform duration-300"
              >
                <Image
                  src="/google.png"
                  alt="Get it on Google Play"
                  width={130}
                  height={40}
                  quality={100}
                  className="rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300"
                />
              </Link>
              <Link
                href="https://apps.apple.com/us/app/aio-events/id6475737908"
                target="_blank"
                className="transform hover:scale-105 transition-transform duration-300"
              >
                <Image
                  src="/apple.png"
                  alt="Download on the App Store"
                  width={130}
                  height={40}
                  quality={100}
                  className="rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300"
                />
              </Link>
              <Link
                href="https://appgallery.huawei.com/app/C110002625"
                target="_blank"
                className="transform hover:scale-105 transition-transform duration-300"
              >
                <Image
                  src="/huaw.png"
                  alt="Explore it on AppGallery"
                  width={140}
                  height={40}
                  quality={100}
                  className="rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300"
                />
              </Link>
            </div>
          </div>


          <div className="flex flex-col items-center md:items-end space-y-6">
            <div className="flex gap-6">
              <Link
                href="https://www.facebook.com/p/AIO-Events-61550989110680/"
                target="_blank"
                className="group"
              >
                <IconBrandFacebook
                  stroke={1.5}
                  size={24}
                  className="text-muted-foreground group-hover:text-primary transition-all duration-300 transform group-hover:scale-125"
                />
              </Link>
              <Link
                href="https://www.instagram.com/aio.events/"
                target="_blank"
                className="group"
              >
                <IconBrandInstagram
                  stroke={1.5}
                  size={24}
                  className="text-muted-foreground group-hover:text-primary transition-all duration-300 transform group-hover:scale-125"
                />
              </Link>
              <Link
                href="https://twitter.com"
                target="_blank"
                className="group"
              >
                <IconBrandTwitter
                  stroke={1.5}
                  size={24}
                  className="text-muted-foreground group-hover:text-primary transition-all duration-300 transform group-hover:scale-125"
                />
              </Link>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-primary mb-2">Contact Us</p>
              <div className="space-y-1 text-sm text-muted-foreground">
                <p className="hover:text-primary transition-colors duration-200">+216 55 559 058</p>
                <p className="hover:text-primary transition-colors duration-200">+216 54 548 382</p>
                <a
                  href="mailto:support@aio.events"
                  className="hover:text-primary transition-colors duration-200 inline-block"
                >
                  contact@aio.events
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
