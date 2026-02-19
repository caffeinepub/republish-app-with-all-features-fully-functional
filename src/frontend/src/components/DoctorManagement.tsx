import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { useGetAllDoctors, useAddDoctor, useGetCaseAssignments } from '../hooks/useQueries';
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
    if (!doctorName || !doctorDepartment) return;

    const doctorId = `doctor-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    await addDoctor.mutateAsync({
      id: doctorId,
      name: doctorName,
      department: doctorDepartment as Department,
    });

    setDoctorName('');
    setDoctorDepartment('');
    setShowAddForm(false);
  };

  const groupedDoctors = doctors?.reduce((acc, doctor) => {
    const dept = doctor.department;
    if (!acc[dept]) acc[dept] = [];
    acc[dept].push(doctor);
    return acc;
  }, {} as Record<Department, typeof doctors>);

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Medical Staff</CardTitle>
              <CardDescription>Manage doctors organized by department</CardDescription>
            </div>
            <Button onClick={() => setShowAddForm(!showAddForm)} variant="default" className="gap-2">
              <Plus className="h-4 w-4" />
              Add Doctor
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {showAddForm && (
            <Card className="mb-6 bg-muted/50">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <UserPlus className="h-5 w-5" />
                  Add New Doctor
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleAddDoctor} className="space-y-4">
                  <div>
                    <Label htmlFor="doctorName">Doctor Name *</Label>
                    <Input
                      id="doctorName"
                      value={doctorName}
                      onChange={(e) => setDoctorName(e.target.value)}
                      placeholder="Dr. John Smith"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="doctorDepartment">Department *</Label>
                    <Select
                      value={doctorDepartment}
                      onValueChange={(value) => setDoctorDepartment(value as Department)}
                    >
                      <SelectTrigger id="doctorDepartment">
                        <SelectValue placeholder="Select department" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(departmentLabels).map(([value, label]) => (
                          <SelectItem key={value} value={value}>
                            {label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex gap-2">
                    <Button type="submit" disabled={addDoctor.isPending || !doctorName || !doctorDepartment}>
                      {addDoctor.isPending ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Adding...
                        </>
                      ) : (
                        'Add Doctor'
                      )}
                    </Button>
                    <Button type="button" variant="outline" onClick={() => setShowAddForm(false)}>
                      Cancel
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {groupedDoctors && Object.keys(groupedDoctors).length > 0 ? (
            <Accordion type="single" collapsible className="w-full">
              {Object.entries(groupedDoctors).map(([dept, deptDoctors]) => (
                <AccordionItem key={dept} value={dept}>
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center gap-3">
                      <Badge variant="outline" className="text-base px-3 py-1">
                        {departmentLabels[dept as Department]}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        {deptDoctors.length} {deptDoctors.length === 1 ? 'doctor' : 'doctors'}
                      </span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-3 pt-4">
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
              <p>No doctors added yet</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function DoctorCard({ doctor }: { doctor: { id: string; name: string; department: Department } }) {
  const { data: assignments } = useGetCaseAssignments(doctor.id);

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-start gap-4">
          <img
            src="/assets/generated/doctor-avatar.dim_128x128.png"
            alt={doctor.name}
            className="h-16 w-16 rounded-full"
          />
          <div className="flex-1">
            <h4 className="font-semibold text-lg">{doctor.name}</h4>
            <p className="text-sm text-muted-foreground mb-2">ID: {doctor.id.slice(0, 30)}...</p>
            <div className="flex items-center gap-2">
              <Badge variant="secondary">
                {assignments?.length || 0} active {assignments?.length === 1 ? 'case' : 'cases'}
              </Badge>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
