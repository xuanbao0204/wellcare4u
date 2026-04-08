export interface ApiResponse<T> {
  status: number;
  message: string;
  errorCode: string | null;
  data: T;
}

export type ApiErrorResponse = {
  status: number;
  message: string;
  errorCode: string;
  data: null;
};

export type PersonalProfileData = {
  email: string;
  firstName: string;
  lastName: string;
  dob: string;
  gender: string;
  avatar?: string;
  role: string;
};

export type PageResponse<T> = {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
};

export type DoctorDTO = {
  id: number;
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

export type BookingData = {
  slotId: number;
  doctorId: number;
  date: string;
  startTime: string;
  endTime: string;
  reason: string;
  type: string;
}

export type SlotDTO = {
  id: number;
  date: string;
  startTime: string;
  endTime: string;
  status: string;
}


export type AppointmentDTO ={
    id: number;

    doctorId: number;
    doctorName: string;
    doctorAvatar: string;


    patientId: number;

    slotId: number;
    slotTime: string;
    slotDate: string;

    reason: string;
    type: string;
    status: string;

    createdAt: string;
}

export const AppointmentType = [
  {
    label: "Khám bệnh",
    value: "EXAMINATION"
  },
  {
    label: "Tư vấn",
    value: "CONSULTATION"
  },
  {
    label: "Tái khám",
    value: "FOLLOW_UP"
  },
  {
    label: "Khám sức khỏe tổng quát",
    value: "GENERAL_CHECK_UP"
  },
  {
    label: "Tiêm chủng",
    value: "VACCINATION"
  },
  {
    label: "Buổi trị liệu",
    value: "THERAPY_SESSION"
  },
  {
    label: "Xét nghiệm chẩn đoán",
    value: "DIAGNOSTIC_TEST" 
  }
];

export const AppointmentStatus = [
  {
    label: "Đang chờ...",
    value: "PENDING"
  },
  {
    label: "Đã xác nhận",
    value: "CONFIRMED"
  },
  {
    label: "Đang tiến hành",
    value: "IN_PROGRESS"
  },
  {
    label: "Đã hoàn thành",
    value: "COMPLETED"
  },
  {
    label: "Đã huỷ",
    value: "CANCELLED"
  }
];

export interface VitalSign {
    id: number;

    height?: number;
    weight?: number;
    bmi?: number;

    bloodPressure?: string;
    heartRate?: number;
    bloodSugar?: number;

    timestamp: string;
};

export interface MedicalTest {
    id: number;

    testName: string;

    resultText?: string;
    conclusion?: string;

    imageUrl?: string;

    performedAt: string;
};

export interface PrescriptionItem {
    id: number;

    drug: string;
    dosage?: string;
    frequency?: string;
    duration?: string;
    instruction?: string;
}

export interface Prescription {
    id: number;

    createdAt: string;

    items: PrescriptionItem[];
};

export type MedicalRecordDetail ={
    id: number;

    appointment?: AppointmentDTO;

    patient: PatientDTO;
    doctor: DoctorDTO;

    chiefComplaint?: string;
    symptoms?: string;

    diagnosis?: string;
    icdCode?: string;

    treatmentPlan?: string;
    conclusion?: string;

    followUpDate?: string;

    status: string;

    createdAt: string;

    vitalSign?: VitalSign;

    medicalTests?: MedicalTest[];

    prescription?: Prescription;
};

export interface PatientDTO {
    email: string;
    firstName: string;
    lastName: string;
    gender: 'MALE' | 'FEMALE' | 'OTHER' | string; 
    avatar: string | null;
    emergencyContact: string;
    bloodType: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-' | string;
    insuranceNumber: string;
    insuranceImage: string | null;
}
