import { parseUnits, formatUnits } from 'viem';
import { AssetConfig } from '@/types/asset';

export interface BigIntConversionResult {
  amount: bigint;
  formatted: string;
  isValid: boolean;
  error?: string;
}

export interface PreciseConversionResult {
  amount: bigint;
  asset: AssetConfig;
  formatted: string;
  humanReadable: string;
}

/**
 * Convert human-readable string to BigInt with proper decimals
 * Example: "12.34" USD (2 decimals) -> 1234n
 * Example: "12.34" ETH (18 decimals) -> 12340000000000000000n
 */
export function parseAssetAmount(amount: string, decimals: number): bigint {
  try {
    return parseUnits(amount, decimals);
  } catch {
    throw new Error(`Invalid amount: ${amount}`);
  }
}

/**
 * Convert BigInt back to human-readable string
 * Example: 1234n USD (2 decimals) -> "12.34"
 * Example: 12340000000000000000n ETH (18 decimals) -> "12.34"
 */
export function formatAssetAmount(amount: bigint, decimals: number): string {
  return formatUnits(amount, decimals);
}

/**
 * Convert BigInt to display format with proper precision
 * Removes trailing zeros for crypto, keeps 2 decimals for USD with comma formatting
 */
export function formatAssetAmountForDisplay(amount: bigint, decimals: number): string {
  const formatted = formatUnits(amount, decimals);

  if (decimals === 2) {
    // For fiat currencies like USD, format with commas and 2 decimals
    const numValue = parseFloat(formatted);
    return numValue.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  } else {
    // For crypto assets, handle all cases properly
    const numValue = parseFloat(formatted);

    // If amount is 0, just return "0"
    if (amount === BigInt(0)) {
      return '0';
    }

    // If very small amount that would show as 0, use scientific notation
    if (numValue > 0 && numValue < 0.00000001) {
      return numValue.toExponential(2);
    }

    // For normal amounts, remove trailing zeros but ensure we show the value
    const trimmed = formatted.replace(/\.?0+$/, '');

    // Safety check - if trimmed is empty or just a decimal point, show the number value
    if (!trimmed || trimmed === '.' || trimmed === '0') {
      if (numValue > 0) {
        // Show with appropriate precision for the value
        if (numValue >= 1) {
          return numValue.toString();
        } else if (numValue >= 0.00000001) {
          return numValue.toFixed(8).replace(/\.?0+$/, '');
        } else {
          return numValue.toExponential(2);
        }
      }
      return '0';
    }

    return trimmed;
  }
}

/**
 * Validate human-readable input before conversion
 */
export function validateAssetInput(value: string): { isValid: boolean; error?: string } {
  if (!value.trim()) {
    return { isValid: true }; // Empty input is valid, just don't show errors
  }

  // Check for valid number format
  const numValue = parseFloat(value);

  if (isNaN(numValue)) {
    return { isValid: false, error: 'Please enter a valid number' };
  }

  if (numValue <= 0) {
    return { isValid: false, error: 'Amount must be greater than zero' };
  }

  if (numValue > 1e15) {
    return { isValid: false, error: 'Amount is too large' };
  }

  // Check for too many decimal places in the input string
  const decimalParts = value.split('.');
  if (decimalParts.length > 2) {
    return { isValid: false, error: 'Invalid decimal format' };
  }

  return { isValid: true };
}

/**
 * Convert from base asset to quote asset using BigInt precision
 * Example: convertToQuoteAsset("100", 2, "50000", 0, 8)
 * -> 100 USD at $50,000 per unit = 0.002 BTC
 */
export function convertToQuoteAsset(
  baseAmount: string,
  baseDecimals: number,
  price: string,
  priceDecimals: number,
  quoteDecimals: number
): bigint {
  // Parse amounts to BigInt
  const baseAmountBigInt = parseAssetAmount(baseAmount, baseDecimals);
  const priceBigInt = parseAssetAmount(price, priceDecimals);

  // For quote asset calculation: baseAmount / price
  // We need to scale the numerator to maintain precision
  // Scale up by both quote decimals and price decimals to avoid truncation
  const scaleFactor = BigInt(10) ** BigInt(quoteDecimals + priceDecimals);
  const numerator = baseAmountBigInt * scaleFactor;
  const denominator = priceBigInt * BigInt(10) ** BigInt(baseDecimals);

  const result = numerator / denominator;

  return result;
}

/**
 * Convert from quote asset to base asset using BigInt precision
 * Example: convertToBaseAsset("0.002", 8, "50000", 0, 2)
 * -> 0.002 BTC at $50,000 per unit = $100 USD
 */
export function convertToBaseAsset(
  quoteAmount: string,
  quoteDecimals: number,
  price: string,
  priceDecimals: number,
  baseDecimals: number
): bigint {
  // Parse amounts to BigInt
  const quoteAmountBigInt = parseAssetAmount(quoteAmount, quoteDecimals);
  const priceBigInt = parseAssetAmount(price, priceDecimals);

  // For base asset calculation: quoteAmount * price
  // Scale the calculation to maintain precision
  const numerator = quoteAmountBigInt * priceBigInt * BigInt(10) ** BigInt(baseDecimals);
  const denominator = BigInt(10) ** BigInt(priceDecimals) * BigInt(10) ** BigInt(quoteDecimals);

  const result = numerator / denominator;

  return result;
}

/**
 * Perform safe conversion with validation and error handling
 */
export function performSafeBigIntConversion(
  inputValue: string,
  inputAsset: AssetConfig,
  outputAsset: AssetConfig,
  price: number,
  fromBaseToQuote: boolean
): BigIntConversionResult {
  // Skip validation if empty - caller should handle this
  if (!inputValue.trim()) {
    return {
      amount: BigInt(0),
      formatted: '0',
      isValid: false,
      error: 'Amount is required',
    };
  }

  const validation = validateAssetInput(inputValue);

  if (!validation.isValid) {
    return {
      amount: BigInt(0),
      formatted: '0',
      isValid: false,
      error: validation.error,
    };
  }

  try {
    // Convert price to string with appropriate precision
    // For crypto prices, we'll use 8 decimal places for precision
    const priceString = price.toFixed(8);
    const priceDecimals = 8;

    let resultAmount: bigint;

    if (fromBaseToQuote) {
      // Convert from base (USD) to quote (crypto)
      resultAmount = convertToQuoteAsset(
        inputValue,
        inputAsset.decimals,
        priceString,
        priceDecimals,
        outputAsset.decimals
      );
    } else {
      // Convert from quote (crypto) to base (USD)
      resultAmount = convertToBaseAsset(
        inputValue,
        inputAsset.decimals,
        priceString,
        priceDecimals,
        outputAsset.decimals
      );
    }

    return {
      amount: resultAmount,
      formatted: formatAssetAmountForDisplay(resultAmount, outputAsset.decimals),
      isValid: true,
    };
  } catch (error) {
    return {
      amount: BigInt(0),
      formatted: '0',
      isValid: false,
      error: error instanceof Error ? error.message : 'Conversion failed',
    };
  }
}

/**
 * Create a precise conversion result object
 */
export function createPreciseConversionResult(
  amount: bigint,
  asset: AssetConfig
): PreciseConversionResult {
  const formatted = formatAssetAmountForDisplay(amount, asset.decimals);
  const humanReadable = formatAssetAmount(amount, asset.decimals);

  return {
    amount,
    asset,
    formatted,
    humanReadable,
  };
}
