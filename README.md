# Auto-Generated Blog - Technical-Challenge

A full-stack application that automatically generates blog articles using AI, built with React, Node.js, PostgreSQL, and deployed on AWS infrastructure using Docker.

## 🚀 Live Demo

**Deployed Application**: [Here](http://3.235.193.93)

## 📹 Video Walkthrough

[Video link will be added here]

## 🏗️ Architecture

A complete cloud-native deployment pipeline featuring:

- **Frontend**: React + Vite, served via Nginx
- **Backend**: Node.js + Express
- **Database**: PostgreSQL 16
- **AI**: Groq API (llama-3.3-70b-versatile)
- **Infrastructure**: AWS EC2 + ECR + CodeBuild
- **Containerization**: Docker + Docker Compose

See [ARCHITECTURE.md](docs/ARCHITECTURE.md) for detailed documentation.

## ✨ Features

- 📝 Auto-generates blog articles daily using AI
- 🎨 Clean, modern UI with Tailwind CSS
- 🔄 Automated CI/CD pipeline with AWS CodeBuild
- 🐳 Fully containerized with Docker
- 💾 Persistent data storage with PostgreSQL
- ⏰ Scheduled article generation with node-cron
- 🎯 RESTful API design

## 📦 Project Structure

```
.
├── backend/                 # Node.js backend
│   ├── src/
│   │   ├── index.js        # Express server
│   │   ├── db.js           # Database connection
│   │   ├── routes/         # API routes
│   │   └── services/       # AI client & cron jobs
│   ├── Dockerfile
│   └── package.json
│
├── frontend/               # React frontend
│   ├── src/
│   │   ├── pages/         # Article list & detail pages
│   │   ├── components/    # Reusable components
│   │   └── api/           # API client
│   ├── Dockerfile
│   ├── nginx.conf         # Nginx configuration
│   └── package.json
│
├── infra/                 # Infrastructure
│   ├── buildspec.yml      # AWS CodeBuild config
│   ├── docker-compose.yml # Production compose
│   ├── docker-compose.local.yml # Local development
│   └── scripts/
│       ├── deploy.sh      # EC2 deployment script
│       └── init-ec2.sh    # EC2 initial setup
│
└── docs/
    └── ARCHITECTURE.md    # Detailed architecture docs
```

## 🛠️ Local Development

### Prerequisites

- Node.js 20+
- Docker & Docker Compose
- PostgreSQL (or use Docker)

### Setup

1. **Clone the repository**

   ```bash
   git clone ...
   cd Technical-Challenge
   ```

2. **Set up environment variables**

   ```bash
   cd backend
   cp .env.example .env
   # Add your GROQ_API_KEY to .env
   ```

3. **Run with Docker Compose (Recommended)**

   ```bash
   cd infra
   docker-compose -f docker-compose.local.yml up --build
   ```

4. **Or run manually**

   Backend:

   ```bash
   cd backend
   npm install
   npm run dev
   ```

   Frontend:

   ```bash
   cd frontend
   npm install
   npm run dev
   ```

5. **Access the application**
   - Frontend: http://localhost:80 (or http://localhost:5173 in dev mode)
   - Backend API: http://localhost:3001/api

## 🚢 Deployment

### AWS Setup

1. **Create ECR Repositories**

   ```bash
   aws ecr create-repository --repository-name blog-backend
   aws ecr create-repository --repository-name blog-frontend
   ```

2. **Launch EC2 Instance**

   - AMI: Amazon Linux 2023
   - Instance Type: t2.micro (free tier)
   - Security Group: Allow ports 22, 80, 443

3. **Initialize EC2**

   ```bash
   scp infra/scripts/init-ec2.sh ec2-user@<EC2-IP>:~
   ssh ec2-user@<EC2-IP>
   chmod +x init-ec2.sh
   ./init-ec2.sh
   ```

4. **Set up CodeBuild**

   - Create project linked to your GitHub repo
   - Use `infra/buildspec.yml`
   - Add environment variables:
     - `AWS_ACCOUNT_ID`
     - `AWS_DEFAULT_REGION`
     - `ECR_REPO_BACKEND`
     - `ECR_REPO_FRONTEND`

5. **Deploy**
   ```bash
   # On EC2
   cd /home/ec2-user
   # Copy docker-compose.yml and deploy.sh
   chmod +x deploy.sh
   ./deploy.sh
   ```

## 📋 API Endpoints

| Method | Endpoint            | Description              |
| ------ | ------------------- | ------------------------ |
| GET    | `/api/articles`     | Get all articles         |
| GET    | `/api/articles/:id` | Get single article by ID |

## 🧪 Testing

```bash
# Test backend API
curl http://localhost:3001/api/articles

# Test article generation
curl -X POST http://localhost:3001/api/articles/generate
```

## 📊 Technical Decisions

### Why Groq API?

- Free tier with generous limits
- Fast inference speed
- High-quality llama-3.3-70b model
- No credit card required

### Why PostgreSQL?

- Robust relational database
- Array support for tags
- Better for production than SQLite
- Easy to migrate to AWS RDS later

### Why Multi-stage Docker Builds?

- Smaller image sizes
- Faster deployment
- Separate build and runtime dependencies
- Production-optimized

### Why Nginx for Frontend?

- Industry-standard web server
- Excellent performance for static files
- Easy reverse proxy setup
- Minimal resource usage
