"use client";

export default function TopBar() {
  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-[#0e0e0f] border-b border-[#48484b]/10">
      <div className="flex items-center justify-center px-6 md:px-12 h-16 bg-[#0e0e0f]/70 backdrop-blur-xl">
        <h1 className="font-headline font-bold text-[#c6c6c7] tracking-tight text-lg sm:text-xl md:text-2xl">
          RAG Chatbot
        </h1>
      </div>
    </header>
  );
}
