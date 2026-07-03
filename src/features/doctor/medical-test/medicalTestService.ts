import api from "@/lib/axios";
import { MedicalTest } from "@/shared/type";

export const orderTest = async (
    recordId: number,
    testName: string,
    note?: string,
) => {

    const res = await api.post(
        `/medical-tests/order`,
        {
            recordId,
            testName,
            note,
        }
    );

    return res.data;
};

export const getTestsByRecord = async (
    recordId: number
): Promise<MedicalTest[]> => {

    const res = await api.get(
        `/medical-tests/record/${recordId}`
    );

    return res.data.data;
};

export const getMyPendingTests = async () => {

    const res = await api.get(
        "/medical-tests/pending"
    );

    return res.data.data;
};

export const getMyCompletedTestsToday = async () => {

    const res = await api.get(
        "/medical-tests/completed-today"
    );

    return res.data.data;
};

export const completeTest = async (
    testId: number,
    data: {
        resultText: string;
        conclusion: string;
        imageUrl?: string;
    }
) => {

    const res = await api.put(
        `/medical-tests/${testId}/complete`,
        data
    );

    return res.data;
};