import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from '@tanstack/react-router';
import { Menu, X, Phone, Clock, ChevronRight, Heart, Activity } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isHome = location.pathname === '/';

  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'Services', href: '#services' },
    { label: 'Doctors', href: '#doctors' },
    { label: 'About', href: '#about' },
    { label: 'Contact', href: '#contact' },
  ];

  const handleNavClick = (href: string) => {
    setIsMenuOpen(false);
    if (href.startsWith('#')) {
      if (!isHome) {
        navigate({ to: '/' });
        setTimeout(() => {
          const el = document.querySelector(href);
          el?.scrollIntoView({ behavior: 'smooth' });
        }, 300);
      } else {
        const el = document.querySelector(href);
        el?.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      navigate({ to: href });
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      {/* Top info bar */}
      <div className="bg-teal-900 text-teal-100 py-2 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-xs sm:text-sm">
          <div className="flex items-center gap-4 sm:gap-6">
            <a
              href="tel:+911800000000"
              className="flex items-center gap-1.5 hover:text-white transition-colors font-medium"
            >
              <Phone className="w-3.5 h-3.5 text-teal-300" />
              <span className="hidden sm:inline">Emergency:</span>
              <span className="font-bold text-white">1800-000-0000</span>
            </a>
            <div className="hidden md:flex items-center gap-1.5 text-teal-200">
              <Clock className="w-3.5 h-3.5 text-teal-300" />
              <span>24/7 Emergency Care Available</span>
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-teal-200">
            <Activity className="w-3.5 h-3.5 text-teal-300 animate-pulse" />
            <span className="hidden sm:inline">Committed to your wellbeing</span>
            <span className="sm:hidden">Always here for you</span>
          </div>
        </div>
      </div>

      {/* Main navigation */}
      <nav
        className={`transition-all duration-300 ${
          isScrolled
            ? 'bg-white/95 dark:bg-teal-950/95 backdrop-blur-xl shadow-card border-b border-teal-100 dark:border-teal-800/50'
            : 'bg-white dark:bg-teal-950'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-18">
            {/* Logo */}
            <button
              onClick={() => handleNavClick('/')}
              className="flex items-center gap-3 group"
            >
              <div className="relative">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center shadow-teal group-hover:shadow-teal-lg transition-shadow duration-300">
                  <Heart className="w-5 h-5 text-white fill-white" />
                </div>
                <div className="absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-400 border-2 border-white dark:border-teal-950 animate-pulse" />
              </div>
              <div className="flex flex-col leading-none">
                <span className="font-display font-900 text-lg text-teal-900 dark:text-teal-100 tracking-tight">
                  Vitals<span className="text-teal-500">AI</span>
                </span>
                <span className="text-2xs text-teal-600 dark:text-teal-400 font-medium tracking-widest uppercase">
                  Healthcare
                </span>
              </div>
            </button>

            {/* Desktop nav */}
            <div className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <button
                  key={link.label}
                  onClick={() => handleNavClick(link.href)}
                  className="px-4 py-2 text-sm font-medium text-teal-700 dark:text-teal-300 hover:text-teal-600 dark:hover:text-teal-200 hover:bg-teal-50 dark:hover:bg-teal-900/50 rounded-lg transition-all duration-200"
                >
                  {link.label}
                </button>
              ))}
            </div>

            {/* CTA buttons */}
            <div className="hidden lg:flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate({ to: '/select-role' })}
                className="border-teal-200 dark:border-teal-700 text-teal-700 dark:text-teal-300 hover:bg-teal-50 dark:hover:bg-teal-900/50 hover:border-teal-300 transition-all duration-200"
              >
                Sign In
              </Button>
              <Button
                size="sm"
                onClick={() => navigate({ to: '/select-role' })}
                className="bg-teal-600 hover:bg-teal-700 text-white shadow-teal hover:shadow-teal-lg transition-all duration-200 gap-1.5"
              >
                Get Started
                <ChevronRight className="w-3.5 h-3.5" />
              </Button>
            </div>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-teal-700 dark:text-teal-300 hover:bg-teal-50 dark:hover:bg-teal-900/50 transition-colors"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <div
          className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            isMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="px-4 pb-4 pt-2 border-t border-teal-100 dark:border-teal-800/50 bg-white dark:bg-teal-950">
            <div className="flex flex-col gap-1 mb-4">
              {navLinks.map((link) => (
                <button
                  key={link.label}
                  onClick={() => handleNavClick(link.href)}
                  className="text-left px-4 py-2.5 text-sm font-medium text-teal-700 dark:text-teal-300 hover:text-teal-600 hover:bg-teal-50 dark:hover:bg-teal-900/50 rounded-lg transition-all duration-200"
                >
                  {link.label}
                </button>
              ))}
            </div>
            <div className="flex flex-col gap-2 pt-3 border-t border-teal-100 dark:border-teal-800/50">
              <Button
                variant="outline"
                size="sm"
                onClick={() => { navigate({ to: '/select-role' }); setIsMenuOpen(false); }}
                className="w-full border-teal-200 text-teal-700 hover:bg-teal-50"
              >
                Sign In
              </Button>
              <Button
                size="sm"
                onClick={() => { navigate({ to: '/select-role' }); setIsMenuOpen(false); }}
                className="w-full bg-teal-600 hover:bg-teal-700 text-white"
              >
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}
