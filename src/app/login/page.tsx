"use client";

import { useFormState, useFormStatus } from "react-dom";
import { authenticate } from "./actions";
import { Zap, Lock, Mail, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";

export default function LoginPage() {
  const [errorMessage, dispatch] = useFormState(authenticate, undefined);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#050505] p-6 relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-0 -left-20 w-80 h-80 bg-primary/10 blur-[120px] rounded-full" />
      <div className="absolute bottom-0 -right-20 w-80 h-80 bg-blue-500/10 blur-[120px] rounded-full" />

      <div className="w-full max-w-md animate-fade-in relative z-10">
        <div className="text-center mb-10">
          <div className="inline-flex w-16 h-16 bg-primary rounded-[1.5rem] items-center justify-center shadow-[0_0_40px_rgba(0,255,136,0.2)] mb-6">
            <Zap className="text-black w-8 h-8 fill-current" />
          </div>
          <h1 className="text-4xl font-black text-white tracking-tighter italic">nactech</h1>
          <p className="text-[10px] font-black text-primary uppercase tracking-[0.4em] mt-1">iPhone Lab Control</p>
        </div>

        <form action={dispatch} className="space-y-4 p-8 rounded-[2.5rem] bg-[#0a0a0a] border border-white/5 shadow-3xl">
          <div className="space-y-1.5">
            <label className="text-[9px] font-black text-muted uppercase tracking-widest ml-1">Email Acceso</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
              <input 
                name="email"
                type="email" 
                required 
                placeholder="nacho@gmail.com"
                className="w-full pl-12 pr-4 py-4 rounded-xl bg-white/5 border border-white/5 text-white font-bold text-sm focus:border-primary/50 focus:outline-none transition-all" 
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[9px] font-black text-muted uppercase tracking-widest ml-1">Contraseña</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
              <input 
                name="password"
                type="password" 
                required 
                placeholder="••••••••"
                className="w-full pl-12 pr-4 py-4 rounded-xl bg-white/5 border border-white/5 text-white font-bold text-sm focus:border-primary/50 focus:outline-none transition-all" 
              />
            </div>
          </div>

          {errorMessage && (
            <p className="text-red-500 text-[10px] font-black uppercase tracking-wider text-center mt-2 animate-shake">
              {errorMessage}
            </p>
          )}

          <LoginButton />
        </form>

        <p className="text-center mt-8 text-[9px] text-muted font-black uppercase tracking-widest opacity-30">
          © 2026 nactech systems corp.
        </p>
      </div>
    </div>
  );
}

function LoginButton() {
  const { pending } = useFormStatus();

  return (
    <button 
      aria-disabled={pending}
      type="submit"
      className="w-full py-4 mt-4 bg-white text-black rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] hover:bg-primary transition-all active:scale-95 shadow-xl flex items-center justify-center gap-2"
    >
      {pending ? <RefreshCw className="w-5 h-5 animate-spin" /> : "Iniciar Sesión"}
    </button>
  );
}
