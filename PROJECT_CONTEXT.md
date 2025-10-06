# Project Context Document

**Last Updated:** 2025-10-06 (Post Phase 1-3 Restructuring)
**Current Branch:** `main`
**GitHub Repo:** https://github.com/shashank-maker-co/support-ticket-summarizer
**Last Deployment:** 2025-10-06 (Worker: Version 6e06152d)

---

## Project Overview

**App Name:** Website Redesign Brief Generator
**Purpose:** Help users create professional website redesign briefs by answering 10 questions, then using Claude AI to generate a comprehensive, actionable prompt they can use with designers/developers/LLMs.

**Scope:** We generate the PROMPT/BRIEF only. We don't do the actual redesign.

---

## Architecture

```
Frontend (React + Vite)          Cloudflare Worker (API Proxy)      Anthropic Claude API
━━━━━━━━━━━━━━━━━━━━            ━━━━━━━━━━━━━━━━━━━━━━━━━━         ━━━━━━━━━━━━━━━━━
GitHub Pages                      Free tier (100k req/day)          Haiku (fast & cheap)
https://shashank-maker-co.        https://support-ticket-api.
github.io/support-ticket-         workers.dev
summarizer/

User answers 10 questions    →   Worker builds prompt for Claude  →  Claude generates
                                  Securely stores API key              detailed brief
                             ←   Returns markdown brief            ←
User sees markdown +
copy button
```

---

## Tech Stack

- **Frontend:** React 18, TypeScript, Vite
- **Styling:** Plain CSS (no framework)
- **Deployment:** GitHub Pages (free)
- **Backend:** Cloudflare Workers (serverless, free tier)
- **LLM:** Anthropic Claude (Haiku model)
- **Version Control:** Git + GitHub

---

## Project History

### Phase 1: Support Ticket Summarizer (DEPRECATED)
- Original app: analyzed customer support tickets
- Had Express backend + React frontend
- **Preserved in branch:** `support-ticket-app`

### Phase 2: Website Redesign Brief Generator (CURRENT)
- Pivoted to help users create website redesign briefs
- Simplified use case, more viral potential
- **Active branch:** `main` (merged from `redesign-brief-generator`)
- **Status:** Live in production

---

## Repository Structure

```
braintrust/
├── .github/workflows/
│   └── deploy.yml                    # GitHub Actions - auto-deploy to Pages
├── shared/                           # ✨ NEW: Shared logic (Phase 3)
│   ├── types.ts                      # TypeScript interfaces
│   ├── prompt-builder.ts             # TypeScript prompt builder
│   ├── prompt-builder.js             # JavaScript prompt builder (for worker)
│   └── package.json                  # Module config
├── evals/                            # ✨ RENAMED: tests/ → evals/ (Phase 2)
│   ├── fixtures/
│   │   └── test-cases.ts             # Centralized test data
│   ├── scorers/                      # Modular scorer functions
│   │   ├── section-completeness.ts
│   │   ├── keyword-relevance.ts
│   │   ├── color-specificity.ts
│   │   ├── typography.ts
│   │   ├── comprehensiveness.ts
│   │   ├── markdown-quality.ts
│   │   ├── actionability.ts
│   │   └── index.ts                  # Exports all scorers
│   ├── archive/                      # Old evaluations (preserved)
│   │   ├── app.eval.ts               # Support ticket eval
│   │   └── compare-configs.eval.ts
│   └── redesign-brief.eval.ts        # Main evaluation suite
├── cloudflare-worker/
│   ├── worker.js                     # API proxy (uses shared/prompt-builder.js)
│   ├── wrangler.toml                 # Cloudflare config
│   └── README.md                     # Worker deployment guide
├── frontend/
│   ├── src/
│   │   ├── App.tsx                   # Main React app (10 questions + results)
│   │   ├── App.css                   # Styling (includes random button styles)
│   │   ├── main.tsx                  # Entry point
│   │   ├── index.css                 # Global styles
│   │   └── vite-env.d.ts             # TypeScript env types
│   ├── index.html
│   ├── vite.config.ts                # Build config (base: /support-ticket-summarizer/)
│   └── package.json
├── .env                              # LOCAL ONLY - contains API keys
├── .env.example
├── .gitignore
├── package.json                      # Root dependencies
├── README.md                         # Main documentation
├── DEPLOYMENT.md                     # Deployment guide
├── TODO.md                           # ✨ NEW: Task tracking across sessions
└── PROJECT_CONTEXT.md                # This file
```

