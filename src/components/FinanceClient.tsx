"use client";

import { useState } from "react";
import { 
  ArrowUpCircle, 
  ArrowDownCircle, 
  TrendingUp, 
  X, 
  Plus, 
  ShoppingCart, 
  Wrench, 
  Briefcase,
  History,
  CalendarDays,
  Search,
  Filter
} from "lucide-react";
import { cn, formatCurrency } from "@/lib/utils";
import { createTransaction } from "@/app/actions";

const months = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
];

const categories = [
  { id: "REPAIR", label: "Reparaciones", icon: Wrench },
  { id: "SALE", label: "Ventas Accesorios", icon: ShoppingCart },
  { id: "SERVICE", label: "Equipos", icon: Briefcase },
  { id: "OTHER", label: "Otros", icon: History }
];

export function FinanceClient({ initialTransactions }: { initialTransactions: any[] }) {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTx, setNewTx] = useState({ 
    type: "INCOME", 
    category: "REPAIR", 
    description: "", 
    amount: "", 
    date: new Date().toISOString().split('T')[0] 
  });

  const filtered = initialTransactions.filter(t => {
    const d = new Date(t.date);
    return d.getMonth() === selectedMonth && d.getFullYear() === selectedYear;
  });

  const income = filtered.filter(t => t.type === "INCOME").reduce((acc, c) => acc + c.amount, 0);
  const expense = filtered.filter(t => t.type === "EXPENSE").reduce((acc, c) => acc + c.amount, 0);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTx.amount || Number(newTx.amount) <= 0) return;
    
    await createTransaction({ 
      ...newTx, 
      amount: Number(newTx.amount) 
    });
    setIsModalOpen(false);
    window.location.reload();
  };

  return (
    <div className="space-y-8 pb-20">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight">Finanzas</h2>
          <p className="text-[10px] md:text-xs text-muted mt-1 uppercase tracking-widest font-bold">Flujo de caja y rentabilidad</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)} 
          className="flex items-center justify-center gap-2 px-5 py-3 bg-primary text-black rounded-xl font-bold uppercase tracking-widest text-[10px] hover:scale-105 transition-transform active:scale-95 shadow-lg shadow-primary/10 whitespace-nowrap"
        >
          <Plus className="w-4 h-4" /> Nuevo Movimiento
        </button>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        <div className="relative group overflow-hidden p-6 rounded-[2rem] bg-[#1c1c1e] border border-green-500/10 shadow-xl transition-all">
          <div className="flex justify-between items-start mb-4">
            <ArrowUpCircle className="w-8 h-8 text-green-500" />
            <span className="text-[8px] font-black text-green-500/50 uppercase tracking-[0.2em]">Ingresos</span>
          </div>
          <p className="text-xl md:text-2xl font-black text-white">{formatCurrency(income)}</p>
          <div className="absolute top-0 right-0 w-24 h-24 bg-green-500/5 blur-[40px] rounded-full -mr-12 -mt-12" />
        </div>

        <div className="relative group overflow-hidden p-6 rounded-[2rem] bg-[#1c1c1e] border border-red-500/10 shadow-xl transition-all">
          <div className="flex justify-between items-start mb-4">
            <ArrowDownCircle className="w-8 h-8 text-red-500" />
            <span className="text-[8px] font-black text-red-500/50 uppercase tracking-[0.2em]">Egresos</span>
          </div>
          <p className="text-xl md:text-2xl font-black text-white">{formatCurrency(expense)}</p>
          <div className="absolute top-0 right-0 w-24 h-24 bg-red-500/5 blur-[40px] rounded-full -mr-12 -mt-12" />
        </div>

        <div className="sm:col-span-2 lg:col-span-1 relative group overflow-hidden p-6 rounded-[2rem] bg-primary border border-white/10 shadow-xl shadow-primary/10 transition-all hover:scale-[1.01]">
          <div className="flex justify-between items-start mb-4">
            <TrendingUp className="w-8 h-8 text-black" />
            <span className="text-[8px] font-black text-black/40 uppercase tracking-[0.2em]">Neto</span>
          </div>
          <p className="text-xl md:text-2xl font-black text-black">{formatCurrency(income - expense)}</p>
          <div className="absolute top-0 right-0 w-24 h-24 bg-white/30 blur-[40px] rounded-full -mr-12 -mt-12" />
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <CalendarDays className="w-4 h-4 text-primary" />
            <h3 className="text-sm md:text-base font-black text-white uppercase tracking-widest italic">Movimientos de {months[selectedMonth]}</h3>
          </div>
          
          <div className="flex items-center gap-1.5 self-start md:self-auto bg-[#1c1c1e] p-1 rounded-xl border border-white/5">
            <select 
              value={selectedMonth} 
              onChange={e => setSelectedMonth(Number(e.target.value))} 
              className="bg-transparent text-white font-bold py-1.5 px-2 text-[10px] md:text-xs focus:outline-none cursor-pointer"
            >
              {months.map((m, i) => <option key={m} value={i} className="text-black font-semibold">{m}</option>)}
            </select>
            <div className="w-px h-3 bg-white/10" />
            <select 
              value={selectedYear} 
              onChange={e => setSelectedYear(Number(e.target.value))} 
              className="bg-transparent text-white font-bold py-1.5 px-2 text-[10px] md:text-xs focus:outline-none cursor-pointer"
            >
              {[2024, 2025, 2026].map(y => <option key={y} value={y} className="text-black font-semibold">{y}</option>)}
            </select>
          </div>
        </div>

        <div className="space-y-2">
          {filtered.map(t => (
            <div key={t.id} className="group p-4 rounded-2xl bg-[#1c1c1e]/50 border border-white/5 hover:border-white/10 transition-all flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 backdrop-blur-sm">
              <div className="flex items-center gap-3">
                <div className={cn(
                  "w-10 h-10 rounded-xl flex items-center justify-center shrink-0",
                  t.type === "INCOME" ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"
                )}>
                  {t.type === "INCOME" ? <ArrowUpCircle className="w-5 h-5" /> : <ArrowDownCircle className="w-5 h-5" />}
                </div>
                <div className="min-w-0">
                  <h4 className="font-bold text-white text-xs md:text-sm truncate max-w-[200px] md:max-w-md">{t.description}</h4>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[8px] font-black text-white/30 uppercase tracking-widest">{t.category}</span>
                    <span className="w-0.5 h-0.5 rounded-full bg-white/10" />
                    <span className="text-[8px] font-black text-white/30 uppercase tracking-widest">{new Date(t.date).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
              <p className={cn("text-base md:text-lg font-black sm:text-right shrink-0", t.type === "INCOME" ? "text-green-500" : "text-red-500")}>
                {t.type === "INCOME" ? "+" : "-"}{formatCurrency(t.amount)}
              </p>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="py-12 text-center opacity-10">
              <p className="text-[10px] font-black uppercase tracking-widest">Sin registros</p>
            </div>
          )}
        </div>
      </div>

      {/* MODAL: REGISTRO FINANCIERO */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-fade-in text-xs">
          <div className="w-full max-w-md bg-[#1c1c1e] border border-white/10 p-6 rounded-[2.5rem] shadow-3xl overflow-y-auto max-h-[90vh]">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-black text-white italic tracking-tight">Nuevo Registro</h3>
              <button 
                onClick={() => setIsModalOpen(false)} 
                className="text-muted hover:text-white p-2 hover:bg-white/5 rounded-full transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <form onSubmit={handleAdd} className="space-y-5">
              <div className="grid grid-cols-2 gap-3">
                <button 
                  type="button" 
                  onClick={() => setNewTx({...newTx, type: "INCOME"})}
                  className={cn(
                    "py-3 rounded-xl font-black uppercase text-[9px] tracking-widest border transition-all active:scale-95",
                    newTx.type === "INCOME" ? "bg-green-500 text-black border-green-500 shadow-lg shadow-green-500/20" : "border-white/5 text-muted hover:border-white/10"
                  )}
                >
                  Ingreso (+)
                </button>
                <button 
                  type="button" 
                  onClick={() => setNewTx({...newTx, type: "EXPENSE"})}
                  className={cn(
                    "py-3 rounded-xl font-black uppercase text-[9px] tracking-widest border transition-all active:scale-95",
                    newTx.type === "EXPENSE" ? "bg-red-500 text-white border-red-500 shadow-lg shadow-red-500/20" : "border-white/5 text-muted hover:border-white/10"
                  )}
                >
                  Egreso (-)
                </button>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[8px] font-black text-muted uppercase tracking-widest ml-1">Categoría</label>
                  <div className="grid grid-cols-2 gap-2">
                    {categories.map(c => (
                      <button 
                        key={c.id} 
                        type="button"
                        onClick={() => setNewTx({...newTx, category: c.id})}
                        className={cn(
                          "flex items-center gap-2 p-3 rounded-xl text-[8px] font-bold uppercase border transition-all",
                          newTx.category === c.id ? "bg-white text-black border-white" : "border-white/5 text-muted hover:bg-white/5"
                        )}
                      >
                        <c.icon className="w-3.5 h-3.5 shrink-0" />
                        <span className="truncate">{c.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[8px] font-black text-muted uppercase tracking-widest ml-1">Concepto</label>
                  <input 
                    required 
                    className="w-full p-4 rounded-xl bg-white/5 border border-white/10 text-white font-bold text-sm focus:border-primary/50 focus:outline-none transition-colors" 
                    placeholder="Ej: Cobro Reparación..." 
                    value={newTx.description} 
                    onChange={e => setNewTx({...newTx, description: e.target.value})} 
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-[8px] font-black text-muted uppercase tracking-widest ml-1">Monto</label>
                    <input 
                      type="number" 
                      required 
                      className="w-full p-4 rounded-xl bg-primary text-black font-black text-lg focus:outline-none shadow-lg" 
                      placeholder="0.00" 
                      value={newTx.amount} 
                      onChange={e => setNewTx({...newTx, amount: e.target.value})} 
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[8px] font-black text-muted uppercase tracking-widest ml-1">Fecha</label>
                    <input 
                      type="date" 
                      required 
                      className="w-full p-4 rounded-xl bg-white/5 border border-white/10 text-white font-bold text-[10px] focus:outline-none" 
                      value={newTx.date} 
                      onChange={e => setNewTx({...newTx, date: e.target.value})} 
                    />
                  </div>
                </div>
              </div>

              <button 
                type="submit" 
                className="w-full py-4 mt-2 bg-white text-black rounded-xl font-black uppercase tracking-widest text-[9px] hover:bg-primary transition-all active:scale-95 shadow-xl"
              >
                Guardar Registro
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
