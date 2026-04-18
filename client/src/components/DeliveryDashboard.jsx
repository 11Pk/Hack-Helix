import React, { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

mapboxgl.accessToken = "YOUR_MAPBOX_ACCESS_TOKEN";

export default function DeliveryDashboard() {
  const mapContainer = useRef(null);
  const mapRef = useRef(null);

  useEffect(() => {
    if (mapRef.current) return;

    mapRef.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [77.1025, 28.7041], // Delhi (you can change)
      zoom: 10,
    });

    // Sample markers (you can replace with real data)
    const locations = [
      { lng: 77.10, lat: 28.70, color: "red" },
      { lng: 77.12, lat: 28.72, color: "green" },
      { lng: 77.08, lat: 28.69, color: "orange" },
    ];

    locations.forEach((loc) => {
      const el = document.createElement("div");
      el.style.backgroundColor = loc.color;
      el.style.width = "15px";
      el.style.height = "15px";
      el.style.borderRadius = "50%";

      new mapboxgl.Marker(el)
        .setLngLat([loc.lng, loc.lat])
        .addTo(mapRef.current);
    });
  }, []);

  return (
    <div className="h-screen w-full flex flex-col">

      {/* 🔝 TOP BAR */}
      <div className="flex justify-between items-center p-4 bg-gray-900 text-white">
        <h1 className="text-xl font-bold">Delivery AI Co-Pilot</h1>
        <button className="bg-blue-500 px-4 py-2 rounded-lg hover:bg-blue-600">
          View in AR Mode
        </button>
      </div>

      {/* 📦 MAIN SECTION */}
      <div className="flex flex-1">

        {/* 🗺️ MAP (75%) */}
        <div className="w-3/4 h-full">
          <div ref={mapContainer} className="w-full h-full" />
        </div>

        {/* 📊 RIGHT PANEL */}
        <div className="w-1/4 bg-white p-4 flex flex-col gap-4 overflow-y-auto">

          {/* 🤖 AI CHATBOT */}
          <div className="p-3 border rounded shadow">
            <h2 className="font-semibold mb-2">AI Chatbot Insights</h2>
            <p className="text-sm text-gray-600">
              High risk detected at Stop 3. Suggest calling customer before delivery.
            </p>
          </div>

          {/* 💡 STRATEGY */}
          <div className="p-3 border rounded shadow">
            <h2 className="font-semibold mb-2">Strategy Focus</h2>
            <p className="text-sm text-gray-600">
              Learning from past deliveries to predict future risks.
            </p>
          </div>

          {/* 📍 DROPDOWN */}
          <div className="p-3 border rounded shadow">
            <label className="font-semibold">Select Location</label>
            <select className="w-full mt-2 p-2 border rounded">
              <option>All Stops</option>
              <option>Stop 1</option>
              <option>Stop 2</option>
              <option>Stop 3</option>
            </select>
          </div>

        </div>
      </div>
    </div>
  );
}