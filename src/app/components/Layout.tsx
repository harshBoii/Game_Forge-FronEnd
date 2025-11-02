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


// Character data with SVG components
const CHARACTERS = [
  {
    id: "Flash",
    name: "Flash",
    tagline: "Master of Magic",
    src: "/characters/flash.svg",
    color: "#8B5CF6",
    model:"gpt-4.1-turbo"
  },
  {
    id: "Titan",
    name: "Titan",
    tagline: "Brave Warrior",
    src: "/characters/titan.svg",
    color: "#EF4444",
    model:"gpt-5"
  },
  {
    id: "Joe",
    name: "Joe",
    tagline: "Swift Hunter",
    src: "/characters/joe.svg",
    color: "#10B981",
    model:"gpt-5-nano"
  },
];

// Enhanced Loading Spinner
const LoadingSpinner = () => (
  <div className="relative w-20 h-20">
    <motion.div
      className="absolute inset-0 border-4 border-[var(--color-primary)] border-t-transparent rounded-full"
      animate={{ rotate: 360 }}
      transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
    />
    <motion.div
      className="absolute inset-2 border-4 border-purple-500 border-b-transparent rounded-full"
      animate={{ rotate: -360 }}
      transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
    />
    <motion.div
      className="absolute inset-0 flex items-center justify-center"
      animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
      transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
    >
      <Sparkles className="text-[var(--color-primary)]" size={16} />
    </motion.div>
  </div>
);

// Enhanced Character Wheelimport { motion, AnimatePresence, PanInfo } from "framer-motion";

