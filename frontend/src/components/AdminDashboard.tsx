import React from 'react';
import { Users, UserCheck, AlertTriangle, Activity } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import DoctorManagement from './DoctorManagement';
import CaseManagement from './CaseManagement';
import { useGetAllDoctors, useGetAllEmergencyCases } from '@/hooks/useQueries';
import { CaseStatus, Severity } from '@/backend';

interface AdminDashboardProps {
  readOnly?: boolean;
}

export default function AdminDashboard({ readOnly = false }: AdminDashboardProps) {
  const { data: doctors, isLoading: doctorsLoading } = useGetAllDoctors();
  const { data: cases, isLoading: casesLoading } = useGetAllEmergencyCases();

  const totalDoctors = doctors?.length ?? 0;
  const availableDoctors = doctors?.filter((d) => d.available).length ?? 0;
  const openCases = cases?.filter((c) => c.status === CaseStatus.open || c.status === CaseStatus.assigned).length ?? 0;
  const criticalCases = cases?.filter((c) => c.severity === Severity.critical).length ?? 0;

  const stats = [
    {
      title: 'Total Doctors',
      value: totalDoctors,
      icon: Users,
      color: 'text-primary',
      bg: 'bg-primary/10',
      loading: doctorsLoading,
    },
    {
      title: 'Available Doctors',
      value: availableDoctors,
      icon: UserCheck,
      color: 'text-green-600',
      bg: 'bg-green-100',
      loading: doctorsLoading,
    },
    {
      title: 'Open Cases',
      value: openCases,
      icon: Activity,
      color: 'text-orange-600',
      bg: 'bg-orange-100',
      loading: casesLoading,
    },
    {
      title: 'Critical Cases',
      value: criticalCases,
      icon: AlertTriangle,
      color: 'text-red-600',
      bg: 'bg-red-100',
      loading: casesLoading,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.title} className="border border-border">
            <CardHeader className="pb-2 pt-4 px-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
                <div className={`w-8 h-8 rounded-full ${stat.bg} flex items-center justify-center`}>
                  <stat.icon className={`w-4 h-4 ${stat.color}`} />
                </div>
              </div>
            </CardHeader>
            <CardContent className="px-4 pb-4">
              {stat.loading ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <p className="text-3xl font-bold text-foreground">{stat.value}</p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Tabs */}
      <Tabs defaultValue="doctors">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="doctors">Doctor Management</TabsTrigger>
          <TabsTrigger value="cases">Case Management</TabsTrigger>
        </TabsList>
        <TabsContent value="doctors" className="mt-4">
          <DoctorManagement readOnly={readOnly} />
        </TabsContent>
        <TabsContent value="cases" className="mt-4">
          <CaseManagement readOnly={readOnly} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
