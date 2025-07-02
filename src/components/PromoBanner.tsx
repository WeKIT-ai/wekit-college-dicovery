import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { X, Zap, Clock } from "lucide-react";
import { Link } from "react-router-dom";

export function PromoBanner() {
  const [isVisible, setIsVisible] = useState(true);
  const [timeLeft, setTimeLeft] = useState({ hours: 23, minutes: 45, seconds: 30 });

  useEffect(() => {
    // Check if banner was dismissed in localStorage
    const wasDismissed = localStorage.getItem('promoBannerDismissed');
    if (wasDismissed) {
      setIsVisible(false);
      return;
    }

    // Update countdown timer
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    localStorage.setItem('promoBannerDismissed', 'true');
  };

  if (!isVisible) return null;

  return (
    <div className="bg-gradient-primary text-white py-3 px-4 relative overflow-hidden">
      {/* Background Animation */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-slide-in-right"></div>
      
      <div className="container mx-auto flex items-center justify-between relative z-10">
        <div className="flex items-center gap-4">
          <Zap className="h-5 w-5 text-yellow-300 animate-pulse" />
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
            <span className="font-semibold">
              🎉 LIMITED TIME: Get your first mentoring session FREE!
            </span>
            <div className="flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4" />
              <span>Ends in: {timeLeft.hours}h {timeLeft.minutes}m {timeLeft.seconds}s</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <Button 
            asChild 
            variant="secondary" 
            size="sm" 
            className="bg-white/20 hover:bg-white/30 text-white border-white/30 hidden sm:flex"
          >
            <Link to="/auth">
              Claim FREE Session
            </Link>
          </Button>
          
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleDismiss}
            className="text-white hover:bg-white/20 p-1"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}