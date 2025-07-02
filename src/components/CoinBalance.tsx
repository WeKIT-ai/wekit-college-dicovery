import { useState } from "react";
import { Coins } from "lucide-react";

interface CoinBalanceProps {
  balance: number;
  className?: string;
}

export function CoinBalance({ balance, className = "" }: CoinBalanceProps) {
  return (
    <div className={`flex items-center gap-2 bg-gradient-primary text-primary-foreground px-3 py-1 rounded-full shadow-glow ${className}`}>
      <Coins className="h-4 w-4" />
      <span className="font-semibold">{balance.toLocaleString()}</span>
    </div>
  );
}