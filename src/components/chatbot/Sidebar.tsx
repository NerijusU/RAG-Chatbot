"use client";

import Link from "next/link";

import type { View } from "./types";

type Props = {
  activeView: View;
};

export default function Sidebar({ activeView }: Props) {
  return (
    <aside className="hidden md:flex fixed inset-y-0 left-0 w-64 z-[60] bg-[#131315] flex-col p-4 border-r border-[#48484b]/10 rounded-r-xl shadow-2xl mt-14">
      <div className="flex items-center gap-3 px-2 py-4 mb-6">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#5c5c5e] to-[#2a2a2c] flex items-center justify-center overflow-hidden p-1.5">
          {/* eslint-disable-next-line @next/next/no-img-element -- local static SVG; avoids next/image SVG quirks */}
          <img
            src="/brand/nk-studio-logo.svg"
            alt=""
            width={28}
            height={28}
            className="object-contain w-full h-full"
          />
        </div>
        <div className="flex flex-col min-w-0">
          <p className="font-headline font-bold text-[#e7e5e8] text-sm truncate">
            NK Studio
          </p>
          <p className="font-label text-[10px] text-[#00ffab] uppercase tracking-widest opacity-90">
            Salon assistant · Leipzig
          </p>
        </div>
      </div>

      <nav className="flex flex-col gap-2 flex-grow">
        <Link
          href="/chat"
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-sm ${
            activeView === "chat"
              ? "bg-[#1d2022] text-[#00ffab] border-l-2 border-[#00ffab]"
              : "text-[#c6c6cd] hover:bg-[#272a2c] hover:text-[#e0e3e5] opacity-70"
          }`}
        >
          <span className="material-symbols-outlined" data-icon="chat">
            chat
          </span>
          <span className="font-body text-sm">Chat</span>
        </Link>

        <Link
          href="/history"
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-sm ${
            activeView === "history"
              ? "bg-[#1d2022] text-[#00ffab] border-l-2 border-[#00ffab]"
              : "text-[#c6c6cd] hover:bg-[#272a2c] hover:text-[#e0e3e5] opacity-70"
          }`}
        >
          <span className="material-symbols-outlined" data-icon="history">
            history
          </span>
          <span className="font-body text-sm">History</span>
        </Link>

        <Link
          href="/config"
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-sm ${
            activeView === "config"
              ? "bg-[#1d2022] text-[#00ffab] border-l-2 border-[#00ffab]"
              : "text-[#c6c6cd] hover:bg-[#272a2c] hover:text-[#e0e3e5] opacity-70"
          }`}
        >
          <span className="material-symbols-outlined" data-icon="settings">
            settings
          </span>
          <span className="font-body text-sm">Configuration</span>
        </Link>

        <a
          href="https://nk-studio.org"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Open NK Studio website in a new tab"
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-sm text-[#c6c6cd] hover:bg-[#272a2c] hover:text-[#e0e3e5] opacity-70 border border-transparent hover:border-[#48484b]/20"
        >
          <span
            className="material-symbols-outlined shrink-0"
            data-icon="language"
          >
            language
          </span>
          <span className="font-body text-sm">nk-studio.org</span>
          <span
            className="material-symbols-outlined text-base ml-auto shrink-0 opacity-60"
            data-icon="open_in_new"
            aria-hidden
          >
            open_in_new
          </span>
        </a>
      </nav>

      <div className="mt-auto pt-4 border-t border-[#48484b]/10">
        <div className="flex justify-between items-center px-3">
          <span className="font-label text-[10px] uppercase tracking-tighter text-[#767578]">
            API: Active
          </span>
          <span className="w-2 h-2 rounded-full bg-[#00ffab] animate-pulse" />
        </div>
      </div>
    </aside>
  );
}
