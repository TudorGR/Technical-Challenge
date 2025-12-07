# Architecture Documentation

## Overview

An auto-generated blog application built with a modern full-stack architecture, deployed on AWS infrastructure using Docker containers.

## Technology Stack

### Frontend

- **Framework**: React 19 with Vite
- **Routing**: React Router v7
- **Styling**: Tailwind CSS v4
- **UI Components**: Lucide React (icons)
- **Build**: Multi-stage Docker build with Nginx

### Backend

- **Runtime**: Node.js 20
- **Framework**: Express.js
- **Database**: PostgreSQL 16
- **ORM/Client**: node-postgres (pg)
- **Scheduling**: node-cron
- **AI Integration**: Groq API (llama-3.3-70b-versatile)

### Infrastructure

- **Containerization**: Docker
- **Orchestration**: Docker Compose
- **Cloud Provider**: AWS
  - EC2 (t2.micro) - Application hosting
  - ECR - Docker image registry
  - CodeBuild - CI/CD pipeline
- **Web Server**: Nginx (for frontend)

## Core Features

### 1. Article Management

- **List View**: Browse all generated articles
- **Detail View**: Read full article content with styled formatting
- **Auto-highlighting**: Capitalized words are highlighted in yellow

### 2. AI Content Generation

- **Provider**: Groq API (free tier)
- **Model**: llama-3.3-70b-versatile
- **Frequency**: Automatically generates 1 article per day
- **Scheduler**: node-cron runs daily at midnight
- **Topics**: Random selection from predefined categories (tech, science, lifestyle, etc.)

### 3. Data Persistence

- **Database**: PostgreSQL with persistent volumes
- **Schema**:
  ```sql
  CREATE TABLE articles (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    tags TEXT[] NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )
  ```

## Deployment Flow

### Development to Production Pipeline

1. **Local Development**

   ```bash
   # Frontend
   cd frontend && npm run dev

   # Backend
   cd backend && npm run dev
   ```

2. **Code Push**

   ```bash
   git push origin main
   ```

3. **CI/CD Pipeline (CodeBuild)**

   - Triggered on push to main branch
   - Builds Docker images for frontend and backend
   - Tags images with commit hash and 'latest'
   - Pushes to ECR repositories

4. **Deployment (EC2)**
   - SSH into EC2 instance
   - Run `deploy.sh` script
   - Script pulls latest images from ECR
   - Stops old containers and starts new ones
   - Application is live

### Docker Container Architecture

#### Frontend Container

- **Base Image**: node:20-alpine (builder) + nginx:alpine (runtime)
- **Build Process**:
  1. Install dependencies
  2. Build optimized production bundle
  3. Copy to Nginx static file directory
- **Port**: 80
- **Role**: Serves React SPA and proxies API calls to backend

#### Backend Container

- **Base Image**: node:20-alpine
- **Port**: 3001
- **Environment Variables**:
  - `DATABASE_URL`: PostgreSQL connection string
  - `GROQ_API_KEY`: API key for text generation
- **Health**: Cron job runs in background

#### Database Container

- **Base Image**: postgres:16
- **Port**: 5432
- **Persistence**: Docker volume `pgdata`
- **Credentials**: Configured via environment variables

## API Endpoints

### Articles API

| Method | Endpoint            | Description              |
| ------ | ------------------- | ------------------------ |
| GET    | `/api/articles`     | Get all articles         |
| GET    | `/api/articles/:id` | Get single article by ID |

Example Response:

```json
{
  "id": 1,
  "title": "The Future of AI",
  "content": "Artificial intelligence is...",
  "tags": ["AI", "Technology", "Future"],
  "created_at": "2025-12-07T10:00:00.000Z"
}
```

## Environment Variables

### Backend (.env)

```bash
DATABASE_URL=postgres://blog:blogpass@db:5432/blogdb
GROQ_API_KEY=your_groq_api_key_here
PORT=3001
```

### Frontend

No environment variables required (API URL is relative: `/api`)

### AWS/Deployment

```bash
AWS_ACCOUNT_ID=123456789012
AWS_REGION=us-east-1
ECR_REPO_BACKEND=blog-backend
ECR_REPO_FRONTEND=blog-frontend
```

## Security Considerations

### Current Implementation

- Environment variables stored securely on EC2
- API keys not committed to git (`.env` in `.gitignore`)
- Database credentials not exposed publicly
- EC2 security group limits inbound traffic

## Development Commands

### Local Development

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down

# Rebuild after code changes
docker-compose up -d --build
```

### Build Images Locally

```bash
# Backend
cd backend && docker build -t blog-backend .

# Frontend
cd frontend && docker build -t blog-frontend .
```

### Database Management

```bash
# Access PostgreSQL
docker exec -it blog-postgres psql -U blog -d blogdb

# View articles
SELECT * FROM articles;

# Backup database
docker exec blog-postgres pg_dump -U blog blogdb > backup.sql
```
