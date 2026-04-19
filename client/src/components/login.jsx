// import { useState } from "react"
// import { useSignIn, useSignUp } from "@clerk/clerk-react"
// import { useNavigate } from "react-router-dom"

// export default function Login() {
//   const navigate = useNavigate()

//   const { isLoaded: siLoaded, signIn, setActive } = useSignIn()
//   const { isLoaded: suLoaded, signUp } = useSignUp()

//   const [mode, setMode] = useState("login") // "login" | "signup"
//   const [email, setEmail] = useState("")
//   const [password, setPassword] = useState("")
//   const [code, setCode] = useState("") // for email verification
//   const [needsVerification, setNeedsVerification] = useState(false)

//   // LOGIN (no redirect)
//   const handleLogin = async () => {
//     if (!siLoaded) return
//     try {
//       const res = await signIn.create({
//         identifier: email,
//         password,
//       })
//       if (res.status === "complete") {
//         await setActive({ session: res.createdSessionId })
//         navigate("/delivery") // your page
//       }
//     } catch (e) {
//       alert(e?.errors?.[0]?.message || "Login failed")
//     }
//   }

//   // SIGNUP (with email code verification)
//   const handleSignup = async () => {
//     if (!suLoaded) return
//     try {
//       await signUp.create({
//         emailAddress: email,
//         password,
//       })
//       // ask Clerk to send email code
//       await signUp.prepareEmailAddressVerification({ strategy: "email_code" })
//       setNeedsVerification(true)
//     } catch (e) {
//       alert(e?.errors?.[0]?.message || "Signup failed")
//     }
//   }

//   const verifyCode = async () => {
//     if (!suLoaded) return
//     try {
//       const res = await signUp.attemptEmailAddressVerification({ code })
//       if (res.status === "complete") {
//         await setActive({ session: res.createdSessionId })
//         navigate("/delivery")
//       }
//     } catch (e) {
//       alert(e?.errors?.[0]?.message || "Invalid code")
//     }
//   }

//   return (
//     <div className="flex items-center justify-center h-screen bg-gradient-to-br from-slate-900 to-slate-800">
//       <div className="bg-slate-800/60 backdrop-blur p-8 rounded-xl w-96 shadow-xl border border-slate-700">
//         <h2 className="text-2xl mb-6 text-center font-bold text-white">
//           Delivery Co-Pilot
//         </h2>

//         {!needsVerification ? (
//           <>
//             <input
//               className="w-full p-2 mb-4 bg-slate-700 rounded text-white"
//               placeholder="Email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//             />
//             <input
//               type="password"
//               className="w-full p-2 mb-4 bg-slate-700 rounded text-white"
//               placeholder="Password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//             />

//             <button
//               onClick={mode === "login" ? handleLogin : handleSignup}
//               className="w-full bg-green-500 hover:bg-green-400 p-2 rounded font-semibold mb-4"
//             >
//               {mode === "login" ? "Start Delivering" : "Create Account"}
//             </button>

//             <p className="text-sm text-gray-400 text-center">
//               {mode === "login" ? "Don't have an account?" : "Already have an account?"}
//               <span
//                 onClick={() => setMode(mode === "login" ? "signup" : "login")}
//                 className="text-green-400 ml-2 cursor-pointer"
//               >
//                 {mode === "login" ? "Sign up" : "Login"}
//               </span>
//             </p>
//           </>
//         ) : (
//           <>
//             <p className="text-gray-300 mb-3 text-sm">
//               Enter the code sent to your email
//             </p>
//             <input
//               className="w-full p-2 mb-4 bg-slate-700 rounded text-white"
//               placeholder="Verification code"
//               value={code}
//               onChange={(e) => setCode(e.target.value)}
//             />
//             <button
//               onClick={verifyCode}
//               className="w-full bg-green-500 hover:bg-green-400 p-2 rounded font-semibold"
//             >
//               Verify & Continue
//             </button>
//           </>
//         )}
//       </div>
//     </div>
//   )
// }
import { useState } from "react"
import { useSignIn, useSignUp } from "@clerk/clerk-react"
import { useNavigate } from "react-router-dom"

