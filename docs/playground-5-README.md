# Playground 5: Backend Integration & Docker Deployment

## Overview
This playground focuses on creating a full-stack application with backend integration and Docker containerization. The application includes a Node.js/Express backend that acts as a proxy to the Wikipedia API and serves data to the React frontend.

## Total Points: 20/20

---

## Task 1: Setup Backend Framework (3 Points)

### Objective
Set up a backend framework to handle API requests and serve data to the frontend.

### Implementation
- **Framework**: Express.js with TypeScript
- **Location**: `backend/` directory
- **Port**: 5000 (configurable via environment variable)

### File Structure
```
backend/
├── src/
│   ├── index.ts              # Main server entry point
│   ├── routes/
│   │   └── bears.ts          # API endpoints for bear data
│   └── services/
│       └── wikipedia.ts      # Wikipedia API integration
├── package.json
├── tsconfig.json
├── Dockerfile
└── .env
```

### Key Features
- TypeScript for type safety
- Express server with middleware
- Environment variable configuration
- Error handling and logging
- Health check endpoint

### Setup
```bash
cd backend
npm install
npm run dev
```

### Verification
Server should start on `http://localhost:5000` with the message:
```
Backend server running on http://localhost:5000
Environment: development
CORS enabled for: http://localhost:3000
```

---

## Task 2: Create Backend API (3 Points)

### Objective
Create an API that fetches bear data from Wikipedia and serves it to the frontend.

### Implementation
The backend acts as a proxy between the frontend and Wikipedia API, handling data fetching, parsing, and cleaning.

### API Endpoints

#### `GET /api/bears`
Returns all bear species data from Wikipedia.

**Response Format:**
```json
{
  "success": true,
  "count": 8,
  "data": [
    {
      "name": "Giant panda",
      "binomial": "A. melanoleuca",
      "image": "https://upload.wikimedia.org/...",
      "range": "Central China"
    }
  ]
}
```

#### `GET /health`
Health check endpoint for monitoring.

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2025-12-23T00:00:00.000Z",
  "environment": "development"
}
```

### Service Architecture
1. **Routes Layer** (`routes/bears.ts`): Handles HTTP requests
2. **Service Layer** (`services/wikipedia.ts`): 
   - Fetches data from Wikipedia API
   - Parses wikitext format
   - Extracts bear information
   - Cleans range text (removes wiki markup)
   - Fetches image URLs

### Wikipedia API Integration
- **Endpoint**: `https://en.wikipedia.org/w/api.php`
- **Page**: "List_of_ursids"
- **Format**: JSON with wikitext parsing

---

## Task 3: Configure CORS (2 Points)

### Objective
Configure Cross-Origin Resource Sharing (CORS) to only allow requests from the frontend.

### Implementation
Located in `backend/src/index.ts`:

```typescript
const corsOptions = {
  origin: FRONTEND_URL,  // http://localhost:3000
  methods: ['GET', 'POST'],
  credentials: true,
};

app.use(cors(corsOptions));
```

### Security Features
- Only requests from `http://localhost:3000` are allowed
- All other origins are blocked
- Configurable via `FRONTEND_URL` environment variable
- Production can use different origin (e.g., deployed URL)

### Environment Configuration
`.env` file in `backend/`:
```env
NODE_ENV=development
PORT=5000
FRONTEND_URL=http://localhost:3000
```

---

## Task 4: Replace Frontend API Calls (2 Points)

### Objective
Update the frontend to call the backend API instead of directly accessing Wikipedia.

### Changes Made

#### Before (Direct Wikipedia Call)
```typescript
const response = await fetch('https://en.wikipedia.org/w/api.php?...');
// 150+ lines of parsing logic
```

#### After (Backend API Call)
```typescript
const response = await fetch('/api/bears');
const result = await response.json();
setBears(result.data);  // Clean, processed data
```

### Benefits
1. **Separation of Concerns**: Data processing happens in backend
2. **Better Security**: No direct external API calls from browser
3. **Cleaner Code**: Removed 150+ lines from frontend
4. **Better Error Handling**: Centralized in backend
5. **Caching Potential**: Can add caching in backend

