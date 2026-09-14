"use client";

import { useState } from "react";
import {
  Bot,
  BrainCircuit,
  GraduationCap,
  Send,
  Sparkles,
  X,
} from "lucide-react";

interface JarvisProps {
  profile?: any;
  activeCareer?: any;
}

interface Message {
  id: number;
  role: "user" | "assistant";
  content: string;
}

export default function JarvisChatbot({
  profile,
  activeCareer,
}: JarvisProps) {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      role: "assistant",
      content: `Hello ${
        profile?.name || "Student"
      }! 👋

I am JARVIS — your FIGR.IT AI Career Assistant.

I can help you with:

🎓 College Selection
📚 Competitive Exams
💻 Coding
🧠 AI / ML
📊 Skill Gap Analysis
🗺️ Career Roadmap
💼 Internships
🏢 Placements
📄 Resume
🎤 Interviews

How can I help you today?`,
    },
  ]);

  async function sendMessage(customMessage?: string) {
    const text = (customMessage ?? input).trim();

    if (!text || loading) return;

    setInput("");

    const userMessage: Message = {
      id: Date.now(),
      role: "user",
      content: text,
    };

    setMessages((current) => [...current, userMessage]);

    setLoading(true);

    try {
      const response = await fetch("/api/jarvis", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: text,
          profile,
          activeCareer,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.error || "JARVIS could not respond."
        );
      }

      const assistantMessage: Message = {
        id: Date.now() + 1,
        role: "assistant",
        content:
          data.reply ||
          "Sorry, I could not generate a response.",
      };

      setMessages((current) => [
        ...current,
        assistantMessage,
      ]);
    } catch (error) {
      console.error("JARVIS error:", error);

      setMessages((current) => [
        ...current,
        {
          id: Date.now() + 1,
          role: "assistant",
          content:
            "I’m having trouble connecting to my AI engine right now. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  const quickPrompts = [
    "Create my career roadmap",
    "How can I prepare for internships?",
    "How do I become an AI Engineer?",
    "Help me choose a college",
  ];

  return (
    <>
      {/* Floating Button */}
      {!open && (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 z-[9999] flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-indigo-700 text-white shadow-2xl transition hover:scale-110"
          aria-label="Open JARVIS"
        >
          <div className="relative">
            <Bot className="h-8 w-8" />

            <span className="absolute -right-2 -top-2 h-4 w-4 rounded-full bg-green-500 ring-2 ring-white" />
          </div>
        </button>
      )}

      {/* Chat Window */}
      {open && (
        <div className="fixed bottom-5 right-5 z-[9999] flex h-[min(720px,calc(100vh-40px))] w-[min(440px,calc(100vw-40px))] flex-col overflow-hidden rounded-2xl border bg-white shadow-2xl">

          {/* Header */}
          <div className="flex items-center justify-between bg-gradient-to-r from-blue-600 to-indigo-700 px-5 py-4 text-white">
            <div className="flex items-center gap-3">

              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white/15">
                <Bot className="h-6 w-6" />
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h2 className="font-bold">
                    JARVIS
                  </h2>

                  <Sparkles className="h-4 w-4" />
                </div>

                <p className="text-xs text-blue-100">
                  FIGR.IT AI Career Assistant
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-lg p-2 hover:bg-white/10"
              aria-label="Close JARVIS"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Context */}
          <div className="border-b bg-gray-50 px-4 py-3">
            <div className="flex flex-wrap gap-2">

              <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-3 py-1 text-xs text-blue-700">
                <GraduationCap className="h-3.5 w-3.5" />
                {profile?.name || "Student"}
              </span>

              <span className="inline-flex items-center gap-1 rounded-full bg-purple-100 px-3 py-1 text-xs text-purple-700">
                <BrainCircuit className="h-3.5 w-3.5" />
                {activeCareer?.title || "Career not selected"}
              </span>

            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 space-y-4 overflow-y-auto p-4">

            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.role === "user"
                    ? "justify-end"
                    : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[85%] whitespace-pre-line rounded-2xl px-4 py-3 text-sm leading-6 ${
                    message.role === "user"
                      ? "rounded-br-md bg-blue-600 text-white"
                      : "rounded-bl-md bg-gray-100 text-gray-800"
                  }`}
                >
                  {message.role === "assistant" && (
                    <div className="mb-1 flex items-center gap-1 text-xs font-bold text-blue-600">
                      <Bot className="h-3.5 w-3.5" />
                      JARVIS
                    </div>
                  )}

                  {message.content}
                </div>
              </div>
            ))}

            {/* Typing */}
            {loading && (
              <div className="flex justify-start">
                <div className="rounded-2xl rounded-bl-md bg-gray-100 px-4 py-3">
                  <div className="flex gap-1">
                    <span className="h-2 w-2 animate-bounce rounded-full bg-gray-400" />
                    <span className="h-2 w-2 animate-bounce rounded-full bg-gray-400 [animation-delay:150ms]" />
                    <span className="h-2 w-2 animate-bounce rounded-full bg-gray-400 [animation-delay:300ms]" />
                  </div>
                </div>
              </div>
            )}

          </div>

          {/* Quick prompts */}
          {messages.length === 1 && (
            <div className="border-t bg-gray-50 px-3 py-3">

              <p className="mb-2 text-xs font-medium text-gray-500">
                Quick questions
              </p>

              <div className="flex gap-2 overflow-x-auto pb-1">
                {quickPrompts.map((prompt) => (
                  <button
                    key={prompt}
                    type="button"
                    onClick={() => sendMessage(prompt)}
                    className="whitespace-nowrap rounded-full border bg-white px-3 py-2 text-xs hover:border-blue-400 hover:bg-blue-50"
                  >
                    {prompt}
                  </button>
                ))}
              </div>

            </div>
          )}

          {/* Input */}
          <div className="border-t bg-white p-3">

            <div className="flex items-end gap-2 rounded-xl border bg-gray-50 p-2 focus-within:border-blue-500">

              <textarea
                value={input}
                onChange={(event) =>
                  setInput(event.target.value)
                }
                onKeyDown={(event) => {
                  if (
                    event.key === "Enter" &&
                    !event.shiftKey
                  ) {
                    event.preventDefault();
                    sendMessage();
                  }
                }}
                placeholder="Ask JARVIS anything..."
                rows={1}
                className="min-h-10 flex-1 resize-none bg-transparent px-2 py-2 text-sm outline-none"
              />

              <button
                type="button"
                onClick={() => sendMessage()}
                disabled={!input.trim() || loading}
                className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-40"
                aria-label="Send"
              >
                <Send className="h-4 w-4" />
              </button>

            </div>

            <p className="mt-2 text-center text-[10px] text-gray-400">
              JARVIS AI may make mistakes. Verify important
              admission and career decisions.
            </p>

          </div>
        </div>
      )}
    </>
  );
}