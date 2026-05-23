"use client";

import React, { Suspense } from "react";
import Header from "@/components/public/Header";
import Footer from "@/components/public/Footer";
import AmbientBackground from "@/components/public/AmbientBackground";
import ContactForm from "@/components/public/ContactForm";
import { Radio, Mail, Globe, Instagram, Facebook, Terminal, Activity, Twitter } from "lucide-react";

function  ContactContent() {
  const contactDetails = [
    {
      label: "Main_Signal_Address",
      value: "lukajokic413@gmail.com",
      icon: <Mail className="text-[#afff00]" size={22} />,
      loadClass: "animate-spin-mail",
      href: "mailto:lukajokic413@gmail.com"
    },
    {
      label: "Current_Location",
      value: "Belgrade_UTC+1",
      icon: <Globe className="text-[#afff00]" size={22} />,
      loadClass: "animate-spin-ln",
      href: "https://www.google.com/maps/place/Belgrade" // Opciono, vodi na mapu Beograda
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
    },
    { 
      icon: <Twitter size={24} />, 
      load: "animate-spin-gh", 
      href: "https://x.com/luka_editing" 
    }
  ];

  return (
    <main className="relative z-10 pt-32 pb-20 -mb-20 md:pb-40 px-6 md:px-12">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24">
        
        {/* LEFT COLUMN */}
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
            
            <h1 className="text-[clamp(3.5rem,12vw,5.5rem)] font-black uppercase italic leading-[0.8] tracking-tighter">
              Get In <br /> 
              <span className="animate-video-text text-transparent bg-clip-text bg-linear-to-r from-[#afff00] to-[#7acc00]">
                Touch&nbsp;
              </span>
            </h1>
            <div className="flex flex-col gap-3 my-6 lg:my-8 w-full">
                        <div className="flex items-center gap-2">
                          <Activity size={14} className="text-[#afff00] animate-pulse" />
                          <span className="text-[10px] font-black text-white uppercase italic tracking-widest">
                            Verify Integrity
                          </span>
                        </div>
                        <div className="w-full h-0.75 bg-zinc-900 rounded-full overflow-hidden">
                          <div className="h-full bg-[#afff00]/60 animate-fill-bar delay-3" />
                        </div>
                      </div>
          </header>

            {/* CONTACT CARDS */}
            <div className="space-y-6">
              {contactDetails.map((item, idx) => (
                <a 
                  key={idx} 
                  href={item.href}
                  target={item.label === "Current_Location" ? "_blank" : undefined}
                  rel="noopener noreferrer"
                  className="group perspective-1000 flex items-center gap-6 p-4 rounded-2xl border border-transparent hover:bg-zinc-900/40 transition-all duration-300"
                >
                  {/* 3D IKONA */}
                  <div className={`rotateY-card min-w-14 h-14 bg-zinc-900 border border-zinc-800 rounded-xl flex items-center justify-center shadow-lg group-hover:border-[#afff00]/50 group-hover:shadow-[#afff00]/10 transition-all ${item.loadClass}`}>
                    {item.icon}
                  </div>
                  
                  <div className="animate-reveal opacity-0" style={{ animationDelay: `${0.6 + idx * 0.2}s` }}>
                    <p className="text-[9px] font-mono text-zinc-600 uppercase tracking-widest mb-1">{item.label}</p>
                    <p className="text-[clamp(0.8rem,3vw,1.5rem)] font-black uppercase italic tracking-tight group-hover:text-[#afff00] transition-colors">
                      {item.value}
                    </p>
                  </div>
                </a>
              ))}
            </div>

          {/* SOCIAL LINKS */}
          <div className="flex gap-4 mt-12 md:mt-16 animate-reveal opacity-0" style={{ animationDelay: '1.2s' }}>
            {socialLinks.map((soc, i) => (
              <a 
                key={i} 
                href={soc.href} 
                target="_blank"
                rel="noopener noreferrer"
                className="group perspective-1000"
                aria-label="Social Link"
              >
                {/* SOCIAL ICON SA BRZIM SPIN-OM NA HOVER */}
                <div className={`rotateY-card w-14 h-14 bg-zinc-900/50 border border-zinc-800 rounded-2xl flex items-center justify-center transition-all duration-500 hover:text-[#afff00] group-hover:bg-zinc-900 group-hover:border-[#afff00] group-hover:[transform-rotateY(360deg)] ${soc.load}`}>
                  {soc.icon}
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* RIGHT COLUMN: FORM */}
        <div className="lg:col-span-7 relative animate-reveal opacity-0 delay-2">
           <div className="absolute -top-2 -left-2 w-6 h-6 border-t border-l border-[#afff00]/30 pointer-events-none" />
           <div className="absolute -bottom-2 -right-2 w-6 h-6 border-b border-r border-[#afff00]/30 pointer-events-none" />
           
           <div className="p-1 backdrop-blur-xl">
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

      <Suspense fallback={<div className="h-screen flex items-center justify-center text-[#afff00] font-black uppercase italic tracking-widest animate-pulse">Establishing_Secure_Connection...</div>}>
        <ContactContent />
      </Suspense>

      <Footer />
      
      {/* <div className="fixed inset-0 pointer-events-none z-100 opacity-[0.03] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,1)_50%)] bg-size-[100%_4px]" /> */}
    </div>
  );
}