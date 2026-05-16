"use client";

import { useState, useEffect, useCallback } from "react";
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
import { getMessages } from "@/app/api/contact/actions";
import { Message } from "@/types/messanger"; // Importovan tip

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
  const [unreadCount, setUnreadCount] = useState(0);
  const pathname = usePathname();
  const { data: session, status } = useSession();

  const closeSidebar = () => setIsOpen(false);
  const userInitial = session?.user?.name?.[0]?.toUpperCase() || "L";

  // FIX: Umesto 'any', koristimo Message[]
  const checkMessages = useCallback(async () => {
    try {
      const data = await getMessages();
      const messages = data as unknown as Message[];
      const count = messages.filter((m) => m.status === "unread").length;
      setUnreadCount(count);
    } catch (error) {
      console.error("Failed to fetch unread count", error);
    }
  }, []);

  // FIX ZA ESLINT: Synchronous setState in effect
  useEffect(() => {
    let isMounted = true;

    const fetchInitial = async () => {
      if (isMounted) await checkMessages();
    };

    fetchInitial(); // Pozivamo async funkciju

    const interval = setInterval(() => {
      if (isMounted) checkMessages();
    }, 5000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [checkMessages]);

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

      <aside
        className={cn(
          "fixed inset-y-0 left-0 select-none z-100 w-72 bg-black text-white p-6 flex flex-col border-r border-zinc-800 transition-transform duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] lg:translate-x-0 lg:static lg:inset-auto",
          isOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="lg:hidden absolute top-4 -right-12 z-60">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="w-12 h-12 bg-[#afff00] text-black flex items-center justify-center shadow-[4px_0_0_0_#76ad00] active:translate-x-1 active:shadow-none transition-all"
          >
            {isOpen ? <X size={24} strokeWidth={3} /> : <Menu size={24} strokeWidth={3} />}
          </button>
        </div>

        <div className="flex items-center gap-3 mb-12 mt-2 lg:mt-0">
          <div className="w-10 h-10 bg-[#afff00] text-black flex items-center justify-center font-black text-xl italic">
            {userInitial}
          </div>
          <div className="text-2xl font-black tracking-tighter uppercase italic">
            LUKA JOKIC<span className="text-[#afff00]">.</span>
          </div>
        </div>

        <nav className="flex-1 space-y-2">
          {menuItems.map((item) => {
            if (item.name === "Users") {
              if (isLoading || session?.user?.role !== "ADMIN") return null;
            }

            const Icon = item.icon;
            const isActive = pathname === item.href;
            const isMessages = item.name === "Messages";

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
                {isActive && <div className="absolute left-0 top-0 bottom-0 w-1 bg-black" />}
                
                <Icon
                  size={18}
                  strokeWidth={isActive ? 3 : 2}
                  className={cn(
                    "transition-colors",
                    isActive ? "text-black" : "text-zinc-600 group-hover:text-[#afff00]",
                  )}
                />
                <span className="flex-1">{item.name}</span>

                {isMessages && unreadCount > 0 && (
                  <div className="bg-red-600 text-white text-[9px] font-black px-2 py-0.5 rounded-full animate-pulse shadow-[0_0_10px_rgba(220,38,38,0.5)]">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </div>
                )}
              </Link>
            );
          })}
        </nav>

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