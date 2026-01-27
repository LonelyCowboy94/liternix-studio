"use client";
import { Mail, ChevronRight } from "lucide-react";
import Link from "next/link";

interface MessageTeaser {
  id: string;
  firstName: string;
  lastName: string;
  message: string;
  status: string | null;
  createdAt: Date | string | null;
}

export default function RecentMessages({ messages }: { messages: MessageTeaser[] }) {
  if (!messages || messages.length === 0) {
    return (
      <div className="p-20 text-center text-zinc-700 font-black uppercase tracking-[0.5em] text-[10px] italic animate-pulse">
        {"//"} No_Active_Signals_Detected
      </div>
    )
  }

  return (
    <div className="divide-y divide-zinc-800/50 bg-transparent">
      {messages.map((m) => {
        const isUnread = m.status === 'unread';
        
        return (
          <Link 
            key={m.id} 
            href="/admin/messages" 
            className="p-5 md:p-6 flex items-center justify-between hover:bg-[#afff00]/5 transition-all group relative overflow-hidden"
          >
            {/* ACTIVE INDICATOR LINE */}
            {isUnread && (
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-red-600 shadow-[0_0_15px_red]" />
            )}

            <div className="flex items-center gap-5 min-w-0">
              {/* ICON BLOCK */}
              <div className={`relative w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-all duration-500 
                ${isUnread 
                  ? 'bg-[#afff00] text-black shadow-[0_0_20px_rgba(175,255,0,0.3)]' 
                  : 'bg-zinc-800 text-zinc-600 group-hover:bg-zinc-700'}`}>
                <Mail size={18} strokeWidth={isUnread ? 3 : 2} />
                
                {isUnread && (
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-600 border-2 border-black rounded-full animate-pulse" />
                )}
              </div>

              {/* TEXT CONTENT */}
              <div className="min-w-0 space-y-0.5">
                <div className="flex items-center gap-2">
                   <p className={`text-sm uppercase italic tracking-tight truncate ${isUnread ? 'font-black text-white' : 'font-bold text-zinc-500'}`}>
                      {m.firstName} {m.lastName}
                   </p>
                   {isUnread && (
                     <span className="text-[8px] font-black bg-red-600/10 text-red-500 px-1.5 py-0.5 rounded border border-red-500/20 tracking-tighter">
                       NEW_SIGNAL
                     </span>
                   )}
                </div>
                <p className={`text-xs truncate max-w-sm transition-colors ${isUnread ? 'text-zinc-400 font-bold' : 'text-zinc-600 font-medium'}`}>
                  {m.message}
                </p>
              </div>
            </div>

            {/* STATUS & DATE */}
            <div className="flex items-center gap-4 shrink-0 ml-4">
              <div className="text-right hidden sm:block">
                 <p className="text-[9px] font-black text-zinc-700 uppercase tracking-widest group-hover:text-zinc-500 transition-colors">
                    Received_At
                 </p>
                 <span suppressHydrationWarning className="text-[10px] font-black text-[#afff00]/60 uppercase italic tracking-tighter">
                    {m.createdAt ? new Date(m.createdAt).toLocaleDateString('en-GB') : "--/--/--"}
                 </span>
              </div>
              <ChevronRight size={16} className="text-zinc-800 group-hover:text-[#afff00] group-hover:translate-x-1 transition-all" />
            </div>
          </Link>
        );
      })}
    </div>
  );
}