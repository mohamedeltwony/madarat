FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Set environment variables with fallbacks
ENV NEXT_PUBLIC_SITE_URL=https://madaratalkon.com
ENV NEXT_PUBLIC_USE_DEMO_DATA=true

# Build the application with SSR
RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

# Copy built app
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

# Run as non-root user for security
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
RUN chown -R nextjs:nodejs /app
USER nextjs

# Set the correct permission for nextjs cache
RUN mkdir -p /app/.next/cache
RUN chmod -R 777 /app/.next/cache

# Expose the port
EXPOSE 3000

# Command to run the application
CMD ["npm", "start"] 