import { Trash2, Terminal, Plus} from "lucide-react";
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

  return (
    <div className={`fixed inset-0 py-12 md:py-0 md:relative md:flex-1 flex-col bg-black z-55 md:z-10 ${isVisible ? "flex" : "hidden md:flex"} h-full pb-20 md:pb-0`}>
  
      <div className="flex-1 overflow-y-auto p-6 md:p-12 space-y-8">
        {props.isComposing ? (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6">
             <h2 className="text-xl font-black uppercase italic text-white flex items-center gap-3">
               <Plus className="text-[#afff00]" size={20} /> INITIALIZE_NEW_SIGNAL
             </h2>
             <form onSubmit={props.onSendNew} className="space-y-6">
                <input placeholder="RECIPIENT_EMAIL" className="w-full p-4 bg-zinc-900/50 border border-zinc-800 rounded-xl outline-none focus:border-[#afff00] text-xs font-black uppercase tracking-widest text-white" value={props.newMsg.to} onChange={e => props.setNewMsg(prev => ({...prev, to: e.target.value}))} required />
                <textarea placeholder="PAYLOAD_CONTENT" className="w-full h-64 p-4 bg-zinc-900/50 border border-zinc-800 rounded-xl outline-none focus:border-[#afff00] text-sm font-medium leading-relaxed" value={props.newMsg.content} onChange={e => props.setNewMsg(prev => ({...prev, content: e.target.value}))} required />
                <Button3D primary type="submit" className="w-full md:w-50 ml-auto py-4 flex justify-center text-xs font-black uppercase italic tracking-widest">
                  {props.loading ? "TRANSMITTING..." : "DEPLOY_SIGNAL"}
                </Button3D>
             </form>
          </div>
        ) : props.selected ? (
          <div className="animate-in fade-in slide-in-from-right-4 duration-500 space-y-10">
            {/* Header poruke */}
            <div className="flex justify-between items-start border-b border-zinc-900 pb-8">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-[#afff00] rounded-xl flex items-center justify-center text-black font-black text-xl italic">{props.selected.firstName[0]}</div>
                <div>
                  <h3 className="text-lg font-black text-white uppercase italic tracking-tighter leading-tight">{props.selected.firstName} {props.selected.lastName}</h3>
                  <p className="text-[9px] text-zinc-500 font-bold uppercase tracking-[0.2em]">{props.selected.email}</p>
                </div>
              </div>
              <button onClick={() => props.onDeleteSingle(props.selected!.id)} className="p-2 text-zinc-600 hover:text-red-500"><Trash2 size={20} /></button>
            </div>

            {/* Sadržaj */}
            <div className="bg-zinc-900/40 p-6 md:p-8 rounded-4xl border border-zinc-800 text-sm md:text-base leading-relaxed italic text-white/90">
               <span className="text-[8px] font-black text-zinc-700 uppercase tracking-widest block mb-4 border-b border-zinc-800 pb-2">REC_PAYLOAD_V2.0</span>
               {props.selected.message}
            </div>

            {/* Reply Input */}
            {props.selected.status !== "replied" && (
              <div className="space-y-4">
                <textarea placeholder="COMPOSE_RESPONSE..." className="w-full h-32 p-4 bg-zinc-900/50 border border-zinc-800 rounded-xl outline-none focus:border-[#afff00] text-sm italic font-bold" value={props.replyText} onChange={(e) => props.setReplyText(e.target.value)} />
                <button onClick={props.onSendReply} disabled={props.loading || !props.replyText} className="w-full py-4 bg-white text-black font-black uppercase text-[10px] tracking-widest hover:bg-[#afff00] transition-colors rounded-xl">
                  {props.loading ? "TRANSMITTING..." : "DEPLOY_RESPONSE"}
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-zinc-900 opacity-20">
            <Terminal size={80} strokeWidth={0.5} />
            <p className="font-black uppercase tracking-[0.4em] text-[8px] mt-4 italic">WAITING_FOR_SELECTION</p>
          </div>
        )}
      </div>
    </div>
  );
};