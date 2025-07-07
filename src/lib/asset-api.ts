import { AssetPair, PriceData } from '@/types/asset';

interface CoinGeckoResponse {
  [coinId: string]: {
    [currency: string]: number;
  };
}

/**
 * Fetches asset price data for a given asset pair
 * @param pair - Asset pair configuration
 * @returns Promise<PriceData>
 */
export async function fetchAssetPrice(pair: AssetPair): Promise<PriceData> {
  try {
    if (!pair.apiEndpoint) {
      throw new Error('No API endpoint configured for this asset pair');
    }

    const response = await fetch(pair.apiEndpoint);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data: CoinGeckoResponse = await response.json();
    
    // Extract price using the configured price key
    const priceKey = pair.priceKey || '';
    const keyParts = priceKey.split('.');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let priceValue: any = data;
    
    for (const part of keyParts) {
      priceValue = priceValue[part];
      if (priceValue === undefined) {
        throw new Error(`Price not found at key: ${priceKey}`);
      }
    }
    
    return {
      price: priceValue as number,
      lastUpdated: new Date(),
      pair,
    };
  } catch (error) {
    console.error('Error fetching asset price:', error);
    throw new Error(`Failed to fetch ${pair.quote.symbol} price. Please try again later.`);
  }
}

/**
 * Convert from base asset to quote asset
 * @param amount - Amount in base asset
 * @param price - Price of quote asset in base asset
 * @returns Amount in quote asset
 */
export function convertToQuoteAsset(amount: number, price: number): number {
  if (price <= 0) return 0;
  return amount / price;
}

/**
 * Convert from quote asset to base asset
 * @param amount - Amount in quote asset
 * @param price - Price of quote asset in base asset
 * @returns Amount in base asset
 */
export function convertToBaseAsset(amount: number, price: number): number {
  return amount * price;
}

/**
 * Format number with specified decimal places
 * @param value - Number to format
 * @param decimals - Number of decimal places
 * @returns Formatted string
 */
export function formatAssetAmount(value: number, decimals: number): string {
  return value.toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: decimals,
  });
}

/**
 * Validate input for a specific asset
 * @param input - Input string
 * @param asset - Asset configuration
 * @returns Validation result
 */
export function validateAssetInput(input: string, assetDecimals: number): { isValid: boolean; error?: string } {
  if (!input.trim()) {
    return { isValid: false, error: 'Amount is required' };
  }

  const value = parseFloat(input);
  
  if (isNaN(value) || value < 0) {
    return { isValid: false, error: 'Please enter a valid positive number' };
  }

  // Check decimal places
  const decimalPlaces = (input.split('.')[1] || '').length;
  
  if (decimalPlaces > assetDecimals) {
    return { 
      isValid: false, 
      error: `Maximum ${assetDecimals} decimal places allowed` 
    };
  }

  return { isValid: true };
} 