import { Link } from "react-router-dom";
import { CoinBalance } from "./CoinBalance";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { Search, User, Menu, LogOut } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Navbar() {
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
  };

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
          <Link to="/community" className="text-foreground hover:text-primary transition-colors">
            Community
          </Link>
          <a href="https://www.wekitmentoring.com/students" target="_blank" rel="noopener noreferrer" className="text-foreground hover:text-primary transition-colors">
            Mentoring
          </a>
          <Link to="/auth" className="text-foreground hover:text-primary transition-colors">
            Rate College
          </Link>
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-4">
          {user && <CoinBalance />}
          
          <Button variant="ghost" size="icon" className="hidden md:flex">
            <Search className="h-4 w-4" />
          </Button>
          
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <User className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem disabled>
                  {user.email}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/profile" className="flex items-center w-full">
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleSignOut}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button asChild variant="hero" size="sm">
              <Link to="/auth">Sign In</Link>
            </Button>
          )}
          
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </nav>
  );
}