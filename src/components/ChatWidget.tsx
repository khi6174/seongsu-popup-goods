"use client";

// 전역 AI 챗봇 위젯(G1). 실제 답변은 /api/chat (Claude API).
import { useState } from "react";
import { useI18n } from "./I18nProvider";

type Msg = { role: "user" | "assistant"; content: string };

export function ChatWidget() {
  const { t, locale } = useI18n();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Msg[]>([]);
  const [loading, setLoading] = useState(false);

  async function send() {
    const text = input.trim();
    if (!text || loading) return;
    const next = [...messages, { role: "user" as const, content: text }];
    setMessages(next);
    setInput("");
    setLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next, locale }),
      });
      if (!res.ok) throw new Error("chat failed");
      const data = await res.json();
      setMessages((m) => [
        ...m,
        { role: "assistant", content: data.reply ?? t("chat.error") },
      ]);
    } catch {
      setMessages((m) => [...m, { role: "assistant", content: t("chat.error") }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <button
        onClick={() => setOpen((o) => !o)}
        className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-coral-deep text-2xl text-white shadow-pop transition hover:-translate-y-0.5"
        aria-label="Open AI helper"
      >
        {open ? "✕" : "💬"}
      </button>

      {open && (
        <div className="fixed bottom-24 right-5 z-50 flex h-[28rem] w-[22rem] max-w-[calc(100vw-2.5rem)] flex-col overflow-hidden rounded-lg border border-line bg-white shadow-float">
          <div className="flex items-center gap-2 bg-grape px-4 py-3 font-display font-extrabold text-white">
            🤖 {t("chat.title")}
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto bg-cream/60 p-3 text-sm">
            <div className="w-fit max-w-[88%] rounded-2xl bg-lavender px-3.5 py-2.5 text-ink-soft">
              {t("chat.greeting")}
            </div>
            {messages.map((m, i) => (
              <div
                key={i}
                className={
                  m.role === "user"
                    ? "ml-auto w-fit max-w-[88%] rounded-2xl bg-coral-deep px-3.5 py-2.5 text-white"
                    : "w-fit max-w-[88%] whitespace-pre-wrap rounded-2xl bg-white px-3.5 py-2.5 text-ink-soft shadow-card"
                }
              >
                {m.content}
              </div>
            ))}
            {loading && (
              <div className="w-fit rounded-2xl bg-white px-3.5 py-2.5 text-concrete shadow-card">
                …
              </div>
            )}
          </div>

          <div className="flex gap-2 border-t border-line bg-white p-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
              placeholder={t("chat.placeholder")}
              className="flex-1 rounded-full border border-line px-3.5 py-2 text-sm outline-none focus:border-grape"
            />
            <button
              onClick={send}
              disabled={loading}
              className="rounded-full bg-grape px-4 py-2 font-display text-sm font-bold text-white disabled:opacity-50"
            >
              {t("chat.send")}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
