import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Skeleton } from '@/components/ui/skeleton';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Users,
  Stethoscope,
  AlertTriangle,
  Activity,
  UserCheck,
  UserX,
  RefreshCw,
  Zap,
  ClipboardList,
} from 'lucide-react';
import { toast } from 'sonner';
import {
  useGetAllDoctorsPublic,
  useGetAllCasesPublic,
  useUpdateDoctorAvailability,
  useUpdateCaseStatus,
  useAssignDoctorToCase,
  useDeleteCase,
  useTotalDoctorCount,
  useTotalCaseCount,
  useActiveCriticalEmergencyCounts,
} from '../hooks/useQueries';
import { Doctor, EmergencyCase, CaseStatus, DoctorStatus, Severity, Department } from '../backend';

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatDate(timestamp: bigint): string {
  return new Date(Number(timestamp) / 1_000_000).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

function getDepartmentLabel(dept: Department): string {
  const labels: Record<string, string> = {
    emergency: 'Emergency',
    cardiology: 'Cardiology',
    neurology: 'Neurology',
    pediatrics: 'Pediatrics',
    orthopedics: 'Orthopedics',
    generalMedicine: 'General Medicine',
  };
  return labels[dept as string] || String(dept);
}

function getSeverityColor(severity: Severity): string {
  switch (severity as string) {
    case 'critical': return 'destructive';
    case 'high': return 'destructive';
    case 'medium': return 'secondary';
    case 'low': return 'outline';
    default: return 'outline';
  }
}

function getCaseStatusColor(status: CaseStatus): string {
  switch (status as string) {
    case 'open': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
    case 'assigned': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
    case 'inProgress': return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300';
    case 'resolved': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
    case 'closed': return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300';
    default: return 'bg-gray-100 text-gray-800';
  }
}

function getDoctorStatusColor(status: DoctorStatus): string {
  switch (status as string) {
    case 'approved': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
    case 'pendingApproval': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
    case 'rejected': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
    default: return 'bg-gray-100 text-gray-800';
  }
}

// ── Stat Card ─────────────────────────────────────────────────────────────────

interface StatCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  description?: string;
  loading?: boolean;
  colorClass?: string;
  bgClass?: string;
}

function StatCard({ title, value, icon, description, loading, colorClass = 'text-primary', bgClass = 'bg-primary/10' }: StatCardProps) {
  return (
    <Card className="card-hover border-border">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">{title}</p>
            {loading ? (
              <Skeleton className="h-10 w-20 mt-2" />
            ) : (
              <p className={`text-4xl font-bold mt-2 ${colorClass}`}>{value}</p>
            )}
            {description && <p className="text-xs text-muted-foreground mt-1">{description}</p>}
          </div>
          <div className={`p-4 rounded-2xl ${bgClass} ${colorClass}`}>{icon}</div>
        </div>
      </CardContent>
    </Card>
  );
}

// ── Doctor Row ────────────────────────────────────────────────────────────────

interface DoctorRowProps {
  doctor: Doctor;
  onToggleAvailability: (id: bigint, available: boolean) => void;
  togglingId: bigint | null;
}

function DoctorRow({ doctor, onToggleAvailability, togglingId }: DoctorRowProps) {
  const isToggling = togglingId === doctor.id;
  const isApproved = (doctor.status as string) === 'approved';

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border border-border bg-card gap-3">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <p className="font-semibold text-foreground truncate">{doctor.name}</p>
          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${getDoctorStatusColor(doctor.status)}`}>
            {(doctor.status as string) === 'pendingApproval' ? 'Pending' : isApproved ? 'Approved' : 'Rejected'}
          </span>
          {isApproved && (
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${doctor.available ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300' : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'}`}>
              {doctor.available ? 'Available' : 'Unavailable'}
            </span>
          )}
        </div>
        <p className="text-sm text-muted-foreground mt-0.5">
          {getDepartmentLabel(doctor.department)} · ID: {String(doctor.id)} · {doctor.contactInfo}
        </p>
        <p className="text-xs text-muted-foreground mt-0.5">Registered: {formatDate(doctor.registrationDate)}</p>
      </div>

      <div className="flex items-center gap-3 flex-wrap">
        {isApproved && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">Available</span>
            <Switch
              checked={doctor.available}
              onCheckedChange={(checked) => onToggleAvailability(doctor.id, checked)}
              disabled={isToggling}
            />
          </div>
        )}
      </div>
    </div>
  );
}

// ── Case Row ──────────────────────────────────────────────────────────────────

interface CaseRowProps {
  emergencyCase: EmergencyCase;
  doctors: Doctor[];
  onStatusChange: (caseId: bigint, status: CaseStatus) => void;
  onAssignDoctor: (caseId: bigint, doctorId: bigint) => void;
  onDeleteCase: (caseId: bigint) => void;
  updatingId: bigint | null;
  assigningId: bigint | null;
  deletingId: bigint | null;
}

