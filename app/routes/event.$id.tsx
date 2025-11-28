import React from "react";
import { useParams, Link } from "react-router";
import data from "./data.json";
import "./style.css";

export default function EventDetail() {
  const { id } = useParams();
  const eventId = parseInt(id || "0");
  const event = data.events.find((e: any) => e.id === eventId);

  if (!event) {
    return (
      <div className="container mt-5 pt-5">
        <h1>Event Not Found</h1>
        <p>Event ID: {id}</p>
        <Link to="/" className="btn btn-danger">
          Back to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="container mt-5 pt-5">
      <Link to="/" className="btn btn-danger mb-3">
        ← Back to Home
      </Link>

      <div className="card shadow-sm">
        <div className="card-body">
          <h1 className="card-title text-danger mb-3">{event.name}</h1>
          <p className="card-text">
            <strong>Category:</strong> {event.category}
          </p>
          <p className="card-text">
            <strong>Location:</strong> {event.location}
          </p>
          <p className="card-text">
            <strong>Date:</strong> {new Date(event.date).toLocaleDateString()}
          </p>
          <p className="card-text">
            <strong>Coordinates:</strong> {event.coordinates[0]}, {event.coordinates[1]}
          </p>
          <p className="card-text mt-3">
            <em>Join us for this amazing event!</em>
          </p>
        </div>
      </div>
    </div>
  );
}