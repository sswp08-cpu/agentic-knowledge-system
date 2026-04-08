# Deployment Guide - Agentic Knowledge System

## Quick Deploy to Render (Free Tier)

### Step 1: Push to GitHub

```bash
cd agentic-knowledge-system
git init
git add .
git commit -m "Initial commit: Agentic Knowledge System"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/agentic-knowledge-system.git
git push -u origin main
```

### Step 2: Deploy Backend (Web Service)

1. Go to [render.com](https://render.com) and sign in
2. Click **New +** → **Web Service**
3. Connect your GitHub repo
4. Configure:
   - **Name**: `agentic-knowledge-api`
   - **Root Directory**: `backend`
   - **Runtime**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`
5. Add Environment Variable:
   - **Key**: `GROQ_API_KEY`
   - **Value**: Your Groq API key from [console.groq.com](https://console.groq.com)
6. Click **Create Web Service**
7. Wait for deploy (~2-3 minutes)
8. Copy your backend URL: `https://agentic-knowledge-api.onrender.com`

### Step 3: Deploy Frontend (Static Site)

1. In Render, click **New +** → **Static Site**
2. Connect same GitHub repo
3. Configure:
   - **Name**: `agentic-knowledge-ui`
   - **Root Directory**: `frontend`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`
4. Add Environment Variable:
   - **Key**: `VITE_API_URL`
   - **Value**: Your backend URL from Step 2 (e.g., `https://agentic-knowledge-api.onrender.com`)
5. Click **Create Static Site**
6. Wait for deploy (~1-2 minutes)

### Step 4: Test Your Deployment

1. Open your frontend URL: `https://agentic-knowledge-ui.onrender.com`
2. Try a query: "What are transformers?"
3. Check the knowledge sidebar shows seed files
4. Verify new files are created after queries

---

## Local Development

### Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
# Edit .env and add your GROQ_API_KEY
uvicorn main:app --reload --port 8000
```

Test: `http://localhost:8000/health`

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Test: `http://localhost:5173`

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | API info |
| GET | `/health` | Health check |
| POST | `/query` | Process knowledge query |
| GET | `/knowledge` | List all knowledge files |
| GET | `/knowledge/{topic}` | Get specific file content |
| DELETE | `/knowledge/{topic}` | Delete a knowledge file |

### Example Query

```bash
curl -X POST https://your-backend.onrender.com/query \
  -H "Content-Type: application/json" \
  -d '{"query": "Explain how neural networks learn"}'
```

---

## Troubleshooting

### Backend not responding
- Check Render logs for errors
- Verify GROQ_API_KEY is set correctly
- Free tier spins down after 15 min inactivity (first request takes ~30s)

### Frontend shows connection error
- Verify VITE_API_URL is set correctly in Render
- Check browser console for CORS errors
- Redeploy frontend after changing env vars

### Groq API errors
- Check your API key is valid
- Verify you have free tier quota remaining
- Model `llama-3.3-70b-versatile` should be available

---

## Architecture Recap

```
┌─────────────────────────────────────────────────────────┐
│                    FRONTEND (React)                      │
│                  Render Static Site                      │
└─────────────────────────┬───────────────────────────────┘
                          │ HTTPS
                          ▼
┌─────────────────────────────────────────────────────────┐
│                   BACKEND (FastAPI)                      │
│                  Render Web Service                      │
│  ┌───────────────────────────────────────────────────┐  │
│  │              LangGraph Orchestrator               │  │
│  │  Research → Summarize → Write → Link → Validate   │  │
│  └───────────────────────────────────────────────────┘  │
│                          │                               │
│                          ▼                               │
│  ┌───────────────────────────────────────────────────┐  │
│  │            /knowledge/*.md files                  │  │
│  │         (Persistent on Render disk)               │  │
│  └───────────────────────────────────────────────────┘  │
└─────────────────────────┬───────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│                    Groq API (LLM)                        │
│                  llama-3.3-70b-versatile                 │
└─────────────────────────────────────────────────────────┘
```

---

## Get Groq API Key

1. Go to [console.groq.com](https://console.groq.com)
2. Sign up / Sign in
3. Navigate to API Keys
4. Create new key
5. Copy and save securely

Free tier: 30 requests/minute, plenty for demo.
