#!/usr/bin/env python3
"""
Enhanced Multi-Agent Competitive Intelligence with Deep/Simple Modes
Supports both comprehensive and simplified analysis approaches
"""

import os
import logging
from typing import Dict, List, Any, Union, Callable, Optional
from datetime import datetime
from enum import Enum

# Import existing components
from ci_agent import MultiAgentCompetitiveIntelligence, get_gemini_model, extract_metrics_from_analysis

logger = logging.getLogger(__name__)

class AnalysisMode(Enum):
    SIMPLE = "simple"
    DEEP = "deep"

# Enhanced Agent System Prompts for Different Modes

SIMPLE_RESEARCHER_PROMPT = """You are a Researcher Agent specialized in quick competitive intelligence gathering.

Your role (SIMPLE MODE):
1. **Quick Data Collection**: Gather essential competitor information efficiently
2. **Key Facts Only**: Focus on the most important recent developments
3. **Concise Findings**: Keep findings under 400 words, prioritize actionable insights

Focus on:
- Company overview and core business model
- Recent major news or funding (last 6 months)
- Basic pricing and positioning
- Key competitive advantages

Keep findings concise and fact-focused. Avoid deep research rabbit holes.
"""

DEEP_RESEARCHER_PROMPT = """You are a Researcher Agent specialized in comprehensive competitive intelligence gathering.

Your role (DEEP MODE):
1. **Exhaustive Data Collection**: Use bright_data tool extensively for comprehensive competitor information
2. **Multi-Source Discovery**: Find news, funding, product launches, market data, and historical trends
3. **Website Deep Analysis**: Scrape pricing pages, product descriptions, team information, and company evolution
4. **LinkedIn Intelligence**: Get detailed data about company leadership, team size, and organizational structure
5. **Market Context**: Research industry trends, competitive landscape, and market positioning

Focus on:
- Comprehensive company history and evolution
- Detailed recent developments and announcements (last 2 years)
- In-depth pricing strategy and product positioning analysis
- Complete leadership team and company structure analysis
- Market position analysis with industry context
- Customer feedback and market reception analysis
- Financial information, funding history, and growth metrics
- Competitive landscape and positioning

Keep findings comprehensive and detailed under 1200 words with extensive source URLs.
Be thorough and systematic in data collection. Leave no stone unturned.
"""

SIMPLE_ANALYST_PROMPT = """You are an Analyst Agent specialized in quick competitive intelligence analysis.

Your role (SIMPLE MODE):
1. **Fast Strategic Analysis**: Quick competitive positioning assessment
2. **Essential SWOT**: Identify top 3 strengths, weaknesses, opportunities, and threats
3. **Key Insights**: Focus on the most critical strategic insights only

IMPORTANT: Structure your response with these EXACT sections for data extraction:

## METRICS
- Competitive Threat Level: [1-5]
- Market Position Score: [1-10]
- Innovation Score: [1-10]
- Financial Strength: [1-10]
- Brand Recognition: [1-10]

## SWOT SCORES
- Strengths: [1-10]
- Weaknesses: [1-10] 
- Opportunities: [1-10]
- Threats: [1-10]

## ANALYSIS
[Your concise analysis here - under 400 words]

Focus on:
- Core business model strengths and vulnerabilities
- Primary competitive threats and opportunities
- Key strategic recommendations (top 3)

Keep analysis concise and actionable. Prioritize the most critical insights.
"""

