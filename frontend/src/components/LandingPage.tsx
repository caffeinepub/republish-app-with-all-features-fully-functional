import React from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Shield, Zap, Users, ArrowRight, Heart, CheckCircle, Activity } from 'lucide-react';

export default function LandingPage() {
  const navigate = useNavigate();

  const features = [
    {
      icon: Shield,
      title: 'Safe & Secure',
      desc: 'Your health data is protected with enterprise-grade security and privacy-first design.',
      color: 'text-sky-700 dark:text-sky-300',
      iconColor: 'text-sky-600 dark:text-sky-400',
      bg: 'bg-sky-50 dark:bg-sky-950/40',
      border: 'border-sky-200 dark:border-sky-700',
    },
    {
      icon: Zap,
      title: 'AI-Powered',
      desc: 'Intelligent symptom analysis and smart case routing to get you the right care faster.',
      color: 'text-amber-700 dark:text-amber-300',
      iconColor: 'text-amber-600 dark:text-amber-400',
      bg: 'bg-amber-50 dark:bg-amber-950/40',
      border: 'border-amber-200 dark:border-amber-700',
    },
    {
      icon: Users,
      title: 'Built for Everyone',
      desc: 'Designed for patients, doctors, and administrators — a unified platform for all.',
      color: 'text-emerald-700 dark:text-emerald-300',
      iconColor: 'text-emerald-600 dark:text-emerald-400',
      bg: 'bg-emerald-50 dark:bg-emerald-950/40',
      border: 'border-emerald-200 dark:border-emerald-700',
    },
  ];

  const steps = [
    { num: '01', title: 'Sign Up', desc: 'Create your account in seconds with Internet Identity — no passwords needed.' },
    { num: '02', title: 'Choose Your Role', desc: 'Select whether you are a patient, doctor, or administrator.' },
    { num: '03', title: 'Start Your Journey', desc: 'Access your personalized portal and experience healthcare reimagined.' },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-primary/10 via-background to-secondary/10">
        <div className="absolute inset-0 dot-pattern opacity-30" />
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto py-20">
          <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-5 py-2 mb-8 text-primary text-sm font-semibold">
            <Activity className="w-4 h-4" />
            <span>Healthcare, Reimagined</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-display font-bold text-foreground mb-6 leading-tight">
            Medicine Meets{' '}
            <span className="text-primary">Intelligence</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
            Vitals AI connects patients with the right doctors at the right time — powered by intelligent triage and compassionate care.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate({ to: '/select-role' })}
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-8 py-4 rounded-full text-lg transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5 flex items-center gap-2 justify-center"
            >
              Get Started Free <ArrowRight className="w-5 h-5" />
            </button>
            <button
              onClick={() => navigate({ to: '/' })}
              className="border-2 border-primary/30 hover:border-primary/60 text-foreground font-semibold px-8 py-4 rounded-full text-lg transition-all duration-300 hover:bg-primary/5 flex items-center gap-2 justify-center"
            >
              <Heart className="w-5 h-5 text-primary" />
              Explore Platform
            </button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 bg-muted/30">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-14">
            <span className="text-primary font-semibold text-sm uppercase tracking-widest">Why Vitals AI</span>
            <h2 className="text-4xl font-display font-bold text-foreground mt-2 mb-4">
              Built Different, Built Better
            </h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              Every feature is designed with one goal: getting you the best care possible.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {features.map((f) => (
              <div key={f.title} className={`rounded-2xl border-2 ${f.border} ${f.bg} p-8 text-center card-hover`}>
                <div className={`w-14 h-14 rounded-2xl ${f.bg} border ${f.border} flex items-center justify-center mx-auto mb-5`}>
                  <f.icon className={`w-7 h-7 ${f.iconColor}`} />
                </div>
                <h3 className={`text-lg font-bold mb-3 ${f.color}`}>{f.title}</h3>
                <p className="text-foreground/75 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 bg-background">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-14">
            <span className="text-primary font-semibold text-sm uppercase tracking-widest">Simple Steps</span>
            <h2 className="text-4xl font-display font-bold text-foreground mt-2 mb-4">
              Up and Running in Minutes
            </h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              No complicated setup. Just sign up and start.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((s, i) => (
              <div key={s.num} className="relative text-center p-6 rounded-2xl bg-card border-2 border-border card-hover">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 border-2 border-primary/20 flex items-center justify-center mx-auto mb-5">
                  <span className="text-primary font-bold text-lg">{i + 1}</span>
                </div>
                <h3 className="text-lg font-bold text-foreground mb-3">{s.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-primary to-secondary relative overflow-hidden">
        <div className="absolute inset-0 dot-pattern opacity-10" />
        <div className="relative z-10 max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-4 drop-shadow-md">
            Ready to Get Started?
          </h2>
          <p className="text-white/90 text-lg mb-8 max-w-xl mx-auto leading-relaxed font-medium">
            Join Vitals AI today and experience healthcare that truly puts you first.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate({ to: '/select-role' })}
              className="bg-white text-primary hover:bg-white/90 font-bold px-8 py-4 rounded-full text-lg transition-all duration-300 shadow-xl hover:shadow-2xl hover:-translate-y-1 inline-flex items-center gap-2 justify-center"
            >
              Get Started <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
