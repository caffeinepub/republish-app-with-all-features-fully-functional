import React, { useState, useEffect } from 'react';
import { Heart, Droplets, Wind, Thermometer, TrendingUp, TrendingDown, Minus, Activity, RefreshCw } from 'lucide-react';

interface VitalsDashboardProps {
  patientName?: string;
}

interface VitalReading {
  value: number;
  unit: string;
  status: 'normal' | 'warning' | 'critical';
  trend: 'up' | 'down' | 'stable';
  history: number[];
}

interface Vitals {
  heartRate: VitalReading;
  bloodPressure: { systolic: number; diastolic: number; status: 'normal' | 'warning' | 'critical'; trend: 'up' | 'down' | 'stable'; history: number[] };
  spo2: VitalReading;
  temperature: VitalReading;
}

function getStatusColor(status: 'normal' | 'warning' | 'critical') {
  switch (status) {
    case 'normal':   return { text: 'text-emerald-600', bg: 'bg-emerald-100', dot: 'bg-emerald-500', badge: 'bg-emerald-100 text-emerald-700 border-emerald-200' };
    case 'warning':  return { text: 'text-amber-600',   bg: 'bg-amber-100',   dot: 'bg-amber-500',   badge: 'bg-amber-100 text-amber-700 border-amber-200' };
    case 'critical': return { text: 'text-coral-600',   bg: 'bg-coral-100',   dot: 'bg-coral-500',   badge: 'bg-coral-100 text-coral-700 border-coral-200' };
  }
}

function getStatusLabel(status: 'normal' | 'warning' | 'critical') {
  switch (status) {
    case 'normal':   return 'Normal';
    case 'warning':  return 'Warning';
    case 'critical': return 'Critical';
  }
}

// Mini sparkline SVG
function Sparkline({ data, color }: { data: number[]; color: string }) {
  if (data.length < 2) return null;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const w = 80;
  const h = 32;
  const points = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - ((v - min) / range) * h;
    return `${x},${y}`;
  }).join(' ');

  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="overflow-visible">
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Last point dot */}
      {data.length > 0 && (() => {
        const last = data[data.length - 1];
        const x = w;
        const y = h - ((last - min) / range) * h;
        return <circle cx={x} cy={y} r="3" fill={color} />;
      })()}
    </svg>
  );
}

function TrendIcon({ trend }: { trend: 'up' | 'down' | 'stable' }) {
  if (trend === 'up')     return <TrendingUp className="w-4 h-4 text-coral-500" />;
  if (trend === 'down')   return <TrendingDown className="w-4 h-4 text-teal-500" />;
  return <Minus className="w-4 h-4 text-slate-400" />;
}

// Generate simulated vitals
function generateVitals(): Vitals {
  const rand = (min: number, max: number) => Math.round(min + Math.random() * (max - min));
  const history = (base: number, spread: number, count = 8) =>
    Array.from({ length: count }, () => rand(base - spread, base + spread));

  const hr = rand(62, 98);
  const hrStatus: 'normal' | 'warning' | 'critical' = hr < 60 || hr > 100 ? (hr < 50 || hr > 120 ? 'critical' : 'warning') : 'normal';

  const spo2 = rand(94, 100);
  const spo2Status: 'normal' | 'warning' | 'critical' = spo2 < 90 ? 'critical' : spo2 < 95 ? 'warning' : 'normal';

  const temp = parseFloat((36 + Math.random() * 2.5).toFixed(1));
  const tempStatus: 'normal' | 'warning' | 'critical' = temp > 39.5 ? 'critical' : temp > 38 ? 'warning' : 'normal';

  const sys = rand(105, 145);
  const dia = rand(65, 95);
  const bpStatus: 'normal' | 'warning' | 'critical' = sys > 140 || dia > 90 ? (sys > 160 || dia > 100 ? 'critical' : 'warning') : 'normal';

  return {
    heartRate: { value: hr, unit: 'bpm', status: hrStatus, trend: Math.random() > 0.5 ? 'up' : 'stable', history: history(hr, 8) },
    bloodPressure: { systolic: sys, diastolic: dia, status: bpStatus, trend: Math.random() > 0.5 ? 'stable' : 'up', history: history(sys, 10) },
    spo2: { value: spo2, unit: '%', status: spo2Status, trend: 'stable', history: history(spo2, 2) },
    temperature: { value: temp, unit: '°C', status: tempStatus, trend: Math.random() > 0.6 ? 'up' : 'stable', history: history(temp * 10, 3).map(v => v / 10) },
  };
}

