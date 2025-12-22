# Playground 5 - Checklist Answers

## 1. Name hardfacts about your backend framework, how to set it up and explain why you chose it.

### Backend Framework: Express.js with TypeScript

**Key Facts:**
- **Framework**: Express.js 4.18.2
- **Language**: TypeScript 5.3.3
- **Runtime**: Node.js 20 Alpine
- **Architecture**: REST API with service layer pattern
- **Port**: 5000 (configurable via environment variable)

**Setup:**
```bash
cd backend
npm install
npm run dev
```

**Dependencies:**
- `express` - Web framework for Node.js
- `cors` - Cross-Origin Resource Sharing middleware
- `dotenv` - Environment variable management
- `node-fetch` - HTTP client for Wikipedia API calls
- `tsx` - TypeScript execution and watch mode for development
- `typescript` - TypeScript compiler

**Why Express.js?**
1. **Lightweight & Fast**: Minimal overhead, excellent performance
2. **TypeScript Support**: Strong typing prevents runtime errors
3. **Middleware Ecosystem**: Easy integration of CORS, logging, error handling
4. **Simple Routing**: Clear, intuitive API endpoint definitions
5. **Industry Standard**: Well-documented, large community, proven in production
6. **Scalable**: Easy to structure with routes, services, and middleware layers

**Project Structure:**
```
backend/
├── src/
│   ├── index.ts              # Server setup, middleware, CORS
│   ├── routes/
│   │   └── bears.ts          # API endpoints
│   └── services/
│       └── wikipedia.ts      # Business logic
├── package.json
├── tsconfig.json
└── Dockerfile
```

---

## 2. How to create an API (endpoint) in your framework?

### Creating API Endpoints in Express.js

**Step 1: Define Routes**
In `backend/src/routes/bears.ts`:

```typescript
import express, { Request, Response, Router } from 'express';
import { fetchBearData, fetchImageUrl } from '../services/wikipedia';

const router: Router = express.Router();

// GET /api/bears - Fetch all bear data
router.get('/', async (req: Request, res: Response) => {
  try {
    console.log('Fetching bear data from Wikipedia...');
    const bearData = await fetchBearData();
    
    console.log(`Successfully fetched ${bearData.length} bears`);
    
    res.json({
      success: true,
      count: bearData.length,
      data: bearData,
    });
  } catch (error) {
    console.error('Error fetching bears:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch bear data',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

// GET /api/bears/image/:fileName - Fetch specific image URL
router.get('/image/:fileName', async (req: Request, res: Response) => {
  try {
    const { fileName } = req.params;
    const imageUrl = await fetchImageUrl(fileName);
    
    res.json({
      success: true,
      fileName,
      imageUrl,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch image URL',
    });
  }
});

export default router;
```

**Step 2: Register Routes in Main Server**
In `backend/src/index.ts`:

```typescript
import bearsRouter from './routes/bears';

// Mount the router
app.use('/api/bears', bearsRouter);
```

**Step 3: Create Service Layer**
In `backend/src/services/wikipedia.ts`:

```typescript
export async function fetchBearData(): Promise<BearData[]> {
  const response = await fetch(
    'https://en.wikipedia.org/w/api.php?action=parse&page=List_of_ursids&prop=wikitext&format=json&origin=*'
  );
  const data = await response.json();
  const bears = await extractBears(data.parse.wikitext['*']);
  return bears;
}
```

**API Endpoint Structure:**
- **Base URL**: `http://localhost:5000`
- **Endpoint**: `/api/bears`
- **Method**: `GET`
- **Response Format**: JSON

**Example Response:**
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

---

## 3. Where and how are CORS defined and why do we need it?

### CORS Configuration in Express.js

**Location:** `backend/src/index.ts`

**Implementation:**
```typescript
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';

// CORS Configuration - Only allow requests from frontend
const corsOptions = {
  origin: FRONTEND_URL,      // Only this origin is allowed
  methods: ['GET', 'POST'],  // Allowed HTTP methods
  credentials: true,         // Allow cookies
};

// Apply CORS middleware
app.use(cors(corsOptions));
```

