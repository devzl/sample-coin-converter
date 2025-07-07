'use client';

import { WagmiProvider } from 'wagmi';
import { ConnectKitProvider } from 'connectkit';
import { config } from '@/lib/wagmi-config';

interface Web3ProviderProps {
  children: React.ReactNode;
}

export default function Web3Provider({ children }: Web3ProviderProps) {
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