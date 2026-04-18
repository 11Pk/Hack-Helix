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
        navigate("/delivery") // your page
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
      // ask Clerk to send email code
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
    <div className="flex items-center justify-center h-screen bg-gradient-to-br from-slate-900 to-slate-800">
      <div className="bg-slate-800/60 backdrop-blur p-8 rounded-xl w-96 shadow-xl border border-slate-700">
        <h2 className="text-2xl mb-6 text-center font-bold text-white">
          Delivery Co-Pilot
        </h2>

        {!needsVerification ? (
          <>
            <input
              className="w-full p-2 mb-4 bg-slate-700 rounded text-white"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              className="w-full p-2 mb-4 bg-slate-700 rounded text-white"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <button
              onClick={mode === "login" ? handleLogin : handleSignup}
              className="w-full bg-green-500 hover:bg-green-400 p-2 rounded font-semibold mb-4"
            >
              {mode === "login" ? "Start Delivering" : "Create Account"}
            </button>

            <p className="text-sm text-gray-400 text-center">
              {mode === "login" ? "Don't have an account?" : "Already have an account?"}
              <span
                onClick={() => setMode(mode === "login" ? "signup" : "login")}
                className="text-green-400 ml-2 cursor-pointer"
              >
                {mode === "login" ? "Sign up" : "Login"}
              </span>
            </p>
          </>
        ) : (
          <>
            <p className="text-gray-300 mb-3 text-sm">
              Enter the code sent to your email
            </p>
            <input
              className="w-full p-2 mb-4 bg-slate-700 rounded text-white"
              placeholder="Verification code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />
            <button
              onClick={verifyCode}
              className="w-full bg-green-500 hover:bg-green-400 p-2 rounded font-semibold"
            >
              Verify & Continue
            </button>
          </>
        )}
      </div>
    </div>
  )
}