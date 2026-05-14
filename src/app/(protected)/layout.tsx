export default function ProtectedGroupLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <div className="pt-24 w-full">{children}</div>;
}
