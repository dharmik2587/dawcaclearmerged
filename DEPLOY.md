# Deploying DawaClear to Render

---

## Step 1 — Push to GitHub

### 1a. Create repo on GitHub

1. Go to **github.com/new**
2. Name: `dawaclear`
3. Set **Public**
4. Do NOT tick "Add README" (you already have one)
5. Click **Create repository**

### 1b. Push from terminal

```bash
cd dawaclear          # your project folder
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/dawaclear.git
git push -u origin main
```

---

## Step 2 — Deploy on Render

### 2a. Create account & connect GitHub

1. Go to **render.com** → Sign up (free)
2. Connect your GitHub account when prompted

### 2b. New Web Service

1. Click **New +** → **Web Service**
2. Click **Connect a repository** → select `dawaclear`
3. Click **Connect**

### 2c. Configure — use these exact values

| Field | Value |
|---|---|
| Name | `dawaclear` |
| Region | Singapore *(closest to India)* |
| Branch | `main` |
| Runtime | `Node` |
| Build Command | `npm install && npm run build` |
| Start Command | `npm start` |
| Instance Type | `Free` |

### 2d. Add API key ← most important step

Scroll to **Environment Variables** → click **Add Environment Variable**:

- **Key:** `ANTHROPIC_API_KEY`
- **Value:** `sk-ant-api03-...` *(your key from console.anthropic.com)*

Click **Save**.

### 2e. Deploy

Click **Create Web Service**.

Render will install, build, and start. Takes ~3 minutes.
Your live URL: `https://dawaclear.onrender.com`

---

## Step 3 — Update after changes

```bash
git add .
git commit -m "Fix: describe change"
git push
```

Render auto-deploys on every push. Live in ~2 minutes.

---

## Troubleshooting

| Error | Fix |
|---|---|
| `ANTHROPIC_API_KEY is not set` | Go to Render → your service → Environment → add the key |
| `credit balance is too low` | Top up at console.anthropic.com/settings/billing (even $5 lasts months) |
| Site not loading | Check Logs tab in Render dashboard |
| Slow first load | Free tier sleeps after 15 min. Normal — first request wakes it up |

---

## Cost estimate

Uses **claude-haiku-4-5** (cheapest vision model):
- ~$0.002 per prescription analysis (about 0.17 paise)
- $5 credit = ~2,500 prescription analyses
