import React, { useState } from 'react';
import { User, AlertTriangle, Brain, CheckCircle, Loader2, AlertCircle, ArrowLeft } from 'lucide-react';
import { useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useCreateEmergencyCase, getFriendlyErrorMessage } from '../hooks/useQueries';
import { Severity } from '../backend';
import SymptomChecker from './SymptomChecker';

export default function PatientPortal() {
  const navigate = useNavigate();

  // Registration state
  const [patientName, setPatientName] = useState('');
  const [patientAge, setPatientAge] = useState('');
  const [patientContact, setPatientContact] = useState('');
  const [isRegistered, setIsRegistered] = useState(false);
  const [regError, setRegError] = useState('');

  // SOS state
  const [sosName, setSosName] = useState('');
  const [sosCondition, setSosCondition] = useState('');
  const [sosSeverity, setSosSeverity] = useState<Severity | ''>('');
  const [sosSuccess, setSosSuccess] = useState(false);
  const [sosError, setSosError] = useState('');

  const createEmergencyCase = useCreateEmergencyCase();

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientName.trim()) {
      setRegError('Please enter your name.');
      return;
    }
    setRegError('');
    setIsRegistered(true);
    setSosName(patientName.trim());
  };

  const handleSOS = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sosName.trim() || !sosCondition.trim() || !sosSeverity) return;
    setSosError('');
    setSosSuccess(false);

    try {
      await createEmergencyCase.mutateAsync({
        patientName: sosName.trim(),
        condition: sosCondition.trim(),
        severity: sosSeverity as Severity,
      });
      setSosSuccess(true);
      setSosCondition('');
      setSosSeverity('');
    } catch (err: unknown) {
      setSosError(getFriendlyErrorMessage(err));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-background p-4 md:p-8">
      <div className="max-w-3xl mx-auto">
        {/* Back nav */}
        <button
          onClick={() => navigate({ to: '/select-role' })}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-teal-600 dark:text-muted-foreground dark:hover:text-teal-400 mb-6 transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          Back to Role Selection
        </button>

        {/* Header */}
        <div className="mb-6 flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-teal-700 rounded-xl flex items-center justify-center shadow-sm">
            <User className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 dark:text-foreground font-heading">
              Patient Portal
            </h1>
            <p className="text-gray-500 dark:text-muted-foreground text-sm">Vitals AI — Your Health, Our Priority</p>
          </div>
        </div>

        {/* Registration */}
        {!isRegistered ? (
          <Card className="border-0 shadow-md dark:bg-card rounded-2xl overflow-hidden mb-6">
            <div className="h-1 bg-gradient-to-r from-teal-500 to-emerald-500" />
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-foreground">
                <User className="w-5 h-5 text-teal-600" />
                Patient Registration
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="patientName">Full Name *</Label>
                    <Input
                      id="patientName"
                      value={patientName}
                      onChange={(e) => setPatientName(e.target.value)}
                      placeholder="Enter your full name"
                      className="border-gray-200 dark:border-border focus:border-teal-500 rounded-lg"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="patientAge">Age</Label>
                    <Input
                      id="patientAge"
                      type="number"
                      value={patientAge}
                      onChange={(e) => setPatientAge(e.target.value)}
                      placeholder="Enter your age"
                      className="border-gray-200 dark:border-border focus:border-teal-500 rounded-lg"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="patientContact">Contact Number</Label>
                  <Input
                    id="patientContact"
                    value={patientContact}
                    onChange={(e) => setPatientContact(e.target.value)}
                    placeholder="Enter your contact number"
                    className="border-gray-200 dark:border-border focus:border-teal-500 rounded-lg"
                  />
                </div>
                {regError && (
                  <div className="flex items-center gap-2 text-red-600 text-sm">
                    <AlertCircle className="w-4 h-4" />
                    {regError}
                  </div>
                )}
                <Button type="submit" className="w-full bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-semibold">
                  Register & Continue
                </Button>
              </form>
            </CardContent>
          </Card>
        ) : (
          <div className="flex items-center gap-3 mb-6 p-4 bg-teal-50 dark:bg-teal-900/20 border border-teal-200 dark:border-teal-800 rounded-xl">
            <CheckCircle className="w-5 h-5 text-teal-600 flex-shrink-0" />
            <div>
              <p className="font-semibold text-teal-800 dark:text-teal-300">Welcome, {patientName}!</p>
              <p className="text-sm text-teal-600 dark:text-teal-400">You are registered. Use the tabs below to access services.</p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsRegistered(false)}
              className="ml-auto text-teal-600 hover:text-teal-700 dark:text-teal-400"
            >
              Edit
            </Button>
          </div>
        )}

        {/* Tabs */}
        <Tabs defaultValue="sos">
          <TabsList className="mb-4 bg-white dark:bg-card border border-gray-200 dark:border-border rounded-xl p-1 shadow-sm">
            <TabsTrigger
              value="sos"
              className="rounded-lg font-semibold data-[state=active]:bg-teal-600 data-[state=active]:text-white"
            >
              <AlertTriangle className="w-4 h-4 mr-1.5" />
              Emergency SOS
            </TabsTrigger>
            <TabsTrigger
              value="symptoms"
              className="rounded-lg font-semibold data-[state=active]:bg-teal-600 data-[state=active]:text-white"
            >
              <Brain className="w-4 h-4 mr-1.5" />
              Symptom Checker
            </TabsTrigger>
          </TabsList>

          {/* SOS Tab */}
          <TabsContent value="sos">
            <Card className="border-0 shadow-md dark:bg-card rounded-2xl overflow-hidden">
              <div className="h-1 bg-gradient-to-r from-red-500 to-orange-500" />
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-red-600">
                  <AlertTriangle className="w-5 h-5" />
                  Emergency SOS
                </CardTitle>
                <p className="text-sm text-gray-500 dark:text-muted-foreground">
                  Submit an emergency alert. A doctor will be assigned to your case immediately.
                </p>
              </CardHeader>
              <CardContent>
                {sosSuccess ? (
                  <div className="flex flex-col items-center gap-3 py-10 text-center">
                    <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-8 h-8 text-green-500" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-foreground">SOS Submitted!</h3>
                    <p className="text-gray-500 dark:text-muted-foreground text-sm max-w-sm">
                      Your emergency case has been created. A doctor will be assigned to you shortly. Please stay calm.
                    </p>
                    <Button
                      onClick={() => setSosSuccess(false)}
                      variant="outline"
                      className="border-teal-500 text-teal-700 hover:bg-teal-50 dark:text-teal-400 mt-2 rounded-lg"
                    >
                      Submit Another
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleSOS} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="sosName">Patient Name *</Label>
                      <Input
                        id="sosName"
                        value={sosName}
                        onChange={(e) => setSosName(e.target.value)}
                        placeholder="Your full name"
                        className="border-gray-200 dark:border-border focus:border-teal-500 rounded-lg"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="sosCondition">Describe Your Condition *</Label>
                      <Textarea
                        id="sosCondition"
                        value={sosCondition}
                        onChange={(e) => setSosCondition(e.target.value)}
                        placeholder="Describe your symptoms or emergency situation..."
                        rows={3}
                        className="border-gray-200 dark:border-border focus:border-teal-500 rounded-lg resize-none"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="sosSeverity">Severity Level *</Label>
                      <Select value={sosSeverity} onValueChange={(v) => setSosSeverity(v as Severity)}>
                        <SelectTrigger className="border-gray-200 dark:border-border focus:border-teal-500 rounded-lg">
                          <SelectValue placeholder="Select severity" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value={Severity.low}>🟢 Low — Minor discomfort</SelectItem>
                          <SelectItem value={Severity.medium}>🟡 Medium — Moderate symptoms</SelectItem>
                          <SelectItem value={Severity.high}>🟠 High — Serious condition</SelectItem>
                          <SelectItem value={Severity.critical}>🔴 Critical — Life threatening</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {sosError && (
                      <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{sosError}</AlertDescription>
                      </Alert>
                    )}

                    <Button
                      type="submit"
                      disabled={!sosName.trim() || !sosCondition.trim() || !sosSeverity || createEmergencyCase.isPending}
                      className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg"
                    >
                      {createEmergencyCase.isPending ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        <>
                          <AlertTriangle className="w-4 h-4 mr-2" />
                          Send Emergency SOS
                        </>
                      )}
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Symptom Checker Tab */}
          <TabsContent value="symptoms">
            <SymptomChecker />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
