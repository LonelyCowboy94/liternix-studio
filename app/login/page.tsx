"use client";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation"; // Uvezi router
import { Terminal, Lock, Mail, Loader2, ChevronRight, Eye, EyeOff, ShieldAlert } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function LoginPage() {
  const router = useRouter(); // Inicijalizuj router
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email");
    const password = formData.get("password");

    // Dodajemo redirect: false da bismo sami hendlovali grešku
    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
      callbackUrl: "/admin", // Eksplicitno reci gde ideš
    });

    if (res?.error) {
      // U produkciji res.error može biti generički "CredentialsSignin"
      setError("ACCESS_DENIED: SYSTEM_REJECTED_CREDENTIALS");
      setLoading(false);
    } else if (res?.ok) {
      // Prvo osveži sesiju pa prebaci na admin
      router.push("/admin");
      router.refresh(); 
    }
  }

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center bg-black overflow-hidden font-sans">
      
      {/* BACKGROUND ELEMENTS */}
      <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px]" />
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,rgba(175,255,0,0.05)_0%,transparent_70%)]" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative z-10 w-full max-w-md p-6"
      >
        {/* SYSTEM HEADER */}
        <div className="flex flex-col items-center mb-12">
          <div className="w-16 h-16 bg-[#afff00] rounded-2xl flex items-center justify-center shadow-[0_0_30px_rgba(175,255,0,0.2)] mb-6 rotate-3">
            <Terminal className="text-black" size={32} strokeWidth={3} />
          </div>
          <h1 className="text-4xl font-black text-white italic uppercase tracking-tighter leading-none">
            Operator<span className="text-[#afff00]">.</span>Login
          </h1>
          <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.4em] mt-4 italic">
            {"//"} Authorized_Personnel_Only
          </p>
        </div>

        {/* LOGIN TERMINAL */}
        <div className="bg-zinc-900/40 backdrop-blur-2xl border border-zinc-800 rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-[#afff00] shadow-[0_0_15px_#afff00]" />
          
          <form onSubmit={handleSubmit} className="space-y-10">
            
            {/* NOTCHED EMAIL */}
            <div className="relative group">
              <input 
                name="email" 
                type="email" 
                required 
                placeholder=" "
                className="peer w-full bg-transparent border border-zinc-800 p-4 rounded-xl outline-none focus:border-[#afff00] text-white font-bold uppercase italic tracking-widest text-xs transition-all"
              />
              <label className="absolute left-3 -top-2.5 px-2 bg-black text-[10px] font-black uppercase tracking-widest text-zinc-600 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-xs peer-focus:-top-2.5 peer-focus:text-[#afff00]">
                Access_ID_Email
              </label>
              <Mail className="absolute right-4 top-4 text-zinc-700 peer-focus:text-[#afff00] transition-colors" size={18} />
            </div>

            {/* NOTCHED PASSWORD */}
            <div className="relative group">
              <input 
                name="password" 
                type={showPassword ? "text" : "password"} 
                required 
                placeholder=" "
                className="peer w-full bg-transparent border border-zinc-800 p-4 rounded-xl outline-none focus:border-[#afff00] text-white font-bold tracking-[0.5em] transition-all"
              />
              <label className="absolute left-3 -top-2.5 px-2 bg-black text-[10px] font-black uppercase tracking-widest text-zinc-600 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-xs peer-focus:-top-2.5 peer-focus:text-[#afff00]">
                Security_Cipher
              </label>
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-4 text-zinc-700 hover:text-[#afff00] transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {/* ERROR LOG */}
            <AnimatePresence>
              {error && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-red-600/10 border border-red-600/30 p-4 rounded-xl flex items-center gap-3 text-red-500"
                >
                  <ShieldAlert size={18} />
                  <span className="text-[10px] font-black uppercase tracking-widest italic">{error}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* EXECUTE BUTTON */}
            <button 
              type="submit" 
              disabled={loading} 
              className="group relative w-full bg-[#afff00] text-black font-black italic uppercase py-5 rounded-2xl hover:scale-[1.02] active:scale-95 transition-all shadow-[0_0_30px_rgba(175,255,0,0.1)] disabled:opacity-50 overflow-hidden"
            >
              <div className="relative z-10 flex items-center justify-center gap-3 tracking-[0.2em] text-sm">
                {loading ? <Loader2 className="animate-spin" size={20} /> : (
                  <>
                    Execute_Login
                    <ChevronRight className="group-hover:translate-x-1 transition-transform" size={20} />
                  </>
                )}
              </div>
            </button>
          </form>

          {/* SYSTEM FOOTER */}
          <div className="mt-12 pt-8 border-t border-zinc-800 flex flex-col items-center gap-4">
            <p className="text-zinc-600 text-[9px] font-black uppercase tracking-[0.3em]">
              Forgot_Key? <span className="text-zinc-400 hover:text-[#afff00] cursor-pointer underline underline-offset-4 transition-colors">Contact_Super_Admin</span>
            </p>
          </div>
        </div>

        {/* HUD FOOTER */}
        <div className="mt-12 text-center opacity-30 group">
          <p className="text-zinc-500 text-[8px] uppercase tracking-[0.6em] font-black">
            Liternix_OS // Unit_77_Protocol_{new Date().getFullYear()}
          </p>
        </div>
      </motion.div>

      {/* GLOBAL SCANLINE */}
      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%)] bg-[length:100%_4px] z-50" />
    </div>
  );
}