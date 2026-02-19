import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity, Stethoscope, Shield, ArrowRight, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRef } from 'react';

interface RoleSelectorProps {
  onSelectRole: (role: 'patient' | 'doctor' | 'admin') => void;
  isAuthenticated: boolean;
}

export function RoleSelector({ onSelectRole, isAuthenticated }: RoleSelectorProps) {
  const rolesRef = useRef<HTMLDivElement>(null);

  const handleGetStarted = () => {
    rolesRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  return (
    <div className="container mx-auto px-6 py-16">
      <div className="max-w-5xl mx-auto">
        {/* Vitals AI Branding */}
        <div className="text-center mb-12">
          <h1 className="text-6xl font-bold tracking-tight mb-6 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Vitals AI
          </h1>
          
          {/* Introduction Section */}
          <div className="max-w-3xl mx-auto mb-10 space-y-6">
            <p className="text-lg text-muted-foreground leading-relaxed">
              Your intelligent healthcare companion powered by advanced AI technology. 
              Vitals AI revolutionizes hospital management with real-time emergency triage, 
              intelligent symptom analysis, and comprehensive medical report interpretation.
            </p>
            <div className="flex flex-wrap justify-center gap-8 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Heart className="h-5 w-5 text-primary" />
                <span>AI-Powered Emergency Triage</span>
              </div>
              <div className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-primary" />
                <span>Smart Symptom Checker</span>
              </div>
              <div className="flex items-center gap-2">
                <Stethoscope className="h-5 w-5 text-primary" />
                <span>Medical Report Analysis</span>
              </div>
            </div>
          </div>

          {/* Get Started Button */}
          <Button 
            onClick={handleGetStarted}
            size="lg"
            className="gap-2 shadow-lg hover:shadow-xl transition-all px-8 py-6 text-base"
          >
            Get Started
            <ArrowRight className="h-5 w-5" />
          </Button>
        </div>

        {/* Role Selection Cards */}
        <div ref={rolesRef} className="mt-20">
          <p className="text-center text-lg text-muted-foreground mb-10">
            Select your role to access the appropriate portal
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="border-2 border-primary/30 hover:border-primary hover:shadow-xl hover:shadow-primary/20 transition-all cursor-pointer group" onClick={() => onSelectRole('patient')}>
              <CardHeader className="text-center pb-6 pt-8">
                <div className="mx-auto mb-4 h-16 w-16 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 group-hover:scale-110 transition-all">
                  <Activity className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-2xl">Patient</CardTitle>
                <CardDescription className="text-base mt-3">
                  Submit emergency cases and check symptoms
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center pb-8">
                <Button variant="ghost" size="lg" className="gap-2">
                  Continue <ArrowRight className="h-5 w-5" />
                </Button>
              </CardContent>
            </Card>

            <Card 
              className={`border-2 border-primary/30 hover:border-primary hover:shadow-xl hover:shadow-primary/20 transition-all ${isAuthenticated ? 'cursor-pointer' : 'opacity-60'} group`}
              onClick={() => isAuthenticated && onSelectRole('doctor')}
            >
              <CardHeader className="text-center pb-6 pt-8">
                <div className="mx-auto mb-4 h-16 w-16 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 group-hover:scale-110 transition-all">
                  <Stethoscope className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-2xl">Doctor</CardTitle>
                <CardDescription className="text-base mt-3">
                  Manage cases and analyze medical reports
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center pb-8">
                {isAuthenticated ? (
                  <Button variant="ghost" size="lg" className="gap-2">
                    Continue <ArrowRight className="h-5 w-5" />
                  </Button>
                ) : (
                  <p className="text-sm text-muted-foreground">Login required</p>
                )}
              </CardContent>
            </Card>

            <Card 
              className={`border-2 border-primary/30 hover:border-primary hover:shadow-xl hover:shadow-primary/20 transition-all ${isAuthenticated ? 'cursor-pointer' : 'opacity-60'} group`}
              onClick={() => isAuthenticated && onSelectRole('admin')}
            >
              <CardHeader className="text-center pb-6 pt-8">
                <div className="mx-auto mb-4 h-16 w-16 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 group-hover:scale-110 transition-all">
                  <Shield className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-2xl">Admin</CardTitle>
                <CardDescription className="text-base mt-3">
                  View statistics and manage hospital operations
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center pb-8">
                {isAuthenticated ? (
                  <Button variant="ghost" size="lg" className="gap-2">
                    Continue <ArrowRight className="h-5 w-5" />
                  </Button>
                ) : (
                  <p className="text-sm text-muted-foreground">Login required</p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
