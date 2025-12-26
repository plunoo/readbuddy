# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- **Start development server**: `npm run dev` (runs on http://localhost:3000)
- **Build for production**: `npm run build`
- **Preview production build**: `npm run preview`
- **Install dependencies**: `npm install`

## Environment Setup

- Set `GEMINI_API_KEY` in `.env.local` for AI functionality
- Uses Vite with React and TypeScript

## Architecture Overview

ReadBuddy is an AI-powered children's reading companion built as a React/TypeScript SPA with the following structure:

### Core Components
- **App.tsx**: Main application state management, view routing, and local storage persistence
- **types.ts**: TypeScript definitions for core entities (ChildProfile, Lesson, Badge, etc.)
- **components/Layout.tsx**: Main UI layout wrapper
- **services/geminiService.ts**: Gemini AI integration for story generation and interactions

### View System
The app uses a view-based navigation system with these main screens:
- **Onboarding**: Child profile creation and setup
- **Dashboard**: Main child interface with lessons, games, and progress
- **LessonsView**: Phonics curriculum with systematic progression
- **LibraryView**: AI-generated personalized stories
- **GamesView**: Interactive reading games
- **ParentDashboard**: Progress tracking and settings management

### Data Architecture
- **Local Storage Persistence**: All data stored locally using `readbuddy_data` key
- **Child Profiles**: Support for multiple children with individual progress tracking
- **Phonics Curriculum**: Structured lesson progression with XP, stars, and badges
- **Mastery Tracking**: Sound-by-sound progress monitoring

### AI Integration
- Uses Google Gemini API for generating personalized stories
- Vite configuration exposes API key as `process.env.GEMINI_API_KEY`
- Service layer abstracts AI interactions

### Development Notes
- Uses React 19 with modern hooks patterns
- TypeScript strict mode enabled
- Vite for build tooling with HMR
- Path aliases configured (`@/` points to project root)
- No testing framework currently configured