#!/usr/bin/env python3
"""
Multi-Agent Competitive Intelligence Analyzer
Strands Agents + Bright Data + Gemini with Multi-Agent Workflow
"""

import os
import logging
import json
from typing import Dict, List, Any, Union, Callable, Optional
from strands import Agent
from strands.models.litellm import LiteLLMModel
from strands_tools import bright_data
import functools
import asyncio
from datetime import datetime
from dotenv import load_dotenv
from redis_cache import get_cache

# Load environment variables from .env if present
load_dotenv()

# Configure logging
logging.getLogger("strands").setLevel(logging.INFO)  # Reduced debug noise
logging.basicConfig(
    format="%(levelname)s | %(name)s | %(message)s",
    handlers=[logging.StreamHandler()]
)


def get_gemini_model():
    """Configure Gemini model using LiteLLM"""

    gemini_api_key = os.getenv("GEMINI_API_KEY")
    gemini_model_name = os.getenv("GEMINI_MODEL_NAME", "gemini-2.0-flash")

    if not gemini_api_key:
        raise ValueError("GEMINI_API_KEY not found in environment variables")

    print(f"🔧 Configuring Gemini Model: {gemini_model_name}")

    model = LiteLLMModel(
        client_args={"api_key": gemini_api_key},
        model_id=f"gemini/{gemini_model_name}",
        params={"max_tokens": 4000, "temperature": 0.3}
    )

    return model


def get_configured_bright_data():
    """Configure Bright Data tool with proper zone settings"""

    # Set environment variables for Bright Data if they're missing
    if not os.getenv("BRIGHTDATA_ZONE"):
        os.environ["BRIGHTDATA_ZONE"] = "datacenter"

    if not os.getenv("BRIGHTDATA_USERNAME") and os.getenv("BRIGHTDATA_API_KEY"):
        # For API key auth, username can be set to a default
        os.environ["BRIGHTDATA_USERNAME"] = "api_user"

    return bright_data


def extract_metrics_from_analysis(analysis_text: str) -> Dict[str, Any]:
    """Extract structured metrics from AI analysis text"""
    import re

    metrics = {
        "competitive_metrics": {},
        "swot_scores": {},
        "raw_analysis": analysis_text
    }

    try:
        # Extract competitive metrics
        threat_match = re.search(
            r'Competitive Threat Level:\s*(\d+)', analysis_text)
        if threat_match:
            metrics["competitive_metrics"]["threat_level"] = int(
                threat_match.group(1))

        market_match = re.search(
            r'Market Position Score:\s*(\d+)', analysis_text)
        if market_match:
            metrics["competitive_metrics"]["market_position"] = int(
                market_match.group(1))

        innovation_match = re.search(
            r'Innovation Score:\s*(\d+)', analysis_text)
        if innovation_match:
            metrics["competitive_metrics"]["innovation"] = int(
                innovation_match.group(1))

        financial_match = re.search(
            r'Financial Strength:\s*(\d+)', analysis_text)
        if financial_match:
            metrics["competitive_metrics"]["financial_strength"] = int(
                financial_match.group(1))

        brand_match = re.search(r'Brand Recognition:\s*(\d+)', analysis_text)
        if brand_match:
            metrics["competitive_metrics"]["brand_recognition"] = int(
                brand_match.group(1))

        # Extract SWOT scores
        strengths_match = re.search(r'Strengths:\s*(\d+)', analysis_text)
        if strengths_match:
            metrics["swot_scores"]["strengths"] = int(strengths_match.group(1))

        weaknesses_match = re.search(r'Weaknesses:\s*(\d+)', analysis_text)
        if weaknesses_match:
            metrics["swot_scores"]["weaknesses"] = int(
                weaknesses_match.group(1))

        opportunities_match = re.search(
            r'Opportunities:\s*(\d+)', analysis_text)
        if opportunities_match:
            metrics["swot_scores"]["opportunities"] = int(
                opportunities_match.group(1))

        threats_match = re.search(r'Threats:\s*(\d+)', analysis_text)
        if threats_match:
            metrics["swot_scores"]["threats"] = int(threats_match.group(1))

    except Exception as e:
        print(f"⚠️ Metrics extraction failed: {e}")

    return metrics


