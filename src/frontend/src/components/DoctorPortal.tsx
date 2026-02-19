import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MedicalReportAnalysis } from './MedicalReportAnalysis';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useGetAllEmergencies, useRegisterDoctor, useGetCallerUserProfile } from '../hooks/useQueries';
import { Badge } from '@/components/ui/badge';
import { Loader2, Stethoscope } from 'lucide-react';
import { Department } from '../backend';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useState } from 'react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';

export function DoctorPortal() {
  const { identity } = useInternetIdentity();
  const { data: emergencies, isLoading: emergenciesLoading } = useGetAllEmergencies();
  const { data: userProfile, isLoading: profileLoading, isFetched } = useGetCallerUserProfile();
  const registerDoctor = useRegisterDoctor();
  const [doctorName, setDoctorName] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState<Department | ''>('');

  const isAuthenticated = !!identity && !identity.getPrincipal().isAnonymous();

  const departmentLabels: Record<Department, string> = {
    [Department.emergency]: 'Emergency',
    [Department.cardiology]: 'Cardiology',
    [Department.neurology]: 'Neurology',
    [Department.pediatrics]: 'Pediatrics',
    [Department.orthopedics]: 'Orthopedics',
    [Department.generalMedicine]: 'General Medicine',
  };

  const handleRegisterDoctor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!doctorName.trim() || !selectedDepartment) return;

    const doctorId = `doctor-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    await registerDoctor.mutateAsync({
      id: doctorId,
      name: doctorName.trim(),
      department: selectedDepartment as Department,
    });
  };

  // Loading state
  if (profileLoading) {
    return (
      <div className="container mx-auto px-6 py-16">
        <div className="flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-10 w-10 animate-spin text-primary mx-auto mb-4" />
            <p className="text-base text-muted-foreground">Loading doctor portal...</p>
          </div>
        </div>
      </div>
    );
  }

  // Show registration form for authenticated users without doctor profile
  if (isAuthenticated && isFetched && (!userProfile || userProfile.role !== 'doctor')) {
    return (
      <div className="container mx-auto px-6 py-16 animate-in fade-in duration-500">
        <Card className="max-w-lg mx-auto border-4 border-primary/30 shadow-2xl shadow-primary/20">
          <CardHeader className="text-center space-y-4 pb-8 pt-10">
            <div className="mx-auto mb-2 h-24 w-24 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center shadow-lg">
              <Stethoscope className="h-12 w-12 text-primary" />
            </div>
            <CardTitle className="text-3xl font-bold">Register as Doctor</CardTitle>
            <CardDescription className="text-base">
              Complete your doctor registration to access the doctor portal
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleRegisterDoctor} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="doctorName" className="text-sm font-medium">Full Name</Label>
                <Input
                  id="doctorName"
                  placeholder="Enter your full name"
                  value={doctorName}
                  onChange={(e) => setDoctorName(e.target.value)}
                  required
                  className="h-12 transition-all focus:ring-2 focus:ring-primary"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="department" className="text-sm font-medium">Department</Label>
                <Select value={selectedDepartment} onValueChange={(value) => setSelectedDepartment(value as Department)}>
                  <SelectTrigger id="department" className="h-12 transition-all focus:ring-2 focus:ring-primary">
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(departmentLabels).map(([key, label]) => (
                      <SelectItem key={key} value={key}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button
                type="submit"
                className="w-full h-14 text-base font-semibold transition-all hover:scale-105 shadow-lg hover:shadow-xl"
                disabled={registerDoctor.isPending || !doctorName.trim() || !selectedDepartment}
              >
                {registerDoctor.isPending ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin mr-2" />
                    Registering...
                  </>
                ) : (
                  'Register as Doctor'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-10 animate-in fade-in duration-500">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h2 className="text-4xl font-bold tracking-tight mb-3 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Doctor Portal
          </h2>
          <p className="text-muted-foreground text-lg">
            Manage assigned cases and analyze medical reports
          </p>
        </div>

        <Tabs defaultValue="cases" className="space-y-8">
          <TabsList className="grid w-full grid-cols-2 max-w-md h-14 bg-muted/50 border-2 border-primary/20">
            <TabsTrigger value="cases" className="text-base font-medium data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all">
              Assigned Cases
            </TabsTrigger>
            <TabsTrigger value="analysis" className="text-base font-medium data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all">
              Report Analysis
            </TabsTrigger>
          </TabsList>

          <TabsContent value="cases" className="animate-in fade-in slide-in-from-bottom duration-500">
            <Card className="border-4 border-primary/30 shadow-xl">
              <CardHeader>
                <CardTitle className="text-2xl">Assigned Emergency Cases</CardTitle>
                <CardDescription className="text-base">
                  View and manage cases assigned to you
                </CardDescription>
              </CardHeader>
              <CardContent>
                {emergenciesLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : emergencies && emergencies.length > 0 ? (
                  <div className="space-y-4">
                    {emergencies.map((emergency) => (
                      <Card key={emergency.id} className="border-2 border-primary/20 hover:border-primary/40 transition-all duration-300 hover:shadow-lg">
                        <CardHeader className="pb-3">
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-lg">Case #{emergency.id.slice(-8)}</CardTitle>
                            <Badge variant="outline" className="font-medium">
                              {departmentLabels[emergency.department]}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-muted-foreground mb-2">
                            <strong>Patient ID:</strong> {emergency.patientId}
                          </p>
                          <p className="text-sm text-muted-foreground mb-2">
                            <strong>Description:</strong> {emergency.description}
                          </p>
                          <Badge variant={emergency.status === 'created' ? 'default' : 'secondary'}>
                            {emergency.status}
                          </Badge>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-muted-foreground py-12">No cases assigned yet</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analysis" className="animate-in fade-in slide-in-from-bottom duration-500">
            <MedicalReportAnalysis />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
