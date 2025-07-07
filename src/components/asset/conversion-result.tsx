import { CheckCircle } from 'lucide-react';
import {
  ConversionResult as ConversionResultType,
  PreciseConversionResult,
  PriceData,
} from '@/types/asset';
import { formatAssetAmount } from '@/lib/asset-api';

interface ConversionResultProps {
  result: ConversionResultType | PreciseConversionResult;
  priceData?: PriceData;
}

export function ConversionResult({ result, priceData }: ConversionResultProps) {
  if (!priceData) return null;

  // Improvement: Consider displaying asset logo/icon next to the amount for better visual identification
  // Could also show full token name (e.g., "Wrapped Bitcoin" instead of "wBTC") for better user understanding
  const getDisplaySuffix = (assetSymbol: string): string => {
    // For fiat currencies like USD, no suffix needed
    if (assetSymbol === 'USD') return '';
    // For crypto assets, use "tokens"
    return 'tokens';
  };

  return (
    <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
      <div className="flex items-center gap-2 mb-2">
        <CheckCircle className="h-5 w-5 text-green-600" />
        <span className="font-medium">Conversion Result</span>
      </div>
      <p className="text-lg">
        <span className="font-bold">
          Amount of {result.asset.symbol}: {result.formatted}{' '}
          {getDisplaySuffix(result.asset.symbol)}
        </span>
      </p>
      <p className="text-sm text-muted-foreground mt-1">
        Exchange rate: 1 {priceData.pair.quote.symbol} ={' '}
        {priceData.pair.base.icon && !priceData.pair.base.icon.startsWith('http')
          ? priceData.pair.base.icon
          : ''}
        {formatAssetAmount(priceData.price, priceData.pair.base.decimals)}{' '}
        {priceData.pair.base.symbol}
      </p>
    </div>
  );
}
