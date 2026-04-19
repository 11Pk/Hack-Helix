// // // import { useState } from "react"

// // // import { useUser, UserButton } from "@clerk/clerk-react"

// // // import { useNavigate } from "react-router-dom"



// // // const API_BASE = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000"



// // // function parseApiError(data) {

// // //   const detail = data?.detail

// // //   if (typeof detail === "string") return detail

// // //   if (Array.isArray(detail)) return detail.map((d) => d.msg || d).join(", ")

// // //   return JSON.stringify(detail || data)

// // // }



// // // async function fetchPredictForStop(rider, stop) {

// // //   const params = new URLSearchParams({

// // //     delivery_man_address: rider.trim(),

// // //     customer_address: stop.address,

// // //     delivery_time: stop.time,

// // //     customer_id: stop.customerId,

// // //   })

// // //   const res = await fetch(`${API_BASE}/predict?${params.toString()}`)

// // //   const data = await res.json().catch(() => ({}))

// // //   if (!res.ok) throw new Error(parseApiError(data) || "Prediction failed")

// // //   return data

// // // }



// // // export default function DeliveryForm() {

// // //   const { user } = useUser()

// // //   const navigate = useNavigate()



// // //   const [pickup, setPickup] = useState("")

// // //   const [drop, setDrop] = useState("")

// // //   const [customerId, setCustomerId] = useState("")

// // //   const [time, setTime] = useState("")



// // //   const [list, setList] = useState([])

// // //   const [history, setHistory] = useState([])

// // //   const [stopPredictions, setStopPredictions] = useState([])

// // //   const [generating, setGenerating] = useState(false)



// // //   const handleAdd = () => {

// // //     if (!drop || !customerId || !time) {

// // //       alert("Fill delivery location, customer ID, and time for each stop.")

// // //       return

// // //     }



// // //     const newDelivery = {

// // //       id: Date.now(),

// // //       address: drop,

// // //       customerId,

// // //       time,

// // //       delivered: false,

// // //     }



// // //     setList([...list, newDelivery])

// // //     setDrop("")

// // //     setCustomerId("")

// // //     setTime("")

// // //   }



// // //   const markDelivered = (id) => {

// // //     const updated = list.map((item) =>

// // //       item.id === id ? { ...item, delivered: true } : item

// // //     )

// // //     setList(updated)

// // //     const done = updated.find((i) => i.id === id)

// // //     setHistory([...history, done])

// // //   }



// // //   async function generateOptimizedRoute() {

// // //     if (!pickup?.trim()) {

// // //       alert("Enter rider location.")

// // //       return

// // //     }

// // //     if (list.length === 0) {

// // //       alert("Add at least one delivery stop.")

// // //       return

// // //     }



// // //     setGenerating(true)

// // //     setStopPredictions([])



// // //     try {

// // //       // 1) Predict for each stop first; store results in state as we go
// // //       const results = []

// // //       for (const stop of list) {

// // //         try {

// // //           const prediction = await fetchPredictForStop(pickup, stop)

// // //           results.push({

// // //             id: stop.id,

// // //             address: stop.address,

// // //             customerId: stop.customerId,

// // //             time: stop.time,

// // //             prediction,

// // //             error: null,

// // //           })

// // //         } catch (e) {

// // //           results.push({

// // //             id: stop.id,

// // //             address: stop.address,

// // //             customerId: stop.customerId,

// // //             time: stop.time,

// // //             prediction: null,

// // //             error: e?.message || "Request failed",

// // //           })

// // //         }

// // //         setStopPredictions([...results])

// // //       }

// // //       // 2) Then call optimize-route with the same rows as `items` (not a separate blob)
// // //       const res = await fetch(`${API_BASE}/optimize-route`, {

// // //         method: "POST",

// // //         headers: { "Content-Type": "application/json" },

// // //         body: JSON.stringify({

// // //           rider: pickup.trim(),

// // //           items: list.map((i) => ({

// // //             address: i.address,

// // //             customerId: i.customerId,

// // //             time: i.time,

// // //           })),

// // //         }),

// // //       })

// // //       const data = await res.json().catch(() => ({}))

// // //       if (!res.ok || data.error) {

// // //         alert(data.error || parseApiError(data) || "Optimize route failed")

// // //         return

// // //       }

// // //       navigate("/optimize", {

// // //         state: {

// // //           ...data,

// // //           rider: pickup.trim(),

// // //           stopPredictions: results,

// // //         },

// // //       })

// // //     } catch (e) {

// // //       alert(e?.message || "Something went wrong.")

// // //     } finally {

// // //       setGenerating(false)

// // //     }

// // //   }



// // //   return (

// // //     <div className="min-h-screen bg-slate-900 text-white p-6">

// // //       <div className="flex justify-between mb-6">

// // //         <h1>Welcome {user?.firstName}</h1>

// // //         <UserButton afterSignOutUrl="/" />

// // //       </div>



// // //       <input

// // //         placeholder="Rider Location"

// // //         value={pickup}

// // //         onChange={(e) => setPickup(e.target.value)}

// // //         className="w-full p-2 mb-3 bg-slate-700 rounded"

// // //       />



// // //       <input

// // //         placeholder="Delivery Location"

// // //         value={drop}

// // //         onChange={(e) => setDrop(e.target.value)}

// // //         className="w-full p-2 mb-3 bg-slate-700 rounded"

// // //       />



// // //       <input

// // //         placeholder="Customer ID"

// // //         value={customerId}

// // //         onChange={(e) => setCustomerId(e.target.value)}

// // //         className="w-full p-2 mb-3 bg-slate-700 rounded"

// // //       />



// // //       <input

// // //         type="time"

// // //         value={time}

// // //         onChange={(e) => setTime(e.target.value)}

// // //         className="w-full p-2 mb-3 bg-slate-700 rounded"

// // //       />



// // //       <button

// // //         type="button"

// // //         onClick={handleAdd}

// // //         className="bg-green-500 p-2 w-full mb-3 rounded"

// // //       >

// // //         Add Stop

// // //       </button>



// // //       <button

// // //         type="button"

// // //         onClick={generateOptimizedRoute}

// // //         disabled={generating}

// // //         className="bg-blue-500 p-2 w-full rounded disabled:opacity-50"

// // //       >

// // //         {generating ? "Predicting stops, then optimizing…" : "Generate optimized route"}

// // //       </button>



// // //       {stopPredictions.length > 0 && (

// // //         <div className="mt-4 p-3 bg-slate-800 rounded text-sm">

// // //           <h3 className="font-semibold mb-2">Latest predictions (per stop)</h3>

// // //           {stopPredictions.map((row) => (

// // //             <div key={row.id} className="mb-2 border-b border-slate-600 pb-2 last:border-0">

// // //               <p className="text-slate-300">{row.address}</p>

// // //               {row.error ? (

// // //                 <p className="text-red-400">{row.error}</p>

// // //               ) : (

// // //                 <p>

// // //                   success {row.prediction?.success_probability} · failure{" "}

// // //                   {row.prediction?.failure_probability}

// // //                 </p>

// // //               )}

// // //             </div>

// // //           ))}

// // //         </div>

// // //       )}



// // //       <div className="mt-4">

// // //         <h2>Delivery stops ({list.length})</h2>



// // //         {list.map((item) => (

// // //           <div key={item.id} className="bg-slate-800 p-3 mb-2 rounded">

// // //             <p>

// // //               <strong>Address:</strong> {item.address}

// // //             </p>

// // //             <p>

// // //               <strong>Customer:</strong> {item.customerId}

// // //             </p>

// // //             <p>

// // //               <strong>Time:</strong> {item.time}

// // //             </p>

// // //             <p>

// // //               Status: {item.delivered ? "✅ Delivered" : "❌ Pending"}

// // //             </p>



// // //             {!item.delivered && (

// // //               <button

// // //                 type="button"

// // //                 onClick={() => markDelivered(item.id)}

// // //                 className="bg-yellow-500 px-2 py-1 mt-2 rounded"

// // //               >

// // //                 Mark Delivered

// // //               </button>

// // //             )}

// // //           </div>

// // //         ))}

// // //       </div>



// // //       <div className="mt-6">

// // //         <h2>ML Dataset</h2>

// // //         {history.map((item) => (

// // //           <p key={item.id}>

// // //             {item.customerId} | {item.time} | {item.address} | Delivered

// // //           </p>

// // //         ))}

// // //       </div>

// // //     </div>

// // //   )

// // // }

// // // import { useState } from "react"

// // // import { useUser, UserButton } from "@clerk/clerk-react"

// // // import { useNavigate } from "react-router-dom"



// // // const API_BASE = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000"



// // // function parseApiError(data) {

// // //   const detail = data?.detail

// // //   if (typeof detail === "string") return detail

// // //   if (Array.isArray(detail)) return detail.map((d) => d.msg || d).join(", ")

// // //   return JSON.stringify(detail || data)

// // // }



// // // async function fetchPredictForStop(rider, stop) {

// // //   const params = new URLSearchParams({

// // //     delivery_man_address: rider.trim(),

// // //     customer_address: stop.address,

// // //     delivery_time: stop.time,

// // //     customer_id: stop.customerId,

// // //   })

// // //   const res = await fetch(`${API_BASE}/predict?${params.toString()}`)

// // //   const data = await res.json().catch(() => ({}))

// // //   if (!res.ok) throw new Error(parseApiError(data) || "Prediction failed")

// // //   return data

// // // }



// // // export default function DeliveryForm() {

// // //   const { user } = useUser()

// // //   const navigate = useNavigate()



// // //   const [pickup, setPickup] = useState("")

// // //   const [drop, setDrop] = useState("")

// // //   const [customerId, setCustomerId] = useState("")

// // //   const [time, setTime] = useState("")



// // //   const [list, setList] = useState([])

// // //   const [history, setHistory] = useState([])

// // //   const [stopPredictions, setStopPredictions] = useState([])

