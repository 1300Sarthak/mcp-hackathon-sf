#!/usr/bin/env python3
"""
Enhanced FastAPI Application with Analysis Modes and Optimized LlamaIndex RAG
RESTful API with Simple/Deep analysis modes and cached RAG responses
"""

from enhanced_ci_agent_with_modes import EnhancedMultiAgentCompetitiveIntelligenceWithModes, AnalysisMode
from llamaindex_integration import CompetitiveIntelligenceRAG
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

# Global RAG system instance
rag_system: Optional[CompetitiveIntelligenceRAG] = None

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Manage application lifespan"""
    global rag_system
    
    logger.info("🚀 Starting Enhanced Multi-Agent Competitive Intelligence API with Analysis Modes")
    
    # Initialize RAG system
    try:
        rag_system = CompetitiveIntelligenceRAG()
        logger.info("✅ RAG system initialized")
    except Exception as e:
        logger.warning(f"⚠️ RAG system initialization failed: {e}")
        rag_system = None
    
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
    title="Enhanced Multi-Agent Competitive Intelligence API with Analysis Modes",
    description="RESTful API for competitive intelligence analysis with Simple/Deep modes and optimized RAG",
    version="3.0.0",
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
    """Enhanced request model with analysis modes"""
    competitor_name: str = Field(..., description="Name of the competitor to analyze")
    competitor_website: Optional[str] = Field(None, description="Website URL of the competitor")
    analysis_mode: str = Field("simple", description="Analysis mode: 'simple' or 'deep'")
    stream: bool = Field(False, description="Enable streaming for real-time updates")

class RAGQueryRequest(BaseModel):
    """Request model for RAG knowledge base queries"""
    query: str = Field(..., description="Natural language query")
    competitor_filter: Optional[str] = Field(None, description="Filter by specific competitor")

class EnhancedAnalysisResponse(BaseModel):
    """Enhanced response model with analysis modes"""
    competitor: str
    website: Optional[str]
    research_findings: str
    strategic_analysis: str
    final_report: str
    metrics: Optional[Dict[str, Any]] = None
    timestamp: str
    status: str
    workflow: str
    analysis_mode: str

class RAGQueryResponse(BaseModel):
    """Response model for RAG queries"""
    query: str
    competitor_filter: Optional[str]
    response: str
    timestamp: str
    status: str
    cached: bool = False

# Health and status endpoints

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "version": "3.0.0",
        "features": ["multi_agent", "analysis_modes", "optimized_rag", "streaming"],
        "timestamp": datetime.now().isoformat()
    }

@app.get("/analysis-modes")
async def get_analysis_modes():
    """Get available analysis modes"""
    return {
        "modes": {
            "simple": {
                "name": "Simple",
                "description": "Quick and focused analysis",
                "features": ["Essential insights", "Key recommendations", "Fast processing"],
                "typical_duration": "2-3 minutes"
            },
            "deep": {
                "name": "Deep Think",
                "description": "Comprehensive and detailed analysis", 
                "features": ["Exhaustive research", "Detailed insights", "Strategic scenarios"],
                "typical_duration": "5-8 minutes"
            }
        },
        "default": "simple"
    }

@app.get("/rag-status")
async def get_rag_status():
    """Get RAG system status and statistics"""
    global rag_system
    
    if not rag_system:
        return {
            "rag_enabled": False,
            "status": "disabled",
            "error": "RAG system not initialized",
            "timestamp": datetime.now().isoformat()
        }
    
    try:
        stats = rag_system.get_index_stats()
        stats["rag_enabled"] = True
        stats["status"] = "active"
        stats["query_cache_size"] = len(rag_system.query_cache)
        stats["cache_max_size"] = rag_system.cache_max_size
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
    Perform enhanced competitive intelligence analysis with mode selection
    """
    try:
        logger.info(f"Starting {request.analysis_mode} analysis for: {request.competitor_name}")
        
        # Validate analysis mode
        try:
            analysis_mode = AnalysisMode(request.analysis_mode.lower())
        except ValueError:
            raise HTTPException(
                status_code=400,
                detail=f"Invalid analysis mode: {request.analysis_mode}. Must be 'simple' or 'deep'"
            )
        
        # Initialize enhanced intelligence system with selected mode
        intelligence_system = EnhancedMultiAgentCompetitiveIntelligenceWithModes(
            analysis_mode=analysis_mode
        )
        
        # Run enhanced workflow
        result = intelligence_system.run_competitive_intelligence_workflow(
            competitor_name=request.competitor_name,
            competitor_website=request.competitor_website
        )
        
        if result["status"] == "error":
            raise HTTPException(
                status_code=500, 
                detail=result.get("error", f"{request.analysis_mode.title()} analysis failed")
            )
        
        # Store in RAG system if available
        if rag_system:
            try:
                rag_success = rag_system.ingest_competitive_analysis(
                    request.competitor_name, result
                )
                if rag_success:
                    logger.info(f"Analysis stored in RAG system for {request.competitor_name}")
            except Exception as e:
                logger.warning(f"Failed to store in RAG system: {e}")
        
        logger.info(f"{request.analysis_mode.title()} analysis completed for: {request.competitor_name}")
        return EnhancedAnalysisResponse(**result)
        
    except Exception as e:
        logger.error(f"{request.analysis_mode.title()} analysis failed for {request.competitor_name}: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/analyze/enhanced/stream")