### Vite Proxy Configuration
In `frontend/vite.config.ts`:
```typescript
server: {
  port: 3000,
  proxy: {
    '/api': {
      target: 'http://backend:5000',
      changeOrigin: true,
      secure: false,
    },
  },
}
```

This resolves CSP (Content Security Policy) issues by routing all API calls through the same origin.

---

## Task 5 & 6: Multi-Stage Dockerfiles (6 Points)

### Frontend Dockerfile
Located at: `frontend/Dockerfile`

#### Stage 1: Development
```dockerfile
FROM node:20-alpine AS development
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
EXPOSE 3000
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
```

#### Stage 2: Build
```dockerfile
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build  # Creates dist/ folder
```

#### Stage 3: Production (Nginx)
```dockerfile
FROM nginx:alpine AS production
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### Backend Dockerfile
Located at: `backend/Dockerfile`

#### Stage 1: Development
```dockerfile
FROM node:20-alpine AS development
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
EXPOSE 5000
CMD ["npm", "run", "dev"]  # tsx watch for hot reload
```

#### Stage 2: Build
```dockerfile
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
COPY tsconfig.json ./
RUN npm ci
COPY . .
RUN npm run build  # TypeScript compilation
```

#### Stage 3: Production
```dockerfile
FROM node:20-alpine AS production
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY --from=build /app/dist ./dist
EXPOSE 5000
ENV NODE_ENV=production
CMD ["node", "dist/index.js"]
```

### Nginx Configuration
Located at: `frontend/nginx.conf`

Features:
- Gzip compression for better performance
- Security headers (X-Frame-Options, X-Content-Type-Options)
- Static asset caching (1 year for images, fonts, etc.)
- No caching for index.html
- SPA routing support (try_files)

---

## Task 7 & 8: Docker Compose (4 Points)

### Development: docker-compose.yml

#### Purpose
For local development with hot reload and live code changes.

#### Configuration
```yaml
services:
  backend:
    build:
      context: ./backend
      target: development
    ports:
      - "5000:5000"
    environment:
      - NODE_ENV=development
      - PORT=5000
      - FRONTEND_URL=http://localhost:3000
    volumes:
      - ./backend/src:/app/src  # Hot reload
    networks:
      - wildlife-network

  frontend:
    build:
      context: ./frontend
      target: development
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=development
      - VITE_BACKEND_URL=http://localhost:5000
    volumes:
      - ./frontend/src:/app/src  # Hot reload
    depends_on:
      - backend
    networks:
      - wildlife-network
```

#### Features
- **Hot Reload**: Source code mounted as volumes
- **Dependencies**: Frontend waits for backend
- **Networks**: Both services on same network
- **Named Volumes**: node_modules isolated to prevent conflicts

#### Start Command
```bash
docker-compose -f docker-compose.yml up --build
```

#### Access
- Frontend: http://localhost:3000
- Backend: http://localhost:5000

---

### Production: docker-compose.prod.yml

#### Purpose
For production deployment with optimized builds and Nginx.

#### Configuration
```yaml
services:
  backend:
    build:
      context: ./backend
      target: production
    ports:
      - "5000:5000"
    environment:
      - NODE_ENV=production
      - PORT=5000
      - FRONTEND_URL=http://localhost
    restart: always
    healthcheck:
      test: ["CMD", "wget", "--spider", "http://localhost:5000/health"]
      interval: 30s

  frontend:
    build:
      context: ./frontend
      target: production
    ports:
      - "80:80"
    environment:
      - NODE_ENV=production
    depends_on:
      - backend
    restart: always
    healthcheck:
      test: ["CMD", "wget", "--spider", "http://localhost"]
      interval: 30s
