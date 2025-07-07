'use client';

import { useState, useEffect } from 'react';
import { RefreshCw } from 'lucide-react';
import { showDemoConversionToast } from '@/lib/toast-utils';
import { useAccount } from 'wagmi';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AssetPair, PreciseConversionResult, AssetConfig } from '@/types/asset';
import { useAssetPrice } from '@/hooks/useAssetPrice';
import { 
  performSafeBigIntConversion, 
  createPreciseConversionResult,
  validateAssetInput as validateBigIntInput 
} from '@/lib/bigint-conversion-utils';
import { PriceDisplay } from '@/components/asset/price-display';
import { CurrencyInput } from '@/components/asset/currency-input';
import { ConversionResult } from '@/components/asset/conversion-result';
import { ErrorDisplay } from '@/components/asset/error-display';
import { CurrencySwitchButton } from '@/components/asset/currency-switch-button';
import { ContractInfo } from '@/components/asset/contract-info';
import ConversionWalletModal from '@/components/wallet/conversion-wallet-modal';

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
  const [conversionResult, setConversionResult] = useState<PreciseConversionResult | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isConverting, setIsConverting] = useState(false);
  const [isManualRefreshing, setIsManualRefreshing] = useState(false);
  const [priceChangeAnimation, setPriceChangeAnimation] = useState(false);
  const [showWalletModal, setShowWalletModal] = useState(false);

  const { data: priceData, isLoading, error, refetch } = useAssetPrice(assetPair);
  const { isConnected, status } = useAccount();

  // Monitor wallet state changes in main converter
  useEffect(() => {
    // Close wallet modal if wallet gets disconnected
    if (!isConnected && status === 'disconnected' && showWalletModal) {
      setShowWalletModal(false);
    }
  }, [isConnected, status, showWalletModal]);

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
    
    // Always clear validation error first
    setValidationError(null);
    
    // Only validate if there's actual input
    if (value.trim()) {
      const validation = validateBigIntInput(value);
      if (!validation.isValid) {
        setValidationError(validation.error || null);
      }
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

    const validation = validateBigIntInput(inputValue);
    if (!validation.isValid) {
      setValidationError(validation.error || null);
      setConversionResult(null);
      return;
    }

    // Clear any previous validation errors
    setValidationError(null);

    // Perform the conversion calculation and show results
    performActualConversion();
  };

  const performActualConversion = async () => {
    if (!inputValue.trim() || !priceData) return;

    setIsConverting(true);
    setValidationError(null);

    try {
      const fromBaseToQuote = inputAsset.id === assetPair.base.id;
      
      // Use the precise BigInt conversion
      const conversionResult = performSafeBigIntConversion(
        inputValue,
        inputAsset,
        outputAsset,
        priceData.price,
        fromBaseToQuote
      );

      if (!conversionResult.isValid) {
        setValidationError(conversionResult.error || 'Conversion failed');
        setConversionResult(null);
        return;
      }

      // Create the precise conversion result
      const preciseResult = createPreciseConversionResult(
        conversionResult.amount,
        outputAsset
      );

      setConversionResult(preciseResult);
    } catch (error) {
      console.error('Conversion error:', error);
      setValidationError('Conversion failed. Please try again.');
      setConversionResult(null);
    } finally {
      setIsConverting(false);
    }
  };

  const handleDemoConversion = () => {
    showDemoConversionToast(inputAsset.symbol, outputAsset.symbol);
  };

  const handleSwitchCurrencies = async () => {
    const newInputAsset = inputAsset.id === assetPair.base.id ? assetPair.quote : assetPair.base;
    
    // If there's a conversion result, move the converted amount to the input and auto-convert
    if (conversionResult && priceData && !error) {
      // Use the humanReadable format for the input
      const humanReadableAmount = conversionResult.humanReadable;
      
      setInputValue(humanReadableAmount);
      setInputAsset(newInputAsset);
      setConversionResult(null);
      setValidationError(null);
      
      // Auto-convert the switched amount
      try {
        const newOutputAsset = newInputAsset.id === assetPair.base.id ? assetPair.quote : assetPair.base;
        const fromBaseToQuote = newInputAsset.id === assetPair.base.id;
        
        // Use the precise BigInt conversion for auto-conversion
        const newConversionResult = performSafeBigIntConversion(
          humanReadableAmount,
          newInputAsset,
          newOutputAsset,
          priceData.price,
          fromBaseToQuote
        );

        if (newConversionResult.isValid) {
          const preciseResult = createPreciseConversionResult(
            newConversionResult.amount,
            newOutputAsset
          );
          setConversionResult(preciseResult);
        } else {
          setValidationError(newConversionResult.error || 'Auto-conversion failed');
        }
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
            <div className="space-y-4">
              <ConversionResult result={conversionResult} priceData={priceData} />
              
              {/* Demo Conversion Button */}
              <Button
                onClick={() => setShowWalletModal(true)}
                className="w-full"
                variant="secondary"
              >
                🎯 Simulate Conversion with Wallet
              </Button>
            </div>
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
      
      {/* Wallet Modal */}
      {showWalletModal && (
        <ConversionWalletModal
          assetPair={assetPair}
          onClose={() => setShowWalletModal(false)}
          onDemoConversion={handleDemoConversion}
        />
      )}
    </div>
  );
} 