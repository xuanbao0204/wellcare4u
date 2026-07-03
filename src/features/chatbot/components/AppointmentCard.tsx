"use client";

import { AppointmentDTO } from "@/shared/type";
import { CalendarDays, Clock, UserRound } from "lucide-react";

interface Props {

    appointment: AppointmentDTO;

}

export default function AppointmentCard({
    appointment,
}: Props) {

    return (

        <div className="rounded-2xl border bg-white p-4 shadow-sm">

            <div className="font-semibold">

                {appointment.doctorName}

            </div>

            <div className="mt-1 flex items-center gap-2 text-sm text-slate-500">

                <UserRound size={15} />

                {appointment.type}

            </div>

            <div className="mt-2 flex items-center gap-2 text-sm">

                <CalendarDays size={15} />

                {appointment.slotDate}

            </div>

            <div className="mt-1 flex items-center gap-2 text-sm">

                <Clock size={15} />

                {appointment.patientAvatar}

            </div>

            <div className="mt-3">

                <span className="rounded-full bg-green-100 px-3 py-1 text-xs text-green-700">

                    {appointment.status}

                </span>

            </div>

        </div>

    );

}