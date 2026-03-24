import express from 'express'
import { createServer } from 'http'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import fetch from 'node-fetch'

const __dirname = dirname(fileURLToPath(import.meta.url))
const app = express()

// ── Body parser ────────────────────────────────────────────────────────────
app.use(express.json({ limit: '20mb' }))

// ── Serve built React frontend ─────────────────────────────────────────────
app.use(express.static(join(__dirname, 'dist')))

// ── Health check (public) ──────────────────────────────────────────────────
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    hasKey: !!process.env.ANTHROPIC_API_KEY,
    authEnabled: !!process.env.ACCESS_CODE,
    model: 'claude-haiku-4-5-20251001'
  })
})

// ── Auth verify endpoint (public) ─────────────────────────────────────────
app.post('/api/auth', (req, res) => {
  const { code } = req.body
  const expected = process.env.ACCESS_CODE
  if (!expected) return res.json({ ok: true, message: 'Auth disabled' })
  if (!code) return res.status(400).json({ ok: false, error: 'No access code provided.' })
  if (code.trim() === expected.trim()) return res.json({ ok: true })
  return res.status(401).json({ ok: false, error: 'Wrong access code. Try again.' })
})

// ── Auth middleware ────────────────────────────────────────────────────────
function requireAuth(req, res, next) {
  const expected = process.env.ACCESS_CODE
  if (!expected) return next()
  const code = req.headers['x-access-code'] || ''
  if (code.trim() !== expected.trim()) {
    return res.status(401).json({ error: 'Unauthorized. Invalid access code.' })
  }
  next()
}

// ── Analyse endpoint — protected ───────────────────────────────────────────
app.post('/api/analyse', requireAuth, async (req, res) => {
  const apiKey = process.env.ANTHROPIC_API_KEY

  if (!apiKey) {
    return res.status(500).json({
      error: 'ANTHROPIC_API_KEY is not set on the server. Add it in Render → Environment Variables.'
    })
  }

  const { system, messages } = req.body

  if (!system || !messages) {
    return res.status(400).json({ error: 'Missing system or messages in request body.' })
  }

  try {
    const anthropicRes = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'anthropic-version': '2023-06-01',
        'x-api-key': apiKey,
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001', // cheapest vision model
        max_tokens: 1500,                    // trimmed to save credits
        system,
        messages,
      }),
    })

    const data = await anthropicRes.json()

    if (!anthropicRes.ok) {
      console.error('Anthropic error:', data)
      const msg = data?.error?.message || JSON.stringify(data)
      return res.status(anthropicRes.status).json({ error: msg })
    }

    res.json(data)

  } catch (err) {
    console.error('Proxy fetch error:', err.message)
    res.status(500).json({ error: 'Server error: ' + err.message })
  }
})

// ── SPA fallback ───────────────────────────────────────────────────────────
app.get('*', (_req, res) => {
  const indexPath = join(__dirname, 'dist', 'index.html')
  res.sendFile(indexPath, (err) => {
    if (err) res.status(500).send('Build not found. Run: npm run build')
  })
})

// ── Start ──────────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 3001
createServer(app).listen(PORT, '0.0.0.0', () => {
  console.log(`✅ DawaClear → http://localhost:${PORT}`)
  console.log(`   API key:     ${process.env.ANTHROPIC_API_KEY ? '✓ set' : '✗ MISSING'}`)
  console.log(`   Access code: ${process.env.ACCESS_CODE ? '✓ set (auth ON)' : '✗ not set (open access)'}`)
})
