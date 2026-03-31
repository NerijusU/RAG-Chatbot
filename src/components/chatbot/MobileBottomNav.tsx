"use client";

export default function MobileBottomNav() {
  return (
    <footer className="md:hidden fixed bottom-0 left-0 w-full z-50 bg-[#0e0e0f] border-t border-[#48484b]/15 px-4 py-2 pb-safe flex justify-around items-center shadow-[0_-12px_32px_rgba(0,0,0,0.4)]">
      <a
        href="https://nk-studio.org"
        target="_blank"
        rel="noopener noreferrer"
        className="flex flex-col items-center justify-center py-2 transition-colors text-[#767578] opacity-80 hover:text-[#e7e5e8]"
        aria-label="Open NK Studio website in a new tab"
      >
        <span className="material-symbols-outlined" data-icon="language">
          language
        </span>
        <span className="font-label text-[10px] font-medium uppercase tracking-widest mt-1">
          nk-studio.org
        </span>
      </a>
    </footer>
  );
}