// // //   const [generating, setGenerating] = useState(false)



// // //   const handleAdd = () => {

// // //     if (!drop || !customerId || !time) {

// // //       alert("Fill delivery location, customer ID, and time for each stop.")

// // //       return

// // //     }



// // //     const newDelivery = {

// // //       id: Date.now(),

// // //       address: drop,

// // //       customerId,

// // //       time,

// // //       delivered: false,

// // //     }



// // //     setList([...list, newDelivery])

// // //     setDrop("")

// // //     setCustomerId("")

// // //     setTime("")

// // //   }



// // //   const markDelivered = (id) => {

// // //     const updated = list.map((item) =>

// // //       item.id === id ? { ...item, delivered: true } : item

// // //     )

// // //     setList(updated)

// // //     const done = updated.find((i) => i.id === id)

// // //     setHistory([...history, done])

// // //   }



// // //   async function generateOptimizedRoute() {

// // //     if (!pickup?.trim()) {

// // //       alert("Enter rider location.")

// // //       return

// // //     }

// // //     if (list.length === 0) {

// // //       alert("Add at least one delivery stop.")

// // //       return

// // //     }



// // //     setGenerating(true)

// // //     setStopPredictions([])



// // //     try {

// // //       // 1) Predict for each stop first; store results in state as we go
// // //       const results = []

// // //       for (const stop of list) {

// // //         try {

// // //           const prediction = await fetchPredictForStop(pickup, stop)

// // //           results.push({

// // //             id: stop.id,

// // //             address: stop.address,

// // //             customerId: stop.customerId,

// // //             time: stop.time,

// // //             prediction,

// // //             error: null,

// // //           })

// // //         } catch (e) {

// // //           results.push({

// // //             id: stop.id,

// // //             address: stop.address,

// // //             customerId: stop.customerId,

// // //             time: stop.time,

// // //             prediction: null,

// // //             error: e?.message || "Request failed",

// // //           })

// // //         }

// // //         setStopPredictions([...results])

// // //       }

// // //       // 2) Then call optimize-route with the same rows as `items` (not a separate blob)
// // //       const res = await fetch(`${API_BASE}/optimize-route`, {

// // //         method: "POST",

// // //         headers: { "Content-Type": "application/json" },

// // //         body: JSON.stringify({

// // //           rider: pickup.trim(),

// // //           items: list.map((i) => ({

// // //             address: i.address,

// // //             customerId: i.customerId,

// // //             time: i.time,

// // //           })),

// // //         }),

// // //       })

// // //       const data = await res.json().catch(() => ({}))

// // //       if (!res.ok || data.error) {

// // //         alert(data.error || parseApiError(data) || "Optimize route failed")

// // //         return

// // //       }

// // //       navigate("/optimize", {

// // //         state: {

// // //           ...data,

// // //           rider: pickup.trim(),

// // //           stopPredictions: results,

// // //         },

// // //       })

// // //     } catch (e) {

// // //       alert(e?.message || "Something went wrong.")

// // //     } finally {

// // //       setGenerating(false)

// // //     }

// // //   }



// // //   return (

// // //     <div className="min-h-screen bg-slate-900 text-white p-6">

// // //       <div className="flex justify-between mb-6">

// // //         <h1>Welcome {user?.firstName}</h1>

// // //         <UserButton afterSignOutUrl="/" />

// // //       </div>



// // //       <input

// // //         placeholder="Rider Location"

// // //         value={pickup}

// // //         onChange={(e) => setPickup(e.target.value)}

// // //         className="w-full p-2 mb-3 bg-slate-700 rounded"

// // //       />



// // //       <input

// // //         placeholder="Delivery Location"

// // //         value={drop}

// // //         onChange={(e) => setDrop(e.target.value)}

// // //         className="w-full p-2 mb-3 bg-slate-700 rounded"

// // //       />



// // //       <input

// // //         placeholder="Customer ID"

// // //         value={customerId}

// // //         onChange={(e) => setCustomerId(e.target.value)}

// // //         className="w-full p-2 mb-3 bg-slate-700 rounded"

// // //       />



// // //       <input

// // //         type="text"
// // //   placeholder="HH:MM"
// // //   value={time}

// // //         onChange={(e) => setTime(e.target.value)}

// // //         className="w-full p-2 mb-3 bg-slate-700 rounded"

// // //       />



// // //       <button

// // //         type="button"

// // //         onClick={handleAdd}

// // //         className="bg-green-500 p-2 w-full mb-3 rounded"

// // //       >

// // //         Add Stop

// // //       </button>



// // //       <button

// // //         type="button"

// // //         onClick={generateOptimizedRoute}

// // //         disabled={generating}

// // //         className="bg-blue-500 p-2 w-full rounded disabled:opacity-50"

// // //       >

// // //         {generating ? "Predicting stops, then optimizing…" : "Generate optimized route"}

// // //       </button>



// // //       {stopPredictions.length > 0 && (

// // //         <div className="mt-4 p-3 bg-slate-800 rounded text-sm">

// // //           <h3 className="font-semibold mb-2">Latest predictions (per stop)</h3>

// // //           {stopPredictions.map((row) => (

// // //             <div key={row.id} className="mb-2 border-b border-slate-600 pb-2 last:border-0">

// // //               <p className="text-slate-300">{row.address}</p>

// // //               {row.error ? (

// // //                 <p className="text-red-400">{row.error}</p>

// // //               ) : (

// // //                 <p>

// // //                   success {row.prediction?.success_probability} · failure{" "}

// // //                   {row.prediction?.failure_probability}

// // //                 </p>

// // //               )}

// // //             </div>

// // //           ))}

// // //         </div>

// // //       )}



// // //       <div className="mt-4">

// // //         <h2>Delivery stops ({list.length})</h2>



// // //         {list.map((item) => (

// // //           <div key={item.id} className="bg-slate-800 p-3 mb-2 rounded">

// // //             <p>

// // //               <strong>Address:</strong> {item.address}

// // //             </p>

// // //             <p>

// // //               <strong>Customer:</strong> {item.customerId}

// // //             </p>

// // //             <p>

// // //               <strong>Time:</strong> {item.time}

// // //             </p>

// // //             <p>

// // //               Status: {item.delivered ? "✅ Delivered" : "❌ Pending"}

// // //             </p>



// // //             {!item.delivered && (

// // //               <button

// // //                 type="button"

// // //                 onClick={() => markDelivered(item.id)}

// // //                 className="bg-yellow-500 px-2 py-1 mt-2 rounded"

// // //               >

// // //                 Mark Delivered

// // //               </button>

// // //             )}

// // //           </div>

// // //         ))}

// // //       </div>



// // //       <div className="mt-6">

// // //         <h2>ML Dataset</h2>

// // //         {history.map((item) => (

// // //           <p key={item.id}>

// // //             {item.customerId} | {item.time} | {item.address} | Delivered

// // //           </p>

// // //         ))}

// // //       </div>

// // //     </div>

// // //   )

// // // }

// // import { useState } from "react"
// // import { useUser, UserButton } from "@clerk/clerk-react"
// // import { useNavigate } from "react-router-dom"

// // const API_BASE = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000"

// // function parseApiError(data) {
// //   const detail = data?.detail
// //   if (typeof detail === "string") return detail
// //   if (Array.isArray(detail)) return detail.map((d) => d.msg || d).join(", ")
// //   return JSON.stringify(detail || data)
// // }

// // async function fetchPredictForStop(rider, stop) {
// //   const params = new URLSearchParams({
// //     delivery_man_address: rider.trim(),
// //     customer_address: stop.address,
// //     delivery_time: stop.time,
// //     customer_id: stop.customerId,
// //   })
// //   const res = await fetch(`${API_BASE}/predict?${params.toString()}`)
// //   const data = await res.json().catch(() => ({}))
// //   if (!res.ok) throw new Error(parseApiError(data) || "Prediction failed")
// //   return data
// // }

// // /**
// //  * Held-Karp style DP — same algorithm that was in RouteOptimizer.jsx.
// //  * Returns the optimal visit order as an array of matrix indices.
// //  */
// // function getOptimalRoute(distance, probability, traffic) {
// //   const n = distance.length
// //   const FULL = 1 << n

// //   const dp = Array.from({ length: FULL }, () => Array(n).fill(Infinity))
// //   const parent = Array.from({ length: FULL }, () => Array(n).fill(-1))

// //   dp[1][0] = 0

// //   for (let mask = 1; mask < FULL; mask++) {
// //     for (let u = 0; u < n; u++) {
// //       if (!(mask & (1 << u))) continue
// //       for (let v = 0; v < n; v++) {
// //         if (mask & (1 << v)) continue
// //         const nextMask = mask | (1 << v)
// //         const cost = distance[u][v] * (1 + probability[v]) * traffic[u][v]
// //         if (dp[mask][u] + cost < dp[nextMask][v]) {
// //           dp[nextMask][v] = dp[mask][u] + cost
// //           parent[nextMask][v] = u
// //         }
// //       }
// //     }
// //   }

// //   const finalMask = FULL - 1
// //   let last = 0
// //   let best = Infinity
// //   for (let i = 0; i < n; i++) {
// //     if (dp[finalMask][i] < best) {
// //       best = dp[finalMask][i]
// //       last = i
// //     }
// //   }

// //   let mask = finalMask
// //   const result = []
// //   while (last !== -1) {
// //     result.push(last)
// //     const prev = parent[mask][last]
// //     mask ^= 1 << last
// //     last = prev
// //   }
// //   return result.reverse()
// // }

// // export default function DeliveryForm() {
// //   const { user } = useUser()
// //   const navigate = useNavigate()

// //   const [pickup, setPickup] = useState("")
// //   const [drop, setDrop] = useState("")
// //   const [customerId, setCustomerId] = useState("")
// //   const [time, setTime] = useState("")

