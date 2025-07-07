# Configurable Asset Converter

A modern, modular React application for converting between multiple cryptocurrency assets with real-time pricing data. Built with Next.js 15, React 19, TypeScript, and shadcn/ui components.

## Features

### ✅ Core Functionality
- **Multi-Asset Support**: Convert between USD/wBTC, USD/ETH, and USD/SOL pairs
- **Web3 Wallet Integration**: ConnectKit + wagmi for Ethereum wallet connectivity
- **Collapsible Asset Selection**: Clean interface with expandable asset pair selector
- **Smart Currency Toggle**: Intelligent conversion transfer between asset modes
- **Enhanced UI**: Modern, responsive design with asset-specific icons
- **Configurable Precision**: Asset-specific decimal formatting (USD: 2, crypto: 8)
- **Robust Error Handling**: Comprehensive error states and user-friendly error messages

### 🔗 Web3 Integration
- **Wallet Connection**: Support for MetaMask, WalletConnect, and injected wallets
- **Network Validation**: Automatic Ethereum Mainnet detection and switching
- **Blockchain Awareness**: Asset-specific network requirements with clear messaging
- **Demo Mode**: Safe demonstration of conversion flow without real transactions
- **Cross-Chain Support**: Proper handling of assets on different blockchains (Ethereum vs Solana)
- **User Experience**: Intuitive wallet status indicators and network switching prompts

### 🏗️ Modular Architecture
- **Reusable Components**: Broken down into focused, reusable UI components
- **Configurable Assets**: Easy to add new cryptocurrencies and asset pairs
- **Generic API Layer**: Extensible price fetching for any asset pair
- **Type-Safe Configuration**: Full TypeScript interfaces for assets and pairs

### 🚀 Technical Features
- **Real-time Data**: Auto-refreshing price data every 30 seconds with smooth animations
- **Manual Refresh**: Instant refresh button with loading state
- **React Query Integration**: Efficient data fetching with caching and retry logic
- **TypeScript**: Full type safety throughout the application
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Modern UI Components**: Built with shadcn/ui for consistent design system

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS with shadcn/ui components
- **State Management**: React hooks + React Query
- **Web3**: wagmi + viem + ConnectKit for wallet integration
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
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   ├── label.tsx
│   │   └── sonner.tsx       # Toast notifications
│   ├── asset/               # Modular asset converter components
│   │   ├── price-display.tsx        # Price display with refresh
│   │   ├── currency-input.tsx       # Asset input with validation
│   │   ├── conversion-result.tsx    # Result display
│   │   ├── error-display.tsx        # Error handling
│   │   ├── currency-switch-button.tsx # Currency switching
│   │   └── contract-info.tsx        # Contract information
│   ├── layout/              # Layout components
│   │   └── header.tsx               # Top navigation with wallet connection
│   ├── providers/           # Context providers
│   │   └── web3-provider.tsx        # Web3 wallet provider
│   ├── wallet/              # Web3 wallet components
│   │   └── conversion-wallet-modal.tsx  # Modal for wallet requirements on conversion
│   └── configurable-asset-converter.tsx # Main orchestrator component
├── hooks/
│   └── useAssetPrice.ts     # Generic React Query hook for asset pricing
├── lib/
│   ├── asset-api.ts         # Generic asset API functions
│   ├── wagmi-config.ts      # Web3 wallet configuration
│   └── utils.ts             # Utility functions
├── providers/
│   └── query-provider.tsx   # React Query provider
└── types/
    └── asset.ts             # Asset configuration types
```

## Installation & Setup

### Prerequisites
- Node.js 18+ or Bun runtime
- Git

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd take-home
   ```

2. **Install dependencies**
   ```bash
   # Using bun (recommended)
   bun install
   
   # Or using npm
   npm install
   ```

