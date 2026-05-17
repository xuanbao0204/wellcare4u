"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function ActiveAccountPage() {

    const [flow, setFlow] = useState<any>(null);
    const router = useRouter();

    useEffect(() => {
        const stored = sessionStorage.getItem("otp_flow");

        if (stored) {
            setFlow(JSON.parse(stored));
        }
    }, []);

    const email = flow?.email;

    return (
        <div className="flex flex-col items-center justify-center h-screen px-4 text-center">
            <h1 className="text-3xl font-bold mb-4">
                Activate your account
            </h1>

            <p className="text-lg text-gray-600 max-w-md">
                Your account needs to be verified before using the system.
            </p>

            {email && (
                <button
                    onClick={() =>
                        router.push(
                            `/verify-otp`
                        )
                    }
                    className="mt-6 px-5 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
                >
                    Verify OTP
                </button>
            )}
        </div>
    );
}