// // import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
// // import { useLocation } from "react-router-dom";
// // import L from "leaflet";
// // import "leaflet/dist/leaflet.css";

// // /**
// //  * Shown only if you open /dashboard without going through Route Optimizer
// //  * (no coordinates + route in location.state).
// //  */
// // const FALLBACK_STOPS = [
// //   {
// //     id: "1",
// //     label: "Stop 1 — 123 Main St",
// //     lngLat: [-73.9897, 40.6976],
// //     variant: "package",
// //   },
// //   {
// //     id: "2",
// //     label: "Stop 2 — 456 Elm St",
// //     lngLat: [-73.8772, 40.7282],
// //     variant: "truck",
// //   },
// //   {
// //     id: "3",
// //     label: "Stop 3 — 789 Pine Ave",
// //     lngLat: [-73.9352, 40.7021],
// //     variant: "alert",
// //   },
// //   {
// //     id: "4",
// //     label: "Stop 4 — 987 Maple Rd",
// //     lngLat: [-73.9564, 40.7188],
// //     variant: "success",
// //   },
// // ];

// // const FALLBACK_VISIT_SEQUENCE = ["3", "1", "4", "2"];

// // const TILE_URL = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
// // const TILE_ATTRIB =
// //   '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>';

// // const MARKER_ICONS = {
// //   alert: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="white" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"/></svg>`,
// //   package: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="white" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z"/></svg>`,
// //   truck: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="white" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12"/></svg>`,
// //   success: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="white" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5"/></svg>`,
// // };

// // const MARKER_COLORS = {
// //   alert: { bg: "bg-red-500", ring: "ring-red-500/80" },
// //   package: { bg: "bg-emerald-600", ring: "ring-emerald-600/80" },
// //   truck: { bg: "bg-amber-600", ring: "ring-amber-600/80" },
// //   success: { bg: "bg-yellow-500", ring: "ring-yellow-500/80" },
// // };

// // function variantFromPrediction(pred) {
// //   if (!pred?.prediction) return "package";
// //   const f = Number(pred.prediction.failure_probability);
// //   if (!Number.isFinite(f)) return "package";
// //   return f > 0.5 ? "alert" : "package";
// // }

// // /**
// //  * Builds map nodes from optimize API `coordinates` + RouteOptimizer `optimizedRoute` source.
// //  * Index 0 = rider depot; indices 1..n-1 align with stopPredictions[i-1].
// //  */
// // function buildNodesFromRouteState(state) {
// //   if (!state?.coordinates?.length) return null;

// //   const optimizedRoute = state.optimizedRoute ?? state.route;
// //   if (!Array.isArray(optimizedRoute) || optimizedRoute.length === 0) return null;

// //   const { coordinates, rider, stopPredictions = [] } = state;

// //   const nodes = coordinates.map((c, idx) => {
// //     const id = String(idx);
// //     if (idx === 0) {
// //       return {
// //         id,
// //         lngLat: [c.lng, c.lat],
// //         label: `Depot — ${rider || "Rider"}`,
// //         variant: "truck",
// //       };
// //     }
// //     const pred = stopPredictions[idx - 1];
// //     return {
// //       id,
// //       lngLat: [c.lng, c.lat],
// //       label: pred?.address ? `Stop ${idx} — ${pred.address}` : `Stop ${idx}`,
// //       variant: variantFromPrediction(pred),
// //     };
// //   });

// //   const visitSequence = optimizedRoute.map((i) => String(i));
// //   return { nodes, visitSequence };
// // }

// // function buildMarkerElement(variant, isSelected) {
// //   const colors = MARKER_COLORS[variant] ?? MARKER_COLORS.package;
// //   const icon = MARKER_ICONS[variant] ?? MARKER_ICONS.package;
// //   const el = document.createElement("div");
// //   el.className = [
// //     "flex h-10 w-10 items-center justify-center rounded-full border-2 border-white shadow-lg ring-2 transition-transform duration-200",
// //     colors.bg,
// //     colors.ring,
// //     isSelected ? "z-10 scale-110" : "scale-100",
// //   ].join(" ");
// //   el.innerHTML = icon;
// //   el.setAttribute("role", "button");
// //   el.style.cursor = "pointer";
// //   return el;
// // }

// // /** routeCoords: [lat,lng][]; visitSequenceIds aligns with waypoint order */
// // function animateRoute(routeCoords, vehicleMarker, map, markersRef, visitSequenceIds) {
// //   let i = 0;

// //   function markStopVisited(stopId) {
// //     const markerObj = markersRef.current.find((m) => m.stop.id === stopId);
// //     if (markerObj) {
// //       const { el } = markerObj;
// //       el.classList.add("scale-125", "ring-4", "ring-green-400");
// //       el.innerHTML = MARKER_ICONS.success;
// //     }
// //   }

// //   function moveToNext() {
// //     if (i >= routeCoords.length - 1) return;

// //     let progress = 0;
// //     const start = routeCoords[i];
// //     const end = routeCoords[i + 1];

// //     const interval = setInterval(() => {
// //       progress += 0.02;

// //       if (progress >= 1) {
// //         clearInterval(interval);
// //         const arrivedId = visitSequenceIds[i + 1];
// //         if (arrivedId !== "0") markStopVisited(arrivedId);
// //         i += 1;
// //         moveToNext();
// //         return;
// //       }

// //       const lat = start[0] + (end[0] - start[0]) * progress;
// //       const lng = start[1] + (end[1] - start[1]) * progress;
// //       vehicleMarker.setLatLng([lat, lng]);
// //       map.panTo([lat, lng]);
// //     }, 50);
// //   }

// //   moveToNext();
// // }

// // function toLeafletLatLng(lngLat) {
// //   return [lngLat[1], lngLat[0]];
// // }

// // function IconChevronRight() {
// //   return (
// //     <svg className="ml-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
// //       <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
// //     </svg>
// //   );
// // }

// // function IconChat() {
// //   return (
// //     <svg className="h-5 w-5 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
// //       <path
// //         strokeLinecap="round"
// //         strokeLinejoin="round"
// //         d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
// //       />
// //     </svg>
// //   );
// // }

// // function IconBulb() {
// //   return (
// //     <svg className="h-5 w-5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
// //       <path
// //         strokeLinecap="round"
// //         strokeLinejoin="round"
// //         d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
// //       />
// //     </svg>
// //   );
// // }

// // function IconPin() {
// //   return (
// //     <svg className="h-5 w-5 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
// //       <path
// //         strokeLinecap="round"
// //         strokeLinejoin="round"
// //         d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
// //       />
// //       <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
// //     </svg>
// //   );
// // }

// // function insightFromPredictions(stopPredictions) {
// //   const scored = (stopPredictions || [])
// //     .map((p, i) => ({
// //       i: i + 1,
// //       address: p.address,
// //       f: Number(p.prediction?.failure_probability),
// //     }))
// //     .filter((x) => Number.isFinite(x.f));
// //   if (scored.length === 0) {
// //     return "No ML failure scores for this run. Complete predictions on the delivery form for risk-ranked insights.";
// //   }
// //   scored.sort((a, b) => b.f - a.f);
// //   const top = scored[0];
// //   return `Highest failure risk at Stop ${top.i} (${top.address}). Consider contacting the customer before arrival.`;
// // }

// // export default function DeliveryDashboard({ routeState: routeStateProp } = {}) {
// //   const location = useLocation();
// //   const routeState = routeStateProp ?? location.state ?? {};

// //   const { nodes, visitSequence, fromOptimizer, stopPredictions } = useMemo(() => {
// //     const built = buildNodesFromRouteState(routeState);
// //     if (built) {
// //       return {
// //         nodes: built.nodes,
// //         visitSequence: built.visitSequence,
// //         fromOptimizer: true,
// //         stopPredictions: routeState.stopPredictions ?? [],
// //       };
// //     }
// //     return {
// //       nodes: FALLBACK_STOPS,
// //       visitSequence: FALLBACK_VISIT_SEQUENCE,
// //       fromOptimizer: false,
// //       stopPredictions: [],
// //     };
// //   }, [routeState]);

// //   const nodeById = useMemo(() => Object.fromEntries(nodes.map((n) => [n.id, n])), [nodes]);

// //   const insightText = useMemo(() => {
// //     if (!fromOptimizer) {
// //       return "Demo mode: High risk at Stop 3. Suggest calling the customer before delivery.";
// //     }
// //     return insightFromPredictions(stopPredictions);
// //   }, [fromOptimizer, stopPredictions]);

// //   const mapContainerRef = useRef(null);
// //   const mapRef = useRef(null);
// //   const markersRef = useRef([]);
// //   const polylineRef = useRef(null);
// //   const vehicleRef = useRef(null);
// //   const [mapLoaded, setMapLoaded] = useState(false);
// //   const [selectedId, setSelectedId] = useState("all");
// //   const skipInitialSyncRef = useRef(true);

// //   const syncMarkers = useCallback((selected) => {
// //     markersRef.current.forEach(({ el, stop }) => {
// //       const next = buildMarkerElement(stop.variant, selected !== "all" && stop.id === selected);
// //       el.className = next.className;
// //       el.innerHTML = next.innerHTML;
// //     });
// //   }, []);

// //   const flyToSelection = useCallback(
// //     (selected) => {
// //       const map = mapRef.current;
// //       if (!map) return;

// //       if (selected === "all") {
// //         const bounds = L.latLngBounds(nodes.map((s) => toLeafletLatLng(s.lngLat)));
// //         map.fitBounds(bounds, { padding: [72, 72], maxZoom: 13 });
// //       } else {
// //         const stop = nodeById[selected];
// //         if (stop) {
// //           map.flyTo(toLeafletLatLng(stop.lngLat), 14, { duration: 0.85 });
// //         }
// //       }
// //     },
// //     [nodes, nodeById],
// //   );

// //   useEffect(() => {
// //     if (!mapContainerRef.current) return undefined;

// //     skipInitialSyncRef.current = true;

// //     const map = L.map(mapContainerRef.current, {
// //       zoomControl: true,
// //     }).setView(toLeafletLatLng([-73.93, 40.71]), 11);

// //     L.tileLayer(TILE_URL, { attribution: TILE_ATTRIB, maxZoom: 19 }).addTo(map);
// //     mapRef.current = map;

// //     const onReady = () => {
// //       markersRef.current = nodes.map((stop) => {
// //         const el = buildMarkerElement(stop.variant, false);
// //         el.addEventListener("click", () => setSelectedId(stop.id));
// //         const icon = L.divIcon({
// //           className: "delivery-leaflet-pin-wrapper",
// //           html: el,
// //           iconSize: [40, 40],
// //           iconAnchor: [20, 40],
// //         });
// //         const marker = L.marker(toLeafletLatLng(stop.lngLat), { icon }).addTo(map);
// //         return { marker, stop, el };
// //       });

// //       const routeCoords = visitSequence
// //         .map((id) => nodeById[id])
// //         .filter(Boolean)
// //         .map((s) => toLeafletLatLng(s.lngLat));

