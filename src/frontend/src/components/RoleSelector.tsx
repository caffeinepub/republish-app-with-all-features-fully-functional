import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity, Stethoscope, Shield, ArrowRight, Heart, Zap, Brain, Users, FileText, Clock, TrendingUp, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

interface RoleSelectorProps {
  onSelectRole: (role: 'patient' | 'doctor' | 'admin') => void;
  isAuthenticated: boolean;
}

export function RoleSelector({ onSelectRole, isAuthenticated }: RoleSelectorProps) {
  const [showRoles, setShowRoles] = useState(false);

  const handleGetStarted = () => {
    setShowRoles(true);
  };

  return (
    <div className="container mx-auto px-6 py-16 min-h-[calc(100vh-200px)]">
      <div className="max-w-6xl mx-auto">
        {/* Vitals AI Branding - Always visible */}
        <div className="text-center mb-16">
          <div className="inline-block mb-8 relative">
            <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full animate-pulse" />
            <h1 className="relative text-7xl font-bold tracking-tight bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
              Vitals AI
            </h1>
          </div>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8 leading-relaxed">
            Your intelligent healthcare companion powered by advanced AI technology
          </p>

          {!showRoles && (
            <div className="space-y-8 animate-in fade-in duration-500">
              {/* Key Highlights Section */}
              <div className="flex flex-wrap justify-center gap-6 text-sm mb-8">
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
                  <Heart className="h-5 w-5 text-primary" />
                  <span className="font-medium">Emergency Triage</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
                  <Brain className="h-5 w-5 text-primary" />
                  <span className="font-medium">AI Symptom Analysis</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
                  <FileText className="h-5 w-5 text-primary" />
                  <span className="font-medium">Report Analysis</span>
                </div>
              </div>

              {/* Statistics/Highlights Section */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-4xl mx-auto mb-12">
                <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20">
                  <Clock className="h-8 w-8 text-primary mx-auto mb-3" />
                  <div className="text-3xl font-bold text-primary mb-1">24/7</div>
                  <div className="text-sm text-muted-foreground">Emergency Response</div>
                </div>
                <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20">
                  <Brain className="h-8 w-8 text-primary mx-auto mb-3" />
                  <div className="text-3xl font-bold text-primary mb-1">AI</div>
                  <div className="text-sm text-muted-foreground">Powered Analysis</div>
                </div>
                <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20">
                  <Users className="h-8 w-8 text-primary mx-auto mb-3" />
                  <div className="text-3xl font-bold text-primary mb-1">Multi</div>
                  <div className="text-sm text-muted-foreground">Department Support</div>
                </div>
                <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20">
                  <TrendingUp className="h-8 w-8 text-primary mx-auto mb-3" />
                  <div className="text-3xl font-bold text-primary mb-1">Real-time</div>
                  <div className="text-sm text-muted-foreground">Case Management</div>
                </div>
              </div>

              <Button 
                onClick={handleGetStarted}
                size="lg"
                className="gap-3 shadow-2xl shadow-primary/30 hover:shadow-primary/50 hover:scale-105 transition-all duration-300 px-12 py-7 text-lg font-semibold rounded-full bg-gradient-to-r from-primary to-primary/80"
              >
                Get Started
                <ArrowRight className="h-6 w-6" />
              </Button>
            </div>
          )}
        </div>

        {/* Role Selection Cards - Revealed after Get Started */}
        {showRoles && (
          <div className="space-y-16 animate-in slide-in-from-bottom duration-700">
            {/* Role Selection Cards - NOW AT THE TOP */}
            <div className="animate-in fade-in slide-in-from-bottom duration-700">
              <h2 className="text-3xl font-bold text-center mb-4">Choose Your Portal</h2>
              <p className="text-center text-muted-foreground mb-12 text-lg">
                Select your role to access the appropriate healthcare portal
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                <Card 
                  className="border-4 border-primary/30 hover:border-primary hover:shadow-2xl hover:shadow-primary/30 transition-all duration-300 hover:scale-105 cursor-pointer group"
                  onClick={() => onSelectRole('patient')}
                >
                  <CardHeader className="text-center pb-4 pt-8">
                    <div className="mx-auto mb-6 h-20 w-20 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center group-hover:from-primary/30 group-hover:to-primary/20 transition-all shadow-lg">
                      <Activity className="h-10 w-10 text-primary" />
                    </div>
                    <CardTitle className="text-2xl font-bold">Patient Portal</CardTitle>
                    <CardDescription className="text-base mt-3">
                      Access emergency services, AI symptom checker, and medical report analysis
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="text-center pb-8">
                    <Button 
                      variant="outline" 
                      className="w-full gap-2 border-2 border-primary/30 hover:bg-primary hover:text-primary-foreground transition-all"
                    >
                      Enter Portal
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>

                <Card 
                  className="border-4 border-primary/30 hover:border-primary hover:shadow-2xl hover:shadow-primary/30 transition-all duration-300 hover:scale-105 cursor-pointer group"
                  onClick={() => onSelectRole('doctor')}
                >
                  <CardHeader className="text-center pb-4 pt-8">
                    <div className="mx-auto mb-6 h-20 w-20 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center group-hover:from-primary/30 group-hover:to-primary/20 transition-all shadow-lg">
                      <Stethoscope className="h-10 w-10 text-primary" />
                    </div>
                    <CardTitle className="text-2xl font-bold">Doctor Portal</CardTitle>
                    <CardDescription className="text-base mt-3">
                      Register as a medical professional and manage assigned emergency cases
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="text-center pb-8">
                    <Button 
                      variant="outline" 
                      className="w-full gap-2 border-2 border-primary/30 hover:bg-primary hover:text-primary-foreground transition-all"
                    >
                      Enter Portal
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>

                <Card 
                  className="border-4 border-primary/30 hover:border-primary hover:shadow-2xl hover:shadow-primary/30 transition-all duration-300 hover:scale-105 cursor-pointer group"
                  onClick={() => onSelectRole('admin')}
                >
                  <CardHeader className="text-center pb-4 pt-8">
                    <div className="mx-auto mb-6 h-20 w-20 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center group-hover:from-primary/30 group-hover:to-primary/20 transition-all shadow-lg">
                      <Shield className="h-10 w-10 text-primary" />
                    </div>
                    <CardTitle className="text-2xl font-bold">Admin Portal</CardTitle>
                    <CardDescription className="text-base mt-3">
                      Manage emergency cases, assign doctors, and oversee hospital operations
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="text-center pb-8">
                    <Button 
                      variant="outline" 
                      className="w-full gap-2 border-2 border-primary/30 hover:bg-primary hover:text-primary-foreground transition-all"
                    >
                      Enter Portal
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Feature Showcase - NOW BELOW ROLE SELECTION */}
            <div className="animate-in fade-in slide-in-from-bottom duration-700 delay-150">
              <h2 className="text-3xl font-bold text-center mb-4">Comprehensive Healthcare Platform</h2>
              <p className="text-center text-muted-foreground mb-12 text-lg">
                Experience next-generation healthcare management with AI-powered tools
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card className="border-2 border-primary/30 hover:border-primary hover:shadow-xl hover:shadow-primary/20 transition-all duration-300 hover:scale-105 group">
                  <CardHeader className="pb-4">
                    <div className="h-14 w-14 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                      <Heart className="h-7 w-7 text-primary" />
                    </div>
                    <CardTitle className="text-xl">Emergency SOS System</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Rapid emergency response with instant case creation and real-time notifications to medical staff for critical situations
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-2 border-primary/30 hover:border-primary hover:shadow-xl hover:shadow-primary/20 transition-all duration-300 hover:scale-105 group">
                  <CardHeader className="pb-4">
                    <div className="h-14 w-14 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                      <Brain className="h-7 w-7 text-primary" />
                    </div>
                    <CardTitle className="text-xl">AI Symptom Checker</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Advanced AI analyzes your symptoms to provide preliminary diagnosis, severity assessment, and personalized recommendations
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-2 border-primary/30 hover:border-primary hover:shadow-xl hover:shadow-primary/20 transition-all duration-300 hover:scale-105 group">
                  <CardHeader className="pb-4">
                    <div className="h-14 w-14 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                      <FileText className="h-7 w-7 text-primary" />
                    </div>
                    <CardTitle className="text-xl">Medical Report Analysis</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Automated interpretation of lab results and medical reports with AI-powered insights and severity classification
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-2 border-primary/30 hover:border-primary hover:shadow-xl hover:shadow-primary/20 transition-all duration-300 hover:scale-105 group">
                  <CardHeader className="pb-4">
                    <div className="h-14 w-14 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                      <Zap className="h-7 w-7 text-primary" />
                    </div>
                    <CardTitle className="text-xl">Intelligent Triage</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Smart prioritization of emergency cases based on severity, ensuring critical patients receive immediate attention
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-2 border-primary/30 hover:border-primary hover:shadow-xl hover:shadow-primary/20 transition-all duration-300 hover:scale-105 group">
                  <CardHeader className="pb-4">
                    <div className="h-14 w-14 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                      <Users className="h-7 w-7 text-primary" />
                    </div>
                    <CardTitle className="text-xl">Smart Doctor Allocation</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Automated assignment of cases to appropriate specialists based on department expertise and availability
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-2 border-primary/30 hover:border-primary hover:shadow-xl hover:shadow-primary/20 transition-all duration-300 hover:scale-105 group">
                  <CardHeader className="pb-4">
                    <div className="h-14 w-14 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                      <Activity className="h-7 w-7 text-primary" />
                    </div>
                    <CardTitle className="text-xl">Real-time Monitoring</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Live tracking of emergency cases, patient status updates, and instant communication between medical teams
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-2 border-primary/30 hover:border-primary hover:shadow-xl hover:shadow-primary/20 transition-all duration-300 hover:scale-105 group">
                  <CardHeader className="pb-4">
                    <div className="h-14 w-14 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                      <Shield className="h-7 w-7 text-primary" />
                    </div>
                    <CardTitle className="text-xl">Admin Dashboard</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Comprehensive management tools for overseeing hospital operations, doctor assignments, and emergency case workflows
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-2 border-primary/30 hover:border-primary hover:shadow-xl hover:shadow-primary/20 transition-all duration-300 hover:scale-105 group">
                  <CardHeader className="pb-4">
                    <div className="h-14 w-14 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                      <CheckCircle className="h-7 w-7 text-primary" />
                    </div>
                    <CardTitle className="text-xl">Multi-Department Support</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Seamless coordination across Emergency, Cardiology, Neurology, Pediatrics, Orthopedics, and General Medicine departments
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
