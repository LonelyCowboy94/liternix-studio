"use client";

import { createUser } from "@/lib/actions";
import { useState } from "react";
import {
  UserPlus,
  Loader2,
  AlertCircle,
  X,
  CheckCircle2,
  ChevronDown,
  Terminal
} from "lucide-react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Button3D from "../ui/Button3D";

export function CreateUserForm() {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  async function action(formData: FormData) {
    setLoading(true);
    setError("");
    setSuccess(false);

    const res = await createUser(formData);

    if (res?.error) {
      setError(res.error);
      setLoading(false);
    } else {
      setSuccess(true);
      setTimeout(() => {
        setIsOpen(false);
        setSuccess(false);
      }, 2000);
      router.refresh();
      const form = document.getElementById(
        "create-user-form",
      ) as HTMLFormElement;
      if (form) form.reset();
      setLoading(false);
    }
  }

  return (
    <>
      <Button3D
        onClick={() => setIsOpen(true)}
        className="group flex items-center justify-center gap-2.5 px-4 py-2 transition-all"
      >
        <UserPlus
          size={18}
          className="text-slate-400 group-hover:text-white transition-colors"
        />
        <span className="block text-sm">Add New User</span>
      </Button3D>

      {/* MODAL SYSTEM */}
      <AnimatePresence>
  {isOpen && (
    <div className="absolute inset-0 z-110 flex items-center justify-center p-4">
      
      {/* MODAL BOX */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="bg-zinc-900 rounded-xl p-8 md:p-12 w-full max-w-2xl shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-zinc-800 relative overflow-hidden z-10"
      >
        {/* Subtle Glow Effect */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#afff00]/10 rounded-full blur-3xl pointer-events-none" />

        {/* HEADER */}
        <div className="flex justify-between items-start mb-10 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2 text-[#afff00] font-black text-[10px] uppercase tracking-[0.4em]">
              <Terminal size={14} /> System_Initialization
            </div>
            <h2 className="text-xl md:text-3xl font-black italic uppercase text-white tracking-tighter leading-none">
              Create_Operator<span className="text-[#afff00]">.</span>
            </h2>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 hover:bg-zinc-800 rounded-full text-zinc-500 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* FORM */}
        <form action={action} className="space-y-8 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Full Name - Notched */}
            <div className="relative group">
              <input 
                name="name" 
                placeholder=" "
                className="peer w-full bg-transparent border border-zinc-800 rounded-2xl px-5 py-4 text-white font-bold uppercase italic tracking-widest text-sm outline-none focus:border-[#afff00] transition-all" 
                required 
              />
              <label className="absolute left-4 -top-2.5 px-2 bg-zinc-900 text-[10px] font-black uppercase tracking-widest text-zinc-600 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-xs peer-focus:-top-2.5 peer-focus:text-[#afff00] pointer-events-none">
                Operator_Name
              </label>
            </div>

            {/* Email - Notched */}
            <div className="relative group">
              <input 
                name="email" 
                type="email"
                placeholder=" "
                className="peer w-full bg-transparent border border-zinc-800 rounded-2xl px-5 py-4 text-white font-bold uppercase italic tracking-widest text-sm outline-none focus:border-[#afff00] transition-all" 
                required 
              />
              <label className="absolute left-4 -top-2.5 px-2 bg-zinc-900 text-[10px] font-black uppercase tracking-widest text-zinc-600 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-xs peer-focus:-top-2.5 peer-focus:text-[#afff00] pointer-events-none">
                Signal_Address
              </label>
            </div>

            {/* Password - Notched */}
            <div className="relative group">
              <input 
                name="password" 
                type="password"
                placeholder=" "
                className="peer w-full bg-transparent border border-zinc-800 rounded-2xl px-5 py-4 text-white font-bold outline-none focus:border-[#afff00] transition-all" 
                required 
              />
              <label className="absolute left-4 -top-2.5 px-2 bg-zinc-900 text-[10px] font-black uppercase tracking-widest text-zinc-600 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-xs peer-focus:-top-2.5 peer-focus:text-[#afff00] pointer-events-none">
                Access_Key
              </label>
            </div>

            {/* Confirm Password - Notched */}
            <div className="relative group">
              <input 
                name="confirmPassword" 
                type="password"
                placeholder=" "
                className="peer w-full bg-transparent border border-zinc-800 rounded-2xl px-5 py-4 text-white font-bold outline-none focus:border-[#afff00] transition-all" 
                required 
              />
              <label className="absolute left-4 -top-2.5 px-2 bg-zinc-900 text-[10px] font-black uppercase tracking-widest text-zinc-600 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-xs peer-focus:-top-2.5 peer-focus:text-[#afff00] pointer-events-none">
                Verify_Key
              </label>
            </div>
          </div>

          {/* Role Select - Notched */}
          <div className="relative group max-w-xs">
            <select 
              name="role" 
              className="peer w-full bg-transparent border border-zinc-800 rounded-2xl px-5 py-4 text-white font-black uppercase italic tracking-widest text-xs outline-none focus:border-[#afff00] appearance-none cursor-pointer"
            >
              <option value="USER" className="bg-zinc-900 text-white">Standard_Operator</option>
              <option value="ADMIN" className="bg-zinc-900 text-[#afff00]">System_Admin</option>
            </select>
            <label className="absolute left-4 -top-2.5 px-2 bg-zinc-900 text-[10px] font-black uppercase tracking-widest text-zinc-600 transition-all peer-focus:text-[#afff00] pointer-events-none">
              Clearance_Level
            </label>
            <ChevronDown size={18} className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-600" />
          </div>

          {/* Error Message */}
          <AnimatePresence mode="wait">
            {error && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-3 text-red-500 bg-red-500/5 p-4 rounded-xl text-[10px] font-black uppercase tracking-widest border border-red-500/20"
              >
                <AlertCircle size={16} className="shrink-0" /> {error}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-zinc-800">
            <Button3D
              type="button"
              onClick={() => setIsOpen(false)}
              className="flex-1 flex justify-center px-8 py-4 uppercase italic tracking-widest text-[11px]"
            >
              Abort_initialization
            </Button3D>
            <Button3D
              primary
              type="submit"
              disabled={loading}
              className="flex-1 px-8 py-4 rounded-2xl uppercase italic tracking-widest text-[11px] flex items-center justify-center gap-2"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={18} />
              ) : success ? (
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={18} /> Protocol_Executed!
                </div>
              ) : (
                "Deploy_Operator"
              )}
            </Button3D>
          </div>
        </form>
      </motion.div>
    </div>
  )}
</AnimatePresence>
    </>
  );
}
