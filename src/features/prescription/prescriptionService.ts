import api from "@/lib/axios"

export const fetchPrescription = async () => {
    try {
        const res = await api.get("/prescriptions/patient");
        return res.data;
    } catch (e) {
        console.log(e)
    }
}