"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { 
  Home, 
  Wrench, 
  Users, 
  Package, 
  BarChart3, 
  LayoutDashboard,
  Zap,
  Menu,
  X,
  Database,
  LogOut
} from "lucide-react";
import { signOut } from "next-auth/react";
import { cn } from "@/lib/utils";

const links = [
  { href: "/", label: "Vista General", icon: LayoutDashboard },
  { href: "/repairs", label: "Reparaciones", icon: Wrench },
  { href: "/clients", label: "Clientes", icon: Users },
  { href: "/stock", label: "Inventario", icon: Package },
  { href: "/finance", label: "Finanzas", icon: BarChart3 },
  { href: "/system", label: "Sistema", icon: Database },
];

export function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile Toggle */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-6 right-6 z-50 p-3 rounded-2xl bg-primary text-black shadow-lg"
      >
        {isOpen ? <X /> : <Menu />}
      </button>

      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside className={cn(
        "fixed left-0 top-0 h-full w-72 bg-[#0a0a0a] border-r border-white/5 flex flex-col z-40 transition-transform duration-300 lg:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="p-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(0,255,136,0.3)]">
              <Zap className="text-black w-6 h-6 fill-current" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-white tracking-tighter">nactech</h1>
              <p className="text-[9px] font-black text-primary uppercase tracking-[0.2em] -mt-1">iPhone Lab</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-6 space-y-2 mt-4">
          {links.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={cn(
                  "group flex items-center gap-4 px-6 py-4 rounded-2xl transition-all duration-300 relative overflow-hidden",
                  isActive 
                    ? "bg-white/5 text-primary" 
                    : "text-muted hover:text-white hover:bg-white/5"
                )}
              >
                {isActive && (
                  <div className="absolute left-0 top-0 w-1 h-full bg-primary" />
                )}
                <link.icon className={cn(
                  "w-5 h-5 transition-colors",
                  isActive ? "text-primary" : "text-muted group-hover:text-white"
                )} />
                <span className="font-bold text-sm uppercase tracking-widest leading-none">{link.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-8">
          <div className="p-6 rounded-[2rem] bg-gradient-to-br from-white/5 to-transparent border border-white/5">
            <p className="text-[10px] font-black text-muted uppercase tracking-widest mb-4">Estado del Sistema</p>
            <div className="flex items-center gap-3">
               <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
               <span className="text-xs font-bold text-white/80">Base de Datos: OK</span>
            </div>
          </div>
        </div>

        <div className="px-6 pb-8">
           <button 
            onClick={() => signOut()}
            className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-red-500/50 hover:text-red-500 hover:bg-red-500/5 transition-all duration-300 group"
           >
             <LogOut className="w-5 h-5 group-hover:scale-110 transition-transform" />
             <span className="font-bold text-xs uppercase tracking-widest">Cerrar Sesión</span>
           </button>
        </div>
      </aside>
    </>
  );
}
