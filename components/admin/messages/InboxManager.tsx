"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import {
  getMessages, markAsRead, sendReplyAction, deleteMessageAction,
  sendNewMessageAction, deleteMessagesBulkAction,
} from "@/app/api/contact/actions";
import { Message, NewMsgState } from "@/types/messanger";
import { Sidebar } from "./Sidebar";
import { MessageList } from "./MessageList";
import { DetailView } from "./DetailView";

const PAGE_SIZE = 20;

export default function InboxManager() {
  const[list, setList] = useState<Message[]>([]);
  const [selected, setSelected] = useState<Message | null>(null);
  const [activeTab, setActiveTab] = useState<"inbox" | "sent">("inbox");
  const [isComposing, setIsComposing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [replyText, setReplyText] = useState("");
  const[searchQuery, setSearchQuery] = useState("");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const[newMsg, setNewMsg] = useState<NewMsgState>({ to: "", subject: "", content: "" });

  const refreshData = useCallback(async () => {
    const data = await getMessages();
    const formatted = data as unknown as Message[];
    setList(formatted);
    return formatted; // Vraćamo vrednost da bi useEffect mogao da je iskoristi sigurno
  },[]);

  // FIX: AUTO-REFRESH BEZ ESLINT GREŠAKA
  useEffect(() => {
    let ignore = false;

    async function tick() {
      const data = await getMessages();
      if (!ignore) {
        const formatted = data as unknown as Message[];
        setList(formatted);
        
        // Bezbedno ažuriranje selektovane poruke da zadržimo prikaz
        setSelected(current => {
          if (!current) return null;
          return formatted.find(m => m.id === current.id) || current;
        });
      }
    }

    tick(); // Pokreće se odmah na učitavanju
    const interval = setInterval(tick, 5000); // Ponovo svakih 5 sekundi

    return () => {
      ignore = true;
      clearInterval(interval);
    };
  },[]); // Prazan array = siguran useEffect koji se montira samo jednom

  const filteredData = useMemo(() => {
    let data = list;
    if (activeTab === "inbox") {
      data = data.filter((m) => ["unread", "read", "replied"].includes(m.status || ""));
    } else {
      data = data.filter((m) => m.status === "replied");
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      data = data.filter(m => 
        (m.firstName ?? "").toLowerCase().includes(q) || 
        (m.lastName ?? "").toLowerCase().includes(q) || 
        (m.email ?? "").toLowerCase().includes(q) ||
        (m.company ?? "").toLowerCase().includes(q)
      );
    }
    return data;
  }, [list, activeTab, searchQuery]);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredData.slice(start, start + PAGE_SIZE);
  }, [filteredData, currentPage]);

  const unreadCount = useMemo(() => list.filter(m => m.status === "unread").length, [list]);

  const handleTabChange = (tab: "inbox" | "sent") => {
    setActiveTab(tab);
    setCurrentPage(1);
    setSelectedIds(new Set());
    setIsComposing(false);
    setSelected(null);
  };

  const selectMessage = async (m: Message) => {
    setIsComposing(false);
    setSelected(m);
    setReplyText("");
    if (m.status === "unread") {
      await markAsRead(m.id);
      await refreshData();
    }
  };

  const handleSendReply = async () => {
    if (!replyText || !selected) return;
    setLoading(true);
    const res = await sendReplyAction(selected.id, selected.email, replyText);
    if (res.success) { 
      setReplyText(""); 
      const updatedList = await refreshData(); 
      setSelected(updatedList.find(m => m.id === selected.id) || null);
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
      await refreshData(); 
      setActiveTab("sent"); 
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col md:flex-row h-dvh bg-black border border-zinc-800 max-h-[calc(100vh-80px)] overflow-hidden relative text-white">
      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,1)_50%)] bg-size-[100%_4px] z-50 opacity-10" />
      
      <Sidebar 
        activeTab={activeTab} 
        isComposing={isComposing} 
        unreadCount={unreadCount}
        onTabChange={handleTabChange}
        onComposeClick={() => { setIsComposing(true); setSelected(null); }}
      />

      <MessageList 
        activeTab={activeTab}
        searchQuery={searchQuery}
        setSearchQuery={(q) => { setSearchQuery(q); setCurrentPage(1); }}
        selectedIds={selectedIds}
        toggleSelect={(id, e) => {
          e.stopPropagation();
          const n = new Set(selectedIds);
          if (n.has(id)) n.delete(id); else n.add(id);
          setSelectedIds(n);
        }}
        toggleSelectAll={() => {
          if (selectedIds.size === paginatedData.length) setSelectedIds(new Set());
          else setSelectedIds(new Set(paginatedData.map(m => m.id)));
        }}
        handleBulkDelete={async () => {
          if (confirm(`Delete ${selectedIds.size}?`)) {
            await deleteMessagesBulkAction(Array.from(selectedIds));
            setSelectedIds(new Set());
            setSelected(null);
            refreshData();
          }
        }}
        paginatedData={paginatedData}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        totalItems={filteredData.length}
        pageSize={PAGE_SIZE}
        selectMessage={selectMessage}
        selectedId={selected?.id}
        isVisible={!selected && !isComposing} 
      />

      <DetailView 
        selected={selected}
        isComposing={isComposing}
        loading={loading}
        replyText={replyText}
        setReplyText={setReplyText}
        newMsg={newMsg}
        setNewMsg={setNewMsg}
        onReturn={() => { setSelected(null); setIsComposing(false); }}
        onSendReply={handleSendReply}
        onSendNew={handleSendNew}
        onDeleteSingle={async (id) => {
          if (confirm("Delete?")) { await deleteMessageAction(id); setSelected(null); refreshData(); }
        }}
        setIsComposing={setIsComposing}
      />
    </div>
  );
}