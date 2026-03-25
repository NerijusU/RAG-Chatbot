"use client";

import type { View } from "./types";
import Link from "next/link";

type Props = {
  activeView: View;
};

export default function MobileBottomNav({ activeView }: Props) {
  return (
    <footer className="md:hidden fixed bottom-0 left-0 w-full z-50 bg-[#0e0e0f] border-t border-[#48484b]/15 px-4 py-2 pb-safe flex justify-around items-center shadow-[0_-12px_32px_rgba(0,0,0,0.4)]">
      <Link
        href="/chat"
        className={`flex flex-col items-center justify-center py-2 transition-colors ${
          activeView === "chat"
            ? "text-[#00ffab]"
            : "text-[#767578] opacity-60 hover:text-[#e7e5e8]"
        }`}
      >
        <span
          className="material-symbols-outlined"
          data-icon="chat_bubble"
          style={{ fontVariationSettings: "'FILL' 1" }}
        >
          chat_bubble
        </span>
        <span className="font-label text-[10px] font-medium uppercase tracking-widest mt-1">
          Chat
        </span>
      </Link>

      <Link
        href="/history"
        className={`flex flex-col items-center justify-center py-2 transition-colors ${
          activeView === "history"
            ? "text-[#00ffab]"
            : "text-[#767578] opacity-60 hover:text-[#e7e5e8]"
        }`}
      >
        <span className="material-symbols-outlined" data-icon="history">
          history
        </span>
        <span className="font-label text-[10px] font-medium uppercase tracking-widest mt-1">
          History
        </span>
      </Link>

      <Link
        href="/config"
        className={`flex flex-col items-center justify-center py-2 transition-colors ${
          activeView === "config"
            ? "text-[#00ffab]"
            : "text-[#767578] opacity-60 hover:text-[#e7e5e8]"
        }`}
      >
        <span
          className="material-symbols-outlined"
          data-icon="settings"
          style={{ fontVariationSettings: "'FILL' 1" }}
        >
          settings
        </span>
        <span className="font-label text-[10px] font-medium uppercase tracking-widest mt-1">
          Settings
        </span>
      </Link>
    </footer>
  );
}
