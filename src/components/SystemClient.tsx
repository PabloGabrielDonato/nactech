"use client";

import { useState, useCallback } from "react";
import { 
  Database, 
  Download, 
  Upload, 
  RefreshCw, 
  AlertTriangle, 
  CheckCircle2,
  X,
  FileSpreadsheet,
  Trash2
} from "lucide-react";
import { cn } from "@/lib/utils";
import * as XLSX from "xlsx";
import { useDropzone } from "react-dropzone";
import { exportDatabaseAction, resetDatabaseAction, importDatabaseAction } from "@/app/actions";

export default function SystemClient() {
  const [isExporting, setIsExporting] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error', msg: string } | null>(null);

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const data = await exportDatabaseAction();
      const wb = XLSX.utils.book_new();
      
      // Hoja de Clientes
      const wsClients = XLSX.utils.json_to_sheet(data.clients.map((c: any) => {
        const { repairs, ...rest } = c;
        return rest;
      }));
      XLSX.utils.book_append_sheet(wb, wsClients, "Clientes");
      
      // Hoja de Productos
      const wsProducts = XLSX.utils.json_to_sheet(data.products);
      XLSX.utils.book_append_sheet(wb, wsProducts, "Inventario");
      
      // Hoja de Transacciones
      const wsTx = XLSX.utils.json_to_sheet(data.transactions);
      XLSX.utils.book_append_sheet(wb, wsTx, "Finanzas");

      XLSX.writeFile(wb, `nactech_backup_${new Date().toISOString().split('T')[0]}.xlsx`);
      setStatus({ type: 'success', msg: 'Base de datos exportada en Excel.' });
    } catch (e) {
      setStatus({ type: 'error', msg: 'Error al exportar.' });
    }
    setIsExporting(false);
  };

  const handleReset = async () => {
    if (!confirm("⚠️ ¿ESTÁS SEGURO? Esta acción borrará TODA la información del sistema de forma permanente.")) return;
    setIsResetting(true);
    try {
      await resetDatabaseAction();
      setStatus({ type: 'success', msg: 'Base de datos restablecida correctamente.' });
    } catch (e) {
      setStatus({ type: 'error', msg: 'Error al restablecer.' });
    }
    setIsResetting(false);
  };

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setIsImporting(true);
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const arrayBuffer = e.target?.result as ArrayBuffer;
        const data = new Uint8Array(arrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        
        const clients = XLSX.utils.sheet_to_json(workbook.Sheets["Clientes"] || []);
        const products = XLSX.utils.sheet_to_json(workbook.Sheets["Inventario"] || []);
        const transactions = XLSX.utils.sheet_to_json(workbook.Sheets["Finanzas"] || []);

        await importDatabaseAction({ 
          clients: clients as any[], 
          products: products as any[], 
          transactions: transactions as any[] 
        });
        setStatus({ type: 'success', msg: 'Datos importados con éxito.' });
      } catch (err) {
        setStatus({ type: 'error', msg: 'Archivo inválido o error en importación.' });
      }
      setIsImporting(false);
    };
    reader.readAsArrayBuffer(file);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop, 
    accept: { 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'] },
    multiple: false
  });

  return (
    <div className="space-y-8 pb-20 max-w-4xl mx-auto">
      <header className="animate-fade-in">
        <div className="flex items-center gap-2 mb-2">
          <Database className="w-4 h-4 text-primary" />
          <h2 className="text-[9px] font-black uppercase tracking-[0.4em] text-muted">Core del Sistema</h2>
        </div>
        <h1 className="text-3xl md:text-5xl font-black text-white tracking-tighter italic">Gestión de Datos</h1>
        <p className="text-muted mt-2 text-xs md:text-sm font-medium">Respaldos, importaciones y mantenimiento de la base de datos central.</p>
      </header>

      {status && (
        <div className={cn(
          "p-4 rounded-2xl flex items-center justify-between animate-fade-in",
          status.type === 'success' ? "bg-green-500/10 border border-green-500/20 text-green-500" : "bg-red-500/10 border border-red-500/20 text-red-500"
        )}>
          <div className="flex items-center gap-3">
            {status.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
            <p className="text-[11px] font-bold uppercase tracking-wider">{status.msg}</p>
          </div>
          <button onClick={() => setStatus(null)}><X className="w-4 h-4" /></button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
        <section className="p-8 rounded-[2.5rem] bg-[#1c1c1e] border border-white/5 shadow-2xl space-y-6">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
            <Download className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-black text-white italic">Copia de Seguridad</h3>
            <p className="text-[10px] text-muted font-bold uppercase tracking-widest mt-1">Exportar a formato Excel (.xlsx)</p>
          </div>
          <p className="text-[11px] text-white/50 leading-relaxed font-medium">
            Descarga un archivo compatible con Excel conteniendo todos tus clientes, reparaciones, productos y finanzas.
          </p>
          <button 
            onClick={handleExport}
            disabled={isExporting}
            className="w-full py-4 bg-white text-black rounded-2xl font-black uppercase tracking-[0.2em] text-[9px] hover:bg-primary transition-all active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isExporting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <FileSpreadsheet className="w-4 h-4" />}
            Descargar Backup
          </button>
        </section>

        <section className="p-8 rounded-[2.5rem] bg-[#1c1c1e] border border-red-500/10 shadow-2xl space-y-6">
          <div className="w-12 h-12 rounded-2xl bg-red-500/10 flex items-center justify-center text-red-500">
            <Trash2 className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-black text-white italic">Restablecimiento</h3>
            <p className="text-[10px] text-red-500/50 font-bold uppercase tracking-widest mt-1">Zona Crítica</p>
          </div>
          <p className="text-[11px] text-white/50 leading-relaxed font-medium">
            Borra toda la información y deja el sistema en blanco. Se recomienda exportar primero.
          </p>
          <button 
            onClick={handleReset}
            disabled={isResetting}
            className="w-full py-4 border border-red-500/20 text-red-500 rounded-2xl font-black uppercase tracking-[0.2em] text-[9px] hover:bg-red-500 hover:text-white transition-all active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isResetting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <AlertTriangle className="w-4 h-4" />}
            Limpiar Base de Datos
          </button>
        </section>

        <section className="md:col-span-2 p-8 rounded-[2.5rem] bg-[#0a0a0a] border border-white/5 shadow-2xl space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
               <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-500">
                <Upload className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-black text-white italic">Migración / Importación</h3>
                <p className="text-[10px] text-muted font-bold uppercase tracking-widest mt-1">Cargar archivo Excel</p>
              </div>
            </div>
          </div>

          <div 
            {...getRootProps()} 
            className={cn(
              "border-2 border-dashed rounded-[2rem] p-12 flex flex-col items-center justify-center transition-all cursor-pointer",
              isDragActive ? "border-primary bg-primary/5" : "border-white/5 hover:border-white/20 bg-white/[0.02]",
              isImporting && "opacity-50 pointer-events-none"
            )}
          >
            <input {...getInputProps()} />
            <FileSpreadsheet className={cn("w-12 h-12 mb-4", isDragActive ? "text-primary" : "text-muted")} />
            <p className="text-xs font-black text-white uppercase tracking-widest text-center">
              {isImporting ? "Procesando Datos..." : isDragActive ? "Suelta el archivo aquí" : "Arrastra tu archivo Excel de backup"}
            </p>
            <p className="text-[9px] text-muted font-bold uppercase mt-2 tracking-tighter">Solo archivos .xlsx generados por nactech</p>
          </div>
        </section>
      </div>
    </div>
  );
}