# Agent System Prompts
def get_researcher_prompt(niche: str = "all") -> str:
    """Get niche-specific researcher prompt"""
    base_prompt = """You are a Researcher Agent specialized in competitive intelligence data gathering.

Your role:
1. **Data Collection**: Use bright_data tool to gather comprehensive competitor information
2. **Source Discovery**: Find recent news, funding announcements, product launches, and market data
3. **Website Analysis**: Scrape pricing pages, product descriptions, and company information
4. **LinkedIn Intelligence**: Get structured data about company leadership and team size"""

    niche_specific_focus = {
        "all": """
Focus on:
- Recent company developments and announcements
- Pricing strategy and product positioning
- Leadership team and company structure
- Market position and customer feedback
- Financial information (funding, revenue estimates)
- Technology stack and infrastructure
- Sales and marketing strategies
- Product development and innovation""",

        "it": """
Focus specifically on IT & Technology aspects:
- Technology stack, infrastructure, and architecture
- Software development practices and methodologies
- IT security measures and compliance
- Cloud platforms and hosting solutions
- API integrations and technical partnerships
- Developer tools and documentation
- Technical team size and expertise
- Open source contributions and technical blog posts""",

        "sales": """
Focus specifically on Sales & Business Development:
- Sales methodology and process
- Pricing models and revenue streams
- Sales team structure and compensation
- Customer acquisition costs and metrics
- Sales tools and CRM systems
- Partnership and channel strategies
- Sales collateral and presentations
- Win/loss analysis and competitive positioning""",

        "marketing": """
Focus specifically on Marketing & Growth:
- Marketing channels and campaign strategies
- Content marketing and SEO approach
- Social media presence and engagement
- Brand positioning and messaging
- Customer acquisition funnels
- Marketing automation tools
- Event marketing and sponsorships
- Influencer and partnership marketing""",

        "finance": """
Focus specifically on Finance & Operations:
- Revenue models and financial performance
- Funding history and investor relations
- Operational efficiency and cost structure
- Financial reporting and transparency
- Procurement and vendor management
- Risk management and compliance
- Budgeting and resource allocation
- Financial partnerships and integrations""",

        "product": """
Focus specifically on Product & Engineering:
- Product roadmap and development cycle
- Feature development and user feedback
- Engineering practices and team structure
- Product-market fit and user adoption
- Technical architecture and scalability
- User experience and design philosophy
- Product analytics and metrics
- Innovation and R&D investments""",

        "hr": """
Focus specifically on HR & People Operations:
- Company culture and values
- Hiring practices and talent acquisition
- Employee benefits and compensation
- Remote work and office policies
- Training and development programs
- Diversity, equity, and inclusion initiatives
- Employee retention and satisfaction
- Organizational structure and management style"""
    }

    focus_section = niche_specific_focus.get(
        niche, niche_specific_focus["all"])

    return f"""{base_prompt}

{focus_section}

Keep findings under 800 words and include source URLs.
Be thorough and systematic in data collection.
"""


# Maintain backward compatibility
RESEARCHER_PROMPT = get_researcher_prompt("all")

ANALYST_PROMPT = """You are an Analyst Agent specialized in competitive intelligence analysis.

Your role:
1. **Strategic Analysis**: Analyze competitive positioning and market strategy
2. **SWOT Assessment**: Identify strengths, weaknesses, opportunities, and threats
3. **Business Model Analysis**: Understand revenue streams and value propositions
4. **Competitive Threats**: Assess level of competitive threat and market overlap

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
[Your detailed analysis here]

Focus on:
- Business model and revenue strategy analysis
- Competitive strengths and vulnerabilities
- Market positioning and differentiation
- Strategic threats and opportunities
- Key insights for competitive response

Keep analysis under 600 words with clear, actionable insights.
"""

WRITER_PROMPT = """You are a Writer Agent specialized in competitive intelligence reporting.

Your role:
1. **Executive Summary**: Create clear, actionable competitive intelligence reports
2. **Strategic Recommendations**: Provide specific recommendations based on analysis
3. **Risk Assessment**: Highlight key competitive risks and opportunities
4. **Action Items**: Suggest concrete next steps for competitive response

Structure your reports with:
- Executive Summary (key findings and threat level)
- Business Model Analysis
- Competitive Positioning
- Strategic Recommendations
- Action Items

Keep reports under 700 words, professional tone, with brief source mentions.
Focus on actionable intelligence for decision-makers.
"""


