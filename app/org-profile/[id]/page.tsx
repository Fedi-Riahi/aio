"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { fetchOrganizerProfile } from "@/utils/signUpUtils";
import { UserData } from "@/types/signUp";
import EventCard from "@/components/EventCard";
import Image from "next/image";


const OrgProfile = () => {
  const { userData } = useAuth();
  const router = useRouter();
  const { id } = useParams();
  const [organizerData, setOrganizerData] = useState<UserData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    if (!userData) {
      router.push("/");
    }
  }, [userData, router]);


  useEffect(() => {
    const loadOrganizerProfile = async () => {
      if (!id || typeof id !== "string") {
        setError("ID de l'organisateur invalide.");
        setLoading(false);
        return;
      }

      if (!userData) {
        return;
      }

      try {
        setLoading(true);
        const response = await fetchOrganizerProfile(id);
        if (!response.ok) {
          setError(response.error?.details || "Échec du chargement du profil de l'organisateur.");
          setLoading(false);
          return;
        }

        setOrganizerData(response.respond?.data as UserData);
        setLoading(false);
      } catch (err) {
        setError("Erreur réseau. Veuillez vérifier votre connexion.");
        console.error("Erreur lors du chargement du profil de l'organisateur :", err);
        setLoading(false);
      }
    };

    loadOrganizerProfile();
  }, [id, userData]);

  if (!userData) {
    return null;
  }

  if (loading) {
    return (
      <div className="my-8 w-full max-w-7xl mx-auto text-center">
        <p className="text-lg text-gray-600">Chargement...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="my-8 w-full max-w-7xl mx-auto text-center">
        <p className="text-lg text-red-500">{error}</p>
      </div>
    );
  }

  if (!organizerData) {
    return (
      <div className="my-8 w-full max-w-7xl mx-auto text-center">
        <p className="text-lg text-gray-600">Organisateur introuvable.</p>
      </div>
    );
  }

  return (
    <div className="my-40 w-full max-w-7xl mx-auto px-4 space-y-12">

      <div className="relative bg-gradient-to-r from-main to-background rounded-xl shadow-lg overflow-hidden">

        <div className="absolute inset-0 bg-black/30"></div>

        <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start p-8 space-y-6 md:space-y-0 md:space-x-8">

          <div className="flex-shrink-0">
            <Image
              src={organizerData.profile_picture || "https://via.placeholder.com/150?text=Organisateur"}
              alt={organizerData.organization_name || "Organisateur"}
              width={150}
              height={150}
              className="rounded-full object-cover border-4 border-white shadow-md"
            />
          </div>

          <div className="flex-1 text-center md:text-left text-white">
            <h1 className="text-4xl font-bold mb-2">{organizerData.organization_name || "Organisateur"}</h1>
            <p className="text-lg mb-4">{organizerData.details || "Aucune description disponible."}</p>


            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-md">
              <div className="p-4 rounded-lg shadow-sm ">
                <p className="text-sm font-medium text-foreground">Abonnés</p>
                <p className="text-2xl font-bold text-foreground">
                  {organizerData.followers || 0}
                </p>
              </div>
              <div className="p-4 rounded-lg shadow-sm ">
                <p className="text-sm font-medium text-foreground">Participants totaux</p>
                <p className="text-2xl font-bold text-foreground">
                  {organizerData.total_attendees || 0}
                </p>
              </div>
              <div className="p-4 rounded-lg shadow-sm ">
                <p className="text-sm font-medium text-foreground">Événements</p>
                <p className="text-2xl font-bold text-foreground">
                  {organizerData.owned_events || 0}
                </p>
              </div>
            </div>

  
            {organizerData.social_medias && organizerData.social_medias.length > 0 && (
              <div className="mt-4">
                <h3 className="text-lg font-semibold">Réseaux sociaux</h3>
                <div className="flex flex-wrap gap-3 mt-2">
                  {organizerData.social_medias.map((social, index) => (
                    <a
                      key={index}
                      href={social.social_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white hover:text-blue-200 transition-colors duration-300"
                    >
                      <span className="capitalize">{social.platform}</span>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Section des événements */}
      <div>
        <h3 className="text-2xl font-bold mb-6">Événements</h3>
        {organizerData.events && organizerData.events.length > 0 ? (
          <EventCard
            searchQuery=""
            selectedCategory=""
            visibleEvents={organizerData.events}
          />
        ) : (
          <p className="text-gray-600">Aucun événement disponible.</p>
        )}
      </div>
    </div>
  );
};

export default OrgProfile;
