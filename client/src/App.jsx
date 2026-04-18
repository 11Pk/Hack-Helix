import { Routes, Route } from "react-router-dom"
import Login from "./components/login"
import RouteOptimizer from "./components/RouteOptimizer"
import DeliveryForm from "./components/DeliveryForm"

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
 <Route path="/optimize" element={<RouteOptimizer />} />
      <Route path="/delivery" element={<DeliveryForm />} />
    </Routes>
  )
}