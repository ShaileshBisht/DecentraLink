# DecentraLink - Decentralized Social Media Platform

A modern, decentralized social media platform built with Web3 technologies. DecentraLink allows users to connect through their crypto wallets, share posts, interact through likes and comments, all while maintaining true ownership of their social presence.

## 🌟 Features

### 🔐 Web3 Authentication

- **Wallet-based Login** - Connect with MetaMask, WalletConnect, and other popular wallets
- **Signature-based Authentication** - Secure login without passwords
- **JWT Token Management** - Seamless session handling

### 📱 Social Features

- **Post Creation** - Share thoughts with 280 character limit
- **Real-time Feed** - Live updates with auto-refresh
- **Like System** - Express appreciation for posts
- **Comment System** - Engage in conversations
- **User Profiles** - Customizable profiles with usernames and bios

### 🎨 Modern UI/UX

- **Glassmorphism Design** - Cutting-edge Web3 aesthetic
- **Responsive Layout** - Mobile-first design approach
- **Smooth Animations** - Enhanced user experience
- **Dark Theme** - Optimized for crypto-native users

### 🛡️ Security & Privacy

- **Decentralized Identity** - No central authority controls your data
- **Wallet Signature Verification** - Cryptographic proof of identity
- **Secure API** - JWT-protected endpoints with input validation

## 🏗️ Architecture

### Frontend (`fe/`)

- **Framework**: Next.js 14 with React 18
- **Styling**: Tailwind CSS v4 with custom Web3 themes
- **Web3 Integration**: RainbowKit + Wagmi + Viem
- **UI Components**: Radix UI + shadcn/ui
- **Language**: TypeScript

### Backend (`be/`)

- **Framework**: NestJS with Express
- **Database**: PostgreSQL with TypeORM
- **Authentication**: JWT with wallet signature verification
- **API**: RESTful with comprehensive validation
- **Language**: TypeScript

## 🚀 Quick Start

### Prerequisites

- Node.js 18.0+
- PostgreSQL 12+
- Web3 wallet (MetaMask recommended)

### 1. Clone the Repository

```bash
git clone https://github.com/ShaileshBisht/DecentraLink.git
cd DecentraLink
```

### 2. Backend Setup

```bash
cd be
npm install
cp .env.example .env
# Configure your .env file with database credentials
npm run start:dev
```

### 3. Frontend Setup

```bash
cd fe
npm install
cp .env.example .env.local
# Configure your .env.local file
npm run dev
```

### 4. Access the Application

- Frontend: [http://localhost:3000](http://localhost:3000)
- Backend API: [http://localhost:3001](http://localhost:3001)

## 📚 Documentation

- **[Frontend Setup Guide](./fe/README.md)** - Detailed frontend installation and configuration
- **[Backend API Documentation](./be/README.md)** - Complete backend setup and API reference
- **[Database Schema](./be/database-schema.sql)** - Database structure and relationships

## 🗄️ Database Schema

```sql
-- Users table for wallet-based profiles
CREATE TABLE users (
  wallet_address VARCHAR(42) PRIMARY KEY,
  username VARCHAR(50),
  bio TEXT,
  profile_pic_url TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Posts table for user content
CREATE TABLE posts (
  id SERIAL PRIMARY KEY,
  wallet_address VARCHAR(42) REFERENCES users(wallet_address),
  content TEXT NOT NULL,
  timestamp TIMESTAMP DEFAULT NOW()
);

-- Comments table for post interactions
CREATE TABLE comments (
  id SERIAL PRIMARY KEY,
  post_id INTEGER REFERENCES posts(id),
  wallet_address VARCHAR(42) REFERENCES users(wallet_address),
  content TEXT NOT NULL,
  timestamp TIMESTAMP DEFAULT NOW()
);

-- Likes table for post appreciation
CREATE TABLE likes (
  post_id INTEGER REFERENCES posts(id),
  wallet_address VARCHAR(42) REFERENCES users(wallet_address),
  created_at TIMESTAMP DEFAULT NOW(),
  PRIMARY KEY (post_id, wallet_address)
);
```

## 🔗 API Endpoints

### Authentication

- `POST /auth/verify` - Verify wallet signature and get JWT token

### Users

- `GET /users/:wallet` - Get user profile
- `GET /users/:wallet/stats` - Get user statistics
- `POST /users` - Create/update profile (authenticated)

### Posts

- `GET /posts` - Get all posts with details
- `GET /posts/:id` - Get specific post
- `POST /posts` - Create new post (authenticated)
- `POST /posts/:id/like` - Like/unlike post (authenticated)
- `POST /posts/:id/comment` - Comment on post (authenticated)

## 🛠️ Development

### Frontend Development

```bash
cd fe
npm run dev        # Start development server
npm run build      # Build for production
npm run lint       # Run ESLint
npm run type-check # TypeScript checking
```

### Backend Development

```bash
cd be
npm run start:dev     # Start with hot reload
npm run build         # Build application
npm run test          # Run tests
npm run migration:run # Run database migrations
```

## 🌐 Technology Stack

### Frontend Technologies

- **Next.js 14** - React framework with app directory
- **React 18** - UI library with hooks and context
- **TypeScript** - Type safety and better DX
- **Tailwind CSS** - Utility-first CSS framework
- **RainbowKit** - Wallet connection interface
- **Wagmi** - React hooks for Ethereum
- **Viem** - TypeScript interface for Ethereum
- **Radix UI** - Accessible component primitives
- **shadcn/ui** - Beautiful component library

### Backend Technologies

- **NestJS** - Progressive Node.js framework
- **Express** - Web application framework
- **TypeScript** - Type safety and better DX
- **PostgreSQL** - Robust relational database
- **TypeORM** - Object-relational mapping
- **JWT** - JSON Web Token authentication
- **Passport** - Authentication middleware
- **Class Validator** - Input validation

## 🔐 Security Features

### Frontend Security

- Wallet signature verification
- JWT token management
- Input sanitization
- XSS protection

### Backend Security

- JWT authentication with configurable secrets
- Input validation with DTOs
- SQL injection prevention
- CORS configuration
- Rate limiting ready

## 🚨 Common Issues & Solutions

### Wallet Connection Issues

- Ensure Web3 wallet is installed and unlocked
- Check network compatibility
- Verify wallet permissions

### API Connection Issues

- Confirm backend server is running on port 3001
- Check CORS configuration
- Verify JWT token validity

### Database Issues

- Ensure PostgreSQL is running
- Check database credentials in .env
- Run migrations if tables are missing

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow TypeScript conventions
- Add proper error handling
- Write tests for new features
- Update documentation
- Use conventional commit messages

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- **Web3 Community** - For inspiring decentralized social media
- **Ethereum Foundation** - For enabling blockchain innovation
- **Next.js Team** - For the amazing React framework
- **NestJS Team** - For the progressive Node.js framework
- **Tailwind CSS** - For utility-first styling
- **Radix UI** - For accessible component primitives

## 📞 Support

- Create an issue on GitHub for bug reports
- Star the repository if you find it useful
- Follow the project for updates

---

**Built with ❤️ for the Web3 community by [Shailesh Bisht](https://github.com/ShaileshBisht)**

_DecentraLink - Where Web3 meets Social Media_ 🚀
