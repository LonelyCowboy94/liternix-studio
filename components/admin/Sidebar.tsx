"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  FileText,
  Users,
  MessageSquare,
  LogOut,
  Menu,
  WalletCards,
  X,
} from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";

const menuItems = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Posts", href: "/admin/posts", icon: FileText },
  { name: "Portfolio", href: "/admin/portfolio", icon: FileText },
  { name: "Services", href: "/admin/services", icon: WalletCards },
  { name: "Messages", href: "/admin/messages", icon: MessageSquare },
  { name: "Users", href: "/admin/users", icon: Users },
];

export function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const { data: session, status } = useSession();

  const closeSidebar = () => setIsOpen(false);
  const userInitial = session?.user?.name?.[0]?.toUpperCase() || "J";

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const isLoading = status === "loading";

  return (
  <>
  {/* OVERLAY */}
  <AnimatePresence>
    {isOpen && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={closeSidebar}
        className="fixed inset-0 bg-black/80 backdrop-blur-md z-80 lg:hidden"
      />
    )}
  </AnimatePresence>

  {/* SIDEBAR ASIDE */}
  <aside
    className={cn(
      "fixed inset-y-0 left-0 select-none z-100 w-72 bg-black text-white p-6 flex flex-col border-r border-zinc-800 transition-transform duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] lg:translate-x-0 lg:static lg:inset-auto",
      isOpen ? "translate-x-0" : "-translate-x-full",
    )}
  >
    {/* MOBILE TRIGGER - Repositioned for Liternix Style */}
    <div className="lg:hidden absolute top-4 -right-12 z-60">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-12 h-12 bg-[#afff00] text-black flex items-center justify-center shadow-[4px_0_0_0_#76ad00] active:translate-x-1 active:shadow-none transition-all"
      >
        {isOpen ? <X size={24} strokeWidth={3} /> : <Menu size={24} strokeWidth={3} />}
      </button>
    </div>

    {/* ADMIN BRANDING */}
    <div className="flex items-center gap-3 mb-12 mt-2 lg:mt-0">
      <div className="w-10 h-10 bg-[#afff00] text-black flex items-center justify-center font-black text-xl italic shadow-[0_0_20px_rgba(175,255,0,0.2)]">
        {userInitial}
      </div>
      <div className="text-2xl font-black tracking-tighter uppercase italic">
        LITERNIX<span className="text-[#afff00]">.</span>CTRL
      </div>
    </div>

    {/* NAVIGATION */}
    <nav className="flex-1 space-y-2">
      {menuItems.map((item) => {
        if (item.name === "Users") {
          if (isLoading || session?.user?.role !== "ADMIN") return null;
        }

        const Icon = item.icon;
        const isActive = pathname === item.href;
        return (
          
          <Link
            key={item.href}
            href={item.href}
            onClick={closeSidebar}
            className={cn(
              "flex items-center gap-4 px-4 py-3 font-black uppercase italic tracking-widest text-[11px] transition-all duration-300 group relative overflow-hidden",
              isActive
                ? "bg-[#afff00] text-black shadow-[0_0_25px_rgba(175,255,0,0.15)]"
                : "text-zinc-500 hover:text-[#afff00] hover:bg-zinc-900/50",
            )}
          >
            {/* Active Indicator Line */}
            {isActive && <div className="absolute left-0 top-0 bottom-0 w-1 bg-black" />}
            
            <Icon
              size={18}
              strokeWidth={isActive ? 3 : 2}
              className={cn(
                "transition-colors",
                isActive ? "text-black" : "text-zinc-600 group-hover:text-[#afff00]",
              )}
            />
            {item.name}
          </Link>
        );
      })}
    </nav>

    {/* FOOTER / LOGOUT */}
    <div className="pt-6 mt-auto border-t border-zinc-800">
      <button
        onClick={() => signOut({ callbackUrl: "/login" })}
        className="w-full flex items-center gap-4 px-4 py-3 text-zinc-500 hover:text-red-500 hover:bg-red-500/5 transition-all font-black uppercase italic tracking-widest text-[11px]"
      >
        <LogOut size={18} strokeWidth={2} />
        <span>Terminate_Session</span>
      </button>
    </div>
  </aside>
</>
  );
}
