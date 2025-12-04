import React from "react";
import { Link } from "react-router";
import data from "./data.json";
import "./style.css";

const MapComponent = React.lazy(() => import("./MapComponent"));

export default function LocationsPage() {
  const [filter, setFilter] = React.useState<string>("all");
  const [selectedLocationId, setSelectedLocationId] = React.useState<number | null>(null);
  const [showMapModal, setShowMapModal] = React.useState(false);

  const categories = React.useMemo(() => {
    const setCats = new Set<string>(data.locations.map((l: any) => l.category || "Other"));
    return ["all", ...Array.from(setCats)];
  }, []);

  const filtered = React.useMemo(() => {
    if (filter === "all") return data.locations;
    return data.locations.filter((l: any) => l.category === filter);
  }, [filter]);

  const handleSelectLocation = (id: number) => {
    setSelectedLocationId(id);
  };

  const handleViewOnMap = (id: number) => {
    setSelectedLocationId(id);
    setShowMapModal(true);
  };

  return (
    <div className="main-container">
      <div className="content-wrapper">
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem", marginBottom: "2rem" }}>
          <div>
            <h1 style={{ margin: "0 0 0.5rem 0", fontSize: "2.5rem" }}>Locations</h1>
            <p style={{ margin: 0, color: "var(--text-secondary)", fontSize: "1.125rem" }}>
              Browse places and discover more on the map
            </p>
          </div>
          <Link to="/" className="view-on-map-btn" style={{ textDecoration: "none", whiteSpace: "nowrap", padding: "0.625rem 1.25rem", fontSize: "0.95rem" }}>
            ← Home
          </Link>
        </div>

        {/* Filter Section */}
        <div style={{ marginBottom: "2.5rem", display: "flex", gap: "1rem", alignItems: "center", flexWrap: "wrap" }}>
          <label style={{ color: "var(--text-secondary)", fontWeight: 600, fontSize: "1rem" }}>Filter by category:</label>
          <select
            value={filter}
            onChange={(e) => {
              setFilter(e.target.value);
              setSelectedLocationId(null);
            }}
            style={{
              padding: "0.625rem 0.875rem",
              borderRadius: "var(--radius)",
              border: "2px solid var(--border)",
              fontSize: "0.95rem",
              fontWeight: 500,
              backgroundColor: "var(--surface)",
              color: "var(--text-primary)",
              cursor: "pointer"
            }}
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                {c === "all" ? "All categories" : c}
              </option>
            ))}
          </select>
        </div>

        {/* Locations Grid - 3 cards per row */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "2rem", marginBottom: "2rem" }}>
          {filtered.map((loc: any) => (
            <div key={loc.id} className="event-card" style={{ display: "flex", flexDirection: "column", height: "100%" }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "1rem", marginBottom: "1rem" }}>
                  <div>
                    <h3 style={{ margin: "0 0 0.5rem 0", fontSize: "1.25rem", color: "var(--text-primary)" }}>
                      {loc.name}
                    </h3>
                    <span
                      style={{
                        display: "inline-block",
                        backgroundColor: "rgba(132, 1, 50, 0.1)",
                        color: "var(--aub-red)",
                        padding: "0.35rem 0.7rem",
                        borderRadius: "var(--radius)",
                        fontSize: "0.8rem",
                        fontWeight: 600
                      }}
                    >
                      {loc.category}
                    </span>
                  </div>
                  <div style={{ textAlign: "center", backgroundColor: "var(--border-light)", padding: "0.5rem 0.65rem", borderRadius: "var(--radius)", minWidth: "45px" }}>
                    <div style={{ fontSize: "1.25rem", fontWeight: 700, color: "var(--aub-red)" }}>
                      {loc.rating?.toFixed?.(1) ?? "-"}
                    </div>
                    <div style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>★</div>
                  </div>
                </div>

                <div style={{ marginBottom: "0.875rem" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--text-secondary)", marginBottom: "0.5rem" }}>
                    <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: "16px", height: "16px" }}>
                      <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    </svg>
                    <span style={{ fontWeight: 500, fontSize: "0.9rem" }}>{loc.location}</span>
                  </div>
                </div>

                <p style={{ margin: "0 0 1.25rem 0", color: "var(--text-secondary)", lineHeight: "1.5", fontSize: "0.9rem" }}>
                  {loc.description}
                </p>
              </div>

              {/* Button at bottom */}
              <div>
                <button
                  onClick={() => handleViewOnMap(loc.id)}
                  className="view-on-map-btn"
                  style={{
                    width: "100%",
                    padding: "0.625rem 1rem",
                    fontSize: "0.875rem",
                    border: "none",
                    cursor: "pointer",
                    textDecoration: "none"
                  }}
                >
                  View on Map
                </button>
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div style={{ textAlign: "center", padding: "3rem 1rem" }}>
            <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>📍</div>
            <h3 style={{ color: "var(--text-primary)", marginBottom: "0.5rem" }}>No locations found</h3>
            <p style={{ color: "var(--text-secondary)" }}>Try selecting a different category</p>
          </div>
        )}
      </div>

      {/* Full Screen Map Modal */}
      {showMapModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
            padding: "1rem"
          }}
          onClick={() => setShowMapModal(false)}
        >
          <div
            style={{
              backgroundColor: "var(--surface)",
              borderRadius: "var(--radius-lg)",
              width: "90%",
              maxWidth: "900px",
              height: "80vh",
              display: "flex",
              flexDirection: "column",
              boxShadow: "var(--shadow-lg)",
              border: "2px solid var(--border)"
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "1.25rem",
                borderBottom: "1px solid var(--border)"
              }}
            >
              <h2 style={{ margin: 0, color: "var(--text-primary)", fontSize: "1.5rem" }}>
                {data.locations.find((l: any) => l.id === selectedLocationId)?.name || "Location"}
              </h2>
              <button
                onClick={() => setShowMapModal(false)}
                style={{
                  background: "none",
                  border: "none",
                  fontSize: "1.75rem",
                  cursor: "pointer",
                  color: "var(--text-muted)",
                  padding: 0,
                  lineHeight: 1
                }}
              >
                ×
              </button>
            </div>

            {/* Map Container */}
            <div style={{ flex: 1, position: "relative" }}>
              <React.Suspense fallback={<div className="map-loading">Loading map…</div>}>
                <MapComponent
                  locations={data.locations}
                  events={[]}
                  selectedItem={selectedLocationId}
                  onItemSelect={handleSelectLocation}
                />
              </React.Suspense>
            </div>

            {/* Modal Footer */}
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: "1rem",
                padding: "1.25rem",
                borderTop: "1px solid var(--border)"
              }}
            >
              <button
                onClick={() => setShowMapModal(false)}
                style={{
                  padding: "0.625rem 1.5rem",
                  borderRadius: "var(--radius)",
                  border: "2px solid var(--border)",
                  backgroundColor: "var(--surface)",
                  color: "var(--text-primary)",
                  fontSize: "0.95rem",
                  fontWeight: 600,
                  cursor: "pointer"
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}