**Environment Configuration (`.env`):**
```env
FRONTEND_URL=http://localhost:3000
```

**Why Do We Need CORS?**

1. **Security - Same-Origin Policy**
   - Browsers block requests from one origin (domain) to another by default
   - Example: Frontend on `localhost:3000` cannot call API on `localhost:5000`
   - CORS relaxes this policy in a controlled way

2. **Controlled Access**
   - Only specified origins can access our API
   - Prevents unauthorized websites from using our backend
   - Production example: Only `https://myapp.com` can access `https://api.myapp.com`

3. **Attack Prevention**
   - Protects against Cross-Site Request Forgery (CSRF)
   - Prevents malicious sites from making unauthorized API calls
   - Limits exposure of backend endpoints

**Without CORS:**
```
❌ Browser Error:
Access to fetch at 'http://localhost:5000/api/bears' 
from origin 'http://localhost:3000' has been blocked by CORS policy
```

**With CORS Configured:**
```
✅ Request allowed
Frontend (localhost:3000) → Backend (localhost:5000) ✓
```

**CORS Headers Sent:**
```http
Access-Control-Allow-Origin: http://localhost:3000
Access-Control-Allow-Methods: GET, POST
Access-Control-Allow-Credentials: true
```

**Production Considerations:**
- Use specific origins, never `*` in production
- Configure different origins per environment
- Consider using environment variables for flexibility

---

## 4. How does your FE communicate with your BE?

### Frontend-Backend Communication

**Communication Flow:**
```
Frontend (React/Vite)  →  Vite Proxy  →  Backend (Express)  →  Wikipedia API
   localhost:3000           /api/*        localhost:5000
```

### Method 1: Vite Development Proxy (Used in Development)

**Configuration:** `frontend/vite.config.ts`
```typescript
export default defineConfig({
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://backend:5000',  // Docker service name
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
```

**Benefits:**
- ✅ No CORS issues (same origin)
- ✅ No Content Security Policy (CSP) violations
- ✅ Simplified frontend code (relative URLs)
- ✅ Works seamlessly in Docker

### Method 2: Direct API Calls (Used in Production)

**Frontend Code:** `frontend/src/components/BearList.tsx`
```typescript
const BACKEND_API_URL = '/api/bears';  // Proxied in dev, direct in production

useEffect(() => {
  const loadBearData = async () => {
    try {
      // Fetch from backend API
      const response = await fetch(BACKEND_API_URL);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      // Use the processed data
      setBears(result.data);
    } catch (err) {
      console.error('Failed to load bear data:', err);
      setError('Failed to load bear information.');
    }
  };

  loadBearData();
}, []);
```

**Request Flow:**

1. **Frontend makes request:**
   ```javascript
   fetch('/api/bears')
   ```

2. **Vite proxy intercepts** (in development):
   - Rewrites URL: `/api/bears` → `http://backend:5000/api/bears`
   - Forwards request to backend

3. **Backend receives request:**
   - CORS middleware checks origin
   - Route handler processes request
   - Service layer calls Wikipedia API

4. **Backend returns response:**
   ```json
   {
     "success": true,
     "count": 8,
     "data": [...]
   }
   ```

5. **Frontend receives and displays data:**
   ```typescript
   setBears(result.data);
   ```

**Communication in Different Environments:**

**Development (Local):**
```
Frontend: localhost:3000
Backend:  localhost:5000
Method:   Direct fetch with Vite proxy
```

**Development (Docker):**
```
Frontend: http://frontend:3000
Backend:  http://backend:5000
Method:   Docker network, Vite proxy
```

**Production:**
```
Frontend: Nginx serving static files (port 80)
Backend:  Node.js Express (port 5000)
Method:   Direct API calls or reverse proxy
```

**Key Differences from Previous Playground:**

**Before (Playground 4):**
- Frontend directly called Wikipedia API
- 150+ lines of parsing code in frontend
- Browser CORS and CSP issues
- Tight coupling to Wikipedia's API structure

