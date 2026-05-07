import ProtectedLayout from "@/shared/layouts/ProtectedPage";

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <ProtectedLayout allowedRoles={["PATIENT", "DOCTOR"]}>
            <main className="bg-white min-h-screen w-full rounded-2xl">{children}</main>
        </ProtectedLayout>
    );
}