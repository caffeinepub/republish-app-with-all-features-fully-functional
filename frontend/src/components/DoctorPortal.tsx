import React, { useState } from 'react';
import { Stethoscope, LogOut, ToggleLeft, ToggleRight, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useDoctorLogin, useRegisterDoctor, useToggleDoctorAvailability, getFriendlyErrorMessage } from '@/hooks/useQueries';
import { Department } from '@/backend';
import CaseManagement from './CaseManagement';

const DEPARTMENTS: { value: Department; label: string }[] = [
  { value: Department.cardiology, label: 'Cardiology' },
  { value: Department.neurology, label: 'Neurology' },
  { value: Department.orthopedics, label: 'Orthopedics' },
  { value: Department.pediatrics, label: 'Pediatrics' },
  { value: Department.emergency, label: 'Emergency Medicine' },
  { value: Department.generalMedicine, label: 'General Medicine' },
];

// Extended display-only departments (for UI display; backend only supports the 6 above)
const ALL_DISPLAY_DEPARTMENTS = [
  { value: Department.cardiology, label: 'Cardiology' },
  { value: Department.neurology, label: 'Neurology' },
  { value: Department.orthopedics, label: 'Orthopedics' },
  { value: Department.pediatrics, label: 'Pediatrics' },
  { value: Department.emergency, label: 'Emergency Medicine' },
  { value: Department.generalMedicine, label: 'General Medicine' },
];

