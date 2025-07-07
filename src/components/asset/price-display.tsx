import { RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PriceData } from '@/types/asset';
import { formatAssetAmount } from '@/lib/asset-api';

interface ContractData {
  decimals: number | null;
  symbol: string | null;
  isLoading: boolean;
  isConnected: boolean;
}

interface PriceDisplayProps {
  priceData?: PriceData;
  isLoading: boolean;
  isRefreshing: boolean;
  priceChangeAnimation: boolean;
  onRefresh: () => void;
  contractData?: ContractData;
}

export function PriceDisplay({
  priceData,
  isLoading,
  isRefreshing,
  priceChangeAnimation,
  onRefresh,
  contractData,
}: PriceDisplayProps) {
  return (
    <div className="p-4 bg-muted rounded-lg">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">
          Current {priceData?.pair.quote.name || 'Asset'} Price:
        </span>
        <div className="flex items-center gap-2">
          {isLoading ? (
            <div className="animate-pulse bg-muted-foreground/20 h-6 w-24 rounded" />
          ) : priceData ? (
            <span
              className={`text-lg font-bold transition-all duration-300 ${priceChangeAnimation ? 'scale-105 text-muted-foreground' : ''}`}
            >
              {priceData.pair.base.icon &&
              typeof priceData.pair.base.icon === 'string' &&
              !priceData.pair.base.icon.startsWith('http')
                ? priceData.pair.base.icon
                : ''}
              {formatAssetAmount(priceData.price, priceData.pair.base.decimals)}
            </span>
          ) : (
            <span className="text-destructive">Failed to load</span>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={onRefresh}
            disabled={isLoading || isRefreshing}
            title="Refresh now"
            className={`${isLoading || isRefreshing ? 'cursor-not-allowed' : 'cursor-pointer'}`}
          >
            <RefreshCw className={`h-4 w-4 ${isLoading || isRefreshing ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </div>

      {/* On-chain contract data display */}
      {contractData?.isConnected &&
        (contractData.decimals !== null || contractData.symbol !== null) && (
          <div className="mt-2 pt-2 border-t border-muted-foreground/20">
            <p className="text-xs text-muted-foreground">
              On-chain data:{' '}
              {contractData.isLoading ? (
                <span className="animate-pulse">Loading...</span>
              ) : (
                <>
                  {contractData.symbol && <span>Symbol: {contractData.symbol}</span>}
                  {contractData.symbol && contractData.decimals !== null && <span> • </span>}
                  {contractData.decimals !== null && <span>Decimals: {contractData.decimals}</span>}
                </>
              )}
            </p>
          </div>
        )}

      {priceData && (
        <p className="text-xs text-muted-foreground mt-1">
          Last updated: {priceData.lastUpdated.toLocaleTimeString()}
        </p>
      )}
    </div>
  );
}