**After (Playground 5):**
- Frontend calls backend API
- Backend handles all external API calls
- Clean separation of concerns
- No CORS/CSP issues with proxy
- Easy to cache, rate-limit, or switch APIs

---

## 5. Explain and demonstrate your multi-stage Dockerfile(s). What is necessary to run your FE and BE?

### Frontend Multi-Stage Dockerfile

**File:** `frontend/Dockerfile`

```dockerfile
# ============================================
# Stage 1: Development Environment
# ============================================
FROM node:20-alpine AS development

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install all dependencies (including devDependencies)
RUN npm ci

# Copy source code
COPY . .

# Expose development port
EXPOSE 3000

# Run development server with hot reload
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]


# ============================================
# Stage 2: Build Stage
# ============================================
FROM node:20-alpine AS build

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build the application
# This creates optimized production files in dist/
RUN npm run build


# ============================================
# Stage 3: Production with Nginx
# ============================================
FROM nginx:alpine AS production

# Copy custom nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built artifacts from build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
```

**What Each Stage Does:**

**Stage 1 - Development:**
- Base: Node.js 20 Alpine (minimal Linux)
- Installs all dependencies (including dev tools)
- Mounts source code as volume for hot reload
- Runs Vite dev server with HMR
- Used with: `docker-compose.yml`

**Stage 2 - Build:**
- Compiles TypeScript to JavaScript
- Bundles all assets (CSS, images, fonts)
- Minifies and optimizes code
- Generates static files in `dist/` folder
- Tree-shaking removes unused code
- Output: Optimized production build

**Stage 3 - Production:**
- Base: Nginx Alpine (web server)
- Copies only `dist/` folder from build stage
- No Node.js runtime needed
- Serves static files with Nginx
- Fast, secure, minimal image size
- Used with: `docker-compose.prod.yml`

**Why Multi-Stage?**

1. **Image Size Optimization:**
   - Development: ~500MB (includes Node, npm, source)
   - Production: ~25MB (only Nginx + static files)

2. **Security:**
   - Production has no build tools or source code
   - Smaller attack surface

3. **Performance:**
   - Nginx serves static files faster than Node.js
   - No JavaScript runtime overhead

4. **Flexibility:**
   - Same Dockerfile for dev and prod
   - Target specific stage with `--target`

---

### Backend Multi-Stage Dockerfile

**File:** `backend/Dockerfile`

```dockerfile
# ============================================
# Stage 1: Development Environment
# ============================================
FROM node:20-alpine AS development

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install all dependencies (including devDependencies)
RUN npm ci

# Copy source code
COPY . .

# Expose backend port
EXPOSE 5000

# Run development server with tsx watch (hot reload)
CMD ["npm", "run", "dev"]


# ============================================
# Stage 2: Build Stage (TypeScript Compilation)
# ============================================
FROM node:20-alpine AS build

WORKDIR /app

# Copy package files and TypeScript config
COPY package*.json ./
COPY tsconfig.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build TypeScript to JavaScript
RUN npm run build


# ============================================
# Stage 3: Production
# ============================================
FROM node:20-alpine AS production

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install only production dependencies (no devDependencies)
RUN npm ci --only=production

# Copy built files from build stage
COPY --from=build /app/dist ./dist

# Copy environment files if needed
COPY .env* ./

# Expose backend port
EXPOSE 5000

# Set environment to production
ENV NODE_ENV=production

# Run compiled JavaScript
CMD ["node", "dist/index.js"]
```

**What Each Stage Does:**

**Stage 1 - Development:**
- Base: Node.js 20 Alpine
- Installs all dependencies (TypeScript, tsx, etc.)
- Mounts source code for hot reload
- Runs `tsx watch` for automatic TypeScript compilation
- Used with: `docker-compose.yml`

**Stage 2 - Build:**
- Compiles TypeScript to JavaScript
- Generates `dist/` folder with compiled code
- Type checking during build
- Output: Production-ready JavaScript

