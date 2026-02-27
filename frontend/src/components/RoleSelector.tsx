import React from 'react';
import { useNavigate } from '@tanstack/react-router';
import { User, Stethoscope, Shield, ArrowRight, CheckCircle, Heart, Sparkles } from 'lucide-react';

const roles = [
  {
    id: 'patient',
    icon: User,
    title: 'Patient Portal',
    subtitle: 'Your health, your journey',
    description: 'Register, submit emergency cases, and use our AI-powered symptom checker to get the care you need.',
    features: ['Emergency SOS submission', 'AI Symptom Checker', 'Secure patient registration', 'Real-time case tracking'],
    cta: 'Enter as Patient',
    path: '/patient',
    gradient: 'gradient-teal-cyan',
    bg: 'bg-gradient-to-br from-teal-50 to-cyan-50',
    border: 'border-teal-200',
    titleColor: 'text-teal-700',
    checkColor: 'text-teal-500',
    shadow: 'shadow-teal',
    hoverShadow: 'hover:shadow-teal-lg',
    badgeBg: 'bg-teal-100 text-teal-700 border-teal-200',
  },
  {
    id: 'doctor',
    icon: Stethoscope,
    title: 'Doctor Portal',
    subtitle: 'Serve with excellence',
    description: 'Log in to manage your availability, view assigned cases, and coordinate with the care team.',
    features: ['Availability management', 'Case assignment view', 'Department coordination', 'Patient care tracking'],
    cta: 'Enter as Doctor',
    path: '/doctor',
    gradient: 'gradient-coral-rose',
    bg: 'bg-gradient-to-br from-coral-50 to-rose-50',
    border: 'border-coral-200',
    titleColor: 'text-coral-700',
    checkColor: 'text-coral-500',
    shadow: 'shadow-coral',
    hoverShadow: 'hover:shadow-coral-lg',
    badgeBg: 'bg-coral-100 text-coral-700 border-coral-200',
  },
  {
    id: 'admin',
    icon: Shield,
    title: 'Admin Portal',
    subtitle: 'Manage with precision',
    description: 'Oversee all doctors, emergency cases, and system operations from a unified dashboard.',
    features: ['Doctor management', 'Emergency case oversight', 'System administration', 'Real-time monitoring'],
    cta: 'Enter as Admin',
    path: '/admin',
    gradient: 'gradient-violet-purple',
    bg: 'bg-gradient-to-br from-violet-50 to-purple-50',
    border: 'border-violet-200',
    titleColor: 'text-violet-700',
    checkColor: 'text-violet-500',
    shadow: 'shadow-violet',
    hoverShadow: 'hover:shadow-violet-lg',
    badgeBg: 'bg-violet-100 text-violet-700 border-violet-200',
  },
];

export default function RoleSelector() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen relative overflow-hidden py-20 px-4">
      {/* Animated background */}
      <div className="absolute inset-0 mesh-pattern" />
      <div className="absolute top-20 left-10 w-72 h-72 rounded-full bg-teal-200/30 animate-blob blur-3xl" />
      <div className="absolute bottom-20 right-10 w-80 h-80 rounded-full bg-violet-200/25 animate-blob blur-3xl" style={{ animationDelay: '4s' }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-coral-200/20 animate-blob blur-3xl" style={{ animationDelay: '8s' }} />

      <div className="relative z-10 max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-14 animate-fade-in">
          <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-teal-200 rounded-full px-5 py-2.5 mb-6 shadow-teal-sm">
            <Sparkles className="w-4 h-4 text-coral-500" />
            <span className="text-teal-700 text-sm font-bold">Choose Your Portal</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-display font-black text-slate-800 mb-4 leading-tight">
            How are you accessing{' '}
            <span className="text-gradient">Vitals AI</span>?
          </h1>
          <p className="text-slate-500 text-lg max-w-xl mx-auto font-medium">
            Select your role to enter the right portal. Each portal is tailored to your specific needs.
          </p>
        </div>

        {/* Role Cards */}
        <div className="grid md:grid-cols-3 gap-8 stagger-children">
          {roles.map((role) => (
            <div
              key={role.id}
              className={`rounded-3xl border-2 ${role.border} ${role.bg} overflow-hidden shadow-card card-hover-lift flex flex-col`}
            >
              {/* Gradient top bar */}
              <div className={`h-2 ${role.gradient}`} />

              {/* Card Header */}
              <div className="px-7 pt-7 pb-5">
                <div className={`w-16 h-16 rounded-2xl ${role.gradient} flex items-center justify-center mb-5 shadow-card`}>
                  <role.icon className="w-8 h-8 text-white" />
                </div>
                <h2 className={`text-xl font-black ${role.titleColor} mb-1`}>{role.title}</h2>
                <p className="text-slate-500 text-sm font-semibold">{role.subtitle}</p>
              </div>

              {/* Card Body */}
              <div className="px-7 pb-7 flex-1 flex flex-col">
                <p className="text-slate-600 text-sm leading-relaxed mb-5 font-medium">{role.description}</p>

                {/* Features */}
                <ul className="space-y-2.5 mb-7 flex-1">
                  {role.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2.5 text-sm">
                      <CheckCircle className={`w-4 h-4 flex-shrink-0 ${role.checkColor}`} />
                      <span className="text-slate-600 font-medium">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
                <button
                  onClick={() => navigate({ to: role.path as '/' })}
                  className={`w-full ${role.gradient} text-white font-bold py-3.5 px-4 rounded-2xl transition-all duration-300 flex items-center justify-center gap-2 ${role.shadow} ${role.hoverShadow} hover:scale-105`}
                >
                  {role.cta}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Footer note */}
        <div className="text-center mt-12 animate-fade-in">
          <div className="inline-flex items-center gap-2 text-slate-400 text-sm font-medium">
            <Heart className="w-4 h-4 text-coral-400 fill-coral-400" />
            Aspiring to be trusted by every patient, everywhere.
          </div>
        </div>
      </div>
    </div>
  );
}
