FROM node:22.12-slim AS base

RUN apt-get update -y && apt-get install -y openssl ca-certificates && rm -rf /var/lib/apt/lists/*

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
ENV PRISMA_SKIP_POSTINSTALL_GENERATE=true

# Install pnpm directly instead of using corepack to avoid signature verification issues
RUN npm install -g pnpm

WORKDIR /app

# 1. Copy file konfigurasi workspace dari root
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# 2. Copy source code backend dan database
COPY backend ./backend
COPY database ./database

# Install dependencies dengan pnpm 9.15.4
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN pnpm install --frozen-lockfile

# 4. Generate Prisma Client (dummy DATABASE_URL karena generate tidak connect ke DB)
RUN DATABASE_URL="postgresql://dummy:dummy@localhost:5432/dummy" pnpm run --filter=e-wallet-sentiment-database generate

# 5. Pindah ke direktori backend
WORKDIR /app/backend

EXPOSE 3001

CMD ["sh", "-c", "cd /app/database && npx prisma migrate deploy && cd /app/backend && node src/server.js"]


