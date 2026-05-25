# NarrAIte — AI-Powered Impact Narrative Generator

> Full-stack React + Express + OpenRouter AI application that transforms impact data into emotionally resonant stories at scale.

![Stack](https://img.shields.io/badge/Frontend-React%2018%20+%20Vite-61DAFB?style=flat-square)
![Backend](https://img.shields.io/badge/Backend-Node.js%20+%20Express-339933?style=flat-square)
![AI](https://img.shields.io/badge/AI-OpenRouter%20(GPT--4o--mini)-412991?style=flat-square)
![Deploy](https://img.shields.io/badge/Deploy-Vercel%20+%20Render-000000?style=flat-square)
![License](https://img.shields.io/badge/License-MIT-yellow?style=flat-square)

---

## Project Structure

```
narraite/
├── src/                        # React frontend
│   ├── pages/
│   │   ├── Landing.jsx         # Marketing page
│   │   ├── Auth.jsx            # Login / Signup
│   │   ├── Dashboard.jsx       # Overview & quick generate
│   │   ├── Generator.jsx       # AI story generation (main)
│   │   ├── Library.jsx         # Saved stories
│   │   ├── Batch.jsx           # Bulk processing
│   │   ├── Analytics.jsx       # Charts & metrics
│   │   ├── Settings.jsx        # User preferences
│   │   ├── Privacy.jsx         # Privacy Policy
│   │   ├── Terms.jsx           # Terms of Service
│   │   └── Contact.jsx         # Contact page
│   ├── components/
│   │   └── Layout.jsx          # Sidebar + topbar
│   ├── services/
│   │   └── api.js              # All backend API calls
│   ├── styles/
│   │   └── globals.css         # Design system
│   ├── App.jsx                 # Router + Context
│   └── main.jsx                # Entry point
├── server/                     # Express backend
│   ├── index.js                # Server entry point (port 5000)
│   ├── routes/
│   │   ├── generate.js         # POST /api/generate
│   │   ├── upload.js           # POST /api/upload
│   │   ├── batch.js            # POST /api/batch/start
│   │   ├── stories.js          # GET/POST/DELETE /api/stories
│   │   └── analytics.js        # GET /api/analytics
│   ├── controllers/
│   │   ├── generateController.js
│   │   ├── uploadController.js
│   │   ├── batchController.js
│   │   ├── storiesController.js
│   │   └── analyticsController.js
│   ├── services/
│   │   ├── openaiService.js    # AI integration (OpenRouter) + prompt engineering
│   │   ├── fileParser.js       # CSV / XLSX / JSON parsing
│   │   └── storyStore.js       # In-memory + JSON persistence
│   ├── middleware/
│   │   ├── errorHandler.js     # Global error handling
│   │   └── rateLimiter.js      # API rate limiting
│   ├── data/
│   │   └── sample_data.csv     # Sample impact dataset
│   ├── utils/
│   │   └── testConnection.js   # Test AI API connectivity
│   ├── .env.example
│   └── package.json
├── public/
│   └── favicon.svg
├── index.html
├── vite.config.js              # Dev proxy: /api → localhost:5000
├── tailwind.config.js
├── vercel.json                 # Vercel SPA routing
├── package.json                # Includes fullstack scripts
└── .env.example
```

---

## Quick Start (Local)

### Step 1 — Clone & Install

```bash
git clone https://github.com/yourusername/narraite.git
cd narraite

# Install everything at once
npm run install:all
```

### Step 2 — Configure OpenRouter API Key

```bash
cd server
cp .env.example .env
```

Open `server/.env` and set your key:

```env
OPENAI_API_KEY=sk-or-v1-your-openrouter-key-here
OPENAI_BASE_URL=https://openrouter.ai/api/v1
OPENAI_MODEL=gpt-4o-mini
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

Get your API key at: https://openrouter.ai/keys

### Step 3 — Run

**Option A: Run both together (recommended)**
```bash
npm run fullstack
```

**Option B: Run separately**
```bash
# Terminal 1 — Backend
npm run server

# Terminal 2 — Frontend
npm run dev
```

### URLs
| Service | URL |
|---|---|
| Frontend | http://localhost:5173 |
| Backend | http://localhost:5000 |
| API Health | http://localhost:5000/api/health |

### Demo Login
- Email: `demo@narraite.ai`
- Password: `demo1234`

---

## Features

- **AI Story Generation** — Generates emotionally resonant impact narratives from raw data
- **Audience Personalization** — Tailored tones for Donors, Investors, NGOs, Healthcare, Government, Students
- **Multi-format Export** — Download as PDF, TXT, or Word (.doc)
- **Batch Processing** — Generate hundreds of stories from CSV datasets
- **Story Library** — Save, search, and manage generated narratives
- **Analytics Dashboard** — Track generation metrics and trends

---

## API Reference

### POST /api/generate
Generate an AI impact narrative.

**Request:**
```json
{
  "data": "Organization: Asha Foundation\nBeneficiary: 500 children\nMetrics: Dropout -40%",
  "audience": "Donors",
  "tone": "Emotional & Inspiring",
  "length": "medium",
  "format": "Full Narrative",
  "sector": "Education"
}
```

**Response:**
```json
{
  "success": true,
  "narrative": {
    "title": "500 Children Find Their Voice",
    "story": "In the dusty lanes of Dharavi...",
    "summary": "Executive summary...",
    "keyStats": ["500 children educated", "40% dropout reduction"],
    "callToAction": "Support this mission today.",
    "keyQuote": "Most powerful sentence.",
    "sentiment": 9.1,
    "readability": 74,
    "wordCount": 342,
    "tags": ["education", "children"]
  }
}
```

### POST /api/upload
Upload CSV/XLSX/JSON, get preview + column info.

### POST /api/batch/start
Start bulk generation job. Returns `jobId`.

### GET /api/batch/:jobId
Poll job progress.

### GET /api/stories
Get all saved stories (supports `?audience=Donors&sector=Education&search=term`).

### GET /api/analytics
Dashboard metrics and monthly trend data.

---

## Deploy to Production

### Frontend → Vercel

1. Push to GitHub
2. Go to [vercel.com](https://vercel.com) → New Project
3. Import your repo
4. Framework: **Vite**
5. Root directory: `.` (project root)
6. Build command: `npm run build`
7. Output directory: `dist`
8. Add environment variable:
   - `VITE_API_URL` = your Render backend URL (e.g. `https://narraite-api.onrender.com`)
9. Click **Deploy**

### Backend → Render

1. Go to [render.com](https://render.com) → New Web Service
2. Connect your GitHub repo
3. Settings:
   - **Root directory:** `server`
   - **Build command:** `npm install`
   - **Start command:** `npm start`
4. Add environment variables:
   - `OPENAI_API_KEY` = your OpenRouter key
   - `OPENAI_BASE_URL` = `https://openrouter.ai/api/v1`
   - `OPENAI_MODEL` = `gpt-4o-mini`
   - `NODE_ENV` = `production`
   - `FRONTEND_URL` = your Vercel URL
5. Deploy

### Update CORS after deploy
In `server/.env` (or Render env vars):
```
FRONTEND_URL=https://narraite.vercel.app
```

---

## Test AI Connection

```bash
cd server
node utils/testConnection.js
```

Expected output:
```
Testing AI API connection...
✅ AI API connected: {"status":"ok"}
```

---

## Troubleshooting

| Problem | Fix |
|---|---|
| `Cannot reach backend` | Run `npm run server` in a separate terminal |
| `AI API key invalid` | Check `server/.env` has correct OpenRouter key |
| `CORS error` | Ensure `FRONTEND_URL` is set in `server/.env` |
| `Rate limit reached` | Wait 15 min or check OpenRouter dashboard |
| `Quota exceeded` | Add credits at openrouter.ai |
| `Module not found` | Run `npm run install:all` |
| Port 5000 in use | Change `PORT=5001` in `server/.env` |
| Stories not saving | Check `server/data/` folder exists |

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite 5, React Router 6, Tailwind CSS |
| Charts | Recharts |
| Backend | Node.js 18+, Express 4 |
| AI | OpenRouter (GPT-4o-mini, configurable) |
| File parsing | csv-parser, xlsx, multer |
| Export | jsPDF (PDF), Blob API (TXT, Word) |
| Storage | JSON file (swap to Supabase/MongoDB for prod) |
| Security | helmet, express-rate-limit, CORS |
| Deploy | Vercel (frontend) + Render (backend) |

---

## License

This project is licensed under the [MIT License](LICENSE).

---

## Author

Built with ❤️ by **Anushka Tiwari**

📧 [anushkatiwariofficial@gmail.com](mailto:anushkatiwariofficial@gmail.com)

---

*NarrAIte — Because every impact deserves a story worth telling.*
