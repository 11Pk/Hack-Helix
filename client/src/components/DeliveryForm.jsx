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



//     const newDelivery = {

//       id: Date.now(),

//       address: drop,

//       customerId,

//       time,

//       delivered: false,

//     }



//     setList([...list, newDelivery])

//     setDrop("")

//     setCustomerId("")

//     setTime("")

//   }



//   const markDelivered = (id) => {

//     const updated = list.map((item) =>

//       item.id === id ? { ...item, delivered: true } : item

//     )

//     setList(updated)

//     const done = updated.find((i) => i.id === id)

//     setHistory([...history, done])

//   }



//   async function generateOptimizedRoute() {

//     if (!pickup?.trim()) {

//       alert("Enter rider location.")

//       return

//     }

//     if (list.length === 0) {

//       alert("Add at least one delivery stop.")

//       return

//     }



//     setGenerating(true)

//     setStopPredictions([])



//     try {

//       // 1) Predict for each stop first; store results in state as we go
//       const results = []

//       for (const stop of list) {

//         try {

//           const prediction = await fetchPredictForStop(pickup, stop)

//           results.push({

//             id: stop.id,

//             address: stop.address,

//             customerId: stop.customerId,

//             time: stop.time,

//             prediction,

//             error: null,

//           })

//         } catch (e) {

//           results.push({

//             id: stop.id,

//             address: stop.address,

//             customerId: stop.customerId,

//             time: stop.time,

//             prediction: null,

//             error: e?.message || "Request failed",

//           })

//         }

//         setStopPredictions([...results])

//       }

//       // 2) Then call optimize-route with the same rows as `items` (not a separate blob)
//       const res = await fetch(`${API_BASE}/optimize-route`, {

//         method: "POST",

//         headers: { "Content-Type": "application/json" },

//         body: JSON.stringify({

//           rider: pickup.trim(),

//           items: list.map((i) => ({

//             address: i.address,

//             customerId: i.customerId,

//             time: i.time,

//           })),

//         }),

//       })

//       const data = await res.json().catch(() => ({}))

//       if (!res.ok || data.error) {

//         alert(data.error || parseApiError(data) || "Optimize route failed")

//         return

//       }

//       navigate("/optimize", {

//         state: {

//           ...data,

//           rider: pickup.trim(),

//           stopPredictions: results,

//         },

//       })

//     } catch (e) {

//       alert(e?.message || "Something went wrong.")

//     } finally {

//       setGenerating(false)

//     }

//   }



//   return (

//     <div className="min-h-screen bg-slate-900 text-white p-6">

//       <div className="flex justify-between mb-6">

//         <h1>Welcome {user?.firstName}</h1>

//         <UserButton afterSignOutUrl="/" />

//       </div>



//       <input

//         placeholder="Rider Location"

//         value={pickup}

//         onChange={(e) => setPickup(e.target.value)}

//         className="w-full p-2 mb-3 bg-slate-700 rounded"

//       />



//       <input

//         placeholder="Delivery Location"

//         value={drop}

//         onChange={(e) => setDrop(e.target.value)}

//         className="w-full p-2 mb-3 bg-slate-700 rounded"

//       />



//       <input

//         placeholder="Customer ID"

//         value={customerId}

//         onChange={(e) => setCustomerId(e.target.value)}

//         className="w-full p-2 mb-3 bg-slate-700 rounded"

//       />



//       <input

//         type="time"

//         value={time}

//         onChange={(e) => setTime(e.target.value)}

//         className="w-full p-2 mb-3 bg-slate-700 rounded"

//       />



//       <button

//         type="button"

//         onClick={handleAdd}

//         className="bg-green-500 p-2 w-full mb-3 rounded"

//       >

//         Add Stop

//       </button>



//       <button

//         type="button"

//         onClick={generateOptimizedRoute}

//         disabled={generating}

//         className="bg-blue-500 p-2 w-full rounded disabled:opacity-50"

//       >

//         {generating ? "Predicting stops, then optimizing…" : "Generate optimized route"}

//       </button>



//       {stopPredictions.length > 0 && (

//         <div className="mt-4 p-3 bg-slate-800 rounded text-sm">

//           <h3 className="font-semibold mb-2">Latest predictions (per stop)</h3>

//           {stopPredictions.map((row) => (

//             <div key={row.id} className="mb-2 border-b border-slate-600 pb-2 last:border-0">

