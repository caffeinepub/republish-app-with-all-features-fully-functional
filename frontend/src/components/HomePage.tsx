import React, { useEffect, useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import {
  Heart, Shield, Globe, Stethoscope, Brain, Baby, Bone, Pill, Zap,
  CheckCircle, ArrowRight, Star, Clock, Users, Phone, Mail, MapPin,
  Activity, Sparkles, TrendingUp, Award, HeartPulse, Rocket, Target
} from 'lucide-react';
import { useGetAllDoctorsPublic } from '../hooks/useQueries';
import { Department } from '../backend';

// ─── Hero Section ─────────────────────────────────────────────────────────────
function HeroSection() {
  const navigate = useNavigate();
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated mesh background */}
      <div className="absolute inset-0 mesh-pattern" />
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
        style={{ backgroundImage: "url('/assets/generated/hero-bg.dim_1920x1080.png')" }}
      />
      {/* Animated blobs */}
      <div className="absolute top-20 left-10 w-72 h-72 rounded-full bg-teal-300/30 animate-blob blur-3xl" />
      <div className="absolute top-40 right-10 w-96 h-96 rounded-full bg-violet-300/25 animate-blob blur-3xl" style={{ animationDelay: '3s' }} />
      <div className="absolute bottom-20 left-1/3 w-80 h-80 rounded-full bg-coral-300/20 animate-blob blur-3xl" style={{ animationDelay: '6s' }} />

      <div className="relative z-10 text-center px-4 max-w-6xl mx-auto pt-24">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-teal-200 rounded-full px-5 py-2.5 mb-8 shadow-teal-sm animate-fade-in">
          <div className="w-2 h-2 rounded-full bg-teal-500 animate-pulse" />
          <span className="text-teal-700 text-sm font-bold">AI-Powered Smart Hospital Platform</span>
          <Sparkles className="w-4 h-4 text-coral-500" />
        </div>

        {/* Headline */}
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-display font-black mb-6 leading-tight animate-slide-up">
          <span className="text-slate-800">Your Health,</span>
          <br />
          <span className="text-gradient">Our Mission</span>
        </h1>

        <p className="text-xl md:text-2xl text-slate-600 mb-10 max-w-3xl mx-auto leading-relaxed font-medium animate-fade-in" style={{ animationDelay: '200ms' }}>
          Building next-generation healthcare with AI-powered diagnostics, real-time vitals monitoring, and instant emergency response — for everyone, everywhere.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in" style={{ animationDelay: '400ms' }}>
          <button
            onClick={() => navigate({ to: '/select-role' })}
            className="gradient-coral-rose text-white font-bold px-10 py-4 rounded-full text-lg transition-all duration-300 shadow-coral hover:shadow-coral-lg hover:-translate-y-1 hover:scale-105 flex items-center gap-2 justify-center"
          >
            Get Started Free <ArrowRight className="w-5 h-5" />
          </button>
          <button
            onClick={() => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })}
            className="bg-white/80 backdrop-blur-sm border-2 border-teal-200 text-teal-700 font-bold px-10 py-4 rounded-full text-lg transition-all duration-300 hover:bg-white hover:border-teal-400 hover:-translate-y-1 shadow-card"
          >
            Explore Services
          </button>
        </div>

        {/* Aspirational stats row */}
        <div className="mt-16 grid grid-cols-3 gap-6 max-w-2xl mx-auto animate-fade-in" style={{ animationDelay: '600ms' }}>
          {[
            { value: '∞', label: 'Patients to Serve', color: 'text-teal-600' },
            { value: '🚀', label: 'Growing Fast', color: 'text-coral-500' },
            { value: '24/7', label: 'Always Available', color: 'text-violet-600' },
          ].map((stat) => (
            <div key={stat.label} className="glass-card-white rounded-2xl p-4 text-center">
              <div className={`text-2xl md:text-3xl font-black ${stat.color}`}>{stat.value}</div>
              <div className="text-xs text-slate-500 font-semibold mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-teal-400/60 rounded-full flex items-start justify-center p-1">
          <div className="w-1.5 h-3 bg-teal-500/70 rounded-full animate-pulse" />
        </div>
      </div>
    </section>
  );
}

// ─── Mission Section ───────────────────────────────────────────────────────────
function MissionSection() {
  const pillars = [
    {
      icon: Heart,
      title: 'Pure Healthcare',
      desc: 'Every decision we make is guided by one principle: what is best for the patient. No compromises, no shortcuts.',
      gradient: 'gradient-coral-rose',
      bg: 'bg-coral-50',
      border: 'border-coral-200',
      text: 'text-coral-700',
    },
    {
      icon: Shield,
      title: 'Proper Facilities',
      desc: 'We are committed to providing well-equipped, hygienic, and accessible facilities that meet the highest standards of care.',
      gradient: 'gradient-teal-cyan',
      bg: 'bg-teal-50',
      border: 'border-teal-200',
      text: 'text-teal-700',
    },
    {
      icon: Globe,
      title: 'Global Aspiration',
      desc: 'Our vision extends beyond borders — we aspire to make quality healthcare accessible to every person on the planet.',
      gradient: 'gradient-violet-purple',
      bg: 'bg-violet-50',
      border: 'border-violet-200',
      text: 'text-violet-700',
    },
  ];

  return (
    <section id="about" className="py-24 px-4 bg-white relative overflow-hidden">
      <div className="absolute inset-0 dot-pattern opacity-40" />
      <div className="relative z-10 max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-teal-50 border border-teal-200 rounded-full px-4 py-2 mb-5 text-teal-700 text-sm font-bold">
            <Heart className="w-4 h-4 text-coral-500 fill-coral-500" />
            Our Mission
          </div>
          <h2 className="text-4xl md:text-5xl font-display font-black text-slate-800 mb-4">
            Healthcare built on{' '}
            <span className="text-gradient">three pillars</span>
          </h2>
          <p className="text-slate-500 text-lg max-w-2xl mx-auto font-medium">
            We believe great healthcare starts with the right values, the right tools, and the right people.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 stagger-children">
          {pillars.map((p) => (
            <div
              key={p.title}
              className={`rounded-3xl border-2 ${p.border} ${p.bg} p-8 card-hover-lift text-center`}
            >
              <div className={`w-16 h-16 rounded-2xl ${p.gradient} flex items-center justify-center mx-auto mb-5 shadow-card`}>
                <p.icon className="w-8 h-8 text-white" />
              </div>
              <h3 className={`text-xl font-bold ${p.text} mb-3`}>{p.title}</h3>
              <p className="text-slate-600 text-sm leading-relaxed font-medium">{p.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Services Section ──────────────────────────────────────────────────────────
function ServicesSection() {
  const services = [
    { icon: Zap, name: 'Emergency Care', desc: 'Immediate response for life-threatening situations with round-the-clock availability.', gradient: 'gradient-coral-rose', bg: 'bg-coral-50', border: 'border-coral-200', text: 'text-coral-700' },
    { icon: Heart, name: 'Cardiology', desc: 'Advanced heart care with cutting-edge diagnostic and treatment options.', gradient: 'gradient-teal-cyan', bg: 'bg-teal-50', border: 'border-teal-200', text: 'text-teal-700' },
    { icon: Brain, name: 'Neurology', desc: 'Expert neurological care for brain, spine, and nervous system conditions.', gradient: 'gradient-violet-purple', bg: 'bg-violet-50', border: 'border-violet-200', text: 'text-violet-700' },
    { icon: Baby, name: 'Pediatrics', desc: 'Specialized care for children from newborns to adolescents.', gradient: 'gradient-emerald-teal', bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-700' },
    { icon: Bone, name: 'Orthopedics', desc: 'Comprehensive bone, joint, and muscle care for all ages.', gradient: 'gradient-amber-orange', bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-700' },
    { icon: Pill, name: 'General Medicine', desc: 'Primary care and preventive medicine for your overall health.', gradient: 'gradient-teal-cyan', bg: 'bg-cyan-50', border: 'border-cyan-200', text: 'text-cyan-700' },
  ];

  return (
    <section id="services" className="py-24 px-4 bg-gradient-to-br from-slate-50 to-teal-50/30 relative overflow-hidden">
      <div className="absolute inset-0 grid-pattern opacity-50" />
      <div className="relative z-10 max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-white border border-teal-200 rounded-full px-4 py-2 mb-5 text-teal-700 text-sm font-bold shadow-teal-sm">
            <Stethoscope className="w-4 h-4" />
            Our Services
          </div>
          <h2 className="text-4xl md:text-5xl font-display font-black text-slate-800 mb-4">
            World-class{' '}
            <span className="text-gradient">medical departments</span>
          </h2>
          <p className="text-slate-500 text-lg max-w-2xl mx-auto font-medium">
            From emergency care to specialized treatments, we cover every aspect of your health journey.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 stagger-children">
          {services.map((s) => (
            <div
              key={s.name}
              className={`rounded-2xl border-2 ${s.border} bg-white p-6 card-hover shadow-card group`}
            >
              <div className={`w-14 h-14 rounded-2xl ${s.gradient} flex items-center justify-center mb-4 shadow-card group-hover:scale-110 transition-transform duration-300`}>
                <s.icon className="w-7 h-7 text-white" />
              </div>
              <h3 className={`text-lg font-bold ${s.text} mb-2`}>{s.name}</h3>
              <p className="text-slate-500 text-sm leading-relaxed font-medium">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Doctors Section ───────────────────────────────────────────────────────────
function DoctorsSection() {
  const { data: doctors, isLoading } = useGetAllDoctorsPublic();

  const deptColors: Record<string, { gradient: string; bg: string; text: string; border: string }> = {
    [Department.cardiology]:      { gradient: 'gradient-coral-rose',    bg: 'bg-coral-50',   text: 'text-coral-700',   border: 'border-coral-200' },
    [Department.neurology]:       { gradient: 'gradient-violet-purple',  bg: 'bg-violet-50',  text: 'text-violet-700',  border: 'border-violet-200' },
    [Department.emergency]:       { gradient: 'gradient-coral-rose',     bg: 'bg-red-50',     text: 'text-red-700',     border: 'border-red-200' },
    [Department.pediatrics]:      { gradient: 'gradient-emerald-teal',   bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
    [Department.orthopedics]:     { gradient: 'gradient-amber-orange',   bg: 'bg-amber-50',   text: 'text-amber-700',   border: 'border-amber-200' },
    [Department.generalMedicine]: { gradient: 'gradient-teal-cyan',      bg: 'bg-teal-50',    text: 'text-teal-700',    border: 'border-teal-200' },
  };

  const deptLabel: Record<string, string> = {
    [Department.cardiology]:      'Cardiology',
    [Department.neurology]:       'Neurology',
    [Department.emergency]:       'Emergency',
    [Department.pediatrics]:      'Pediatrics',
    [Department.orthopedics]:     'Orthopedics',
    [Department.generalMedicine]: 'General Medicine',
  };

  return (
    <section id="doctors" className="py-24 px-4 bg-white relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-teal-100/40 blur-3xl" />
      <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full bg-violet-100/30 blur-3xl" />
      <div className="relative z-10 max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-teal-50 border border-teal-200 rounded-full px-4 py-2 mb-5 text-teal-700 text-sm font-bold">
            <Users className="w-4 h-4" />
            Our Doctors
          </div>
          <h2 className="text-4xl md:text-5xl font-display font-black text-slate-800 mb-4">
            Meet our{' '}
            <span className="text-gradient">growing team</span>
          </h2>
          <p className="text-slate-500 text-lg max-w-2xl mx-auto font-medium">
            Our dedicated specialists are joining the platform every day — committed to delivering the best possible care.
          </p>
        </div>

        {isLoading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="rounded-2xl border border-slate-200 bg-white p-6 shimmer h-40" />
            ))}
          </div>
        ) : doctors && doctors.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 stagger-children">
            {doctors.map((doc) => {
              const colors = deptColors[doc.department] ?? { gradient: 'gradient-teal-cyan', bg: 'bg-teal-50', text: 'text-teal-700', border: 'border-teal-200' };
              return (
                <div key={doc.id.toString()} className={`rounded-2xl border-2 ${colors.border} bg-white p-6 card-hover shadow-card`}>
                  <div className="flex items-center gap-4 mb-4">
                    <div className={`w-14 h-14 rounded-2xl ${colors.gradient} flex items-center justify-center shadow-card flex-shrink-0`}>
                      <Stethoscope className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-800 text-base">Dr. {doc.name}</h3>
                      <span className={`text-xs font-bold ${colors.text} ${colors.bg} px-2.5 py-1 rounded-full border ${colors.border}`}>
                        {deptLabel[doc.department] ?? doc.department}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className={`w-2.5 h-2.5 rounded-full ${doc.available ? 'bg-emerald-500' : 'bg-slate-300'} animate-pulse`} />
                    <span className={`text-sm font-semibold ${doc.available ? 'text-emerald-600' : 'text-slate-400'}`}>
                      {doc.available ? 'Available Now' : 'Currently Busy'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-20 h-20 rounded-3xl gradient-teal-cyan flex items-center justify-center mx-auto mb-5 shadow-teal">
              <Stethoscope className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-xl font-bold text-slate-700 mb-2">Be among the first to join</h3>
            <p className="text-slate-400 font-medium">Doctors will appear here once they register — be a pioneer on our platform.</p>
          </div>
        )}
      </div>
    </section>
  );
}

// ─── Why Us Section ────────────────────────────────────────────────────────────
function WhyUsSection() {
  const reasons = [
    { icon: Zap, title: 'Instant Emergency Response', desc: 'Our AI-powered triage system is designed to ensure critical cases are handled within minutes.', gradient: 'gradient-coral-rose', text: 'text-coral-700' },
    { icon: Brain, title: 'AI-Powered Diagnostics', desc: 'Advanced symptom analysis and health insights powered by cutting-edge AI technology.', gradient: 'gradient-violet-purple', text: 'text-violet-700' },
    { icon: Shield, title: 'Secure & Private', desc: 'Your health data is protected with enterprise-grade security and privacy controls.', gradient: 'gradient-teal-cyan', text: 'text-teal-700' },
    { icon: Clock, title: '24/7 Availability', desc: 'Round-the-clock access to emergency care and medical consultations — always on, always ready.', gradient: 'gradient-emerald-teal', text: 'text-emerald-700' },
    { icon: Rocket, title: 'Built to Scale', desc: 'Designed from day one to grow with our community — from first patients to millions worldwide.', gradient: 'gradient-amber-orange', text: 'text-amber-700' },
    { icon: TrendingUp, title: 'Real-Time Monitoring', desc: 'Live vitals tracking and health trend analysis for proactive, preventive care.', gradient: 'gradient-teal-cyan', text: 'text-cyan-700' },
  ];

  return (
    <section className="py-24 px-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-teal-50/60 via-white to-violet-50/40" />
      <div className="absolute inset-0 dot-pattern opacity-30" />
      <div className="relative z-10 max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-white border border-violet-200 rounded-full px-4 py-2 mb-5 text-violet-700 text-sm font-bold shadow-violet">
            <Award className="w-4 h-4" />
            Why Choose Us
          </div>
          <h2 className="text-4xl md:text-5xl font-display font-black text-slate-800 mb-4">
            The smarter way to{' '}
            <span className="text-gradient-violet">manage health</span>
          </h2>
          <p className="text-slate-500 text-lg max-w-2xl mx-auto font-medium">
            We combine technology and compassion to build healthcare that truly makes a difference.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 stagger-children">
          {reasons.map((r) => (
            <div key={r.title} className="bg-white rounded-2xl border border-slate-200 p-6 card-hover shadow-card group">
              <div className={`w-12 h-12 rounded-xl ${r.gradient} flex items-center justify-center mb-4 shadow-card group-hover:scale-110 transition-transform duration-300`}>
                <r.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className={`font-bold ${r.text} mb-2 text-base`}>{r.title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed font-medium">{r.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── How It Works Section ──────────────────────────────────────────────────────
function HowItWorksSection() {
  const steps = [
    {
      step: '01',
      title: 'Create Your Profile',
      desc: 'Sign up in seconds and set up your health profile. Your data stays private and secure.',
      gradient: 'gradient-teal-cyan',
      border: 'border-teal-200',
      bg: 'bg-teal-50',
      text: 'text-teal-700',
    },
    {
      step: '02',
      title: 'Connect with Doctors',
      desc: 'Browse our growing network of verified specialists and connect with the right expert for your needs.',
      gradient: 'gradient-coral-rose',
      border: 'border-coral-200',
      bg: 'bg-coral-50',
      text: 'text-coral-700',
    },
    {
      step: '03',
      title: 'Get AI-Powered Insights',
      desc: 'Our AI analyzes your symptoms and vitals to provide actionable health insights and recommendations.',
      gradient: 'gradient-violet-purple',
      border: 'border-violet-200',
      bg: 'bg-violet-50',
      text: 'text-violet-700',
    },
    {
      step: '04',
      title: 'Emergency SOS Anytime',
      desc: 'Trigger an emergency alert instantly and get connected to the nearest available care team.',
      gradient: 'gradient-amber-orange',
      border: 'border-amber-200',
      bg: 'bg-amber-50',
      text: 'text-amber-700',
    },
  ];

  return (
    <section id="how-it-works" className="py-24 px-4 bg-white relative overflow-hidden">
      <div className="absolute inset-0 grid-pattern opacity-30" />
      <div className="relative z-10 max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-200 rounded-full px-4 py-2 mb-5 text-emerald-700 text-sm font-bold">
            <Activity className="w-4 h-4" />
            How It Works
          </div>
          <h2 className="text-4xl md:text-5xl font-display font-black text-slate-800 mb-4">
            Your health journey,{' '}
            <span className="text-gradient">simplified</span>
          </h2>
          <p className="text-slate-500 text-lg max-w-2xl mx-auto font-medium">
            From sign-up to specialist care — we've designed every step to be effortless.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 stagger-children">
          {steps.map((s, i) => (
            <div key={s.step} className={`rounded-2xl border-2 ${s.border} ${s.bg} p-6 card-hover-lift relative`}>
              <div className={`text-4xl font-black ${s.text} opacity-20 absolute top-4 right-5 font-display`}>{s.step}</div>
              <div className={`w-12 h-12 rounded-xl ${s.gradient} flex items-center justify-center mb-4 shadow-card`}>
                <span className="text-white font-black text-lg">{i + 1}</span>
              </div>
              <h3 className={`font-bold ${s.text} mb-2 text-base`}>{s.title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed font-medium">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Vision / Aspirations Section ─────────────────────────────────────────────
function VisionSection() {
  const aspirations = [
    {
      icon: Target,
      title: 'Our Goal',
      value: 'Thousands of Lives',
      desc: 'We are building toward a future where thousands of patients receive timely, quality care through our platform.',
      gradient: 'gradient-teal-cyan',
      bg: 'bg-teal-50',
      border: 'border-teal-200',
      text: 'text-teal-700',
    },
    {
      icon: Users,
      title: 'Our Community',
      value: 'Growing Every Day',
      desc: 'Doctors, patients, and caregivers are joining our mission — together we are stronger.',
      gradient: 'gradient-coral-rose',
      bg: 'bg-coral-50',
      border: 'border-coral-200',
      text: 'text-coral-700',
    },
    {
      icon: Globe,
      title: 'Our Reach',
      value: 'Global Vision',
      desc: 'We dream of a world where geography is never a barrier to receiving excellent healthcare.',
      gradient: 'gradient-violet-purple',
      bg: 'bg-violet-50',
      border: 'border-violet-200',
      text: 'text-violet-700',
    },
    {
      icon: Rocket,
      title: 'Our Momentum',
      value: 'Just Getting Started',
      desc: 'This is only the beginning. Every feature we ship, every doctor we onboard, brings us closer to our vision.',
      gradient: 'gradient-emerald-teal',
      bg: 'bg-emerald-50',
      border: 'border-emerald-200',
      text: 'text-emerald-700',
    },
  ];

  return (
    <section className="py-24 px-4 bg-gradient-to-br from-slate-50 to-violet-50/30 relative overflow-hidden">
      <div className="absolute inset-0 dot-pattern opacity-30" />
      <div className="relative z-10 max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-white border border-teal-200 rounded-full px-4 py-2 mb-5 text-teal-700 text-sm font-bold shadow-teal-sm">
            <Sparkles className="w-4 h-4 text-coral-500" />
            Our Aspirations
          </div>
          <h2 className="text-4xl md:text-5xl font-display font-black text-slate-800 mb-4">
            Where we're{' '}
            <span className="text-gradient">headed</span>
          </h2>
          <p className="text-slate-500 text-lg max-w-2xl mx-auto font-medium">
            We don't just dream big — we build with purpose. Here's what we're working toward.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 stagger-children">
          {aspirations.map((a) => (
            <div
              key={a.title}
              className={`rounded-2xl border-2 ${a.border} ${a.bg} p-6 card-hover-lift text-center`}
            >
              <div className={`w-14 h-14 rounded-2xl ${a.gradient} flex items-center justify-center mx-auto mb-4 shadow-card`}>
                <a.icon className="w-7 h-7 text-white" />
              </div>
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">{a.title}</div>
              <div className={`text-lg font-black ${a.text} mb-2`}>{a.value}</div>
              <p className="text-slate-500 text-xs leading-relaxed font-medium">{a.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Contact Section ───────────────────────────────────────────────────────────
function ContactSection() {
  const navigate = useNavigate();
  return (
    <section id="contact" className="py-24 px-4 bg-white relative overflow-hidden">
      <div className="absolute top-0 left-0 w-96 h-96 rounded-full bg-teal-100/30 blur-3xl" />
      <div className="absolute bottom-0 right-0 w-80 h-80 rounded-full bg-coral-100/20 blur-3xl" />
      <div className="relative z-10 max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-coral-50 border border-coral-200 rounded-full px-4 py-2 mb-5 text-coral-700 text-sm font-bold">
            <Phone className="w-4 h-4" />
            Get In Touch
          </div>
          <h2 className="text-4xl md:text-5xl font-display font-black text-slate-800 mb-4">
            Ready to{' '}
            <span className="text-gradient">get started?</span>
          </h2>
          <p className="text-slate-500 text-lg max-w-2xl mx-auto font-medium">
            Join us on this journey to transform healthcare. Whether you're a patient or a doctor, there's a place for you here.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-12 stagger-children">
          {[
            { icon: Phone, title: 'Call Us', value: '+1 (800) VITALS-1', gradient: 'gradient-teal-cyan', bg: 'bg-teal-50', border: 'border-teal-200', text: 'text-teal-700' },
            { icon: Mail, title: 'Email Us', value: 'hello@vitalsai.health', gradient: 'gradient-coral-rose', bg: 'bg-coral-50', border: 'border-coral-200', text: 'text-coral-700' },
            { icon: MapPin, title: 'Our Reach', value: 'Serving patients globally', gradient: 'gradient-violet-purple', bg: 'bg-violet-50', border: 'border-violet-200', text: 'text-violet-700' },
          ].map((c) => (
            <div key={c.title} className={`rounded-2xl border-2 ${c.border} ${c.bg} p-6 text-center card-hover`}>
              <div className={`w-14 h-14 rounded-2xl ${c.gradient} flex items-center justify-center mx-auto mb-4 shadow-card`}>
                <c.icon className="w-7 h-7 text-white" />
              </div>
              <h3 className={`font-bold ${c.text} mb-1`}>{c.title}</h3>
              <p className="text-slate-500 text-sm font-medium">{c.value}</p>
            </div>
          ))}
        </div>

        <div className="text-center">
          <button
            onClick={() => navigate({ to: '/select-role' })}
            className="gradient-coral-rose text-white font-bold px-12 py-4 rounded-full text-lg transition-all duration-300 shadow-coral hover:shadow-coral-lg hover:-translate-y-1 hover:scale-105 inline-flex items-center gap-2"
          >
            Join VitalsAI Today <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </section>
  );
}

// ─── Main HomePage ─────────────────────────────────────────────────────────────
export default function HomePage() {
  return (
    <main>
      <HeroSection />
      <MissionSection />
      <ServicesSection />
      <DoctorsSection />
      <WhyUsSection />
      <HowItWorksSection />
      <VisionSection />
      <ContactSection />
    </main>
  );
}
