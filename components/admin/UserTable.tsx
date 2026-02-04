"use client";

import { useState } from "react";
import { Search, Mail, ShieldCheck, Shield, Edit, Trash2, ChevronDown, Loader2, Terminal } from "lucide-react";
import { updateUser, deleteUser } from "@/lib/actions";
import { useRouter } from "next/navigation";
import { CreateUserForm } from "./CreateUserForm";
import Button3D from "../ui/Button3D";

interface UserType {
  id: string;
  name: string | null;
  email: string;
  role: "USER" | "ADMIN" | null;
}

export function UserTable({ users }: { users: UserType[] }) {
  const [editingUser, setEditingUser] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();

  // Client-side filtering logic
  const filteredUsers = users.filter((user) => {
    const searchStr = searchTerm.toLowerCase();
    return (
      user.name?.toLowerCase().includes(searchStr) || 
      user.email.toLowerCase().includes(searchStr)
    );
  });

  async function handleUpdate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!editingUser) return;

    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const res = await updateUser(editingUser.id, formData);
    
    if (res.success) {
      setEditingUser(null);
      router.refresh();
    } else {
      alert(res.error);
    }
    setLoading(false);
  }

  async function handleDelete(id: string) {
    if (confirm("Are you sure you want to delete this user?")) {
      const res = await deleteUser(id);
      if (res.success) {
        router.refresh();
      } else {
        alert(res.error);
      }
    }
  }

  return (
  <div className="space-y-8 min-h-screen text-white relative">
    
    {/* TOP BAR: SEARCH & CREATE */}
    <div className="flex flex-col md:flex-row justify-between gap-6">
      <div className="relative w-full max-w-md group">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-zinc-600 group-focus-within:text-[#afff00] transition-colors">
          <Search size={18} />
        </div>
        <input
          type="text"
          placeholder="Search_Operators..."
          className="block w-full pl-12 pr-4 py-3 bg-zinc-900/50 border border-zinc-800 rounded-xl text-sm uppercase font-bold tracking-widest placeholder-zinc-700 focus:border-[#afff00] transition-all outline-none"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <CreateUserForm />
    </div>

    {/* OPERATOR TABLE */}
    <div className="bg-zinc-900/40 rounded-2xl border border-zinc-800 shadow-2xl overflow-hidden backdrop-blur-md">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-150">
          <thead className="bg-black/50 border-b border-zinc-800">
            <tr>
              <th className="px-8 py-5 text-[10px] font-black uppercase text-zinc-500 tracking-[0.3em] italic">Operator_Details</th>
              <th className="px-8 py-5 text-[10px] font-black uppercase text-zinc-500 tracking-[0.3em] italic">Access_Level</th>
              <th className="px-8 py-5 text-[10px] font-black uppercase text-zinc-500 tracking-[0.3em] italic text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/50">
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <tr key={user.id} className="group hover:bg-[#afff00]/5 transition-colors">
                  <td className="px-8 py-6">
                    <div className="font-black uppercase italic text-white tracking-tight group-hover:text-[#afff00] transition-colors">
                      {user.name || "Anonymous_Unit"}
                    </div>
                    <div className="text-zinc-500 text-[10px] font-bold flex items-center gap-2 mt-1 uppercase tracking-tighter">
                      <Mail size={12} className="text-zinc-700" /> 
                      {user.email}
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-[10px] font-black tracking-[0.2em] uppercase italic border ${
                      user.role === 'ADMIN' 
                        ? 'bg-[#afff00] text-black border-[#afff00] shadow-[0_0_15px_rgba(175,255,0,0.2)]' 
                        : 'bg-black text-zinc-500 border-zinc-800'
                    }`}>
                      {user.role === 'ADMIN' ? <ShieldCheck size={12} strokeWidth={3} /> : <Shield size={12} />}
                      {user.role}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex justify-end gap-3">
                      <button 
                        onClick={() => setEditingUser(user)} 
                        className="p-2.5 bg-zinc-800 text-zinc-500 hover:text-white hover:bg-zinc-700 rounded-xl transition-all"
                        title="Edit_Operator"
                      >
                        <Edit size={18} />
                      </button>
                      <button 
                        onClick={() => handleDelete(user.id)} 
                        className="p-2.5 bg-zinc-800 text-zinc-500 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all"
                        title="Purge_Operator"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3} className="px-8 py-20 text-center text-zinc-700 font-black uppercase tracking-[0.5em] italic">
                  {"//"} No_Operators_Found_In_Registry
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>

    {/* EDIT MODAL: SECURITY_PROTOCOL_OVERRIDE */}
    {editingUser && (
      <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-in fade-in duration-300">
        <div className="bg-zinc-900 rounded-xl p-8 md:p-12 w-full max-w-lg shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-zinc-800 animate-in zoom-in-95 duration-200 relative overflow-hidden">
          
          {/* Subtle Glow Effect */}
          <div className="absolute -top-24 -left-24 w-48 h-48 bg-[#afff00]/10 rounded-full blur-3xl pointer-events-none" />

          <div className="flex justify-between items-start mb-10 relative z-10">
            <div>
              <div className="flex items-center gap-2 mb-2 text-[#afff00] font-black text-[10px] uppercase tracking-[0.4em]">
                <Terminal size={14} /> Security_Protocol
              </div>
              <h2 className="text-xl md:text-3xl font-black italic uppercase text-white tracking-tighter leading-none">
                Update_Operator<span className="text-[#afff00]">.</span>
              </h2>
            </div>
          </div>

          <form onSubmit={handleUpdate} className="space-y-8 relative z-10">
            
            {/* Full Name - Notched */}
            <div className="relative group">
              <input 
                name="name" 
                placeholder=" "
                defaultValue={editingUser.name || ""} 
                className="peer w-full bg-transparent border border-zinc-800 rounded-2xl px-5 py-4 text-white font-bold uppercase italic tracking-widest text-sm outline-none focus:border-[#afff00] transition-all" 
                required 
              />
              <label className="absolute left-4 -top-2.5 px-2 bg-[#121214] text-[10px] font-black uppercase tracking-widest text-zinc-600 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-xs peer-focus:-top-2.5 peer-focus:text-[#afff00] pointer-events-none">
                Operator_Full_Name
              </label>
            </div>

            {/* Email - Notched */}
            <div className="relative group">
              <input 
                name="email" 
                type="email"
                placeholder=" "
                defaultValue={editingUser.email} 
                className="peer w-full bg-transparent border border-zinc-800 rounded-2xl px-5 py-4 text-white font-bold uppercase italic tracking-widest text-sm outline-none focus:border-[#afff00] transition-all" 
                required 
              />
              <label className="absolute left-4 -top-2.5 px-2 bg-[#121214] text-[10px] font-black uppercase tracking-widest text-zinc-600 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-xs peer-focus:-top-2.5 peer-focus:text-[#afff00] pointer-events-none">
                Signal_Address_Email
              </label>
            </div>

            {/* Role Select - Notched */}
            <div className="relative group">
              <select 
                name="role" 
                defaultValue={editingUser.role || "USER"} 
                className="peer w-full bg-transparent border border-zinc-800 rounded-2xl px-5 py-4 text-white font-black uppercase italic tracking-widest text-xs outline-none focus:border-[#afff00] appearance-none cursor-pointer"
              >
                <option value="USER" className="bg-zinc-900 text-white">Standard_Operator (USER)</option>
                <option value="ADMIN" className="bg-zinc-900 text-[#afff00]">System_Administrator (ADMIN)</option>
              </select>
              <label className="absolute left-4 -top-2.5 px-2 bg-[#121214] text-[10px] font-black uppercase tracking-widest text-zinc-600 transition-all peer-focus:text-[#afff00] pointer-events-none">
                Clearance_Level
              </label>
              <ChevronDown size={18} className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-600" />
            </div>

            {/* Security Divider */}
            <div className="relative py-4">
              <div className="absolute inset-0 flex items-center" aria-hidden="true">
                <div className="w-full border-t border-zinc-800"></div>
              </div>
              <div className="relative flex justify-center text-[8px] uppercase tracking-[0.5em] font-black">
                <span className="bg-[#121214] px-4 text-zinc-700 italic">Security_Override</span>
              </div>
            </div>

            {/* Password - Notched */}
            <div className="relative group">
              <input 
                name="password" 
                type="password" 
                placeholder=" "
                className="peer w-full bg-transparent border border-zinc-800 border-dashed rounded-2xl px-5 py-4 text-white font-bold outline-none focus:border-[#afff00] transition-all" 
              />
              <label className="absolute left-4 -top-2.5 px-2 bg-[#121214] text-[10px] font-black uppercase tracking-widest text-zinc-600 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-xs peer-focus:-top-2.5 peer-focus:text-[#afff00] pointer-events-none">
                Reset_Access_Key (Optional)
              </label>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              <Button3D 
                type="button" 
                onClick={() => setEditingUser(null)} 
                className="flex-1 justify-center flex px-8 py-4 border uppercase italic tracking-widest text-[11px]"
              >
                Abort_Changes
              </Button3D>
              <Button3D primary
                type="submit" 
                disabled={false} 
                className="flex-1 px-8 py-4 rounded-2xl uppercase italic tracking-widest text-[11px] flex items-center justify-center gap-2"
              >
                {loading ? <Loader2 className="animate-spin" size={18} /> : "Commit_Changes"}
              </Button3D>
            </div>
          </form>
        </div>
      </div>
    )}
  </div>
);
}