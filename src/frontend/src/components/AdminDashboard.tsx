import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CaseManagement } from './CaseManagement';
import { DoctorManagement } from './DoctorManagement';
import { Shield } from 'lucide-react';
import { AccessDeniedScreen } from './AccessDeniedScreen';
import { useIsCallerAdmin } from '../hooks/useAuth';

export function AdminDashboard() {
  const { isAdmin, isLoading } = useIsCallerAdmin();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return <AccessDeniedScreen />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Shield className="h-8 w-8 text-primary" />
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Admin Dashboard</h2>
          <p className="text-muted-foreground">Manage emergency cases and medical staff</p>
        </div>
      </div>

      <Tabs defaultValue="cases" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 max-w-md">
          <TabsTrigger value="cases">Emergency Cases</TabsTrigger>
          <TabsTrigger value="doctors">Doctors</TabsTrigger>
        </TabsList>

        <TabsContent value="cases">
          <CaseManagement />
        </TabsContent>

        <TabsContent value="doctors">
          <DoctorManagement />
        </TabsContent>
      </Tabs>
    </div>
  );
}
