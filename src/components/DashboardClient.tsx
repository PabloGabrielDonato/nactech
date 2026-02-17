"use client";

import { 
  Wrench, 
  TrendingUp, 
  Package, 
  Clock,
  ShoppingBag,
  LayoutDashboard,
  Zap,
  ChevronRight,
  ArrowUpRight,
  ArrowDownRight,
  Wallet,
  Coins
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { useEffect, useState } from "react";
import { getRepairs, getTransactions, getProducts } from "@/app/actions";
import Link from "next/link";

export default function DashboardClient({ 
  initialRepairs, 
  initialTransactions, 
  initialProducts 
}: { 
  initialRepairs: any[], 
  initialTransactions: any[], 
  initialProducts: any[] 
}) {
  const activeRepairs = initialRepairs.filter((r: any) => r.status === "IN_PROGRESS" || r.status === "PENDING").length;
  
  const monthlyIncome = initialTransactions
    .filter((t: any) => t.type === "INCOME" && new Date(t.date).getMonth() === new Date().getMonth())
    .reduce((acc: number, curr: any) => acc + curr.amount, 0);
  
  const projectedIncome = initialRepairs
    .filter((r: any) => r.status !== "DELIVERED" && r.status !== "CANCELLED")
    .reduce((acc: number, curr: any) => acc + curr.price, 0);

  const lowStock = initialProducts.filter((p: any) => p.stock < 5).length;

  const stats = [
    { name: "Activas", label: "Reparaciones", value: activeRepairs.toString(), icon: Wrench, color: "text-blue-500", bg: "bg-blue-500/10", href: "/repairs" },
    { name: "Ingresos", label: "Caja Mes", value: formatCurrency(monthlyIncome), icon: Wallet, color: "text-primary", bg: "bg-primary/10", href: "/finance" },
    { name: "Proyectado", label: "Pendiente Cobro", value: formatCurrency(projectedIncome), icon: Coins, color: "text-yellow-500", bg: "bg-yellow-500/10", href: "/repairs" },
    { name: "Alerta Stock", label: "Componentes", value: lowStock.toString(), icon: Package, color: "text-red-500", bg: "bg-red-500/10", href: "/stock" },
  ];

  return (
    <div className="space-y-10 pb-20">
      <header className="animate-fade-in">
        <div className="flex items-center gap-2 mb-2">
          <LayoutDashboard className="w-4 h-4 text-primary" />
          <h2 className="text-[9px] font-black uppercase tracking-[0.4em] text-muted">Centro de Control</h2>
        </div>
        <h1 className="text-3xl md:text-4xl font-black text-white tracking-tighter">
          Dashboard <span className="text-primary">nactech</span>
        </h1>
        <p className="text-muted mt-2 text-xs max-w-lg font-medium">
          Monitoreo de flujo de caja y gestión de taller.
        </p>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-5 animate-fade-in">
        {stats.map((stat) => (
          <Link 
            key={stat.name} 
            href={stat.href}
            className="group p-5 md:p-6 rounded-[2rem] bg-[#1c1c1e] border border-white/5 hover:border-white/10 transition-all block relative overflow-hidden shadow-lg animate-fade-in"
          >
            <div className={cn("inline-flex p-2.5 rounded-xl mb-3 transition-transform group-hover:scale-110", stat.bg, stat.color)}>
              <stat.icon className="w-4 h-4" />
            </div>
            <p className="text-[7px] font-black text-muted uppercase tracking-[0.2em] mb-0.5">{stat.label}</p>
            <h3 className="text-base md:text-lg font-black text-white truncate">{stat.value}</h3>
            <div className="absolute top-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity">
               <ArrowUpRight className="w-3 h-3 text-muted" />
            </div>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 animate-fade-in" style={{ animationDelay: '0.1s' }}>
        {/* Recent Repairs */}
        <section className="p-6 md:p-8 rounded-[2.5rem] bg-[#0a0a0a] border border-white/5 shadow-2xl">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-lg font-black text-white italic tracking-tight italic">Próximos Retiros</h3>
              <p className="text-[8px] font-black text-muted uppercase tracking-widest mt-1">Órdenes abiertas</p>
            </div>
            <Link href="/repairs" className="p-2 rounded-full bg-white/5 text-muted hover:text-white transition-colors">
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="space-y-2">
            {initialRepairs.filter(r => r.status !== "DELIVERED" && r.status !== "CANCELLED").slice(0, 5).map((r: any) => (
              <div key={r.id} className="flex items-center justify-between p-4 rounded-xl bg-[#1c1c1e]/40 border border-white/5 group hover:bg-[#1c1c1e] transition-all">
                <div className="flex items-center gap-4 min-w-0">
                  <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-black text-[10px] shrink-0">
                    {r.deviceModel.split(' ')[1] || 'iP'}
                  </div>
                  <div className="truncate">
                    <h4 className="font-bold text-white text-[11px] md:text-xs truncate">{r.deviceModel}</h4>
                    <p className="text-[8px] text-muted font-black uppercase truncate">{r.client?.firstName} {r.client?.lastName}</p>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-xs font-black text-white">{formatCurrency(r.price)}</p>
                  <p className="text-[7px] text-muted font-bold uppercase mt-0.5">{r.status}</p>
                </div>
              </div>
            ))}
            {initialRepairs.filter(r => r.status !== "DELIVERED").length === 0 && (
              <div className="py-12 text-center opacity-5">
                <p className="font-black uppercase text-[8px] tracking-widest">Sin pendientes</p>
              </div>
            )}
          </div>
        </section>

        {/* Recent Transactions */}
        <section className="p-6 md:p-8 rounded-[2.5rem] bg-[#0a0a0a] border border-white/5 shadow-2xl">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-lg font-black text-white italic tracking-tight italic">Flujo de Caja</h3>
              <p className="text-[8px] font-black text-muted uppercase tracking-widest mt-1">Últimos movimientos</p>
            </div>
            <Link href="/finance" className="p-2 rounded-full bg-white/5 text-muted hover:text-white transition-colors">
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="space-y-2">
             {initialTransactions.slice(0, 5).map((t: any) => (
              <div key={t.id} className="flex items-center justify-between p-4 rounded-xl bg-[#1c1c1e]/40 border border-white/5 group hover:bg-[#1c1c1e] transition-all">
                <div className="flex items-center gap-4 min-w-0">
                  <div className={cn(
                    "w-9 h-9 rounded-lg flex items-center justify-center shrink-0",
                    t.type === "INCOME" ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"
                  )}>
                    <ShoppingBag className="w-4 h-4" />
                  </div>
                  <div className="truncate">
                    <h4 className="font-bold text-white text-[11px] md:text-xs truncate">{t.description}</h4>
                    <p className="text-[8px] text-muted font-black uppercase truncate">{t.category}</p>
                  </div>
                </div>
                <div className="text-right shrink-0">
                   <p className={cn("font-black text-xs", t.type === "INCOME" ? "text-green-500" : "text-red-500")}>
                    {t.type === "INCOME" ? "+" : "-"}{formatCurrency(t.amount)}
                   </p>
                   <p className="text-[7px] text-muted font-bold uppercase">{new Date(t.date).toLocaleDateString()}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

function cn(...classes: any[]) {
  return classes.filter(Boolean).join(' ');
}