class StreamingCallbackHandler:
    """Callback handler for streaming tool calls and responses"""

    def __init__(self, stream_callback: Optional[Callable] = None):
        self.stream_callback = stream_callback

    def __call__(self, **kwargs):
        """Handle streaming callbacks"""
        if self.stream_callback:
            try:
                # Create streaming event with safe serialization
                event = {
                    "timestamp": datetime.now().isoformat(),
                    "type": "tool_call",
                }

                # Safely extract tool information
                if "current_tool_use" in kwargs:
                    tool = kwargs.get("current_tool_use", {})
                    if isinstance(tool, dict):
                        event["tool_name"] = tool.get("name", "unknown")
                        # Safely serialize tool input
                        tool_input = tool.get("input", {})
                        if isinstance(tool_input, (dict, list, str, int, float, bool, type(None))):
                            event["tool_input"] = tool_input
                        else:
                            event["tool_input"] = str(tool_input)
                    elif isinstance(tool, str):
                        event["tool_name"] = tool
                        event["tool_input"] = {}
                    else:
                        event["tool_name"] = str(tool)
                        event["tool_input"] = {}

                # Add safe data - only include serializable items
                safe_data = {}
                for key, value in kwargs.items():
                    if key == "current_tool_use":
                        continue  # Already handled above

                    # Only include JSON serializable data
                    if isinstance(value, (dict, list, str, int, float, bool, type(None))):
                        try:
                            json.dumps(value)  # Test if it's JSON serializable
                            safe_data[key] = value
                        except (TypeError, ValueError):
                            safe_data[key] = str(value)
                    else:
                        safe_data[key] = str(value)

                if safe_data:
                    event["data"] = safe_data

                # Send to stream callback
                self.stream_callback(event)

            except Exception as e:
                # Fallback event if something goes wrong
                error_event = {
                    "timestamp": datetime.now().isoformat(),
                    "type": "tool_call",
                    "tool_name": "unknown",
                    "error": f"Callback error: {str(e)}"
                }
                self.stream_callback(error_event)


