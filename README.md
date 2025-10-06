# Support Ticket Summarizer

AI-powered support ticket analysis using Claude and Braintrust for evaluation.

## Project Structure

```
braintrust/
├── src/
│   └── app.ts              # Core application logic
├── backend/
│   └── server.ts           # Express API server
├── frontend/
│   ├── src/
│   │   ├── App.tsx         # React UI
│   │   └── main.tsx
│   └── package.json
├── tests/
│   ├── app.eval.ts         # Braintrust evaluations
│   └── compare-configs.eval.ts
└── experiment1.ts          # Simple Q&A experiment
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

## Development

The app is structured to separate concerns:

1. **Core Logic** (`src/app.ts`): Pure business logic, easily testable
2. **API Layer** (`backend/server.ts`): HTTP endpoints
3. **UI Layer** (`frontend/`): User interface
4. **Tests** (`tests/`): Braintrust evaluations

This makes it easy to:
- Test each layer independently
- Swap out implementations (e.g., different models)
- Run evaluations in CI/CD
- Track performance over time

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
