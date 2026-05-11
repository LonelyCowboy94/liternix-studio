"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Send, RefreshCw, Terminal } from "lucide-react";
import Button3D from "../ui/Button3D";

interface FormErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  message?: string;
  consent?: string;
}

// Odvajamo logiku forme u unutrašnju komponentu zbog Suspense-a
function FormInner() {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errors, setErrors] = useState<FormErrors>({});
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    company: "",
    email: "",
    message: "",
    consent: false,
  });

  // AUTO-FILL LOGIKA: Čita iz URL-a (npr. ?email=test&fn=Luka)
  useEffect(() => {
    const emailParam = searchParams.get("email");
    const fnParam = searchParams.get("fn");
    const lnParam = searchParams.get("ln");

    if (emailParam || fnParam || lnParam) {
      setFormData(prev => ({
        ...prev,
        email: emailParam || prev.email,
        firstName: fnParam || prev.firstName,
        lastName: lnParam || prev.lastName,
      }));
    }
  }, [searchParams]);

  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    if (!formData.firstName.trim()) newErrors.firstName = "FIELD_REQUIRED";
    if (!formData.lastName.trim()) newErrors.lastName = "FIELD_REQUIRED";
    if (!formData.message.trim()) newErrors.message = "DATA_PAYLOAD_MISSING";
    if (!formData.consent) newErrors.consent = "CONSENT_NOT_GRANTED";
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = "ADDRESS_REQUIRED";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "INVALID_SIGNAL_FORMAT";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setStatus("loading");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error();
      setStatus("success");
      setFormData({ firstName: "", lastName: "", company: "", email: "", message: "", consent: false });
      setErrors({});
    } catch (err) {
      console.error(err);
      setStatus("error");
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="relative group">
            <input type="text" placeholder=" " className={`peer w-full bg-transparent border p-4 rounded-xl outline-none transition-all text-sm font-bold uppercase italic ${errors.firstName ? 'border-red-500 text-red-500' : 'border-zinc-800 focus:border-[#afff00] text-white'}`} value={formData.firstName} onChange={(e) => setFormData({ ...formData, firstName: e.target.value })} />
            <label className="absolute left-3 -top-2.5 px-2 bg-[#020202] text-[10px] font-black uppercase tracking-widest text-zinc-500 transition-all peer-placeholder-shown:top-4 peer-focus:-top-2.5 peer-focus:text-[#afff00]">First_Name</label>
          </div>
          <div className="relative group">
            <input type="text" placeholder=" " className={`peer w-full bg-transparent border p-4 rounded-xl outline-none transition-all text-sm font-bold uppercase italic ${errors.lastName ? 'border-red-500 text-red-500' : 'border-zinc-800 focus:border-[#afff00] text-white'}`} value={formData.lastName} onChange={(e) => setFormData({ ...formData, lastName: e.target.value })} />
            <label className="absolute left-3 -top-2.5 px-2 bg-[#020202] text-[10px] font-black uppercase tracking-widest text-zinc-500 transition-all peer-placeholder-shown:top-4 peer-focus:-top-2.5 peer-focus:text-[#afff00]">Last_Name</label>
          </div>
        </div>

        <div className="relative group">
          <input type="email" placeholder=" " className={`peer w-full bg-transparent border p-4 rounded-xl outline-none transition-all text-sm font-bold uppercase italic ${errors.email ? 'border-red-500 text-red-500' : 'border-zinc-800 focus:border-[#afff00] text-white'}`} value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
          <label className="absolute left-3 -top-2.5 px-2 bg-[#020202] text-[10px] font-black uppercase tracking-widest text-zinc-500 transition-all peer-placeholder-shown:top-4 peer-focus:-top-2.5 peer-focus:text-[#afff00]">Email_Address</label>
        </div>

        <div className="relative group">
          <input type="text" placeholder=" " className="peer w-full bg-transparent border border-zinc-800 p-4 rounded-xl outline-none focus:border-[#afff00] transition-all text-sm font-bold uppercase italic text-white" value={formData.company} onChange={(e) => setFormData({ ...formData, company: e.target.value })} />
          <label className="absolute left-3 -top-2.5 px-2 bg-[#020202] text-[10px] font-black uppercase tracking-widest text-zinc-500 transition-all peer-placeholder-shown:top-4 peer-focus:-top-2.5 peer-focus:text-[#afff00]">Organization</label>
        </div>

        <div className="relative group">
          <textarea placeholder=" " rows={5} className={`peer w-full bg-transparent border p-4 rounded-2xl outline-none transition-all text-sm font-medium leading-relaxed resize-none ${errors.message ? 'border-red-500 text-red-500' : 'border-zinc-800 focus:border-[#afff00] text-white'}`} value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} />
          <label className="absolute left-3 -top-2.5 px-2 bg-[#020202] text-[10px] font-black uppercase tracking-widest text-zinc-500 transition-all peer-placeholder-shown:top-4 peer-focus:-top-2.5 peer-focus:text-[#afff00]">Message_Content</label>
        </div>

        <div className="space-y-2">
          <label className="flex items-center gap-4 cursor-pointer group">
            <input type="checkbox" className="w-5 h-5 rounded border-zinc-800 bg-black accent-[#afff00]" checked={formData.consent} onChange={(e) => setFormData({ ...formData, consent: e.target.checked })} />
            <span className={`text-[10px] uppercase font-bold tracking-widest ${errors.consent ? 'text-red-500' : 'text-zinc-500'}`}>Authorize data processing.</span>
          </label>
        </div>

        <Button3D primary type="submit" disabled={status === "loading"} className="w-full italic py-5 rounded-2xl flex items-center justify-center">
          {status === "loading" ? <RefreshCw className="animate-spin" size={20} /> : <><Send size={20} className="mr-2" /> Send_Signal</>}
        </Button3D>

        {status === "success" && (
          <div className="p-4 bg-[#afff00]/10 border border-[#afff00]/30 rounded-xl text-[#afff00] text-xs font-black uppercase italic">Signal_Delivered.</div>
        )}
    </form>
  );
}

// Wrapper sa Suspense (Obavezno za useSearchParams u Next.js)
export default function ContactForm() {
  return (
    <div className="bg-zinc-900/40 p-8 md:p-12 rounded-2xl border border-zinc-800 shadow-2xl backdrop-blur-md relative overflow-hidden">
      <div className="flex items-center gap-3 mb-10 text-white">
        <Terminal className="text-[#afff00]" size={24} />
        <h2 className="text-xl font-black uppercase italic tracking-widest">Contact_System</h2>
      </div>
      <Suspense fallback={<div className="text-[#afff00] animate-pulse">BOOTING_SYSTEM...</div>}>
        <FormInner />
      </Suspense>
    </div>
  );
}