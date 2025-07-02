import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Coins } from "lucide-react";

interface CoinBalanceProps {
  balance?: number;
  className?: string;
}

export function CoinBalance({ balance, className = "" }: CoinBalanceProps) {
  const { user } = useAuth();
  const [coins, setCoins] = useState(balance || 0);

  useEffect(() => {
    if (user && balance === undefined) {
      fetchUserCoins();
    }
  }, [user, balance]);

  const fetchUserCoins = async () => {
    if (!user) return;
    
    try {
      const { data } = await supabase
        .from('user_profiles')
        .select('coins_balance')
        .eq('user_id', user.id)
        .single();
      
      if (data) {
        setCoins(data.coins_balance || 0);
      }
    } catch (error) {
      console.log('Failed to fetch coin balance');
    }
  };

  const displayBalance = balance !== undefined ? balance : coins;

  return (
    <div className={`flex items-center gap-2 bg-gradient-primary text-primary-foreground px-3 py-1 rounded-full shadow-glow ${className}`}>
      <Coins className="h-4 w-4" />
      <span className="font-semibold">{displayBalance.toLocaleString()}</span>
    </div>
  );
}