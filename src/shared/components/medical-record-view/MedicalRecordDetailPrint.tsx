import { MedicalRecordDetail, AppointmentType, MedicalRecordDetailPrint, MedicalTest } from "@/shared/type";

type Props = {
    data: MedicalRecordDetailPrint;
};

const MedicalRecordPrintTemplate = ({ data }: Props) => {
    const createdAt = new Date(data.createdAt).toLocaleString("vi-VN");

    const getAppointmentTypeLabel = (type?: string) => {
        return AppointmentType.find((t) => t.value === type)?.label || type;
    };

    return (
        <div
            id="medical-record-print"
            className="mx-auto bg-white text-black"
            style={{
                width: "210mm",
                minHeight: "297mm",
                padding: "15mm",
                fontFamily: "Times New Roman, serif",
                fontSize: "13px",
                lineHeight: 1.6,

            }}
        >
            {/* HEADER */}

            <div className="mb-8 flex justify-between">
                <div>
                    <h2 className="font-bold uppercase">
                        BỆNH VIỆN / PHÒNG KHÁM
                    </h2>

                    <p>Địa chỉ: .......................................</p>

                    <p>Điện thoại: ...................................</p>
                </div>

                <div className="text-right">
                    <h1 className="text-xl font-bold uppercase">
                        HỒ SƠ KHÁM BỆNH
                    </h1>

                    <p>Mã hồ sơ: #{data.id}</p>

                    <p>Ngày tạo: {createdAt}</p>
                </div>
            </div>

            {/* PATIENT */}

            <SectionTitle>
                I. THÔNG TIN BỆNH NHÂN
            </SectionTitle>

            <table className="w-full border-collapse border border-black">
                <tbody>
                    <Row
                        label="Họ và tên"
                        value={`${data.patient.firstName} ${data.patient.lastName}`}
                    />

                    <Row
                        label="Bác sĩ phụ trách"
                        value={`${data.doctor.firstName} ${data.doctor.lastName}`}
                    />

                    <Row
                        label="Loại lịch hẹn"
                        value={getAppointmentTypeLabel(
                            data.appointment?.type
                        )}
                    />

                    <Row
                        label="Ngày khám"
                        value={data.appointment?.slotDate}
                    />

                    <Row
                        label="Giờ khám"
                        value={data.appointment?.slotTime}
                    />

                    <Row
                        label="Trạng thái hồ sơ"
                        value={String(data.appointment.status)}
                    />
                </tbody>
            </table>

            {/* CLINICAL */}

            <SectionTitle>
                II. THÔNG TIN LÂM SÀNG
            </SectionTitle>

            <table className="w-full border-collapse border border-black">
                <tbody>
                    <Row
                        label="Lý do khám"
                        value={data.chiefComplaint}
                    />

                    <Row
                        label="Triệu chứng"
                        value={data.symptoms}
                    />

                    <Row
                        label="Mã ICD"
                        value={data.icdCode}
                    />

                    <Row
                        label="Chẩn đoán"
                        value={data.diagnosis}
                    />
                </tbody>
            </table>

            {/* VITAL */}

            {data.vitalSign && (
                <>
                    <SectionTitle>
                        III. CHỈ SỐ SINH TỒN
                    </SectionTitle>

                    <table className="w-full border-collapse border border-black">
                        <thead>
                            <tr>
                                <th className="border border-black p-2">
                                    Chỉ số
                                </th>

                                <th className="border border-black p-2">
                                    Giá trị
                                </th>
                            </tr>
                        </thead>

                        <tbody>
                            <VitalRow
                                label="Chiều cao"
                                value={`${data.vitalSign.height ?? "-"} cm`}
                            />

                            <VitalRow
                                label="Cân nặng"
                                value={`${data.vitalSign.weight ?? "-"} kg`}
                            />

                            <VitalRow
                                label="BMI"
                                value={String(
                                    data.vitalSign.bmi ?? "-"
                                )}
                            />

                            <VitalRow
                                label="Huyết áp"
                                value={String(
                                    data.vitalSign.bloodPressure ?? "-"
                                )}
                            />

                            <VitalRow
                                label="Nhịp tim"
                                value={`${data.vitalSign.heartRate ?? "-"} bpm`}
                            />

                            <VitalRow
                                label="Đường huyết"
                                value={`${data.vitalSign.bloodSugar ?? "-"} mmol/L`}
                            />
                        </tbody>
                    </table>
                </>
            )}

            {/* TEST */}

            {/* TEST */}

            {data.tests?.length > 0 && (
                <>
                    <SectionTitle>
                        IV. XÉT NGHIỆM VÀ CẬN LÂM SÀNG
                    </SectionTitle>

                    <table className="w-full border-collapse border border-black">
                        <thead>
                            <tr>
                                <th className="border border-black p-2">
                                    STT
                                </th>

                                <th className="border border-black p-2">
                                    Tên xét nghiệm
                                </th>

                                <th className="border border-black p-2">
                                    Kết quả
                                </th>

                                <th className="border border-black p-2">
                                    Kết luận
                                </th>

                                <th className="border border-black p-2">
                                    Hình ảnh
                                </th>
                            </tr>
                        </thead>

                        <tbody>
                            {data.tests.map((test, index) => (
                                <tr key={test.id}>
                                    <td className="border border-black p-2 text-center">
                                        {index + 1}
                                    </td>

                                    <td className="border border-black p-2">
                                        {test.testName || "-"}
                                    </td>

                                    <td className="border border-black p-2">
                                        {test.resultText || "-"}
                                    </td>

                                    <td className="border border-black p-2">
                                        {test.conclusion || "-"}
                                    </td>

                                    <td className="border border-black p-2 text-center">
                                        {test.imageUrl?.trim()
                                            ? "Có"
                                            : "Không"}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <div className="mt-2 text-sm italic">
                        Chi tiết hình ảnh xét nghiệm được đính kèm
                        ở phần phụ lục phía sau.
                    </div>
                </>
            )}

            {/* PRESCRIPTION */}

            {data.items?.length > 0 && (
                <>
                    <SectionTitle>
                        V. ĐƠN THUỐC
                    </SectionTitle>

                    <table className="w-full border-collapse border border-black">
                        <thead>
                            <tr>
                                <th className="border border-black p-2">
                                    STT
                                </th>

                                <th className="border border-black p-2">
                                    Thuốc
                                </th>

                                <th className="border border-black p-2">
                                    Liều dùng
                                </th>

                                <th className="border border-black p-2">
                                    Tần suất
                                </th>

                                <th className="border border-black p-2">
                                    Thời gian
                                </th>

                                <th className="border border-black p-2">
                                    Hướng dẫn
                                </th>
                            </tr>
                        </thead>

                        <tbody>
                            {data.items.map((item, index) => (
                                <tr key={item.id}>
                                    <td className="border border-black p-2 text-center">
                                        {index + 1}
                                    </td>

                                    <td className="border border-black p-2">
                                        {item.drug}
                                    </td>

                                    <td className="border border-black p-2">
                                        {item.dosage}
                                    </td>

                                    <td className="border border-black p-2">
                                        {item.frequency}
                                    </td>

                                    <td className="border border-black p-2">
                                        {item.duration}
                                    </td>

                                    <td className="border border-black p-2">
                                        {item.instruction}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </>
            )}

            {/* TREATMENT */}

            <SectionTitle>
                VI. KẾ HOẠCH ĐIỀU TRỊ
            </SectionTitle>

            <ContentBox>
                {data.treatmentPlan || "Không có dữ liệu"}
            </ContentBox>

            {/* CONCLUSION */}

            <SectionTitle>
                VII. KẾT LUẬN
            </SectionTitle>

            <ContentBox>
                {data.conclusion || "Không có dữ liệu"}
            </ContentBox>

            {/* FOLLOW UP */}

            <SectionTitle>
                VIII. TÁI KHÁM
            </SectionTitle>

            <ContentBox>
                {data.followUpDate
                    ? new Date(data.followUpDate).toLocaleString("vi-VN")
                    : "Chưa có lịch tái khám"}
            </ContentBox>

            {/* SIGNATURE */}

            <div className="mt-16 flex justify-between">
                <div className="text-center">
                    <p className="font-bold">
                        BỆNH NHÂN
                    </p>

                    <div className="h-24" />

                    <p>
                        {data.patient.firstName}{" "}
                        {data.patient.lastName}
                    </p>
                </div>

                <div className="text-center">
                    <p className="mb-2">
                        Ngày ....... tháng ....... năm .......
                    </p>

                    <p className="font-bold">
                        BÁC SĨ ĐIỀU TRỊ
                    </p>

                    <div className="h-24" />

                    <p>
                        {data.doctor.firstName}{" "}
                        {data.doctor.lastName}
                    </p>
                </div>
            </div>

            {/* DIAGNOSTIC REPORTS */}

            {data.tests?.some((t) => t.imageUrl?.trim()) && (
                <div
                    style={{
                        pageBreakBefore: "always",
                    }}
                >
                    <div className="mb-8 text-center">
                        <h1 className="text-2xl font-bold uppercase">
                            PHỤ LỤC KẾT QUẢ XÉT NGHIỆM
                        </h1>

                        <p>
                            Diagnostic Reports Attachment
                        </p>
                    </div>

                    {data.tests
                        .filter((t) => t.imageUrl?.trim())
                        .map((test, index) => (
                            <div
                                key={test.id}
                                className="mb-10 border border-black p-4"
                                style={{
                                    pageBreakInside: "avoid",
                                }}
                            >
                                <div className="mb-4 border-b border-black pb-2">
                                    <h2 className="font-bold">
                                        Xét nghiệm #{index + 1}
                                    </h2>
                                </div>

                                <table className="mb-6 w-full border-collapse border border-black">
                                    <tbody>
                                        <tr>
                                            <td className="w-55 border border-black p-2 font-semibold">
                                                Tên xét nghiệm
                                            </td>

                                            <td className="border border-black p-2">
                                                {test.testName || "-"}
                                            </td>
                                        </tr>

                                        <tr>
                                            <td className="border border-black p-2 font-semibold">
                                                Kết quả
                                            </td>

                                            <td className="border border-black p-2">
                                                {test.resultText || "-"}
                                            </td>
                                        </tr>

                                        <tr>
                                            <td className="border border-black p-2 font-semibold">
                                                Kết luận
                                            </td>

                                            <td className="border border-black p-2">
                                                {test.conclusion || "-"}
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>

                                <div className="flex justify-center">
                                    <img
                                        src={test.imageUrl!}
                                        alt={test.testName}
                                        className="max-h-175] w-auto border border-black object-contain"
                                    />
                                </div>
                            </div>
                        ))}
                </div>
            )}
        </div>
    );
};

const SectionTitle = ({
    children,
}: {
    children: React.ReactNode;
}) => (
    <div className="mt-6 mb-2 border-b-2 border-black pb-1 font-bold uppercase">
        {children}
    </div>
);

const ContentBox = ({
    children,
}: {
    children: React.ReactNode;
}) => (
    <div className="min-h-15 border border-black p-3">
        {children}
    </div>
);

const Row = ({
    label,
    value,
}: {
    label: string;
    value?: React.ReactNode;
}) => (
    <tr>
        <td className="w-55 border border-black p-2 font-semibold">
            {label}
        </td>

        <td className="border border-black p-2">
            {value || "-"}
        </td>
    </tr>
);

const VitalRow = ({
    label,
    value,
}: {
    label: string;
    value?: string;
}) => (
    <tr>
        <td className="border border-black p-2">
            {label}
        </td>

        <td className="border border-black p-2">
            {value}
        </td>
    </tr>
);


export default MedicalRecordPrintTemplate;