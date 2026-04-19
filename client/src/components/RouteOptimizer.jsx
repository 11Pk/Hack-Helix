import { useMemo, useEffect, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import DeliveryDashboard from "./DeliveryDashboard";

function getOptimalRoute(distance, probability, traffic) {
  const n = distance.length;
  const FULL = 1 << n;

  const dp = Array.from({ length: FULL }, () => Array(n).fill(Infinity));
  const parent = Array.from({ length: FULL }, () => Array(n).fill(-1));

  dp[1][0] = 0;

  for (let mask = 1; mask < FULL; mask++) {
    for (let u = 0; u < n; u++) {
      if (!(mask & (1 << u))) continue;

      for (let v = 0; v < n; v++) {
        if (mask & (1 << v)) continue;

        const nextMask = mask | (1 << v);
        const cost = distance[u][v] * (1 + probability[v]) * traffic[u][v];

        if (dp[mask][u] + cost < dp[nextMask][v]) {
          dp[nextMask][v] = dp[mask][u] + cost;
          parent[nextMask][v] = u;
        }
      }
    }
  }

  const finalMask = FULL - 1;
  let last = 0;
  let best = Infinity;

  for (let i = 0; i < n; i++) {
    if (dp[finalMask][i] < best) {
      best = dp[finalMask][i];
      last = i;
    }
  }

  let mask = finalMask;
  const result = [];

  while (last !== -1) {
    result.push(last);
    const prev = parent[mask][last];
    mask ^= 1 << last;
    last = prev;
  }

  return result.reverse();
}

function stopBadgeClass(seqIndex, total) {
  if (total <= 1) return "bg-rose-600 text-white";
  const t = seqIndex / Math.max(total - 1, 1);
  if (t <= 0.35) return "bg-emerald-500 text-white";
  if (t <= 0.7) return "bg-amber-500 text-slate-900";
  return "bg-rose-600 text-white";
}

export default function RouteOptimizer() {
  const location = useLocation();
  const navigate = useNavigate();
  const data = location.state;

  const route = useMemo(() => {
    if (!data?.matrix?.length) return [];
    const { matrix } = data;
    const n = matrix.length;
    const probability = Array(n).fill(0.3);
    const traffic = Array.from({ length: n }, () => Array(n).fill(1));
    return getOptimalRoute(matrix, probability, traffic);
  }, [data]);

  const mergedState = useMemo(() => {
    if (!data) return null;
    return {
      ...data,
      optimizedRoute: route,
      rider: data.rider,
      stopPredictions: data.stopPredictions ?? [],
    };
  }, [data, route]);

  const orderedDeliveries = useMemo(() => {
    if (!data || route.length === 0) return [];
    const preds = data.stopPredictions ?? [];
    return route
      .filter((idx) => idx !== 0)
      .map((matrixIdx, i) => {
        const pred = preds[matrixIdx - 1];
        const address = pred?.address ?? `Stop ${matrixIdx}`;
        return {
          key: `${matrixIdx}-${i}`,
          matrixIdx,
          sequence: i + 1,
          address,
        };
      });
  }, [data, route]);

  const totalDeliveries = orderedDeliveries.length;
  const completedCount = 0;
  const remaining = Math.max(0, totalDeliveries - completedCount);
  const progressPct = totalDeliveries === 0 ? 0 : Math.round((completedCount / totalDeliveries) * 100);

  const riderLabel = data?.rider ?? "Depot";

  const closeToDashboard = useCallback(() => {
    if (!mergedState) return;
    navigate("/dashboard", { state: mergedState, replace: true });
  }, [mergedState, navigate]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") closeToDashboard();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [closeToDashboard]);

  if (!data) {
    return (
      <div className="min-h-screen bg-slate-900 p-6 text-white">
        <p>No route data. Go back to Delivery and generate an optimized route.</p>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      <div className="absolute inset-0 z-0">
        {mergedState && <DeliveryDashboard routeState={mergedState} />}
      </div>

      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
        <button
          type="button"
          className="absolute inset-0 bg-slate-950/75 backdrop-blur-[2px] transition hover:bg-slate-950/80"
          aria-label="Close dialog"
          onClick={closeToDashboard}
        />

        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="optimized-route-title"
          className="relative z-10 flex max-h-[min(85vh,640px)] w-full max-w-lg flex-col overflow-hidden rounded-2xl border border-slate-700/90 bg-slate-950 shadow-2xl ring-1 ring-white/5"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="shrink-0 border-b border-slate-800 px-5 pb-4 pt-5">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h2 id="optimized-route-title" className="text-lg font-bold tracking-tight text-white">
                  Optimized Route
                </h2>
                <p className="mt-1 font-mono text-xs text-slate-500">
                  {riderLabel} <span className="text-slate-600">→</span> {totalDeliveries}{" "}
                  {totalDeliveries === 1 ? "stop" : "stops"}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <span className="rounded-full bg-sky-600 px-2.5 py-1 text-xs font-semibold text-white shadow-sm">
                  {remaining} left
                </span>
                <button
                  type="button"
                  onClick={closeToDashboard}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-700 text-slate-400 transition hover:border-slate-500 hover:bg-slate-800 hover:text-white"
                  aria-label="Close"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="mt-5">
              <div className="flex items-center justify-between text-[11px] font-medium uppercase tracking-wide text-slate-500">
                <span>Progress</span>
                <span className="font-mono normal-case text-slate-300">{progressPct}%</span>
              </div>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-800">
                <div
                  className="h-full rounded-full bg-sky-500 transition-all duration-500"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
            </div>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4">
            {orderedDeliveries.length === 0 ? (
              <p className="rounded-xl border border-slate-800 bg-slate-900/50 p-4 text-center font-mono text-sm text-slate-500">
                No delivery stops in this route.
              </p>
            ) : (
              <ul className="space-y-2.5">
                {orderedDeliveries.map((stop) => (
                  <li
                    key={stop.key}
                    className="flex items-center gap-3 rounded-xl border border-slate-800/90 bg-slate-900/50 px-3 py-3"
                  >
                    <span
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold ${stopBadgeClass(
                        stop.sequence - 1,
                        totalDeliveries,
                      )}`}
                    >
                      {stop.sequence}
                    </span>
                    <span className="min-w-0 flex-1 font-mono text-[13px] leading-snug text-slate-300">
                      {stop.address}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="shrink-0 border-t border-slate-800 px-5 py-4">
            <div className="flex items-center justify-between font-mono text-xs text-sky-300/90">
              <span>
                Completed: {completedCount}/{totalDeliveries || 0}
              </span>
              <span>Remaining: {remaining}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
