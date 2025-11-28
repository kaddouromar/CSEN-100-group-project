import React from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const PAFOS_CENTER: [number, number] = [34.7715, 32.4295];

// Cyprus bounds
const CYPRUS_BOUNDS: L.LatLngBoundsExpression = [
  [34.55, 32.10],
  [35.70, 34.60]
];

const DefaultIcon = new L.Icon({
  iconUrl: "images/waypoint.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  // shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 30],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});



// Component to handle map flyTo functionality
function MapController({ center, zoom }: { center: [number, number], zoom: number }) {
  const map = useMap();
  
  React.useEffect(() => {
    if (center) {
      map.flyTo(center, zoom, {
        duration: 1.5,
        easeLinearity: 0.25
      });
    }
  }, [center, zoom, map]);
  
  return null;
}

interface MapComponentProps {
  events: Array<{
    id: number;
    name: string;
    category: string;
    location: string;
    date: string;
    coordinates: [number, number];
  }>;
  selectedEvent: number | null;
  onEventSelect: (eventId: number) => void;
}

export default function MapComponent({ events, selectedEvent, onEventSelect }: MapComponentProps): JSX.Element {
  const [mapCenter, setMapCenter] = React.useState<[number, number]>(PAFOS_CENTER);
  const [mapZoom, setMapZoom] = React.useState(13);

  // When selectedEvent changes, fly to that event
  React.useEffect(() => {
    if (selectedEvent) {
      const event = events.find(e => e.id === selectedEvent);
      if (event) {
        setMapCenter(event.coordinates);
        setMapZoom(15); // Zoom in closer when selecting an event
      }
    }
  }, [selectedEvent, events]);

  const handleMarkerClick = (eventId: number, coordinates: [number, number]) => {
    onEventSelect(eventId);
    setMapCenter(coordinates);
    setMapZoom(15);
  };

  return (
    <MapContainer
      center={PAFOS_CENTER}
      zoom={13}
      minZoom={9}
      maxZoom={18}
      scrollWheelZoom={true}
      style={{ width: "100%", height: "100%" }}
      maxBounds={CYPRUS_BOUNDS}
      maxBoundsViscosity={1.0}
      whenCreated={(map) => {
        setTimeout(() => map.invalidateSize(), 200);
      }}
      className="map"
    >
      <MapController center={mapCenter} zoom={mapZoom} />
      
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; OpenStreetMap contributors'
        noWrap={true}
        bounds={CYPRUS_BOUNDS}
      />
      
      {events.map((event) => (
        <Marker 
          key={event.id} 
          position={event.coordinates} 
          icon={DefaultIcon}
          eventHandlers={{
            click: () => handleMarkerClick(event.id, event.coordinates)
          }}
        >
          <Popup>
            <div className="popup-content">
              <h4>{event.name}</h4>
              <p><strong>Location:</strong> {event.location}</p>
              <p><strong>Date:</strong> {new Date(event.date).toLocaleDateString()}</p>
              <p><strong>Category:</strong> {event.category}</p>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
} 