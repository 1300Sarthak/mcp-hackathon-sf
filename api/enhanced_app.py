#!/usr/bin/env python3
"""
Enhanced FastAPI Application with LlamaIndex RAG capabilities
RESTful API with RAG-powered competitive intelligence
"""

from enhanced_ci_agent import EnhancedMultiAgentCompetitiveIntelligence
import asyncio
import json
import logging
from datetime import datetime
from typing import Dict, List, Any, Optional
from contextlib import asynccontextmanager

from fastapi import FastAPI, HTTPException, BackgroundTasks, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel, Field
import uvicorn
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)

# Global storage for streaming sessions
streaming_sessions: Dict[str, Dict] = {}

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Manage application lifespan"""
    logger.info("🚀 Starting Enhanced Multi-Agent Competitive Intelligence API with RAG")
    
    # Test environment setup
    try:
        from ci_agent import get_gemini_model
        get_gemini_model()
        logger.info("✅ Gemini model configuration verified")
    except Exception as e:
        logger.warning(f"⚠️ Environment setup incomplete: {e}")
    
    yield
    logger.info("🛑 Shutting down Enhanced API")

# Initialize FastAPI app
app = FastAPI(
    title="Enhanced Multi-Agent Competitive Intelligence API with RAG",
    description="RESTful API for competitive intelligence analysis with LlamaIndex RAG capabilities",
    version="2.0.0",
    lifespan=lifespan
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Enhanced Pydantic models

class EnhancedAnalysisRequest(BaseModel):
    """Enhanced request model for competitive analysis with RAG"""
    competitor_name: str = Field(..., description="Name of the competitor to analyze")
    competitor_website: Optional[str] = Field(None, description="Website URL of the competitor")
    industry_keywords: Optional[List[str]] = Field(None, description="Industry keywords for market context")
    enable_rag: bool = Field(True, description="Enable RAG capabilities")
    stream: bool = Field(False, description="Enable streaming for real-time updates")

class RAGQueryRequest(BaseModel):
    """Request model for RAG knowledge base queries"""
    query: str = Field(..., description="Natural language query")
    competitor_filter: Optional[str] = Field(None, description="Filter by specific competitor")

class MarketAnalysisRequest(BaseModel):
    """Request model for market landscape analysis"""
    industry_keywords: List[str] = Field(..., description="Industry keywords for analysis")

class EnhancedAnalysisResponse(BaseModel):
    """Enhanced response model with RAG capabilities"""
    competitor: str
    website: Optional[str]
    research_findings: str
    strategic_analysis: str
    final_report: str
    metrics: Optional[Dict[str, Any]] = None
    timestamp: str
    status: str
    workflow: str
    rag_enabled: bool
    rag_stored: Optional[bool] = None
    industry_keywords: Optional[List[str]] = None

class RAGQueryResponse(BaseModel):
    """Response model for RAG queries"""
    query: str
    competitor_filter: Optional[str]
    response: str
    timestamp: str
    status: str

class MarketAnalysisResponse(BaseModel):
    """Response model for market analysis"""
    industry_keywords: List[str]
    market_analysis: str
    knowledge_base_stats: Dict[str, Any]
    timestamp: str
    status: str

# Health and status endpoints

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "version": "2.0.0",
        "features": ["multi_agent", "rag", "streaming"],
        "timestamp": datetime.now().isoformat()
    }

@app.get("/rag-status")
async def get_rag_status():
    """Get RAG system status and statistics"""
    try:
        intelligence_system = EnhancedMultiAgentCompetitiveIntelligence(enable_rag=True)
        stats = intelligence_system.get_rag_stats()
        return stats
    except Exception as e:
        return {
            "rag_enabled": False,
            "status": "error",
            "error": str(e),
            "timestamp": datetime.now().isoformat()
        }

# Enhanced analysis endpoints

@app.post("/analyze/enhanced", response_model=EnhancedAnalysisResponse)
async def analyze_competitor_enhanced(request: EnhancedAnalysisRequest):
    """
    Perform enhanced competitive intelligence analysis with RAG capabilities
    """
    try:
        logger.info(f"Starting enhanced analysis for: {request.competitor_name}")
        
        # Initialize enhanced intelligence system
        intelligence_system = EnhancedMultiAgentCompetitiveIntelligence(
            enable_rag=request.enable_rag
        )
        
        # Run enhanced workflow
        result = intelligence_system.run_enhanced_competitive_intelligence_workflow(
            competitor_name=request.competitor_name,
            competitor_website=request.competitor_website,
            industry_keywords=request.industry_keywords
        )
        
        if result["status"] == "error":
            raise HTTPException(
                status_code=500, 
                detail=result.get("error", "Enhanced analysis failed")
            )
        
        logger.info(f"Enhanced analysis completed for: {request.competitor_name}")
        return EnhancedAnalysisResponse(**result)
        
    except Exception as e:
        logger.error(f"Enhanced analysis failed for {request.competitor_name}: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/analyze/enhanced/stream")
async def analyze_competitor_enhanced_stream(request: EnhancedAnalysisRequest):
    """
    Perform enhanced competitive intelligence analysis with real-time streaming
    """
    if not request.stream:
        return await analyze_competitor_enhanced(request)
    
    session_id = f"enhanced_session_{datetime.now().strftime('%Y%m%d_%H%M%S')}_{request.competitor_name.replace(' ', '_')}"
    
    async def generate_enhanced_stream():
        """Generate enhanced streaming events"""
        try:
            streaming_sessions[session_id] = {
                "start_time": datetime.now().isoformat(),
                "competitor": request.competitor_name,
                "status": "running",
                "enhanced": True,
                "rag_enabled": request.enable_rag
            }
            
            events_queue = asyncio.Queue()
            
            def stream_callback(event):
                """Enhanced callback to capture streaming events"""
                try:
                    json.dumps(event)  # Validate serialization
                    asyncio.create_task(events_queue.put(event))
                except (TypeError, ValueError) as json_error:
                    safe_event = {
                        "timestamp": datetime.now().isoformat(),
                        "type": "tool_call",
                        "message": f"Non-serializable event: {str(json_error)}",
                        "enhanced": True
                    }
                    asyncio.create_task(events_queue.put(safe_event))
                except Exception as e:
                    logger.error(f"Enhanced stream callback error: {e}")
            
            # Start enhanced analysis in background
            async def run_enhanced_analysis():
                intelligence_system = None
                try:
                    intelligence_system = EnhancedMultiAgentCompetitiveIntelligence(
                        stream_callback=stream_callback,
                        enable_rag=request.enable_rag
                    )
                    
                    result = intelligence_system.run_enhanced_competitive_intelligence_workflow(
                        competitor_name=request.competitor_name,
                        competitor_website=request.competitor_website,
                        industry_keywords=request.industry_keywords
                    )
                    
                    # Send final enhanced result
                    final_event = {
                        "timestamp": datetime.now().isoformat(),
                        "type": "complete",
                        "data": result,
                        "enhanced": True,
                        "rag_enabled": request.enable_rag
                    }
                    await events_queue.put(final_event)
                    
                    streaming_sessions[session_id]["status"] = "completed"
                    streaming_sessions[session_id]["result"] = result
                    
                except Exception as e:
                    logger.error(f"Enhanced analysis error for session {session_id}: {e}")
                    error_event = {
                        "timestamp": datetime.now().isoformat(),
                        "type": "error",
                        "message": str(e),
                        "enhanced": True
                    }
                    await events_queue.put(error_event)
                    streaming_sessions[session_id]["status"] = "error"
                finally:
                    await events_queue.put(None)  # End signal
            
            # Start enhanced analysis
            analysis_task = asyncio.create_task(run_enhanced_analysis())
            
            # Send initial enhanced event
            initial_event = {
                "timestamp": datetime.now().isoformat(),
                "type": "session_start",
                "session_id": session_id,
                "message": f"Starting enhanced analysis for {request.competitor_name}",
                "enhanced": True,
                "rag_enabled": request.enable_rag,
                "industry_keywords": request.industry_keywords
            }
            yield f"data: {json.dumps(initial_event)}\n\n"
            
            # Stream enhanced events
            while True:
                try:
                    event = await asyncio.wait_for(events_queue.get(), timeout=1.0)
                    
                    if event is None:  # End of stream
                        break
                    
                    try:
                        event_json = json.dumps(event)
                        yield f"data: {event_json}\n\n"
                    except (TypeError, ValueError) as e:
                        safe_event = {
                            "timestamp": datetime.now().isoformat(),
                            "type": "error",
                            "message": f"Event serialization error: {str(e)}",
                            "enhanced": True
                        }
                        yield f"data: {json.dumps(safe_event)}\n\n"
                
                except asyncio.TimeoutError:
                    # Enhanced heartbeat
                    heartbeat = {
                        "timestamp": datetime.now().isoformat(),
                        "type": "heartbeat",
                        "enhanced": True
                    }
                    yield f"data: {json.dumps(heartbeat)}\n\n"
                    continue
            
            await analysis_task
            
        except Exception as e:
            logger.error(f"Enhanced streaming error for session {session_id}: {e}")
            error_event = {
                "timestamp": datetime.now().isoformat(),
                "type": "error",
                "message": str(e),
                "enhanced": True
            }
            yield f"data: {json.dumps(error_event)}\n\n"
        finally:
            # Cleanup
            async def cleanup():
                await asyncio.sleep(300)
                streaming_sessions.pop(session_id, None)
            asyncio.create_task(cleanup())
    
    return StreamingResponse(
        generate_enhanced_stream(),
        media_type="text/plain",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "Content-Type": "text/event-stream"
        }
    )

# RAG-specific endpoints

@app.post("/rag/query", response_model=RAGQueryResponse)
async def query_knowledge_base(request: RAGQueryRequest):
    """
    Query the competitive intelligence knowledge base using RAG
    """
    try:
        intelligence_system = EnhancedMultiAgentCompetitiveIntelligence(enable_rag=True)
        result = intelligence_system.query_knowledge_base(
            query=request.query,
            competitor_filter=request.competitor_filter
        )
        
        if result["status"] == "error":
            raise HTTPException(status_code=500, detail=result.get("error", "RAG query failed"))
        
        return RAGQueryResponse(**result)
        
    except Exception as e:
        logger.error(f"RAG query failed: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/rag/market-analysis", response_model=MarketAnalysisResponse)
async def get_market_analysis(request: MarketAnalysisRequest):
    """
    Get market landscape analysis from accumulated competitive intelligence
    """
    try:
        intelligence_system = EnhancedMultiAgentCompetitiveIntelligence(enable_rag=True)
        result = intelligence_system.get_market_analysis(request.industry_keywords)
        
        if result["status"] == "error":
            raise HTTPException(status_code=500, detail=result.get("error", "Market analysis failed"))
        
        return MarketAnalysisResponse(**result)
        
    except Exception as e:
        logger.error(f"Market analysis failed: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/rag/competitors")
async def get_analyzed_competitors():
    """Get list of competitors in the knowledge base"""
    try:
        intelligence_system = EnhancedMultiAgentCompetitiveIntelligence(enable_rag=True)
        stats = intelligence_system.get_rag_stats()
        
        competitors = stats.get("competitors", {})
        return {
            "competitors": list(competitors.keys()),
            "competitor_counts": competitors,
            "total_documents": stats.get("total_documents", 0),
            "timestamp": datetime.now().isoformat()
        }
        
    except Exception as e:
        logger.error(f"Failed to get competitors list: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

# Backward compatibility endpoints (delegate to enhanced versions)

@app.post("/analyze", response_model=EnhancedAnalysisResponse)
async def analyze_competitor_compat(request: EnhancedAnalysisRequest):
    """Backward compatible analysis endpoint"""
    return await analyze_competitor_enhanced(request)

@app.post("/analyze/stream")
async def analyze_competitor_stream_compat(request: EnhancedAnalysisRequest):
    """Backward compatible streaming endpoint"""
    return await analyze_competitor_enhanced_stream(request)

# Demo scenarios with industry keywords
@app.get("/demo-scenarios")
async def get_enhanced_demo_scenarios():
    """Get enhanced demo scenarios with industry keywords"""
    scenarios = [
        {
            "id": 1,
            "name": "Notion",
            "website": "https://notion.so",
            "description": "All-in-one workspace",
            "industry_keywords": ["productivity", "collaboration", "workspace", "saas"]
        },
        {
            "id": 2,
            "name": "Figma",
            "website": "https://figma.com",
            "description": "Collaborative design",
            "industry_keywords": ["design", "collaboration", "ui", "saas"]
        },
        {
            "id": 3,
            "name": "Slack",
            "website": "https://slack.com",
            "description": "Team communication",
            "industry_keywords": ["communication", "collaboration", "enterprise", "saas"]
        }
    ]
    
    return {
        "scenarios": scenarios,
        "features": ["enhanced_analysis", "rag_capabilities", "market_context"],
        "timestamp": datetime.now().isoformat()
    }

if __name__ == "__main__":
    uvicorn.run(
        "enhanced_app:app",
        host="0.0.0.0",
        port=8001,  # Different port to avoid conflicts
        reload=True,
        log_level="info"
    )
