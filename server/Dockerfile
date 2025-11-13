FROM node:20-alpine

# Create app directory
WORKDIR /usr/src/app

# Install dependencies
COPY package*.json ./
COPY prisma ./prisma
RUN npm ci --production --no-audit --no-fund

# Copy source
COPY . .

# Build TypeScript
RUN npm run build

EXPOSE 4000

ENV NODE_ENV=production
ENV PORT=4000

CMD ["node", "dist/index.js"]
