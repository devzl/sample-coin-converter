export interface AssetConfig {
  id: string;
  symbol: string;
  name: string;
  decimals: number;
  icon?: string;
  contractAddress?: string;
  network?: string;
  apiId?: string; // For price API mapping
}

export interface AssetPair {
  base: AssetConfig;
  quote: AssetConfig;
  apiEndpoint?: string;
  priceKey?: string;
}

export interface ConversionResult {
  amount: number;
  asset: AssetConfig;
  formatted: string;
}

export interface PriceData {
  price: number;
  lastUpdated: Date;
  pair: AssetPair;
}

// Predefined asset configurations
export const ASSETS: Record<string, AssetConfig> = {
  USD: {
    id: 'usd',
    symbol: 'USD',
    name: 'US Dollar',
    decimals: 2,
    icon: '$',
  },
  WBTC: {
    id: 'wrapped-bitcoin',
    symbol: 'wBTC',
    name: 'Wrapped Bitcoin',
    decimals: 8,
    icon: 'https://assets.coingecko.com/coins/images/7598/standard/wrapped_bitcoin_wbtc.png?1696507857',
    contractAddress: '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599',
    network: 'Ethereum',
    apiId: 'bitcoin', // CoinGecko uses 'bitcoin' for wBTC pricing
  },
  ETH: {
    id: 'ethereum',
    symbol: 'ETH',
    name: 'Ethereum',
    decimals: 8,
    icon: 'https://assets.coingecko.com/coins/images/279/standard/ethereum.png?1696501628',
    apiId: 'ethereum',
  },
  SOL: {
    id: 'solana',
    symbol: 'SOL',
    name: 'Solana',
    decimals: 9,
    icon: 'https://assets.coingecko.com/coins/images/4128/standard/solana.png?1696504756',
    apiId: 'solana',
  },
};

// Predefined asset pairs
export const ASSET_PAIRS: Record<string, AssetPair> = {
  'USD_WBTC': {
    base: ASSETS.USD,
    quote: ASSETS.WBTC,
    apiEndpoint: 'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd',
    priceKey: 'bitcoin.usd',
  },
  'USD_ETH': {
    base: ASSETS.USD,
    quote: ASSETS.ETH,
    apiEndpoint: 'https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd',
    priceKey: 'ethereum.usd',
  },
  'USD_SOL': {
    base: ASSETS.USD,
    quote: ASSETS.SOL,
    apiEndpoint: 'https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd',
    priceKey: 'solana.usd',
  },
};

export type AssetType = keyof typeof ASSETS;
export type AssetPairType = keyof typeof ASSET_PAIRS; 