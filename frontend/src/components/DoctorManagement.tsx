import React, { useState } from 'react';
import { UserPlus, Stethoscope, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
import { useGetAllDoctors, useRegisterDoctor, useToggleDoctorAvailability } from '@/hooks/useQueries';
import { Department } from '@/backend';
import { getFriendlyErrorMessage } from '@/hooks/useQueries';

const DEPARTMENT_LABELS: Record<string, string> = {
  [Department.emergency]: 'Emergency Medicine',
  [Department.cardiology]: 'Cardiology',
  [Department.neurology]: 'Neurology',
  [Department.pediatrics]: 'Pediatrics',
  [Department.orthopedics]: 'Orthopedics',
  [Department.generalMedicine]: 'General Medicine',
};

interface DoctorManagementProps {
  readOnly?: boolean;
}

export default function DoctorManagement({ readOnly = false }: DoctorManagementProps) {
  const { data: doctors, isLoading } = useGetAllDoctors();
  const registerDoctor = useRegisterDoctor();
  const toggleAvailability = useToggleDoctorAvailability();

  const [name, setName] = useState('');
  const [department, setDepartment] = useState<Department | ''>('');
  const [registrationCode, setRegistrationCode] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!name.trim() || !department || !registrationCode.trim()) {
      setError('Please fill in all fields.');
      return;
    }

    if (registrationCode !== '2011') {
      setError('Invalid registration code. Please enter the correct code.');
      return;
    }

    try {
      await registerDoctor.mutateAsync({
        name: name.trim(),
        department: department as Department,
        registrationCode,
      });
      setSuccess(`Dr. ${name} registered successfully!`);
      setName('');
      setDepartment('');
      setRegistrationCode('');
    } catch (err) {
      setError(getFriendlyErrorMessage(err));
    }
  };

  const handleToggle = async (doctorId: bigint) => {
    try {
      await toggleAvailability.mutateAsync(doctorId);
    } catch (err) {
      setError(getFriendlyErrorMessage(err));
    }
  };

  return (
    <div className="space-y-6">
      {/* Registration Form — hidden in read-only mode */}
      {!readOnly && (
        <Card className="border-l-4 border-r-4 border-primary">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <UserPlus className="w-5 h-5 text-primary" />
              Register New Doctor
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="doctorName">Full Name</Label>
                  <Input
                    id="doctorName"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Dr. John Smith"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="department">Department</Label>
                  <Select value={department} onValueChange={(v) => setDepartment(v as Department)}>
                    <SelectTrigger id="department">
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(DEPARTMENT_LABELS).map(([value, label]) => (
                        <SelectItem key={value} value={value}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="regCode">Registration Code</Label>
                <Input
                  id="regCode"
                  type="password"
                  value={registrationCode}
                  onChange={(e) => setRegistrationCode(e.target.value)}
                  placeholder="Enter registration code"
                />
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              {success && (
                <Alert>
                  <AlertDescription className="text-green-700">{success}</AlertDescription>
                </Alert>
              )}

              <Button type="submit" disabled={registerDoctor.isPending} className="w-full">
                {registerDoctor.isPending ? 'Registering...' : 'Register Doctor'}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Doctor List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Stethoscope className="w-5 h-5 text-primary" />
            Registered Doctors
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : !doctors || doctors.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">No doctors registered yet.</p>
          ) : (
            <div className="space-y-3">
              {doctors.map((doctor) => (
                <div
                  key={doctor.id.toString()}
                  className="flex items-center justify-between p-4 rounded-lg border border-border bg-card hover:bg-accent/5 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Stethoscope className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">{doctor.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {DEPARTMENT_LABELS[doctor.department] ?? doctor.department}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge
                      variant={doctor.available ? 'default' : 'secondary'}
                      className={doctor.available ? 'bg-green-100 text-green-700 border-green-200' : ''}
                    >
                      {doctor.available ? (
                        <span className="flex items-center gap-1">
                          <CheckCircle className="w-3 h-3" /> Available
                        </span>
                      ) : (
                        <span className="flex items-center gap-1">
                          <XCircle className="w-3 h-3" /> Unavailable
                        </span>
                      )}
                    </Badge>
                    {!readOnly && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleToggle(doctor.id)}
                        disabled={toggleAvailability.isPending}
                      >
                        Toggle
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
