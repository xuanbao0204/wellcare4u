import type { Metadata } from "next";
import { Quicksand} from "next/font/google";
import "./globals.css";
import ToastProvider from "@/shared/ToastProvider";
import { AuthProvider } from "@/shared/AuthContext";
import NavBar from "@/shared/sections/NavBar";

const quicksand = Quicksand({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "WellCare4U - For a healthier life",
  description: "Chào mừng đến với WellCare4U",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className="scroll-smooth">
      <body
        className={`${quicksand.variable} antialiased`}
      >
        <ToastProvider />

        <AuthProvider>
          <NavBar/>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
