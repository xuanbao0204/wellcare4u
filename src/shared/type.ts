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


export type AppointmentDTO = {
  id: number;

  doctorId: number;
  doctorName: string;
  doctorAvatar: string;


  patientId: number;
  patientName: string;
  patientAvatar: string;

  slotId: number;
  slotTime: string;
  slotDate: string;

  reason: string;
  type: string;
  status: string;

  createdAt: string;

  recordId: number;

  cancelBy: string;
  cancelledAt: string;
  cancelReason: string;
  checkedIn: boolean;
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
  },
  {
    label: "Khám lại (do bị hủy)",
    value: "RESCHEDULE"
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
  },
  {
    label: "Đã quá hạn",
    value: "EXPIRED"
  }
];

export type VitalSign = {

  height?: number;
  weight?: number;
  bmi?: number;

  bloodPressure?: string;
  heartRate?: number;
  bloodSugar?: number;

  timestamp?: string;
};

export type MedicalTest = {
  id?: number;

  testName?: string;

  resultText?: string;
  conclusion?: string;

  imageUrl?: string;

  performedAt?: string;
};

export type PrescriptionItem = {
  id?: number;

  drug: string;
  dosage?: string;
  frequency?: string;
  duration?: string;
  instruction?: string;
}

export type Prescription = {
  id: number;

  createdAt: string;

  items: PrescriptionItem[];
};

