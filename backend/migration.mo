import Map "mo:core/Map";
import Nat "mo:core/Nat";

module {
  // Original doctor type.
  type OldDoctor = {
    id : Nat;
    name : Text;
    department : {
      #emergency;
      #cardiology;
      #neurology;
      #pediatrics;
      #orthopedics;
      #generalMedicine;
    };
    available : Bool;
  };

  // Original actor type
  type OldActor = {
    doctors : Map.Map<Nat, OldDoctor>;
  };

  // New extended doctor type.
  type NewDoctor = {
    id : Nat;
    name : Text;
    department : {
      #emergency;
      #cardiology;
      #neurology;
      #pediatrics;
      #orthopedics;
      #generalMedicine;
    };
    available : Bool;
    registrationCode : Text;
  };

  // New actor type
  type NewActor = {
    doctors : Map.Map<Nat, NewDoctor>;
  };

  // Migration function called by the main actor via the with-clause
  public func run(old : OldActor) : NewActor {
    let newDoctors = old.doctors.map<Nat, OldDoctor, NewDoctor>(
      func(_id, oldDoctor) {
        { oldDoctor with registrationCode = "" };
      },
    );
    { doctors = newDoctors };
  };
};
