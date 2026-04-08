import { useEffect, useState } from "react";
import DoctorCard from "./DoctorCard";
import { getAllDoctors } from "../patientAppointmentService";
import { showError } from "@/lib/toast";

export default function DoctorSelectStep({ onSelect }: any) {
    const [doctors, setDoctors] = useState<any[]>([]);
    const [keyword, setKeyword] = useState("");
    const [page, setPage] = useState(0);
    const [size, setSize] = useState(5);

    useEffect(() => {
        fetchDoctors();
    }, []);

    const fetchDoctors = async () => {
        const res = await getAllDoctors({ page, size });
        if (res.status !== 200) {
            showError(res.message);
            return;
        }

        setDoctors(res.data.content);
    };

    const handleSearch = () => {
        // call API search
    };

    return (
        <div className="flex flex-col gap-4">
            <h2 className="text-xl font-semibold">Chọn bác sĩ</h2>

            <div className="flex gap-2">
                <input
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    placeholder="Tìm theo tên..."
                    className="flex-1 border rounded-lg px-3 py-2"
                />
                <button
                    onClick={handleSearch}
                    className="bg-primary text-white px-4 rounded-lg"
                >
                    Tìm
                </button>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {doctors.map((doc) => (
                    <DoctorCard key={doc.id} doctor={doc} onSelect={onSelect} />
                ))}
            </div>
        </div>
    );
}