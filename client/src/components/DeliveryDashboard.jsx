import React, { useCallback, useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

/** Sample route stops — lngLat is [longitude, latitude] (same order as GeoJSON). */
const STOPS = [
  {
    id: "1",
    label: "Stop 1 — 123 Main St",
    lngLat: [-73.9897, 40.6976],
    variant: "package",
  },
  {
    id: "2",
    label: "Stop 2 — 456 Elm St",
    lngLat: [-73.8772, 40.7282],
    variant: "truck",
  },
  {
    id: "3",
    label: "Stop 3 — 789 Pine Ave",
    lngLat: [-73.9352, 40.7021],
    variant: "alert",
  },
  {
    id: "4",
    label: "Stop 4 — 987 Maple Rd",
    lngLat: [-73.9564, 40.7188],
    variant: "success",
  },
];
const optimizedOrder = ["3", "1", "4", "2"];



/** OpenStreetMap tiles (no API key). Swap URL for MapTiler, Stadia, etc. if you prefer. */
const TILE_URL = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
const TILE_ATTRIB =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>';

/** Inline SVG icons (white) for map pins */
const MARKER_ICONS = {
  alert: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="white" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"/></svg>`,
  package: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="white" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z"/></svg>`,
  truck: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="white" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12"/></svg>`,
  success: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="white" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5"/></svg>`,
};

const MARKER_COLORS = {
  alert: { bg: "bg-red-500", ring: "ring-red-500/80" },
  package: { bg: "bg-emerald-600", ring: "ring-emerald-600/80" },
  truck: { bg: "bg-amber-600", ring: "ring-amber-600/80" },
  success: { bg: "bg-yellow-500", ring: "ring-yellow-500/80" },
};

function buildMarkerElement(variant, isSelected) {
  const colors = MARKER_COLORS[variant] ?? MARKER_COLORS.package;
  const icon = MARKER_ICONS[variant] ?? MARKER_ICONS.package;
  const el = document.createElement("div");
  el.className = [
    "flex h-10 w-10 items-center justify-center rounded-full border-2 border-white shadow-lg ring-2 transition-transform duration-200",
    colors.bg,
    colors.ring,
    isSelected ? "z-10 scale-110" : "scale-100",
  ].join(" ");
  el.innerHTML = icon;
  el.setAttribute("role", "button");
  el.style.cursor = "pointer";
  return el;
}
function animateRoute(route, marker, map, markersRef, orderedStops) {
  let i = 0;

  function markStopVisited(stopId) {
    const markerObj = markersRef.current.find(m => m.stop.id === stopId);
    if (markerObj) {
      const el = markerObj.el;

      // CHANGE STYLE (visited effect)
      el.classList.add("scale-125", "ring-4", "ring-green-400");
      
      // Optional: change icon
      el.innerHTML = MARKER_ICONS.success;
    }
  }

  function moveToNext() {
    if (i >= route.length - 1) return;

    const start = route[i];
    const end = route[i + 1];
    const currentStopId = orderedStops[i].id;

    let progress = 0;

    const interval = setInterval(() => {
      progress += 0.02;

      if (progress >= 1) {
        clearInterval(interval);

        // ✅ MARK CURRENT STOP AS VISITED
        markStopVisited(currentStopId);

        i++;
        moveToNext();
        return;
      }

      const lat = start[0] + (end[0] - start[0]) * progress;
      const lng = start[1] + (end[1] - start[1]) * progress;

      marker.setLatLng([lat, lng]);
      map.panTo([lat, lng]);
    }, 50);
  }

  moveToNext();
}

function toLeafletLatLng(lngLat) {
  return [lngLat[1], lngLat[0]];
}

function IconChat() {
  return (
    <svg className="h-5 w-5 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
      />
    </svg>
  );
}

function IconBulb() {
  return (
    <svg className="h-5 w-5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
      />
    </svg>
  );
}

function IconPin() {
  return (
    <svg className="h-5 w-5 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
      />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );
}

function IconChevronRight() {
  return (
    <svg className="ml-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
    </svg>
  );
}

export default function DeliveryDashboard() {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const markersRef = useRef([]);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [selectedId, setSelectedId] = useState("all");
   
  
  const syncMarkers = useCallback((selected) => {
    markersRef.current.forEach(({ el, stop }) => {
      const next = buildMarkerElement(stop.variant, selected !== "all" && stop.id === selected);
      el.className = next.className;
      el.innerHTML = next.innerHTML;
    });
  }, []);

  const flyToSelection = useCallback((selected) => {
    const map = mapRef.current;
    if (!map) return;

    if (selected === "all") {
      const bounds = L.latLngBounds(STOPS.map((s) => toLeafletLatLng(s.lngLat)));
      map.fitBounds(bounds, { padding: [72, 72], maxZoom: 13 });
    } else {
      const stop = STOPS.find((s) => s.id === selected);
      if (stop) {
        map.flyTo(toLeafletLatLng(stop.lngLat), 14, { duration: 0.85 });
      }
    }
  }, []);

  useEffect(() => {
    if (!mapContainerRef.current) return undefined;

    const map = L.map(mapContainerRef.current, {
      zoomControl: true,
    }).setView(toLeafletLatLng([-73.93, 40.71]), 11);

    L.tileLayer(TILE_URL, { attribution: TILE_ATTRIB, maxZoom: 19 }).addTo(map);
    mapRef.current = map;

    const onReady = () => {
      markersRef.current = STOPS.map((stop) => {
        const el = buildMarkerElement(stop.variant, false);
        el.addEventListener("click", () => setSelectedId(stop.id));
        const icon = L.divIcon({
          className: "delivery-leaflet-pin-wrapper",
          html: el,
          iconSize: [40, 40],
          iconAnchor: [20, 40],
        });
        const marker = L.marker(toLeafletLatLng(stop.lngLat), { icon }).addTo(map);
        return { marker, stop, el };
      });
          //  CREATE OPTIMIZED ROUTE
const orderedStops = optimizedOrder.map(id =>
  STOPS.find(s => s.id === id)
);

// Convert to Leaflet format
const routeCoords = orderedStops.map(s => [s.lngLat[1], s.lngLat[0]]);

// DRAW ROUTE LINE
L.polyline(routeCoords, {
  color: "blue",
  weight: 4,
}).addTo(map);

// 🚚 CREATE VEHICLE MARKER
const vehicleMarker = L.marker(routeCoords[0]).addTo(map);

// 🚀 START ANIMATION
// animateRoute(routeCoords, vehicleMarker, map);
animateRoute(routeCoords, vehicleMarker, map, markersRef, orderedStops);
      setMapLoaded(true);
    };



    map.whenReady(onReady);

    return () => {
      markersRef.current.forEach(({ marker }) => {
        map.removeLayer(marker);
      });
      markersRef.current = [];
      map.remove();
      mapRef.current = null;
      setMapLoaded(false);
    };
  }, []);

  useEffect(() => {
    if (!mapLoaded) return;
    syncMarkers(selectedId);
    flyToSelection(selectedId);
  }, [mapLoaded, selectedId, syncMarkers, flyToSelection]);

  return (
    <div className="flex h-screen min-h-0 w-full flex-col bg-slate-200 font-sans text-slate-900">
      <header className="flex shrink-0 items-center justify-between gap-4 bg-slate-900 px-6 py-4 text-white shadow-md">
        <h1 className="text-lg font-semibold tracking-tight sm:text-xl">Delivery AI Co-Pilot</h1>
        <button
          type="button"
          className="inline-flex items-center rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-slate-900"
        >
          View in AR Mode
          <IconChevronRight />
        </button>
      </header>

      <div className="flex min-h-0 flex-1">
        <div className="relative z-0 min-h-0 min-w-0 flex-[1.85]">
          <div ref={mapContainerRef} className="absolute inset-0 z-0 bg-slate-300" />
        </div>

        <aside className="flex w-full max-w-md shrink-0 flex-col gap-4 overflow-y-auto border-l border-slate-200/80 bg-slate-100/90 p-5 shadow-inner backdrop-blur-sm">
          <section className="rounded-xl bg-white p-5 shadow-md ring-1 ring-slate-200/60">
            <div className="flex items-center gap-2">
              <IconChat />
              <h2 className="text-base font-semibold text-slate-800">AI Chatbot Insights</h2>
            </div>
            <div className="my-4 h-px bg-slate-200" />
            <p className="text-sm leading-relaxed text-slate-600">
              High risk detected at Stop 3. Suggest calling customer before delivery.
            </p>
          </section>

          <section className="rounded-xl bg-white p-5 shadow-md ring-1 ring-slate-200/60">
            <div className="flex items-center gap-2">
              <IconBulb />
              <h2 className="text-base font-semibold text-slate-800">Strategy Focus</h2>
            </div>
            <div className="my-4 h-px bg-slate-200" />
            <p className="text-sm font-semibold text-slate-800">Learning from Past Deliveries</p>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">
              We analyze previous delivery failures to predict future risks.
            </p>
          </section>

          <section className="rounded-xl bg-white p-5 shadow-md ring-1 ring-slate-200/60">
            <div className="flex items-center gap-2">
              <IconPin />
              <h2 className="text-base font-semibold text-slate-800">Select Location</h2>
            </div>
            <div className="my-4 h-px bg-slate-200" />
            <label htmlFor="stop-select" className="sr-only">
              Select stop
            </label>
            <select
              id="stop-select"
              value={selectedId}
              onChange={(e) => setSelectedId(e.target.value)}
              className="w-full cursor-pointer appearance-none rounded-lg border border-slate-200 bg-white py-3 pl-4 pr-10 text-sm font-medium text-slate-800 shadow-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2364748b'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E")`,
                backgroundRepeat: "no-repeat",
                backgroundPosition: "right 0.75rem center",
                backgroundSize: "1.25rem",
              }}
            >
              <option value="all">All Stops</option>
              {STOPS.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.label}
                </option>
              ))}
            </select>
            <p className="mt-3 text-xs text-slate-500">Click a pin on the map or use the list to focus a stop.</p>
          </section>
        </aside>
      </div>
    </div>
  );
}
