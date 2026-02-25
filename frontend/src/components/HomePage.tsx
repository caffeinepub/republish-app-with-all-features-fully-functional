import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import {
  Heart,
  Activity,
  Shield,
  Brain,
  Baby,
  Bone,
  Stethoscope,
  ArrowRight,
  ChevronRight,
  Star,
  Globe,
  Zap,
  Clock,
  CheckCircle,
  Users,
  Award,
  Sparkles,
  Phone,
  MapPin,
  Mail,
  Play,
  TrendingUp,
  Target,
  Lightbulb,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useGetAllDoctorsPublic } from '@/hooks/useQueries';
import { Department } from '@/backend';

// ─── Helpers ────────────────────────────────────────────────────────────────

function departmentLabel(dept: Department): string {
  const map: Record<Department, string> = {
    [Department.emergency]: 'Emergency',
    [Department.cardiology]: 'Cardiology',
    [Department.neurology]: 'Neurology',
    [Department.pediatrics]: 'Pediatrics',
    [Department.orthopedics]: 'Orthopedics',
    [Department.generalMedicine]: 'General Medicine',
  };
  return map[dept] ?? dept;
}

function departmentColor(dept: Department): string {
  const map: Record<Department, string> = {
    [Department.emergency]: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
    [Department.cardiology]: 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-300',
    [Department.neurology]: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
    [Department.pediatrics]: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
    [Department.orthopedics]: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300',
    [Department.generalMedicine]: 'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-300',
  };
  return map[dept] ?? 'bg-teal-100 text-teal-700';
}

// ─── Section: Hero ───────────────────────────────────────────────────────────

function HeroSection() {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0">
        <img
          src="/assets/generated/hero-bg.dim_1920x1080.png"
          alt=""
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-teal-950/92 via-teal-900/80 to-teal-800/60" />
        <div className="absolute inset-0 bg-gradient-to-t from-teal-950/60 via-transparent to-transparent" />
      </div>

      {/* Decorative elements */}
      <div className="absolute top-1/4 right-1/4 w-96 h-96 rounded-full bg-teal-500/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/3 w-64 h-64 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 grid-pattern opacity-30 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8 pt-32 pb-20 w-full">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left: Text content */}
          <div className="animate-fade-in-left">
            {/* Mission badge */}
            <div className="inline-flex items-center gap-2 bg-teal-500/20 backdrop-blur-sm border border-teal-400/30 rounded-full px-4 py-2 text-sm font-medium text-teal-200 mb-8">
              <Sparkles className="w-4 h-4 text-teal-300" />
              Our Mission: World-Class Healthcare for All
            </div>

            {/* Headline */}
            <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-black text-white leading-[1.05] tracking-tight mb-6">
              Pure Care.{' '}
              <span className="block text-gradient-warm">Proper Healing.</span>
              <span className="block text-teal-300">Global Vision.</span>
            </h1>

            {/* Subheadline */}
            <p className="text-lg sm:text-xl text-teal-100/90 leading-relaxed mb-10 max-w-xl">
              We are building a healthcare system that every person in the world can trust —
              grounded in clinical excellence, driven by compassion, and committed to giving
              pure and proper health facilities to all.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <Button
                size="lg"
                onClick={() => navigate({ to: '/select-role' })}
                className="bg-teal-500 hover:bg-teal-400 text-white font-semibold px-8 py-4 h-auto text-base shadow-teal-lg hover:shadow-glow transition-all duration-300 gap-2 group"
              >
                Access Your Portal
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => {
                  const el = document.querySelector('#services');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="border-white/30 text-white hover:bg-white/10 hover:border-white/50 px-8 py-4 h-auto text-base backdrop-blur-sm transition-all duration-300 gap-2"
              >
                <Play className="w-4 h-4" />
                Explore Services
              </Button>
            </div>

            {/* Mission pillars */}
            <div className="flex flex-wrap gap-3">
              {[
                { icon: Shield, text: 'Patient Safety' },
                { icon: Award, text: 'Clinical Excellence' },
                { icon: Globe, text: 'Global Reach' },
                { icon: Heart, text: 'Compassionate Care' },
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

          {/* Right: Visual card stack */}
          <div className="hidden lg:flex flex-col gap-4 animate-fade-in-right">
            {/* Main visual card */}
            <div className="glass-card rounded-3xl p-6 shadow-card-xl">
              <div className="flex items-center gap-4 mb-5">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center shadow-teal">
                  <Heart className="w-7 h-7 text-white fill-white" />
                </div>
                <div>
                  <p className="font-display font-bold text-white text-lg">Our Commitment</p>
                  <p className="text-teal-300 text-sm">To every patient, everywhere</p>
                </div>
              </div>
              <div className="space-y-3">
                {[
                  'Pure and proper healthcare for all',
                  'Evidence-based clinical decisions',
                  'Compassionate, patient-first approach',
                  'Aspiring to set the global standard',
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3 text-sm text-teal-100">
                    <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                    {item}
                  </div>
                ))}
              </div>
            </div>

            {/* Secondary cards row */}
            <div className="grid grid-cols-2 gap-4">
              <div className="glass-card rounded-2xl p-5">
                <div className="w-10 h-10 rounded-xl bg-teal-500/30 flex items-center justify-center mb-3">
                  <Activity className="w-5 h-5 text-teal-300" />
                </div>
                <p className="font-display font-bold text-white text-lg">24/7</p>
                <p className="text-teal-300 text-sm">Emergency Care</p>
              </div>
              <div className="glass-card rounded-2xl p-5">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/30 flex items-center justify-center mb-3">
                  <Zap className="w-5 h-5 text-emerald-300" />
                </div>
                <p className="font-display font-bold text-white text-lg">AI-Powered</p>
                <p className="text-teal-300 text-sm">Symptom Analysis</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-teal-300/60 animate-bounce">
        <span className="text-xs font-medium tracking-widest uppercase">Scroll</span>
        <div className="w-px h-8 bg-gradient-to-b from-teal-300/60 to-transparent" />
      </div>
    </section>
  );
}

