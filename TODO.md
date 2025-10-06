# Project Restructuring TODO

**Last Updated:** 2025-10-06

This document tracks the progress of restructuring the braintrust project to follow AI evaluation best practices.

---

## ✅ Phase 1: Cleanup Legacy Code (COMPLETED)

- [x] Delete legacy backend folder (old Express server)
- [x] Delete legacy src folder (old support ticket app)
- [x] Delete experiment1.ts and test.js files (unused)
- [x] Create tests/archive/ directory
- [x] Move app.eval.ts to tests/archive/
- [x] Move compare-configs.eval.ts to tests/archive/
- [x] Commit and push cleanup changes

**Completed:** 2025-10-06
**Commit:** `9c80c95` - Phase 1: Clean up legacy code and archive old evals

---

## ✅ Phase 2: Reorganize Eval Structure (COMPLETED)

### Goals:
- Follow industry standard naming (evals/ instead of tests/)
- Better organization with fixtures and scorers
- Easier to maintain and extend

### Tasks:

- [x] Rename `tests/` directory to `evals/`
- [x] Create `evals/fixtures/` directory
- [x] Extract test cases to `evals/fixtures/test-cases.ts`
- [x] Create `evals/scorers/` directory
- [x] Extract scorers to separate files in `evals/scorers/`:
  - `section-completeness.ts`
  - `keyword-relevance.ts`
  - `color-specificity.ts`
  - `typography.ts`
  - `comprehensiveness.ts`
  - `markdown-quality.ts`
  - `actionability.ts`
  - `index.ts` (exports all scorers)
- [x] Update `evals/redesign-brief.eval.ts` with new imports
- [x] Commit and push eval reorganization

**Completed:** 2025-10-06
**Commit:** `e104bd8` - Phase 2: Reorganize eval structure following best practices

---

## 📋 Phase 3: Extract Shared Logic (0/6 completed)

### Goals:
- Single source of truth for prompt generation
- Reusable code between worker and evals
- Easier testing and modifications

### Tasks:

- [ ] Create `shared/` directory at project root
- [ ] Create `shared/types.ts` with TypeScript interfaces:
  - `RedesignBriefInput` interface
  - `RedesignBriefOutput` interface
  - Other shared types
- [ ] Create `shared/prompt-builder.ts`:
  - Extract prompt generation logic from `cloudflare-worker/worker.js`
  - Export `buildRedesignPrompt(input)` function
- [ ] Create `shared/package.json` with basic config
- [ ] Update `cloudflare-worker/worker.js` to import and use shared prompt builder
- [ ] Update `evals/redesign-brief.eval.ts` to use shared prompt builder
- [ ] Commit and push shared logic extraction

**Status:** Not started
**Estimated time:** 30 minutes

---

## 🔮 Future Enhancements (Backlog)

### Evaluation Improvements:
- [ ] Add LLM-as-judge scorer (use Claude to evaluate quality)
- [ ] Add comparative testing (test different prompts/models)
- [ ] Add regression testing (prevent quality drops)
- [ ] Set up CI/CD to run evals on every PR
- [ ] Add evaluation metrics dashboard

### Application Features:
- [ ] Add "Download as PDF" option
- [ ] Add "Share brief via URL" feature
- [ ] Add brief history/storage
- [ ] A/B test different question flows
- [ ] Add analytics tracking

### Documentation:
- [ ] Create `docs/EVALUATION_GUIDE.md`
- [ ] Add inline code documentation
- [ ] Create architecture diagrams

---

## Quick Reference

### Project Structure (Target State)

```
braintrust/
├── shared/                      # Shared logic (NEW)
│   ├── types.ts
│   ├── prompt-builder.ts
│   └── package.json
├── evals/                       # Renamed from tests/ (NEW)
│   ├── fixtures/
│   │   └── test-cases.ts
│   ├── scorers/
│   │   ├── section-completeness.ts
│   │   ├── keyword-relevance.ts
│   │   ├── color-specificity.ts
│   │   ├── typography.ts
│   │   ├── comprehensiveness.ts
│   │   ├── markdown-quality.ts
│   │   ├── actionability.ts
│   │   └── index.ts
│   ├── archive/                 # Old evals
│   └── redesign-brief.eval.ts
├── cloudflare-worker/
├── frontend/
├── .github/workflows/
└── docs/
```

### Commands

```bash
# Check progress
cat TODO.md

# Run current eval (after Phase 2)
npx braintrust eval evals/redesign-brief.eval.ts

# Run local worker for testing
cd cloudflare-worker && wrangler dev --port 8787
```

---

## Notes

- Phase 1 focused on cleanup - removing legacy code
- Phase 2 focuses on organization - better eval structure
- Phase 3 focuses on code reuse - shared logic extraction
- Each phase builds on the previous one
- Old code is preserved in `tests/archive/` and git history
