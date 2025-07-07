import { toast } from 'sonner';

/**
 * Toast configuration constants
 */
export const TOAST_CONFIG = {
  duration: {
    short: 3000,
    medium: 5000,
    long: 8000,
  },
  classes: {
    demoConversion: 'toast-demo-conversion',
    error: 'toast-error',
    success: 'toast-success',
    warning: 'toast-warning',
  },
} as const;

/**
 * Show demo conversion completion toast
 */
export function showDemoConversionToast(fromAsset: string, toAsset: string): void {
  toast.success('🎉 Demo Conversion Complete!', {
    description: `This demo would execute a ${fromAsset} to ${toAsset} conversion. In a real implementation, this would interact with smart contracts and execute the actual swap.`,
    duration: TOAST_CONFIG.duration.medium,
    className: TOAST_CONFIG.classes.demoConversion,
  });
}

/**
 * Show network switch success toast
 */
export function showNetworkSwitchSuccessToast(networkName: string): void {
  toast.success('Network Switched', {
    description: `Successfully switched to ${networkName}`,
    duration: TOAST_CONFIG.duration.short,
  });
}

/**
 * Show wallet connection success toast
 */
export function showWalletConnectedToast(address: string): void {
  toast.success('Wallet Connected', {
    description: `Connected to ${address}`,
    duration: TOAST_CONFIG.duration.short,
  });
}

/**
 * Show generic error toast
 */
export function showErrorToast(title: string, description?: string): void {
  toast.error(title, {
    description,
    duration: TOAST_CONFIG.duration.medium,
    className: TOAST_CONFIG.classes.error,
  });
}

/**
 * Show validation error toast
 */
export function showValidationErrorToast(message: string): void {
  toast.error('Validation Error', {
    description: message,
    duration: TOAST_CONFIG.duration.medium,
  });
}

/**
 * Show price fetch error toast
 */
export function showPriceFetchErrorToast(assetSymbol: string): void {
  toast.error('Price Data Unavailable', {
    description: `Failed to fetch ${assetSymbol} price data. Please try refreshing.`,
    duration: TOAST_CONFIG.duration.medium,
  });
}

/**
 * Show WalletConnect configuration warning toast
 */
export function showWalletConnectConfigWarningToast(): void {
  toast.warning('WalletConnect Not Configured', {
    description:
      'NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID not set in environment. Demo continues with injected wallets only (MetaMask, Vultisig, browser wallets).',
    duration: TOAST_CONFIG.duration.long,
    className: TOAST_CONFIG.classes.warning,
  });
}
