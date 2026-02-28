import React, { useState } from 'react';
import { useDoctorLogin, useRegisterDoctor, useUpdateDoctorAvailability, useGetAllCasesPublic } from '../hooks/useQueries';
import { Doctor, Department, EmergencyCase, Severity } from '../backend';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  Stethoscope, AlertTriangle, CheckCircle, Clock, User, Building2,
  LogOut, Bell, Activity, RefreshCw, Shield, Loader2, Copy, Check,
  KeyRound, IdCard, ShieldCheck
} from 'lucide-react';

const DEPARTMENTS: { value: Department; label: string }[] = [
  { value: Department.emergency, label: 'Emergency' },
  { value: Department.cardiology, label: 'Cardiology' },
  { value: Department.neurology, label: 'Neurology' },
  { value: Department.pediatrics, label: 'Pediatrics' },
  { value: Department.orthopedics, label: 'Orthopedics' },
  { value: Department.generalMedicine, label: 'General Medicine' },
];

function getDeptLabel(dept: Department): string {
  return DEPARTMENTS.find(d => d.value === dept)?.label ?? dept;
}

function getSeverityColor(severity: Severity): string {
  switch (severity) {
    case Severity.critical: return 'bg-red-500/20 text-red-400 border-red-500/40';
    case Severity.high: return 'bg-orange-500/20 text-orange-400 border-orange-500/40';
    case Severity.medium: return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/40';
    case Severity.low: return 'bg-green-500/20 text-green-400 border-green-500/40';
    default: return 'bg-muted text-muted-foreground border-border';
  }
}

function getStatusColor(status: string): string {
  switch (status) {
    case 'open': return 'bg-blue-500/20 text-blue-400 border-blue-500/40';
    case 'assigned': return 'bg-purple-500/20 text-purple-400 border-purple-500/40';
    case 'inProgress': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/40';
    case 'resolved': return 'bg-green-500/20 text-green-400 border-green-500/40';
    case 'closed': return 'bg-muted text-muted-foreground border-border';
    default: return 'bg-muted text-muted-foreground border-border';
  }
}

function isEmergency(c: EmergencyCase): boolean {
  return c.severity === Severity.critical || c.severity === Severity.high;
}

// ── Credentials Modal ─────────────────────────────────────────────────────────

interface DoctorCredentialsModalProps {
  open: boolean;
  doctorId: bigint;
  registrationCode: string;
  doctorName: string;
  onAcknowledge: () => void;
}