**Stage 3 - Production:**
- Installs only production dependencies (no TypeScript, tsx)
- Copies compiled JavaScript from build stage
- Runs with Node.js (no compilation needed)
- Smaller, faster, more secure
- Used with: `docker-compose.prod.yml`

**TypeScript Compilation:**
```
src/index.ts        →  dist/index.js
src/routes/bears.ts →  dist/routes/bears.js
src/services/       →  dist/services/
```

---

### What is Necessary to Run FE and BE?

**Development Mode:**

**Requirements:**
- Docker Desktop installed
- Docker Compose v2+
- Ports 3000 and 5000 available

**Command:**
```bash
docker-compose -f docker-compose.yml up --build
```

**What Happens:**
1. Builds both frontend and backend (development target)
2. Creates Docker network for inter-service communication
3. Starts backend on port 5000
4. Starts frontend on port 3000 (depends on backend)
5. Mounts source code for hot reload
6. Both services auto-restart on code changes

**Access:**
- Frontend: http://localhost:3000
- Backend: http://localhost:5000
- API: http://localhost:3000/api/bears (proxied)

**Necessary Files:**
- `frontend/Dockerfile` - Frontend build instructions
- `backend/Dockerfile` - Backend build instructions
- `docker-compose.yml` - Orchestration configuration
- `frontend/package.json` - Frontend dependencies
- `backend/package.json` - Backend dependencies
- `frontend/vite.config.ts` - Vite configuration with proxy
- `backend/.env` - Backend environment variables

---

**Production Mode:**

**Requirements:**
- Docker Desktop installed
- Docker Compose v2+
- Ports 80 and 5000 available

**Command:**
```bash
docker-compose -f docker-compose.prod.yml up --build
```

**What Happens:**
1. Builds frontend (all 3 stages)
   - Stage 1: Development (skipped)
   - Stage 2: Build (creates dist/)
   - Stage 3: Production (Nginx with dist/)
2. Builds backend (all 3 stages)
   - Stage 1: Development (skipped)
   - Stage 2: Build (compiles TypeScript)
   - Stage 3: Production (Node with compiled JS)
3. No volumes mounted (everything in container)
4. Health checks monitor service status
5. Auto-restart on failure

**Access:**
- Frontend: http://localhost (port 80)
- Backend: http://localhost:5000
- API: http://localhost/api/bears

**Necessary Files:**
- Same Dockerfiles (different target)
- `docker-compose.prod.yml` - Production orchestration
- `frontend/nginx.conf` - Nginx configuration
- Build artifacts generated during build

**Key Differences:**

| Aspect | Development | Production |
|--------|------------|-----------|
| **Target Stage** | development | production |
| **Volumes** | Source code mounted | No volumes |
| **Hot Reload** | ✅ Yes | ❌ No |
| **Image Size** | Large (~500MB) | Small (~25-50MB) |
| **Build Time** | Fast (cached) | Slower (full build) |
| **Frontend Server** | Vite dev server | Nginx |
| **Backend Server** | tsx watch | node dist/index.js |
| **Ports** | 3000, 5000 | 80, 5000 |
| **Environment** | development | production |

---

## 6. Explain and demonstrate your docker compose files.

### Development Docker Compose

**File:** `docker-compose.yml`

