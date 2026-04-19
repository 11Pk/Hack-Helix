import { useLocation } from "react-router-dom"
import { useState, useEffect } from "react"

export default function RouteOptimizer() {

  const location = useLocation()
  const data = location.state

  const [route, setRoute] = useState([])

  // 🔥 DP FUNCTION (FULL)
  function getOptimalRoute(distance, probability, traffic) {
    const n = distance.length
    const FULL = 1 << n

    const dp = Array.from({ length: FULL }, () =>
      Array(n).fill(Infinity)
    )

    const parent = Array.from({ length: FULL }, () =>
      Array(n).fill(-1)
    )

    dp[1][0] = 0

    for (let mask = 1; mask < FULL; mask++) {
      for (let u = 0; u < n; u++) {
        if (!(mask & (1 << u))) continue

        for (let v = 0; v < n; v++) {
          if (mask & (1 << v)) continue

          const nextMask = mask | (1 << v)

          const cost =
            distance[u][v] *
            (1 + probability[v]) *
            traffic[u][v]

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
      mask ^= (1 << last)
      last = prev
    }

    return result.reverse()
  }

  useEffect(() => {
    if (!data) return

    const { matrix } = data

    const n = matrix.length

    // dummy values (replace later with ML + traffic)
    const probability = Array(n).fill(0.3)

    const traffic = Array.from({ length: n }, () =>
      Array(n).fill(1)
    )

    const result = getOptimalRoute(matrix, probability, traffic)

    setRoute(result)

  }, [data])

  if (!data) {
    return <div className="text-white p-6">No data received</div>
  }

  const { matrix, stopPredictions = [], rider } = data

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6">

      <h1 className="text-xl mb-6">Optimized Route (DP)</h1>

      {rider && (
        <p className="mb-4 text-slate-300">
          Rider: <span className="text-white">{rider}</span>
        </p>
      )}

      {stopPredictions.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg mb-2">ML predictions (per stop)</h2>
          <div className="overflow-x-auto rounded border border-slate-600">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="bg-slate-800 text-left">
                  <th className="px-3 py-2">Address</th>
                  <th className="px-3 py-2">Customer</th>
                  <th className="px-3 py-2">Time</th>
                  <th className="px-3 py-2">Success</th>
                  <th className="px-3 py-2">Failure</th>
                  <th className="px-3 py-2">Notes</th>
                </tr>
              </thead>
              <tbody>
                {stopPredictions.map((row) => (
                  <tr key={row.id} className="border-t border-slate-600">
                    <td className="px-3 py-2">{row.address}</td>
                    <td className="px-3 py-2">{row.customerId}</td>
                    <td className="px-3 py-2">{row.time}</td>
                    <td className="px-3 py-2">
                      {row.prediction?.success_probability ?? "—"}
                    </td>
                    <td className="px-3 py-2">
                      {row.prediction?.failure_probability ?? "—"}
                    </td>
                    <td className="px-3 py-2 text-red-400">
                      {row.error || ""}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ROUTE */}
      <div className="mb-6">
        <h2 className="text-lg mb-2">Route Order:</h2>

        <div className="flex gap-2 flex-wrap">
          {route.map((idx, i) => (
            <span
              key={i}
              className="bg-green-500 px-3 py-1 rounded"
            >
              {idx}
            </span>
          ))}
        </div>
      </div>

      {/* MATRIX */}
      <div>
        <h2 className="text-lg mb-2">Distance Matrix:</h2>

        <div className="overflow-x-auto">
          <table className="border border-gray-500">
            <tbody>
              {matrix.map((row, i) => (
                <tr key={i}>
                  {row.map((val, j) => (
                    <td
                      key={j}
                      className="border border-gray-600 px-3 py-1"
                    >
                      {val.toFixed(2)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>

    </div>
  )
}