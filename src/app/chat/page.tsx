import ChatAppShell from "@/components/chatbot/ChatAppShell";
import ChatView from "@/components/chatbot/views/ChatView";

export default function ChatPage() {
  return (
    <ChatAppShell activeView="chat">
      <ChatView />
    </ChatAppShell>
  );
}
