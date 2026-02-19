import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShieldAlert } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

export function AccessDeniedScreen() {
  return (
    <div className="max-w-2xl mx-auto py-12">
      <Card>
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <ShieldAlert className="h-16 w-16 text-destructive" />
          </div>
          <CardTitle className="text-2xl">Access Denied</CardTitle>
          <CardDescription>You don't have permission to access the admin dashboard</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <AlertDescription>
              This area is restricted to authorized administrators only. If you need to submit an emergency
              case, please use the Emergency SOS form available on the main page.
            </AlertDescription>
          </Alert>
          <div className="text-center">
            <Button onClick={() => window.location.reload()} variant="outline">
              Return to Emergency SOS
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