// //   const [list, setList] = useState([])
// //   const [history, setHistory] = useState([])
// //   const [stopPredictions, setStopPredictions] = useState([])
// //   const [generating, setGenerating] = useState(false)

// //   const handleAdd = () => {
// //     if (!drop || !customerId || !time) {
// //       alert("Fill delivery location, customer ID, and time for each stop.")
// //       return
// //     }

// //     const newDelivery = {
// //       id: Date.now(),
// //       address: drop,
// //       customerId,
// //       time,
// //       delivered: false,
// //     }

// //     setList([...list, newDelivery])
// //     setDrop("")
// //     setCustomerId("")
// //     setTime("")
// //   }

// //   const markDelivered = (id) => {
// //     const updated = list.map((item) =>
// //       item.id === id ? { ...item, delivered: true } : item
// //     )
// //     setList(updated)
// //     const done = updated.find((i) => i.id === id)
// //     setHistory([...history, done])
// //   }

// //   async function generateOptimizedRoute() {
// //     if (!pickup?.trim()) {
// //       alert("Enter rider location.")
// //       return
// //     }
// //     if (list.length === 0) {
// //       alert("Add at least one delivery stop.")
// //       return
// //     }

// //     setGenerating(true)
// //     setStopPredictions([])

// //     try {
// //       // 1) Predict for each stop
// //       const results = []
// //       for (const stop of list) {
// //         try {
// //           const prediction = await fetchPredictForStop(pickup, stop)
// //           results.push({
// //             id: stop.id,
// //             address: stop.address,
// //             customerId: stop.customerId,
// //             time: stop.time,
// //             prediction,
// //             error: null,
// //           })
// //         } catch (e) {
// //           results.push({
// //             id: stop.id,
// //             address: stop.address,
// //             customerId: stop.customerId,
// //             time: stop.time,
// //             prediction: null,
// //             error: e?.message || "Request failed",
// //           })
// //         }
// //         setStopPredictions([...results])
// //       }

// //       // 2) Call optimize-route to get distance matrix + coordinates
// //       const res = await fetch(`${API_BASE}/optimize-route`, {
// //         method: "POST",
// //         headers: { "Content-Type": "application/json" },
// //         body: JSON.stringify({
// //           rider: pickup.trim(),
// //           items: list.map((i) => ({
// //             address: i.address,
// //             customerId: i.customerId,
// //             time: i.time,
// //           })),
// //         }),
// //       })

// //       const data = await res.json().catch(() => ({}))
// //       if (!res.ok || data.error) {
// //         alert(data.error || parseApiError(data) || "Optimize route failed")
// //         return
// //       }

// //       // 3) Run DP locally (eliminates the /optimize page entirely)
// //       const { matrix, coordinates } = data
// //       const n = matrix.length
// //       const probability = results.map((r) =>
// //         Number(r.prediction?.failure_probability) || 0.3
// //       )
// //       // Pad probability if matrix is larger (index 0 = depot)
// //       const fullProb = [0.3, ...probability].slice(0, n)
// //       const traffic = Array.from({ length: n }, () => Array(n).fill(1))
// //       const optimizedRoute = getOptimalRoute(matrix, fullProb, traffic)

// //       // 4) Navigate directly to /dashboard — modal will open automatically
// //       navigate("/dashboard", {
// //         state: {
// //           optimizedRoute,
// //           coordinates,
// //           rider: pickup.trim(),
// //           stopPredictions: results,
// //           matrix,
// //         },
// //       })
// //     } catch (e) {
// //       alert(e?.message || "Something went wrong.")
// //     } finally {
// //       setGenerating(false)
// //     }
// //   }

// //   return (
// //     <div className="min-h-screen bg-slate-900 text-white p-6">
// //       <div className="flex justify-between mb-6">
// //         <h1>Welcome {user?.firstName}</h1>
// //         <UserButton afterSignOutUrl="/" />
// //       </div>

// //       <input
// //         placeholder="Rider Location"
// //         value={pickup}
// //         onChange={(e) => setPickup(e.target.value)}
// //         className="w-full p-2 mb-3 bg-slate-700 rounded"
// //       />

// //       <input
// //         placeholder="Delivery Location"
// //         value={drop}
// //         onChange={(e) => setDrop(e.target.value)}
// //         className="w-full p-2 mb-3 bg-slate-700 rounded"
// //       />

// //       <input
// //         placeholder="Customer ID"
// //         value={customerId}
// //         onChange={(e) => setCustomerId(e.target.value)}
// //         className="w-full p-2 mb-3 bg-slate-700 rounded"
// //       />

// //       <input
// //         type="text"
// //         placeholder="HH:MM"
// //         value={time}
// //         onChange={(e) => setTime(e.target.value)}
// //         className="w-full p-2 mb-3 bg-slate-700 rounded"
// //       />

// //       <button
// //         type="button"
// //         onClick={handleAdd}
// //         className="bg-green-500 p-2 w-full mb-3 rounded"
// //       >
// //         Add Stop
// //       </button>

// //       <button
// //         type="button"
// //         onClick={generateOptimizedRoute}
// //         disabled={generating}
// //         className="bg-blue-500 p-2 w-full rounded disabled:opacity-50"
// //       >
// //         {generating ? "Predicting stops, then optimizing…" : "Analyze Route"}
// //       </button>

// //       {stopPredictions.length > 0 && (
// //         <div className="mt-4 p-3 bg-slate-800 rounded text-sm">
// //           <h3 className="font-semibold mb-2">Live predictions (per stop)</h3>
// //           {stopPredictions.map((row) => (
// //             <div key={row.id} className="mb-2 border-b border-slate-600 pb-2 last:border-0">
// //               <p className="text-slate-300">{row.address}</p>
// //               {row.error ? (
// //                 <p className="text-red-400">{row.error}</p>
// //               ) : (
// //                 <p>
// //                   success {row.prediction?.success_probability} · failure{" "}
// //                   {row.prediction?.failure_probability}
// //                 </p>
// //               )}
// //             </div>
// //           ))}
// //         </div>
// //       )}

// //       <div className="mt-4">
// //         <h2>Delivery stops ({list.length})</h2>
// //         {list.map((item) => (
// //           <div key={item.id} className="bg-slate-800 p-3 mb-2 rounded">
// //             <p><strong>Address:</strong> {item.address}</p>
// //             <p><strong>Customer:</strong> {item.customerId}</p>
// //             <p><strong>Time:</strong> {item.time}</p>
// //             <p>Status: {item.delivered ? "✅ Delivered" : "❌ Pending"}</p>
// //             {!item.delivered && (
// //               <button
// //                 type="button"
// //                 onClick={() => markDelivered(item.id)}
// //                 className="bg-yellow-500 px-2 py-1 mt-2 rounded"
// //               >
// //                 Mark Delivered
// //               </button>
// //             )}
// //           </div>
// //         ))}
// //       </div>

// //       <div className="mt-6">
// //         <h2>ML Dataset</h2>
// //         {history.map((item) => (
// //           <p key={item.id}>
// //             {item.customerId} | {item.time} | {item.address} | Delivered
// //           </p>
// //         ))}
// //       </div>
// //     </div>
// //   )
// // }
// import { useState } from "react"
// import { useUser, UserButton } from "@clerk/clerk-react"
// import { useNavigate } from "react-router-dom"

// const API_BASE = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000"

// function parseApiError(data) {
//   const detail = data?.detail
//   if (typeof detail === "string") return detail
//   if (Array.isArray(detail)) return detail.map((d) => d.msg || d).join(", ")
//   return JSON.stringify(detail || data)
// }

// async function fetchPredictForStop(rider, stop) {
//   const params = new URLSearchParams({
//     delivery_man_address: rider.trim(),
//     customer_address: stop.address,
//     delivery_time: stop.time,
//     customer_id: stop.customerId,
//   })
//   const res = await fetch(`${API_BASE}/predict?${params.toString()}`)
//   const data = await res.json().catch(() => ({}))
//   if (!res.ok) throw new Error(parseApiError(data) || "Prediction failed")
//   return data
// }

// function getOptimalRoute(distance, probability, traffic) {
//   const n = distance.length
//   const FULL = 1 << n
//   const dp = Array.from({ length: FULL }, () => Array(n).fill(Infinity))
//   const parent = Array.from({ length: FULL }, () => Array(n).fill(-1))
//   dp[1][0] = 0
//   for (let mask = 1; mask < FULL; mask++) {
//     for (let u = 0; u < n; u++) {
//       if (!(mask & (1 << u))) continue
//       for (let v = 0; v < n; v++) {
//         if (mask & (1 << v)) continue
//         const nextMask = mask | (1 << v)
//         const cost = distance[u][v] * (1 + probability[v]) * traffic[u][v]
//         if (dp[mask][u] + cost < dp[nextMask][v]) {
//           dp[nextMask][v] = dp[mask][u] + cost
//           parent[nextMask][v] = u
//         }
//       }
//     }
//   }
//   const finalMask = FULL - 1
//   let last = 0
//   let best = Infinity
//   for (let i = 0; i < n; i++) {
//     if (dp[finalMask][i] < best) { best = dp[finalMask][i]; last = i }
//   }
//   let mask = finalMask
//   const result = []
//   while (last !== -1) {
//     result.push(last)
//     const prev = parent[mask][last]
//     mask ^= 1 << last
//     last = prev
//   }
//   return result.reverse()
// }