// //       if (routeCoords.length > 1) {
// //         polylineRef.current = L.polyline(routeCoords, {
// //           color: "#2563eb",
// //           weight: 4,
// //           opacity: 0.9,
// //         }).addTo(map);
// //       }

// //       if (routeCoords.length > 0) {
// //         const vehicle = L.marker(routeCoords[0]).addTo(map);
// //         vehicleRef.current = vehicle;
// //         animateRoute(routeCoords, vehicle, map, markersRef, visitSequence);
// //       }

// //       setMapLoaded(true);
// //     };

// //     map.whenReady(onReady);

// //     return () => {
// //       if (polylineRef.current) {
// //         map.removeLayer(polylineRef.current);
// //         polylineRef.current = null;
// //       }
// //       if (vehicleRef.current) {
// //         map.removeLayer(vehicleRef.current);
// //         vehicleRef.current = null;
// //       }
// //       markersRef.current.forEach(({ marker }) => {
// //         map.removeLayer(marker);
// //       });
// //       markersRef.current = [];
// //       map.remove();
// //       mapRef.current = null;
// //       setMapLoaded(false);
// //     };
// //   }, [nodes, visitSequence, nodeById]);

// //   useEffect(() => {
// //     if (!mapLoaded) return;
// //     flyToSelection(selectedId);
// //   }, [mapLoaded, selectedId, flyToSelection]);

// //   useEffect(() => {
// //     if (!mapLoaded) return;
// //     if (skipInitialSyncRef.current && selectedId === "all") {
// //       skipInitialSyncRef.current = false;
// //       return;
// //     }
// //     syncMarkers(selectedId);
// //   }, [mapLoaded, selectedId, syncMarkers]);

// //   return (
// //     <div className="flex h-screen min-h-0 w-full flex-col bg-slate-200 font-sans text-slate-900">
// //       <header className="flex shrink-0 items-center justify-between gap-4 bg-slate-900 px-6 py-4 text-white shadow-md">
// //         <div>
// //           <h1 className="text-lg font-semibold tracking-tight sm:text-xl">Delivery AI Co-Pilot</h1>
// //           {fromOptimizer && (
// //             <p className="mt-1 max-w-xl text-xs text-slate-400">
// //               Optimized visit order (same indices as Route Optimizer): {visitSequence.join(" → ")}
// //             </p>
// //           )}
// //           {!fromOptimizer && (
// //             <p className="mt-1 text-xs text-amber-300/90">
// //               Demo data — use Delivery → Generate route → Open dashboard from the optimizer for real stops.
// //             </p>
// //           )}
// //         </div>
// //         <button
// //           type="button"
// //           className="inline-flex items-center rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-slate-900"
// //         >
// //           View in AR Mode
// //           <IconChevronRight />
// //         </button>
// //       </header>

// //       <div className="flex min-h-0 flex-1">
// //         <div className="relative z-0 min-h-0 min-w-0 flex-[1.85]">
// //           <div ref={mapContainerRef} className="absolute inset-0 z-0 bg-slate-300" />
// //         </div>

// //         <aside className="flex w-full max-w-md shrink-0 flex-col gap-4 overflow-y-auto border-l border-slate-200/80 bg-slate-100/90 p-5 shadow-inner backdrop-blur-sm">
// //           <section className="rounded-xl bg-white p-5 shadow-md ring-1 ring-slate-200/60">
// //             <div className="flex items-center gap-2">
// //               <IconChat />
// //               <h2 className="text-base font-semibold text-slate-800">AI Chatbot Insights</h2>
// //             </div>
// //             <div className="my-4 h-px bg-slate-200" />
// //             <p className="text-sm leading-relaxed text-slate-600">{insightText}</p>
// //           </section>

// //           <section className="rounded-xl bg-white p-5 shadow-md ring-1 ring-slate-200/60">
// //             <div className="flex items-center gap-2">
// //               <IconBulb />
// //               <h2 className="text-base font-semibold text-slate-800">Strategy Focus</h2>
// //             </div>
// //             <div className="my-4 h-px bg-slate-200" />
// //             <p className="text-sm font-semibold text-slate-800">Learning from Past Deliveries</p>
// //             <p className="mt-2 text-sm leading-relaxed text-slate-600">
// //               We analyze previous delivery failures to predict future risks.
// //             </p>
// //           </section>

// //           <section className="rounded-xl bg-white p-5 shadow-md ring-1 ring-slate-200/60">
// //             <div className="flex items-center gap-2">
// //               <IconPin />
// //               <h2 className="text-base font-semibold text-slate-800">Select Location</h2>
// //             </div>
// //             <div className="my-4 h-px bg-slate-200" />
// //             <label htmlFor="stop-select" className="sr-only">
// //               Select stop
// //             </label>
// //             <select
// //               id="stop-select"
// //               value={selectedId}
// //               onChange={(e) => setSelectedId(e.target.value)}
// //               className="w-full cursor-pointer appearance-none rounded-lg border border-slate-200 bg-white py-3 pl-4 pr-10 text-sm font-medium text-slate-800 shadow-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30"
// //               style={{
// //                 backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2364748b'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E")`,
// //                 backgroundRepeat: "no-repeat",
// //                 backgroundPosition: "right 0.75rem center",
// //                 backgroundSize: "1.25rem",
// //               }}
// //             >
// //               <option value="all">All Stops</option>
// //               {nodes.map((s) => (
// //                 <option key={s.id} value={s.id}>
// //                   {s.label}
// //                 </option>
// //               ))}
// //             </select>
// //             <p className="mt-3 text-xs text-slate-500">Click a pin on the map or use the list to focus a stop.</p>
// //           </section>
// //         </aside>
// //       </div>
// //     </div>
// //   );
// // }


// // import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
// // import { useLocation } from "react-router-dom";
// // import L from "leaflet";
// // import "leaflet/dist/leaflet.css";

// // /**
// //  * Shown only if you open /dashboard without going through Route Optimizer
// //  * (no coordinates + route in location.state).
// //  */
// // const FALLBACK_STOPS = [
// //   {
// //     id: "1",
// //     label: "Stop 1 — 123 Main St",
// //     lngLat: [-73.9897, 40.6976],
// //     variant: "package",
// //   },
// //   {
// //     id: "2",
// //     label: "Stop 2 — 456 Elm St",
// //     lngLat: [-73.8772, 40.7282],
// //     variant: "truck",
// //   },
// //   {
// //     id: "3",
// //     label: "Stop 3 — 789 Pine Ave",
// //     lngLat: [-73.9352, 40.7021],
// //     variant: "alert",
// //   },
// //   {
// //     id: "4",
// //     label: "Stop 4 — 987 Maple Rd",
// //     lngLat: [-73.9564, 40.7188],
// //     variant: "success",
// //   },
// // ];

// // const FALLBACK_VISIT_SEQUENCE = ["3", "1", "4", "2"];

// // const TILE_URL = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
// // const TILE_ATTRIB =
// //   '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>';

// // const MARKER_ICONS = {
// //   alert: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="white" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"/></svg>`,
// //   package: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="white" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z"/></svg>`,
// //   truck: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="white" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12"/></svg>`,
// //   success: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="white" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5"/></svg>`,
// // };

// // const MARKER_COLORS = {
// //   alert: { bg: "bg-red-500", ring: "ring-red-500/80" },
// //   package: { bg: "bg-emerald-600", ring: "ring-emerald-600/80" },
// //   truck: { bg: "bg-amber-600", ring: "ring-amber-600/80" },
// //   success: { bg: "bg-yellow-500", ring: "ring-yellow-500/80" },
// // };

// // /** Stop number badge color based on index */
// // function stopBadgeColor(idx) {
// //   const colors = [
// //     "bg-emerald-600",
// //     "bg-emerald-500",
// //     "bg-amber-500",
// //     "bg-orange-500",
// //     "bg-red-500",
// //   ];
// //   return colors[Math.min(idx, colors.length - 1)];
// // }

// // function variantFromPrediction(pred) {
// //   if (!pred?.prediction) return "package";
// //   const f = Number(pred.prediction.failure_probability);
// //   if (!Number.isFinite(f)) return "package";
// //   return f > 0.5 ? "alert" : "package";
// // }

// // /**
// //  * Builds map nodes from optimize API `coordinates` + RouteOptimizer `optimizedRoute` source.
// //  * Index 0 = rider depot; indices 1..n-1 align with stopPredictions[i-1].
// //  */
// // function buildNodesFromRouteState(state) {
// //   if (!state?.coordinates?.length) return null;

// //   const optimizedRoute = state.optimizedRoute ?? state.route;
// //   if (!Array.isArray(optimizedRoute) || optimizedRoute.length === 0) return null;

// //   const { coordinates, rider, stopPredictions = [] } = state;

// //   const nodes = coordinates.map((c, idx) => {
// //     const id = String(idx);
// //     if (idx === 0) {
// //       return {
// //         id,
// //         lngLat: [c.lng, c.lat],
// //         label: `Depot — ${rider || "Rider"}`,
// //         variant: "truck",
// //       };
// //     }
// //     const pred = stopPredictions[idx - 1];
// //     return {
// //       id,
// //       lngLat: [c.lng, c.lat],
// //       label: pred?.address ? `Stop ${idx} — ${pred.address}` : `Stop ${idx}`,
// //       variant: variantFromPrediction(pred),
// //     };
// //   });

// //   const visitSequence = optimizedRoute.map((i) => String(i));
// //   return { nodes, visitSequence };
// // }

// // function buildMarkerElement(variant, isSelected) {
// //   const colors = MARKER_COLORS[variant] ?? MARKER_COLORS.package;
// //   const icon = MARKER_ICONS[variant] ?? MARKER_ICONS.package;
// //   const el = document.createElement("div");
// //   el.className = [
// //     "flex h-10 w-10 items-center justify-center rounded-full border-2 border-white shadow-lg ring-2 transition-transform duration-200",
// //     colors.bg,
// //     colors.ring,
// //     isSelected ? "z-10 scale-110" : "scale-100",
// //   ].join(" ");
// //   el.innerHTML = icon;
// //   el.setAttribute("role", "button");
// //   el.style.cursor = "pointer";
// //   return el;
// // }

// // /** routeCoords: [lat,lng][]; visitSequenceIds aligns with waypoint order */
// // function animateRoute(routeCoords, vehicleMarker, map, markersRef, visitSequenceIds) {
// //   let i = 0;

// //   function markStopVisited(stopId) {
// //     const markerObj = markersRef.current.find((m) => m.stop.id === stopId);
// //     if (markerObj) {
// //       const { el } = markerObj;
// //       el.classList.add("scale-125", "ring-4", "ring-green-400");
// //       el.innerHTML = MARKER_ICONS.success;
// //     }
// //   }

// //   function moveToNext() {
// //     if (i >= routeCoords.length - 1) return;

// //     let progress = 0;
// //     const start = routeCoords[i];
// //     const end = routeCoords[i + 1];

// //     const interval = setInterval(() => {
// //       progress += 0.02;

// //       if (progress >= 1) {
// //         clearInterval(interval);
// //         const arrivedId = visitSequenceIds[i + 1];
// //         if (arrivedId !== "0") markStopVisited(arrivedId);
// //         i += 1;
// //         moveToNext();
// //         return;
// //       }