// ─── Section: Mission Statement ──────────────────────────────────────────────

function MissionSection() {
  return (
    <section className="py-20 lg:py-28 bg-gradient-to-br from-teal-950 via-teal-900 to-emerald-950 relative overflow-hidden">
      <div className="absolute inset-0 dot-pattern opacity-20 pointer-events-none" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-20 bg-gradient-to-b from-transparent to-teal-500/40" />

      <div className="relative max-w-5xl mx-auto px-6 lg:px-8 text-center">
        <div className="inline-flex items-center gap-2 bg-teal-500/20 border border-teal-400/30 rounded-full px-4 py-2 text-sm font-medium text-teal-300 mb-8">
          <Target className="w-4 h-4" />
          What We Stand For
        </div>

        <h2 className="font-display text-4xl lg:text-5xl font-black text-white mb-6 leading-tight">
          Not just a hospital.{' '}
          <span className="text-gradient">A promise to the world.</span>
        </h2>

        <p className="text-teal-200 text-xl leading-relaxed mb-14 max-w-3xl mx-auto">
          We don't measure our success in numbers. We measure it in lives improved, families
          reassured, and communities strengthened. Our aspiration is to be the healthcare
          system the world deserves.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 stagger-children">
          {[
            {
              icon: Heart,
              title: 'Pure Healthcare',
              desc: 'Uncompromising quality in every diagnosis, treatment, and interaction — because your health deserves nothing less.',
              color: 'from-teal-500/20 to-teal-600/10',
              iconColor: 'text-teal-300',
            },
            {
              icon: Shield,
              title: 'Proper Facilities',
              desc: 'State-of-the-art infrastructure and protocols designed to deliver safe, effective, and dignified care to every patient.',
              color: 'from-emerald-500/20 to-emerald-600/10',
              iconColor: 'text-emerald-300',
            },
            {
              icon: Globe,
              title: 'Global Aspiration',
              desc: 'We aim to set the standard for healthcare worldwide — building a system that every person on earth can rely on.',
              color: 'from-cyan-500/20 to-cyan-600/10',
              iconColor: 'text-cyan-300',
            },
          ].map(({ icon: Icon, title, desc, color, iconColor }) => (
            <div
              key={title}
              className={`animate-fade-in bg-gradient-to-br ${color} border border-white/10 rounded-2xl p-7 text-left card-hover`}
            >
              <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center mb-5">
                <Icon className={`w-6 h-6 ${iconColor}`} />
              </div>
              <h3 className="font-display font-bold text-white text-xl mb-3">{title}</h3>
              <p className="text-teal-200/80 text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Section: Services ───────────────────────────────────────────────────────

function ServicesSection() {
  const navigate = useNavigate();

  const services = [
    {
      icon: Activity,
      title: 'Emergency Care',
      desc: 'Round-the-clock emergency response with rapid triage, critical care specialists, and life-saving interventions.',
      color: 'bg-red-50 dark:bg-red-950/20',
      iconBg: 'bg-red-100 dark:bg-red-900/30',
      iconColor: 'text-red-600 dark:text-red-400',
      badge: '24/7',
    },
    {
      icon: Heart,
      title: 'Cardiology',
      desc: 'Comprehensive heart care from preventive screenings to advanced interventional procedures and cardiac rehabilitation.',
      color: 'bg-pink-50 dark:bg-pink-950/20',
      iconBg: 'bg-pink-100 dark:bg-pink-900/30',
      iconColor: 'text-pink-600 dark:text-pink-400',
      badge: 'Specialist',
    },
    {
      icon: Brain,
      title: 'Neurology',
      desc: 'Expert neurological care for brain, spine, and nervous system conditions with cutting-edge diagnostic technology.',
      color: 'bg-purple-50 dark:bg-purple-950/20',
      iconBg: 'bg-purple-100 dark:bg-purple-900/30',
      iconColor: 'text-purple-600 dark:text-purple-400',
      badge: 'Advanced',
    },
    {
      icon: Baby,
      title: 'Pediatrics',
      desc: 'Gentle, specialized care for children from newborns to adolescents, with a child-friendly environment.',
      color: 'bg-blue-50 dark:bg-blue-950/20',
      iconBg: 'bg-blue-100 dark:bg-blue-900/30',
      iconColor: 'text-blue-600 dark:text-blue-400',
      badge: 'Child-Safe',
    },
    {
      icon: Bone,
      title: 'Orthopedics',
      desc: 'Comprehensive musculoskeletal care including joint replacement, sports medicine, and rehabilitation programs.',
      color: 'bg-orange-50 dark:bg-orange-950/20',
      iconBg: 'bg-orange-100 dark:bg-orange-900/30',
      iconColor: 'text-orange-600 dark:text-orange-400',
      badge: 'Surgical',
    },
    {
      icon: Stethoscope,
      title: 'General Medicine',
      desc: 'Holistic primary care and preventive medicine for all ages, focusing on long-term health and wellness.',
      color: 'bg-teal-50 dark:bg-teal-950/20',
      iconBg: 'bg-teal-100 dark:bg-teal-900/30',
      iconColor: 'text-teal-600 dark:text-teal-400',
      badge: 'Primary',
    },
  ];

  return (
    <section id="services" className="py-20 lg:py-28 bg-background">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 bg-teal-50 dark:bg-teal-900/30 border border-teal-200 dark:border-teal-700/50 rounded-full px-4 py-2 text-sm font-medium text-teal-700 dark:text-teal-300 mb-5">
            <Stethoscope className="w-4 h-4" />
            Our Specialties
          </div>
          <h2 className="font-display text-4xl lg:text-5xl font-black text-foreground mb-4">
            Comprehensive Care,{' '}
            <span className="text-gradient">Every Specialty</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
            From emergency response to specialized treatment, our departments are staffed by
            dedicated professionals committed to your recovery and wellbeing.
          </p>
        </div>

        {/* Services grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 stagger-children">
          {services.map(({ icon: Icon, title, desc, color, iconBg, iconColor, badge }) => (
            <div
              key={title}
              className={`animate-fade-in ${color} border border-border rounded-2xl p-7 card-hover group cursor-pointer`}
              onClick={() => navigate({ to: '/select-role' })}
            >
              <div className="flex items-start justify-between mb-5">
                <div className={`w-12 h-12 rounded-xl ${iconBg} flex items-center justify-center`}>
                  <Icon className={`w-6 h-6 ${iconColor}`} />
                </div>
                <Badge variant="secondary" className="text-xs font-medium">
                  {badge}
                </Badge>
              </div>
              <h3 className="font-display font-bold text-foreground text-xl mb-2">{title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed mb-4">{desc}</p>
              <div className="flex items-center gap-1.5 text-sm font-medium text-teal-600 dark:text-teal-400 group-hover:gap-2.5 transition-all duration-200">
                Learn more <ChevronRight className="w-4 h-4" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Section: Doctors ────────────────────────────────────────────────────────

function DoctorsSection() {
  const { data: doctors, isLoading } = useGetAllDoctorsPublic();

  return (
    <section id="doctors" className="py-20 lg:py-28 bg-teal-50/50 dark:bg-teal-950/30">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 bg-teal-100 dark:bg-teal-900/40 border border-teal-200 dark:border-teal-700/50 rounded-full px-4 py-2 text-sm font-medium text-teal-700 dark:text-teal-300 mb-5">
            <Users className="w-4 h-4" />
            Our Medical Team
          </div>
          <h2 className="font-display text-4xl lg:text-5xl font-black text-foreground mb-4">
            Meet the Doctors{' '}
            <span className="text-gradient">Behind the Care</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
            Our physicians are the heart of VitalsAI — each one dedicated to delivering
            compassionate, evidence-based care to every patient they serve.
          </p>
        </div>

        {/* Loading state */}
        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-card border border-border rounded-2xl p-6 animate-pulse">
                <div className="w-16 h-16 rounded-2xl bg-muted mb-4 shimmer" />
                <div className="h-5 bg-muted rounded-lg mb-2 shimmer" />
                <div className="h-4 bg-muted rounded-lg w-2/3 shimmer" />
              </div>
            ))}
          </div>
        )}

        {/* Doctors grid */}
        {!isLoading && doctors && doctors.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 stagger-children">
            {doctors.map((doctor) => (
              <div
                key={doctor.id.toString()}
                className="animate-fade-in bg-card border border-border rounded-2xl p-6 card-hover group"
              >
                {/* Avatar */}
                <div className="relative mb-4">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center shadow-teal">
                    <span className="text-white font-display font-bold text-xl">
                      {doctor.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div
                    className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-card ${
                      doctor.available ? 'bg-emerald-500' : 'bg-red-400'
                    }`}
                  />
                </div>

                {/* Info */}
                <h3 className="font-display font-bold text-foreground text-base mb-1">
                  Dr. {doctor.name}
                </h3>
                <span
                  className={`inline-block text-xs font-medium px-2.5 py-1 rounded-full mb-3 ${departmentColor(doctor.department)}`}
                >
                  {departmentLabel(doctor.department)}
                </span>
                <div className="flex items-center gap-1.5 text-xs font-medium">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      doctor.available ? 'bg-emerald-500' : 'bg-red-400'
                    }`}
                  />
                  <span
                    className={
                      doctor.available
                        ? 'text-emerald-600 dark:text-emerald-400'
                        : 'text-red-500 dark:text-red-400'
                    }
                  >
                    {doctor.available ? 'Available' : 'Busy'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty state */}
        {!isLoading && (!doctors || doctors.length === 0) && (
          <div className="text-center py-16">
            <div className="w-16 h-16 rounded-2xl bg-teal-100 dark:bg-teal-900/40 flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-teal-500" />
            </div>
            <h3 className="font-display font-bold text-foreground text-xl mb-2">
              Building Our Team
            </h3>
            <p className="text-muted-foreground text-sm max-w-sm mx-auto">
              Our medical team is growing. Doctors will appear here once they join the platform.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

// ─── Section: Why Choose Us ──────────────────────────────────────────────────

function WhyUsSection() {
  const reasons = [
    {
      icon: Zap,
      title: 'AI-Assisted Diagnosis',
      desc: 'Our intelligent symptom checker helps you understand your health before you even step into a clinic.',
    },
    {
      icon: Clock,
      title: 'Always Available',
      desc: 'Emergency care and support available 24 hours a day, 7 days a week — because health emergencies don\'t wait.',
    },
    {
      icon: Shield,
      title: 'Safe & Confidential',
      desc: 'Your health data is protected with the highest standards of privacy and security at every step.',
    },
    {
      icon: TrendingUp,
      title: 'Continuous Improvement',
      desc: 'We constantly evolve our practices, technology, and facilities to deliver better outcomes for every patient.',
    },
    {
      icon: Lightbulb,
      title: 'Innovative Approach',
      desc: 'Combining modern medical science with compassionate care to create a healthcare experience that truly works.',
    },
    {
      icon: Globe,
      title: 'Built for Everyone',
      desc: 'Designed to be accessible, inclusive, and effective for patients from all walks of life and all corners of the world.',
    },
  ];

  return (
    <section id="about" className="py-20 lg:py-28 bg-background">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-14 lg:gap-20 items-center">
          {/* Left: Image + accent */}
          <div className="relative">
            <div className="relative rounded-3xl overflow-hidden shadow-card-xl">
              <img
                src="/assets/generated/global-reach.dim_800x800.png"
                alt="Global healthcare reach"
                className="w-full h-auto object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-teal-950/60 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6">
                <div className="glass-card rounded-2xl p-5">
                  <p className="font-display font-bold text-white text-lg mb-1">
                    Our Vision
                  </p>
                  <p className="text-teal-200 text-sm leading-relaxed">
                    "To be the healthcare system the world deserves — pure, proper, and
                    accessible to every human being."
                  </p>
                </div>
              </div>
            </div>

            {/* Floating accent card */}
            <div className="absolute -top-5 -right-5 bg-teal-600 rounded-2xl p-5 shadow-teal-lg animate-float hidden xl:block">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                  <Star className="w-5 h-5 text-white fill-white" />
                </div>
                <div>
                  <p className="font-display font-bold text-white text-sm">Our Aspiration</p>
                  <p className="text-teal-200 text-xs">Global standard in patient care</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Reasons */}
          <div>
            <div className="inline-flex items-center gap-2 bg-teal-50 dark:bg-teal-900/30 border border-teal-200 dark:border-teal-700/50 rounded-full px-4 py-2 text-sm font-medium text-teal-700 dark:text-teal-300 mb-6">
              <Award className="w-4 h-4" />
              Why VitalsAI
            </div>
            <h2 className="font-display text-4xl lg:text-5xl font-black text-foreground mb-5 leading-tight">
              Healthcare that{' '}
              <span className="text-gradient">puts you first</span>
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed mb-10">
              We believe every person deserves access to world-class healthcare. That belief
              shapes everything we do — from how we train our doctors to how we design our
              facilities.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 stagger-children">
              {reasons.map(({ icon: Icon, title, desc }) => (
                <div key={title} className="animate-fade-in flex gap-4">
                  <div className="w-10 h-10 rounded-xl bg-teal-100 dark:bg-teal-900/40 flex items-center justify-center shrink-0 mt-0.5">
                    <Icon className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                  </div>
                  <div>
                    <h4 className="font-display font-semibold text-foreground text-sm mb-1">
                      {title}
                    </h4>
                    <p className="text-muted-foreground text-xs leading-relaxed">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Section: AI Symptom Checker CTA ─────────────────────────────────────────

function SymptomCheckerCTA() {
  const navigate = useNavigate();

  return (
    <section className="py-20 lg:py-24 bg-gradient-to-br from-teal-600 via-teal-700 to-emerald-700 relative overflow-hidden">
      <div className="absolute inset-0 dot-pattern opacity-20 pointer-events-none" />
      <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-white/5 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-emerald-400/10 blur-3xl pointer-events-none" />

      <div className="relative max-w-4xl mx-auto px-6 lg:px-8 text-center">
        <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 text-sm font-medium text-teal-100 mb-7">
          <Zap className="w-4 h-4 text-yellow-300" />
          AI-Powered Health Tool
        </div>
        <h2 className="font-display text-4xl lg:text-5xl font-black text-white mb-5 leading-tight">
          Not sure what's wrong?{' '}
          <span className="text-teal-200">Let AI help.</span>
        </h2>
        <p className="text-teal-100 text-xl leading-relaxed mb-10 max-w-2xl mx-auto">
          Describe your symptoms and our intelligent checker will provide guidance on possible
          conditions and next steps — helping you make informed decisions about your health.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            size="lg"
            onClick={() => navigate({ to: '/patient' })}
            className="bg-white text-teal-700 hover:bg-teal-50 font-semibold px-8 py-4 h-auto text-base shadow-lg hover:shadow-xl transition-all duration-300 gap-2 group"
          >
            Try Symptom Checker
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Button>
          <Button
            variant="outline"
            size="lg"
            onClick={() => navigate({ to: '/select-role' })}
            className="border-white/30 text-white hover:bg-white/10 hover:border-white/50 px-8 py-4 h-auto text-base transition-all duration-300"
          >
            Access Patient Portal
          </Button>
        </div>
      </div>
    </section>
  );
}

// ─── Section: How It Works ───────────────────────────────────────────────────

function HowItWorksSection() {
  const navigate = useNavigate();

  const steps = [
    {
      step: '01',
      icon: Users,
      title: 'Register & Access',
      desc: 'Create your patient profile and gain secure access to your personal health portal in minutes.',
      color: 'from-teal-500 to-teal-600',
    },
    {
      step: '02',
      icon: Stethoscope,
      title: 'Consult & Diagnose',
      desc: 'Use our AI symptom checker or connect with our qualified doctors for professional medical guidance.',
      color: 'from-emerald-500 to-emerald-600',
    },
    {
      step: '03',
      icon: Heart,
      title: 'Heal & Recover',
      desc: 'Follow your personalized care plan with ongoing support from our dedicated medical team.',
      color: 'from-cyan-500 to-cyan-600',
    },
  ];

  return (
    <section className="py-20 lg:py-28 bg-teal-50/50 dark:bg-teal-950/20">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 bg-teal-100 dark:bg-teal-900/40 border border-teal-200 dark:border-teal-700/50 rounded-full px-4 py-2 text-sm font-medium text-teal-700 dark:text-teal-300 mb-5">
            <CheckCircle className="w-4 h-4" />
            Simple Process
          </div>
          <h2 className="font-display text-4xl lg:text-5xl font-black text-foreground mb-4">
            Your health journey,{' '}
            <span className="text-gradient">simplified</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
            Getting the care you need should be straightforward. Here's how VitalsAI makes
            quality healthcare accessible and easy to navigate.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative stagger-children">
          {/* Connector line */}
          <div className="hidden md:block absolute top-16 left-1/3 right-1/3 h-px bg-gradient-to-r from-teal-300 via-emerald-300 to-cyan-300 dark:from-teal-700 dark:via-emerald-700 dark:to-cyan-700" />

          {steps.map(({ step, icon: Icon, title, desc, color }) => (
            <div key={step} className="animate-fade-in text-center group">
              <div className="relative inline-flex mb-6">
                <div
                  className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center shadow-teal-lg group-hover:shadow-glow transition-shadow duration-300`}
                >
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-teal-950 dark:bg-teal-900 border-2 border-teal-400 flex items-center justify-center">
                  <span className="text-teal-300 text-xs font-bold">{step}</span>
                </div>
              </div>
              <h3 className="font-display font-bold text-foreground text-xl mb-3">{title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed max-w-xs mx-auto">{desc}</p>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button
            size="lg"
            onClick={() => navigate({ to: '/select-role' })}
            className="bg-teal-600 hover:bg-teal-700 text-white font-semibold px-8 py-4 h-auto text-base shadow-teal hover:shadow-teal-lg transition-all duration-300 gap-2 group"
          >
            Begin Your Journey
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>
    </section>
  );
}

// ─── Section: Contact ────────────────────────────────────────────────────────

function ContactSection() {
  return (
    <section id="contact" className="py-20 lg:py-28 bg-background">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 bg-teal-50 dark:bg-teal-900/30 border border-teal-200 dark:border-teal-700/50 rounded-full px-4 py-2 text-sm font-medium text-teal-700 dark:text-teal-300 mb-5">
            <MapPin className="w-4 h-4" />
            Find Us
          </div>
          <h2 className="font-display text-4xl lg:text-5xl font-black text-foreground mb-4">
            We're here{' '}
            <span className="text-gradient">when you need us</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
            Whether it's an emergency or a routine consultation, our team is ready to help.
            Reach out through any of the channels below.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
          {[
            {
              icon: Phone,
              title: 'Emergency Hotline',
              value: '1800-000-0000',
              sub: 'Toll-free, available 24/7',
              href: 'tel:+911800000000',
              color: 'bg-red-50 dark:bg-red-950/20 border-red-100 dark:border-red-900/30',
              iconBg: 'bg-red-100 dark:bg-red-900/30',
              iconColor: 'text-red-600 dark:text-red-400',
            },
            {
              icon: Mail,
              title: 'Email Us',
              value: 'care@vitalsai.health',
              sub: 'We respond within 24 hours',
              href: 'mailto:care@vitalsai.health',
              color: 'bg-teal-50 dark:bg-teal-950/20 border-teal-100 dark:border-teal-900/30',
              iconBg: 'bg-teal-100 dark:bg-teal-900/30',
              iconColor: 'text-teal-600 dark:text-teal-400',
            },
            {
              icon: MapPin,
              title: 'Our Location',
              value: 'Medical District',
              sub: 'Healthcare Avenue, City Center',
              href: '#',
              color: 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-100 dark:border-emerald-900/30',
              iconBg: 'bg-emerald-100 dark:bg-emerald-900/30',
              iconColor: 'text-emerald-600 dark:text-emerald-400',
            },
          ].map(({ icon: Icon, title, value, sub, href, color, iconBg, iconColor }) => (
            <a
              key={title}
              href={href}
              className={`${color} border rounded-2xl p-7 card-hover flex items-start gap-5 group`}
            >
              <div className={`w-12 h-12 rounded-xl ${iconBg} flex items-center justify-center shrink-0`}>
                <Icon className={`w-6 h-6 ${iconColor}`} />
              </div>
              <div>
                <p className="text-muted-foreground text-sm mb-1">{title}</p>
                <p className="font-display font-bold text-foreground text-lg leading-tight">{value}</p>
                <p className="text-muted-foreground text-xs mt-1">{sub}</p>
              </div>
            </a>
          ))}
        </div>

        {/* Decorative map placeholder */}
        <div className="relative rounded-3xl overflow-hidden bg-teal-50 dark:bg-teal-950/30 border border-teal-100 dark:border-teal-800/50 h-64 lg:h-80 flex items-center justify-center">
          <div className="absolute inset-0 grid-pattern opacity-40" />
          <div className="relative text-center">
            <div className="w-16 h-16 rounded-2xl bg-teal-600 flex items-center justify-center mx-auto mb-4 shadow-teal-lg animate-pulse-ring">
              <MapPin className="w-8 h-8 text-white" />
            </div>
            <p className="font-display font-bold text-teal-800 dark:text-teal-200 text-xl mb-1">
              Medical District
            </p>
            <p className="text-teal-600 dark:text-teal-400 text-sm">
              Healthcare Avenue, City Center
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Main Export ─────────────────────────────────────────────────────────────

export default function HomePage() {
  return (
    <main>
      <HeroSection />
      <MissionSection />
      <ServicesSection />
      <DoctorsSection />
      <WhyUsSection />
      <SymptomCheckerCTA />
      <HowItWorksSection />
      <ContactSection />
    </main>
  );
}
