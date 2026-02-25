import React from 'react';
import { useNavigate } from '@tanstack/react-router';
import {
  User,
  Stethoscope,
  Shield,
  ArrowRight,
  Heart,
  Activity,
  CheckCircle,
  Sparkles,
  Globe,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface RoleCardProps {
  icon: React.ElementType;
  title: string;
  subtitle: string;
  description: string;
  features: string[];
  path: string;
  gradient: string;
  iconBg: string;
  iconColor: string;
  accentColor: string;
  badge?: string;
}

function RoleCard({
  icon: Icon,
  title,
  subtitle,
  description,
  features,
  path,
  gradient,
  iconBg,
  iconColor,
  accentColor,
  badge,
}: RoleCardProps) {
  const navigate = useNavigate();

  return (
    <div
      className={`relative bg-card border border-border rounded-3xl overflow-hidden card-hover group cursor-pointer shadow-card hover:shadow-card-xl transition-all duration-300`}
      onClick={() => navigate({ to: path })}
    >
      {/* Gradient header */}
      <div className={`${gradient} p-8 pb-6 relative overflow-hidden`}>
        <div className="absolute inset-0 dot-pattern opacity-20" />
        {badge && (
          <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full px-3 py-1 text-xs font-semibold text-white">
            {badge}
          </div>
        )}
        <div className={`relative w-14 h-14 rounded-2xl ${iconBg} flex items-center justify-center mb-5 shadow-lg`}>
          <Icon className={`w-7 h-7 ${iconColor}`} />
        </div>
        <h3 className="font-display font-black text-white text-2xl mb-1 relative">{title}</h3>
        <p className={`text-sm font-medium relative ${accentColor}`}>{subtitle}</p>
      </div>

      {/* Content */}
      <div className="p-8 pt-6">
        <p className="text-muted-foreground text-sm leading-relaxed mb-6">{description}</p>

        <ul className="space-y-2.5 mb-7">
          {features.map((feature) => (
            <li key={feature} className="flex items-center gap-3 text-sm text-foreground">
              <CheckCircle className="w-4 h-4 text-teal-500 shrink-0" />
              {feature}
            </li>
          ))}
        </ul>

        <Button
          className="w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold gap-2 group-hover:gap-3 transition-all duration-200 h-11"
          onClick={(e) => {
            e.stopPropagation();
            navigate({ to: path });
          }}
        >
          Enter {title}
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Button>
      </div>
    </div>
  );
}

export default function RoleSelector() {
  const roles: RoleCardProps[] = [
    {
      icon: User,
      title: 'Patient',
      subtitle: 'Personal Health Portal',
      description:
        'Access your health records, use our AI symptom checker, submit emergency cases, and connect with our medical team — all in one secure place.',
      features: [
        'AI-powered symptom checker',
        'Emergency SOS submission',
        'Secure health records',
        'Doctor consultation access',
      ],
      path: '/patient',
      gradient: 'bg-gradient-to-br from-teal-600 to-teal-800',
      iconBg: 'bg-white/20',
      iconColor: 'text-white',
      accentColor: 'text-teal-200',
      badge: 'For Patients',
    },
    {
      icon: Stethoscope,
      title: 'Doctor',
      subtitle: 'Medical Professional Portal',
      description:
        'Manage your availability, view assigned emergency cases, and coordinate with the care team to deliver the best outcomes for your patients.',
      features: [
        'Availability management',
        'Emergency case dashboard',
        'Patient case coordination',
        'Department-specific view',
      ],
      path: '/doctor',
      gradient: 'bg-gradient-to-br from-emerald-600 to-emerald-800',
      iconBg: 'bg-white/20',
      iconColor: 'text-white',
      accentColor: 'text-emerald-200',
      badge: 'For Doctors',
    },
    {
      icon: Shield,
      title: 'Admin',
      subtitle: 'Hospital Administration',
      description:
        'Oversee hospital operations, manage the medical team, monitor emergency cases, and ensure the highest standards of care are maintained.',
      features: [
        'Doctor management',
        'Emergency case oversight',
        'Hospital operations control',
        'Real-time monitoring',
      ],
      path: '/admin',
      gradient: 'bg-gradient-to-br from-cyan-700 to-teal-900',
      iconBg: 'bg-white/20',
      iconColor: 'text-white',
      accentColor: 'text-cyan-200',
      badge: 'Admin Only',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-950 via-teal-900 to-emerald-950 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 dot-pattern opacity-20 pointer-events-none" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-teal-500/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />

      <div className="relative max-w-6xl mx-auto px-6 lg:px-8 py-20 lg:py-28">
        {/* Header */}
        <div className="text-center mb-14 animate-fade-in">
          <div className="inline-flex items-center gap-2 bg-teal-500/20 border border-teal-400/30 rounded-full px-4 py-2 text-sm font-medium text-teal-300 mb-7">
            <Sparkles className="w-4 h-4" />
            VitalsAI Healthcare Platform
          </div>
          <h1 className="font-display text-5xl lg:text-6xl font-black text-white mb-5 leading-tight">
            Choose Your{' '}
            <span className="text-gradient">Portal</span>
          </h1>
          <p className="text-teal-200 text-xl max-w-2xl mx-auto leading-relaxed">
            Select the portal that matches your role to access the tools and information
            designed specifically for you.
          </p>
        </div>

        {/* Role cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 stagger-children">
          {roles.map((role) => (
            <div key={role.title} className="animate-fade-in">
              <RoleCard {...role} />
            </div>
          ))}
        </div>

        {/* Bottom note */}
        <div className="text-center mt-12 animate-fade-in">
          <div className="inline-flex items-center gap-3 bg-white/5 border border-white/10 rounded-2xl px-6 py-4">
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-teal-400" />
              <span className="text-teal-300 text-sm font-medium">
                Committed to world-class healthcare for every patient, everywhere.
              </span>
            </div>
            <div className="w-px h-4 bg-teal-700" />
            <div className="flex items-center gap-1.5">
              <Heart className="w-4 h-4 text-teal-400 fill-teal-400" />
              <Activity className="w-4 h-4 text-emerald-400 animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
