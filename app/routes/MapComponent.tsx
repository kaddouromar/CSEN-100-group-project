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

// Custom icons for different types
const EventIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const LocationIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
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
  locations: Array<{
    id: number;
    name: string;
    category: string;
    description: string;
    location: string;
    coordinates: [number, number];
    type: string;
    rating?: number;
  }>;
  events: Array<{
    id: number;
    name: string;
    category: string;
    location: string;
    date: string;
    coordinates: [number, number];
    type: string;
  }>;
  selectedItem: number | null;
  onItemSelect: (itemId: number) => void;
}

export default function MapComponent({ locations, events, selectedItem, onItemSelect }: MapComponentProps): JSX.Element {
  const [mapCenter, setMapCenter] = React.useState<[number, number]>(PAFOS_CENTER);
  const [mapZoom, setMapZoom] = React.useState(13);

  // When selectedItem changes, fly to that item
  React.useEffect(() => {
    if (selectedItem) {
      // Check events first
      const event = events.find(e => e.id === selectedItem);
      if (event) {
        setMapCenter(event.coordinates);
        setMapZoom(15);
        return;
      }
      
      // Check locations if not found in events
      const location = locations.find(l => l.id === selectedItem);
      if (location) {
        setMapCenter(location.coordinates);
        setMapZoom(15);
      }
    }
  }, [selectedItem, events, locations]);

  const handleMarkerClick = (itemId: number, coordinates: [number, number]) => {
    onItemSelect(itemId);
    setMapCenter(coordinates);
    setMapZoom(15);
  };

  const getIcon = (type: string) => {
    return type === 'location' ? LocationIcon : EventIcon;
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
      
      {/* Render location markers */}
      {locations.map((location) => (
        <Marker 
          key={`location-${location.id}`} 
          position={location.coordinates} 
          icon={getIcon(location.type)}
          eventHandlers={{
            click: () => handleMarkerClick(location.id, location.coordinates)
          }}
        >
          <Popup>
            <div className="popup-content">
              <h4>{location.name}</h4>
              <p><strong>Type:</strong> 📍 Location</p>
              <p><strong>Category:</strong> {location.category}</p>
              <p><strong>Description:</strong> {location.description}</p>
              <p><strong>Address:</strong> {location.location}</p>
              {location.rating && (
                <p><strong>Rating:</strong> ⭐ {location.rating}/5</p>
              )}
            </div>
          </Popup>
        </Marker>
      ))}
      
      {/* Render event markers */}
      {events.map((event) => (
        <Marker 
          key={`event-${event.id}`} 
          position={event.coordinates} 
          icon={getIcon(event.type)}
          eventHandlers={{
            click: () => handleMarkerClick(event.id, event.coordinates)
          }}
        >
          <Popup>
            <div className="popup-content">
              <h4>{event.name}</h4>
              <p><strong>Type:</strong> 🎉 Event</p>
              <p><strong>Category:</strong> {event.category}</p>
              <p><strong>Location:</strong> {event.location}</p>
              <p><strong>Date:</strong> {new Date(event.date).toLocaleDateString()}</p>
              <a 
                href={`/event/${event.id}`} 
                className="btn btn-sm btn-danger mt-2"
                style={{ textDecoration: "none", display: "inline-block" }}
              >
                View Details
              </a>
            </div>
          </Popup>
        </Marker>
      ))}
      
      {/* Legend */}
      <div className="leaflet-top leaflet-right">
        <div className="leaflet-control leaflet-bar legend-container">
          <h4>Map Legend</h4>
          <div className="legend-item">
            <img src="https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png" width="20" height="34" alt="Location" />
            <span>📍 Locations</span>
          </div>
          <div className="legend-item">
            <img src="https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png" width="20" height="34" alt="Event" />
            <span>🎉 Events</span>
          </div>
        </div>
      </div>
    </MapContainer>
  );
}