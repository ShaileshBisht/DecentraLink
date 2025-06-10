# DecentraLink Backend

A robust NestJS backend API for the DecentraLink decentralized social media platform. Features JWT authentication with wallet signature verification, PostgreSQL database, and RESTful APIs for posts, comments, likes, and user management.

## 🚀 Features

- **Wallet Authentication** - Ethereum signature-based authentication
- **JWT Token Management** - Secure session handling
- **PostgreSQL Database** - Robust data persistence with TypeORM
- **RESTful APIs** - Complete CRUD operations for social features
- **Input Validation** - DTOs with class-validator
- **CORS Support** - Frontend integration ready
- **Error Handling** - Comprehensive error responses

## 📋 Prerequisites

- Node.js 18.0 or higher
- PostgreSQL 12 or higher
- npm or yarn package manager

## 🛠️ Installation

1. **Navigate to backend directory:**

   ```bash
   cd be
   ```

2. **Install dependencies:**

   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables:**

   ```bash
   cp .env.example .env
   ```

4. **Set up PostgreSQL database:**
   ```bash
   # Create database (adjust credentials as needed)
   createdb decentralink_dev
   ```

## 🔧 Environment Configuration

Create a `.env` file in the `be` directory with the following variables:

```bash
# Database Configuration
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=your_password
DATABASE_NAME=decentralink_dev

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=24h

# Server Configuration
PORT=3001
NODE_ENV=development

# CORS Configuration
FRONTEND_URL=http://localhost:3000

# Optional: Logging
LOG_LEVEL=debug
```

### Environment Variables Details:

#### Database Configuration

- **DATABASE_HOST**: PostgreSQL server host (default: localhost)
- **DATABASE_PORT**: PostgreSQL server port (default: 5432)
- **DATABASE_USERNAME**: Database username
- **DATABASE_PASSWORD**: Database password
- **DATABASE_NAME**: Database name

#### JWT Configuration

- **JWT_SECRET**: Secret key for JWT token signing (MUST be changed in production)
- **JWT_EXPIRES_IN**: Token expiration time (e.g., '24h', '7d', '30m')

#### Server Configuration

- **PORT**: Server port (default: 3001)
- **NODE_ENV**: Environment (development/production/test)

#### CORS Configuration

- **FRONTEND_URL**: Frontend application URL for CORS

## 🏃‍♂️ Running the Application

### Development Mode

```bash
# Start the development server with hot reload
npm run start:dev
# or
yarn start:dev
```

The server will be available at [http://localhost:3001](http://localhost:3001)

### Production Mode

```bash
# Build the application
npm run build
# or
yarn build

# Start the production server
npm run start:prod
# or
yarn start:prod
```

### Database Operations

```bash
# Run database migrations
npm run migration:run
# or
yarn migration:run

# Revert last migration
npm run migration:revert
# or
yarn migration:revert

# Generate new migration
npm run migration:generate -- --name=MigrationName
# or
yarn migration:generate --name=MigrationName
```

## 📁 Project Structure

```
be/
├── src/
│   ├── auth/                # Authentication module
│   │   ├── auth.controller.ts
│   │   ├── auth.module.ts
│   │   ├── auth.service.ts
│   │   └── jwt.strategy.ts
│   ├── dto/                 # Data Transfer Objects
│   │   ├── auth.dto.ts
│   │   └── post.dto.ts
│   ├── entities/            # Database entities
│   │   ├── Comment.entity.ts
│   │   ├── Like.entity.ts
│   │   ├── Post.entity.ts
│   │   └── User.entity.ts
│   ├── posts/               # Posts module
│   │   ├── posts.controller.ts
│   │   ├── posts.module.ts
│   │   └── posts.service.ts
│   ├── users/               # Users module
│   │   ├── users.controller.ts
│   │   ├── users.module.ts
│   │   └── users.service.ts
│   ├── app.module.ts        # Root module
│   └── main.ts              # Application entry point
├── migrations/              # Database migrations
├── .env                     # Environment variables
├── nest-cli.json           # NestJS CLI configuration
├── package.json            # Dependencies and scripts
└── tsconfig.json           # TypeScript configuration
```

## 🗄️ Database Schema

### Users Table

```sql
CREATE TABLE users (
  wallet_address VARCHAR(42) PRIMARY KEY,
  username VARCHAR(50),
  bio TEXT,
  profile_pic_url TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Posts Table

```sql
CREATE TABLE posts (
  id SERIAL PRIMARY KEY,
  wallet_address VARCHAR(42) REFERENCES users(wallet_address),
  content TEXT NOT NULL,
  timestamp TIMESTAMP DEFAULT NOW()
);
```

### Comments Table

```sql
CREATE TABLE comments (
  id SERIAL PRIMARY KEY,
  post_id INTEGER REFERENCES posts(id),
  wallet_address VARCHAR(42) REFERENCES users(wallet_address),
  content TEXT NOT NULL,
  timestamp TIMESTAMP DEFAULT NOW()
);
```

### Likes Table

```sql
CREATE TABLE likes (
  post_id INTEGER REFERENCES posts(id),
  wallet_address VARCHAR(42) REFERENCES users(wallet_address),
  created_at TIMESTAMP DEFAULT NOW(),
  PRIMARY KEY (post_id, wallet_address)
);
```

## 🔐 Authentication Flow

### 1. Wallet Signature Verification

```typescript
POST /auth/verify
{
  "walletAddress": "0x...",
  "signature": "0x...",
  "message": "Welcome to Decentralized Social Media!..."
}
```

### 2. JWT Token Response

```typescript
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "wallet_address": "0x...",
    "username": "user123"
  }
}
```

### 3. Authenticated Requests

```bash
Authorization: Bearer <jwt_token>
```

## 📖 API Documentation

### Authentication Endpoints

#### POST /auth/verify

Verify wallet signature and get JWT token.

**Request Body:**

```typescript
{
  walletAddress: string;
  signature: string;
  message: string;
}
```

**Response:**

```typescript
{
  access_token: string;
  user: {
    wallet_address: string;
    username?: string;
  }
}
```

### User Endpoints

#### GET /users/:wallet

Get user profile by wallet address.

#### GET /users/:wallet/stats

Get user statistics (posts count, likes given).

#### POST /users

Create or update user profile (requires authentication).

**Request Body:**

```typescript
{
  username?: string;
  bio?: string;
  profile_pic_url?: string;
}
```

### Post Endpoints

#### GET /posts

Get all posts with user details, likes, and comments.

#### GET /posts/:id

Get specific post by ID.

#### POST /posts

Create new post (requires authentication).

**Request Body:**

```typescript
{
  content: string;
}
```

#### POST /posts/:id/like

Like/unlike a post (requires authentication).

#### POST /posts/:id/comment

Comment on a post (requires authentication).

**Request Body:**

```typescript
{
  content: string;
}
```

## 🔧 Development Scripts

```bash
# Development
npm run start:dev          # Start development server with hot reload
npm run start:debug        # Start with debugging enabled

