import { createConfig, http } from 'wagmi';
import { mainnet } from 'wagmi/chains';
import { injected, metaMask, walletConnect } from 'wagmi/connectors';

const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || 'demo-project-id';

export const config = createConfig({
  chains: [mainnet],
  connectors: [
    injected(),
    metaMask(),
    walletConnect({ 
      projectId,
      metadata: {
        name: 'wBTC Asset Converter',
        description: 'Convert between USD and cryptocurrency assets with real-time pricing',
        url: 'https://your-app.com',
        icons: ['https://your-app.com/logo.png'],
      },
    }),
  ],
  transports: {
    [mainnet.id]: http(),
  },
  ssr: false,
});

// Chain constants moved to src/lib/network-utils.ts for better organization 