import { createConfig, http } from 'wagmi';
import { mainnet } from 'wagmi/chains';
import { injected, metaMask, walletConnect } from 'wagmi/connectors';

const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID;

function createConnectors() {
  const baseConnectors = [
    injected(),
    metaMask(),
  ];

  // Only add WalletConnect if we have a valid project ID
  if (projectId && projectId.trim() !== '') {
    return [
      ...baseConnectors,
      walletConnect({ 
        projectId,
        metadata: {
          name: 'wBTC Asset Converter',
          description: 'Convert between USD and cryptocurrency assets with real-time pricing',
          url: 'https://your-app.com',
          icons: ['https://your-app.com/logo.png'],
        },
      })
    ];
  }

  return baseConnectors;
}

export const config = createConfig({
  chains: [mainnet],
  connectors: createConnectors(),
  transports: {
    [mainnet.id]: http(),
  },
  ssr: false,
});

// Chain constants moved to src/lib/network-utils.ts for better organization 