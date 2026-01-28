import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, Bot, User, Sparkles, BookOpen, Shield } from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface SidebarRightProps {
  onSendMessage: (query: string) => Promise<string>;
  isProcessing: boolean;
}

export const SidebarRight: React.FC<SidebarRightProps> = ({ onSendMessage, isProcessing }) => {
  const [activeTab, setActiveTab] = useState<'chat' | 'docs'>('chat');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'DeepSource Assistant initialized. Ready to analyze evidence.',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, activeTab]);

  const handleSend = async () => {
    if (!input.trim() || isProcessing) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');

    const response = await onSendMessage(userMsg.content);

    const aiMsg: Message = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: response,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, aiMsg]);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="w-80 bg-slate-950 border-l border-slate-800 flex flex-col h-full z-20">
      
      {/* Tab Header */}
      <div className="flex border-b border-slate-800 bg-slate-900/50">
        <button
          onClick={() => setActiveTab('chat')}
          className={`flex-1 py-3 text-xs font-bold font-mono uppercase tracking-wider flex items-center justify-center gap-2 transition-colors ${
            activeTab === 'chat' ? 'text-cyan-400 bg-slate-900 border-b-2 border-cyan-400' : 'text-slate-500 hover:text-slate-300'
          }`}
        >
          <Sparkles className="w-3 h-3" />
          Assistant
        </button>
        <button
          onClick={() => setActiveTab('docs')}
          className={`flex-1 py-3 text-xs font-bold font-mono uppercase tracking-wider flex items-center justify-center gap-2 transition-colors ${
            activeTab === 'docs' ? 'text-cyan-400 bg-slate-900 border-b-2 border-cyan-400' : 'text-slate-500 hover:text-slate-300'
          }`}
        >
          <BookOpen className="w-3 h-3" />
          How it Works
        </button>
      </div>

      {/* Content Area */}
      {activeTab === 'chat' ? (
        <>
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className={`w-8 h-8 rounded flex items-center justify-center flex-shrink-0 ${msg.role === 'assistant' ? 'bg-cyan-900/20 text-cyan-400 border border-cyan-900' : 'bg-slate-800 text-slate-300 border border-slate-700'}`}>
                  {msg.role === 'assistant' ? <Bot className="w-5 h-5" /> : <User className="w-5 h-5" />}
                </div>
                <div className={`flex flex-col max-w-[85%] ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                  <div className={`p-3 rounded-lg text-sm ${
                    msg.role === 'assistant' 
                      ? 'bg-slate-900 text-slate-300 border border-slate-800' 
                      : 'bg-cyan-950 text-cyan-100 border border-cyan-900'
                  }`}>
                    {msg.content}
                  </div>
                  <span className="text-[10px] text-slate-600 font-mono mt-1">
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            ))}
            {isProcessing && (
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded bg-cyan-900/20 text-cyan-400 border border-cyan-900 flex items-center justify-center">
                  <Bot className="w-5 h-5" />
                </div>
                <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-pulse"></div>
                    <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-pulse delay-100"></div>
                    <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-pulse delay-200"></div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-4 border-t border-slate-800 bg-slate-900/30">
            <div className="relative">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about the documents..."
                className="w-full bg-slate-950 border border-slate-700 rounded-md p-3 pr-12 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-cyan-500 resize-none h-20 font-sans"
              />
              <button 
                onClick={handleSend}
                disabled={!input.trim() || isProcessing}
                className="absolute right-2 bottom-2 p-2 text-cyan-400 hover:text-cyan-300 disabled:text-slate-700 transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </>
      ) : (
        <div className="flex-1 overflow-y-auto p-6 space-y-8 text-slate-300">
          <section>
            <h3 className="text-cyan-400 font-mono font-bold text-sm uppercase mb-2">The Workflow</h3>
            <ol className="space-y-3 text-sm list-decimal pl-4 marker:text-slate-600">
              <li>Upload PDF, Text, or Image documents via the <span className="text-slate-200 font-semibold">Evidence Locker</span>.</li>
              <li>The system automatically extracts entities and connections.</li>
              <li>Visualize the network on the <span className="text-slate-200 font-semibold">Board</span>.</li>
              <li>Explore the <span className="text-slate-200 font-semibold">Chronological Timeline</span> to see events in order.</li>
              <li>Query the Assistant to synthesize information.</li>
            </ol>
          </section>

          <section>
            <h3 className="text-cyan-400 font-mono font-bold text-sm uppercase mb-2">The Technology</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              DeepSource is a client-side secure environment. This app is built using React, Tailwind CSS, and powered by the <span className="text-white font-semibold">Gemini 3 Pro model</span> for advanced reasoning and entity extraction.
            </p>
          </section>

          <section>
            <h3 className="text-cyan-400 font-mono font-bold text-sm uppercase mb-2 flex items-center gap-2">
              <Shield className="w-3 h-3" />
              Privacy Protocol
            </h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Data remains local to your browser session. Documents are analyzed in real-time and are not permanently stored on any external server. Refreshing the page clears the investigation cache.
            </p>
          </section>

          <div className="p-4 bg-slate-900 border border-slate-800 rounded text-xs font-mono text-slate-500 text-center">
            v1.0.0-STABLE
          </div>
        </div>
      )}
    </div>
  );
};