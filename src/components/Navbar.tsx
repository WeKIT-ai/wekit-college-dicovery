import { Link } from "react-router-dom";
import { CoinBalance } from "./CoinBalance";
import { Button } from "@/components/ui/button";
import { Search, User, Menu } from "lucide-react";

export function Navbar() {
  const userCoins = 1250; // This would come from user context

  return (
    <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            WeKIT
          </div>
          <span className="text-sm text-muted-foreground">College Discovery</span>
        </Link>

        {/* Navigation Links - Hidden on mobile */}
        <div className="hidden md:flex items-center gap-6">
          <Link to="/discover" className="text-foreground hover:text-primary transition-colors">
            Discover
          </Link>
          <Link to="/compare" className="text-foreground hover:text-primary transition-colors">
            Compare
          </Link>
          <Link to="/mentoring" className="text-foreground hover:text-primary transition-colors">
            Mentoring
          </Link>
          <Link to="/feedback" className="text-foreground hover:text-primary transition-colors">
            Share Feedback
          </Link>
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-4">
          <CoinBalance balance={userCoins} />
          
          <Button variant="ghost" size="icon" className="hidden md:flex">
            <Search className="h-4 w-4" />
          </Button>
          
          <Button variant="ghost" size="icon">
            <User className="h-4 w-4" />
          </Button>
          
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </nav>
  );
}