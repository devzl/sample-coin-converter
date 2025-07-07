'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp, Settings } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import ConfigurableAssetConverter from '@/components/configurable-asset-converter';
import { ASSET_PAIRS, AssetPairType } from '@/types/asset';

export default function Home() {
  const [selectedPair, setSelectedPair] = useState<AssetPairType>('USD_WBTC');
  const [isSelectorOpen, setIsSelectorOpen] = useState(false);

  const assetPair = ASSET_PAIRS[selectedPair];

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold tracking-tight mb-2">
            Configurable Asset Converter
          </h1>
          <p className="text-lg text-muted-foreground">
            Convert between different cryptocurrency assets with real-time pricing
          </p>
        </div>
        
        {/* Configurable Asset Converter */}
        <ConfigurableAssetConverter 
          assetPair={assetPair}
          title={`${assetPair.base.symbol}/${assetPair.quote.symbol} Converter`}
          description={`Convert between ${assetPair.base.name} and ${assetPair.quote.name} with real-time pricing`}
        />

        {/* Collapsible Asset Pair Selector */}
        <div className="max-w-2xl mx-auto mt-6">
          <Button
            variant="outline"
            onClick={() => setIsSelectorOpen(!isSelectorOpen)}
            className="w-full justify-between h-auto p-4"
          >
            <div className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              <span className="font-medium">Change Asset Pair</span>
              <span className="text-sm text-muted-foreground">
                (Currently: {assetPair.base.symbol}/{assetPair.quote.symbol})
              </span>
            </div>
            {isSelectorOpen ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </Button>
          
          {isSelectorOpen && (
            <Card className="mt-2">
              <CardHeader>
                <CardTitle className="text-lg">Select Asset Pair</CardTitle>
                <CardDescription>
                  Choose which assets you want to convert between
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {Object.entries(ASSET_PAIRS).map(([key, pair]) => (
                    <Button
                      key={key}
                      variant={selectedPair === key ? "default" : "outline"}
                      onClick={() => {
                        setSelectedPair(key as AssetPairType);
                        setIsSelectorOpen(false); // Close selector after selection
                      }}
                      className="h-auto p-4 flex flex-col items-center gap-2"
                    >
                      <div className="flex items-center gap-2">
                        {pair.base.icon && !pair.base.icon.startsWith('http') && (
                          <span className="text-lg">{pair.base.icon}</span>
                        )}
                        <span className="font-medium">{pair.base.symbol}</span>
                        <span className="text-muted-foreground">↔</span>
                        <span className="font-medium">{pair.quote.symbol}</span>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {pair.base.symbol}/{pair.quote.symbol}
                      </span>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}