// //       const lat = start[0] + (end[0] - start[0]) * progress;
// //       const lng = start[1] + (end[1] - start[1]) * progress;
// //       vehicleMarker.setLatLng([lat, lng]);
// //       map.panTo([lat, lng]);
// //     }, 50);
// //   }

// //   moveToNext();
// // }

// // function toLeafletLatLng(lngLat) {
// //   return [lngLat[1], lngLat[0]];
// // }

// // function IconChevronRight() {
// //   return (
// //     <svg className="ml-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
// //       <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
// //     </svg>
// //   );
// // }

// // function IconChat() {
// //   return (
// //     <svg className="h-5 w-5 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
// //       <path
// //         strokeLinecap="round"
// //         strokeLinejoin="round"
// //         d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
// //       />
// //     </svg>
// //   );
// // }

// // function IconBulb() {
// //   return (
// //     <svg className="h-5 w-5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
// //       <path
// //         strokeLinecap="round"
// //         strokeLinejoin="round"
// //         d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
// //       />
// //     </svg>
// //   );
// // }

// // function IconPin() {
// //   return (
// //     <svg className="h-5 w-5 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
// //       <path
// //         strokeLinecap="round"
// //         strokeLinejoin="round"
// //         d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
// //       />
// //       <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
// //     </svg>
// //   );
// // }

// // function insightFromPredictions(stopPredictions) {
// //   const scored = (stopPredictions || [])
// //     .map((p, i) => ({
// //       i: i + 1,
// //       address: p.address,
// //       f: Number(p.prediction?.failure_probability),
// //     }))
// //     .filter((x) => Number.isFinite(x.f));
// //   if (scored.length === 0) {
// //     return "No ML failure scores for this run. Complete predictions on the delivery form for risk-ranked insights.";
// //   }
// //   scored.sort((a, b) => b.f - a.f);
// //   const top = scored[0];
// //   return `Highest failure risk at Stop ${top.i} (${top.address}). Consider contacting the customer before arrival.`;
// // }

// // // ─── Route Summary Modal ─────────────────────────────────────────────────────

// // function RouteSummaryModal({ isOpen, onClose, rider, optimizedRoute, stopPredictions, visitSequence, nodes }) {
// //   if (!isOpen) return null;

// //   // Delivery stops = all nodes except depot (index 0)
// //   const deliveryNodes = nodes.filter((n) => n.id !== "0");
// //   const totalStops = deliveryNodes.length;
// //   const completedStops = 0; // Fresh on open
// //   const remaining = totalStops - completedStops;

// //   // Build ordered stop list from visitSequence (skip depot "0")
// //   const orderedStops = visitSequence
// //     .filter((id) => id !== "0")
// //     .map((id, i) => {
// //       const node = nodes.find((n) => n.id === id);
// //       const pred = stopPredictions[Number(id) - 1];
// //       return { rank: i + 1, node, pred };
// //     })
// //     .filter((s) => s.node);

// //   return (
// //     // Backdrop
// //     <div
// //       className="fixed inset-0 z-50 flex items-center justify-center"
// //       style={{ backgroundColor: "rgba(0,0,0,0.55)", backdropFilter: "blur(2px)" }}
// //       onClick={onClose}
// //     >
// //       {/* Modal panel — half-screen-ish, centered */}
// //       <div
// //         className="relative w-full max-w-sm mx-4 rounded-2xl overflow-hidden shadow-2xl"
// //         style={{ backgroundColor: "#111827", border: "1px solid rgba(255,255,255,0.08)", maxHeight: "80vh" }}
// //         onClick={(e) => e.stopPropagation()}
// //       >
// //         {/* Header */}
// //         <div className="px-5 pt-5 pb-3">
// //           <div className="flex items-start justify-between">
// //             <div>
// //               <h2 className="text-white text-lg font-bold tracking-tight">Optimized Route</h2>
// //               {rider && (
// //                 <p className="text-slate-400 text-sm mt-0.5">
// //                   {rider} → {totalStops} stop{totalStops !== 1 ? "s" : ""}
// //                 </p>
// //               )}
// //             </div>
// //             <div className="flex items-center gap-2">
// //               <span className="bg-indigo-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
// //                 {remaining} left
// //               </span>
// //               <button
// //                 type="button"
// //                 onClick={onClose}
// //                 className="flex items-center justify-center w-7 h-7 rounded-full text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
// //               >
// //                 ✕
// //               </button>
// //             </div>
// //           </div>

// //           {/* Progress bar */}
// //           <div className="mt-4">
// //             <div className="flex justify-between text-xs text-slate-500 mb-1.5">
// //               <span>Progress</span>
// //               <span>0%</span>
// //             </div>
// //             <div className="h-1 w-full rounded-full" style={{ backgroundColor: "rgba(255,255,255,0.1)" }}>
// //               <div className="h-1 rounded-full bg-indigo-500" style={{ width: "0%" }} />
// //             </div>
// //           </div>
// //         </div>

// //         {/* Stop list — scrollable */}
// //         <div className="overflow-y-auto px-4 pb-3" style={{ maxHeight: "45vh" }}>
// //           {orderedStops.map(({ rank, node, pred }) => {
// //             const hasPred = pred?.prediction;
// //             const failProb = hasPred ? Number(pred.prediction.failure_probability) : null;
// //             const isHighRisk = Number.isFinite(failProb) && failProb > 0.5;

// //             return (
// //               <div
// //                 key={node.id}
// //                 className="flex items-center gap-3 mb-2 rounded-xl px-3 py-3"
// //                 style={{ backgroundColor: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}
// //               >
// //                 {/* Rank badge */}
// //                 <span
// //                   className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold ${stopBadgeColor(rank - 1)}`}
// //                 >
// //                   {rank}
// //                 </span>

// //                 {/* Stop info */}
// //                 <div className="flex-1 min-w-0">
// //                   <p className="text-slate-300 text-sm truncate">
// //                     {pred?.address || node.label}
// //                   </p>
// //                   {pred?.customerId && (
// //                     <p className="text-slate-500 text-xs mt-0.5">ID: {pred.customerId}</p>
// //                   )}
// //                 </div>

// //                 {/* Time + risk pill */}
// //                 <div className="flex-shrink-0 flex flex-col items-end gap-1">
// //                   {pred?.time && (
// //                     <span className="text-slate-400 text-xs">{pred.time}</span>
// //                   )}
// //                   {hasPred && (
// //                     <span
// //                       className={`text-xs px-2 py-0.5 rounded-full font-medium ${
// //                         isHighRisk
// //                           ? "bg-red-900/60 text-red-300"
// //                           : "bg-emerald-900/60 text-emerald-300"
// //                       }`}
// //                     >
// //                       {isHighRisk ? `${Math.round(failProb * 100)}% risk` : "Low risk"}
// //                     </span>
// //                   )}
// //                   {pred?.error && (
// //                     <span className="text-xs text-red-400">error</span>
// //                   )}
// //                 </div>
// //               </div>
// //             );
// //           })}
// //         </div>

// //         {/* Footer */}
// //         <div
// //           className="px-5 py-3 flex items-center justify-between"
// //           style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}
// //         >
// //           <span className="text-xs text-slate-500">
// //             Completed:{" "}
// //             <span className="text-indigo-400 font-semibold">
// //               {completedStops}/{totalStops}
// //             </span>
// //           </span>
// //           <span className="text-xs text-slate-500">
// //             Remaining:{" "}
// //             <span className="text-slate-300 font-semibold">{remaining}</span>
// //           </span>
// //         </div>

// //         {/* Start button */}
// //         <div className="px-4 pb-5">
// //           <button
// //             type="button"
// //             onClick={onClose}
// //             className="w-full rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold py-2.5 transition-colors"
// //           >
// //             Start Delivery
// //           </button>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }

// // // ─── Main Dashboard ───────────────────────────────────────────────────────────

// // export default function DeliveryDashboard() {
// //   const location = useLocation();

// //   const { nodes, visitSequence, fromOptimizer, stopPredictions } = useMemo(() => {
// //     const built = buildNodesFromRouteState(location.state ?? {});
// //     if (built) {
// //       return {
// //         nodes: built.nodes,
// //         visitSequence: built.visitSequence,
// //         fromOptimizer: true,
// //         stopPredictions: location.state?.stopPredictions ?? [],
// //       };
// //     }
// //     return {
// //       nodes: FALLBACK_STOPS,
// //       visitSequence: FALLBACK_VISIT_SEQUENCE,
// //       fromOptimizer: false,
// //       stopPredictions: [],
// //     };
// //   }, [location.state]);

// //   const nodeById = useMemo(() => Object.fromEntries(nodes.map((n) => [n.id, n])), [nodes]);

// //   const insightText = useMemo(() => {
// //     if (!fromOptimizer) {
// //       return "Demo mode: High risk at Stop 3. Suggest calling the customer before delivery.";
// //     }
// //     return insightFromPredictions(stopPredictions);
// //   }, [fromOptimizer, stopPredictions]);

// //   // Modal: open automatically when coming from optimizer
// //   const [modalOpen, setModalOpen] = useState(fromOptimizer);

// //   const mapContainerRef = useRef(null);
// //   const mapRef = useRef(null);
// //   const markersRef = useRef([]);
// //   const polylineRef = useRef(null);
// //   const vehicleRef = useRef(null);
// //   const [mapLoaded, setMapLoaded] = useState(false);
// //   const [selectedId, setSelectedId] = useState("all");
// //   const skipInitialSyncRef = useRef(true);

// //   const syncMarkers = useCallback((selected) => {
// //     markersRef.current.forEach(({ el, stop }) => {
// //       const next = buildMarkerElement(stop.variant, selected !== "all" && stop.id === selected);
// //       el.className = next.className;
// //       el.innerHTML = next.innerHTML;
// //     });
// //   }, []);

// //   const flyToSelection = useCallback(
// //     (selected) => {
// //       const map = mapRef.current;
// //       if (!map) return;

// //       if (selected === "all") {
// //         const bounds = L.latLngBounds(nodes.map((s) => toLeafletLatLng(s.lngLat)));
// //         map.fitBounds(bounds, { padding: [72, 72], maxZoom: 13 });
// //       } else {
// //         const stop = nodeById[selected];
// //         if (stop) {
// //           map.flyTo(toLeafletLatLng(stop.lngLat), 14, { duration: 0.85 });
// //         }
// //       }
// //     },
// //     [nodes, nodeById],
// //   );

// //   useEffect(() => {
// //     if (!mapContainerRef.current) return undefined;

// //     skipInitialSyncRef.current = true;

// //     const map = L.map(mapContainerRef.current, {
// //       zoomControl: true,
// //     }).setView(toLeafletLatLng([-73.93, 40.71]), 11);

// //     L.tileLayer(TILE_URL, { attribution: TILE_ATTRIB, maxZoom: 19 }).addTo(map);
// //     mapRef.current = map;

