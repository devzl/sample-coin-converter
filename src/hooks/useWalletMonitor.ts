import { useEffect, useRef, useMemo } from 'react';
import { useAccount, useChainId } from 'wagmi';
import { WalletState, WalletStatus, hasWalletStateChanged, shouldAutoCloseModal } from '@/lib/wallet-utils';
import { getAssetNetworkRequirement, isEthereumCompatibleNetwork } from '@/lib/network-utils';

export interface WalletMonitorConfig {
  onWalletDisconnected?: () => void;
  onNetworkChanged?: (chainId: number) => void;
  onWalletConnected?: (address: string) => void;
  trackNetworkChanges?: boolean;
  trackConnectionChanges?: boolean;
  autoCloseOnDisconnect?: boolean;
}

export interface WalletMonitorReturn {
  walletState: WalletState;
  isCorrectNetwork: (assetSymbol?: string) => boolean;
  networkCompatibility: {
    isCompatible: boolean;
    reason?: string;
  };
}

/**
 * Custom hook for monitoring wallet state changes
 * Provides reusable wallet monitoring logic with optional callbacks
 */
export function useWalletMonitor(config: WalletMonitorConfig = {}): WalletMonitorReturn {
  const {
    onWalletDisconnected,
    onNetworkChanged,
    onWalletConnected,
    trackNetworkChanges = true,
    trackConnectionChanges = true,
    autoCloseOnDisconnect = false,
  } = config;

  const { address, isConnected, status } = useAccount();
  const chainId = useChainId();
  
  const previousStateRef = useRef<WalletState | null>(null);
  const wasConnectedRef = useRef(false);

  // Current wallet state
  const walletState: WalletState = useMemo(() => ({
    isConnected,
    address,
    chainId,
    status: status as WalletStatus,
  }), [isConnected, address, chainId, status]);

  // Track connection changes
  useEffect(() => {
    if (!trackConnectionChanges) return;

    const previousState = previousStateRef.current;
    
    if (hasWalletStateChanged(previousState, walletState)) {
      // Handle wallet connection
      if (!previousState?.isConnected && walletState.isConnected && address) {
        onWalletConnected?.(address);
        wasConnectedRef.current = true;
      }
      
      // Handle wallet disconnection
      if (shouldAutoCloseModal(walletState, wasConnectedRef.current)) {
        onWalletDisconnected?.();
        wasConnectedRef.current = false;
      }
      
      previousStateRef.current = walletState;
    }
  }, [
    walletState.isConnected,
    walletState.address,
    walletState.status,
    onWalletConnected,
    onWalletDisconnected,
    trackConnectionChanges,
    address,
  ]);

  // Track network changes
  useEffect(() => {
    if (!trackNetworkChanges || !chainId) return;
    
    const previousState = previousStateRef.current;
    if (previousState?.chainId !== chainId) {
      onNetworkChanged?.(chainId);
    }
  }, [chainId, onNetworkChanged, trackNetworkChanges, walletState]);

  // Auto-close functionality
  useEffect(() => {
    if (autoCloseOnDisconnect && shouldAutoCloseModal(walletState, wasConnectedRef.current)) {
      onWalletDisconnected?.();
      wasConnectedRef.current = false;
    }
  }, [walletState, autoCloseOnDisconnect, onWalletDisconnected]);

  /**
   * Check if current network is correct for given asset
   */
  const isCorrectNetwork = (assetSymbol?: string): boolean => {
    if (!chainId || !assetSymbol) return true;
    
    const requirement = getAssetNetworkRequirement(assetSymbol);
    if (!requirement.requiredChainId) return true; // No specific requirement
    
    return isEthereumCompatibleNetwork(chainId);
  };

  /**
   * Get network compatibility information
   */
  const networkCompatibility = {
    isCompatible: chainId ? isEthereumCompatibleNetwork(chainId) : false,
    reason: chainId && !isEthereumCompatibleNetwork(chainId) 
      ? 'Connected to unsupported network' 
      : undefined,
  };

  return {
    walletState,
    isCorrectNetwork,
    networkCompatibility,
  };
}

/**
 * Simplified hook for basic wallet state without monitoring
 */
export function useWalletState(): WalletState {
  const { address, isConnected, status } = useAccount();
  const chainId = useChainId();
  
  return {
    isConnected,
    address,
    chainId,
    status: status as WalletStatus,
  };
} 