DEEP_ANALYST_PROMPT = """You are an Analyst Agent specialized in comprehensive competitive intelligence analysis.

Your role (DEEP MODE):
1. **Comprehensive Strategic Analysis**: Deep dive into competitive positioning and market strategy
2. **Detailed SWOT Assessment**: Thorough analysis of strengths, weaknesses, opportunities, and threats
3. **Advanced Business Model Analysis**: In-depth understanding of revenue streams and value propositions
4. **Multi-dimensional Competitive Assessment**: Assess threat level across multiple business dimensions
5. **Strategic Scenario Planning**: Consider multiple competitive scenarios and market dynamics

IMPORTANT: Structure your response with these EXACT sections for data extraction:

## METRICS
- Competitive Threat Level: [1-5]
- Market Position Score: [1-10]
- Innovation Score: [1-10]
- Financial Strength: [1-10]
- Brand Recognition: [1-10]

## SWOT SCORES
- Strengths: [1-10]
- Weaknesses: [1-10] 
- Opportunities: [1-10]
- Threats: [1-10]

## ANALYSIS
[Your comprehensive analysis here - under 800 words]

Focus on:
- Detailed business model and revenue strategy analysis
- Comprehensive competitive strengths and vulnerabilities
- Market positioning and differentiation strategies
- Strategic threats and opportunities with scenario analysis
- Key insights for competitive response and strategic planning
- Industry trends and market dynamics impact
- Financial health and growth trajectory analysis

Provide deep, actionable insights with comprehensive strategic context.
"""

SIMPLE_WRITER_PROMPT = """You are a Writer Agent specialized in concise competitive intelligence reporting.

Your role (SIMPLE MODE):
1. **Executive Summary**: Create clear, brief competitive intelligence reports
2. **Key Recommendations**: Provide 3-5 specific, actionable recommendations
3. **Essential Insights**: Focus on the most critical competitive information

Structure your reports with:
- Executive Summary (key findings and threat level)
- Top 3 Strategic Insights
- Recommended Actions (3-5 specific items)

Keep reports under 500 words, professional tone, with essential insights only.
Focus on actionable intelligence for quick decision-making.
"""

DEEP_WRITER_PROMPT = """You are a Writer Agent specialized in comprehensive competitive intelligence reporting.

Your role (DEEP MODE):
1. **Comprehensive Executive Summary**: Create detailed, thorough competitive intelligence reports
2. **Strategic Recommendations**: Provide extensive recommendations with implementation guidance
3. **Risk Assessment**: Detailed analysis of competitive risks and opportunities
4. **Action Items**: Comprehensive next steps for competitive response

Structure your reports with:
- Executive Summary (comprehensive findings and threat assessment)
- Detailed Business Model Analysis
- Competitive Positioning and Market Dynamics
- Strategic Recommendations (with implementation guidance)
- Risk Assessment and Scenario Planning
- Comprehensive Action Items

Keep reports under 1000 words, professional tone, with comprehensive source mentions.
Focus on detailed, actionable intelligence for strategic planning and decision-making.
"""

