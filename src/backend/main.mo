import Runtime "mo:core/Runtime";
import Map "mo:core/Map";
import Text "mo:core/Text";
import Iter "mo:core/Iter";
import Order "mo:core/Order";
import Nat "mo:core/Nat";
import Principal "mo:core/Principal";
import Array "mo:core/Array";
import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";


/**
 * ADMIN CONFIGURATION
 *
 * To configure the admin principal ID for your Internet Identity:
 *
 * 1. Deploy your canister and start the frontend application
 * 2. Navigate to your frontend URL with the backend canister ID parameter:
 *    Example: https://your-frontend.ic0.app/?canisterId=<backend-canister-id>
 * 3. Click "Login" and authenticate with your Internet Identity
 * 4. After successful authentication, open the browser's developer console (F12)
 * 5. Your principal ID will be displayed in the console output
 * 6. Copy the principal ID (format: xxxxx-xxxxx-xxxxx-xxxxx-xxx)
 * 7. Replace the principal text below with your copied principal ID
 * 8. Redeploy the canister
 *
 * SECURITY WARNING: Only the person with access to this specific Internet Identity
 * will have admin privileges. Keep your Internet Identity credentials secure!
 *
 * Current admin principal (replace with your own):
 */
 actor {
  let ADMIN_PRINCIPAL_ID : Text = "lm7cd-boz46-i3ikn-y6jpd-rpqsz-hnpfq-3vfkw-ocuun-x2wl7-vv3sh-tqe";

  // Initialize the access control system
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // Initialize admin on first call
  private var adminInitialized : Bool = false;

  private func ensureAdminInitialized(caller : Principal) {
    if (not adminInitialized) {
      let adminPrincipal = Principal.fromText(ADMIN_PRINCIPAL_ID);
      if (caller == adminPrincipal) {
        adminInitialized := true;
      };
    };
  };

  public type Department = {
    #emergency;
    #cardiology;
    #neurology;
    #pediatrics;
    #orthopedics;
    #generalMedicine;
  };

  public type Address = {
    street : Text;
    city : Text;
    zip : Text;
  };

  public type Patient = {
    id : Text;
    name : Text;
    address : Address;
  };

  type PersistentPatient = {
    id : Text;
    name : Text;
    address : Address;
  };

  public type EmergencyData = {
    id : Text;
    patientId : Text;
    description : Text;
    department : Department;
  };

  type PersistentEmergency = {
    id : Text;
    patientId : Text;
    description : Text;
    department : Department;
    status : Text;
  };

  module PersistentEmergency {
    public func compare(a : PersistentEmergency, b : PersistentEmergency) : Order.Order {
      Text.compare(a.id, b.id);
    };
  };

  public type DoctorData = {
    id : Text;
    name : Text;
    department : Department;
  };

  type PersistentDoctor = {
    id : Text;
    name : Text;
    department : Department;
  };

  public type CaseAssignment = {
    caseId : Text;
    doctorId : Text;
  };

  type PersistentCaseAssignment = {
    caseId : Text;
    doctorId : Text;
  };

  public type UserProfile = {
    name : Text;
    role : Text;
  };

  // State and persistent data structures
  let persistentPatientMap : Map.Map<Text, PersistentPatient> = Map.empty<Text, PersistentPatient>();
  let persistentEmergencyMap : Map.Map<Text, PersistentEmergency> = Map.empty<Text, PersistentEmergency>();
  let persistentDoctorMap : Map.Map<Text, PersistentDoctor> = Map.empty<Text, PersistentDoctor>();
  let persistentCaseAssignmentMap : Map.Map<Text, PersistentCaseAssignment> = Map.empty<Text, PersistentCaseAssignment>();
  let persistentCreatedCasesCount : Map.Map<Text, Nat> = Map.empty<Text, Nat>();
  let userProfiles : Map.Map<Principal, UserProfile> = Map.empty<Principal, UserProfile>();

  // User Profile Management - Users can manage their own profiles
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
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
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  private func persistentPatientToPatient(persistentPatient : PersistentPatient) : Patient {
    {
      id = persistentPatient.id;
      name = persistentPatient.name;
      address = persistentPatient.address;
    };
  };

  // Patient Management - Requires user authentication
  public shared ({ caller }) func addPatient(patient : Patient) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can add patients");
    };
    persistentPatientMap.add(patient.id, patient);
  };

  public query ({ caller }) func getPatient(id : Text) : async Patient {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view patient data");
    };
    switch (persistentPatientMap.get(id)) {
      case (?persistedPatient) { persistentPatientToPatient(persistedPatient) };
      case (null) { Runtime.trap("Patient with id " # id # " does not exist") };
    };
  };

  // Emergency Case Management - Requires user authentication
  public shared ({ caller }) func createEmergency(emergencyData : EmergencyData) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can create emergency cases");
    };
    let persistentEmergency = {
      id = emergencyData.id;
      patientId = emergencyData.patientId;
      description = emergencyData.description;
      department = emergencyData.department;
      status = "created";
    };
    persistentEmergencyMap.add(emergencyData.id, persistentEmergency);

    let currentCount = switch (persistentCreatedCasesCount.get(emergencyData.patientId)) {
      case (null) { 0 };
      case (?c) { c };
    };

    persistentCreatedCasesCount.add(emergencyData.patientId, currentCount + 1);
  };

  public query ({ caller }) func getAllEmergencies() : async [PersistentEmergency] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view emergencies");
    };
    persistentEmergencyMap.values().toArray().sort();
  };

  public query ({ caller }) func getEmergenciesByDepartment(department : Department) : async [PersistentEmergency] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view emergencies by department");
    };
    let emergencies = persistentEmergencyMap.values().toArray();
    let filtered = emergencies.filter(
      func(e) {
        e.department == department;
      }
    );
    filtered.sort();
  };

  // Case Assignments - Admin only
  public shared ({ caller }) func assignCaseToDoctor(caseId : Text, doctorId : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can assign cases to doctors");
    };
    verifyDepartmentMatch(caseId, doctorId);
    persistentCaseAssignmentMap.add(caseId, { caseId; doctorId });
  };

  public query ({ caller }) func getCaseAssignmentsForDoctor(doctorId : Text) : async [PersistentCaseAssignment] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view case assignments");
    };
    let assignments = persistentCaseAssignmentMap.values().toArray();
    let filtered = assignments.filter(
      func(a) {
        a.doctorId == doctorId;
      }
    );
    filtered;
  };

  // Department Coordination - Admin only
  public shared ({ caller }) func departmentTransfer(caseId : Text, newDepartment : Department) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can transfer cases between departments");
    };
    verifyDepartment(newDepartment);

    let emergency = switch (persistentEmergencyMap.get(caseId)) {
      case (?e) { e };
      case (null) { Runtime.trap("Case id " # caseId # " does not exist") };
    };

    let onlyPatient = getPatientsForDepartment(newDepartment);
    if (onlyPatient == []) {
      Runtime.trap("Patient not Found...");
    };

    persistentEmergencyMap.add(caseId, { emergency with department = newDepartment });
    Runtime.trap("Case " # caseId # " is now handled by department " # departmentToString(newDepartment));
  };

  // Helper functions
  private func verifyDepartmentMatch(caseId : Text, doctorId : Text) {
    let persistentEmergency = switch (persistentEmergencyMap.get(caseId)) {
      case (null) { Runtime.trap("Emergency not found") };
      case (?e) { e };
    };

    let persistentDoctor = switch (persistentDoctorMap.get(doctorId)) {
      case (null) { Runtime.trap("Doctor not found") };
      case (?d) { d };
    };

    switch (persistentEmergency.department, persistentDoctor.department) {
      case (emergencyDept, doctorDept) {
        if (not departmentMatches(emergencyDept, doctorDept)) {
          Runtime.trap("Doctor's department does not match emergency department");
        };
      };
    };
  };

  private func getPatientsForDepartment(department : Department) : [Patient] {
    persistentPatientMap.values().toArray().map(
      func(persistentPatient) { persistentPatientToPatient(persistentPatient) }
    );
  };

  private func departmentToString(department : Department) : Text {
    switch (department) {
      case (#emergency) { "Emergency" };
      case (#cardiology) { "Cardiology" };
      case (#neurology) { "Neurology" };
      case (#pediatrics) { "Pediatrics" };
      case (#orthopedics) { "Orthopedics" };
      case (#generalMedicine) { "General Medicine" };
    };
  };

  private func verifyDepartment(department : Department) {
    switch (department) {
      case (#emergency) {};
      case (#cardiology) {};
      case (#neurology) {};
      case (#pediatrics) {};
      case (#orthopedics) {};
      case (#generalMedicine) {};
    };
  };

  private func departmentMatches(dept1 : Department, dept2 : Department) : Bool {
    departmentToString(dept1) == departmentToString(dept2);
  };

  public query ({ caller }) func getDoctorsByDepartment(department : Department) : async [PersistentDoctor] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view doctors by department");
    };
    let doctors = persistentDoctorMap.values().toArray();
    doctors.filter(
      func(d) {
        d.department == department;
      }
    );
  };
};
