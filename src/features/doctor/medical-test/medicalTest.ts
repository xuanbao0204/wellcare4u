export type MedicalTestCategory =
    | "HEMATOLOGY"
    | "BIOCHEMISTRY"
    | "URINE"
    | "IMMUNOLOGY"
    | "TUMOR_MARKER"
    | "MICROBIOLOGY"
    | "PATHOLOGY"
    | "XRAY"
    | "CT_SCAN"
    | "MRI"
    | "ULTRASOUND"
    | "ENDOSCOPY"
    | "NUCLEAR_MEDICINE"
    | "FUNCTIONAL";

export interface MedicalTestType {
    code: string;
    name: string;
    category: MedicalTestCategory;
    categoryLabel: string;
}

export const MEDICAL_TESTS: MedicalTestType[] = [
    // ===================== HUYẾT HỌC =====================
    {
        code: "HEM001",
        name: "Tổng phân tích tế bào máu ngoại vi (CBC)",
        category: "HEMATOLOGY",
        categoryLabel: "Huyết học",
    },
    {
        code: "HEM002",
        name: "Tốc độ lắng máu (ESR)",
        category: "HEMATOLOGY",
        categoryLabel: "Huyết học",
    },
    {
        code: "HEM003",
        name: "Công thức bạch cầu",
        category: "HEMATOLOGY",
        categoryLabel: "Huyết học",
    },
    {
        code: "HEM004",
        name: "Thời gian Prothrombin (PT)",
        category: "HEMATOLOGY",
        categoryLabel: "Huyết học",
    },

    // ===================== HÓA SINH =====================

    {
        code: "BIO001",
        name: "Định lượng Glucose máu",
        category: "BIOCHEMISTRY",
        categoryLabel: "Hóa sinh",
    },
    {
        code: "BIO002",
        name: "Định lượng HbA1c",
        category: "BIOCHEMISTRY",
        categoryLabel: "Hóa sinh",
    },
    {
        code: "BIO003",
        name: "Định lượng Ure máu",
        category: "BIOCHEMISTRY",
        categoryLabel: "Hóa sinh",
    },
    {
        code: "BIO004",
        name: "Định lượng Creatinine máu",
        category: "BIOCHEMISTRY",
        categoryLabel: "Hóa sinh",
    },

    // ===================== NƯỚC TIỂU =====================

    {
        code: "URI001",
        name: "Tổng phân tích nước tiểu 10 thông số",
        category: "URINE",
        categoryLabel: "Nước tiểu",
    },

    {
        code: "URI002",
        name: "Soi cặn nước tiểu",
        category: "URINE",
        categoryLabel: "Nước tiểu",
    },

    // ===================== MIỄN DỊCH =====================

    {
        code: "IMM001",
        name: "FT3, FT4, TSH",
        category: "IMMUNOLOGY",
        categoryLabel: "Miễn dịch - Nội tiết",
    },

    {
        code: "IMM002",
        name: "Hormone sinh sản nữ",
        category: "IMMUNOLOGY",
        categoryLabel: "Miễn dịch - Nội tiết",
    },

    // ===================== UNG THƯ =====================

    {
        code: "CAN001",
        name: "AFP",
        category: "TUMOR_MARKER",
        categoryLabel: "Dấu ấn ung thư",
    },

    {
        code: "CAN002",
        name: "CEA",
        category: "TUMOR_MARKER",
        categoryLabel: "Dấu ấn ung thư",
    },

    // ===================== VI SINH =====================

    {
        code: "MIC001",
        name: "Soi tươi / Nhuộm Gram",
        category: "MICROBIOLOGY",
        categoryLabel: "Vi sinh",
    },

    {
        code: "MIC002",
        name: "Nuôi cấy và làm kháng sinh đồ",
        category: "MICROBIOLOGY",
        categoryLabel: "Vi sinh",
    },

    // ===================== GIẢI PHẪU BỆNH =====================

    {
        code: "PAT001",
        name: "Pap Smear",
        category: "PATHOLOGY",
        categoryLabel: "Giải phẫu bệnh",
    },

    {
        code: "PAT002",
        name: "Cell Block",
        category: "PATHOLOGY",
        categoryLabel: "Giải phẫu bệnh",
    },

    // ===================== X-RAY =====================

    {
        code: "XRA001",
        name: "X-quang Ngực",
        category: "XRAY",
        categoryLabel: "X-quang",
    },

    {
        code: "XRA002",
        name: "X-quang Xương khớp",
        category: "XRAY",
        categoryLabel: "X-quang",
    },

    // ===================== CT =====================

    {
        code: "CTS001",
        name: "CT Scan Sọ não",
        category: "CT_SCAN",
        categoryLabel: "CT Scan",
    },

    {
        code: "CTS002",
        name: "CT Scan Ngực / Bụng / Chậu",
        category: "CT_SCAN",
        categoryLabel: "CT Scan",
    },

    // ===================== MRI =====================

    {
        code: "MRI001",
        name: "MRI Sọ não",
        category: "MRI",
        categoryLabel: "MRI",
    },

    {
        code: "MRI002",
        name: "MRI Cột sống",
        category: "MRI",
        categoryLabel: "MRI",
    },

    // ===================== SIÊU ÂM =====================

    {
        code: "ULS001",
        name: "Siêu âm bụng tổng quát",
        category: "ULTRASOUND",
        categoryLabel: "Siêu âm",
    },

    {
        code: "ULS002",
        name: "Siêu âm tuyến giáp",
        category: "ULTRASOUND",
        categoryLabel: "Siêu âm",
    },

    // ===================== NỘI SOI =====================

    {
        code: "END001",
        name: "Nội soi Dạ dày - Tá tràng",
        category: "ENDOSCOPY",
        categoryLabel: "Nội soi",
    },

    {
        code: "END002",
        name: "Nội soi Đại trực tràng",
        category: "ENDOSCOPY",
        categoryLabel: "Nội soi",
    },

    // ===================== THĂM DÒ CHỨC NĂNG =====================

    {
        code: "FUN001",
        name: "Điện tâm đồ ECG",
        category: "FUNCTIONAL",
        categoryLabel: "Thăm dò chức năng",
    },

    {
        code: "FUN002",
        name: "Điện não đồ EEG",
        category: "FUNCTIONAL",
        categoryLabel: "Thăm dò chức năng",
    },
];

