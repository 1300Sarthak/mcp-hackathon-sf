#!/usr/bin/env python3
"""
Enhanced Multi-Agent Competitive Intelligence with LlamaIndex RAG
Integration of existing Strands agents with LlamaIndex for enhanced capabilities
"""

import os
import logging
from typing import Dict, List, Any, Union, Callable, Optional
from datetime import datetime

# Import existing components
from ci_agent import MultiAgentCompetitiveIntelligence, extract_metrics_from_analysis
from llamaindex_integration import CompetitiveIntelligenceRAG, enhance_research_with_rag, enhance_analysis_with_market_context

logger = logging.getLogger(__name__)

class EnhancedMultiAgentCompetitiveIntelligence(MultiAgentCompetitiveIntelligence):
    """
    Enhanced version of MultiAgentCompetitiveIntelligence with LlamaIndex RAG capabilities
    """
    
    def __init__(self, stream_callback: Optional[Callable] = None, enable_rag: bool = True):
        """
        Initialize enhanced multi-agent system with optional RAG capabilities
        
        Args:
            stream_callback: Optional callback for streaming updates
            enable_rag: Whether to enable RAG capabilities (requires additional setup)
        """
        # Initialize parent class
        super().__init__(stream_callback)
        
        self.enable_rag = enable_rag
        self.rag_system = None
        
        if self.enable_rag:
            try:
                # Initialize RAG system
                self.rag_system = CompetitiveIntelligenceRAG()
                self._send_status_update("✅ RAG system initialized", "rag_init")
                
            except Exception as e:
                logger.warning(f"RAG system initialization failed: {e}")
                self._send_status_update(f"⚠️ RAG system disabled: {e}", "rag_warning")
                self.enable_rag = False
    
    def run_enhanced_competitive_intelligence_workflow(self, 
                                                     competitor_name: str, 
                                                     competitor_website: str = None,
                                                     industry_keywords: List[str] = None) -> Dict[str, Any]:
        """
        Enhanced competitive intelligence workflow with RAG capabilities
        
        Args:
            competitor_name: Name of the competitor to analyze
            competitor_website: Optional website URL
            industry_keywords: Optional industry keywords for market context
            
        Returns:
            Dict containing enhanced analysis results
        """
        # Check cache first (from parent class)
        from redis_cache import get_cache
        cache = get_cache()
        
        # Use RAG-enhanced cache key if RAG is enabled
        cache_key = f"{competitor_name}_{competitor_website}_rag" if self.enable_rag else f"{competitor_name}_{competitor_website}"
        cached_analysis = cache.get_analysis(competitor_name, competitor_website)
        
        if cached_analysis and not self.enable_rag:
            # If we have cached analysis but RAG is now enabled, we might want to enhance it
            self._send_status_update(f"🎯 Found cached analysis for: {competitor_name}", "cache_hit")
            return cached_analysis
        
        self._send_status_update(f"\n🚀 Starting Enhanced Multi-Agent Analysis for: {competitor_name}", "start")
        self._send_status_update("=" * 70)
        
        try:
            # Step 1: Enhanced Research Phase
            self._send_status_update("\n📊 Step 1: Enhanced Research Agent with RAG context...", "research_start")
            
            # Standard research query
            research_query = f"""Research competitive intelligence for "{competitor_name}".
            
            {'Website: ' + competitor_website if competitor_website else ''}
            
            Gather comprehensive information about:
            1. Recent company news, funding, and market developments
            2. Pricing strategy and product positioning (scrape pricing pages)
            3. Company leadership and team structure (LinkedIn data)
            4. Market position and customer feedback
            5. Financial information and growth metrics
            
            Use your tools to collect detailed, factual information from multiple sources.
            """
            
            # Execute research
            researcher_response = self.researcher_agent(research_query)
            research_findings = str(researcher_response)
            
            # Enhance with RAG if available
            if self.enable_rag and self.rag_system:
                self._send_status_update("🔍 Enhancing research with historical context...", "rag_research")
                research_findings = enhance_research_with_rag(
                    self.rag_system, 
                    competitor_name, 
                    research_findings
                )
            
            self._send_status_update("✅ Enhanced research complete", "research_complete")
            
            # Step 2: Enhanced Strategic Analysis Phase
            self._send_status_update("\n🔍 Step 2: Enhanced Analyst Agent with market context...", "analysis_start")
            
            analysis_query = f"""Analyze these enhanced competitive intelligence findings for "{competitor_name}":

            {research_findings}
            
            Provide strategic analysis including:
            1. SWOT assessment (strengths, weaknesses, opportunities, threats)
            2. Business model and revenue strategy analysis
            3. Competitive positioning and market differentiation
            4. Assessment of competitive threat level (rate 1-5)
            5. Key strategic insights for competitive response
            
            Focus on actionable insights and strategic implications.
            """
            
            # Execute analysis
            analyst_response = self.analyst_agent(analysis_query)
            strategic_analysis = str(analyst_response)
            
            # Enhance with market context if RAG is available
            if self.enable_rag and self.rag_system and industry_keywords:
                self._send_status_update("🌐 Adding market landscape context...", "rag_analysis")
                strategic_analysis = enhance_analysis_with_market_context(
                    self.rag_system,
                    competitor_name,
                    strategic_analysis,
                    industry_keywords or ["technology", "software", "saas"]
                )
            
            # Extract metrics
            extracted_metrics = extract_metrics_from_analysis(strategic_analysis)
            self._send_status_update("✅ Enhanced strategic analysis complete", "analysis_complete")
            
            # Step 3: Enhanced Report Generation
            self._send_status_update("\n📝 Step 3: Enhanced Writer Agent with comprehensive context...", "report_start")
            
            # Query RAG for additional context if available
            additional_context = ""
            if self.enable_rag and self.rag_system:
                self._send_status_update("📚 Gathering additional competitive context...", "rag_context")
                try:
                    competitor_summary = self.rag_system.get_competitor_summary(competitor_name)
                    if "insights" in competitor_summary:
                        additional_context = f"\n\nADDITIONAL COMPETITIVE CONTEXT:\n{competitor_summary['insights']}"
                except Exception as e:
                    logger.warning(f"Failed to get additional context: {e}")
            
            report_query = f"""Create a comprehensive competitive intelligence report for "{competitor_name}" based on this enhanced analysis:

            ENHANCED RESEARCH FINDINGS:
            {research_findings}
            
            ENHANCED STRATEGIC ANALYSIS:
            {strategic_analysis}
            {additional_context}
            
            Generate a professional report with:
            - Executive Summary (key findings and threat assessment)
            - Business Model Analysis
            - Competitive Positioning
            - Strategic Recommendations
            - Action Items for competitive response
            
            Focus on actionable intelligence for decision-makers.
            """
            
            final_report = self.writer_agent(report_query)
            
            self._send_status_update("\n" + "=" * 70, "complete")
            self._send_status_update("✅ Enhanced Multi-Agent Analysis Complete!", "complete")
            self._send_status_update("=" * 70)
            
            # Prepare enhanced results
            result = {
                "competitor": competitor_name,
                "website": competitor_website,
                "research_findings": research_findings,
                "strategic_analysis": strategic_analysis,
                "final_report": str(final_report),
                "metrics": extracted_metrics,
                "timestamp": datetime.now().isoformat(),
                "status": "success",
                "workflow": "enhanced_multi_agent_rag" if self.enable_rag else "enhanced_multi_agent",
                "rag_enabled": self.enable_rag,
                "industry_keywords": industry_keywords
            }
            
            # Store in RAG system for future use
            if self.enable_rag and self.rag_system:
                self._send_status_update("💾 Storing analysis in RAG system...", "rag_store")
                rag_success = self.rag_system.ingest_competitive_analysis(competitor_name, result)
                if rag_success:
                    self._send_status_update("✅ Analysis stored in knowledge base", "rag_stored")
                    result["rag_stored"] = True
            
            # Cache the enhanced analysis
            cache_success = cache.set_analysis(competitor_name, result, competitor_website)
            if cache_success:
                self._send_status_update("💾 Enhanced analysis cached", "cache_stored")
            
            return result
            
        except Exception as e:
            error_msg = str(e)
            self._send_status_update(f"\n❌ Enhanced workflow failed: {error_msg}", "error")
            
            return {
                "competitor": competitor_name,
                "website": competitor_website,
                "error": error_msg,
                "timestamp": datetime.now().isoformat(),
                "status": "error",
                "workflow": "enhanced_multi_agent_rag" if self.enable_rag else "enhanced_multi_agent",
                "rag_enabled": self.enable_rag
            }
    
    def query_knowledge_base(self, query: str, competitor_filter: Optional[str] = None) -> Dict[str, Any]:
        """
        Query the competitive intelligence knowledge base
        
        Args:
            query: Natural language query
            competitor_filter: Optional competitor name filter
            
        Returns:
            Dict containing query results
        """
        if not self.enable_rag or not self.rag_system:
            return {
                "error": "RAG system not available",
                "status": "disabled"
            }
        
        try:
            response = self.rag_system.query_competitive_intelligence(query, competitor_filter)
            return {
                "query": query,
                "competitor_filter": competitor_filter,
                "response": response,
                "timestamp": datetime.now().isoformat(),
                "status": "success"
            }
            
        except Exception as e:
            return {
                "query": query,
                "error": str(e),
                "timestamp": datetime.now().isoformat(),
                "status": "error"
            }
    
    def get_market_analysis(self, industry_keywords: List[str]) -> Dict[str, Any]:
        """
        Get market landscape analysis from accumulated competitive intelligence
        
        Args:
            industry_keywords: Industry keywords for filtering
            
        Returns:
            Dict containing market analysis
        """
        if not self.enable_rag or not self.rag_system:
            return {
                "error": "RAG system not available",
                "status": "disabled"
            }
        
        try:
            analysis = self.rag_system.get_market_landscape(industry_keywords)
            stats = self.rag_system.get_index_stats()
            
            return {
                "industry_keywords": industry_keywords,
                "market_analysis": analysis,
                "knowledge_base_stats": stats,
                "timestamp": datetime.now().isoformat(),
                "status": "success"
            }
            
        except Exception as e:
            return {
                "industry_keywords": industry_keywords,
                "error": str(e),
                "timestamp": datetime.now().isoformat(),
                "status": "error"
            }
    
    def get_rag_stats(self) -> Dict[str, Any]:
        """Get RAG system statistics"""
        if not self.enable_rag or not self.rag_system:
            return {
                "rag_enabled": False,
                "status": "disabled"
            }
        
        try:
            stats = self.rag_system.get_index_stats()
            stats["rag_enabled"] = True
            stats["status"] = "active"
            return stats
            
        except Exception as e:
            return {
                "rag_enabled": True,
                "status": "error",
                "error": str(e)
            }


