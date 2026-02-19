import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertCircle, Loader2 } from 'lucide-react';
import { useCreateEmergency } from '../hooks/useQueries';
import { Department } from '../backend';
import { Alert, AlertDescription } from '@/components/ui/alert';

export function EmergencySOS() {
  const [patientName, setPatientName] = useState('');
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [zip, setZip] = useState('');
  const [description, setDescription] = useState('');
  const [department, setDepartment] = useState<Department | ''>('');
  const [submitted, setSubmitted] = useState(false);

  const createEmergency = useCreateEmergency();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!patientName || !street || !city || !zip || !description || !department) {
      return;
    }

    const patientId = `patient-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const emergencyId = `emergency-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    await createEmergency.mutateAsync({
      patient: {
        id: patientId,
        name: patientName,
        address: { street, city, zip },
      },
      emergency: {
        id: emergencyId,
        patientId,
        description,
        department: department as Department,
      },
    });

    setSubmitted(true);
    setPatientName('');
    setStreet('');
    setCity('');
    setZip('');
    setDescription('');
    setDepartment('');

    setTimeout(() => setSubmitted(false), 5000);
  };

  const departmentOptions = [
    { value: Department.emergency, label: 'Emergency' },
    { value: Department.cardiology, label: 'Cardiology' },
    { value: Department.neurology, label: 'Neurology' },
    { value: Department.pediatrics, label: 'Pediatrics' },
    { value: Department.orthopedics, label: 'Orthopedics' },
    { value: Department.generalMedicine, label: 'General Medicine' },
  ];

  return (
    <Card className="border-2 border-primary/20">
      <CardHeader className="space-y-2 pb-6">
        <CardTitle className="text-2xl">Emergency SOS</CardTitle>
        <CardDescription className="text-base">
          Submit your emergency case for immediate medical assistance
        </CardDescription>
      </CardHeader>
      <CardContent>
        {submitted && (
          <Alert className="mb-6 bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800">
            <AlertCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
            <AlertDescription className="text-sm text-green-800 dark:text-green-200">
              Emergency case submitted successfully! Our team has been notified.
            </AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="patientName" className="text-sm font-medium">Patient Name *</Label>
            <Input
              id="patientName"
              value={patientName}
              onChange={(e) => setPatientName(e.target.value)}
              placeholder="Enter patient's full name"
              required
              className="h-11"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="street" className="text-sm font-medium">Street Address *</Label>
              <Input
                id="street"
                value={street}
                onChange={(e) => setStreet(e.target.value)}
                placeholder="123 Main St"
                required
                className="h-11"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="city" className="text-sm font-medium">City *</Label>
              <Input
                id="city"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="City name"
                required
                className="h-11"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="zip" className="text-sm font-medium">ZIP Code *</Label>
            <Input
              id="zip"
              value={zip}
              onChange={(e) => setZip(e.target.value)}
              placeholder="12345"
              required
              className="h-11"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="department" className="text-sm font-medium">Department *</Label>
            <Select value={department} onValueChange={(value) => setDepartment(value as Department)}>
              <SelectTrigger id="department" className="h-11">
                <SelectValue placeholder="Select medical department" />
              </SelectTrigger>
              <SelectContent>
                {departmentOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium">Emergency Description *</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the emergency situation in detail..."
              rows={5}
              required
            />
          </div>

          <Button
            type="submit"
            className="w-full h-12 text-base"
            disabled={createEmergency.isPending || !patientName || !street || !city || !zip || !description || !department}
          >
            {createEmergency.isPending ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Submitting...
              </>
            ) : (
              'Submit Emergency Case'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
