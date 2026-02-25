import React from 'react';
import { useNavigate } from '@tanstack/react-router';
import {
  Heart,
  ArrowRight,
  Shield,
  Zap,
  Globe,
  CheckCircle,
  Activity,
  Stethoscope,
  Users,
  Sparkles,
  Target,
  Star,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function LandingPage() {
  const navigate = useNavigate();

  const features = [
    {
      icon: Shield,
      title: 'Safe & Secure',
      desc: 'Your health data is protected with the highest standards of privacy and security.',
      color: 'bg-teal-50 dark:bg-teal-950/30',
      iconBg: 'bg-teal-100 dark:bg-teal-900/40',
      iconColor: 'text-teal-600 dark:text-teal-400',
    },
    {
      icon: Zap,
      title: 'AI-Powered',
      desc: 'Intelligent symptom analysis to help you understand your health and make informed decisions.',
      color: 'bg-emerald-50 dark:bg-emerald-950/30',
      iconBg: 'bg-emerald-100 dark:bg-emerald-900/40',
      iconColor: 'text-emerald-600 dark:text-emerald-400',
    },
    {
      icon: Globe,
      title: 'Built for Everyone',
      desc: 'Designed to be accessible and effective for patients from all walks of life.',
      color: 'bg-cyan-50 dark:bg-cyan-950/30',
      iconBg: 'bg-cyan-100 dark:bg-cyan-900/40',
      iconColor: 'text-cyan-600 dark:text-cyan-400',
    },
  ];

  const steps = [
    {
      num: '01',
      icon: Users,
      title: 'Create Your Profile',
      desc: 'Register securely and set up your personal health profile in just a few minutes.',
    },
    {
      num: '02',
      icon: Stethoscope,
      title: 'Access Care',
      desc: 'Use our AI symptom checker or connect directly with qualified medical professionals.',
    },
    {
      num: '03',
      icon: Heart,
      title: 'Heal & Thrive',
      desc: 'Follow your personalized care plan with ongoing support from our dedicated team.',
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 hero-gradient" />
        <div className="absolute inset-0 dot-pattern opacity-20 pointer-events-none" />
        <div className="absolute top-1/3 right-1/4 w-96 h-96 rounded-full bg-teal-500/15 blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/3 left-1/4 w-64 h-64 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-6 lg:px-8 pt-32 pb-20 w-full">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left: Text */}
            <div className="animate-fade-in-left">
              <div className="inline-flex items-center gap-2 bg-teal-500/20 border border-teal-400/30 rounded-full px-4 py-2 text-sm font-medium text-teal-200 mb-8">
                <Sparkles className="w-4 h-4 text-teal-300" />
                Aspiring to set the global standard in patient care
              </div>

              <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-black text-white leading-[1.05] tracking-tight mb-6">
                Healthcare{' '}
                <span className="block text-gradient-warm">the world</span>
                <span className="block text-teal-300">deserves.</span>
              </h1>

              <p className="text-lg sm:text-xl text-teal-100/90 leading-relaxed mb-10 max-w-xl">
                Giving pure and proper health facilities to every individual — our commitment
                starts with you and extends to every corner of the globe.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-10">
                <Button
                  size="lg"
                  onClick={() => navigate({ to: '/select-role' })}
                  className="bg-teal-500 hover:bg-teal-400 text-white font-semibold px-8 py-4 h-auto text-base shadow-teal-lg hover:shadow-glow transition-all duration-300 gap-2 group"
                >
                  Get Started
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => navigate({ to: '/' })}
                  className="border-white/30 text-white hover:bg-white/10 hover:border-white/50 px-8 py-4 h-auto text-base backdrop-blur-sm transition-all duration-300"
                >
                  Learn More
                </Button>
              </div>

              {/* Trust indicators — aspirational, no fake numbers */}
              <div className="flex flex-wrap gap-3">
                {[
                  { icon: Shield, text: 'Patient Safety First' },
                  { icon: Activity, text: '24/7 Emergency Care' },
                  { icon: Star, text: 'Clinical Excellence' },
                ].map(({ icon: Icon, text }) => (
                  <div
                    key={text}
                    className="flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/15 rounded-full px-3 py-1.5 text-sm text-teal-100"
                  >
                    <Icon className="w-3.5 h-3.5 text-teal-300" />
                    {text}
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Visual */}
            <div className="hidden lg:block animate-fade-in-right">
              <div className="relative">
                <div className="rounded-3xl overflow-hidden shadow-card-xl">
                  <img
                    src="/assets/generated/global-reach.dim_800x800.png"
                    alt="Global healthcare reach"
                    className="w-full h-auto object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-teal-950/50 via-transparent to-transparent rounded-3xl" />
                </div>

                {/* Floating card */}
                <div className="absolute -bottom-5 -left-5 glass-card rounded-2xl p-5 shadow-card-xl animate-float">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-teal-500/30 flex items-center justify-center">
                      <Target className="w-5 h-5 text-teal-300" />
                    </div>
                    <div>
                      <p className="font-display font-bold text-white text-sm">Our Mission</p>
                      <p className="text-teal-300 text-xs">World-class care for all</p>
                    </div>
                  </div>
                </div>

                {/* Floating badge */}
                <div className="absolute -top-4 -right-4 bg-emerald-600 rounded-2xl px-4 py-3 shadow-teal-lg">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-white" />
                    <span className="text-white text-sm font-semibold">Pure Healthcare</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 lg:py-28 bg-background">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 bg-teal-50 dark:bg-teal-900/30 border border-teal-200 dark:border-teal-700/50 rounded-full px-4 py-2 text-sm font-medium text-teal-700 dark:text-teal-300 mb-5">
              <Zap className="w-4 h-4" />
              What Makes Us Different
            </div>
            <h2 className="font-display text-4xl lg:text-5xl font-black text-foreground mb-4">
              Built on a foundation of{' '}
              <span className="text-gradient">trust & excellence</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
              Every feature, every decision, every interaction is guided by our core commitment:
              to give every patient the pure and proper healthcare they deserve.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 stagger-children">
            {features.map(({ icon: Icon, title, desc, color, iconBg, iconColor }) => (
              <div
                key={title}
                className={`animate-fade-in ${color} border border-border rounded-2xl p-8 card-hover`}
              >
                <div className={`w-12 h-12 rounded-xl ${iconBg} flex items-center justify-center mb-5`}>
                  <Icon className={`w-6 h-6 ${iconColor}`} />
                </div>
                <h3 className="font-display font-bold text-foreground text-xl mb-3">{title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 lg:py-28 bg-teal-50/50 dark:bg-teal-950/20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 bg-teal-100 dark:bg-teal-900/40 border border-teal-200 dark:border-teal-700/50 rounded-full px-4 py-2 text-sm font-medium text-teal-700 dark:text-teal-300 mb-5">
              <CheckCircle className="w-4 h-4" />
              Simple Steps
            </div>
            <h2 className="font-display text-4xl lg:text-5xl font-black text-foreground mb-4">
              Getting started is{' '}
              <span className="text-gradient">easy</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto leading-relaxed">
              Quality healthcare should be simple to access. Here's how VitalsAI works for you.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 stagger-children">
            {steps.map(({ num, icon: Icon, title, desc }) => (
              <div key={num} className="animate-fade-in text-center group">
                <div className="relative inline-flex mb-6">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center shadow-teal-lg group-hover:shadow-glow transition-shadow duration-300">
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-teal-950 dark:bg-teal-900 border-2 border-teal-400 flex items-center justify-center">
                    <span className="text-teal-300 text-xs font-bold">{num}</span>
                  </div>
                </div>
                <h3 className="font-display font-bold text-foreground text-xl mb-3">{title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed max-w-xs mx-auto">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 lg:py-24 bg-gradient-to-br from-teal-700 via-teal-800 to-emerald-900 relative overflow-hidden">
        <div className="absolute inset-0 dot-pattern opacity-20 pointer-events-none" />
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-white/5 blur-3xl pointer-events-none" />

        <div className="relative max-w-3xl mx-auto px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 bg-white/15 border border-white/20 rounded-full px-4 py-2 text-sm font-medium text-teal-100 mb-7">
            <Globe className="w-4 h-4 text-teal-300" />
            Join Our Mission
          </div>
          <h2 className="font-display text-4xl lg:text-5xl font-black text-white mb-5 leading-tight">
            Be part of the future{' '}
            <span className="text-teal-300">of healthcare</span>
          </h2>
          <p className="text-teal-100 text-xl leading-relaxed mb-10">
            Whether you're a patient seeking care or a doctor committed to excellence —
            VitalsAI is the platform built for you.
          </p>
          <Button
            size="lg"
            onClick={() => navigate({ to: '/select-role' })}
            className="bg-white text-teal-800 hover:bg-teal-50 font-semibold px-10 py-4 h-auto text-base shadow-lg hover:shadow-xl transition-all duration-300 gap-2 group"
          >
            Get Started Today
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </section>
    </div>
  );
}
