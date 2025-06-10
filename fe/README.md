# DecentraLink Frontend

A modern Web3 social media frontend built with Next.js 14, React 18, and Tailwind CSS. Features wallet authentication, real-time post feeds, and a beautiful glassmorphism UI design.

## 🚀 Features

- **Web3 Wallet Authentication** - Connect with MetaMask, WalletConnect, and other popular wallets
- **Real-time Post Feed** - Live updates with auto-refresh functionality
- **Modern UI/UX** - Glassmorphism design with smooth animations
- **Responsive Design** - Mobile-first approach with desktop optimization
- **TypeScript** - Fully typed for better development experience
- **Component Library** - Built with Radix UI and shadcn/ui components

## 📋 Prerequisites

- Node.js 18.0 or higher
- npm or yarn package manager
- A Web3 wallet (MetaMask recommended)

## 🛠️ Installation

1. **Clone the repository and navigate to frontend directory:**

   ```bash
   cd fe
   ```

2. **Install dependencies:**

   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables:**
   ```bash
   cp .env.example .env.local
   ```

## 🔧 Environment Configuration

Create a `.env.local` file in the `fe` directory with the following variables:

```bash
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3001

# WalletConnect Configuration (Optional - for WalletConnect v2)
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_walletconnect_project_id

# Application Configuration
NEXT_PUBLIC_APP_NAME="DecentraLink"
NEXT_PUBLIC_APP_DESCRIPTION="Decentralized Social Media Platform"

# Network Configuration (Optional)
NEXT_PUBLIC_CHAIN_ID=1
NEXT_PUBLIC_NETWORK_NAME="mainnet"
```

### Environment Variables Details:

- **NEXT_PUBLIC_API_URL**: Backend API endpoint (required)
- **NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID**: Get from [WalletConnect Cloud](https://cloud.walletconnect.com/) (optional but recommended)
- **NEXT_PUBLIC_APP_NAME**: Application name displayed in the UI
- **NEXT_PUBLIC_APP_DESCRIPTION**: Application description for metadata
- **NEXT_PUBLIC_CHAIN_ID**: Ethereum chain ID (1 for mainnet, 11155111 for sepolia)
- **NEXT_PUBLIC_NETWORK_NAME**: Network name for display purposes

## 🏃‍♂️ Running the Application

### Development Mode

```bash
npm run dev
# or
yarn dev
```

The application will be available at [http://localhost:3000](http://localhost:3000)

### Production Build

```bash
# Build the application
npm run build
# or
yarn build

# Start the production server
npm start
# or
yarn start
```

### Linting and Code Quality

```bash
# Run ESLint
npm run lint
# or
yarn lint

# Fix ESLint issues automatically
npm run lint:fix
# or
yarn lint:fix

# Run TypeScript type checking
npm run type-check
# or
yarn type-check
```

## 📁 Project Structure

```
fe/
├── src/
│   ├── app/                 # Next.js 14 app directory
│   │   ├── globals.css      # Global styles and Tailwind imports
│   │   ├── layout.tsx       # Root layout component
│   │   ├── page.tsx         # Home page
│   │   └── profile/         # Profile page directory
│   ├── components/          # React components
│   │   ├── ui/              # shadcn/ui components
│   │   ├── PostCard.tsx     # Individual post component
│   │   ├── PostComposer.tsx # Create new post component
│   │   ├── PostFeed.tsx     # Post feed container
│   │   └── WalletConnect.tsx # Wallet connection component
│   ├── lib/                 # Utility libraries
│   │   ├── api.ts           # API service functions
│   │   └── utils.ts         # General utility functions
│   └── providers/           # React context providers
│       ├── AuthProvider.tsx # Authentication context
│       └── Web3Provider.tsx # Web3/Wagmi configuration
├── public/                  # Static assets
├── tailwind.config.js       # Tailwind CSS configuration
├── tsconfig.json           # TypeScript configuration
├── next.config.js          # Next.js configuration
└── package.json            # Dependencies and scripts
```

## 🎨 Styling

The application uses:

- **Tailwind CSS v4** - Utility-first CSS framework
- **Custom CSS Variables** - For theming and Web3 aesthetic
- **Glassmorphism Effects** - Modern UI design patterns
- **Responsive Design** - Mobile-first approach

Key CSS features:

- Custom gradient backgrounds
- Glassmorphism effects with backdrop-blur
- Smooth animations and transitions
- Web3-native color schemes

## 🔗 Web3 Integration

### Wallet Support

- MetaMask
- WalletConnect
- Coinbase Wallet
- Other EIP-1193 compatible wallets

### Authentication Flow

1. Connect wallet using RainbowKit
2. Sign authentication message
3. Verify signature with backend
4. Store JWT token for API requests

### Key Libraries

- **@rainbow-me/rainbowkit** - Wallet connection UI
- **wagmi** - React hooks for Ethereum
- **viem** - TypeScript interface for Ethereum

## 📱 Features Overview

### Authentication

- Wallet-based authentication
- Signature-based login
- JWT token management
- Session persistence

### Social Features

- Create posts (280 character limit)
- Like posts
- Comment on posts
- Real-time feed updates
- User profiles

### UI/UX Features

- Loading skeletons
- Error handling
- Responsive design
- Dark theme optimized for Web3
- Smooth animations

## 🚨 Common Issues

### 1. Wallet Connection Issues

- Ensure you have a Web3 wallet installed
- Check that you're on the correct network
- Try refreshing the page and reconnecting

### 2. API Connection Issues

- Verify `NEXT_PUBLIC_API_URL` is correct
- Ensure the backend server is running
- Check browser network tab for API errors

### 3. Build Issues

- Clear `.next` directory: `rm -rf .next`
- Clear node_modules: `rm -rf node_modules && npm install`
- Check TypeScript errors: `npm run type-check`

## 🔧 Development Tips

1. **Hot Reload**: The development server supports hot reload for fast development
2. **TypeScript**: Use TypeScript for better development experience
3. **Component Development**: Components are organized by feature and reusability
4. **State Management**: Uses React Context for global state (auth, web3)
5. **API Integration**: Centralized API service in `src/lib/api.ts`

## 📦 Dependencies

### Core Dependencies

- **next**: Next.js framework
- **react**: React library
- **typescript**: TypeScript support
- **tailwindcss**: CSS framework

### Web3 Dependencies

- **@rainbow-me/rainbowkit**: Wallet connection
- **wagmi**: React hooks for Ethereum
- **viem**: Ethereum TypeScript interface

### UI Dependencies

- **@radix-ui/\***: Primitive UI components
- **lucide-react**: Icon library
- **class-variance-authority**: Component variants

## 🤝 Contributing

1. Follow the existing code style
2. Use TypeScript for all new code
3. Add proper error handling
4. Test on multiple devices/browsers
5. Update documentation as needed

## 📄 License

This project is part of the DecentraLink social media platform.

---

For backend setup and API documentation, see the [Backend README](../be/README.md).
