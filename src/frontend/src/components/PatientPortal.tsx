import { EmergencySOS } from './EmergencySOS';
import { SymptomChecker } from './SymptomChecker';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export function PatientPortal() {
  return (
    <div className="container mx-auto px-6 py-10 animate-in fade-in duration-500">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h2 className="text-4xl font-bold tracking-tight mb-3 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Patient Portal
          </h2>
          <p className="text-muted-foreground text-lg">
            Submit emergency cases or check your symptoms with AI assistance
          </p>
        </div>

        <Tabs defaultValue="emergency" className="space-y-8">
          <TabsList className="grid w-full grid-cols-2 max-w-md h-14 bg-muted/50 border-2 border-primary/20">
            <TabsTrigger value="emergency" className="text-base font-medium data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all">
              Emergency SOS
            </TabsTrigger>
            <TabsTrigger value="symptoms" className="text-base font-medium data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all">
              Symptom Checker
            </TabsTrigger>
          </TabsList>

          <TabsContent value="emergency" className="animate-in fade-in slide-in-from-bottom duration-500">
            <EmergencySOS />
          </TabsContent>

          <TabsContent value="symptoms" className="animate-in fade-in slide-in-from-bottom duration-500">
            <SymptomChecker />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
