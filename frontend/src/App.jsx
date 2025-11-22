import { useState } from 'react'
import './App.css'

function App() {
  const [adSpend, setAdSpend] = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleForecast = async () => {
    if (!adSpend || isNaN(adSpend) || parseFloat(adSpend) <= 0) {
      setError('Please enter a valid ad spend amount')
      return
    }

    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const response = await fetch('http://localhost:8000/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ad_spend: parseFloat(adSpend)
        })
      })

      if (!response.ok) {
        throw new Error('Failed to get prediction')
      }

      const data = await response.json()
      setResult(data)
    } catch (err) {
      setError(err.message || 'An error occurred while fetching the prediction')
    } finally {
      setLoading(false)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleForecast()
    }
  }

  return (
    <div className="app-container">
      <div className="app-content">
        <h1>Sales Revenue Forecaster</h1>
        
        <div className="input-section">
          <label htmlFor="ad-spend">Ad Spend ($)</label>
          <input
            id="ad-spend"
            type="number"
            value={adSpend}
            onChange={(e) => setAdSpend(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Enter ad spend amount"
            min="0"
            step="0.01"
            disabled={loading}
          />
          <button 
            onClick={handleForecast}
            disabled={loading}
            className="forecast-button"
          >
            {loading ? 'Forecasting...' : 'Forecast Revenue'}
          </button>
        </div>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {result && (
          <div className="result-card">
            <h2>Forecast Results</h2>
            <div className="result-content">
              <div className="result-item">
                <span className="result-label">Predicted Revenue:</span>
                <span className="result-value">${result.predicted_revenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </div>
              <div className="result-item">
                <span className="result-label">Confidence Score:</span>
                <span className="result-value confidence">{(result.confidence_score * 100).toFixed(1)}%</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default App

