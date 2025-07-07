'use client';

import { useReadContract, useAccount } from 'wagmi';
import { erc20Abi } from 'viem';

interface ContractDataResult {
  decimals: number | null;
  symbol: string | null;
  isLoading: boolean;
  isConnected: boolean;
}

/**
 * Hook to read ERC-20 contract data (decimals and symbol) from blockchain
 * Only reads when wallet is connected and contract address is provided
 */
export function useContractData(contractAddress?: string): ContractDataResult {
  const { isConnected } = useAccount();

  // Read decimals from contract
  const { data: decimals, isLoading: decimalsLoading } = useReadContract({
    address: contractAddress as `0x${string}`,
    abi: erc20Abi,
    functionName: 'decimals',
    query: {
      enabled: isConnected && !!contractAddress,
    },
  });

  // Read symbol from contract
  const { data: symbol, isLoading: symbolLoading } = useReadContract({
    address: contractAddress as `0x${string}`,
    abi: erc20Abi,
    functionName: 'symbol',
    query: {
      enabled: isConnected && !!contractAddress,
    },
  });

  return {
    decimals: decimals ? Number(decimals) : null,
    symbol: symbol || null,
    isLoading: decimalsLoading || symbolLoading,
    isConnected,
  };
} 