"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { AppShell } from "@/components/layout/app-shell";
import {
  ChatMessageBubble,
  ChatInputBar,
  SuggestedQuestionsPill,
  RateLimitBanner,
  DisclaimerBanner,
  ConversationHeader,
} from "@/features/ai/components";
import { FinoraAIMessage } from "@/features/ai/types";
import { aiService } from "@/features/ai/services";

const SUGGESTED_QUESTIONS = [
  "Where am I spending the most?",
  "What changed this month?",
  "What are my biggest potential savings opportunities?",
  "How is my goal progressing?",
  "Explain my financial health.",
];

export default function AIPage() {
  const [messages, setMessages] = useState<FinoraAIMessage[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [rateLimitCooldown, setRateLimitCooldown] = useState(0);
  const [lastUserPrompt, setLastUserPrompt] = useState<string>("");

  const abortControllerRef = useRef<AbortController | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize conversations
  useEffect(() => {
    let isMounted = true;
    aiService.getConversations().then((res) => {
      if (isMounted && res.data && res.data[0]) {
        setMessages(res.data[0].messages);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  // Scroll to bottom on new messages
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isGenerating, scrollToBottom]);

  // Send message with streaming
  const handleSendMessage = async (prompt: string) => {
    if (!prompt.trim() || isGenerating) return;

    setLastUserPrompt(prompt);

    // 1. Add User Message
    const userMsg: FinoraAIMessage = {
      id: `usr-${Date.now()}`,
      role: "user",
      content: prompt,
      timestamp: new Date().toISOString(),
    };

    // 2. Add placeholder streaming Assistant Message
    const assistantMsgId = `ast-${Date.now()}`;
    const initialAssistantMsg: FinoraAIMessage = {
      id: assistantMsgId,
      role: "assistant",
      content: "",
      timestamp: new Date().toISOString(),
      isStreaming: true,
    };

    setMessages((prev) => [...prev, userMsg, initialAssistantMsg]);
    setIsGenerating(true);

    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      await aiService.streamResponse(
        prompt,
        (chunk) => {
          if (chunk.error && chunk.error.includes("Rate limit")) {
            const cooldownMatch = chunk.error.match(/(\d+)s/);
            const seconds = cooldownMatch && cooldownMatch[1] ? parseInt(cooldownMatch[1], 10) : 30;
            setRateLimitCooldown(seconds);
          }

          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === assistantMsgId
                ? {
                    ...msg,
                    content: chunk.deltaText,
                    calculatedData: chunk.calculatedData || msg.calculatedData,
                    isStreaming: !chunk.isComplete,
                    error: chunk.error,
                  }
                : msg
            )
          );
        },
        controller.signal
      );
    } catch {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === assistantMsgId
            ? {
                ...msg,
                isStreaming: false,
                error: "Failed to connect to Finora Financial Context Layer. Please retry.",
              }
            : msg
        )
      );
    } finally {
      setIsGenerating(false);
      abortControllerRef.current = null;
    }
  };

  // Stop Generation
  const handleStopGeneration = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
      setIsGenerating(false);
    }
  };

  // Retry last prompt
  const handleRetry = () => {
    if (lastUserPrompt && !isGenerating) {
      handleSendMessage(lastUserPrompt);
    }
  };

  // Clear conversation
  const handleClearConversation = async () => {
    handleStopGeneration();
    const res = await aiService.clearConversation("conv-default");
    if (res.data) {
      setMessages(res.data.messages);
    }
  };

  return (
    <AppShell>
      <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto flex flex-col h-[calc(100vh-4.5rem)] space-y-4">
        {/* Header */}
        <ConversationHeader
          title="Finora AI Financial Intelligence Briefing"
          onClear={handleClearConversation}
          isGenerating={isGenerating}
        />

        {/* Rate limit warning if active */}
        <RateLimitBanner
          cooldownSeconds={rateLimitCooldown}
          onCooldownComplete={() => setRateLimitCooldown(0)}
        />

        {/* Scrollable Chat Feed */}
        <div className="flex-1 overflow-y-auto space-y-6 pr-2">
          {messages.map((msg, index) => {
            const isLatestAssistant =
              msg.role === "assistant" &&
              index === messages.length - 1 &&
              !isGenerating;

            return (
              <ChatMessageBubble
                key={msg.id}
                message={msg}
                onRetry={handleRetry}
                isLatestAssistant={isLatestAssistant}
              />
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Inquiries (Shown when not streaming) */}
        {!isGenerating && (
          <div className="pt-1">
            <SuggestedQuestionsPill
              questions={SUGGESTED_QUESTIONS}
              onSelect={handleSendMessage}
              disabled={isGenerating || rateLimitCooldown > 0}
            />
          </div>
        )}

        {/* Chat Input Bar */}
        <div className="space-y-2">
          <ChatInputBar
            onSend={handleSendMessage}
            onStop={handleStopGeneration}
            isGenerating={isGenerating}
            disabled={rateLimitCooldown > 0}
          />

          {/* Financial Disclaimer Banner */}
          <DisclaimerBanner />
        </div>
      </div>
    </AppShell>
  );
}
