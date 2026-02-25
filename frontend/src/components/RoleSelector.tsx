import React from 'react';
import { useNavigate } from '@tanstack/react-router';
import { UserCircle, Stethoscope, ShieldCheck, ArrowRight, ArrowLeft, Activity } from 'lucide-react';
import { Button } from '@/components/ui/button';

const roles = [
  {
    key: 'patient',
    path: '/patient',
    icon: UserCircle,
    title: 'Patient Portal',
    description:
      'Register your profile, submit emergency SOS alerts, and get AI-powered symptom guidance instantly.',
    gradient: 'from-teal-500 to-teal-600',
    lightBg: 'bg-teal-50 dark:bg-teal-900/20',
    iconColor: 'text-teal-600 dark:text-teal-400',
    btnClass: 'bg-teal-600 hover:bg-teal-700 text-white',
    features: ['Emergency SOS', 'Symptom Checker', 'Medicine Suggestions'],
  },
  {
    key: 'doctor',
    path: '/doctor',
    icon: Stethoscope,
    title: 'Doctor Portal',
    description:
      'Log in with your name and department, toggle your availability, and manage assigned emergency cases.',
    gradient: 'from-emerald-500 to-emerald-600',
    lightBg: 'bg-emerald-50 dark:bg-emerald-900/20',
    iconColor: 'text-emerald-600 dark:text-emerald-400',
    btnClass: 'bg-emerald-600 hover:bg-emerald-700 text-white',
    features: ['Case Management', 'Availability Toggle', 'Patient Overview'],
  },
  {
    key: 'admin',
    path: '/admin',
    icon: ShieldCheck,
    title: 'Admin Portal',
    description:
      'Manage doctors, departments, and oversee all emergency cases from a centralized dashboard.',
    gradient: 'from-cyan-600 to-teal-700',
    lightBg: 'bg-cyan-50 dark:bg-cyan-900/20',
    iconColor: 'text-cyan-700 dark:text-cyan-400',
    btnClass: 'bg-cyan-700 hover:bg-cyan-800 text-white',
    features: ['Doctor Management', 'Case Assignment', 'Analytics Dashboard'],
  },
];

export default function RoleSelector() {
  const navigate = useNavigate();

  return (
    <div className="min-h-[calc(100vh-8rem)] bg-gradient-to-b from-teal-50/60 to-white dark:from-teal-950/20 dark:to-background py-16 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Back button */}
        <button
          onClick={() => navigate({ to: '/' })}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-teal-600 dark:text-muted-foreground dark:hover:text-teal-400 mb-8 transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          Back to Home
        </button>

        {/* Header */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 bg-teal-100 dark:bg-teal-900/40 text-teal-700 dark:text-teal-300 rounded-full px-4 py-1.5 text-sm font-semibold mb-5">
            <Activity className="w-4 h-4" />
            Vitals AI
          </div>
          <h1 className="font-heading text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-foreground mb-4">
            Select Your Role
          </h1>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Choose the portal that matches your role to access your personalized healthcare dashboard.
          </p>
        </div>

        {/* Role Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {roles.map((role) => (
            <div
              key={role.key}
              className="group bg-white dark:bg-card rounded-3xl shadow-md hover:shadow-2xl border border-gray-100 dark:border-border overflow-hidden transition-all duration-300 hover:-translate-y-2 cursor-pointer flex flex-col"
              onClick={() => navigate({ to: role.path as '/patient' | '/doctor' | '/admin' })}
            >
              {/* Card top gradient bar */}
              <div className={`h-2 bg-gradient-to-r ${role.gradient}`} />

              <div className="p-8 flex flex-col flex-1">
                {/* Icon */}
                <div className={`w-16 h-16 rounded-2xl ${role.lightBg} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <role.icon className={`w-8 h-8 ${role.iconColor}`} />
                </div>

                {/* Title & Description */}
                <h2 className="font-heading text-2xl font-bold text-gray-900 dark:text-foreground mb-3">
                  {role.title}
                </h2>
                <p className="text-gray-500 dark:text-muted-foreground text-sm leading-relaxed mb-6">
                  {role.description}
                </p>

                {/* Feature list */}
                <ul className="space-y-2 mb-8 flex-1">
                  {role.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-sm text-gray-600 dark:text-muted-foreground">
                      <div className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${role.gradient}`} />
                      {feature}
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
                <Button
                  className={`w-full ${role.btnClass} font-semibold rounded-xl py-5 text-base shadow-sm group-hover:shadow-md transition-shadow`}
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate({ to: role.path as '/patient' | '/doctor' | '/admin' });
                  }}
                >
                  Enter {role.title.split(' ')[0]} Portal
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom note */}
        <p className="text-center text-xs text-gray-400 dark:text-muted-foreground mt-10">
          Vitals AI — Authorized access only. All activity is monitored and secured.
        </p>
      </div>
    </div>
  );
}
