export interface DoctorDTO {
  email: string;
  firstName: string;
  lastName: string;
  gender: string;
  avatar: string;
  bio: string;
  certification: string;
  specialization: string;
  experienceYears: number;
  consultationFee: number;
  clinicAddress: string;
  verified: boolean;
}

export interface PatientDTO {
  email: string;
  firstName: string;
  lastName: string;
  gender: string;
  avatar: string;
  emergencyContact: string;
  bloodType: string;
  insuranceNumber: string;
}

export interface VitalSignDTO {
  height: number;
  weight: number;
  bmi: number;
  bloodPressure: string;
  heartRate: number;
  bloodSugar: number;
}

export interface MedicalTestDTO {
  testName: string;
  resultText: string;
  conclusion: string;
  imageUrl: string;
}

export interface PrescriptionItemDTO {
  drug: string;
  dosage: string;
  frequency: string;
  duration: string;
  instruction: string;
}

export interface MedicalRecordDTO {
  recordId: number;
  doctor: DoctorDTO;
  patient: PatientDTO;
  
  chiefComplaint: string;
  symptoms: string;
  
  diagnosis: string;
  icdCode: string;
  
  treatmentPlan: string;
  conclusion: string;
  
  followUpDate: string; 
  createdAt: string;

  vital: VitalSignDTO;
  tests: MedicalTestDTO[];
  items: PrescriptionItemDTO[];
}

export interface MedicalRecordListDTO {
  recordId: number;
  doctor: DoctorDTO;
  patient: PatientDTO;
  chiefComplaint: string;
  diagnosis: string;
  createdAt: string;
}