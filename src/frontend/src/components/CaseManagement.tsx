import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useGetAllEmergencies, useGetAllDoctors } from '../hooks/useQueries';
import { Department, PersistentEmergency } from '../backend';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAssignCaseToDoctor } from '../hooks/useQueries';

export function CaseManagement() {
  const { data: emergencies, isLoading } = useGetAllEmergencies();
  const { data: allDoctors } = useGetAllDoctors();
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [departmentFilter, setDepartmentFilter] = useState<string>('all');
  const assignCase = useAssignCaseToDoctor();

  const departmentLabels: Record<Department, string> = {
    [Department.emergency]: 'Emergency',
    [Department.cardiology]: 'Cardiology',
    [Department.neurology]: 'Neurology',
    [Department.pediatrics]: 'Pediatrics',
    [Department.orthopedics]: 'Orthopedics',
    [Department.generalMedicine]: 'General Medicine',
  };

  const filteredEmergencies = emergencies?.filter((emergency) => {
    const matchesStatus = statusFilter === 'all' || emergency.status === statusFilter;
    const matchesDepartment = departmentFilter === 'all' || emergency.department === departmentFilter;
    return matchesStatus && matchesDepartment;
  });

  const handleAssignDoctor = async (caseId: string, doctorId: string) => {
    await assignCase.mutateAsync({ caseId, doctorId });
  };

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
    <Card>
      <CardHeader>
        <CardTitle>Emergency Cases</CardTitle>
        <CardDescription>View and manage all emergency cases</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex gap-4 mb-6">
          <div className="flex-1">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="created">Created</SelectItem>
                <SelectItem value="assigned">Assigned</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex-1">
            <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                {Object.entries(departmentLabels).map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {filteredEmergencies && filteredEmergencies.length > 0 ? (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Case ID</TableHead>
                  <TableHead>Patient ID</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEmergencies.map((emergency) => {
                  const departmentDoctors = allDoctors?.filter(
                    (doc) => doc.department === emergency.department
                  );
                  return (
                    <TableRow key={emergency.id}>
                      <TableCell className="font-mono text-xs">{emergency.id.slice(0, 20)}...</TableCell>
                      <TableCell className="font-mono text-xs">{emergency.patientId.slice(0, 20)}...</TableCell>
                      <TableCell>
                        <Badge variant="outline">{departmentLabels[emergency.department]}</Badge>
                      </TableCell>
                      <TableCell className="max-w-xs truncate">{emergency.description}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            emergency.status === 'completed'
                              ? 'default'
                              : emergency.status === 'assigned'
                              ? 'secondary'
                              : 'outline'
                          }
                        >
                          {emergency.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {departmentDoctors && departmentDoctors.length > 0 ? (
                          <Select
                            onValueChange={(doctorId) => handleAssignDoctor(emergency.id, doctorId)}
                            disabled={assignCase.isPending}
                          >
                            <SelectTrigger className="w-[180px]">
                              <SelectValue placeholder="Assign doctor" />
                            </SelectTrigger>
                            <SelectContent>
                              {departmentDoctors.map((doctor) => (
                                <SelectItem key={doctor.id} value={doctor.id}>
                                  {doctor.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        ) : (
                          <span className="text-sm text-muted-foreground">No doctors available</span>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            <p>No emergency cases found</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
