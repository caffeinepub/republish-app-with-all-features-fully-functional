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

  return (
    <Card className="border-2 border-primary/20">
      <CardHeader className="space-y-2 pb-6">
        <CardTitle className="text-2xl">AI Symptom Checker</CardTitle>
        <CardDescription className="text-base">
          Describe your symptoms and get AI-powered suggestions
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Alert className="bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
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
            />
          </div>

          <Button
            type="submit"
            disabled={analyzeSymptoms.isPending || !symptoms.trim()}
            className="w-full h-12 text-base"
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
          <div className="space-y-4">
            {analyzeSymptoms.data.analysis.map((condition, index) => (
              <Card key={index} className="bg-muted/50 border-2 border-primary/10">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <AlertCircle className="h-5 w-5" />
                    {condition.condition}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-3">
                    <Badge variant="outline" className="text-sm">Probability: {condition.probability}</Badge>
                    <Badge variant={condition.severity === 'High' ? 'destructive' : condition.severity === 'Moderate' ? 'default' : 'secondary'} className="text-sm">
                      Severity: {condition.severity}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm font-medium mb-3">Recommendations:</p>
                    <ul className="list-disc list-inside space-y-2">
                      {condition.recommendations.map((rec, idx) => (
                        <li key={idx} className="text-sm text-muted-foreground">{rec}</li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            ))}
            <Alert>
              <Info className="h-5 w-5" />
              <AlertDescription className="text-sm">
                {analyzeSymptoms.data.disclaimer}
              </AlertDescription>
            </Alert>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
