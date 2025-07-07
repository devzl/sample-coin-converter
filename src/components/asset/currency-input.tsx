import Image from 'next/image';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AssetConfig } from '@/types/asset';

interface CurrencyInputProps {
  asset: AssetConfig;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  hasError?: boolean;
}

export function CurrencyInput({ 
  asset, 
  value, 
  onChange, 
  placeholder, 
  hasError 
}: CurrencyInputProps) {
  const formatInputValue = (inputValue: string): string => {
    if (!inputValue) return inputValue;
    
    // Don't format while typing
    if (inputValue.endsWith('.')) return inputValue;
    
    const parts = inputValue.split('.');
    if (parts.length === 2) {
      const decimals = parts[1];
      if (decimals.length > asset.decimals) {
        return `${parts[0]}.${decimals.slice(0, asset.decimals)}`;
      }
    }
    
    return inputValue;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = formatInputValue(e.target.value);
    onChange(formattedValue);
  };

  const renderAssetIcon = () => {
    if (!asset.icon) return null;

    if (asset.icon.startsWith('http')) {
      return (
        <Image
          src={asset.icon}
          alt={asset.symbol}
          width={24}
          height={24}
          className="h-6 w-6"
        />
      );
    }

    // For text icons like "$"
    return (
      <span className="text-muted-foreground text-sm">
        {asset.icon}
      </span>
    );
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="amount">
        Amount ({asset.symbol})
      </Label>
      <div className="relative">
        <Input
          id="amount"
          type="number"
          placeholder={placeholder || `Enter ${asset.symbol} amount`}
          value={value}
          onChange={handleChange}
          className={`pr-12 ${hasError ? 'border-destructive' : ''}`}
          step={asset.decimals === 2 ? '0.01' : '0.00000001'}
          min="0"
        />
        {asset.icon && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            {renderAssetIcon()}
          </div>
        )}
      </div>
      <p className="text-xs text-muted-foreground">
        Maximum {asset.decimals} decimal places
      </p>
    </div>
  );
} 