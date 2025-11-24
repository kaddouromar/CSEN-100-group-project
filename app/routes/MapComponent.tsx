import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const PAFOS_CENTER: [number, number] = [34.7715, 32.4295];

const DefaultIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

export default function MapComponent(): JSX.Element {
  return (
    <MapContainer
      center={PAFOS_CENTER}
      zoom={13}
      scrollWheelZoom={true}
      style={{ width: "100%", height: "100%" }}
      whenCreated={(map) => {
        // ensure map renders correctly in responsive containers
        setTimeout(() => map.invalidateSize(), 200);
      }}
      className="map"
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; OpenStreetMap contributors'
      />
      <Marker position={PAFOS_CENTER} icon={DefaultIcon}>
        <Popup>Pafos (Paphos), Cyprus — AUB Mediterraneo area</Popup>
      </Marker>
    </MapContainer>
  );
}
