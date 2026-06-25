import api from "@/lib/axios";

export const getAllDrugs = async () => {
    const res = await api.get("/drugs");
    return res.data.data;
};

export const searchDrugs = async (keyword: string) => {
    const res = await api.get(
        `/drugs/search?keyword=${keyword}`
    );

    return res.data.data;
};