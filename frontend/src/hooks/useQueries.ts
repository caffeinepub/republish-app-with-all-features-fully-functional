import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { Doctor, EmergencyCase, UserProfile, CaseStatus, Department, Severity, DoctorLoginResult } from '../backend';

// ── Error Helper ──────────────────────────────────────────────────────────────

export function getFriendlyErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    const msg = error.message;
    if (msg.includes('Unauthorized')) return 'You are not authorized to perform this action.';
    if (msg.includes('not found')) return 'The requested item was not found.';
    if (msg.includes('Invalid registration code')) return 'Invalid registration code.';
    if (msg.includes('not pending approval')) return 'Doctor is not pending approval.';
    if (msg.includes('Cannot update closed case')) return 'Cannot update a closed case.';
    if (msg.includes('not approved')) return 'Doctor is not approved.';
    return msg;
  }
  return 'An unexpected error occurred.';
}

// ── User Profile Hooks ────────────────────────────────────────────────────────

export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<UserProfile | null>({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error('Actor not available');
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

// ── Doctor Hooks ──────────────────────────────────────────────────────────────

export function useGetAllDoctors() {
  const { actor, isFetching } = useActor();

  return useQuery<Doctor[]>({
    queryKey: ['allDoctors'],
    queryFn: async () => {
      if (!actor) return [];
      try {
        return await actor.getAllDoctors();
      } catch {
        return [];
      }
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetAllDoctorsPublic() {
  const { actor, isFetching } = useActor();

  return useQuery<Doctor[]>({
    queryKey: ['doctors'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllDoctorsPublic();
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 5000,
  });
}

export function useGetPendingApprovalDoctors() {
  const { actor, isFetching } = useActor();

  return useQuery<Doctor[]>({
    queryKey: ['pendingDoctors'],
    queryFn: async () => {
      if (!actor) return [];
      try {
        return await actor.getPendingApprovalDoctors();
      } catch {
        return [];
      }
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetAvailableDoctorsByDepartment(department: Department) {
  const { actor, isFetching } = useActor();

  return useQuery<Doctor[]>({
    queryKey: ['availableDoctors', department],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAvailableDoctorsByDepartment(department);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useRegisterDoctor() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: {
      name: string;
      department: Department;
      contactInfo: string;
      registrationCode: string;
      yearsOfExperience?: bigint;
      certifications?: string[];
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.registerDoctor(
        params.name,
        params.department,
        params.contactInfo,
        params.registrationCode,
        params.yearsOfExperience ?? null,
        params.certifications ?? null,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['doctors'] });
      queryClient.invalidateQueries({ queryKey: ['allDoctors'] });
      queryClient.invalidateQueries({ queryKey: ['pendingDoctors'] });
      queryClient.invalidateQueries({ queryKey: ['totalDoctorCount'] });
    },
  });
}

export function useDoctorLogin() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async (params: { doctorId: bigint; registrationCode: string }): Promise<DoctorLoginResult> => {
      if (!actor) throw new Error('Actor not available');
      return actor.doctorLogin(params.doctorId, params.registrationCode);
    },
  });
}

export function useApproveDoctor() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (doctorId: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.approveDoctor(doctorId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allDoctors'] });
      queryClient.invalidateQueries({ queryKey: ['pendingDoctors'] });
      queryClient.invalidateQueries({ queryKey: ['doctors'] });
      queryClient.invalidateQueries({ queryKey: ['totalDoctorCount'] });
    },
    onError: (error: Error) => {
      console.error('Failed to approve doctor:', error.message);
    },
  });
}

export function useRejectDoctor() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (doctorId: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.rejectDoctor(doctorId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allDoctors'] });
      queryClient.invalidateQueries({ queryKey: ['pendingDoctors'] });
      queryClient.invalidateQueries({ queryKey: ['doctors'] });
      queryClient.invalidateQueries({ queryKey: ['totalDoctorCount'] });
    },
    onError: (error: Error) => {
      console.error('Failed to reject doctor:', error.message);
    },
  });
}

export function useUpdateDoctorAvailability() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: { doctorId: bigint; available: boolean }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateDoctorAvailability(params.doctorId, params.available);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allDoctors'] });
      queryClient.invalidateQueries({ queryKey: ['doctors'] });
      queryClient.invalidateQueries({ queryKey: ['availableDoctors'] });
    },
    onError: (error: Error) => {
      console.error('Failed to update doctor availability:', error.message);
    },
  });
}

export function useUpdateDoctorDepartment() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: { doctorId: bigint; newDepartment: Department }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateDoctorDepartment(params.doctorId, params.newDepartment);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allDoctors'] });
      queryClient.invalidateQueries({ queryKey: ['doctors'] });
    },
  });
}

// ── Emergency Case Hooks ──────────────────────────────────────────────────────

