# 🚀 LlamaIndex Integration Setup Guide

## Overview

This guide shows you how to integrate LlamaIndex RAG (Retrieval-Augmented Generation) capabilities into your existing competitive intelligence project.

## 🎯 What LlamaIndex Adds

- **Persistent Knowledge Base**: Store and index all competitive intelligence data
- **Semantic Search**: Find relevant insights across historical analyses  
- **Context-Aware Analysis**: Enhanced responses using accumulated knowledge
- **Market Landscape Analysis**: Cross-competitor insights and trends
- **Document Processing**: Handle PDFs, reports, and structured data

## 📋 Installation Steps

### 1. Install Enhanced Dependencies

```bash
# Navigate to your API directory
cd api/

# Install LlamaIndex and dependencies
pip install -r requirements_llamaindex.txt
```

### 2. Set Up Environment Variables

Add these to your existing `api/.env` file:

```bash
# Existing keys
GEMINI_API_KEY=your_gemini_api_key_here
BRIGHTDATA_API_KEY=your_brightdata_api_key_here

# Optional: OpenAI for better embeddings (recommended)
OPENAI_API_KEY=your_openai_api_key_here

# Optional: Custom storage path
LLAMAINDEX_STORAGE_PATH=./data/competitive_intelligence
```

### 3. Test RAG System

```bash
# Test the enhanced system
python enhanced_ci_agent.py
```

### 4. Run Enhanced API Server

```bash
# Run enhanced API (on port 8001)
python enhanced_app.py

# Or keep using original API (automatically enhanced)
python app.py
```

## 🏗️ Architecture Integration

### Before (Original):
```
Frontend → FastAPI → Strands Agents → Gemini + Bright Data
```

### After (Enhanced):
```
Frontend → FastAPI → Enhanced Agents → Gemini + Bright Data + LlamaIndex RAG
                                    ↓
                            Persistent Knowledge Base
```

## 🔧 Configuration Options

### Embedding Models

**Option 1: OpenAI Embeddings (Recommended)**
- Best quality, requires OpenAI API key
- Set `OPENAI_API_KEY` in `.env`

**Option 2: Local HuggingFace Embeddings**
- Free, runs locally
- Automatically used if no OpenAI key

### Storage Backends

**ChromaDB (Default)**
- Persistent vector storage
- Stores in `./data/competitive_intelligence/chroma/`

**Custom Storage Path**
- Set `LLAMAINDEX_STORAGE_PATH` in `.env`

## 📊 New API Endpoints

### Enhanced Analysis
```bash
# Enhanced competitive analysis with RAG
POST /analyze/enhanced
{
  "competitor_name": "Slack",
  "competitor_website": "https://slack.com",
  "industry_keywords": ["communication", "collaboration", "saas"],
  "enable_rag": true
}
```

### RAG Query
```bash
# Query knowledge base
POST /rag/query
{
  "query": "What are the main strengths of communication platforms?",
  "competitor_filter": "Slack"  # optional
}
```

### Market Analysis
```bash
# Get market landscape analysis
POST /rag/market-analysis
{
  "industry_keywords": ["saas", "productivity", "collaboration"]
}
```

### RAG Status
```bash
# Check RAG system status
GET /rag-status

# Get analyzed competitors
GET /rag/competitors
```

## 🎮 Usage Examples

### 1. Enhanced Analysis with Market Context

```python
from enhanced_ci_agent import EnhancedMultiAgentCompetitiveIntelligence

# Initialize with RAG enabled
intelligence = EnhancedMultiAgentCompetitiveIntelligence(enable_rag=True)

# Run enhanced analysis
result = intelligence.run_enhanced_competitive_intelligence_workflow(
    competitor_name="Notion",
    competitor_website="https://notion.so",
    industry_keywords=["productivity", "collaboration", "workspace"]
)

print(f"Analysis complete: {result['workflow']}")
print(f"RAG enabled: {result['rag_enabled']}")
print(f"Knowledge stored: {result['rag_stored']}")
```

