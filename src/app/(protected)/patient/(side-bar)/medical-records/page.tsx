"use client"

import MedicalRecordDetailPage from "@/shared/components/medical-record-view/MedicalRecordDetail";
import MedicalRecordList from "@/shared/components/medical-record-view/MedicalRecordList";
import { MedicalRecordDetail } from "@/shared/type";
import { useState } from "react";

const PatientMedicalRecordsPage = () => {
    const [selectedRecord, setSelectedRecord] = useState<MedicalRecordDetail | null>(null);

    const [records, setRecords] = useState<MedicalRecordDetail[]>([])

    return (
        <div className="grid grid-cols-12 gap-6">
            <div className="col-span-4">
                <MedicalRecordList
                    records={records}
                    selectedRecord={selectedRecord || null}
                    onSelect={(id) => {
                        const record = records.find((r) => r.id === id);
                        setSelectedRecord(record || null);
                    }}
                />
            </div>

            <div className="col-span-8">
                {!selectedRecord ? (
                    <div className="flex h-full flex-col items-center justify-center gap-4 rounded-3xl border border-white/60 bg-white/75 p-6 backdrop-blur-xl shadow-[0_20px_60px_-25px_rgba(0,10,156,0.35)]">
                        <p className="text-lg font-semibold text-foreground/75">  Chọn một hồ sơ khám để xem chi tiết</p>
                        </div> 
                        ) : (
                    <MedicalRecordDetailPage record={selectedRecord} />
                )}
            </div>
        </div>
    );
};

export default PatientMedicalRecordsPage;