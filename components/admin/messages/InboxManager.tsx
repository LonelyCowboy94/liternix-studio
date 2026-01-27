"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import {
  getMessages,
  markAsRead,
  sendReplyAction,
  deleteMessageAction,
  sendNewMessageAction,
  deleteMessagesBulkAction,
} from "@/app/api/contact/actions";
import {
  Terminal,
  Search,
  Trash2,
  Plus,
  X,
  Send,
  Inbox,
  ChevronLeft,
  Square,
  CheckSquare,
} from "lucide-react";

interface Message {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  company: string | null;
  message: string;
  status: "unread" | "read" | "replied" | null;
  replyContent: string | null;
  repliedAt: Date | null;
  createdAt: Date | null;
}

const PAGE_SIZE = 20;

export default function InboxManager() {
  const [list, setList] = useState<Message[]>([]);
  const [selected, setSelected] = useState<Message | null>(null);
  const [activeTab, setActiveTab] = useState<"inbox" | "sent">("inbox");
  const [isComposing, setIsComposing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [replyText, setReplyText] = useState("");

  // Search, Selection, Pagination
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);

  // New message (Compose) state
  const [newMsg, setNewMsg] = useState({ to: "", subject: "", content: "" });

  const loadMessages = useCallback(async () => {
    const data = await getMessages();
    setList(data as unknown as Message[]);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      await loadMessages();
    };
    fetchData();
  }, [loadMessages]);

  // --- FILTER & SEARCH LOGIC ---
  const filteredData = useMemo(() => {
    let data = list;

    if (activeTab === "inbox") {
      data = data.filter((m) => m.status === "unread" || m.status === "read");
    } else {
      data = data.filter((m) => m.status === "replied");
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      data = data.filter(
        (m) =>
          m.firstName.toLowerCase().includes(q) ||
          m.lastName.toLowerCase().includes(q) ||
          m.email.toLowerCase().includes(q)
      );
    }
    return data;
  }, [list, activeTab, searchQuery]);

  // --- PAGINATION LOGIC ---
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredData.slice(start, start + PAGE_SIZE);
  }, [filteredData, currentPage]);

  useEffect(() => {
    return () => {
      setCurrentPage(1);
      setSelectedIds(new Set());
    };
  }, []);

  useEffect(() => {
    return () => {
    setCurrentPage(1);
    setSelectedIds(new Set());
    };
  }, [searchQuery, activeTab]);

  // --- ACTIONS ---
  const selectMessage = async (m: Message) => {
    setIsComposing(false);
    setSelected(m);
    setReplyText("");
    if (m.status === "unread") {
      await markAsRead(m.id);
      loadMessages();
    }
  };

  const toggleSelect = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const newSet = new Set(selectedIds);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setSelectedIds(newSet);
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === paginatedData.length && paginatedData.length > 0) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(paginatedData.map((m) => m.id)));
    }
  };

  const handleBulkDelete = async () => {
    if (!confirm(`Delete ${selectedIds.size} selected messages?`)) return;
    setLoading(true);
    const res = await deleteMessagesBulkAction(Array.from(selectedIds));
    if (res.success) {
      setSelectedIds(new Set());
      if (selected && selectedIds.has(selected.id)) setSelected(null);
      await loadMessages();
    }
    setLoading(false);
  };

  const handleSingleDelete = async (id: string) => {
    if (!confirm("Delete this message permanently?")) return;
    const res = await deleteMessageAction(id);
    if (res.success) {
      setSelected(null);
      await loadMessages();
    }
  };

  const handleSendReply = async () => {
    if (!replyText || !selected) return;
    setLoading(true);
    const res = await sendReplyAction(selected.id, selected.email, replyText);
    if (res.success) {
      setReplyText("");
      setSelected(null);
      await loadMessages();
      setActiveTab("sent");
    }
    setLoading(false);
  };

  const handleSendNew = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await sendNewMessageAction(newMsg.to, newMsg.subject, newMsg.content);
    if (res.success) {
      setIsComposing(false);
      setNewMsg({ to: "", subject: "", content: "" });
      await loadMessages();
      setActiveTab("sent");
    }
    setLoading(false);
  };

 return (
  <div className="flex flex-col md:flex-row h-screen md:h-212.5 bg-black border border-zinc-800 overflow-hidden shadow-2xl relative text-white">
    {/* GLOBAL SCANLINE */}
    <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%)] bg-size-[100%_4px] z-0" />

    {/* 1. SIDEBAR NAVIGATION - STUDIO_CTRL */}
    <div className="bottom-0 left-0 right-0 z-50 h-20 bg-black flex py-15 md:relative md:h-full md:w-24 md:flex-col items-center justify-around md:justify-start md:py-10 gap-0 md:gap-10 border-t md:border-t-0 md:border-r border-zinc-800 shadow-[0_-10px_30px_rgba(0,0,0,0.5)] md:shadow-none relative">
      <button
        onClick={() => { setActiveTab("inbox"); setIsComposing(false); setSelected(null); }}
        className={`p-4 rounded-2xl transition-all duration-500 ${activeTab === "inbox" && !isComposing ? "bg-[#afff00] text-black shadow-[0_0_20px_rgba(175,255,0,0.4)] scale-110" : "text-zinc-600 hover:text-[#afff00]"}`}
      >
        <Inbox size={26} strokeWidth={activeTab === "inbox" ? 3 : 2} />
        <span className="text-[8px] block md:hidden font-black mt-1 uppercase tracking-widest">Inbox</span>
      </button>
      <button
        onClick={() => { setActiveTab("sent"); setIsComposing(false); setSelected(null); }}
        className={`p-4 rounded-2xl transition-all duration-500 ${activeTab === "sent" && !isComposing ? "bg-[#afff00] text-black shadow-[0_0_20px_rgba(175,255,0,0.4)] scale-110" : "text-zinc-600 hover:text-[#afff00]"}`}
      >
        <Send size={26} strokeWidth={activeTab === "sent" ? 3 : 2} />
        <span className="text-[8px] block md:hidden font-black mt-1 uppercase tracking-widest">Sent</span>
      </button>
      <button
        onClick={() => { setIsComposing(true); setSelected(null); }}
        className={`p-4 rounded-2xl transition-all md:mt-auto duration-500 ${isComposing ? "bg-[#afff00] text-black shadow-[0_0_20px_rgba(175,255,0,0.4)] scale-110" : "bg-zinc-900 text-[#afff00] hover:bg-zinc-800 border border-zinc-800"}`}
      >
        <Plus size={26} strokeWidth={3} />
        <span className="text-[8px] block md:hidden font-black mt-1 uppercase tracking-widest">New</span>
      </button>
    </div>

    {/* 2. MESSAGE LIST COLUMN - SIGNAL_ARCHIVE */}
    <div className={`w-full md:w-100 border-r border-zinc-800 flex-col bg-zinc-900/20 backdrop-blur-sm ${selected || isComposing ? "hidden md:flex" : "flex"} relative z-10`}>
      <div className="p-8 border-b border-zinc-800 space-y-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
             <div className="w-1.5 h-1.5 bg-[#afff00] rounded-full animate-pulse" />
             <h2 className="text-2xl font-black uppercase italic tracking-tighter text-white">{activeTab}_Feed</h2>
          </div>
          {selectedIds.size > 0 && (
            <button
              onClick={handleBulkDelete}
              className="text-red-500 bg-red-500/10 border border-red-500/20 px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 text-[10px] font-black uppercase active:scale-95"
            >
              <Trash2 size={14} /> Purge ({selectedIds.size})
            </button>
          )}
        </div>

        <div className="relative group">
          <Search className="absolute left-3 top-3.5 text-zinc-600 group-focus-within:text-[#afff00] transition-colors" size={16} />
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search_Signal..."
            className="w-full pl-10 pr-4 py-3 bg-black border border-zinc-800 rounded-xl text-xs uppercase font-bold tracking-widest outline-none focus:border-[#afff00] transition-all"
          />
        </div>

        {paginatedData.length > 0 && (
          <button onClick={toggleSelectAll} className="flex items-center gap-2 px-1 group">
            <div className={`transition-colors ${selectedIds.size === paginatedData.length ? "text-[#afff00]" : "text-zinc-800 group-hover:text-zinc-600"}`}>
              {selectedIds.size === paginatedData.length ? <CheckSquare size={18} /> : <Square size={18} />}
            </div>
            <span className="text-[9px] font-black text-zinc-600 uppercase tracking-[0.2em] group-hover:text-zinc-400">Select_All_In_Range</span>
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto pb-24 md:pb-0 divide-y divide-zinc-900">
        {paginatedData.length > 0 ? (
          paginatedData.map((m) => (
            <div
              key={m.id}
              onClick={() => selectMessage(m)}
              className={`p-6 cursor-pointer transition-all flex gap-4 items-center relative group ${selected?.id === m.id ? "bg-[#afff00]/5 border-r-2 border-r-[#afff00]" : "hover:bg-zinc-900/50"}`}
            >
              {m.status === "unread" && (
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-red-600 shadow-[0_0_10px_red]" />
              )}
              <button
                onClick={(e) => toggleSelect(m.id, e)}
                className={`transition-colors shrink-0 ${selectedIds.has(m.id) ? "text-[#afff00]" : "text-zinc-800 group-hover:text-zinc-600"}`}
              >
                {selectedIds.has(m.id) ? <CheckSquare size={18} /> : <Square size={18} />}
              </button>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline mb-1">
                  <p className={`text-sm uppercase italic tracking-tight truncate ${m.status === "unread" ? "font-black text-white" : "font-bold text-zinc-500"}`}>
                    {m.firstName} {m.lastName}
                  </p>
                  <span className="text-[9px] font-black text-zinc-700 whitespace-nowrap ml-2 italic">
                    {m.createdAt ? new Date(m.createdAt).toLocaleDateString('en-GB') : ""}
                  </span>
                </div>
                <p className={`text-[11px] truncate font-medium ${m.status === "unread" ? "text-[#afff00]/70" : "text-zinc-600"}`}>
                  {activeTab === "sent" ? m.replyContent : m.message}
                </p>
              </div>
            </div>
          ))
        ) : (
          <div className="p-20 text-center flex flex-col items-center gap-4">
            <div className="p-6 bg-zinc-900/50 rounded-full text-zinc-800 border border-zinc-800"><Inbox size={40} strokeWidth={1}/></div>
            <p className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.4em] italic">{"//"} ARCHIVE_EMPTY</p>
          </div>
        )}
      </div>
    </div>

    {/* 3. DETAIL VIEW AREA - SIGNAL_TERMINAL */}
    <div className={`flex-1 flex-col bg-black relative overflow-hidden ${selected || isComposing ? "flex" : "hidden md:flex"}`}>
      
      {/* Mobile Back Button */}
      {(selected || isComposing) && (
        <div className="md:hidden flex items-center p-6 border-b border-zinc-800 bg-black sticky top-0 z-20">
          <button onClick={() => { setSelected(null); setIsComposing(false); }} className="flex items-center gap-2 text-[#afff00] font-black uppercase text-xs tracking-widest italic">
            <ChevronLeft size={20} /> Return_To_Feed
          </button>
        </div>
      )}

      {isComposing ? (
        <div className="flex-1 flex flex-col animate-in slide-in-from-bottom-6 duration-500">
          <div className="p-8 md:p-12 border-b border-zinc-800 hidden md:flex justify-between items-center">
            <h2 className="text-3xl font-black uppercase italic flex items-center gap-4">
              <Plus className="text-[#afff00]" size={32} strokeWidth={3} /> Initialize_New_Signal
            </h2>
            <button onClick={() => setIsComposing(false)} className="p-2 hover:bg-zinc-900 rounded-full text-zinc-600 transition-colors"><X size={28} /></button>
          </div>
          <form onSubmit={handleSendNew} className="p-8 md:p-16 flex-1 space-y-10 overflow-y-auto w-full max-w-5xl mx-auto">
            {/* Notched Style Inputs */}
            <div className="relative group">
              <input placeholder=" " className="peer w-full p-5 bg-transparent border border-zinc-800 rounded-xl outline-none focus:border-[#afff00] transition-all font-black uppercase italic tracking-widest text-sm" value={newMsg.to} onChange={e => setNewMsg({...newMsg, to: e.target.value})} required />
              <label className="absolute left-3 -top-2.5 px-2 bg-black text-[10px] font-black uppercase tracking-widest text-zinc-500 transition-all peer-placeholder-shown:top-5 peer-placeholder-shown:text-xs peer-focus:-top-2.5 peer-focus:text-[#afff00] pointer-events-none italic">Signal_Recipient</label>
            </div>
            
            <div className="relative group">
              <input placeholder=" " className="peer w-full p-5 bg-transparent border border-zinc-800 rounded-xl outline-none focus:border-[#afff00] transition-all font-black uppercase italic tracking-widest text-sm" value={newMsg.subject} onChange={e => setNewMsg({...newMsg, subject: e.target.value})} required />
              <label className="absolute left-3 -top-2.5 px-2 bg-black text-[10px] font-black uppercase tracking-widest text-zinc-500 transition-all peer-placeholder-shown:top-5 peer-placeholder-shown:text-xs peer-focus:-top-2.5 peer-focus:text-[#afff00] pointer-events-none italic">Subject_Header</label>
            </div>

            <div className="relative group">
              <textarea placeholder=" " className="peer w-full h-80 p-6 bg-transparent border border-zinc-800 rounded-2xl outline-none focus:border-[#afff00] transition-all resize-none font-bold text-base leading-relaxed" value={newMsg.content} onChange={e => setNewMsg({...newMsg, content: e.target.value})} required />
              <label className="absolute left-3 -top-2.5 px-2 bg-black text-[10px] font-black uppercase tracking-widest text-zinc-500 transition-all peer-placeholder-shown:top-6 peer-placeholder-shown:text-xs peer-focus:-top-2.5 peer-focus:text-[#afff00] pointer-events-none italic">Signal_Data_Payload</label>
            </div>

            <button disabled={loading} className="w-full md:w-auto bg-[#afff00] text-black px-12 py-5 rounded-2xl font-black italic uppercase tracking-[0.2em] flex items-center justify-center gap-4 hover:scale-[1.02] active:scale-95 transition-all shadow-[0_0_30px_rgba(175,255,0,0.2)]">
              {loading ? "TRANSMITTING..." : <><Send size={22} strokeWidth={3} /> Deploy_Signal</>}
            </button>
          </form>
        </div>
      ) : selected ? (
        <div className="flex-1 flex flex-col overflow-hidden animate-in slide-in-from-right-6 duration-500 pb-24 md:pb-0">
          <div className="p-8 md:p-12 overflow-y-auto flex-1 space-y-12">
            <div className="flex flex-col md:flex-row justify-between items-start gap-6 border-b border-zinc-900 pb-10">
              <div className="flex items-center gap-5">
                <div className="w-16 h-16 bg-[#afff00] rounded-2xl flex items-center justify-center text-black font-black text-2xl italic shadow-[0_0_20px_rgba(175,255,0,0.2)]">
                  {selected.firstName[0]}
                </div>
                <div>
                  <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter leading-tight">{selected.firstName} {selected.lastName}</h2>
                  <p className="text-xs text-zinc-500 font-bold uppercase tracking-widest mt-1">{selected.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-6 self-end md:self-start">
                <div className="text-right hidden sm:block">
                  <p className="text-[10px] font-black text-zinc-700 uppercase tracking-[0.3em]">Timestamp</p>
                  <p className="text-[11px] font-black text-[#afff00] italic">{new Date(selected.createdAt!).toLocaleString('en-GB')}</p>
                </div>
                <button onClick={() => handleSingleDelete(selected.id)} className="p-3 bg-zinc-900 text-zinc-600 hover:text-red-500 border border-zinc-800 rounded-xl transition-all"><Trash2 size={24} /></button>
              </div>
            </div>

            {/* MESSAGE BODY */}
            {!selected.message.startsWith("[OUTGOING]") && (
              <div className="bg-zinc-900/40 p-8 md:p-12 rounded-[2.5rem] border border-zinc-800 text-white leading-relaxed whitespace-pre-wrap text-base md:text-xl font-medium italic shadow-inner">
                <div className="text-[9px] font-black text-zinc-700 uppercase tracking-[0.4em] mb-6 block border-b border-zinc-800 pb-2">{"//"} Received_Payload</div>
                {selected.message}
              </div>
            )}

            {/* RESPONSE BODY */}
            {selected.status === "replied" && (
              <div className="bg-[#afff00]/5 p-8 md:p-12 rounded-[2.5rem] border border-[#afff00]/20 shadow-[0_0_40px_rgba(175,255,0,0.05)]">
                <div className="flex items-center gap-3 text-[#afff00] font-black mb-6 uppercase tracking-[0.4em] text-[10px] italic">
                   <div className="w-2 h-2 bg-[#afff00] rounded-full animate-pulse" /> Official_Transmission_Response
                </div>
                <div className="text-zinc-300 whitespace-pre-wrap text-base md:text-lg leading-relaxed font-bold">{selected.replyContent}</div>
              </div>
            )}
          </div>

          {/* REPLY INPUT AREA */}
          {selected.status !== "replied" && (
            <div className="p-6 md:p-12 border-t border-zinc-800 bg-black/80 backdrop-blur-xl">
              <div className="relative group mb-6">
                <textarea
                  placeholder=" "
                  className="peer w-full h-40 p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800 outline-none focus:border-[#afff00] transition-all resize-none text-base font-bold italic"
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                />
                <label className="absolute left-3 -top-2.5 px-2 bg-black text-[10px] font-black uppercase tracking-widest text-zinc-600 transition-all peer-placeholder-shown:top-6 peer-focus:-top-2.5 peer-focus:text-[#afff00] pointer-events-none italic">Compose_Response</label>
              </div>
              <button
                disabled={loading || !replyText}
                onClick={handleSendReply}
                className="w-full md:w-auto float-right bg-white text-black px-12 py-4 rounded-xl font-black italic uppercase tracking-widest text-xs hover:bg-[#afff00] transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)] active:scale-95"
              >
                {loading ? "TRANSMITTING..." : "DEPLOY_RESPONSE"}
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center text-zinc-900 animate-in fade-in duration-1000">
          <Terminal size={140} strokeWidth={0.5} className="opacity-10" />
          <p className="font-black uppercase tracking-[0.5em] text-[10px] text-zinc-800 mt-6 italic">{"//"} Waiting_For_Signal_Selection</p>
        </div>
      )}
    </div>
  </div>
);
}