function DoctorCredentialsModal({
  open,
  doctorId,
  registrationCode,
  doctorName,
  onAcknowledge,
}: DoctorCredentialsModalProps) {
  const [acknowledged, setAcknowledged] = useState(false);
  const [copiedId, setCopiedId] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  const handleCopyId = async () => {
    try {
      await navigator.clipboard.writeText(String(doctorId));
      setCopiedId(true);
      setTimeout(() => setCopiedId(false), 2000);
    } catch {
      // fallback: select text
    }
  };

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(registrationCode);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    } catch {
      // fallback
    }
  };

  return (
    <Dialog open={open} onOpenChange={() => {/* non-dismissible */}}>
      <DialogContent
        className="sm:max-w-md"
        onPointerDownOutside={e => e.preventDefault()}
        onEscapeKeyDown={e => e.preventDefault()}
      >
        <DialogHeader>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-green-400" />
            </div>
            <DialogTitle className="text-xl text-foreground">Registration Successful!</DialogTitle>
          </div>
          <DialogDescription className="text-muted-foreground">
            Welcome, Dr. <span className="font-semibold text-foreground">{doctorName}</span>! Your account has been created.
            <br />
            <span className="text-yellow-500 font-medium">⚠️ Please save your credentials below — you will need them to log in.</span>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Doctor ID */}
          <div className="rounded-xl border border-primary/30 bg-primary/5 p-4">
            <div className="flex items-center gap-2 mb-2">
              <IdCard className="w-4 h-4 text-primary" />
              <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Doctor ID</span>
            </div>
            <div className="flex items-center justify-between gap-3">
              <span className="text-3xl font-bold text-foreground font-mono tracking-widest">
                {String(doctorId)}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopyId}
                className="gap-2 shrink-0"
              >
                {copiedId ? (
                  <><Check className="w-4 h-4 text-green-400" />Copied!</>
                ) : (
                  <><Copy className="w-4 h-4" />Copy</>
                )}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-1">Use this ID to log in to your account</p>
          </div>

          {/* Registration Code */}
          <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-4">
            <div className="flex items-center gap-2 mb-2">
              <KeyRound className="w-4 h-4 text-amber-500" />
              <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Registration Code</span>
            </div>
            <div className="flex items-center justify-between gap-3">
              <span className="text-2xl font-bold text-foreground font-mono tracking-widest">
                {registrationCode}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopyCode}
                className="gap-2 shrink-0"
              >
                {copiedCode ? (
                  <><Check className="w-4 h-4 text-green-400" />Copied!</>
                ) : (
                  <><Copy className="w-4 h-4" />Copy</>
                )}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-1">Keep this code secret — it's your password</p>
          </div>

          {/* Warning */}
          <Alert className="border-yellow-500/30 bg-yellow-500/10">
            <AlertDescription className="text-yellow-600 dark:text-yellow-400 text-sm">
              🔒 These credentials will not be shown again. Please write them down or save them securely before proceeding.
            </AlertDescription>
          </Alert>

          {/* Acknowledgement checkbox */}
          <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/40 border border-border">
            <Checkbox
              id="ack-checkbox"
              checked={acknowledged}
              onCheckedChange={val => setAcknowledged(!!val)}
              className="mt-0.5"
            />
            <label
              htmlFor="ack-checkbox"
              className="text-sm text-foreground cursor-pointer leading-relaxed"
            >
              I have saved my <strong>Doctor ID ({String(doctorId)})</strong> and <strong>Registration Code</strong> in a safe place and understand I will need them to log in.
            </label>
          </div>

          {/* Proceed button */}
          <Button
            className="w-full"
            disabled={!acknowledged}
            onClick={onAcknowledge}
          >
            <CheckCircle className="w-4 h-4 mr-2" />
            Proceed to Login
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ── Doctor Dashboard ──────────────────────────────────────────────────────────

interface DoctorDashboardProps {
  doctor: Doctor;
  onLogout: () => void;
}

