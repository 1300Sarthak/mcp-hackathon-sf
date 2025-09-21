# 🚀 Deployment Guide - Competitive Intelligence System

## Overview

This guide will walk you through deploying your competitive intelligence system with:

- **Backend**: Render (with Docker + Redis)
- **Frontend**: Vercel

## 📋 Prerequisites

### Required Accounts

1. **GitHub Account** (for code repository)
2. **Render Account** (for backend deployment) - [render.com](https://render.com)
3. **Vercel Account** (for frontend deployment) - [vercel.com](https://vercel.com)

### Required API Keys

1. **Google Gemini API Key** - [Get from Google AI Studio](https://makersuite.google.com/app/apikey)
2. **Bright Data API Key** - [Get from Bright Data](https://brightdata.com)

## 🔧 Step 1: Prepare Your Repository

### 1.1 Push to GitHub

```bash
# Initialize git if not already done
git init
git add .
git commit -m "Initial deployment setup"

# Create GitHub repository and push
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git branch -M main
git push -u origin main
```

### 1.2 Verify File Structure

Make sure you have these files:

```
├── api/
│   ├── Dockerfile              ✅ Created
│   ├── .dockerignore          ✅ Created
│   ├── requirements.txt       ✅ Exists
│   ├── app.py                 ✅ Updated for production
│   └── [other Python files]
├── ci-agent-ui/
│   ├── vercel.json            ✅ Created
│   ├── env.example            ✅ Created
│   ├── src/config/api.ts      ✅ Created
│   └── [other frontend files]
├── render.yaml                ✅ Created
├── docker-compose.yml         ✅ Created
└── DEPLOYMENT_GUIDE.md        ✅ This file
```

## 🐳 Step 2: Deploy Backend to Render

### 2.1 Create Render Services

1. **Go to Render Dashboard**: [dashboard.render.com](https://dashboard.render.com)

2. **Create Redis Database**:

   - Click "New +" → "Redis"
   - Name: `ci-redis`
   - Plan: `Starter (Free)`
   - Region: `Oregon (US West)`
   - Click "Create Redis"
   - **Save the Internal Redis URL** (you'll need it)

3. **Create Web Service**:
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Configure:
     - **Name**: `ci-api`
     - **Region**: `Oregon (US West)`
     - **Branch**: `main`
     - **Runtime**: `Docker`
     - **Dockerfile Path**: `./api/Dockerfile`
     - **Docker Context**: `./api`

### 2.2 Configure Environment Variables

In your Render web service settings, add these environment variables:

```bash
# Required API Keys
GEMINI_API_KEY=your_gemini_api_key_here
BRIGHTDATA_API_KEY=your_brightdata_api_key_here

# Redis Configuration (use the internal URL from your Redis service)
REDIS_URL=redis://red-xxxxx:6379

# Production Settings
ENVIRONMENT=production
PORT=8000
PYTHONUNBUFFERED=1

# CORS Configuration (will be updated after frontend deployment)
FRONTEND_URL=https://your-app.vercel.app
```

### 2.3 Deploy Backend

1. Click "Create Web Service"
2. Wait for deployment (5-10 minutes)
3. Test your API: `https://your-api-name.onrender.com/health`
4. **Save your backend URL** for frontend configuration

## 🌐 Step 3: Deploy Frontend to Vercel

### 3.1 Deploy to Vercel

1. **Go to Vercel Dashboard**: [vercel.com/dashboard](https://vercel.com/dashboard)

2. **Import Project**:
   - Click "Add New..." → "Project"
   - Import your GitHub repository
   - Configure:
     - **Framework Preset**: `Vite`
     - **Root Directory**: `ci-agent-ui`
     - **Build Command**: `npm run build`
     - **Output Directory**: `dist`

### 3.2 Configure Environment Variables

In Vercel project settings → Environment Variables, add:

```bash
# API Configuration
VITE_API_URL=https://your-backend-app.onrender.com
```

### 3.3 Deploy Frontend

1. Click "Deploy"
2. Wait for deployment (2-5 minutes)
3. Test your frontend: `https://your-app.vercel.app`
4. **Save your frontend URL**

## 🔄 Step 4: Update Backend CORS

### 4.1 Update Backend Environment Variables

Go back to your Render backend service and update:

```bash
FRONTEND_URL=https://your-app.vercel.app
```

### 4.2 Redeploy Backend

The backend will automatically redeploy with the new CORS settings.

## ✅ Step 5: Verify Deployment

### 5.1 Test Backend Endpoints

```bash
# Health check
curl https://your-backend-app.onrender.com/health

# Should return: {"status":"healthy","timestamp":"...","version":"1.0.0"}
```

### 5.2 Test Frontend

1. Visit your Vercel app: `https://your-app.vercel.app`
2. Try analyzing a company (e.g., "Slack")
3. Verify the analysis completes successfully
4. Test the competitor discovery feature
5. Test the company comparison feature

### 5.3 Monitor Logs

- **Render Logs**: Dashboard → Your Service → Logs
- **Vercel Logs**: Dashboard → Your Project → Functions

## 🛠️ Troubleshooting

### Common Issues

#### Backend Issues

1. **"Module not found" errors**:

   ```bash
   # Check requirements.txt includes all dependencies
   # Rebuild the service in Render
   ```

2. **Redis connection failed**:

   ```bash
   # Verify REDIS_URL environment variable
   # Check Redis service is running
   ```

3. **API key errors**:
   ```bash
   # Verify GEMINI_API_KEY and BRIGHTDATA_API_KEY are set
   # Check API key permissions and quotas
   ```

#### Frontend Issues

1. **API connection failed**:

   ```bash
   # Verify VITE_API_URL points to your Render backend
   # Check CORS configuration in backend
   ```

2. **Build failures**:
   ```bash
   # Check package.json dependencies
   # Verify TypeScript compilation
   ```

### Debug Commands

#### Local Testing with Docker

```bash
# Test backend locally
cd api
docker build -t ci-backend .
docker run -p 8000:8000 -e GEMINI_API_KEY=your_key ci-backend

# Test full stack locally
docker-compose up
```

#### Check Environment Variables

```bash
# In Render service logs, check if env vars are loaded
echo $GEMINI_API_KEY  # Should not be empty
echo $REDIS_URL       # Should not be empty
```

## 🔒 Security Considerations

### Production Security Checklist

- ✅ API keys stored as environment variables (not in code)
- ✅ CORS properly configured for your domain
- ✅ Redis accessible only internally
- ✅ HTTPS enforced on both frontend and backend
- ✅ No sensitive data in logs

### Monitoring

1. **Set up Render monitoring**: Dashboard → Service → Metrics
2. **Set up Vercel analytics**: Dashboard → Project → Analytics
3. **Monitor API usage**: Check Gemini and Bright Data quotas

## 📈 Scaling Considerations

### Free Tier Limitations

- **Render Free**: 750 hours/month, sleeps after 15 min inactivity
- **Vercel Free**: 100GB bandwidth, 100 deployments/month
- **Redis Free**: 25MB storage

### Upgrade Paths

1. **Render Pro** ($7/month): Always-on, better performance
2. **Vercel Pro** ($20/month): More bandwidth, advanced features
3. **Redis Starter** ($15/month): 256MB storage

## 🎯 Final Checklist

Before going live:

- [ ] Backend deployed and health check passes
- [ ] Frontend deployed and accessible
- [ ] API keys configured and working
- [ ] CORS properly configured
- [ ] All features tested (analysis, discovery, comparison)
- [ ] Error handling working properly
- [ ] Logs monitored and clean
- [ ] Performance acceptable
- [ ] Security measures in place

## 🚀 You're Live!

Congratulations! Your competitive intelligence system is now deployed and ready for users.

### Your URLs:

- **Backend API**: `https://your-backend-app.onrender.com`
- **Frontend App**: `https://your-app.vercel.app`

### Next Steps:

1. Share your app with users
2. Monitor usage and performance
3. Collect feedback for improvements
4. Consider implementing additional agents
5. Set up analytics and monitoring

---

## 📞 Support

If you encounter issues:

1. Check the troubleshooting section above
2. Review Render and Vercel documentation
3. Check service status pages
4. Monitor application logs for errors

**Happy deploying! 🎉**
