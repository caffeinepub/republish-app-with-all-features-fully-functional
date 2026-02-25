import React from 'react';
import { Link } from '@tanstack/react-router';
import { Activity, Stethoscope, AlertTriangle, Brain, ArrowRight, Shield, Clock, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-teal-600 to-teal-800 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <img
            src="/assets/generated/hospital-hero.dim_1920x600.png"
            alt=""
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <Activity className="w-6 h-6 text-white" />
              </div>
              <span className="text-teal-200 font-semibold text-lg">Vitals AI</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              Smart Healthcare,{' '}
              <span className="text-teal-200">Powered by AI</span>
            </h1>
            <p className="text-lg md:text-xl text-teal-100 mb-8 leading-relaxed">
              Vitals AI connects patients, doctors, and administrators on a single intelligent platform — enabling faster emergency response, smarter symptom checking, and seamless care coordination.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/portal-selection">
                <Button size="lg" className="bg-white text-teal-700 hover:bg-teal-50 font-semibold shadow-lg">
                  Get Started <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
              <Link to="/patient">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                  Emergency SOS
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-teal-700 text-white py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { value: '24/7', label: 'Emergency Support' },
              { value: 'AI', label: 'Symptom Analysis' },
              { value: '6+', label: 'Specializations' },
              { value: '100%', label: 'Secure & Private' },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="text-2xl md:text-3xl font-bold text-teal-200">{stat.value}</div>
                <div className="text-sm text-teal-300 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Everything You Need for Modern Healthcare
            </h2>
            <p className="text-lg text-gray-500 max-w-2xl mx-auto">
              Vitals AI brings together patients, doctors, and administrators with intelligent tools for better health outcomes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Patient Card */}
            <div className="bg-white rounded-xl p-6 border-l-4 border-r-4 border-teal-500 shadow-md hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-teal-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Patient Portal</h3>
              <p className="text-gray-500 mb-4 text-sm leading-relaxed">
                Register your profile, submit emergency SOS alerts, and use the AI-powered symptom checker to get instant medicine suggestions.
              </p>
              <Link to="/patient">
                <Button variant="outline" size="sm" className="border-teal-500 text-teal-700 hover:bg-teal-50">
                  Open Patient Portal <ArrowRight className="ml-1 w-3 h-3" />
                </Button>
              </Link>
            </div>

            {/* Doctor Card */}
            <div className="bg-white rounded-xl p-6 border-l-4 border-r-4 border-teal-500 shadow-md hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center mb-4">
                <Stethoscope className="w-6 h-6 text-teal-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Doctor Portal</h3>
              <p className="text-gray-500 mb-4 text-sm leading-relaxed">
                Log in with your credentials, manage your availability status, and view emergency cases assigned to you in real time.
              </p>
              <Link to="/doctor">
                <Button variant="outline" size="sm" className="border-teal-500 text-teal-700 hover:bg-teal-50">
                  Open Doctor Portal <ArrowRight className="ml-1 w-3 h-3" />
                </Button>
              </Link>
            </div>

            {/* Admin Card */}
            <div className="bg-white rounded-xl p-6 border-l-4 border-r-4 border-teal-500 shadow-md hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-teal-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Admin Portal</h3>
              <p className="text-gray-500 mb-4 text-sm leading-relaxed">
                Manage doctors, monitor emergency cases, assign doctors to patients, and oversee the entire healthcare operation from one dashboard.
              </p>
              <Link to="/admin">
                <Button variant="outline" size="sm" className="border-teal-500 text-teal-700 hover:bg-teal-50">
                  Open Admin Portal <ArrowRight className="ml-1 w-3 h-3" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* AI Symptom Checker CTA */}
      <section className="py-16 bg-teal-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl border-l-4 border-r-4 border-teal-500 shadow-lg p-8 md:p-12 flex flex-col md:flex-row items-center gap-8">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-3">
                <Brain className="w-6 h-6 text-teal-600" />
                <span className="text-teal-600 font-semibold text-sm uppercase tracking-wider">AI-Powered</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
                Instant Symptom Analysis
              </h2>
              <p className="text-gray-500 leading-relaxed mb-6">
                Describe your symptoms and Vitals AI will suggest appropriate medications, dosages, and when to seek immediate medical attention. Fast, accurate, and always available.
              </p>
              <Link to="/patient">
                <Button className="bg-teal-600 hover:bg-teal-700 text-white">
                  Try Symptom Checker <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
            </div>
            <div className="flex-shrink-0">
              <div className="w-32 h-32 md:w-40 md:h-40 bg-teal-100 rounded-full flex items-center justify-center">
                <Activity className="w-16 h-16 md:w-20 md:h-20 text-teal-500" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Emergency Banner */}
      <section className="bg-red-600 text-white py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-center gap-3">
          <AlertTriangle className="w-5 h-5 animate-pulse" />
          <p className="text-sm font-medium">
            For life-threatening emergencies, always call <strong>911</strong> immediately. Vitals AI is not a substitute for emergency services.
          </p>
          <AlertTriangle className="w-5 h-5 animate-pulse" />
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">How Vitals AI Works</h2>
            <p className="text-gray-500 max-w-xl mx-auto">
              Three simple steps to better healthcare management.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                icon: <Users className="w-6 h-6 text-teal-600" />,
                title: 'Register & Login',
                desc: 'Create your patient profile or log in as a doctor or admin to access your personalized portal.',
              },
              {
                step: '02',
                icon: <Brain className="w-6 h-6 text-teal-600" />,
                title: 'Use AI Tools',
                desc: 'Check symptoms with our AI engine, submit emergency SOS alerts, or manage your medical team.',
              },
              {
                step: '03',
                icon: <Clock className="w-6 h-6 text-teal-600" />,
                title: 'Get Fast Care',
                desc: 'Doctors are assigned to cases instantly. Track status in real time and receive timely medical attention.',
              },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-14 h-14 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  {item.icon}
                </div>
                <div className="text-4xl font-black text-teal-100 mb-2">{item.step}</div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
