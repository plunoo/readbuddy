# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

<<<<<<< HEAD
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
=======
**Setup and Development:**
```bash
npm install                    # Install dependencies
npm run dev                   # Start development server (localhost:3000)
npm run build                 # Build for production
npm run preview               # Preview production build locally
```

**Environment Setup:**
- Set `GEMINI_API_KEY` in `.env.local` file for AI features to work
- App is deployed via AI Studio: https://ai.studio/apps/drive/1D9KDMwGEo-aUSVf_hgFRjN42a3NUwgi0

## Architecture Overview

**ReadBuddy** is a React-based educational app for children ages 5-9, focusing on phonics and early literacy learning with a friendly AI-powered robot companion.

### Core Architecture

**State Management:**
- App-level state in `App.tsx` manages navigation, user progress, settings, and achievement system
- No external state management library - uses React's built-in hooks
- Progress tracking includes adaptive difficulty, streaks, badges, and performance analytics

**Navigation System:**
- Screen-based navigation using union type: `'HOME' | 'LESSON' | 'REWARDS' | 'GAMES'`
- Screen transitions handled by conditional rendering in main App component
- Each screen is a separate component in `/screens` directory

**Voice Integration:**
- `voiceService.ts` handles text-to-speech with Web Speech API
- Child-friendly voice selection (higher pitch, preferred female voices)
- Rate and pitch optimized for young learners

### Key Systems

**Achievement & Progress System:**
- `UserProgress` interface tracks: sounds unlocked, daily streaks, badges, difficulty level
- Adaptive difficulty system automatically adjusts based on recent performance (last 10 attempts)
- Badge system with categories: streak, daily, mastery, special
- Real-time progress calculations with local state persistence

**Lesson System:**
- `PhonicsLesson` interface defines word-sound-choices structure
- Interactive multiple choice with immediate feedback
- Celebration effects and encouraging error messages
- Voice prompts guide children through each step

**Robot Avatar System:**
- `RobotAvatar` component with 8 expression states
- Context-aware animations based on lesson state
- SVG-based with CSS animations for smooth performance

### Component Structure

**Screens:** Home, Lesson, Rewards, Games - each handles specific app functionality
**Components:** Reusable UI elements (RobotAvatar, CelebrationEffect, LetterMatchGame, ParentGate)
**Services:** Voice service abstraction for speech synthesis

### Data Flow

1. App.tsx maintains global state (progress, settings, current screen)
2. Progress updates trigger badge checks and difficulty adjustments
3. Voice feedback provides immediate audio response
4. Visual celebrations reinforce positive learning experiences

### Special Considerations

**Child-Focused UX:**
- Large touch targets, bright colors, immediate feedback
- Dyslexia-friendly font toggle
- Encouraging error messages instead of negative feedback
- Gamification elements (streaks, badges, stickers)

**Accessibility:**
- Voice synthesis for all interactions
- Visual and audio feedback combined
- Large, clear typography and UI elements
- Color-coded difficulty levels

The app uses Tailwind CSS for styling with custom animations and responsive design optimized for tablet use in educational settings.

## Recent Enhancements (v2.0)

### ElevenLabs Voice Integration
- High-quality child-friendly voice synthesis for perfect phoneme pronunciation
- SSML markup support for precise phonics instruction with emphasis and pausing
- Emotional voice feedback (encouraging, celebratory, instructional)
- Fallback to Web Speech API when ElevenLabs unavailable
- Cached audio for performance optimization

### Advanced Phonics Curriculum
- Systematic phonics progression based on research (6 levels: basic sounds to complex phonemes)
- Phonemic awareness activities: isolation, blending, segmenting, manipulation
- Multi-sensory learning approaches with visual, auditory, and kinesthetic elements
- Adaptive difficulty adjustment based on success rates and learning patterns

### Enhanced Reward System
- Research-based motivation system with intrinsic reward focus
- Skill mastery tracking (emerging → developing → secure → mastered)
- Learning analytics with strengths/growth areas identification
- Parent insights dashboard with learning style and engagement metrics
- Progress visualization with weekly consistency tracking

### Data Structure Improvements
- Comprehensive phonics progression data with 44 phonemes
- Activity templates for systematic skill building
- Performance analytics tracking success rates and engagement
- Skill mastery states with automatic progression triggers
>>>>>>> 3efe4a8ba51b2caf4678c0cfefe30431b1f1ce7c