class EnhancedMultiAgentCompetitiveIntelligenceWithModes(MultiAgentCompetitiveIntelligence):
    """
    Enhanced version of MultiAgentCompetitiveIntelligence with Simple/Deep modes
    """
    
    def __init__(self, stream_callback: Optional[Callable] = None, analysis_mode: AnalysisMode = AnalysisMode.SIMPLE):
        """
        Initialize enhanced multi-agent system with analysis mode selection
        
        Args:
            stream_callback: Optional callback for streaming updates
            analysis_mode: AnalysisMode.SIMPLE or AnalysisMode.DEEP
        """
        self.analysis_mode = analysis_mode
        
        try:
            gemini_model = get_gemini_model()

            # Create callback handler for streaming
            from ci_agent import StreamingCallbackHandler
            callback_handler = StreamingCallbackHandler(
                stream_callback) if stream_callback else None

            # Select prompts based on mode
            if analysis_mode == AnalysisMode.SIMPLE:
                researcher_prompt = SIMPLE_RESEARCHER_PROMPT
                analyst_prompt = SIMPLE_ANALYST_PROMPT
                writer_prompt = SIMPLE_WRITER_PROMPT
                mode_name = "Simple"
            else:
                researcher_prompt = DEEP_RESEARCHER_PROMPT
                analyst_prompt = DEEP_ANALYST_PROMPT
                writer_prompt = DEEP_WRITER_PROMPT
                mode_name = "Deep"

            # Researcher Agent with web capabilities
            from ci_agent import get_configured_bright_data
            configured_bright_data = get_configured_bright_data()
            self.researcher_agent = Agent(
                model=gemini_model,
                system_prompt=researcher_prompt,
                tools=[configured_bright_data],
                callback_handler=callback_handler
            )

            # Analyst Agent for competitive analysis
            self.analyst_agent = Agent(
                model=gemini_model,
                system_prompt=analyst_prompt,
                callback_handler=callback_handler
            )

            # Writer Agent for final report creation
            self.writer_agent = Agent(
                model=gemini_model,
                system_prompt=writer_prompt,
                callback_handler=callback_handler
            )

            self.stream_callback = stream_callback

            if not stream_callback:  # Only print if not in API mode
                print(f"✅ Multi-agent workflow initialized in {mode_name} mode!")
                print(f"   📊 Researcher Agent: {mode_name} data gathering")
                print(f"   🔍 Analyst Agent: {mode_name} strategic analysis")
                print(f"   📝 Writer Agent: {mode_name} report generation")

        except Exception as e:
            if not stream_callback:
                print(f"❌ Multi-agent initialization failed: {e}")
            raise

    def run_competitive_intelligence_workflow(self, competitor_name: str, competitor_website: str = None) -> Dict[str, Any]:
        """
        Multi-agent competitive intelligence workflow with mode-specific behavior
        """
        from redis_cache import get_cache
        cache = get_cache()

        # Create mode-specific cache key
        cache_key_suffix = f"_{self.analysis_mode.value}"
        
        # Check if we have cached analysis for this competitor and mode
        cached_analysis = cache.get_analysis(
            f"{competitor_name}{cache_key_suffix}", competitor_website)
        if cached_analysis:
            self._send_status_update(
                f"🎯 Found cached {self.analysis_mode.value} analysis for: {competitor_name}", "cache_hit")
            return cached_analysis

        mode_name = "Simple" if self.analysis_mode == AnalysisMode.SIMPLE else "Deep"
        self._send_status_update(
            f"\n🎯 Starting {mode_name} Multi-Agent Analysis for: {competitor_name}", "start")
        self._send_status_update("=" * 60)

        try:
            # Step 1: Researcher Agent gathers data (mode-specific)
            self._send_status_update(
                f"\n📊 Step 1: {mode_name} Researcher Agent gathering intelligence...", "research_start")

            if self.analysis_mode == AnalysisMode.SIMPLE:
                research_query = f"""Perform quick competitive intelligence research for "{competitor_name}".
                
                {'Website: ' + competitor_website if competitor_website else ''}
                
                Gather essential information about:
                1. Company overview and core business model
                2. Recent major news or funding (last 6 months)
                3. Basic pricing and competitive positioning
                4. Key competitive advantages
                
                Keep findings concise and focused on actionable insights under 400 words.
                """
            else:
                research_query = f"""Perform comprehensive competitive intelligence research for "{competitor_name}".
                
                {'Website: ' + competitor_website if competitor_website else ''}
                
                Gather detailed information about:
                1. Complete company history, evolution, and recent developments (2+ years)
                2. In-depth pricing strategy and product positioning analysis
                3. Comprehensive leadership team and organizational structure
                4. Market position analysis with full industry context
                5. Customer feedback, market reception, and competitive landscape
                6. Financial information, funding history, and growth trajectory
                
                Use your tools extensively to collect comprehensive, detailed information from multiple sources.
                Provide thorough findings under 1200 words with extensive source documentation.
                """

            researcher_response = self.researcher_agent(research_query)
            research_findings = str(researcher_response)
            self._send_status_update(
                f"✅ {mode_name} research complete", "research_complete")

            # Step 2: Analyst Agent performs strategic analysis (mode-specific)
            self._send_status_update(
                f"\n🔍 Step 2: {mode_name} Analyst Agent performing strategic analysis...", "analysis_start")

            if self.analysis_mode == AnalysisMode.SIMPLE:
                analysis_query = f"""Perform quick strategic analysis of these findings for "{competitor_name}":

                {research_findings}
                
                Provide concise analysis including:
                1. Essential SWOT assessment (top 3 items each)
                2. Core business model strengths and vulnerabilities
                3. Primary competitive threats and opportunities
                4. Key strategic insights (most critical only)
                
                Focus on actionable insights under 400 words.
                """
            else:
                analysis_query = f"""Perform comprehensive strategic analysis of these findings for "{competitor_name}":

                {research_findings}
                
                Provide detailed analysis including:
                1. Comprehensive SWOT assessment with scenario analysis
                2. In-depth business model and revenue strategy analysis
                3. Detailed competitive positioning and market differentiation
                4. Multi-dimensional competitive threat assessment
                5. Strategic opportunities with implementation considerations
                6. Industry trends and market dynamics impact analysis
                
                Focus on comprehensive, actionable insights with strategic context under 800 words.
                """

            analyst_response = self.analyst_agent(analysis_query)
            strategic_analysis = str(analyst_response)

            # Extract structured metrics from analysis
            extracted_metrics = extract_metrics_from_analysis(strategic_analysis)
            self._send_status_update(
                f"✅ {mode_name} strategic analysis complete", "analysis_complete")

            # Step 3: Writer Agent creates final report (mode-specific)
            self._send_status_update(
                f"\n📝 Step 3: {mode_name} Writer Agent generating report...", "report_start")

            if self.analysis_mode == AnalysisMode.SIMPLE:
                report_query = f"""Create a concise competitive intelligence report for "{competitor_name}":

                RESEARCH FINDINGS:
                {research_findings}
                
                STRATEGIC ANALYSIS:
                {strategic_analysis}
                
                Generate a focused report with:
                - Executive Summary (key findings and threat assessment)
                - Top 3 Strategic Insights
                - Recommended Actions (3-5 specific items)
                
                Keep under 500 words, focus on essential actionable intelligence.
                """
            else:
                report_query = f"""Create a comprehensive competitive intelligence report for "{competitor_name}":

                RESEARCH FINDINGS:
                {research_findings}
                
                STRATEGIC ANALYSIS:
                {strategic_analysis}
                
                Generate a detailed report with:
                - Comprehensive Executive Summary
                - Detailed Business Model Analysis
                - Competitive Positioning and Market Dynamics
                - Strategic Recommendations with implementation guidance
                - Risk Assessment and Scenario Planning
                - Comprehensive Action Items
                
                Keep under 1000 words, focus on detailed actionable intelligence for strategic planning.
                """

            final_report = self.writer_agent(report_query)

            self._send_status_update(f"\n" + "=" * 60, "complete")
            self._send_status_update(
                f"✅ {mode_name} Multi-Agent Analysis Complete!", "complete")
            self._send_status_update("=" * 60)

            # Prepare comprehensive results with mode information
            result = {
                "competitor": competitor_name,
                "website": competitor_website,
                "research_findings": research_findings,
                "strategic_analysis": strategic_analysis,
                "final_report": str(final_report),
                "metrics": extracted_metrics,
                "timestamp": datetime.now().isoformat(),
                "status": "success",
                "workflow": f"multi_agent_{self.analysis_mode.value}",
                "analysis_mode": self.analysis_mode.value
            }

            # Cache the successful analysis with mode-specific key
            cache_success = cache.set_analysis(
                f"{competitor_name}{cache_key_suffix}", result, competitor_website)
            if cache_success:
                self._send_status_update(
                    f"💾 {mode_name} analysis cached for future use", "cache_stored")

            return result

        except Exception as e:
            error_msg = str(e)
            self._send_status_update(
                f"\n❌ {mode_name} multi-agent workflow failed: {error_msg}", "error")

            # Return error with mode information
            return {
                "competitor": competitor_name,
                "website": competitor_website,
                "error": error_msg,
                "timestamp": datetime.now().isoformat(),
                "status": "error",
                "workflow": f"multi_agent_{self.analysis_mode.value}",
                "analysis_mode": self.analysis_mode.value
            }