function DoctorDashboard({ doctor, onLogout }: DoctorDashboardProps) {
  const [currentDoctor, setCurrentDoctor] = useState<Doctor>(doctor);
  const updateAvailability = useUpdateDoctorAvailability();
  const { data: allCases = [], isLoading: casesLoading, refetch } = useGetAllCasesPublic();
  const [availMsg, setAvailMsg] = useState<string | null>(null);

  const deptCases = allCases.filter(c => c.caseType === currentDoctor.department);
  const emergencyCases = deptCases.filter(isEmergency);
  const regularCases = deptCases.filter(c => !isEmergency(c));

  const handleToggleAvailability = async () => {
    const newVal = !currentDoctor.available;
    try {
      await updateAvailability.mutateAsync({ doctorId: currentDoctor.id, available: newVal });
      setCurrentDoctor(prev => ({ ...prev, available: newVal }));
      setAvailMsg(newVal ? '✅ You are now marked as Available' : '⏸️ You are now marked as Unavailable');
      setTimeout(() => setAvailMsg(null), 3000);
    } catch (err: any) {
      setAvailMsg('❌ Failed to update availability. Please try again.');
      setTimeout(() => setAvailMsg(null), 4000);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
              <Stethoscope className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="font-bold text-foreground text-lg">Dr. {currentDoctor.name}</h1>
              <p className="text-sm text-muted-foreground">{getDeptLabel(currentDoctor.department)}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {/* Availability Toggle */}
            <div className="flex items-center gap-2 bg-muted/50 rounded-full px-4 py-2">
              <span className="text-sm text-muted-foreground font-medium">Available</span>
              <Switch
                checked={currentDoctor.available}
                onCheckedChange={handleToggleAvailability}
                disabled={updateAvailability.isPending}
              />
              <span className={`text-sm font-semibold ${currentDoctor.available ? 'text-green-400' : 'text-muted-foreground'}`}>
                {updateAvailability.isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : currentDoctor.available ? 'ON' : 'OFF'}
              </span>
            </div>
            <Button variant="outline" size="sm" onClick={onLogout} className="gap-2">
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
        {/* Availability message */}
        {availMsg && (
          <Alert className="border-primary/30 bg-primary/10">
            <AlertDescription className="text-foreground">{availMsg}</AlertDescription>
          </Alert>
        )}

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="glass-card border-primary/20">
            <CardContent className="pt-4 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                  <Activity className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{deptCases.length}</p>
                  <p className="text-xs text-muted-foreground">Total Cases</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="glass-card border-red-500/20">
            <CardContent className="pt-4 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-red-500/20 flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-red-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{emergencyCases.length}</p>
                  <p className="text-xs text-muted-foreground">SOS / Urgent</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="glass-card border-green-500/20">
            <CardContent className="pt-4 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">
                    {deptCases.filter(c => c.status === 'resolved' || c.status === 'closed').length}
                  </p>
                  <p className="text-xs text-muted-foreground">Resolved</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className={`glass-card ${currentDoctor.available ? 'border-green-500/30' : 'border-muted/30'}`}>
            <CardContent className="pt-4 pb-4">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${currentDoctor.available ? 'bg-green-500/20' : 'bg-muted/20'}`}>
                  <Shield className={`w-5 h-5 ${currentDoctor.available ? 'text-green-400' : 'text-muted-foreground'}`} />
                </div>
                <div>
                  <p className={`text-2xl font-bold ${currentDoctor.available ? 'text-green-400' : 'text-muted-foreground'}`}>
                    {currentDoctor.available ? 'ON' : 'OFF'}
                  </p>
                  <p className="text-xs text-muted-foreground">Status</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Emergency SOS Alert Banner */}
        {emergencyCases.length > 0 && (
          <div className="rounded-xl border-2 border-red-500/50 bg-red-500/10 p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center animate-pulse">
                <Bell className="w-4 h-4 text-red-400" />
              </div>
              <div>
                <h3 className="font-bold text-red-400">🚨 Emergency Alert</h3>
                <p className="text-sm text-red-300/80">
                  {emergencyCases.length} critical/high-severity case{emergencyCases.length > 1 ? 's' : ''} in your department
                </p>
              </div>
            </div>
            <div className="space-y-2">
              {emergencyCases.slice(0, 3).map(c => (
                <div key={String(c.id)} className="flex items-center justify-between bg-red-500/10 rounded-lg px-3 py-2">
                  <div>
                    <span className="font-semibold text-foreground text-sm">{c.patientName}</span>
                    <span className="text-xs text-muted-foreground ml-2">— {c.condition}</span>
                  </div>
                  <Badge className={`text-xs border ${getSeverityColor(c.severity)}`}>
                    {String(c.severity).toUpperCase()}
                  </Badge>
                </div>
              ))}
              {emergencyCases.length > 3 && (
                <p className="text-xs text-red-400 text-center">+{emergencyCases.length - 3} more emergency cases</p>
              )}
            </div>
          </div>
        )}

        {/* Cases Tabs */}
        <Tabs defaultValue="emergency">
          <TabsList className="bg-muted/50">
            <TabsTrigger value="emergency" className="gap-2">
              <AlertTriangle className="w-4 h-4" />
              Emergency ({emergencyCases.length})
            </TabsTrigger>
            <TabsTrigger value="regular" className="gap-2">
              <Activity className="w-4 h-4" />
              Regular ({regularCases.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="emergency" className="mt-4">
            {casesLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-24 rounded-xl bg-muted/30 animate-pulse" />
                ))}
              </div>
            ) : emergencyCases.length === 0 ? (
              <Card className="glass-card">
                <CardContent className="p-8 text-center">
                  <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-3" />
                  <p className="text-foreground font-medium">No emergency cases</p>
                  <p className="text-sm text-muted-foreground mt-1">All clear in your department</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {emergencyCases.map(c => (
                  <CaseCard key={String(c.id)} emergencyCase={c} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="regular" className="mt-4">
            {casesLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-24 rounded-xl bg-muted/30 animate-pulse" />
                ))}
              </div>
            ) : regularCases.length === 0 ? (
              <Card className="glass-card">
                <CardContent className="p-8 text-center">
                  <Clock className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                  <p className="text-foreground font-medium">No regular cases</p>
                  <p className="text-sm text-muted-foreground mt-1">No pending cases in your department</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {regularCases.map(c => (
                  <CaseCard key={String(c.id)} emergencyCase={c} />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Refresh Button */}
        <div className="flex justify-center">
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            disabled={casesLoading}
            className="gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${casesLoading ? 'animate-spin' : ''}`} />
            Refresh Cases
          </Button>
        </div>
      </div>
    </div>
  );
}