**🗑️ Deleted in Phase 1:**
- `src/` - Old support ticket logic (deleted)
- `backend/` - Old Express server (deleted)
- `experiment1.ts` - Unused experiment file (deleted)
- `test.js` - Unused test file (deleted)

---

## Environment Variables

### Local Development (.env)
```
ANTHROPIC_API_KEY=sk-ant-api03-...
BRAINTRUST_API_KEY=sk-nvdq...
PORT=3001
```

### GitHub Secrets (for deployment)
```
VITE_API_URL=https://support-ticket-api.workers.dev
```

### Cloudflare Worker Secrets
```
ANTHROPIC_API_KEY=sk-ant-api03-...
```

Set via: `wrangler secret put ANTHROPIC_API_KEY`

---

## The 10 Questions (User Flow)

### Business Context (3 questions)
1. **Website URL** (optional text) - "https://yourwebsite.com"
2. **Business description** (text, required) - "What does your business do?"
3. **Main redesign goal** (dropdown) - Increase sales, build credibility, etc.

### Audience & Problems (3 questions)
4. **Target audience** (dropdown) - Young professionals, seniors, etc.
5. **What's NOT working** (multi-select) - Outdated, slow, confusing, etc.
6. **What IS working** (multi-select) - Good content, strong brand, etc.

### Design Direction (2 questions)
7. **Desired feeling** (dropdown) - Professional, creative, playful, etc.
8. **Visual style** (dropdown) - Modern minimal, bold colorful, etc.

### Technical (2 questions)
9. **Current platform** (dropdown) - WordPress, Wix, custom, etc.
10. **Inspiration websites** (optional textarea) - "Share 1-3 URLs you love"

---

## How Claude Generates the Brief

### Input to Claude (via Worker)
```javascript
{
  websiteUrl: "https://example.com",
  businessDescription: "We sell handmade jewelry",
  mainGoal: "Increase sales/conversions",
  targetAudience: "Young professionals (25-35)",
  notWorking: ["Looks outdated", "Not mobile-friendly"],
  isWorking: ["Good content", "Strong brand"],
  desiredFeeling: "Professional & trustworthy",
  visualStyle: "Modern & minimal",
  currentPlatform: "WordPress",
  inspirationSites: "https://site1.com, https://site2.com"
}
```

### Prompt Sent to Claude
```
You are an expert UX/UI designer and website strategist. Generate a comprehensive
redesign brief based on these user answers: [data]

Include:
1. Executive Summary
2. Strategic Recommendations
3. Visual Design Direction
4. Content & Messaging
5. Technical Approach
6. Priority Roadmap
7. Ready-to-use Prompt for Implementation

Format in clean Markdown.
```

### Output from Claude
- Markdown-formatted brief (1000-2000 words)
- Specific, actionable recommendations
- Color palettes, typography, layout ideas
- A "meta-prompt" they can copy and use elsewhere

---

## Deployment Setup

### 1. Cloudflare Worker
```bash
cd cloudflare-worker
wrangler login                    # One-time: authenticate with Cloudflare
wrangler deploy                   # Deploy to production
wrangler secret put ANTHROPIC_API_KEY  # Set API key (encrypted)
```
**Production URL:** https://support-ticket-api.support-ticket-api.workers.dev
**Latest Deployment:** 2025-10-06, Version ID: 6e06152d

### 2. GitHub Pages
- **Enabled in:** Repo Settings → Pages → Source: GitHub Actions
- **Auto-deploys:** On push to `main` branch
- **Build:** `.github/workflows/deploy.yml`
- **Live at:** https://shashank-maker-co.github.io/support-ticket-summarizer/

### 3. Local Development
```bash
# Backend (Worker) - Terminal 1
cd cloudflare-worker
wrangler dev --port 8787  # Runs at localhost:8787

# Frontend - Terminal 2
cd frontend
npm run dev               # Runs at localhost:3000 (or 3001 if 3000 is busy)
```

