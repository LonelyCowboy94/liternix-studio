"use client";
import { ArrowRight, Settings, Newspaper, LucideIcon } from "lucide-react";
import Link from "next/link";

const ICON_MAP: Record<string, LucideIcon> = {
  settings: Settings,
  newspaper: Newspaper,
};

interface TeaserProps {
  title: string;
  status: string;
  link: string;
  iconName: string;
}

export default function ContentTeaser({ title, status, link, iconName }: TeaserProps) {
  const Icon = ICON_MAP[iconName] || Settings;

  return (
    <div className="bg-white p-6 rounded-4xl border border-slate-100 shadow-sm relative group overflow-hidden">
      <div className="flex justify-between items-start mb-4">
        <div className="p-3 bg-slate-50 rounded-xl group-hover:bg-indigo-50 transition-colors text-slate-400 group-hover:text-indigo-600">
          <Icon size={20} />
        </div>
        <span className={`text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-tighter ${status === 'published' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
          {status}
        </span>
      </div>
      <h3 className="font-black text-slate-900 line-clamp-1 mb-6 text-lg tracking-tight">{title}</h3>
      <Link href={link} className="flex items-center gap-2 text-xs font-black text-indigo-600 uppercase tracking-widest hover:gap-3 transition-all">
        Manage Content <ArrowRight size={14} />
      </Link>
    </div>
  );
}