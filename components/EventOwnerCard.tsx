"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Owner } from "../types/event";

interface EventOwnerCardProps {
  visibleOwners: Owner[];
}

const EventOwnerCard: React.FC<EventOwnerCardProps> = ({ visibleOwners }) => {
  return (
    <div className="max-w-7xl mx-auto px-4">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mt-10">
        {visibleOwners.map((owner) => (
          <motion.div
            key={owner._id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: visibleOwners.indexOf(owner) * 0.1 }}
            viewport={{ once: true }}
            className="group"
          >
            <div className="relative bg-offwhite rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="relative aspect-[16/9] overflow-hidden">
                <Image
                  src={
                    owner.profile_picture ||
                    "https://via.placeholder.com/300x169?text=Aucune+Image"
                  }
                  alt={owner.organization_name}
                  className="object-cover transform group-hover:scale-105 transition-transform duration-300"
                  layout="fill"
                  priority
                />
              </div>

              <div className="p-5">
                <Link href={`/org-profile/${owner._id}`}>
                  <h3 className="text-xl font-semibold text-card-foreground group-hover:text-primary line-clamp-2 hover:text-main transition-all duration-300">
                    {owner.organization_name}
                  </h3>
                </Link>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default EventOwnerCard;
