import React, { useState } from 'react';
import { Bell, AlertTriangle, CheckCircle, Info, Clock, Filter, User } from 'lucide-react';

type AlertSeverity = 'normal' | 'warning' | 'critical';
type AlertFilter = 'all' | 'warning' | 'critical';

interface SmartAlert {
  id: number;
  patientName: string;
  alertType: string;
  description: string;
  severity: AlertSeverity;
  timestamp: Date;
  department: string;
}

const DEMO_ALERTS: SmartAlert[] = [
  {
    id: 1,
    patientName: 'Arjun Sharma',
    alertType: 'High Blood Pressure',
    description: 'Systolic pressure reading of 168 mmHg detected. Immediate monitoring required.',
    severity: 'critical',
    timestamp: new Date(Date.now() - 5 * 60 * 1000),
    department: 'Cardiology',
  },
  {
    id: 2,
    patientName: 'Priya Mehta',
    alertType: 'Low SpO₂',
    description: 'Oxygen saturation dropped to 91%. Supplemental oxygen may be needed.',
    severity: 'critical',
    timestamp: new Date(Date.now() - 12 * 60 * 1000),
    department: 'Emergency',
  },
  {
    id: 3,
    patientName: 'Rahul Verma',
    alertType: 'Elevated Temperature',
    description: 'Body temperature at 38.6°C. Possible fever — antipyretics recommended.',
    severity: 'warning',
    timestamp: new Date(Date.now() - 25 * 60 * 1000),
    department: 'General Medicine',
  },
  {
    id: 4,
    patientName: 'Sneha Patel',
    alertType: 'Irregular Heart Rate',
    description: 'Heart rate variability detected at 112 bpm. Monitoring in progress.',
    severity: 'warning',
    timestamp: new Date(Date.now() - 40 * 60 * 1000),
    department: 'Cardiology',
  },
  {
    id: 5,
    patientName: 'Vikram Singh',
    alertType: 'Routine Check Complete',
    description: 'All vitals within normal range. Next check scheduled in 4 hours.',
    severity: 'normal',
    timestamp: new Date(Date.now() - 60 * 60 * 1000),
    department: 'General Medicine',
  },
  {
    id: 6,
    patientName: 'Ananya Gupta',
    alertType: 'Medication Reminder',
    description: 'Patient due for scheduled medication. Please verify administration.',
    severity: 'normal',
    timestamp: new Date(Date.now() - 90 * 60 * 1000),
    department: 'Neurology',
  },
];

function formatTimeAgo(date: Date): string {
  const mins = Math.floor((Date.now() - date.getTime()) / 60000);
  if (mins < 1)  return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24)  return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

function getSeverityStyles(severity: AlertSeverity) {
  switch (severity) {
    case 'critical':
      return {
        card:   'border-coral-200 bg-gradient-to-br from-coral-50 to-rose-50',
        icon:   'gradient-coral-rose shadow-coral',
        badge:  'bg-coral-100 text-coral-700 border-coral-300',
        title:  'text-coral-700',
        dot:    'bg-coral-500',
        IconComponent: AlertTriangle,
      };
    case 'warning':
      return {
        card:   'border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50',
        icon:   'gradient-amber-orange shadow-card',
        badge:  'bg-amber-100 text-amber-700 border-amber-300',
        title:  'text-amber-700',
        dot:    'bg-amber-500',
        IconComponent: Info,
      };
    case 'normal':
    default:
      return {
        card:   'border-emerald-200 bg-gradient-to-br from-emerald-50 to-teal-50',
        icon:   'gradient-emerald-teal shadow-card',
        badge:  'bg-emerald-100 text-emerald-700 border-emerald-300',
        title:  'text-emerald-700',
        dot:    'bg-emerald-500',
        IconComponent: CheckCircle,
      };
  }
}

