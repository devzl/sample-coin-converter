import { mainnet } from 'wagmi/chains';

export const SUPPORTED_CHAIN_ID = mainnet.id;
export const SUPPORTED_CHAIN_NAME = mainnet.name;

/**
 * Network information mapping
 */
export const NETWORK_INFO: Record<number, { name: string; shortName: string; color: string }> = {
  1: { name: 'Ethereum Mainnet', shortName: 'Ethereum', color: 'text-blue-600' },
  42161: { name: 'Arbitrum One', shortName: 'Arbitrum', color: 'text-blue-500' },
  10: { name: 'Optimism', shortName: 'Optimism', color: 'text-red-500' },
  137: { name: 'Polygon', shortName: 'Polygon', color: 'text-purple-600' },
  56: { name: 'BNB Smart Chain', shortName: 'BSC', color: 'text-yellow-600' },
  43114: { name: 'Avalanche', shortName: 'AVAX', color: 'text-red-600' },
  250: { name: 'Fantom', shortName: 'FTM', color: 'text-blue-400' },
  8453: { name: 'Base', shortName: 'Base', color: 'text-blue-600' },
  5000: { name: 'Mantle', shortName: 'Mantle', color: 'text-black' },
  324: { name: 'zkSync Era', shortName: 'zkSync', color: 'text-gray-600' },
};

/**
 * Get network name by chain ID
 */
export function getNetworkName(chainId: number): string {
  return NETWORK_INFO[chainId]?.name || `Chain ${chainId}`;
}

/**
 * Get short network name by chain ID
 */
export function getNetworkShortName(chainId: number): string {
  return NETWORK_INFO[chainId]?.shortName || `Chain ${chainId}`;
}

/**
 * Get network display color class
 */
export function getNetworkColor(chainId: number): string {
  return NETWORK_INFO[chainId]?.color || 'text-gray-600';
}

/**
 * Check if network is supported for Ethereum assets
 */
export function isEthereumCompatibleNetwork(chainId: number): boolean {
  return chainId === SUPPORTED_CHAIN_ID;
}

/**
 * Check if asset requires specific network
 */
export function getAssetNetworkRequirement(assetSymbol: string): {
  requiredChainId: number | null;
  isSupported: boolean;
  networkName: string;
} {
  const ethereumAssets = ['wBTC', 'ETH'];
  const solanaAssets = ['SOL'];

  if (ethereumAssets.includes(assetSymbol)) {
    return {
      requiredChainId: SUPPORTED_CHAIN_ID,
      isSupported: true,
      networkName: SUPPORTED_CHAIN_NAME,
    };
  }

  if (solanaAssets.includes(assetSymbol)) {
    return {
      requiredChainId: null, // Solana doesn't use EVM chain IDs
      isSupported: false,
      networkName: 'Solana',
    };
  }

  // USD or other assets - no specific requirement (Even if USD is not technically a coin, but for this demo we treat it as such)
  return {
    requiredChainId: null,
    isSupported: true,
    networkName: 'Any',
  };
}
