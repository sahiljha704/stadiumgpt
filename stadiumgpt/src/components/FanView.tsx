import { useState, useRef, useEffect } from "react";
import { Send, MapPin, Coffee, Users, Info, MessageSquare } from "lucide-react";
import { motion } from "motion/react";
import { Message } from "../types";
import { StadiumMap } from "./StadiumMap";

export function FanView() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: "Welcome to StadiumGPT! I'm your AI Copilot for the FIFA World Cup. How can I help you navigate the stadium today?",
      timestamp: Date.now(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [mapHighlight, setMapHighlight] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (text: string) => {
    if (!text.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: text,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          context: {
            location: "Gate C, Level 1",
            matchTime: "Pre-match",
          },
        }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        setMessages((prev) => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            role: "assistant",
            content: data.error || "The service is temporarily unavailable. Please try again later.",
            timestamp: Date.now(),
          },
        ]);
        setMapHighlight(null);
        return;
      }

      if (data.uiAction && data.uiAction.type === "highlight") {
        setMapHighlight(data.uiAction.target);
      } else {
        setMapHighlight(null);
      }

      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: data.reply || "I couldn't process your request.",
          timestamp: Date.now(),
        },
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: "Sorry, I am unable to process your request right now.",
          timestamp: Date.now(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full w-full max-w-7xl mx-auto bg-[#EDDCD9] overflow-hidden md:rounded-xl md:h-[85vh] md:my-auto md:border-2 md:border-[#264143] md:shadow-[3px_4px_0px_1px_#E99F4C] relative transition-colors duration-300">
      <div className="flex flex-col h-full overflow-hidden">
        {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 relative flex flex-col">
              {messages.map((msg, index) => {
                const isLatestAssistant = msg.role === "assistant" && index === messages.length - 1;
                
                return (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    key={msg.id}
                    className={`flex flex-col ${msg.role === "user" ? "items-end" : "items-start"}`}
                  >
                    {isLatestAssistant && mapHighlight && (
                      <div className="w-full max-w-sm md:max-w-2xl mb-3 h-48 md:h-72 rounded-xl overflow-hidden border-2 border-[#264143] shadow-[3px_4px_0px_1px_#E99F4C] shrink-0">
                        <StadiumMap highlight={mapHighlight} />
                      </div>
                    )}
                    <div
                      className={`max-w-[85%] md:max-w-[75%] p-4 rounded-xl border-2 border-[#264143] ${
                        msg.role === "user"
                          ? "bg-[#DE5499] text-[#264143] font-bold rounded-br-none shadow-[3px_4px_0px_1px_#E99F4C]"
                          : "bg-white text-[#264143] font-medium rounded-bl-none shadow-[3px_4px_0px_1px_#E99F4C]"
                      }`}
                    >
                      <p className="text-sm md:text-base leading-relaxed">{msg.content}</p>
                    </div>
                  </motion.div>
                );
              })}
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  className="flex flex-col items-start"
                >
                  <div className="bg-white text-[#264143] border-2 border-[#264143] shadow-[3px_4px_0px_1px_#E99F4C] rounded-xl rounded-bl-none max-w-[85%] md:max-w-[75%] p-4 flex justify-center items-center h-16 w-24 overflow-hidden relative">
                    <div className="transform scale-[0.3] absolute">
                      <div className="banter-loader banter-loader-chat">
                        <div className="banter-loader__box"></div>
                        <div className="banter-loader__box"></div>
                        <div className="banter-loader__box"></div>
                        <div className="banter-loader__box"></div>
                        <div className="banter-loader__box"></div>
                        <div className="banter-loader__box"></div>
                        <div className="banter-loader__box"></div>
                        <div className="banter-loader__box"></div>
                        <div className="banter-loader__box"></div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 shrink-0 max-w-4xl mx-auto w-full">
              <div className="flex gap-2 overflow-x-auto pb-2 mb-2 no-scrollbar px-1">
                {["Find my seat", "Report issue", "Order food", "Match score"].map((action) => (
                  <button
                    key={action}
                    onClick={() => handleSend(action)}
                    disabled={isLoading}
                    className="px-4 py-1.5 text-sm font-bold bg-[#EDDCD9] text-[#264143] border-2 border-[#264143] rounded-full shadow-[2px_2px_0px_0px_#E99F4C] hover:translate-y-[1px] hover:translate-x-[1px] hover:shadow-[1px_1px_0px_0px_#E99F4C] active:shadow-none active:translate-y-[2px] active:translate-x-[2px] transition-all whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {action}
                  </button>
                ))}
              </div>
              <div className="container_chat_bot">
                <div className="container-chat-options">
                  <div className="chat">
                    <div className="chat-bot">
                      <textarea
                        id="chat_bot"
                        name="chat_bot"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            handleSend(input);
                          }
                        }}
                        placeholder="Imagine Something...✦˚"
                      ></textarea>
                    </div>
                    <div className="options">
                      <div className="btns-add">
                        <button aria-label="Add attachment" onClick={() => document.getElementById("file-upload")?.click()}>
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
                            <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 8v8a5 5 0 1 0 10 0V6.5a3.5 3.5 0 1 0-7 0V15a2 2 0 0 0 4 0V8"></path>
                          </svg>
                        </button>
                        <input
                          type="file"
                          id="file-upload"
                          className="hidden"
                          onChange={(e) => {
                            if (e.target.files && e.target.files.length > 0) {
                              const file = e.target.files[0];
                              handleSend(`[Uploaded file: ${file.name}]`);
                              e.target.value = '';
                            }
                          }}
                        />
                      </div>
                      <button 
                        className="btn-submit"
                        onClick={() => handleSend(input)}
                        disabled={!input.trim() || isLoading}
                      >
                        <i>
                          <svg viewBox="0 0 512 512">
                            <path fill="currentColor" d="M473 39.05a24 24 0 0 0-25.5-5.46L47.47 185h-.08a24 24 0 0 0 1 45.16l.41.13l137.3 58.63a16 16 0 0 0 15.54-3.59L422 80a7.07 7.07 0 0 1 10 10L226.66 310.26a16 16 0 0 0-3.59 15.54l58.65 137.38c.06.2.12.38.19.57c3.2 9.27 11.3 15.81 21.09 16.25h1a24.63 24.63 0 0 0 23-15.46L478.39 64.62A24 24 0 0 0 473 39.05"></path>
                          </svg>
                        </i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
      </div>
    </div>
  );
}