//               <p className="text-slate-300">{row.address}</p>

//               {row.error ? (

//                 <p className="text-red-400">{row.error}</p>

//               ) : (

//                 <p>

//                   success {row.prediction?.success_probability} · failure{" "}

//                   {row.prediction?.failure_probability}

//                 </p>

//               )}

//             </div>

//           ))}

//         </div>

//       )}



//       <div className="mt-4">

//         <h2>Delivery stops ({list.length})</h2>



//         {list.map((item) => (

//           <div key={item.id} className="bg-slate-800 p-3 mb-2 rounded">

//             <p>

//               <strong>Address:</strong> {item.address}

//             </p>

//             <p>

//               <strong>Customer:</strong> {item.customerId}

//             </p>

//             <p>

//               <strong>Time:</strong> {item.time}

//             </p>

//             <p>

//               Status: {item.delivered ? "✅ Delivered" : "❌ Pending"}

//             </p>



//             {!item.delivered && (

//               <button

//                 type="button"

//                 onClick={() => markDelivered(item.id)}

//                 className="bg-yellow-500 px-2 py-1 mt-2 rounded"

//               >

//                 Mark Delivered

//               </button>

//             )}

//           </div>

//         ))}

//       </div>



//       <div className="mt-6">

//         <h2>ML Dataset</h2>

//         {history.map((item) => (

//           <p key={item.id}>

//             {item.customerId} | {item.time} | {item.address} | Delivered

//           </p>

//         ))}

//       </div>

//     </div>

//   )

// }

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



//     const newDelivery = {

//       id: Date.now(),

//       address: drop,

//       customerId,

//       time,

//       delivered: false,

//     }



//     setList([...list, newDelivery])

//     setDrop("")

//     setCustomerId("")

//     setTime("")

//   }



//   const markDelivered = (id) => {

//     const updated = list.map((item) =>

//       item.id === id ? { ...item, delivered: true } : item

//     )

//     setList(updated)

//     const done = updated.find((i) => i.id === id)

//     setHistory([...history, done])

//   }



//   async function generateOptimizedRoute() {

//     if (!pickup?.trim()) {

//       alert("Enter rider location.")

//       return

//     }

//     if (list.length === 0) {

//       alert("Add at least one delivery stop.")

//       return

//     }



//     setGenerating(true)

//     setStopPredictions([])



//     try {

//       // 1) Predict for each stop first; store results in state as we go
//       const results = []

//       for (const stop of list) {

//         try {

//           const prediction = await fetchPredictForStop(pickup, stop)

//           results.push({

//             id: stop.id,

//             address: stop.address,

//             customerId: stop.customerId,

//             time: stop.time,

//             prediction,

//             error: null,

//           })

//         } catch (e) {

//           results.push({

//             id: stop.id,

//             address: stop.address,

//             customerId: stop.customerId,

//             time: stop.time,

//             prediction: null,

//             error: e?.message || "Request failed",

//           })

//         }

//         setStopPredictions([...results])

//       }

//       // 2) Then call optimize-route with the same rows as `items` (not a separate blob)
//       const res = await fetch(`${API_BASE}/optimize-route`, {

//         method: "POST",

//         headers: { "Content-Type": "application/json" },

//         body: JSON.stringify({

//           rider: pickup.trim(),

//           items: list.map((i) => ({

//             address: i.address,

//             customerId: i.customerId,

//             time: i.time,

//           })),

//         }),

//       })

//       const data = await res.json().catch(() => ({}))

//       if (!res.ok || data.error) {

//         alert(data.error || parseApiError(data) || "Optimize route failed")

//         return

//       }

//       navigate("/optimize", {

//         state: {

//           ...data,

//           rider: pickup.trim(),

//           stopPredictions: results,

//         },

//       })

//     } catch (e) {

//       alert(e?.message || "Something went wrong.")

//     } finally {

//       setGenerating(false)

//     }

//   }



//   return (

//     <div className="min-h-screen bg-slate-900 text-white p-6">

//       <div className="flex justify-between mb-6">

//         <h1>Welcome {user?.firstName}</h1>

//         <UserButton afterSignOutUrl="/" />

//       </div>



//       <input

//         placeholder="Rider Location"

//         value={pickup}

//         onChange={(e) => setPickup(e.target.value)}

//         className="w-full p-2 mb-3 bg-slate-700 rounded"

//       />



//       <input

//         placeholder="Delivery Location"

