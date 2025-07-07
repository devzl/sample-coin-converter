'use client';

import { useState } from 'react';
import ConfigurableAssetConverter from '@/components/configurable-asset-converter';
import AssetPairSelector from '@/components/ui/asset-pair-selector';
import { ASSET_PAIRS, AssetPairType } from '@/types/asset';

export default function Home() {
  const [selectedPair, setSelectedPair] = useState<AssetPairType>('USD_WBTC');

  const assetPair = ASSET_PAIRS[selectedPair];

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight mb-2">
            Real-time Cryptocurrency Conversion
          </h1>
          <p className="text-lg text-muted-foreground">
            Convert between USD and popular cryptocurrencies with Web3 wallet integration
          </p>
        </div>

        {/* Configurable Asset Converter */}
        <ConfigurableAssetConverter
          assetPair={assetPair}
          title={`${assetPair.base.symbol}/${assetPair.quote.symbol} Converter`}
          description={`Convert between ${assetPair.base.name} and ${assetPair.quote.name} with real-time pricing`}
        />

        {/* Reusable Asset Pair Selector */}
        <AssetPairSelector
          selectedPair={selectedPair}
          onPairChange={setSelectedPair}
          className="mt-6"
          isCollapsibleByDefault={true}
        />
      </main>
    </div>
  );
}
