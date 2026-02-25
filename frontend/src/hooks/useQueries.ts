import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { Department, Severity, CaseStatus } from '@/backend';

// ─── Error helper ────────────────────────────────────────────────────────────
export function getFriendlyErrorMessage(error: unknown): string {
  if (!error) return 'An unknown error occurred.';
  const msg = error instanceof Error ? error.message : String(error);

  if (msg.includes('IC0508') || msg.includes('canister-stopped')) {
    return 'The service is temporarily unavailable. Please try again later.';
  }
  if (msg.includes('network') || msg.includes('fetch')) {
    return 'Network error. Please check your connection and try again.';
  }
  if (msg.includes('Invalid registration code') || msg.includes('Unauthorized: Invalid registration code')) {
    return 'Invalid registration code. Please enter the correct code.';
  }
  if (msg.includes('Doctor not found')) {
    return 'Doctor not found. Please check your name and department.';
  }
  if (msg.includes('Unauthorized')) {
    return 'You are not authorized to perform this action.';
  }
  if (msg.includes('not found') || msg.includes('Not found')) {
    return 'The requested resource was not found.';
  }
  return msg.length > 120 ? 'An unexpected error occurred. Please try again.' : msg;
}

// ─── User Profile ─────────────────────────────────────────────────────────────
export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery({
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
    mutationFn: async (profile: { name: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

// ─── Doctors ──────────────────────────────────────────────────────────────────
export function useGetAllDoctors() {
  const { actor, isFetching } = useActor();

  return useQuery({
    queryKey: ['doctors'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllDoctors();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useRegisterDoctor() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      name,
      department,
      registrationCode,
    }: {
      name: string;
      department: Department;
      registrationCode: string;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.registerDoctor(name, department, registrationCode);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['doctors'] });
    },
  });
}

export function useDoctorLogin() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async ({ name, department }: { name: string; department: Department }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.doctorLogin(name, department);
    },
  });
}

export function useToggleDoctorAvailability() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (doctorId: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.toggleDoctorAvailability(doctorId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['doctors'] });
    },
  });
}

// ─── Emergency Cases ──────────────────────────────────────────────────────────
export function useGetAllEmergencyCases() {
  const { actor, isFetching } = useActor();

  return useQuery({
    queryKey: ['emergencyCases'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllEmergencyCases();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateEmergencyCase() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      patientName,
      condition,
      severity,
    }: {
      patientName: string;
      condition: string;
      severity: Severity;
    }) => {
      if (!actor) throw new Error('Actor not available');
      // Backend createEmergencyCase if available; otherwise use a workaround
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return (actor as any).createEmergencyCase(patientName, condition, severity);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['emergencyCases'] });
    },
  });
}

export function useAssignDoctor() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ caseId, doctorId }: { caseId: bigint; doctorId: bigint }) => {
      if (!actor) throw new Error('Actor not available');
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return (actor as any).assignDoctor(caseId, doctorId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['emergencyCases'] });
    },
  });
}

export function useResolveCase() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (caseId: bigint) => {
      if (!actor) throw new Error('Actor not available');
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return (actor as any).resolveCase(caseId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['emergencyCases'] });
    },
  });
}

// ─── Medical Suggestions ──────────────────────────────────────────────────────
export function useAnalyzeMedicalReport() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async (reportText: string) => {
      if (!actor) throw new Error('Actor not available');
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return (actor as any).analyzeMedicalReport(reportText);
    },
  });
}

// Re-export types for convenience
export { Department, Severity, CaseStatus };