export const CharacterWheel = ({ selectedId, onSelect }: any) => {
  const [currentIndex, setCurrentIndex] = useState(1);
  const [dragX, setDragX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleDragStart = () => {
    setIsDragging(true);
  };

  const handleDragEnd = (_: any, info: PanInfo) => {
    setIsDragging(false);
    const threshold = 80; // pixels needed to switch character

    // Determine next index based on drag direction
    let nextIndex = currentIndex;

    if (info.offset.x > threshold && currentIndex > 0) {
      nextIndex = currentIndex - 1;
    } else if (
      info.offset.x < -threshold &&
      currentIndex < CHARACTERS.length - 1
    ) {
      nextIndex = currentIndex + 1;
    }

    // Animate to new character
    if (nextIndex !== currentIndex) {
      setCurrentIndex(nextIndex);
      onSelect(CHARACTERS[nextIndex].id);
    }

    setDragX(0);
  };

  const char = CHARACTERS[currentIndex];
  const nextChar =
    currentIndex < CHARACTERS.length - 1
      ? CHARACTERS[currentIndex + 1]
      : null;
  const prevChar = currentIndex > 0 ? CHARACTERS[currentIndex - 1] : null;

  return (
    <motion.div
      ref={containerRef}
      className="relative w-full max-w-2xl mx-auto select-none flex flex-col items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      {/* Main carousel container */}
      <motion.div
        className="relative w-80 h-80 rounded-full flex items-center justify-center overflow-hidden backdrop-blur-xl bg-gradient-to-br from-white/5 via-white/10 to-white/5 shadow-[0_8px_32px_rgba(0,0,0,0.4)]"
        style={{
          border: "1px solid rgba(255,255,255,0.1)",
        }}
        animate={{
          boxShadow: [
            `0 0 40px ${char.color}33, inset 0 0 20px ${char.color}22`,
            `0 0 80px ${char.color}55, inset 0 0 40px ${char.color}33`,
            `0 0 40px ${char.color}33, inset 0 0 20px ${char.color}22`,
          ],
        }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      >
        {/* Glassmorphic overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-full pointer-events-none" />

        {/* Character carousel with drag */}
        <motion.div
          className="absolute w-full h-full flex items-center justify-center cursor-grab active:cursor-grabbing"
          drag="x"
          dragElastic={0.3}
          dragConstraints={{ left: -300, right: 300 }}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onDrag={(e, info) => setDragX(info.offset.x)}
          animate={{
            x: isDragging ? dragX : 0,
          }}
          transition={{
            type: isDragging ? "inertia" : "spring",
            stiffness: isDragging ? undefined : 200,
            damping: isDragging ? undefined : 30,
            bounce: 0.2,
          }}
        >
          {/* Previous character (preview on right drag) */}
          <AnimatePresence mode="sync">
            {prevChar && (
              <motion.div
                key={`prev-${prevChar.id}`}
                className="absolute w-80 h-80 flex items-center justify-center flex-shrink-0"
                style={{
                  x: "-100%",
                }}
              >
                <motion.div
                  className="relative w-72 h-72 rounded-full flex items-center justify-center overflow-hidden"
                  style={{
                    background: `linear-gradient(135deg, ${prevChar.color}20, ${prevChar.color}10)`,
                    border: `2px solid ${prevChar.color}44`,
                  }}
                  animate={{
                    opacity: isDragging && dragX > 0 ? 1 : 0.3,
                    scale: isDragging && dragX > 0 ? 1 : 0.85,
                  }}
                  transition={{ duration: 0.2 }}
                >
                  <motion.img
                    src={prevChar.src}
                    alt={prevChar.name}
                    className="w-64 h-64 object-contain drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]"
                    animate={{
                      scale: isDragging && dragX > 0 ? 1.1 : 1,
                      filter: isDragging && dragX > 0 ? "brightness(1)" : "brightness(0.6)",
                    }}
                    transition={{ duration: 0.2 }}
                  />
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Current character (main focus) */}
          <AnimatePresence mode="wait">
            <motion.div
              key={char.id}
              className="absolute w-80 h-80 flex items-center justify-center flex-shrink-0"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{
                type: "spring",
                stiffness: 200,
                damping: 25,
              }}
            >
              <motion.div
                className="relative w-72 h-72 rounded-full flex items-center justify-center overflow-hidden"
                style={{
                  background: `linear-gradient(135deg, ${char.color}, ${char.color}dd)`,
                  border: `3px solid ${char.color}`,
                }}
                animate={{
                  boxShadow: [
                    `0 0 40px ${char.color}88, inset 0 0 20px ${char.color}44`,
                    `0 0 60px ${char.color}aa, inset 0 0 30px ${char.color}66`,
                    `0 0 40px ${char.color}88, inset 0 0 20px ${char.color}44`,
                  ],
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                {/* Glassmorphic inner overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent rounded-full pointer-events-none z-10" />

                {/* SVG/Image */}
                <motion.img
                  draggable="false"
                  key={`main-${char.id}`}
                  src={char.src}
                  alt={char.name}
                  className="w-64 h-64 object-contain drop-shadow-[0_0_25px_rgba(255,255,255,0.4)] relative z-20"
                  initial={{
                    opacity: 0,
                    scale: 0.7,
                    rotateY: 90,
                  }}
                  animate={{
                    opacity: 1,
                    scale: 1,
                    rotateY: 0,
                    rotateZ: isDragging ? dragX * 0.15 : 0,
                  }}
                  exit={{
                    opacity: 0,
                    scale: 0.7,
                    rotateY: -90,
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 150,
                    damping: 20,
                  }}
                />

                {/* Rotating glow border */}
                <motion.div
                  className="absolute inset-0 rounded-full"
                  style={{
                    border: `2px solid ${char.color}`,
                    borderTop: "2px solid transparent",
                    borderRight: "2px solid transparent",
                  }}
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                />
              </motion.div>
            </motion.div>
          </AnimatePresence>

          {/* Next character (preview on left drag) */}
          <AnimatePresence mode="sync">
            {nextChar && (
              <motion.div
                key={`next-${nextChar.id}`}
                className="absolute w-80 h-80 flex items-center justify-center flex-shrink-0"
                style={{
                  x: "100%",
                }}
              >
                <motion.div
                  className="relative w-72 h-72 rounded-full flex items-center justify-center overflow-hidden"
                  style={{
                    background: `linear-gradient(135deg, ${nextChar.color}20, ${nextChar.color}10)`,
                    border: `2px solid ${nextChar.color}44`,
                  }}
                  animate={{
                    opacity: isDragging && dragX < 0 ? 1 : 0.3,
                    scale: isDragging && dragX < 0 ? 1 : 0.85,
                  }}
                  transition={{ duration: 0.2 }}
                >
                  <motion.img
                    src={nextChar.src}
                    alt={nextChar.name}
                    className="w-64 h-64 object-contain drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]"
                    animate={{
                      scale: isDragging && dragX < 0 ? 1.1 : 1,
                      filter: isDragging && dragX < 0 ? "brightness(1)" : "brightness(0.6)",
                    }}
                    transition={{ duration: 0.2 }}
                    draggable="false"
                  />
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>

      {/* Character info */}
      <AnimatePresence mode="wait">
        <motion.div
          key={char.id}
          className="mt-10 text-center"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          transition={{ duration: 0.4 }}
        >
          <motion.h3
            className="text-3xl font-bold pixel-text mb-2"
            style={{
              color: char.color,
              textShadow: `0 0 20px ${char.color}88, 0 0 40px ${char.color}44`,
            }}
            animate={{
              textShadow: [
                `0 0 20px ${char.color}88, 0 0 40px ${char.color}44`,
                `0 0 30px ${char.color}aa, 0 0 60px ${char.color}66`,
                `0 0 20px ${char.color}88, 0 0 40px ${char.color}44`,
              ],
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            {char.name}
          </motion.h3>
          <motion.p
            className="text-sm text-gray-300 pixel-text"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            {char.tagline}
          </motion.p>
        </motion.div>
      </AnimatePresence>

      {/* Navigation dots */}
      <div className="flex justify-center gap-4 mt-10">
        {CHARACTERS.map((c, i) => (
          <motion.button
            key={c.id}
            className="w-3 h-3 rounded-full transition-all cursor-pointer"
            style={{
              backgroundColor: i === currentIndex ? c.color : "#444",
              boxShadow:
                i === currentIndex ? `0 0 15px ${c.color}` : "none",
            }}
            whileHover={{ scale: 1.4 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => {
              setCurrentIndex(i);
              onSelect(c.id);
              setDragX(0);
            }}
            animate={
              i === currentIndex
                ? {
                    scale: [1, 1.3, 1],
                    opacity: [0.7, 1, 0.7],
                  }
                : { scale: 1, opacity: 0.6 }
            }
            transition={{ duration: 2.5, repeat: Infinity }}
          />
        ))}
      </div>

      {/* Drag hint */}
      <motion.div
        className="text-gray-400 text-xs mt-6 pixel-text flex items-center justify-center gap-2 h-5"
        animate={{ opacity: isDragging ? 0 : [0.5, 1, 0.5] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <motion.span
          animate={{ x: isDragging ? 0 : [-8, 8, -8] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          ←
        </motion.span>
        <span>Drag to explore</span>
        <motion.span
          animate={{ x: isDragging ? 0 : [-8, 8, -8] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          →
        </motion.span>
      </motion.div>

      {/* Active character indicator */}
      <motion.div
        className="mt-4 text-xs pixel-text text-gray-500"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        {currentIndex + 1} / {CHARACTERS.length}
      </motion.div>
    </motion.div>
  );
};

// Mini Character Avatar
const MiniAvatar = ({ characterId }: any) => {
  const char = CHARACTERS.find((c) => c.id === characterId);
  if (!char) return null;

  return (
    <motion.div
      layout
      className="relative w-14 h-14 rounded-full flex items-center justify-center overflow-hidden group"
      style={{
        background: `linear-gradient(135deg, ${char.color}, ${char.color}dd)`,
        border: `2px solid ${char.color}`,
        boxShadow: `0 0 20px ${char.color}66, inset 0 0 10px ${char.color}33`,
      }}
      whileHover={{ scale: 1.1, rotate: 5 }}
      animate={{
        boxShadow: [
          `0 0 20px ${char.color}66, inset 0 0 10px ${char.color}33`,
          `0 0 30px ${char.color}88, inset 0 0 15px ${char.color}55`,
          `0 0 20px ${char.color}66, inset 0 0 10px ${char.color}33`,
        ],
      }}
      transition={{ duration: 2, repeat: Infinity }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-full" />
      
      {/* ✅ FIXED IMAGE LOADING */}
      <img
        src={char.src}
        alt={char.name}
        className="w-full h-full object-contain"
        draggable="false"
      />

      <motion.div
        className="absolute inset-0 rounded-full"
        style={{
          border: `2px solid ${char.color}`,
          borderTop: "2px solid transparent",
        }}
        animate={{ rotate: 360 }}
        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
      />
    </motion.div>
  );
};

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
    const selectedChar = CHARACTERS.find(c => c.id === selectedCharacter);
    const modelName = selectedChar?.model || "gpt-4.1-turbo"; // fallback default

    setMessages((prev) => [...prev, { from: "user", text: input }]);
    setInput("");
    setLoading(true);

    try {
      let response;
      if (!sessionId) {
        response = await postJSON("/api/start", {
          prompt: input,
          character: selectedCharacter,
          model:modelName
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
    setMessages((prev) => [
      ...prev,
      { from: "user", text: "🧠 Submitted my choices!" },
    ]);

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
      transition={{ duration: 1 }}
    >
      {/* Ambient background effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-0 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            x: [0, 50, 0],
            y: [0, 30, 0],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-0 right-1/4 w-96 h-96 bg-[var(--color-primary)]/20 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            x: [0, -50, 0],
            y: [0, -30, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.4, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
        />
      </div>

      {/* === NAVBAR === */}
      <motion.nav
        className="relative z-50 backdrop-blur-md bg-gradient-to-r from-[var(--color-primary)] via-[#a30b0b] to-[var(--color-primary)] shadow-2xl title-font"
        style={{
          borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
          boxShadow:
            "0 4px 30px rgba(201, 13, 12, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
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
            <motion.h1
              className="text-2xl md:text-4xl font-bold tracking-widest flex items-center gap-3"
              whileHover={{ scale: 1.02 }}
            >
              <motion.img
                src="logo.svg"
                alt="logo"
                className="w-10 h-10 md:w-12 md:h-12 drop-shadow-lg"
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-200">
                STARCADE
              </span>
              <span className="text-white/80">AI</span>
            </motion.h1>
          </div>

          <div className="hidden md:flex gap-6 text-sm uppercase pixel-text">
            {["Docs", "Studio", "Support"].map((link) => (
              <motion.a
                key={link}
                href="#"
                className="relative text-gray-200 cursor-pointer px-4 py-2 rounded-lg overflow-hidden group"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="relative z-10 group-hover:text-white transition-colors">
                  {link}
                </span>
                <motion.div
                  className="absolute inset-0 bg-white/10 rounded-lg"
                  initial={{ scale: 0, opacity: 0 }}
                  whileHover={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.3 }}
                />
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
              className="fixed md:static z-40 top-0 left-0 h-full md:h-auto w-2/3 sm:w-1/3 md:w-1/6 backdrop-blur-xl bg-black/40 p-6 flex flex-col gap-4 pixel-text text-gray-300"
              style={{
                borderRight: "1px solid rgba(255, 255, 255, 0.1)",
                boxShadow: "4px 0 30px rgba(0, 0, 0, 0.5)",
              }}
            >
              <div
                className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none"
                style={{ backdropFilter: "blur(20px)" }}
              />

              <div className="relative z-10">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg text-[var(--color-primary)] tracking-wide font-bold flex items-center gap-2">
                    <motion.div
                      animate={{ rotate: [0, 360] }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                    >
                      <Sparkles size={16} />
                    </motion.div>
                    MENU
                  </h2>
                  <button
                    className="md:hidden text-gray-300 hover:text-white hover:scale-110 transition-all"
                    onClick={() => setSidebarOpen(false)}
                  >
                    <X size={20} />
                  </button>
                </div>

                <ul className="space-y-2">
                  {menuItems.map(({ label, icon: Icon }, i) => (
                    <motion.li
                      key={label}
                      className="relative group"
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: i * 0.1 }}
                    >
                      <motion.button
                        className="w-full flex items-center gap-3 cursor-pointer p-3 rounded-xl transition-all relative overflow-hidden"
                        whileHover={{ scale: 1.03, x: 4 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent rounded-xl"
                          initial={{ opacity: 0, x: -100 }}
                          whileHover={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3 }}
                        />

                        <motion.div
                          className="relative z-10 text-[var(--color-primary)] group-hover:text-white transition-colors"
                          animate={{
                            opacity: [0.7, 1, 0.7],
                          }}
                          transition={{
                            duration: 2 + i * 0.5,
                            repeat: Infinity,
                            ease: "easeInOut",
                          }}
                          whileHover={{
                            rotate: [0, -10, 10, 0],
                            scale: 1.2,
                          }}
                        >
                          <Icon size={22} />
                        </motion.div>

                        <span className="relative z-10 group-hover:text-white font-medium transition-colors">
                          {label}
                        </span>

                        <motion.div
                          className="absolute right-2 w-1 h-1 bg-[var(--color-primary)] rounded-full"
                          initial={{ opacity: 0, scale: 0 }}
                          whileHover={{ opacity: 1, scale: 1 }}
                          animate={{
                            boxShadow: [
                              "0 0 5px var(--color-primary)",
                              "0 0 15px var(--color-primary)",
                              "0 0 5px var(--color-primary)",
                            ],
                          }}
                          transition={{ duration: 2, repeat: Infinity }}
                        />
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
              >
                <div
                  className="absolute inset-0 opacity-10"
                  style={{
                    backgroundImage: `linear-gradient(rgba(201, 13, 12, 0.5) 1px, transparent 1px),
                                     linear-gradient(90deg, rgba(201, 13, 12, 0.5) 1px, transparent 1px)`,
                    backgroundSize: "50px 50px",
                  }}
                />

                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-[#C90D0C]/10 via-transparent to-purple-500/10 pointer-events-none"
                  animate={{
                    backgroundPosition: ["0% 0%", "100% 100%"],
                  }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                />

                {loading ? (
                  <div className="flex flex-col items-center gap-6">
                    <LoadingSpinner />
                    <motion.p
                      className="pixel-text text-gray-400 text-sm"
                      animate={{ opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      Crafting your game...
                    </motion.p>
                  </div>
                ) : gameHTML ? (
                  <motion.div
                    className="relative"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: "spring", damping: 20 }}
                  >
                    <div
                      className="absolute -inset-4 backdrop-blur-xl bg-gradient-to-br from-white/10 to-white/5 rounded-2xl"
                      style={{
                        border: "1px solid rgba(255, 255, 255, 0.2)",
                        boxShadow:
                          "0 8px 32px 0 rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
                      }}
                    />
                    <iframe
                      srcDoc={gameHTML}
                      className="relative z-10 w-[90vw] md:w-[800px] h-[60vh] md:h-[600px] rounded-lg shadow-2xl"
                      title="StarCade Game Preview"
                      style={{
                        border: "2px solid rgba(201, 13, 12, 0.5)",
                        boxShadow:
                          "0 0 50px rgba(201, 13, 12, 0.3), inset 0 0 20px rgba(255, 255, 255, 0.05)",
                      }}
                    />
                  </motion.div>
                ) : (
                  <motion.div
                    className="relative backdrop-blur-xl bg-gradient-to-br from-white/5 to-white/10 w-[90vw] md:w-[800px] h-[60vh] md:h-[600px] rounded-2xl flex flex-col items-center justify-center pixel-text text-gray-400 text-sm md:text-base overflow-hidden group cursor-pointer"
                    style={{
                      border: "1px solid rgba(255, 255, 255, 0.1)",
                      boxShadow:
                        "0 8px 32px 0 rgba(0, 0, 0, 0.5), inset 0 1px 2px 0 rgba(255, 255, 255, 0.1)",
                    }}
                    whileHover={{ scale: 1.01 }}
                  >
                    <motion.div
                      className="absolute inset-0 opacity-20"
                      style={{
                        backgroundImage: `radial-gradient(circle, var(--color-primary) 1px, transparent 1px)`,
                        backgroundSize: "30px 30px",
                      }}
                      animate={{
                        backgroundPosition: ["0px 0px", "30px 30px"],
                      }}
                      transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                    />

                    <motion.div
                      className="relative z-10 flex flex-col items-center gap-6"
                      animate={{ y: [0, -10, 0] }}
                      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    >
                      <GamepadIcon
                        size={64}
                        className="text-[var(--color-primary)]"
                      />
                      <div className="text-center">
                        <p className="text-xl mb-2">🎮 Your game will appear here</p>
                        <p className="text-xs text-gray-500">
                          Start chatting to generate your first game
                        </p>
                      </div>
                    </motion.div>

                    {[
                      "top-2 left-2",
                      "top-2 right-2",
                      "bottom-2 left-2",
                      "bottom-2 right-2",
                    ].map((pos, i) => (
                      <motion.div
                        key={i}
                        className={`absolute ${pos} w-4 h-4 border-2 border-[var(--color-primary)]/50`}
                        style={{
                          borderRadius:
                            i % 2 === 0 ? "0 0 4px 0" : "0 0 0 4px",
                          borderTop: "none",
                          borderLeft: i % 2 === 1 ? "none" : undefined,
                          borderRight: i % 2 === 0 ? "none" : undefined,
                        }}
                        animate={{
                          opacity: [0.3, 1, 0.3],
                          scale: [1, 1.2, 1],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          delay: i * 0.2,
                        }}
                      />
                    ))}
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
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.5 }}
              >
                <motion.div
                  className="absolute inset-0 opacity-10"
                  style={{
                    backgroundImage: `linear-gradient(rgba(201, 13, 12, 0.3) 1px, transparent 1px),
                                     linear-gradient(90deg, rgba(201, 13, 12, 0.3) 1px, transparent 1px)`,
                    backgroundSize: "50px 50px",
                  }}
                  animate={{
                    backgroundPosition: ["0px 0px", "50px 50px"],
                  }}
                  transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
                />

                <motion.div
                  className="text-center mb-16 z-10 max-w-3xl"
                  initial={{ y: -50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
                >
                  <motion.div
                    className="inline-flex items-center gap-3 mb-6 px-6 py-3 backdrop-blur-xl bg-gradient-to-r from-white/10 to-white/5 rounded-full"
                    style={{
                      border: "1px solid rgba(255, 255, 255, 0.2)",
                      boxShadow:
                        "0 4px 20px rgba(201, 13, 12, 0.2), inset 0 1px 2px rgba(255, 255, 255, 0.1)",
                    }}
                    animate={{
                      boxShadow: [
                        "0 4px 20px rgba(201, 13, 12, 0.2), inset 0 1px 2px rgba(255, 255, 255, 0.1)",
                        "0 4px 30px rgba(201, 13, 12, 0.4), inset 0 1px 2px rgba(255, 255, 255, 0.2)",
                        "0 4px 20px rgba(201, 13, 12, 0.2), inset 0 1px 2px rgba(255, 255, 255, 0.1)",
                      ],
                    }}
                    transition={{ duration: 3, repeat: Infinity }}
                  >
                    <motion.div
                      animate={{ rotate: [0, 360] }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                    >
                      <Sparkles
                        className="text-[var(--color-primary)]"
                        size={20}
                      />
                    </motion.div>
                    <span className="pixel-text text-sm text-gray-300">
                      AI-Powered Game Creation
                    </span>
                  </motion.div>

                  <motion.h2
                    className="text-5xl md:text-7xl font-bold title-font mb-6 leading-tight"
                    animate={{
                      textShadow: [
                        "0 0 20px rgba(201, 13, 12, 0.5)",
                        "0 0 40px rgba(201, 13, 12, 0.8)",
                        "0 0 20px rgba(201, 13, 12, 0.5)",
                      ],
                    }}
                    transition={{ duration: 3, repeat: Infinity }}
                  >
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#C90D0C] via-[#FFD700] to-[#8B5CF6]">
                      Welcome to
                    </span>
                    <br />
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300">
                      StarCade AI
                    </span>
                  </motion.h2>

                  <motion.p
                    className="text-gray-400 pixel-text text-lg md:text-xl max-w-2xl mx-auto"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                  >
                    Choose your AI companion and bring your game ideas to life
                  </motion.p>
                </motion.div>

                <motion.div
                  className="mb-20 z-10 w-full"
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{
                    delay: 0.6,
                    type: "spring",
                    stiffness: 100,
                  }}
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
            } backdrop-blur-xl bg-black/40 relative z-10`}
            style={{
              boxShadow: conversationStarted
                ? "0 -8px 32px rgba(0, 0, 0, 0.5)"
                : "none",
            }}
            transition={{ type: "spring", stiffness: 100, damping: 25 }}
          >
            <div
              className="absolute inset-0 bg-gradient-to-t from-white/5 to-transparent pointer-events-none"
              style={{ backdropFilter: "blur(20px)" }}
            />

            <AnimatePresence>
              {conversationStarted && messages.length > 0 && (
                <motion.div
                  layout
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "220px", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="relative overflow-y-auto p-6 space-y-4"
                  style={{
                    scrollbarWidth: "thin",
                    scrollbarColor: "var(--color-primary) transparent",
                  }}
                >
                  {messages.map((m, i) => (
                    <motion.div
                      key={i}
                      layout
                      initial={{ opacity: 0, y: 20, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{
                        type: "spring",
                        stiffness: 200,
                        damping: 25,
                      }}
                      className={`max-w-[85%] ${
                        m.from === "ai" ? "self-start" : "self-end ml-auto"
                      }`}
                    >
                      <motion.div
                        className={`p-4 rounded-2xl break-words backdrop-blur-xl pixel-text text-sm leading-relaxed shadow-lg ${
                          m.from === "ai"
                            ? "bg-gradient-to-br from-white/10 to-white/5 text-gray-200"
                            : "bg-gradient-to-br from-[var(--color-primary)] to-[#a30b0b] text-white"
                        }`}
                        style={{
                          border:
                            m.from === "ai"
                              ? "1px solid rgba(255, 255, 255, 0.1)"
                              : `1px solid ${
                                  CHARACTERS.find(
                                    (c) => c.id === selectedCharacter
                                  )?.color
                                }`,
                          boxShadow:
                            m.from === "ai"
                              ? "0 4px 20px rgba(0, 0, 0, 0.3)"
                              : `0 4px 20px ${CHARACTERS.find((c) => c.id === selectedCharacter)?.color}66`,
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

            {conversationStarted && (
              <motion.div layout className="relative px-6 pb-4">
                <motion.button
                  onClick={async () => {
                    try {
                      const res = await fetch(`${BACKEND}/`);
                      const data = await res.json();
                      setMessages((prev) => [
                        ...prev,
                        { from: "ai", text: `⚡ ${data.message}` },
                      ]);
                      setNotification(data.message);
                    } catch (err) {
                      const errorMsg =
                        "❌ Couldn't reach backend. Try again soon.";
                      setMessages((prev) => [
                        ...prev,
                        { from: "ai", text: errorMsg },
                      ]);
                      setNotification(errorMsg);
                    }
                  }}
                  className="flex items-center justify-center gap-3 w-full py-3 rounded-xl text-sm font-bold pixel-text uppercase text-white backdrop-blur-xl relative overflow-hidden group"
                  style={{
                    background:
                      "linear-gradient(135deg, var(--color-primary), #a30b0b)",
                    border: "1px solid rgba(255, 255, 255, 0.2)",
                    boxShadow:
                      "0 0 20px rgba(201, 13, 12, 0.5), inset 0 1px 2px rgba(255, 255, 255, 0.1)",
                  }}
                  whileHover={{
                    scale: 1.02,
                    boxShadow:
                      "0 0 40px rgba(201, 13, 12, 0.8), inset 0 1px 2px rgba(255, 255, 255, 0.2)",
                  }}
                  whileTap={{ scale: 0.98 }}
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                    animate={{ x: ["-100%", "100%"] }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  />
                  <motion.div
                    animate={{ rotate: [0, 360] }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  >
                    <Zap size={18} className="text-white drop-shadow-lg" />
                  </motion.div>
                  <span className="relative z-10">Wake Backend</span>
                </motion.button>

                <AnimatePresence>
                  {notification && (
                    <motion.div
                      key="notification"
                      initial={{ opacity: 0, y: 20, scale: 0.9 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.9 }}
                      transition={{
                        type: "spring",
                        stiffness: 200,
                        damping: 20,
                      }}
                      className="absolute left-1/2 -translate-x-1/2 -top-20 w-[90%] backdrop-blur-xl bg-gradient-to-r from-[var(--color-primary)] to-[#a30b0b] px-6 py-4 rounded-xl text-sm font-bold pixel-text text-white flex items-center justify-between shadow-2xl z-50"
                      style={{
                        border: "1px solid rgba(255, 255, 255, 0.2)",
                        boxShadow:
                          "0 0 30px rgba(201, 13, 12, 0.6), inset 0 1px 2px rgba(255, 255, 255, 0.2)",
                      }}
                    >
                      <motion.span
                        className="tracking-wide flex items-center gap-3"
                        animate={{
                          opacity: [0.9, 1, 0.9],
                        }}
                        transition={{
                          duration: 1.5,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                      >
                        <Sparkles size={16} />
                        {notification}
                      </motion.span>

                      <motion.button
                        onClick={() => setNotification(null)}
                        className="ml-4 text-white/90 hover:text-white p-1 hover:bg-white/10 rounded-lg transition-all"
                        whileHover={{ scale: 1.2, rotate: 90 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <X size={16} />
                      </motion.button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}

            <motion.div
              layout
              className="relative p-6 flex items-center gap-4"
              transition={{ type: "spring", stiffness: 100, damping: 25 }}
            >
              <AnimatePresence>
                {conversationStarted && (
                  <motion.div
                    layout
                    initial={{ opacity: 0, x: -30, scale: 0 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={{ opacity: 0, x: -30, scale: 0 }}
                    transition={{
                      type: "spring",
                      stiffness: 200,
                      damping: 20,
                    }}
                  >
                    <MiniAvatar characterId={selectedCharacter} />
                  </motion.div>
                )}
              </AnimatePresence>

              <motion.div className="flex-1 relative" layout>
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
                  className="w-full backdrop-blur-xl bg-gradient-to-r from-white/10 to-white/5 text-white rounded-xl px-5 py-4 pr-14 outline-none pixel-text text-sm transition-all placeholder:text-gray-500"
                  style={{
                    border: input.trim()
                      ? `2px solid ${CHARACTERS.find((c) => c.id === selectedCharacter)?.color}`
                      : "2px solid rgba(255, 255, 255, 0.1)",
                    boxShadow: input.trim()
                      ? `0 0 20px ${CHARACTERS.find((c) => c.id === selectedCharacter)?.color}66`
                      : "0 4px 20px rgba(0, 0, 0, 0.3)",
                  }}
                  disabled={!selectedCharacter}
                />

                {input.length > 0 && (
                  <motion.div
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs pixel-text text-gray-500"
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                  >
                    {input.length}
                  </motion.div>
                )}
              </motion.div>

              <motion.button
                onClick={handleSend}
                className="relative w-14 h-14 font-bold pixel-text uppercase rounded-xl overflow-hidden flex items-center justify-center group"
                style={{
                  background: `linear-gradient(135deg, ${
                    CHARACTERS.find((c) => c.id === selectedCharacter)?.color
                  }, var(--color-primary))`,
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                  boxShadow: `0 0 20px ${
                    CHARACTERS.find((c) => c.id === selectedCharacter)?.color
                  }66, inset 0 1px 2px rgba(255, 255, 255, 0.1)`,
                }}
                whileHover={{
                  scale: 1.05,
                  boxShadow: `0 0 40px ${
                    CHARACTERS.find((c) => c.id === selectedCharacter)?.color
                  }aa, inset 0 1px 2px rgba(255, 255, 255, 0.2)`,
                }}
                whileTap={{ scale: 0.95 }}
                disabled={loading || !selectedCharacter || !input.trim()}
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                  animate={{ x: ["-100%", "100%"] }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "linear",
                    repeatDelay: 1,
                  }}
                />

                {loading ? (
                  <motion.div
                    className="relative z-10"
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  >
                    <Sparkles size={20} className="text-white" />
                  </motion.div>
                ) : (
                  <motion.div
                    className="relative z-10"
                    whileHover={{ x: 2, y: -2 }}
                  >
                    <Send size={20} className="text-white drop-shadow-lg" />
                  </motion.div>
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
            className="fixed inset-0 bg-black/90 backdrop-blur-md flex justify-center items-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="relative w-full max-w-2xl max-h-[85vh] overflow-hidden backdrop-blur-2xl bg-gradient-to-br from-white/10 to-white/5 rounded-3xl shadow-2xl"
              style={{
                border: "1px solid rgba(255, 255, 255, 0.2)",
                boxShadow:
                  "0 20px 60px rgba(0, 0, 0, 0.8), inset 0 1px 2px rgba(255, 255, 255, 0.1)",
              }}
              initial={{ scale: 0.8, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 50 }}
              transition={{ type: "spring", damping: 25 }}
            >
              <div className="absolute -inset-4 bg-gradient-radial from-[var(--color-primary)]/30 to-transparent blur-2xl -z-10" />

              <div className="p-8 overflow-y-auto max-h-[85vh]">
                <motion.div
                  className="flex items-center gap-4 mb-8"
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <motion.div
                    animate={{ rotate: [0, 360] }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  >
                    <Sparkles
                      className="text-[var(--color-primary)]"
                      size={32}
                    />
                  </motion.div>
                  <h2 className="title-font text-4xl text-[var(--color-primary)]">
                    Customize Your Game
                  </h2>
                </motion.div>

                <form className="space-y-8">
                  {questions.map((q, i) => (
                    <motion.div
                      key={i}
                      className="backdrop-blur-xl bg-white/5 p-6 rounded-2xl border border-white/10"
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
                            className="flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all backdrop-blur-sm hover:bg-white/5"
                            whileHover={{ scale: 1.02, x: 4 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <input
                              type="radio"
                              name={q.question}
                              value={opt}
                              checked={answers[q.question] === opt}
                              onChange={(e) =>
                                handleAnswerChange(q.question, e.target.value)
                              }
                              className="w-5 h-5 accent-[var(--color-primary)]"
                            />
                            <span className="text-sm text-gray-300">
                              {opt}
                            </span>
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
                        className="w-full backdrop-blur-xl bg-white/5 border border-white/20 px-4 py-3 text-sm rounded-xl pixel-text text-gray-200 placeholder:text-gray-500 outline-none focus:border-[var(--color-primary)] transition-all"
                      />
                    </motion.div>
                  ))}
                </form>

                <motion.button
                  onClick={handleModalSubmit}
                  className="mt-8 w-full py-4 pixel-text font-bold uppercase rounded-xl text-white relative overflow-hidden group"
                  style={{
                    background:
                      "linear-gradient(135deg, var(--color-primary), #a30b0b)",
                    border: "1px solid rgba(255, 255, 255, 0.2)",
                    boxShadow:
                      "0 0 30px rgba(201, 13, 12, 0.5), inset 0 1px 2px rgba(255, 255, 255, 0.1)",
                  }}
                  whileHover={{
                    scale: 1.02,
                    boxShadow:
                      "0 0 50px rgba(201, 13, 12, 0.8), inset 0 1px 2px rgba(255, 255, 255, 0.2)",
                  }}
                  whileTap={{ scale: 0.98 }}
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                    animate={{ x: ["-100%", "100%"] }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  />
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
