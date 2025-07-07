'use client';

import { useEffect } from 'react';
import { WagmiProvider } from 'wagmi';
import { ConnectKitProvider } from 'connectkit';
import { config } from '@/lib/wagmi-config';
import { showWalletConnectConfigWarningToast } from '@/lib/toast-utils';

interface Web3ProviderProps {
  children: React.ReactNode;
}

export default function Web3Provider({ children }: Web3ProviderProps) {
  useEffect(() => {
    // Check if WalletConnect project ID is configured
    const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID;
    if (!projectId || projectId.trim() === '') {
      // Show warning toast after a short delay to ensure toast system is ready
      setTimeout(() => {
        showWalletConnectConfigWarningToast();
      }, 1000);
    }
  }, []);

  return (
    <WagmiProvider config={config}>
      <ConnectKitProvider
        theme="auto"
        mode="light"
        customTheme={{
          '--ck-font-family': 'inherit',
        }}
      >
        {children}
      </ConnectKitProvider>
    </WagmiProvider>
  );
}
