"use client";
import { Mail, Settings, Newspaper, Users, LucideIcon } from "lucide-react";

const ICON_MAP: Record<string, LucideIcon> = {
  mail: Mail,
  settings: Settings,
  newspaper: Newspaper,
  users: Users,
};

interface StatProps {
  label: string;
  value: number | string;
  iconName: string;
  bg: string;
  color: string;
  unreadRes?: { value: number }; 
}

export default function DashboardStats({ label, value, iconName, unreadRes }: StatProps) {
  const Icon = ICON_MAP[iconName] || Mail;
  const isAlert = iconName === "mail" && unreadRes && unreadRes.value > 0;

  return (
    <div 
      className="bg-zinc-900/40 hover:border-[#afff00]/30 p-6 rounded-4xl border border-zinc-800 shadow-2xl flex items-center gap-6 group transition-colors duration-500 backdrop-blur-sm relative overflow-hidden"
    >
      {/* BACKGROUND DECORATION */}
      <div className="absolute top-0 right-0 p-2 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
        <Icon size={80} strokeWidth={4} />
      </div>

      {/* ICON CONTAINER */}
      <div className={`p-4 rounded-2xl relative transition-all duration-500 
        ${isAlert ? 'bg-red-500/10 border border-red-500/20' : 'bg-black border border-zinc-800 group-hover:border-[#afff00]/50'}`}
      >
        <Icon 
          className={isAlert ? 'text-red-500' : 'text-[#afff00]'} 
          size={22} 
          strokeWidth={2.5} 
        />

        {isAlert && (
          <span className="absolute -top-1 -right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-600 shadow-[0_0_10px_red]"></span>
          </span>
        )}
      </div>

      {/* DATA */}
      <div className="relative z-10">
        <p className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em] mb-1 group-hover:text-zinc-400 transition-colors">
          {label.replace("_", " ")}
        </p>
        <div className="flex items-baseline gap-1">
          <p className="text-4xl font-black text-white italic tabular-nums tracking-tighter group-hover:text-[#afff00] transition-colors">
            {value}
          </p>
        </div>
      </div>

      {/* SUBTLE SCANLINE EFFECT INSIDE CARD */}
      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.05)_50%)] bg-size-[100%_4px] opacity-10" />
    </div>
  );
}