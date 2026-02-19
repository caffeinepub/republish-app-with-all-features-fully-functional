import { ShieldAlert } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export function AccessDeniedScreen() {
  return (
    <div className="container mx-auto px-6 py-16">
      <Card className="max-w-lg mx-auto border-2 border-destructive/20">
        <CardHeader className="text-center space-y-4 pb-6">
          <div className="mx-auto mb-2 h-20 w-20 rounded-full bg-destructive/10 flex items-center justify-center">
            <ShieldAlert className="h-10 w-10 text-destructive" />
          </div>
          <CardTitle className="text-2xl">Access Denied</CardTitle>
          <CardDescription className="text-base">
            You do not have permission to access this portal. Please contact an administrator if you believe this is an error.
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
}
