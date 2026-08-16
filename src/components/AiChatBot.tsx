import { useState, useEffect, useRef, type FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  MessageSquare,
  User,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Send,
  X,
  Minimize2,
  Maximize2,
  Sparkles,
  RefreshCw,
  Calendar,
  Phone,
  Heart,
  Smile,
  AlertCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { IMAGES } from '../constants';

interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: string;
  source?: string;
}

const QUICK_PROMPTS = [
  'Does acupuncture hurt?',
  'Can you help with sciatica & back pain?',
  'How does acupuncture support IVF & fertility?',
  'What are your hours & location in Watertown?',
  'How much is an initial consultation?',
  'What should I expect on my first visit?',
];

export function AiChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-1',
      sender: 'bot',
      text: "Hello and welcome! I'm your **AcuMeD Care Guide**, here to help you learn about Dr. Mostafa Medhati's acupuncture, herbal therapies, and holistic healing in Watertown, MA.\n\nHow can I support your health journey today? You can type your questions or tap the **microphone icon** to speak with me!",
      timestamp: 'Just now',
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speechError, setSpeechError] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const currentUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Initialize Web Speech Recognition and Synthesis
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Speech Synthesis
      if ('speechSynthesis' in window) {
        synthRef.current = window.speechSynthesis;
      }

      // Speech Recognition setup
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US';

        recognition.onstart = () => {
          setIsListening(true);
          setSpeechError(null);
        };

        recognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          if (transcript) {
            setInputMessage(transcript);
            // Automatically submit spoken inquiry after a brief pause
            setTimeout(() => {
              handleSendMessage(transcript);
            }, 300);
          }
        };

        recognition.onerror = (event: any) => {
          console.warn('Speech recognition event error:', event.error);
          setIsListening(false);
          if (event.error === 'not-allowed') {
            setSpeechError('Microphone access was denied. Please allow microphone in browser settings.');
          } else if (event.error !== 'no-speech') {
            setSpeechError(`Voice error: ${event.error}`);
          }
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current = recognition;
      }
    }

    const handleOpenChatEvent = (e: any) => {
      setIsOpen(true);
      if (e.detail?.prompt) {
        setTimeout(() => {
          handleSendMessage(e.detail.prompt);
        }, 200);
      }
    };

    window.addEventListener('open-ai-chat', handleOpenChatEvent);

    return () => {
      window.removeEventListener('open-ai-chat', handleOpenChatEvent);
      if (synthRef.current) {
        synthRef.current.cancel();
      }
    };
  }, []);

  // Auto-scroll chat
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, isLoading]);

  // Voice output function
  const speakText = (text: string) => {
    if (!synthRef.current || !isVoiceEnabled) return;

    synthRef.current.cancel();

    // Clean markdown asterisks for natural voice
    const cleanText = text
      .replace(/\*\*(.*?)\*\*/g, '$1')
      .replace(/\*(.*?)\*/g, '$1')
      .replace(/•/g, '')
      .replace(/#{1,6}\s?/g, '');

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    // Pick gentle English voice
    const voices = synthRef.current.getVoices();
    const preferredVoice = voices.find(
      (v) => (v.name.includes('Samantha') || v.name.includes('Natural') || v.name.includes('Google') || v.lang === 'en-US') && !v.name.includes('Bad')
    );
    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    currentUtteranceRef.current = utterance;
    synthRef.current.speak(utterance);
  };

  const stopSpeaking = () => {
    if (synthRef.current) {
      synthRef.current.cancel();
      setIsSpeaking(false);
    }
  };

  const toggleListening = () => {
    if (!recognitionRef.current) {
      setSpeechError('Speech recognition is not supported in this browser. Please use Chrome, Safari, or Edge.');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      stopSpeaking();
      try {
        recognitionRef.current.start();
      } catch {
        recognitionRef.current.stop();
        setTimeout(() => recognitionRef.current.start(), 100);
      }
    }
  };

  const handleSendMessage = async (customText?: string) => {
    const textToSend = customText || inputMessage;
    if (!textToSend.trim() || isLoading) return;

    stopSpeaking();
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: textToSend.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setIsLoading(true);
    setSpeechError(null);

    try {
      const historyContext = messages.map((m) => ({
        sender: m.sender,
        text: m.text,
      }));

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend,
          history: historyContext,
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to get response');
      }

      const data = await res.json();
      const botReply = data.reply || "I'm here to help with questions regarding Dr. Medhati's acupuncture, cupping, herbal medicine, and clinic services. How else can I assist you?";

      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: botReply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        source: data.source,
      };

      setMessages((prev) => [...prev, botMsg]);

      // Speak if voice enabled
      if (isVoiceEnabled) {
        speakText(botReply);
      }
    } catch {
      const fallbackMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: "Dr. Mostafa Medhati at **AcuMeD Clinic** (124 Watertown St, Watertown MA) provides expert acupuncture, herbal medicine, and pain management.\n\nYou can book directly online or call our desk at **(617) 926-2888**!",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearHistory = () => {
    stopSpeaking();
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        sender: 'bot',
        text: "Conversation refreshed! How can I assist you with acupuncture treatments, herbal remedies, or booking at AcuMeD Clinic?",
        timestamp: 'Just now',
      },
    ]);
  };

  // Helper to render formatted Markdown text
  const renderMessageContent = (text: string) => {
    const lines = text.split('\n');
    return (
      <div className="space-y-1.5 text-[13.5px] leading-relaxed">
        {lines.map((line, idx) => {
          if (!line.trim()) return <div key={idx} className="h-1.5" />;

          // Process bold markers **text**
          const parts = line.split(/(\*\*.*?\*\*)/g);
          const formattedLine = parts.map((part, pIdx) => {
            if (part.startsWith('**') && part.endsWith('**')) {
              return (
                <strong key={pIdx} className="font-semibold text-gray-900">
                  {part.slice(2, -2)}
                </strong>
              );
            }
            return part;
          });

          if (line.startsWith('•') || line.startsWith('-')) {
            return (
              <div key={idx} className="flex items-start gap-2 pl-1">
                <span className="text-teal-600 font-bold">•</span>
                <span>{formattedLine}</span>
              </div>
            );
          }

          return <p key={idx}>{formattedLine}</p>;
        })}
      </div>
    );
  };

  return (
    <>
      {/* Floating Launcher Button with Friendly Avatar */}
      <div className="fixed bottom-6 right-6 z-40 flex items-center gap-3">
        {!isOpen && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="hidden sm:flex items-center gap-2.5 bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-2xl shadow-xl border border-teal-100 text-xs font-semibold text-gray-800 pointer-events-none"
          >
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Ask our Care Guide / Voice</span>
          </motion.div>
        )}

        <motion.button
          onClick={() => {
            setIsOpen((prev) => !prev);
            if (isOpen) stopSpeaking();
          }}
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.94 }}
          className={`relative p-1 rounded-full shadow-2xl flex items-center justify-center transition-all cursor-pointer ${
            isOpen
              ? 'bg-gray-900 text-white w-14 h-14'
              : 'bg-gradient-to-tr from-teal-600 via-teal-500 to-emerald-400 p-1 shadow-teal-700/30'
          }`}
          aria-label="Toggle Friendly Holistic Care Assistant"
        >
          {/* Animated Gentle Ring */}
          {!isOpen && (
            <span className="absolute -inset-1 rounded-full bg-teal-400/30 animate-pulse pointer-events-none" />
          )}

          {isOpen ? (
            <X className="w-6 h-6 text-white" />
          ) : (
            <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-white shadow-inner bg-teal-50 flex items-center justify-center">
              <img
                src={IMAGES.aiAvatar}
                alt="AcuMeD Care Guide Avatar"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full" />
            </div>
          )}
        </motion.button>
      </div>

      {/* Chat Window Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className={`fixed z-50 bg-white rounded-3xl shadow-2xl border border-teal-100 flex flex-col overflow-hidden transition-all duration-300 ${
              isExpanded
                ? 'inset-4 sm:inset-10 max-w-4xl max-h-[85vh] mx-auto'
                : 'bottom-20 right-4 sm:right-6 w-[calc(100vw-2rem)] sm:w-[410px] h-[580px] max-h-[82vh]'
            }`}
          >
            {/* Header with Warm Caring Persona */}
            <div className="bg-gradient-to-r from-teal-800 via-teal-700 to-slate-900 text-white p-4 px-5 flex items-center justify-between shadow-md shrink-0">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-11 h-11 rounded-2xl overflow-hidden border-2 border-white/40 shadow-sm bg-teal-900">
                    <img
                      src={IMAGES.drMedhati}
                      alt="Dr. Mostafa Medhati"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 border-2 border-teal-900 rounded-full" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-bold text-sm text-white">Dr. Medhati Care Guide</h3>
                    <span className="text-[10px] bg-emerald-500/30 text-emerald-200 border border-emerald-400/30 px-1.5 py-0.2 rounded-full font-medium flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      Online
                    </span>
                  </div>
                  <p className="text-[11px] text-teal-200/90">
                    AcuMeD Clinic • Watertown, MA
                  </p>
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center gap-1">
                {/* Voice Auto-Read Toggle */}
                <button
                  onClick={() => {
                    setIsVoiceEnabled(!isVoiceEnabled);
                    if (isSpeaking) stopSpeaking();
                  }}
                  className={`p-1.5 rounded-xl transition-colors ${
                    isVoiceEnabled ? 'text-teal-200 hover:bg-white/10' : 'text-gray-400 hover:bg-white/10'
                  }`}
                  title={isVoiceEnabled ? 'Voice response enabled' : 'Voice response muted'}
                >
                  {isVoiceEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                </button>

                {/* Clear Chat */}
                <button
                  onClick={handleClearHistory}
                  className="p-1.5 rounded-xl text-teal-200 hover:bg-white/10 transition-colors"
                  title="Clear conversation"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>

                {/* Expand / Minimize */}
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="hidden sm:block p-1.5 rounded-xl text-teal-200 hover:bg-white/10 transition-colors"
                  title={isExpanded ? 'Collapse window' : 'Expand window'}
                >
                  {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                </button>

                {/* Close */}
                <button
                  onClick={() => {
                    setIsOpen(false);
                    stopSpeaking();
                  }}
                  className="p-1.5 rounded-xl text-teal-200 hover:bg-white/10 transition-colors"
                  title="Close chat"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Speaking Status Banner */}
            {isSpeaking && (
              <div className="bg-emerald-50 border-b border-emerald-100 px-4 py-1.5 flex items-center justify-between text-xs text-emerald-800 animate-fadeIn">
                <div className="flex items-center gap-2">
                  <span className="flex h-2 w-2 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  <span className="font-medium">Care Guide is speaking with you...</span>
                </div>
                <button
                  onClick={stopSpeaking}
                  className="text-xs text-emerald-900 font-bold underline hover:text-emerald-700 cursor-pointer"
                >
                  Mute Voice
                </button>
              </div>
            )}

            {/* Messages Body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/60">
              {messages.map((msg) => {
                const isUser = msg.sender === 'user';
                return (
                  <div
                    key={msg.id}
                    className={`flex items-start gap-2.5 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
                  >
                    {/* Avatar */}
                    {isUser ? (
                      <div className="w-8 h-8 rounded-full bg-teal-700 text-white flex items-center justify-center shrink-0 shadow-sm text-xs font-bold">
                        <User className="w-4 h-4" />
                      </div>
                    ) : (
                      <div className="w-8 h-8 rounded-full overflow-hidden border border-teal-200 shadow-sm shrink-0 bg-white">
                        <img
                          src={IMAGES.drMedhati}
                          alt="Dr. Mostafa Medhati"
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}

                    {/* Bubble */}
                    <div className={`max-w-[82%] sm:max-w-[78%] flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
                      <div
                        className={`p-3.5 rounded-2xl shadow-sm text-gray-800 ${
                          isUser
                            ? 'bg-teal-700 text-white rounded-tr-none'
                            : 'bg-white border border-gray-100 text-gray-800 rounded-tl-none shadow-teal-900/5'
                        }`}
                      >
                        {isUser ? (
                          <p className="text-[13.5px] leading-relaxed text-white whitespace-pre-wrap">{msg.text}</p>
                        ) : (
                          renderMessageContent(msg.text)
                        )}
                      </div>

                      {/* Timestamp & Read Aloud Icon */}
                      <div className="flex items-center gap-2 mt-1 px-1 text-[11px] text-gray-400">
                        <span>{msg.timestamp}</span>
                        {!isUser && (
                          <button
                            onClick={() => speakText(msg.text)}
                            className="text-teal-600 hover:text-teal-800 flex items-center gap-1 cursor-pointer font-medium"
                            title="Read aloud"
                          >
                            <Volume2 className="w-3 h-3" />
                            <span>Listen</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Loading Indicator */}
              {isLoading && (
                <div className="flex items-start gap-2.5">
                  <div className="w-8 h-8 rounded-full overflow-hidden border border-teal-200 shadow-sm shrink-0 bg-white">
                    <img
                      src={IMAGES.aiAvatar}
                      alt="Care Guide"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="bg-white border border-gray-100 p-3.5 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-2 text-xs text-gray-500">
                    <span className="flex gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-teal-600 animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-1.5 h-1.5 rounded-full bg-teal-600 animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-1.5 h-1.5 rounded-full bg-teal-600 animate-bounce" style={{ animationDelay: '300ms' }} />
                    </span>
                    <span className="text-gray-600 font-medium">Care Guide is preparing an answer...</span>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Prompts Carousel */}
            <div className="p-2.5 bg-white border-t border-gray-100 overflow-x-auto no-scrollbar shrink-0">
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] font-bold text-teal-800 uppercase tracking-wider pl-1 shrink-0 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-teal-600" />
                  Popular:
                </span>
                {QUICK_PROMPTS.map((prompt, i) => (
                  <button
                    key={i}
                    onClick={() => handleSendMessage(prompt)}
                    className="shrink-0 text-xs bg-teal-50/80 hover:bg-teal-100/80 text-teal-900 border border-teal-200/70 px-3 py-1.5 rounded-full transition-all active:scale-95 cursor-pointer whitespace-nowrap"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>

            {/* Microphone Listening Active Banner */}
            {isListening && (
              <div className="bg-teal-900 text-white px-4 py-2 flex items-center justify-between text-xs animate-pulse shrink-0">
                <div className="flex items-center gap-2">
                  <Mic className="w-4 h-4 text-rose-400 animate-bounce" />
                  <span className="font-semibold">Listening to you... Please speak your question</span>
                </div>
                <button
                  onClick={toggleListening}
                  className="bg-rose-500 hover:bg-rose-600 text-white font-bold px-2.5 py-0.5 rounded-full text-[11px]"
                >
                  Done
                </button>
              </div>
            )}

            {/* Speech error toast */}
            {speechError && (
              <div className="bg-amber-50 border-t border-amber-200 px-4 py-1.5 flex items-center justify-between text-xs text-amber-800 shrink-0">
                <div className="flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  <span className="truncate">{speechError}</span>
                </div>
                <button onClick={() => setSpeechError(null)} className="text-amber-900 font-bold ml-2">
                  ✕
                </button>
              </div>
            )}

            {/* Input Form */}
            <form onSubmit={(e: FormEvent) => { e.preventDefault(); handleSendMessage(); }} className="p-3 bg-white border-t border-gray-100 flex items-center gap-2 shrink-0">
              {/* Voice Mic Button */}
              <button
                type="button"
                onClick={toggleListening}
                className={`p-2.5 rounded-2xl border transition-all cursor-pointer shrink-0 ${
                  isListening
                    ? 'bg-rose-500 text-white border-rose-600 shadow-md shadow-rose-500/30 animate-pulse'
                    : 'bg-teal-50 hover:bg-teal-100 text-teal-700 border-teal-200/80'
                }`}
                title={isListening ? 'Stop voice recording' : 'Speak your question (Voice Input)'}
              >
                {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              </button>

              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder={isListening ? 'Listening to your voice...' : 'Type your question or tap mic to speak...'}
                className="flex-1 px-4 py-2.5 rounded-2xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 text-sm text-gray-800"
              />

              <button
                type="submit"
                disabled={!inputMessage.trim() || isLoading}
                className="p-2.5 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shrink-0 shadow-md shadow-teal-600/20"
                title="Send Message"
              >
                <Send className="w-5 h-5" />
              </button>
            </form>

            {/* Footer Quick Actions */}
            <div className="bg-slate-100/80 px-4 py-2 border-t border-gray-200/60 flex items-center justify-between text-[11px] text-gray-500 shrink-0">
              <div className="flex items-center gap-3">
                <Link
                  to="/book"
                  onClick={() => setIsOpen(false)}
                  className="text-teal-700 hover:underline font-semibold flex items-center gap-1"
                >
                  <Calendar className="w-3 h-3" /> Book Appointment
                </Link>
                <a
                  href="tel:6179262888"
                  className="text-gray-600 hover:text-teal-700 flex items-center gap-1"
                >
                  <Phone className="w-3 h-3" /> (617) 926-2888
                </a>
              </div>
              <span className="text-[10px] text-gray-400">Dr. Mostafa Medhati • MD, Ph.D.</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