def main():
    """Demo function for enhanced multi-agent workflow"""
    print("🚀 Enhanced Multi-Agent Competitive Intelligence with RAG")
    print("   Strands Agents + Bright Data + Gemini + LlamaIndex")
    print("=" * 80)
    
    try:
        print("\n🔧 Initializing enhanced multi-agent workflow...")
        intelligence_system = EnhancedMultiAgentCompetitiveIntelligence(enable_rag=True)
        
    except Exception as e:
        print(f"\n❌ Initialization failed: {e}")
        return
    
    # Demo scenarios with industry keywords
    demo_scenarios = [
        {
            "name": "Notion", 
            "website": "https://notion.so",
            "description": "All-in-one workspace",
            "keywords": ["productivity", "collaboration", "workspace", "saas"]
        },
        {
            "name": "Figma", 
            "website": "https://figma.com",
            "description": "Collaborative design",
            "keywords": ["design", "collaboration", "ui", "saas"]
        },
        {
            "name": "Slack", 
            "website": "https://slack.com",
            "description": "Team communication",
            "keywords": ["communication", "collaboration", "enterprise", "saas"]
        }
    ]
    
    print("\nEnhanced Demo Scenarios (Multi-Agent + RAG):")
    for i, scenario in enumerate(demo_scenarios, 1):
        print(f"{i}. {scenario['name']} - {scenario['description']}")
    
    print("\nOptions:")
    print("- Enter 1-3 to run enhanced analysis")
    print("- Enter 'query [your question]' to search knowledge base")
    print("- Enter 'market [keywords]' for market analysis")
    print("- Enter 'stats' for RAG system statistics")
    print("- Enter 'quit' to exit")
    
    while True:
        try:
            user_input = input("\n> ").strip()
            
            if user_input.lower() in ['quit', 'exit', 'q']:
                break
            
            elif user_input.startswith('query '):
                query = user_input[6:].strip()
                result = intelligence_system.query_knowledge_base(query)
                if result["status"] == "success":
                    print(f"\n🔍 Query Results:\n{result['response']}")
                else:
                    print(f"\n❌ Query failed: {result.get('error', 'Unknown error')}")
            
            elif user_input.startswith('market '):
                keywords = user_input[7:].strip().split()
                result = intelligence_system.get_market_analysis(keywords)
                if result["status"] == "success":
                    print(f"\n🌐 Market Analysis:\n{result['market_analysis']}")
                    print(f"\nKnowledge Base Stats: {result['knowledge_base_stats']}")
                else:
                    print(f"\n❌ Market analysis failed: {result.get('error', 'Unknown error')}")
            
            elif user_input == 'stats':
                stats = intelligence_system.get_rag_stats()
                print(f"\n📊 RAG System Statistics:")
                for key, value in stats.items():
                    print(f"  {key}: {value}")
            
            elif user_input in ['1', '2', '3']:
                scenario = demo_scenarios[int(user_input) - 1]
                result = intelligence_system.run_enhanced_competitive_intelligence_workflow(
                    scenario['name'],
                    scenario['website'],
                    scenario['keywords']
                )
                
                if result["status"] == "success":
                    print(f"\n🚀 Enhanced Analysis Complete for {result['competitor']}")
                    print(f"Workflow: {result['workflow']}")
                    print(f"RAG Enabled: {result['rag_enabled']}")
                    
                    final_report = result.get('final_report', '')
                    if final_report and len(final_report) > 300:
                        print(f"\n📝 Enhanced Report Preview:\n{final_report[:500]}...")
                    elif final_report:
                        print(f"\n📝 Enhanced Report:\n{final_report}")
                else:
                    print(f"\n❌ Enhanced analysis failed: {result.get('error', 'Unknown error')}")
            
            else:
                print("Invalid option. Try again or type 'quit' to exit.")
                
        except KeyboardInterrupt:
            print("\n\n👋 Demo interrupted by user")
            break
        except Exception as e:
            print(f"\n⚠️  Unexpected error: {e}")
    
    print("\n👋 Enhanced demo completed!")


if __name__ == "__main__":
    main()
