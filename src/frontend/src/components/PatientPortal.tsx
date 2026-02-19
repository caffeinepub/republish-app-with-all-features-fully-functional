import { EmergencySOS } from './EmergencySOS';
import { SymptomChecker } from './SymptomChecker';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export function PatientPortal() {
  return (
    <div className="container mx-auto px-6 py-10">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h2 className="text-3xl font-bold tracking-tight mb-2">Patient Portal</h2>
          <p className="text-muted-foreground text-base">
            Submit emergency cases or check your symptoms
          </p>
        </div>

        <Tabs defaultValue="emergency" className="space-y-8">
          <TabsList className="grid w-full grid-cols-2 max-w-md h-12">
            <TabsTrigger value="emergency" className="text-base">Emergency SOS</TabsTrigger>
            <TabsTrigger value="symptoms" className="text-base">Symptom Checker</TabsTrigger>
          </TabsList>

          <TabsContent value="emergency">
            <EmergencySOS />
          </TabsContent>

          <TabsContent value="symptoms">
            <SymptomChecker />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
