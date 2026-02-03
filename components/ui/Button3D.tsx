"use client";

import React from "react";

type Button3DProps = {
  children: React.ReactNode;
  primary?: boolean;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  className?: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
};

export default function Button3D({
  children,
  primary = false,
  type = "button",
  disabled = false,
  className = "",
  onClick,
}: Button3DProps) {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`
        relative rounded-2xl font-black uppercase tracking-widest text-sm
        transition-all duration-100
        ${disabled
          ? "opacity-50 cursor-not-allowed translate-y-2 shadow-none"
          : primary
            ? "bg-[#afff00] text-black shadow-[0_8px_0_0_#76ad00] active:shadow-none active:translate-y-2"
            : "bg-zinc-900 text-white border border-zinc-800 shadow-[0_8px_0_0_#111111] active:shadow-none active:translate-y-2"
        }
        ${className}
      `}
    >
      {/* shadows */}
      {!disabled && (
        <>
          <div className="absolute inset-0 rounded-2xl shadow-[inset_0_2px_4px_rgba(255,255,255,0.3)] pointer-events-none opacity-40" />
          <div className="absolute inset-0 rounded-2xl shadow-[inset_0_-2px_4px_rgba(0,0,0,0.5)] pointer-events-none opacity-40" />
        </>
      )}

      <span className="flex items-center gap-3 relative z-10">
        {children}
      </span>
    </button>
  );
}