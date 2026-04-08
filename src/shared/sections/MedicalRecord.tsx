"use client";

import { useEffect, useState } from "react";

type Props = {
    recordId: string;
};

export default function MedicalRecordDetail({ recordId }: Props) {
    const [data, setData] = useState<any>(null);

    useEffect(() => {
        fetch(`/api/v1/medical-records/detail/${recordId}`)
            .then((res) => res.json())
            .then((res) => setData(res.data));
    }, [recordId]);

    if (!data) {
        return (
            <div className="max-w-5xl mx-auto p-6">
                <div className="animate-pulse space-y-4">
                    <div className="h-24 bg-gray-200 rounded-2xl" />
                    <div className="h-40 bg-gray-200 rounded-2xl" />
                    <div className="h-40 bg-gray-200 rounded-2xl" />
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto p-6 space-y-6">

            {/* HEADER */}
            <div className="bg-white rounded-2xl shadow p-6">
                <div className="flex items-center gap-4">
                    <img
                        src={data.doctor?.avatar}
                        className="w-14 h-14 rounded-full object-cover"
                    />
                    <div>
                        <div className="font-semibold text-lg">
                            {data.doctor?.firstName} {data.doctor?.lastName}
                        </div>
                        <div className="text-sm text-gray-500">
                            {data.doctor?.specialization}
                        </div>
                    </div>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                    <div>
                        <span className="text-gray-500">Triệu chứng</span>
                        <div>{data.symptoms || "-"}</div>
                    </div>
                    <div>
                        <span className="text-gray-500">Lý do khám</span>
                        <div>{data.chiefComplaint || "-"}</div>
                    </div>
                </div>
            </div>

            {data.vital && (
                <div className="bg-white rounded-2xl shadow p-6">
                    <h2 className="font-semibold mb-4">Chỉ số sinh tồn</h2>

                    <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>Chiều cao: {data.vital.height} cm</div>
                        <div>Cân nặng: {data.vital.weight} kg</div>
                        <div>BMI: {data.vital.bmi?.toFixed(1)}</div>
                        <div>Huyết áp: {data.vital.bloodPressure}</div>
                        <div>Nhịp tim: {data.vital.heartRate}</div>
                        <div>Đường huyết: {data.vital.bloodSugar}</div>
                    </div>
                </div>
            )}

            {data.tests?.length > 0 && (
                <div className="bg-white rounded-2xl shadow p-6">
                    <h2 className="font-semibold mb-4">Xét nghiệm</h2>

                    <div className="space-y-4">
                        {data.tests.map((t: any, i: number) => (
                            <div key={i} className="border rounded-lg p-4">
                                <div className="font-medium">{t.testName}</div>

                                <div className="text-sm text-gray-600 mt-1">
                                    {t.resultText}
                                </div>

                                <div className="text-sm mt-1">
                                    Kết luận: {t.conclusion}
                                </div>

                                {t.imageUrl && (
                                    <img
                                        src={t.imageUrl}
                                        className="mt-2 w-40 rounded-lg"
                                    />
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div className="bg-white rounded-2xl shadow p-6 space-y-4">
                <div>
                    <h3 className="font-semibold">Chẩn đoán</h3>
                    <p>{data.diagnosis || "-"}</p>
                </div>

                <div>
                    <h3 className="font-semibold">Phác đồ điều trị</h3>
                    <p>{data.treatmentPlan || "-"}</p>
                </div>

                <div>
                    <h3 className="font-semibold">Kết luận</h3>
                    <p>{data.conclusion || "-"}</p>
                </div>
            </div>

            {data.items?.length > 0 && (
                <div className="bg-white rounded-2xl shadow p-6">
                    <h2 className="font-semibold mb-4">Đơn thuốc</h2>

                    <table className="w-full text-sm">
                        <thead>
                            <tr className="text-left text-gray-500">
                                <th className="pb-2">Thuốc</th>
                                <th>Liều</th>
                                <th>Tần suất</th>
                                <th>Thời gian</th>
                            </tr>
                        </thead>

                        <tbody>
                            {data.items.map((i: any, idx: number) => (
                                <tr key={idx} className="border-t">
                                    <td className="py-2">{i.drug}</td>
                                    <td>{i.dosage}</td>
                                    <td>{i.frequency}</td>
                                    <td>{i.duration}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

        </div>
    );
}