import React from 'react';
import { Activity, Heart, Phone, Mail, Shield } from 'lucide-react';
import { Link, useNavigate } from '@tanstack/react-router';

export default function Footer() {
  const year = new Date().getFullYear();
  const appId = encodeURIComponent(window.location.hostname || 'vitals-ai');
  const navigate = useNavigate();

  return (
    <footer className="bg-gray-900 dark:bg-card text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 bg-gradient-to-br from-teal-500 to-teal-700 rounded-xl flex items-center justify-center">
                <Activity className="w-5 h-5 text-white" />
              </div>
              <div className="flex flex-col leading-none">
                <span className="text-lg font-extrabold text-white tracking-tight font-heading">
                  Vitals <span className="text-teal-400">AI</span>
                </span>
                <span className="text-[10px] text-gray-500 font-medium tracking-widest uppercase">
                  Healthcare
                </span>
              </div>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed max-w-xs">
              AI-powered healthcare management platform connecting patients, doctors, and administrators for better health outcomes.
            </p>
            <button
              onClick={() => navigate({ to: '/select-role' })}
              className="mt-4 inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
            >
              Get Started
            </button>
          </div>

          {/* Portals */}
          <div>
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">
              Portals
            </h3>
            <ul className="space-y-2.5">
              {[
                { label: 'Patient Portal', to: '/patient' },
                { label: 'Doctor Portal', to: '/doctor' },
                { label: 'Admin Portal', to: '/admin' },
                { label: 'Select Role', to: '/select-role' },
              ].map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-sm text-gray-400 hover:text-teal-400 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Emergency */}
          <div>
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">
              Emergency
            </h3>
            <div className="flex items-center gap-2 text-sm text-red-400 font-semibold mb-3">
              <Phone className="w-4 h-4" />
              <span>Call 911 immediately</span>
            </div>
            <p className="text-xs text-gray-500 leading-relaxed">
              This platform is not a substitute for emergency medical services. Always call emergency services in a life-threatening situation.
            </p>
            <div className="flex items-center gap-2 mt-4 text-xs text-gray-500">
              <Shield className="w-3.5 h-3.5 text-teal-500" />
              <span>HIPAA Compliant & Secure</span>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-gray-500">
            © {year} Vitals AI. All rights reserved.
          </p>
          <p className="text-xs text-gray-500 flex items-center gap-1">
            Built with <Heart className="w-3 h-3 text-teal-500 fill-teal-500 mx-0.5" /> using{' '}
            <a
              href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${appId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-teal-400 hover:text-teal-300 font-medium ml-0.5"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
