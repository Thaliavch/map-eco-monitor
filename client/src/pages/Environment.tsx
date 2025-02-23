
import { Header } from "@/components/Header";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Play, ChevronLeft, ChevronRight } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";

export default function Environment() {
  const [code, setCode] = useState("");
  const [output, setOutput] = useState("");
  const [chatMessage, setChatMessage] = useState("");
  const [chatHistory, setChatHistory] = useState<Array<{ role: 'user' | 'assistant', content: string }>>([]);
  const [isAssistantOpen, setIsAssistantOpen] = useState(true);
  const { toast } = useToast();

  const handleCodeExecution = async () => {
    toast({
      title: "Code Execution",
      description: "Python environment integration coming soon!",
    });
  };

  const handleChatSubmit = async () => {
    if (!chatMessage.trim()) return;

    const newMessage = { role: 'user' as const, content: chatMessage };
    setChatHistory([...chatHistory, newMessage]);
    setChatMessage("");

    const aiResponse = { role: 'assistant' as const, content: "I'm here to help! The AI chat integration is coming soon." };
    setChatHistory(prev => [...prev, aiResponse]);
  };

  return (
    <div className="min-h-screen">
      <Header />
      <div className="flex h-[calc(100vh-4rem)] pt-16">
        {/* Main Python Environment */}
        <div className={cn(
          "transition-all duration-300 ease-in-out",
          isAssistantOpen ? "w-[calc(100%-24rem)]" : "w-full"
        )}>
          <div className="p-4 h-full">
            <div className="glass-panel rounded-lg p-4 h-full flex flex-col">
              <h2 className="text-xl font-semibold mb-4">Python Environment</h2>
              <div className="flex-1 flex flex-col gap-4">
                <Textarea
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="Enter your Python code here..."
                  className="font-mono flex-1 min-h-0"
                />
                <Button onClick={handleCodeExecution} className="gap-2 w-fit">
                  <Play className="h-4 w-4" />
                  Run Code
                </Button>
                <div className="bg-black/20 rounded-lg p-4 h-48 font-mono overflow-auto">
                  <pre>{output || "Output will appear here..."}</pre>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Collapsible AI Assistant */}
        <div className="relative">
          <Button
            variant="ghost"
            size="icon"
            className="absolute -left-10 top-4 bg-background shadow-md"
            onClick={() => setIsAssistantOpen(!isAssistantOpen)}
          >
            {isAssistantOpen ? <ChevronRight /> : <ChevronLeft />}
          </Button>
          <div className={cn(
            "fixed right-0 top-16 h-[calc(100vh-4rem)] w-96 transition-transform duration-300 ease-in-out bg-background/80 backdrop-blur-md border-l",
            isAssistantOpen ? "translate-x-0" : "translate-x-full"
          )}>
            <div className="p-4 h-full flex flex-col">
              <h2 className="text-xl font-semibold mb-4">AI Assistant</h2>
              <div className="flex-1 flex flex-col">
                <div className="flex-1 overflow-y-auto space-y-4 mb-4">
                  {chatHistory.map((msg, idx) => (
                    <div
                      key={idx}
                      className={`p-3 rounded-lg ${
                        msg.role === 'user'
                          ? 'bg-primary/10 ml-auto'
                          : 'bg-secondary/10 mr-auto'
                      } max-w-[80%]`}
                    >
                      {msg.content}
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Textarea
                    value={chatMessage}
                    onChange={(e) => setChatMessage(e.target.value)}
                    placeholder="Ask me anything about data analysis..."
                    className="resize-none"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleChatSubmit();
                      }
                    }}
                  />
                  <Button onClick={handleChatSubmit} className="h-full aspect-square">
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
