'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ChevronDown, ChevronUp, Settings } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ASSET_PAIRS, AssetPairType } from '@/types/asset';
import { UI_CONSTANTS, COMPONENT_CONFIGS } from '@/lib/ui-constants';

interface AssetPairSelectorProps {
  selectedPair: AssetPairType;
  onPairChange: (pair: AssetPairType) => void;
  className?: string;
  isCollapsibleByDefault?: boolean;
}

export default function AssetPairSelector({
  selectedPair,
  onPairChange,
  className = '',
  isCollapsibleByDefault = true,
}: AssetPairSelectorProps) {
  const [isOpen, setIsOpen] = useState(!isCollapsibleByDefault);
  
  const selectedAssetPair = ASSET_PAIRS[selectedPair];

  const handlePairSelect = (pairKey: AssetPairType) => {
    onPairChange(pairKey);
    if (isCollapsibleByDefault) {
      setIsOpen(false); // Auto-collapse after selection if it was collapsible
    }
  };

  const renderAssetIcon = (icon: string | undefined) => {
    if (!icon) return null;
    if (icon.startsWith('http')) {
      return <Image src={icon} alt="" width={20} height={20} className="w-5 h-5" />;
    }
    return <span className="text-lg">{icon}</span>;
  };

  if (isCollapsibleByDefault) {
    return (
      <div className={`${COMPONENT_CONFIGS.assetPairSelector.maxWidth} mx-auto ${className}`}>
        <Button
          variant="outline"
          onClick={() => setIsOpen(!isOpen)}
          className={`w-full justify-between h-auto ${COMPONENT_CONFIGS.assetPairSelector.buttonPadding}`}
        >
          <div className={`flex items-center ${UI_CONSTANTS.spacing.sm}`}>
            <Settings className={UI_CONSTANTS.iconSizes.sm} />
            <span className="font-medium">Change Asset Pair</span>
            <span className="text-sm text-muted-foreground">
              (Currently: {selectedAssetPair.base.symbol}/{selectedAssetPair.quote.symbol})
            </span>
          </div>
          {isOpen ? (
            <ChevronUp className={UI_CONSTANTS.iconSizes.sm} />
          ) : (
            <ChevronDown className={UI_CONSTANTS.iconSizes.sm} />
          )}
        </Button>
        
        {isOpen && (
          <Card className="mt-2">
            <CardHeader>
              <CardTitle className="text-lg">Select Asset Pair</CardTitle>
              <CardDescription>
                Choose which assets you want to convert between
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AssetPairGrid 
                selectedPair={selectedPair}
                onPairSelect={handlePairSelect}
                renderAssetIcon={renderAssetIcon}
              />
            </CardContent>
          </Card>
        )}
      </div>
    );
  }

  // Non-collapsible version
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-lg">Select Asset Pair</CardTitle>
        <CardDescription>
          Choose which assets you want to convert between
        </CardDescription>
      </CardHeader>
      <CardContent>
        <AssetPairGrid 
          selectedPair={selectedPair}
          onPairSelect={handlePairSelect}
          renderAssetIcon={renderAssetIcon}
        />
      </CardContent>
    </Card>
  );
}

interface AssetPairGridProps {
  selectedPair: AssetPairType;
  onPairSelect: (pair: AssetPairType) => void;
  renderAssetIcon: (icon: string | undefined) => React.ReactNode;
}

function AssetPairGrid({ selectedPair, onPairSelect, renderAssetIcon }: AssetPairGridProps) {
  return (
    <div className={`grid ${COMPONENT_CONFIGS.assetPairSelector.gridCols} ${UI_CONSTANTS.spacing.md}`}>
      {Object.entries(ASSET_PAIRS).map(([key, pair]) => (
        <Button
          key={key}
          variant={selectedPair === key ? "default" : "outline"}
          onClick={() => onPairSelect(key as AssetPairType)}
          className={`h-auto ${COMPONENT_CONFIGS.assetPairSelector.buttonPadding} flex flex-col items-center ${UI_CONSTANTS.spacing.sm}`}
        >
          <div className={`flex items-center ${UI_CONSTANTS.spacing.sm}`}>
            {renderAssetIcon(pair.base.icon)}
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
  );
} 