// // ── Icon components ────────────────────────────────────────────
// const IconPin = () => (
//   <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
//     <path d="M8 1.5C5.79 1.5 4 3.29 4 5.5c0 3.25 4 9 4 9s4-5.75 4-9c0-2.21-1.79-3.97-4-4z" fill="#1a56db" opacity="0.9"/>
//     <circle cx="8" cy="5.5" r="1.5" fill="white"/>
//   </svg>
// )
// const IconUser = () => (
//   <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
//     <circle cx="8" cy="5" r="3" stroke="#64748b" strokeWidth="1.5"/>
//     <path d="M2 14c0-3.31 2.69-5 6-5s6 1.69 6 5" stroke="#64748b" strokeWidth="1.5" strokeLinecap="round"/>
//   </svg>
// )
// const IconClock = () => (
//   <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
//     <circle cx="8" cy="8" r="6" stroke="#64748b" strokeWidth="1.5"/>
//     <path d="M8 5v3.5l2 2" stroke="#64748b" strokeWidth="1.5" strokeLinecap="round"/>
//   </svg>
// )
// const IconTruck = () => (
//   <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
//     <rect x="1" y="5" width="9" height="7" rx="1" stroke="#1a56db" strokeWidth="1.5"/>
//     <path d="M10 7l3 2v3h-3V7z" stroke="#1a56db" strokeWidth="1.5" strokeLinejoin="round"/>
//     <circle cx="4" cy="13" r="1.5" fill="#1a56db"/>
//     <circle cx="12" cy="13" r="1.5" fill="#1a56db"/>
//   </svg>
// )
// const IconRoute = () => (
//   <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
//     <circle cx="3" cy="4" r="2" stroke="white" strokeWidth="1.5"/>
//     <circle cx="13" cy="12" r="2" stroke="white" strokeWidth="1.5"/>
//     <path d="M3 6v1.5a4 4 0 004 4H9" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
//   </svg>
// )
// const IconPlus = () => (
//   <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
//     <path d="M8 3v10M3 8h10" stroke="white" strokeWidth="2" strokeLinecap="round"/>
//   </svg>
// )
// const IconCheck = () => (
//   <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
//     <path d="M2 7l4 4 6-6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
//   </svg>
// )

// export default function DeliveryForm() {
//   const { user } = useUser()
//   const navigate = useNavigate()

//   const [pickup, setPickup] = useState("")
//   const [drop, setDrop] = useState("")
//   const [customerId, setCustomerId] = useState("")
//   const [time, setTime] = useState("")

//   const [list, setList] = useState([])
//   const [history, setHistory] = useState([])
//   const [stopPredictions, setStopPredictions] = useState([])
//   const [generating, setGenerating] = useState(false)

//   const handleAdd = () => {
//     if (!drop || !customerId || !time) {
//       alert("Fill delivery location, customer ID, and time for each stop.")
//       return
//     }
//     const newDelivery = { id: Date.now(), address: drop, customerId, time, delivered: false }
//     setList([...list, newDelivery])
//     setDrop("")
//     setCustomerId("")
//     setTime("")
//   }

//   const markDelivered = (id) => {
//     const updated = list.map((item) => item.id === id ? { ...item, delivered: true } : item)
//     setList(updated)
//     const done = updated.find((i) => i.id === id)
//     setHistory([...history, done])
//   }

//   async function generateOptimizedRoute() {
//     if (!pickup?.trim()) { alert("Enter rider location."); return }
//     if (list.length === 0) { alert("Add at least one delivery stop."); return }
//     setGenerating(true)
//     setStopPredictions([])
//     try {
//       const results = []
//       for (const stop of list) {
//         try {
//           const prediction = await fetchPredictForStop(pickup, stop)
//           results.push({ id: stop.id, address: stop.address, customerId: stop.customerId, time: stop.time, prediction, error: null })
//         } catch (e) {
//           results.push({ id: stop.id, address: stop.address, customerId: stop.customerId, time: stop.time, prediction: null, error: e?.message || "Request failed" })
//         }
//         setStopPredictions([...results])
//       }
//       const res = await fetch(`${API_BASE}/optimize-route`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           rider: pickup.trim(),
//           items: list.map((i) => ({ address: i.address, customerId: i.customerId, time: i.time })),
//         }),
//       })
//       const data = await res.json().catch(() => ({}))
//       if (!res.ok || data.error) { alert(data.error || parseApiError(data) || "Optimize route failed"); return }
//       const { matrix, coordinates } = data
//       const n = matrix.length
//       const probability = results.map((r) => Number(r.prediction?.failure_probability) || 0.3)
//       const fullProb = [0.3, ...probability].slice(0, n)
//       const traffic = Array.from({ length: n }, () => Array(n).fill(1))
//       const optimizedRoute = getOptimalRoute(matrix, fullProb, traffic)
//       navigate("/dashboard", {
//         state: { optimizedRoute, coordinates, rider: pickup.trim(), stopPredictions: results, matrix },
//       })
//     } catch (e) {
//       alert(e?.message || "Something went wrong.")
//     } finally {
//       setGenerating(false)
//     }
//   }

//   const pendingCount = list.filter((i) => !i.delivered).length
//   const deliveredCount = list.filter((i) => i.delivered).length

//   return (
//     <div style={s.page}>
//       {/* ── Top nav ───────────────────────────── */}
//       <header style={s.nav}>
//         <div style={s.navLeft}>
//           <div style={s.navLogo}>
//             <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
//               <rect width="28" height="28" rx="8" fill="#1a56db"/>
//               <path d="M7 21L14 7l7 14" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
//               <path d="M10 16h8" stroke="white" strokeWidth="2" strokeLinecap="round"/>
//             </svg>
//             <span style={s.navBrand}>Co-Pilot</span>
//           </div>
//           <div style={s.navBadge}>
//             <IconTruck />
//             <span>Delivery Dashboard</span>
//           </div>
//         </div>
//         <div style={s.navRight}>
//           <div style={s.userChip}>
//             <div style={s.avatar}>{user?.firstName?.[0] || "R"}</div>
//             <span style={s.userName}>{user?.firstName || "Rider"}</span>
//           </div>
//           <UserButton afterSignOutUrl="/" />
//         </div>
//       </header>

//       <div style={s.content}>
//         <div style={s.grid}>
//           {/* ── Left column: forms ────────────── */}
//           <div style={s.leftCol}>
//             {/* Rider location card */}
//             <div style={s.card}>
//               <div style={s.cardHeader}>
//                 <div style={s.cardIconBlue}><IconPin /></div>
//                 <div>
//                   <h3 style={s.cardTitle}>Rider Start Location</h3>
//                   <p style={s.cardSub}>Where does your shift begin?</p>
//                 </div>
//               </div>
//               <div style={s.inputWrap}>
//                 <div style={s.inputIcon}><IconPin /></div>
//                 <input
//                   placeholder="Enter rider's starting address"
//                   value={pickup}
//                   onChange={(e) => setPickup(e.target.value)}
//                   style={s.input}
//                   onFocus={(e) => (e.target.style.borderColor = "#1a56db")}
//                   onBlur={(e) => (e.target.style.borderColor = "#e2e8f0")}
//                 />
//               </div>
//             </div>

//             {/* Add stop card */}
//             <div style={s.card}>
//               <div style={s.cardHeader}>
//                 <div style={s.cardIconGreen}>
//                   <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
//                     <rect x="1" y="3" width="14" height="10" rx="2" stroke="#059669" strokeWidth="1.5"/>
//                     <path d="M5 8h6M8 5v6" stroke="#059669" strokeWidth="1.5" strokeLinecap="round"/>
//                   </svg>
//                 </div>
//                 <div>
//                   <h3 style={s.cardTitle}>Add Delivery Stop</h3>
//                   <p style={s.cardSub}>Fill in the stop details below</p>
//                 </div>
//               </div>

//               <div style={s.fieldGrid}>
//                 <div style={s.fieldFull}>
//                   <label style={s.label}>Delivery Address</label>
//                   <div style={s.inputWrap}>
//                     <div style={s.inputIcon}><IconPin /></div>
//                     <input
//                       placeholder="Customer's delivery address"
//                       value={drop}
//                       onChange={(e) => setDrop(e.target.value)}
//                       style={s.input}
//                       onFocus={(e) => (e.target.style.borderColor = "#1a56db")}
//                       onBlur={(e) => (e.target.style.borderColor = "#e2e8f0")}
//                     />
//                   </div>
//                 </div>
//                 <div style={s.fieldHalf}>
//                   <label style={s.label}>Customer ID</label>
//                   <div style={s.inputWrap}>
//                     <div style={s.inputIcon}><IconUser /></div>
//                     <input
//                       placeholder="e.g. C-1042"
//                       value={customerId}
//                       onChange={(e) => setCustomerId(e.target.value)}
//                       style={s.input}
//                       onFocus={(e) => (e.target.style.borderColor = "#1a56db")}
//                       onBlur={(e) => (e.target.style.borderColor = "#e2e8f0")}
//                     />
//                   </div>
//                 </div>
//                 <div style={s.fieldHalf}>
//                   <label style={s.label}>Delivery Time</label>
//                   <div style={s.inputWrap}>
//                     <div style={s.inputIcon}><IconClock /></div>
//                     <input
//                       type="text"
//                       placeholder="HH:MM"
//                       value={time}
//                       onChange={(e) => setTime(e.target.value)}
//                       style={s.input}
//                       onFocus={(e) => (e.target.style.borderColor = "#1a56db")}
//                       onBlur={(e) => (e.target.style.borderColor = "#e2e8f0")}
//                     />
//                   </div>
//                 </div>
//               </div>

//               <button
//                 type="button"
//                 onClick={handleAdd}
//                 style={s.addBtn}
//                 onMouseEnter={(e) => (e.currentTarget.style.background = "#047857")}
//                 onMouseLeave={(e) => (e.currentTarget.style.background = "#059669")}
//               >
//                 <IconPlus />
//                 Add Stop
//               </button>
//             </div>

//             {/* Analyze button */}
//             <button
//               type="button"
//               onClick={generateOptimizedRoute}
//               disabled={generating}
//               style={generating ? { ...s.routeBtn, ...s.routeBtnDisabled } : s.routeBtn}
//               onMouseEnter={(e) => !generating && (e.currentTarget.style.background = "#1649c5")}
//               onMouseLeave={(e) => !generating && (e.currentTarget.style.background = "#1a56db")}
//             >
//               {generating ? (
//                 <>
//                   <div style={s.spinner} />
//                   Predicting stops & optimizing…
//                 </>
//               ) : (
//                 <>
//                   <IconRoute />
//                   Analyze Route
//                 </>
//               )}
//             </button>

