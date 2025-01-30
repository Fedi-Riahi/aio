import Link from "next/link";
import Image from "next/image";
import { IconBrandFacebook, IconBrandInstagram, IconBrandTwitter } from '@tabler/icons-react';

const Footer = () => {
  return (
    <footer className=" py-8 border-t border-gray-300 max-w-7xl mx-auto">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">

          <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-8">
            {/* Logo */}
            <Link href="/">
              <Image
                src="/aio-events-logo.png"
                alt="Logo"
                width={120}
                height={40}
                className="h-10 w-auto"
              />
            </Link>


            <div className="flex space-x-6">
              <Link href="/about" className="text-gray-600 hover:text-foreground">
                About
              </Link>
              <Link href="/services" className="text-gray-600 hover:text-foreground">
                Services
              </Link>
              <Link href="/contact" className="text-gray-600 hover:text-foreground">
                Contact
              </Link>
            </div>
          </div>


          <div className="flex space-x-6 mt-6 md:mt-0">
            <IconBrandFacebook stroke={2} className="text-gray-600 hover:text-foreground scale-100 hover:scale-125 transition duration-300 cursor-pointer"/>
            <IconBrandInstagram stroke={2} className="text-gray-600 hover:text-foreground scale-100 hover:scale-125 transition duration-300 cursor-pointer" />
            <IconBrandTwitter stroke={2} className="text-gray-600 hover:text-foreground scale-100 hover:scale-125 transition duration-300 cursor-pointer" />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;