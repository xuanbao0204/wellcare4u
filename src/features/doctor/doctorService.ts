import api from "@/lib/axios";
import { ApiResponse, AppointmentDTO, DoctorDTO } from "@/shared/type";

export type DoctorDashboardSnapshotDTO = {
    profile: DoctorDTO;

    stats: {
        totalAppointments: number;
        completedAppointments: number;
        cancelledAppointments: number;
        cancellationRate: number;

        totalPatients: number;
        totalMedicalRecords: number;

        todayAppointments: number;
    };

    upcomingAppointments: AppointmentDTO[];

    recentAppointments: AppointmentDTO[];

    aiSummary: string;
};

export const getDoctorDashboardData = async (): Promise<
    ApiResponse<DoctorDashboardSnapshotDTO>
> => {

    const response =
        await api.get<ApiResponse<DoctorDashboardSnapshotDTO>>(
            "/doctor/dashboard"
        );

    return response.data;
};