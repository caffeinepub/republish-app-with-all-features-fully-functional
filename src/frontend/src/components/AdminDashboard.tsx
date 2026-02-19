import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CaseManagement } from './CaseManagement';
import { DoctorManagement } from './DoctorManagement';
import { Shield } from 'lucide-react';

export function AdminDashboard() {
  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <Shield className="h-8 w-8 text-primary" />
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Admin Dashboard</h2>
          <p className="text-base text-muted-foreground mt-1">Manage emergency cases and medical staff</p>
        </div>
      </div>

      <Tabs defaultValue="cases" className="space-y-8">
        <TabsList className="grid w-full grid-cols-2 max-w-md h-12">
          <TabsTrigger value="cases" className="text-base">Emergency Cases</TabsTrigger>
          <TabsTrigger value="doctors" className="text-base">Doctors</TabsTrigger>
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
