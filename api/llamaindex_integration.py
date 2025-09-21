#!/usr/bin/env python3
"""
LlamaIndex Integration for Competitive Intelligence
Enhanced RAG capabilities for multi-agent competitive analysis
"""

import os
import logging
from typing import Dict, List, Any, Optional
from datetime import datetime
import json
from pathlib import Path

# LlamaIndex imports
from llama_index.core import (
    VectorStoreIndex, 
    Document, 
    ServiceContext,
    StorageContext,
    load_index_from_storage
)
from llama_index.core.node_parser import SimpleNodeParser
from llama_index.embeddings.openai import OpenAIEmbedding
from llama_index.embeddings.huggingface import HuggingFaceEmbedding
from llama_index.llms.gemini import Gemini
from llama_index.vector_stores.chroma import ChromaVectorStore
from llama_index.core.storage.docstore import SimpleDocumentStore
from llama_index.core.storage.index_store import SimpleIndexStore

import chromadb
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

logger = logging.getLogger(__name__)

class CompetitiveIntelligenceRAG:
    """
    LlamaIndex-powered RAG system for competitive intelligence
    Integrates with existing Strands agents workflow
    """
    
    def __init__(self, persist_dir: str = "./data/competitive_intelligence"):
        """Initialize the RAG system with persistent storage and query caching"""
        self.persist_dir = Path(persist_dir)
        self.persist_dir.mkdir(parents=True, exist_ok=True)
        
        # Query cache to prevent re-researching
        self.query_cache = {}
        self.cache_max_size = 100  # Maximum number of cached queries
        
        # Initialize components
        self._setup_embedding_model()
        self._setup_llm()
        self._setup_vector_store()
        self._setup_service_context()
        self._load_or_create_index()
        
        logger.info("✅ Competitive Intelligence RAG system initialized with query caching")
    
    def _setup_embedding_model(self):
        """Setup embedding model (OpenAI or HuggingFace)"""
        openai_key = os.getenv("OPENAI_API_KEY")
        
        if openai_key:
            # Use OpenAI embeddings if available
            self.embed_model = OpenAIEmbedding(
                model="text-embedding-3-small",
                api_key=openai_key
            )
            logger.info("Using OpenAI embeddings")
        else:
            # Fallback to local HuggingFace embeddings
            self.embed_model = HuggingFaceEmbedding(
                model_name="sentence-transformers/all-MiniLM-L6-v2"
            )
            logger.info("Using local HuggingFace embeddings")
    
    def _setup_llm(self):
        """Setup Gemini LLM for LlamaIndex using existing .env configuration"""
        gemini_key = os.getenv("GEMINI_API_KEY")
        gemini_model_name = os.getenv("GEMINI_MODEL_NAME", "gemini-2.0-flash")
        
        if not gemini_key:
            raise ValueError("GEMINI_API_KEY required for LlamaIndex integration")
        
        # Use the same model configuration as the main CI agent
        self.llm = Gemini(
            api_key=gemini_key,
            model=f"models/{gemini_model_name}",
            temperature=0.1,  # Lower temperature for more consistent RAG responses
            max_tokens=2000   # Reasonable limit for RAG responses
        )
        logger.info(f"Gemini LLM configured for LlamaIndex: {gemini_model_name}")
    
    def _setup_vector_store(self):
        """Setup ChromaDB vector store"""
        chroma_client = chromadb.PersistentClient(path=str(self.persist_dir / "chroma"))
        chroma_collection = chroma_client.get_or_create_collection("competitive_intelligence")
        
        self.vector_store = ChromaVectorStore(chroma_collection=chroma_collection)
        logger.info("ChromaDB vector store configured")
    
    def _setup_service_context(self):
        """Setup LlamaIndex service context"""
        self.service_context = ServiceContext.from_defaults(
            llm=self.llm,
            embed_model=self.embed_model,
            node_parser=SimpleNodeParser.from_defaults(chunk_size=1024, chunk_overlap=20)
        )
    
    def _load_or_create_index(self):
        """Load existing index or create new one"""
        storage_dir = self.persist_dir / "storage"
        
        if storage_dir.exists():
            try:
                # Load existing index
                storage_context = StorageContext.from_defaults(
                    vector_store=self.vector_store,
                    persist_dir=str(storage_dir)
                )
                self.index = load_index_from_storage(
                    storage_context=storage_context,
                    service_context=self.service_context
                )
                logger.info("Loaded existing competitive intelligence index")
            except Exception as e:
                logger.warning(f"Failed to load existing index: {e}")
                self._create_new_index()
        else:
            self._create_new_index()
    
    def _create_new_index(self):
        """Create new empty index"""
        storage_context = StorageContext.from_defaults(
            vector_store=self.vector_store
        )
        
        self.index = VectorStoreIndex(
            nodes=[],  # Start with empty index
            storage_context=storage_context,
            service_context=self.service_context
        )
        
        # Persist the empty index
        self.index.storage_context.persist(persist_dir=str(self.persist_dir / "storage"))
        logger.info("Created new competitive intelligence index")
    
    def ingest_competitive_analysis(self, competitor_name: str, analysis_data: Dict[str, Any]) -> bool:
        """
        Ingest competitive analysis data into the RAG system
        
        Args:
            competitor_name: Name of the competitor
            analysis_data: Complete analysis data from multi-agent workflow
            
        Returns:
            bool: Success status
        """
        try:
            # Create documents from different analysis components
            documents = []
            
            # Research findings document
            if "research_findings" in analysis_data:
                research_doc = Document(
                    text=analysis_data["research_findings"],
                    metadata={
                        "competitor": competitor_name,
                        "type": "research_findings",
                        "timestamp": analysis_data.get("timestamp", datetime.now().isoformat()),
                        "website": analysis_data.get("website", ""),
                        "source": "research_agent"
                    }
                )
                documents.append(research_doc)
            
            # Strategic analysis document
            if "strategic_analysis" in analysis_data:
                analysis_doc = Document(
                    text=analysis_data["strategic_analysis"],
                    metadata={
                        "competitor": competitor_name,
                        "type": "strategic_analysis",
                        "timestamp": analysis_data.get("timestamp", datetime.now().isoformat()),
                        "website": analysis_data.get("website", ""),
                        "source": "analyst_agent"
                    }
                )
                documents.append(analysis_doc)
            
            # Final report document
            if "final_report" in analysis_data:
                report_doc = Document(
                    text=analysis_data["final_report"],
                    metadata={
                        "competitor": competitor_name,
                        "type": "final_report",
                        "timestamp": analysis_data.get("timestamp", datetime.now().isoformat()),
                        "website": analysis_data.get("website", ""),
                        "source": "writer_agent"
                    }
                )
                documents.append(report_doc)
            
            # Metrics document (structured data)
            if "metrics" in analysis_data and analysis_data["metrics"]:
                metrics_text = json.dumps(analysis_data["metrics"], indent=2)
                metrics_doc = Document(
                    text=f"Competitive Metrics for {competitor_name}:\n{metrics_text}",
                    metadata={
                        "competitor": competitor_name,
                        "type": "metrics",
                        "timestamp": analysis_data.get("timestamp", datetime.now().isoformat()),
                        "website": analysis_data.get("website", ""),
                        "source": "metrics_extraction"
                    }
                )
                documents.append(metrics_doc)
            
            # Insert documents into index
            for doc in documents:
                self.index.insert(doc)
            
            # Persist changes
            self.index.storage_context.persist(persist_dir=str(self.persist_dir / "storage"))
            
            logger.info(f"Successfully ingested {len(documents)} documents for {competitor_name}")
            return True
            
        except Exception as e:
            logger.error(f"Failed to ingest analysis for {competitor_name}: {e}")
            return False
    
    def query_competitive_intelligence(self, query: str, competitor_filter: Optional[str] = None) -> str:
        """
        Query the competitive intelligence knowledge base with caching
        
        Args:
            query: Natural language query
            competitor_filter: Optional competitor name to filter results
            
        Returns:
            str: RAG-enhanced response
        """
        try:
            # Create cache key
            cache_key = f"{query}|{competitor_filter or 'all'}"
            
            # Check cache first
            if cache_key in self.query_cache:
                logger.info(f"RAG query cache hit: {query[:50]}...")
                return self.query_cache[cache_key]
            
            # Create query engine with optimized settings
            query_engine = self.index.as_query_engine(
                service_context=self.service_context,
                similarity_top_k=3,  # Reduced for faster responses
                response_mode="compact"
            )
            
            # Add competitor filter to query if specified
            if competitor_filter:
                enhanced_query = f"For competitor {competitor_filter}: {query}"
            else:
                enhanced_query = query
            
            # Execute query
            response = query_engine.query(enhanced_query)
            response_str = str(response)
            
            # Cache the response
            self._cache_query_response(cache_key, response_str)
            
            logger.info(f"RAG query executed and cached: {query[:50]}...")
            return response_str
            
        except Exception as e:
            logger.error(f"RAG query failed: {e}")
            return f"Query failed: {str(e)}"
    
    def _cache_query_response(self, cache_key: str, response: str):
        """Cache query response with size limit"""
        # Remove oldest entries if cache is full
        if len(self.query_cache) >= self.cache_max_size:
            # Remove the first (oldest) entry
            oldest_key = next(iter(self.query_cache))
            del self.query_cache[oldest_key]
        
        self.query_cache[cache_key] = response
    
    def get_competitor_summary(self, competitor_name: str) -> Dict[str, Any]:
        """
        Get comprehensive summary for a specific competitor
        
        Args:
            competitor_name: Name of the competitor
            
        Returns:
            Dict containing competitor summary and insights
        """
        try:
            # Query for different aspects
            queries = {
                "overview": f"What is the business model and market position of {competitor_name}?",
                "strengths": f"What are the main strengths and competitive advantages of {competitor_name}?",
                "threats": f"What competitive threats does {competitor_name} pose?",
                "recent_developments": f"What are the recent developments and news about {competitor_name}?"
            }
            
            summary = {"competitor": competitor_name, "insights": {}}
            
            for aspect, query in queries.items():
                response = self.query_competitive_intelligence(query, competitor_name)
                summary["insights"][aspect] = response
            
            return summary
            
        except Exception as e:
            logger.error(f"Failed to generate summary for {competitor_name}: {e}")
            return {"error": str(e)}
    
    def get_market_landscape(self, industry_keywords: List[str]) -> str:
        """
        Get market landscape analysis based on accumulated competitive intelligence
        
        Args:
            industry_keywords: Keywords to filter relevant competitors
            
        Returns:
            str: Market landscape analysis
        """
        try:
            keywords_str = ", ".join(industry_keywords)
            query = f"Based on competitive intelligence data, provide a market landscape analysis for companies related to: {keywords_str}. Include key players, trends, and competitive dynamics."
            
            return self.query_competitive_intelligence(query)
            
        except Exception as e:
            logger.error(f"Market landscape query failed: {e}")
            return f"Analysis failed: {str(e)}"
    
    def get_index_stats(self) -> Dict[str, Any]:
        """Get statistics about the competitive intelligence index"""
        try:
            # Get basic stats
            stats = {
                "total_documents": len(self.index.docstore.docs),
                "storage_path": str(self.persist_dir),
                "embedding_model": type(self.embed_model).__name__,
                "llm_model": type(self.llm).__name__
            }
            
            # Count documents by competitor
            competitor_counts = {}
            for doc_id, doc in self.index.docstore.docs.items():
                competitor = doc.metadata.get("competitor", "unknown")
                competitor_counts[competitor] = competitor_counts.get(competitor, 0) + 1
            
            stats["competitors"] = competitor_counts
            return stats
            
        except Exception as e:
            logger.error(f"Failed to get index stats: {e}")
            return {"error": str(e)}


