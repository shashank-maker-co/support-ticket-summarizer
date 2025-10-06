# Deployment Guide: GitHub Pages + Cloudflare Workers

This guide walks you through deploying your Support Ticket Summarizer app with:
- **Frontend**: GitHub Pages (free, static hosting)
- **Backend**: Cloudflare Workers (free, serverless API proxy)

---

## Prerequisites

- GitHub account
- Cloudflare account (free tier)
- Node.js installed locally

---

## Part 1: Deploy Cloudflare Worker (API Proxy)

### Step 1: Install Wrangler CLI

```bash
npm install -g wrangler
```

### Step 2: Login to Cloudflare

```bash
wrangler login
```

This opens your browser to authenticate.

### Step 3: Deploy the Worker

```bash
cd cloudflare-worker
wrangler deploy
```

You'll get a URL like:
```
https://support-ticket-api.YOUR-SUBDOMAIN.workers.dev
```

**📋 Copy this URL - you'll need it for the next step!**

### Step 4: Add Your API Key as a Secret

```bash
wrangler secret put ANTHROPIC_API_KEY
```

Paste your Anthropic API key when prompted:
```
sk-ant-api03-...
```

✅ Your API key is now encrypted and stored securely on Cloudflare!

---

## Part 2: Deploy Frontend to GitHub Pages

### Step 1: Enable GitHub Pages

1. Go to your GitHub repo settings
2. Navigate to **Pages** (in the sidebar)
3. Under "Build and deployment":
   - **Source**: GitHub Actions
4. Save

### Step 2: Add Worker URL as GitHub Secret

1. In your repo, go to **Settings** → **Secrets and variables** → **Actions**
2. Click **New repository secret**
3. Name: `VITE_API_URL`
4. Value: Your Cloudflare Worker URL (from Part 1, Step 3)
   ```
   https://support-ticket-api.YOUR-SUBDOMAIN.workers.dev
   ```
5. Click **Add secret**

### Step 3: Update Vite Config

Edit `frontend/vite.config.ts` and change the `base` path to match your repo name:

```typescript
base: '/YOUR-REPO-NAME/', // e.g., '/braintrust/' or '/support-ticket-app/'
```

### Step 4: Push to GitHub

```bash
git add .
git commit -m "Add GitHub Pages deployment"
git push origin main
```

The GitHub Action will automatically:
1. Build your React app
2. Deploy to GitHub Pages

### Step 5: Access Your App

After ~2 minutes, your app will be live at:
```
https://YOUR-USERNAME.github.io/YOUR-REPO-NAME/
```

---

## Part 3: Secure CORS (Optional but Recommended)

Update `cloudflare-worker/worker.js` to only allow requests from your GitHub Pages URL:

```javascript
const corsHeaders = {
  'Access-Control-Allow-Origin': 'https://YOUR-USERNAME.github.io',
  // ... rest of headers
};
```

Then redeploy:
```bash
cd cloudflare-worker
wrangler deploy
```

---

## Testing

### Test Worker Locally

```bash
cd cloudflare-worker
wrangler dev
```

### Test Frontend Locally

```bash
cd frontend
npm run dev
```

---

## Architecture

```
┌─────────────────────┐
│   GitHub Pages      │
│   (Static Frontend) │
│                     │
│  YOUR-USERNAME.     │
│  github.io/repo     │
└──────────┬──────────┘
           │
           │ HTTPS Request
           │
           ▼
┌─────────────────────┐
│ Cloudflare Worker   │
│ (API Proxy)         │
│                     │
│ Securely stores     │
│ ANTHROPIC_API_KEY   │
└──────────┬──────────┘
           │
           │ Proxied Request
           │
           ▼
┌─────────────────────┐
│  Anthropic API      │
│  (Claude)           │
└─────────────────────┘
```

---

## Costs

**GitHub Pages:**
- ✅ Free for public repos
- ✅ 1GB storage
- ✅ 100GB bandwidth/month

**Cloudflare Workers:**
- ✅ Free tier: 100,000 requests/day
- ✅ 10ms CPU time per request
- ✅ More than enough for most apps!

**Total cost: $0/month** 🎉

---

## Troubleshooting

### Frontend shows 404

- Check `vite.config.ts` `base` path matches your repo name
- Ensure GitHub Pages is enabled in repo settings

### API errors (CORS)

- Verify `VITE_API_URL` secret is set correctly in GitHub
- Check Cloudflare Worker logs: `wrangler tail`

### Worker not responding

- Verify API key is set: `wrangler secret list`
- Check worker is deployed: `wrangler deployments list`

### Build fails

- Ensure `frontend/package-lock.json` exists
- Check Node.js version in workflow matches local version

---

## Monitoring

**Cloudflare Dashboard:**
- View requests, errors, and analytics
- https://dash.cloudflare.com

**Worker Logs:**
```bash
wrangler tail
```

**GitHub Actions:**
- Check deployment status in the "Actions" tab

---

## Updating

### Update Frontend

Just push to GitHub:
```bash
git add .
git commit -m "Update frontend"
git push
```

GitHub Actions will auto-deploy.

### Update Worker

```bash
cd cloudflare-worker
# Make your changes
wrangler deploy
```

---

## Custom Domain (Optional)

### For GitHub Pages:
1. Add CNAME file to `frontend/public/`
2. Configure DNS to point to GitHub Pages

### For Cloudflare Worker:
1. Go to Cloudflare dashboard
2. Add custom route in Workers settings

---

## Next Steps

- [ ] Add rate limiting to Worker
- [ ] Add analytics (Cloudflare Analytics is free!)
- [ ] Set up monitoring/alerts
- [ ] Add CI/CD for Worker deployment
- [ ] Customize the frontend UI

---

## Support

- **Cloudflare Workers Docs**: https://developers.cloudflare.com/workers/
- **GitHub Pages Docs**: https://docs.github.com/pages
- **Vite Deployment**: https://vitejs.dev/guide/static-deploy.html

---

**🎉 Your app is now live with secure API key handling!**
