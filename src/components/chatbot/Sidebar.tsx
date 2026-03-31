"use client";

import Link from "next/link";

import type { SupportedModelId } from "@/lib/llm/modelCatalog";

type View = "chat";

type ModelOption = {
  id: SupportedModelId;
  label: string;
};

type Props = {
  activeView: View;
  selectedModelId?: SupportedModelId;
  modelOptions?: ModelOption[];
  onModelChange?: (id: SupportedModelId) => void;
};

/**
 * Desktop navigation sidebar with optional model selection controls.
 *
 * @param props - Active view and optional model selector state/callback.
 * @returns Sidebar navigation and status panel.
 */
export default function Sidebar({
  activeView,
  selectedModelId,
  modelOptions,
  onModelChange,
}: Props) {
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
          href="/nk-studio-chat"
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

      {activeView === "chat" &&
      selectedModelId &&
      modelOptions &&
      modelOptions.length > 0 ? (
        <div className="mb-4 rounded-lg border border-[#48484b]/20 bg-[#161618] p-3">
          <label className="flex flex-col gap-2">
            <span className="font-label text-[10px] uppercase tracking-widest text-[#c6c6cd]">
              Model
            </span>
            <select
              value={selectedModelId}
              onChange={(event) =>
                onModelChange?.(event.currentTarget.value as SupportedModelId)
              }
              className="w-full bg-[#1f1f22] border border-[#48484b]/30 rounded-md px-2 py-2 text-xs text-[#e7e5e8] focus:outline-none focus:ring-1 focus:ring-[#4edea3]/40"
              aria-label="Select chat model"
            >
              {modelOptions.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        </div>
      ) : null}

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
