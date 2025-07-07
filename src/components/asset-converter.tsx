'use client';

import { useState, useEffect } from 'react';
import { ArrowUpDown, RefreshCw, AlertCircle, CheckCircle } from 'lucide-react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useBitcoinPrice } from '@/hooks/useBitcoinPrice';
import { validateInput, convertUsdToWbtc, convertWbtcToUsd, formatNumber } from '@/lib/api';

type CurrencyType = 'USD' | 'wBTC';

interface ConversionResult {
  amount: number;
  currency: CurrencyType;
  formatted: string;
}

export default function AssetConverter() {
  const [inputValue, setInputValue] = useState('');
  const [inputCurrency, setInputCurrency] = useState<CurrencyType>('USD');
  const [conversionResult, setConversionResult] = useState<ConversionResult | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isConverting, setIsConverting] = useState(false);
  const [isManualRefreshing, setIsManualRefreshing] = useState(false);
  const [priceChangeAnimation, setPriceChangeAnimation] = useState(false);

  const { data: bitcoinPrice, isLoading, error, refetch } = useBitcoinPrice();

  const outputCurrency: CurrencyType = inputCurrency === 'USD' ? 'wBTC' : 'USD';

  useEffect(() => {
    // Clear conversion result when input changes
    if (!inputValue.trim()) {
      setConversionResult(null);
      setValidationError(null);
    }
  }, [inputValue]);

  useEffect(() => {
    // Clear conversion result when there's an error fetching Bitcoin price
    if (error) {
      setConversionResult(null);
      setValidationError(null);
    }
  }, [error]);

  // Animate price change
  useEffect(() => {
    if (bitcoinPrice?.priceUsd) {
      setPriceChangeAnimation(true);
      const timer = setTimeout(() => {
        setPriceChangeAnimation(false);
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [bitcoinPrice?.priceUsd]);

  const handleInputChange = (value: string) => {
    setInputValue(value);
    setValidationError(null);
    
    // Validate input format
    const validation = validateInput(value, inputCurrency === 'wBTC');
    if (value.trim() && !validation.isValid) {
      setValidationError(validation.error || null);
    }
  };

  const handleConvert = async () => {
    if (!inputValue.trim()) return;

    // Check if Bitcoin price data is available
    if (!bitcoinPrice || error) {
      setValidationError('Bitcoin price data is not available. Please try refreshing.');
      setConversionResult(null);
      return;
    }

    const validation = validateInput(inputValue, inputCurrency === 'wBTC');
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

      if (inputCurrency === 'USD') {
        outputAmount = convertUsdToWbtc(inputAmount, bitcoinPrice.priceUsd);
      } else {
        outputAmount = convertWbtcToUsd(inputAmount, bitcoinPrice.priceUsd);
      }

      const decimals = outputCurrency === 'wBTC' ? 8 : 2;
      const formatted = formatNumber(outputAmount, decimals);

      setConversionResult({
        amount: outputAmount,
        currency: outputCurrency,
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
    const newCurrency = inputCurrency === 'USD' ? 'wBTC' : 'USD';
    
    // If there's a conversion result, move the converted amount to the input and auto-convert
    if (conversionResult && bitcoinPrice && !error) {
      // Format the amount according to the new currency's precision
      const formattedAmount = newCurrency === 'wBTC' 
        ? conversionResult.amount.toFixed(8).replace(/\.?0+$/, '') // Remove trailing zeros for wBTC
        : conversionResult.amount.toFixed(2); // Keep 2 decimals for USD
      
      setInputValue(formattedAmount);
      setInputCurrency(newCurrency);
      setConversionResult(null);
      setValidationError(null);
      
      // Auto-convert the switched amount
      try {
        const inputAmount = conversionResult.amount;
        let outputAmount: number;
        const outputCurrency = newCurrency === 'USD' ? 'wBTC' : 'USD';
        
        if (newCurrency === 'USD') {
          // Input is now USD, convert to wBTC
          outputAmount = convertUsdToWbtc(inputAmount, bitcoinPrice.priceUsd);
        } else {
          // Input is now wBTC, convert to USD
          outputAmount = convertWbtcToUsd(inputAmount, bitcoinPrice.priceUsd);
        }
        
        const decimals = outputCurrency === 'wBTC' ? 8 : 2;
        const formatted = formatNumber(outputAmount, decimals);
        
        setConversionResult({
          amount: outputAmount,
          currency: outputCurrency,
          formatted,
        });
      } catch (error) {
        console.error('Auto-conversion error:', error);
        setValidationError('Auto-conversion failed. Please try again.');
      }
    } else {
      // No conversion result, just switch currencies and clear input
      setInputCurrency(newCurrency);
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

  const getMaxDecimals = (currency: CurrencyType): number => {
    return currency === 'wBTC' ? 8 : 2;
  };

  const formatInputValue = (value: string, currency: CurrencyType): string => {
    if (!value) return value;
    
    // Don't format while typing
    if (value.endsWith('.')) return value;
    
    const parts = value.split('.');
    if (parts.length === 2) {
      const decimals = parts[1];
      const maxDecimals = getMaxDecimals(currency);
      if (decimals.length > maxDecimals) {
        return `${parts[0]}.${decimals.slice(0, maxDecimals)}`;
      }
    }
    
    return value;
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Asset Converter</span>
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={isLoading || isManualRefreshing}
              title="Refresh now"
              className={`${(isLoading || isManualRefreshing) ? 'cursor-not-allowed' : 'cursor-pointer'}`}
            >
              <RefreshCw className={`h-4 w-4 ${(isLoading || isManualRefreshing) ? 'animate-spin' : ''}`} />
            </Button>
          </CardTitle>
          <CardDescription>
            Convert between USD and Wrapped Bitcoin (wBTC)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Price Display */}
          <div className="p-4 bg-muted rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Current Bitcoin Price:</span>
              {isLoading ? (
                <div className="animate-pulse bg-muted-foreground/20 h-6 w-24 rounded" />
              ) : bitcoinPrice ? (
                <span className={`text-lg font-bold transition-all duration-300 ${priceChangeAnimation ? 'scale-105 text-muted-foreground' : ''}`}>
                  ${formatNumber(bitcoinPrice.priceUsd, 2)}
                </span>
              ) : (
                <span className="text-destructive">Failed to load</span>
              )}
            </div>
            {bitcoinPrice && (
              <p className="text-xs text-muted-foreground mt-1">
                Last updated: {bitcoinPrice.lastUpdated.toLocaleTimeString()}
              </p>
            )}
          </div>

          {/* Input Section */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="amount">
                Amount ({inputCurrency})
              </Label>
              <div className="relative">
                <Input
                  id="amount"
                  type="number"
                  placeholder={`Enter ${inputCurrency} amount`}
                  value={inputValue}
                  onChange={(e) => handleInputChange(formatInputValue(e.target.value, inputCurrency))}
                  className={`pr-12 ${validationError ? 'border-destructive' : ''}`}
                  step={inputCurrency === 'wBTC' ? '0.00000001' : '0.01'}
                  min="0"
                />
                                 {inputCurrency === 'wBTC' && (
                   <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                     <Image
                       src="https://assets.coingecko.com/coins/images/7598/standard/wrapped_bitcoin_wbtc.png?1696507857"
                       alt="wBTC"
                       width={24}
                       height={24}
                       className="h-6 w-6"
                     />
                   </div>
                 )}
                {inputCurrency === 'USD' && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <span className="text-muted-foreground text-sm">$</span>
                  </div>
                )}
              </div>
              
              <p className="text-xs text-muted-foreground">
                Maximum {getMaxDecimals(inputCurrency)} decimal places
              </p>
            </div>

            {/* Switch Button */}
            <div className="flex justify-center">
              <Button
                variant="outline"
                onClick={handleSwitchCurrencies}
                className="flex items-center gap-2 cursor-pointer"
              >
                <ArrowUpDown className="h-4 w-4" />
                Switch Currencies
              </Button>
            </div>

            {/* Convert Button */}
            <Button
              onClick={handleConvert}
              disabled={!inputValue.trim() || isLoading || !!validationError || isConverting || !!error || !bitcoinPrice}
              className={`w-full ${(!inputValue.trim() || isLoading || !!validationError || isConverting || !!error || !bitcoinPrice) ? 'cursor-not-allowed' : 'cursor-pointer'}`}
            >
              {isConverting ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                  Converting...
                </>
              ) : error ? (
                'Price data unavailable'
              ) : (
                `Convert to ${outputCurrency}`
              )}
            </Button>
          </div>

          {/* Conversion Result */}
          {conversionResult && !error && bitcoinPrice && (
            <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span className="font-medium">Conversion Result</span>
              </div>
              <p className="text-lg">
                <span className="font-bold">
                  Amount of {conversionResult.currency}: {conversionResult.formatted}{' '}
                  {conversionResult.currency === 'wBTC' ? 'tokens' : ''}
                </span>
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                Exchange rate: 1 wBTC = ${formatNumber(bitcoinPrice.priceUsd, 2)} USD
              </p>
            </div>
          )}

          {/* Error Display - Only show when there's an error and no conversion result */}
          {error && !conversionResult && (
            <div className="p-4 bg-destructive/5 border border-destructive/20 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="h-5 w-5 text-destructive" />
                <span className="font-medium text-destructive">Error</span>
              </div>
              <p className="text-sm text-destructive">
                {error.message || 'Failed to fetch Bitcoin price. Please try again.'}
              </p>
            </div>
          )}

          {/* Validation Error Display */}
          {validationError && (
            <div className="p-4 bg-destructive/5 border border-destructive/20 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="h-5 w-5 text-destructive" />
                <span className="font-medium text-destructive">Validation Error</span>
              </div>
              <p className="text-sm text-destructive">
                {validationError}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Additional Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">About wBTC</CardTitle>
        </CardHeader>
        <CardContent>
                     <p className="text-sm text-muted-foreground">
             Wrapped Bitcoin (wBTC) is an ERC-20 token backed 1:1 with Bitcoin. 
             It brings Bitcoin&apos;s liquidity to the Ethereum ecosystem, enabling Bitcoin holders 
             to participate in DeFi applications.
           </p>
                     <p className="text-xs text-muted-foreground mt-2">
             wBTC Contract Address:{' '}
             <a
               href="https://etherscan.io/address/0x2260fac5e5542a773aa44fbcfedf7c193bc2c599"
               target="_blank"
               rel="noopener noreferrer"
               className="text-primary hover:underline font-mono break-all"
             >
               0x2260fac5e5542a773aa44fbcfedf7c193bc2c599
             </a>
           </p>
        </CardContent>
      </Card>
    </div>
  );
} 