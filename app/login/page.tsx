"use client";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Terminal,
  Mail,
  Loader2,
  ChevronRight,
  Eye,
  EyeOff,
  ShieldAlert,
  AlertTriangle,
} from "lucide-react";
import Button3D from "@/components/ui/Button3D";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [attemptedSubmit, setAttemptedSubmit] = useState(false);

  const [attempts, setAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [isShuttingDown, setIsShuttingDown] = useState(false); 

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (isLocked || isShuttingDown) return;

    setAttemptedSubmit(true);
    setError("");

    if (!formData.email || !formData.password) {
      setError("CRITICAL_ERROR: MISSING_IDENTITY_DATA");
      return;
    }

    setLoading(true);

    const res = await signIn("credentials", {
      email: formData.email,
      password: formData.password,
      redirect: false,
      callbackUrl: "/admin",
    });

    if (res?.error) {
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);

      if (newAttempts >= 3) {
        // --- PHASE 1: ALARM ---
        setIsLocked(true);
        setError("SECURITY_BREACH: INITIATING_TERMINAL_WIPE...");
        setLoading(false);

        // --- PHASE 2: SHUTDOWN AFTER 2.5 SECOND ---
        setTimeout(() => {
          setIsShuttingDown(true);
        }, 2500);
        return;
      }

      setError(`ACCESS_DENIED: ATTEMPT ${newAttempts}/3`);
      setLoading(false);
      setFormData((prev) => ({ ...prev, password: "" }));
    } else if (res?.ok) {
      router.push("/admin");
      router.refresh();
    }
  }

  const labelClasses = `absolute left-3 px-2 bg-black text-[10px] font-black uppercase tracking-widest transition-all duration-200 pointer-events-none
    top-4 text-xs peer-focus:-top-2.5 peer-focus:text-[10px] peer-[:not(:placeholder-shown)]:-top-2.5 peer-[:not(:placeholder-shown)]:text-[10px]`;

  return (
    <div
      className={`relative min-h-screen w-full flex items-center justify-center bg-black overflow-hidden font-sans transition-colors duration-300 ${isLocked && !isShuttingDown ? "animate-alarm" : ""}`}
    >
      {/* INITIAL BOOT LINE */}
      {!isShuttingDown && <div className="boot-line" />}

      {/* SHUTDOWN LINE */}
      {isShuttingDown && <div className="shutdown-line" />}

      {/* BACKGROUNDS */}
      <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size-[40px_40px]" />
      <div
        className={`absolute top-0 left-0 w-full h-full transition-opacity duration-1000 ${isLocked ? "bg-red-950/13" : "bg-[radial-gradient(circle_at_center,rgba(175,255,0,0.05)_0%,transparent_70%)]"}`}
      />

      {/* MAIN CONTAINER */}
      <div
        className={`relative z-10 w-full max-w-md p-6 
        ${isShuttingDown ? "animate-shutdown" : "animate-boot-container"} 
        ${error && !isLocked ? "error-shake" : ""}`}
      >
        <div className="animate-boot-content">
          {/* SYSTEM HEADER */}
          <div className="flex flex-col items-center mb-12">
            <Link href="/" className=" hover:rotate-10 transition-all">
              <div
                className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-[0_0_30px] mb-6 transition-all duration-300 
                ${isLocked ? "bg-red-600 shadow-red-600 animate-pulse" : "bg-[#afff00] shadow-[#afff00]"}`}
              >
                <Terminal className="text-black" size={32} strokeWidth={3} />
              </div>
            </Link>
            <h1
              className={`text-4xl font-black italic uppercase tracking-tighter leading-none transition-colors duration-300 
              ${isLocked ? "text-red-500 animate-text-glitch" : "text-white"}`}
            >
              Operator
              <span className={isLocked ? "text-white" : "text-[#afff00]"}>
                .
              </span>
              Login
            </h1>
            <p
              className={`text-[10px] font-black uppercase tracking-[0.4em] mt-4 italic transition-colors 
              ${isLocked ? "text-red-600" : "text-zinc-500"}`}
            >
              {isLocked
                ? "!! PROTOCOL_AD-03_ACTIVE !!"
                : "// Authorized_Personnel_Only"}
            </p>
          </div>

          {/* LOGIN TERMINAL */}
          <div
            className={`bg-zinc-900/40 backdrop-blur-2xl border rounded-2xl p-10 shadow-2xl relative overflow-hidden transition-colors duration-500 
            ${isLocked ? "border-red-600/50" : "border-zinc-800"}`}
          >
            {/* Top status line */}
            <div
              className={`absolute top-0 left-0 w-full h-1 shadow-[0_0_15px] transition-all duration-500 
              ${isLocked ? "bg-red-600 shadow-red-600 animate-pulse" : error ? "bg-red-600" : "bg-[#afff00] shadow-[#afff00]"}`}
            />

            <form onSubmit={handleSubmit} noValidate className="space-y-10">
              <div className="relative group">
                <input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  placeholder=" "
                  disabled={isLocked}
                  className={`peer w-full bg-transparent p-4 rounded-xl outline-none border transition-all duration-300 font-bold tracking-widest text-xs uppercase italic text-white
                    ${isLocked ? "border-red-900/50 text-red-200" : attemptedSubmit && !formData.email ? "border-red-500/50" : "border-zinc-800 focus:border-[#afff00]"}`}
                />
                <label
                  className={`${labelClasses} ${isLocked ? "text-red-800" : attemptedSubmit && !formData.email ? "text-red-500" : "text-zinc-600 peer-focus:text-[#afff00]"}`}
                >
                  Access_ID_Email
                </label>
                <Mail
                  className={`absolute right-4 top-4 transition-colors ${isLocked ? "text-red-800" : attemptedSubmit && !formData.email ? "text-red-500" : "text-zinc-700 peer-focus:text-[#afff00]"}`}
                  size={18}
                />
              </div>

              <div className="relative group">
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  placeholder=" "
                  disabled={isLocked}
                  className={`peer w-full bg-transparent p-4 rounded-xl outline-none border transition-all duration-300 font-bold text-xs uppercase italic text-white
                    ${!showPassword && "tracking-[0.5em]"}
                    ${isLocked ? "border-red-900/50 text-red-200" : attemptedSubmit && !formData.password ? "border-red-500/50" : "border-zinc-800 focus:border-[#afff00]"}`}
                />
                <label
                  className={`${labelClasses} ${isLocked ? "text-red-800" : attemptedSubmit && !formData.password ? "text-red-500" : "text-zinc-600 peer-focus:text-[#afff00]"}`}
                >
                  Security_Cipher
                </label>
                {!isLocked && (
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-4 text-zinc-700 hover:text-[#afff00] z-10"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                )}
              </div>

              {/* ERROR LOG - Glitchy text */}
              {error && (
                <div
                  className={`p-4 rounded-xl flex items-center gap-3 border transition-all duration-300 
                  ${isLocked ? "bg-red-600/20 border-red-600 text-red-500 animate-text-glitch" : "bg-red-600/10 border-red-600/30 text-red-500 animate-fade-in-down"}`}
                >
                  {isLocked ? (
                    <AlertTriangle className="shrink-0" size={18} />
                  ) : (
                    <ShieldAlert className="animate-pulse shrink-0" size={18} />
                  )}
                  <span className="text-[10px] font-black uppercase tracking-widest italic leading-tight">
                    {error}
                  </span>
                </div>
              )}

              <Button3D
                primary={!error && !isLocked}
                type="submit"
                disabled={loading || isLocked}
                className={`group w-full flex justify-center italic uppercase py-5
                  ${isLocked ? "bg-red-950 border-red-800 text-red-900 cursor-not-allowed opacity-50" : error ? "bg-red-600 hover:bg-red-500 text-white" : ""}`}
              >
                <div className="relative z-10 flex items-center justify-center gap-3 tracking-[0.2em] text-sm">
                  {loading ? (
                    <Loader2 className="animate-spin" size={20} />
                  ) : isLocked ? (
                    "SYSTEM_HALTED"
                  ) : (
                    <>
                      Execute_Login <ChevronRight size={20} />
                    </>
                  )}
                </div>
              </Button3D>
            </form>
          </div>
        </div>
      </div>

      {/* SCANLINE - RED */}
      <div
        className={`absolute inset-0 pointer-events-none bg-size-[100%_4px] z-50 overflow-hidden transition-all duration-500 
       `}
      />
    </div>
  );
}
