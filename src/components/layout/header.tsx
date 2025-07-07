'use client';

import { ConnectKitButton } from 'connectkit';
import { Wallet } from 'lucide-react';

export default function Header() {
  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo/Title */}
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <Wallet className="h-4 w-4 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-lg font-semibold">Asset Converter</h1>
              <p className="text-xs text-muted-foreground">Real-time crypto conversion</p>
            </div>
          </div>

          {/* Wallet Connection */}
          <div className="flex items-center">
            <ConnectKitButton />
          </div>
        </div>
      </div>
    </header>
  );
}