export type MedicalRecordDetail = {
  id: number;

  appointment?: AppointmentDTO;

  patient: PatientDTO;
  doctor: DoctorDTO;

  chiefComplaint: string;
  symptoms: string;

  diagnosis: string;
  icdCode: string;

  treatmentPlan: string;
  conclusion: string;

  followUpDate: string;

  status: string;

  createdAt: string;

  vitalSign: VitalSign;

  tests: MedicalTest[];

  items: PrescriptionItem[];
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

export type CreateRecordData = {
  recordId?: number;
  appointmentId?: number;

  doctorId?: number;
  patientId?: number;

  chiefComplaint: string;
  symptoms: string;

  diagnosis: string;
  icdCode: string;

  treatmentPlan: string;
  conclusion: string;

  followUpDate?: BookingData;

  vital: VitalSign;
  tests: MedicalTest[];

  items: PrescriptionItem[];
  isDone?: boolean
};

export type NotificationDTO = {
  id: number;
  recipientId: number;
  notificationId: number;
  title: string;
  content: string;
  isRead: boolean;
  createdAt: string;
  type: string;
  referenceId: number | null;
};

export type CancelAppointmentRequest = {
  reason: string;
}

export type EPostSortType = "NEWEST" | "MOST_LIKED" | "MOST_VIEWED" | "MOST_COMMENTED";
 
export interface AuthorResponse {
  id?: number;
  displayName: string;
  avatar?: string;
  isDoctor: boolean;
  isVerifiedDoctor: boolean;
}
 
export interface CommentResponse {
  id: number;
  content: string;
  author: AuthorResponse;
  parentCommentId?: number;
  isExpertReply: boolean;
  createdAt: string;
  replies: CommentResponse[];
}
 
export interface PostSummaryResponse {
  id: number;
  title: string;
  contentPreview: string;
  category: ESpecialization;
  author: AuthorResponse;
  isAnonymous: boolean;
  isVerifiedAnswer: boolean;
  viewCount: number;
  likes: number;
  commentCount: number;
  tags: string[];
  createdAt: string;
}
 
export interface PostDetailResponse {
  id: number;
  title: string;
  content: string;
  category: ESpecialization;
  author: AuthorResponse;
  isAnonymous: boolean;
  isVerifiedAnswer: boolean;
  viewCount: number;
  likes: number;
  tags: string[];
  comments: CommentResponse[];
  createdAt: string;
}
 
export interface CreatePostRequest {
  title: string;
  content: string;
  category: ESpecialization;
  isAnonymous: boolean;
  tags: string[];
}
 
export interface CreateCommentRequest {
  content: string;
  parentCommentId?: number;
}
 

 
export interface ForumFilterState {
  page: number;
  size: number;
  category?: ESpecialization;
  keyword?: string;
  sort: EPostSortType;
}

export enum ESpecialization {
  TIM_MACH = "TIM_MACH",
  DA_LIEU = "DA_LIEU",
  TIEU_HOA_GAN_MAT = "TIEU_HOA_GAN_MAT",
  THAN_KINH = "THAN_KINH",
  NOI_TIET = "NOI_TIET",
  HO_HAP = "HO_HAP",
  THAN_TIET_NIEU = "THAN_TIET_NIEU",
  CO_XUONG_KHOP = "CO_XUONG_KHOP",
  HUYET_HOC = "HUYET_HOC",
  TRUYEN_NHIEM = "TRUYEN_NHIEM",
  NOI_TONG_QUAT = "NOI_TONG_QUAT",
  NGOAI_TONG_QUAT = "NGOAI_TONG_QUAT",
  NGOAI_THAN_KINH = "NGOAI_THAN_KINH",
  CHAN_THUONG_CHINH_HINH = "CHAN_THUONG_CHINH_HINH",
  NGOAI_LONG_NGUC_TIM_MACH = "NGOAI_LONG_NGUC_TIM_MACH",
  NAM_KHOA = "NAM_KHOA",
  PHAU_THUAT_THAM_MY = "PHAU_THUAT_THAM_MY",
  SAN_PHU_KHOA = "SAN_PHU_KHOA",
  NHI_KHOA = "NHI_KHOA",
  TAI_MUI_HONG = "TAI_MUI_HONG",
  RANG_HAM_MAT = "RANG_HAM_MAT",
  NHAN_KHOA = "NHAN_KHOA",
  SUC_KHOE_TAM_THAN = "SUC_KHOE_TAM_THAN",
  UNG_BUOU = "UNG_BUOU",
  CHAN_DOAN_HINH_ANH = "CHAN_DOAN_HINH_ANH",
  XET_NGHIEM = "XET_NGHIEM",
  GAY_ME_HOI_SUC = "GAY_ME_HOI_SUC",
  PHUC_HOI_CHUC_NANG = "PHUC_HOI_CHUC_NANG",
  DINH_DUONG = "DINH_DUONG",
  Y_HOC_CO_TRUYEN = "Y_HOC_CO_TRUYEN",
  Y_HOC_GIA_DINH = "Y_HOC_GIA_DINH",
  CAP_CUU = "CAP_CUU",
  LAO_KHOA = "LAO_KHOA",
}

export const SPECIALIZATION_LABELS: Record<ESpecialization, string> = {
  [ESpecialization.TIM_MACH]: "Tim mạch",
  [ESpecialization.DA_LIEU]: "Da liễu",
  [ESpecialization.TIEU_HOA_GAN_MAT]: "Tiêu hóa - Gan mật",
  [ESpecialization.THAN_KINH]: "Thần kinh",
  [ESpecialization.NOI_TIET]: "Nội tiết",
  [ESpecialization.HO_HAP]: "Hô hấp",
  [ESpecialization.THAN_TIET_NIEU]: "Thận - Tiết niệu",
  [ESpecialization.CO_XUONG_KHOP]: "Cơ xương khớp",
  [ESpecialization.HUYET_HOC]: "Huyết học",
  [ESpecialization.TRUYEN_NHIEM]: "Truyền nhiễm",
  [ESpecialization.NOI_TONG_QUAT]: "Nội tổng quát",
  [ESpecialization.NGOAI_TONG_QUAT]: "Ngoại tổng quát",
  [ESpecialization.NGOAI_THAN_KINH]: "Ngoại thần kinh",
  [ESpecialization.CHAN_THUONG_CHINH_HINH]: "Chấn thương chỉnh hình",
  [ESpecialization.NGOAI_LONG_NGUC_TIM_MACH]: "Ngoại lồng ngực - Tim mạch",
  [ESpecialization.NAM_KHOA]: "Nam khoa",
  [ESpecialization.PHAU_THUAT_THAM_MY]: "Phẫu thuật thẩm mỹ",
  [ESpecialization.SAN_PHU_KHOA]: "Sản phụ khoa",
  [ESpecialization.NHI_KHOA]: "Nhi khoa",
  [ESpecialization.TAI_MUI_HONG]: "Tai Mũi Họng",
  [ESpecialization.RANG_HAM_MAT]: "Răng Hàm Mặt",
  [ESpecialization.NHAN_KHOA]: "Nhãn khoa",
  [ESpecialization.SUC_KHOE_TAM_THAN]: "Sức khỏe tâm thần",
  [ESpecialization.UNG_BUOU]: "Ung bướu",
  [ESpecialization.CHAN_DOAN_HINH_ANH]: "Chẩn đoán hình ảnh",
  [ESpecialization.XET_NGHIEM]: "Xét nghiệm",
  [ESpecialization.GAY_ME_HOI_SUC]: "Gây mê hồi sức",
  [ESpecialization.PHUC_HOI_CHUC_NANG]: "Phục hồi chức năng",
  [ESpecialization.DINH_DUONG]: "Dinh dưỡng",
  [ESpecialization.Y_HOC_CO_TRUYEN]: "Y học cổ truyền",
  [ESpecialization.Y_HOC_GIA_DINH]: "Y học gia đình",
  [ESpecialization.CAP_CUU]: "Cấp cứu",
  [ESpecialization.LAO_KHOA]: "Lão khoa",
};

export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export const SPECIALIZATION_COLORS: Record<ESpecialization, string> = {
  [ESpecialization.TIM_MACH]:                  "bg-red-50 text-red-700",
  [ESpecialization.NGOAI_LONG_NGUC_TIM_MACH]:  "bg-red-50 text-red-700",
  [ESpecialization.DA_LIEU]:                   "bg-orange-50 text-orange-700",
  [ESpecialization.PHAU_THUAT_THAM_MY]:        "bg-orange-50 text-orange-700",
  [ESpecialization.TIEU_HOA_GAN_MAT]:          "bg-amber-50 text-amber-700",
  [ESpecialization.THAN_KINH]:                 "bg-purple-50 text-purple-700",
  [ESpecialization.NGOAI_THAN_KINH]:           "bg-purple-50 text-purple-700",
  [ESpecialization.SUC_KHOE_TAM_THAN]:         "bg-indigo-50 text-indigo-700",
  [ESpecialization.NOI_TIET]:                  "bg-yellow-50 text-yellow-700",
  [ESpecialization.DINH_DUONG]:                "bg-yellow-50 text-yellow-700",
  [ESpecialization.HO_HAP]:                    "bg-sky-50 text-sky-700",
  [ESpecialization.THAN_TIET_NIEU]:            "bg-blue-50 text-blue-700",
  [ESpecialization.CO_XUONG_KHOP]:             "bg-slate-100 text-slate-700",
  [ESpecialization.CHAN_THUONG_CHINH_HINH]:    "bg-slate-100 text-slate-700",
  [ESpecialization.HUYET_HOC]:                 "bg-rose-50 text-rose-700",
  [ESpecialization.UNG_BUOU]:                  "bg-rose-50 text-rose-700",
  [ESpecialization.TRUYEN_NHIEM]:              "bg-green-50 text-green-700",
  [ESpecialization.NOI_TONG_QUAT]:             "bg-teal-50 text-teal-700",
  [ESpecialization.NGOAI_TONG_QUAT]:           "bg-teal-50 text-teal-700",
  [ESpecialization.SAN_PHU_KHOA]:              "bg-pink-50 text-pink-700",
  [ESpecialization.NAM_KHOA]:                  "bg-blue-50 text-blue-700",
  [ESpecialization.NHI_KHOA]:                  "bg-cyan-50 text-cyan-700",
  [ESpecialization.TAI_MUI_HONG]:              "bg-violet-50 text-violet-700",
  [ESpecialization.RANG_HAM_MAT]:              "bg-lime-50 text-lime-700",
  [ESpecialization.NHAN_KHOA]:                 "bg-emerald-50 text-emerald-700",
  [ESpecialization.CHAN_DOAN_HINH_ANH]:        "bg-sky-50 text-sky-700",
  [ESpecialization.XET_NGHIEM]:                "bg-fuchsia-50 text-fuchsia-700",
  [ESpecialization.GAY_ME_HOI_SUC]:            "bg-gray-100 text-gray-700",
  [ESpecialization.PHUC_HOI_CHUC_NANG]:        "bg-green-50 text-green-700",
  [ESpecialization.Y_HOC_CO_TRUYEN]:           "bg-amber-50 text-amber-700",
  [ESpecialization.Y_HOC_GIA_DINH]:            "bg-teal-50 text-teal-700",
  [ESpecialization.CAP_CUU]:                   "bg-red-100 text-red-800",
  [ESpecialization.LAO_KHOA]:                  "bg-slate-100 text-slate-700",
};

export const SPECIALIZATION_VALUES = Object.values(ESpecialization);

export interface RecordSummary {
  recordId: number;
  diagnosis: string | null;
  createdAt: string;
}

export interface PatientMedicalRecordsDTO {
  patientId: number;
  firstName: string;
  lastName: string;
  avatar: string | null;
  gender: string;
  dob: string;
  totalRecords: number;
  lastVisitDate: string;
  records: RecordSummary[];
  vitalSigns: VitalSign[];
}

export type PatientsSummaryDTO = {
  patientId: number;
  firstName: string;
  lastName: string;
  avatar: string | null;
  gender: string;
  dob: string;
  totalRecords: number;
  lastVisitDate: string;
};