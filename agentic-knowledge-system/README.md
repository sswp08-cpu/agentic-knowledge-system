# Agentic Knowledge System

A multi-agent AI system that builds and maintains a connected knowledge base using local Markdown files. Inspired by Karpathy-style wiki systems.

## Architecture

```
User Query
    ↓
┌─────────────────────────────────────────┐
│         ORCHESTRATOR AGENT              │
│    (LangGraph State Machine)            │
└─────────────────────────────────────────┘
    ↓
┌─────────────────────────────────────────┐
│  🔍 Research Agent    → Searches existing .md files
│  📝 Summarizer Agent  → Condenses information  
│  ✍️  Writer Agent      → Generates new notes
│  🔗 Linker Agent      → Creates [[wiki-links]]
│  ✅ Validator Agent   → Checks structure/completeness
└─────────────────────────────────────────┘
    ↓
Output + Updated Markdown Knowledge Base
```

## Features

- **Compiled Knowledge**: Agents read/write local Markdown files
- **Wiki-style Links**: Automatic [[topic]] linking between notes
- **Incremental Learning**: Knowledge base grows with each query
- **Transparent Processing**: See which agents contributed

## Tech Stack

- **Backend**: Python, FastAPI, LangGraph, Groq (Llama 3)
- **Frontend**: React, Tailwind CSS
- **Deployment**: Render (persistent filesystem)

## Local Development

### Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate  # or `venv\Scripts\activate` on Windows
pip install -r requirements.txt
export GROQ_API_KEY=your_key_here
uvicorn main:app --reload --port 8000
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

## Environment Variables

```
GROQ_API_KEY=your_groq_api_key
```

## Sample Knowledge Base

The `/knowledge` folder contains interconnected Markdown notes:

```
knowledge/
├── artificial_intelligence.md
├── machine_learning.md
├── neural_networks.md
├── transformers.md
└── large_language_models.md
```

Each file contains structured content with [[wiki-links]] to related topics.

## API Endpoints

- `POST /query` - Process a knowledge query
- `GET /knowledge` - List all knowledge files
- `GET /knowledge/{topic}` - Get specific note content

## License

MIT
