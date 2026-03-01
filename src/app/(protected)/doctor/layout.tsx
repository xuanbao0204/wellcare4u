import ProtectedLayout from "@/shared/layouts/ProtectedPage";

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <ProtectedLayout allowedRoles={["DOCTOR"]}>
            <main>{children}</main>
        </ProtectedLayout>
    );
}