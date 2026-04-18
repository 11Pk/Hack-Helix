<<<<<<< HEAD

import './App.css'
import DeliveryDashboard from './components/DeliveryDashboard';
function App() {
 
=======
import { Routes, Route } from "react-router-dom"
// import Login from "./components/Login"
// import Dashboard from "./components/Dashboard"
import DeliveryForm from "./components/DeliveryForm"
>>>>>>> e45129510be5489196e5ac5905c31b96c6643d7b

export default function App() {
  return (
<<<<<<< HEAD
    <>
      <DeliveryDashboard />
    </>
=======
    <div className="bg-slate-900 min-h-screen text-white">
      <Routes>
        {/* <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} /> */}
         <Route path="/add-delivery" element={<DeliveryForm />} />
      </Routes>
    </div>
>>>>>>> e45129510be5489196e5ac5905c31b96c6643d7b
  )
}