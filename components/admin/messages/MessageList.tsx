import { Search} from "lucide-react";
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
  selectMessage: (m: Message) => void;
  selectedId?: string;
  isVisible: boolean;
}

export const MessageList = ({ isVisible, ...props }: MessageListProps) => (
  <div className={`w-full md:w-100 border-r border-zinc-800 flex-col bg-zinc-950/20 ${isVisible ? "flex" : "hidden md:flex"} h-full pb-20 md:pb-0 custom-scroll`}>
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
        <input 
          value={props.searchQuery} 
          onChange={(e) => props.setSearchQuery(e.target.value)} 
          placeholder="SEARCH_SIGNAL" 
          className="w-full pl-9 pr-4 py-3 bg-zinc-900/50 border border-zinc-800 rounded-xl text-[10px] uppercase font-bold tracking-widest outline-none focus:border-[#afff00]" 
        />
      </div>
    </div>

    <div className="flex-1 overflow-y-auto divide-y divide-zinc-900/50">
      {props.paginatedData.map((m) => (
        <div 
          key={m.id} 
          onClick={() => props.selectMessage(m)} 
          className={`p-6 md:p-6 transition-all flex gap-4 items-center active:bg-[#afff00]/5 ${props.selectedId === m.id ? "bg-[#afff00]/5" : ""}`}
        >
          {m.status === "unread" && <div className="w-1.5 h-1.5 bg-red-600 rounded-full shadow-[0_0_8px_red] shrink-0" />}
          
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-center mb-1">
              <span className={`text-xs uppercase italic truncate ${m.status === "unread" ? "font-black text-white" : "text-zinc-500 font-bold"}`}>
                {m.firstName} {m.lastName}
              </span>
              <span className="text-[8px] font-mono text-zinc-700 italic">{m.createdAt ? new Date(m.createdAt).toLocaleDateString() : ""}</span>
            </div>
            <p className="text-[10px] text-zinc-600 truncate leading-relaxed">
              {props.activeTab === "sent" ? m.replyContent : m.message}
            </p>
          </div>
        </div>
      ))}
    </div>
  </div>
);