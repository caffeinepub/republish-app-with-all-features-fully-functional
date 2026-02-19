import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CaseManagement } from './CaseManagement';
import { DoctorManagement } from './DoctorManagement';
import { QRCodeGenerator } from './QRCodeGenerator';
import { Shield } from 'lucide-react';

export function AdminDashboard() {
  const adminUrl = 'https://vitals-ai-featuringsmarthospitals-jrg.caffeine.xyz/#caffeineAdminToken=caf86f15a219649b9883aca3e42d0418f6e4682726fd4227e005e7f46af65497';

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
        <TabsList className="grid w-full grid-cols-3 max-w-2xl h-12">
          <TabsTrigger value="cases" className="text-base">Emergency Cases</TabsTrigger>
          <TabsTrigger value="doctors" className="text-base">Doctors</TabsTrigger>
          <TabsTrigger value="qr-code" className="text-base">QR Code</TabsTrigger>
        </TabsList>

        <TabsContent value="cases">
          <CaseManagement />
        </TabsContent>

        <TabsContent value="doctors">
          <DoctorManagement />
        </TabsContent>

        <TabsContent value="qr-code">
          <div className="max-w-2xl mx-auto">
            <QRCodeGenerator url={adminUrl} />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
