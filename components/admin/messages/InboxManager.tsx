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
  const [list, setList] = useState<Message[]>([]);
  const [selected, setSelected] = useState<Message | null>(null);
  const [activeTab, setActiveTab] = useState<"inbox" | "sent">("inbox");
  const [isComposing, setIsComposing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [newMsg, setNewMsg] = useState<NewMsgState>({ to: "", subject: "", content: "" });

  const loadMessages = useCallback(async () => {
    const data = await getMessages();
    setList(data as unknown as Message[]);
  }, []);

  useEffect(() => {
    const fetchMessages = () => {
  loadMessages();
    }
  fetchMessages();
  }, [loadMessages]);

  const filteredData = useMemo(() => {
    let data = list;
    data = activeTab === "inbox" 
      ? data.filter((m) => m.status === "unread" || m.status === "read") 
      : data.filter((m) => m.status === "replied");

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      data = data.filter(m => 
        m.firstName.toLowerCase().includes(q) || 
        m.lastName.toLowerCase().includes(q) || 
        m.email.toLowerCase().includes(q)
      );
    }
    return data;
  }, [list, activeTab, searchQuery]);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredData.slice(start, start + PAGE_SIZE);
  }, [filteredData, currentPage]);

  const handleTabChange = (tab: "inbox" | "sent") => {
    setActiveTab(tab);
    setCurrentPage(1);
    setSelectedIds(new Set());
    setIsComposing(false);
    setSelected(null);
  };

  const handleSearchChange = (q: string) => {
    setSearchQuery(q);
    setCurrentPage(1);
    setSelectedIds(new Set());
  };

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
    if (newSet.has(id)) newSet.delete(id); else newSet.add(id);
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
    if (!confirm(`Delete ${selectedIds.size} messages?`)) return;
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
    if (!confirm("Delete permanently?")) return;
    const res = await deleteMessageAction(id);
    if (res.success) { setSelected(null); await loadMessages(); }
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
    <div className="flex flex-col md:flex-row h-dvh bg-black border border-zinc-800 max-h-[calc(100vh-80px)] overflow-hidden relative text-white">
      {/* GLOBAL SCANLINE */}
      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,1)_50%)] bg-size-[100%_4px] z-50 opacity-10" />
      
      {/* 1. SIDEBAR */}
      <Sidebar 
        activeTab={activeTab} 
        isComposing={isComposing} 
        onTabChange={(tab) => {
          setTimeout(() => handleTabChange(tab), 100);
        }}
        onComposeClick={() => {
          setTimeout(() => { setIsComposing(true); setSelected(null); }, 100);
        }}
      />

      {/* 2. MESSAGES LIST */}
      <MessageList 
        activeTab={activeTab}
        searchQuery={searchQuery}
        setSearchQuery={handleSearchChange}
        selectedIds={selectedIds}
        toggleSelect={toggleSelect}
        toggleSelectAll={toggleSelectAll}
        handleBulkDelete={handleBulkDelete}
        paginatedData={paginatedData}
        selectMessage={selectMessage}
        selectedId={selected?.id}
        isVisible={!selected && !isComposing} 
      />

      {/* 3. TERMINAL (Details) */}
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
        onDeleteSingle={handleSingleDelete}
        setIsComposing={setIsComposing}
      />
    </div>
  );
}