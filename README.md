# Website Redesign Brief Generator

AI-powered tool that generates comprehensive website redesign briefs based on user input. Answer 10 questions and get a professional brief you can use with any designer, developer, or AI tool.

## How It Works

1. **Answer 10 Questions** about your website and business goals
2. **AI Generates Brief** using Claude's expertise in UX/UI design
3. **Get Your Brief** in markdown format, ready to copy and use

## Project Structure

```
braintrust/
├── cloudflare-worker/
│   └── worker.js           # API proxy (secure Claude API calls)
├── frontend/
│   ├── src/
│   │   ├── App.tsx         # 10-question form + results display
│   │   └── main.tsx
│   └── package.json
├── .github/workflows/
│   └── deploy.yml          # Auto-deploy to GitHub Pages
└── PROJECT_CONTEXT.md      # Full project documentation
```

## Setup

### 1. Install Dependencies

```bash
# Root dependencies (backend + evals)
npm install

# Frontend dependencies
cd frontend
npm install
cd ..
```

### 2. Environment Variables

Create a `.env` file:

```bash
cp .env.example .env
```

Add your API keys:
- `ANTHROPIC_API_KEY`: Get from https://console.anthropic.com
- `BRAINTRUST_API_KEY`: Get from https://braintrust.dev

## Running the Application

### Development Mode (Backend + Frontend)

```bash
npm run dev
```

- Frontend: http://localhost:3000
- Backend API: http://localhost:3001

### Run Separately

```bash
# Backend only
npm run backend

# Frontend only
npm run frontend
```

## Running Evaluations

Test your app with Braintrust:

```bash
# Test the main app
npm run eval:app

# Compare different configurations
npm run eval:compare

# Simple Q&A experiment
npm run eval:simple
```

## API Endpoints

### POST `/api/summarize`

Analyze a single support ticket.

**Request:**
```json
{
  "title": "Cannot login to account",
  "description": "Getting invalid credentials error...",
  "customerEmail": "user@example.com"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "summary": "Customer unable to login despite password reset",
    "priority": "high",
    "suggestedAction": "Reset account credentials and verify email"
  }
}
```

### POST `/api/summarize-batch`

Process multiple tickets at once.

**Request:**
```json
{
  "tickets": [
    { "title": "...", "description": "...", "customerEmail": "..." },
    { "title": "...", "description": "...", "customerEmail": "..." }
  ]
}
```

## Tech Stack

- **Backend**: Express + TypeScript
- **Frontend**: React + Vite + TypeScript
- **LLM**: Anthropic Claude
- **Evaluation**: Braintrust
- **Runtime**: Node.js

## The 10 Questions

1. Website URL (optional)
2. Business description
3. Main redesign goal
4. Target audience
5. What's NOT working (multi-select)
6. What IS working (multi-select)
7. Desired feeling/vibe
8. Visual style preference
9. Current platform
10. Inspiration websites (optional)

## Development

**Local testing:**
```bash
# Run Worker locally
cd cloudflare-worker && wrangler dev

# Run Frontend
cd frontend && npm run dev
```

## Deployment

This app can be deployed to **GitHub Pages + Cloudflare Workers** for **$0/month**!

See **[DEPLOYMENT.md](./DEPLOYMENT.md)** for the complete deployment guide.

**Quick deploy:**
1. Deploy Cloudflare Worker (API proxy): `cd cloudflare-worker && wrangler deploy`
2. Push to GitHub (auto-deploys frontend via GitHub Actions)
3. Your app is live! 🚀

## Architecture

```
Frontend (GitHub Pages) → Cloudflare Worker (API Proxy) → Anthropic API
                          [API key stored securely]
```

## Next Steps

- Add authentication
- Persist tickets to database
- Add more evaluation scenarios
- Set up monitoring/alerts
- Add rate limiting
