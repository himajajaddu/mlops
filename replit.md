# HeartML - MLOps Heart Disease Prediction Pipeline

## Overview

This is a full-stack MLOps demonstration application for heart disease prediction. The project showcases an end-to-end machine learning pipeline with a React frontend for visualization and demo purposes, an Express backend API, and PostgreSQL for data persistence. The application allows users to input patient health data and receive heart disease risk predictions while tracking all predictions in a database.

The project also includes a complete Python-based ML training pipeline (in `heart-disease-mlops/`) with MLflow integration, Docker containerization, and Kubernetes deployment manifests - designed for an academic MLOps assignment.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight React router)
- **State Management**: TanStack React Query for server state
- **Styling**: Tailwind CSS with shadcn/ui component library
- **Build Tool**: Vite with path aliases (`@/` for client src, `@shared/` for shared code)
- **UI Features**: Framer Motion animations, Recharts for data visualization, react-syntax-highlighter for code display

### Backend Architecture
- **Runtime**: Node.js with Express
- **Language**: TypeScript (ESM modules)
- **API Design**: REST endpoints defined in `shared/routes.ts` with Zod validation
- **Database ORM**: Drizzle ORM with PostgreSQL
- **Development**: Vite dev server integration with HMR

### Data Layer
- **Database**: PostgreSQL (required via DATABASE_URL environment variable)
- **Schema**: Defined in `shared/schema.ts` using Drizzle with Zod integration
- **Migrations**: Drizzle Kit (`npm run db:push`)

### ML Pipeline (Python - `heart-disease-mlops/`)
- **Experiment Tracking**: MLflow for logging parameters, metrics, and model artifacts
- **Model Serving**: FastAPI with `/predict` endpoint
- **Containerization**: Docker with Kubernetes manifests in `k8s/`
- **CI/CD**: GitHub Actions workflow in `.github/workflows/`

### Key Design Decisions

1. **Monorepo Structure**: Client, server, and shared code coexist with path aliases for clean imports
2. **Type Safety**: Zod schemas in `shared/` validate both frontend forms and backend API requests
3. **Mock Predictions**: The web demo uses a simple heuristic algorithm; the real ML model runs in the Python FastAPI container
4. **Shared Route Definitions**: `shared/routes.ts` defines API contracts consumed by both frontend hooks and backend handlers

## External Dependencies

### Database
- **PostgreSQL**: Required. Connection via `DATABASE_URL` environment variable. Schema managed by Drizzle ORM.

### Frontend Libraries
- **shadcn/ui**: Pre-built accessible components (Radix primitives + Tailwind)
- **TanStack Query**: Data fetching and caching
- **Recharts**: Dashboard analytics charts
- **Framer Motion**: Page transitions and UI animations

### Backend Libraries
- **Drizzle ORM**: Type-safe database queries with PostgreSQL dialect
- **Zod**: Runtime validation for API inputs
- **Express Session**: Session management with `connect-pg-simple` for PostgreSQL session store

### ML/Python Dependencies (heart-disease-mlops/)
- **MLflow**: Experiment tracking and model registry
- **scikit-learn**: Model training (Random Forest, Logistic Regression)
- **FastAPI/Uvicorn**: Model serving API
- **Docker/Kubernetes**: Container orchestration for deployment

### Development Tools
- **Vite**: Frontend build and dev server
- **TSX**: TypeScript execution for server
- **Drizzle Kit**: Database migrations