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

export interface ChatResponseDTO {

    message: string;

    intent?: BookingIntentDTO;

    doctors?: DoctorSuggestionDTO[];
}