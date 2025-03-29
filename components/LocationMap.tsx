"use client";

import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import { Coordinates } from "../types/paymentStep";


// eslint-disable-next-line @typescript-eslint/no-explicit-any
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

interface LocationMapProps {
  initialPosition: Coordinates;
  onLocationSelect: (coords: Coordinates) => void;
}

const LocationMap: React.FC<LocationMapProps> = ({ initialPosition, onLocationSelect }) => {
  const [position, setPosition] = useState<Coordinates>(initialPosition);

  const MapEvents = () => {
    useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng;
        setPosition({ latitude: lat, longitude: lng });
        onLocationSelect({ latitude: lat, longitude: lng });
      },
    });
    return null;
  };

  return (
    <div
      className="rounded-lg overflow-hidden"
    >
      <MapContainer
        center={[initialPosition.latitude, initialPosition.longitude]}
        zoom={13}
        style={{ height: "600px", width: "100%" }}
      >
        <TileLayer
    attribution=""
    url="https://api.maptiler.com/maps/0195c78c-bbb1-7466-a584-dafc48fa471c/style.json?key=bl9EB9KLu19LVWhSNnCS"
        />
        <Marker
          position={[position.latitude, position.longitude]}
          draggable={true}
          eventHandlers={{
            dragend: (e) => {
              const marker = e.target;
              const { lat, lng } = marker.getLatLng();
              setPosition({ latitude: lat, longitude: lng });
              onLocationSelect({ latitude: lat, longitude: lng });
            },
          }}
        />
        <MapEvents />
      </MapContainer>
    </div>
  );
};

export default LocationMap;
