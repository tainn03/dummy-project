# Dockerfile for Next.js frontend and Express backend
# Multi-stage build for production

# ---------- Base ----------
FROM node:20-alpine AS base
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --ignore-scripts

# ---------- Builder (for frontend) ----------
FROM base AS builder
COPY . .
RUN npm run build

# ---------- Production ----------
FROM node:20-alpine AS production
WORKDIR /app
COPY --from=builder /app .
ENV NODE_ENV=production
EXPOSE 3000 4000
CMD ["npm", "run", "start"]