// ── Case Card ─────────────────────────────────────────────────────────────────

function CaseCard({ emergencyCase: c }: { emergencyCase: EmergencyCase }) {
  return (
    <Card className="glass-card border-border/50">
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-semibold text-foreground">{c.patientName}</span>
              <Badge className={`text-xs border ${getSeverityColor(c.severity)}`}>
                {String(c.severity).toUpperCase()}
              </Badge>
              <Badge className={`text-xs border ${getStatusColor(String(c.status))}`}>
                {String(c.status).replace(/([A-Z])/g, ' $1').trim()}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              <span className="font-medium text-foreground/80">Condition:</span> {c.condition}
            </p>
            {c.patientDetails && (
              <p className="text-sm text-muted-foreground">
                <span className="font-medium text-foreground/80">Details:</span> {c.patientDetails}
              </p>
            )}
            <p className="text-xs text-muted-foreground mt-1">
              Case #{String(c.id)} · {new Date(Number(c.submissionDate) / 1_000_000).toLocaleDateString()}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ── Login Form ────────────────────────────────────────────────────────────────

interface LoginFormProps {
  onSuccess: (doctor: Doctor) => void;
  prefillDoctorId?: string;
}

function LoginForm({ onSuccess, prefillDoctorId }: LoginFormProps) {
  const doctorLogin = useDoctorLogin();
  const [doctorIdStr, setDoctorIdStr] = useState(prefillDoctorId ?? '');
  const [loginCode, setLoginCode] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const id = parseInt(doctorIdStr, 10);
    if (isNaN(id) || id <= 0) {
      setError('Please enter a valid Doctor ID.');
      return;
    }
    if (!loginCode.trim()) {
      setError('Please enter your registration code.');
      return;
    }

    try {
      const result = await doctorLogin.mutateAsync({ doctorId: BigInt(id), registrationCode: loginCode });
      if (result.__kind__ === 'success') {
        onSuccess(result.success);
      } else if (result.__kind__ === 'doctorNotFound') {
        setError('Doctor ID not found. Please check your ID.');
      } else if (result.__kind__ === 'invalidCredentials') {
        setError('Invalid registration code. Please try again.');
      } else if (result.__kind__ === 'notApproved') {
        setError('Your account is not yet approved. Please contact the administrator.');
      }
    } catch (err: any) {
      setError(err?.message || 'Login failed. Please try again.');
    }
  };

  return (
    <form onSubmit={handleLogin} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="doctorId" className="text-foreground">Doctor ID</Label>
        <Input
          id="doctorId"
          type="number"
          placeholder="Enter your Doctor ID"
          value={doctorIdStr}
          onChange={e => setDoctorIdStr(e.target.value)}
          className="bg-muted/50 border-border"
          min="1"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="loginCode" className="text-foreground">Registration Code</Label>
        <Input
          id="loginCode"
          type="password"
          placeholder="Enter your registration code"
          value={loginCode}
          onChange={e => setLoginCode(e.target.value)}
          className="bg-muted/50 border-border"
        />
      </div>
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      <Button type="submit" className="w-full" disabled={doctorLogin.isPending}>
        {doctorLogin.isPending ? (
          <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Logging in...</>
        ) : 'Login'}
      </Button>
    </form>
  );
}

// ── Register Form ─────────────────────────────────────────────────────────────

interface RegisterFormProps {
  onRegistrationComplete: (doctor: Doctor) => void;
}

function RegisterForm({ onRegistrationComplete }: RegisterFormProps) {
  const registerDoctor = useRegisterDoctor();
  const [name, setName] = useState('');
  const [department, setDepartment] = useState<Department | ''>('');
  const [contactInfo, setContactInfo] = useState('');
  const [regCode, setRegCode] = useState('');
  const [yearsExp, setYearsExp] = useState('');
  const [error, setError] = useState('');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) { setError('Please enter your full name.'); return; }
    if (!department) { setError('Please select a department.'); return; }
    if (!contactInfo.trim()) { setError('Please enter your contact information.'); return; }
    if (!regCode.trim()) { setError('Please enter the registration code.'); return; }

    const yearsExpNum = yearsExp ? parseInt(yearsExp, 10) : undefined;
    if (yearsExp && (yearsExpNum === undefined || isNaN(yearsExpNum) || yearsExpNum < 0)) {
      setError('Please enter a valid number of years of experience.');
      return;
    }

    try {
      const doctor = await registerDoctor.mutateAsync({
        name: name.trim(),
        department: department as Department,
        contactInfo: contactInfo.trim(),
        registrationCode: regCode.trim(),
        yearsOfExperience: yearsExpNum !== undefined ? BigInt(yearsExpNum) : undefined,
        certifications: undefined,
      });
      // Pass the registered doctor up — do NOT navigate to dashboard
      onRegistrationComplete(doctor);
    } catch (err: any) {
      const msg = err?.message || '';
      if (msg.includes('Invalid registration code')) {
        setError('Invalid registration code. Please check and try again.');
      } else {
        setError(msg || 'Registration failed. Please try again.');
      }
    }
  };

  return (
    <form onSubmit={handleRegister} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="regName" className="text-foreground">Full Name</Label>
        <Input
          id="regName"
          placeholder="Dr. John Smith"
          value={name}
          onChange={e => setName(e.target.value)}
          className="bg-muted/50 border-border"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="regDept" className="text-foreground">Department</Label>
        <Select value={department} onValueChange={val => setDepartment(val as Department)}>
          <SelectTrigger id="regDept" className="bg-muted/50 border-border">
            <SelectValue placeholder="Select department" />
          </SelectTrigger>
          <SelectContent>
            {DEPARTMENTS.map(d => (
              <SelectItem key={d.value} value={d.value}>{d.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="regContact" className="text-foreground">Contact Information</Label>
        <Input
          id="regContact"
          placeholder="Email or phone number"
          value={contactInfo}
          onChange={e => setContactInfo(e.target.value)}
          className="bg-muted/50 border-border"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="regCode" className="text-foreground">Registration Code</Label>
        <Input
          id="regCode"
          type="password"
          placeholder="Enter the hospital registration code"
          value={regCode}
          onChange={e => setRegCode(e.target.value)}
          className="bg-muted/50 border-border"
        />
        <p className="text-xs text-muted-foreground">Contact your hospital administrator for the registration code.</p>
      </div>
      <div className="space-y-2">
        <Label htmlFor="regYears" className="text-foreground">
          Years of Experience <span className="text-muted-foreground">(optional)</span>
        </Label>
        <Input
          id="regYears"
          type="number"
          placeholder="e.g. 5"
          value={yearsExp}
          onChange={e => setYearsExp(e.target.value)}
          className="bg-muted/50 border-border"
          min="0"
        />
      </div>
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      <Button type="submit" className="w-full" disabled={registerDoctor.isPending}>
        {registerDoctor.isPending ? (
          <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Registering...</>
        ) : 'Register as Doctor'}
      </Button>
    </form>
  );
}

// ── Doctor Portal (main) ──────────────────────────────────────────────────────

type ActiveView = 'login' | 'register';

export default function DoctorPortal() {
  const [loggedInDoctor, setLoggedInDoctor] = useState<Doctor | null>(null);
  const [activeView, setActiveView] = useState<ActiveView>('login');

  // Credentials modal state — shown after successful registration
  const [credentialsDoctor, setCredentialsDoctor] = useState<Doctor | null>(null);
  const [showCredentials, setShowCredentials] = useState(false);

  // Guard: if no logged-in doctor, always show login/register
  const showDashboard = loggedInDoctor !== null;

  const handleLoginSuccess = (doctor: Doctor) => {
    setLoggedInDoctor(doctor);
  };

  const handleRegistrationComplete = (doctor: Doctor) => {
    // Show credentials modal — do NOT log in automatically
    setCredentialsDoctor(doctor);
    setShowCredentials(true);
  };

  const handleCredentialsAcknowledged = () => {
    // Close modal and redirect to login form
    setShowCredentials(false);
    setCredentialsDoctor(null);
    setActiveView('login');
  };

  const handleLogout = () => {
    setLoggedInDoctor(null);
    setActiveView('login');
  };

  // Show dashboard only when explicitly logged in
  if (showDashboard) {
    return <DoctorDashboard doctor={loggedInDoctor!} onLogout={handleLogout} />;
  }

  return (
    <>
      {/* Credentials modal — shown after registration */}
      {credentialsDoctor && (
        <DoctorCredentialsModal
          open={showCredentials}
          doctorId={credentialsDoctor.id}
          registrationCode={credentialsDoctor.registrationCode}
          doctorName={credentialsDoctor.name}
          onAcknowledge={handleCredentialsAcknowledged}
        />
      )}

      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center mx-auto mb-4">
              <Stethoscope className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">Doctor Portal</h1>
            <p className="text-muted-foreground mt-1">Access your medical dashboard</p>
          </div>

          <Card className="glass-card border-border/50">
            <CardHeader className="pb-2">
              <Tabs value={activeView} onValueChange={val => setActiveView(val as ActiveView)}>
                <TabsList className="w-full bg-muted/50">
                  <TabsTrigger value="login" className="flex-1 gap-2">
                    <User className="w-4 h-4" />
                    Login
                  </TabsTrigger>
                  <TabsTrigger value="register" className="flex-1 gap-2">
                    <Building2 className="w-4 h-4" />
                    Register
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="login" className="mt-4">
                  <CardTitle className="text-lg mb-1">Welcome Back</CardTitle>
                  <CardDescription className="mb-4">
                    Enter your Doctor ID and registration code to access your dashboard.
                  </CardDescription>
                  <LoginForm
                    onSuccess={handleLoginSuccess}
                    prefillDoctorId={credentialsDoctor ? String(credentialsDoctor.id) : undefined}
                  />
                </TabsContent>

                <TabsContent value="register" className="mt-4">
                  <CardTitle className="text-lg mb-1">Create Account</CardTitle>
                  <CardDescription className="mb-4">
                    Register as a new doctor. You'll need the hospital registration code from your administrator.
                  </CardDescription>
                  <RegisterForm onRegistrationComplete={handleRegistrationComplete} />
                </TabsContent>
              </Tabs>
            </CardHeader>
            <CardContent />
          </Card>
        </div>
      </div>
    </>
  );
}