// //     const onReady = () => {
// //       markersRef.current = nodes.map((stop) => {
// //         const el = buildMarkerElement(stop.variant, false);
// //         el.addEventListener("click", () => setSelectedId(stop.id));
// //         const icon = L.divIcon({
// //           className: "delivery-leaflet-pin-wrapper",
// //           html: el,
// //           iconSize: [40, 40],
// //           iconAnchor: [20, 40],
// //         });
// //         const marker = L.marker(toLeafletLatLng(stop.lngLat), { icon }).addTo(map);
// //         return { marker, stop, el };
// //       });

// //       const routeCoords = visitSequence
// //         .map((id) => nodeById[id])
// //         .filter(Boolean)
// //         .map((s) => toLeafletLatLng(s.lngLat));

// //       if (routeCoords.length > 1) {
// //         polylineRef.current = L.polyline(routeCoords, {
// //           color: "#2563eb",
// //           weight: 4,
// //           opacity: 0.9,
// //         }).addTo(map);
// //       }

// //       if (routeCoords.length > 0) {
// //         const vehicle = L.marker(routeCoords[0]).addTo(map);
// //         vehicleRef.current = vehicle;
// //         animateRoute(routeCoords, vehicle, map, markersRef, visitSequence);
// //       }

// //       setMapLoaded(true);
// //     };

// //     map.whenReady(onReady);

// //     return () => {
// //       if (polylineRef.current) {
// //         map.removeLayer(polylineRef.current);
// //         polylineRef.current = null;
// //       }
// //       if (vehicleRef.current) {
// //         map.removeLayer(vehicleRef.current);
// //         vehicleRef.current = null;
// //       }
// //       markersRef.current.forEach(({ marker }) => {
// //         map.removeLayer(marker);
// //       });
// //       markersRef.current = [];
// //       map.remove();
// //       mapRef.current = null;
// //       setMapLoaded(false);
// //     };
// //   }, [nodes, visitSequence, nodeById]);

// //   useEffect(() => {
// //     if (!mapLoaded) return;
// //     flyToSelection(selectedId);
// //   }, [mapLoaded, selectedId, flyToSelection]);

// //   useEffect(() => {
// //     if (!mapLoaded) return;
// //     if (skipInitialSyncRef.current && selectedId === "all") {
// //       skipInitialSyncRef.current = false;
// //       return;
// //     }
// //     syncMarkers(selectedId);
// //   }, [mapLoaded, selectedId, syncMarkers]);

// //   return (
// //     <div className="flex h-screen min-h-0 w-full flex-col bg-slate-200 font-sans text-slate-900">
// //       {/* Route Summary Modal */}
// //       <RouteSummaryModal
// //         isOpen={modalOpen}
// //         onClose={() => setModalOpen(false)}
// //         rider={location.state?.rider}
// //         optimizedRoute={location.state?.optimizedRoute ?? location.state?.route ?? []}
// //         stopPredictions={stopPredictions}
// //         visitSequence={visitSequence}
// //         nodes={nodes}
// //       />

// //       <header className="flex shrink-0 items-center justify-between gap-4 bg-slate-900 px-6 py-4 text-white shadow-md">
// //         <div>
// //           <h1 className="text-lg font-semibold tracking-tight sm:text-xl">Delivery AI Co-Pilot</h1>
// //           {fromOptimizer && (
// //             <p className="mt-1 max-w-xl text-xs text-slate-400">
// //               Optimized visit order: {visitSequence.join(" → ")}
// //             </p>
// //           )}
// //           {!fromOptimizer && (
// //             <p className="mt-1 text-xs text-amber-300/90">
// //               Demo data — use Delivery → Generate route for real stops.
// //             </p>
// //           )}
// //         </div>
// //         <div className="flex items-center gap-3">
// //           {fromOptimizer && (
// //             <button
// //               type="button"
// //               onClick={() => setModalOpen(true)}
// //               className="inline-flex items-center rounded-lg bg-slate-700 px-3 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-slate-600"
// //             >
// //               View Route
// //             </button>
// //           )}
// //           <button
// //             type="button"
// //             className="inline-flex items-center rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-slate-900"
// //           >
// //             View in AR Mode
// //             <IconChevronRight />
// //           </button>
// //         </div>
// //       </header>

// //       <div className="flex min-h-0 flex-1">
// //         <div className="relative z-0 min-h-0 min-w-0 flex-[1.85]">
// //           <div ref={mapContainerRef} className="absolute inset-0 z-0 bg-slate-300" />
// //         </div>

// //         <aside className="flex w-full max-w-md shrink-0 flex-col gap-4 overflow-y-auto border-l border-slate-200/80 bg-slate-100/90 p-5 shadow-inner backdrop-blur-sm">
// //           <section className="rounded-xl bg-white p-5 shadow-md ring-1 ring-slate-200/60">
// //             <div className="flex items-center gap-2">
// //               <IconChat />
// //               <h2 className="text-base font-semibold text-slate-800">AI Chatbot Insights</h2>
// //             </div>
// //             <div className="my-4 h-px bg-slate-200" />
// //             <p className="text-sm leading-relaxed text-slate-600">{insightText}</p>
// //           </section>

// //           <section className="rounded-xl bg-white p-5 shadow-md ring-1 ring-slate-200/60">
// //             <div className="flex items-center gap-2">
// //               <IconBulb />
// //               <h2 className="text-base font-semibold text-slate-800">Strategy Focus</h2>
// //             </div>
// //             <div className="my-4 h-px bg-slate-200" />
// //             <p className="text-sm font-semibold text-slate-800">Learning from Past Deliveries</p>
// //             <p className="mt-2 text-sm leading-relaxed text-slate-600">
// //               We analyze previous delivery failures to predict future risks.
// //             </p>
// //           </section>

// //           <section className="rounded-xl bg-white p-5 shadow-md ring-1 ring-slate-200/60">
// //             <div className="flex items-center gap-2">
// //               <IconPin />
// //               <h2 className="text-base font-semibold text-slate-800">Select Location</h2>
// //             </div>
// //             <div className="my-4 h-px bg-slate-200" />
// //             <label htmlFor="stop-select" className="sr-only">
// //               Select stop
// //             </label>
// //             <select
// //               id="stop-select"
// //               value={selectedId}
// //               onChange={(e) => setSelectedId(e.target.value)}
// //               className="w-full cursor-pointer appearance-none rounded-lg border border-slate-200 bg-white py-3 pl-4 pr-10 text-sm font-medium text-slate-800 shadow-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30"
// //               style={{
// //                 backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2364748b'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E")`,
// //                 backgroundRepeat: "no-repeat",
// //                 backgroundPosition: "right 0.75rem center",
// //                 backgroundSize: "1.25rem",
// //               }}
// //             >
// //               <option value="all">All Stops</option>
// //               {nodes.map((s) => (
// //                 <option key={s.id} value={s.id}>
// //                   {s.label}
// //                 </option>
// //               ))}
// //             </select>
// //             <p className="mt-3 text-xs text-slate-500">Click a pin on the map or use the list to focus a stop.</p>
// //           </section>
// //         </aside>
// //       </div>
// //     </div>
// //   );
// // }

// import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
// import { useLocation } from "react-router-dom";
// import L from "leaflet";
// import "leaflet/dist/leaflet.css";

// /**
//  * Shown only if you open /dashboard without going through Route Optimizer
//  * (no coordinates + route in location.state).
//  */
// const FALLBACK_STOPS = [
//   {
//     id: "1",
//     label: "Stop 1 — 123 Main St",
//     lngLat: [-73.9897, 40.6976],
//     variant: "package",
//   },
//   {
//     id: "2",
//     label: "Stop 2 — 456 Elm St",
//     lngLat: [-73.8772, 40.7282],
//     variant: "truck",
//   },
//   {
//     id: "3",
//     label: "Stop 3 — 789 Pine Ave",
//     lngLat: [-73.9352, 40.7021],
//     variant: "alert",
//   },
//   {
//     id: "4",
//     label: "Stop 4 — 987 Maple Rd",
//     lngLat: [-73.9564, 40.7188],
//     variant: "success",
//   },
// ];

// const FALLBACK_VISIT_SEQUENCE = ["3", "1", "4", "2"];

// const TILE_URL = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
// const TILE_ATTRIB =
//   '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>';

// const MARKER_ICONS = {
//   alert: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="white" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"/></svg>`,
//   package: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="white" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z"/></svg>`,
//   truck: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="white" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12"/></svg>`,
//   success: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="white" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5"/></svg>`,
// };

// const MARKER_COLORS = {
//   alert: { bg: "bg-red-500", ring: "ring-red-500/80" },
//   package: { bg: "bg-emerald-600", ring: "ring-emerald-600/80" },
//   truck: { bg: "bg-amber-600", ring: "ring-amber-600/80" },
//   success: { bg: "bg-yellow-500", ring: "ring-yellow-500/80" },
// };

// /** Stop number badge color based on index */
// function stopBadgeColor(idx) {
//   const colors = [
//     "bg-emerald-600",
//     "bg-emerald-500",
//     "bg-amber-500",
//     "bg-orange-500",
//     "bg-red-500",
//   ];
//   return colors[Math.min(idx, colors.length - 1)];
// }

// function variantFromPrediction(pred) {
//   if (!pred?.prediction) return "package";
//   const f = Number(pred.prediction.failure_probability);
//   if (!Number.isFinite(f)) return "package";
//   return f > 0.5 ? "alert" : "package";
// }

// /**
//  * Builds map nodes from optimize API `coordinates` + RouteOptimizer `optimizedRoute` source.
//  * Index 0 = rider depot; indices 1..n-1 align with stopPredictions[i-1].
//  */
// function buildNodesFromRouteState(state) {
//   if (!state?.coordinates?.length) return null;

//   const optimizedRoute = state.optimizedRoute ?? state.route;
//   if (!Array.isArray(optimizedRoute) || optimizedRoute.length === 0) return null;

//   const { coordinates, rider, stopPredictions = [] } = state;

//   const nodes = coordinates.map((c, idx) => {
//     const id = String(idx);
//     if (idx === 0) {
//       return {
//         id,
//         lngLat: [c.lng, c.lat],
//         label: `Depot — ${rider || "Rider"}`,
//         variant: "truck",
//       };
//     }
//     const pred = stopPredictions[idx - 1];
//     return {
//       id,
//       lngLat: [c.lng, c.lat],
//       label: pred?.address ? `Stop ${idx} — ${pred.address}` : `Stop ${idx}`,
//       variant: variantFromPrediction(pred),
//     };
//   });

//   const visitSequence = optimizedRoute.map((i) => String(i));
//   return { nodes, visitSequence };
// }

// function buildMarkerElement(variant, isSelected) {
//   const colors = MARKER_COLORS[variant] ?? MARKER_COLORS.package;
//   const icon = MARKER_ICONS[variant] ?? MARKER_ICONS.package;
//   const el = document.createElement("div");
//   el.className = [
//     "flex h-10 w-10 items-center justify-center rounded-full border-2 border-white shadow-lg ring-2 transition-transform duration-200",
//     colors.bg,
//     colors.ring,
//     isSelected ? "z-10 scale-110" : "scale-100",
//   ].join(" ");
//   el.innerHTML = icon;
//   el.setAttribute("role", "button");
//   el.style.cursor = "pointer";
//   return el;
// }

