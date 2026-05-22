"use client";

import { Trash2, ArrowLeft, SendHorizontal, Mail, Type } from "lucide-react";
import Button3D from "@/components/ui/Button3D";
import { NewMsgState, Message } from "@/types/messanger";
import { Dispatch, SetStateAction } from "react";

interface DetailViewProps {
  selected: Message | null;
  isComposing: boolean;
  loading: boolean;
  replyText: string;
  setReplyText: (t: string) => void;
  newMsg: NewMsgState;
  setNewMsg: Dispatch<SetStateAction<NewMsgState>>;
  onReturn: () => void;
  onSendReply: () => void;
  onSendNew: (e: React.FormEvent) => void;
  onDeleteSingle: (id: string) => void;
  setIsComposing: (v: boolean) => void;
}

export const DetailView = ({ ...props }: DetailViewProps) => {
  const isVisible = props.selected || props.isComposing;
  
  const thread = props.selected?.items ? [...props.selected.items].sort((a, b) => 
    new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  ) : [];

  return (
    <div className={`fixed inset-0 md:relative md:flex-1 flex flex-col bg-zinc-950 z-50 md:z-10 ${isVisible ? "flex" : "hidden md:flex"} h-full overflow-hidden border-l border-zinc-900`}>
      
      {isVisible && (
        <button onClick={props.onReturn} className="md:hidden absolute top-6 left-6 z-50 p-3 bg-zinc-900 rounded-full text-white">
          <ArrowLeft size={20} />
        </button>
      )}

      <div className="flex-1 overflow-y-auto p-8 md:p-12 space-y-10 custom-scroll pb-40">
        {props.isComposing ? (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-3xl mx-auto space-y-8">
             <div className="space-y-1 border-l-2 border-[#afff00] pl-6">
                <h2 className="text-2xl font-bold text-white tracking-tight">Compose Message</h2>
                <p className="text-zinc-500 text-sm">Direct outreach from Luka Jokic Panel.</p>
             </div>
             
             <form onSubmit={props.onSendNew} className="space-y-6">
                <div className="space-y-4">
                    <div className="relative">
                        <input placeholder="Recipient Email" className="w-full p-4 bg-zinc-900/50 border border-zinc-800 rounded-xl outline-none focus:border-[#afff00] text-sm text-white transition-all pl-12" value={props.newMsg.to} onChange={e => props.setNewMsg(prev => ({...prev, to: e.target.value}))} required />
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600" size={18} />
                    </div>

                    <div className="relative">
                        <input placeholder="Subject Line" className="w-full p-4 bg-zinc-900/50 border border-zinc-800 rounded-xl outline-none focus:border-[#afff00] text-sm text-white transition-all pl-12" value={props.newMsg.subject} onChange={e => props.setNewMsg(prev => ({...prev, subject: e.target.value}))} required />
                        <Type className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600" size={18} />
                    </div>

                    <textarea placeholder="Write your message here..." className="w-full h-80 p-5 bg-zinc-900/50 border border-zinc-800 rounded-xl outline-none focus:border-[#afff00] text-sm text-white whitespace-pre-wrap leading-relaxed resize-none" value={props.newMsg.content} onChange={e => props.setNewMsg(prev => ({...prev, content: e.target.value}))} required />
                </div>
                <div className="flex justify-end">
                    <Button3D primary type="submit" className="px-12 py-4 text-xs font-black uppercase tracking-widest">
                        {props.loading ? "Sending..." : "Send Message"}
                    </Button3D>
                </div>
             </form>
          </div>
        ) : props.selected ? (
          <div className="animate-in fade-in slide-in-from-right-4 duration-500 max-w-4xl mx-auto space-y-12">
            <div className="flex justify-between items-center border-b border-zinc-900 pb-10">
              <div className="flex items-center gap-5">
                <div className="w-14 h-14 bg-[#afff00] rounded-2xl flex items-center justify-center text-black font-black text-xl">
                    {props.selected.firstName[0]}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white tracking-tight leading-tight">
                    {props.selected.firstName} {props.selected.lastName}
                  </h3>
                  <p className="text-sm text-zinc-500 font-medium">{props.selected.email}</p>
                </div>
              </div>
              <button onClick={() => props.onDeleteSingle(props.selected!.id)} className="p-3 text-zinc-600 hover:text-red-500 transition-all">
                <Trash2 size={20} />
              </button>
            </div>

            <div className="flex flex-col gap-10">
              {thread.map((item) => (
                <div key={item.id} className={`flex flex-col max-w-[90%] md:max-w-[75%] ${item.sender === 'admin' ? 'items-end ml-auto' : 'items-start'}`}>
                  <div className={`p-6 rounded-2xl text-[15px] leading-relaxed whitespace-pre-wrap w-full border ${item.sender === 'admin' ? 'bg-zinc-900 border-zinc-800 text-white shadow-xl' : 'bg-zinc-900/30 border-zinc-800 text-zinc-400'}`}>
                    {item.content}
                  </div>
                  <span className="text-[10px] text-zinc-600 mt-3 font-medium uppercase tracking-widest">
                    {item.sender === 'admin' ? 'Luka Jokic' : 'Client'} — {new Date(item.createdAt).toLocaleString('en-US')}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-zinc-800">
            <Mail size={80} strokeWidth={1} className="opacity-20" />
            <p className="font-bold uppercase tracking-[0.2em] text-xs mt-6 opacity-40">Select a conversation</p>
          </div>
        )}
      </div>

      {!props.isComposing && props.selected && (
        <div className="p-8 bg-zinc-950 border-t border-zinc-900">
          <div className="max-w-4xl mx-auto flex items-end gap-5">
            <textarea placeholder="Write a response..." className="flex-1 min-h-15 max-h-50 p-5 bg-zinc-900/50 border border-zinc-800 rounded-2xl outline-none focus:border-[#afff00] text-sm text-white whitespace-pre-wrap resize-none transition-all" value={props.replyText} onChange={(e) => props.setReplyText(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter' && e.ctrlKey) props.onSendReply(); }} />
            <button onClick={props.onSendReply} disabled={props.loading || !props.replyText} className={`p-5 rounded-2xl transition-all ${props.replyText ? 'bg-[#afff00] text-black hover:scale-105 active:scale-95' : 'bg-zinc-900 text-zinc-700'}`}>
              {props.loading ? <div className="w-6 h-6 border-2 border-black border-t-transparent rounded-full animate-spin" /> : <SendHorizontal size={26} />}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};