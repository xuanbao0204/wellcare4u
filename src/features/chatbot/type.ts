import { AppointmentDTO, DoctorDTO, MedicalRecordDetail } from "@/shared/type";

export interface SlotSuggestionDTO {

    slotId: number;

    date: string;

    time: string;
}

export interface DoctorSuggestionDTO {

    doctorId: number;

    doctorName: string;

    specialization: string;

    slots: SlotSuggestionDTO[];
}

export interface BookingIntentDTO {

    intent?: string;

    specialization?: string;

    date?: string;

    period?: string;

    appointmentType?: string;

    reason?: string;

    slotSelection?: string | null;
}

export type Role = "USER" | "AI";

export interface ChatMessage {

    id: string;

    role: Role;

    text: string;

    intent?: string;

    payload?: ToolPayload;

}

type ToolPayload =
  | DoctorDTO[]
  | AppointmentDTO[]
  | MedicalRecordDetail[]
  | null;

export interface ChatResponse {

    success: boolean;

    message: string;

    intent: string;

    payload: ToolPayload;

}