import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { useGetAllDoctors, useAddDoctor, useGetCaseAssignmentsForDoctor } from '../hooks/useQueries';
import { Department } from '../backend';
import { Loader2, Plus, UserPlus } from 'lucide-react';

export function DoctorManagement() {
  const { data: doctors, isLoading } = useGetAllDoctors();
  const addDoctor = useAddDoctor();
  const [showAddForm, setShowAddForm] = useState(false);
  const [doctorName, setDoctorName] = useState('');
  const [doctorDepartment, setDoctorDepartment] = useState<Department | ''>('');

  const departmentLabels: Record<Department, string> = {
    [Department.emergency]: 'Emergency',
    [Department.cardiology]: 'Cardiology',
    [Department.neurology]: 'Neurology',
    [Department.pediatrics]: 'Pediatrics',
    [Department.orthopedics]: 'Orthopedics',
    [Department.generalMedicine]: 'General Medicine',
  };

  const handleAddDoctor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!doctorName.trim() || !doctorDepartment) return;

    const doctorId = `doctor-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    await addDoctor.mutateAsync({
      id: doctorId,
      name: doctorName.trim(),
      department: doctorDepartment as Department,
    });

    setDoctorName('');
    setDoctorDepartment('');
    setShowAddForm(false);
  };

  const doctorsByDepartment = doctors?.reduce((acc, doctor) => {
    const dept = doctor.department;
    if (!acc[dept]) acc[dept] = [];
    acc[dept].push(doctor);
    return acc;
  }, {} as Record<Department, typeof doctors>);

  if (isLoading) {
    return (
      <Card className="border-2 border-primary/20">
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="border-2 border-primary/20">
        <CardHeader className="space-y-2 pb-6">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">Doctor Management</CardTitle>
              <CardDescription className="text-base mt-1">Add and manage medical staff</CardDescription>
            </div>
            <Button onClick={() => setShowAddForm(!showAddForm)} variant="default" className="gap-2">
              <Plus className="h-5 w-5" />
              Add Doctor
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {showAddForm && (
            <Card className="mb-6 border-2 border-primary/10">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg flex items-center gap-2">
                  <UserPlus className="h-5 w-5" />
                  Add New Doctor
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleAddDoctor} className="space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="doctorName" className="text-sm font-medium">Doctor Name</Label>
                    <Input
                      id="doctorName"
                      placeholder="Enter doctor's full name"
                      value={doctorName}
                      onChange={(e) => setDoctorName(e.target.value)}
                      required
                      className="h-11"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="doctorDepartment" className="text-sm font-medium">Department</Label>
                    <Select value={doctorDepartment} onValueChange={(value) => setDoctorDepartment(value as Department)}>
                      <SelectTrigger id="doctorDepartment" className="h-11">
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
                  <div className="flex gap-3">
                    <Button
                      type="submit"
                      disabled={addDoctor.isPending || !doctorName.trim() || !doctorDepartment}
                      className="flex-1 h-11"
                    >
                      {addDoctor.isPending ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                          Adding...
                        </>
                      ) : (
                        'Add Doctor'
                      )}
                    </Button>
                    <Button type="button" variant="outline" onClick={() => setShowAddForm(false)} className="h-11">
                      Cancel
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {doctorsByDepartment && Object.keys(doctorsByDepartment).length > 0 ? (
            <Accordion type="single" collapsible className="space-y-3">
              {Object.entries(doctorsByDepartment).map(([dept, deptDoctors]) => (
                <AccordionItem key={dept} value={dept} className="border-2 border-primary/10 rounded-lg px-4">
                  <AccordionTrigger className="hover:no-underline py-4">
                    <div className="flex items-center gap-3">
                      <Badge variant="outline" className="text-sm">{departmentLabels[dept as Department]}</Badge>
                      <span className="text-sm text-muted-foreground">
                        {deptDoctors.length} {deptDoctors.length === 1 ? 'doctor' : 'doctors'}
                      </span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pt-2 pb-4">
                    <div className="space-y-3">
                      {deptDoctors.map((doctor) => (
                        <DoctorCard key={doctor.id} doctor={doctor} />
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <p>No doctors registered yet</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function DoctorCard({ doctor }: { doctor: { id: string; name: string; department: Department } }) {
  const { data: assignments, isLoading } = useGetCaseAssignmentsForDoctor(doctor.id);

  return (
    <Card className="border border-primary/10">
      <CardContent className="pt-5 pb-5">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <p className="font-medium text-base">{doctor.name}</p>
            <p className="text-sm text-muted-foreground font-mono">{doctor.id.slice(0, 20)}...</p>
          </div>
          <div>
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
            ) : (
              <Badge variant="secondary" className="text-sm">
                {assignments?.length || 0} {assignments?.length === 1 ? 'case' : 'cases'}
              </Badge>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
