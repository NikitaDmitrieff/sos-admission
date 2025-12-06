'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, MessageSquare, Loader2 } from 'lucide-react';

type Message = {
  role: 'user' | 'assistant';
  content: string;
};

export default function AICoachPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');

    // Add user message immediately
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const response = await fetch(`${backendUrl}/api/chat/stream`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: userMessage }),
      });

      if (!response.ok) {
        throw new Error('Failed to connect to AI Coach');
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let assistantMessage = '';

      if (reader) {
        let buffer = '';

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n\n');

          // Keep the last incomplete line in the buffer
          buffer = lines.pop() || '';

          for (const chunk of lines) {
            const line = chunk.trim();
            if (line.startsWith('data: ')) {
              const content = line.slice(6); // Remove 'data: ' prefix

              if (content === '[DONE]') {
                setIsLoading(false);
                break;
              } else if (content.startsWith('[ERROR]')) {
                setMessages(prev => [...prev, {
                  role: 'assistant',
                  content: 'Sorry, I encountered an error. Please try again.'
                }]);
                setIsLoading(false);
                break;
              } else if (content) {
                // Append to our local message
                assistantMessage += content;
                // Update the messages with the accumulated content
                setMessages(prev => {
                  const newMessages = [...prev];
                  // Check if last message is assistant message being built
                  if (newMessages[newMessages.length - 1]?.role === 'assistant') {
                    newMessages[newMessages.length - 1].content = assistantMessage;
                  } else {
                    newMessages.push({ role: 'assistant', content: assistantMessage });
                  }
                  return newMessages;
                });
              }
            }
          }
        }
      }

      setIsLoading(false);
    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => {
        const newMessages = [...prev];
        if (newMessages[newMessages.length - 1].role === 'assistant' &&
          newMessages[newMessages.length - 1].content === '') {
          newMessages[newMessages.length - 1].content =
            'Sorry, I couldn\'t connect to the AI Coach. Please make sure the backend is running.';
        } else {
          newMessages.push({
            role: 'assistant',
            content: 'Sorry, I couldn\'t connect to the AI Coach. Please make sure the backend is running.'
          });
        }
        return newMessages;
      });
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-64px)]">
      {/* Header - Minimal Style */}
      <div className="border-b px-8 py-4">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-lg font-medium text-muted-foreground">AI Coach</h1>
        </div>
      </div>

      {/* Messages Area */}
      <div
        ref={scrollAreaRef}
        className="flex-1 overflow-y-auto px-8 py-6"
      >
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-4 max-w-md mx-auto">
            <div className="h-16 w-16 bg-primary/10 flex items-center justify-center">
              <MessageSquare className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-medium mb-2">Start a conversation</h2>
              <p className="text-sm text-muted-foreground">
                Ask me anything about university admissions, personal statements, or application processes.
              </p>
            </div>
            <div className="flex flex-col gap-2 w-full text-left">
              <button
                onClick={() => setInput('What should I include in my personal statement?')}
                className="px-4 py-3 text-sm border hover:border-foreground hover:bg-foreground/5 transition-colors text-left"
                style={{ borderRadius: 0 }}
              >
                What should I include in my personal statement?
              </button>
              <button
                onClick={() => setInput('How do I choose the right university?')}
                className="px-4 py-3 text-sm border hover:border-foreground hover:bg-foreground/5 transition-colors text-left"
                style={{ borderRadius: 0 }}
              >
                How do I choose the right university?
              </button>
              <button
                onClick={() => setInput('What are the key deadlines I should know about?')}
                className="px-4 py-3 text-sm border hover:border-foreground hover:bg-foreground/5 transition-colors text-left"
                style={{ borderRadius: 0 }}
              >
                What are the key deadlines I should know about?
              </button>
            </div>
          </div>
        ) : (
          <div className="max-w-3xl mx-auto space-y-6">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex gap-4 ${message.role === 'user' ? 'justify-end' : 'justify-start'
                  }`}
              >
                {message.role === 'assistant' && (
                  <div className="h-8 w-8 bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <MessageSquare className="h-4 w-4 text-primary" />
                  </div>
                )}
                <div
                  className={`max-w-[80%] px-4 py-3 ${message.role === 'user'
                      ? 'bg-foreground text-background'
                      : 'bg-muted'
                    }`}
                  style={{ borderRadius: 0 }}
                >
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                </div>
                {message.role === 'user' && (
                  <div className="h-8 w-8 bg-foreground/10 flex items-center justify-center flex-shrink-0">
                    <div className="h-4 w-4 rounded-full bg-foreground/20" />
                  </div>
                )}
              </div>
            ))}
            {isLoading && (
              <div className="flex gap-4 justify-start">
                <div className="h-8 w-8 bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <MessageSquare className="h-4 w-4 text-primary" />
                </div>
                <div className="max-w-[80%] px-4 py-3 bg-muted" style={{ borderRadius: 0 }}>
                  <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="border-t px-8 py-6">
        <form onSubmit={handleSubmit} className="max-w-3xl mx-auto">
          <div className="relative">
            <input
              type="text"
              placeholder="Ask me anything about admissions..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isLoading}
              className="w-full h-12 pl-4 pr-12 text-sm bg-background border focus:outline-none focus:border-foreground transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ borderRadius: 0 }}
              autoFocus
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </button>
          </div>
          <p className="text-xs text-muted-foreground mt-2 text-center">
            Powered by GPT-3.5 • Responses may take a few seconds
          </p>
        </form>
      </div>
    </div>
  );
}