class MultiAgentCompetitiveIntelligence:
    """Multi-Agent Competitive Intelligence Workflow"""

    def __init__(self, stream_callback: Optional[Callable] = None):
        """Initialize specialized agents with enhanced error handling and streaming"""
        try:
            gemini_model = get_gemini_model()

            # Create callback handler for streaming
            callback_handler = StreamingCallbackHandler(
                stream_callback) if stream_callback else None

            # Researcher Agent with web capabilities
            configured_bright_data = get_configured_bright_data()
            self.researcher_agent = Agent(
                model=gemini_model,
                system_prompt=RESEARCHER_PROMPT,  # Will be updated dynamically in workflow
                tools=[configured_bright_data],
                callback_handler=callback_handler
            )

            # Analyst Agent for competitive analysis
            self.analyst_agent = Agent(
                model=gemini_model,
                system_prompt=ANALYST_PROMPT,
                callback_handler=callback_handler
            )

            # Writer Agent for final report creation
            self.writer_agent = Agent(
                model=gemini_model,
                system_prompt=WRITER_PROMPT,
                callback_handler=callback_handler
            )

            self.stream_callback = stream_callback

            if not stream_callback:  # Only print if not in API mode
                print("✅ Multi-agent workflow initialized successfully!")
                print("   📊 Researcher Agent: Data gathering and web scraping")
                print("   🔍 Analyst Agent: Strategic analysis and threat assessment")
                print("   📝 Writer Agent: Report generation and recommendations")

        except Exception as e:
            if not stream_callback:
                print(f"❌ Multi-agent initialization failed: {e}")
            raise

    def _send_status_update(self, message: str, step: str = "info"):
        """Send status update through stream if available"""
        if self.stream_callback:
            event = {
                "timestamp": datetime.now().isoformat(),
                "type": "status_update",
                "step": step,
                "message": message
            }
            self.stream_callback(event)
        else:
            print(message)

    def run_competitive_intelligence_workflow(self, competitor_name: str, competitor_website: str = None, niche: str = "all") -> Dict[str, Any]:
        """
        Multi-agent competitive intelligence workflow with Redis caching
        """
        cache = get_cache()

        # Check if we have cached analysis for this competitor
        cached_analysis = cache.get_analysis(
            competitor_name, competitor_website, niche)
        if cached_analysis:
            self._send_status_update(
                f"🎯 Found cached analysis for: {competitor_name}", "cache_hit")
            self._send_status_update(
                "✅ Returning cached competitive intelligence", "cache_complete")
            return cached_analysis

        self._send_status_update(
            f"\n🎯 Starting Multi-Agent Analysis for: {competitor_name}", "start")
        self._send_status_update("=" * 60)

        try:
            # Update researcher agent with niche-specific prompt
            niche_prompt = get_researcher_prompt(niche)
            self.researcher_agent.system_prompt = niche_prompt

            # Step 1: Researcher Agent gathers comprehensive data
            niche_label = {
                "all": "Comprehensive Analysis",
                "it": "IT & Technology Focus",
                "sales": "Sales & Business Development Focus",
                "marketing": "Marketing & Growth Focus",
                "finance": "Finance & Operations Focus",
                "product": "Product & Engineering Focus",
                "hr": "HR & People Operations Focus"
            }.get(niche, f"{niche.upper()} Focus")

            self._send_status_update(
                f"\n📊 Step 1: Researcher Agent gathering competitive intelligence ({niche_label})...", "research_start")

            # Create niche-specific research query
            base_research_query = f"""Research competitive intelligence for "{competitor_name}".
            
            {'Website: ' + competitor_website if competitor_website else ''}"""

            # Build niche-specific queries with proper string formatting
            if niche == "it":
                query_focus = f"""
            
            Focus specifically on IT & Technology intelligence:
            1. Technology stack, infrastructure, and cloud platforms
            2. Software development practices and engineering team
            3. API documentation and developer resources
            4. Security measures and compliance certifications
            5. Technical partnerships and integrations
            6. Open source contributions and technical blog
            7. IT job postings and technical requirements
            8. Technical product features and architecture
            
            Search terms to prioritize: "{competitor_name} technology stack", "{competitor_name} engineering team", "{competitor_name} API documentation", "{competitor_name} security compliance\""""
            elif niche == "sales":
                query_focus = f"""
            
            Focus specifically on Sales & Business Development:
            1. Sales methodology and process documentation
            2. Pricing models, packages, and revenue streams
            3. Sales team structure and job postings
            4. Customer case studies and success stories
            5. Partner programs and channel strategies
            6. Sales tools and CRM integrations
            7. Competitive positioning and win/loss data
            8. Sales collateral and presentation materials
            
            Search terms to prioritize: "{competitor_name} pricing", "{competitor_name} sales team", "{competitor_name} customer case studies", "{competitor_name} partner program\""""
            elif niche == "marketing":
                query_focus = f"""
            
            Focus specifically on Marketing & Growth:
            1. Marketing channels and campaign strategies
            2. Content marketing and SEO performance
            3. Social media presence and engagement metrics
            4. Brand messaging and positioning
            5. Customer acquisition funnels and conversion
            6. Marketing automation and tools
            7. Event marketing and sponsorship activities
            8. Influencer partnerships and collaborations
            
            Search terms to prioritize: "{competitor_name} marketing strategy", "{competitor_name} social media", "{competitor_name} content marketing", "{competitor_name} events sponsorship\""""
            elif niche == "finance":
                query_focus = f"""
            
            Focus specifically on Finance & Operations:
            1. Revenue models and financial performance
            2. Funding history and investor information
            3. Operational efficiency and cost structure
            4. Financial reporting and transparency
            5. Procurement processes and vendor relationships
            6. Risk management and compliance frameworks
            7. Budget allocation and resource planning
            8. Financial partnerships and integrations
            
            Search terms to prioritize: "{competitor_name} funding", "{competitor_name} revenue model", "{competitor_name} financial performance", "{competitor_name} investors\""""
            elif niche == "product":
                query_focus = f"""
            
            Focus specifically on Product & Engineering:
            1. Product roadmap and development cycle
            2. Feature releases and user feedback
            3. Engineering practices and development team
            4. Product-market fit and user adoption metrics
            5. Technical architecture and scalability
            6. User experience and design philosophy
            7. Product analytics and performance metrics
            8. Innovation labs and R&D investments
            
            Search terms to prioritize: "{competitor_name} product roadmap", "{competitor_name} new features", "{competitor_name} user feedback", "{competitor_name} engineering practices\""""
            elif niche == "hr":
                query_focus = f"""
            
            Focus specifically on HR & People Operations:
            1. Company culture and core values
            2. Hiring practices and talent acquisition
            3. Employee benefits and compensation packages
            4. Remote work policies and office locations
            5. Training and professional development programs
            6. Diversity, equity, and inclusion initiatives
            7. Employee satisfaction and retention rates
            8. Organizational structure and leadership style
            
            Search terms to prioritize: "{competitor_name} company culture", "{competitor_name} careers benefits", "{competitor_name} diversity inclusion", "{competitor_name} employee reviews\""""
            else:  # "all" or default
                query_focus = """
            
            Gather comprehensive information about:
            1. Recent company news, funding, and market developments
            2. Pricing strategy and product positioning (scrape pricing pages)
            3. Company leadership and team structure (LinkedIn data)
            4. Market position and customer feedback
            5. Financial information and growth metrics
            6. Technology stack and infrastructure
            7. Sales and marketing strategies"""

            research_query = base_research_query + query_focus + """
            
            Use your tools to collect detailed, factual information from multiple sources.
            """

            researcher_response = self.researcher_agent(research_query)
            research_findings = str(researcher_response)
            self._send_status_update(
                "✅ Research complete", "research_complete")

            # Step 2: Analyst Agent performs strategic analysis
            self._send_status_update(
                "\n🔍 Step 2: Analyst Agent performing strategic analysis...", "analysis_start")
            self._send_status_update(
                "Analyzing competitive positioning and threats...")

            analysis_query = f"""Analyze these competitive intelligence findings for "{competitor_name}":

            {research_findings}
            
            Provide strategic analysis including:
            1. SWOT assessment (strengths, weaknesses, opportunities, threats)
            2. Business model and revenue strategy analysis
            3. Competitive positioning and market differentiation
            4. Assessment of competitive threat level (rate 1-5)
            5. Key strategic insights for competitive response
            
            Focus on actionable insights and strategic implications.
            """

            analyst_response = self.analyst_agent(analysis_query)
            strategic_analysis = str(analyst_response)

            # Extract structured metrics from analysis
            extracted_metrics = extract_metrics_from_analysis(
                strategic_analysis)

            self._send_status_update(
                "✅ Strategic analysis complete", "analysis_complete")

            # Step 3: Writer Agent creates final report
            self._send_status_update(
                "\n📝 Step 3: Writer Agent generating comprehensive report...", "report_start")

            report_query = f"""Create a comprehensive competitive intelligence report for "{competitor_name}" based on this analysis:

            RESEARCH FINDINGS:
            {research_findings}
            
            STRATEGIC ANALYSIS:
            {strategic_analysis}
            
            Generate a professional report with:
            - Executive Summary (key findings and threat assessment)
            - Business Model Analysis
            - Competitive Positioning
            - Strategic Recommendations
            - Action Items for competitive response
            
            Focus on actionable intelligence for decision-makers.
            """

            final_report = self.writer_agent(report_query)

            self._send_status_update("\n" + "=" * 60, "complete")
            self._send_status_update(
                "✅ Multi-Agent Analysis Complete!", "complete")
            self._send_status_update("=" * 60)

            # Prepare comprehensive results with extracted metrics
            result = {
                "competitor": competitor_name,
                "website": competitor_website,
                "research_findings": research_findings,
                "strategic_analysis": strategic_analysis,
                "final_report": str(final_report),
                "metrics": extracted_metrics,
                "timestamp": datetime.now().isoformat(),
                "status": "success",
                "workflow": "multi_agent"
            }

            # Cache the successful analysis
            cache_success = cache.set_analysis(
                competitor_name, result, competitor_website, niche)
            if cache_success:
                self._send_status_update(
                    "💾 Analysis cached for future use", "cache_stored")

            return result

        except Exception as e:
            error_msg = str(e)
            self._send_status_update(
                f"\n❌ Multi-agent workflow failed: {error_msg}", "error")

            # Return error with any partial results
            return {
                "competitor": competitor_name,
                "website": competitor_website,
                "error": error_msg,
                "timestamp": datetime.now().isoformat(),
                "status": "error",
                "workflow": "multi_agent"
            }


