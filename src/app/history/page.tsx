import ChatAppShell from "@/components/chatbot/ChatAppShell";
import HistoryView from "@/components/chatbot/views/HistoryView";

export default function HistoryPage() {
  return (
    <ChatAppShell activeView="history">
      <HistoryView />
    </ChatAppShell>
  );
}