export default function DoctorPortal() {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [loggedInDoctor, setLoggedInDoctor] = useState<{
    id: bigint;
    name: string;
    department: Department;
    available: boolean;
    registrationCode: string;
  } | null>(null);

  // Login form state
  const [loginName, setLoginName] = useState('');
  const [loginDepartment, setLoginDepartment] = useState<Department | ''>('');
  const [loginError, setLoginError] = useState('');

  // Register form state
  const [regName, setRegName] = useState('');
  const [regDepartment, setRegDepartment] = useState<Department | ''>('');
  const [regCode, setRegCode] = useState('');
  const [showRegCode, setShowRegCode] = useState(false);
  const [regError, setRegError] = useState('');
  const [regSuccess, setRegSuccess] = useState('');

  const doctorLogin = useDoctorLogin();
  const registerDoctor = useRegisterDoctor();
  const toggleAvailability = useToggleDoctorAvailability();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    if (!loginName.trim() || !loginDepartment) {
      setLoginError('Please enter your name and select your department.');
      return;
    }
    try {
      const doctor = await doctorLogin.mutateAsync({
        name: loginName.trim(),
        department: loginDepartment as Department,
      });
      setLoggedInDoctor(doctor);
    } catch (err) {
      setLoginError(getFriendlyErrorMessage(err));
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegError('');
    setRegSuccess('');
    if (!regName.trim() || !regDepartment || !regCode.trim()) {
      setRegError('Please fill in all fields.');
      return;
    }
    if (regCode !== '2011') {
      setRegError('Invalid registration code. Please enter the correct code to register as a doctor.');
      return;
    }
    try {
      await registerDoctor.mutateAsync({
        name: regName.trim(),
        department: regDepartment as Department,
        registrationCode: regCode,
      });
      setRegSuccess(`Dr. ${regName} registered successfully! You can now log in.`);
      setRegName('');
      setRegDepartment('');
      setRegCode('');
      setTimeout(() => setMode('login'), 2000);
    } catch (err) {
      setRegError(getFriendlyErrorMessage(err));
    }
  };

  const handleToggleAvailability = async () => {
    if (!loggedInDoctor) return;
    try {
      const updated = await toggleAvailability.mutateAsync(loggedInDoctor.id);
      setLoggedInDoctor(updated);
    } catch (err) {
      console.error('Toggle error:', err);
    }
  };

  const handleLogout = () => {
    setLoggedInDoctor(null);
    setLoginName('');
    setLoginDepartment('');
    setLoginError('');
  };

  // Logged-in doctor dashboard
  if (loggedInDoctor) {
    const deptLabel =
      ALL_DISPLAY_DEPARTMENTS.find((d) => d.value === loggedInDoctor.department)?.label ??
      loggedInDoctor.department;

    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Stethoscope className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Dr. {loggedInDoctor.name}</h1>
                <p className="text-sm text-muted-foreground">{deptLabel}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge
                className={
                  loggedInDoctor.available
                    ? 'bg-green-100 text-green-700 border-green-200'
                    : 'bg-gray-100 text-gray-600 border-gray-200'
                }
              >
                {loggedInDoctor.available ? 'Available' : 'Unavailable'}
              </Badge>
              <Button
                variant="outline"
                size="sm"
                onClick={handleToggleAvailability}
                disabled={toggleAvailability.isPending}
                className="flex items-center gap-1"
              >
                {loggedInDoctor.available ? (
                  <ToggleRight className="w-4 h-4 text-green-600" />
                ) : (
                  <ToggleLeft className="w-4 h-4 text-gray-400" />
                )}
                {toggleAvailability.isPending ? 'Updating...' : 'Toggle Status'}
              </Button>
              <Button variant="outline" size="sm" onClick={handleLogout} className="flex items-center gap-1">
                <LogOut className="w-4 h-4" />
                Logout
              </Button>
            </div>
          </div>

          <Tabs defaultValue="my-cases">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="my-cases">My Department Cases</TabsTrigger>
              <TabsTrigger value="all-cases">All Cases</TabsTrigger>
            </TabsList>
            <TabsContent value="my-cases" className="mt-4">
              <CaseManagement readOnly={false} departmentFilter={loggedInDoctor.department} />
            </TabsContent>
            <TabsContent value="all-cases" className="mt-4">
              <CaseManagement readOnly={false} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    );
  }

  // Login / Register forms
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <Card className="w-full max-w-md border-l-4 border-r-4 border-primary shadow-lg">
        <CardHeader className="text-center pb-4">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <Stethoscope className="w-8 h-8 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold">Doctor Portal</CardTitle>
          <CardDescription>
            {mode === 'login' ? 'Log in to access your dashboard' : 'Register as a new doctor'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Mode Toggle */}
          <div className="flex rounded-lg border border-border overflow-hidden mb-6">
            <button
              type="button"
              onClick={() => setMode('login')}
              className={`flex-1 py-2 text-sm font-medium transition-colors ${
                mode === 'login'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-background text-muted-foreground hover:bg-accent'
              }`}
            >
              Login
            </button>
            <button
              type="button"
              onClick={() => setMode('register')}
              className={`flex-1 py-2 text-sm font-medium transition-colors ${
                mode === 'register'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-background text-muted-foreground hover:bg-accent'
              }`}
            >
              Register
            </button>
          </div>

          {mode === 'login' ? (
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="loginName">Full Name</Label>
                <Input
                  id="loginName"
                  value={loginName}
                  onChange={(e) => setLoginName(e.target.value)}
                  placeholder="Dr. John Smith"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="loginDept">Department</Label>
                <Select value={loginDepartment} onValueChange={(v) => setLoginDepartment(v as Department)}>
                  <SelectTrigger id="loginDept">
                    <SelectValue placeholder="Select your department" />
                  </SelectTrigger>
                  <SelectContent>
                    {DEPARTMENTS.map((d) => (
                      <SelectItem key={d.value} value={d.value}>
                        {d.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {loginError && (
                <Alert variant="destructive">
                  <AlertDescription>{loginError}</AlertDescription>
                </Alert>
              )}

              <Button type="submit" className="w-full" disabled={doctorLogin.isPending}>
                {doctorLogin.isPending ? 'Logging in...' : 'Login'}
              </Button>
            </form>
          ) : (
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="regName">Full Name</Label>
                <Input
                  id="regName"
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  placeholder="Dr. Jane Doe"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="regDept">Department</Label>
                <Select value={regDepartment} onValueChange={(v) => setRegDepartment(v as Department)}>
                  <SelectTrigger id="regDept">
                    <SelectValue placeholder="Select your department" />
                  </SelectTrigger>
                  <SelectContent>
                    {DEPARTMENTS.map((d) => (
                      <SelectItem key={d.value} value={d.value}>
                        {d.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="regCode">Registration Code</Label>
                <div className="relative">
                  <Input
                    id="regCode"
                    type={showRegCode ? 'text' : 'password'}
                    value={regCode}
                    onChange={(e) => setRegCode(e.target.value)}
                    placeholder="Enter registration code"
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowRegCode(!showRegCode)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showRegCode ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <p className="text-xs text-muted-foreground">
                  A valid registration code is required to register as a doctor.
                </p>
              </div>

              {regError && (
                <Alert variant="destructive">
                  <AlertDescription>{regError}</AlertDescription>
                </Alert>
              )}
              {regSuccess && (
                <Alert>
                  <AlertDescription className="text-green-700">{regSuccess}</AlertDescription>
                </Alert>
              )}

              <Button type="submit" className="w-full" disabled={registerDoctor.isPending}>
                {registerDoctor.isPending ? 'Registering...' : 'Register as Doctor'}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
