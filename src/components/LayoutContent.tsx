"use client";

import { usePathname } from "next/navigation";
import { Sidebar } from "@/components/Sidebar";

export default function LayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/login";

  if (isLoginPage) return <>{children}</>;

  return (
    <>
      <Sidebar />
      <main className="flex-1 lg:ml-72 p-6 lg:p-12 min-h-screen">
        <div className="max-w-7xl mx-auto animate-fade-in w-full">
          {children}
        </div>
      </main>
    </>
  );
}
