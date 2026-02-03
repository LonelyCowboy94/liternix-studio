"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Prevent scroll when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isMenuOpen]);

  const navLinks = [
    { name: "Work", href: "/showreel" },
    { name: "Contact", href: "/contact" },
    { name: "Manifesto", href: "/manifesto" },
    
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-100 transition-all duration-500 ease-in-out w-full border-b
          ${
            isScrolled || isMenuOpen
              ? "bg-zinc-950/80 backdrop-blur-md border-[#afff00]/40 py-4"
              : "bg-transparent border-transparent py-8"
          }`}
      >
        <nav
          className="max-w-7xl mx-auto px-8 flex items-center justify-between"
          aria-label="Main Navigation"
        >
          {/* Logo */}
          <div className="z-110">
            <Link
              href="/"
              onClick={() => setIsMenuOpen(false)}
              className="text-2xl font-black tracking-tighter italic hover:text-[#afff00] transition-colors focus:outline-none focus:ring-2 focus:ring-[#afff00] rounded-sm"
            >
              LUKA_JOKIC<span className="text-[#afff00]">.</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex flex-1 justify-center gap-10 text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-400">
            {navLinks
              .map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="hover:text-[#afff00] transition-colors focus:text-[#afff00]"
                >
                  {link.name}
                </Link>
              ))}
          </div>

          {/* Right Side: Status (Desktop) & Hamburger (Mobile) */}
          <div className="flex items-center gap-6 z-110">
            <div
              className="hidden sm:inline-flex items-center gap-2 px-3 py-1 rounded-full border border-zinc-800 bg-zinc-900/50 text-[#afff00] text-[10px] font-bold uppercase tracking-[0.2em]"
              role="status"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-600 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
              </span>
              Rec
            </div>

            {/* Hamburger Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="relative w-10 h-10 flex flex-col md:hidden justify-center items-center group focus:outline-none"
              aria-expanded={isMenuOpen}
              aria-label="Toggle navigation menu"
            >
              <div className="relative w-6 h-5">
                <span
                  className={`absolute h-0.5 w-full transition-all duration-300 ease-in-out ${
                    isMenuOpen
                      ? "rotate-45 top-2 bg-[#afff00]"
                      : "top-0 bg-white animate-jelly-glow jelly-delay-1"
                  }`}
                />
                <span
                  className={`absolute h-0.5 w-full transition-all duration-200 ease-in-out top-2 ${
                    isMenuOpen
                      ? "opacity-0 scale-0"
                      : "opacity-100 bg-white animate-jelly-glow jelly-delay-2"
                  }`}
                />
                <span
                  className={`absolute h-0.5 w-full transition-all duration-300 ease-in-out ${
                    isMenuOpen
                      ? "-rotate-45 top-2 bg-[#afff00]"
                      : "top-4 bg-white animate-jelly-glow jelly-delay-3"
                  }`}
                />
              </div>
            </button>
          </div>
        </nav>
      </header>

      {/* Fullscreen Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 z-90 bg-zinc-950 transition-transform duration-700 ease-[cubic-bezier(0.85,0,0.15,1)] ${
          isMenuOpen ? "translate-y-0" : "-translate-y-full"
        }`}
        role="dialog"
        aria-modal="true"
      >
        {/* Background Accent */}
        <div className="absolute top-0 right-0 w-[50%] h-full bg-[#afff00]/5 blur-[120px] -z-10" />

        <div className="flex flex-col h-full justify-center px-8 sm:px-12">
          <div className="flex flex-col gap-4">
            <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-[#afff00] mb-4">
              Navigation
            </span>
            {navLinks.map((link, index) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsMenuOpen(false)}
                className={`text-5xl sm:text-7xl font-black uppercase italic tracking-tighter transition-all duration-500 hover:text-[#afff00] hover:translate-x-4 inline-block ${
                  isMenuOpen
                    ? "translate-y-0 opacity-100"
                    : "translate-y-20 opacity-0"
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div
            className={`mt-20 pt-10 border-t border-zinc-900 flex flex-col gap-4 transition-all duration-700 delay-500 ${
              isMenuOpen ? "opacity-100" : "opacity-0"
            }`}
          >
            <p className="text-zinc-500 text-sm tracking-widest uppercase">
              Socials
            </p>
            <div className="flex gap-8 text-zinc-300 font-bold uppercase text-[10px] tracking-widest">
              <a href="#" className="hover:text-[#afff00]">
                Instagram
              </a>
              <a href="#" className="hover:text-[#afff00]">
                Behance
              </a>
              <a href="#" className="hover:text-[#afff00]">
                X / Twitter
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
