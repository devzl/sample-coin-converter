import { useQuery } from '@tanstack/react-query';
import { fetchAssetPrice } from '@/lib/asset-api';
import { AssetPair, PriceData } from '@/types/asset';

export interface UseAssetPriceOptions {
  refetchInterval?: number;
  enabled?: boolean;
}

/**
 * React Query hook for fetching asset pair price
 * @param pair - Asset pair configuration
 * @param options - Query options
 * @returns Query result with price data
 */
export function useAssetPrice(pair: AssetPair, options: UseAssetPriceOptions = {}) {
  const { refetchInterval = 30000, enabled = true } = options; // Refetch every 30 seconds by default

  return useQuery<PriceData, Error>({
    queryKey: ['asset-price', pair.base.id, pair.quote.id],
    queryFn: () => fetchAssetPrice(pair),
    refetchInterval,
    refetchIntervalInBackground: true, // Continue refreshing in background
    enabled,
    staleTime: 5000, // Data is fresh for 5 seconds
    gcTime: 300000, // Keep in cache for 5 minutes
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
}
