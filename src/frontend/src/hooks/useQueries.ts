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

// Admin Registration
export function useRegisterAdmin() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (adminProfile: UserProfile) => {
      if (!actor) throw new Error('Actor not initialized');
      await actor.registerAdmin(adminProfile);
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
    mutationFn: async (doctorData: DoctorData) => {
      if (!actor) throw new Error('Actor not initialized');
      await actor.registerDoctor(doctorData);
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
    mutationFn: async (doctor: DoctorData) => {
      if (!actor) throw new Error('Actor not initialized');
      await actor.registerDoctor(doctor);
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

// Type definitions for AI analysis results
interface SymptomCondition {
  condition: string;
  probability: string;
  severity: string;
  recommendations: string[];
}

interface SymptomAnalysisResult {
  analysis: SymptomCondition[];
  disclaimer: string;
}

interface MedicalReportAnalysisResult {
  severity: string;
  keyFindings: string[];
  recommendations: string[];
  disclaimer: string;
}

// AI Symptom Analysis (Client-side simulation)
export function useAnalyzeSymptoms() {
  return useMutation<SymptomAnalysisResult, Error, string>({
    mutationFn: async (symptoms: string) => {
      // Simulate AI processing delay
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Simple keyword-based analysis simulation
      const lowerSymptoms = symptoms.toLowerCase();
      const conditions: SymptomCondition[] = [];

      if (lowerSymptoms.includes('fever') || lowerSymptoms.includes('temperature')) {
        conditions.push({
          condition: 'Viral Infection',
          probability: 'High',
          severity: 'Moderate',
          recommendations: [
            'Rest and stay hydrated',
            'Monitor temperature regularly',
            'Consider over-the-counter fever reducers',
            'Consult a doctor if fever persists beyond 3 days',
          ],
        });
      }

      if (lowerSymptoms.includes('chest pain') || lowerSymptoms.includes('heart')) {
        conditions.push({
          condition: 'Cardiac Concern',
          probability: 'Medium',
          severity: 'High',
          recommendations: [
            'Seek immediate medical attention',
            'Avoid physical exertion',
            'Monitor blood pressure if possible',
            'Call emergency services if pain worsens',
          ],
        });
      }

      if (lowerSymptoms.includes('headache') || lowerSymptoms.includes('migraine')) {
        conditions.push({
          condition: 'Tension Headache',
          probability: 'High',
          severity: 'Low',
          recommendations: [
            'Rest in a quiet, dark room',
            'Apply cold or warm compress',
            'Stay hydrated',
            'Consider over-the-counter pain relief',
          ],
        });
      }

      if (lowerSymptoms.includes('cough') || lowerSymptoms.includes('cold')) {
        conditions.push({
          condition: 'Upper Respiratory Infection',
          probability: 'High',
          severity: 'Low',
          recommendations: [
            'Get plenty of rest',
            'Drink warm fluids',
            'Use a humidifier',
            'Consult a doctor if symptoms worsen',
          ],
        });
      }

      if (conditions.length === 0) {
        conditions.push({
          condition: 'General Malaise',
          probability: 'Medium',
          severity: 'Low',
          recommendations: [
            'Monitor your symptoms',
            'Ensure adequate rest and nutrition',
            'Stay hydrated',
            'Consult a healthcare provider if symptoms persist',
          ],
        });
      }

      return {
        analysis: conditions,
        disclaimer:
          'This is an AI-generated analysis and should not replace professional medical advice. Please consult a healthcare provider for accurate diagnosis.',
      };
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to analyze symptoms');
    },
  });
}

// AI Medical Report Analysis (Client-side simulation)
export function useAnalyzeMedicalReport() {
  return useMutation<MedicalReportAnalysisResult, Error, string>({
    mutationFn: async (reportText: string) => {
      // Simulate AI processing delay
      await new Promise((resolve) => setTimeout(resolve, 2500));

      // Simple keyword-based analysis simulation
      const lowerReport = reportText.toLowerCase();
      const findings: string[] = [];
      let severity = 'Normal';

      if (lowerReport.includes('elevated') || lowerReport.includes('high')) {
        findings.push('Elevated biomarker levels detected');
        severity = 'Moderate';
      }

      if (lowerReport.includes('abnormal') || lowerReport.includes('irregular')) {
        findings.push('Abnormal test results identified');
        severity = 'High';
      }

      if (lowerReport.includes('normal') || lowerReport.includes('within range')) {
        findings.push('Most parameters within normal range');
      }

      if (lowerReport.includes('infection') || lowerReport.includes('inflammation')) {
        findings.push('Signs of infection or inflammation present');
        severity = 'Moderate';
      }

      if (findings.length === 0) {
        findings.push('Report reviewed - general observations noted');
      }

      const recommendations: string[] = [];
      if (severity === 'High') {
        recommendations.push('Immediate follow-up recommended');
        recommendations.push('Consider additional diagnostic tests');
        recommendations.push('Monitor patient closely');
      } else if (severity === 'Moderate') {
        recommendations.push('Schedule follow-up appointment');
        recommendations.push('Monitor symptoms');
        recommendations.push('Consider lifestyle modifications');
      } else {
        recommendations.push('Continue routine monitoring');
        recommendations.push('Maintain healthy lifestyle');
        recommendations.push('Schedule regular check-ups');
      }

      return {
        severity,
        keyFindings: findings,
        recommendations,
        disclaimer:
          'This is an AI-generated analysis for reference only. Always verify with professional medical judgment.',
      };
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to analyze medical report');
    },
  });
}
