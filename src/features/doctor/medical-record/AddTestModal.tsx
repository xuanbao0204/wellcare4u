"use client";

import { deleteFile, uploadToCloudinary } from "@/shared/services/uploadFile";
import { MedicalTest } from "@/shared/type";
import { useState } from "react";

type Props = {
    countTest?: number;
    recordId: number;
    open: boolean;
    onClose: () => void;
    onAdd: (test: MedicalTest) => void;
};

export default function TestModal({ countTest, recordId, open, onClose, onAdd }: Props) {
    const [loading, setLoading] = useState(false);

    const [publicId, setpublicId] = useState("");

    const [tempTest, setTempTest] = useState<MedicalTest>({
        testName: "",
        resultText: "",
        conclusion: "",
        imageUrl: "",
    });

    if (!open) return null;

    const isValid =
        tempTest.testName?.trim() &&
        tempTest.resultText?.trim() &&
        tempTest.conclusion?.trim();

    const handleUpload = async (file: File) => {
        try {
            setLoading(true);

            const url = await uploadToCloudinary(file, { folder: "medical-tests", publicId: `test-${countTest}-${recordId}` });

            setTempTest((prev) => ({
                ...prev,
                imageUrl: url,
            }));

            setpublicId(`test-${countTest}-${recordId}`);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = () => {
        if (!tempTest.testName) return;

        onAdd({
            ...tempTest,
        });

        setTempTest({
            testName: "",
            resultText: "",
            conclusion: "",
            imageUrl: "",
        });

        onClose();
    };

    const handleCancel = async () => {
        try {
            if (publicId) {
                await deleteFile(publicId);
            }
        } catch (e) { }

        setTempTest({
            testName: "",
            resultText: "",
            conclusion: "",
            imageUrl: "",
        });

        setpublicId("");
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div
                className="absolute inset-0 bg-black/30 backdrop-blur-sm"
                onClick={handleCancel}
            />

            <div className="relative w-full max-w-xl rounded-3xl bg-white/70 backdrop-blur-xl p-6 shadow-[0_20px_60px_rgba(0,0,0,0.15)] flex flex-col gap-5">

                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold">Thêm xét nghiệm</h2>
                </div>

                <div className="space-y-4">

                    <input
                        placeholder="Tên xét nghiệm"
                        value={tempTest.testName}
                        onChange={(e) =>
                            setTempTest({ ...tempTest, testName: e.target.value })
                        }
                        className="w-full bg-white/70 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary/40"
                    />

                    <textarea
                        placeholder="Kết quả"
                        value={tempTest.resultText}
                        onChange={(e) =>
                            setTempTest({ ...tempTest, resultText: e.target.value })
                        }
                        className="w-full h-24 bg-white/70 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary/40"
                    />

                    <textarea
                        placeholder="Kết luận"
                        value={tempTest.conclusion}
                        onChange={(e) =>
                            setTempTest({ ...tempTest, conclusion: e.target.value })
                        }
                        className="w-full h-24 bg-white/70 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary/40"
                    />

                    <div className="flex flex-col gap-3">
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) =>
                                e.target.files && handleUpload(e.target.files[0])
                            }
                            className="text-sm"
                        />

                        {loading && (
                            <div className="text-sm text-foreground/60">
                                Đang upload...
                            </div>
                        )}

                        {tempTest.imageUrl && (
                            <>
                                <img
                                    src={tempTest.imageUrl}
                                    className="rounded-xl h-32 object-cover border border-white/40"
                                />

                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) =>
                                        e.target.files && handleUpload(e.target.files[0])
                                    }
                                    className="text-sm"
                                />
                            </>
                        )}
                    </div>
                </div>

                <div className="flex justify-end gap-3 mt-2">
                    <button
                        onClick={handleCancel}
                        className="px-4 py-2 rounded-xl bg-white/60 hover:bg-white transition"
                    >
                        Huỷ
                    </button>

                    <button
                        onClick={handleSubmit}
                        disabled={!isValid}
                        className="px-5 py-2 rounded-xl bg-primary text-white shadow-md disabled:opacity-40"
                    >
                        Thêm
                    </button>
                </div>
            </div>
        </div>
    );
}