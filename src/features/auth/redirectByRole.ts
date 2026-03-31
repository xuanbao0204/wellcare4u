import { useRouter } from "next/navigation";

export const useRedirectByRole = () => {
    const router = useRouter();

    return (role: string) => {
        switch (role) {
            case "ADMIN":
                router.push("/admin");
                break;
            case "DOCTOR":
                router.push("/doctor");
                break;
            case "PATIENT":
                router.push("/patient");
                break;
            default:
                router.push("/");
        }
    };
};