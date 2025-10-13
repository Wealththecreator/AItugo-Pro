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
- `--serve` – start a lightweight HTTP API instead of printing to the console (see below).

### What you get

- Curated feeds from leading AI, startup, and creator economy publications.
- Automated tagging that flags whether a story is best suited for creators, entrepreneurs, or both.
- Opportunity scoring that blends story recency, source authority, and signal strength.
- Tailored recommended actions to help you turn every headline into a next step.
- Offline-friendly fallback dataset so you can demo the workflow even without network access.

### Serve the feed as a live API

Run the scraper in server mode to expose a JSON feed and health endpoint that auto-refresh every 30 minutes:

```
npm run scrape:serve
```

The server defaults to `http://0.0.0.0:8787` and exposes:

- `GET /news` – the full actionable briefing (pass `?limit=10` to trim the response).
- `GET /health` – cache metadata and refresh cadence.
- `GET /` – a tiny status page with usage hints.

Flags such as `--port=3000`, `--host=127.0.0.1`, and `--refresh=15` let you tailor the listener and refresh interval.

### Deploying it live (Render, Railway, Fly, or any Node host)

Because the scraper is a single Node entry point, you can deploy it to any service that can run a long-lived Node process:

1. **Fork this repo** (or push it to your own remote).
2. **Create a web service** on your platform of choice:
   - **Render:** New &rarr; Web Service &rarr; connect your repo. Set the build command to `npm install` and the start command to `node scripts/news-scraper.js --serve --port $PORT`.
   - **Railway:** New Project &rarr; Deploy from GitHub &rarr; set the start command to `node scripts/news-scraper.js --serve --port $PORT`.
   - **Fly.io / Docker hosts:** Use the provided [`Procfile`](Procfile) or set the entrypoint to `node scripts/news-scraper.js --serve --port=${PORT:-8080}`.
3. **Expose port `$PORT`** (most hosts inject the environment variable automatically).
4. **Optional:** set `HOST`, `LIMIT`, or `REFRESH_MINUTES` environment variables if your host supports them; otherwise pass flags in the start command.

Once deployed, point your automation or front-end at `/news` for the actionable JSON briefing.
