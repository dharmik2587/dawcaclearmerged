# 🩺 DawaClear — AI Medical Clarity

> The AI that sits between a patient and confusion.

Upload any prescription, discharge summary, or lab report. DawaClear uses **Claude Vision** to read your actual document and generate a full health dashboard — diagnosis in plain language, medication timeline, side effects, family brief, and chemist sheet — in under 30 seconds.

---

## Quick Start (Local)

```bash
# 1. Install
npm install

# 2. Set your API key
cp .env.example .env
# Edit .env → add your ANTHROPIC_API_KEY from console.anthropic.com

# 3. Build frontend + start server
npm run build && npm start

# Open http://localhost:3001
```

## Deploy to Render

See **DEPLOY.md** for step-by-step instructions.

---

## Project Structure

```
dawaclear/
├── src/
│   ├── App.jsx        ← Full React app
│   └── main.jsx       ← Entry point
├── index.html         ← Vite HTML
├── vite.config.js     ← Build config (proxies /api → :3001 in dev)
├── server.js          ← Express server + Anthropic API proxy
├── package.json
├── .env.example
└── .gitignore
```

## Model

Uses **claude-haiku-4-5** — the fastest and cheapest Claude model that supports vision. A typical prescription analysis costs ~$0.002 (0.2 paise).

---

*Built for IAR Udaan 2026 Hackathon*
