"use client";
import React, { useState, useRef, useEffect, Suspense } from "react";
import { motion, AnimatePresence, PanInfo } from "framer-motion";
import {
  Home,
  Gamepad2,
  BrainCircuit,
  Compass,
  Zap,
  X,
  Menu,
  Send,
  Sparkles,
  Gamepad2 as GamepadIcon,
} from "lucide-react";
import dynamic from "next/dynamic";

const CHARACTERS = [
  {
    id: "Flash",
    name: "Flash",
    tagline: "Master of Magic",
    src: "/characters/flash.svg",
    color: "#8B5CF6",
    model: "gpt-4.1-turbo",
  },
  {
    id: "Titan",
    name: "Titan",
    tagline: "Brave Warrior",
    src: "/characters/titan.svg",
    color: "#EF4444",
    model: "gpt-5",
  },
  {
    id: "Joe",
    name: "Joe",
    tagline: "Swift Hunter",
    src: "/characters/joe.svg",
    color: "#10B981",
    model: "gpt-5-nano",
  },
];

// ✅ GPU-OPTIMIZED: Simple spinner without blur
const LoadingSpinner = () => (
  <div className="relative w-20 h-20">
    <motion.div
      className="absolute inset-0 border-4 border-[var(--color-primary)] border-t-transparent rounded-full"
      animate={{ rotate: 360 }}
      transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
      style={{ willChange: "transform" }}
    />
    <motion.div
      className="absolute inset-2 border-4 border-purple-500 border-b-transparent rounded-full"
      animate={{ rotate: -360 }}
      transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
      style={{ willChange: "transform" }}
    />
  </div>
);

// ✅ GPU-OPTIMIZED: Fixed character wheel alignment
interface CharacterWheelProps {
  selectedId: string;
  onSelect: (characterId: string) => void;
}

export const CharacterWheel = ({ selectedId, onSelect }: CharacterWheelProps) => {
  const [currentIndex, setCurrentIndex] = useState(1);
  const dragStartX = useRef(0);

  const handleDragEnd = (_: any, info: PanInfo) => {
    const dragDistance = info.offset.x;
    let nextIndex = currentIndex;

    if (dragDistance > 80 && currentIndex > 0) {
      nextIndex = currentIndex - 1;
    } else if (dragDistance < -80 && currentIndex < CHARACTERS.length - 1) {
      nextIndex = currentIndex + 1;
    }

    if (nextIndex !== currentIndex) {
      setCurrentIndex(nextIndex);
      onSelect(CHARACTERS[nextIndex].id);
    }
  };

  const char = CHARACTERS[currentIndex];

  return (
    <motion.div
      className="relative w-full max-w-4xl mx-auto select-none flex flex-col items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      {/* Main carousel container */}
      <div
        className="relative w-96 h-96 rounded-full flex items-center justify-center overflow-hidden bg-black/30"
        style={{
          border: `3px solid ${char.color}`,
        }}
      >
        {/* Character card - always centered */}
        <AnimatePresence mode="wait">
          <motion.div
            key={char.id}
            className="absolute w-80 h-80 rounded-full flex items-center justify-center"
            style={{
              background: `linear-gradient(135deg, ${char.color}30, ${char.color}10)`,
              border: `3px solid ${char.color}`,
            }}
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.7 }}
            transition={{ type: "spring", stiffness: 250, damping: 30 }}
          >
            <img
              src={char.src}
              alt={char.name}
              className="w-64 h-64 object-contain"
              draggable={false}
            />
          </motion.div>
        </AnimatePresence>

        {/* Invisible draggable layer */}
        <motion.div
          className="absolute inset-0 cursor-grab active:cursor-grabbing"
          drag="x"
          dragElastic={0.1}
          dragConstraints={{ left: -60, right: 60 }}
          onDragEnd={handleDragEnd}
          style={{
            touchAction: "pan-y",
            zIndex: 50,
          }}
        />
      </div>

      {/* Character info - static text */}
      <AnimatePresence mode="wait">
        <motion.div
          key={char.id}
          className="mt-12 text-center"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          transition={{ duration: 0.3 }}
        >
          <h3 className="text-3xl font-bold mb-2" style={{ color: char.color }}>
            {char.name}
          </h3>
          <p className="text-sm text-gray-300">{char.tagline}</p>
        </motion.div>
      </AnimatePresence>

      {/* Navigation dots */}
      <div className="flex justify-center gap-4 mt-10">
        {CHARACTERS.map((c, i) => (
          <motion.button
            key={c.id}
            className="w-3 h-3 rounded-full cursor-pointer transition-colors"
            style={{
              backgroundColor: i === currentIndex ? c.color : "#444",
            }}
            whileHover={{ scale: 1.4 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => {
              setCurrentIndex(i);
              onSelect(c.id);
            }}
          />
        ))}
      </div>

      {/* Drag hint */}
      <motion.div
        className="text-gray-400 text-xs mt-6 flex items-center justify-center gap-2 h-5"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        ← Drag to explore →
      </motion.div>
    </motion.div>
  );
};


