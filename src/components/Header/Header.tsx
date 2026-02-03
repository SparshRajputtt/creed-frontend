//@ts-nocheck

import type React from 'react';
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import {
  Search,
  ShoppingCart,
  User,
  Menu,
  X,
  Heart,
  Package,
  LogOut,
  Settings,
  Shield,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/queries/hooks/auth/useAuth';
import { useLogout } from '@/queries/hooks/auth/useAuth';
import { useAtom } from 'jotai';
import { cartCountAtom } from '@/queries/store/cart';
import { CartSidebar } from '@/components/Cart';
import Logo from '../../images/CREEDMedium.png';

export const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [showHeader, setShowHeader] = useState(true);
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const logoutMutation = useLogout();
  const [cartCount] = useAtom(cartCountAtom);

  // Handle scroll behavior for mobile
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      setIsScrolled(currentScrollY > 10);

      // Only apply hide/show behavior on mobile
      if (window.innerWidth < 768) {
        if (currentScrollY > lastScrollY && currentScrollY > 100) {
          setShowHeader(false);
        } else {
          setShowHeader(true);
        }
      } else {
        setShowHeader(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setIsMenuOpen(false);
    }
  };

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  const handleProfileClick = () => {
    if (user?.role === 'admin') {
      navigate('/admin');
    } else {
      navigate('/profile');
    }
  };

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/products', label: 'Products' },
    { href: '/categories', label: 'Categories' },
    { href: '/about', label: 'About' },
    { href: '/contact', label: 'Contact' },
  ];

  return (
    <>
      <motion.header
        initial={{ y: 0 }}
        animate={{ y: showHeader ? 0 : -100 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className={`fixed top-0 left-0 right-0 z-40 w-full transition-all duration-300 ${
          isScrolled
            ? 'bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-200/50'
            : 'bg-white/80 backdrop-blur-sm border-b border-gray-100'
        }`}
      >
        <div className="container mx-auto px-4">
          {/* Main Header */}
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                to="/"
                className="flex items-center ml-[-30px] md:ml-0  mx-4 space-x-2"
              >
                <div className="relative">
                  {/* <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-[var(--medium)] to-[var(--dark)] text-white shadow-lg">
                    <Package className="h-5 w-5" />
                  </div> */}
                  <div className="absolute -inset-1 bg-gradient-to-br from-[var(--medium)] to-[var(--dark)] rounded-xl blur opacity-20"></div>
                </div>

                <div className="flex items-center">
                  <span
                    style={{
                      fontSize: '1.25rem',
                      fontWeight: 'bold',
                      background: 'linear-gradient(to right, #2d5040, #1a2e24)',
                      WebkitBackgroundClip: 'text',
                      backgroundClip: 'text',
                      color: 'transparent',
                    }}
                  >
                    {/* <img
                      style={{
                        height: '76px',
                        width: '106px',
                        filter:
                          'brightness(0) saturate(100%) invert(28%) sepia(8%) saturate(1089%) hue-rotate(81deg) brightness(95%) contrast(91%)',
                      }}
                      src="data:image/svg+xml,%3c?xml%20version='1.0'%20encoding='UTF-8'?%3e%3csvg%20version='1.1'%20viewBox='0%200%202000%202000'%20width='1280'%20height='1280'%20xmlns='http://www.w3.org/2000/svg'%3e%3cpath%20fill='%23002d46'%20transform='translate(1304,502)'%20d='m0%200h13l35%203%2018%204%2016%205%2021%207%2016%208%2022%2012%2015%2011%2011%208%2014%2012%209%208%205%206%208%207%209%2011%2012%2015%2012%2017%205%207%206%2011%2010%2017%208%2016%208%2015%2010%2026%207%2019%206%2022%207%2023%204%2021%208%2054%202%2022v70l-3%2031-7%2045-4%2020-10%2033-5%2018-8%2020-5%2014-16%2032-11%2021-8%2013-10%2014-9%2012-11%2013-9%2011-19%2019-22%2018-8%206-21%2014-16%208-17%208-29%2010-19%206-20%203-39%204-30%201-319%201-5-1-1-10-1-28v-414l-1-213v-35l1-1h335l1%201v54h-277v194h94l2%201v52l-1%201-95%201v22l-1%209h96l1%201v55l-53%201h-42v48l-1%20206%20269-1%2037-1%2028-4%2020-6%2017-6%2011-3%2019-10%208-4%207-4%209-7%2010-7%207-6h2l2-4%2015-13%207-8%2010-11%2013-18%206-8%205-10%207-9%2013-27%208-16%2015-40%206-25%208-34%203-21%203-43v-60l-3-41-3-21-15-61-11-28-6-17-9-16-9-19-7-10-9-15-16-21-5-6-6-5-7-9-20-18-19-13-10-6-18-10-11-5-19-6%201%205v615l-1%2066-5%204-15%205-15%203-19%202-18%201h-167l-1-3v-524l1-2h55l1%201v163h98l1%201v54l-1%201h-32l-65-1-1%2030h35l62%201%201%201v56h-96v177h123v-43l1-309v-365z'/%3e%3cpath%20fill='%23002d46'%20transform='translate(810,563)'%20d='m0%200h7l12%203%2013%207%2010%209%2011%207%2018%2018%2013%2020%206%2012%2010%2032%201%204v189l-3%2017-6%2020-5%2013-10%2017-8%2011-5%206-16%2016-12%208-14%2010-8%203%204%205%208%207%2012%2010%206%208%206%205%2013%2017%2010%2015%2016%2032%204%2015%206%2024%202%2014v245l325-1%2062-1%2036-3%2020-4%2051-15%2017-8%2016-7%2020-12%2019-13%2016-12%2011-10%208-7%207-8%2016-16%201-2h2l2-4%2014-18%2014-23%208-12h3l-3%207-15%2029-6%2012-6%209-8%2014-11%2016-10%2013-12%2014-7%208-28%2028-30%2023-8%204-11%208-16%208-11%206-12%206-18%206-24%209-16%204-26%204-22%203-27%202h-396l-1-1-1-9-2-293-4-25-5-12-10-19-7-11-7-9-6-8-13-13-4-5-11-8-8-7-20-12-15-7v-37l2-4%2015-7%2020-6%2032-17%2010-9%209-7%206-9%207-10%205-11%203-14%201-9v-175l-3-20-4-11-13-17-17-10-8-2h-13l-23%205-19%206-13%204-10%206-1%20178-1%20463v60l1%203v31l25-5%2014-6%204-1%2019%2014%2011%209%204%203%2010%205%204%204-1%205-16%207-8%205-13%206-19%205-33%207h-58l-1-88v-672l1-86%201-3%206-2%207-1h47l15%203%2010%203h7l22-22%2016-6z'/%3e%3cpath%20fill='%23002d46'%20transform='translate(681,502)'%20d='m0%200h20l19%201%2017%203%2018%207%2025%2010%206%204v4l-5%204-11%205-15%2012-8%207-9%209-2%201-13-1-11-2-12-1h-17l-14%201-24%205-17%207-13%208-11%204-5%205-17%2012-15%2014-11%2010-7%208-7%207-11%2016-7%209-3%204-4%208-9%2014-11%2023-7%2014-6%2015-8%2018-13%2042-7%2025-7%2040-5%2032-3%2034v73l4%2040%208%2047%204%2022%208%2027%209%2030%2013%2031%206%2016%2010%2019%209%2016%2014%2022%2014%2018%2011%2013%2012%2013%2020%2018%2013%209%2011%208%2011%206%204%205v65l-6-1-24-11-15-10-12-7-15-12-8-6-8-9-8-6-11-12-7-6-8-11-7-8-8-12-9-12-6-9-7-12-9-16-16-32-9-21-7-17-5-18-11-33-5-25-7-29-4-22-6-65-1-19v-45l2-26%205-54%204-25%209-36%204-20%2012-36%204-14%207-17%207-15%205-13%2010-18%206-12%2011-18%205-9%207-8%2014-21%2010-11%207-9%205-4%207-9%2011-10%208-7%2011-9%2018-13%2012-6%2010-7%2012-6%2012-4%2015-6%2014-4%2013-2z'/%3e%3cpath%20fill='%23002d46'%20transform='translate(881,566)'%20d='m0%200%20394%201v54l-1%201h-352l-5-8-7-11-14-19-11-12-5-5z'/%3e%3c/svg%3e"
                      alt="Updated Logo"
                    /> */}
                    <img
                      className=" ml-[5px] md:ml-[0px] h-[76px] w-[76px] "
                      src={Logo}
                    />
                  </span>
                  {/* <span className="text-[20px] text-[#2d5040] font-semibold">
                    Creedhomewares
                  </span> */}
                </div>
              </Link>
            </motion.div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-8">
              {navLinks.map((link) => (
                <motion.div
                  key={link.href}
                  whileHover={{ y: -2 }}
                  whileTap={{ y: 0 }}
                >
                  <Link
                    to={link.href}
                    className="relative text-sm font-medium text-gray-700 hover:text-[var(--medium)] transition-all duration-200 group"
                  >
                    {link.label}
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-[var(--medium)] to-[var(--dark)] transition-all duration-200 group-hover:w-full"></span>
                  </Link>
                </motion.div>
              ))}
            </nav>

            {/* Desktop Search Bar */}
            <div className="hidden lg:flex flex-1 max-w-md mx-8">
              <form onSubmit={handleSearch} className="relative w-full group">
                <div className="absolute inset-0 bg-gradient-to-r from-[var(--medium)]/20 to-[var(--dark)]/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 group-focus-within:text-[var(--medium)] transition-colors" />
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 bg-white/80 backdrop-blur-sm pl-12 pr-4 py-3 text-sm placeholder:text-gray-400 focus:border-[var(--medium)] focus:outline-none focus:ring-2 focus:ring-[var(--medium)]/20 transition-all duration-200"
                  />
                </div>
              </form>
            </div>

            {/* Right side actions */}
            <div className="flex items-center space-x-2">
              {/* Wishlist */}
              {isAuthenticated && (
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Button
                    variant="ghost"
                    size="icon"
                    className="relative group"
                    asChild
                  >
                    <Link to="/wishlist">
                      <Heart className="h-5 w-5 text-gray-600 group-hover:text-red-500 transition-colors" />
                    </Link>
                  </Button>
                </motion.div>
              )}

              {/* Cart */}
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative group"
                  onClick={() => setIsCartOpen(true)}
                >
                  <ShoppingCart className="h-5 w-5 text-gray-600 group-hover:text-[var(--medium)] transition-colors" />
                  {cartCount > 0 && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-2 -right-2"
                    >
                      <Badge className="h-5 w-5 rounded-full p-0 text-xs bg-gradient-to-r from-[var(--medium)] to-[var(--dark)] border-0 shadow-lg">
                        {cartCount > 99 ? '99+' : cartCount}
                      </Badge>
                    </motion.div>
                  )}
                </Button>
              </motion.div>

              {/* User Menu */}
              {isAuthenticated ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Button
                        variant="ghost"
                        size="icon"
                        className="relative group"
                      >
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[var(--medium)] to-[var(--dark)] flex items-center justify-center text-white text-sm font-medium shadow-lg">
                          {user?.firstName?.charAt(0) || 'U'}
                        </div>
                      </Button>
                    </motion.div>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="w-64 p-2 bg-white/95 backdrop-blur-md border border-gray-200/50 shadow-xl"
                  >
                    <div className="px-3 py-2 bg-gradient-to-r from-[var(--lightest)] to-white rounded-lg mb-2">
                      <p className="text-sm font-semibold text-gray-900">
                        {user?.firstName} {user?.lastName}
                      </p>
                      <p className="text-xs text-gray-600">{user?.email}</p>
                      {user?.role === 'admin' && (
                        <Badge className="mt-1 bg-gradient-to-r from-[var(--medium)] to-[var(--dark)] text-white text-xs">
                          <Shield className="w-3 h-3 mr-1" />
                          Admin
                        </Badge>
                      )}
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={handleProfileClick}
                      className="cursor-pointer group"
                    >
                      <User className="mr-3 h-4 w-4 text-gray-500 group-hover:text-[var(--medium)]" />
                      {user?.role === 'admin' ? 'Admin Dashboard' : 'Profile'}
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/orders" className="cursor-pointer group">
                        <Package className="mr-3 h-4 w-4 text-gray-500 group-hover:text-[var(--medium)]" />
                        Orders
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/wishlist" className="cursor-pointer group">
                        <Heart className="mr-3 h-4 w-4 text-gray-500 group-hover:text-red-500" />
                        Wishlist
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/settings" className="cursor-pointer group">
                        <Settings className="mr-3 h-4 w-4 text-gray-500 group-hover:text-[var(--medium)]" />
                        Settings
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={handleLogout}
                      className="cursor-pointer text-red-600 group"
                    >
                      <LogOut className="mr-3 h-4 w-4 group-hover:text-red-700" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <div className="hidden md:flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    className="text-gray-700 hover:text-[var(--medium)]"
                    asChild
                  >
                    <Link to="/login">Login</Link>
                  </Button>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      className="bg-gradient-to-r from-[var(--medium)] to-[var(--dark)] hover:from-[var(--dark)] hover:to-[var(--medium)] text-white shadow-lg"
                      asChild
                    >
                      <Link to="/signup">Sign Up</Link>
                    </Button>
                  </motion.div>
                </div>
              )}

              {/* Mobile menu button */}
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <Button
                  variant="ghost"
                  size="icon"
                  className="lg:hidden"
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                  <AnimatePresence mode="wait">
                    {isMenuOpen ? (
                      <motion.div
                        key="close"
                        initial={{ rotate: -90, opacity: 0 }}
                        animate={{ rotate: 0, opacity: 1 }}
                        exit={{ rotate: 90, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <X className="h-5 w-5" />
                      </motion.div>
                    ) : (
                      <motion.div
                        key="menu"
                        initial={{ rotate: 90, opacity: 0 }}
                        animate={{ rotate: 0, opacity: 1 }}
                        exit={{ rotate: -90, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Menu className="h-5 w-5" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Button>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="lg:hidden border-t border-gray-200/50 bg-white/95 backdrop-blur-md overflow-hidden"
            >
              <div className="container mx-auto px-4 py-4">
                {/* Mobile Search */}
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="mb-4"
                >
                  <form onSubmit={handleSearch} className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search products..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full rounded-lg border border-gray-200 bg-white pl-10 pr-4 py-3 text-sm focus:border-[var(--medium)] focus:outline-none focus:ring-2 focus:ring-[var(--medium)]/20"
                    />
                  </form>
                </motion.div>

                {/* Mobile Navigation Links */}
                <nav className="space-y-2">
                  {navLinks.map((link, index) => (
                    <motion.div
                      key={link.href}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 + index * 0.05 }}
                    >
                      <Link
                        to={link.href}
                        className="block px-4 py-3 text-sm font-medium text-gray-700 hover:text-[var(--medium)] hover:bg-[var(--lightest)] rounded-lg transition-all duration-200"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {link.label}
                      </Link>
                    </motion.div>
                  ))}

                  {!isAuthenticated && (
                    <>
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 }}
                      >
                        <Link
                          to="/login"
                          className="block px-4 py-3 text-sm font-medium text-gray-700 hover:text-[var(--medium)] hover:bg-[var(--lightest)] rounded-lg transition-all duration-200"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          Login
                        </Link>
                      </motion.div>
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.45 }}
                      >
                        <Link
                          to="/signup"
                          className="block px-4 py-3 text-sm font-medium text-white bg-gradient-to-r from-[var(--medium)] to-[var(--dark)] rounded-lg hover:from-[var(--dark)] hover:to-[var(--medium)] transition-all duration-200"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          Sign Up
                        </Link>
                      </motion.div>
                    </>
                  )}
                </nav>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* Spacer to prevent content from hiding behind fixed header */}
      <div className="h-16"></div>

      {/* Cart Sidebar */}
      <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
};
