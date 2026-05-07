"use client"

import MedicalRecordDetail from "@/shared/components/medical-record-view/MedicalRecordDetail";
import { useParams } from "next/navigation";

const MedicalRecordDetailPage = () => {
    const {recordId} = useParams()
    return (
        <div className="w-full bg-gray-50 p-4">
            <MedicalRecordDetail recordId={Number(recordId)} />
        </div>
    );
};

export default MedicalRecordDetailPage;