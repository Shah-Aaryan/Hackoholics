import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Sun, Moon, MessageCircle, Leaf, LogOut, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useAuth } from '@/contexts/AuthContext';

interface NavbarProps {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  toggleChatbot: () => void;
}

const Navbar = ({ isDarkMode, toggleDarkMode, toggleChatbot }: NavbarProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { user, logout } = useAuth();

  const navItems = user ? [
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Energy Garden', path: '/garden' },
    { name: 'Gamification', path: '/gamification' },
    { name: 'Community', path: '/community' },
    { name: 'Bills', path: '/bills' },
    { name: 'Profile', path: '/profile' },
  ] : [];

  const isActivePath = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  const handleLogout = () => {
    logout();
    setIsOpen(false);
  };

  const NavLinks = ({ isMobile = false }) => (
    <>
      {navItems.map((item) => (
        <Link
          key={item.name}
          to={item.path}
          className={`
            px-4 py-2 rounded-lg transition-all duration-200 font-medium
            ${isActivePath(item.path)
              ? 'bg-gradient-eco text-primary-foreground shadow-md'
              : 'text-foreground hover:bg-muted hover:text-primary'
            }
            ${isMobile ? 'block text-center' : ''}
          `}
          onClick={() => isMobile && setIsOpen(false)}
        >
          {item.name}
        </Link>
      ))}
    </>
  );

  return (
    <>
      <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <div className="flex items-center justify-center w-10 h-10 bg-gradient-eco rounded-lg">
                <Leaf className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                EcoConnect
              </span>
            </Link>

            {/* Desktop Navigation */}
            {user && (
              <div className="hidden md:flex items-center space-x-2">
                <NavLinks />
              </div>
            )}

            {/* Right side controls */}
            <div className="flex items-center space-x-2">
              {/* User Info / Auth Buttons */}
              {user ? (
                <div className="flex items-center space-x-2">
                  <div className="hidden sm:flex items-center space-x-2 text-sm text-gray-600">
                    <User className="w-4 h-4" />
                    <span></span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleLogout}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <LogOut className="w-4 h-4 mr-1" />
                    Logout
                  </Button>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Link to="/login">
                    <Button variant="ghost" size="sm" className="text-green-600 hover:text-green-700">
                      Sign In
                    </Button>
                  </Link>
                  <Link to="/signup">
                    <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white">
                      Sign Up
                    </Button>
                  </Link>
                </div>
              )}

              {/* Theme Toggle */}
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleDarkMode}
                className="hover:bg-muted"
              >
                {isDarkMode ? (
                  <Sun className="w-5 h-5" />
                ) : (
                  <Moon className="w-5 h-5" />
                )}
              </Button>

              {/* Mobile Menu */}
              <div className="md:hidden">
                <Sheet open={isOpen} onOpenChange={setIsOpen}>
                  <SheetTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <Menu className="w-5 h-5" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="right" className="w-64">
                    <div className="flex flex-col space-y-4 mt-8">
                      {user ? (
                        <>
                          <NavLinks isMobile />
                          <div className="border-t pt-4">
                            <div className="flex items-center space-x-2 text-sm text-gray-600 mb-4">
                              <User className="w-4 h-4" />
                              <span>{user.fullName}</span>
                            </div>
                            <Button
                              variant="ghost"
                              onClick={handleLogout}
                              className="w-full text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <LogOut className="w-4 h-4 mr-2" />
                              Logout
                            </Button>
                          </div>
                        </>
                      ) : (
                        <div className="space-y-2">
                          <Link to="/login" className="block">
                            <Button variant="ghost" className="w-full text-green-600 hover:text-green-700">
                              Sign In
                            </Button>
                          </Link>
                          <Link to="/signup" className="block">
                            <Button className="w-full bg-green-600 hover:bg-green-700 text-white">
                              Sign Up
                            </Button>
                          </Link>
                        </div>
                      )}
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Floating Chatbot Button - Only visible when logged in */}
      {user && (
        <Button
          onClick={toggleChatbot}
          className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-gradient-to-r from-green-600 to-emerald-600 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 animate-[float_3s_ease-in-out_infinite]"
        >
          <MessageCircle className="w-6 h-6 text-white" />
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-accent rounded-full animate-pulse" />
        </Button>
      )}
    </>
  );
};

export default Navbar;