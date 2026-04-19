import { Routes, Route } from "react-router-dom"
import Login from "./components/login"
import RouteOptimizer from "./components/RouteOptimizer"
import DeliveryForm from "./components/DeliveryForm"
import DeliveryDashboard from "./components/DeliveryDashboard"

export default function App() {
  return (
    
      <Routes>
        {/* <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} /> */}
        <Route path="/optimize" element={<RouteOptimizer />} />
         <Route path="/add-delivery" element={<DeliveryForm />} />
           <Route path="/" element={<Login />} />
         <Route path="/dashboard" element={<DeliveryDashboard />} />
      </Routes>
    
  )
}