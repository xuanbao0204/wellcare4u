import { useRouter } from "next/navigation";

export const useRedirectByRole = () => {
    const router = useRouter();

    return (role: string) => {
        switch (role) {
            case "ADMIN":
                router.push("/admin/dashboard");
                break;
            case "DOCTOR":
                router.push("/doctor/dashboard");
                break;
            case "PATIENT":
                router.push("/patient/dashboard");
                break;
            default:
                router.push("/");
        }
    };
};