import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type {
  Patient,
  EmergencyData,
  PersistentEmergency,
  PersistentDoctor,
  PersistentCaseAssignment,
  UserProfile,
  Department,
} from '../backend';
import { toast } from 'sonner';

// Local type for doctor registration (matches PersistentDoctor structure)
type DoctorRegistrationData = {
  id: string;
  name: string;
  department: Department;
};

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

// Admin Registration (deprecated - replaced by direct principal verification)
export function useRegisterAdmin() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (adminProfile: UserProfile) => {
      if (!actor) throw new Error('Actor not initialized');
      await actor.saveCallerUserProfile(adminProfile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
      queryClient.invalidateQueries({ queryKey: ['isAdmin'] });
      toast.success('Admin registration successful');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to register as admin');
    },
  });
}

// Doctor Registration
export function useRegisterDoctor() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (doctorData: DoctorRegistrationData) => {
      if (!actor) throw new Error('Actor not initialized');
      // Save user profile as doctor
      await actor.saveCallerUserProfile({ name: doctorData.name, role: 'doctor' });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['doctors'] });
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
      toast.success('Doctor registration successful');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to register as doctor');
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
    mutationFn: async (doctor: DoctorRegistrationData) => {
      if (!actor) throw new Error('Actor not initialized');
      await actor.saveCallerUserProfile({ name: doctor.name, role: 'doctor' });
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
      queryClient.invalidateQueries({ queryKey: ['caseAssignments'] });
      queryClient.invalidateQueries({ queryKey: ['emergencies'] });
      toast.success('Case assigned successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to assign case');
    },
  });
}

export function useGetCaseAssignmentsForDoctor(doctorId: string) {
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

// AI Analysis Functions (client-side mock implementations)
export function useAnalyzeSymptoms() {
  return useMutation({
    mutationFn: async (symptoms: string) => {
      // Simulate AI analysis delay
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Mock AI response based on symptoms
      const symptomsLower = symptoms.toLowerCase();
      let diagnosis = 'General consultation recommended';
      let severity: 'low' | 'medium' | 'high' = 'low';
      let recommendations: string[] = ['Rest and hydration', 'Monitor symptoms'];

      if (symptomsLower.includes('chest pain') || symptomsLower.includes('heart')) {
        diagnosis = 'Possible cardiac concern';
        severity = 'high';
        recommendations = ['Seek immediate medical attention', 'Call emergency services', 'Do not exert yourself'];
      } else if (symptomsLower.includes('fever') || symptomsLower.includes('cough')) {
        diagnosis = 'Possible respiratory infection';
        severity = 'medium';
        recommendations = ['Rest and stay hydrated', 'Monitor temperature', 'Consult a doctor if symptoms worsen'];
      } else if (symptomsLower.includes('headache') || symptomsLower.includes('migraine')) {
        diagnosis = 'Possible tension headache or migraine';
        severity = 'medium';
        recommendations = ['Rest in a quiet, dark room', 'Stay hydrated', 'Consider over-the-counter pain relief'];
      }

      return {
        diagnosis,
        severity,
        recommendations,
        confidence: 0.85,
      };
    },
    onSuccess: () => {
      toast.success('Symptom analysis complete');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to analyze symptoms');
    },
  });
}

export function useAnalyzeMedicalReport() {
  return useMutation({
    mutationFn: async (reportText: string) => {
      // Simulate AI analysis delay
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Mock AI response based on report content
      const reportLower = reportText.toLowerCase();
      let findings: string[] = [];
      let severity: 'normal' | 'attention' | 'urgent' = 'normal';
      let recommendations: string[] = [];

      if (reportLower.includes('elevated') || reportLower.includes('high')) {
        findings.push('Elevated levels detected in blood work');
        severity = 'attention';
        recommendations.push('Follow up with your physician', 'Consider lifestyle modifications');
      }

      if (reportLower.includes('abnormal') || reportLower.includes('irregular')) {
        findings.push('Abnormal patterns identified');
        severity = 'urgent';
        recommendations.push('Immediate consultation recommended', 'Additional tests may be required');
      }

      if (findings.length === 0) {
        findings.push('All parameters within normal range');
        recommendations.push('Continue regular health monitoring', 'Maintain healthy lifestyle');
      }

      return {
        findings,
        severity,
        recommendations,
        summary: `Analysis of medical report shows ${severity} status. ${findings.length} key finding(s) identified.`,
      };
    },
    onSuccess: () => {
      toast.success('Medical report analysis complete');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to analyze medical report');
    },
  });
}
