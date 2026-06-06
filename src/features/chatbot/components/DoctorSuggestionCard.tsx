"use client";

import { DoctorSuggestionDTO } from "../type";

interface Props {

    doctor: DoctorSuggestionDTO;

    onSelectSlot:( slotText: string ) => void;
}

export default function
    DoctorSuggestionCard({ doctor, onSelectSlot }: Props) {

    return (

        <div className="rounded-2xl border border-primary/10 bg-white p-4 shadow-sm">
            <h3 className="font-semibold text-foreground">
                {doctor.doctorName}
            </h3>

            <p className="text-sm text-foreground/60">
                {doctor.specialization}
            </p>

            <div className="mt-3 flex flex-wrap gap-2">
                {doctor.slots.map(
                    (slot, index) => (
                        <button
                            key={
                                slot.slotId
                            }
                            onClick={() =>
                                onSelectSlot(
                                    `đặt slot ${index + 1
                                    }`
                                )
                            }
                            className="
                                rounded-full
                                border
                                border-primary/15
                                bg-primary/5
                                px-3
                                py-2
                                text-sm
                                font-medium
                                text-primary
                                hover:bg-primary/10
                            "
                        >
                            {slot.time}
                        </button>
                    )
                )}
            </div>

        </div>
    );
}