# Storage Service Dockerfile
FROM node:20-alpine AS base

# Set working directory
WORKDIR /app

# Install dependencies for production
RUN apk add --no-cache tini curl

# Tini is used to properly handle signals
ENTRYPOINT ["/sbin/tini", "--"]

# Set environment variables
ENV NODE_ENV=production

# Create a non-root user and group
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Create temp storage directory
RUN mkdir -p /app/temp && chown -R appuser:appgroup /app/temp

# Build stage for TypeScript compilation
FROM base AS builder

# Install build dependencies
RUN apk add --no-cache python3 make g++

# Copy package files
COPY package*.json ./

# Install all dependencies (including devDependencies)
RUN npm ci

# Copy source code
COPY tsconfig.json ./
COPY src ./src

# Build the application
RUN npm run build

# Production stage
FROM base AS production

# Copy package files
COPY package*.json ./

# Install only production dependencies
RUN npm ci --only=production

# Copy built application from builder stage
COPY --from=builder /app/dist ./dist

# Add health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
  CMD curl -f http://localhost:3000/health || exit 1

# Set ownership to non-root user
RUN chown -R appuser:appgroup /app

# Switch to non-root user
USER appuser

# Volume for temporary storage
VOLUME ["/app/temp"]

# Command to run the application
CMD ["node", "dist/index.js"]