// /** routeCoords: [lat,lng][]; visitSequenceIds aligns with waypoint order.
//  *  Returns a cancel() function so the animation can be stopped on unmount. */
// function animateRoute(routeCoords, vehicleMarker, map, markersRef, visitSequenceIds, onDone) {
//   let i = 0;
//   let cancelled = false;
//   let activeInterval = null;

//   function markStopVisited(stopId) {
//     const markerObj = markersRef.current.find((m) => m.stop.id === stopId);
//     if (markerObj) {
//       const { el } = markerObj;
//       el.classList.add("scale-125", "ring-4", "ring-green-400");
//       el.innerHTML = MARKER_ICONS.success;
//     }
//   }

//   function moveToNext() {
//     if (cancelled || i >= routeCoords.length - 1) {
//       if (!cancelled && onDone) onDone();
//       return;
//     }

//     let progress = 0;
//     const start = routeCoords[i];
//     const end = routeCoords[i + 1];

//     activeInterval = setInterval(() => {
//       if (cancelled) { clearInterval(activeInterval); return; }
//       progress += 0.02;

//       if (progress >= 1) {
//         clearInterval(activeInterval);
//         const arrivedId = visitSequenceIds[i + 1];
//         if (arrivedId !== "0") markStopVisited(arrivedId);
//         i += 1;
//         moveToNext();
//         return;
//       }

//       const lat = start[0] + (end[0] - start[0]) * progress;
//       const lng = start[1] + (end[1] - start[1]) * progress;
//       vehicleMarker.setLatLng([lat, lng]);
//       map.panTo([lat, lng]);
//     }, 50);
//   }

//   moveToNext();
//   return () => { cancelled = true; if (activeInterval) clearInterval(activeInterval); };
// }

// function toLeafletLatLng(lngLat) {
//   return [lngLat[1], lngLat[0]];
// }

// function IconChevronRight() {
//   return (
//     <svg className="ml-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
//       <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
//     </svg>
//   );
// }

// function IconChat() {
//   return (
//     <svg className="h-5 w-5 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
//       <path
//         strokeLinecap="round"
//         strokeLinejoin="round"
//         d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
//       />
//     </svg>
//   );
// }

// function IconBulb() {
//   return (
//     <svg className="h-5 w-5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
//       <path
//         strokeLinecap="round"
//         strokeLinejoin="round"
//         d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
//       />
//     </svg>
//   );
// }

// function IconPin() {
//   return (
//     <svg className="h-5 w-5 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
//       <path
//         strokeLinecap="round"
//         strokeLinejoin="round"
//         d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
//       />
//       <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
//     </svg>
//   );
// }

// function insightFromPredictions(stopPredictions) {
//   const scored = (stopPredictions || [])
//     .map((p, i) => ({
//       i: i + 1,
//       address: p.address,
//       f: Number(p.prediction?.failure_probability),
//     }))
//     .filter((x) => Number.isFinite(x.f));
//   if (scored.length === 0) {
//     return "No ML failure scores for this run. Complete predictions on the delivery form for risk-ranked insights.";
//   }
//   scored.sort((a, b) => b.f - a.f);
//   const top = scored[0];
//   return `Highest failure risk at Stop ${top.i} (${top.address}). Consider contacting the customer before arrival.`;
// }

// // ─── Route Summary Modal ─────────────────────────────────────────────────────

// function RouteSummaryModal({ isOpen, onClose, rider, optimizedRoute, stopPredictions, visitSequence, nodes }) {
//   if (!isOpen) return null;

//   // Delivery stops = all nodes except depot (index 0)
//   const deliveryNodes = nodes.filter((n) => n.id !== "0");
//   const totalStops = deliveryNodes.length;
//   const completedStops = 0; // Fresh on open
//   const remaining = totalStops - completedStops;

//   // Build ordered stop list from visitSequence (skip depot "0")
//   const orderedStops = visitSequence
//     .filter((id) => id !== "0")
//     .map((id, i) => {
//       const node = nodes.find((n) => n.id === id);
//       const pred = stopPredictions[Number(id) - 1];
//       return { rank: i + 1, node, pred };
//     })
//     .filter((s) => s.node);

//   return (
//     // Backdrop
//     <div
//       className="fixed inset-0 z-50 flex items-center justify-center"
//       style={{ backgroundColor: "rgba(0,0,0,0.55)", backdropFilter: "blur(2px)" }}
//       onClick={onClose}
//     >
//       {/* Modal panel — half-screen-ish, centered */}
//       <div
//         className="relative w-full max-w-sm mx-4 rounded-2xl overflow-hidden shadow-2xl"
//         style={{ backgroundColor: "#111827", border: "1px solid rgba(255,255,255,0.08)", maxHeight: "80vh" }}
//         onClick={(e) => e.stopPropagation()}
//       >
//         {/* Header */}
//         <div className="px-5 pt-5 pb-3">
//           <div className="flex items-start justify-between">
//             <div>
//               <h2 className="text-white text-lg font-bold tracking-tight">Optimized Route</h2>
//               {rider && (
//                 <p className="text-slate-400 text-sm mt-0.5">
//                   {rider} → {totalStops} stop{totalStops !== 1 ? "s" : ""}
//                 </p>
//               )}
//             </div>
//             <div className="flex items-center gap-2">
//               <span className="bg-indigo-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
//                 {remaining} left
//               </span>
//               <button
//                 type="button"
//                 onClick={onClose}
//                 className="flex items-center justify-center w-7 h-7 rounded-full text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
//               >
//                 ✕
//               </button>
//             </div>
//           </div>

//           {/* Progress bar */}
//           <div className="mt-4">
//             <div className="flex justify-between text-xs text-slate-500 mb-1.5">
//               <span>Progress</span>
//               <span>0%</span>
//             </div>
//             <div className="h-1 w-full rounded-full" style={{ backgroundColor: "rgba(255,255,255,0.1)" }}>
//               <div className="h-1 rounded-full bg-indigo-500" style={{ width: "0%" }} />
//             </div>
//           </div>
//         </div>

//         {/* Stop list — scrollable */}
//         <div className="overflow-y-auto px-4 pb-3" style={{ maxHeight: "45vh" }}>
//           {orderedStops.map(({ rank, node, pred }) => {
//             const hasPred = pred?.prediction;
//             const failProb = hasPred ? Number(pred.prediction.failure_probability) : null;
//             const isHighRisk = Number.isFinite(failProb) && failProb > 0.5;

//             return (
//               <div
//                 key={node.id}
//                 className="flex items-center gap-3 mb-2 rounded-xl px-3 py-3"
//                 style={{ backgroundColor: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}
//               >
//                 {/* Rank badge */}
//                 <span
//                   className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold ${stopBadgeColor(rank - 1)}`}
//                 >
//                   {rank}
//                 </span>

//                 {/* Stop info */}
//                 <div className="flex-1 min-w-0">
//                   <p className="text-slate-300 text-sm" style={{ whiteSpace: "normal", wordBreak: "break-word" }}>
//                     {pred?.address || node.label}
//                   </p>
//                   {pred?.customerId && (
//                     <p className="text-slate-500 text-xs mt-0.5">ID: {pred.customerId}</p>
//                   )}
//                 </div>

//                 {/* Time + risk pill */}
//                 <div className="flex-shrink-0 flex flex-col items-end gap-1">
//                   {pred?.time && (
//                     <span className="text-slate-400 text-xs">{pred.time}</span>
//                   )}
//                   {hasPred && (
//                     <span
//                       className={`text-xs px-2 py-0.5 rounded-full font-medium ${
//                         isHighRisk
//                           ? "bg-red-900/60 text-red-300"
//                           : "bg-emerald-900/60 text-emerald-300"
//                       }`}
//                     >
//                       {isHighRisk ? `${Math.round(failProb * 100)}% risk` : "Low risk"}
//                     </span>
//                   )}
//                   {pred?.error && (
//                     <span className="text-xs text-red-400">error</span>
//                   )}
//                 </div>
//               </div>
//             );
//           })}
//         </div>

//         {/* Footer */}
//         <div
//           className="px-5 py-3 flex items-center justify-between"
//           style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}
//         >
//           <span className="text-xs text-slate-500">
//             Completed:{" "}
//             <span className="text-indigo-400 font-semibold">
//               {completedStops}/{totalStops}
//             </span>
//           </span>
//           <span className="text-xs text-slate-500">
//             Remaining:{" "}
//             <span className="text-slate-300 font-semibold">{remaining}</span>
//           </span>
//         </div>
//       </div>
//     </div>
//   );
// }

// // ─── Main Dashboard ───────────────────────────────────────────────────────────

// export default function DeliveryDashboard() {
//   const location = useLocation();

//   const { nodes, visitSequence, fromOptimizer, stopPredictions } = useMemo(() => {
//     const built = buildNodesFromRouteState(location.state ?? {});
//     if (built) {
//       return {
//         nodes: built.nodes,
//         visitSequence: built.visitSequence,
//         fromOptimizer: true,
//         stopPredictions: location.state?.stopPredictions ?? [],
//       };
//     }
//     return {
//       nodes: FALLBACK_STOPS,
//       visitSequence: FALLBACK_VISIT_SEQUENCE,
//       fromOptimizer: false,
//       stopPredictions: [],
//     };
//   }, [location.state]);

//   const nodeById = useMemo(() => Object.fromEntries(nodes.map((n) => [n.id, n])), [nodes]);

//   const insightText = useMemo(() => {
//     if (!fromOptimizer) {
//       return "Demo mode: High risk at Stop 3. Suggest calling the customer before delivery.";
//     }
//     return insightFromPredictions(stopPredictions);
//   }, [fromOptimizer, stopPredictions]);

//   // Modal: open automatically when coming from optimizer
//   const [modalOpen, setModalOpen] = useState(fromOptimizer);

//   // Simulation
//   const [isSimulating, setIsSimulating] = useState(false);
//   const cancelSimRef = useRef(null);

//   const mapContainerRef = useRef(null);
//   const mapRef = useRef(null);
//   const markersRef = useRef([]);
//   const polylineRef = useRef(null);
//   const vehicleRef = useRef(null);
//   const [mapLoaded, setMapLoaded] = useState(false);
//   const [selectedId, setSelectedId] = useState("all");
//   const skipInitialSyncRef = useRef(true);

//   const syncMarkers = useCallback((selected) => {
//     markersRef.current.forEach(({ el, stop }) => {
//       const next = buildMarkerElement(stop.variant, selected !== "all" && stop.id === selected);
//       el.className = next.className;
//       el.innerHTML = next.innerHTML;
//     });
//   }, []);

//   const flyToSelection = useCallback(
//     (selected) => {
//       const map = mapRef.current;
//       if (!map) return;

//       if (selected === "all") {
//         const bounds = L.latLngBounds(nodes.map((s) => toLeafletLatLng(s.lngLat)));
//         map.fitBounds(bounds, { padding: [72, 72], maxZoom: 13 });
//       } else {
//         const stop = nodeById[selected];
//         if (stop) {
//           map.flyTo(toLeafletLatLng(stop.lngLat), 14, { duration: 0.85 });
//         }
//       }
//     },
//     [nodes, nodeById],
//   );