//             {/* Live predictions */}
//             {stopPredictions.length > 0 && (
//               <div style={s.card}>
//                 <div style={s.cardHeader}>
//                   <div style={{ ...s.cardIconBlue, background: "#fef3c7" }}>
//                     <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
//                       <circle cx="8" cy="8" r="6" stroke="#d97706" strokeWidth="1.5"/>
//                       <path d="M8 5v3.5l2 1.5" stroke="#d97706" strokeWidth="1.5" strokeLinecap="round"/>
//                     </svg>
//                   </div>
//                   <div>
//                     <h3 style={s.cardTitle}>Live ML Predictions</h3>
//                     <p style={s.cardSub}>Per-stop delivery success estimates</p>
//                   </div>
//                 </div>
//                 {stopPredictions.map((row, idx) => (
//                   <div key={row.id} style={s.predRow}>
//                     <div style={s.predIndex}>{idx + 1}</div>
//                     <div style={s.predBody}>
//                       <p style={s.predAddress}>{row.address}</p>
//                       {row.error ? (
//                         <p style={s.predError}>{row.error}</p>
//                       ) : (
//                         <div style={s.predBars}>
//                           <div style={s.predBar}>
//                             <span style={s.predBarLabel}>Success</span>
//                             <div style={s.barTrack}>
//                               <div style={{ ...s.barFill, ...s.barGreen, width: `${Math.round((row.prediction?.success_probability || 0) * 100)}%` }} />
//                             </div>
//                             <span style={s.predBarVal}>{Math.round((row.prediction?.success_probability || 0) * 100)}%</span>
//                           </div>
//                           <div style={s.predBar}>
//                             <span style={s.predBarLabel}>Failure</span>
//                             <div style={s.barTrack}>
//                               <div style={{ ...s.barFill, ...s.barRed, width: `${Math.round((row.prediction?.failure_probability || 0) * 100)}%` }} />
//                             </div>
//                             <span style={s.predBarVal}>{Math.round((row.prediction?.failure_probability || 0) * 100)}%</span>
//                           </div>
//                         </div>
//                       )}
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>

//           {/* ── Right column: stops list ──────── */}
//           <div style={s.rightCol}>
//             {/* Stats row */}
//             <div style={s.statsRow}>
//               {[
//                 { label: "Total Stops", value: list.length, color: "#1a56db", bg: "#eff6ff" },
//                 { label: "Pending", value: pendingCount, color: "#d97706", bg: "#fffbeb" },
//                 { label: "Delivered", value: deliveredCount, color: "#059669", bg: "#f0fdf4" },
//               ].map((stat) => (
//                 <div key={stat.label} style={{ ...s.statBox, background: stat.bg }}>
//                   <span style={{ ...s.statNum, color: stat.color }}>{stat.value}</span>
//                   <span style={s.statLbl}>{stat.label}</span>
//                 </div>
//               ))}
//             </div>

//             {/* Delivery stops */}
//             <div style={s.card}>
//               <div style={s.sectionHead}>
//                 <h3 style={s.cardTitle}>Delivery Stops</h3>
//                 <span style={s.countPill}>{list.length} stops</span>
//               </div>

//               {list.length === 0 ? (
//                 <div style={s.emptyState}>
//                   <svg width="48" height="48" viewBox="0 0 48 48" fill="none" style={{ opacity: 0.3 }}>
//                     <rect x="6" y="12" width="36" height="28" rx="4" stroke="#64748b" strokeWidth="2"/>
//                     <path d="M16 12V9a8 8 0 0116 0v3" stroke="#64748b" strokeWidth="2"/>
//                     <circle cx="24" cy="28" r="4" stroke="#64748b" strokeWidth="2"/>
//                   </svg>
//                   <p style={s.emptyText}>No stops added yet</p>
//                   <p style={s.emptySub}>Add delivery stops using the form on the left</p>
//                 </div>
//               ) : (
//                 <div style={s.stopList}>
//                   {list.map((item, idx) => (
//                     <div key={item.id} style={item.delivered ? { ...s.stopCard, ...s.stopDelivered } : s.stopCard}>
//                       <div style={s.stopLeft}>
//                         <div style={item.delivered ? { ...s.stopNum, background: "#059669" } : s.stopNum}>
//                           {item.delivered ? <IconCheck /> : <span style={{ color: "white", fontSize: 12, fontWeight: 700 }}>{idx + 1}</span>}
//                         </div>
//                       </div>
//                       <div style={s.stopBody}>
//                         <div style={s.stopTopRow}>
//                           <p style={s.stopAddress}>{item.address}</p>
//                           <span style={item.delivered ? { ...s.stopBadge, ...s.badgeGreen } : { ...s.stopBadge, ...s.badgeAmber }}>
//                             {item.delivered ? "Delivered" : "Pending"}
//                           </span>
//                         </div>
//                         <div style={s.stopMeta}>
//                           <span style={s.stopMetaItem}><IconUser />{item.customerId}</span>
//                           <span style={s.stopMetaItem}><IconClock />{item.time}</span>
//                         </div>
//                         {!item.delivered && (
//                           <button
//                             type="button"
//                             onClick={() => markDelivered(item.id)}
//                             style={s.markBtn}
//                             onMouseEnter={(e) => (e.currentTarget.style.background = "#d97706")}
//                             onMouseLeave={(e) => (e.currentTarget.style.background = "white")}
//                           >
//                             Mark as Delivered
//                           </button>
//                         )}
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>

//             {/* ML Dataset */}
//             {history.length > 0 && (
//               <div style={s.card}>
//                 <div style={s.sectionHead}>
//                   <h3 style={s.cardTitle}>ML Dataset Log</h3>
//                   <span style={s.countPill}>{history.length} records</span>
//                 </div>
//                 <div style={s.dataTable}>
//                   <div style={s.tableHead}>
//                     <span style={s.thCell}>Customer</span>
//                     <span style={s.thCell}>Time</span>
//                     <span style={s.thCell}>Address</span>
//                     <span style={s.thCell}>Status</span>
//                   </div>
//                   {history.map((item) => (
//                     <div key={item.id} style={s.tableRow}>
//                       <span style={s.tdCell}>{item.customerId}</span>
//                       <span style={s.tdCell}>{item.time}</span>
//                       <span style={{ ...s.tdCell, flex: 2 }}>{item.address}</span>
//                       <span style={{ ...s.tdCell, color: "#059669", fontWeight: 600 }}>Delivered</span>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

