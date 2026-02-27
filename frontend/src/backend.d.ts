import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export type DoctorLoginResult = {
    __kind__: "success";
    success: Doctor;
} | {
    __kind__: "notApproved";
    notApproved: null;
} | {
    __kind__: "doctorNotFound";
    doctorNotFound: null;
} | {
    __kind__: "invalidCredentials";
    invalidCredentials: null;
};
export interface EmergencyCase {
    id: bigint;
    status: CaseStatus;
    patientDetails: string;
    caseType: Department;
    assignedDoctorId?: bigint;
    submissionDate: bigint;
    patientName: string;
    severity: Severity;
    condition: string;
}
export interface Doctor {
    id: bigint;
    status: DoctorStatus;
    yearsOfExperience?: bigint;
    contactInfo: string;
    name: string;
    available: boolean;
    registrationCode: string;
    registrationDate: bigint;
    department: Department;
    certifications?: Array<string>;
}
export interface UserProfile {
    name: string;
}
export enum CaseStatus {
    resolved = "resolved",
    closed = "closed",
    assigned = "assigned",
    open = "open",
    inProgress = "inProgress"
}
export enum Department {
    emergency = "emergency",
    cardiology = "cardiology",
    generalMedicine = "generalMedicine",
    orthopedics = "orthopedics",
    pediatrics = "pediatrics",
    neurology = "neurology"
}
export enum DoctorStatus {
    pendingApproval = "pendingApproval",
    approved = "approved",
    rejected = "rejected"
}
export enum Severity {
    low = "low",
    high = "high",
    critical = "critical",
    medium = "medium"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    approveDoctor(doctorId: bigint): Promise<Doctor>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    assignDoctorToCase(caseId: bigint, doctorId: bigint): Promise<EmergencyCase>;
    deleteCase(caseId: bigint): Promise<void>;
    doctorLogin(doctorId: bigint, registrationCode: string): Promise<DoctorLoginResult>;
    getActiveCriticalEmergencyCounts(): Promise<{
        totalOpen: bigint;
        totalActive: bigint;
        totalCritical: bigint;
    }>;
    getAllCasesPublic(): Promise<Array<EmergencyCase>>;
    getAllDoctors(): Promise<Array<Doctor>>;
    getAllDoctorsPublic(): Promise<Array<Doctor>>;
    getAllEmergencyCases(): Promise<Array<EmergencyCase>>;
    getAvailableDoctorsByDepartment(department: Department): Promise<Array<Doctor>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getPendingApprovalDoctors(): Promise<Array<Doctor>>;
    getTotalEmergencyCaseCount(): Promise<bigint>;
    getTotalRegisteredDoctorCount(): Promise<bigint>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    initialize(): Promise<void>;
    isCallerAdmin(): Promise<boolean>;
    registerDoctor(name: string, department: Department, contactInfo: string, registrationCode: string, yearsOfExperience: bigint | null, certifications: Array<string> | null): Promise<Doctor>;
    rejectDoctor(doctorId: bigint): Promise<Doctor>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    submitCase(patientName: string, patientDetails: string, condition: string, caseType: Department, severity: Severity): Promise<EmergencyCase>;
    updateCaseStatus(caseId: bigint, newStatus: CaseStatus): Promise<EmergencyCase>;
    updateDoctorAvailability(doctorId: bigint, available: boolean): Promise<void>;
    updateDoctorDepartment(doctorId: bigint, newDepartment: Department): Promise<void>;
}
