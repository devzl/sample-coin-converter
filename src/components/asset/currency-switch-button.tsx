import { ArrowUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CurrencySwitchButtonProps {
  onSwitch: () => void;
  disabled?: boolean;
}

export function CurrencySwitchButton({ onSwitch, disabled = false }: CurrencySwitchButtonProps) {
  return (
    <div className="flex justify-center">
      <Button
        variant="outline"
        onClick={onSwitch}
        disabled={disabled}
        className="flex items-center gap-2 cursor-pointer"
      >
        <ArrowUpDown className="h-4 w-4" />
        Switch Currencies
      </Button>
    </div>
  );
} 