import React, { useState } from 'react';
import { Stethoscope, LogOut, Eye, EyeOff, AlertCircle } from 'lucide-react';
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

  // Toggle error state
  const [toggleError, setToggleError] = useState('');

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
    setToggleError('');
    try {
      const updated = await toggleAvailability.mutateAsync(loggedInDoctor.id);
      // Immediately update local state with the returned doctor object
      setLoggedInDoctor(updated);
    } catch (err) {
      setToggleError(getFriendlyErrorMessage(err));
    }
  };

  const handleLogout = () => {
    setLoggedInDoctor(null);
    setLoginName('');
    setLoginDepartment('');
    setLoginError('');
    setToggleError('');
  };

  // Logged-in doctor dashboard
  if (loggedInDoctor) {
    const deptLabel =
      ALL_DISPLAY_DEPARTMENTS.find((d) => d.value === loggedInDoctor.department)?.label ??
      loggedInDoctor.department;

    const isAvailable = loggedInDoctor.available;

    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-6">
          {/* Header bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Stethoscope className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Dr. {loggedInDoctor.name}</h1>
                <p className="text-sm text-muted-foreground">{deptLabel}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              {/* Availability toggle button */}
              <button
                onClick={handleToggleAvailability}
                disabled={toggleAvailability.isPending}
                className={`
                  relative inline-flex items-center gap-2 px-4 py-2 rounded-full font-semibold text-sm
                  border-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2
                  disabled:opacity-60 disabled:cursor-not-allowed
                  ${isAvailable
                    ? 'bg-green-50 border-green-400 text-green-700 hover:bg-green-100 focus:ring-green-400'
                    : 'bg-red-50 border-red-400 text-red-700 hover:bg-red-100 focus:ring-red-400'
                  }
                `}
                aria-label={`Status: ${isAvailable ? 'Available' : 'Busy'}. Click to toggle.`}
              >
                {/* Toggle track */}
                <span
                  className={`
                    relative inline-flex w-10 h-5 rounded-full transition-colors duration-200
                    ${isAvailable ? 'bg-green-400' : 'bg-red-400'}
                  `}
                >
                  <span
                    className={`
                      absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform duration-200
                      ${isAvailable ? 'translate-x-5' : 'translate-x-0'}
                    `}
                  />
                </span>
                {toggleAvailability.isPending
                  ? 'Updating...'
                  : isAvailable
                  ? 'Available'
                  : 'Busy'}
              </button>

              <Button variant="outline" size="sm" onClick={handleLogout} className="flex items-center gap-1">
                <LogOut className="w-4 h-4" />
                Logout
              </Button>
            </div>
          </div>

          {/* Toggle error */}
          {toggleError && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="w-4 h-4" />
              <AlertDescription>{toggleError}</AlertDescription>
            </Alert>
          )}

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
                    aria-label={showRegCode ? 'Hide code' : 'Show code'}
                  >
                    {showRegCode ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
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
                {registerDoctor.isPending ? 'Registering...' : 'Register'}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
