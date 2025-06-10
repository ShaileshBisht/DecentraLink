# Decentralized Social Media MVP

A decentralized social media platform built with Next.js, NestJS, and Ethereum blockchain technology. Users can connect their wallets, create profiles, post messages, and interact with others in a trustless environment.

## 🚀 Features

- **Wallet Authentication**: Connect and authenticate using Ethereum wallets via RainbowKit
- **User Profiles**: Create and update user profiles with username, bio, and profile picture
- **Post Creation**: Share short messages (up to 280 characters)
- **Social Interactions**: Like and comment on posts
- **Real-time Feed**: View all posts in chronological order
- **Responsive Design**: Mobile-first design with Tailwind CSS

## 🛠 Tech Stack

### Frontend

- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **RainbowKit** - Wallet connection UI
- **wagmi** - React hooks for Ethereum
- **ethers.js** - Ethereum library

### Backend

- **NestJS** - Node.js framework
- **TypeScript** - Type-safe development
- **PostgreSQL** - Database
- **TypeORM** - Database ORM
- **JWT** - Authentication tokens
- **ethers.js** - Signature verification

## 📁 Project Structure

```
decentralized-social-mvp/
├── fe/                 # Frontend (Next.js)
│   ├── src/
│   │   ├── app/        # App Router pages
│   │   ├── components/ # React components
│   │   ├── lib/        # Utilities and API
│   │   └── providers/  # Context providers
│   └── package.json
├── be/                 # Backend (NestJS)
│   ├── src/
│   │   ├── auth/       # Authentication module
│   │   ├── users/      # User management
│   │   ├── posts/      # Post management
│   │   ├── entities/   # Database entities
│   │   └── dto/        # Data transfer objects
│   └── package.json
└── README.md
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL database
- Ethereum wallet (MetaMask, etc.)

### 1. Clone the Repository

```bash
git clone <repository-url>
cd decentralized-social-mvp
```

### 2. Setup Backend

```bash
cd be

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Update .env with your database credentials
# DB_HOST=localhost
# DB_PORT=5432
# DB_USERNAME=postgres
# DB_PASSWORD=your_password
# DB_NAME=decentralized_social
# JWT_SECRET=your-secret-key

# Start the backend
npm run start:dev
```

The backend will run on `http://localhost:3001`

### 3. Setup Frontend

```bash
cd ../fe

# Install dependencies
npm install

# Copy environment file
cp .env.example .env.local

# Update .env.local with your configuration
# NEXT_PUBLIC_API_URL=http://localhost:3001
# NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id

# Start the frontend
npm run dev
```

The frontend will run on `http://localhost:3000`

### 4. Database Setup

Create a PostgreSQL database named `decentralized_social`. The application will automatically create the required tables on first run.

### 5. WalletConnect Setup

1. Go to [WalletConnect Cloud](https://cloud.walletconnect.com)
2. Create a new project
3. Copy the Project ID
4. Update `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` in your `.env.local`

## 📖 Usage

1. **Connect Wallet**: Click "Connect Wallet" and select your preferred wallet
2. **Sign In**: Sign the authentication message to verify your identity
3. **Create Profile**: Add your username, bio, and profile picture (optional)
4. **Post Messages**: Share your thoughts with the community
5. **Interact**: Like and comment on posts from other users

## 🔧 API Endpoints

### Authentication

- `POST /auth/verify` - Verify wallet signature

### Users

- `GET /users/:wallet` - Get user profile
- `POST /users` - Create/update user profile

### Posts

- `GET /posts` - Get all posts
- `GET /posts/:id` - Get specific post
- `POST /posts` - Create new post
- `POST /posts/:id/like` - Like a post
- `POST /posts/:id/comment` - Comment on a post

## 🗄 Database Schema

### Users Table

- `wallet_address` (Primary Key)
- `username`
- `bio`
- `profile_pic_url`
- `created_at`
- `updated_at`

### Posts Table

- `id` (Primary Key)
- `wallet_address` (Foreign Key)
- `content`
- `timestamp`

### Likes Table

- `post_id` (Primary Key)
- `wallet_address` (Primary Key)
- `created_at`

### Comments Table

- `id` (Primary Key)
- `post_id` (Foreign Key)
- `wallet_address` (Foreign Key)
- `content`
- `timestamp`

## 🔒 Security Features

- **Wallet-based Authentication**: No passwords, only cryptographic signatures
- **Message Signing**: Verify user identity through wallet signatures
- **JWT Tokens**: Secure API access with time-limited tokens
- **Input Validation**: Comprehensive validation on all user inputs
- **CORS Protection**: Configured for secure cross-origin requests

## 🚧 Development

### Backend Development

```bash
cd be
npm run start:dev    # Development mode with hot reload
npm run build        # Build for production
npm run start:prod   # Production mode
```

### Frontend Development

```bash
cd fe
npm run dev          # Development mode
npm run build        # Build for production
npm run start        # Production mode
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- Built with modern web3 technologies
- Inspired by decentralized social media principles
- Community-driven development approach
