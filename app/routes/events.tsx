import React from "react";
import { useState } from "react";
import { Link } from "react-router";
import data from "./data.json";

export default function EventsPage() {
  const [selectedCategory, setSelectedCategory] = useState("all");

  const filteredEvents =
    selectedCategory === "all"
      ? data.events
      : data.events.filter((event) => event.category === selectedCategory);

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

  const getCategoryLabel = (value) =>
    data.categories.find((c) => c.value === value)?.label || value;

  return (
    <div className="w-full min-h-screen p-6 bg-gray-100">
      <h1 className="text-4xl font-bold mb-6 text-center">Events</h1>

      {/* Filter Dropdown */}
      <div className="max-w-md mx-auto mb-6">
        <select
          className="w-full p-3 rounded-xl shadow bg-white"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          {data.categories.map((cat) => (
            <option key={cat.value} value={cat.value}>
              {cat.label}
            </option>
          ))}
        </select>
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEvents.map((event) => (
          <div
            key={event.id}
            className="p-5 bg-white rounded-2xl shadow hover:shadow-lg transition"
          >
            <h2 className="text-xl font-semibold mb-2">{event.name}</h2>
            <p className="text-sm text-gray-500 mb-1">
              <strong>Category:</strong> {getCategoryLabel(event.category)}
            </p>
            <p className="text-sm text-gray-500 mb-1">
              <strong>Location:</strong> {event.location}
            </p>
            <p className="text-sm text-gray-500 mb-3">
              <strong>Date:</strong> {formatDate(event.date)}
            </p>
            <Link to={`/event/${event.id}`}>
              <button className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition w-full">
                View Details
              </button>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
