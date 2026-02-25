import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface EmergencyCase {
    id: bigint;
    status: CaseStatus;
    createdAt: bigint;
    assignedDoctorId?: bigint;
    patientName: string;
    severity: Severity;
    condition: string;
}
export interface Doctor {
    id: bigint;
    name: string;
    available: boolean;
    registrationCode: string;
    department: Department;
}
export interface UserProfile {
    name: string;
}
export enum CaseStatus {
    resolved = "resolved",
    assigned = "assigned",
    open = "open"
}
export enum Department {
    emergency = "emergency",
    cardiology = "cardiology",
    generalMedicine = "generalMedicine",
    orthopedics = "orthopedics",
    pediatrics = "pediatrics",
    neurology = "neurology"
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
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    doctorLogin(name: string, department: Department): Promise<Doctor>;
    getAllDoctors(): Promise<Array<Doctor>>;
    getAllEmergencyCases(): Promise<Array<EmergencyCase>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    initialize(): Promise<void>;
    isCallerAdmin(): Promise<boolean>;
    registerDoctor(name: string, department: Department, registrationCode: string): Promise<Doctor>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    toggleDoctorAvailability(doctorId: bigint): Promise<Doctor>;
}