### 2. Query Knowledge Base

```python
# Query accumulated competitive intelligence
query_result = intelligence.query_knowledge_base(
    query="How do productivity tools differentiate themselves?",
    competitor_filter="Notion"  # optional
)

print(query_result['response'])
```

### 3. Market Landscape Analysis

```python
# Get market insights across multiple competitors
market_analysis = intelligence.get_market_analysis(
    industry_keywords=["saas", "productivity", "collaboration"]
)

print(market_analysis['market_analysis'])
print(f"Based on {market_analysis['knowledge_base_stats']['total_documents']} documents")
```

## 🔄 Migration from Existing System

### Seamless Integration
- **Existing API endpoints continue to work**
- **Frontend requires no changes**
- **Gradual adoption possible**

### Enhanced Workflow
1. **First Analysis**: Standard analysis + stored in RAG
2. **Subsequent Analyses**: Enhanced with historical context
3. **Cross-Competitor Insights**: Market landscape analysis
4. **Knowledge Queries**: Direct RAG queries

## 📈 Benefits

### For Research Agent
- **Historical Context**: "What did we learn about this competitor before?"
- **Market Trends**: "How has this industry evolved?"
- **Source Verification**: "What sources mentioned this claim?"

### For Analyst Agent
- **Competitive Benchmarking**: "How does this compare to similar companies?"
- **Pattern Recognition**: "What patterns emerge across competitors?"
- **Strategic Insights**: "What strategic moves are common in this space?"

### For Writer Agent
- **Comprehensive Reports**: Enhanced with accumulated knowledge
- **Trend Analysis**: "Based on our competitive intelligence database..."
- **Actionable Insights**: Context-aware recommendations

## 🛠️ Troubleshooting

### Common Issues

**1. ChromaDB Installation Issues**
```bash
pip install chromadb --upgrade
```

**2. Embedding Model Download**
```bash
# Pre-download HuggingFace model
python -c "from sentence_transformers import SentenceTransformer; SentenceTransformer('sentence-transformers/all-MiniLM-L6-v2')"
```

**3. Storage Permissions**
```bash
# Ensure storage directory is writable
mkdir -p ./data/competitive_intelligence
chmod 755 ./data/competitive_intelligence
```

**4. Memory Issues with Local Models**
```bash
# Use lighter embedding model
export SENTENCE_TRANSFORMERS_HOME=./models
```

### Performance Optimization

**1. Use OpenAI Embeddings**
- Faster and higher quality than local models
- Set `OPENAI_API_KEY` in `.env`

**2. Persistent Storage**
- ChromaDB persists automatically
- Restart server without losing data

**3. Batch Processing**
- RAG system processes documents efficiently
- No performance impact on individual queries

## 🔒 Security Considerations

### API Keys
- Store in `.env` file (not version controlled)
- Use separate keys for different environments

### Data Storage
- Local ChromaDB storage by default
- Consider encrypted storage for sensitive data

### Access Control
- RAG queries respect existing API authentication
- Knowledge base isolated per deployment

## 🚀 Next Steps

1. **Install dependencies**: `pip install -r requirements_llamaindex.txt`
2. **Update environment**: Add optional API keys to `.env`
3. **Test integration**: Run `python enhanced_ci_agent.py`
4. **Start enhanced API**: `python enhanced_app.py`
5. **Analyze competitors**: Build up your knowledge base
6. **Query insights**: Leverage accumulated intelligence

## 📚 Additional Resources

- [LlamaIndex Documentation](https://docs.llamaindex.ai/)
- [ChromaDB Documentation](https://docs.trychroma.com/)
- [OpenAI Embeddings](https://platform.openai.com/docs/guides/embeddings)
- [HuggingFace Sentence Transformers](https://huggingface.co/sentence-transformers)
