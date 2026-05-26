import api from "@/lib/axios"
import { ApiResponse, AppointmentDTO, NotificationDTO, PatientDTO } from "@/shared/type";
import { VitalSignDTO } from "../medical-records/types";

export type PatientDashboardDTO = {
    profile: PatientDTO;

    upcomingAppointment: AppointmentDTO | null;

    recentAppointments: AppointmentDTO[];

    recentNotifications: NotificationDTO[];

    vitalSignHistory: VitalSignDTO[];

    medicalSummary: {
        aiSummary: string;
        totalRecords: number;
        lastVisitDate: string | null;
        recentDiagnoses: string[];
        activeTreatments: string[] | null;
    };

    stats: {
        totalAppointments: number;
        completedAppointments: number;
        cancelledAppointments: number;
        pendingAppointments: number;
        totalMedicalRecords: number;
        lastVisitDate: string | null;
        unreadNotifications: number;
    };
};

export const getPatientDashboard = async () => {
    const res = await api.get<ApiResponse<PatientDashboardDTO>>("/patient/dashboard");
    return res.data;
}