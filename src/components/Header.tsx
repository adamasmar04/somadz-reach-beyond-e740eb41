import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import somadzLogo from "@/assets/somadz-logo.png";
import { Menu, X, LogOut, User } from "lucide-react";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, signOut } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const isHome = location.pathname === "/";

  const navLinks = isHome
    ? [
        { label: "Home", href: "#home" },
        { label: "How It Works", href: "#how-it-works" },
        { label: "Pricing", href: "#pricing" },
        { label: "Contact", href: "#contact" },
      ]
    : [
        { label: "Home", href: "/" },
        { label: "Live Ads", href: "/ads" },
        ...(user ? [{ label: "My Ads", href: "/profile" }] : []),
      ];

  const handleNav = (href: string) => {
    setMenuOpen(false);
    if (href.startsWith("#")) {
      const el = document.querySelector(href);
      el?.scrollIntoView({ behavior: "smooth" });
    } else {
      navigate(href);
    }
  };

  const handleSignOut = async () => {
    setMenuOpen(false);
    await signOut();
    navigate("/");
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 cursor-pointer" onClick={() => navigate("/")}>
            <img src={somadzLogo} alt="SomAdz" className="h-10 w-auto" />
            <span className="text-2xl font-bold text-gradient">SomAdz</span>
          </div>

          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <button key={link.label} onClick={() => handleNav(link.href)} className="nav-link bg-transparent border-none cursor-pointer">
                {link.label}
              </button>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <>
                <Button className="hero-button" onClick={() => navigate("/create-ad")}>
                  Create Ad
                </Button>
                <Button variant="ghost" size="icon" onClick={handleSignOut} title="Sign out">
                  <LogOut className="w-5 h-5" />
                </Button>
              </>
            ) : (
              <>
                <Button variant="ghost" className="text-foreground" onClick={() => navigate("/login")}>
                  Log In
                </Button>
                <Button className="hero-button" onClick={() => navigate("/signup")}>
                  Sign Up
                </Button>
              </>
            )}
          </div>

          <Button variant="ghost" className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </Button>
        </div>

        {menuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-border pt-4 space-y-3">
            {navLinks.map((link) => (
              <button key={link.label} onClick={() => handleNav(link.href)} className="block w-full text-left nav-link bg-transparent border-none cursor-pointer py-2">
                {link.label}
              </button>
            ))}
            {user ? (
              <>
                <Button className="hero-button w-full" onClick={() => { setMenuOpen(false); navigate("/create-ad"); }}>
                  Create Ad
                </Button>
                <Button variant="outline" className="w-full border-border" onClick={handleSignOut}>
                  <LogOut className="w-4 h-4 mr-2" /> Sign Out
                </Button>
              </>
            ) : (
              <>
                <Button variant="outline" className="w-full border-border" onClick={() => { setMenuOpen(false); navigate("/login"); }}>
                  Log In
                </Button>
                <Button className="hero-button w-full" onClick={() => { setMenuOpen(false); navigate("/signup"); }}>
                  Sign Up
                </Button>
              </>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
