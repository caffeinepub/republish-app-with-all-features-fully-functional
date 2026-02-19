import { AdminDashboard } from './AdminDashboard';
import { useIsCallerAdmin } from '../hooks/useAuth';
import { Loader2, Shield } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState } from 'react';
import { useRegisterAdmin, useGetCallerUserProfile } from '../hooks/useQueries';
import { useInternetIdentity } from '../hooks/useInternetIdentity';

export function AdminPortal() {
  const { isAdmin, isLoading: adminCheckLoading } = useIsCallerAdmin();
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity && !identity.getPrincipal().isAnonymous();
  const { data: userProfile, isLoading: profileLoading, isFetched } = useGetCallerUserProfile();
  const registerAdmin = useRegisterAdmin();
  const [adminName, setAdminName] = useState('');

  const handleRegisterAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminName.trim()) return;

    await registerAdmin.mutateAsync({
      name: adminName.trim(),
      role: 'admin',
    });
  };

  // Loading state
  if (adminCheckLoading || profileLoading) {
    return (
      <div className="container mx-auto px-6 py-16">
        <div className="flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-10 w-10 animate-spin text-primary mx-auto mb-4" />
            <p className="text-base text-muted-foreground">Verifying admin access...</p>
          </div>
        </div>
      </div>
    );
  }

  // Not authenticated
  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-6 py-16">
        <Card className="max-w-lg mx-auto border-2 border-destructive/20">
          <CardHeader className="text-center space-y-4">
            <div className="mx-auto mb-2 h-20 w-20 rounded-full bg-destructive/10 flex items-center justify-center">
              <Shield className="h-10 w-10 text-destructive" />
            </div>
            <CardTitle className="text-2xl">Authentication Required</CardTitle>
            <CardDescription className="text-base">
              Please log in to access the admin portal
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  // Show registration form for authenticated users without admin role
  if (!isAdmin && isFetched) {
    return (
      <div className="container mx-auto px-6 py-16">
        <Card className="max-w-lg mx-auto border-2 border-primary/20">
          <CardHeader className="text-center space-y-4 pb-6">
            <div className="mx-auto mb-2 h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center">
              <Shield className="h-10 w-10 text-primary" />
            </div>
            <CardTitle className="text-2xl">Register as Admin</CardTitle>
            <CardDescription className="text-base">
              Complete your admin registration to access the admin portal
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleRegisterAdmin} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="adminName" className="text-sm font-medium">Full Name</Label>
                <Input
                  id="adminName"
                  placeholder="Enter your full name"
                  value={adminName}
                  onChange={(e) => setAdminName(e.target.value)}
                  required
                  className="h-11"
                />
              </div>
              <Button
                type="submit"
                className="w-full h-12 text-base"
                disabled={registerAdmin.isPending || !adminName.trim()}
              >
                {registerAdmin.isPending ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin mr-2" />
                    Registering...
                  </>
                ) : (
                  'Register as Admin'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Admin dashboard for registered admins
  return (
    <div className="container mx-auto px-6 py-10">
      <div className="max-w-7xl mx-auto">
        <AdminDashboard />
      </div>
    </div>
  );
}
