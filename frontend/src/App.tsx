import { useState } from 'react'
import './App.css'

function App() {
  // Form state
  const [websiteUrl, setWebsiteUrl] = useState('')
  const [businessDescription, setBusinessDescription] = useState('')
  const [mainGoal, setMainGoal] = useState('')
  const [targetAudience, setTargetAudience] = useState('')
  const [notWorking, setNotWorking] = useState<string[]>([])
  const [isWorking, setIsWorking] = useState<string[]>([])
  const [desiredFeeling, setDesiredFeeling] = useState('')
  const [visualStyle, setVisualStyle] = useState('')
  const [currentPlatform, setCurrentPlatform] = useState('')
  const [inspirationSites, setInspirationSites] = useState('')

  // UI state
  const [loading, setLoading] = useState(false)
  const [brief, setBrief] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(true)

  const handleCheckboxChange = (value: string, setter: React.Dispatch<React.SetStateAction<string[]>>, current: string[]) => {
    if (current.includes(value)) {
      setter(current.filter(item => item !== value))
    } else {
      setter([...current, value])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setBrief(null)

    try {
      const apiUrl = import.meta.env.VITE_API_URL || '/api/summarize'

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          websiteUrl,
          businessDescription,
          mainGoal,
          targetAudience,
          notWorking,
          isWorking,
          desiredFeeling,
          visualStyle,
          currentPlatform,
          inspirationSites,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate brief')
      }

      setBrief(data.brief)
      setShowForm(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = () => {
    if (brief) {
      navigator.clipboard.writeText(brief)
      alert('Brief copied to clipboard!')
    }
  }

  const startOver = () => {
    setBrief(null)
    setError(null)
    setShowForm(true)
    // Reset form
    setWebsiteUrl('')
    setBusinessDescription('')
    setMainGoal('')
    setTargetAudience('')
    setNotWorking([])
    setIsWorking([])
    setDesiredFeeling('')
    setVisualStyle('')
    setCurrentPlatform('')
    setInspirationSites('')
  }

  const fillRandomData = () => {
    const randomBusinesses = [
      'Sell organic coffee beans online',
      'B2B SaaS platform for team collaboration',
      'Freelance photography portfolio',
      'Local bakery with online ordering',
      'Tech startup building AI tools',
      'Fitness coaching and meal plans',
      'Handmade furniture e-commerce',
      'Digital marketing agency',
      'Pet grooming services',
      'Online course platform for designers'
    ]

    const randomGoals = [
      'Increase sales/conversions',
      'Generate more leads',
      'Build brand credibility',
      'Improve user engagement',
      'Reduce bounce rate',
      'Modernize outdated appearance'
    ]

    const randomAudiences = [
      'Young professionals (25-35)',
      'Business decision-makers (35-55)',
      'Students & young adults (18-25)',
      'Creative professionals',
      'General consumers (all ages)'
    ]

    const allNotWorking = [
      'Looks outdated/unprofessional',
      'Not mobile-friendly',
      'Confusing navigation',
      'Slow loading speed',
      'Low conversions/poor CTAs',
      'Hard to find information',
      'Poor visual design',
      'Accessibility issues'
    ]

    const allIsWorking = [
      'Good content',
      'Strong brand recognition',
      'Clear value proposition',
      'Fast performance',
      'Good SEO',
      'Engaged audience'
    ]

    const randomFeelings = [
      'Professional & trustworthy',
      'Creative & innovative',
      'Friendly & approachable',
      'Premium & exclusive',
      'Fast & efficient',
      'Fun & playful',
      'Bold & energetic'
    ]

    const randomStyles = [
      'Modern & minimal',
      'Bold & colorful',
      'Classic & elegant',
      'Tech & futuristic',
      'Warm & organic',
      'Dark & mysterious',
      'Playful & fun'
    ]

    const randomPlatforms = [
      'WordPress',
      'Wix',
      'Squarespace',
      'Shopify',
      'Webflow',
      'Custom/coded'
    ]

    const randomInspirations = [
      'https://stripe.com\nhttps://linear.app',
      'https://airbnb.com\nhttps://notion.so',
      'https://figma.com\nhttps://vercel.com',
      'https://apple.com\nhttps://tesla.com',
      ''
    ]

    const randomUrls = [
      'https://example-site.com',
      'https://mycompany.io',
      'https://mybusiness.co',
      ''
    ]

    // Helper to pick random item from array
    const pick = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)]

    // Helper to pick random subset from array
    const pickMultiple = (arr: string[], min: number, max: number) => {
      const count = Math.floor(Math.random() * (max - min + 1)) + min
      const shuffled = [...arr].sort(() => Math.random() - 0.5)
      return shuffled.slice(0, count)
    }

    setWebsiteUrl(pick(randomUrls))
    setBusinessDescription(pick(randomBusinesses))
    setMainGoal(pick(randomGoals))
    setTargetAudience(pick(randomAudiences))
    setNotWorking(pickMultiple(allNotWorking, 1, 4))
    setIsWorking(pickMultiple(allIsWorking, 1, 3))
    setDesiredFeeling(pick(randomFeelings))
    setVisualStyle(pick(randomStyles))
    setCurrentPlatform(pick(randomPlatforms))
    setInspirationSites(pick(randomInspirations))
  }

  if (!showForm && brief) {
    return (
      <div className="app">
        <div className="container results-container">
          <h1>🎨 Your Redesign Brief is Ready!</h1>

          <div className="brief-display">
            <pre>{brief}</pre>
          </div>

          <div className="button-group">
            <button onClick={copyToClipboard} className="copy-btn">
              📋 Copy to Clipboard
            </button>
            <button onClick={startOver} className="secondary-btn">
              ← Create Another Brief
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="app">
      <div className="container">
        <h1>🎨 Website Redesign Brief Generator</h1>
        <p className="subtitle">
          Answer 10 questions and get a professional redesign brief powered by AI
        </p>

        <div className="random-button-container">
          <button type="button" onClick={fillRandomData} className="random-btn">
            🎲 Fill with Random Data
          </button>
        </div>

        <form onSubmit={handleSubmit} className="form">
          {/* Question 1 */}
          <div className="form-group">
            <label htmlFor="websiteUrl">
              1. What's your current website URL? <span className="optional">(optional)</span>
            </label>
            <input
              id="websiteUrl"
              type="url"
              value={websiteUrl}
              onChange={(e) => setWebsiteUrl(e.target.value)}
              placeholder="https://yourwebsite.com"
            />
          </div>

          {/* Question 2 */}
          <div className="form-group">
            <label htmlFor="businessDescription">
              2. What does your business do? <span className="required">*</span>
            </label>
            <input
              id="businessDescription"
              type="text"
              value={businessDescription}
              onChange={(e) => setBusinessDescription(e.target.value)}
              placeholder="E.g., We sell handmade jewelry online"
              maxLength={200}
              required
            />
          </div>

          {/* Question 3 */}
          <div className="form-group">
            <label htmlFor="mainGoal">
              3. What's your main goal for the redesign? <span className="required">*</span>
            </label>
            <select
              id="mainGoal"
              value={mainGoal}
              onChange={(e) => setMainGoal(e.target.value)}
              required
            >
              <option value="">Select a goal...</option>
              <option value="Increase sales/conversions">Increase sales/conversions</option>
              <option value="Generate more leads">Generate more leads</option>
              <option value="Build brand credibility">Build brand credibility</option>
              <option value="Improve user engagement">Improve user engagement</option>
              <option value="Reduce bounce rate">Reduce bounce rate</option>
              <option value="Modernize outdated appearance">Modernize outdated appearance</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Question 4 */}
          <div className="form-group">
            <label htmlFor="targetAudience">
              4. Who is your target audience?
            </label>
            <select
              id="targetAudience"
              value={targetAudience}
              onChange={(e) => setTargetAudience(e.target.value)}
            >
              <option value="">Select audience...</option>
              <option value="Young professionals (25-35)">Young professionals (25-35)</option>
              <option value="Business decision-makers (35-55)">Business decision-makers (35-55)</option>
              <option value="Students & young adults (18-25)">Students & young adults (18-25)</option>
              <option value="Seniors (55+)">Seniors (55+)</option>
              <option value="General consumers (all ages)">General consumers (all ages)</option>
              <option value="Technical/Developer audience">Technical/Developer audience</option>
              <option value="Creative professionals">Creative professionals</option>
            </select>
          </div>

          {/* Question 5 */}
          <div className="form-group">
            <label>5. What's currently NOT working? <span className="hint">(select all that apply)</span></label>
            <div className="checkbox-group">
              {['Looks outdated/unprofessional', 'Not mobile-friendly', 'Confusing navigation',
                'Slow loading speed', 'Low conversions/poor CTAs', 'Hard to find information',
                'Poor visual design', 'Accessibility issues'].map(option => (
                <label key={option} className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={notWorking.includes(option)}
                    onChange={() => handleCheckboxChange(option, setNotWorking, notWorking)}
                  />
                  {option}
                </label>
              ))}
            </div>
          </div>

          {/* Question 6 */}
          <div className="form-group">
            <label>6. What IS working well? <span className="hint">(select all that apply)</span></label>
            <div className="checkbox-group">
              {['Good content', 'Strong brand recognition', 'Clear value proposition',
                'Fast performance', 'Good SEO', 'Engaged audience', 'Nothing really (start fresh)'].map(option => (
                <label key={option} className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={isWorking.includes(option)}
                    onChange={() => handleCheckboxChange(option, setIsWorking, isWorking)}
                  />
                  {option}
                </label>
              ))}
            </div>
          </div>

          {/* Question 7 */}
          <div className="form-group">
            <label htmlFor="desiredFeeling">
              7. How should visitors feel when they visit?
            </label>
            <select
              id="desiredFeeling"
              value={desiredFeeling}
              onChange={(e) => setDesiredFeeling(e.target.value)}
            >
              <option value="">Select feeling...</option>
              <option value="Professional & trustworthy">Professional & trustworthy</option>
              <option value="Creative & innovative">Creative & innovative</option>
              <option value="Friendly & approachable">Friendly & approachable</option>
              <option value="Premium & exclusive">Premium & exclusive</option>
              <option value="Fast & efficient">Fast & efficient</option>
              <option value="Fun & playful">Fun & playful</option>
              <option value="Bold & energetic">Bold & energetic</option>
            </select>
          </div>

          {/* Question 8 */}
          <div className="form-group">
            <label htmlFor="visualStyle">
              8. Preferred visual style?
            </label>
            <select
              id="visualStyle"
              value={visualStyle}
              onChange={(e) => setVisualStyle(e.target.value)}
            >
              <option value="">Select style...</option>
              <option value="Modern & minimal">Modern & minimal</option>
              <option value="Bold & colorful">Bold & colorful</option>
              <option value="Classic & elegant">Classic & elegant</option>
              <option value="Tech & futuristic">Tech & futuristic</option>
              <option value="Warm & organic">Warm & organic</option>
              <option value="Dark & mysterious">Dark & mysterious</option>
              <option value="Playful & fun">Playful & fun</option>
            </select>
          </div>

          {/* Question 9 */}
          <div className="form-group">
            <label htmlFor="currentPlatform">
              9. Current website platform?
            </label>
            <select
              id="currentPlatform"
              value={currentPlatform}
              onChange={(e) => setCurrentPlatform(e.target.value)}
            >
              <option value="">Select platform...</option>
              <option value="WordPress">WordPress</option>
              <option value="Wix">Wix</option>
              <option value="Squarespace">Squarespace</option>
              <option value="Shopify">Shopify</option>
              <option value="Webflow">Webflow</option>
              <option value="Custom/coded">Custom/coded</option>
              <option value="Other">Other</option>
              <option value="Don't know">Don't know</option>
            </select>
          </div>

          {/* Question 10 */}
          <div className="form-group">
            <label htmlFor="inspirationSites">
              10. Websites you admire (for inspiration)? <span className="optional">(optional)</span>
            </label>
            <textarea
              id="inspirationSites"
              value={inspirationSites}
              onChange={(e) => setInspirationSites(e.target.value)}
              placeholder="Share 1-3 website URLs you love, one per line"
              rows={3}
            />
          </div>

          <button type="submit" disabled={loading} className="submit-btn">
            {loading ? '🤖 Generating Your Brief...' : '✨ Generate My Redesign Brief'}
          </button>
        </form>

        {error && (
          <div className="error-box">
            <strong>Error:</strong> {error}
          </div>
        )}
      </div>
    </div>
  )
}

export default App
