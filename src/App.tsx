import { useState, useEffect, useRef } from "react";
import { 
  MessageSquare, Send, Volume2, Languages, BookOpen, 
  Sparkles, AlertCircle, Trash2, HelpCircle, Loader2, Play, Pause,
  Brain, Cpu, Activity, FileText, ChevronRight, Menu, X, Info
} from "lucide-react";
import { MASTERCLASS_TOPICS } from "./topics.js";
import { Message, MasterclassTopic } from "./types.js";

export default function App() {
  const [selectedTopicId, setSelectedTopicId] = useState<string>("gemini-cli-essentials");
  const [language, setLanguage] = useState<"en" | "hi" | "bilingual">("bilingual");
  const [voice, setVoice] = useState<"Kore" | "Puck" | "Charon" | "Fenrir" | "Zephyr">("Kore");
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorString, setErrorString] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // Audio states
  const [playingAudioId, setPlayingAudioId] = useState<string | null>(null);
  const [loadingAudioId, setLoadingAudioId] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const messageEndRef = useRef<HTMLDivElement | null>(null);

  // Active topic
  const activeTopic = MASTERCLASS_TOPICS.find((t) => t.id === selectedTopicId) || MASTERCLASS_TOPICS[0];

  // Load chat history specific to topic from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(`chat_history_${selectedTopicId}`);
    if (saved) {
      try {
        setMessages(JSON.parse(saved));
      } catch (e) {
        setMessages(getInitialMessage());
      }
    } else {
      setMessages(getInitialMessage());
    }
    // Clear any previous error strings
    setErrorString(null);
  }, [selectedTopicId]);

  // Save messages to localstorage
  const saveMessages = (updatedMessages: Message[]) => {
    setMessages(updatedMessages);
    localStorage.setItem(`chat_history_${selectedTopicId}`, JSON.stringify(updatedMessages));
  };

  // Scroll to bottom
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  // Initial welcome message per topic
  const getInitialMessage = (): Message[] => {
    return [
      {
        id: "welcome",
        sender: "bot",
        text: `नमस्ते! I am your AI Study Companion for **${activeTopic.title}**. Let's deconstruct this masterclass!
        
You can query any specific detail of this module. I will respond to you in English, Hindi, or comfortable Bilingual Hinglish.
        
**Suggestive Outline Tracks:**
- Explain the key systemic architecture of this topic.
- What are the major real-world bottlenecks or constraints?
- Describe the core operations or command controls.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ];
  };

  // Generate chatbot reply
  const sendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || isLoading) return;

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      sender: "user",
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const updated = [...messages, userMsg];
    saveMessages(updated);
    setInputText("");
    setIsLoading(true);
    setErrorString(null);

    const apiMessages = updated.map((m) => ({
      role: m.sender === "user" ? ("user" as const) : ("model" as const),
      parts: [{ text: m.text }]
    }));

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: apiMessages,
          topicId: selectedTopicId,
          language: language
        })
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Failed to contact tutoring engine.");
      }

      const data = await response.json();
      
      const botMsg: Message = {
        id: `bot-${Date.now()}`,
        sender: "bot",
        text: data.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      saveMessages([...updated, botMsg]);
    } catch (err: any) {
      console.error(err);
      setErrorString(err.message || "Network error. Please check your connection.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearHistory = () => {
    if (window.confirm("Are you sure you want to clear your chat history for this topic?")) {
      const cleared = getInitialMessage();
      saveMessages(cleared);
      if (audioRef.current) {
        audioRef.current.pause();
      }
      setPlayingAudioId(null);
    }
  };

  // Speak text using text-to-speech converter
  const speakMessage = async (msgId: string, text: string) => {
    if (playingAudioId === msgId) {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      setPlayingAudioId(null);
      return;
    }

    setLoadingAudioId(msgId);
    setErrorString(null);

    try {
      const response = await fetch("/api/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, voice }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Failed to generate audio.");
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);

      if (audioRef.current) {
        audioRef.current.pause();
      }

      const audio = new Audio(url);
      audioRef.current = audio;

      audio.onended = () => {
        setPlayingAudioId(null);
        URL.revokeObjectURL(url);
      };

      audio.onplay = () => {
        setPlayingAudioId(msgId);
        setLoadingAudioId(null);
      };

      audio.onerror = () => {
        setLoadingAudioId(null);
        setPlayingAudioId(null);
      };

      await audio.play();
    } catch (err: any) {
      console.error("Audio conversion error:", err);
      setErrorString(`${err.message} (Speech synthesis failed)`);
      setLoadingAudioId(null);
      setPlayingAudioId(null);
    }
  };

  const getTopicIcon = (category: string) => {
    switch (category) {
      case "AI Tools":
        return <Cpu className="w-4 h-4 text-blue-400" />;
      case "AI Infrastructure":
        return <Activity className="w-4 h-4 text-emerald-400" />;
      case "Distributed Training":
        return <Brain className="w-4 h-4 text-violet-400" />;
      case "Prompt Engineering":
        return <Sparkles className="w-4 h-4 text-pink-400" />;
      case "Computer Vision":
        return <Activity className="w-4 h-4 text-amber-400" />;
      case "Robotics":
        return <Cpu className="w-4 h-4 text-red-500" />;
      default:
        return <FileText className="w-4 h-4 text-cyan-400" />;
    }
  };

  const formatBody = (text: string) => {
    const lines = text.split("\n");
    return lines.map((line, idx) => {
      const trimmed = line.trim();
      if (trimmed.startsWith("###")) {
        return (
          <h4 key={idx} className="text-sm font-black uppercase tracking-wider text-blue-400 mt-4 mb-1.5 font-display">
            {trimmed.replace("###", "").trim()}
          </h4>
        );
      }
      if (trimmed.startsWith("##")) {
        return (
          <h3 key={idx} className="text-lg font-extrabold text-white tracking-tight mt-5 mb-2 font-display uppercase border-l-2 border-blue-500 pl-2">
            {trimmed.replace("##", "").trim()}
          </h3>
        );
      }
      if (trimmed.startsWith("#")) {
        return (
          <h2 key={idx} className="text-2xl font-black text-white leading-none tracking-tighter mt-6 mb-3 font-display uppercase">
            {trimmed.replace("#", "").trim()}
          </h2>
        );
      }
      if (trimmed.startsWith("-") || trimmed.startsWith("*")) {
        return (
          <li key={idx} className="ml-4 list-disc text-slate-300 my-1.5 font-sans text-sm md:text-base">
            {parseInline(trimmed.substring(1).trim())}
          </li>
        );
      }
      if (/^\d+\./.test(trimmed)) {
        return (
          <li key={idx} className="ml-4 list-decimal text-slate-300 my-1.5 font-sans text-sm md:text-base">
            {parseInline(trimmed.replace(/^\d+\./, "").trim())}
          </li>
        );
      }
      if (trimmed === "") {
        return <div key={idx} className="h-2" />;
      }
      return (
        <p key={idx} className="text-slate-300 my-2 leading-relaxed font-sans text-sm md:text-base">
          {parseInline(line)}
        </p>
      );
    });
  };

  const parseInline = (text: string) => {
    const parts = text.split(/\*\*([^*]+)\*\*/g);
    return parts.map((part, i) => {
      if (i % 2 === 1) {
        return (
          <strong key={i} className="text-white font-extrabold bg-blue-500/10 px-1 py-0.5 rounded border border-blue-500/20">
            {part}
          </strong>
        );
      }
      const codeParts = part.split(/`([^`]+)`/g);
      return codeParts.map((subPart, j) => {
        if (j % 2 === 1) {
          return (
            <code key={j} className="bg-slate-900 px-2 py-0.5 rounded text-pink-400 font-mono text-xs border border-slate-800">
              {subPart}
            </code>
          );
        }
        return subPart;
      });
    });
  };

  return (
    <div className="flex h-screen bg-[#070b13] overflow-hidden text-slate-100 font-sans">
      
      {/* SIDEBAR: Left column presentation topics list */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-80 bg-slate-950 border-r border-slate-800 p-6 transform transition-transform duration-300 ease-in-out flex flex-col flex-none
        lg:static lg:transform-none lg:z-0
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}>
        {/* Sidebar Header */}
        <div className="flex items-center justify-between pb-5 border-b border-slate-800 mb-6">
          <div className="flex flex-col">
            <span className="text-[9px] font-black uppercase tracking-[0.25em] text-blue-500">MASTERCLASS LECTURES</span>
            <h2 className="font-display font-black text-xl text-white tracking-tight select-none mt-0.5">LEARNING PATHS</h2>
          </div>
          <button 
            type="button"
            onClick={() => setSidebarOpen(false)}
            className="p-1.5 text-slate-400 hover:text-white lg:hidden bg-slate-900 border border-slate-800 rounded"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable list of modules sorted by index */}
        <div className="flex-1 overflow-y-auto space-y-2 pr-1 rounded-sm">
          {MASTERCLASS_TOPICS.map((topic, index) => {
            const isSelected = topic.id === selectedTopicId;
            return (
              <button
                key={topic.id}
                type="button"
                onClick={() => {
                  setSelectedTopicId(topic.id);
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-start gap-4 p-3.5 rounded-xl text-left transition-all border group relative overflow-hidden ${
                  isSelected 
                    ? "bg-slate-900 border-slate-700 text-white shadow-lg shadow-blue-500/5" 
                    : "bg-transparent border-transparent hover:bg-slate-900/40 hover:border-slate-800 text-slate-400"
                }`}
              >
                <div className={`mt-0.5 p-1.5 rounded-lg ${isSelected ? "bg-blue-600/10" : "bg-slate-900"}`}>
                  {getTopicIcon(topic.category)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1.5">
                    <span className="text-[9px] font-mono tracking-widest text-slate-500 uppercase font-black uppercase">
                      {topic.category}
                    </span>
                    <span className="text-[10px] font-mono text-slate-600 font-bold">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </div>
                  <h3 className={`text-xs tracking-tight truncate mt-1 ${isSelected ? "text-white font-black" : "text-slate-300 font-bold group-hover:text-white"}`}>
                    {topic.title}
                  </h3>
                  <p className="text-[10px] text-slate-500 truncate font-medium mt-0.5">
                    {topic.hindiTitle}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Sidebar Footer */}
        <div className="pt-4 mt-4 border-t border-slate-800 flex justify-between items-center text-[10px] font-mono text-slate-500">
          <span>LECTURER: KR. BHARTI SINGH</span>
          <span>© 2026</span>
        </div>
      </aside>

      {/* CHAT WINDOW: Main area */}
      <section className="flex-grow flex flex-col relative bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-slate-900/40 via-slate-950 to-slate-950 min-w-0">
        
        {/* Main Header */}
        <header className="flex-none border-b border-slate-800 p-6 flex justify-between items-center bg-slate-950/80 backdrop-blur-sm z-10">
          <div className="flex items-center space-x-4 min-w-0">
            <button 
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 text-slate-400 hover:text-white rounded bg-slate-900 border border-slate-800"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="min-w-0">
              <div className="flex items-baseline space-x-2 select-none flex-wrap gap-y-1">
                <h1 className="text-3xl font-black tracking-tighter text-white uppercase font-display">VĀC <span className="text-blue-500">वाक्</span></h1>
                <span className="text-[9px] font-black uppercase tracking-widest text-[#0ea5e9] border border-blue-500/30 bg-blue-500/10 px-2 py-0.5 rounded">
                  Dual-Channel Tutor
                </span>
                <span className="text-[10px] font-mono text-slate-500 hidden sm:inline">
                  • 2026 EDITION
                </span>
              </div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider truncate mt-0.5">
                ACTIVE LESSON • {activeTopic.title}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {/* Audio equalizing wave preview - visual enhancement */}
            <div className="hidden md:flex items-center space-x-1 border border-slate-800 bg-slate-900/50 px-3 py-1.5 rounded-full select-none">
              <span className="text-[9px] font-black uppercase tracking-wider text-slate-500 mr-2">Vāc Status:</span>
              <div className="flex items-center gap-0.5 h-3.5">
                <div className={`w-0.5 bg-blue-500 rounded-full transition-all duration-200 ${playingAudioId ? "h-3 animate-pulse" : "h-1"}`}></div>
                <div className={`w-0.5 bg-blue-500 rounded-full transition-all duration-200 delay-75 ${playingAudioId ? "h-4.5 animate-pulse" : "h-2"}`}></div>
                <div className={`w-0.5 bg-blue-500 rounded-full transition-all duration-200 delay-150 ${playingAudioId ? "h-2 animate-pulse" : "h-1"}`}></div>
                <div className={`w-0.5 bg-blue-500 rounded-full transition-all duration-200 delay-100 ${playingAudioId ? "h-3.5 animate-pulse" : "h-1.5"}`}></div>
              </div>
              <span className={`text-[10px] font-black ml-2 font-mono ${playingAudioId ? "text-emerald-400" : "text-slate-500"}`}>
                {playingAudioId ? "STREAMING" : "STANDBY"}
              </span>
            </div>

            {/* Preferred voice selector */}
            <div className="flex items-center space-x-2 bg-slate-900 border border-slate-800 px-3 py-2 rounded-xl">
              <span className="text-[10px] font-black uppercase text-slate-500 font-mono hidden sm:inline">Voice:</span>
              <select
                value={voice}
                onChange={(e) => setVoice(e.target.value as any)}
                className="bg-transparent text-xs text-white focus:outline-none cursor-pointer font-bold font-mono"
              >
                <option value="Kore" className="bg-[#0c101b] text-zinc-100 font-bold">Kore (Male-Warm)</option>
                <option value="Charon" className="bg-[#0c101b] text-zinc-100 font-bold">Charon (Male-Deep)</option>
                <option value="Zephyr" className="bg-[#0c101b] text-zinc-100 font-bold">Zephyr (Male-Calm)</option>
                <option value="Puck" className="bg-[#0c101b] text-zinc-100 font-bold">Puck (Female-Bright)</option>
              </select>
            </div>

            {/* Clear History Button */}
            <button
              type="button"
              onClick={handleClearHistory}
              title="Reset Chat History"
              className="p-2.5 text-slate-400 hover:text-red-400 bg-slate-900 border border-slate-800 rounded-xl transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* Dynamic Study Material Display */}
        <section className="bg-[#0b101c]/40 p-5 border-b border-slate-800">
          <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-4 h-32 md:h-20 overflow-y-auto">
            {/* Side-by-side translated presentation briefs */}
            <div className="flex-1 bg-slate-950/60 p-4 rounded-xl border border-slate-800 text-xs">
              <div className="flex items-center gap-1.5 font-black uppercase tracking-wider text-blue-500 mb-1">
                <Info className="w-3.5 h-3.5" />
                <span>MODULE OVERVIEW (ENGLISH)</span>
              </div>
              <p className="text-slate-350 leading-relaxed font-semibold">{activeTopic.description}</p>
            </div>
            
            <div className="flex-1 bg-slate-950/60 p-4 rounded-xl border border-slate-800 text-xs text-right">
              <div className="flex items-center justify-end gap-1.5 font-black uppercase tracking-wider text-blue-500 mb-1">
                <span className="font-sans font-bold">मॉड्यूल विवरण (हिन्दी)</span>
                <Languages className="w-3.5 h-3.5" />
              </div>
              <p className="text-slate-350 leading-relaxed font-sans font-semibold">{activeTopic.hindiDescription}</p>
            </div>
          </div>
        </section>

        {/* Chat Thread Container */}
        <main className="flex-grow p-8 md:p-12 space-y-12 overflow-y-auto">
          <div className="max-w-3xl mx-auto space-y-12">
            
            {/* Display configuration alert if API key error is thrown */}
            {errorString && (
              <div className="p-4 bg-red-950/20 border-2 border-red-500/30 rounded-2xl flex items-start gap-3.5 text-red-200 text-sm shadow-xl leading-relaxed animate-pulse">
                <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 shrink-0" />
                <div className="flex-1">
                  <h4 className="font-extrabold uppercase tracking-wider text-red-400 mb-0.5">Configuration Alert</h4>
                  <p>{errorString}</p>
                  <p className="text-[11px] text-red-400/80 mt-1 font-mono">
                    Ensure GEMINI_API_KEY is configured in **Settings &gt; Secrets** of your AI Studio environment.
                  </p>
                </div>
              </div>
            )}

            {/* Render Conversational Thread */}
            {messages.map((msg) => {
              const isUser = msg.sender === "user";
              const isPlaying = playingAudioId === msg.id;
              const isLoadingAudio = loadingAudioId === msg.id;

              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isUser ? "items-end text-right" : "items-start text-left"}`}
                >
                  <span className={`text-[10px] font-black uppercase tracking-widest mb-2 ${isUser ? "text-slate-500" : "text-blue-500"}`}>
                    {isUser ? `Student • ${msg.timestamp}` : `VĀC Helper • ${msg.timestamp}`}
                  </span>
                  
                  <div className={`w-full ${isUser ? "max-w-xl" : "max-w-2xl"}`}>
                    {isUser ? (
                      <p className="text-3xl font-bold leading-tight tracking-tight text-white font-display">
                        {msg.text}
                      </p>
                    ) : (
                      <div className="space-y-4">
                        <div className="text-base md:text-lg leading-relaxed text-slate-100">
                          {formatBody(msg.text)}
                        </div>

                        {/* Listen panel */}
                        <div className="flex items-center space-x-4 select-none pt-2">
                          <button
                            type="button"
                            onClick={() => speakMessage(msg.id, msg.text)}
                            className={`px-5 py-2.5 rounded-full text-xs font-black uppercase tracking-widest flex items-center gap-2 transition-all ${
                              isPlaying 
                                ? "bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-500/10" 
                                : "bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-500/10"
                            }`}
                          >
                            {isLoadingAudio ? (
                              <>
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                <span>GENERATING VOICE...</span>
                              </>
                            ) : isPlaying ? (
                              <>
                                <Pause className="w-3.5 h-3.5" />
                                <span>PAUSE SYNTH</span>
                              </>
                            ) : (
                              <>
                                <Play className="w-3.5 h-3.5" />
                                <span>PLAY AUDIO (वाक् सुनें)</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {/* Loading Indicator */}
            {isLoading && (
              <div className="flex flex-col items-start">
                <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-2 animate-pulse">VĀC Assistant is compiling...</span>
                <div className="flex items-center gap-3 text-slate-400">
                  <Loader2 className="w-5 h-5 animate-spin text-blue-500" />
                  <span className="font-mono text-xs font-bold uppercase tracking-widest">TRANSLATING LECTURE CONTEXT IN REAL-TIME</span>
                </div>
              </div>
            )}

            <div ref={messageEndRef} />
          </div>
        </main>

        {/* Input area, Suggested Queries & Language setup */}
        <footer className="flex-none p-8 md:p-10 bg-gradient-to-t from-slate-950">
          <div className="max-w-4xl mx-auto space-y-6">
            
            {/* Language and subtopics configuration parameters row */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 select-none pb-4 border-b border-slate-800/80">
              
              {/* Language Selector in brutalist buttons */}
              <div className="flex items-center space-x-3">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Language Mode:</span>
                <div className="inline-flex rounded-xl bg-slate-900 p-1 border-2 border-slate-800">
                  <button
                    type="button"
                    onClick={() => setLanguage("en")}
                    className={`text-xs font-black uppercase tracking-wider px-3.5 py-1.5 rounded-lg transition-colors ${language === "en" ? "bg-white text-slate-950 font-black" : "text-slate-400 hover:text-white"}`}
                  >
                    English
                  </button>
                  <button
                    type="button"
                    onClick={() => setLanguage("hi")}
                    className={`text-xs font-black uppercase tracking-wider px-3.5 py-1.5 rounded-lg transition-colors ${language === "hi" ? "bg-white text-slate-950 font-black" : "text-slate-400 hover:text-white"}`}
                  >
                    हिन्दी
                  </button>
                  <button
                    type="button"
                    onClick={() => setLanguage("bilingual")}
                    className={`text-xs font-black uppercase tracking-wider px-3.5 py-1.5 rounded-lg transition-colors ${language === "bilingual" ? "bg-white text-slate-950 font-black" : "text-slate-400 hover:text-white"}`}
                  >
                    Hybrid
                  </button>
                </div>
              </div>

              {/* Subtopic chips listing for active module */}
              <div className="flex flex-wrap gap-1 items-center justify-end max-w-sm">
                {activeTopic.subtopics.map((st, i) => (
                  <span key={i} className="text-[9px] font-mono tracking-widest text-[#0ea5e9] bg-blue-500/5 border border-blue-500/20 px-2.5 py-1 rounded-full font-bold uppercase truncate max-w-[140px]" title={st}>
                    {st}
                  </span>
                ))}
              </div>
            </div>

            {/* Quick Presets suggested query tracks */}
            <div className="bg-[#0b101c]/40 p-4 rounded-xl border-2 border-slate-800">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 block mb-3 select-none">SUGGESTED QUERY TRACKS</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => sendMessage(`Provide a comprehensive explanation of "${activeTopic.title}".`)}
                  className="text-left text-xs bg-slate-950 hover:bg-slate-900 text-slate-300 hover:text-white border border-slate-800 hover:border-slate-700 py-2.5 px-4 rounded-xl transition-all font-bold truncate"
                >
                  📖 Deconstruct core module concepts
                </button>
                <button
                  type="button"
                  onClick={() => sendMessage(`What are the real-world applications and future outlook of "${activeTopic.title}"?`)}
                  className="text-left text-xs bg-slate-950 hover:bg-slate-900 text-slate-300 hover:text-white border border-slate-800 hover:border-slate-700 py-2.5 px-4 rounded-xl transition-all font-bold truncate"
                >
                  🚀 Real-world applications & future outlook
                </button>
                <button
                  type="button"
                  onClick={() => sendMessage(`मस्तिष्क (Brain), रोबोटिक या गणितीय रूप से "${activeTopic.title}" मुझे हिंदी में सरल शब्दों में समझाएं।`)}
                  className="text-left text-xs bg-slate-950 hover:bg-slate-900 text-slate-300 hover:text-white border border-slate-800 hover:border-slate-700 py-2.5 px-4 rounded-xl transition-all font-bold truncate font-sans"
                >
                  🇮🇳 इसके मुख्य सिद्धांतों को हिन्दी में समझाएं
                </button>
                <button
                  type="button"
                  onClick={() => sendMessage(`What are the primary technical constraints, bottlenecks, or costs associated with "${activeTopic.title}"?`)}
                  className="text-left text-xs bg-slate-950 hover:bg-slate-900 text-slate-300 hover:text-white border border-slate-800 hover:border-slate-700 py-2.5 px-4 rounded-xl transition-all font-bold truncate"
                >
                  ⚠️ Analyze technical bottlenecks & limits
                </button>
              </div>
            </div>

            {/* Real Text Input */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                sendMessage(inputText);
              }}
              className="relative max-w-4xl mx-auto"
            >
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={`Query about ${activeTopic.title} (Hindi or English)...`}
                disabled={isLoading}
                className="w-full bg-slate-900 border-2 border-slate-800 p-6 pr-32 rounded-2xl text-xl font-bold placeholder:text-slate-700 text-white focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-colors disabled:opacity-50"
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center space-x-2">
                <button
                  type="submit"
                  disabled={!inputText.trim() || isLoading}
                  className="bg-white text-slate-950 disabled:bg-slate-800 disabled:text-slate-500 h-12 px-6 rounded-xl flex items-center justify-center font-black uppercase text-xs tracking-wider transition-colors hover:bg-blue-600 hover:text-white cursor-pointer active:scale-95 disabled:cursor-not-allowed"
                >
                  <Send className="w-4 h-4 mr-2" />
                  <span>SEND</span>
                </button>
              </div>
            </form>
            
            <p className="text-center text-[10px] font-bold text-slate-600 uppercase tracking-widest select-none">
              Powered by Dual-Channel Neural Presentation Processing
            </p>
          </div>
        </footer>

      </section>

    </div>
  );
}
