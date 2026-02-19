import { useState } from 'react';
import { AdminDashboard } from './AdminDashboard';
import { Shield, Lock } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export function AdminPortal() {
  const [codeInput, setCodeInput] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    // Simulate a brief verification delay for better UX
    setTimeout(() => {
      if (codeInput === '2011') {
        setIsAuthenticated(true);
        setError('');
      } else {
        setError('Invalid code. Please try again.');
      }
      setIsSubmitting(false);
    }, 300);
  };

  // Show admin dashboard if authenticated
  if (isAuthenticated) {
    return (
      <div className="container mx-auto px-6 py-10">
        <div className="max-w-7xl mx-auto">
          <AdminDashboard />
        </div>
      </div>
    );
  }

  // Show code entry form
  return (
    <div className="container mx-auto px-6 py-16">
      <Card className="max-w-lg mx-auto border-2 border-primary/20 shadow-2xl shadow-primary/10 animate-in fade-in slide-in-from-bottom duration-500">
        <CardHeader className="text-center space-y-4 pb-8 pt-10">
          <div className="mx-auto mb-2 h-24 w-24 rounded-full bg-gradient-to-br from-teal-500/20 to-teal-600/10 flex items-center justify-center shadow-lg">
            <Shield className="h-12 w-12 text-teal-600" />
          </div>
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-teal-600 to-teal-700 bg-clip-text text-transparent">
            Admin Portal
          </CardTitle>
          <CardDescription className="text-base">
            Enter the admin code to access the dashboard
          </CardDescription>
        </CardHeader>
        <CardContent className="pb-10">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  type="password"
                  placeholder="Enter Admin Code"
                  value={codeInput}
                  onChange={(e) => {
                    setCodeInput(e.target.value);
                    setError('');
                  }}
                  className="pl-10 h-12 text-base border-teal-500/30 focus:border-teal-500 focus:ring-teal-500"
                  disabled={isSubmitting}
                  autoFocus
                />
              </div>
              {error && (
                <p className="text-sm text-destructive animate-in fade-in slide-in-from-top duration-300">
                  {error}
                </p>
              )}
            </div>
            <Button
              type="submit"
              className="w-full h-12 text-base bg-teal-600 hover:bg-teal-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-[1.02]"
              disabled={isSubmitting || !codeInput}
            >
              {isSubmitting ? 'Verifying...' : 'Access Admin Portal'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