---

## Branch Strategy

| Branch | Purpose | Status |
|--------|---------|--------|
| `main` | Production (redesign brief generator) | **ACTIVE** |
| `support-ticket-app` | Backup of old support ticket app | Frozen |

**Workflow:**
1. Work directly on `main` branch
2. Test locally before pushing
3. Push to deploy to production automatically
4. Old app always accessible in `support-ticket-app`

---

## Key Commands

### Git
```bash
# Check current branch (should be main)
git branch --show-current

# Revert to old app (if needed)
git checkout support-ticket-app

# Return to current app
git checkout main

# See all branches
git branch -a
```

### Development
```bash
# Install dependencies
npm install
cd frontend && npm install

# Run locally (backend)
npm run backend  # or: cd cloudflare-worker && wrangler dev

# Run locally (frontend)
npm run frontend  # or: cd frontend && npm run dev

# Run both (won't work perfectly without backend changes)
npm run dev
```

### Deployment
```bash
# Deploy Worker to production
cd cloudflare-worker && wrangler deploy

# Deploy Frontend (auto-deploy via GitHub Actions on push to main)
git push origin main

# Check deployment status
# - Worker: https://dash.cloudflare.com
# - Frontend: https://github.com/shashank-maker-co/support-ticket-summarizer/actions
```

---

## Project Restructuring (2025-10-06)

### ✅ Phase 1: Cleanup Legacy Code (COMPLETED)
**Commit:** `9c80c95`
- Deleted legacy `backend/`, `src/`, `experiment1.ts`, `test.js`
- Created `evals/archive/` directory
- Moved old evaluations to archive
- **Result:** Clean codebase, removed unused files

### ✅ Phase 2: Reorganize Eval Structure (COMPLETED)
**Commit:** `e104bd8`
- Renamed `tests/` → `evals/` (industry standard)
- Created `evals/fixtures/test-cases.ts` with centralized test data
- Created `evals/scorers/` with 7 modular scorers:
  - section-completeness.ts
  - keyword-relevance.ts
  - color-specificity.ts
  - typography.ts
  - comprehensiveness.ts
  - markdown-quality.ts
  - actionability.ts
- Created `evals/scorers/index.ts` to export all scorers
- **Result:** Modular, maintainable evaluation suite

### ✅ Phase 3: Extract Shared Logic (COMPLETED)
**Commit:** `50f7cac`
- Created `shared/` directory with:
  - `types.ts` - TypeScript interfaces
  - `prompt-builder.ts` - TypeScript prompt builder
  - `prompt-builder.js` - JavaScript version for worker
  - `package.json` - Module config
- Updated `cloudflare-worker/worker.js` to import shared prompt builder
- **Result:** Single source of truth for prompt generation, DRY principle

### Current Status (2025-10-06)
- ✅ All 3 restructuring phases completed
- ✅ Random data fill button added for testing
- ✅ Deployed to production (Worker Version: 6e06152d)
- ✅ TODO.md created for tracking progress across sessions
- ✅ Evaluation suite with 7 custom scorers operational
- ✅ Shared prompt logic used by worker and evals

### Evaluation Infrastructure
**Run evaluations:**
```bash
npx braintrust eval evals/redesign-brief.eval.ts
```

**Current Scorers:**
1. Section Completeness - Checks for required sections
2. Keyword Relevance - Validates topic mentions
3. Color Specificity - Ensures color recommendations with hex codes
4. Typography - Checks for font suggestions
5. Comprehensiveness - Validates minimum content length
6. Markdown Quality - Checks formatting
7. Actionability - Ensures implementation prompt exists

**Test Cases:** 5 scenarios covering e-commerce, B2B SaaS, portfolio, non-profit, restaurant websites

### Future Enhancements (See TODO.md)
- [ ] Add LLM-as-judge scorer (use Claude to evaluate quality)
- [ ] Add prompt A/B testing (compare different prompt variations)
- [ ] Set up CI/CD to run evals on every PR
- [ ] Add "Download as PDF" option to frontend
- [ ] Add brief history/storage feature
- [ ] Add more test cases (15-20 total)
- [ ] Model comparison (Haiku vs Sonnet vs Opus)

