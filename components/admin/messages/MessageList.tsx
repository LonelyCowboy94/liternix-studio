"use client";

import { Search, CheckCircle2, ChevronLeft, ChevronRight } from "lucide-react";
import { Message } from "@/types/messanger";

interface MessageListProps {
  activeTab: string;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedIds: Set<string>;
  toggleSelect: (id: string, e: React.MouseEvent) => void;
  toggleSelectAll: () => void;
  handleBulkDelete: () => void;
  paginatedData: Message[];
  currentPage: number;
  setCurrentPage: (p: number) => void;
  totalItems: number;
  pageSize: number;
  selectMessage: (m: Message) => void;
  selectedId?: string;
  isVisible: boolean;
}

export const MessageList = ({ isVisible, ...props }: MessageListProps) => {
  const totalPages = Math.ceil(props.totalItems / props.pageSize);

  return (
    <div className={`w-full md:w-100 border-r border-zinc-800 flex-col bg-zinc-950/20 ${isVisible ? "flex" : "hidden md:flex"} h-full overflow-hidden`}>
      <div className="p-6 md:p-8 border-b border-zinc-800 bg-black/40 backdrop-blur-md sticky top-0 z-20">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-black uppercase italic tracking-tighter text-[#afff00] flex items-center gap-2">
            <div className="w-1 h-4 bg-[#afff00]" /> {props.activeTab}_FEED
          </h2>
          {props.selectedIds.size > 0 && (
            <button onClick={props.handleBulkDelete} className="text-red-500 text-[10px] font-black uppercase border border-red-500/30 px-3 py-1.5 rounded-lg bg-red-500/5">
              PURGE ({props.selectedIds.size})
            </button>
          )}
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600" size={14} />
          <input value={props.searchQuery} onChange={(e) => props.setSearchQuery(e.target.value)} placeholder="SEARCH_SIGNAL" className="w-full pl-9 pr-4 py-3 bg-zinc-900/50 border border-zinc-800 rounded-xl text-[10px] uppercase font-bold tracking-widest outline-none focus:border-[#afff00]" />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto divide-y divide-zinc-900/50 custom-scroll">
        {props.paginatedData.map((m) => {
          const isUnread = m.status === "unread";
          return (
            <div 
              key={m.id} 
              onClick={() => props.selectMessage(m)} 
              className={`p-6 transition-all flex gap-4 items-center cursor-pointer relative
                ${isUnread ? "bg-[#afff00]/5 border-l-2 border-l-[#afff00]" : "hover:bg-zinc-900/10"}
                ${props.selectedId === m.id ? "bg-zinc-900/40" : ""}
              `}
            >
              {isUnread ? (
                <div className="w-2 h-2 bg-[#afff00] rounded-full shadow-[0_0_10px_#afff00] shrink-0" />
              ) : m.status === "replied" ? (
                <CheckCircle2 size={16} className="text-zinc-600 shrink-0" />
              ) : (
                <div className="w-2 h-2 bg-zinc-800 rounded-full shrink-0" />
              )}
              
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center mb-1">
                  <span className={`text-[11px] uppercase italic truncate ${isUnread ? "font-black text-[#afff00]" : "text-zinc-500 font-bold"}`}>
                    {m.firstName} {m.lastName}
                  </span>
                  <span className="text-[8px] font-mono text-zinc-700 italic">{m.createdAt ? new Date(m.createdAt).toLocaleDateString() : ""}</span>
                </div>
                <p className={`text-[10px] truncate leading-relaxed ${isUnread ? "text-zinc-300 font-bold" : "text-zinc-600"}`}>
                  {m.items && m.items.length > 0 ? m.items[0].content : "No content"}
                </p>
                <p className="text-[8px] text-zinc-700 mt-1 uppercase tracking-widest">{m.email}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* PAGINATION UI */}
      {totalPages > 1 && (
        <div className="p-4 border-t border-zinc-900 bg-black/40 flex items-center justify-between">
           <button 
            disabled={props.currentPage === 1}
            onClick={() => props.setCurrentPage(props.currentPage - 1)}
            className="p-2 text-zinc-500 hover:text-[#afff00] disabled:opacity-20"
           >
            <ChevronLeft size={18} />
           </button>
           <span className="text-[10px] font-black uppercase text-zinc-600 tracking-widest">
            Page {props.currentPage} / {totalPages}
           </span>
           <button 
            disabled={props.currentPage === totalPages}
            onClick={() => props.setCurrentPage(props.currentPage + 1)}
            className="p-2 text-zinc-500 hover:text-[#afff00] disabled:opacity-20"
           >
            <ChevronRight size={18} />
           </button>
        </div>
      )}
    </div>
  );
};