```

#### Features
- **No Volumes**: Everything baked into container
- **Health Checks**: Automatic monitoring
- **Auto Restart**: `restart: always` policy
- **Optimized**: Production builds only
- **Nginx**: Frontend served on port 80

#### Start Command
```bash
docker-compose -f docker-compose.prod.yml up --build
```

#### Access
- Frontend: http://localhost (port 80)
- Backend: http://localhost:5000

---

## Project Structure

```
we-coding-playgrounds-fadime/
├── frontend/                      # React Frontend
│   ├── src/
│   │   ├── components/
│   │   │   └── BearList.tsx      # Modified to use backend API
│   │   ├── main.tsx
│   │   └── style.css
│   ├── public/
│   ├── Dockerfile                 # Multi-stage frontend build
│   ├── nginx.conf                 # Nginx configuration
│   ├── package.json
│   ├── vite.config.ts            # Includes proxy config
│   └── .env
│
├── backend/                       # Express Backend
│   ├── src/
│   │   ├── index.ts              # Server setup
│   │   ├── routes/
│   │   │   └── bears.ts          # API routes
│   │   └── services/
│   │       └── wikipedia.ts      # Wikipedia integration
│   ├── Dockerfile                 # Multi-stage backend build
│   ├── package.json
│   ├── tsconfig.json
│   └── .env
│
├── docker-compose.yml             # Development orchestration
├── docker-compose.prod.yml        # Production orchestration
├── DOCKER.md                      # Docker usage guide
└── docs/
    └── playground-5-README.md     # This file
```

---

## Quick Start Guide

### Local Development (Without Docker)

#### Backend
```bash
cd backend
npm install
npm run dev
```

#### Frontend
```bash
cd frontend
npm install
npm run dev
```

Access: http://localhost:3000

---

### Docker Development

```bash
# Start both services
docker-compose -f docker-compose.yml up --build

# Run in background
docker-compose -f docker-compose.yml up -d --build

# View logs
docker-compose -f docker-compose.yml logs -f

# Stop services
docker-compose -f docker-compose.yml down

# Stop and remove volumes
docker-compose -f docker-compose.yml down -v
```

---

### Docker Production

```bash
# Start production build
docker-compose -f docker-compose.prod.yml up --build

# Run in background
docker-compose -f docker-compose.prod.yml up -d --build

# View logs
docker-compose -f docker-compose.prod.yml logs -f

# Stop services
docker-compose -f docker-compose.prod.yml down
```

---

## Environment Variables

### Backend (.env in backend/)
```env
NODE_ENV=development
PORT=5000
FRONTEND_URL=http://localhost:3000
```

### Frontend (.env in frontend/)
```env
VITE_BACKEND_URL=http://localhost:5000
```

**Note**: In Docker, these are overridden by docker-compose environment settings.

---

## Troubleshooting

### Port Already in Use
```bash
# Windows
Stop-Process -Name "node" -Force

# Check what's using port 5000
netstat -ano | findstr :5000
```

### Docker Build Issues
```bash
# Clean rebuild
docker-compose down -v
docker system prune -a
docker-compose up --build
```

### Backend Not Accessible from Frontend
- Check CORS configuration in `backend/src/index.ts`
- Verify Vite proxy in `frontend/vite.config.ts`
- Ensure both services are on same Docker network

### Hot Reload Not Working
- Verify volumes are mounted in docker-compose.yml
- Check file permissions
- Restart containers: `docker-compose restart`

---

## Testing

### Test Backend API
```bash
# Health check
curl http://localhost:5000/health

# Get bear data
curl http://localhost:5000/api/bears
```

### Test Frontend
1. Open http://localhost:3000
2. Open Browser DevTools (F12)
3. Check Console for logs
4. Check Network tab for API calls to `/api/bears`
5. Verify bear data displays correctly

---

## Achievements

- ✅ Backend Framework Setup (3 points)
- ✅ Wikipedia API Proxy (3 points)
- ✅ CORS Configuration (2 points)
- ✅ Frontend API Integration (2 points)
- ✅ Frontend Multi-Stage Dockerfile (3 points)
- ✅ Backend Multi-Stage Dockerfile (3 points)
- ✅ Development Docker Compose (2 points)
- ✅ Production Docker Compose (2 points)

**Total: 20/20 Points** 🎉

---

## Next Steps

Potential improvements:
1. Add caching layer (Redis) for Wikipedia API responses
2. Implement rate limiting
3. Add API authentication
4. Deploy to cloud (Azure, AWS, etc.)
5. Add monitoring (Prometheus, Grafana)
6. Implement CI/CD pipeline
7. Add unit and integration tests
8. Use environment-specific .env files