async def analyze_competitor_enhanced_stream(request: EnhancedAnalysisRequest):
    """
    Perform enhanced competitive intelligence analysis with real-time streaming
    """
    if not request.stream:
        return await analyze_competitor_enhanced(request)
    
    # Validate analysis mode
    try:
        analysis_mode = AnalysisMode(request.analysis_mode.lower())
    except ValueError:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid analysis mode: {request.analysis_mode}. Must be 'simple' or 'deep'"
        )
    
    session_id = f"enhanced_{request.analysis_mode}_session_{datetime.now().strftime('%Y%m%d_%H%M%S')}_{request.competitor_name.replace(' ', '_')}"
    
    async def generate_enhanced_stream():
        """Generate enhanced streaming events with mode information"""
        try:
            streaming_sessions[session_id] = {
                "start_time": datetime.now().isoformat(),
                "competitor": request.competitor_name,
                "status": "running",
                "analysis_mode": request.analysis_mode,
                "enhanced": True
            }
            
            events_queue = asyncio.Queue()
            
            def stream_callback(event):
                """Enhanced callback to capture streaming events"""
                try:
                    # Add mode information to events
                    event["analysis_mode"] = request.analysis_mode
                    json.dumps(event)  # Validate serialization
                    asyncio.create_task(events_queue.put(event))
                except (TypeError, ValueError) as json_error:
                    safe_event = {
                        "timestamp": datetime.now().isoformat(),
                        "type": "tool_call",
                        "message": f"Non-serializable event: {str(json_error)}",
                        "analysis_mode": request.analysis_mode,
                        "enhanced": True
                    }
                    asyncio.create_task(events_queue.put(safe_event))
                except Exception as e:
                    logger.error(f"Enhanced stream callback error: {e}")
            
            # Start enhanced analysis in background
            async def run_enhanced_analysis():
                intelligence_system = None
                try:
                    intelligence_system = EnhancedMultiAgentCompetitiveIntelligenceWithModes(
                        stream_callback=stream_callback,
                        analysis_mode=analysis_mode
                    )
                    
                    result = intelligence_system.run_competitive_intelligence_workflow(
                        competitor_name=request.competitor_name,
                        competitor_website=request.competitor_website
                    )
                    
                    # Store in RAG system if available
                    if rag_system and result["status"] == "success":
                        try:
                            rag_success = rag_system.ingest_competitive_analysis(
                                request.competitor_name, result
                            )
                            if rag_success:
                                result["rag_stored"] = True
                        except Exception as e:
                            logger.warning(f"Failed to store in RAG system: {e}")
                    
                    # Send final enhanced result
                    final_event = {
                        "timestamp": datetime.now().isoformat(),
                        "type": "complete",
                        "data": result,
                        "analysis_mode": request.analysis_mode,
                        "enhanced": True
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
                        "analysis_mode": request.analysis_mode,
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
                "message": f"Starting {request.analysis_mode} analysis for {request.competitor_name}",
                "analysis_mode": request.analysis_mode,
                "enhanced": True
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
                            "analysis_mode": request.analysis_mode,
                            "enhanced": True
                        }
                        yield f"data: {json.dumps(safe_event)}\n\n"
                
                except asyncio.TimeoutError:
                    # Enhanced heartbeat
                    heartbeat = {
                        "timestamp": datetime.now().isoformat(),
                        "type": "heartbeat",
                        "analysis_mode": request.analysis_mode,
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
                "analysis_mode": request.analysis_mode,
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

# Optimized RAG endpoints

@app.post("/rag/query", response_model=RAGQueryResponse)
async def query_knowledge_base(request: RAGQueryRequest):
    """
    Query the competitive intelligence knowledge base using optimized RAG
    """
    global rag_system
    
    if not rag_system:
        raise HTTPException(
            status_code=503,
            detail="RAG system not available. Please ensure LlamaIndex is properly configured."
        )
    
    try:
        # Check if response was cached
        cache_key = f"{request.query}|{request.competitor_filter or 'all'}"
        was_cached = cache_key in rag_system.query_cache
        
        response = rag_system.query_competitive_intelligence(
            query=request.query,
            competitor_filter=request.competitor_filter
        )
        
        return RAGQueryResponse(
            query=request.query,
            competitor_filter=request.competitor_filter,
            response=response,
            timestamp=datetime.now().isoformat(),
            status="success",
            cached=was_cached
        )
        
    except Exception as e:
        logger.error(f"RAG query failed: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.delete("/rag/cache")
async def clear_rag_cache():
    """Clear the RAG query cache"""
    global rag_system
    
    if not rag_system:
        raise HTTPException(
            status_code=503,
            detail="RAG system not available"
        )
    
    try:
        cache_size = len(rag_system.query_cache)
        rag_system.query_cache.clear()
        
        return {
            "message": "RAG query cache cleared",
            "cleared_entries": cache_size,
            "timestamp": datetime.now().isoformat()
        }
        
    except Exception as e:
        logger.error(f"Failed to clear RAG cache: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

# Backward compatibility endpoints

@app.post("/analyze", response_model=EnhancedAnalysisResponse)
async def analyze_competitor_compat(request: EnhancedAnalysisRequest):
    """Backward compatible analysis endpoint"""
    return await analyze_competitor_enhanced(request)

@app.post("/analyze/stream")
async def analyze_competitor_stream_compat(request: EnhancedAnalysisRequest):
    """Backward compatible streaming endpoint"""
    return await analyze_competitor_enhanced_stream(request)

# Demo scenarios with analysis modes
@app.get("/demo-scenarios")
async def get_enhanced_demo_scenarios():
    """Get enhanced demo scenarios with analysis mode information"""
    scenarios = [
        {
            "id": 1,
            "name": "Notion",
            "website": "https://notion.so",
            "description": "All-in-one workspace",
            "recommended_mode": "deep",
            "reason": "Complex product with multiple features"
        },
        {
            "id": 2,
            "name": "Figma",
            "website": "https://figma.com",
            "description": "Collaborative design",
            "recommended_mode": "deep",
            "reason": "Design tools market requires detailed analysis"
        },
        {
            "id": 3,
            "name": "Slack",
            "website": "https://slack.com",
            "description": "Team communication",
            "recommended_mode": "simple",
            "reason": "Well-established product, quick insights sufficient"
        }
    ]
    
    return {
        "scenarios": scenarios,
        "features": ["analysis_modes", "optimized_rag", "cached_responses"],
        "timestamp": datetime.now().isoformat()
    }

if __name__ == "__main__":
    uvicorn.run(
        "enhanced_app_with_modes:app",
        host="0.0.0.0",
        port=8002,  # Different port to avoid conflicts
        reload=True,
        log_level="info"
    )
