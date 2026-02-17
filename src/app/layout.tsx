import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/Sidebar";
import Providers from "@/components/Providers";
import LayoutContent from "@/components/LayoutContent";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "nactech | iPhone Repair Management",
  description: "Sistema minimalista para administración de negocios de reparación de iPhone",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="dark">
      <body className={`${inter.className} min-h-screen flex bg-background`}>
        <Providers>
          <LayoutContent children={children} />
        </Providers>
      </body>
    </html>
  );
}
