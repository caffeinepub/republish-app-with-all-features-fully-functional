import React from 'react';
import { useNavigate } from '@tanstack/react-router';
import {
  Heart,
  Phone,
  Mail,
  MapPin,
  Clock,
  ArrowRight,
  Activity,
  Shield,
  Globe,
  Stethoscope,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Footer() {
  const navigate = useNavigate();
  const year = new Date().getFullYear();
  const hostname = typeof window !== 'undefined' ? window.location.hostname : 'vitalsai';

  const departments = [
    'Emergency Care',
    'Cardiology',
    'Neurology',
    'Pediatrics',
    'Orthopedics',
    'General Medicine',
  ];

  const portalLinks = [
    { label: 'Patient Portal', path: '/patient' },
    { label: 'Doctor Portal', path: '/doctor' },
    { label: 'Admin Portal', path: '/admin' },
  ];

  const values = [
    { icon: Shield, label: 'Patient Safety First' },
    { icon: Activity, label: 'Evidence-Based Care' },
    { icon: Globe, label: 'Accessible to All' },
    { icon: Stethoscope, label: 'Clinical Excellence' },
  ];

  return (
    <footer className="bg-teal-950 text-teal-100">
      {/* Mission CTA Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-teal-800 via-teal-700 to-emerald-800">
        <div className="absolute inset-0 dot-pattern opacity-20" />
        <div className="relative max-w-7xl mx-auto px-6 lg:px-8 py-14 lg:py-18">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="text-center lg:text-left max-w-2xl">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 text-sm font-medium text-teal-100 mb-4">
                <Globe className="w-4 h-4 text-teal-300" />
                Our Global Mission
              </div>
              <h2 className="font-display text-3xl lg:text-4xl font-bold text-white mb-3 leading-tight">
                Aspiring to be trusted by{' '}
                <span className="text-teal-300">every patient, everywhere</span>
              </h2>
              <p className="text-teal-200 text-lg leading-relaxed">
                Our mission is simple: give every person access to pure, proper, and world-class
                healthcare — regardless of where they are.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 shrink-0">
              <Button
                onClick={() => navigate({ to: '/select-role' })}
                className="bg-white text-teal-800 hover:bg-teal-50 font-semibold px-6 py-3 h-auto shadow-lg hover:shadow-xl transition-all duration-300 gap-2"
              >
                Access Portal
                <ArrowRight className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                className="border-white/30 text-white hover:bg-white/10 hover:border-white/50 px-6 py-3 h-auto transition-all duration-300"
                onClick={() => {
                  const el = document.querySelector('#contact');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                Contact Us
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main footer content */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">
          {/* Brand column */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center shadow-teal">
                <Heart className="w-5 h-5 text-white fill-white" />
              </div>
              <div className="flex flex-col leading-none">
                <span className="font-display font-bold text-lg text-white tracking-tight">
                  Vitals<span className="text-teal-400">AI</span>
                </span>
                <span className="text-2xs text-teal-400 font-medium tracking-widest uppercase">
                  Healthcare
                </span>
              </div>
            </div>
            <p className="text-teal-300 text-sm leading-relaxed mb-6">
              Giving pure and proper health facilities to every individual — our commitment to
              world-class care begins with you.
            </p>

            {/* Core values */}
            <div className="space-y-2.5">
              {values.map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-2.5 text-sm text-teal-300">
                  <div className="w-6 h-6 rounded-md bg-teal-800/60 flex items-center justify-center shrink-0">
                    <Icon className="w-3.5 h-3.5 text-teal-400" />
                  </div>
                  {label}
                </div>
              ))}
            </div>
          </div>

          {/* Departments */}
          <div>
            <h3 className="font-display font-semibold text-white text-base mb-5 pb-2 border-b border-teal-800/60">
              Departments
            </h3>
            <ul className="space-y-2.5">
              {departments.map((dept) => (
                <li key={dept}>
                  <button className="text-sm text-teal-300 hover:text-teal-200 transition-colors flex items-center gap-2 group">
                    <span className="w-1.5 h-1.5 rounded-full bg-teal-600 group-hover:bg-teal-400 transition-colors shrink-0" />
                    {dept}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Portals */}
          <div>
            <h3 className="font-display font-semibold text-white text-base mb-5 pb-2 border-b border-teal-800/60">
              Portals
            </h3>
            <ul className="space-y-2.5 mb-6">
              {portalLinks.map(({ label, path }) => (
                <li key={label}>
                  <button
                    onClick={() => navigate({ to: path })}
                    className="text-sm text-teal-300 hover:text-teal-200 transition-colors flex items-center gap-2 group"
                  >
                    <ArrowRight className="w-3.5 h-3.5 text-teal-600 group-hover:text-teal-400 transition-colors" />
                    {label}
                  </button>
                </li>
              ))}
            </ul>

            <h3 className="font-display font-semibold text-white text-base mb-4 pb-2 border-b border-teal-800/60">
              Hours
            </h3>
            <div className="space-y-2">
              <div className="flex items-start gap-2 text-sm text-teal-300">
                <Clock className="w-4 h-4 text-teal-400 mt-0.5 shrink-0" />
                <div>
                  <p className="font-medium text-teal-200">Emergency</p>
                  <p>24 hours, 7 days a week</p>
                </div>
              </div>
              <div className="flex items-start gap-2 text-sm text-teal-300">
                <Clock className="w-4 h-4 text-teal-400 mt-0.5 shrink-0" />
                <div>
                  <p className="font-medium text-teal-200">Outpatient</p>
                  <p>Mon–Sat, 8:00 AM – 8:00 PM</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-display font-semibold text-white text-base mb-5 pb-2 border-b border-teal-800/60">
              Contact
            </h3>
            <div className="space-y-4">
              <a
                href="tel:+911800000000"
                className="flex items-start gap-3 text-sm text-teal-300 hover:text-teal-200 transition-colors group"
              >
                <div className="w-8 h-8 rounded-lg bg-teal-800/60 flex items-center justify-center shrink-0 group-hover:bg-teal-700/60 transition-colors">
                  <Phone className="w-4 h-4 text-teal-400" />
                </div>
                <div>
                  <p className="font-medium text-teal-200">Emergency Hotline</p>
                  <p>1800-000-0000 (Toll Free)</p>
                </div>
              </a>
              <a
                href="mailto:care@vitalsai.health"
                className="flex items-start gap-3 text-sm text-teal-300 hover:text-teal-200 transition-colors group"
              >
                <div className="w-8 h-8 rounded-lg bg-teal-800/60 flex items-center justify-center shrink-0 group-hover:bg-teal-700/60 transition-colors">
                  <Mail className="w-4 h-4 text-teal-400" />
                </div>
                <div>
                  <p className="font-medium text-teal-200">Email Us</p>
                  <p>care@vitalsai.health</p>
                </div>
              </a>
              <div className="flex items-start gap-3 text-sm text-teal-300">
                <div className="w-8 h-8 rounded-lg bg-teal-800/60 flex items-center justify-center shrink-0">
                  <MapPin className="w-4 h-4 text-teal-400" />
                </div>
                <div>
                  <p className="font-medium text-teal-200">Location</p>
                  <p>Medical District, Healthcare Avenue</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-teal-800/60">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-teal-400">
            <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 text-center sm:text-left">
              <p>© {year} VitalsAI Healthcare. All rights reserved.</p>
              <span className="hidden sm:inline text-teal-700">·</span>
              <p className="italic text-teal-500">
                "Our goal is to be trusted by every patient, everywhere."
              </p>
            </div>
            <a
              href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(hostname)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-teal-500 hover:text-teal-300 transition-colors shrink-0"
            >
              Built with{' '}
              <Heart className="w-3.5 h-3.5 text-teal-400 fill-teal-400" />
              {' '}using{' '}
              <span className="font-semibold text-teal-300">caffeine.ai</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
