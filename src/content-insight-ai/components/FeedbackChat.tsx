import { useState, useRef, useEffect } from 'react';
import { Send, Video, Plus, BarChart3, History, X, Upload, AlertTriangle, ShieldCheck, Brain, Globe } from 'lucide-react';
import type { ChatMessage, FeedbackType, ContentType, ContentVerdict } from '../types/feedback';
import { getChatMessages, addChatMessage, clearChat } from '../lib/feedback-store';
import { generateAIGreeting, generateContextualResponse, processAndLearn } from '../lib/ai-learning-engine';
import { createFeedbackReport } from '../lib/feedback-store';
import { getLang, setLang, autoDetectAndSet, type Lang } from '../lib/language';
import { FeedbackForm } from './FeedbackForm';
import { StatsPanel } from './StatsPanel';
import { LearningHistory } from './LearningHistory';
import { TrainingPanel } from './TrainingPanel';

type ViewMode = 'chat' | 'feedback-form' | 'stats' | 'history' | 'training';

export function FeedbackChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('chat');
  const [isTyping, setIsTyping] = useState(false);
  const [lang, setCurrentLang] = useState<Lang>(getLang());
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [attachments, setAttachments] = useState<{ type: 'image' | 'video' | 'screenshot'; url: string; filename: string; size: number }[]>([]);

  useEffect(() => {
    const stored = getChatMessages();
    if (stored.length === 0) {
      const greeting = generateAIGreeting();
      const msg = addChatMessage({ role: 'ai', content: greeting });
      setMessages([msg]);
    } else {
      setMessages(stored);
    }
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  function toggleLang() {
    const newLang = lang === 'uz' ? 'en' : 'uz';
    setLang(newLang);
    setCurrentLang(newLang);
  }

  function handleSend() {
    if (!input.trim() && attachments.length === 0) return;

    const detected = autoDetectAndSet(input);
    setCurrentLang(detected);

    const userMsg = addChatMessage({
      role: 'user',
      content: input.trim(),
      attachments: attachments.length > 0 ? attachments : undefined,
      metadata: { lang: detected },
    });

    setMessages((prev) => [...prev, userMsg]);
    const savedInput = input;
    setInput('');
    setAttachments([]);
    setIsTyping(true);

    setTimeout(async () => {
      const aiText = await generateContextualResponse(savedInput);
      const aiMsg = addChatMessage({ role: 'ai', content: aiText, metadata: { lang: getLang() } });
      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);
    }, 800);
  }

  function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files) return;
    Array.from(files).forEach((file) => {
      const url = URL.createObjectURL(file);
      const type = file.type.startsWith('video/') ? 'video' as const : 'image' as const;
      setAttachments((prev) => [...prev, { type, url, filename: file.name, size: file.size }]);
    });
    e.target.value = '';
  }

  function removeAttachment(idx: number) {
    setAttachments((prev) => prev.filter((_, i) => i !== idx));
  }

  function handleFeedbackSubmit(data: {
    type: FeedbackType;
    content_type: ContentType;
    verdict_given: ContentVerdict;
    verdict_correct: ContentVerdict;
    description: string;
    screenshot_urls: string[];
    video_url?: string;
    related_knowledge_file?: string;
    tags: string[];
  }) {
    const report = createFeedbackReport(data);

    const fpLabel = lang === 'uz' ? "Noto'g'ri bloklandi" : "Incorrectly blocked";
    const fnLabel = lang === 'uz' ? "Bloklanmadi" : "Not blocked";
    const suggLabel = lang === 'uz' ? "Taklif" : "Suggestion";
    const typeLabel = data.type === 'false_positive' ? fpLabel : data.type === 'false_negative' ? fnLabel : suggLabel;

    const userMsg = addChatMessage({
      role: 'user',
      content: `📋 **${typeLabel}**\n\n**${lang === 'uz' ? 'Kontent turi' : 'Content type'}:** ${data.content_type}\n**${lang === 'uz' ? 'Izoh' : 'Note'}:** ${data.description}`,
      feedback_report_id: report.id,
      attachments: data.screenshot_urls.map((url, i) => ({
        type: 'screenshot' as const,
        url,
        filename: `screenshot-${i + 1}.png`,
        size: 0,
      })),
    });

    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);

    setTimeout(() => {
      processAndLearn(report);
      setMessages((prev) => [...prev, ...getChatMessages().slice(prev.length)]);
      setIsTyping(false);
    }, 1500);

    setViewMode('chat');
  }

  function handleClearChat() {
    clearChat();
    const greeting = generateAIGreeting();
    const msg = addChatMessage({ role: 'ai', content: greeting });
    setMessages([msg]);
  }

  const contentArea = () => {
    switch (viewMode) {
      case 'feedback-form':
        return <FeedbackForm onSubmit={handleFeedbackSubmit} onCancel={() => setViewMode('chat')} lang={lang} />;
      case 'stats':
        return <StatsPanel lang={lang} />;
      case 'history':
        return <LearningHistory lang={lang} />;
      case 'training':
        return <TrainingPanel lang={lang} />;
      default:
        return null;
    }
  };

  if (viewMode !== 'chat') {
    return (
      <div className="flex flex-col h-full bg-gray-950">
        <ChatHeader viewMode={viewMode} setViewMode={setViewMode} onClear={handleClearChat} lang={lang} onToggleLang={toggleLang} />
        <div className="flex-1 overflow-y-auto p-4">{contentArea()}</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-gray-950">
      <ChatHeader viewMode={viewMode} setViewMode={setViewMode} onClear={handleClearChat} lang={lang} onToggleLang={toggleLang} />

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} />
        ))}

        {isTyping && (
          <div className="flex items-center gap-2 text-gray-400 text-sm">
            <div className="flex gap-1">
              <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
            {lang === 'uz' ? 'AI tahlil qilyapti...' : 'AI analyzing...'}
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {attachments.length > 0 && (
        <div className="px-4 py-2 border-t border-gray-800 flex gap-2 flex-wrap">
          {attachments.map((att, i) => (
            <div key={i} className="relative group">
              {att.type === 'image' || att.type === 'screenshot' ? (
                <img src={att.url} alt={att.filename} className="w-16 h-16 rounded-lg object-cover border border-gray-700" />
              ) : (
                <div className="w-16 h-16 rounded-lg bg-gray-800 border border-gray-700 flex items-center justify-center">
                  <Video className="w-6 h-6 text-gray-400" />
                </div>
              )}
              <button onClick={() => removeAttachment(i)} className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                <X className="w-3 h-3 text-white" />
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="p-4 border-t border-gray-800">
        <div className="flex gap-2 mb-3">
          <button onClick={() => setViewMode('feedback-form')} className="flex items-center gap-1.5 px-3 py-1.5 bg-red-500/20 text-red-400 rounded-lg text-sm hover:bg-red-500/30 transition">
            <Plus className="w-4 h-4" /> {lang === 'uz' ? 'Yangi feedback' : 'New feedback'}
          </button>
          <button onClick={() => fileInputRef.current?.click()} className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-800 text-gray-300 rounded-lg text-sm hover:bg-gray-700 transition">
            <Upload className="w-4 h-4" /> {lang === 'uz' ? 'Fayl' : 'File'}
          </button>
        </div>

        <div className="flex items-end gap-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder={lang === 'uz' ? 'Xabar yozing yoki feedback bering...' : 'Type a message or give feedback...'}
            rows={1}
            className="flex-1 bg-gray-800 text-white rounded-xl px-4 py-3 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500/50 placeholder-gray-500"
            style={{ minHeight: '48px', maxHeight: '120px' }}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() && attachments.length === 0}
            className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center hover:bg-blue-500 transition disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Send className="w-5 h-5 text-white" />
          </button>
        </div>

        <input ref={fileInputRef} type="file" accept="image/*,video/*" multiple onChange={handleFileUpload} className="hidden" />
      </div>
    </div>
  );
}

function ChatHeader({ viewMode, setViewMode, onClear, lang, onToggleLang }: { viewMode: ViewMode; setViewMode: (v: ViewMode) => void; onClear: () => void; lang: Lang; onToggleLang: () => void }) {
  return (
    <div className="bg-gray-900 border-b border-gray-800 px-4 py-3">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <ShieldCheck className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-white font-semibold text-sm">Content Insight AI</h2>
            <p className="text-gray-400 text-xs">Feedback & Learning System</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={onToggleLang} className="flex items-center gap-1 px-2 py-1 bg-gray-800 rounded-lg text-xs text-gray-300 hover:bg-gray-700 transition" title="Switch language">
            <Globe className="w-3.5 h-3.5" />
            {lang.toUpperCase()}
          </button>
          {viewMode === 'chat' && (
            <button onClick={onClear} className="text-gray-500 hover:text-gray-300 text-xs">
              {lang === 'uz' ? 'Tozalash' : 'Clear'}
            </button>
          )}
        </div>
      </div>

      <div className="flex gap-1">
        {([
          { key: 'chat' as const, label: lang === 'uz' ? 'Chat' : 'Chat', icon: Send },
          { key: 'feedback-form' as const, label: 'Feedback', icon: AlertTriangle },
          { key: 'training' as const, label: 'Training', icon: Brain },
          { key: 'stats' as const, label: lang === 'uz' ? 'Statistika' : 'Stats', icon: BarChart3 },
          { key: 'history' as const, label: lang === 'uz' ? 'Tarix' : 'History', icon: History },
        ]).map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setViewMode(key)}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs transition ${
              viewMode === key ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-gray-200'
            }`}
          >
            <Icon className="w-3.5 h-3.5" />
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}

function MessageBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === 'user';
  const isSystem = message.role === 'system';

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-[85%] rounded-2xl px-4 py-3 ${isUser ? 'bg-blue-600 text-white' : isSystem ? 'bg-yellow-500/20 text-yellow-200 border border-yellow-500/30' : 'bg-gray-800 text-gray-100'}`}>
        <div className="text-sm whitespace-pre-wrap leading-relaxed">
          {message.content.split(/(\*\*.*?\*\*)/).map((part, i) => {
            if (part.startsWith('**') && part.endsWith('**')) {
              return <strong key={i} className="font-semibold">{part.slice(2, -2)}</strong>;
            }
            return <span key={i}>{part}</span>;
          })}
        </div>

        {message.attachments && message.attachments.length > 0 && (
          <div className="mt-2 flex gap-2 flex-wrap">
            {message.attachments.map((att) => (
              <div key={att.id} className="relative">
                {att.type === 'video' ? (
                  <div className="w-24 h-24 rounded-lg bg-gray-900 flex items-center justify-center border border-gray-600">
                    <Video className="w-8 h-8 text-gray-400" />
                  </div>
                ) : (
                  <img src={att.url || att.thumbnail_url} alt={att.filename} className="w-24 h-24 rounded-lg object-cover border border-gray-600" />
                )}
              </div>
            ))}
          </div>
        )}

        <div className={`text-[10px] mt-1 ${isUser ? 'text-blue-200' : 'text-gray-500'}`}>
          {new Date(message.timestamp).toLocaleTimeString('uz', { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
    </div>
  );
}
