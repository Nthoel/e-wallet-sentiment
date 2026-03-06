# Panduan Kontribusi - Backend E-Wallet Sentiment

Terima kasih telah ingin berkontribusi pada proyek Backend E-Wallet Sentiment! Dokumen ini menjelaskan langkah-langkah, standar, dan hal-hal penting yang perlu Anda perhatikan.

## Daftar Isi

- [Langkah-Langkah Kontribusi](#langkah-langkah-kontribusi)
- [Arsitektur Proyek](#arsitektur-proyek)
- [Tata Penulisan Kode](#tata-penulisan-kode)
- [Cara Menjalankan Proyek](#cara-menjalankan-proyek)
- [Hal-Hal Penting Sebelum Push](#hal-hal-penting-sebelum-push)
- [Testing](#testing)
- [Troubleshooting](#troubleshooting)

---

## Langkah-Langkah Kontribusi

### 1. Fork dan Clone Repository

```bash
# Fork repository di GitHub
# Kemudian clone fork Anda
git clone https://github.com/USERNAME/e-wallet-sentiment.git
cd e-wallet-sentiment
```

### 2. Buat Branch untuk Fitur/Fix

```bash
# Update dev branch terlebih dahulu
git checkout dev
git pull origin dev

# Buat branch baru dengan naming convention yang jelas
git checkout -b feature/nama-fitur
# atau untuk bug fix
git checkout -b fix/deskripsi-bug
```

**Naming Convention untuk Branch:**

- `feature/nama-fitur` - untuk fitur baru
- `fix/deskripsi-bug` - untuk perbaikan bug
- `refactor/deskripsi` - untuk refactoring
- `docs/deskripsi` - untuk dokumentasi
- `test/deskripsi` - untuk penambahan test

### 3. Install Dependencies

```bash
# Install seluruh dependencies di workspace
pnpm install

# Navigate ke direktori backend
cd backend
```

### 4. Buat Perubahan Kode

- Ikuti standar kode yang ditentukan (lihat [Tata Penulisan Kode](#tata-penulisan-kode))
- Buat unit test untuk fitur baru
- Perbarui dokumentasi jika diperlukan

### 5. Commit Perubahan

```bash
# Format commit message dengan jelas dan deskriptif
git add .
git commit -m "feat: deskripsi fitur yang ditambahkan"
# atau
git commit -m "fix: deskripsi bug yang diperbaiki"
```

**Commit Message Convention:**

- `feat:` - untuk fitur baru
- `fix:` - untuk perbaikan bug
- `docs:` - untuk dokumentasi
- `style:` - untuk perubahan styling (spasi, semicolon, dll)
- `refactor:` - untuk refactoring kode
- `test:` - untuk penambahan test
- `chore:` - untuk task lainnya (dependencies, build, dll)

### 6. Push dan Buat Pull Request

```bash
# Push branch ke remote
git push origin feature/nama-fitur

# Buat Pull Request di GitHub dengan deskripsi yang jelas
```

**Deskripsi PR harus mencakup:**

- Apa yang diubah dan mengapa
- Permasalahan yang dipecahkan (jika ada)
- Cara untuk menguji perubahan
- Screenshot atau video (jika relevan)

---

## Arsitektur Proyek

### Struktur Direktori

```
backend/
├── src/
│   ├── app.js              # Express app initialization
│   ├── server.js           # Server entry point
│   ├── config/             # Konfigurasi aplikasi
│   │   └── logger.config.js
│   ├── middlewares/        # Express middlewares
│   │   ├── error-logger.middleware.js
│   │   └── logging.middleware.js
│   ├── modules/            # Business logic modules
│   │   └── (fitur atau domain)
│   │       ├── fitur-x.controller.js
│   │       ├── fitur-x.service.js
│   │       ├── fitur-x.route.js
│   │       └── fitur-x.validation.js
│   └── utils/              # Utility functions
│       ├── api-error.js
│       └── status-code.js
├── tests/                  # Unit tests
│   ├── health.test.js
│   └── setup.js
├── .env.example            # Template environment variables
├── eslint.config.js        # ESLint configuration
├── jest.config.js          # Jest testing configuration
├── .prettierrc              # Prettier configuration
└── package.json
```

### Pola Arsitektur

Backend menggunakan pola **MVC (Model-View-Controller)** dengan struktur modular:

**Per Module:**

- **Controller** - Menangani HTTP requests dan responses
- **Service** - Business logic dan data processing
- **Route** - Mendefinisikan endpoints
- **Validation** - Validasi input menggunakan Zod

**Example:**

```
modules/
└── transactions/
    ├── transaction.controller.js
    ├── transaction.service.js
    ├── transaction.route.js
    └── transaction.validation.js
```

### Prisma ORM

- Schema didefinisikan di `/database/schema.prisma`
- Prisma Client di-generate otomatis
- Migrasi database menggunakan `prisma migrate`

---

## Tata Penulisan Kode

### ESLint & Prettier Configuration

Proyek ini menggunakan **ESLint** untuk code linting dan **Prettier** untuk code formatting.

**Prettier Settings:**

```json
{
  "semi": true,
  "singleQuote": true,
  "printWidth": 80,
  "tabWidth": 2,
  "useTabs": false,
  "trailingComma": "none",
  "bracketSpacing": true,
  "arrowParens": "avoid",
  "endOfLine": "lf"
}
```

### JavaScript Style Guide

#### 1. Naming Convention

```javascript
// Constants - UPPER_CASE
const MAX_RETRY_ATTEMPTS = 3;
const DEFAULT_TIMEOUT = 5000;

// Variables, Functions - camelCase
const userData = { name: 'John' };
const getUserById = userId => {}; // Gunakan Arrow Functions

// Classes - PascalCase
class UserService {}

// Private methods - prefix dengan underscore
class UserService {
  _validateEmail(email) {}
}

const _unusedVar = 10; // gunakan _ (underscore) jika variable atau fungsi yang tidak gunakan
```

#### 2. Function & Arrow Function

```javascript
// Lebih baik menggunakan fungsi panah untuk ekspresi fungsi.
const calculateSum = (a, b) => a + b;

// Hilangkan tanda kurung untuk parameter tunggal
const double = x => x * 2;

// Gunakan named function untuk named exports
async function getUserData(userId) {
  // implementation
}
```

#### 3. Const vs Let vs Var

```javascript
// Selalu gunakan const (default)
const user = { name: 'John' };

// Gunakan let hanya jika variable reassignment diperlukan
let retryCount = 0;
retryCount++;

// Jangan pernah gunakan var
// ❌ var oldStyle = 'avoid';
```

#### 4. Object & Array

```javascript
// Destructuring
const { name, email } = user;
const { data, status } = response;

// Spread operator
const newUser = { ...user, email: 'new@example.com' };
const combined = [...array1, ...array2];

// Object shorthand
const createUser = (name, email) => ({ name, email });
```

#### 5. String

```javascript
// Gunakan template literals
const message = `User ${name} created successfully`;

// Bukan string concatenation
// ❌ const message = 'User ' + name + ' created successfully';
```

#### 6. Async/Await

```javascript
// Gunakan async/await daripada .then()
async function fetchUserData(userId) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });
    return user;
  } catch (error) {
    logger.error('Failed to fetch user:', error);
    throw error;
  }
}

// Jangan gunakan promise chains
// ❌ return fetch(url).then(res => res.json()).then(data => ...);
```

#### 7. Comments

```javascript
// Gunakan JSDoc untuk function documentation
/**
 * Fetch user data by ID
 * @param {string} userId - The user ID to fetch
 * @returns {Promise<Object>} User data object
 * @throws {ApiError} If user not found
 */
async function getUserById(userId) {
  // implementation
}
```

#### 8. Error Handling

```javascript
// Gunakan custom error class
const { ApiError } = require('../utils/api-error');

// Throw dengan context yang jelas
if (!user) {
  throw new ApiError('User not found', 404, 'USER_NOT_FOUND');
}

// Try-catch untuk async operations
try {
  await saveUser(data);
} catch (error) {
  logger.error('User save failed:', error);
  throw new ApiError('Failed to save user', 500);
}
```

#### 9. Validation

```javascript
// Gunakan Zod untuk schema validation
const { z } = require('zod');

const createUserSchema = z.object({
  email: z.string().email('Invalid email'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  age: z.number().min(18, 'Must be at least 18 years old')
});

// Validate di route/controller
const validator = schema => (req, res, next) => {
  const result = schema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({ errors: result.error.flatten() });
  }
  req.validated = result.data;
  next();
};
```

### Formatting Otomatis

Sebelum commit, lakukan:

```bash
# Format kode dengan Prettier
pnpm format

# Fix linting issues
pnpm lint:fix

# Jalankan linter untuk check
pnpm lint
```

---

## Cara Menjalankan Proyek

### Development Environment Setup

#### 1. Install Node.js dan pnpm

```bash
# Node.js v18 atau lebih tinggi
node --version

# pnpm v8 atau lebih tinggi
npm install -g pnpm
pnpm --version
```

#### 2. Setup Environment Variables

```bash
# Copy template environment
cp .env.example .env

# Edit .env dengan nilai sesuai konfigurasi lokal
# DATABASE_URL=<your-database-url>
# NODE_ENV=development
# PORT=3000
```

#### 3. Install Dependencies

```bash
# Root workspace
pnpm install

# Backend directory
cd backend
pnpm install
```

#### 4. Setup Database

```bash
# Jalankan migrations
pnpm --filter e-wallet-sentiment-database db:migrate:dev

# Generate Prisma Client
pnpm db:generate

# (Optional) Seed database
pnpm --filter e-wallet-sentiment-database seed
```

#### 5. Jalankan Development Server

```bash
# Dari backend directory
pnpm dev

# Server akan berjalan di http://localhost:3000
```

### Perintah Useful

```bash
# Development
pnpm dev              # Run with nodemon (auto-reload)

# Production
pnpm start            # Run production server

# Testing
pnpm test             # Run all tests
pnpm test:watch      # Run tests in watch mode
pnpm test:coverage   # Generate coverage report

# Code Quality
pnpm lint            # Check linting issues
pnpm lint:fix        # Fix linting issues
pnpm format          # Format code with Prettier

# Database
pnpm db:generate     # Generate Prisma Client
```

---

## Hal-Hal Penting Sebelum Push

### Pre-Push Checklist

Sebelum melakukan `git push`, pastikan:

#### 1. ✅ Code Quality

```bash
# Jalankan linter
pnpm lint

# Jika ada error, fix otomatis
pnpm lint:fix

# Format kode
pnpm format
```

#### 2. ✅ Testing

```bash
# Jalankan semua tests
pnpm test

# Atau run tests untuk file spesifik
pnpm test src/modules/users/

# Check code coverage
pnpm test:coverage
```

Pastikan:

- Semua tests **PASS** ✅
- Jangan ada reduce di code coverage
- Unit test coverage minimal **80%**

#### 3. ✅ Tidak Ada Console Logs (Debug)

```javascript
// ❌ JANGAN di-push
console.log('Debug:', userData);
console.error('Error:', error);

// Gunakan logger instance
logger.debug('User data:', userData);
logger.error('Error occurred:', error);
```

#### 4. ✅ Environment Variables

```javascript
// ✅ GOOD - Gunakan dotenv
const PORT = process.env.PORT || 3000;

// ❌ BAD - Hardcoded secrets
const apiKey = 'sk_live_1234567890';

// ✅ Tempatkan di .env
// API_KEY=sk_live_1234567890
```

#### 5. ✅ Tidak Ada Unused Variables/Imports

ESLint akan catch ini, pastikan:

```bash
pnpm lint
```

```javascript
// ❌ Remove unused imports
import { Service } from './service'; // Jika tidak digunakan
const unusedVar = 5; // Jika tidak digunakan

// ✅ Hapus yang tidak perlu
import { UserService } from './services';
```

#### 6. ✅ Validasi dan Error Handling

Setiap endpoint harus punya:

```javascript
/**
 * Buat user baru
 * @route POST /api/users
 * @param {Object} req.body - User data
 * @returns {Object} Created user
 */
router.post('/', validator(createUserSchema), async (req, res, next) => {
  try {
    const user = await userService.createUser(req.validated);
    res.status(201).json({
      status: 'success',
      data: user
    });
  } catch (error) {
    next(error); // Pass ke error middleware
  }
});
```

#### 7. ✅ Database Changes

Jika ada perubahan database:

```bash
# Create migration
pnpm --filter e-wallet-sentiment-database migrate:dev --name "deskripsi_perubahan"

# Verify migration
pnpm --filter e-wallet-sentiment-database migrate:status

# JANGAN modify migration files secara manual
```

Commit perubahan di folder:

- `/database/schema.prisma`
- `/database/migrations/`

#### 8. ✅ Lock Files

```bash
# Jangan hapus atau modify pnpm-lock.yaml secara manual
# Selalu gunakan pnpm untuk install/update:
pnpm add package-name
pnpm update

# Commit pnpm-lock.yaml jika ada perubahan
```

#### 9. ✅ Commit Messages Jelas

```bash
# ✅ GOOD - Clear dan descriptive
git commit -m "feat: add user authentication with JWT"
git commit -m "fix: handle null user in getUserById endpoint"
git commit -m "docs: update API documentation for transactions"

# ❌ BAD - Vague messages
git commit -m "fix stuff"
git commit -m "update files"
git commit -m "WIP"
```

#### 10. ✅ Pull Request Template

Ketika buat PR, ikuti template:

```markdown
## Deskripsi

Jelaskan apa yang diubah dan mengapa.

## Tipe Perubahan

- [ ] Bug fix (perbaikan non-breaking)
- [ ] Feature baru (non-breaking)
- [ ] Breaking change
- [ ] Documentation update

## Perubahan yang Dibuat

- Item 1
- Item 2

## Cara Menguji

Langkah-langkah untuk test:

1. ...
2. ...

## Screenshots (jika relevan)

[Add screenshots here]

## Checklist

- [ ] Code linted (pnpm lint)
- [ ] Tests pass (pnpm test)
- [ ] Tidak ada console.log debug
- [ ] Environment variables di .env.example
- [ ] Documentation di-update jika perlu
```

---

## Testing

### Unit Testing dengan Jest

#### Struktur Test File

```javascript
/**
 * tests/modules/users/user.service.test.js
 */
const UserService = require('../../../src/modules/users/user.service');
const { PrismaClient } = require('@prisma/client');

// Mock Prisma
jest.mock('@prisma/client');

describe('UserService', () => {
  let userService;
  let mockPrisma;

  beforeAll(() => {
    mockPrisma = new PrismaClient();
    userService = new UserService(mockPrisma);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getUserById', () => {
    it('should return user when found', async () => {
      const userId = '123';
      const mockUser = { id: userId, name: 'John Doe' };

      mockPrisma.user.findUnique.mockResolvedValue(mockUser);

      const result = await userService.getUserById(userId);

      expect(result).toEqual(mockUser);
      expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({
        where: { id: userId }
      });
    });

    it('should throw error when user not found', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);

      await expect(userService.getUserById('999')).rejects.toThrow(
        'User not found'
      );
    });
  });
});
```

#### Run Tests

```bash
# Run semua tests
pnpm test

# Run tests untuk file tertentu
pnpm test user.service.test.js

# Run dengan watch mode (development)
pnpm test:watch

# Generate coverage report
pnpm test:coverage
```

### Coverage Requirements

```bash
# Minimum coverage harus:
pnpm test:coverage

# Output akan menunjukkan:
# Statements  : 80% +
# Branches    : 75% +
# Functions   : 80% +
# Lines       : 80% +
```

---

## Troubleshooting

### Common Issues

#### 1. Database Connection Error

```
Error: Can't reach database server
```

**Solution:**

```bash
# Verify DATABASE_URL di .env
cat .env | grep DATABASE_URL

# Reset database
pnpm --filter e-wallet-sentiment-database migrate:reset

# Check Prisma status
pnpm --filter e-wallet-sentiment-database migrate:status
```

#### 2. Node Modules Issues

```
Error: Cannot find module
```

**Solution:**

```bash
# Clean install
rm -rf node_modules pnpm-lock.yaml
pnpm install

# Update pnpm
pnpm install -g pnpm@latest

# Clear pnpm store
pnpm store prune
```

#### 3. Port Already in Use

```
Error: listen EADDRINUSE: address already in use :::3000
```

**Solution:**

```bash
# Find process using port 3000
lsof -i :3000  # macOS/Linux
netstat -ano | findstr :3000  # Windows

# Kill process
kill <PID>  # macOS/Linux
taskkill /PID <PID> /F  # Windows

# Atau gunakan port berbeda
PORT=4000 pnpm dev
```

#### 4. ESLint/Prettier Conflict

```
Linting error: conflicting rules
```

**Solution:**

```bash
# Format dulu
pnpm format

# Kemudian lint
pnpm lint:fix
```

#### 5. Prisma Migration Issues

```
Error: Migration failed
```

**Solution:**

```bash
# View migration status
pnpm --filter e-wallet-sentiment-database migrate:status

# Resolve conflict (HANYA di development)
pnpm --filter e-wallet-sentiment-database migrate:reset

# Jangan reset di production!
```

---

## Contact & Support

Jika ada pertanyaan atau butuh bantuan:

1. Check existing issues di GitHub
2. Buka issue baru dengan detail yang jelas
3. Hubungi tim development

---

**Happy Coding! 🚀**

Terima kasih atas kontribusi Anda untuk membuat proyek ini lebih baik!
