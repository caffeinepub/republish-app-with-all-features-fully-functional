import React, { useState } from 'react';
import { AlertTriangle, User, CheckCircle, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import {
  useGetAllEmergencyCases,
  useGetAllDoctors,
  useAssignDoctor,
  useResolveCase,
  getFriendlyErrorMessage,
} from '@/hooks/useQueries';
import { CaseStatus, Severity, Department } from '@/backend';

const SEVERITY_CONFIG: Record<string, { label: string; className: string }> = {
  [Severity.critical]: { label: 'Critical', className: 'bg-red-100 text-red-700 border-red-200' },
  [Severity.high]: { label: 'High', className: 'bg-orange-100 text-orange-700 border-orange-200' },
  [Severity.medium]: { label: 'Medium', className: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
  [Severity.low]: { label: 'Low', className: 'bg-green-100 text-green-700 border-green-200' },
};

const STATUS_CONFIG: Record<string, { label: string; className: string }> = {
  [CaseStatus.open]: { label: 'Open', className: 'bg-blue-100 text-blue-700 border-blue-200' },
  [CaseStatus.assigned]: { label: 'Assigned', className: 'bg-purple-100 text-purple-700 border-purple-200' },
  [CaseStatus.resolved]: { label: 'Resolved', className: 'bg-gray-100 text-gray-600 border-gray-200' },
};

const DEPARTMENT_LABELS: Record<string, string> = {
  [Department.emergency]: 'Emergency Medicine',
  [Department.cardiology]: 'Cardiology',
  [Department.neurology]: 'Neurology',
  [Department.pediatrics]: 'Pediatrics',
  [Department.orthopedics]: 'Orthopedics',
  [Department.generalMedicine]: 'General Medicine',
};

interface CaseManagementProps {
  readOnly?: boolean;
  departmentFilter?: Department;
}

export default function CaseManagement({ readOnly = false, departmentFilter }: CaseManagementProps) {
  const { data: cases, isLoading: casesLoading } = useGetAllEmergencyCases();
  const { data: doctors } = useGetAllDoctors();
  const assignDoctor = useAssignDoctor();
  const resolveCase = useResolveCase();

  const [selectedDoctors, setSelectedDoctors] = useState<Record<string, string>>({});
  const [error, setError] = useState('');

  const filteredCases = departmentFilter
    ? cases?.filter((c) => {
        // Filter by matching department in condition text or by assigned doctor's department
        const assignedDoctor = c.assignedDoctorId
          ? doctors?.find((d) => d.id === c.assignedDoctorId)
          : null;
        if (assignedDoctor) {
          return assignedDoctor.department === departmentFilter;
        }
        return true; // Show unassigned cases to all doctors
      })
    : cases;

  const handleAssign = async (caseId: bigint) => {
    const doctorIdStr = selectedDoctors[caseId.toString()];
    if (!doctorIdStr) {
      setError('Please select a doctor to assign.');
      return;
    }
    setError('');
    try {
      await assignDoctor.mutateAsync({ caseId, doctorId: BigInt(doctorIdStr) });
    } catch (err) {
      setError(getFriendlyErrorMessage(err));
    }
  };

  const handleResolve = async (caseId: bigint) => {
    setError('');
    try {
      await resolveCase.mutateAsync(caseId);
    } catch (err) {
      setError(getFriendlyErrorMessage(err));
    }
  };

  const availableDoctors = doctors?.filter((d) => d.available) ?? [];

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <AlertTriangle className="w-5 h-5 text-primary" />
            Emergency Cases
            {departmentFilter && (
              <Badge variant="outline" className="ml-2 text-xs">
                {DEPARTMENT_LABELS[departmentFilter] ?? departmentFilter}
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {casesLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-24 w-full" />
              ))}
            </div>
          ) : !filteredCases || filteredCases.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">No emergency cases found.</p>
          ) : (
            <div className="space-y-4">
              {filteredCases.map((emergencyCase) => {
                const severityConfig = SEVERITY_CONFIG[emergencyCase.severity] ?? {
                  label: emergencyCase.severity,
                  className: '',
                };
                const statusConfig = STATUS_CONFIG[emergencyCase.status] ?? {
                  label: emergencyCase.status,
                  className: '',
                };
                const assignedDoctor = emergencyCase.assignedDoctorId
                  ? doctors?.find((d) => d.id === emergencyCase.assignedDoctorId)
                  : null;

                return (
                  <div
                    key={emergencyCase.id.toString()}
                    className="p-4 rounded-lg border border-border bg-card space-y-3"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-muted-foreground mt-0.5" />
                        <div>
                          <p className="font-semibold text-foreground">{emergencyCase.patientName}</p>
                          <p className="text-sm text-muted-foreground">{emergencyCase.condition}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <Badge className={severityConfig.className}>{severityConfig.label}</Badge>
                        <Badge className={statusConfig.className}>{statusConfig.label}</Badge>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      {new Date(Number(emergencyCase.createdAt) / 1_000_000).toLocaleString()}
                      {assignedDoctor && (
                        <span className="ml-2 flex items-center gap-1">
                          <CheckCircle className="w-3 h-3 text-green-600" />
                          Assigned to {assignedDoctor.name}
                        </span>
                      )}
                    </div>

                    {!readOnly && emergencyCase.status !== CaseStatus.resolved && (
                      <div className="flex items-center gap-2 pt-1">
                        {emergencyCase.status === CaseStatus.open && (
                          <>
                            <Select
                              value={selectedDoctors[emergencyCase.id.toString()] ?? ''}
                              onValueChange={(v) =>
                                setSelectedDoctors((prev) => ({
                                  ...prev,
                                  [emergencyCase.id.toString()]: v,
                                }))
                              }
                            >
                              <SelectTrigger className="flex-1 h-8 text-sm">
                                <SelectValue placeholder="Select doctor" />
                              </SelectTrigger>
                              <SelectContent>
                                {availableDoctors.map((doc) => (
                                  <SelectItem key={doc.id.toString()} value={doc.id.toString()}>
                                    {doc.name} — {DEPARTMENT_LABELS[doc.department] ?? doc.department}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <Button
                              size="sm"
                              onClick={() => handleAssign(emergencyCase.id)}
                              disabled={assignDoctor.isPending}
                            >
                              Assign
                            </Button>
                          </>
                        )}
                        {emergencyCase.status === CaseStatus.assigned && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleResolve(emergencyCase.id)}
                            disabled={resolveCase.isPending}
                            className="text-green-700 border-green-300 hover:bg-green-50"
                          >
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Resolve
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
