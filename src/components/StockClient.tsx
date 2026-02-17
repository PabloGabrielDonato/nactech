"use client";

import { useState } from "react";
import { 
  Package, 
  Search, 
  Plus, 
  X,
  Minus,
  ShoppingCart,
  User,
  CheckCircle2,
  ChevronRight
} from "lucide-react";
import { cn, formatCurrency } from "@/lib/utils";
import { updateProductStock, createProduct, sellProductAction } from "@/app/actions";

const categories = ["Todos", "Fundas", "Cargadores", "Protectores", "Repuestos", "Equipos"];

export function StockClient({ initialProducts, initialClients }: { initialProducts: any[], initialClients: any[] }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSellModalOpen, setIsSellModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [sellData, setSellData] = useState({ quantity: 1, clientId: "" });
  
  const [newProduct, setNewProduct] = useState({
    name: "",
    category: "Fundas",
    price: "",
    stock: "0"
  });

  const filtered = initialProducts.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "Todos" || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleUpdate = async (id: string, delta: number) => {
    await updateProductStock(id, delta);
    window.location.reload();
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    await createProduct({
      ...newProduct,
      price: Number(newProduct.price),
      stock: Number(newProduct.stock)
    });
    setIsModalOpen(false);
    window.location.reload();
  };

  const handleSell = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct || !sellData.clientId) return;
    try {
      await sellProductAction({
        productId: selectedProduct.id,
        quantity: Number(sellData.quantity),
        clientId: sellData.clientId
      });
      setIsSellModalOpen(false);
      window.location.reload();
    } catch (error: any) {
      alert(error.message);
    }
  };

  return (
    <div className="space-y-6 pb-20">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight italic">Inventario</h2>
          <p className="text-[9px] text-muted mt-1 uppercase tracking-widest font-black">iPhone Lab Accessories</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center gap-2 px-5 py-3 bg-primary text-black rounded-xl font-bold uppercase tracking-widest text-[9px] hover:scale-105 transition-transform active:scale-95 shadow-lg shadow-primary/10 whitespace-nowrap"
        >
          <Plus className="w-4 h-4" /> Nuevo Artículo
        </button>
      </header>

      <div className="flex flex-col lg:flex-row gap-3 items-stretch lg:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
          <input 
            type="text" 
            placeholder="Buscar..." 
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#1c1c1e] border border-white/5 text-[12px] text-white focus:border-primary/50 transition-colors focus:outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-1 p-1 rounded-xl bg-[#1c1c1e] border border-white/5 overflow-x-auto no-scrollbar">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={cn(
                "px-3 py-1.5 rounded-lg text-[8px] font-black uppercase tracking-wider transition-all whitespace-nowrap",
                selectedCategory === cat ? "bg-white text-black shadow-md" : "text-muted hover:text-white"
              )}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-2.5 md:gap-3">
        {filtered.map((p) => (
          <div key={p.id} className="group relative p-3.5 md:p-4 rounded-[1.8rem] bg-[#1c1c1e]/50 border border-white/5 hover:border-white/10 transition-all flex flex-col justify-between shadow-xl backdrop-blur-sm">
            <div>
              <div className="flex justify-between items-start mb-3">
                <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/5 flex items-center justify-center group-hover:bg-primary/20 group-hover:text-primary transition-colors">
                  <Package className="w-4 h-4" />
                </div>
                <div className={cn(
                  "px-1.5 py-0.5 rounded-full text-[6px] font-black uppercase tracking-widest",
                  p.stock > 10 ? "bg-green-500/10 text-green-500" : 
                  p.stock > 0 ? "bg-yellow-500/10 text-yellow-500" : 
                  "bg-red-500/10 text-red-500"
                )}>
                  {p.stock > 10 ? "OK" : p.stock > 0 ? "B" : "S/S"}
                </div>
              </div>
              <h3 className="text-[11px] font-bold text-white mb-0.5 line-clamp-1 group-hover:text-primary transition-colors">{p.name}</h3>
              <p className="text-[7px] text-white/30 font-black uppercase tracking-widest">{p.category}</p>
            </div>

            <div className="mt-4 flex flex-col gap-2">
               <div className="flex items-center justify-between">
                 <p className="text-[10px] font-black text-white">{formatCurrency(p.price)}</p>
                 <button 
                  onClick={() => { setSelectedProduct(p); setIsSellModalOpen(true); }}
                  className="p-1.5 rounded-lg bg-primary/10 text-primary hover:bg-primary hover:text-black transition-all"
                  title="Vender"
                 >
                   <ShoppingCart className="w-3 h-3" />
                 </button>
               </div>
               
               <div className="flex items-center justify-between bg-black/40 px-2 py-0.5 rounded-lg border border-white/5">
                <button 
                  onClick={() => handleUpdate(p.id, -1)} 
                  className="p-1 text-muted hover:text-red-500 transition-colors active:scale-75"
                >
                  <Minus className="w-3 h-3" />
                </button>
                <span className="font-black text-white text-[9px] min-w-[14px] text-center">{p.stock}</span>
                <button 
                  onClick={() => handleUpdate(p.id, 1)} 
                  className="p-1 text-muted hover:text-green-500 transition-colors active:scale-75"
                >
                  <Plus className="w-3 h-3" />
                </button>
               </div>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL: VENDER PRODUCTO */}
      {isSellModalOpen && selectedProduct && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/90 backdrop-blur-2xl animate-fade-in">
          <div className="w-full max-w-sm bg-[#1c1c1e] border border-white/10 p-6 rounded-[2.5rem] shadow-3xl">
            <h3 className="text-xl font-black text-white italic mb-1">Venta de Producto</h3>
            <p className="text-[10px] text-primary font-black uppercase tracking-widest mb-6">{selectedProduct.name}</p>

            <form onSubmit={handleSell} className="space-y-5">
              <div className="space-y-1.5">
                <label className="text-[8px] font-black text-muted uppercase tracking-widest ml-1">Cliente</label>
                <select 
                  required 
                  className="w-full p-4 rounded-xl bg-white text-black font-bold text-xs focus:outline-none"
                  value={sellData.clientId}
                  onChange={e => setSellData({...sellData, clientId: e.target.value})}
                >
                  <option value="">Seleccionar Cliente...</option>
                  {initialClients.map(c => (
                    <option key={c.id} value={c.id}>{c.firstName} {c.lastName}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[8px] font-black text-muted uppercase tracking-widest ml-1">Cantidad</label>
                  <input 
                    type="number" 
                    min="1" 
                    max={selectedProduct.stock}
                    required 
                    className="w-full p-4 rounded-xl bg-white/5 border border-white/10 text-white font-black text-sm"
                    value={sellData.quantity}
                    onChange={e => setSellData({...sellData, quantity: Number(e.target.value)})}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[8px] font-black text-muted uppercase tracking-widest ml-1">Total</label>
                  <div className="w-full p-4 rounded-xl bg-primary/20 border border-primary/20 text-primary font-black text-sm">
                    {formatCurrency(selectedProduct.price * sellData.quantity)}
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button 
                  type="button" 
                  onClick={() => setIsSellModalOpen(false)}
                  className="flex-1 py-4 border border-white/5 rounded-xl font-black uppercase text-[9px] tracking-widest text-muted"
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  className="flex-1 py-4 bg-primary text-black rounded-xl font-black uppercase text-[9px] tracking-widest shadow-xl shadow-primary/20 active:scale-95 transition-all"
                >
                  Confirmar Venta
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: NUEVO PRODUCTO */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-fade-in text-xs">
          <div className="w-full max-w-sm bg-[#1c1c1e] border border-white/10 p-6 rounded-[2.5rem] shadow-3xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-black text-white italic tracking-tight">Nuevo Artículo</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-muted hover:text-white transition-colors p-2 hover:bg-white/5 rounded-full"><X className="w-4 h-4" /></button>
            </div>
            
            <form onSubmit={handleAddProduct} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[8px] font-black text-muted uppercase tracking-widest ml-1">Nombre</label>
                <input required className="w-full p-4 rounded-xl bg-white/5 border border-white/10 text-white font-bold text-xs" placeholder="Ej: Pantalla i13" value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})} />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-[8px] font-black text-muted uppercase tracking-widest ml-1">Categoría</label>
                  <select className="w-full p-3 rounded-xl bg-white text-black font-bold text-[10px]" value={newProduct.category} onChange={e => setNewProduct({...newProduct, category: e.target.value})}>
                    {categories.filter(c => c !== "Todos").map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[8px] font-black text-muted uppercase tracking-widest ml-1">Stock</label>
                  <input type="number" required className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white text-xs" value={newProduct.stock} onChange={e => setNewProduct({...newProduct, stock: e.target.value})} />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[8px] font-black text-muted uppercase tracking-widest ml-1">Precio</label>
                <input type="number" required className="w-full p-4 rounded-xl bg-primary text-black font-black text-base" placeholder="0.00" value={newProduct.price} onChange={e => setNewProduct({...newProduct, price: e.target.value})} />
              </div>

              <button type="submit" className="w-full py-4 mt-2 bg-white text-black rounded-xl font-black uppercase tracking-widest text-[9px] shadow-xl hover:scale-[1.01] active:scale-95 transition-all">Guardar</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
