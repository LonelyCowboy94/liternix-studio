"use client";

import React, { Suspense } from "react";
import Header from "@/components/public/Header";
import Footer from "@/components/public/Footer";
import AmbientBackground from "@/components/public/AmbientBackground";
import ContactForm from "@/components/public/ContactForm";
import { Radio, Mail, Globe, Instagram, Facebook, Terminal, Activity } from "lucide-react";

// Sklonili smo čitanje URL-a odavde i prebacili ga u samu formu
function ContactContent() {
  const contactDetails = [
    {
      label: "Main_Signal_Address",
      value: "lukajokic644@gmail.com",
      icon: <Mail className="text-[#afff00]" size={22} />,
      loadClass: "animate-spin-mail",
      href: "mailto:lukajokic644@gmail.com"
    },
    {
      label: "Current_Location",
      value: "Belgrade_UTC+1",
      icon: <Globe className="text-[#afff00]" size={22} />,
      loadClass: "animate-spin-ln",
      href: "https://www.google.com/maps/place/Belgrade"
    }
  ];

  const socialLinks = [
    { 
      icon: <Instagram size={24} />, 
      load: "animate-spin-gh", 
      href: "https://www.instagram.com/luka.roto?igsh=YXF2MDc5eWhxYTgx" 
    },
    { 
      icon: <Facebook size={24} />, 
      load: "animate-spin-ln", 
      href: "https://www.facebook.com/luka.jokic.71" 
    }
  ];

  return (
    <main className="relative z-10 pt-32 pb-20 md:pb-40 px-6 md:px-12">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24">
        
        <div className="lg:col-span-5 flex flex-col justify-center">
          <header className="space-y-6 mb-16 animate-reveal opacity-0">
            <div className="flex items-center gap-3">
              <div className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#afff00] opacity-40"></span>
                <Radio className="relative text-[#afff00]" size={16} />
              </div>
              <span className="text-[10px] font-mono uppercase tracking-[0.4em] text-zinc-500 italic">
                Status: Receiving_Signal
              </span>
            </div>
            
            <h1 className="text-[14vw] lg:text-8xl font-black uppercase italic leading-[0.8] tracking-tighter">
              Get In <br /> 
              <span className="text-transparent bg-clip-text bg-linear-to-r from-[#afff00] to-[#7acc00]">
                Touch&nbsp;
              </span>
            </h1>
          </header>

          <div className="space-y-6">
            {contactDetails.map((item, idx) => (
              <a key={idx} href={item.href} target={item.label === "Current_Location" ? "_blank" : undefined} rel="noopener noreferrer" className="group flex items-center gap-6 p-4 rounded-2xl border border-transparent hover:bg-zinc-900/40 transition-all duration-300">
                <div className={`w-14 h-14 bg-zinc-900 border border-zinc-800 rounded-xl flex items-center justify-center shadow-lg group-hover:border-[#afff00]/50 transition-all ${item.loadClass}`}>
                  {item.icon}
                </div>
                <div className="animate-reveal opacity-0" style={{ animationDelay: `${0.6 + idx * 0.2}s` }}>
                  <p className="text-[9px] font-mono text-zinc-600 uppercase tracking-widest mb-1">{item.label}</p>
                  <p className="text-lg md:text-xl font-black uppercase italic tracking-tight group-hover:text-[#afff00] transition-colors">{item.value}</p>
                </div>
              </a>
            ))}
          </div>
        </div>

        <div className="lg:col-span-7 relative animate-reveal opacity-0 delay-2">
           <div className="p-1 backdrop-blur-xl">
              {/* OVO JE BITNO: Nema više prefill propa, ContactForm će sam pročitati URL */}
              <ContactForm />
           </div>
           <div className="mt-8 flex items-center justify-between px-6">
              <div className="flex items-center gap-3 text-zinc-600">
                <Terminal size={14} />
                <span className="text-[10px] font-bold uppercase italic">LUKA_JOKIC_SECURE</span>
              </div>
              <Activity size={16} className="text-[#afff00] animate-pulse" />
           </div>
        </div>
      </div>
    </main>
  );
}

export default function GetInTouchPage() {
  return (
    <div className="min-h-screen bg-black text-white selection:bg-[#afff00] selection:text-black overflow-x-hidden">
      <AmbientBackground />
      <Header />
      <ContactContent />
      <Footer />
    </div>
  );
}