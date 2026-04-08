"""
Agentic Knowledge System - FastAPI Backend
"""

import os
from pathlib import Path
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from typing import List, Optional
from dotenv import load_dotenv

load_dotenv()

from agents import process_query, get_all_knowledge, get_knowledge_file, KNOWLEDGE_DIR

app = FastAPI(
    title="Agentic Knowledge System",
    description="Multi-agent AI system for building connected knowledge bases",
    version="1.0.0"
)

# CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class QueryRequest(BaseModel):
    query: str


class QueryResponse(BaseModel):
    response: str
    agents_used: List[str]
    files_created: List[str]
    files_updated: List[str]
    validation: dict
    existing_knowledge_count: int


class KnowledgeFile(BaseModel):
    filename: str
    content: str


class KnowledgeListResponse(BaseModel):
    files: List[str]
    count: int


@app.get("/")
async def root():
    return {
        "message": "Agentic Knowledge System API",
        "version": "1.0.0",
        "endpoints": {
            "POST /query": "Process a knowledge query",
            "GET /knowledge": "List all knowledge files",
            "GET /knowledge/{topic}": "Get specific note content"
        }
    }


@app.post("/query", response_model=QueryResponse)
async def handle_query(request: QueryRequest):
    """Process a user query through the multi-agent pipeline"""
    
    if not request.query.strip():
        raise HTTPException(status_code=400, detail="Query cannot be empty")
    
    if not os.getenv("GROQ_API_KEY"):
        raise HTTPException(status_code=500, detail="GROQ_API_KEY not configured")
    
    try:
        result = process_query(request.query)
        return QueryResponse(**result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Processing error: {str(e)}")


@app.get("/knowledge", response_model=KnowledgeListResponse)
async def list_knowledge():
    """List all knowledge files in the system"""
    
    knowledge = get_all_knowledge()
    return KnowledgeListResponse(
        files=[k["filename"] for k in knowledge],
        count=len(knowledge)
    )


@app.get("/knowledge/{topic}")
async def get_knowledge(topic: str):
    """Get a specific knowledge file content"""
    
    content = get_knowledge_file(topic)
    if content is None:
        raise HTTPException(status_code=404, detail=f"Topic '{topic}' not found")
    
    return KnowledgeFile(filename=topic, content=content)


@app.delete("/knowledge/{topic}")
async def delete_knowledge(topic: str):
    """Delete a knowledge file"""
    
    filepath = KNOWLEDGE_DIR / f"{topic}.md"
    if not filepath.exists():
        raise HTTPException(status_code=404, detail=f"Topic '{topic}' not found")
    
    filepath.unlink()
    return {"message": f"Deleted {topic}", "success": True}


@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "groq_configured": bool(os.getenv("GROQ_API_KEY")),
        "knowledge_dir": str(KNOWLEDGE_DIR),
        "knowledge_count": len(get_all_knowledge())
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
