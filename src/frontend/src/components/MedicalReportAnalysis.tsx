import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, FileText, AlertTriangle, Info } from 'lucide-react';
import { useAnalyzeMedicalReport } from '../hooks/useQueries';
import { Badge } from '@/components/ui/badge';

export function MedicalReportAnalysis() {
  const [reportText, setReportText] = useState('');
  const analyzeMedicalReport = useAnalyzeMedicalReport();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportText.trim()) return;

    await analyzeMedicalReport.mutateAsync(reportText);
  };

  const getSeverityColor = (severity: string) => {
    const lower = severity.toLowerCase();
    if (lower === 'urgent') return 'destructive';
    if (lower === 'attention') return 'default';
    return 'secondary';
  };

  return (
    <Card className="border-4 border-primary/30 shadow-xl hover:shadow-2xl hover:shadow-primary/20 transition-all duration-300">
      <CardHeader className="space-y-2 pb-6">
        <CardTitle className="text-3xl font-bold flex items-center gap-3">
          <FileText className="h-8 w-8" />
          Medical Report Analysis
        </CardTitle>
        <CardDescription className="text-base">
          Analyze patient medical reports to detect severity and key findings
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="reportText" className="text-sm font-medium">Medical Report / Lab Results</Label>
            <Textarea
              id="reportText"
              value={reportText}
              onChange={(e) => setReportText(e.target.value)}
              placeholder="Paste medical report text, lab results, or patient examination notes here..."
              rows={8}
              className="font-mono text-sm transition-all focus:ring-2 focus:ring-primary focus:scale-[1.01]"
            />
          </div>

          <Button
            type="submit"
            disabled={analyzeMedicalReport.isPending || !reportText.trim()}
            className="w-full h-14 text-base font-semibold transition-all hover:scale-105 shadow-lg hover:shadow-xl"
          >
            {analyzeMedicalReport.isPending ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Analyzing Report...
              </>
            ) : (
              'Analyze Report'
            )}
          </Button>
        </form>

        {analyzeMedicalReport.isSuccess && analyzeMedicalReport.data && (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom duration-500">
            <Card className="bg-muted/50 border-2 border-primary/20 hover:border-primary/40 transition-all duration-300 hover:shadow-lg">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Analysis Results
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm font-semibold mb-2">Summary:</p>
                  <p className="text-sm text-muted-foreground mb-4">{analyzeMedicalReport.data.summary}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold mb-3">Severity Classification:</p>
                  <Badge variant={getSeverityColor(analyzeMedicalReport.data.severity)} className="text-sm font-medium px-4 py-1 capitalize">
                    {analyzeMedicalReport.data.severity}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm font-semibold mb-3">Key Findings:</p>
                  <ul className="list-disc list-inside space-y-2">
                    {analyzeMedicalReport.data.findings.map((finding, idx) => (
                      <li key={idx} className="text-sm text-muted-foreground">{finding}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="text-sm font-semibold mb-3">Recommended Actions:</p>
                  <ul className="list-disc list-inside space-y-2">
                    {analyzeMedicalReport.data.recommendations.map((action, idx) => (
                      <li key={idx} className="text-sm text-muted-foreground">{action}</li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
            <Alert className="border-2">
              <Info className="h-5 w-5" />
              <AlertDescription className="text-sm">
                This AI analysis is for informational purposes only and should not replace professional medical judgment. Always verify findings with qualified healthcare professionals.
              </AlertDescription>
            </Alert>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
