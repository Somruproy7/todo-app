# To-Do List Application

## Overview

This is a mobile-first task management application built with React, Express, and TypeScript. The app allows users to create, edit, delete, and search tasks with date-based organization. It features an onboarding flow, weekly calendar view, task progress tracking, and a clean, minimalist UI inspired by modern task management apps like Todoist and TickTick.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Build Tools**
- React 18 with TypeScript for type-safe component development
- Vite as the build tool and development server
- Wouter for lightweight client-side routing (onboarding → home flow)
- React Query (@tanstack/react-query) for server state management and caching

**UI Component System**
- Radix UI primitives for accessible, headless components
- shadcn/ui component library with "new-york" style preset
- Tailwind CSS for utility-first styling with custom design tokens
- Mobile-first responsive design (max-width breakpoints)

**State Management Strategy**
- Server state managed via React Query with aggressive caching (staleTime: Infinity)
- Local state via React hooks (useState, useEffect)
- LocalStorage for onboarding completion tracking
- Form state managed by React Hook Form with Zod validation

**Key Design Decisions**
- Mobile-first approach with desktop responsive support
- Single-page application with minimal route transitions
- Optimistic UI updates for immediate user feedback
- Task filtering by date and search query on client-side

### Backend Architecture

**Server Framework**
- Express.js with TypeScript for REST API endpoints
- HTTP server with JSON request/response handling
- Custom logging middleware for request tracking

**API Design**
- RESTful endpoints for CRUD operations on tasks
- Query parameter support for date-based filtering
- Zod schema validation for request payloads
- Consistent error handling with appropriate HTTP status codes

**Storage Layer Abstraction**
- IStorage interface defining data access methods
- MemStorage implementation using in-memory Map (current)
- Designed for easy swap to database-backed storage
- UUID-based task identification

**Key Endpoints**
- GET /api/tasks - Retrieve tasks with optional date filtering
- GET /api/tasks/:id - Retrieve single task by ID
- POST /api/tasks - Create new task with validation
- PATCH /api/tasks/:id - Update existing task
- DELETE /api/tasks/:id - Remove task
- GET /api/tasks/stats - Weekly completion statistics

### Data Storage Solutions

**Current Implementation**
- In-memory storage using JavaScript Map
- No persistence between server restarts
- Suitable for development and prototyping

**Database Schema (Prepared for PostgreSQL)**
- Drizzle ORM configured for PostgreSQL dialect
- Schema defined in shared/schema.ts with type inference
- Task model: id, title, description, date, startTime, endTime, completed
- Ready for migration to Neon serverless PostgreSQL

**Schema Validation**
- Zod schemas for runtime validation
- Drizzle-zod integration for database schema validation
- Shared types between client and server via TypeScript inference

### Authentication and Authorization

**Current State**
- No authentication implemented
- All tasks globally accessible
- Suitable for single-user or demo scenarios

**Architecture Preparation**
- Session management dependencies installed (express-session, connect-pg-simple)
- Ready for future implementation of user-based task ownership

### External Dependencies

**Core Dependencies**
- @neondatabase/serverless - Serverless PostgreSQL driver for production database
- drizzle-orm & drizzle-kit - Type-safe ORM and migration toolkit
- date-fns - Date manipulation and formatting
- zod - Schema validation and type inference

**UI & Component Libraries**
- @radix-ui/* - Headless accessible UI primitives (20+ components)
- @tanstack/react-query - Server state management
- react-hook-form & @hookform/resolvers - Form handling with validation
- tailwindcss - Utility-first CSS framework
- lucide-react - Icon library
- class-variance-authority & clsx - Conditional styling utilities

**Development Tools**
- Vite - Fast development server and build tool
- TypeScript - Static type checking
- ESBuild - Fast JavaScript bundler for production
- @replit/* plugins - Replit-specific development enhancements

**Key Architectural Patterns**
- Separation of concerns: client, server, shared code directories
- Type sharing between frontend and backend via shared schema
- Component composition with Radix UI primitives
- Dependency injection ready storage interface
- Build-time optimizations with allowlisted dependencies for faster cold starts