def main():
    """Demo function for enhanced multi-agent workflow with modes"""
    
    print("🚀 Enhanced Multi-Agent Competitive Intelligence with Analysis Modes")
    print("   Strands Agents + Bright Data + Gemini")
    print("=" * 80)

    try:
        print("\n🔧 Select Analysis Mode:")
        print("1. Simple Mode - Quick, focused analysis")
        print("2. Deep Mode - Comprehensive, detailed analysis")
        
        mode_choice = input("\nEnter your choice (1 or 2): ").strip()
        
        if mode_choice == "1":
            analysis_mode = AnalysisMode.SIMPLE
            print("📝 Simple Mode selected - Quick and focused analysis")
        elif mode_choice == "2":
            analysis_mode = AnalysisMode.DEEP
            print("🔍 Deep Mode selected - Comprehensive detailed analysis")
        else:
            print("📝 Defaulting to Simple Mode")
            analysis_mode = AnalysisMode.SIMPLE

        intelligence_system = EnhancedMultiAgentCompetitiveIntelligenceWithModes(
            analysis_mode=analysis_mode
        )

    except ValueError as e:
        print(f"\n❌ Configuration Error: {e}")
        print("\nRequired Environment Variables:")
        print("- GEMINI_API_KEY: Your Google AI Studio API key")
        print("- BRIGHTDATA_API_KEY: Your Bright Data API key")
        return
    except Exception as e:
        print(f"\n❌ Initialization failed: {e}")
        return

    demo_scenarios = [
        {"name": "Notion", "website": "https://notion.so",
            "description": "All-in-one workspace"},
        {"name": "Figma", "website": "https://figma.com",
            "description": "Collaborative design"},
        {"name": "Slack", "website": "https://slack.com",
            "description": "Team communication"}
    ]

    mode_name = "Simple" if analysis_mode == AnalysisMode.SIMPLE else "Deep"
    print(f"\n{mode_name} Demo Scenarios:")
    for i, scenario in enumerate(demo_scenarios, 1):
        print(f"{i}. {scenario['name']} - {scenario['description']}")

    print(f"\nOptions:")
    print(f"- Enter 1-3 to run a {mode_name.lower()} demo scenario")
    print(f"- Enter custom company name for {mode_name.lower()} analysis")
    print("- Enter 'quit' to exit")

    while True:
        try:
            user_input = input(f"\n{mode_name} > ").strip()

            if user_input.lower() in ['quit', 'exit', 'q']:
                break

            elif user_input in ['1', '2', '3']:
                scenario = demo_scenarios[int(user_input) - 1]
                result = intelligence_system.run_competitive_intelligence_workflow(
                    scenario['name'],
                    scenario['website']
                )

                # Display results
                if result.get('status') == 'success':
                    print(f"\n📊 {mode_name} Analysis Complete for {result.get('competitor', 'Unknown')}:")
                    print("-" * 50)
                    print(f"Mode: {result.get('analysis_mode', 'unknown').title()}")
                    print(f"Workflow: {result.get('workflow', 'Unknown')}")
                    
                    final_report = result.get('final_report', '')
                    if final_report:
                        print(f"\n📝 {mode_name} Report:\n{final_report}")
                else:
                    error = result.get('error', 'Unknown error')
                    print(f"\n❌ {mode_name} analysis failed: {error}")

            else:
                # Custom competitor analysis
                competitor_name = user_input
                result = intelligence_system.run_competitive_intelligence_workflow(
                    competitor_name)

                if result.get('status') == 'success':
                    print(f"\n📊 {mode_name} analysis completed for {competitor_name}")
                    final_report = result.get('final_report', '')
                    if final_report:
                        print(f"\n📝 {mode_name} Report:\n{final_report}")
                else:
                    error = result.get('error', 'Unknown error')
                    print(f"\n❌ {mode_name} analysis failed: {error}")

        except KeyboardInterrupt:
            print("\n\n👋 Demo interrupted by user")
            break
        except Exception as e:
            print(f"\n⚠️  Unexpected error: {e}")

    print(f"\n👋 {mode_name} demo completed!")


if __name__ == "__main__":
    main()