```yaml
version: '3.8'

services:
  # Backend Service (Development Mode)
  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
      target: development          # Uses Stage 1 from Dockerfile
    container_name: wildlife-backend-dev
    ports:
      - "5000:5000"               # Host:Container port mapping
    environment:
      - NODE_ENV=development      # Set environment variables
      - PORT=5000
      - FRONTEND_URL=http://localhost:3000
    volumes:
      # Mount source code for hot reload
      - ./backend/src:/app/src
      - ./backend/package.json:/app/package.json
      - ./backend/tsconfig.json:/app/tsconfig.json
      - ./backend/.env:/app/.env
      # Use named volume for node_modules to avoid conflicts
      - backend_node_modules:/app/node_modules
    networks:
      - wildlife-network         # Custom network for inter-service communication
    restart: unless-stopped      # Auto-restart policy
    command: npm run dev         # Override CMD from Dockerfile

  # Frontend Service (Development Mode)
  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
      target: development          # Uses Stage 1 from Dockerfile
    container_name: wildlife-frontend-dev
    ports:
      - "3000:3000"               # Vite dev server port
    environment:
      - NODE_ENV=development
      - VITE_BACKEND_URL=http://localhost:5000
    volumes:
      # Mount source code for hot reload
      - ./frontend/src:/app/src
      - ./frontend/public:/app/public
      - ./frontend/index.html:/app/index.html
      - ./frontend/package.json:/app/package.json
      - ./frontend/vite.config.ts:/app/vite.config.ts
      - ./frontend/tsconfig.json:/app/tsconfig.json
      - ./frontend/.env:/app/.env
      # Use named volume for node_modules
      - frontend_node_modules:/app/node_modules
    networks:
      - wildlife-network
    depends_on:
      - backend                   # Start backend first
    restart: unless-stopped
    command: npm run dev -- --host 0.0.0.0

# Define custom network
networks:
  wildlife-network:
    driver: bridge               # Bridge network for container communication

# Define named volumes
volumes:
  backend_node_modules:          # Isolate node_modules from host
  frontend_node_modules:
```

**Key Features Explained:**

**1. Build Configuration:**
```yaml
build:
  context: ./backend          # Where to find Dockerfile
  dockerfile: Dockerfile      # Name of Dockerfile
  target: development         # Which stage to build
```

**2. Port Mapping:**
```yaml
ports:
  - "5000:5000"              # host_port:container_port
```
- External: http://localhost:5000
- Internal: Container listens on 5000

**3. Environment Variables:**
```yaml
environment:
  - NODE_ENV=development
  - PORT=5000
```
- Override `.env` files
- Configure per environment

**4. Volumes (Hot Reload):**
```yaml
volumes:
  - ./backend/src:/app/src    # Sync host folder to container
```
- Changes on host → immediately in container
- `tsx watch` detects changes → auto-reload

**5. Named Volumes (node_modules):**
```yaml
volumes:
  - backend_node_modules:/app/node_modules
```
- Prevents conflicts between host and container
- Faster than syncing thousands of files
- Persists between container restarts

**6. Networks:**
```yaml
networks:
  - wildlife-network
```
- Backend and frontend on same network
- Services can communicate: `http://backend:5000`
- Isolated from host network

**7. Dependencies:**
```yaml
depends_on:
  - backend
```
- Frontend waits for backend to start
- Ensures correct startup order

**8. Restart Policy:**
```yaml
restart: unless-stopped
```
- Auto-restart if crashes
- Stops only when explicitly stopped

---

### Production Docker Compose

**File:** `docker-compose.prod.yml`

```yaml
version: '3.8'

services:
  # Backend Service (Production Mode)
  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
      target: production          # Uses Stage 3 from Dockerfile
    container_name: wildlife-backend-prod
    ports:
      - "5000:5000"
    environment:
      - NODE_ENV=production       # Production environment
      - PORT=5000
      - FRONTEND_URL=http://localhost
    env_file:
      - ./backend/.env           # Load from .env file
    networks:
      - wildlife-network
    restart: always              # Always restart on failure
    healthcheck:                 # Monitor service health
      test: ["CMD", "wget", "--quiet", "--tries=1", "--spider", "http://localhost:5000/health"]
      interval: 30s              # Check every 30 seconds
      timeout: 10s               # Timeout after 10 seconds
      retries: 3                 # Retry 3 times before unhealthy
      start_period: 40s          # Grace period on startup

  # Frontend Service (Production Mode with Nginx)
  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
      target: production          # Uses Stage 3 (Nginx)
    container_name: wildlife-frontend-prod
    ports:
      - "80:80"                  # Standard HTTP port
    environment:
      - NODE_ENV=production
    networks:
      - wildlife-network
    depends_on:
      - backend
    restart: always
    healthcheck:
      test: ["CMD", "wget", "--quiet", "--tries=1", "--spider", "http://localhost"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 20s          # Nginx starts faster

networks:
  wildlife-network:
    driver: bridge

# No volumes in production - everything baked into images
```

