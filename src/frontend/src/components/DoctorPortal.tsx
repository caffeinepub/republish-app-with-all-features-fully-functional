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
      <div className="container mx-auto px-6 py-16">
        <Card className="max-w-lg mx-auto border-2 border-primary/20">
          <CardHeader className="text-center space-y-4 pb-6">
            <div className="mx-auto mb-2 h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center">
              <Stethoscope className="h-10 w-10 text-primary" />
            </div>
            <CardTitle className="text-2xl">Register as Doctor</CardTitle>
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
                  className="h-11"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="department" className="text-sm font-medium">Department</Label>
                <Select value={selectedDepartment} onValueChange={(value) => setSelectedDepartment(value as Department)}>
                  <SelectTrigger id="department" className="h-11">
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
                className="w-full h-12 text-base"
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

  // Doctor portal for registered doctors
  return (
    <div className="container mx-auto px-6 py-10">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h2 className="text-3xl font-bold tracking-tight mb-2">Doctor Portal</h2>
          <p className="text-muted-foreground text-base">
            View assigned cases and analyze medical reports
          </p>
        </div>

        <Tabs defaultValue="cases" className="space-y-8">
          <TabsList className="grid w-full grid-cols-2 max-w-md h-12">
            <TabsTrigger value="cases" className="text-base">My Cases</TabsTrigger>
            <TabsTrigger value="analysis" className="text-base">Report Analysis</TabsTrigger>
          </TabsList>

          <TabsContent value="cases">
            <Card className="border-2 border-primary/20">
              <CardHeader className="space-y-2 pb-6">
                <CardTitle className="text-2xl">Emergency Cases</CardTitle>
                <CardDescription className="text-base">View all emergency cases in the system</CardDescription>
              </CardHeader>
              <CardContent>
                {emergenciesLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : emergencies && emergencies.length > 0 ? (
                  <div className="space-y-4">
                    {emergencies.map((emergency) => (
                      <Card key={emergency.id} className="border-2 border-primary/10">
                        <CardContent className="pt-6">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1 space-y-3">
                              <div className="flex items-center gap-3">
                                <Badge variant="outline" className="text-sm">{departmentLabels[emergency.department]}</Badge>
                                <Badge variant={emergency.status === 'created' ? 'secondary' : 'default'} className="text-sm">
                                  {emergency.status}
                                </Badge>
                              </div>
                              <p className="text-sm font-medium">Patient ID: {emergency.patientId.slice(0, 30)}...</p>
                              <p className="text-sm text-muted-foreground">{emergency.description}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    No emergency cases found
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analysis">
            <MedicalReportAnalysis />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
