import { useState } from "react"
import { useUser, UserButton } from "@clerk/clerk-react"
import { useNavigate } from "react-router-dom"

export default function DeliveryForm() {
  const { user } = useUser()
  const navigate = useNavigate()

  const [pickup, setPickup] = useState("")
  const [drop, setDrop] = useState("")
  const [customerId, setCustomerId] = useState("")
  const [time, setTime] = useState("")   // 🔥 NEW

  const [list, setList] = useState([])
  const [history, setHistory] = useState([])

  // ✅ Add delivery
  const handleAdd = () => {
    if (!drop || !customerId || !time) {
      alert("Fill all fields")
      return
    }

    const newDelivery = {
      id: Date.now(),
      address: drop,
      customerId,
      time,             // 🔥 store time
      delivered: false
    }

    setList([...list, newDelivery])

    setDrop("")
    setCustomerId("")
    setTime("")
  }

  // ✅ Mark delivered
  const markDelivered = (id) => {
    const updated = list.map(item =>
      item.id === id ? { ...item, delivered: true } : item
    )

    setList(updated)

    const done = updated.find(i => i.id === id)
    setHistory([...history, done])
  }

  // 🚀 Send to backend
  async function computeRoute() {
    if (!pickup || list.length === 0) {
      alert("Add rider and stops")
      return
    }

    const stops = list.map(i => i.address)

    const res = await fetch("http://127.0.0.1:8000/optimize-route", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        rider: pickup,
        stops: stops
      })
    })

    const data = await res.json()

    if (data.error) {
      alert(data.error)
      return
    }

    navigate("/optimize", { state: data })
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6">

      {/* HEADER */}
      <div className="flex justify-between mb-6">
        <h1>Welcome {user?.firstName}</h1>
        <UserButton afterSignOutUrl="/" />
      </div>

      {/* INPUTS */}
      <input
        placeholder="Rider Location"
        value={pickup}
        onChange={(e) => setPickup(e.target.value)}
        className="w-full p-2 mb-3 bg-slate-700"
      />

      <input
        placeholder="Delivery Location"
        value={drop}
        onChange={(e) => setDrop(e.target.value)}
        className="w-full p-2 mb-3 bg-slate-700"
      />

      <input
        placeholder="Customer ID"
        value={customerId}
        onChange={(e) => setCustomerId(e.target.value)}
        className="w-full p-2 mb-3 bg-slate-700"
      />

      {/* 🔥 TIME INPUT */}
      <input
        type="time"
        value={time}
        onChange={(e) => setTime(e.target.value)}
        className="w-full p-2 mb-3 bg-slate-700"
      />

      <button
        onClick={handleAdd}
        className="bg-green-500 p-2 w-full mb-3 rounded"
      >
        Add Stop
      </button>

      <button
        onClick={computeRoute}
        className="bg-blue-500 p-2 w-full rounded"
      >
        Compute Route
      </button>

      {/* LIST */}
      <div className="mt-4">
        <h2>Delivery List</h2>

        {list.map(item => (
          <div key={item.id} className="bg-slate-800 p-3 mb-2 rounded">
            <p><strong>Address:</strong> {item.address}</p>
            <p><strong>Customer:</strong> {item.customerId}</p>
            <p><strong>Time:</strong> {item.time}</p>

            <p>
              Status: {item.delivered ? "✅ Delivered" : "❌ Pending"}
            </p>

            {!item.delivered && (
              <button
                onClick={() => markDelivered(item.id)}
                className="bg-yellow-500 px-2 py-1 mt-2 rounded"
              >
                Mark Delivered
              </button>
            )}
          </div>
        ))}
      </div>

      {/* ML DATA */}
      <div className="mt-6">
        <h2>ML Dataset</h2>

        {history.map(item => (
          <p key={item.id}>
            {item.customerId} | {item.time} | {item.address} | Delivered
          </p>
        ))}
      </div>

    </div>
  )
}