export function useGetAllEmergencyCases() {
  const { actor, isFetching } = useActor();

  return useQuery<EmergencyCase[]>({
    queryKey: ['emergencyCases'],
    queryFn: async () => {
      if (!actor) return [];
      try {
        return await actor.getAllEmergencyCases();
      } catch {
        return [];
      }
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetAllCasesPublic() {
  const { actor, isFetching } = useActor();

  return useQuery<EmergencyCase[]>({
    queryKey: ['casesPublic'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllCasesPublic();
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 5000,
  });
}

export function useSubmitCase() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: {
      patientName: string;
      patientDetails: string;
      condition: string;
      caseType: Department;
      severity: Severity;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.submitCase(
        params.patientName,
        params.patientDetails,
        params.condition,
        params.caseType,
        params.severity,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['emergencyCases'] });
      queryClient.invalidateQueries({ queryKey: ['casesPublic'] });
      queryClient.invalidateQueries({ queryKey: ['totalCaseCount'] });
      queryClient.invalidateQueries({ queryKey: ['activeCriticalCounts'] });
    },
  });
}

export function useCreateEmergencyCase() {
  return useSubmitCase();
}

export function useUpdateCaseStatus() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: { caseId: bigint; newStatus: CaseStatus }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateCaseStatus(params.caseId, params.newStatus);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['emergencyCases'] });
      queryClient.invalidateQueries({ queryKey: ['casesPublic'] });
      queryClient.invalidateQueries({ queryKey: ['activeCriticalCounts'] });
    },
    onError: (error: Error) => {
      console.error('Failed to update case status:', error.message);
    },
  });
}

export function useAssignDoctorToCase() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: { caseId: bigint; doctorId: bigint }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.assignDoctorToCase(params.caseId, params.doctorId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['emergencyCases'] });
      queryClient.invalidateQueries({ queryKey: ['casesPublic'] });
    },
    onError: (error: Error) => {
      console.error('Failed to assign doctor to case:', error.message);
    },
  });
}

export function useDeleteCase() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (caseId: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteCase(caseId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['emergencyCases'] });
      queryClient.invalidateQueries({ queryKey: ['casesPublic'] });
      queryClient.invalidateQueries({ queryKey: ['totalCaseCount'] });
      queryClient.invalidateQueries({ queryKey: ['activeCriticalCounts'] });
    },
    onError: (error: Error) => {
      console.error('Failed to delete case:', error.message);
    },
  });
}

// ── Admin Dashboard Stat Hooks (public endpoints, no auth required) ───────────

export function useTotalDoctorCount() {
  const { actor, isFetching } = useActor();

  return useQuery<number>({
    queryKey: ['totalDoctorCount'],
    queryFn: async () => {
      if (!actor) return 0;
      try {
        const count = await actor.getTotalRegisteredDoctorCount();
        return Number(count);
      } catch {
        return 0;
      }
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 5000,
  });
}

export function useTotalCaseCount() {
  const { actor, isFetching } = useActor();

  return useQuery<number>({
    queryKey: ['totalCaseCount'],
    queryFn: async () => {
      if (!actor) return 0;
      try {
        const count = await actor.getTotalEmergencyCaseCount();
        return Number(count);
      } catch {
        return 0;
      }
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 5000,
  });
}

export function useActiveCriticalEmergencyCounts() {
  const { actor, isFetching } = useActor();

  return useQuery<{ totalActive: number; totalCritical: number; totalOpen: number }>({
    queryKey: ['activeCriticalCounts'],
    queryFn: async () => {
      if (!actor) return { totalActive: 0, totalCritical: 0, totalOpen: 0 };
      try {
        const result = await actor.getActiveCriticalEmergencyCounts();
        return {
          totalActive: Number(result.totalActive),
          totalCritical: Number(result.totalCritical),
          totalOpen: Number(result.totalOpen),
        };
      } catch {
        return { totalActive: 0, totalCritical: 0, totalOpen: 0 };
      }
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 5000,
  });
}

// ── Admin Hooks ───────────────────────────────────────────────────────────────

export function useIsCallerAdmin() {
  const { actor, isFetching } = useActor();

  return useQuery<boolean>({
    queryKey: ['isAdmin'],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !isFetching,
  });
}

// ── Medical Analysis Hook ─────────────────────────────────────────────────────

export function useAnalyzeMedicalReport() {
  return useMutation({
    mutationFn: async (params: { symptoms: string[]; reportText: string }) => {
      const { symptoms, reportText } = params;
      const text = reportText.toLowerCase();
      const allSymptoms = [...symptoms, ...text.split(/\s+/)];

      let severity = 'low';
      const findings: string[] = [];
      const recommendations: string[] = ['Schedule a follow-up with your doctor'];

      if (allSymptoms.some(s => ['chest', 'heart', 'cardiac'].includes(s))) {
        severity = 'critical';
        findings.push('Potential cardiac involvement detected');
        recommendations.push('Seek immediate medical attention');
      }
      if (allSymptoms.some(s => ['fever', 'temperature', 'hot'].includes(s))) {
        severity = severity === 'critical' ? 'critical' : 'medium';
        findings.push('Elevated temperature indicators');
        recommendations.push('Stay hydrated and rest');
      }
      if (allSymptoms.some(s => ['pain', 'ache', 'hurt'].includes(s))) {
        findings.push('Pain indicators present');
        recommendations.push('Consider over-the-counter pain relief');
      }

      return {
        summary: `Analysis of ${symptoms.length} symptoms. Severity: ${severity}.`,
        severity,
        findings: findings.length > 0 ? findings : ['No specific findings detected'],
        recommendations,
      };
    },
  });
}

// Re-export types for convenience
export { Department, Severity, CaseStatus };
