import Header from "@/components/public/Header";
import Footer from "@/components/public/Footer";
import AmbientBackground from "@/components/public/AmbientBackground";
import ContactForm from "@/components/public/ContactForm";
import { Radio, Mail, Globe, Instagram, Youtube } from "lucide-react";

export default function GetInTouchPage() {
  return (
    <div className="min-h-screen bg-black text-white selection:bg-[#afff00] selection:text-black">
      <AmbientBackground />
      <Header />

      <main className="relative z-10 pt-32 pb-40 px-6 md:px-12">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-20">
          
          {/* LEFT COLUMN: HUD INFO */}
          <div className="lg:col-span-5 space-y-16">
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <Radio className="text-[#afff00] animate-pulse" size={24} />
                <span className="text-[10px] font-black uppercase tracking-[0.5em] text-zinc-500 italic">Frequency: 44.1kHz</span>
              </div>
              <h1 className="text-6xl md:text-8xl font-black uppercase italic leading-[0.8] tracking-tighter">
                Get In <br /> <span className="text-[#afff00]">Touch</span>
              </h1>
              <p className="font-trade text-2xl md:text-3xl text-zinc-400 italic leading-tight mt-8">
                &quot;Stop looking for an editor. <br /> Start looking for an <span className="text-white">Alchemist</span>.&quot;
              </p>
            </div>

            {/* CONNECTION DETAILS */}
            <div className="space-y-8 pt-10 border-t border-zinc-900">
              <div className="group flex items-center gap-6">
                <div className="w-12 h-12 bg-zinc-900 border border-zinc-800 rounded-xl flex items-center justify-center group-hover:border-[#afff00] transition-colors">
                  <Mail className="text-[#afff00]" size={20} />
                </div>
                <div>
                  <p className="text-[9px] font-black text-zinc-700 uppercase tracking-widest">Main_Signal_Address</p>
                  <p className="text-lg font-black uppercase italic tracking-tight">hello@liternix.studio</p>
                </div>
              </div>

              <div className="group flex items-center gap-6">
                <div className="w-12 h-12 bg-zinc-900 border border-zinc-800 rounded-xl flex items-center justify-center group-hover:border-[#afff00] transition-colors">
                  <Globe className="text-[#afff00]" size={20} />
                </div>
                <div>
                  <p className="text-[9px] font-black text-zinc-700 uppercase tracking-widest">Current_Location</p>
                  <p className="text-lg font-black uppercase italic tracking-tight">Belgrade_UTC+1</p>
                </div>
              </div>
            </div>

            {/* SOCIAL_LOGS */}
            <div className="flex gap-4">
              <a href="#" className="p-4 bg-zinc-900/50 border border-zinc-800 rounded-2xl hover:border-[#afff00] hover:text-[#afff00] transition-all">
                <Instagram size={24} />
              </a>
              <a href="#" className="p-4 bg-zinc-900/50 border border-zinc-800 rounded-2xl hover:border-[#afff00] hover:text-[#afff00] transition-all">
                <Youtube size={24} />
              </a>
            </div>
          </div>

          {/* RIGHT COLUMN: THE FORM */}
          <div className="lg:col-span-7">
            <ContactForm />
          </div>

        </div>
      </main>

      <Footer />
      
      {/* GLOBAL SCANLINE */}
      <div className="fixed inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%)] bg-size-[100%_4px] z-50" />
    </div>
  );
}