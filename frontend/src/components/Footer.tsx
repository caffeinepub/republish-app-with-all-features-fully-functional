import React from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Heart, Phone, Mail, MapPin, ArrowRight, Activity, Sparkles, Rocket } from 'lucide-react';

export default function Footer() {
  const navigate = useNavigate();
  const year = new Date().getFullYear();
  const hostname = typeof window !== 'undefined' ? encodeURIComponent(window.location.hostname) : 'vitals-ai';

  return (
    <footer className="bg-slate-900 text-white">
      {/* Vibrant CTA Banner */}
      <div className="relative overflow-hidden py-16 px-4">
        {/* Gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-teal-500 via-cyan-500 to-violet-600" />
        <div className="absolute inset-0 mesh-pattern opacity-30" />
        {/* Decorative blobs */}
        <div className="absolute -top-16 -left-16 w-64 h-64 rounded-full bg-white/10 animate-blob" />
        <div className="absolute -bottom-16 -right-16 w-80 h-80 rounded-full bg-coral-500/20 animate-blob" style={{ animationDelay: '3s' }} />

        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full px-5 py-2 mb-6 text-white text-sm font-bold">
            <Rocket className="w-4 h-4 text-yellow-300" />
            <span>Join the Healthcare Revolution</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-display font-black text-white mb-5 drop-shadow-lg leading-tight">
            Building the future of care,<br />
            <span className="text-yellow-200">one patient at a time</span>
          </h2>
          <p className="text-white/90 text-lg mb-8 max-w-2xl mx-auto leading-relaxed font-medium">
            We're on a mission to make quality healthcare accessible to all — and we're just getting started. Be part of the journey.
          </p>
          <button
            onClick={() => navigate({ to: '/select-role' })}
            className="bg-white text-teal-700 hover:bg-teal-50 font-bold px-8 py-4 rounded-full transition-all duration-300 shadow-xl hover:shadow-2xl hover:-translate-y-1 inline-flex items-center gap-2 text-base"
          >
            Be an Early Adopter <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Footer */}
      <div className="py-14 px-4 bg-slate-900">
        <div className="max-w-6xl mx-auto grid md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2.5 mb-5">
              <div className="w-10 h-10 rounded-xl gradient-teal-cyan flex items-center justify-center shadow-teal">
                <Heart className="w-5 h-5 text-white fill-white" />
              </div>
              <div>
                <span className="font-display font-black text-xl text-white tracking-tight">
                  Vitals<span className="text-teal-400">AI</span>
                </span>
                <div className="text-2xs text-teal-400 font-semibold tracking-widest uppercase">Smart Healthcare</div>
              </div>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed mb-5">
              A healthcare platform with a bold vision: connect every patient with the right care at the right time — anywhere in the world.
            </p>
            <div className="space-y-1.5">
              {['Compassionate Care', 'Patient Privacy', 'Medical Excellence'].map((v) => (
                <div key={v} className="flex items-center gap-2 text-xs text-slate-500">
                  <div className="w-1.5 h-1.5 rounded-full bg-teal-500" />
                  {v}
                </div>
              ))}
            </div>
          </div>

          {/* Departments */}
          <div>
            <h4 className="font-bold text-white text-sm uppercase tracking-wider mb-5">Departments</h4>
            <ul className="space-y-2.5">
              {['Emergency Care', 'Cardiology', 'Neurology', 'Pediatrics', 'Orthopedics', 'General Medicine'].map((d) => (
                <li key={d}>
                  <span className="text-slate-400 hover:text-teal-400 text-sm transition-colors cursor-default font-medium">{d}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Portals */}
          <div>
            <h4 className="font-bold text-white text-sm uppercase tracking-wider mb-5">Portals</h4>
            <ul className="space-y-2.5">
              {[
                { label: 'Patient Portal', path: '/patient' },
                { label: 'Doctor Portal', path: '/doctor' },
                { label: 'Admin Portal', path: '/admin' },
                { label: 'Select Role', path: '/select-role' },
              ].map((link) => (
                <li key={link.label}>
                  <button
                    onClick={() => navigate({ to: link.path as '/' })}
                    className="text-slate-400 hover:text-teal-400 text-sm transition-colors text-left font-medium"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-bold text-white text-sm uppercase tracking-wider mb-5">Contact</h4>
            <ul className="space-y-3.5">
              <li className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-lg bg-teal-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Phone className="w-3.5 h-3.5 text-teal-400" />
                </div>
                <span className="text-slate-400 text-sm font-medium">+1 (800) VITALS-1</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-lg bg-coral-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Mail className="w-3.5 h-3.5 text-coral-400" />
                </div>
                <span className="text-slate-400 text-sm font-medium">hello@vitalsai.health</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-lg bg-violet-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <MapPin className="w-3.5 h-3.5 text-violet-400" />
                </div>
                <span className="text-slate-400 text-sm font-medium">Aspiring to serve globally</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-slate-800 py-5 px-4">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <span>© {year} Vitals AI. On a mission to serve every patient with dignity.</span>
          <span className="flex items-center gap-1">
            Built with <Heart className="w-3 h-3 text-coral-400 fill-coral-400 mx-0.5" /> using{' '}
            <a
              href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${hostname}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-teal-400 hover:text-teal-300 transition-colors underline underline-offset-2"
            >
              caffeine.ai
            </a>
          </span>
        </div>
      </div>
    </footer>
  );
}
