import { 
  Mail, 
  ArrowUpRight, 
  Clock, 
  Zap,
} from "lucide-react";
import Link from "next/link";
import { db } from "@/db";
import { messages, services, news, users } from "@/db/schema";
import { desc, eq, count } from "drizzle-orm";
import DashboardStats from "@/components/admin/dashboard/DashboardStats";
import RecentMessages from "@/components/admin/dashboard/RecentMessages";
import FeaturedArticle from "@/components/admin/dashboard/FeaturedArticle";


export const dynamic = "force-dynamic";

interface MessageTeaser {
  id: string;
  firstName: string;
  lastName: string;
  message: string;
  status: string | null;
  createdAt: Date | string | null;
}

export default async function AdminDashboard() {
  // DATABASE QUERIES (Zadržana tvoja logika)
  const [unreadRes] = await db.select({ value: count() }).from(messages).where(eq(messages.status, "unread"));
  const [servicesRes] = await db.select({ value: count() }).from(services);
  const [postsRes] = await db.select({ value: count() }).from(news);
  const [usersRes] = await db.select({ value: count() }).from(users);

  const recentMsgsRaw = await db.select().from(messages).orderBy(desc(messages.createdAt)).limit(5);
  const latestPost = await db.select().from(news).orderBy(desc(news.createdAt)).limit(1);

  const recentMsgs: MessageTeaser[] = recentMsgsRaw.map(m => ({
    id: m.id,
    firstName: m.firstName,
    lastName: m.lastName,
    message: m.message,
    status: m.status,
    createdAt: m.createdAt
  }));

  // STATS MAPPING (Stilizovano za Liternix)
  const stats = [
    { label: "Unread_Signals", value: unreadRes.value, iconName: "mail", bg: "bg-zinc-900", color: "text-red-500", alert: unreadRes.value > 0 },
    { label: "Active_Services", value: servicesRes.value, iconName: "settings", bg: "bg-zinc-900", color: "text-[#afff00]" },
    { label: "Article_Logs", value: postsRes.value, iconName: "newspaper", bg: "bg-zinc-900", color: "text-[#afff00]" },
    { label: "Authorized_Users", value: usersRes.value, iconName: "users", bg: "bg-zinc-900", color: "text-[#afff00]" },
  ];

  return (
    <div className="p-4 md:p-10 space-y-12 bg-black min-h-screen text-white relative">
      
      {/* HEADER: MASTER CONSOLE */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-8 relative z-10">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 bg-[#afff00] rounded-full animate-pulse shadow-[0_0_10px_#afff00]" />
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-500">System_Status: Online</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter italic uppercase leading-none">
            Master_Console<span className="text-[#afff00]">.</span>
          </h1>
          <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.3em] mt-3">
            Production_Unit // Infrastructure_Management
          </p>
        </div>
       
      </header>

      {/* STATS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
        {stats.map((stat, i) => (
          <DashboardStats key={i} {...stat} unreadRes={unreadRes} />
        ))}
      </div>

      {/* MAIN CONTENT GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 relative z-10">
        
        {/* LEFT COLUMN: SIGNAL FEED (MESSAGES) */}
        <div className="lg:col-span-8 space-y-6">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-[10px] font-black uppercase flex flex-wrap tracking-[0.4em] text-zinc-500 items-center gap-3 italic">
              <Mail size={16} className="text-[#afff00]" /> Signal_Feed
              {unreadRes.value > 0 && (
                <span className="flex items-center gap-2">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-red-600"></span>
                  </span>
                  <span className="text-[9px] text-red-500 font-black animate-pulse">INCOMING_DATA</span>
                </span>
              )}
            </h2>
            <Link href="/admin/messages" className="text-[10px] font-black uppercase tracking-widest text-white hover:text-[#afff00] flex items-center gap-2 transition-all group">
              Open_Secure_Channel <ArrowUpRight size={14} className="group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          
          <div className="bg-zinc-900/40 rounded-xl border border-zinc-800 shadow-2xl overflow-hidden backdrop-blur-md">
             <RecentMessages messages={recentMsgs} />
          </div>
        </div>

        {/* RIGHT COLUMN: LOGS & INFRASTRUCTURE */}
        <div className="lg:col-span-4 space-y-10">
          
          <section className="space-y-6">
            <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-500 px-2 italic">Latest_Log_Entry</h2>
            <div className="bg-zinc-900/40 border border-zinc-800 rounded-xl p-1 overflow-hidden transition-all hover:border-[#afff00]/30 shadow-2xl">
              <FeaturedArticle 
                 title={latestPost[0]?.title || "No active logs"} 
                 createdAt={latestPost[0]?.createdAt || null}
                 link="/admin/posts"
              />
            </div>
          </section>

          {/* INFRASTRUCTURE STATUS CARD (Bivši Indigo Card) */}
          <section className="bg-zinc-900 border border-zinc-800 rounded-xl p-8 text-white shadow-2xl relative overflow-hidden group">
            <div className="relative z-10 space-y-8">
              <div className="flex items-center gap-2 text-[#afff00] font-black text-[10px] uppercase tracking-[0.3em]">
                <Zap size={14} fill="currentColor" /> System_Health
              </div>
              <div>
                <h3 className="text-3xl font-black uppercase italic tracking-tighter">Cluster: Active</h3>
                <p className="text-zinc-500 text-sm mt-3 leading-relaxed font-bold uppercase tracking-tight">
                  All API nodes and database shards are performing at <span className="text-white font-black italic">100% Efficiency</span>.
                </p>
              </div>
              <div className="flex items-center gap-3 text-[9px] font-black bg-black border border-zinc-800 w-fit px-4 py-2 rounded-full tracking-[0.2em] text-[#afff00]">
                <Clock size={12} /> LAST CHECK: JUST NOW
              </div>
            </div>
            
            {/* Background Decorative Icon */}
            <Zap size={240} className="absolute -right-20 -bottom-20 text-[#afff00]/5 group-hover:text-[#afff00]/10 transition-all duration-1000 rotate-12 pointer-events-none" />
          </section>
        </div>
      </div>

      {/* GLOBAL SCANLINE OVERLAY */}
      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%)] bg-size-[100%_4px] z-0" />

    </div>
  );
}