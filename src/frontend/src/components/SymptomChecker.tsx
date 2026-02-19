import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, AlertCircle, Info } from 'lucide-react';
import { useAnalyzeSymptoms } from '../hooks/useQueries';
import { Badge } from '@/components/ui/badge';

export function SymptomChecker() {
  const [symptoms, setSymptoms] = useState('');
  const analyzeSymptoms = useAnalyzeSymptoms();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!symptoms.trim()) return;

    await analyzeSymptoms.mutateAsync(symptoms);
  };

  const getSeverityVariant = (severity: string) => {
    if (severity === 'high') return 'destructive';
    if (severity === 'medium') return 'default';
    return 'secondary';
  };

  return (
    <Card className="border-4 border-primary/30 shadow-xl hover:shadow-2xl hover:shadow-primary/20 transition-all duration-300">
      <CardHeader className="space-y-2 pb-6">
        <CardTitle className="text-3xl font-bold">AI Symptom Checker</CardTitle>
        <CardDescription className="text-base">
          Describe your symptoms and get AI-powered suggestions
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Alert className="bg-blue-50 dark:bg-blue-950 border-2 border-blue-200 dark:border-blue-800">
          <Info className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          <AlertDescription className="text-sm text-blue-800 dark:text-blue-200">
            This is for informational purposes only and not a medical diagnosis. Please consult a healthcare professional for proper medical advice.
          </AlertDescription>
        </Alert>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="symptoms" className="text-sm font-medium">Describe Your Symptoms</Label>
            <Textarea
              id="symptoms"
              value={symptoms}
              onChange={(e) => setSymptoms(e.target.value)}
              placeholder="Example: I have a headache, fever, and sore throat for the past 2 days..."
              rows={6}
              className="transition-all focus:ring-2 focus:ring-primary focus:scale-[1.01]"
            />
          </div>

          <Button
            type="submit"
            disabled={analyzeSymptoms.isPending || !symptoms.trim()}
            className="w-full h-14 text-base font-semibold transition-all hover:scale-105 shadow-lg hover:shadow-xl"
          >
            {analyzeSymptoms.isPending ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Analyzing Symptoms...
              </>
            ) : (
              'Analyze Symptoms'
            )}
          </Button>
        </form>

        {analyzeSymptoms.isSuccess && analyzeSymptoms.data && (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom duration-500">
            <Card className="bg-muted/50 border-2 border-primary/20 hover:border-primary/40 transition-all duration-300 hover:shadow-lg">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg flex items-center gap-2">
                  <AlertCircle className="h-5 w-5" />
                  {analyzeSymptoms.data.diagnosis}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-3">
                  <Badge variant={getSeverityVariant(analyzeSymptoms.data.severity)} className="text-sm font-medium capitalize">
                    Severity: {analyzeSymptoms.data.severity}
                  </Badge>
                  <Badge variant="outline" className="text-sm font-medium">
                    Confidence: {Math.round(analyzeSymptoms.data.confidence * 100)}%
                  </Badge>
                </div>
                <div>
                  <p className="text-sm font-semibold mb-3">Recommendations:</p>
                  <ul className="list-disc list-inside space-y-2">
                    {analyzeSymptoms.data.recommendations.map((rec, idx) => (
                      <li key={idx} className="text-sm text-muted-foreground">{rec}</li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
            <Alert className="border-2">
              <Info className="h-5 w-5" />
              <AlertDescription className="text-sm">
                This AI analysis is for informational purposes only. Always consult with a qualified healthcare professional for proper medical diagnosis and treatment.
              </AlertDescription>
            </Alert>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
