import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Address {
    zip: string;
    street: string;
    city: string;
}
export interface PersistentDoctor {
    id: string;
    name: string;
    department: Department;
}
export interface EmergencyData {
    id: string;
    patientId: string;
    description: string;
    department: Department;
}
export interface PersistentEmergency {
    id: string;
    status: string;
    patientId: string;
    description: string;
    department: Department;
}
export interface PersistentCaseAssignment {
    doctorId: string;
    caseId: string;
}
export interface UserProfile {
    name: string;
    role: string;
}
export interface Patient {
    id: string;
    name: string;
    address: Address;
}
export enum Department {
    emergency = "emergency",
    cardiology = "cardiology",
    generalMedicine = "generalMedicine",
    orthopedics = "orthopedics",
    pediatrics = "pediatrics",
    neurology = "neurology"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addPatient(patient: Patient): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    assignCaseToDoctor(caseId: string, doctorId: string): Promise<void>;
    createEmergency(emergencyData: EmergencyData): Promise<void>;
    departmentTransfer(caseId: string, newDepartment: Department): Promise<void>;
    getAllEmergencies(): Promise<Array<PersistentEmergency>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getCaseAssignmentsForDoctor(doctorId: string): Promise<Array<PersistentCaseAssignment>>;
    getDoctorsByDepartment(department: Department): Promise<Array<PersistentDoctor>>;
    getEmergenciesByDepartment(department: Department): Promise<Array<PersistentEmergency>>;
    getPatient(id: string): Promise<Patient>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
}
