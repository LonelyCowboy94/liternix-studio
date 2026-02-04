import { Inbox, Send, Plus } from "lucide-react";
import Button3D from "@/components/ui/Button3D";

interface SidebarProps {
  activeTab: "inbox" | "sent";
  isComposing: boolean;
  onTabChange: (tab: "inbox" | "sent") => void;
  onComposeClick: () => void;
}

export const Sidebar = ({ activeTab, isComposing, onTabChange, onComposeClick }: SidebarProps) => (
  <div className="fixed md:relative bottom-0 left-0 right-0 z-60 h-20 pb-3 md:h-full md:w-24 bg-zinc-950/90 backdrop-blur-xl border-t md:border-t-0 md:border-r border-zinc-800 flex md:flex-col items-center justify-around md:justify-start md:py-10 md:gap-10 pb-safe">
    <Button3D 
      primary={activeTab === "inbox" && !isComposing}
      onClick={() => onTabChange("inbox")}
      className="p-3.5 md:p-4"
    >
      <Inbox size={24} strokeWidth={activeTab === "inbox" ? 3 : 2} />
    </Button3D>

    <Button3D 
      primary={activeTab === "sent" && !isComposing}
      onClick={() => onTabChange("sent")}
      className={`p-3.5 md:p-4 ${activeTab === "sent" && !isComposing ? "" : "text-zinc-500"}`}
    >
      <Send size={24} strokeWidth={activeTab === "sent" ? 3 : 2} />
    </Button3D>

    <Button3D 
      primary={isComposing}
      onClick={onComposeClick}
      className={`p-3.5 md:p-4 md:mt-auto ${isComposing ? "scale-105" : "bg-zinc-900 text-[#afff00]"}`}
    >
      <Plus size={24} strokeWidth={3} />
    </Button3D>
  </div>
);