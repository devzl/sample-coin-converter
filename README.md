# Sample Coin Converter

![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-000000?style=flat&logo=next.js&logoColor=white)
![React](https://img.shields.io/badge/React-61DAFB?style=flat&logo=react&logoColor=black)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat&logo=tailwind-css&logoColor=white)

A modern React application demonstrating cryptocurrency asset conversion with real-time pricing and Web3 wallet integration. Features bank-grade precision calculations using BigInt arithmetic and a modular component architecture.

Built with **Next.js 15**, **React 19**, **TypeScript**, and **shadcn/ui**.

## 🎯 Demo Application

This is a **demonstration project** showcasing modern React development practices and DeFi integration patterns. It implements production-grade architectural patterns while serving as an educational example.

**Key Highlights:**
- ✅ BigInt precision mathematics (no floating-point errors)  
- ✅ Web3 wallet integration with ConnectKit + wagmi
- ✅ Modular component architecture with TypeScript
- ✅ Comprehensive testing with vitest
- ✅ Real-time price data from CoinGecko API

**Demo Limitations:**
- Not all edge cases covered.
- Mock wallet transactions (no real swaps)  
- Demo use - not production-ready

## 🚀 Quick Start

```bash
# Clone and install
git clone git@github.com:devzl/sample-coin-converter.git
cd sample-coin-converter
bun install

# Start development server
bun dev
```

Then open [http://localhost:3000](http://localhost:3000) in your browser!

## Features

### ✅ Core Functionality
- **Multi-Asset Support**: Convert between USD/wBTC, USD/ETH, and USD/SOL pairs
- **BigInt Precision**: Bank-grade mathematical accuracy using viem's parseUnits/formatUnits
- **Web3 Wallet Integration**: ConnectKit + wagmi for Ethereum wallet connectivity
- **Collapsible Asset Selection**: Clean interface with expandable asset pair selector
- **Smart Currency Toggle**: Intelligent conversion transfer between asset modes
- **Enhanced UI**: Modern, responsive design with asset-specific icons
- **Precise Decimal Handling**: USD (2), wBTC (8), ETH (18), SOL (9) decimal precision
- **Robust Error Handling**: Comprehensive error states and user-friendly error messages

### 🔗 Web3 Integration
- **Wallet Connection**: Support for MetaMask, Vultisig, WalletConnect, and injected wallets
- **Network Validation**: Automatic Ethereum Mainnet detection and switching
- **Blockchain Awareness**: Asset-specific network requirements with clear messaging
- **Demo Mode**: Safe demonstration of conversion flow without real transactions
- **Cross-Chain Support**: Proper handling of assets on different blockchains (Ethereum vs Solana)
- **Wallet Monitoring**: Comprehensive wallet state monitoring with configurable callbacks

### 🏗️ Modular Architecture
- **Reusable Components**: Broken down into focused, reusable UI components
- **Utility Libraries**: Centralized network, wallet, toast, and conversion utilities
- **Custom Hooks**: Specialized hooks for wallet monitoring and asset pricing
- **Configurable Assets**: Easy to add new cryptocurrencies and asset pairs
- **Generic API Layer**: Extensible price fetching for any asset pair
- **Type-Safe Configuration**: Full TypeScript interfaces for assets and pairs

### 🧮 Mathematical Precision
- **BigInt Arithmetic**: No floating-point errors in calculations
- **Viem Integration**: Industry-standard library for precise token calculations
- **Multi-Decimal Support**: Proper scaling between different asset decimal places
- **Small Amount Handling**: Scientific notation for precise small amount display
- **Currency Formatting**: Proper comma formatting for large USD amounts

### 🚀 Technical Features
- **Real-time Data**: Auto-refreshing price data every 30 seconds with smooth animations
- **Manual Refresh**: Instant refresh button with loading state
- **React Query Integration**: Efficient data fetching with caching and retry logic
- **TypeScript**: Full type safety throughout the application
- **Comprehensive Testing**: Unit tests with vitest and @testing-library/react
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Modern UI Components**: Built with shadcn/ui for consistent design system

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS with shadcn/ui components
- **State Management**: React hooks + React Query
- **Web3**: wagmi + viem + ConnectKit for wallet integration
- **Testing**: vitest + @testing-library/react + jsdom
- **Code Formatting**: Prettier for consistent code style
- **Precision Math**: viem (parseUnits/formatUnits) for BigInt calculations
- **UI Components**: shadcn/ui (Alert, Button, Card, Input, Label, Sonner)
- **API**: CoinGecko API for real-time cryptocurrency pricing
- **Icons**: Lucide React
- **Notifications**: Sonner for toast notifications

## Project Structure

```
src/
├── app/
│   ├── globals.css          # Global styles
│   ├── layout.tsx           # Root layout with QueryProvider
│   └── page.tsx             # Main page with asset selector
├── components/
│   ├── ui/                  # shadcn/ui components
│   │   ├── alert.tsx        # Alert component for notifications
│   │   ├── asset-pair-selector.tsx  # Reusable asset pair selector
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   ├── label.tsx
│   │   └── sonner.tsx       # Toast notifications
│   ├── asset/               # Asset converter components
│   │   ├── configurable-asset-converter.tsx # Main orchestrator component
│   │   ├── price-display.tsx        # Price display with refresh
│   │   ├── currency-input.tsx       # Asset input with validation
│   │   ├── conversion-result.tsx    # Result display with BigInt precision
│   │   ├── error-display.tsx        # Error handling
│   │   ├── currency-switch-button.tsx # Currency switching
│   │   └── contract-info.tsx        # Contract information
│   ├── layout/              # Layout components
│   │   └── header.tsx               # Top navigation with wallet connection
│   ├── providers/           # Context providers
│   │   └── web3-provider.tsx        # Web3 wallet provider
│   └── wallet/              # Web3 wallet components
│       └── conversion-wallet-modal.tsx  # Modal for wallet requirements
├── hooks/
│   ├── useAssetPrice.ts     # Generic React Query hook for asset pricing
│   └── useWalletMonitor.ts  # Comprehensive wallet monitoring hook
├── lib/
│   ├── asset-api.ts         # Generic asset API functions
│   ├── bigint-conversion-utils.ts   # BigInt precision calculations with viem
│   ├── network-utils.ts     # Network information and validation utilities
│   ├── wallet-utils.ts      # Wallet address formatting and utilities
│   ├── toast-utils.ts       # Centralized toast configurations
│   ├── ui-constants.ts      # Standardized UI constants and configurations
│   ├── wagmi-config.ts      # Web3 wallet configuration
│   └── utils.ts             # General utility functions
├── providers/
│   └── query-provider.tsx   # React Query provider
├── test/
│   └── setup.ts             # Test setup configuration
└── types/
    └── asset.ts             # Asset configuration types with BigInt interfaces
```

## Installation & Setup

### Prerequisites
- **Node.js 18+** or **Bun runtime**
- **Git**

### Get Started

```bash
# Clone the repository
git clone git@github.com:devzl/sample-coin-converter.git
cd sample-coin-converter

# Install dependencies (Bun recommended)
bun install

# Start development server
bun dev
```

**🎉 That's it!** Open [http://localhost:3000](http://localhost:3000) to see the app.

### Optional: WalletConnect Setup

For mobile wallet QR code support, add a WalletConnect Project ID:

```bash
# Create environment file
echo "NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id_here" > .env.local
```

> **Note**: The app works perfectly with browser wallets (MetaMask, Vultisig, etc.) without any setup. WalletConnect is only needed for mobile wallet connections.

## Asset Configuration

### Supported Assets
- **USD**: US Dollar (2 decimal places)
- **wBTC**: Wrapped Bitcoin (8 decimal places)
  - Contract: `0x2260fac5e5542a773aa44fbcfedf7c193bc2c599` (Ethereum)
- **ETH**: Ethereum (18 decimal places)
- **SOL**: Solana (9 decimal places)

### Configurable Asset Pairs
- **USD/wBTC**: USD to Wrapped Bitcoin conversion
- **USD/ETH**: USD to Ethereum conversion  
- **USD/SOL**: USD to Solana conversion

### API Configuration
- **Price Data**: CoinGecko API with configurable endpoints
- **Update Frequency**: 30 seconds auto-refresh
- **Retry Strategy**: Exponential backoff with 3 retry attempts
- **Caching**: React Query with 5-minute cache retention

## Usage

### 💰 Converting Assets

1. **Select Asset Pair**: Click "Change Asset Pair" to choose USD/wBTC, USD/ETH, or USD/SOL
2. **Enter Amount**: Type the amount you want to convert
3. **Convert**: Click "Convert to [Asset]" to see real-time conversion
4. **Switch**: Use "Switch Currencies" to reverse the conversion direction

### 🔗 Web3 Features

1. **Connect Wallet**: Click "Connect Wallet" in the top-right corner
2. **Demo Conversion**: After converting, click "🎯 Simulate Conversion with Wallet"
3. **Network Switching**: Automatically prompts to switch to correct network
4. **Safe Demo**: All transactions are simulated - no real assets are moved

### ⚡ Key Features

- **Real-time Prices**: Auto-updates every 30 seconds with smooth animations
- **BigInt Precision**: Bank-grade calculations with no floating-point errors
- **Smart Switching**: Converted amounts transfer seamlessly when switching currencies
- **Multi-Asset Support**: USD, wBTC (8 decimals), ETH (18 decimals), SOL (9 decimals)
- **Responsive Design**: Works on desktop and mobile devices

## Mathematical Precision

### BigInt Implementation
- **viem Integration**: Uses `parseUnits` and `formatUnits` for precise calculations
- **No Floating-Point Errors**: All calculations use BigInt arithmetic
- **Proper Scaling**: Handles different decimal places (USD: 2, wBTC: 8, ETH: 18, SOL: 9)
- **Small Amount Handling**: Scientific notation for amounts smaller than display precision
- **Large Amount Formatting**: Comma-separated thousands for USD amounts

### Precision Benefits
- **Bank-Grade Accuracy**: No rounding errors in cryptocurrency calculations
- **Consistent Results**: Identical calculations across different environments
- **Future-Proof**: Supports high-precision assets and complex calculations
- **Industry Standard**: Uses the same precision libraries as major DeFi protocols

## Testing

### Test Setup
- **Framework**: vitest with jsdom for DOM testing
- **Library**: @testing-library/react for component testing
- **Configuration**: TypeScript support with path aliases
- **Coverage**: Mathematical precision and type safety validation

### Available Test Commands
```bash
# Run all tests
bun test

# Run tests with UI
bun test:ui

# Run tests once (CI mode)
bun test:run
```

### Test Coverage
- **BigInt Conversion Utils**: 25 tests covering parsing, formatting, validation, and calculations
- **Asset Configuration**: 7 tests validating asset pair configurations and type safety
- **Error Handling**: Comprehensive error condition testing
- **Mathematical Precision**: Validation of precise calculations with various decimal places

## Error Handling

### Input Validation
- Required field validation with proper empty state handling
- Numeric value validation
- Decimal precision limits per asset type
- Real-time validation feedback
- BigInt parsing error handling

### Network Errors
- API failure handling with user-friendly messages
- Retry mechanism for failed requests
- Loading states during data fetching
- Toast notifications for user feedback

### Precision Errors
- BigInt conversion error handling
- Decimal overflow protection
- Invalid input sanitization
- Graceful degradation for unsupported operations

## Development

### Available Scripts
```bash
# Development server
bun dev

# Production build
bun build

# Start production server
bun start

# Linting
bun lint

# Code formatting with Prettier
bun format            # Format all files
bun format:check      # Check formatting without changes

# Testing
bun test
bun test:ui
bun test:run
```

### Adding New Assets
1. **Define Asset**: Add new asset to `ASSETS` in `src/types/asset.ts`
   ```typescript
   SOLANA: {
     id: 'solana',
     symbol: 'SOL',
     name: 'Solana',
     decimals: 9,
     icon: 'https://...',
     apiId: 'solana',
   }
   ```

2. **Create Asset Pair**: Add to `ASSET_PAIRS`
   ```typescript
   'USD_SOL': {
     base: ASSETS.USD,
     quote: ASSETS.SOL,
     apiEndpoint: 'https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd',
     priceKey: 'solana.usd',
   }
   ```

3. **Update Tests**: Add test cases for new asset configurations
4. **Update Image Config**: Add hostname to `next.config.ts` if using external images

### Code Formatting
The project uses **Prettier** for consistent code formatting across all files:

- **Configuration**: `.prettierrc.json` - Standard rules (single quotes, 2-space tabs, 100 char width)
- **Ignore File**: `.prettierignore` - Excludes node_modules, .next, build files
- **Automatic Formatting**: Most editors can be configured to format on save
- **Manual Formatting**: Use `bun format` to format all files or `bun format:check` to verify formatting

### Adding New Features
1. **API functions**: Add to `src/lib/asset-api.ts`
2. **Components**: Create in `src/components/asset/`
3. **Hooks**: Add to `src/hooks/`
4. **Types**: Define in `src/types/`
5. **Utilities**: Add to appropriate utility files in `src/lib/`
6. **Tests**: Create corresponding test files
7. **Format Code**: Run `bun format` before committing
8. Follow TypeScript strict mode conventions

## Performance Optimizations

- **React Query**: Caching and background updates
- **Component Optimization**: Proper memo usage and state management
- **API Rate Limiting**: Controlled refresh intervals
- **Bundle Size**: Tree-shaking and code splitting
- **BigInt Efficiency**: Optimized precision calculations
- **Modular Architecture**: Better code splitting and lazy loading

## Browser Support

- Chrome/Edge 88+
- Firefox 84+
- Safari 14+
- Mobile browsers with modern JavaScript support
- BigInt support required (available in all modern browsers)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Run the test suite
6. Submit a pull request

## License

This project is provided as-is. All rights reserved.

## Contact

For questions or support, please contact the development team.
