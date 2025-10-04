import React from 'react'
import ForecastForm from './components/ForecastForm'
export default function App(){
  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white flex items-center justify-center p-6">
      <div className="max-w-2xl w-full bg-white shadow-xl rounded-2xl p-8">
        <h1 className="text-2xl font-semibold mb-4">RainCheck</h1>
        <p className="text-sm text-gray-600 mb-6">Enter a city and date to see the chance of rain.</p>
        <ForecastForm />
      </div>
    </div>
  )
}