3. **Run the development server**
   ```bash
   # Using bun
   bun dev
   
   # Or using npm
   npm run dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Asset Configuration

### Supported Assets
- **USD**: US Dollar (2 decimal places)
- **wBTC**: Wrapped Bitcoin (8 decimal places)
  - Contract: `0x2260fac5e5542a773aa44fbcfedf7c193bc2c599` (Ethereum)
- **ETH**: Ethereum (8 decimal places)
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

### Asset Pair Selection
1. Click "Change Asset Pair" at the bottom to expand the selector
2. Choose your desired asset pair (USD/wBTC, USD/ETH, USD/SOL)
3. The converter updates immediately with the selected pair's pricing and icons
4. Selector auto-collapses after selection for a clean interface
5. Each pair has its own optimized configuration and contract information

### Basic Conversion
1. Enter an amount in the input field (base asset by default)
2. Click "Convert to [Asset]" to see the equivalent amount
3. Results display with proper formatting: "Amount of [Asset]: X.XXXXXXXX tokens"
4. Click "🎯 Simulate Conversion with Wallet" to proceed with Web3 wallet integration

### Smart Currency Toggle
1. Click "Switch Currencies" to toggle between input asset modes
2. Interface updates with appropriate currency symbols, icons, and precision
3. Asset-specific icons appear for visual confirmation
4. **Intelligent Switch**: With existing conversion results:
   - Converted amount transfers to input field
   - Automatic reverse conversion occurs
   - Seamless bidirectional conversion experience

### Real-time Updates
- Asset prices update automatically every 30 seconds
- **Visual Animation**: Price field animates when updated (subtle scaling + color)
- **Manual Refresh**: Instant refresh with loading states
- **Transparency**: Last updated timestamps for all price data

### Web3 Wallet Integration
1. **Top Menu Bar**: Connect your wallet using the "Connect Wallet" button in the top-right corner (standard DApp pattern)
2. **Price Conversion**: Enter an amount and click "Convert to [Asset]" to see conversion results
3. **Wallet Simulation**: After seeing conversion results, click "🎯 Simulate Conversion with Wallet" to trigger wallet requirements
4. **Smart Wallet Modal**: 
   - **Not Connected**: Shows wallet connection options
   - **Wrong Network**: Prompts to switch to Ethereum Mainnet for wBTC/ETH
   - **Solana Assets**: Shows "incorrect blockchain network" warning with "Solana currently unsupported" message
   - **Ready**: Shows "🎯 Proceed with Demo Conversion" button
5. **Network Switching**: One-click network switching when connected to wrong network
6. **Demo Mode**: Safe conversion demonstration with toast notifications

## Error Handling

### Input Validation
- Required field validation
- Numeric value validation
- Decimal precision limits (USD: 2, wBTC: 8)
- Real-time validation feedback

### Network Errors
- API failure handling with user-friendly messages
- Retry mechanism for failed requests
- Loading states during data fetching

### Web3 Implementation Status
**✅ Implemented:**
- Web3 wallet connection (MetaMask, WalletConnect, injected wallets)
- Network validation and automatic switching (Ethereum Mainnet)
- Asset-specific blockchain requirements and messaging
- Demo mode with safe conversion simulation

**🔮 Future Enhancements:**
- Smart contract interaction for real-time on-chain wBTC data
- Actual transaction execution and swap functionality
- Multi-chain wallet support (Solana, Polygon, etc.)
- Token balance display and validation
- Slippage settings and MEV protection

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

3. **Update Image Config**: Add hostname to `next.config.ts` if using external images

### Adding New Features
1. **API functions**: Add to `src/lib/asset-api.ts`
2. **Components**: Create in `src/components/asset/`
3. **Hooks**: Add to `src/hooks/`
4. **Types**: Define in `src/types/`
5. Follow TypeScript strict mode conventions

## Performance Optimizations

- **React Query**: Caching and background updates
- **Component Optimization**: Proper memo usage and state management
- **API Rate Limiting**: Controlled refresh intervals
- **Bundle Size**: Tree-shaking and code splitting

## Browser Support

- Chrome/Edge 88+
- Firefox 84+
- Safari 14+
- Mobile browsers with modern JavaScript support

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is for assessment purposes. All rights reserved.

## Contact

For questions or support, please contact the development team.
