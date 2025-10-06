# Cloudflare Worker - API Proxy

This Cloudflare Worker acts as a secure proxy between your frontend and Anthropic API.

## Setup

### 1. Install Wrangler CLI

```bash
npm install -g wrangler
```

### 2. Login to Cloudflare

```bash
wrangler login
```

### 3. Set API Key as Secret

```bash
cd cloudflare-worker
wrangler secret put ANTHROPIC_API_KEY
# Paste your API key when prompted: sk-ant-api03-...
```

### 4. Deploy Worker

```bash
wrangler deploy
```

You'll get a URL like: `https://support-ticket-api.YOUR-SUBDOMAIN.workers.dev`

### 5. Update Frontend

Copy the Worker URL and update your frontend to use it:

```javascript
// In App.tsx, replace '/api/summarize' with:
const response = await fetch('https://support-ticket-api.YOUR-SUBDOMAIN.workers.dev', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ title, description, customerEmail }),
});
```

### 6. Secure CORS (Optional)

In `worker.js`, change:
```javascript
'Access-Control-Allow-Origin': '*'
```

To your GitHub Pages URL:
```javascript
'Access-Control-Allow-Origin': 'https://YOUR-USERNAME.github.io'
```

## Testing Locally

```bash
wrangler dev
```

This runs the worker at `http://localhost:8787`

## Free Tier Limits

- **100,000 requests/day**
- **10ms CPU time per request**
- More than enough for most use cases!

## Monitoring

View logs and analytics:
```bash
wrangler tail
```

Or visit: https://dash.cloudflare.com