def safe_get(dictionary: Union[Dict, str, Any], key: str, default: Any = None) -> Any:
    """Safely get value from dictionary, handling edge cases"""
    if isinstance(dictionary, dict):
        return dictionary.get(key, default)
    else:
        return default


def main():
    """Main demo function with multi-agent workflow"""

    print("🚀 Multi-Agent Competitive Intelligence Demo")
    print("   Strands Agents + Bright Data + Gemini")
    print("=" * 70)

    try:
        print("\n🔧 Initializing multi-agent workflow...")
        intelligence_system = MultiAgentCompetitiveIntelligence()

    except ValueError as e:
        print(f"\n❌ Configuration Error: {e}")
        print("\nRequired Environment Variables:")
        print("- GEMINI_API_KEY: Your Google AI Studio API key")
        print("- BRIGHTDATA_API_KEY: Your Bright Data API key")
        print("\nGet Gemini API key: https://aistudio.google.com/app/apikey")
        return
    except Exception as e:
        print(f"\n❌ Initialization failed: {e}")
        return

    demo_scenarios = [
        {"name": "Oxylabs", "website": "https://oxylabs.io",
            "description": "Enterprise communication"},
        {"name": "Notion", "website": "https://notion.so",
            "description": "All-in-one workspace"},
        {"name": "Figma", "website": "https://figma.com",
            "description": "Collaborative design"}
    ]

    print("\nDemo Scenarios (Multi-Agent Workflow):")
    for i, scenario in enumerate(demo_scenarios, 1):
        print(f"{i}. {scenario['name']} - {scenario['description']}")

    print("\nOptions:")
    print("- Enter 1-3 to run a demo scenario with multi-agent workflow")
    print("- Enter custom company name for multi-agent analysis")
    print("- Enter 'quit' to exit")
    print("\n🤖 Each analysis uses 3 specialized agents:")
    print("   📊 Researcher → 🔍 Analyst → 📝 Writer")

    while True:
        try:
            user_input = input("\n> ").strip()

            if user_input.lower() in ['quit', 'exit', 'q']:
                break

            elif user_input in ['1', '2', '3']:
                scenario = demo_scenarios[int(user_input) - 1]
                result = intelligence_system.run_competitive_intelligence_workflow(
                    scenario['name'],
                    scenario['website']
                )

                # Display multi-agent results
                if safe_get(result, 'status') == 'success':
                    print(
                        f"\n📊 Multi-Agent Analysis Summary for {safe_get(result, 'competitor', 'Unknown')}:")
                    print("-" * 50)
                    print(
                        f"Workflow: {safe_get(result, 'workflow', 'Unknown')}")
                    print(
                        f"Generated at: {safe_get(result, 'timestamp', 'Unknown time')}")

                    # Show final report preview
                    final_report = safe_get(result, 'final_report', '')
                    if final_report and len(final_report) > 300:
                        print(f"\n📝 Final Report Preview:\n{final_report}")
                        print(
                            f"\n💡 Tip: Full analysis includes research findings, strategic analysis, and comprehensive report")
                    elif final_report:
                        print(f"\n📝 Final Report:\n{final_report}")
                else:
                    error = safe_get(result, 'error', 'Unknown error')
                    print(f"\n❌ Multi-agent analysis failed: {error}")

            else:
                # Custom competitor analysis
                competitor_name = user_input
                result = intelligence_system.run_competitive_intelligence_workflow(
                    competitor_name)

                if safe_get(result, 'status') == 'success':
                    print(
                        f"\n📊 Multi-agent analysis completed for {competitor_name}")
                    final_report = safe_get(result, 'final_report', '')
                    if final_report and len(final_report) > 200:
                        print(f"\n📝 Report Preview:\n{final_report}")
                    elif final_report:
                        print(f"\n📝 Report:\n{final_report}")
                else:
                    error = safe_get(result, 'error', 'Unknown error')
                    print(f"\n❌ Multi-agent analysis failed: {error}")

        except KeyboardInterrupt:
            print("\n\n👋 Demo interrupted by user")
            break
        except Exception as e:
            print(f"\n⚠️  Unexpected error: {e}")
            print("Continuing...")

    print("\n👋 Demo completed!")


if __name__ == "__main__":
    main()
