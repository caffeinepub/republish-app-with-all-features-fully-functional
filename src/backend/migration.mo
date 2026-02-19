import Map "mo:core/Map";
import Principal "mo:core/Principal";

module {
  type OldActor = {
    adminMap : Map.Map<Principal, { principal : Principal; invitationCodes : [Text] }>;
    entryMap : Map.Map<Text, {
        goerliAddress : Text;
        network : Text;
        parentTxHash : Text;
        status : Text;
        txHash : Text;
      }>;
    deploymentMap : Map.Map<Text, {
        chainId : Nat;
        contractAddress : Text;
        description : Text;
        env : Text;
        networkChainId : Text;
        networkName : Text;
        owner : Text;
        txHash : Text;
      }>;
    faucetMap : Map.Map<Text, {
        chainId : Nat;
        networkName : Text;
        owner : Text;
        tokenSymbol : Text;
        txHash : Text;
      }>;
    tokenMap : Map.Map<Text, {
        chainId : Nat;
        decimals : Nat;
        deployed : Bool;
        env : Text;
        leaderAddress : Text;
        maxSupply : Nat;
        name : Text;
        owner : Text;
        symbol : Text;
        txHash : Text;
      }>;
    transactionMap : Map.Map<Text, {
        nonce : Nat;
        parentTxHash : Text;
        status : Text;
        to : Text;
        txHash : Text;
        value : Text;
      }>;
  };

  type NewActor = {
    persistentPatientMap : Map.Map<Text, { id : Text; name : Text; address : { street : Text; city : Text; zip : Text } }>;
    persistentEmergencyMap : Map.Map<Text, { id : Text; patientId : Text; description : Text; department : { #emergency; #cardiology; #neurology; #pediatrics; #orthopedics; #generalMedicine }; status : Text }>;
    persistentDoctorMap : Map.Map<Text, { id : Text; name : Text; department : { #emergency; #cardiology; #neurology; #pediatrics; #orthopedics; #generalMedicine } }>;
    persistentCaseAssignmentMap : Map.Map<Text, { caseId : Text; doctorId : Text }>;
    persistentCreatedCasesCount : Map.Map<Text, Nat>;
    userProfiles : Map.Map<Principal, { name : Text; role : Text }>;
  };

  public func run(_old : OldActor) : NewActor {
    {
      persistentPatientMap = Map.empty<Text, { id : Text; name : Text; address : { street : Text; city : Text; zip : Text } }>();
      persistentEmergencyMap = Map.empty<Text, { id : Text; patientId : Text; description : Text; department : { #emergency; #cardiology; #neurology; #pediatrics; #orthopedics; #generalMedicine }; status : Text }>();
      persistentDoctorMap = Map.empty<Text, { id : Text; name : Text; department : { #emergency; #cardiology; #neurology; #pediatrics; #orthopedics; #generalMedicine } }>();
      persistentCaseAssignmentMap = Map.empty<Text, { caseId : Text; doctorId : Text }>();
      persistentCreatedCasesCount = Map.empty<Text, Nat>();
      userProfiles = Map.empty<Principal, { name : Text; role : Text }>();
    };
  };
};
