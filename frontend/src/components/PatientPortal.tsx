import React, { useState } from 'react';
import { useSubmitCase } from '../hooks/useQueries';
import { Department, Severity } from '../backend';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertTriangle, CheckCircle, Loader2, User, Stethoscope, Siren } from 'lucide-react';
import SymptomChecker from './SymptomChecker';

const DEPARTMENTS: { value: Department; label: string }[] = [
  { value: Department.emergency, label: 'Emergency' },
  { value: Department.cardiology, label: 'Cardiology' },
  { value: Department.neurology, label: 'Neurology' },
  { value: Department.pediatrics, label: 'Pediatrics' },
  { value: Department.orthopedics, label: 'Orthopedics' },
  { value: Department.generalMedicine, label: 'General Medicine' },
];

function CaseRegistrationForm() {
  const submitCase = useSubmitCase();
  const [name, setName] = useState('');
  const [details, setDetails] = useState('');
  const [condition, setCondition] = useState('');
  const [department, setDepartment] = useState<Department | ''>('');
  const [severity, setSeverity] = useState<Severity | ''>('');
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (!name.trim()) { setError('Please enter your full name.'); return; }
    if (!condition.trim()) { setError('Please describe your condition/symptoms.'); return; }
    if (!department) { setError('Please select a department.'); return; }
    if (!severity) { setError('Please select a severity level.'); return; }

    try {
      await submitCase.mutateAsync({
        patientName: name.trim(),
        patientDetails: details.trim(),
        condition: condition.trim(),
        caseType: department as Department,
        severity: severity as Severity,
      });
      setSuccess(true);
      setName('');
      setDetails('');
      setCondition('');
      setDepartment('');
      setSeverity('');
    } catch (err: any) {
      setError('Failed to submit case. Please try again.');
    }
  };

  return (
    <Card className="glass-card border-primary/20">
      <CardHeader>
        <CardTitle className="text-foreground flex items-center gap-2">
          <User className="w-5 h-5 text-primary" />
          Register Your Case
        </CardTitle>
        <CardDescription>Fill in your details and we'll connect you with the right doctor</CardDescription>
      </CardHeader>
      <CardContent>
        {success ? (
          <div className="space-y-4">
            <Alert className="border-green-500/30 bg-green-500/10">
              <CheckCircle className="w-4 h-4 text-green-400" />
              <AlertDescription className="text-green-400">
                Your case has been submitted successfully! A doctor will review it shortly.
              </AlertDescription>
            </Alert>
            <Button className="w-full" onClick={() => setSuccess(false)}>
              Submit Another Case
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="patientName" className="text-foreground">Full Name *</Label>
              <Input
                id="patientName"
                placeholder="Your full name"
                value={name}
                onChange={e => setName(e.target.value)}
                className="bg-muted/50 border-border"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="condition" className="text-foreground">Condition / Symptoms *</Label>
              <Input
                id="condition"
                placeholder="e.g. Chest pain, difficulty breathing"
                value={condition}
                onChange={e => setCondition(e.target.value)}
                className="bg-muted/50 border-border"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="details" className="text-foreground">Additional Details</Label>
              <Textarea
                id="details"
                placeholder="Any additional information about your condition..."
                value={details}
                onChange={e => setDetails(e.target.value)}
                className="bg-muted/50 border-border resize-none"
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-foreground">Department *</Label>
                <Select value={department} onValueChange={v => setDepartment(v as Department)}>
                  <SelectTrigger className="bg-muted/50 border-border">
                    <SelectValue placeholder="Select dept." />
                  </SelectTrigger>
                  <SelectContent>
                    {DEPARTMENTS.map(d => (
                      <SelectItem key={d.value} value={d.value}>{d.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-foreground">Severity *</Label>
                <Select value={severity} onValueChange={v => setSeverity(v as Severity)}>
                  <SelectTrigger className="bg-muted/50 border-border">
                    <SelectValue placeholder="Select severity" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertTriangle className="w-4 h-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button type="submit" className="w-full" disabled={submitCase.isPending}>
              {submitCase.isPending ? (
                <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Submitting...</>
              ) : 'Submit Case'}
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  );
}

function EmergencySOSForm() {
  const submitCase = useSubmitCase();
  const [name, setName] = useState('');
  const [condition, setCondition] = useState('');
  const [department, setDepartment] = useState<Department | ''>('');
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [isActivating, setIsActivating] = useState(false);

  const handleSOS = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (!name.trim()) { setError('Please enter your name.'); return; }
    if (!condition.trim()) { setError('Please describe your emergency.'); return; }
    if (!department) { setError('Please select the relevant department.'); return; }

    setIsActivating(true);
    try {
      await submitCase.mutateAsync({
        patientName: name.trim(),
        patientDetails: 'EMERGENCY SOS — Immediate attention required',
        condition: condition.trim(),
        caseType: department as Department,
        severity: Severity.critical,
      });
      setSuccess(true);
      setName('');
      setCondition('');
      setDepartment('');
    } catch (err: any) {
      setError('Failed to send SOS. Please try again or call emergency services.');
    } finally {
      setIsActivating(false);
    }
  };

  return (
    <Card className="glass-card border-red-500/40 bg-red-500/5">
      <CardHeader>
        <CardTitle className="text-red-400 flex items-center gap-2">
          <Siren className="w-5 h-5 animate-pulse" />
          Emergency SOS
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          For life-threatening emergencies. Your alert will be sent immediately to the relevant department doctor.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {success ? (
          <div className="space-y-4">
            <Alert className="border-red-500/30 bg-red-500/10">
              <Siren className="w-4 h-4 text-red-400" />
              <AlertDescription className="text-red-400 font-semibold">
                🚨 SOS Alert Sent! Medical staff have been notified. Help is on the way.
              </AlertDescription>
            </Alert>
            <p className="text-sm text-muted-foreground text-center">
              If this is a life-threatening emergency, also call <strong>112</strong> or your local emergency number.
            </p>
            <Button
              variant="outline"
              className="w-full border-red-500/40 text-red-400 hover:bg-red-500/10"
              onClick={() => setSuccess(false)}
            >
              Send Another SOS
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSOS} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="sosName" className="text-foreground">Your Name *</Label>
              <Input
                id="sosName"
                placeholder="Your full name"
                value={name}
                onChange={e => setName(e.target.value)}
                className="bg-muted/50 border-red-500/30 focus:border-red-500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sosCondition" className="text-foreground">Emergency Description *</Label>
              <Input
                id="sosCondition"
                placeholder="e.g. Severe chest pain, unconscious patient"
                value={condition}
                onChange={e => setCondition(e.target.value)}
                className="bg-muted/50 border-red-500/30 focus:border-red-500"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-foreground">Department *</Label>
              <Select value={department} onValueChange={v => setDepartment(v as Department)}>
                <SelectTrigger className="bg-muted/50 border-red-500/30">
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  {DEPARTMENTS.map(d => (
                    <SelectItem key={d.value} value={d.value}>{d.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertTriangle className="w-4 h-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button
              type="submit"
              className="w-full bg-red-600 hover:bg-red-700 text-white font-bold text-lg py-6"
              disabled={submitCase.isPending || isActivating}
            >
              {submitCase.isPending || isActivating ? (
                <><Loader2 className="w-5 h-5 mr-2 animate-spin" />Sending SOS...</>
              ) : (
                <><Siren className="w-5 h-5 mr-2" />🚨 SEND EMERGENCY SOS</>
              )}
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  );
}

export default function PatientPortal() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center mx-auto mb-4">
            <Stethoscope className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-foreground">Patient Portal</h1>
          <p className="text-muted-foreground mt-2">Register your case or send an emergency alert</p>
        </div>

        <Tabs defaultValue="register" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="register">Register Case</TabsTrigger>
            <TabsTrigger value="sos" className="text-red-400 data-[state=active]:text-red-400">
              🚨 SOS
            </TabsTrigger>
            <TabsTrigger value="symptoms">Symptom Check</TabsTrigger>
          </TabsList>

          <TabsContent value="register">
            <CaseRegistrationForm />
          </TabsContent>

          <TabsContent value="sos">
            <EmergencySOSForm />
          </TabsContent>

          <TabsContent value="symptoms">
            <SymptomChecker />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
