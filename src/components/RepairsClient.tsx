"use client";

import { useState, useEffect } from "react";
import { 
  Plus, 
  Search, 
  Wrench, 
  Smartphone, 
  User, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Save, 
  X,
  CreditCard,
  Hash,
  Lock,
  MessageSquare,
  ChevronRight
} from "lucide-react";
import { cn, formatCurrency } from "@/lib/utils";
import iphoneModels from "@/data/iphone-models.json";
import { createRepair, updateRepairAction } from "@/app/actions";

const statusConfig = {
  PENDING: { label: "Pendiente", color: "bg-yellow-500/10 text-yellow-500", icon: Clock },
  IN_PROGRESS: { label: "En Lab", color: "bg-blue-500/10 text-blue-500", icon: Wrench },
  COMPLETED: { label: "Listo", color: "bg-green-500/10 text-green-500", icon: CheckCircle2 },
  DELIVERED: { label: "Entregado", color: "bg-purple-500/10 text-purple-500", icon: User },
  CANCELLED: { label: "Cancelado", color: "bg-red-500/10 text-red-500", icon: AlertCircle },
};

export function RepairsClient({ initialRepairs, initialClients }: { initialRepairs: any[], initialClients: any[] }) {
  const [repairs, setRepairs] = useState(initialRepairs);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRepair, setSelectedRepair] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  
  const [newRepair, setNewRepair] = useState({ 
    clientId: "", 
    deviceModel: "", 
    problem: "", 
    imei: "", 
    password: "",
    price: "",
    cost: "0",
    annotation: ""
  });

  const [editForm, setEditForm] = useState<any>(null);

  // Efecto para abrir automáticamente una reparación si viene desde Clientes
  useEffect(() => {
    const autoOpenId = localStorage.getItem('autoOpenRepair');
    if (autoOpenId) {
      const repairToOpen = repairs.find(r => r.id === autoOpenId);
      if (repairToOpen) {
        setSelectedRepair(repairToOpen);
        setIsEditing(false);
      }
      localStorage.removeItem('autoOpenRepair');
    }
  }, [repairs]);

  const filteredRepairs = repairs.filter(r => 
    (r.client?.firstName || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (r.client?.lastName || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (r.id || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (r.deviceModel || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddRepair = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRepair.clientId || !newRepair.deviceModel) return;
    
    const data = {
      clientId: newRepair.clientId,
      deviceModel: newRepair.deviceModel,
      status: "PENDING",
      problem: newRepair.problem,
      price: Number(newRepair.price),
      cost: Number(newRepair.cost),
      imei: newRepair.imei,
      password: newRepair.password,
      annotation: newRepair.annotation
    };
    await createRepair(data);
    setIsModalOpen(false);
    window.location.reload();
  };

  const handleStatusChange = async (repairId: string, newStatus: string) => {
    await updateRepairAction(repairId, { status: newStatus });
    window.location.reload();
  };

  const startEditing = (repair: any) => {
    setEditForm({ ...repair });
    setIsEditing(true);
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { id, client, createdAt, updatedAt, ...updatableData } = editForm;
    updatableData.price = Number(updatableData.price);
    updatableData.cost = Number(updatableData.cost);
    
    await updateRepairAction(id, updatableData);
    setIsEditing(false);
    setSelectedRepair(null);
    window.location.reload();
  };

  return (
    <div className="space-y-6 pb-20">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight italic">Reparaciones</h2>
          <p className="text-[10px] md:text-xs text-muted mt-1 uppercase tracking-widest font-black font-medium">Gestión técnica de equipos</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-primary text-black font-bold uppercase tracking-widest text-[10px] hover:scale-105 transition-transform active:scale-95 shadow-lg shadow-primary/10 whitespace-nowrap"
        >
          <Plus className="w-4 h-4" /> Nueva Orden
        </button>
      </header>

      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
        <input 
          type="text" 
          placeholder="Buscar..." 
          className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#1c1c1e] border border-white/5 text-sm text-white focus:border-primary/50 transition-colors focus:outline-none"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto rounded-3xl border border-white/5 bg-[#1c1c1e]/40 backdrop-blur-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/5 bg-white/5">
              <th className="px-6 py-4 text-[8px] font-black uppercase tracking-widest text-muted">Equipo</th>
              <th className="px-6 py-4 text-[8px] font-black uppercase tracking-widest text-muted">Cliente</th>
              <th className="px-6 py-4 text-[8px] font-black uppercase tracking-widest text-muted">Estado</th>
              <th className="px-6 py-4 text-[8px] font-black uppercase tracking-widest text-muted">Precio</th>
              <th className="px-6 py-4 text-[8px] font-black uppercase tracking-widest text-muted text-right">Acción</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {filteredRepairs.map((repair) => {
              const status = statusConfig[repair.status as keyof typeof statusConfig] || statusConfig.PENDING;
              return (
                <tr key={repair.id} className="hover:bg-white/5 transition-colors group">
                  <td className="px-6 py-4">
                    <p className="font-bold text-white text-xs mb-0.5">{repair.deviceModel}</p>
                    <p className="text-[8px] text-muted font-mono">{repair.id.slice(0, 8)}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-medium text-white/80 text-xs">{repair.client?.firstName} {repair.client?.lastName}</p>
                    <p className="text-[8px] text-muted">{new Date(repair.createdAt).toLocaleDateString()}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className={cn("inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[8px] font-black uppercase tracking-tight", status.color)}>
                      <status.icon className="w-2.5 h-2.5" />
                      {status.label}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-black text-white text-xs">{formatCurrency(repair.price)}</p>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => { setSelectedRepair(repair); setIsEditing(false); }}
                      className="text-primary text-[10px] font-black uppercase tracking-widest hover:underline"
                    >
                      Ver
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile Card Layout */}
      <div className="grid grid-cols-1 gap-3 md:hidden">
        {filteredRepairs.map((repair) => {
          const status = statusConfig[repair.status as keyof typeof statusConfig] || statusConfig.PENDING;
          return (
            <div key={repair.id} className="p-4 rounded-[2rem] bg-[#1c1c1e] border border-white/5 space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-bold text-white text-sm">{repair.deviceModel}</h4>
                  <p className="text-[8px] text-muted font-mono">{repair.id.slice(0, 8)}</p>
                </div>
                <span className={cn("inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[7px] font-black uppercase tracking-tight", status.color)}>
                  {status.label}
                </span>
              </div>
              <div className="flex justify-between items-end border-t border-white/5 pt-3">
                <div>
                  <p className="text-[7px] text-muted font-black uppercase">Cliente</p>
                  <p className="text-xs font-bold text-white/90">{repair.client?.firstName} {repair.client?.lastName}</p>
                </div>
                <div className="text-right">
                   <p className="font-black text-white text-sm">{formatCurrency(repair.price)}</p>
                   <button 
                      onClick={() => { setSelectedRepair(repair); setIsEditing(false); }}
                      className="text-primary text-[8px] font-black uppercase tracking-widest mt-0.5"
                    >
                      Gestionar
                    </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* MODAL: NUEVA REPARACIÓN */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-fade-in text-xs">
          <div className="w-full max-w-xl bg-[#1c1c1e] border border-white/10 p-6 rounded-[2.5rem] shadow-3xl overflow-y-auto max-h-[90vh]">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-black text-white italic tracking-tight">Nueva Orden</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-muted hover:text-white p-2 hover:bg-white/5 rounded-full transition-colors"><X className="w-4 h-4" /></button>
            </div>
            
            <form onSubmit={handleAddRepair} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[8px] font-black uppercase text-muted tracking-widest ml-1">Cliente</label>
                <select className="w-full p-4 rounded-xl bg-white text-black font-bold text-sm focus:outline-none" value={newRepair.clientId} onChange={(e) => setNewRepair({...newRepair, clientId: e.target.value})} required>
                  <option value="">Seleccionar...</option>
                  {initialClients.map(c => <option key={c.id} value={c.id} className="text-black">{c.firstName} {c.lastName}</option>)}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[8px] font-black uppercase text-muted tracking-widest ml-1">Modelo</label>
                  <select className="w-full p-4 rounded-xl bg-white text-black font-bold text-sm focus:outline-none" value={newRepair.deviceModel} onChange={(e) => setNewRepair({...newRepair, deviceModel: e.target.value})} required>
                    <option value="">Seleccionar...</option>
                    {iphoneModels.map(m => <option key={m} value={m} className="text-black">{m}</option>)}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[8px] font-black uppercase text-muted tracking-widest ml-1">Precio</label>
                  <input type="number" className="w-full p-4 rounded-xl bg-white/5 border border-white/10 text-white font-bold text-sm focus:border-primary/50 focus:outline-none transition-colors" placeholder="0.00" value={newRepair.price} onChange={(e) => setNewRepair({...newRepair, price: e.target.value})} required />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[8px] font-black uppercase text-muted tracking-widest ml-1">Problema</label>
                <textarea className="w-full p-4 rounded-xl bg-white/5 border border-white/10 text-white min-h-[80px] text-sm focus:border-primary/50" placeholder="Falla reportada..." value={newRepair.problem} onChange={(e) => setNewRepair({...newRepair, problem: e.target.value})} required />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[8px] font-black uppercase text-muted tracking-widest ml-1">IMEI</label>
                  <input className="w-full p-4 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-primary/50" placeholder="Opcional" value={newRepair.imei} onChange={(e) => setNewRepair({...newRepair, imei: e.target.value})} />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[8px] font-black uppercase text-muted tracking-widest ml-1">Código</label>
                  <input className="w-full p-4 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-primary/50" placeholder="Pin/Patrón" value={newRepair.password} onChange={(e) => setNewRepair({...newRepair, password: e.target.value})} />
                </div>
              </div>

              <button type="submit" className="w-full py-4 mt-2 rounded-xl bg-primary text-black font-black uppercase tracking-widest text-[9px] shadow-xl hover:scale-[1.01] active:scale-95 transition-all">Registrar Equipo</button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: GESTIONAR */}
      {selectedRepair && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-fade-in text-xs">
          <div className="w-full max-w-xl bg-[#1c1c1e] border border-white/10 p-6 md:p-8 rounded-[2.5rem] relative overflow-y-auto max-h-[90vh]">
            <button onClick={() => { setSelectedRepair(null); setIsEditing(false); }} className="absolute top-5 right-5 text-muted hover:text-white p-2 hover:bg-white/5 rounded-full"><X className="w-4 h-4" /></button>

            {!isEditing ? (
              <div className="space-y-6">
                <header>
                  <p className="text-[8px] font-black text-primary uppercase tracking-[0.2em] mb-1">Orden #</p>
                  <h3 className="text-xl md:text-2xl font-black text-white italic truncate">{selectedRepair.id}</h3>
                  <p className="text-sm text-white/60 font-medium mt-1 uppercase tracking-widest">{selectedRepair.deviceModel}</p>
                </header>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                    <p className="text-[7px] font-bold text-muted uppercase mb-1">Cliente</p>
                    <p className="text-xs font-bold text-white">{selectedRepair.client?.firstName} {selectedRepair.client?.lastName}</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                    <p className="text-[7px] font-bold text-muted uppercase mb-1">Presupuesto</p>
                    <p className="text-base font-black text-primary">{formatCurrency(selectedRepair.price)}</p>
                  </div>
                </div>

                <div className="space-y-4 pt-2">
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                      <p className="text-[7px] font-black text-muted uppercase mb-2">Detalles Técnicos</p>
                      <p className="text-[9px] text-white/80 leading-relaxed italic border-b border-white/5 pb-2 mb-2">&quot;{selectedRepair.problem}&quot;</p>
                      <div className="grid grid-cols-2 gap-2 text-[8px] font-black text-muted uppercase tracking-widest">
                         <div>IMEI: <span className="text-white">{selectedRepair.imei || "S/D"}</span></div>
                         <div>Pass: <span className="text-white">{selectedRepair.password || "S/D"}</span></div>
                      </div>
                  </div>
                </div>

                <div className="space-y-3 pt-2">
                  <p className="text-[8px] font-black text-muted uppercase tracking-widest ml-1">Actualizar Flujo</p>
                  <div className="flex flex-wrap gap-1.5">
                    {Object.entries(statusConfig).map(([key, config]) => (
                      <button 
                        key={key} 
                        onClick={() => handleStatusChange(selectedRepair.id, key)}
                        className={cn(
                          "px-3 py-2 rounded-lg text-[8px] font-black uppercase tracking-tighter border transition-all active:scale-95",
                          selectedRepair.status === key ? "bg-white text-black border-white shadow-md" : "border-white/5 text-muted hover:border-white/20"
                        )}
                      >
                        {config.label}
                      </button>
                    ))}
                  </div>
                </div>

                <button onClick={() => startEditing(selectedRepair)} className="w-full py-4 border border-primary/20 text-primary font-black uppercase tracking-widest text-[8px] hover:bg-primary/10 rounded-xl transition-all">Editar Información</button>
              </div>
            ) : (
              <form onSubmit={handleSaveEdit} className="space-y-5 animate-fade-in">
                <h3 className="text-lg font-black text-white italic">Editar Orden</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[8px] font-black text-muted uppercase ml-1">Modelo</label>
                    <select className="w-full p-4 rounded-xl bg-white text-black font-bold text-xs" value={editForm.deviceModel} onChange={e => setEditForm({...editForm, deviceModel: e.target.value})}>
                      {iphoneModels.map(m => <option key={m} value={m}>{m}</option>)}
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[8px] font-black text-muted uppercase ml-1">Presupuesto</label>
                    <input type="number" className="w-full p-4 rounded-xl bg-white/10 border border-white/10 text-white font-bold text-xs" value={editForm.price} onChange={e => setEditForm({...editForm, price: e.target.value})} />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[8px] font-black text-muted uppercase ml-1">Problema</label>
                  <textarea className="w-full p-4 rounded-xl bg-white/10 border border-white/10 text-white min-h-[60px] text-xs" value={editForm.problem} onChange={e => setEditForm({...editForm, problem: e.target.value})} />
                </div>
                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => setIsEditing(false)} className="flex-1 py-4 border border-white/5 rounded-xl font-black uppercase text-[8px] tracking-widest">Cancelar</button>
                  <button type="submit" className="flex-1 py-4 bg-white text-black rounded-xl font-black uppercase text-[8px] tracking-widest shadow-xl">Guardar</button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