**Key Differences from Development:**

**1. Target Stage:**
```yaml
target: production    # vs development
```
- Uses final stage with optimized builds
- Frontend: Nginx serving static files
- Backend: Compiled JavaScript only

**2. No Volumes:**
- Everything baked into Docker image
- No hot reload needed
- Immutable deployments
- Faster, more secure

**3. Health Checks:**
```yaml
healthcheck:
  test: ["CMD", "wget", "--spider", "http://localhost:5000/health"]
  interval: 30s
  timeout: 10s
  retries: 3
```
- Monitors if service is responding
- Auto-restart if unhealthy
- Docker reports health status

**4. Restart Policy:**
```yaml
restart: always    # vs unless-stopped
```
- More aggressive restart in production
- Ensures high availability

**5. Frontend Port:**
```yaml
ports:
  - "80:80"        # vs 3000:3000
```
- Standard HTTP port
- No need to specify port in URL

---

### Usage Demonstration

**Development Workflow:**

```bash
# Start services
docker-compose -f docker-compose.yml up --build

# What you see:
# - Backend compiling TypeScript with tsx watch
# - Frontend starting Vite dev server
# - Both services connected on wildlife-network

# Access:
# Frontend: http://localhost:3000
# Backend: http://localhost:5000
# API: http://localhost:3000/api/bears (proxied)

# Make changes:
# 1. Edit frontend/src/components/BearList.tsx
# 2. Save file
# 3. Vite hot reloads instantly
# 4. See changes in browser

# View logs:
docker-compose -f docker-compose.yml logs -f

# Stop services:
docker-compose -f docker-compose.yml down

# Clean up volumes:
docker-compose -f docker-compose.yml down -v
```

**Production Workflow:**

```bash
# Start production build
docker-compose -f docker-compose.prod.yml up --build

# What you see:
# - Multi-stage builds executing
# - Frontend: Build stage creating dist/ → Nginx serving
# - Backend: TypeScript compilation → Node.js running
# - Health checks starting after grace period

# Access:
# Frontend: http://localhost (port 80)
# Backend: http://localhost:5000

# Check health:
docker-compose -f docker-compose.prod.yml ps
# Shows health status (healthy/unhealthy)

# View logs:
docker-compose -f docker-compose.prod.yml logs -f

# Stop services:
docker-compose -f docker-compose.prod.yml down
```

**Service Communication:**

Inside Docker network:
```
frontend → http://backend:5000/api/bears
```

From host:
```
Browser → http://localhost:3000 → Vite Proxy → http://backend:5000
```

**Benefits of This Setup:**

1. **Single Command Deployment:**
   - `docker-compose up` starts everything
   - No manual service coordination

2. **Isolated Environments:**
   - Dev and prod can run separately
   - Same config, different targets

3. **Network Isolation:**
   - Services communicate internally
   - Only necessary ports exposed

4. **Reproducible:**
   - Same containers work everywhere
   - Eliminates "works on my machine"

5. **Scalable:**
   - Easy to add more services (database, cache)
   - Can scale services independently

---

## Summary

All checklist items are implemented and documented:

**Backend Framework**: Express.js with TypeScript - lightweight, industry standard, excellent TypeScript support

**API Creation**: Routes → Services architecture, clean separation of concerns, proper error handling

**CORS**: Configured in `backend/src/index.ts`, restricts access to frontend origin only, prevents unauthorized access

**FE-BE Communication**: Vite proxy in development, direct calls in production, no CORS/CSP issues

**Multi-Stage Dockerfiles**: 
- Frontend: Development → Build → Nginx (3 stages)
- Backend: Development → Build → Production (3 stages)
- Optimized for size, security, and performance

**Docker Compose**: 
- Development: Hot reload, volumes, development targets
- Production: Optimized builds, health checks, no volumes, production targets
- Single command deployment for both environments
