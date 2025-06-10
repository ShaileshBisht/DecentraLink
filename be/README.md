# Decentralized Social Media - Backend API

A NestJS-based backend API for a decentralized social media platform that supports wallet-based authentication, posts, comments, and likes.

## 🚀 Features

- **Wallet-based Authentication**: Sign-in with crypto wallet signatures
- **JWT Token Management**: Secure API access with JWT tokens
- **Posts Management**: Create, read, and interact with posts
- **Social Features**: Like and comment on posts
- **User Profiles**: Manage user profiles and statistics
- **PostgreSQL Database**: Reliable data persistence
- **TypeORM Integration**: Type-safe database operations

## 📋 Prerequisites

Before running the backend, ensure you have:

- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **PostgreSQL** (v12 or higher)
- **Git**

## 🛠️ Installation

1. **Clone the repository and navigate to the backend directory:**

   ```bash
   git clone <repository-url>
   cd decentralized-social-mvp/be
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Set up environment variables:**

   Create a `.env` file in the `be` directory:

   ```bash
   cp .env.example .env
   ```

   Update the `.env` file with your configuration:

   ```env
   # Database Configuration
   DB_HOST=localhost
   DB_PORT=5432
   DB_USERNAME=postgres
   DB_PASSWORD=your_password
   DB_NAME=decentralized_social

   # JWT Configuration
   JWT_SECRET=your-super-secret-jwt-key-here
   JWT_EXPIRES_IN=7d

   # Application Configuration
   NODE_ENV=development
   PORT=3001

   # CORS Configuration (optional)
   FRONTEND_URL=http://localhost:3000
   ```

## 🗄️ Database Setup

1. **Create PostgreSQL database:**

   ```sql
   CREATE DATABASE decentralized_social;
   ```

2. **Database tables will be created automatically** when you start the application (thanks to TypeORM's `synchronize: true` in development mode).

   Alternatively, you can run the provided SQL schema manually:

   ```bash
   psql -U postgres -d decentralized_social -f database-schema.sql
   ```

## 🏃‍♂️ Running the Application

### Development Mode

```bash
# Start the development server with hot reload
npm run start:dev

# The API will be available at http://localhost:3001
```

### Production Mode

```bash
# Build the application
npm run build

# Start the production server
npm run start:prod
```

### Debug Mode

```bash
# Start with debugging enabled
npm run start:debug
```

## 🧪 Testing

```bash
# Run unit tests
npm run test

# Run unit tests with coverage
npm run test:cov

# Run end-to-end tests
npm run test:e2e

# Run tests in watch mode
npm run test:watch
```

## 📁 Project Structure

```
be/
├── src/
│   ├── auth/                # Authentication module
│   │   ├── auth.controller.ts
│   │   ├── auth.module.ts
│   │   ├── auth.service.ts
│   │   ├── jwt-auth.guard.ts
│   │   └── jwt.strategy.ts
│   ├── dto/                 # Data Transfer Objects
│   │   ├── auth.dto.ts
│   │   └── post.dto.ts
│   ├── entities/            # Database entities
│   │   ├── user.entity.ts
│   │   ├── post.entity.ts
│   │   ├── like.entity.ts
│   │   └── comment.entity.ts
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

Like a post (requires authentication).

#### DELETE /posts/:id/like

Unlike a post (requires authentication).

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
- Automatic token validation
- Wallet address extraction from tokens

### Data Validation

- Input validation using class-validator
- SQL injection prevention through TypeORM
- XSS protection through input sanitization

### CORS Protection

- Configurable CORS origins
- Secure headers

## 🌍 Environment Variables

| Variable         | Description           | Default                 | Required |
| ---------------- | --------------------- | ----------------------- | -------- |
| `DB_HOST`        | PostgreSQL host       | `localhost`             | Yes      |
| `DB_PORT`        | PostgreSQL port       | `5432`                  | Yes      |
| `DB_USERNAME`    | Database username     | `postgres`              | Yes      |
| `DB_PASSWORD`    | Database password     | -                       | Yes      |
| `DB_NAME`        | Database name         | `decentralized_social`  | Yes      |
| `JWT_SECRET`     | JWT signing secret    | -                       | Yes      |
| `JWT_EXPIRES_IN` | Token expiration time | `7d`                    | No       |
| `NODE_ENV`       | Environment mode      | `development`           | No       |
| `PORT`           | Application port      | `3001`                  | No       |
| `FRONTEND_URL`   | Frontend URL for CORS | `http://localhost:3000` | No       |

## 🚀 Deployment

### Docker Deployment

1. **Build the Docker image:**

   ```bash
   docker build -t decentralized-social-api .
   ```

2. **Run with Docker Compose:**
   ```bash
   docker-compose up -d
   ```

### Manual Deployment

1. **Install dependencies:**

   ```bash
   npm ci --only=production
   ```

2. **Build the application:**

   ```bash
   npm run build
   ```

3. **Set production environment variables**

4. **Start the application:**
   ```bash
   npm run start:prod
   ```

## 🔍 Health Check

The API includes a health check endpoint:

```bash
GET /health
```

Returns API status and database connectivity information.

## 🐛 Troubleshooting

### Database Connection Issues

1. **Check PostgreSQL is running:**

   ```bash
   sudo service postgresql status
   ```

2. **Verify database credentials in `.env`**

3. **Test database connection:**
   ```bash
   psql -U postgres -d decentralized_social
   ```

### Authentication Issues

1. **Verify JWT secret is set in `.env`**
2. **Check token expiration settings**
3. **Ensure frontend is sending correct wallet signatures**

### Development Issues

1. **Clear node_modules and reinstall:**

   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

2. **Check TypeScript compilation:**
   ```bash
   npm run build
   ```

## 📝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

This project is licensed under the MIT License.

---

For frontend setup instructions, see the [Frontend README](../fe/README.md).
