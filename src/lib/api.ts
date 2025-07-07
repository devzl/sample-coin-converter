// API functions for fetching cryptocurrency data
export interface BitcoinPriceResponse {
  bitcoin: {
    usd: number;
  };
}

export interface BitcoinPriceData {
  priceUsd: number;
  lastUpdated: Date;
}

/**
 * Fetches current Bitcoin price from CoinGecko API
 * @returns Promise<BitcoinPriceData>
 */
export async function fetchBitcoinPrice(): Promise<BitcoinPriceData> {
  try {
    const response = await fetch(
      'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd'
    );
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data: BitcoinPriceResponse = await response.json();
    
    return {
      priceUsd: data.bitcoin.usd,
      lastUpdated: new Date(),
    };
  } catch (error) {
    console.error('Error fetching Bitcoin price:', error);
    throw new Error('Failed to fetch Bitcoin price. Please try again later.');
  }
}

/**
 * Convert USD to wBTC
 * @param usdAmount - Amount in USD
 * @param bitcoinPriceUsd - Current Bitcoin price in USD
 * @returns Amount in wBTC
 */
export function convertUsdToWbtc(usdAmount: number, bitcoinPriceUsd: number): number {
  if (bitcoinPriceUsd <= 0) return 0;
  return usdAmount / bitcoinPriceUsd;
}

/**
 * Convert wBTC to USD
 * @param wbtcAmount - Amount in wBTC
 * @param bitcoinPriceUsd - Current Bitcoin price in USD
 * @returns Amount in USD
 */
export function convertWbtcToUsd(wbtcAmount: number, bitcoinPriceUsd: number): number {
  return wbtcAmount * bitcoinPriceUsd;
}

/**
 * Format number with specified decimal places
 * @param value - Number to format
 * @param decimals - Number of decimal places
 * @returns Formatted string
 */
export function formatNumber(value: number, decimals: number): string {
  return value.toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: decimals,
  });
}

/**
 * Validate input based on currency type
 * @param input - Input string
 * @param isWbtc - Whether input is wBTC (true) or USD (false)
 * @returns Validation result
 */
export function validateInput(input: string, isWbtc: boolean): { isValid: boolean; error?: string } {
  if (!input.trim()) {
    return { isValid: false, error: 'Amount is required' };
  }

  const value = parseFloat(input);
  
  if (isNaN(value) || value < 0) {
    return { isValid: false, error: 'Please enter a valid positive number' };
  }

  // Check decimal places
  const decimalPlaces = (input.split('.')[1] || '').length;
  const maxDecimals = isWbtc ? 8 : 2;
  
  if (decimalPlaces > maxDecimals) {
    return { 
      isValid: false, 
      error: `Maximum ${maxDecimals} decimal places allowed for ${isWbtc ? 'wBTC' : 'USD'}` 
    };
  }

  return { isValid: true };
} 