export default function SmartAlerts() {
  const [filter, setFilter] = useState<AlertFilter>('all');

  const filtered = DEMO_ALERTS.filter((a) => {
    if (filter === 'all')      return true;
    if (filter === 'warning')  return a.severity === 'warning';
    if (filter === 'critical') return a.severity === 'critical';
    return true;
  });

  const criticalCount = DEMO_ALERTS.filter((a) => a.severity === 'critical').length;
  const warningCount  = DEMO_ALERTS.filter((a) => a.severity === 'warning').length;
  const normalCount   = DEMO_ALERTS.filter((a) => a.severity === 'normal').length;

  const filterButtons: { key: AlertFilter; label: string; count: number; activeClass: string }[] = [
    { key: 'all',      label: 'All Alerts',  count: DEMO_ALERTS.length, activeClass: 'gradient-teal-cyan text-white shadow-teal-sm' },
    { key: 'critical', label: 'Critical',    count: criticalCount,       activeClass: 'gradient-coral-rose text-white shadow-coral' },
    { key: 'warning',  label: 'Warning',     count: warningCount,        activeClass: 'gradient-amber-orange text-white shadow-card' },
  ];

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-black text-slate-800 flex items-center gap-2">
          <Bell className="w-5 h-5 text-coral-500" />
          Smart Alerts
        </h2>
        <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          Live monitoring
        </div>
      </div>

      {/* Summary badges */}
      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-2xl border-2 border-coral-200 bg-coral-50 p-3 text-center">
          <div className="text-2xl font-black text-coral-700">{criticalCount}</div>
          <div className="text-xs font-bold text-coral-600">Critical</div>
        </div>
        <div className="rounded-2xl border-2 border-amber-200 bg-amber-50 p-3 text-center">
          <div className="text-2xl font-black text-amber-700">{warningCount}</div>
          <div className="text-xs font-bold text-amber-600">Warning</div>
        </div>
        <div className="rounded-2xl border-2 border-emerald-200 bg-emerald-50 p-3 text-center">
          <div className="text-2xl font-black text-emerald-700">{normalCount}</div>
          <div className="text-xs font-bold text-emerald-600">Normal</div>
        </div>
      </div>

      {/* Filter buttons */}
      <div className="flex gap-2 flex-wrap">
        <div className="flex items-center gap-1.5 text-sm font-semibold text-slate-500 mr-1">
          <Filter className="w-4 h-4" />
          Filter:
        </div>
        {filterButtons.map((btn) => (
          <button
            key={btn.key}
            onClick={() => setFilter(btn.key)}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-sm font-bold border transition-all duration-200 ${
              filter === btn.key
                ? `${btn.activeClass} border-transparent`
                : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50'
            }`}
          >
            {btn.label}
            <span className={`text-xs px-1.5 py-0.5 rounded-full font-black ${
              filter === btn.key ? 'bg-white/30' : 'bg-slate-100 text-slate-500'
            }`}>
              {btn.count}
            </span>
          </button>
        ))}
      </div>

      {/* Alert Cards */}
      <div className="space-y-3 stagger-children">
        {filtered.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 rounded-3xl gradient-teal-cyan flex items-center justify-center mx-auto mb-4 shadow-teal">
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
            <p className="font-bold text-slate-600">No alerts for this filter</p>
            <p className="text-sm text-slate-400 font-medium mt-1">All clear in this category!</p>
          </div>
        ) : (
          filtered.map((alert) => {
            const styles = getSeverityStyles(alert.severity);
            const IconComp = styles.IconComponent;
            return (
              <div
                key={alert.id}
                className={`rounded-2xl border-2 ${styles.card} p-4 shadow-card card-hover animate-fade-up`}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-xl ${styles.icon} flex items-center justify-center flex-shrink-0`}>
                    <IconComp className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <div>
                        <span className={`text-sm font-black ${styles.title}`}>{alert.alertType}</span>
                        <span className={`ml-2 text-xs font-bold px-2 py-0.5 rounded-full border ${styles.badge}`}>
                          {alert.severity.charAt(0).toUpperCase() + alert.severity.slice(1)}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-slate-400 font-medium flex-shrink-0">
                        <Clock className="w-3 h-3" />
                        {formatTimeAgo(alert.timestamp)}
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 mb-1.5">
                      <User className="w-3 h-3 text-slate-400" />
                      <span className="text-xs font-bold text-slate-600">{alert.patientName}</span>
                      <span className="text-xs text-slate-400">·</span>
                      <span className="text-xs text-slate-400 font-medium">{alert.department}</span>
                    </div>
                    <p className="text-sm text-slate-600 font-medium leading-relaxed">{alert.description}</p>
                  </div>
                  <div className={`w-2.5 h-2.5 rounded-full ${styles.dot} flex-shrink-0 mt-1 ${alert.severity === 'critical' ? 'animate-pulse' : ''}`} />
                </div>
              </div>
            );
          })
        )}
      </div>

      <p className="text-xs text-slate-400 text-center font-medium">
        * Demo alerts for illustration. Real alerts will be generated from live patient data.
      </p>
    </div>
  );
}
