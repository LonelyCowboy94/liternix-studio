"use client";

import { useState } from "react";
import { Send, RefreshCw, CheckCircle2, AlertTriangle, Terminal } from "lucide-react";

interface FormErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  message?: string;
  consent?: string;
}

export default function ContactForm() {
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
      console.error("Error while submiting form: ", err);
      setStatus("error");
    }
  };

  return (
    <div className="bg-zinc-900/40 p-8 md:p-12 rounded-[2.5rem] border border-zinc-800 shadow-2xl backdrop-blur-md relative overflow-hidden">
      
      <div className="flex items-center gap-3 mb-10">
        <Terminal className="text-[#afff00]" size={24} />
        <h2 className="text-xl font-black uppercase italic tracking-widest text-white">Initialize_Signal</h2>
      </div>

      <form onSubmit={handleSubmit} noValidate className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* First Name */}
          <div className="relative group">
            <input
              type="text"
              placeholder=" "
              className={`peer w-full bg-transparent border p-4 rounded-xl outline-none transition-all text-sm font-bold uppercase italic ${errors.firstName ? 'border-red-500 text-red-500' : 'border-zinc-800 focus:border-[#afff00] text-white'}`}
              value={formData.firstName}
              onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
            />
            <label className="absolute left-3 -top-2.5 px-2 bg-[#020202] text-[10px] font-black uppercase tracking-widest text-zinc-500 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-xs peer-focus:-top-2.5 peer-focus:text-[10px] peer-focus:text-[#afff00]">First_Name</label>
            {errors.firstName && <p className="text-red-500 text-[9px] font-black mt-1 ml-2 tracking-tighter italic">{errors.firstName}</p>}
          </div>

          {/* Last Name */}
          <div className="relative group">
            <input
              type="text"
              placeholder=" "
              className={`peer w-full bg-transparent border p-4 rounded-xl outline-none transition-all text-sm font-bold uppercase italic ${errors.lastName ? 'border-red-500 text-red-500' : 'border-zinc-800 focus:border-[#afff00] text-white'}`}
              value={formData.lastName}
              onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
            />
            <label className="absolute left-3 -top-2.5 px-2 bg-[#020202] text-[10px] font-black uppercase tracking-widest text-zinc-500 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-xs peer-focus:-top-2.5 peer-focus:text-[10px] peer-focus:text-[#afff00]">Last_Name</label>
            {errors.lastName && <p className="text-red-500 text-[9px] font-black mt-1 ml-2 tracking-tighter italic">{errors.lastName}</p>}
          </div>
        </div>

        {/* Email */}
        <div className="relative group">
          <input
            type="email"
            placeholder=" "
            className={`peer w-full bg-transparent border p-4 rounded-xl outline-none transition-all text-sm font-bold uppercase italic ${errors.email ? 'border-red-500 text-red-500' : 'border-zinc-800 focus:border-[#afff00] text-white'}`}
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
          <label className="absolute left-3 -top-2.5 px-2 bg-[#020202] text-[10px] font-black uppercase tracking-widest text-zinc-500 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-xs peer-focus:-top-2.5 peer-focus:text-[10px] peer-focus:text-[#afff00]">Signal_Address_Email</label>
          {errors.email && <p className="text-red-500 text-[9px] font-black mt-1 ml-2 tracking-tighter italic">{errors.email}</p>}
        </div>

        {/* Company */}
        <div className="relative group">
          <input
            type="text"
            placeholder=" "
            className="peer w-full bg-transparent border border-zinc-800 p-4 rounded-xl outline-none focus:border-[#afff00] transition-all text-sm font-bold uppercase italic text-white"
            value={formData.company}
            onChange={(e) => setFormData({ ...formData, company: e.target.value })}
          />
          <label className="absolute left-3 -top-2.5 px-2 bg-[#020202] text-[10px] font-black uppercase tracking-widest text-zinc-500 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-xs peer-focus:-top-2.5 peer-focus:text-[10px] peer-focus:text-[#afff00]">Organization_Affiliation</label>
        </div>

        {/* Message */}
        <div className="relative group">
          <textarea
            placeholder=" "
            rows={5}
            className={`peer w-full bg-transparent border p-4 rounded-2xl outline-none transition-all text-sm font-medium leading-relaxed resize-none ${errors.message ? 'border-red-500 text-red-500' : 'border-zinc-800 focus:border-[#afff00] text-white'}`}
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          />
          <label className="absolute left-3 -top-2.5 px-2 bg-[#020202] text-[10px] font-black uppercase tracking-widest text-zinc-500 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-xs peer-focus:-top-2.5 peer-focus:text-[10px] peer-focus:text-[#afff00]">Transmission_Payload</label>
          {errors.message && <p className="text-red-500 text-[9px] font-black mt-1 ml-2 tracking-tighter italic">{errors.message}</p>}
        </div>

        {/* Consent */}
        <div className="space-y-2">
          <label className="flex items-start gap-4 cursor-pointer group">
            <input
              type="checkbox"
              className="mt-1 w-5 h-5 rounded border-zinc-800 bg-black text-[#afff00] focus:ring-[#afff00] transition-all accent-[#afff00]"
              checked={formData.consent}
              onChange={(e) => setFormData({ ...formData, consent: e.target.checked })}
            />
            <span className={`text-[10px] uppercase font-bold leading-tight tracking-widest transition-colors ${errors.consent ? 'text-red-500' : 'text-zinc-500 group-hover:text-zinc-300'}`}>
              Authorize encryption and data processing for signal response.
            </span>
          </label>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={status === "loading"}
          className="w-full bg-[#afff00] text-black font-black italic uppercase py-5 rounded-2xl flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-95 transition-all shadow-[0_0_30px_rgba(175,255,0,0.2)] disabled:opacity-50"
        >
          {status === "loading" ? <RefreshCw className="animate-spin" size={20} /> : <><Send size={20} /> Deploy_Signal</>}
        </button>

        {/* Status Feedbacks */}
        {status === "success" && (
          <div className="p-4 bg-[#afff00]/10 border border-[#afff00]/30 rounded-xl text-[#afff00] flex items-center gap-3 text-xs font-black uppercase italic tracking-widest">
            <CheckCircle2 size={18} /> Signal_Delivered. Standby_For_Response.
          </div>
        )}
        {status === "error" && (
          <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-500 flex items-center gap-3 text-xs font-black uppercase italic tracking-widest">
            <AlertTriangle size={18} /> Critical_Error: Transmission_Failed.
          </div>
        )}
      </form>
    </div>
  );
}