# Backend - E-Wallet Sentiment API

Rest API backend for the E-Wallet Sentiment Analysis system. Built with Express.js and Prisma ORM.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Setup](#environment-setup)
- [Running](#running)
- [Testing](#testing)
- [API Endpoints](#api-endpoints)
- [Project Structure](#project-structure)

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **pnpm** (v8 or higher) - [Installation Guide](https://pnpm.io/installation)
- **Git** - [Download](https://git-scm.com/)

Verify installation:

```bash
node --version
pnpm --version
git --version
```

## Installation

1. **Clone the repository**

```bash
git clone <repository-url>
cd e-wallet-sentiment
```

2. **Install dependencies**

```bash
pnpm install
```

3. **Navigate to backend directory**

```bash
cd backend
```

## Environment Setup

1. **Create environment file**

```bash
cp .env.example .env
```

2. **Configure environment variables**

Edit `.env` file with your configuration:

```env
# Server
PORT=3001
NODE_ENV=development

# Database
DATABASE_URL=postgresql://user:password@localhost:5433/e_wallet_sentiment
```

3. **Setup database**

```bash
pnpm prisma migrate dev --name init
pnpm prisma db seed
```

## Running

### Generate Schema (Important)

It is important to generate the database

```bash
# still in the backend folder
pnpm db:generate

```

### Development Mode

Start the development server with hot reload using Nodemon:

```bash
pnpm dev
```

The API will be available at `http://localhost:3001`

### Production Mode

Build and run the production version:

```bash
pnpm start
```

### Check Health

Test the API health endpoint:

```bash
curl http://localhost:3001/api/health
```

Expected response:

```json
{
  "status": "ok",
  "service": "e-wallet-sentiment-backend"
}
```

## Testing

Run the test suite:

```bash
pnpm jest
```

Run tests with coverage:

```bash
pnpm jest --coverage
```

Run tests in watch mode:

```bash
pnpm jest --watch
```

## API Endpoints

### Health Check

- **GET** `/api/health` - Check API health status

## Project Structure

```
backend/
├── src/
│   ├── app.js                 # Express app factory
│   ├── server.js              # Server entry point
│   ├── config/
│   │   └── logger.config.js   # Winston logger configuration
│   ├── middlewares/
│   │   ├── error-logger.middleware.js    # Error handling middleware
│   │   └── logging.middleware.js         # Request logging middleware
│   ├── modules/               # Feature modules
│   └── utils/
│       ├── api-error.js       # Custom API error class
│       └── status-code.js     # HTTP status code constants
├── tests/
│   ├── health.test.js         # Health endpoint tests
│   └── setup.js               # Jest test setup
├── package.json               # Dependencies
├── jest.config.js             # Jest configuration
├── .eslintrc.js               # ESLint configuration
├── .prettierrc                # Prettier configuration
└── README.md                  # This file
```

## Scripts

- `pnpm dev` - Start development server
- `pnpm start` - Start production server
- `pnpm test` - Run tests
- `pnpm jest` - Run Jest tests
- `pnpm lint` - Run ESLint

## Troubleshooting

### Port already in use

If port 3001 is already in use, change the PORT in `.env`:

```env
PORT=3002
```

### Database connection error

Ensure your `DATABASE_URL` in `.env` is correct and the database server is running.

### Dependencies not installing

Clear cache and reinstall:

```bash
pnpm store prune
pnpm install
```
