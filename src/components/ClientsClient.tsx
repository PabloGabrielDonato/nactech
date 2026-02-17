"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { 
  Plus, 
  Search, 
  User, 
  Phone, 
  IdCard, 
  X, 
  Wrench, 
  Package,
  History,
  TrendingUp,
  ChevronRight,
  UserPlus,
  Edit2,
  Save,
  ExternalLink
} from "lucide-react";
import { cn, formatCurrency } from "@/lib/utils";
import { createClient, updateClient } from "@/app/actions";

export function ClientsClient({ initialClients }: { initialClients: any[] }) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [newClient, setNewClient] = useState({ firstName: "", lastName: "", dni: "", phone: "" });
  const [editForm, setEditForm] = useState<any>(null);

  const filteredClients = initialClients.filter(c => 
    c.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.dni.includes(searchTerm)
  );

  const handleAddClient = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClient.firstName || !newClient.lastName || !newClient.dni) return;
    
    await createClient(newClient);
    setNewClient({ firstName: "", lastName: "", dni: "", phone: "" });
    setIsModalOpen(false);
    window.location.reload();
  };

  const startEditing = (client: any) => {
    setEditForm({ ...client });
    setIsEditing(true);
  };

  const handleUpdateClient = async (e: React.FormEvent) => {
    e.preventDefault();
    const { id, repairs, createdAt, updatedAt, ...updatableData } = editForm;
    await updateClient(id, updatableData);
    setIsEditing(false);
    setSelectedClient(null);
    window.location.reload();
  };

  const navigateToRepair = (repairId: string) => {
    // Almacenamos el ID en localStorage para que la página de reparaciones sepa cuál abrir
    localStorage.setItem('autoOpenRepair', repairId);
    router.push('/repairs');
  };

  return (
    <div className="space-y-8 pb-20">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight italic">Clientes</h2>
          <p className="text-[9px] md:text-[10px] text-muted mt-1 uppercase tracking-widest font-black">Directorio y Expedientes Lab</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center gap-2 px-5 py-3 bg-primary text-black rounded-xl font-bold uppercase tracking-widest text-[9px] hover:scale-105 transition-transform active:scale-95 shadow-lg shadow-primary/10 whitespace-nowrap"
        >
          <UserPlus className="w-4 h-4" /> Nuevo Cliente
        </button>
      </header>

      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
        <input 
          type="text" 
          placeholder="Buscar cliente..." 
          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#1c1c1e] border border-white/5 text-sm text-white focus:border-primary/50 transition-colors focus:outline-none placeholder:text-muted/50 placeholder:text-[11px]"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4">
        {filteredClients.map((client) => {
          const totalSpent = client.repairs?.reduce((acc: number, r: any) => acc + r.price, 0) || 0;
          return (
            <div key={client.id} className="group relative p-5 rounded-[2rem] bg-[#1c1c1e]/50 border border-white/5 hover:border-white/10 transition-all flex flex-col justify-between shadow-xl backdrop-blur-sm">
              <div>
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center text-primary font-black text-lg md:text-xl uppercase group-hover:bg-primary group-hover:text-black transition-colors shrink-0">
                    {client.firstName[0]}{client.lastName[0]}
                  </div>
                  <div className="overflow-hidden min-w-0">
                    <h3 className="font-bold text-sm md:text-base text-white truncate">{client.firstName} {client.lastName}</h3>
                    <p className="text-[8px] text-muted font-black uppercase tracking-widest">DNI: {client.dni}</p>
                  </div>
                </div>

                <div className="space-y-2 mb-6">
                  <div className="flex items-center gap-2 text-[10px] text-white/40">
                    <Phone className="w-3.5 h-3.5 text-primary/50" /> <span className="truncate">{client.phone}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3 pt-4 border-t border-white/5">
                <div className="flex justify-between items-center text-[8px] font-black uppercase tracking-widest text-muted">
                  <span>Total Operado</span>
                  <span className="text-white text-[11px] font-black">{formatCurrency(totalSpent)}</span>
                </div>
                <button 
                  onClick={() => { setSelectedClient(client); setIsEditing(false); }}
                  className="w-full py-3 rounded-xl bg-white/5 border border-white/5 font-black uppercase tracking-widest text-[8px] text-white hover:bg-white hover:text-black transition-all flex items-center justify-center gap-2"
                >
                  Ver Ficha <ChevronRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* MODAL: FICHA / EDITAR CLIENTE */}
      {selectedClient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-fade-in text-xs">
          <div className="w-full max-w-lg bg-[#1c1c1e] border border-white/10 p-6 md:p-8 rounded-[2.5rem] shadow-3xl max-h-[90vh] overflow-y-auto relative">
             <button 
                onClick={() => { setSelectedClient(null); setIsEditing(false); }} 
                className="absolute top-5 right-5 p-2 rounded-full hover:bg-white/5 text-muted transition-colors"
                type="button"
              >
                <X className="w-4 h-4" />
             </button>

             {!isEditing ? (
               <div className="space-y-6">
                  <header>
                    <p className="text-[8px] font-black text-primary uppercase tracking-[0.2em] mb-1">Expediente Cliente</p>
                    <h3 className="text-xl md:text-2xl font-black text-white italic">{selectedClient.firstName} {selectedClient.lastName}</h3>
                  </header>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                      <p className="text-[7px] font-bold text-muted uppercase mb-1">DNI / ID</p>
                      <p className="text-xs font-bold text-white">{selectedClient.dni}</p>
                    </div>
                    <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                      <p className="text-[7px] font-bold text-muted uppercase mb-1">Teléfono</p>
                      <p className="text-xs font-bold text-white">{selectedClient.phone}</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-2 mb-1">
                      <History className="w-3.5 h-3.5 text-primary" />
                      <h4 className="text-[8px] font-black uppercase text-white/40 tracking-widest">Últimas Reparaciones</h4>
                    </div>
                    
                    <div className="space-y-2">
                      {selectedClient.repairs?.length > 0 ? (
                        selectedClient.repairs.slice(0, 5).map((repair: any) => (
                          <button 
                            key={repair.id} 
                            onClick={() => navigateToRepair(repair.id)}
                            className="w-full p-3 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between text-[10px] group/item hover:bg-white/10 hover:border-primary/20 transition-all text-left"
                          >
                            <div className="flex items-center gap-3">
                              <Wrench className="w-3 h-3 text-primary/60 group-hover/item:text-primary transition-colors" />
                              <div>
                                <p className="font-bold text-white group-hover/item:text-primary transition-colors">{repair.deviceModel}</p>
                                <p className="text-[7px] text-muted uppercase tracking-tighter italic">{new Date(repair.createdAt).toLocaleDateString()}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className="font-black text-white">{formatCurrency(repair.price)}</span>
                              <ExternalLink className="w-3 h-3 text-white/20 group-hover/item:text-white/60" />
                            </div>
                          </button>
                        ))
                      ) : (
                        <p className="text-[9px] text-muted italic ml-1">Sin historial registrado.</p>
                      )}
                    </div>
                  </div>

                  <div className="pt-4 mt-6 border-t border-white/5">
                    <button 
                      onClick={() => startEditing(selectedClient)}
                      className="w-full py-4 bg-white text-black rounded-2xl font-black uppercase tracking-widest text-[9px] flex items-center justify-center gap-2 hover:bg-primary transition-all active:scale-95 shadow-xl"
                    >
                      <Edit2 className="w-3.5 h-3.5" /> Editar Datos Personales
                    </button>
                  </div>
               </div>
             ) : (
               <form onSubmit={handleUpdateClient} className="space-y-5 animate-fade-in">
                  <h3 className="text-lg font-black text-white italic">Editar Cliente</h3>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[8px] font-black text-muted uppercase ml-1">Nombre</label>
                      <input required className="w-full p-4 rounded-xl bg-white/5 border border-white/10 text-white font-bold text-xs" value={editForm.firstName} onChange={e => setEditForm({...editForm, firstName: e.target.value})} />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[8px] font-black text-muted uppercase ml-1">Apellido</label>
                      <input required className="w-full p-4 rounded-xl bg-white/5 border border-white/10 text-white font-bold text-xs" value={editForm.lastName} onChange={e => setEditForm({...editForm, lastName: e.target.value})} />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[8px] font-black text-muted uppercase ml-1">DNI</label>
                    <input required className="w-full p-4 rounded-xl bg-white/5 border border-white/10 text-white font-bold text-xs" value={editForm.dni} onChange={e => setEditForm({...editForm, dni: e.target.value})} />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[8px] font-black text-muted uppercase ml-1">Teléfono</label>
                    <input required className="w-full p-4 rounded-xl bg-white/5 border border-white/10 text-white font-bold text-xs" value={editForm.phone} onChange={e => setEditForm({...editForm, phone: e.target.value})} />
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button type="button" onClick={() => setIsEditing(false)} className="flex-1 py-4 border border-white/5 rounded-xl font-black uppercase text-[8px] tracking-widest">Cancelar</button>
                    <button type="submit" className="flex-1 py-4 bg-white text-black rounded-xl font-black uppercase text-[8px] tracking-widest shadow-xl flex items-center justify-center gap-2">
                      <Save className="w-3.5 h-3.5" /> Guardar
                    </button>
                  </div>
               </form>
             )}
          </div>
        </div>
      )}

      {/* MODAL: NUEV CLIENTE */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-fade-in text-xs">
          <div className="w-full max-sm bg-[#1c1c1e] border border-white/10 p-6 rounded-[2.5rem] shadow-3xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-black text-white italic tracking-tight">Nuevo Cliente</h3>
              <button 
                onClick={() => setIsModalOpen(false)} 
                className="text-muted hover:text-white p-2 hover:bg-white/5 rounded-full"
                type="button"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <form onSubmit={handleAddClient} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-[8px] font-black text-muted uppercase tracking-widest ml-1">Nombre</label>
                  <input required className="w-full p-4 rounded-xl bg-white/5 border border-white/10 text-white font-bold text-xs" placeholder="Juan" value={newClient.firstName} onChange={(e) => setNewClient({...newClient, firstName: e.target.value})} />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[8px] font-black text-muted uppercase tracking-widest ml-1">Apellido</label>
                  <input required className="w-full p-4 rounded-xl bg-white/5 border border-white/10 text-white font-bold text-xs" placeholder="Pérez" value={newClient.lastName} onChange={(e) => setNewClient({...newClient, lastName: e.target.value})} />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-[8px] font-black text-muted uppercase tracking-widest ml-1">DNI</label>
                <input required className="w-full p-4 rounded-xl bg-white/5 border border-white/10 text-white font-bold text-xs" placeholder="Sin puntos" value={newClient.dni} onChange={(e) => setNewClient({...newClient, dni: e.target.value})} />
              </div>
              <div className="space-y-1.5">
                <label className="text-[8px] font-black text-muted uppercase tracking-widest ml-1">Teléfono</label>
                <input required className="w-full p-4 rounded-xl bg-white/5 border border-white/10 text-white font-bold text-xs" placeholder="WhatsApp" value={newClient.phone} onChange={(e) => setNewClient({...newClient, phone: e.target.value})} />
              </div>
              
              <button 
                type="submit" 
                className="w-full py-4 mt-2 rounded-xl bg-primary text-black font-black uppercase tracking-widest text-[9px] shadow-xl hover:scale-[1.01] active:scale-95 transition-all"
              >
                Registrar Cliente
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
