"use client"

import { getRecordDetail, getRecordDetailPrint } from "@/features/medical-records/medicalRecordService";
import { showError } from "@/lib/toast";
import MedicalRecordDetailPage from "@/shared/components/medical-record-view/MedicalRecordDetail";
import MedicalRecordPrintTemplate from "@/shared/components/medical-record-view/MedicalRecordDetailPrint";
import { MedicalRecordDetail, MedicalRecordDetailPrint } from "@/shared/type";
import { ArrowLeft, Printer } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";

export default function PrintPreviewPage() {
    const params = useParams();
    const recordId = Number(params.recordId);

    const router = useRouter();
    const [data, setData] = useState<MedicalRecordDetailPrint>();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetch = async () => {
            if (!recordId) {
                setLoading(false);
                return;
            }

            const res = await getRecordDetailPrint(recordId);

            if (res.status !== 200) {
                showError(res.message);
                setLoading(false);
                return;
            }

            setData(res.data);
            setLoading(false);
        };

        fetch();
    }, [recordId]);

    const printRef = useRef<HTMLDivElement>(null);

    // const handlePrint = useReactToPrint({
    //     contentRef: printRef,
    //     documentTitle: `medical-record-${data!.id}`,
    // });

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-[linear-gradient(180deg,#eef7f4_0%,#f8fafc_100%)] px-6 text-sm text-slate-500">
                Đang tải dữ liệu hồ sơ...
            </div>
        );
    }

    if (!data) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-[linear-gradient(180deg,#eef7f4_0%,#f8fafc_100%)] px-6 text-sm text-slate-500">
                Không tìm thấy hồ sơ
            </div>
        );
    }
    return (
        <>
            <div className="no-print sticky top-0 z-50 border-b bg-white shadow-sm">
                <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">
                    <div>
                        <h1 className="text-lg font-semibold">
                            Xem trước hồ sơ bệnh án
                        </h1>

                        <p className="text-sm text-slate-500">
                            Hồ sơ #{data.id}
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => router.back()}
                            className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium transition hover:bg-slate-100"
                        >
                            <ArrowLeft size={16} />
                            Quay lại
                        </button>

                        <button
                            onClick={() => window.print()}
                            className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-700"
                        >
                            <Printer size={16} />
                            In / Xuất PDF
                        </button>
                    </div>
                </div>
            </div>

            {/* Document */}
            <div className="bg-slate-100 py-8">
                <div ref={printRef}>
                    <MedicalRecordPrintTemplate
                        data={data}
                    />
                </div>
            </div>
        </>
    );
}