---

## API Keys Location

⚠️ **NEVER commit these to GitHub!**

| Key | Location | Purpose |
|-----|----------|---------|
| `ANTHROPIC_API_KEY` | `.env` (local), Cloudflare Secrets | Claude API access |
| `BRAINTRUST_API_KEY` | `.env` (local) | Evaluation platform (old app) |
| `VITE_API_URL` | GitHub Secrets | Worker URL for frontend |

**Stored in:**
- Local: `.env` file (not committed to git)
- Cloudflare: Worker secrets (encrypted)
- GitHub: Repository secrets (encrypted)

---

## Testing Strategy

### Local Testing
1. Run Worker locally: `cd cloudflare-worker && wrangler dev`
2. Run Frontend: `cd frontend && npm run dev`
3. Update frontend to point to `http://localhost:8787`
4. Fill out form, submit, verify markdown output

### Staging Testing
1. Deploy Worker to Cloudflare
2. Update GitHub secret with Worker URL
3. Push to `redesign-brief-generator` branch
4. GitHub Actions builds and deploys preview
5. Test live

### Production
1. Merge `redesign-brief-generator` → `main`
2. GitHub Actions auto-deploys
3. Live at production URL

---

## Important Notes for Next Session

### What's Different in New App vs Old App
| Feature | Old (Support Tickets) | New (Redesign Brief) |
|---------|----------------------|---------------------|
| Input | 3 text fields | 10 questions (mixed types) |
| Processing | Summarize ticket | Generate detailed brief |
| Output | JSON (summary, priority, action) | Markdown document |
| Use case | Internal tool | Public-facing tool |
| Viral potential | Low | High |

### Files That Changed
- `frontend/src/App.tsx` - Complete rewrite
- `cloudflare-worker/worker.js` - New prompt logic
- `README.md` - Updated description
- `DEPLOYMENT.md` - Same process, updated context

### Files That Stayed the Same
- `.github/workflows/deploy.yml` - No changes needed
- `frontend/vite.config.ts` - Same config
- `cloudflare-worker/wrangler.toml` - Same config
- All deployment infrastructure

---

## Quick Start for Next Session

```bash
# 1. Navigate to project
cd /Users/shashankshukla/braintrust

# 2. Check you're on main branch
git branch --show-current

# 3. Pull latest changes
git pull origin main

# 4. Review current state
cat TODO.md                    # See task tracking
cat PROJECT_CONTEXT.md         # See full context
git log --oneline -5          # See recent commits

# 5. Start local development
# Terminal 1: Start worker
cd cloudflare-worker && wrangler dev --port 8787

# Terminal 2: Start frontend
cd frontend && npm run dev

# 6. Test locally
# - Frontend: http://localhost:3000 (or 3001)
# - Worker: http://localhost:8787

# 7. Run evaluations (optional)
npx braintrust eval evals/redesign-brief.eval.ts
```

---

## Contact & Resources

- **GitHub Repo:** https://github.com/shashank-maker-co/support-ticket-summarizer
- **Live App (main):** https://shashank-maker-co.github.io/support-ticket-summarizer/
- **Cloudflare Worker:** https://support-ticket-api.workers.dev
- **Worker Dashboard:** https://dash.cloudflare.com
- **GitHub Actions:** https://github.com/shashank-maker-co/support-ticket-summarizer/actions

---

## Troubleshooting

### "Worker not found" error
- Check Worker is deployed: `cd cloudflare-worker && wrangler deployments list`
- Verify URL in GitHub secret matches deployed Worker URL

### Build fails on GitHub Actions
- Check `frontend/src/vite-env.d.ts` exists (TypeScript types)
- Verify `VITE_API_URL` secret is set in GitHub

### Local dev not working
- Ensure `.env` file exists with correct keys
- Run `npm install` in both root and `frontend/`
- Check Worker is running: `cd cloudflare-worker && wrangler dev`

### Can't find old app
- Switch to backup branch: `git checkout support-ticket-app`
- It's frozen and will always work

---

**End of Context Document**
