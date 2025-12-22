# Multi-stage Dockerfile for Express Backend

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

# Copy package files
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

# Install only production dependencies
RUN npm ci --only=production

# Copy built files from build stage
COPY --from=build /app/dist ./dist

# Copy .env file if needed
COPY .env* ./

# Expose backend port
EXPOSE 5000

# Set environment to production
ENV NODE_ENV=production

# Run compiled JavaScript
CMD ["node", "dist/index.js"]
