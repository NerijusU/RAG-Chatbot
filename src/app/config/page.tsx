import ChatAppShell from "@/components/chatbot/ChatAppShell";
import ConfigurationView from "@/components/chatbot/views/ConfigurationView";

export default function ConfigPage() {
  return (
    <ChatAppShell activeView="config">
      <ConfigurationView />
    </ChatAppShell>
  );
}
