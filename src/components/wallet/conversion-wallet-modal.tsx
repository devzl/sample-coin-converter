'use client';

import { useSwitchChain } from 'wagmi';
import { ConnectKitButton } from 'connectkit';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Wallet, WifiOff, AlertTriangle, CheckCircle } from 'lucide-react';
import { SUPPORTED_CHAIN_ID, SUPPORTED_CHAIN_NAME, getNetworkName, getAssetNetworkRequirement } from '@/lib/network-utils';
import { formatWalletAddress } from '@/lib/wallet-utils';
import { useWalletMonitor } from '@/hooks/useWalletMonitor';
import { AssetPair } from '@/types/asset';

interface ConversionWalletModalProps {
  assetPair: AssetPair;
  onClose: () => void;
  onDemoConversion: () => void;
}

export default function ConversionWalletModal({ 
  assetPair, 
  onClose, 
  onDemoConversion 
}: ConversionWalletModalProps) {
  const { switchChain, isPending } = useSwitchChain();
  
  // Use the reusable wallet monitor hook
  const { walletState, isCorrectNetwork } = useWalletMonitor({
    onWalletDisconnected: onClose,
    autoCloseOnDisconnect: true,
  });

  const { isConnected, address, chainId: currentChainId } = walletState;
  const assetRequirement = getAssetNetworkRequirement(assetPair.quote.symbol);
  const isNetworkCorrect = isCorrectNetwork(assetPair.quote.symbol);

  const handleSwitchNetwork = async () => {
    try {
      await switchChain({ chainId: SUPPORTED_CHAIN_ID });
    } catch (error) {
      // Don't show error toast as user might have cancelled
      console.error('Network switch failed:', error);
    }
  };

  const handleDemoConversion = () => {
    onDemoConversion();
    onClose();
  };

  // Network status for different asset types
  const getNetworkStatus = () => {
    const isSolanaAsset = assetRequirement.networkName === 'Solana';
    const isEthereumAsset = assetRequirement.isSupported && assetRequirement.requiredChainId;

    if (!isConnected) {
      return {
        type: 'disconnected' as const,
        title: 'Wallet Connection Required',
        description: `To convert ${assetPair.base.symbol} to ${assetPair.quote.symbol}, please connect your wallet first.`,
        icon: <WifiOff className="h-4 w-4" />,
        action: 'connect',
      };
    }

    if (isSolanaAsset) {
      return {
        type: 'unsupported' as const,
        title: 'Incorrect Blockchain Network',
        description: `You're connected to ${SUPPORTED_CHAIN_NAME}, but ${assetPair.quote.symbol} requires a Solana wallet connection. Solana is currently unsupported in this demo.`,
        icon: <AlertTriangle className="h-4 w-4 text-amber-500" />,
        action: 'unsupported',
      };
    }

    if (isEthereumAsset && !isNetworkCorrect && currentChainId) {
      const currentNetworkName = getNetworkName(currentChainId);
      return {
        type: 'wrong-network' as const,
        title: 'Wrong Network Connected',
        description: `Please switch to ${SUPPORTED_CHAIN_NAME} to convert ${assetPair.quote.symbol}. You're currently connected to ${currentNetworkName}.`,
        icon: <AlertTriangle className="h-4 w-4 text-red-500" />,
        action: 'switch',
      };
    }

    if (isEthereumAsset && isNetworkCorrect) {
      return {
        type: 'connected' as const,
        title: 'Ready for Conversion',
        description: `Wallet connected to ${SUPPORTED_CHAIN_NAME}. Ready to proceed with ${assetPair.quote.symbol} conversion.`,
        icon: <CheckCircle className="h-4 w-4 text-green-500" />,
        action: 'convert',
      };
    }

    return {
      type: 'unknown' as const,
      title: 'Unknown Status',
      description: 'Unable to determine network compatibility',
      icon: <WifiOff className="h-4 w-4" />,
      action: 'unknown',
    };
  };

  const networkStatus = getNetworkStatus();

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wallet className="h-5 w-5" />
            Wallet Required for Conversion
          </CardTitle>
          <CardDescription>
            Connect your wallet to proceed with the {assetPair.base.symbol} to {assetPair.quote.symbol} conversion
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Current Wallet Status */}
          {isConnected && (
            <div className="text-sm space-y-1">
              <div>
                <p className="font-medium">Connected Wallet:</p>
                <p className="text-muted-foreground">{formatWalletAddress(address)}</p>
              </div>
              <div>
                <p className="font-medium">Current Network:</p>
                <p className={`text-sm ${isNetworkCorrect ? 'text-green-600' : 'text-amber-600'}`}>
                  {currentChainId ? getNetworkName(currentChainId) : 'Unknown'} {currentChainId && `(Chain ID: ${currentChainId})`}
                </p>
              </div>
            </div>
          )}

          {/* Network Status Alert */}
          <Alert>
            {networkStatus.icon}
            <AlertTitle>{networkStatus.title}</AlertTitle>
            <AlertDescription>{networkStatus.description}</AlertDescription>
          </Alert>

          {/* Action Buttons */}
          <div className="flex flex-col gap-2">
            {networkStatus.action === 'connect' && (
              <ConnectKitButton />
            )}

            {networkStatus.action === 'switch' && (
              <Button 
                onClick={handleSwitchNetwork} 
                disabled={isPending}
                className="w-full"
              >
                {isPending ? 'Switching...' : `Switch to ${SUPPORTED_CHAIN_NAME}`}
              </Button>
            )}

            {networkStatus.action === 'convert' && (
              <Button 
                onClick={handleDemoConversion}
                className="w-full cursor-pointer"
              >
                🎯 Proceed with Demo Conversion
              </Button>
            )}

            {networkStatus.action === 'unsupported' && (
              <Button 
                variant="secondary"
                disabled
                className="w-full"
              >
                Solana Not Supported
              </Button>
            )}

            {/* Close Button */}
            <Button 
              variant="outline" 
              onClick={onClose}
              className="w-full"
            >
              Cancel
            </Button>
          </div>

          {/* Demo Note */}
          <div className="text-xs text-muted-foreground text-center pt-2 border-t">
            <p>Demo Mode: No real transactions will be executed</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 