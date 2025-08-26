import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 morphism border-b border-white/10">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo Section */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className="h-12 w-12 bg-gradient-modern rounded-xl flex items-center justify-center animate-glow">
                <span className="text-white font-bold text-xl">A</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">ASHAVRITI</h1>
                <p className="text-sm text-white/70">PMSSS Portal</p>
              </div>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            <a href="#" className="text-white hover:text-secondary transition-smooth font-medium">
              Home
            </a>
            
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center space-x-1 text-white hover:text-secondary transition-smooth font-medium">
                <span>Features</span>
                <ChevronDown className="h-4 w-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuItem>
                  <span>PMSSS Overview</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <span>Eligibility Criteria</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <span>Application Process</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <span>Important Dates</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <a href="#" className="text-white hover:text-secondary transition-smooth font-medium">
              Solutions
            </a>
            <a href="#" className="text-white hover:text-secondary transition-smooth font-medium">
              Resources
            </a>
            <a href="#" className="text-white hover:text-secondary transition-smooth font-medium">
              Contact Us
            </a>
          </nav>

          {/* Action Buttons */}
          <div className="hidden lg:flex items-center space-x-4">
            <Button 
              variant="outline" 
              className="border-white/30 text-white hover:bg-white/10 backdrop-blur-sm transition-spring hover:scale-105 rounded-full px-6"
            >
              Login
            </Button>
            <Button className="bg-foreground text-white border-0 shadow-glow transition-spring hover:scale-105 rounded-full px-6">
              Explore
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 text-white hover:text-secondary transition-smooth"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden pb-4 border-t border-border/50 mt-4">
            <nav className="flex flex-col space-y-4 pt-4">
              <a href="#" className="text-foreground hover:text-primary transition-smooth font-medium">
                Home
              </a>
              <a href="#" className="text-foreground hover:text-primary transition-smooth font-medium">
                Schemes
              </a>
              <a href="#" className="text-foreground hover:text-primary transition-smooth font-medium">
                Institutions
              </a>
              <a href="#" className="text-foreground hover:text-primary transition-smooth font-medium">
                SAG Bureau
              </a>
              <a href="#" className="text-foreground hover:text-primary transition-smooth font-medium">
                Finance Bureau
              </a>
              <div className="flex flex-col space-y-2 pt-4">
                <Button variant="outline" className="transition-spring">
                  Login
                </Button>
                <Button className="bg-gradient-primary text-primary-foreground border-0">
                  Register Now
                </Button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;