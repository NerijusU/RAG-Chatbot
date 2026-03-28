"use client";

import type { ReactNode } from "react";
import ChatComposer from "./ChatComposer";
import MobileBottomNav from "./MobileBottomNav";
import Sidebar from "./Sidebar";
import TopBar from "./TopBar";
import type { View } from "./types";

type Props = {
  activeView: View;
  children: ReactNode;
  /** When `activeView` is chat, replaces the default composer (e.g. wired API client). */
  composer?: ReactNode;
};

/**
 * Chat application layout shell.
 * Renders the shared frame (top bar, desktop sidebar, responsive content container),
 * and conditionally shows the chat composer and mobile bottom navigation based on the active view.
 */
export default function ChatAppShell({ activeView, children, composer }: Props) {
  return (
    <div className="bg-[#0e0e0f] text-[#e7e5e8] font-body selection:bg-[#00ffab]/30 selection:text-[#00ffab] min-h-screen overflow-x-hidden">
      <TopBar />
      <Sidebar activeView={activeView} />

      <main
        className={`md:ml-64 pt-16 min-h-screen ${
          activeView === "chat" ? "pb-28 md:pb-32" : "pb-24 md:pb-12"
        }`}
      >
        {children}
      </main>

      {activeView === "chat" && (composer ?? <ChatComposer />)}
      <MobileBottomNav activeView={activeView} />
    </div>
  );
}