//   useEffect(() => {
//     if (!mapContainerRef.current) return undefined;

//     skipInitialSyncRef.current = true;

//     const map = L.map(mapContainerRef.current, {
//       zoomControl: true,
//     }).setView(toLeafletLatLng([-73.93, 40.71]), 11);

//     L.tileLayer(TILE_URL, { attribution: TILE_ATTRIB, maxZoom: 19 }).addTo(map);
//     mapRef.current = map;

//     const onReady = () => {
//       markersRef.current = nodes.map((stop) => {
//         const el = buildMarkerElement(stop.variant, false);
//         el.addEventListener("click", () => setSelectedId(stop.id));
//         const icon = L.divIcon({
//           className: "delivery-leaflet-pin-wrapper",
//           html: el,
//           iconSize: [40, 40],
//           iconAnchor: [20, 40],
//         });
//         const marker = L.marker(toLeafletLatLng(stop.lngLat), { icon }).addTo(map);
//         return { marker, stop, el };
//       });

//       const routeCoords = visitSequence
//         .map((id) => nodeById[id])
//         .filter(Boolean)
//         .map((s) => toLeafletLatLng(s.lngLat));

//       if (routeCoords.length > 1) {
//         polylineRef.current = L.polyline(routeCoords, {
//           color: "#2563eb",
//           weight: 4,
//           opacity: 0.9,
//         }).addTo(map);
//       }

//       if (routeCoords.length > 0) {
//         const vehicle = L.marker(routeCoords[0]).addTo(map);
//         vehicleRef.current = vehicle;
//         // Animation is triggered manually via Simulate Route button
//       }

//       setMapLoaded(true);
//     };

//     map.whenReady(onReady);

//     return () => {
//       if (cancelSimRef.current) { cancelSimRef.current(); cancelSimRef.current = null; }
//       if (polylineRef.current) {
//         map.removeLayer(polylineRef.current);
//         polylineRef.current = null;
//       }
//       if (vehicleRef.current) {
//         map.removeLayer(vehicleRef.current);
//         vehicleRef.current = null;
//       }
//       markersRef.current.forEach(({ marker }) => {
//         map.removeLayer(marker);
//       });
//       markersRef.current = [];
//       map.remove();
//       mapRef.current = null;
//       setMapLoaded(false);
//     };
//   }, [nodes, visitSequence, nodeById]);

//   useEffect(() => {
//     if (!mapLoaded) return;
//     flyToSelection(selectedId);
//   }, [mapLoaded, selectedId, flyToSelection]);

//   useEffect(() => {
//     if (!mapLoaded) return;
//     if (skipInitialSyncRef.current && selectedId === "all") {
//       skipInitialSyncRef.current = false;
//       return;
//     }
//     syncMarkers(selectedId);
//   }, [mapLoaded, selectedId, syncMarkers]);

//   const handleSimulate = useCallback(() => {
//     if (!mapLoaded || !vehicleRef.current || !mapRef.current) return;
//     // Cancel any running simulation
//     if (cancelSimRef.current) { cancelSimRef.current(); cancelSimRef.current = null; }

//     const map = mapRef.current;
//     const routeCoords = visitSequence
//       .map((id) => nodeById[id])
//       .filter(Boolean)
//       .map((s) => toLeafletLatLng(s.lngLat));

//     if (routeCoords.length < 2) return;

//     // Reset vehicle to start
//     vehicleRef.current.setLatLng(routeCoords[0]);

//     // Reset all stop markers to original state
//     markersRef.current.forEach(({ el, stop }) => {
//       const fresh = buildMarkerElement(stop.variant, false);
//       el.className = fresh.className;
//       el.innerHTML = fresh.innerHTML;
//     });

//     setIsSimulating(true);
//     cancelSimRef.current = animateRoute(
//       routeCoords,
//       vehicleRef.current,
//       map,
//       markersRef,
//       visitSequence,
//       () => { setIsSimulating(false); cancelSimRef.current = null; },
//     );
//   }, [mapLoaded, visitSequence, nodeById]);

//   return (
//     <div className="flex h-screen min-h-0 w-full flex-col bg-slate-200 font-sans text-slate-900">
//       {/* Route Summary Modal */}
//       <RouteSummaryModal
//         isOpen={modalOpen}
//         onClose={() => setModalOpen(false)}
//         rider={location.state?.rider}
//         optimizedRoute={location.state?.optimizedRoute ?? location.state?.route ?? []}
//         stopPredictions={stopPredictions}
//         visitSequence={visitSequence}
//         nodes={nodes}
//       />

//       <header className="flex shrink-0 items-center justify-between gap-4 bg-slate-900 px-6 py-4 text-white shadow-md">
//         <div>
//           <h1 className="text-lg font-semibold tracking-tight sm:text-xl">Delivery AI Co-Pilot</h1>
//           {fromOptimizer && (
//             <p className="mt-1 max-w-xl text-xs text-slate-400">
//               Optimized visit order: {visitSequence.join(" → ")}
//             </p>
//           )}
//           {!fromOptimizer && (
//             <p className="mt-1 text-xs text-amber-300/90">
//               Demo data — use Delivery → Generate route for real stops.
//             </p>
//           )}
//         </div>
//         <div className="flex items-center gap-3">
//           {fromOptimizer && (
//             <button
//               type="button"
//               onClick={() => setModalOpen(true)}
//               className="inline-flex items-center rounded-lg bg-slate-700 px-3 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-slate-600"
//             >
//               View Route
//             </button>
//           )}
//           <button
//             type="button"
//             onClick={handleSimulate}
//             disabled={!mapLoaded || isSimulating}
//             className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed"
//           >
//             <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
//               <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 010 1.972l-11.54 6.347a1.125 1.125 0 01-1.667-.986V5.653z" />
//             </svg>
//             {isSimulating ? "Simulating…" : "Simulate Route"}
//           </button>
//           <button
//             type="button"
//             className="inline-flex items-center rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-slate-900"
//           >
//             View in AR Mode
//             <IconChevronRight />
//           </button>
//         </div>
//       </header>

//       <div className="flex min-h-0 flex-1">
//         <div className="relative z-0 min-h-0 min-w-0 flex-[1.85]">
//           <div ref={mapContainerRef} className="absolute inset-0 z-0 bg-slate-300" />
//         </div>

//         <aside className="flex w-full max-w-md shrink-0 flex-col gap-4 overflow-y-auto border-l border-slate-200/80 bg-slate-100/90 p-5 shadow-inner backdrop-blur-sm">
//           <section className="rounded-xl bg-white p-5 shadow-md ring-1 ring-slate-200/60">
//             <div className="flex items-center gap-2">
//               <IconChat />
//               <h2 className="text-base font-semibold text-slate-800">AI Chatbot Insights</h2>
//             </div>
//             <div className="my-4 h-px bg-slate-200" />
//             <p className="text-sm leading-relaxed text-slate-600">{insightText}</p>
//           </section>

//           <section className="rounded-xl bg-white p-5 shadow-md ring-1 ring-slate-200/60">
//             <div className="flex items-center gap-2">
//               <IconBulb />
//               <h2 className="text-base font-semibold text-slate-800">Strategy Focus</h2>
//             </div>
//             <div className="my-4 h-px bg-slate-200" />
//             <p className="text-sm font-semibold text-slate-800">Learning from Past Deliveries</p>
//             <p className="mt-2 text-sm leading-relaxed text-slate-600">
//               We analyze previous delivery failures to predict future risks.
//             </p>
//           </section>

//           <section className="rounded-xl bg-white p-5 shadow-md ring-1 ring-slate-200/60">
//             <div className="flex items-center gap-2">
//               <IconPin />
//               <h2 className="text-base font-semibold text-slate-800">Select Location</h2>
//             </div>
//             <div className="my-4 h-px bg-slate-200" />
//             <label htmlFor="stop-select" className="sr-only">
//               Select stop
//             </label>
//             <select
//               id="stop-select"
//               value={selectedId}
//               onChange={(e) => setSelectedId(e.target.value)}
//               className="w-full cursor-pointer appearance-none rounded-md border border-slate-200 bg-white py-1.5 pl-3 pr-8 text-xs font-medium text-slate-800 shadow-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30"
//               style={{
//                 backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2364748b'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E")`,
//                 backgroundRepeat: "no-repeat",
//                 backgroundPosition: "right 0.75rem center",
//                 backgroundSize: "1.25rem",
//               }}
//             >
//               <option value="all">All Stops</option>
//               {nodes.map((s) => (
//                 <option key={s.id} value={s.id}>
//                   {s.label}
//                 </option>
//               ))}
//             </select>
//             <p className="mt-3 text-xs text-slate-500">Click a pin on the map or use the list to focus a stop.</p>
//           </section>
//         </aside>
//       </div>
//     </div>
//   );
// }

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const FALLBACK_STOPS = [
  { id: "1", label: "Stop 1 — 123 Main St", lngLat: [-73.9897, 40.6976], variant: "package" },
  { id: "2", label: "Stop 2 — 456 Elm St", lngLat: [-73.8772, 40.7282], variant: "truck" },
  { id: "3", label: "Stop 3 — 789 Pine Ave", lngLat: [-73.9352, 40.7021], variant: "alert" },
  { id: "4", label: "Stop 4 — 987 Maple Rd", lngLat: [-73.9564, 40.7188], variant: "success" },
];

const FALLBACK_VISIT_SEQUENCE = ["3", "1", "4", "2"];

const TILE_URL = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
const TILE_ATTRIB = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>';

const MARKER_ICONS = {
  alert: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="white" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"/></svg>`,
  package: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="white" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z"/></svg>`,
  truck: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="white" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12"/></svg>`,
  success: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="white" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5"/></svg>`,
};

const MARKER_COLORS = {
  alert:   { bg: "bg-red-500",     ring: "ring-red-500/80" },
  package: { bg: "bg-blue-600",    ring: "ring-blue-600/80" },
  truck:   { bg: "bg-violet-600",  ring: "ring-violet-600/80" },
  success: { bg: "bg-emerald-500", ring: "ring-emerald-500/80" },
};

function stopBadgeStyle(idx) {
  const styles = [
    { background: "#2563eb", color: "white" },
    { background: "#7c3aed", color: "white" },
    { background: "#0891b2", color: "white" },
    { background: "#d97706", color: "white" },
    { background: "#dc2626", color: "white" },
  ];
  return styles[Math.min(idx, styles.length - 1)];
}

function variantFromPrediction(pred) {
  if (!pred?.prediction) return "package";
  const f = Number(pred.prediction.failure_probability);
  if (!Number.isFinite(f)) return "package";
  return f > 0.5 ? "alert" : "package";
}

