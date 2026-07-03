import DoctorSuggestionCard from "./DoctorSuggestionCard";
import AppointmentCard from "./AppointmentCard";
import { ChatMessage, DoctorSuggestionDTO } from "../type";
import { AppointmentDTO, DoctorDTO, MedicalRecordDetail } from "@/shared/type";
import MedicalRecordCard from "./MedicalRecordCard";

interface Props {

    message: ChatMessage;

    onAction: (message: string) => void;

}

export default function ToolRenderer({
    message,
    onAction
}: Props) {

    switch (message.intent) {

        case "FIND_DOCTOR":

            if (!Array.isArray(message.payload)) {

                return null;

            }

            return (

                <div className="mt-3 space-y-3">

                    {(message.payload as DoctorDTO[]).map((doctor: DoctorDTO) => (

                        <DoctorSuggestionCard
                            key={doctor.id}
                            doctor={doctor}
                        />

                    ))}

                </div>

            );

        case "MY_APPOINTMENTS":

            if (!Array.isArray(message.payload)) {

                return null;

            }

            return (

                <div className="mt-3 space-y-3">

                    {(message.payload as AppointmentDTO[]).map((appointment: AppointmentDTO) => (

                        <AppointmentCard
                            key={appointment.id}
                            appointment={appointment}
                        />

                    ))}

                </div>

            );

        case "MEDICAL_RECORD":

            if (!Array.isArray(message.payload)) {

                return null;

            }

            return (

                <div className="mt-3 space-y-3">

                    {(message.payload as MedicalRecordDetail[]).map((record: MedicalRecordDetail) => (

                        <MedicalRecordCard
                            key={record.id}
                            record={record}
                        />

                    ))}

                </div>

            );

        default:

            return null;

    }

}