# Production
npm run build             # Build the application
npm run start:prod        # Start production server

# Testing
npm run test              # Run unit tests
npm run test:e2e          # Run end-to-end tests
npm run test:cov          # Run tests with coverage

# Code Quality
npm run lint              # Run ESLint
npm run format            # Format code with Prettier

# Database
npm run migration:run     # Run pending migrations
npm run migration:revert  # Revert last migration
npm run migration:generate # Generate new migration
```

## 🛡️ Security Features

### JWT Security

- Configurable secret key
- Token expiration
- Wallet address verification

### Input Validation

- DTO validation with class-validator
- SQL injection prevention with TypeORM
- XSS protection with input sanitization

### CORS Configuration

- Configurable allowed origins
- Credential support for authenticated requests

## 🚨 Common Issues

### 1. Database Connection Issues

```bash
# Check PostgreSQL status
pg_ctl status

# Restart PostgreSQL
brew services restart postgresql  # macOS
sudo systemctl restart postgresql  # Linux
```

### 2. Migration Issues

```bash
# Reset database (development only)
npm run migration:revert
npm run migration:run

# Check migration status
npm run migration:show
```

### 3. JWT Token Issues

- Ensure JWT_SECRET is set and consistent
- Check token expiration time
- Verify Bearer token format in requests

### 4. CORS Issues

- Verify FRONTEND_URL matches your frontend
- Check allowed origins in main.ts
- Ensure credentials are enabled if needed

## 🔧 Configuration

### TypeORM Configuration

Database configuration is handled through environment variables and TypeORM options in `app.module.ts`.

### JWT Configuration

JWT strategy and module configuration in `auth/auth.module.ts` and `auth/jwt.strategy.ts`.

### CORS Configuration

CORS settings in `main.ts` with environment-based origin configuration.

## 📦 Dependencies

### Core Dependencies

- **@nestjs/core**: NestJS framework
- **@nestjs/typeorm**: TypeORM integration
- **@nestjs/jwt**: JWT authentication
- **@nestjs/passport**: Passport authentication
- **pg**: PostgreSQL driver

### Development Dependencies

- **@nestjs/cli**: NestJS CLI tools
- **@types/node**: Node.js type definitions
- **typescript**: TypeScript compiler
- **eslint**: Code linting
- **prettier**: Code formatting

## 🧪 Testing

```bash
# Unit tests
npm run test

# End-to-end tests
npm run test:e2e

# Test coverage
npm run test:cov

# Watch mode for development
npm run test:watch
```

## 🤝 Contributing

1. Follow NestJS conventions and best practices
2. Use TypeScript for all code
3. Add proper validation with DTOs
4. Write tests for new features
5. Update documentation as needed

## 📄 License

This project is part of the DecentraLink social media platform.

---

For frontend setup and usage, see the [Frontend README](../fe/README.md).
