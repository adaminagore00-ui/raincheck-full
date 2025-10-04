import React, {useState} from 'react'

export default function ForecastForm(){
  const [city, setCity] = useState("Istanbul")
  const [date, setDate] = useState("")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)

  const submit = async (e) => {
    e.preventDefault()
    setError(null)
    setResult(null)
    setLoading(true)
    try {
      const res = await fetch("http://127.0.0.1:8000/api/forecast", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({city, date})
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.detail || "Unknown error")
      setResult(data)
    } catch(err){
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const riskColor = (risk) => {
    if (!risk) return "bg-gray-200"
    if (risk === "High") return "bg-red-100 text-red-800"
    if (risk === "Medium") return "bg-yellow-100 text-yellow-800"
    return "bg-green-100 text-green-800"
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">City</label>
        <input value={city} onChange={e=>setCity(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Date</label>
        <input type="date" value={date} onChange={e=>setDate(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
      </div>
      <div className="flex items-center space-x-3">
        <button disabled={loading} className="px-4 py-2 bg-sky-600 text-white rounded-md">Check</button>
        {loading && <span className="text-sm text-gray-500">Checking...</span>}
      </div>

      {error && <div className="text-red-600">{error}</div>}

      {result && (
        <div className="mt-4 p-4 border rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <div>
              <div className="text-sm text-gray-500">City • Date</div>
              <div className="text-lg font-medium">{result.city} • {result.date}</div>
            </div>
            <div className={"px-3 py-1 rounded-full text-sm " + riskColor(result.risk)}>{result.risk}</div>
          </div>
          <div className="mt-2">
            <div className="text-sm text-gray-500">Probability of precipitation</div>
            <div className="text-2xl font-semibold">{result.pop}%</div>
            <div className="mt-3 text-sm text-gray-700">{result.advice}</div>
          </div>
        </div>
      )}
    </form>
  )
}
