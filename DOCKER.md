# Docker Setup Instructions

## Development Mode

Start both frontend and backend in development mode with hot reload:

```bash
docker-compose up --build
```

Or run in detached mode:
```bash
docker-compose up -d --build
```

Access the application:
- Frontend: http://localhost:3000
- Backend: http://localhost:5000

Stop the containers:
```bash
docker-compose down
```

Remove volumes (clean start):
```bash
docker-compose down -v
```

## Production Mode

Start both services in production mode:

```bash
docker-compose -f docker-compose.prod.yml up --build
```

Or run in detached mode:
```bash
docker-compose -f docker-compose.prod.yml up -d --build
```

Access the application:
- Frontend: http://localhost (port 80)
- Backend: http://localhost:5000

Stop the containers:
```bash
docker-compose -f docker-compose.prod.yml down
```

## Individual Service Management

### Build only backend:
```bash
docker-compose build backend
```

### Build only frontend:
```bash
docker-compose build frontend
```

### Start only backend:
```bash
docker-compose up backend
```

### View logs:
```bash
docker-compose logs -f
docker-compose logs -f backend
docker-compose logs -f frontend
```

## Environment Variables

### Backend (.env in backend/)
```
NODE_ENV=development
PORT=5000
FRONTEND_URL=http://localhost:3000
```

### Frontend (.env in root)
```
VITE_BACKEND_URL=http://localhost:5000
```

## Architecture

- **Frontend**: React + TypeScript + Vite
  - Development: Vite dev server with HMR
  - Production: Nginx serving static files from dist/
  
- **Backend**: Express + TypeScript
  - Development: tsx watch with hot reload
  - Production: Compiled JavaScript with Node

- **Network**: Both services connected via `wildlife-network`

- **Volumes**: 
  - Development: Source code mounted for hot reload
  - Production: No volumes, everything in container
