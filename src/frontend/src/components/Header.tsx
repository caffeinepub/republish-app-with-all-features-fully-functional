import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { LogOut, LogIn, Moon, Sun, Activity, Home } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useQueryClient } from '@tanstack/react-query';
import { useGetCallerUserProfile } from '../hooks/useQueries';
import { useIsCallerAdmin } from '../hooks/useAuth';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface HeaderProps {
  currentRole?: 'patient' | 'doctor' | 'admin' | null;
  onBackToHome?: () => void;
}

export function Header({ currentRole, onBackToHome }: HeaderProps) {
  const { identity, clear, login, isLoggingIn } = useInternetIdentity();
  const { setTheme } = useTheme();
  const queryClient = useQueryClient();
  const isAuthenticated = !!identity && !identity.getPrincipal().isAnonymous();
  const { data: userProfile } = useGetCallerUserProfile();
  const { isAdmin } = useIsCallerAdmin();

  const handleLogout = async () => {
    await clear();
    queryClient.clear();
    if (onBackToHome) onBackToHome();
  };

  const getRoleLabel = () => {
    if (!currentRole) return null;
    return currentRole.charAt(0).toUpperCase() + currentRole.slice(1);
  };

  return (
    <header className="border-b bg-card sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center shadow-md">
            <Activity className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-xl font-bold">Vitals AI</h1>
            {isAuthenticated && userProfile && (
              <p className="text-xs text-muted-foreground">{userProfile.name}</p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          {currentRole && onBackToHome && (
            <Button onClick={onBackToHome} variant="ghost" size="sm" className="gap-2">
              <Home className="h-4 w-4" />
              Home
            </Button>
          )}

          {currentRole && (
            <Badge variant="outline" className="text-xs px-3 py-1">
              {getRoleLabel()}
            </Badge>
          )}

          {isAuthenticated && isAdmin && (
            <Badge variant="default" className="gap-1 text-xs px-3 py-1">
              Admin
            </Badge>
          )}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                <span className="sr-only">Toggle theme</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setTheme('light')}>Light</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme('dark')}>Dark</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme('system')}>System</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {isAuthenticated ? (
            <Button onClick={handleLogout} variant="outline" size="sm" className="gap-2">
              <LogOut className="h-4 w-4" />
              Log Out
            </Button>
          ) : (
            <Button onClick={login} disabled={isLoggingIn} size="sm" className="gap-2">
              <LogIn className="h-4 w-4" />
              {isLoggingIn ? 'Logging in...' : 'Log In'}
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