// ✅ GPU-OPTIMIZED: Simple avatar
const MiniAvatar = ({ characterId }: any) => {
  const char = CHARACTERS.find((c) => c.id === characterId);
  if (!char) return null;

  return (
    <motion.div
      layout
      className="relative w-14 h-14 rounded-full flex items-center justify-center overflow-hidden flex-shrink-0"
      style={{
        background: `linear-gradient(135deg, ${char.color}, ${char.color}dd)`,
        border: `2px solid ${char.color}`,
        willChange: "transform",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      whileHover={{ scale: 1.1 }}
    >
      <img
        src={char.src}
        alt={char.name}
        className="w-full h-full object-contain flex-shrink-0"
        draggable={false}
        style={{ maxWidth: "90%", maxHeight: "90%" }}
      />
    </motion.div>
  );
};

// Main Component
export default function StarcadeLayout() {
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [gameHTML, setGameHTML] = useState("");
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [notification, setNotification] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [selectedCharacter, setSelectedCharacter] = useState("Titan");
  const [conversationStarted, setConversationStarted] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const BACKEND = "http://127.0.0.1:8000";

  async function postJSON(url: string, data: any) {
    const res = await fetch(`${BACKEND}${url}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return res.json();
  }

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    setIsClient(true);
    if (typeof window !== "undefined") {
      setIsMobile(window.innerWidth < 768);
      const handleResize = () => setIsMobile(window.innerWidth < 768);
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }
  }, []);

  async function handleSend() {
    if (!input.trim() || !selectedCharacter) return;

    if (!conversationStarted) {
      setConversationStarted(true);
    }

    const selectedChar = CHARACTERS.find((c) => c.id === selectedCharacter);
    const modelName = selectedChar?.model || "gpt-4.1-turbo";

    setMessages((prev) => [...prev, { from: "user", text: input }]);
    setInput("");
    setLoading(true);

    try {
      let response;
      if (!sessionId) {
        response = await postJSON("/api/start", {
          prompt: input,
          character: selectedCharacter,
          model: modelName,
        });
        setSessionId(response.session_id);
      } else {
        response = await postJSON("/api/feedback", {
          session_id: sessionId,
          feedback: input,
        });
      }
      handleBackendResponse(response);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { from: "ai", text: "⚠️ Connection error. Try again soon." },
      ]);
    } finally {
      setLoading(false);
    }
  }

  async function handleModalSubmit() {
    const formattedAnswers = Object.entries(answers).map(([q, a]) => ({
      question: q,
      answer: a,
    }));
    setShowModal(false);
    setLoading(true);

    const response = await postJSON("/api/resume", {
      session_id: sessionId,
      answers: formattedAnswers,
    });
    handleBackendResponse(response);
    setLoading(false);
  }

  function handleBackendResponse(res: any) {
    if (res.type === "interrupt") {
      setQuestions(res.questions);
      setShowModal(true);
      setMessages((prev) => [...prev, { from: "ai", text: res.message }]);
    } else if (res.type === "success") {
      setMessages((prev) => [
        ...prev,
        {
          from: "ai",
          text: "✅ Game generated successfully! Preview updated.",
        },
      ]);
      setGameHTML(res.html || "");
    }
  }

  const handleAnswerChange = (question: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [question]: value }));
  };

  const menuItems = [
    { label: "Home", icon: Home },
    { label: "My Games", icon: Gamepad2 },
    { label: "AI Builder", icon: BrainCircuit },
    { label: "Explore", icon: Compass },
  ];

  return (
    <motion.div
      className="flex flex-col h-screen bg-gradient-to-br from-[#0a0a0a] via-[#111] to-[#0a0a0a] text-white overflow-hidden relative"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      style={{ willChange: "auto" }}
    >
      {/* ✅ MINIMAL Background - No heavy blur */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none" style={{ willChange: "auto" }}>
        <motion.div
          className="absolute top-0 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-2xl"
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          style={{ willChange: "transform" }}
        />
        <motion.div
          className="absolute bottom-0 right-1/4 w-80 h-80 bg-red-600/10 rounded-full blur-2xl"
          animate={{
            scale: [1, 1.15, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{ duration: 12, repeat: Infinity }}
          style={{ willChange: "transform" }}
        />
      </div>

      {/* === NAVBAR === */}
      <motion.nav
        className="relative z-50 backdrop-blur-sm bg-gradient-to-r from-[var(--color-primary)] via-[#a30b0b] to-[var(--color-primary)]"
        style={{
          borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
          willChange: "transform",
        }}
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
      >
        <div className="flex items-center justify-between px-6 md:px-8 py-4">
          <div className="flex items-center gap-4">
            <button
              className="md:hidden text-white hover:scale-110 transition-transform"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <Menu size={24} />
            </button>
            <motion.h1 className="text-2xl md:text-3xl font-bold tracking-widest flex items-center gap-3" whileHover={{ scale: 1.02 }}>
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-200">
                STARCADE
              </span>
              <span className="text-white/80">AI</span>
            </motion.h1>
          </div>

          <div className="hidden md:flex gap-6 text-sm uppercase">
            {["Docs", "Studio", "Support"].map((link) => (
              <motion.a
                key={link}
                href="#"
                className="relative text-gray-200 cursor-pointer px-4 py-2 rounded-lg"
                whileHover={{ scale: 1.05 }}
              >
                <span className="relative z-10">{link}</span>
              </motion.a>
            ))}
          </div>
        </div>
      </motion.nav>

      {/* === MAIN LAYOUT === */}
      <div className="flex flex-1 overflow-hidden relative z-10">
        {/* SIDEBAR */}
        <AnimatePresence>
          {isClient && (sidebarOpen || !isMobile) && (
            <motion.aside
              key="sidebar"
              initial={{ x: -300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -300, opacity: 0 }}
              transition={{ type: "spring", stiffness: 100, damping: 25 }}
              className="fixed md:static z-40 top-0 left-0 h-full w-2/3 sm:w-1/3 md:w-1/6 backdrop-blur-sm bg-black/40 p-6 flex flex-col gap-4 text-gray-300"
              style={{
                borderRight: "1px solid rgba(255, 255, 255, 0.1)",
                willChange: "transform",
              }}
            >
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg text-[var(--color-primary)] tracking-wide font-bold flex items-center gap-2">
                    <motion.div
                      animate={{ rotate: [0, 360] }}
                      transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                      style={{ willChange: "transform" }}
                    >
                      <Sparkles size={16} />
                    </motion.div>
                    MENU
                  </h2>
                  <button
                    className="md:hidden text-gray-300 hover:text-white"
                    onClick={() => setSidebarOpen(false)}
                  >
                    <X size={20} />
                  </button>
                </div>

                <ul className="space-y-2">
                  {menuItems.map(({ label, icon: Icon }, i) => (
                    <motion.li key={label} className="relative group">
                      <motion.button
                        className="w-full flex items-center gap-3 cursor-pointer p-3 rounded-xl transition-all relative overflow-hidden"
                        whileHover={{ scale: 1.03, x: 4 }}
                        whileTap={{ scale: 0.98 }}
                        style={{ willChange: "transform" }}
                      >
                        <Icon className="text-[var(--color-primary)]" size={22} />
                        <span className="font-medium">{label}</span>
                      </motion.button>
                    </motion.li>
                  ))}
                </ul>
              </div>
            </motion.aside>
          )}
        </AnimatePresence>

        {/* MAIN CONTENT AREA */}
        <div className="flex-1 flex flex-col relative">
          {/* GAME PREVIEW */}
          <AnimatePresence>
            {conversationStarted && (
              <motion.main
                layout
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ type: "spring", stiffness: 100, damping: 25 }}
                className="flex-1 flex items-center justify-center backdrop-blur-sm bg-black/20 border-b border-white/10 relative overflow-hidden"
                style={{ willChange: "auto" }}
              >
                {loading ? (
                  <div className="flex flex-col items-center gap-6">
                    <LoadingSpinner />
                    <motion.p className="text-gray-400 text-sm" animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 2, repeat: Infinity }}>
                      Crafting your game...
                    </motion.p>
                  </div>
                ) : gameHTML ? (
                  <motion.div
                    className="relative"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: "spring", damping: 20 }}
                    style={{ willChange: "transform" }}
                  >
                    <iframe
                      srcDoc={gameHTML}
                      className="w-[90vw] md:w-[800px] h-[60vh] md:h-[600px] rounded-lg shadow-2xl"
                      title="StarCade Game Preview"
                      style={{
                        border: `2px solid var(--color-primary)`,
                      }}
                    />
                  </motion.div>
                ) : (
                  <motion.div
                    className="relative backdrop-blur-sm bg-black/40 w-[90vw] md:w-[800px] h-[60vh] md:h-[600px] rounded-2xl flex flex-col items-center justify-center text-gray-400 text-sm md:text-base overflow-hidden cursor-pointer"
                    style={{
                      border: "1px solid rgba(255, 255, 255, 0.1)",
                      willChange: "auto",
                    }}
                    whileHover={{ scale: 1.01 }}
                  >
                    <motion.div
                      className="relative z-10 flex flex-col items-center gap-6"
                      animate={{ y: [0, -10, 0] }}
                      transition={{ duration: 3, repeat: Infinity }}
                    >
                      <GamepadIcon size={64} className="text-[var(--color-primary)]" />
                      <div className="text-center">
                        <p className="text-xl mb-2">🎮 Your game will appear here</p>
                        <p className="text-xs text-gray-500">
                          Start chatting to generate your first game
                        </p>
                      </div>
                    </motion.div>
                  </motion.div>
                )}
              </motion.main>
            )}
          </AnimatePresence>

          {/* CENTER WELCOME SCREEN */}
          <AnimatePresence>
            {!conversationStarted && (
              <motion.div
                layout
                className="flex-1 flex flex-col items-center justify-center p-8 backdrop-blur-sm bg-black/20 relative overflow-hidden"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
              >
                {/* Centered STARCADE AI with red-black gradient */}
                <motion.div
                  className="absolute top-20 text-center z-20"
                  initial={{ y: -50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.1, type: "spring", stiffness: 100 }}
                >
                  <motion.h2
                    className="text-6xl md:text-8xl font-black tracking-tighter mb-2"
                    style={{
                      backgroundImage: "linear-gradient(135deg, #C90D0C 0%, #000000 100%)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                    }}
                  >
                    STARCADE
                  </motion.h2>
                  <motion.p className="text-2xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#C90D0C] to-red-700">
                    AI
                  </motion.p>
                </motion.div>

                <motion.div
                  className="text-center mb-8 z-10 max-w-3xl mt-32"
                  initial={{ y: -30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3, type: "spring", stiffness: 100 }}
                >
                  <motion.div
                    className="inline-flex items-center gap-3 mb-6 px-6 py-3 backdrop-blur-sm bg-white/10 rounded-full"
                    style={{
                      border: "1px solid rgba(255, 255, 255, 0.2)",
                      willChange: "auto",
                    }}
                  >
                    <Sparkles className="text-[var(--color-primary)]" size={20} />
                    <span className="text-sm text-gray-300">
                      AI-Powered Game Creation
                    </span>
                  </motion.div>

                  <motion.p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto">
                    Choose your AI companion and bring your game ideas to life
                  </motion.p>
                </motion.div>

                <motion.div
                  className="mb-20 z-10 w-full"
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.5, type: "spring", stiffness: 100 }}
                >
                  <CharacterWheel
                    selectedId={selectedCharacter}
                    onSelect={setSelectedCharacter}
                  />
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* CHAT SECTION */}
          <motion.div
            layout
            className={`${
              conversationStarted
                ? "h-auto border-t border-white/10"
                : "w-full max-w-3xl mx-auto"
            } backdrop-blur-sm bg-black/40 relative z-10`}
            transition={{ type: "spring", stiffness: 100, damping: 25 }}
            style={{ willChange: "auto" }}
          >
            <AnimatePresence>
              {conversationStarted && messages.length > 0 && (
                <motion.div
                  layout
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "220px", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="relative overflow-y-auto p-6 space-y-4"
                  style={{ willChange: "auto" }}
                >
                  {messages.map((m, i) => (
                    <motion.div
                      key={i}
                      layout
                      initial={{ opacity: 0, y: 20, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ type: "spring", stiffness: 200, damping: 25 }}
                      className={`max-w-[85%] ${
                        m.from === "ai" ? "self-start" : "self-end ml-auto"
                      }`}
                      style={{ willChange: "transform" }}
                    >
                      <motion.div
                        className={`p-4 rounded-2xl break-words backdrop-blur-sm text-sm leading-relaxed shadow-lg ${
                          m.from === "ai"
                            ? "bg-white/10 text-gray-200"
                            : "bg-[var(--color-primary)] text-white"
                        }`}
                        style={{
                          border: `1px solid ${
                            m.from === "ai"
                              ? "rgba(255, 255, 255, 0.1)"
                              : CHARACTERS.find(
                                  (c) => c.id === selectedCharacter
                                )?.color
                          }`,
                          willChange: "auto",
                        }}
                        whileHover={{ scale: 1.02, y: -2 }}
                      >
                        {m.text}
                      </motion.div>
                    </motion.div>
                  ))}
                  <div ref={chatEndRef} />
                </motion.div>
              )}
            </AnimatePresence>

            <motion.div layout className="relative p-6 flex items-center gap-4" style={{ willChange: "auto" }}>
              <AnimatePresence>
                {conversationStarted && (
                  <motion.div
                    layout
                    initial={{ opacity: 0, x: -30, scale: 0 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={{ opacity: 0, x: -30, scale: 0 }}
                    transition={{ type: "spring", stiffness: 200, damping: 20 }}
                    style={{ willChange: "transform" }}
                  >
                    <MiniAvatar characterId={selectedCharacter} />
                  </motion.div>
                )}
              </AnimatePresence>

              <motion.div className="flex-1 relative" layout style={{ willChange: "auto" }}>
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                  placeholder={
                    conversationStarted
                      ? "Continue the conversation..."
                      : "Describe your game idea..."
                  }
                  className="w-full backdrop-blur-sm bg-white/10 text-white rounded-xl px-5 py-4 pr-14 outline-none text-sm transition-all placeholder:text-gray-500"
                  style={{
                    border: input.trim()
                      ? `2px solid ${
                          CHARACTERS.find((c) => c.id === selectedCharacter)
                            ?.color
                        }`
                      : "2px solid rgba(255, 255, 255, 0.1)",
                  }}
                  disabled={!selectedCharacter}
                />
              </motion.div>

              <motion.button
                onClick={handleSend}
                className="relative w-14 h-14 font-bold uppercase rounded-xl overflow-hidden flex items-center justify-center flex-shrink-0"
                style={{
                  background: `linear-gradient(135deg, ${
                    CHARACTERS.find((c) => c.id === selectedCharacter)?.color
                  }, var(--color-primary))`,
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                  willChange: "transform",
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                disabled={loading || !selectedCharacter || !input.trim()}
              >
                {loading ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity }}
                    style={{ willChange: "transform" }}
                  >
                    <Sparkles size={20} className="text-white" />
                  </motion.div>
                ) : (
                  <Send size={20} className="text-white" />
                )}
              </motion.button>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* === MODAL === */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            className="fixed inset-0 bg-black/90 backdrop-blur-sm flex justify-center items-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ willChange: "auto" }}
          >
            <motion.div
              className="relative w-full max-w-2xl max-h-[85vh] overflow-hidden backdrop-blur-sm bg-black/60 rounded-3xl shadow-2xl"
              style={{
                border: "1px solid rgba(255, 255, 255, 0.2)",
                willChange: "transform",
              }}
              initial={{ scale: 0.8, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 50 }}
              transition={{ type: "spring", damping: 25 }}
            >
              <div className="p-8 overflow-y-auto max-h-[85vh]">
                <motion.div
                  className="flex items-center gap-4 mb-8"
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <Sparkles
                    className="text-[var(--color-primary)]"
                    size={32}
                  />
                  <h2 className="text-4xl text-[var(--color-primary)]">
                    Customize Your Game
                  </h2>
                </motion.div>

                <form className="space-y-8">
                  {questions.map((q, i) => (
                    <motion.div
                      key={i}
                      className="backdrop-blur-sm bg-white/10 p-6 rounded-2xl border border-white/10"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 * i }}
                    >
                      <p className="text-lg font-semibold mb-4 text-gray-200">
                        {q.question}
                      </p>

                      <div className="space-y-3 mb-4">
                        {q.options?.map((opt: string, idx: number) => (
                          <motion.label
                            key={idx}
                            className="flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all hover:bg-white/5"
                            whileHover={{ scale: 1.02, x: 4 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <input
                              type="radio"
                              name={q.question}
                              value={opt}
                              checked={answers[q.question] === opt}
                              onChange={(e) =>
                                handleAnswerChange(
                                  q.question,
                                  e.target.value
                                )
                              }
                              className="w-5 h-5 accent-[var(--color-primary)]"
                            />
                            <span className="text-sm text-gray-300">{opt}</span>
                          </motion.label>
                        ))}
                      </div>

                      <input
                        type="text"
                        placeholder="Or type your custom answer..."
                        value={
                          q.options?.includes(answers[q.question])
                            ? ""
                            : answers[q.question] || ""
                        }
                        onChange={(e) =>
                          handleAnswerChange(q.question, e.target.value)
                        }
                        className="w-full backdrop-blur-sm bg-white/5 border border-white/20 px-4 py-3 text-sm rounded-xl text-gray-200 placeholder:text-gray-500 outline-none focus:border-[var(--color-primary)]"
                      />
                    </motion.div>
                  ))}
                </form>

                <motion.button
                  onClick={handleModalSubmit}
                  className="mt-8 w-full py-4 font-bold uppercase rounded-xl text-white relative overflow-hidden"
                  style={{
                    background:
                      "linear-gradient(135deg, var(--color-primary), #a30b0b)",
                    border: "1px solid rgba(255, 255, 255, 0.2)",
                    willChange: "transform",
                  }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span className="relative z-10 flex items-center justify-center gap-3">
                    <Sparkles size={20} />
                    Generate Game
                  </span>
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