// const s = {
//   page: {
//     minHeight: "100vh",
//     background: "#f1f5f9",
//     fontFamily: "'Inter', 'Segoe UI', sans-serif",
//   },
//   // ── Nav ──────────────────────────────────────────────────────
//   nav: {
//     background: "white",
//     borderBottom: "1px solid #e2e8f0",
//     padding: "0 28px",
//     height: 60,
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "space-between",
//     position: "sticky",
//     top: 0,
//     zIndex: 10,
//   },
//   navLeft: { display: "flex", alignItems: "center", gap: 20 },
//   navLogo: { display: "flex", alignItems: "center", gap: 9 },
//   navBrand: { fontWeight: 800, fontSize: 17, color: "#0f172a", letterSpacing: "-0.02em" },
//   navBadge: {
//     display: "flex", alignItems: "center", gap: 6,
//     background: "#eff6ff", borderRadius: 20, padding: "4px 12px",
//     fontSize: 12, fontWeight: 600, color: "#1a56db",
//   },
//   navRight: { display: "flex", alignItems: "center", gap: 14 },
//   userChip: {
//     display: "flex", alignItems: "center", gap: 8,
//     background: "#f8fafc", border: "1px solid #e2e8f0",
//     borderRadius: 20, padding: "5px 12px 5px 6px",
//   },
//   avatar: {
//     width: 26, height: 26, borderRadius: "50%",
//     background: "#1a56db", color: "white",
//     fontSize: 12, fontWeight: 700,
//     display: "flex", alignItems: "center", justifyContent: "center",
//   },
//   userName: { fontSize: 13, fontWeight: 600, color: "#0f172a" },
//   // ── Layout ───────────────────────────────────────────────────
//   content: { maxWidth: 1200, margin: "0 auto", padding: "28px 24px" },
//   grid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, alignItems: "start" },
//   leftCol: { display: "flex", flexDirection: "column", gap: 16 },
//   rightCol: { display: "flex", flexDirection: "column", gap: 16 },
//   // ── Card ─────────────────────────────────────────────────────
//   card: {
//     background: "white",
//     borderRadius: 16,
//     border: "1px solid #e8edf3",
//     padding: "20px 22px",
//     boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
//   },
//   cardHeader: { display: "flex", alignItems: "flex-start", gap: 14, marginBottom: 18 },
//   cardIconBlue: {
//     width: 36, height: 36, borderRadius: 10,
//     background: "#eff6ff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
//   },
//   cardIconGreen: {
//     width: 36, height: 36, borderRadius: 10,
//     background: "#f0fdf4", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
//   },
//   cardTitle: { fontSize: 14, fontWeight: 700, color: "#0f172a", margin: "0 0 2px" },
//   cardSub: { fontSize: 12, color: "#94a3b8", margin: 0 },
//   sectionHead: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 },
//   countPill: {
//     background: "#f1f5f9", borderRadius: 20, padding: "3px 10px",
//     fontSize: 12, fontWeight: 600, color: "#64748b",
//   },
//   // ── Form fields ──────────────────────────────────────────────
//   fieldGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px 14px", marginBottom: 16 },
//   fieldFull: { gridColumn: "1 / -1" },
//   fieldHalf: {},
//   label: { display: "block", fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 6 },
//   inputWrap: { position: "relative" },
//   inputIcon: {
//     position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)",
//     pointerEvents: "none", display: "flex",
//   },
//   input: {
//     width: "100%", padding: "10px 12px 10px 36px",
//     border: "1.5px solid #e2e8f0", borderRadius: 10,
//     fontSize: 14, color: "#0f172a", background: "#f8fafc",
//     outline: "none", boxSizing: "border-box",
//     fontFamily: "inherit", transition: "border-color 0.15s",
//   },
//   // ── Buttons ──────────────────────────────────────────────────
//   addBtn: {
//     width: "100%", padding: "11px", background: "#059669",
//     color: "white", border: "none", borderRadius: 10,
//     fontSize: 14, fontWeight: 700, cursor: "pointer",
//     display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
//     fontFamily: "inherit", transition: "background 0.15s",
//   },
//   routeBtn: {
//     width: "100%", padding: "14px",
//     background: "#1a56db", color: "white",
//     border: "none", borderRadius: 12,
//     fontSize: 15, fontWeight: 700, cursor: "pointer",
//     display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
//     fontFamily: "inherit", transition: "background 0.15s",
//     boxShadow: "0 4px 14px rgba(26,86,219,0.28)",
//   },
//   routeBtnDisabled: {
//     background: "#93c5fd", cursor: "not-allowed", boxShadow: "none",
//   },
//   spinner: {
//     width: 16, height: 16, border: "2px solid rgba(255,255,255,0.3)",
//     borderTopColor: "white", borderRadius: "50%",
//     animation: "spin 0.8s linear infinite",
//   },
//   markBtn: {
//     marginTop: 10, padding: "7px 14px",
//     background: "white", color: "#d97706",
//     border: "1.5px solid #fcd34d", borderRadius: 8,
//     fontSize: 12, fontWeight: 700, cursor: "pointer",
//     fontFamily: "inherit", transition: "all 0.15s",
//   },
//   // ── Stats ────────────────────────────────────────────────────
//   statsRow: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 },
//   statBox: {
//     borderRadius: 12, padding: "14px 16px",
//     display: "flex", flexDirection: "column", gap: 2,
//     border: "1px solid rgba(0,0,0,0.04)",
//   },
//   statNum: { fontSize: 28, fontWeight: 800, lineHeight: 1, letterSpacing: "-0.03em" },
//   statLbl: { fontSize: 11, fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.05em" },
//   // ── Stop list ────────────────────────────────────────────────
//   stopList: { display: "flex", flexDirection: "column", gap: 12 },
//   stopCard: {
//     display: "flex", gap: 14, padding: "14px 16px",
//     background: "#f8fafc", borderRadius: 12, border: "1px solid #e8edf3",
//     transition: "border-color 0.15s",
//   },
//   stopDelivered: { background: "#f0fdf4", border: "1px solid #bbf7d0" },
//   stopLeft: { flexShrink: 0 },
//   stopNum: {
//     width: 28, height: 28, borderRadius: 8,
//     background: "#1a56db", display: "flex", alignItems: "center", justifyContent: "center",
//   },
//   stopBody: { flex: 1, minWidth: 0 },
//   stopTopRow: { display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8, marginBottom: 6 },
//   stopAddress: { fontSize: 13, fontWeight: 600, color: "#0f172a", margin: 0, lineHeight: 1.4 },
//   stopBadge: {
//     flexShrink: 0, borderRadius: 20, padding: "2px 9px",
//     fontSize: 11, fontWeight: 700,
//   },
//   badgeAmber: { background: "#fef3c7", color: "#92400e" },
//   badgeGreen: { background: "#dcfce7", color: "#14532d" },
//   stopMeta: { display: "flex", gap: 14 },
//   stopMetaItem: {
//     display: "flex", alignItems: "center", gap: 4,
//     fontSize: 12, color: "#64748b",
//   },
//   // ── Predictions ──────────────────────────────────────────────
//   predRow: {
//     display: "flex", gap: 12, padding: "12px 0",
//     borderBottom: "1px solid #f1f5f9",
//   },
//   predIndex: {
//     width: 24, height: 24, borderRadius: 6,
//     background: "#f1f5f9", flexShrink: 0,
//     display: "flex", alignItems: "center", justifyContent: "center",
//     fontSize: 11, fontWeight: 700, color: "#64748b",
//   },
//   predBody: { flex: 1 },
//   predAddress: { fontSize: 13, fontWeight: 600, color: "#0f172a", margin: "0 0 8px" },
//   predError: { fontSize: 12, color: "#dc2626", margin: 0 },
//   predBars: { display: "flex", flexDirection: "column", gap: 5 },
//   predBar: { display: "flex", alignItems: "center", gap: 8 },
//   predBarLabel: { fontSize: 11, color: "#64748b", width: 48, flexShrink: 0 },
//   barTrack: { flex: 1, height: 6, background: "#f1f5f9", borderRadius: 99, overflow: "hidden" },
//   barFill: { height: "100%", borderRadius: 99, transition: "width 0.5s ease" },
//   barGreen: { background: "#10b981" },
//   barRed: { background: "#f87171" },
//   predBarVal: { fontSize: 11, fontWeight: 700, color: "#374151", width: 32, textAlign: "right" },
//   // ── Dataset table ────────────────────────────────────────────
//   dataTable: { fontSize: 12 },
//   tableHead: {
//     display: "flex", gap: 8, padding: "6px 0",
//     borderBottom: "1px solid #e8edf3", marginBottom: 4,
//   },
//   tableRow: {
//     display: "flex", gap: 8, padding: "8px 0",
//     borderBottom: "1px solid #f8fafc",
//   },
//   thCell: { flex: 1, color: "#94a3b8", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.04em", fontSize: 10 },
//   tdCell: { flex: 1, color: "#374151", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" },
//   // ── Empty state ──────────────────────────────────────────────
//   emptyState: {
//     display: "flex", flexDirection: "column", alignItems: "center",
//     padding: "36px 0", gap: 8,
//   },
//   emptyText: { fontSize: 14, fontWeight: 600, color: "#64748b", margin: 0 },
//   emptySub: { fontSize: 12, color: "#94a3b8", margin: 0, textAlign: "center" },
// }
import { useState } from "react"
import { useUser, UserButton } from "@clerk/clerk-react"
import { useNavigate } from "react-router-dom"

const API_BASE = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000"

function parseApiError(data) {
  const detail = data?.detail
  if (typeof detail === "string") return detail
  if (Array.isArray(detail)) return detail.map((d) => d.msg || d).join(", ")
  return JSON.stringify(detail || data)
}

async function fetchPredictForStop(rider, stop) {
  const params = new URLSearchParams({
    delivery_man_address: rider.trim(),
    customer_address: stop.address,
    delivery_time: stop.time,
    customer_id: stop.customerId,
  })
  const res = await fetch(`${API_BASE}/predict?${params.toString()}`)
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(parseApiError(data) || "Prediction failed")
  return data
}

function getOptimalRoute(distance, probability, traffic) {
  const n = distance.length
  const FULL = 1 << n
  const dp = Array.from({ length: FULL }, () => Array(n).fill(Infinity))
  const parent = Array.from({ length: FULL }, () => Array(n).fill(-1))
  dp[1][0] = 0
  for (let mask = 1; mask < FULL; mask++) {
    for (let u = 0; u < n; u++) {
      if (!(mask & (1 << u))) continue
      for (let v = 0; v < n; v++) {
        if (mask & (1 << v)) continue
        const nextMask = mask | (1 << v)
        const cost = distance[u][v] * (1 + probability[v]) * traffic[u][v]
        if (dp[mask][u] + cost < dp[nextMask][v]) {
          dp[nextMask][v] = dp[mask][u] + cost
          parent[nextMask][v] = u
        }
      }
    }
  }
  const finalMask = FULL - 1
  let last = 0
  let best = Infinity
  for (let i = 0; i < n; i++) {
    if (dp[finalMask][i] < best) { best = dp[finalMask][i]; last = i }
  }
  let mask = finalMask
  const result = []
  while (last !== -1) {
    result.push(last)
    const prev = parent[mask][last]
    mask ^= 1 << last
    last = prev
  }
  return result.reverse()
}

const IconPin = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M8 1.5C5.79 1.5 4 3.29 4 5.5c0 3.25 4 9 4 9s4-5.75 4-9c0-2.21-1.79-3.97-4-4z" fill="#2563eb" opacity="0.9"/>
    <circle cx="8" cy="5.5" r="1.5" fill="white"/>
  </svg>
)
const IconUser = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <circle cx="8" cy="5" r="3" stroke="#64748b" strokeWidth="1.5"/>
    <path d="M2 14c0-3.31 2.69-5 6-5s6 1.69 6 5" stroke="#64748b" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
)
const IconClock = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <circle cx="8" cy="8" r="6" stroke="#64748b" strokeWidth="1.5"/>
    <path d="M8 5v3.5l2 2" stroke="#64748b" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
)
const IconTruck = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <rect x="1" y="5" width="9" height="7" rx="1" stroke="#2563eb" strokeWidth="1.5"/>
    <path d="M10 7l3 2v3h-3V7z" stroke="#2563eb" strokeWidth="1.5" strokeLinejoin="round"/>
    <circle cx="4" cy="13" r="1.5" fill="#2563eb"/>
    <circle cx="12" cy="13" r="1.5" fill="#2563eb"/>
  </svg>
)
const IconRoute = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <circle cx="3" cy="4" r="2" stroke="white" strokeWidth="1.5"/>
    <circle cx="13" cy="12" r="2" stroke="white" strokeWidth="1.5"/>
    <path d="M3 6v1.5a4 4 0 004 4H9" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
)
const IconPlus = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M8 3v10M3 8h10" stroke="white" strokeWidth="2" strokeLinecap="round"/>
  </svg>
)
const IconCheck = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <path d="M2 7l4 4 6-6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