//         value={drop}

//         onChange={(e) => setDrop(e.target.value)}

//         className="w-full p-2 mb-3 bg-slate-700 rounded"

//       />



//       <input

//         placeholder="Customer ID"

//         value={customerId}

//         onChange={(e) => setCustomerId(e.target.value)}

//         className="w-full p-2 mb-3 bg-slate-700 rounded"

//       />



//       <input

//         type="text"
//   placeholder="HH:MM"
//   value={time}

//         onChange={(e) => setTime(e.target.value)}

//         className="w-full p-2 mb-3 bg-slate-700 rounded"

//       />



//       <button

//         type="button"

//         onClick={handleAdd}

//         className="bg-green-500 p-2 w-full mb-3 rounded"

//       >

//         Add Stop

//       </button>



//       <button

//         type="button"

//         onClick={generateOptimizedRoute}

//         disabled={generating}

//         className="bg-blue-500 p-2 w-full rounded disabled:opacity-50"

//       >

//         {generating ? "Predicting stops, then optimizing…" : "Generate optimized route"}

//       </button>



//       {stopPredictions.length > 0 && (

//         <div className="mt-4 p-3 bg-slate-800 rounded text-sm">

//           <h3 className="font-semibold mb-2">Latest predictions (per stop)</h3>

//           {stopPredictions.map((row) => (

//             <div key={row.id} className="mb-2 border-b border-slate-600 pb-2 last:border-0">

//               <p className="text-slate-300">{row.address}</p>

//               {row.error ? (

//                 <p className="text-red-400">{row.error}</p>

//               ) : (

//                 <p>

//                   success {row.prediction?.success_probability} · failure{" "}

//                   {row.prediction?.failure_probability}

//                 </p>

//               )}

//             </div>

//           ))}

//         </div>

//       )}



//       <div className="mt-4">

//         <h2>Delivery stops ({list.length})</h2>



//         {list.map((item) => (

//           <div key={item.id} className="bg-slate-800 p-3 mb-2 rounded">

//             <p>

//               <strong>Address:</strong> {item.address}

//             </p>

//             <p>

//               <strong>Customer:</strong> {item.customerId}

//             </p>

//             <p>

//               <strong>Time:</strong> {item.time}

//             </p>

//             <p>

//               Status: {item.delivered ? "✅ Delivered" : "❌ Pending"}

//             </p>



//             {!item.delivered && (

//               <button

//                 type="button"

//                 onClick={() => markDelivered(item.id)}

//                 className="bg-yellow-500 px-2 py-1 mt-2 rounded"

//               >

//                 Mark Delivered

//               </button>

//             )}

//           </div>

//         ))}

//       </div>



//       <div className="mt-6">

//         <h2>ML Dataset</h2>

//         {history.map((item) => (

//           <p key={item.id}>

//             {item.customerId} | {item.time} | {item.address} | Delivered

//           </p>

//         ))}

//       </div>

//     </div>

//   )

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

