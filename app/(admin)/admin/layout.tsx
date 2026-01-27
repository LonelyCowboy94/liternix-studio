import { Breadcrumbs } from "@/components/admin/AdminBreadcrumb";
import { AuthProvider } from "@/components/admin/Providers";
import { Sidebar } from "@/components/admin/Sidebar";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
const session = await getServerSession(authOptions);
const sessionUser = session?.user.name;
  return (
    <AuthProvider session={session}>
    <div className="flex flex-col lg:flex-row min-h-screen bg-slate-100">
      
      <Sidebar />

      <main className="flex-1 flex flex-col min-w-0">
        
         <header className="h-20 select-none bg-black border-b pl-18 lg:pl-6 border-zinc-800 flex items-center justify-between px-8 shadow-2xl relative z-20">
  
  {/* LEFT: System Path / Breadcrumbs */}
  <div className="flex items-center gap-4">
    <div className="hidden lg:flex items-center gap-2">
      <div className="w-2 h-2 bg-[#afff00] rounded-full animate-pulse shadow-[0_0_10px_#afff00]" />
      <span className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500">
        System_Path:
      </span>
    </div>
    
    <nav className="text-[10px] font-black uppercase tracking-[0.2em] italic flex items-center gap-2">
      <span className="text-zinc-400 hover:text-white transition-colors cursor-default">Admin</span>
      <span className="text-[#afff00] font-black">/</span>
      <div className="text-white bg-zinc-900 px-3 py-1 border border-zinc-800 rounded-md">
        <Breadcrumbs />
      </div>
    </nav>
  </div>

  {/* RIGHT: Session Info */}
  <div className="flex items-center gap-6">
    {/* Status Display */}
    <div className="hidden md:flex flex-col items-end">
      <span className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest">Operator_Status</span>
      <span className="text-[11px] font-black text-[#afff00] uppercase italic tracking-tighter">
        {sessionUser} <span className="text-zinc-500 text-[8px] ml-1">[AUTH_LEVEL_01]</span>
      </span>
    </div>

    {/* User Avatar / Visual */}
    <div className="w-10 h-10 border border-zinc-800 rounded-full flex items-center justify-center bg-zinc-900/50 group hover:border-[#afff00] transition-colors cursor-pointer">
      <div className="w-6 h-6 rounded-full bg-linear-to-tr from-[#afff00] to-green-400 opacity-80 group-hover:opacity-100 transition-opacity shadow-[0_0_15px_rgba(175,255,0,0.2)]" />
    </div>
  </div>

  {/* SUbtle Scanline Overlay for the header */}
  <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%)] bg-size-[100%_4px] opacity-20" />
</header>

        <div>
          {children}
        </div>
      </main>
    </div>
    </AuthProvider>
  );
}