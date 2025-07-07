import { Address } from 'viem';

/**
 * Format wallet address for display
 */
export function formatWalletAddress(
  address: Address | undefined,
  prefixLength = 6,
  suffixLength = 4
): string {
  if (!address) return '';
  return `${address.slice(0, prefixLength)}...${address.slice(-suffixLength)}`;
}

/**
 * Wallet connection status types
 */
export type WalletStatus = 'connected' | 'disconnected' | 'connecting' | 'reconnecting';

/**
 * Network compatibility check result
 */
export interface NetworkCompatibility {
  isCompatible: boolean;
  currentNetwork: string;
  requiredNetwork: string | null;
  canSwitch: boolean;
  reason?: string;
}

/**
 * Wallet state information
 */
export interface WalletState {
  isConnected: boolean;
  address: Address | undefined;
  chainId: number | undefined;
  status: WalletStatus;
}

/**
 * Check if wallet state has changed significantly
 */
export function hasWalletStateChanged(previous: WalletState | null, current: WalletState): boolean {
  if (!previous) return true;

  return (
    previous.isConnected !== current.isConnected ||
    previous.address !== current.address ||
    previous.chainId !== current.chainId ||
    previous.status !== current.status
  );
}

/**
 * Get wallet connection display text
 */
export function getWalletDisplayText(walletState: WalletState): {
  status: string;
  address?: string;
} {
  if (!walletState.isConnected) {
    return { status: 'Not Connected' };
  }

  return {
    status: 'Connected',
    address: formatWalletAddress(walletState.address),
  };
}

/**
 * Determine if a modal should auto-close based on wallet state
 */
export function shouldAutoCloseModal(
  walletState: WalletState,
  previouslyConnected: boolean
): boolean {
  return previouslyConnected && !walletState.isConnected && walletState.status === 'disconnected';
}
