import Array "mo:core/Array";
import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import Text "mo:core/Text";
import Time "mo:core/Time";
import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";

actor {
  // Types
  public type Department = {
    #emergency;
    #cardiology;
    #neurology;
    #pediatrics;
    #orthopedics;
    #generalMedicine;
  };

  public type DoctorStatus = {
    #pendingApproval;
    #approved;
    #rejected;
  };

  public type Doctor = {
    id : Nat;
    name : Text;
    department : Department;
    available : Bool;
    registrationCode : Text;
    contactInfo : Text;
    registrationDate : Int;
    status : DoctorStatus;
    yearsOfExperience : ?Nat;
    certifications : ?[Text];
  };

  public type DoctorLoginResult = {
    #success : Doctor;
    #invalidCredentials;
    #doctorNotFound;
    #notApproved;
  };

  public type Severity = {
    #low;
    #medium;
    #high;
    #critical;
  };

  public type CaseStatus = {
    #open;
    #assigned;
    #inProgress;
    #resolved;
    #closed;
  };

  public type EmergencyCase = {
    id : Nat;
    patientName : Text;
    patientDetails : Text;
    condition : Text;
    caseType : Department;
    severity : Severity;
    assignedDoctorId : ?Nat;
    status : CaseStatus;
    submissionDate : Int;
  };

  public type UserProfile = {
    name : Text;
  };

  public type MedicalSuggestion = {
    symptoms : [Text];
    medication : Text;
    dosage : Text;
  };

  let doctors = Map.empty<Nat, Doctor>();
  let userProfiles = Map.empty<Principal, UserProfile>();
  let emergencyCases = Map.empty<Nat, EmergencyCase>();
  let medicalSuggestions = Map.empty<Nat, MedicalSuggestion>();

  var nextDoctorId = 1;
  var nextCaseId = 1;
  var nextSuggestionId = 1;

  // SYSTEM STATE: Authorization module via component mixin
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  public shared ({ caller }) func initialize() : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admin can initialize");
    };
  };

  // ── User profile management ──────────────────────────────────────────────

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can get their own profile");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can save their own profile");
    };
    userProfiles.add(caller, profile);
  };

  // ── Doctor registration & login ──────────────────────────────────────────

  // Anyone who knows the registration code "2011" can register as a doctor.
  // No principal-level auth required – the code itself is the credential.
  public shared ({ caller }) func registerDoctor(
    name : Text,
    department : Department,
    contactInfo : Text,
    registrationCode : Text,
    yearsOfExperience : ?Nat,
    certifications : ?[Text],
  ) : async Doctor {
    if (registrationCode != "2011") {
      Runtime.trap("Unauthorized: Invalid registration code");
    };

    let doctor : Doctor = {
      id = nextDoctorId;
      name;
      department;
      available = true;
      registrationCode;
      contactInfo;
      registrationDate = Time.now();
      // Doctors are approved immediately upon valid registration code so they
      // can log in right away, as described in the implementation plan.
      status = #approved;
      yearsOfExperience;
      certifications;
    };

    doctors.add(nextDoctorId, doctor);
    nextDoctorId += 1;
    doctor;
  };

  // Public login – no principal auth required; credentials are doctorId + code.
  public query func doctorLogin(
    doctorId : Nat,
    registrationCode : Text,
  ) : async DoctorLoginResult {
    switch (doctors.get(doctorId)) {
      case (null) { #doctorNotFound };
      case (?doctor) {
        if (doctor.status == #rejected) { return #notApproved };
        if (doctor.registrationCode == registrationCode) {
          #success(doctor);
        } else {
          #invalidCredentials;
        };
      };
    };
  };

  // ── Admin doctor management ──────────────────────────────────────────────

  public shared ({ caller }) func approveDoctor(doctorId : Nat) : async Doctor {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can approve doctors");
    };

    let doctor = switch (doctors.get(doctorId)) {
      case (null) { Runtime.trap("Doctor not found") };
      case (?doc) { doc };
    };

    if (doctor.status != #pendingApproval) {
      Runtime.trap("Doctor is not pending approval");
    };

    let approvedDoctor = { doctor with status = #approved };
    doctors.add(doctorId, approvedDoctor);
    approvedDoctor;
  };

  public shared ({ caller }) func rejectDoctor(doctorId : Nat) : async Doctor {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can reject doctors");
    };

    let doctor = switch (doctors.get(doctorId)) {
      case (null) { Runtime.trap("Doctor not found") };
      case (?doc) { doc };
    };

    if (doctor.status != #pendingApproval) {
      Runtime.trap("Doctor is not pending approval");
    };

    let rejectedDoctor = { doctor with status = #rejected };
    doctors.add(doctorId, rejectedDoctor);
    rejectedDoctor;
  };

  // Admin-only: full doctor list with all details.
  public query ({ caller }) func getAllDoctors() : async [Doctor] {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can view all doctor profiles");
    };
    doctors.values().toArray();
  };

  // Admin-only: view doctors awaiting approval.
  public query ({ caller }) func getPendingApprovalDoctors() : async [Doctor] {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can view pending approval doctors");
    };
    doctors.values().toArray().filter(func(doctor) { doctor.status == #pendingApproval });
  };

  // Admin-only: change a doctor's department.
  public shared ({ caller }) func updateDoctorDepartment(doctorId : Nat, newDepartment : Department) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can update doctor department");
    };

    let doctor = switch (doctors.get(doctorId)) {
      case (null) { Runtime.trap("Doctor not found") };
      case (?doc) { doc };
    };

    let updatedDoctor = { doctor with department = newDepartment };
    doctors.add(doctorId, updatedDoctor);
  };

  // ── Doctor availability toggle ───────────────────────────────────────────

  // Availability can be toggled by any authenticated user (doctor using their
  // own dashboard) or by an admin.  Guests (anonymous principals) are not
  // allowed to change availability.
  public shared ({ caller }) func updateDoctorAvailability(doctorId : Nat, available : Bool) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can update doctor availability");
    };

    let doctor = switch (doctors.get(doctorId)) {
      case (null) { Runtime.trap("Doctor not found") };
      case (?doc) { doc };
    };

    let updatedDoctor = { doctor with available };
    doctors.add(doctorId, updatedDoctor);
  };

  // ── Public read-only endpoints (patients, guests) ────────────────────────

  // Public list of all doctors (used by patient portal and doctor dashboard).
  public query func getAllDoctorsPublic() : async [Doctor] {
    doctors.values().toArray();
  };

  // Public list of all cases (used by doctor dashboard).
  public query func getAllCasesPublic() : async [EmergencyCase] {
    emergencyCases.values().toArray();
  };

  // Public filtered list of available approved doctors by department.
  public query func getAvailableDoctorsByDepartment(department : Department) : async [Doctor] {
    doctors.values().toArray().filter(
      func(doctor) {
        doctor.available and doctor.department == department and doctor.status == #approved
      }
    );
  };

  // ── Case management ──────────────────────────────────────────────────────

  // Anyone (including guests / patients) can submit a case.
  public shared ({ caller }) func submitCase(
    patientName : Text,
    patientDetails : Text,
    condition : Text,
    caseType : Department,
    severity : Severity,
  ) : async EmergencyCase {
    let newCase : EmergencyCase = {
      id = nextCaseId;
      patientName;
      patientDetails;
      condition;
      caseType;
      severity;
      assignedDoctorId = null;
      status = #open;
      submissionDate = Time.now();
    };

    emergencyCases.add(nextCaseId, newCase);
    nextCaseId += 1;
    newCase;
  };

  // Admin-only: update the status of a case.
  public shared ({ caller }) func updateCaseStatus(caseId : Nat, newStatus : CaseStatus) : async EmergencyCase {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can update case status");
    };

    let existingCase = switch (emergencyCases.get(caseId)) {
      case (null) { Runtime.trap("Case not found") };
      case (?c) { c };
    };

    if (existingCase.status == #closed) {
      Runtime.trap("Cannot update closed case");
    };

    let updatedCase = { existingCase with status = newStatus };
    emergencyCases.add(caseId, updatedCase);
    updatedCase;
  };

  // Admin-only: delete a case.
  public shared ({ caller }) func deleteCase(caseId : Nat) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can delete cases");
    };

    switch (emergencyCases.get(caseId)) {
      case (null) { Runtime.trap("Case not found") };
      case (_) {};
    };

    emergencyCases.remove(caseId);
  };

  // Admin-only: full case list with all details.
  public query ({ caller }) func getAllEmergencyCases() : async [EmergencyCase] {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can view all emergency cases");
    };
    emergencyCases.values().toArray();
  };

  // Admin-only: assign a doctor to a case.
  public shared ({ caller }) func assignDoctorToCase(caseId : Nat, doctorId : Nat) : async EmergencyCase {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can assign doctors to cases");
    };

    let emergencyCase = switch (emergencyCases.get(caseId)) {
      case (null) { Runtime.trap("Case not found") };
      case (?c) { c };
    };

    let doctor = switch (doctors.get(doctorId)) {
      case (null) { Runtime.trap("Doctor not found") };
      case (?doc) { doc };
    };

    if (doctor.status != #approved) {
      Runtime.trap("Doctor is not approved");
    };

    let updatedCase = { emergencyCase with assignedDoctorId = ?doctorId };
    emergencyCases.add(caseId, updatedCase);
    updatedCase;
  };

  // ── Admin dashboard metrics ──────────────────────────────────────────────

  // For the admin dashboard: live total number of doctors, cases, and active emergencies

  // Total number of registered doctors (regardless of status)
  public query func getTotalRegisteredDoctorCount() : async Nat {
    doctors.size();
  };

  // Total number of emergency cases (regardless of status)
  public query func getTotalEmergencyCaseCount() : async Nat {
    emergencyCases.size();
  };

  // Total number of active (non-closed) and critical emergencies
  public query func getActiveCriticalEmergencyCounts() : async {
    totalActive : Nat;
    totalCritical : Nat;
    totalOpen : Nat;
  } {
    var active = 0;
    var critical = 0;
    var open = 0;

    let cases = emergencyCases.values().toArray();
    for (caseData in cases.values()) {
      switch (caseData.status) {
        case (#open) { active += 1; open += 1 };
        case (#assigned) { active += 1 };
        case (#inProgress) { active += 1 };
        case (#resolved) { active += 1 };
        case (#closed) {};
      };
      switch (caseData.severity) {
        case (#critical) { critical += 1 };
        case (_) {};
      };
    };

    {
      totalActive = active;
      totalCritical = critical;
      totalOpen = open;
    };
  };
};