export default function Login() {
  const navigate = useNavigate()

  const { isLoaded: siLoaded, signIn, setActive } = useSignIn()
  const { isLoaded: suLoaded, signUp } = useSignUp()

  const [mode, setMode] = useState("login") // "login" | "signup"
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [code, setCode] = useState("") // for email verification
  const [needsVerification, setNeedsVerification] = useState(false)

  // LOGIN (no redirect)
  const handleLogin = async () => {
    if (!siLoaded) return
    try {
      const res = await signIn.create({
        identifier: email,
        password,
      })
      if (res.status === "complete") {
        await setActive({ session: res.createdSessionId })
        navigate("/delivery")
      }
    } catch (e) {
      alert(e?.errors?.[0]?.message || "Login failed")
    }
  }

  // SIGNUP (with email code verification)
  const handleSignup = async () => {
    if (!suLoaded) return
    try {
      await signUp.create({
        emailAddress: email,
        password,
      })
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" })
      setNeedsVerification(true)
    } catch (e) {
      alert(e?.errors?.[0]?.message || "Signup failed")
    }
  }

  const verifyCode = async () => {
    if (!suLoaded) return
    try {
      const res = await signUp.attemptEmailAddressVerification({ code })
      if (res.status === "complete") {
        await setActive({ session: res.createdSessionId })
        navigate("/delivery")
      }
    } catch (e) {
      alert(e?.errors?.[0]?.message || "Invalid code")
    }
  }

  return (
    <div style={styles.page}>
      {/* Left decorative panel */}
      <div style={styles.leftPanel}>
        <div style={styles.logoMark}>
          <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
            <rect width="36" height="36" rx="10" fill="#1a56db" />
            <path d="M10 26 L18 10 L26 26" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <path d="M13 20 L23 20" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
          <span style={styles.logoText}>Co-Pilot</span>
        </div>

        <div style={styles.heroContent}>
          <h1 style={styles.heroHeading}>Smarter deliveries,<br />faster routes.</h1>
          <p style={styles.heroSub}>AI-powered route optimization that predicts delivery success and gets your riders there first.</p>

          <div style={styles.statRow}>
            {[
              { value: "40%", label: "Faster deliveries" },
              { value: "98%", label: "Route accuracy" },
              { value: "2×", label: "More stops per shift" },
            ].map((s) => (
              <div key={s.label} style={styles.statCard}>
                <span style={styles.statValue}>{s.value}</span>
                <span style={styles.statLabel}>{s.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={styles.mapDots}>
          {/* Decorative map-like dots */}
          {Array.from({ length: 18 }).map((_, i) => (
            <div
              key={i}
              style={{
                ...styles.dot,
                left: `${(i * 37) % 90 + 5}%`,
                top: `${(i * 53) % 80 + 10}%`,
                opacity: 0.12 + (i % 4) * 0.08,
                width: i % 3 === 0 ? 10 : 6,
                height: i % 3 === 0 ? 10 : 6,
              }}
            />
          ))}
          {/* Route line decoration */}
          <svg style={styles.routeSvg} viewBox="0 0 400 300" fill="none">
            <path d="M40 240 Q120 80 200 160 Q280 240 360 60" stroke="white" strokeWidth="1.5" strokeDasharray="6 4" opacity="0.18" />
            <circle cx="40" cy="240" r="5" fill="white" opacity="0.35" />
            <circle cx="200" cy="160" r="5" fill="white" opacity="0.35" />
            <circle cx="360" cy="60" r="5" fill="white" opacity="0.35" />
          </svg>
        </div>
      </div>

      {/* Right form panel */}
      <div style={styles.rightPanel}>
        <div style={styles.formCard}>
          <div style={styles.formHeader}>
            <h2 style={styles.formTitle}>
              {needsVerification ? "Verify your email" : mode === "login" ? "Welcome back" : "Create account"}
            </h2>
            <p style={styles.formSub}>
              {needsVerification
                ? "Enter the 6-digit code we sent you"
                : mode === "login"
                ? "Sign in to your Co-Pilot account"
                : "Start optimizing your deliveries today"}
            </p>
          </div>

          {!needsVerification ? (
            <>
              <div style={styles.fieldGroup}>
                <label style={styles.label}>Email address</label>
                <input
                  style={styles.input}
                  placeholder="you@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={(e) => Object.assign(e.target.style, styles.inputFocus)}
                  onBlur={(e) => Object.assign(e.target.style, styles.input)}
                />
              </div>

              <div style={styles.fieldGroup}>
                <label style={styles.label}>Password</label>
                <input
                  type="password"
                  style={styles.input}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={(e) => Object.assign(e.target.style, styles.inputFocus)}
                  onBlur={(e) => Object.assign(e.target.style, styles.input)}
                />
              </div>

              <button
                onClick={mode === "login" ? handleLogin : handleSignup}
                style={styles.primaryBtn}
                onMouseEnter={(e) => (e.target.style.background = "#1649c5")}
                onMouseLeave={(e) => (e.target.style.background = "#1a56db")}
              >
                {mode === "login" ? "Sign in" : "Create account"}
              </button>

              <div style={styles.switchRow}>
                <span style={styles.switchText}>
                  {mode === "login" ? "Don't have an account?" : "Already have an account?"}
                </span>
                <button
                  onClick={() => setMode(mode === "login" ? "signup" : "login")}
                  style={styles.switchBtn}
                >
                  {mode === "login" ? "Sign up" : "Sign in"}
                </button>
              </div>
            </>
          ) : (
            <>
              <div style={styles.verifyNote}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }}>
                  <rect width="16" height="16" rx="8" fill="#dbeafe" />
                  <path d="M8 5v4M8 11v.5" stroke="#1a56db" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
                Check your inbox — a verification code was sent to <strong>{email}</strong>
              </div>

              <div style={styles.fieldGroup}>
                <label style={styles.label}>Verification code</label>
                <input
                  style={{ ...styles.input, letterSpacing: "0.25em", fontSize: 20, textAlign: "center" }}
                  placeholder="000000"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  onFocus={(e) => Object.assign(e.target.style, styles.inputFocus)}
                  onBlur={(e) => Object.assign(e.target.style, styles.input)}
                  maxLength={6}
                />
              </div>

              <button
                onClick={verifyCode}
                style={styles.primaryBtn}
                onMouseEnter={(e) => (e.target.style.background = "#1649c5")}
                onMouseLeave={(e) => (e.target.style.background = "#1a56db")}
              >
                Verify &amp; continue
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

const styles = {
  page: {
    display: "flex",
    minHeight: "100vh",
    fontFamily: "'Inter', 'Segoe UI', sans-serif",
    background: "#f8fafc",
  },
  // ── Left panel ──────────────────────────────────────────────
  leftPanel: {
    flex: "0 0 480px",
    background: "linear-gradient(145deg, #1a56db 0%, #1240a8 60%, #0d2f7a 100%)",
    display: "flex",
    flexDirection: "column",
    padding: "40px 48px",
    position: "relative",
    overflow: "hidden",
  },
  logoMark: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    zIndex: 1,
  },
  logoText: {
    color: "white",
    fontWeight: 700,
    fontSize: 20,
    letterSpacing: "-0.02em",
  },
  heroContent: {
    marginTop: "auto",
    marginBottom: "auto",
    zIndex: 1,
  },
  heroHeading: {
    color: "white",
    fontSize: 36,
    fontWeight: 800,
    lineHeight: 1.18,
    margin: "0 0 16px",
    letterSpacing: "-0.03em",
  },
  heroSub: {
    color: "rgba(255,255,255,0.72)",
    fontSize: 16,
    lineHeight: 1.65,
    margin: "0 0 36px",
    maxWidth: 340,
  },
  statRow: {
    display: "flex",
    gap: 12,
  },
  statCard: {
    background: "rgba(255,255,255,0.12)",
    borderRadius: 12,
    padding: "14px 16px",
    display: "flex",
    flexDirection: "column",
    gap: 3,
    backdropFilter: "blur(4px)",
    border: "1px solid rgba(255,255,255,0.18)",
    flex: 1,
  },
  statValue: {
    color: "white",
    fontSize: 22,
    fontWeight: 800,
    letterSpacing: "-0.02em",
  },
  statLabel: {
    color: "rgba(255,255,255,0.6)",
    fontSize: 11,
    fontWeight: 500,
    textTransform: "uppercase",
    letterSpacing: "0.05em",
  },
  mapDots: {
    position: "absolute",
    inset: 0,
    pointerEvents: "none",
  },
  dot: {
    position: "absolute",
    borderRadius: "50%",
    background: "white",
  },
  routeSvg: {
    position: "absolute",
    inset: 0,
    width: "100%",
    height: "100%",
  },
  // ── Right / form panel ──────────────────────────────────────
  rightPanel: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "40px 24px",
    background: "#f8fafc",
  },
  formCard: {
    width: "100%",
    maxWidth: 400,
    background: "white",
    borderRadius: 20,
    padding: "40px 36px",
    boxShadow: "0 4px 24px rgba(0,0,0,0.07), 0 1px 4px rgba(0,0,0,0.04)",
    border: "1px solid #e8edf3",
  },
  formHeader: {
    marginBottom: 28,
  },
  formTitle: {
    fontSize: 24,
    fontWeight: 800,
    color: "#0f172a",
    margin: "0 0 6px",
    letterSpacing: "-0.02em",
  },
  formSub: {
    fontSize: 14,
    color: "#64748b",
    margin: 0,
    lineHeight: 1.5,
  },
  fieldGroup: {
    marginBottom: 18,
  },
  label: {
    display: "block",
    fontSize: 13,
    fontWeight: 600,
    color: "#374151",
    marginBottom: 7,
    letterSpacing: "0.01em",
  },
  input: {
    width: "100%",
    padding: "11px 14px",
    borderRadius: 10,
    border: "1.5px solid #e2e8f0",
    fontSize: 15,
    color: "#0f172a",
    background: "#f8fafc",
    outline: "none",
    boxSizing: "border-box",
    transition: "border-color 0.15s",
    fontFamily: "inherit",
  },
  inputFocus: {
    width: "100%",
    padding: "11px 14px",
    borderRadius: 10,
    border: "1.5px solid #1a56db",
    fontSize: 15,
    color: "#0f172a",
    background: "white",
    outline: "none",
    boxSizing: "border-box",
    fontFamily: "inherit",
  },
  primaryBtn: {
    width: "100%",
    padding: "13px",
    background: "#1a56db",
    color: "white",
    border: "none",
    borderRadius: 10,
    fontSize: 15,
    fontWeight: 700,
    cursor: "pointer",
    marginTop: 6,
    marginBottom: 20,
    letterSpacing: "-0.01em",
    transition: "background 0.15s",
    fontFamily: "inherit",
  },
  switchRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  switchText: {
    fontSize: 13,
    color: "#64748b",
  },
  switchBtn: {
    background: "none",
    border: "none",
    color: "#1a56db",
    fontSize: 13,
    fontWeight: 700,
    cursor: "pointer",
    padding: 0,
    fontFamily: "inherit",
  },
  verifyNote: {
    display: "flex",
    alignItems: "flex-start",
    gap: 10,
    background: "#eff6ff",
    border: "1px solid #bfdbfe",
    borderRadius: 10,
    padding: "12px 14px",
    fontSize: 13,
    color: "#1e40af",
    lineHeight: 1.5,
    marginBottom: 20,
  },
}