function buildNodesFromRouteState(state) {
  if (!state?.coordinates?.length) return null;
  const optimizedRoute = state.optimizedRoute ?? state.route;
  if (!Array.isArray(optimizedRoute) || optimizedRoute.length === 0) return null;
  const { coordinates, rider, stopPredictions = [] } = state;
  const nodes = coordinates.map((c, idx) => {
    const id = String(idx);
    if (idx === 0) return { id, lngLat: [c.lng, c.lat], label: `Depot — ${rider || "Rider"}`, variant: "truck" };
    const pred = stopPredictions[idx - 1];
    return {
      id,
      lngLat: [c.lng, c.lat],
      label: pred?.address ? `Stop ${idx} — ${pred.address}` : `Stop ${idx}`,
      variant: variantFromPrediction(pred),
    };
  });
  const visitSequence = optimizedRoute.map((i) => String(i));
  return { nodes, visitSequence };
}

function buildMarkerElement(variant, isSelected) {
  const colors = MARKER_COLORS[variant] ?? MARKER_COLORS.package;
  const icon = MARKER_ICONS[variant] ?? MARKER_ICONS.package;
  const el = document.createElement("div");
  el.className = [
    "flex h-10 w-10 items-center justify-center rounded-full border-2 border-white shadow-lg ring-2 transition-transform duration-200",
    colors.bg, colors.ring,
    isSelected ? "z-10 scale-110" : "scale-100",
  ].join(" ");
  el.innerHTML = icon;
  el.setAttribute("role", "button");
  el.style.cursor = "pointer";
  return el;
}

function animateRoute(routeCoords, vehicleMarker, map, markersRef, visitSequenceIds, onDone) {
  let i = 0;
  let cancelled = false;
  let activeInterval = null;

  function markStopVisited(stopId) {
    const markerObj = markersRef.current.find((m) => m.stop.id === stopId);
    if (markerObj) {
      markerObj.el.classList.add("scale-125", "ring-4", "ring-emerald-400");
      markerObj.el.innerHTML = MARKER_ICONS.success;
    }
  }

  function moveToNext() {
    if (cancelled || i >= routeCoords.length - 1) {
      if (!cancelled && onDone) onDone();
      return;
    }
    let progress = 0;
    const start = routeCoords[i];
    const end = routeCoords[i + 1];
    activeInterval = setInterval(() => {
      if (cancelled) { clearInterval(activeInterval); return; }
      progress += 0.02;
      if (progress >= 1) {
        clearInterval(activeInterval);
        const arrivedId = visitSequenceIds[i + 1];
        if (arrivedId !== "0") markStopVisited(arrivedId);
        i += 1;
        moveToNext();
        return;
      }
      const lat = start[0] + (end[0] - start[0]) * progress;
      const lng = start[1] + (end[1] - start[1]) * progress;
      vehicleMarker.setLatLng([lat, lng]);
      map.panTo([lat, lng]);
    }, 50);
  }

  moveToNext();
  return () => { cancelled = true; if (activeInterval) clearInterval(activeInterval); };
}

function toLeafletLatLng(lngLat) { return [lngLat[1], lngLat[0]]; }

function insightFromPredictions(stopPredictions) {
  const scored = (stopPredictions || [])
    .map((p, i) => ({ i: i + 1, address: p.address, f: Number(p.prediction?.failure_probability) }))
    .filter((x) => Number.isFinite(x.f));
  if (scored.length === 0) return "No ML failure scores for this run. Complete predictions on the delivery form for risk-ranked insights.";
  scored.sort((a, b) => b.f - a.f);
  const top = scored[0];
  return `Highest failure risk at Stop ${top.i} (${top.address}). Consider contacting the customer before arrival.`;
}

// ─── Route Summary Modal (light theme, truly centered) ────────────────────────

