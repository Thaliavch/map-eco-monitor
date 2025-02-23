
import { Header } from "@/components/Header";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Play } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

export default function Environment() {
  const [code, setCode] = useState("");
  const [output, setOutput] = useState("");
  const [chatMessage, setChatMessage] = useState("");
  const [chatHistory, setChatHistory] = useState<Array<{ role: 'user' | 'assistant', content: string }>>([]);
  const { toast } = useToast();

  const handleCodeExecution = async () => {
    // This is a placeholder for now. We'll implement the actual Python execution later
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

    // Placeholder for AI response
    const aiResponse = { role: 'assistant' as const, content: "I'm here to help! The AI chat integration is coming soon." };
    setChatHistory(prev => [...prev, aiResponse]);
  };

  return (
    <div className="min-h-screen">
      <Header />
      <div className="container pt-20">
        <div className="grid grid-cols-2 gap-4">
          {/* Python Environment */}
          <div className="glass-panel rounded-lg p-4">
            <h2 className="text-xl font-semibold mb-4">Python Environment</h2>
            <div className="space-y-4">
              <Textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Enter your Python code here..."
                className="font-mono min-h-[200px]"
              />
              <Button onClick={handleCodeExecution} className="gap-2">
                <Play className="h-4 w-4" />
                Run Code
              </Button>
              <div className="bg-black/20 rounded-lg p-4 min-h-[100px] font-mono">
                <pre>{output || "Output will appear here..."}</pre>
              </div>
            </div>
          </div>

          {/* AI Chat Interface */}
          <div className="glass-panel rounded-lg p-4">
            <h2 className="text-xl font-semibold mb-4">AI Assistant</h2>
            <div className="flex flex-col h-[400px]">
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
  );
}
