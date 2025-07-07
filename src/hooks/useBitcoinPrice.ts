import { useQuery } from '@tanstack/react-query';
import { fetchBitcoinPrice, BitcoinPriceData } from '@/lib/api';

export interface UseBitcoinPriceOptions {
  refetchInterval?: number;
  enabled?: boolean;
}

/**
 * React Query hook for fetching Bitcoin price
 * @param options - Query options
 * @returns Query result with Bitcoin price data
 */
export function useBitcoinPrice(options: UseBitcoinPriceOptions = {}) {
  const { refetchInterval = 30000, enabled = true } = options; // Refetch every 30 seconds by default

  return useQuery<BitcoinPriceData, Error>({
    queryKey: ['bitcoin-price'],
    queryFn: fetchBitcoinPrice,
    refetchInterval,
    refetchIntervalInBackground: true, // Continue refreshing in background
    enabled,
    staleTime: 5000, // Data is fresh for 5 seconds
    gcTime: 300000, // Keep in cache for 5 minutes
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
}