function RouteSummaryModal({ isOpen, onClose, rider, stopPredictions, visitSequence, nodes }) {
  if (!isOpen) return null;

  const deliveryNodes = nodes.filter((n) => n.id !== "0");
  const totalStops = deliveryNodes.length;
  const remaining = totalStops;

  const orderedStops = visitSequence
    .filter((id) => id !== "0")
    .map((id, i) => {
      const node = nodes.find((n) => n.id === id);
      const pred = stopPredictions[Number(id) - 1];
      return { rank: i + 1, node, pred };
    })
    .filter((s) => s.node);

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, zIndex: 9999,
        display: "flex", alignItems: "center", justifyContent: "center",
        backgroundColor: "rgba(15,23,42,0.45)",
        backdropFilter: "blur(6px)",
        fontFamily: "'Inter','Segoe UI',sans-serif",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%", maxWidth: 480, margin: "0 16px",
          background: "white",
          borderRadius: 24,
          boxShadow: "0 24px 64px rgba(15,23,42,0.18), 0 4px 16px rgba(15,23,42,0.08)",
          overflow: "hidden",
          maxHeight: "85vh",
          display: "flex", flexDirection: "column",
        }}
      >
        {/* Modal header */}
        <div style={{
          padding: "24px 24px 0",
          background: "linear-gradient(135deg, #1e40af 0%, #3b82f6 50%, #0ea5e9 100%)",
        }}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 16 }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                <div style={{
                  width: 32, height: 32, borderRadius: 10,
                  background: "rgba(255,255,255,0.2)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M2 13 L8 3 L14 13" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M5 9.5h6" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </div>
                <h2 style={{ color: "white", fontSize: 18, fontWeight: 800, margin: 0, letterSpacing: "-0.02em" }}>
                  Optimized Route
                </h2>
              </div>
              {rider && (
                <p style={{ color: "rgba(255,255,255,0.75)", fontSize: 13, margin: 0 }}>
                  {rider} → {totalStops} stop{totalStops !== 1 ? "s" : ""}
                </p>
              )}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{
                background: "rgba(255,255,255,0.2)", backdropFilter: "blur(4px)",
                color: "white", fontSize: 12, fontWeight: 700,
                padding: "4px 12px", borderRadius: 99,
                border: "1px solid rgba(255,255,255,0.3)",
              }}>
                {remaining} left
              </span>
              <button
                type="button"
                onClick={onClose}
                style={{
                  width: 30, height: 30, borderRadius: "50%",
                  background: "rgba(255,255,255,0.15)", border: "none",
                  color: "white", fontSize: 14, cursor: "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}
              >✕</button>
            </div>
          </div>

          {/* Progress bar */}
          <div style={{ paddingBottom: 20 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
              <span style={{ fontSize: 11, color: "rgba(255,255,255,0.65)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>Progress</span>
              <span style={{ fontSize: 11, color: "rgba(255,255,255,0.65)", fontWeight: 600 }}>0%</span>
            </div>
            <div style={{ height: 6, background: "rgba(255,255,255,0.2)", borderRadius: 99 }}>
              <div style={{ height: 6, width: "0%", background: "rgba(255,255,255,0.9)", borderRadius: 99 }} />
            </div>
          </div>
        </div>

        {/* Stop list */}
        <div style={{ overflowY: "auto", padding: "16px 20px", flex: 1 }}>
          {orderedStops.map(({ rank, node, pred }, idx) => {
            const hasPred = pred?.prediction;
            const failProb = hasPred ? Number(pred.prediction.failure_probability) : null;
            const isHighRisk = Number.isFinite(failProb) && failProb > 0.5;
            const badge = stopBadgeStyle(idx);

            return (
              <div
                key={node.id}
                style={{
                  display: "flex", alignItems: "flex-start", gap: 12,
                  marginBottom: 10, padding: "12px 14px",
                  background: isHighRisk ? "#fff8f8" : "#f8faff",
                  borderRadius: 14,
                  border: isHighRisk ? "1.5px solid #fecaca" : "1.5px solid #e0eaff",
                }}
              >
                <span style={{
                  flexShrink: 0, width: 28, height: 28, borderRadius: "50%",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 12, fontWeight: 800,
                  ...badge,
                }}>
                  {rank}
                </span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{
                    fontSize: 13, fontWeight: 600, color: "#0f172a",
                    margin: "0 0 3px", wordBreak: "break-word",
                  }}>
                    {pred?.address || node.label}
                  </p>
                  {pred?.customerId && (
                    <p style={{ fontSize: 11, color: "#64748b", margin: 0 }}>ID: {pred.customerId}</p>
                  )}
                </div>
                <div style={{ flexShrink: 0, display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4 }}>
                  {pred?.time && (
                    <span style={{ fontSize: 12, color: "#475569", fontWeight: 600 }}>{pred.time}</span>
                  )}
                  {hasPred && (
                    <span style={{
                      fontSize: 11, fontWeight: 700,
                      padding: "2px 9px", borderRadius: 99,
                      background: isHighRisk ? "#fee2e2" : "#d1fae5",
                      color: isHighRisk ? "#b91c1c" : "#065f46",
                    }}>
                      {isHighRisk ? `${Math.round(failProb * 100)}% risk` : "Low risk"}
                    </span>
                  )}
                  {pred?.error && <span style={{ fontSize: 11, color: "#dc2626" }}>error</span>}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div style={{
          padding: "14px 20px 20px",
          borderTop: "1px solid #f1f5f9",
          background: "#fafbff",
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 14 }}>
            <span style={{ fontSize: 12, color: "#64748b" }}>
              Completed: <strong style={{ color: "#2563eb" }}>0/{totalStops}</strong>
            </span>
            <span style={{ fontSize: 12, color: "#64748b" }}>
              Remaining: <strong style={{ color: "#0f172a" }}>{remaining}</strong>
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{
              width: "100%", padding: "13px",
              background: "linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)",
              color: "white", border: "none", borderRadius: 12,
              fontSize: 14, fontWeight: 700, cursor: "pointer",
              fontFamily: "inherit",
              boxShadow: "0 4px 14px rgba(37,99,235,0.35)",
            }}
          >
            Start Delivery
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Sidebar Icon Components ──────────────────────────────────────────────────

function IconChat() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#4f46e5" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
    </svg>
  );
}

function IconBulb() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
    </svg>
  );
}

function IconPin() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0891b2" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );
}

function IconChevronRight() {
  return (
    <svg style={{ marginLeft: 4 }} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
    </svg>
  );
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────

export default function DeliveryDashboard() {
  const location = useLocation();

  const { nodes, visitSequence, fromOptimizer, stopPredictions } = useMemo(() => {
    const built = buildNodesFromRouteState(location.state ?? {});
    if (built) {
      return {
        nodes: built.nodes,
        visitSequence: built.visitSequence,
        fromOptimizer: true,
        stopPredictions: location.state?.stopPredictions ?? [],
      };
    }
    return { nodes: FALLBACK_STOPS, visitSequence: FALLBACK_VISIT_SEQUENCE, fromOptimizer: false, stopPredictions: [] };
  }, [location.state]);

  const nodeById = useMemo(() => Object.fromEntries(nodes.map((n) => [n.id, n])), [nodes]);

  const insightText = useMemo(() => {
    if (!fromOptimizer) return "Demo mode: High risk at Stop 3. Suggest calling the customer before delivery.";
    return insightFromPredictions(stopPredictions);
  }, [fromOptimizer, stopPredictions]);

  const [modalOpen, setModalOpen] = useState(fromOptimizer);
  const [isSimulating, setIsSimulating] = useState(false);
  const cancelSimRef = useRef(null);

  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const markersRef = useRef([]);
  const polylineRef = useRef(null);
  const vehicleRef = useRef(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [selectedId, setSelectedId] = useState("all");
  const skipInitialSyncRef = useRef(true);

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
      const bounds = L.latLngBounds(nodes.map((s) => toLeafletLatLng(s.lngLat)));
      map.fitBounds(bounds, { padding: [72, 72], maxZoom: 13 });
    } else {
      const stop = nodeById[selected];
      if (stop) map.flyTo(toLeafletLatLng(stop.lngLat), 14, { duration: 0.85 });
    }
  }, [nodes, nodeById]);

  useEffect(() => {
    if (!mapContainerRef.current) return undefined;
    skipInitialSyncRef.current = true;
    const map = L.map(mapContainerRef.current, { zoomControl: true }).setView(toLeafletLatLng([-73.93, 40.71]), 11);
    L.tileLayer(TILE_URL, { attribution: TILE_ATTRIB, maxZoom: 19 }).addTo(map);
    mapRef.current = map;

    const onReady = () => {
      markersRef.current = nodes.map((stop) => {
        const el = buildMarkerElement(stop.variant, false);
        el.addEventListener("click", () => setSelectedId(stop.id));
        const icon = L.divIcon({ className: "delivery-leaflet-pin-wrapper", html: el, iconSize: [40, 40], iconAnchor: [20, 40] });
        const marker = L.marker(toLeafletLatLng(stop.lngLat), { icon }).addTo(map);
        return { marker, stop, el };
      });

      const routeCoords = visitSequence.map((id) => nodeById[id]).filter(Boolean).map((s) => toLeafletLatLng(s.lngLat));
      if (routeCoords.length > 1) {
        polylineRef.current = L.polyline(routeCoords, { color: "#3b82f6", weight: 4, opacity: 0.85 }).addTo(map);
      }
      if (routeCoords.length > 0) {
        vehicleRef.current = L.marker(routeCoords[0]).addTo(map);
      }
      setMapLoaded(true);
    };

    map.whenReady(onReady);

    return () => {
      if (cancelSimRef.current) { cancelSimRef.current(); cancelSimRef.current = null; }
      if (polylineRef.current) { map.removeLayer(polylineRef.current); polylineRef.current = null; }
      if (vehicleRef.current) { map.removeLayer(vehicleRef.current); vehicleRef.current = null; }
      markersRef.current.forEach(({ marker }) => map.removeLayer(marker));
      markersRef.current = [];
      map.remove();
      mapRef.current = null;
      setMapLoaded(false);
    };
  }, [nodes, visitSequence, nodeById]);

  useEffect(() => { if (mapLoaded) flyToSelection(selectedId); }, [mapLoaded, selectedId, flyToSelection]);

  useEffect(() => {
    if (!mapLoaded) return;
    if (skipInitialSyncRef.current && selectedId === "all") { skipInitialSyncRef.current = false; return; }
    syncMarkers(selectedId);
  }, [mapLoaded, selectedId, syncMarkers]);

  const handleSimulate = useCallback(() => {
    if (!mapLoaded || !vehicleRef.current || !mapRef.current) return;
    if (cancelSimRef.current) { cancelSimRef.current(); cancelSimRef.current = null; }
    const map = mapRef.current;
    const routeCoords = visitSequence.map((id) => nodeById[id]).filter(Boolean).map((s) => toLeafletLatLng(s.lngLat));
    if (routeCoords.length < 2) return;
    vehicleRef.current.setLatLng(routeCoords[0]);
    markersRef.current.forEach(({ el, stop }) => {
      const fresh = buildMarkerElement(stop.variant, false);
      el.className = fresh.className;
      el.innerHTML = fresh.innerHTML;
    });
    setIsSimulating(true);
    cancelSimRef.current = animateRoute(routeCoords, vehicleRef.current, map, markersRef, visitSequence, () => {
      setIsSimulating(false);
      cancelSimRef.current = null;
    });
  }, [mapLoaded, visitSequence, nodeById]);

  return (
    <div style={{ display: "flex", height: "100vh", flexDirection: "column", fontFamily: "'Inter','Segoe UI',sans-serif", background: "#f1f5f9" }}>
      {/* Route Summary Modal */}
      <RouteSummaryModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        rider={location.state?.rider}
        optimizedRoute={location.state?.optimizedRoute ?? location.state?.route ?? []}
        stopPredictions={stopPredictions}
        visitSequence={visitSequence}
        nodes={nodes}
      />

      {/* ── Header ─────────────────────────────────────────── */}
      <header style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 24px", height: 60, flexShrink: 0,
        background: "white",
        borderBottom: "1px solid #e2e8f0",
        boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
      }}>
        {/* Left: logo + title */}
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
            <div style={{
              width: 34, height: 34, borderRadius: 10,
              background: "linear-gradient(135deg, #1e40af, #3b82f6)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M4 15L9 4l5 11" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M6.5 10.5h5" stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
              </svg>
            </div>
            <span style={{ fontSize: 16, fontWeight: 800, color: "#0f172a", letterSpacing: "-0.02em" }}>
              Delivery AI Co-Pilot
            </span>
          </div>
          <div style={{
            display: "flex", alignItems: "center", gap: 6,
            background: "#eff6ff", borderRadius: 99, padding: "4px 12px",
            fontSize: 12, fontWeight: 600, color: "#1d4ed8",
          }}>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <circle cx="6" cy="6" r="5" stroke="#1d4ed8" strokeWidth="1.5"/>
              <path d="M3 6l2 2 4-4" stroke="#1d4ed8" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            {fromOptimizer ? `Visit order: ${visitSequence.join(" → ")}` : "Demo mode"}
          </div>
        </div>

        {/* Right: action buttons */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {fromOptimizer && (
            <button
              type="button"
              onClick={() => setModalOpen(true)}
              style={{
                display: "inline-flex", alignItems: "center", gap: 6,
                padding: "8px 14px", borderRadius: 10,
                background: "#f1f5f9", border: "1.5px solid #e2e8f0",
                color: "#334155", fontSize: 13, fontWeight: 600,
                cursor: "pointer", fontFamily: "inherit",
              }}
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <circle cx="7" cy="7" r="6" stroke="#334155" strokeWidth="1.5"/>
                <path d="M4 7h6M7 4v6" stroke="#334155" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              View Route
            </button>
          )}
          <button
            type="button"
            onClick={handleSimulate}
            disabled={!mapLoaded || isSimulating}
            style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              padding: "8px 14px", borderRadius: 10,
              background: isSimulating ? "#6ee7b7" : "#10b981",
              border: "none", color: "white",
              fontSize: 13, fontWeight: 600, cursor: isSimulating ? "not-allowed" : "pointer",
              fontFamily: "inherit", opacity: !mapLoaded ? 0.5 : 1,
              boxShadow: "0 2px 8px rgba(16,185,129,0.3)",
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 010 1.972l-11.54 6.347a1.125 1.125 0 01-1.667-.986V5.653z" />
            </svg>
            {isSimulating ? "Simulating…" : "Simulate Route"}
          </button>
          <button
            type="button"
            style={{
              display: "inline-flex", alignItems: "center",
              padding: "8px 16px", borderRadius: 10,
              background: "linear-gradient(135deg,#1e40af,#3b82f6)",
              border: "none", color: "white",
              fontSize: 13, fontWeight: 600, cursor: "pointer",
              fontFamily: "inherit",
              boxShadow: "0 2px 10px rgba(37,99,235,0.35)",
            }}
          >
            View in AR Mode <IconChevronRight />
          </button>
        </div>
      </header>

      {/* ── Map + Sidebar ──────────────────────────────────── */}
      <div style={{ display: "flex", flex: 1, minHeight: 0 }}>
        {/* Map */}
        <div style={{ position: "relative", flex: "1 1 0", minWidth: 0, minHeight: 0 }}>
          <div ref={mapContainerRef} style={{ position: "absolute", inset: 0, background: "#e2e8f0" }} />
        </div>

        {/* Sidebar */}
        <aside style={{
          width: 320, flexShrink: 0,
          overflowY: "auto",
          background: "#f8fafc",
          borderLeft: "1px solid #e2e8f0",
          padding: 16,
          display: "flex", flexDirection: "column", gap: 12,
        }}>
          {/* AI Insights */}
          <div style={{
            background: "white", borderRadius: 16, padding: "16px 18px",
            border: "1px solid #e8edf3",
            boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
              <div style={{
                width: 32, height: 32, borderRadius: 9,
                background: "#eef2ff",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <IconChat />
              </div>
              <span style={{ fontSize: 13, fontWeight: 700, color: "#0f172a" }}>AI Chatbot Insights</span>
            </div>
            <div style={{ height: 1, background: "#f1f5f9", marginBottom: 12 }} />
            <p style={{ fontSize: 13, color: "#475569", lineHeight: 1.65, margin: 0 }}>{insightText}</p>
          </div>

          {/* Strategy Focus */}
          <div style={{
            background: "white", borderRadius: 16, padding: "16px 18px",
            border: "1px solid #e8edf3",
            boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
              <div style={{
                width: 32, height: 32, borderRadius: 9,
                background: "#fffbeb",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <IconBulb />
              </div>
              <span style={{ fontSize: 13, fontWeight: 700, color: "#0f172a" }}>Strategy Focus</span>
            </div>
            <div style={{ height: 1, background: "#f1f5f9", marginBottom: 12 }} />
            <p style={{ fontSize: 13, fontWeight: 700, color: "#0f172a", margin: "0 0 6px" }}>Learning from Past Deliveries</p>
            <p style={{ fontSize: 13, color: "#475569", lineHeight: 1.65, margin: 0 }}>
              We analyze previous delivery failures to predict future risks.
            </p>
          </div>

          {/* Select Location */}
          <div style={{
            background: "white", borderRadius: 16, padding: "16px 18px",
            border: "1px solid #e8edf3",
            boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
              <div style={{
                width: 32, height: 32, borderRadius: 9,
                background: "#ecfeff",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <IconPin />
              </div>
              <span style={{ fontSize: 13, fontWeight: 700, color: "#0f172a" }}>Select Location</span>
            </div>
            <div style={{ height: 1, background: "#f1f5f9", marginBottom: 12 }} />
            <label htmlFor="stop-select" className="sr-only">Select stop</label>
            <select
              id="stop-select"
              value={selectedId}
              onChange={(e) => setSelectedId(e.target.value)}
              style={{
                width: "100%", padding: "10px 14px",
                border: "1.5px solid #e2e8f0", borderRadius: 10,
                fontSize: 13, fontWeight: 600, color: "#0f172a",
                background: "white", outline: "none",
                cursor: "pointer", fontFamily: "inherit",
                appearance: "none",
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2364748b'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E")`,
                backgroundRepeat: "no-repeat",
                backgroundPosition: "right 0.75rem center",
                backgroundSize: "1.1rem",
              }}
            >
              <option value="all">All Stops</option>
              {nodes.map((s) => (
                <option key={s.id} value={s.id}>{s.label}</option>
              ))}
            </select>
            <p style={{ marginTop: 8, fontSize: 11, color: "#94a3b8" }}>
              Click a pin on the map or use the list to focus a stop.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