function CaseRow({
  emergencyCase,
  doctors,
  onStatusChange,
  onAssignDoctor,
  onDeleteCase,
  updatingId,
  assigningId,
  deletingId,
}: CaseRowProps) {
  const isUpdating = updatingId === emergencyCase.id;
  const isAssigning = assigningId === emergencyCase.id;
  const isDeleting = deletingId === emergencyCase.id;
  const isClosed = (emergencyCase.status as string) === 'closed';

  const approvedDoctors = doctors.filter(d => (d.status as string) === 'approved');
  const assignedDoctor = emergencyCase.assignedDoctorId != null
    ? doctors.find(d => d.id === emergencyCase.assignedDoctorId)
    : null;

  return (
    <div className="p-4 rounded-xl border border-border bg-card">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="font-semibold text-foreground">{emergencyCase.patientName}</p>
            <Badge variant={getSeverityColor(emergencyCase.severity) as any}>
              {String(emergencyCase.severity).toUpperCase()}
            </Badge>
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${getCaseStatusColor(emergencyCase.status)}`}>
              {String(emergencyCase.status).replace(/([A-Z])/g, ' $1').trim()}
            </span>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            <span className="font-medium">Condition:</span> {emergencyCase.condition}
          </p>
          <p className="text-sm text-muted-foreground">
            <span className="font-medium">Department:</span> {getDepartmentLabel(emergencyCase.caseType)}
          </p>
          {emergencyCase.patientDetails && (
            <p className="text-sm text-muted-foreground">
              <span className="font-medium">Details:</span> {emergencyCase.patientDetails}
            </p>
          )}
          <p className="text-xs text-muted-foreground mt-1">
            Case #{String(emergencyCase.id)} · Submitted: {formatDate(emergencyCase.submissionDate)}
          </p>
          {assignedDoctor && (
            <p className="text-xs text-green-600 dark:text-green-400 mt-1">
              Assigned to: Dr. {assignedDoctor.name}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-2 min-w-[180px]">
          {/* Status Update */}
          {!isClosed && (
            <Select
              value={String(emergencyCase.status)}
              onValueChange={(val) => onStatusChange(emergencyCase.id, val as CaseStatus)}
              disabled={isUpdating}
            >
              <SelectTrigger className="h-8 text-xs">
                {isUpdating ? (
                  <span className="flex items-center gap-1">
                    <RefreshCw className="h-3 w-3 animate-spin" /> Updating...
                  </span>
                ) : (
                  <SelectValue placeholder="Update status" />
                )}
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="open">Open</SelectItem>
                <SelectItem value="assigned">Assigned</SelectItem>
                <SelectItem value="inProgress">In Progress</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
              </SelectContent>
            </Select>
          )}

          {/* Assign Doctor */}
          {!isClosed && approvedDoctors.length > 0 && (
            <Select
              value={emergencyCase.assignedDoctorId != null ? String(emergencyCase.assignedDoctorId) : ''}
              onValueChange={(val) => onAssignDoctor(emergencyCase.id, BigInt(val))}
              disabled={isAssigning}
            >
              <SelectTrigger className="h-8 text-xs">
                {isAssigning ? (
                  <span className="flex items-center gap-1">
                    <RefreshCw className="h-3 w-3 animate-spin" /> Assigning...
                  </span>
                ) : (
                  <SelectValue placeholder="Assign doctor" />
                )}
              </SelectTrigger>
              <SelectContent>
                {approvedDoctors.map(doc => (
                  <SelectItem key={String(doc.id)} value={String(doc.id)}>
                    Dr. {doc.name} ({getDepartmentLabel(doc.department)})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          {/* Delete Case */}
          <Button
            size="sm"
            variant="outline"
            onClick={() => onDeleteCase(emergencyCase.id)}
            disabled={isDeleting}
            className="h-8 text-xs text-destructive hover:text-destructive border-destructive/30 hover:bg-destructive/10"
          >
            {isDeleting ? <RefreshCw className="h-3 w-3 animate-spin mr-1" /> : null}
            Delete Case
          </Button>
        </div>
      </div>
    </div>
  );
}

// ── Main AdminDashboard Component ─────────────────────────────────────────────

export default function AdminDashboard() {
  const [caseFilter, setCaseFilter] = useState<'all' | 'open' | 'inProgress' | 'resolved' | 'closed'>('all');
  const [togglingId, setTogglingId] = useState<bigint | null>(null);
  const [updatingCaseId, setUpdatingCaseId] = useState<bigint | null>(null);
  const [assigningCaseId, setAssigningCaseId] = useState<bigint | null>(null);
  const [deletingCaseId, setDeletingCaseId] = useState<bigint | null>(null);

  // ── Public stat hooks (auto-refresh every 5s, no auth required) ────────────
  const { data: totalDoctors = 0, isLoading: doctorCountLoading } = useTotalDoctorCount();
  const { data: totalCases = 0, isLoading: caseCountLoading } = useTotalCaseCount();
  const {
    data: emergencyCounts = { totalActive: 0, totalCritical: 0, totalOpen: 0 },
    isLoading: emergencyCountLoading,
  } = useActiveCriticalEmergencyCounts();

  // ── Public list hooks (no auth required) ───────────────────────────────────
  const { data: allDoctors = [], isLoading: doctorsLoading, refetch: refetchDoctors } = useGetAllDoctorsPublic();
  const { data: allCases = [], isLoading: casesLoading, refetch: refetchCases } = useGetAllCasesPublic();

  // ── Mutations ───────────────────────────────────────────────────────────────
  const updateAvailability = useUpdateDoctorAvailability();
  const updateCaseStatus = useUpdateCaseStatus();
  const assignDoctor = useAssignDoctorToCase();
  const deleteCase = useDeleteCase();

  // ── Filtered Lists ──────────────────────────────────────────────────────────
  const filteredCases = allCases.filter(c => {
    if (caseFilter === 'all') return true;
    return (c.status as string) === caseFilter;
  });

  // ── Handlers ────────────────────────────────────────────────────────────────

  const handleToggleAvailability = async (doctorId: bigint, available: boolean) => {
    setTogglingId(doctorId);
    try {
      await updateAvailability.mutateAsync({ doctorId, available });
      toast.success(`Doctor marked as ${available ? 'available' : 'unavailable'}`);
    } catch (err: any) {
      toast.error(err?.message || 'Failed to update availability');
    } finally {
      setTogglingId(null);
    }
  };

  const handleStatusChange = async (caseId: bigint, newStatus: CaseStatus) => {
    setUpdatingCaseId(caseId);
    try {
      await updateCaseStatus.mutateAsync({ caseId, newStatus });
      toast.success('Case status updated');
    } catch (err: any) {
      toast.error(err?.message || 'Failed to update case status');
    } finally {
      setUpdatingCaseId(null);
    }
  };

  const handleAssignDoctor = async (caseId: bigint, doctorId: bigint) => {
    setAssigningCaseId(caseId);
    try {
      await assignDoctor.mutateAsync({ caseId, doctorId });
      toast.success('Doctor assigned to case');
    } catch (err: any) {
      toast.error(err?.message || 'Failed to assign doctor');
    } finally {
      setAssigningCaseId(null);
    }
  };

  const handleDeleteCase = async (caseId: bigint) => {
    setDeletingCaseId(caseId);
    try {
      await deleteCase.mutateAsync(caseId);
      toast.success('Case deleted');
    } catch (err: any) {
      toast.error(err?.message || 'Failed to delete case');
    } finally {
      setDeletingCaseId(null);
    }
  };

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-background">
      {/* Live Stats Banner */}
      <div className="bg-primary/5 border-b border-primary/10 px-4 py-2">
        <div className="max-w-7xl mx-auto flex items-center gap-2 text-xs text-muted-foreground">
          <span className="inline-block w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          Live data · Auto-refreshes every 5 seconds
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">

        {/* ── Three Key Stat Cards ── */}
        <section>
          <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5 text-primary" />
            Real-Time Overview
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <StatCard
              title="Total Doctors"
              value={totalDoctors}
              icon={<Stethoscope className="w-6 h-6" />}
              description="All registered doctors"
              loading={doctorCountLoading}
              colorClass="text-primary"
              bgClass="bg-primary/10"
            />
            <StatCard
              title="Total Cases"
              value={totalCases}
              icon={<ClipboardList className="w-6 h-6" />}
              description="All submitted cases"
              loading={caseCountLoading}
              colorClass="text-blue-600 dark:text-blue-400"
              bgClass="bg-blue-500/10"
            />
            <StatCard
              title="Active Emergencies"
              value={emergencyCounts.totalActive}
              icon={<AlertTriangle className="w-6 h-6" />}
              description={`${emergencyCounts.totalCritical} critical · ${emergencyCounts.totalOpen} open`}
              loading={emergencyCountLoading}
              colorClass="text-destructive"
              bgClass="bg-destructive/10"
            />
          </div>
        </section>

        {/* ── Secondary Stats Row ── */}
        <section className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <Card className="border-border">
            <CardContent className="p-4 text-center">
              {emergencyCountLoading ? (
                <Skeleton className="h-7 w-12 mx-auto mb-1" />
              ) : (
                <p className="text-2xl font-bold text-orange-500">{emergencyCounts.totalCritical}</p>
              )}
              <p className="text-xs text-muted-foreground mt-1">Critical Cases</p>
            </CardContent>
          </Card>
          <Card className="border-border">
            <CardContent className="p-4 text-center">
              {emergencyCountLoading ? (
                <Skeleton className="h-7 w-12 mx-auto mb-1" />
              ) : (
                <p className="text-2xl font-bold text-blue-500">{emergencyCounts.totalOpen}</p>
              )}
              <p className="text-xs text-muted-foreground mt-1">Open Cases</p>
            </CardContent>
          </Card>
          <Card className="border-border">
            <CardContent className="p-4 text-center">
              {doctorsLoading ? (
                <Skeleton className="h-7 w-12 mx-auto mb-1" />
              ) : (
                <p className="text-2xl font-bold text-green-500">
                  {allDoctors.filter(d => d.available && (d.status as string) === 'approved').length}
                </p>
              )}
              <p className="text-xs text-muted-foreground mt-1">Available Doctors</p>
            </CardContent>
          </Card>
          <Card className="border-border">
            <CardContent className="p-4 text-center">
              {doctorsLoading ? (
                <Skeleton className="h-7 w-12 mx-auto mb-1" />
              ) : (
                <p className="text-2xl font-bold text-yellow-500">
                  {allDoctors.filter(d => (d.status as string) === 'pendingApproval').length}
                </p>
              )}
              <p className="text-xs text-muted-foreground mt-1">Pending Approval</p>
            </CardContent>
          </Card>
        </section>

        {/* ── Tabs for Doctors & Cases ── */}
        <Tabs defaultValue="doctors">
          <TabsList className="mb-4">
            <TabsTrigger value="doctors" className="gap-2">
              <Users className="w-4 h-4" />
              Doctors ({allDoctors.length})
            </TabsTrigger>
            <TabsTrigger value="cases" className="gap-2">
              <ClipboardList className="w-4 h-4" />
              Cases ({allCases.length})
            </TabsTrigger>
          </TabsList>

          {/* ── Doctors Tab ── */}
          <TabsContent value="doctors" className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                {allDoctors.length} doctor{allDoctors.length !== 1 ? 's' : ''} registered
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => refetchDoctors()}
                disabled={doctorsLoading}
                className="gap-2"
              >
                <RefreshCw className={`w-3 h-3 ${doctorsLoading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>

            {doctorsLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map(i => <Skeleton key={i} className="h-20 w-full rounded-xl" />)}
              </div>
            ) : allDoctors.length === 0 ? (
              <Card className="border-dashed border-border">
                <CardContent className="p-12 text-center">
                  <Stethoscope className="w-12 h-12 text-muted-foreground/40 mx-auto mb-3" />
                  <p className="text-muted-foreground font-medium">No doctors registered yet</p>
                  <p className="text-sm text-muted-foreground mt-1">Doctors will appear here once they register</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {allDoctors.map(doctor => (
                  <DoctorRow
                    key={String(doctor.id)}
                    doctor={doctor}
                    onToggleAvailability={handleToggleAvailability}
                    togglingId={togglingId}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          {/* ── Cases Tab ── */}
          <TabsContent value="cases" className="space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <p className="text-sm text-muted-foreground">
                {allCases.length} case{allCases.length !== 1 ? 's' : ''} total
              </p>
              <div className="flex items-center gap-2">
                <Select value={caseFilter} onValueChange={(v) => setCaseFilter(v as typeof caseFilter)}>
                  <SelectTrigger className="h-8 text-xs w-36">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Cases</SelectItem>
                    <SelectItem value="open">Open</SelectItem>
                    <SelectItem value="inProgress">In Progress</SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => refetchCases()}
                  disabled={casesLoading}
                  className="gap-2"
                >
                  <RefreshCw className={`w-3 h-3 ${casesLoading ? 'animate-spin' : ''}`} />
                  Refresh
                </Button>
              </div>
            </div>

            {casesLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map(i => <Skeleton key={i} className="h-28 w-full rounded-xl" />)}
              </div>
            ) : filteredCases.length === 0 ? (
              <Card className="border-dashed border-border">
                <CardContent className="p-12 text-center">
                  <ClipboardList className="w-12 h-12 text-muted-foreground/40 mx-auto mb-3" />
                  <p className="text-muted-foreground font-medium">
                    {caseFilter === 'all' ? 'No cases submitted yet' : `No ${caseFilter} cases`}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">Cases will appear here once patients submit them</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {filteredCases.map(emergencyCase => (
                  <CaseRow
                    key={String(emergencyCase.id)}
                    emergencyCase={emergencyCase}
                    doctors={allDoctors}
                    onStatusChange={handleStatusChange}
                    onAssignDoctor={handleAssignDoctor}
                    onDeleteCase={handleDeleteCase}
                    updatingId={updatingCaseId}
                    assigningId={assigningCaseId}
                    deletingId={deletingCaseId}
                  />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