export default function DeliveryForm() {
  const { user } = useUser()
  const navigate = useNavigate()

  const [pickup, setPickup] = useState("")
  const [drop, setDrop] = useState("")
  const [customerId, setCustomerId] = useState("")
  const [time, setTime] = useState("")
  const [list, setList] = useState([])
  const [history, setHistory] = useState([])
  const [stopPredictions, setStopPredictions] = useState([])
  const [generating, setGenerating] = useState(false)

  const handleAdd = () => {
    if (!drop || !customerId || !time) {
      alert("Fill delivery location, customer ID, and time for each stop.")
      return
    }
    const newDelivery = { id: Date.now(), address: drop, customerId, time, delivered: false }
    setList([...list, newDelivery])
    setDrop("")
    setCustomerId("")
    setTime("")
  }

  const markDelivered = (id) => {
    const updated = list.map((item) => item.id === id ? { ...item, delivered: true } : item)
    setList(updated)
    const done = updated.find((i) => i.id === id)
    setHistory([...history, done])
  }

  async function generateOptimizedRoute() {
    if (!pickup?.trim()) { alert("Enter rider location."); return }
    if (list.length === 0) { alert("Add at least one delivery stop."); return }
    setGenerating(true)
    setStopPredictions([])
    try {
      const results = []
      for (const stop of list) {
        try {
          const prediction = await fetchPredictForStop(pickup, stop)
          results.push({ id: stop.id, address: stop.address, customerId: stop.customerId, time: stop.time, prediction, error: null })
        } catch (e) {
          results.push({ id: stop.id, address: stop.address, customerId: stop.customerId, time: stop.time, prediction: null, error: e?.message || "Request failed" })
        }
        setStopPredictions([...results])
      }
      const res = await fetch(`${API_BASE}/optimize-route`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rider: pickup.trim(),
          items: list.map((i) => ({ address: i.address, customerId: i.customerId, time: i.time })),
        }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok || data.error) { alert(data.error || parseApiError(data) || "Optimize route failed"); return }
      const { matrix, coordinates } = data
      const n = matrix.length
      const probability = results.map((r) => Number(r.prediction?.failure_probability) || 0.3)
      const fullProb = [0.3, ...probability].slice(0, n)
      const traffic = Array.from({ length: n }, () => Array(n).fill(1))
      const optimizedRoute = getOptimalRoute(matrix, fullProb, traffic)
      navigate("/dashboard", {
        state: { optimizedRoute, coordinates, rider: pickup.trim(), stopPredictions: results, matrix },
      })
    } catch (e) {
      alert(e?.message || "Something went wrong.")
    } finally {
      setGenerating(false)
    }
  }

  const pendingCount = list.filter((i) => !i.delivered).length
  const deliveredCount = list.filter((i) => i.delivered).length

  return (
    <div style={s.page}>
      <header style={s.nav}>
        <div style={s.navLeft}>
          <div style={s.navLogo}>
            <div style={s.navLogoIcon}>
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M4 15L9 4l5 11" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M6.5 10.5h5" stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
              </svg>
            </div>
            <span style={s.navBrand}>Co-Pilot</span>
          </div>
          <div style={s.navBadge}>
            <IconTruck />
            <span>Delivery Dashboard</span>
          </div>
        </div>
        <div style={s.navRight}>
          <div style={s.userChip}>
            <div style={s.avatar}>{user?.firstName?.[0] || "R"}</div>
            <span style={s.userName}>{user?.firstName || "Rider"}</span>
          </div>
          <UserButton afterSignOutUrl="/" />
        </div>
      </header>

      <div style={s.content}>
        <div style={s.grid}>
          <div style={s.leftCol}>
            <div style={s.card}>
              <div style={s.cardHeader}>
                <div style={s.cardIconBlue}><IconPin /></div>
                <div>
                  <h3 style={s.cardTitle}>Rider Start Location</h3>
                  <p style={s.cardSub}>Where does your shift begin?</p>
                </div>
              </div>
              <div style={s.inputWrap}>
                <div style={s.inputIcon}><IconPin /></div>
                <input
                  placeholder="Enter rider's starting address"
                  value={pickup}
                  onChange={(e) => setPickup(e.target.value)}
                  style={s.input}
                  onFocus={(e) => (e.target.style.borderColor = "#2563eb")}
                  onBlur={(e) => (e.target.style.borderColor = "#e2e8f0")}
                />
              </div>
            </div>

            <div style={s.card}>
              <div style={s.cardHeader}>
                <div style={s.cardIconViolet}>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <rect x="1" y="3" width="14" height="10" rx="2" stroke="#7c3aed" strokeWidth="1.5"/>
                    <path d="M5 8h6M8 5v6" stroke="#7c3aed" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                </div>
                <div>
                  <h3 style={s.cardTitle}>Add Delivery Stop</h3>
                  <p style={s.cardSub}>Fill in the stop details below</p>
                </div>
              </div>
              <div style={s.fieldGrid}>
                <div style={s.fieldFull}>
                  <label style={s.label}>Delivery Address</label>
                  <div style={s.inputWrap}>
                    <div style={s.inputIcon}><IconPin /></div>
                    <input placeholder="Customer's delivery address" value={drop} onChange={(e) => setDrop(e.target.value)} style={s.input} onFocus={(e) => (e.target.style.borderColor = "#2563eb")} onBlur={(e) => (e.target.style.borderColor = "#e2e8f0")} />
                  </div>
                </div>
                <div style={s.fieldHalf}>
                  <label style={s.label}>Customer ID</label>
                  <div style={s.inputWrap}>
                    <div style={s.inputIcon}><IconUser /></div>
                    <input placeholder="e.g. C-1042" value={customerId} onChange={(e) => setCustomerId(e.target.value)} style={s.input} onFocus={(e) => (e.target.style.borderColor = "#2563eb")} onBlur={(e) => (e.target.style.borderColor = "#e2e8f0")} />
                  </div>
                </div>
                <div style={s.fieldHalf}>
                  <label style={s.label}>Delivery Time</label>
                  <div style={s.inputWrap}>
                    <div style={s.inputIcon}><IconClock /></div>
                    <input type="text" placeholder="HH:MM" value={time} onChange={(e) => setTime(e.target.value)} style={s.input} onFocus={(e) => (e.target.style.borderColor = "#2563eb")} onBlur={(e) => (e.target.style.borderColor = "#e2e8f0")} />
                  </div>
                </div>
              </div>
              <button type="button" onClick={handleAdd} style={s.addBtn} onMouseEnter={(e) => (e.currentTarget.style.background = "#6d28d9")} onMouseLeave={(e) => (e.currentTarget.style.background = "#7c3aed")}>
                <IconPlus />Add Stop
              </button>
            </div>

            <button type="button" onClick={generateOptimizedRoute} disabled={generating} style={generating ? { ...s.routeBtn, ...s.routeBtnDisabled } : s.routeBtn} onMouseEnter={(e) => !generating && (e.currentTarget.style.background = "#1d4ed8")} onMouseLeave={(e) => !generating && (e.currentTarget.style.background = "#2563eb")}>
              {generating ? (<><div style={s.spinner} />Predicting stops & optimizing…</>) : (<><IconRoute />Analyze Route</>)}
            </button>

            {stopPredictions.length > 0 && (
              <div style={s.card}>
                <div style={s.cardHeader}>
                  <div style={s.cardIconAmber}>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6" stroke="#d97706" strokeWidth="1.5"/><path d="M8 5v3.5l2 1.5" stroke="#d97706" strokeWidth="1.5" strokeLinecap="round"/></svg>
                  </div>
                  <div><h3 style={s.cardTitle}>Live ML Predictions</h3><p style={s.cardSub}>Per-stop delivery success estimates</p></div>
                </div>
                {stopPredictions.map((row, idx) => (
                  <div key={row.id} style={s.predRow}>
                    <div style={s.predIndex}>{idx + 1}</div>
                    <div style={s.predBody}>
                      <p style={s.predAddress}>{row.address}</p>
                      {row.error ? <p style={s.predError}>{row.error}</p> : (
                        <div style={s.predBars}>
                          <div style={s.predBar}>
                            <span style={s.predBarLabel}>Success</span>
                            <div style={s.barTrack}><div style={{ ...s.barFill, ...s.barGreen, width: `${Math.round((row.prediction?.success_probability || 0) * 100)}%` }} /></div>
                            <span style={s.predBarVal}>{Math.round((row.prediction?.success_probability || 0) * 100)}%</span>
                          </div>
                          <div style={s.predBar}>
                            <span style={s.predBarLabel}>Failure</span>
                            <div style={s.barTrack}><div style={{ ...s.barFill, ...s.barRed, width: `${Math.round((row.prediction?.failure_probability || 0) * 100)}%` }} /></div>
                            <span style={s.predBarVal}>{Math.round((row.prediction?.failure_probability || 0) * 100)}%</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div style={s.rightCol}>
            <div style={s.statsRow}>
              {[
                { label: "Total Stops", value: list.length, color: "#2563eb", bg: "#eff6ff", border: "#dbeafe" },
                { label: "Pending", value: pendingCount, color: "#d97706", bg: "#fffbeb", border: "#fde68a" },
                { label: "Delivered", value: deliveredCount, color: "#059669", bg: "#f0fdf4", border: "#a7f3d0" },
              ].map((stat) => (
                <div key={stat.label} style={{ ...s.statBox, background: stat.bg, border: `1px solid ${stat.border}` }}>
                  <span style={{ ...s.statNum, color: stat.color }}>{stat.value}</span>
                  <span style={s.statLbl}>{stat.label}</span>
                </div>
              ))}
            </div>

            <div style={s.card}>
              <div style={s.sectionHead}>
                <h3 style={s.cardTitle}>Delivery Stops</h3>
                <span style={s.countPill}>{list.length} stops</span>
              </div>
              {list.length === 0 ? (
                <div style={s.emptyState}>
                  <svg width="48" height="48" viewBox="0 0 48 48" fill="none" style={{ opacity: 0.25 }}>
                    <rect x="6" y="12" width="36" height="28" rx="4" stroke="#64748b" strokeWidth="2"/>
                    <path d="M16 12V9a8 8 0 0116 0v3" stroke="#64748b" strokeWidth="2"/>
                    <circle cx="24" cy="28" r="4" stroke="#64748b" strokeWidth="2"/>
                  </svg>
                  <p style={s.emptyText}>No stops added yet</p>
                  <p style={s.emptySub}>Add delivery stops using the form on the left</p>
                </div>
              ) : (
                <div style={s.stopList}>
                  {list.map((item, idx) => (
                    <div key={item.id} style={item.delivered ? { ...s.stopCard, ...s.stopDelivered } : s.stopCard}>
                      <div style={s.stopLeft}>
                        <div style={item.delivered ? { ...s.stopNum, background: "#059669" } : { ...s.stopNum, background: "#2563eb" }}>
                          {item.delivered ? <IconCheck /> : <span style={{ color: "white", fontSize: 12, fontWeight: 700 }}>{idx + 1}</span>}
                        </div>
                      </div>
                      <div style={s.stopBody}>
                        <div style={s.stopTopRow}>
                          <p style={s.stopAddress}>{item.address}</p>
                          <span style={item.delivered ? { ...s.stopBadge, ...s.badgeGreen } : { ...s.stopBadge, ...s.badgeBlue }}>
                            {item.delivered ? "Delivered" : "Pending"}
                          </span>
                        </div>
                        <div style={s.stopMeta}>
                          <span style={s.stopMetaItem}><IconUser />{item.customerId}</span>
                          <span style={s.stopMetaItem}><IconClock />{item.time}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {history.length > 0 && (
              <div style={s.card}>
                <div style={s.sectionHead}>
                  <h3 style={s.cardTitle}>ML Dataset Log</h3>
                  <span style={s.countPill}>{history.length} records</span>
                </div>
                <div style={s.dataTable}>
                  <div style={s.tableHead}>
                    <span style={s.thCell}>Customer</span><span style={s.thCell}>Time</span><span style={s.thCell}>Address</span><span style={s.thCell}>Status</span>
                  </div>
                  {history.map((item) => (
                    <div key={item.id} style={s.tableRow}>
                      <span style={s.tdCell}>{item.customerId}</span>
                      <span style={s.tdCell}>{item.time}</span>
                      <span style={{ ...s.tdCell, flex: 2 }}>{item.address}</span>
                      <span style={{ ...s.tdCell, color: "#059669", fontWeight: 600 }}>Delivered</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

const s = {
  page: { minHeight: "100vh", background: "#f1f5f9", fontFamily: "'Inter','Segoe UI',sans-serif" },
  nav: { background: "white", borderBottom: "1px solid #e2e8f0", padding: "0 28px", height: 60, display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 10, boxShadow: "0 1px 3px rgba(0,0,0,0.05)" },
  navLeft: { display: "flex", alignItems: "center", gap: 16 },
  navLogo: { display: "flex", alignItems: "center", gap: 9 },
  navLogoIcon: { width: 34, height: 34, borderRadius: 10, background: "linear-gradient(135deg,#1e40af,#3b82f6)", display: "flex", alignItems: "center", justifyContent: "center" },
  navBrand: { fontWeight: 800, fontSize: 16, color: "#0f172a", letterSpacing: "-0.02em" },
  navBadge: { display: "flex", alignItems: "center", gap: 6, background: "#eff6ff", borderRadius: 99, padding: "4px 12px", fontSize: 12, fontWeight: 600, color: "#1d4ed8" },
  navRight: { display: "flex", alignItems: "center", gap: 12 },
  userChip: { display: "flex", alignItems: "center", gap: 8, background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 99, padding: "4px 12px 4px 6px" },
  avatar: { width: 26, height: 26, borderRadius: "50%", background: "linear-gradient(135deg,#1e40af,#3b82f6)", color: "white", fontSize: 12, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" },
  userName: { fontSize: 13, fontWeight: 600, color: "#0f172a" },
  content: { maxWidth: 1200, margin: "0 auto", padding: "24px" },
  grid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, alignItems: "start" },
  leftCol: { display: "flex", flexDirection: "column", gap: 16 },
  rightCol: { display: "flex", flexDirection: "column", gap: 16 },
  card: { background: "white", borderRadius: 16, border: "1px solid #e8edf3", padding: "18px 20px", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" },
  cardHeader: { display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 16 },
  cardIconBlue: { width: 34, height: 34, borderRadius: 9, background: "#eff6ff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 },
  cardIconViolet: { width: 34, height: 34, borderRadius: 9, background: "#f5f3ff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 },
  cardIconAmber: { width: 34, height: 34, borderRadius: 9, background: "#fffbeb", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 },
  cardTitle: { fontSize: 14, fontWeight: 700, color: "#0f172a", margin: "0 0 2px" },
  cardSub: { fontSize: 12, color: "#94a3b8", margin: 0 },
  sectionHead: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 },
  countPill: { background: "#f1f5f9", borderRadius: 99, padding: "3px 10px", fontSize: 12, fontWeight: 600, color: "#64748b" },
  fieldGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px 14px", marginBottom: 14 },
  fieldFull: { gridColumn: "1 / -1" },
  fieldHalf: {},
  label: { display: "block", fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 6 },
  inputWrap: { position: "relative" },
  inputIcon: { position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", pointerEvents: "none", display: "flex" },
  input: { width: "100%", padding: "10px 12px 10px 36px", border: "1.5px solid #e2e8f0", borderRadius: 10, fontSize: 14, color: "#0f172a", background: "#f8fafc", outline: "none", boxSizing: "border-box", fontFamily: "inherit", transition: "border-color 0.15s" },
  addBtn: { width: "100%", padding: "11px", background: "#7c3aed", color: "white", border: "none", borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, fontFamily: "inherit", transition: "background 0.15s" },
  routeBtn: { width: "100%", padding: "13px", background: "#2563eb", color: "white", border: "none", borderRadius: 12, fontSize: 15, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 10, fontFamily: "inherit", transition: "background 0.15s", boxShadow: "0 4px 14px rgba(37,99,235,0.3)" },
  routeBtnDisabled: { background: "#93c5fd", cursor: "not-allowed", boxShadow: "none" },
  spinner: { width: 16, height: 16, border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "white", borderRadius: "50%", animation: "spin 0.8s linear infinite" },
  statsRow: { display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10 },
  statBox: { borderRadius: 12, padding: "12px 14px", display: "flex", flexDirection: "column", gap: 2 },
  statNum: { fontSize: 26, fontWeight: 800, lineHeight: 1, letterSpacing: "-0.03em" },
  statLbl: { fontSize: 11, fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.05em" },
  stopList: { display: "flex", flexDirection: "column", gap: 10 },
  stopCard: { display: "flex", gap: 12, padding: "12px 14px", background: "#f8fafc", borderRadius: 12, border: "1px solid #e8edf3" },
  stopDelivered: { background: "#f0fdf4", border: "1px solid #bbf7d0" },
  stopLeft: { flexShrink: 0 },
  stopNum: { width: 28, height: 28, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center" },
  stopBody: { flex: 1, minWidth: 0 },
  stopTopRow: { display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8, marginBottom: 5 },
  stopAddress: { fontSize: 13, fontWeight: 600, color: "#0f172a", margin: 0, lineHeight: 1.4 },
  stopBadge: { flexShrink: 0, borderRadius: 99, padding: "2px 9px", fontSize: 11, fontWeight: 700 },
  badgeBlue: { background: "#dbeafe", color: "#1e40af" },
  badgeGreen: { background: "#dcfce7", color: "#14532d" },
  stopMeta: { display: "flex", gap: 12 },
  stopMetaItem: { display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: "#64748b" },
  predRow: { display: "flex", gap: 12, padding: "10px 0", borderBottom: "1px solid #f1f5f9" },
  predIndex: { width: 24, height: 24, borderRadius: 6, background: "#f1f5f9", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: "#64748b" },
  predBody: { flex: 1 },
  predAddress: { fontSize: 13, fontWeight: 600, color: "#0f172a", margin: "0 0 6px" },
  predError: { fontSize: 12, color: "#dc2626", margin: 0 },
  predBars: { display: "flex", flexDirection: "column", gap: 4 },
  predBar: { display: "flex", alignItems: "center", gap: 8 },
  predBarLabel: { fontSize: 11, color: "#64748b", width: 48, flexShrink: 0 },
  barTrack: { flex: 1, height: 6, background: "#f1f5f9", borderRadius: 99, overflow: "hidden" },
  barFill: { height: "100%", borderRadius: 99, transition: "width 0.5s ease" },
  barGreen: { background: "#10b981" },
  barRed: { background: "#f87171" },
  predBarVal: { fontSize: 11, fontWeight: 700, color: "#374151", width: 32, textAlign: "right" },
  dataTable: { fontSize: 12 },
  tableHead: { display: "flex", gap: 8, padding: "6px 0", borderBottom: "1px solid #e8edf3", marginBottom: 4 },
  tableRow: { display: "flex", gap: 8, padding: "7px 0", borderBottom: "1px solid #f8fafc" },
  thCell: { flex: 1, color: "#94a3b8", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.04em", fontSize: 10 },
  tdCell: { flex: 1, color: "#374151", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" },
  emptyState: { display: "flex", flexDirection: "column", alignItems: "center", padding: "32px 0", gap: 8 },
  emptyText: { fontSize: 14, fontWeight: 600, color: "#64748b", margin: 0 },
  emptySub: { fontSize: 12, color: "#94a3b8", margin: 0, textAlign: "center" },
}
