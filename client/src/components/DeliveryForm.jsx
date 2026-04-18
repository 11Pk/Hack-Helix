import { useState } from "react"

export default function DeliveryForm() {
  const [pickup, setPickup] = useState("")
  const [drop, setDrop] = useState("")
  const [list, setList] = useState([])

  const handleAdd = () => {
    if (!pickup || !drop) return

    const newDelivery = {
      id: Date.now(),
      pickup,
      drop
    }

    setList([...list, newDelivery])

    // clear inputs
    setPickup("")
    setDrop("")
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6">
      <h1 className="text-2xl mb-6">Add Deliveries</h1>

      {/* Input Form */}
      <div className="bg-slate-800 p-4 rounded mb-6 max-w-md">
        <input
          value={pickup}
          onChange={(e) => setPickup(e.target.value)}
          placeholder="Your Location"
          className="w-full p-2 mb-3 bg-slate-700 rounded"
        />

        <input
          value={drop}
          onChange={(e) => setDrop(e.target.value)}
          placeholder="Delivery Location"
          className="w-full p-2 mb-3 bg-slate-700 rounded"
        />

        <button
          onClick={handleAdd}
          className="w-full bg-green-500 hover:bg-green-400 p-2 rounded"
        >
          Add Delivery
        </button>
      </div>

      {/* Delivery List */}
      <div className="max-w-md">
        <h2 className="mb-3 text-lg">Delivery List</h2>

        {list.length === 0 && (
          <p className="text-gray-400">No deliveries added</p>
        )}

        {list.map((item) => (
          <div key={item.id} className="bg-slate-800 p-3 mb-2 rounded">
            <p className="text-sm text-gray-400">From:</p>
            <p>{item.pickup}</p>

            <p className="text-sm text-gray-400 mt-2">To:</p>
            <p>{item.drop}</p>
          </div>
        ))}
      </div>
    </div>
  )
}