/**
 * Held-Karp style DP — same algorithm that was in RouteOptimizer.jsx.
 * Returns the optimal visit order as an array of matrix indices.
 */
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
    if (dp[finalMask][i] < best) {
      best = dp[finalMask][i]
      last = i
    }
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

    const newDelivery = {
      id: Date.now(),
      address: drop,
      customerId,
      time,
      delivered: false,
    }

    setList([...list, newDelivery])
    setDrop("")
    setCustomerId("")
    setTime("")
  }

  const markDelivered = (id) => {
    const updated = list.map((item) =>
      item.id === id ? { ...item, delivered: true } : item
    )
    setList(updated)
    const done = updated.find((i) => i.id === id)
    setHistory([...history, done])
  }

  async function generateOptimizedRoute() {
    if (!pickup?.trim()) {
      alert("Enter rider location.")
      return
    }
    if (list.length === 0) {
      alert("Add at least one delivery stop.")
      return
    }

    setGenerating(true)
    setStopPredictions([])

    try {
      // 1) Predict for each stop
      const results = []
      for (const stop of list) {
        try {
          const prediction = await fetchPredictForStop(pickup, stop)
          results.push({
            id: stop.id,
            address: stop.address,
            customerId: stop.customerId,
            time: stop.time,
            prediction,
            error: null,
          })
        } catch (e) {
          results.push({
            id: stop.id,
            address: stop.address,
            customerId: stop.customerId,
            time: stop.time,
            prediction: null,
            error: e?.message || "Request failed",
          })
        }
        setStopPredictions([...results])
      }

      // 2) Call optimize-route to get distance matrix + coordinates
      const res = await fetch(`${API_BASE}/optimize-route`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rider: pickup.trim(),
          items: list.map((i) => ({
            address: i.address,
            customerId: i.customerId,
            time: i.time,
          })),
        }),
      })

      const data = await res.json().catch(() => ({}))
      if (!res.ok || data.error) {
        alert(data.error || parseApiError(data) || "Optimize route failed")
        return
      }

      // 3) Run DP locally (eliminates the /optimize page entirely)
      const { matrix, coordinates } = data
      const n = matrix.length
      const probability = results.map((r) =>
        Number(r.prediction?.failure_probability) || 0.3
      )
      // Pad probability if matrix is larger (index 0 = depot)
      const fullProb = [0.3, ...probability].slice(0, n)
      const traffic = Array.from({ length: n }, () => Array(n).fill(1))
      const optimizedRoute = getOptimalRoute(matrix, fullProb, traffic)

      // 4) Navigate directly to /dashboard — modal will open automatically
      navigate("/dashboard", {
        state: {
          optimizedRoute,
          coordinates,
          rider: pickup.trim(),
          stopPredictions: results,
          matrix,
        },
      })
    } catch (e) {
      alert(e?.message || "Something went wrong.")
    } finally {
      setGenerating(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6">
      <div className="flex justify-between mb-6">
        <h1>Welcome {user?.firstName}</h1>
        <UserButton afterSignOutUrl="/" />
      </div>

      <input
        placeholder="Rider Location"
        value={pickup}
        onChange={(e) => setPickup(e.target.value)}
        className="w-full p-2 mb-3 bg-slate-700 rounded"
      />

      <input
        placeholder="Delivery Location"
        value={drop}
        onChange={(e) => setDrop(e.target.value)}
        className="w-full p-2 mb-3 bg-slate-700 rounded"
      />

      <input
        placeholder="Customer ID"
        value={customerId}
        onChange={(e) => setCustomerId(e.target.value)}
        className="w-full p-2 mb-3 bg-slate-700 rounded"
      />

      <input
        type="text"
        placeholder="HH:MM"
        value={time}
        onChange={(e) => setTime(e.target.value)}
        className="w-full p-2 mb-3 bg-slate-700 rounded"
      />

      <button
        type="button"
        onClick={handleAdd}
        className="bg-green-500 p-2 w-full mb-3 rounded"
      >
        Add Stop
      </button>

      <button
        type="button"
        onClick={generateOptimizedRoute}
        disabled={generating}
        className="bg-blue-500 p-2 w-full rounded disabled:opacity-50"
      >
        {generating ? "Predicting stops, then optimizing…" : "Analyze Route"}
      </button>

      {stopPredictions.length > 0 && (
        <div className="mt-4 p-3 bg-slate-800 rounded text-sm">
          <h3 className="font-semibold mb-2">Live predictions (per stop)</h3>
          {stopPredictions.map((row) => (
            <div key={row.id} className="mb-2 border-b border-slate-600 pb-2 last:border-0">
              <p className="text-slate-300">{row.address}</p>
              {row.error ? (
                <p className="text-red-400">{row.error}</p>
              ) : (
                <p>
                  success {row.prediction?.success_probability} · failure{" "}
                  {row.prediction?.failure_probability}
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      <div className="mt-4">
        <h2>Delivery stops ({list.length})</h2>
        {list.map((item) => (
          <div key={item.id} className="bg-slate-800 p-3 mb-2 rounded">
            <p><strong>Address:</strong> {item.address}</p>
            <p><strong>Customer:</strong> {item.customerId}</p>
            <p><strong>Time:</strong> {item.time}</p>
            <p>Status: {item.delivered ? "✅ Delivered" : "❌ Pending"}</p>
            {!item.delivered && (
              <button
                type="button"
                onClick={() => markDelivered(item.id)}
                className="bg-yellow-500 px-2 py-1 mt-2 rounded"
              >
                Mark Delivered
              </button>
            )}
          </div>
        ))}
      </div>

      <div className="mt-6">
        <h2>ML Dataset</h2>
        {history.map((item) => (
          <p key={item.id}>
            {item.customerId} | {item.time} | {item.address} | Delivered
          </p>
        ))}
      </div>
    </div>
  )
}