export default function VitalsDashboard({ patientName }: VitalsDashboardProps) {
  const [vitals, setVitals] = useState<Vitals>(generateVitals);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);

  const refresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setVitals(generateVitals());
      setLastUpdated(new Date());
      setIsRefreshing(false);
    }, 800);
  };

  // Auto-refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(refresh, 30_000);
    return () => clearInterval(interval);
  }, []);

  const cards = [
    {
      title: 'Heart Rate',
      icon: Heart,
      gradient: 'gradient-coral-rose',
      sparkColor: '#ef4444',
      border: 'border-coral-200',
      bg: 'bg-gradient-to-br from-coral-50 to-rose-50',
      value: `${vitals.heartRate.value}`,
      unit: vitals.heartRate.unit,
      status: vitals.heartRate.status,
      trend: vitals.heartRate.trend,
      history: vitals.heartRate.history,
      iconClass: 'animate-heartbeat',
      extra: null,
    },
    {
      title: 'Blood Pressure',
      icon: Droplets,
      gradient: 'gradient-teal-cyan',
      sparkColor: '#0d9488',
      border: 'border-teal-200',
      bg: 'bg-gradient-to-br from-teal-50 to-cyan-50',
      value: `${vitals.bloodPressure.systolic}/${vitals.bloodPressure.diastolic}`,
      unit: 'mmHg',
      status: vitals.bloodPressure.status,
      trend: vitals.bloodPressure.trend,
      history: vitals.bloodPressure.history,
      iconClass: '',
      extra: null,
    },
    {
      title: 'SpO₂',
      icon: Wind,
      gradient: 'gradient-violet-purple',
      sparkColor: '#7c3aed',
      border: 'border-violet-200',
      bg: 'bg-gradient-to-br from-violet-50 to-purple-50',
      value: `${vitals.spo2.value}`,
      unit: vitals.spo2.unit,
      status: vitals.spo2.status,
      trend: vitals.spo2.trend,
      history: vitals.spo2.history,
      iconClass: '',
      extra: null,
    },
    {
      title: 'Temperature',
      icon: Thermometer,
      gradient: 'gradient-amber-orange',
      sparkColor: '#d97706',
      border: 'border-amber-200',
      bg: 'bg-gradient-to-br from-amber-50 to-orange-50',
      value: `${vitals.temperature.value}`,
      unit: vitals.temperature.unit,
      status: vitals.temperature.status,
      trend: vitals.temperature.trend,
      history: vitals.temperature.history,
      iconClass: '',
      extra: null,
    },
  ];

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black text-slate-800 flex items-center gap-2">
            <Activity className="w-5 h-5 text-teal-600" />
            Vitals Dashboard
          </h2>
          {patientName && (
            <p className="text-sm text-slate-500 font-medium mt-0.5">Patient: <span className="font-bold text-teal-700">{patientName}</span></p>
          )}
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-400 font-medium hidden sm:block">
            Updated {lastUpdated.toLocaleTimeString()}
          </span>
          <button
            onClick={refresh}
            disabled={isRefreshing}
            className="flex items-center gap-1.5 text-sm font-semibold text-teal-600 hover:text-teal-700 bg-teal-50 hover:bg-teal-100 border border-teal-200 px-3 py-1.5 rounded-xl transition-all duration-200 disabled:opacity-60"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </div>

      {/* Vitals Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 stagger-children">
        {cards.map((card) => {
          const statusColors = getStatusColor(card.status);
          return (
            <div
              key={card.title}
              className={`rounded-3xl border-2 ${card.border} ${card.bg} p-5 shadow-card card-hover animate-fade-up`}
            >
              {/* Top row */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-2xl ${card.gradient} flex items-center justify-center shadow-card`}>
                    <card.icon className={`w-6 h-6 text-white ${card.iconClass}`} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-600">{card.title}</p>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${statusColors.badge}`}>
                      {getStatusLabel(card.status)}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <TrendIcon trend={card.trend} />
                  <div className={`w-2 h-2 rounded-full ${statusColors.dot} animate-pulse`} />
                </div>
              </div>

              {/* Value */}
              <div className="flex items-end justify-between">
                <div>
                  <span className="text-4xl font-black text-slate-800">{card.value}</span>
                  <span className="text-sm font-semibold text-slate-500 ml-1.5">{card.unit}</span>
                </div>
                {/* Sparkline */}
                <div className="opacity-70">
                  <Sparkline data={card.history} color={card.sparkColor} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Overall Status Banner */}
      {(() => {
        const allStatuses = [vitals.heartRate.status, vitals.bloodPressure.status, vitals.spo2.status, vitals.temperature.status];
        const hasCritical = allStatuses.includes('critical');
        const hasWarning = allStatuses.includes('warning');
        if (hasCritical) {
          return (
            <div className="rounded-2xl border-2 border-coral-200 bg-coral-50 p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl gradient-coral-rose flex items-center justify-center flex-shrink-0 shadow-coral animate-pulse">
                <Activity className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-black text-coral-700">⚠️ Critical Vitals Detected</p>
                <p className="text-sm text-coral-600 font-medium">Please seek immediate medical attention or contact emergency services.</p>
              </div>
            </div>
          );
        }
        if (hasWarning) {
          return (
            <div className="rounded-2xl border-2 border-amber-200 bg-amber-50 p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl gradient-amber-orange flex items-center justify-center flex-shrink-0 shadow-card">
                <Activity className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-black text-amber-700">⚡ Some Vitals Need Attention</p>
                <p className="text-sm text-amber-600 font-medium">One or more vitals are outside the normal range. Consider consulting a doctor.</p>
              </div>
            </div>
          );
        }
        return (
          <div className="rounded-2xl border-2 border-emerald-200 bg-emerald-50 p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl gradient-emerald-teal flex items-center justify-center flex-shrink-0 shadow-card">
              <Activity className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="font-black text-emerald-700">✅ All Vitals Normal</p>
              <p className="text-sm text-emerald-600 font-medium">Your vitals are within healthy ranges. Keep up the great work!</p>
            </div>
          </div>
        );
      })()}

      <p className="text-xs text-slate-400 text-center font-medium">
        * Simulated vitals for demonstration. Connect a medical device for real readings.
      </p>
    </div>
  );
}
