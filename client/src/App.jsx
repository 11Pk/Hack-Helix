import { Routes, Route } from "react-router-dom"
// import Login from "./components/Login"
// import Dashboard from "./components/Dashboard"
import DeliveryForm from "./components/DeliveryForm"
import DeliveryDashboard from "./components/DeliveryDashboard"

export default function App() {
  return (
    <div className="bg-slate-900 min-h-screen text-white">
      <Routes>
        {/* <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} /> */}
         <Route path="/add-delivery" element={<DeliveryForm />} />
         <Route path="/dashboard" element={<DeliveryDashboard />} />
      </Routes>
    </div>
  )
}