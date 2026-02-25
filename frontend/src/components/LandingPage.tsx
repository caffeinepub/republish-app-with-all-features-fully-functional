import React from 'react';
import { useNavigate } from '@tanstack/react-router';
import {
  Activity,
  ArrowRight,
  Brain,
  Shield,
  Stethoscope,
  Users,
  Clock,
  AlertTriangle,
  CheckCircle,
  Heart,
  Zap,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const features = [
  {
    icon: Users,
    title: 'Patient Portal',
    description:
      'Register your profile, submit emergency SOS alerts, and use the AI-powered symptom checker for instant medicine suggestions.',
    color: 'bg-teal-50 text-teal-600',
    path: '/patient',
  },
  {
    icon: Stethoscope,
    title: 'Doctor Portal',
    description:
      'Log in with your credentials, manage your availability status, and view emergency cases assigned to you in real time.',
    color: 'bg-emerald-50 text-emerald-600',
    path: '/doctor',
  },
  {
    icon: Shield,
    title: 'Admin Portal',
    description:
      'Manage doctors, monitor emergency cases, assign doctors to patients, and oversee the entire healthcare operation.',
    color: 'bg-cyan-50 text-cyan-600',
    path: '/admin',
  },
];

const stats = [
  { value: '24/7', label: 'Emergency Support' },
  { value: 'AI', label: 'Symptom Analysis' },
  { value: '6+', label: 'Specializations' },
  { value: '100%', label: 'Secure & Private' },
];

const steps = [
  {
    step: '01',
    icon: Users,
    title: 'Choose Your Role',
    desc: 'Select whether you are a patient, doctor, or administrator to access your personalized portal.',
  },
  {
    step: '02',
    icon: Brain,
    title: 'Use Smart Tools',
    desc: 'Check symptoms with our AI engine, submit emergency SOS alerts, or manage your medical team.',
  },
  {
    step: '03',
    icon: Clock,
    title: 'Get Fast Care',
    desc: 'Doctors are assigned to cases instantly. Track status in real time and receive timely medical attention.',
  },
];

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white dark:bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-teal-700 via-teal-600 to-emerald-600">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <img
            src="/assets/generated/hero-banner.dim_1200x400.png"
            alt=""
            className="w-full h-full object-cover"
          />
        </div>
        {/* Decorative circles */}
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-white/5 blur-3xl" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-teal-400/10 blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="flex-1 text-white">
              {/* Brand badge */}
              <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 mb-6">
                <img
                  src="/assets/generated/vitals-logo.dim_256x256.png"
                  alt="Vitals AI"
                  className="w-5 h-5 rounded-full object-cover"
                />
                <span className="text-sm font-semibold text-white/90">Vitals AI Platform</span>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight mb-6 font-heading">
                Smart Healthcare,{' '}
                <span className="text-teal-200">Powered by AI</span>
              </h1>
              <p className="text-lg md:text-xl text-teal-100 mb-8 leading-relaxed max-w-xl">
                Vitals AI connects patients, doctors, and administrators on a single intelligent platform — enabling faster emergency response, smarter symptom checking, and seamless care coordination.
              </p>

              <div className="flex flex-wrap gap-4">
                <Button
                  size="lg"
                  onClick={() => navigate({ to: '/select-role' })}
                  className="bg-white text-teal-700 hover:bg-teal-50 font-bold shadow-xl shadow-teal-900/20 px-8 text-base"
                >
                  Get Started
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => navigate({ to: '/patient' })}
                  className="border-white/50 text-white hover:bg-white/10 font-semibold px-8 text-base"
                >
                  <AlertTriangle className="mr-2 w-4 h-4 text-red-300" />
                  Emergency SOS
                </Button>
              </div>

              {/* Trust indicators */}
              <div className="flex flex-wrap gap-4 mt-8">
                {['HIPAA Compliant', 'Blockchain Secured', 'AI-Powered'].map((badge) => (
                  <div key={badge} className="flex items-center gap-1.5 text-teal-200 text-sm">
                    <CheckCircle className="w-4 h-4" />
                    <span>{badge}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Hero visual */}
            <div className="flex-shrink-0 hidden md:block">
              <div className="relative w-72 h-72 lg:w-80 lg:h-80">
                <div className="absolute inset-0 rounded-3xl bg-white/10 backdrop-blur-sm border border-white/20 shadow-2xl flex items-center justify-center">
                  <img
                    src="/assets/generated/vitals-logo.dim_256x256.png"
                    alt="Vitals AI"
                    className="w-48 h-48 object-contain rounded-2xl"
                  />
                </div>
                {/* Floating badges */}
                <div className="absolute -top-4 -right-4 bg-white rounded-xl shadow-lg px-3 py-2 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-xs font-semibold text-gray-700">Live Monitoring</span>
                </div>
                <div className="absolute -bottom-4 -left-4 bg-white rounded-xl shadow-lg px-3 py-2 flex items-center gap-2">
                  <Zap className="w-3.5 h-3.5 text-teal-600" />
                  <span className="text-xs font-semibold text-gray-700">Instant Response</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-teal-800 text-white py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {stats.map((stat) => (
              <div key={stat.label} className="group">
                <div className="text-3xl md:text-4xl font-black text-teal-200 group-hover:text-white transition-colors">
                  {stat.value}
                </div>
                <div className="text-sm text-teal-400 mt-1 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 md:py-28 bg-white dark:bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 bg-teal-50 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 rounded-full px-4 py-1.5 text-sm font-semibold mb-4">
              <Activity className="w-4 h-4" />
              Complete Healthcare Platform
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-foreground mb-4 font-heading">
              Everything You Need for Modern Healthcare
            </h2>
            <p className="text-lg text-gray-500 dark:text-muted-foreground max-w-2xl mx-auto">
              Vitals AI brings together patients, doctors, and administrators with intelligent tools for better health outcomes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="group bg-white dark:bg-card rounded-2xl p-8 border border-gray-100 dark:border-border shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer"
                onClick={() => navigate({ to: feature.path as '/patient' | '/doctor' | '/admin' })}
              >
                <div className={`w-14 h-14 rounded-2xl ${feature.color} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform`}>
                  <feature.icon className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-foreground mb-3 font-heading">
                  {feature.title}
                </h3>
                <p className="text-gray-500 dark:text-muted-foreground text-sm leading-relaxed mb-5">
                  {feature.description}
                </p>
                <div className="flex items-center text-teal-600 dark:text-teal-400 text-sm font-semibold group-hover:gap-2 transition-all">
                  <span>Open Portal</span>
                  <ArrowRight className="ml-1 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-teal-50 to-emerald-50 dark:from-teal-900/20 dark:to-emerald-900/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white dark:bg-card rounded-3xl shadow-xl overflow-hidden">
            <div className="flex flex-col md:flex-row">
              {/* Left content */}
              <div className="flex-1 p-8 md:p-12">
                <div className="flex items-center gap-2 mb-4">
                  <Brain className="w-5 h-5 text-teal-600" />
                  <span className="text-teal-600 font-semibold text-sm uppercase tracking-wider">AI-Powered</span>
                </div>
                <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 dark:text-foreground mb-3 font-heading">
                  Instant Symptom Analysis
                </h2>
                <p className="text-gray-500 dark:text-muted-foreground leading-relaxed mb-6">
                  Describe your symptoms and Vitals AI will suggest appropriate medications, dosages, and when to seek immediate medical attention. Fast, accurate, and always available.
                </p>
                <Button
                  size="lg"
                  onClick={() => navigate({ to: '/select-role' })}
                  className="bg-teal-600 hover:bg-teal-700 text-white font-semibold"
                >
                  Get Started Now
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </div>
              {/* Right visual */}
              <div className="bg-gradient-to-br from-teal-600 to-emerald-600 p-8 md:p-12 flex items-center justify-center md:w-72">
                <div className="text-center text-white">
                  <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Activity className="w-10 h-10 text-white" />
                  </div>
                  <p className="font-bold text-lg">Vitals AI</p>
                  <p className="text-teal-200 text-sm mt-1">Healthcare Intelligence</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Emergency Banner */}
      <section className="bg-red-600 text-white py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-center gap-3 flex-wrap text-center">
          <AlertTriangle className="w-5 h-5 animate-pulse flex-shrink-0" />
          <p className="text-sm font-medium">
            For life-threatening emergencies, always call <strong>911</strong> immediately. Vitals AI is not a substitute for emergency services.
          </p>
          <AlertTriangle className="w-5 h-5 animate-pulse flex-shrink-0" />
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 md:py-28 bg-white dark:bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-foreground mb-4 font-heading">
              How Vitals AI Works
            </h2>
            <p className="text-gray-500 dark:text-muted-foreground max-w-xl mx-auto">
              Three simple steps to better healthcare management.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Connector line */}
            <div className="hidden md:block absolute top-10 left-1/4 right-1/4 h-0.5 bg-gradient-to-r from-teal-200 via-teal-400 to-teal-200" />
            {steps.map((item, idx) => (
              <div key={item.step} className="text-center relative">
                <div className="relative inline-block mb-5">
                  <div className="w-20 h-20 bg-teal-50 dark:bg-teal-900/30 rounded-full flex items-center justify-center mx-auto border-2 border-teal-200 dark:border-teal-700">
                    <item.icon className="w-8 h-8 text-teal-600 dark:text-teal-400" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-7 h-7 bg-teal-600 rounded-full flex items-center justify-center text-white text-xs font-black">
                    {idx + 1}
                  </div>
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-foreground mb-2 font-heading">{item.title}</h3>
                <p className="text-gray-500 dark:text-muted-foreground text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>

          {/* Final CTA */}
          <div className="text-center mt-14">
            <Button
              size="lg"
              onClick={() => navigate({ to: '/select-role' })}
              className="bg-teal-600 hover:bg-teal-700 text-white font-bold px-10 text-base shadow-lg shadow-teal-200 dark:shadow-teal-900/30"
            >
              Start Your Journey
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
