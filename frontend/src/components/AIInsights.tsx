import React, { useState } from 'react';
import { Brain, TrendingUp, TrendingDown, Minus, ArrowRight, Sparkles, Heart, Activity, Shield, Zap } from 'lucide-react';

interface InsightCard {
  id: number;
  title: string;
  category: string;
  recommendation: string;
  detail: string;
  trend: 'improving' | 'declining' | 'stable';
  score: number;
  gradient: string;
  border: string;
  bg: string;
  titleColor: string;
  sparkColor: string;
  chartData: number[];
  icon: React.ElementType;
}

// Mini bar chart
function BarChart({ data, color }: { data: number[]; color: string }) {
  const max = Math.max(...data, 1);
  return (
    <div className="flex items-end gap-1 h-10">
      {data.map((v, i) => (
        <div
          key={i}
          className="flex-1 rounded-sm transition-all duration-300"
          style={{
            height: `${(v / max) * 100}%`,
            backgroundColor: color,
            opacity: 0.4 + (i / data.length) * 0.6,
          }}
        />
      ))}
    </div>
  );
}

function TrendBadge({ trend }: { trend: InsightCard['trend'] }) {
  if (trend === 'improving') {
    return (
      <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700 border border-emerald-200">
        <TrendingUp className="w-3 h-3" /> Improving
      </span>
    );
  }
  if (trend === 'declining') {
    return (
      <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full bg-coral-100 text-coral-700 border border-coral-200">
        <TrendingDown className="w-3 h-3" /> Needs Attention
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
      <Minus className="w-3 h-3" /> Stable
    </span>
  );
}

const INSIGHTS: InsightCard[] = [
  {
    id: 1,
    title: 'Cardiovascular Health',
    category: 'Heart & Circulation',
    recommendation: 'Your heart rate patterns suggest mild stress. Consider 20 minutes of light cardio daily and reduce caffeine intake after 2 PM.',
    detail: 'Based on 7-day heart rate trend analysis',
    trend: 'stable',
    score: 74,
    gradient: 'gradient-coral-rose',
    border: 'border-coral-200',
    bg: 'bg-gradient-to-br from-coral-50 to-rose-50',
    titleColor: 'text-coral-700',
    sparkColor: '#f43f5e',
    chartData: [65, 72, 68, 75, 71, 74, 70],
    icon: Heart,
  },
  {
    id: 2,
    title: 'Respiratory Function',
    category: 'Breathing & Oxygen',
    recommendation: 'SpO₂ levels are consistently above 97%. Excellent respiratory health. Maintain current activity levels and avoid smoking environments.',
    detail: 'Based on 7-day SpO₂ monitoring',
    trend: 'improving',
    score: 92,
    gradient: 'gradient-teal-cyan',
    border: 'border-teal-200',
    bg: 'bg-gradient-to-br from-teal-50 to-cyan-50',
    titleColor: 'text-teal-700',
    sparkColor: '#0d9488',
    chartData: [88, 90, 91, 93, 92, 95, 97],
    icon: Activity,
  },
  {
    id: 3,
    title: 'Blood Pressure Control',
    category: 'Hypertension Risk',
    recommendation: 'Slight upward trend in systolic pressure. Reduce sodium intake, practice deep breathing exercises, and monitor weekly.',
    detail: 'Based on 14-day BP trend analysis',
    trend: 'declining',
    score: 61,
    gradient: 'gradient-violet-purple',
    border: 'border-violet-200',
    bg: 'bg-gradient-to-br from-violet-50 to-purple-50',
    titleColor: 'text-violet-700',
    sparkColor: '#7c3aed',
    chartData: [118, 120, 122, 125, 128, 130, 132],
    icon: Zap,
  },
  {
    id: 4,
    title: 'Overall Wellness Score',
    category: 'Holistic Health',
    recommendation: 'Your overall health metrics are good. Focus on sleep quality (aim for 7–8 hours) and stay hydrated with at least 2L of water daily.',
    detail: 'Composite score from all vitals',
    trend: 'improving',
    score: 82,
    gradient: 'gradient-emerald-teal',
    border: 'border-emerald-200',
    bg: 'bg-gradient-to-br from-emerald-50 to-teal-50',
    titleColor: 'text-emerald-700',
    sparkColor: '#059669',
    chartData: [70, 72, 75, 78, 79, 81, 82],
    icon: Shield,
  },
];

export default function AIInsights() {
  const [expandedId, setExpandedId] = useState<number | null>(null);

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black text-slate-800 flex items-center gap-2">
            <Brain className="w-5 h-5 text-violet-600" />
            AI Health Insights
          </h2>
          <p className="text-sm text-slate-500 font-medium mt-0.5">Personalized recommendations powered by AI analysis</p>
        </div>
        <div className="flex items-center gap-1.5 bg-violet-50 border border-violet-200 rounded-xl px-3 py-1.5">
          <Sparkles className="w-3.5 h-3.5 text-violet-500" />
          <span className="text-xs font-bold text-violet-700">AI Powered</span>
        </div>
      </div>

      {/* Insight Cards */}
      <div className="grid sm:grid-cols-2 gap-5 stagger-children">
        {INSIGHTS.map((insight) => {
          const isExpanded = expandedId === insight.id;
          const IconComp = insight.icon;
          return (
            <div
              key={insight.id}
              className={`rounded-3xl border-2 ${insight.border} ${insight.bg} p-5 shadow-card card-hover animate-fade-up transition-all duration-300`}
            >
              {/* Top row */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-2xl ${insight.gradient} flex items-center justify-center shadow-card flex-shrink-0`}>
                    <IconComp className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className={`font-black text-base ${insight.titleColor}`}>{insight.title}</h3>
                    <p className="text-xs text-slate-500 font-medium">{insight.category}</p>
                  </div>
                </div>
                <TrendBadge trend={insight.trend} />
              </div>

              {/* Score + Chart */}
              <div className="flex items-end justify-between mb-3">
                <div>
                  <div className="text-3xl font-black text-slate-800">{insight.score}<span className="text-base font-semibold text-slate-400">/100</span></div>
                  <div className="text-xs text-slate-400 font-medium">{insight.detail}</div>
                </div>
                <div className="w-24">
                  <BarChart data={insight.chartData} color={insight.sparkColor} />
                </div>
              </div>

              {/* Score bar */}
              <div className="w-full bg-white/60 rounded-full h-2 mb-4 overflow-hidden">
                <div
                  className={`h-full rounded-full ${insight.gradient} transition-all duration-700`}
                  style={{ width: `${insight.score}%` }}
                />
              </div>

              {/* Recommendation */}
              <div className={`${isExpanded ? '' : 'line-clamp-2'} text-sm text-slate-600 font-medium leading-relaxed mb-3`}>
                {insight.recommendation}
              </div>

              {/* CTA */}
              <button
                onClick={() => setExpandedId(isExpanded ? null : insight.id)}
                className={`w-full ${insight.gradient} text-white font-bold py-2.5 px-4 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 text-sm shadow-card hover:scale-[1.02]`}
              >
                {isExpanded ? 'Show Less' : 'View Full Report'}
                <ArrowRight className={`w-4 h-4 transition-transform duration-200 ${isExpanded ? 'rotate-90' : ''}`} />
              </button>
            </div>
          );
        })}
      </div>

      {/* AI Disclaimer */}
      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 flex items-start gap-3">
        <div className="w-8 h-8 rounded-xl gradient-violet-purple flex items-center justify-center flex-shrink-0 shadow-card">
          <Brain className="w-4 h-4 text-white" />
        </div>
        <div>
          <p className="text-sm font-bold text-slate-700">AI-Generated Insights</p>
          <p className="text-xs text-slate-500 font-medium leading-relaxed mt-0.5">
            These insights are generated by AI analysis of simulated health data and are for informational purposes only. Always consult a qualified healthcare professional for medical advice.
          </p>
        </div>
      </div>
    </div>
  );
}
