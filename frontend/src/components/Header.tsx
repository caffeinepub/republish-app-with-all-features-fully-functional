import React, { useState } from 'react';
import { Link, useNavigate } from '@tanstack/react-router';
import { Activity, Menu, X, Moon, Sun, ChevronDown } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();

  const navLinks = [
    { label: 'Home', to: '/' },
    { label: 'Patient', to: '/patient' },
    { label: 'Doctor', to: '/doctor' },
    { label: 'Admin', to: '/admin' },
  ];

  return (
    <header className="bg-white/95 dark:bg-card/95 backdrop-blur-md border-b border-gray-100 dark:border-border shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 bg-gradient-to-br from-teal-500 to-teal-700 rounded-xl flex items-center justify-center shadow-sm group-hover:shadow-teal-200 dark:group-hover:shadow-teal-900/30 transition-shadow">
              <Activity className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col leading-none">
              <span className="text-lg font-extrabold text-gray-900 dark:text-foreground tracking-tight font-heading">
                Vitals <span className="text-teal-600">AI</span>
              </span>
              <span className="text-[10px] text-gray-400 dark:text-muted-foreground font-medium tracking-widest uppercase">
                Healthcare
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-0.5">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 dark:text-muted-foreground hover:text-teal-700 dark:hover:text-teal-400 hover:bg-teal-50 dark:hover:bg-teal-900/20 transition-all"
                activeProps={{
                  className: 'px-4 py-2 rounded-lg text-sm font-medium text-teal-700 dark:text-teal-400 bg-teal-50 dark:bg-teal-900/20',
                }}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="text-gray-500 hover:text-teal-600 dark:text-muted-foreground dark:hover:text-teal-400 rounded-lg"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </Button>
            <Button
              size="sm"
              onClick={() => navigate({ to: '/select-role' })}
              className="hidden md:flex bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-semibold shadow-sm"
            >
              Get Started
            </Button>
            {/* Mobile menu toggle */}
            <button
              className="md:hidden p-2 rounded-lg text-gray-500 hover:text-teal-600 hover:bg-teal-50 dark:text-muted-foreground dark:hover:bg-teal-900/20 transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-100 dark:border-border py-3 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="block px-4 py-2.5 text-sm font-medium text-gray-600 dark:text-muted-foreground hover:text-teal-700 dark:hover:text-teal-400 hover:bg-teal-50 dark:hover:bg-teal-900/20 rounded-lg transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="px-2 pt-2 pb-1">
              <Button
                size="sm"
                className="w-full bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-semibold"
                onClick={() => {
                  setMobileMenuOpen(false);
                  navigate({ to: '/select-role' });
                }}
              >
                Get Started
              </Button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