# Integration helper functions for existing workflow

def enhance_research_with_rag(rag_system: CompetitiveIntelligenceRAG, 
                             competitor_name: str, 
                             research_findings: str) -> str:
    """
    Enhance research findings with historical competitive intelligence
    
    Args:
        rag_system: Initialized RAG system
        competitor_name: Name of the competitor being researched
        research_findings: Current research findings
        
    Returns:
        str: Enhanced research with historical context
    """
    try:
        # Query for historical context
        historical_query = f"What do we know about {competitor_name} from previous analyses? Provide historical context and trends."
        historical_context = rag_system.query_competitive_intelligence(historical_query, competitor_name)
        
        # Combine current findings with historical context
        enhanced_research = f"""
CURRENT RESEARCH FINDINGS:
{research_findings}

HISTORICAL CONTEXT AND TRENDS:
{historical_context}

INTEGRATED INSIGHTS:
The current research should be viewed in the context of our historical analysis. Key patterns and changes over time should be noted for strategic decision-making.
"""
        
        return enhanced_research.strip()
        
    except Exception as e:
        logger.error(f"RAG enhancement failed: {e}")
        return research_findings  # Return original if enhancement fails


def enhance_analysis_with_market_context(rag_system: CompetitiveIntelligenceRAG,
                                       competitor_name: str,
                                       strategic_analysis: str,
                                       industry_keywords: List[str]) -> str:
    """
    Enhance strategic analysis with broader market context
    
    Args:
        rag_system: Initialized RAG system
        competitor_name: Name of the competitor
        strategic_analysis: Current strategic analysis
        industry_keywords: Industry/market keywords for context
        
    Returns:
        str: Enhanced analysis with market context
    """
    try:
        # Get market landscape
        market_context = rag_system.get_market_landscape(industry_keywords)
        
        # Query for competitive benchmarking
        benchmark_query = f"How does {competitor_name} compare to other companies in our competitive intelligence database?"
        competitive_benchmark = rag_system.query_competitive_intelligence(benchmark_query)
        
        enhanced_analysis = f"""
STRATEGIC ANALYSIS:
{strategic_analysis}

MARKET LANDSCAPE CONTEXT:
{market_context}

COMPETITIVE BENCHMARKING:
{competitive_benchmark}

ENHANCED STRATEGIC INSIGHTS:
This analysis incorporates broader market trends and competitive positioning relative to other analyzed companies in our database.
"""
        
        return enhanced_analysis.strip()
        
    except Exception as e:
        logger.error(f"Market context enhancement failed: {e}")
        return strategic_analysis  # Return original if enhancement fails
