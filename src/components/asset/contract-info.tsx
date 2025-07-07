import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AssetConfig } from '@/types/asset';

interface ContractInfoProps {
  asset: AssetConfig;
}

export function ContractInfo({ asset }: ContractInfoProps) {
  if (!asset.contractAddress) return null;

  const etherscanUrl = `https://etherscan.io/address/${asset.contractAddress}`;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">About {asset.symbol}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          {asset.name} {asset.symbol === 'wBTC' && (
            <>
              is an ERC-20 token backed 1:1 with Bitcoin. 
              It brings Bitcoin&apos;s liquidity to the Ethereum ecosystem, enabling Bitcoin holders 
              to participate in DeFi applications.
            </>
          )}
        </p>
        {asset.contractAddress && (
          <p className="text-xs text-muted-foreground mt-2">
            {asset.symbol} Contract Address:{' '}
            <a
              href={etherscanUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline font-mono break-all"
            >
              {asset.contractAddress}
            </a>
          </p>
        )}
        {asset.network && (
          <p className="text-xs text-muted-foreground mt-1">
            Network: {asset.network}
          </p>
        )}
      </CardContent>
    </Card>
  );
} 