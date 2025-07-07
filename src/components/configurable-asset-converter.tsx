'use client';

import { useState, useEffect } from 'react';
import { RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AssetPair, ConversionResult as ConversionResultType, AssetConfig } from '@/types/asset';
import { useAssetPrice } from '@/hooks/useAssetPrice';
import { 
  validateAssetInput, 
  convertToQuoteAsset, 
  convertToBaseAsset, 
  formatAssetAmount 
} from '@/lib/asset-api';
import { PriceDisplay } from '@/components/asset/price-display';
import { CurrencyInput } from '@/components/asset/currency-input';
import { ConversionResult } from '@/components/asset/conversion-result';
import { ErrorDisplay } from '@/components/asset/error-display';
import { CurrencySwitchButton } from '@/components/asset/currency-switch-button';
import { ContractInfo } from '@/components/asset/contract-info';

interface ConfigurableAssetConverterProps {
  assetPair: AssetPair;
  title?: string;
  description?: string;
}

export default function ConfigurableAssetConverter({ 
  assetPair, 
  title = "Asset Converter", 
  description 
}: ConfigurableAssetConverterProps) {
  const [inputValue, setInputValue] = useState('');
  const [inputAsset, setInputAsset] = useState<AssetConfig>(assetPair.base);
  const [conversionResult, setConversionResult] = useState<ConversionResultType | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isConverting, setIsConverting] = useState(false);
  const [isManualRefreshing, setIsManualRefreshing] = useState(false);
  const [priceChangeAnimation, setPriceChangeAnimation] = useState(false);

  const { data: priceData, isLoading, error, refetch } = useAssetPrice(assetPair);

  const outputAsset: AssetConfig = inputAsset.id === assetPair.base.id ? assetPair.quote : assetPair.base;

  useEffect(() => {
    // Clear conversion result when input changes
    if (!inputValue.trim()) {
      setConversionResult(null);
      setValidationError(null);
    }
  }, [inputValue]);

  useEffect(() => {
    // Clear conversion result when there's an error fetching price
    if (error) {
      setConversionResult(null);
      setValidationError(null);
    }
  }, [error]);

  useEffect(() => {
    // Reset input asset when asset pair changes
    setInputAsset(assetPair.base);
    setInputValue('');
    setConversionResult(null);
    setValidationError(null);
  }, [assetPair]);

  // Animate price change
  useEffect(() => {
    if (priceData?.price) {
      setPriceChangeAnimation(true);
      const timer = setTimeout(() => {
        setPriceChangeAnimation(false);
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [priceData?.price]);

  const handleInputChange = (value: string) => {
    setInputValue(value);
    setValidationError(null);
    
    // Validate input format
    const validation = validateAssetInput(value, inputAsset.decimals);
    if (value.trim() && !validation.isValid) {
      setValidationError(validation.error || null);
    }
  };

  const handleConvert = async () => {
    if (!inputValue.trim()) return;

    // Check if price data is available
    if (!priceData || error) {
      setValidationError('Price data is not available. Please try refreshing.');
      setConversionResult(null);
      return;
    }

    const validation = validateAssetInput(inputValue, inputAsset.decimals);
    if (!validation.isValid) {
      setValidationError(validation.error || null);
      setConversionResult(null);
      return;
    }

    setIsConverting(true);
    setValidationError(null);

    try {
      const inputAmount = parseFloat(inputValue);
      let outputAmount: number;

      if (inputAsset.id === assetPair.base.id) {
        // Converting from base to quote (e.g., USD to wBTC)
        outputAmount = convertToQuoteAsset(inputAmount, priceData.price);
      } else {
        // Converting from quote to base (e.g., wBTC to USD)
        outputAmount = convertToBaseAsset(inputAmount, priceData.price);
      }

      const formatted = formatAssetAmount(outputAmount, outputAsset.decimals);

      setConversionResult({
        amount: outputAmount,
        asset: outputAsset,
        formatted,
      });
    } catch (error) {
      console.error('Conversion error:', error);
      setValidationError('Conversion failed. Please try again.');
      setConversionResult(null);
    } finally {
      setIsConverting(false);
    }
  };

  const handleSwitchCurrencies = async () => {
    const newInputAsset = inputAsset.id === assetPair.base.id ? assetPair.quote : assetPair.base;
    
    // If there's a conversion result, move the converted amount to the input and auto-convert
    if (conversionResult && priceData && !error) {
      // Format the amount according to the new currency's precision
      const formattedAmount = newInputAsset.decimals === 2 
        ? conversionResult.amount.toFixed(2)
        : conversionResult.amount.toFixed(8).replace(/\.?0+$/, ''); // Remove trailing zeros
      
      setInputValue(formattedAmount);
      setInputAsset(newInputAsset);
      setConversionResult(null);
      setValidationError(null);
      
      // Auto-convert the switched amount
      try {
        const inputAmount = conversionResult.amount;
        let outputAmount: number;
        const newOutputAsset = newInputAsset.id === assetPair.base.id ? assetPair.quote : assetPair.base;
        
        if (newInputAsset.id === assetPair.base.id) {
          // New input is base asset, convert to quote
          outputAmount = convertToQuoteAsset(inputAmount, priceData.price);
        } else {
          // New input is quote asset, convert to base
          outputAmount = convertToBaseAsset(inputAmount, priceData.price);
        }
        
        const formatted = formatAssetAmount(outputAmount, newOutputAsset.decimals);
        
        setConversionResult({
          amount: outputAmount,
          asset: newOutputAsset,
          formatted,
        });
      } catch (error) {
        console.error('Auto-conversion error:', error);
        setValidationError('Auto-conversion failed. Please try again.');
      }
    } else {
      // No conversion result, just switch currencies and clear input
      setInputAsset(newInputAsset);
      setInputValue('');
      setConversionResult(null);
      setValidationError(null);
    }
  };

  const handleRefresh = async () => {
    setIsManualRefreshing(true);
    try {
      await refetch();
    } finally {
      setIsManualRefreshing(false);
    }
  };

  const getDescription = () => {
    if (description) return description;
    return `Convert between ${assetPair.base.symbol} and ${assetPair.quote.symbol}`;
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>{title}</span>
          </CardTitle>
          <CardDescription>
            {getDescription()}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Price Display */}
          <PriceDisplay
            priceData={priceData}
            isLoading={isLoading}
            isRefreshing={isManualRefreshing}
            priceChangeAnimation={priceChangeAnimation}
            onRefresh={handleRefresh}
          />

          {/* Input Section */}
          <div className="space-y-4">
            <CurrencyInput
              asset={inputAsset}
              value={inputValue}
              onChange={handleInputChange}
              hasError={!!validationError}
            />

            {/* Switch Button */}
            <CurrencySwitchButton onSwitch={handleSwitchCurrencies} />

            {/* Convert Button */}
            <Button
              onClick={handleConvert}
              disabled={!inputValue.trim() || isLoading || !!validationError || isConverting || !!error || !priceData}
              className={`w-full ${(!inputValue.trim() || isLoading || !!validationError || isConverting || !!error || !priceData) ? 'cursor-not-allowed' : 'cursor-pointer'}`}
            >
              {isConverting ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                  Converting...
                </>
              ) : error ? (
                'Price data unavailable'
              ) : (
                `Convert to ${outputAsset.symbol}`
              )}
            </Button>
          </div>

          {/* Conversion Result */}
          {conversionResult && !error && priceData && (
            <ConversionResult result={conversionResult} priceData={priceData} />
          )}

          {/* Error Display - Only show when there's an error and no conversion result */}
          {error && !conversionResult && (
            <ErrorDisplay 
              title="Error" 
              message={error.message || `Failed to fetch ${assetPair.quote.symbol} price. Please try again.`} 
            />
          )}

          {/* Validation Error Display */}
          {validationError && (
            <ErrorDisplay 
              title="Validation Error" 
              message={validationError} 
              type="validation" 
            />
          )}
        </CardContent>
      </Card>

      {/* Contract Information */}
      <ContractInfo asset={assetPair.quote} />
    </div>
  );
} 