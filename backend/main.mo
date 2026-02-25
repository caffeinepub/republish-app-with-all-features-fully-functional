import Map "mo:core/Map";
import Array "mo:core/Array";
import Nat "mo:core/Nat";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import Text "mo:core/Text";
import Time "mo:core/Time";
import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";
import Migration "migration";

(with migration = Migration.run)
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

  public type Doctor = {
    id : Nat;
    name : Text;
    department : Department;
    available : Bool;
    registrationCode : Text;
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
    #resolved;
  };

  public type EmergencyCase = {
    id : Nat;
    patientName : Text;
    condition : Text;
    severity : Severity;
    assignedDoctorId : ?Nat;
    status : CaseStatus;
    createdAt : Int;
  };

  public type UserProfile = {
    name : Text;
  };

  public type MedicalSuggestion = {
    symptoms : [Text];
    medication : Text;
    dosage : Text;
  };

  // Persistent state
  let doctors = Map.empty<Nat, Doctor>();
  let userProfiles = Map.empty<Principal, UserProfile>();
  let emergencyCases = Map.empty<Nat, EmergencyCase>();
  let medicalSuggestions = Map.empty<Nat, MedicalSuggestion>();

  var nextDoctorId = 1;
  var nextCaseId = 1;
  var nextSuggestionId = 1;

  // Access control
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // Initialization - admin only
  public shared ({ caller }) func initialize() : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admin can initialize");
    };
  };

  // User profile management
  // Any authenticated user (non-guest) can get their own profile
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can get their own profile");
    };
    userProfiles.get(caller);
  };

  // Any authenticated user can view their own profile; admins can view any profile
  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  // Any authenticated user (non-guest) can save their own profile
  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can save their own profile");
    };
    userProfiles.add(caller, profile);
  };

  // Doctor self-registration with registration code - open to all callers
  // The registration code "2011" is required; no role check needed before verifying the code
  public shared ({ caller }) func registerDoctor(name : Text, department : Department, registrationCode : Text) : async Doctor {
    if (registrationCode != "2011") {
      Runtime.trap("Unauthorized: Invalid registration code");
    };

    let doctor : Doctor = {
      id = nextDoctorId;
      name;
      department;
      available = true;
      registrationCode;
    };

    doctors.add(nextDoctorId, doctor);
    nextDoctorId += 1;
    doctor;
  };

  // View all doctors - admin only (read-only)
  public query ({ caller }) func getAllDoctors() : async [Doctor] {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can view all doctor profiles");
    };
    doctors.values().toArray();
  };

  // Toggle doctor availability - requires authenticated user role
  // Doctors (registered users) can toggle availability; admins cannot modify doctor records per the plan
  public shared ({ caller }) func toggleDoctorAvailability(doctorId : Nat) : async Doctor {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can toggle doctor availability");
    };

    let doctor = switch (doctors.get(doctorId)) {
      case (null) { Runtime.trap("Doctor not found") };
      case (?doc) { doc };
    };

    let updatedDoctor = { doctor with available = not doctor.available };
    doctors.add(doctorId, updatedDoctor);
    updatedDoctor;
  };

  // View all emergency cases - admin only (read-only)
  public query ({ caller }) func getAllEmergencyCases() : async [EmergencyCase] {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can view all emergency cases");
    };
    emergencyCases.values().toArray();
  };

  // Doctor login - accessible to all (including guests) as it is the login/lookup mechanism
  public query func doctorLogin(name : Text, department : Department) : async Doctor {
    let matchingDoctor = doctors.values().toArray().find(
      func(d) { d.name == name and d.department == department }
    );

    switch (matchingDoctor) {
      case (null) { Runtime.trap("Doctor not found") };
      case (?doctor) { doctor };
    };
  };
};
