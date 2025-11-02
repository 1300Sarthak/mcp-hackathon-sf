# Sidebar Dashboard UI Guide

## Overview

The new Competitive Intelligence Dashboard features a modern, shadcn-inspired sidebar layout with collapsible navigation and user profile management.

## Key Features

### 1. **Collapsible Sidebar**

- Click the chevron icon to expand/collapse the sidebar
- Shows icons only when collapsed
- Full navigation when expanded
- Smooth transitions

### 2. **Navigation Structure**

- **Home Section**: Dashboard, Analytics, Compare Companies
- **Documents Section**: Data Library, Reports, Word Assistant, More
- **Bottom Section**: Settings, Get Help, Search, User Profile

### 3. **Main Content Area**

- **Documents View** (default): Overview with metrics, charts, and document tables
- **Dashboard View**: Full competitive intelligence analysis
- **Compare View**: Side-by-side company comparison

### 4. **Design Elements**

- Dark theme (#0a0a0a background)
- Yellow accent color (#facc15)
- Gray borders (#262626)
- Shadcn-style components with consistent styling
- Smooth transitions and hover effects

## Components Created

### UI Components (in `src/components/ui/`)

- `field.tsx` - Form field components
- `avatar.tsx` - User avatar component
- `radio-group.tsx` - Radio button group
- `textarea.tsx` - Text area input

### Main Components

- `SidebarDashboard.tsx` - Main sidebar layout with navigation
- Enhanced `DashboardRedesigned.tsx` - Now supports `hideHeader` prop

## Usage

The sidebar layout is now the default when users sign in. It provides:

- Easy navigation between different features
- Persistent sidebar for quick access
- Profile management at the bottom
- Settings and help options readily available

## Color Palette

- **Background**: `#0a0a0a` (black)
- **Card Background**: `#1a1a1a` (dark gray)
- **Border**: `#262626` (medium gray)
- **Text Primary**: `#f9f9f9` (white)
- **Text Secondary**: `#a1a1aa` (light gray)
- **Text Muted**: `#71717a` (gray)
- **Accent**: `#facc15` (yellow)
- **Success**: `#22c55e` (green)
- **Danger**: `#ef4444` (red)

## Navigation Flow

1. User signs in → Sidebar Dashboard appears
2. Default view: Documents overview with metrics
3. Click "Dashboard" → Competitive Intelligence search/analysis
4. Click "Compare Companies" → Company comparison tool
5. User profile at bottom → Settings and account options
