"use client";

import type { ReactNode } from "react";
import ChatComposer from "./ChatComposer";
import MobileBottomNav from "./MobileBottomNav";
import Sidebar from "./Sidebar";
import TopBar from "./TopBar";
import type { SupportedModelId } from "@/lib/llm/modelCatalog";

type View = "chat";

type ModelOption = {
  id: SupportedModelId;
  label: string;
};

type Props = {
  activeView: View;
  children: ReactNode;
  /** When `activeView` is chat, replaces the default composer (e.g. wired API client). */
  composer?: ReactNode;
  /** Optional selected model id for sidebar model selector. */
  selectedModelId?: SupportedModelId;
  /** Optional model options for sidebar model selector. */
  modelOptions?: ModelOption[];
  /** Optional callback for model changes from sidebar selector. */
  onModelChange?: (id: SupportedModelId) => void;
};

/**
 * Chat application layout shell.
 * Renders the shared frame (top bar, desktop sidebar, responsive content container),
 * and conditionally shows the chat composer and mobile bottom navigation based on the active view.
 */
export default function ChatAppShell({
  activeView,
  children,
  composer,
  selectedModelId,
  modelOptions,
  onModelChange,
}: Props) {
  return (
    <div className="bg-[#0e0e0f] text-[#e7e5e8] font-body selection:bg-[#00ffab]/30 selection:text-[#00ffab] min-h-screen overflow-x-hidden">
      <TopBar />
      <Sidebar
        activeView={activeView}
        selectedModelId={selectedModelId}
        modelOptions={modelOptions}
        onModelChange={onModelChange}
      />

      <main
        className={`md:ml-64 pt-16 min-h-screen ${
          activeView === "chat" ? "pb-28 md:pb-32" : "pb-24 md:pb-12"
        }`}
      >
        {children}
      </main>

      {activeView === "chat" && (composer ?? <ChatComposer />)}
      <MobileBottomNav />
    </div>
  );
}
