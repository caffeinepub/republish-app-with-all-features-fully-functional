import React, { useState } from 'react';
import { useGetAllCasesPublic } from '../hooks/useQueries';
import { EmergencyCase, Department, Severity } from '../backend';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Activity, User, Building2, RefreshCw, Loader2, Search } from 'lucide-react';

const DEPARTMENTS: { value: Department; label: string }[] = [
  { value: Department.emergency, label: 'Emergency' },
  { value: Department.cardiology, label: 'Cardiology' },
  { value: Department.neurology, label: 'Neurology' },
  { value: Department.pediatrics, label: 'Pediatrics' },
  { value: Department.orthopedics, label: 'Orthopedics' },
  { value: Department.generalMedicine, label: 'General Medicine' },
];

function getDeptLabel(dept: Department): string {
  return DEPARTMENTS.find(d => d.value === dept)?.label ?? dept;
}

function getSeverityColor(severity: Severity): string {
  switch (severity) {
    case Severity.critical: return 'bg-red-500/20 text-red-400 border-red-500/40';
    case Severity.high: return 'bg-orange-500/20 text-orange-400 border-orange-500/40';
    case Severity.medium: return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/40';
    case Severity.low: return 'bg-green-500/20 text-green-400 border-green-500/40';
    default: return 'bg-muted text-muted-foreground border-border';
  }
}

function getStatusColor(status: string): string {
  switch (status) {
    case 'open': return 'bg-blue-500/20 text-blue-400 border-blue-500/40';
    case 'assigned': return 'bg-purple-500/20 text-purple-400 border-purple-500/40';
    case 'inProgress': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/40';
    case 'resolved': return 'bg-green-500/20 text-green-400 border-green-500/40';
    case 'closed': return 'bg-muted text-muted-foreground border-border';
    default: return 'bg-muted text-muted-foreground border-border';
  }
}

function isEmergency(c: EmergencyCase): boolean {
  return c.severity === Severity.critical || c.severity === Severity.high;
}

interface CaseManagementProps {
  departmentFilter?: Department;
}

export default function CaseManagement({ departmentFilter }: CaseManagementProps) {
  const { data: allCases = [], isLoading, refetch } = useGetAllCasesPublic();
  const [search, setSearch] = useState('');

  const cases = departmentFilter
    ? allCases.filter(c => c.caseType === departmentFilter)
    : allCases;

  const filtered = cases.filter(c =>
    c.patientName.toLowerCase().includes(search.toLowerCase()) ||
    c.condition.toLowerCase().includes(search.toLowerCase())
  );

  const emergencyCases = filtered.filter(isEmergency);
  const regularCases = filtered.filter(c => !isEmergency(c));

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search cases..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-9 bg-muted/50 border-border"
          />
        </div>
        <Button variant="outline" size="sm" onClick={() => refetch()} className="gap-2">
          <RefreshCw className="w-4 h-4" />
          Refresh
        </Button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
          <span className="ml-2 text-muted-foreground">Loading cases...</span>
        </div>
      ) : (
        <>
          {/* Emergency Cases */}
          {emergencyCases.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-red-400 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 animate-pulse" />
                Emergency / SOS Cases ({emergencyCases.length})
              </h3>
              {emergencyCases.map(c => (
                <div
                  key={String(c.id)}
                  className="rounded-lg border-2 border-red-500/40 bg-red-500/5 p-4"
                >
                  <div className="flex items-start justify-between gap-2 flex-wrap">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <AlertTriangle className="w-4 h-4 text-red-400" />
                        <span className="font-semibold text-foreground">{c.patientName}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full border font-bold ${getSeverityColor(c.severity)}`}>
                          {c.severity.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">{c.condition}</p>
                      {c.patientDetails && (
                        <p className="text-xs text-muted-foreground mt-1">{c.patientDetails}</p>
                      )}
                      <p className="text-xs text-muted-foreground mt-1">
                        {getDeptLabel(c.caseType)} • {new Date(Number(c.submissionDate) / 1_000_000).toLocaleString()}
                      </p>
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded-full border flex-shrink-0 ${getStatusColor(c.status)}`}>
                      {c.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Regular Cases */}
          {regularCases.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-muted-foreground flex items-center gap-2">
                <Activity className="w-4 h-4" />
                Regular Cases ({regularCases.length})
              </h3>
              {regularCases.map(c => (
                <div key={String(c.id)} className="rounded-lg border border-border bg-muted/20 p-4">
                  <div className="flex items-start justify-between gap-2 flex-wrap">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <User className="w-4 h-4 text-muted-foreground" />
                        <span className="font-semibold text-foreground">{c.patientName}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full border ${getSeverityColor(c.severity)}`}>
                          {c.severity}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">{c.condition}</p>
                      {c.patientDetails && (
                        <p className="text-xs text-muted-foreground mt-1">{c.patientDetails}</p>
                      )}
                      <p className="text-xs text-muted-foreground mt-1">
                        {getDeptLabel(c.caseType)} • {new Date(Number(c.submissionDate) / 1_000_000).toLocaleString()}
                      </p>
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded-full border flex-shrink-0 ${getStatusColor(c.status)}`}>
                      {c.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {filtered.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <Activity className="w-10 h-10 mx-auto mb-2 opacity-30" />
              <p>No cases found</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
