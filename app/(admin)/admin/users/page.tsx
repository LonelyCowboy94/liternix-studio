import { getAllUsers } from "@/lib/actions";
import { UserTable } from "@/components/admin/UserTable";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";

export default async function UsersPage() {
  const users = await getAllUsers();
  const session = await getServerSession(authOptions);
if (session?.user?.role !== "ADMIN") {
    redirect("/admin"); 
  }
  return (
  <div className="min-h-screen bg-black text-white px-4 py-8 md:p-12 relative overflow-hidden">
    
    {/* LAYER 0: GRID SYSTEM (Blueprint vibe) */}
    <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size-[40px_40px] [mask-radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

    {/* LAYER 1: ATMOSPHERIC GLOWS */}
    <div className="absolute -top-24 -left-24 w-96 h-96 bg-[#afff00]/10 rounded-full blur-[120px] pointer-events-none" />
    <div className="absolute -bottom-48 -right-24 w-150 h-150 bg-[#afff00]/5 rounded-full blur-[150px] pointer-events-none" />

    {/* CONTENT WRAPPER */}
    <div className="max-w-6xl mx-auto space-y-10 md:space-y-16 relative z-10">
      
      {/* HEADER: OPERATOR_INTELLIGENCE_CENTER */}
      <div className="flex flex-col gap-4 relative">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-2 h-2 bg-[#afff00] rounded-full animate-pulse shadow-[0_0_10px_#afff00]" />
          <span className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.4em] text-zinc-500">
            Security_Module: Operational
          </span>
        </div>
        
        <h1 className="text-4xl sm:text-5xl md:text-7xl font-black tracking-tighter italic uppercase leading-[0.85] text-white">
          User_Registry_<br className="block sm:hidden" />Core<span className="text-[#afff00]">.</span>
        </h1>
        
        <p className="text-zinc-500 text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] mt-2 max-w-xl italic leading-relaxed">
          Monitor and authorize terminal access credentials. 
          <span className="text-[#afff00]/50 ml-2">{"//"} Managed_Encryption_Enabled</span>
        </p>
      </div>
      
      {/* REGISTRY SECTION */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 px-2 md:px-4 border-l-2 border-[#afff00] ml-1">
          <h2 className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.4em] italic">
            Active_Units_Registry // [{users.length}]
          </h2>
          <div className="text-[8px] md:text-[9px] font-mono text-zinc-700 uppercase tracking-widest bg-zinc-900/50 px-3 py-1 rounded-full border border-zinc-800">
            Last_Query: {new Date().toLocaleTimeString()}
          </div>
        </div>

        {/* TABLE WRAPPER - Responsive Border Radius */}
        <div className="bg-zinc-900/30 backdrop-blur-xl rounded-md border border-zinc-800 p-1 shadow-2xl overflow-hidden group hover:border-[#afff00]/20 transition-all duration-700">
          <div className="overflow-x-auto">
            <UserTable users={users} />
          </div>
        </div>
      </section>

      {/* FOOTER DECORATION (Subtle system stats) */}
      <div className="flex flex-wrap gap-8 px-4 opacity-20 pointer-events-none">
        <div className="space-y-1">
          <p className="text-[8px] font-black uppercase tracking-widest text-zinc-500 font-mono">Status</p>
          <p className="text-[10px] font-black text-white font-mono uppercase tracking-tighter italic">Encrypted_Link_Active</p>
        </div>
        <div className="space-y-1">
          <p className="text-[8px] font-black uppercase tracking-widest text-zinc-500 font-mono">Zone</p>
          <p className="text-[10px] font-black text-white font-mono uppercase tracking-tighter italic">Admin_Terminal_01</p>
        </div>
      </div>
    </div>

    {/* GLOBAL SCANLINE EFFECT */}
    <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%)] bg-size-[100%_4px] z-50" />
  </div>
);
}