<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/12b3oLVvrrXcv1Qkwtxvis0506-lcxAVy

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## AI Opportunity News Scraper

This repo now also includes a lightweight news intelligence tool tuned for AI updates that matter to creators and entrepreneurs.

### Run the scraper

```
node scripts/news-scraper.js --limit=15 --format=table
```

Arguments:

- `--limit=<number>` – maximum number of stories to keep after enrichment (default: 25).
- `--format=table|json` – print a console table (great for quick scans) or JSON (default) for automations.
- `--out=report.json` – optional path to save the JSON payload to disk.

### What you get

- Curated feeds from leading AI, startup, and creator economy publications.
- Automated tagging that flags whether a story is best suited for creators, entrepreneurs, or both.
- Opportunity scoring that blends story recency, source authority, and signal strength.
- Tailored recommended actions to help you turn every headline into a next step.
- Offline-friendly fallback dataset so you can demo the workflow even without network access.
