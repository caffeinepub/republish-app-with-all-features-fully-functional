import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type {
  Patient,
  EmergencyData,
  PersistentEmergency,
  DoctorData,
  PersistentDoctor,
  PersistentCaseAssignment,
  UserProfile,
  Department,
} from '../backend';
import { toast } from 'sonner';

// User Profile Queries
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
      if (!actor) throw new Error('Actor not initialized');
      await actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
      toast.success('Profile saved successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to save profile');
    },
  });
}

// Patient Queries
export function useAddPatient() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async (patient: Patient) => {
      if (!actor) throw new Error('Actor not initialized');
      await actor.addPatient(patient);
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to add patient');
    },
  });
}

export function useGetPatient(id: string) {
  const { actor, isFetching } = useActor();

  return useQuery<Patient>({
    queryKey: ['patient', id],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getPatient(id);
    },
    enabled: !!actor && !isFetching && !!id,
  });
}

// Emergency Queries
export function useCreateEmergency() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  const addPatient = useAddPatient();

  return useMutation({
    mutationFn: async ({ patient, emergency }: { patient: Patient; emergency: EmergencyData }) => {
      if (!actor) throw new Error('Actor not initialized');
      await addPatient.mutateAsync(patient);
      await actor.createEmergency(emergency);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['emergencies'] });
      toast.success('Emergency case submitted successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to create emergency case');
    },
  });
}

export function useGetAllEmergencies() {
  const { actor, isFetching } = useActor();

  return useQuery<PersistentEmergency[]>({
    queryKey: ['emergencies'],
    queryFn: async () => {
      if (!actor) return [];
      try {
        return await actor.getAllEmergencies();
      } catch (error) {
        console.error('Error fetching emergencies:', error);
        throw error;
      }
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetEmergenciesByDepartment(department: Department) {
  const { actor, isFetching } = useActor();

  return useQuery<PersistentEmergency[]>({
    queryKey: ['emergencies', department],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getEmergenciesByDepartment(department);
    },
    enabled: !!actor && !isFetching && !!department,
  });
}

// Doctor Queries
export function useAddDoctor() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (doctor: DoctorData) => {
      if (!actor) throw new Error('Actor not initialized');
      await actor.addDoctor(doctor);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['doctors'] });
      toast.success('Doctor added successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to add doctor');
    },
  });
}

export function useGetAllDoctors() {
  const { actor, isFetching } = useActor();

  return useQuery<PersistentDoctor[]>({
    queryKey: ['doctors'],
    queryFn: async () => {
      if (!actor) return [];
      const departments = [
        'emergency',
        'cardiology',
        'neurology',
        'pediatrics',
        'orthopedics',
        'generalMedicine',
      ];
      const allDoctors: PersistentDoctor[] = [];
      for (const dept of departments) {
        try {
          const doctors = await actor.getDoctorsByDepartment(dept as Department);
          allDoctors.push(...doctors);
        } catch (error) {
          console.error(`Error fetching doctors for ${dept}:`, error);
        }
      }
      return allDoctors;
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetDoctorsByDepartment(department: Department) {
  const { actor, isFetching } = useActor();

  return useQuery<PersistentDoctor[]>({
    queryKey: ['doctors', department],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getDoctorsByDepartment(department);
    },
    enabled: !!actor && !isFetching && !!department,
  });
}

// Case Assignment Queries
export function useAssignCaseToDoctor() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ caseId, doctorId }: { caseId: string; doctorId: string }) => {
      if (!actor) throw new Error('Actor not initialized');
      await actor.assignCaseToDoctor(caseId, doctorId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['emergencies'] });
      queryClient.invalidateQueries({ queryKey: ['caseAssignments'] });
      toast.success('Case assigned to doctor successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to assign case to doctor');
    },
  });
}

export function useGetCaseAssignments(doctorId: string) {
  const { actor, isFetching } = useActor();

  return useQuery<PersistentCaseAssignment[]>({
    queryKey: ['caseAssignments', doctorId],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getCaseAssignmentsForDoctor(doctorId);
    },
    enabled: !!actor && !isFetching && !!doctorId,
  });
}
