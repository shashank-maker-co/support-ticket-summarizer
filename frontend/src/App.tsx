import { useState } from 'react'
import './App.css'

interface TicketResult {
  summary: string
  priority: 'low' | 'medium' | 'high'
  suggestedAction: string
}

function App() {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [customerEmail, setCustomerEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<TicketResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setResult(null)

    try {
      // Use Cloudflare Worker URL in production, local API in development
      const apiUrl = import.meta.env.VITE_API_URL || '/api/summarize'

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          description,
          customerEmail,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to process ticket')
      }

      setResult(data.data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return '#ef4444'
      case 'medium':
        return '#f59e0b'
      case 'low':
        return '#10b981'
      default:
        return '#6b7280'
    }
  }

  return (
    <div className="app">
      <div className="container">
        <h1>🎫 Support Ticket Summarizer</h1>
        <p className="subtitle">AI-powered ticket analysis with Claude</p>

        <form onSubmit={handleSubmit} className="form">
          <div className="form-group">
            <label htmlFor="title">Ticket Title</label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Cannot login to account"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Customer Email</label>
            <input
              id="email"
              type="email"
              value={customerEmail}
              onChange={(e) => setCustomerEmail(e.target.value)}
              placeholder="customer@example.com"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Detailed description of the issue..."
              rows={6}
              required
            />
          </div>

          <button type="submit" disabled={loading} className="submit-btn">
            {loading ? '🤖 Analyzing...' : '✨ Analyze Ticket'}
          </button>
        </form>

        {error && (
          <div className="error-box">
            <strong>Error:</strong> {error}
          </div>
        )}

        {result && (
          <div className="result-box">
            <h2>Analysis Results</h2>

            <div className="result-item">
              <span className="result-label">Priority:</span>
              <span
                className="priority-badge"
                style={{ backgroundColor: getPriorityColor(result.priority) }}
              >
                {result.priority.toUpperCase()}
              </span>
            </div>

            <div className="result-item">
              <span className="result-label">Summary:</span>
              <p className="result-text">{result.summary}</p>
            </div>

            <div className="result-item">
              <span className="result-label">Suggested Action:</span>
              <p className="result-text">{result.suggestedAction}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default App
