"use client";
import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, PanInfo } from "framer-motion";
import {
  Home,
  Gamepad2,
  BrainCircuit,
  Compass,
  X,
  Menu,
  Send,
  Sparkles,
  LogOut,
  User,
  Activity
} from "lucide-react";
import { useRouter } from "next/navigation";

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

// ✅ Character Wheel Component
interface CharacterWheelProps {
  selectedId: string;
  onSelect: (characterId: string) => void;
}

export const CharacterWheel = ({
  selectedId,
  onSelect,
}: CharacterWheelProps) => {
  const [currentIndex, setCurrentIndex] = useState(1);

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
      <div
        className="relative w-96 h-96 rounded-full flex items-center justify-center overflow-hidden bg-black/30"
        style={{ border: `3px solid ${char.color}` }}
      >
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

        <motion.div
          className="absolute inset-0 cursor-grab active:cursor-grabbing"
          drag="x"
          dragElastic={0.1}
          dragConstraints={{ left: -60, right: 60 }}
          onDragEnd={handleDragEnd}
          style={{ touchAction: "pan-y", zIndex: 50 }}
        />
      </div>

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

// ✅ Mini Avatar Component
const MiniAvatar = ({ characterId }: { characterId: string }) => {
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

// ✅ Main Component with Navigation
export default function StarcadeLayout() {
  const router = useRouter();
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
  const [savingGame, setSavingGame] = useState(false);
  const [gameTitle, setGameTitle] = useState("");
  const [user, setUser] = useState<any>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const [backendStatus, setBackendStatus] = useState<string | null>(null);
  const [checkingStatus, setCheckingStatus] = useState(false);

  const BACKEND = "https://game-forge-backend.onrender.com";

  // ✅ Menu items with routes
  const menuItems = [
    { label: "AI Builder", icon: BrainCircuit, path: "/dashboard" },
    { label: "My Games", icon: Gamepad2, path: "/games" },
    { label: "Explore", icon: Compass, path: "/explore" },
  ];

  async function postJSON(url: string, data: any) {
    const res = await fetch(`${BACKEND}${url}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return res.json();
  }

  // Auto-scroll to latest message
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Mobile responsiveness & load user
  useEffect(() => {
    setIsClient(true);
    if (typeof window !== "undefined") {
      setIsMobile(window.innerWidth < 768);
      const handleResize = () => setIsMobile(window.innerWidth < 768);
      window.addEventListener("resize", handleResize);

      // ✅ Load user from localStorage
      try {
        const userStr = localStorage.getItem("user");
        if (userStr) {
          setUser(JSON.parse(userStr));
        } else {
          // Redirect to login if no user
          router.push("/auth");
        }
      } catch (error) {
        console.warn("Failed to parse user from localStorage");
        router.push("/auth");
      }

      return () => window.removeEventListener("resize", handleResize);
    }
  }, [router]);

  // Clear notification after 3 seconds
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  // ✅ Logout handler
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/");
  };

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
      console.error("Send error:", err);
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

    try {
      const response = await postJSON("/api/resume", {
        session_id: sessionId,
        answers: formattedAnswers,
      });
      handleBackendResponse(response);
    } catch (err) {
      console.error("Modal submit error:", err);
    } finally {
      setLoading(false);
    }
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

  async function handleSaveGame() {
    if (!gameHTML) {
      setNotification("❌ No game to save");
      return;
    }

    setSavingGame(true);

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setNotification("❌ Please log in to save games");
        setSavingGame(false);
        return;
      }

      let userName = "Creator";
      try {
        const userStr = localStorage.getItem("user");
        if (userStr) {
          const parsedUser = JSON.parse(userStr);
          userName = parsedUser.name;
        }
      } catch (parseError) {
        console.warn(
          "⚠️ Could not parse user from localStorage, using fallback"
        );
      }

      const title =
        gameTitle.trim() ||
        `Game by ${userName} - ${new Date().toLocaleString()}`;

      const response = await fetch("/api/games/save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title,
          html: gameHTML,
          status: "PRIVATE",
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setNotification(`✅ ${data.message}`);
        setGameTitle("");
        console.log("✅ Game saved:", data.game);
      } else {
        setNotification(`❌ ${data.message || "Failed to save game"}`);
        console.error("❌ Save failed:", data);
      }
    } catch (error) {
      console.error("❌ Save error:", error);
      setNotification("❌ Failed to save game. Please try again.");
    } finally {
      setSavingGame(false);
    }
  }

  return (
    <motion.div
      className="flex flex-col h-screen bg-gradient-to-br from-[#0a0a0a] via-[#111] to-[#0a0a0a] text-white overflow-hidden relative"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      style={{ willChange: "auto" }}
    >
      {/* BACKGROUND GRADIENTS */}
      <div
        className="fixed inset-0 overflow-hidden pointer-events-none"
        style={{ willChange: "auto" }}
      >
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

      {/* ✅ NAVBAR WITH USER INFO */}
      <motion.nav
        className="relative z-50 backdrop-blur-sm bg-gradient-to-r from-[var(--color-primary)] via-[#a30b0b] to-[var(--color-primary)]"
        style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.1)" }}
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
              className="text-2xl md:text-3xl font-bold tracking-widest flex items-center gap-3 cursor-pointer"
              whileHover={{ scale: 1.02 }}
              onClick={() => router.push("/")}
            >
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-200">
                STARCADE
              </span>
              <span className="text-white/80">AI</span>
            </motion.h1>
          </div>

          {/* ✅ User Profile Section */}
          <div className="flex items-center gap-4">
            {user && (
              <motion.div
                className="hidden md:flex items-center gap-3 px-4 py-2 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[var(--color-primary)] to-purple-600 flex items-center justify-center">
                  <User size={16} />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-bold">{user.name}</span>
                  <span className="text-xs text-gray-400">@{user.username}</span>
                </div>
              </motion.div>
            )}

            <motion.button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 backdrop-blur-sm hover:bg-red-500/20 transition-colors border border-white/20"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <LogOut size={18} />
              <span className="hidden sm:inline text-sm font-medium">
                Logout
              </span>
            </motion.button>
          </div>
        </div>
      </motion.nav>

      {/* MAIN LAYOUT */}
      <div className="flex flex-1 overflow-hidden relative z-10">
        {/* ✅ SIDEBAR WITH ROUTING */}
        <AnimatePresence>
          {isClient && (sidebarOpen || !isMobile) && (
            <motion.aside
              key="sidebar"
              initial={{ x: -300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -300, opacity: 0 }}
              transition={{ type: "spring", stiffness: 100, damping: 25 }}
              className="fixed md:static z-40 top-0 left-0 h-full w-2/3 sm:w-1/3 md:w-64 backdrop-blur-sm bg-black/40 p-6 flex flex-col gap-4 text-gray-300"
              style={{ borderRight: "1px solid rgba(255, 255, 255, 0.1)" }}
            >
              <div className="relative z-10 flex-1">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg text-[var(--color-primary)] tracking-wide font-bold flex items-center gap-2">
                    <motion.div
                      animate={{ rotate: [0, 360] }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "linear",
                      }}
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

                {/* ✅ Navigation Menu with Routes */}
                <ul className="space-y-2">
                  {menuItems.map(({ label, icon: Icon, path }) => {
                    const isActive = router ? false : false; // You can implement active state detection
                    return (
                      <motion.li key={label} className="relative group">
                        <motion.button
                          onClick={() => {
                            router.push(path);
                            if (isMobile) setSidebarOpen(false);
                          }}
                          className={`w-full flex items-center gap-3 cursor-pointer p-3 rounded-xl transition-all relative overflow-hidden ${
                            isActive
                              ? "bg-[var(--color-primary)]/20 border border-[var(--color-primary)]/50"
                              : "hover:bg-white/5"
                          }`}
                          whileHover={{ scale: 1.03, x: 4 }}
                          whileTap={{ scale: 0.98 }}
                          style={{ willChange: "transform" }}
                        >
                          <Icon
                            className={
                              isActive
                                ? "text-[var(--color-primary)]"
                                : "text-gray-400 group-hover:text-[var(--color-primary)]"
                            }
                            size={22}
                          />
                          <span
                            className={`font-medium ${
                              isActive
                                ? "text-white"
                                : "group-hover:text-white"
                            }`}
                          >
                            {label}
                          </span>
                        </motion.button>
                      </motion.li>
                    );
                  })}
                </ul>
              </div>

              {/* ✅ User Info in Sidebar (Mobile) */}
              {user && isMobile && (
                <motion.div
                  className="mt-auto pt-4 border-t border-white/10"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--color-primary)] to-purple-600 flex items-center justify-center flex-shrink-0">
                      <User size={18} />
                    </div>
                    <div className="flex flex-col overflow-hidden">
                      <span className="text-sm font-bold truncate">
                        {user.name}
                      </span>
                      <span className="text-xs text-gray-400 truncate">
                        @{user.username}
                      </span>
                    </div>
                  </div>
                </motion.div>
              )}
            </motion.aside>
          )}
        </AnimatePresence>

        {/* MAIN CONTENT (Same as before) */}
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
                className="flex-1 flex flex-col items-center justify-center backdrop-blur-sm bg-black/20 border-b border-white/10 relative overflow-hidden p-6"
              >
                {loading ? (
                  <div className="flex flex-col items-center gap-6">
                    <LoadingSpinner />
                    <motion.p
                      className="text-gray-400 text-sm"
                      animate={{ opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      Crafting your game...
                    </motion.p>
                  </div>
                ) : gameHTML ? (
                  <motion.div
                    className="relative flex flex-col items-center gap-4"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: "spring", damping: 20 }}
                  >
                    <iframe
                      srcDoc={gameHTML}
                      className="w-[90vw] md:w-[800px] h-[60vh] md:h-[600px] rounded-lg shadow-2xl"
                      title="StarCade Game Preview"
                      style={{ border: `2px solid var(--color-primary)` }}
                    />

                    <motion.button
                      onClick={handleSaveGame}
                      className="relative px-8 py-4 font-bold uppercase rounded-xl text-white overflow-hidden flex items-center gap-3 flex-shrink-0"
                      style={{
                        background: `linear-gradient(135deg, var(--color-primary), #a30b0b)`,
                        border: "1px solid rgba(255, 255, 255, 0.2)",
                        willChange: "transform",
                      }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      disabled={!gameHTML || savingGame}
                    >
                      <motion.div
                        className="absolute inset-0 bg-white/10"
                        animate={{ x: ["-100%", "100%"] }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                      />
                      <span className="relative z-10 flex items-center gap-2">
                        {savingGame ? (
                          <>
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1, repeat: Infinity }}
                              style={{ willChange: "transform" }}
                            >
                              <Sparkles size={18} />
                            </motion.div>
                            Saving...
                          </>
                        ) : (
                          <>
                            <Gamepad2 size={18} />
                            Save to Library
                          </>
                        )}
                      </span>
                    </motion.button>
                  </motion.div>
                ) : (
                  <motion.div
                    className="relative backdrop-blur-sm bg-black/40 w-[90vw] md:w-[800px] h-[60vh] md:h-[600px] rounded-2xl flex flex-col items-center justify-center text-gray-400 text-sm md:text-base overflow-hidden"
                    style={{ border: "1px solid rgba(255, 255, 255, 0.1)" }}
                    whileHover={{ scale: 1.01 }}
                  >
                    <motion.div
                      className="relative z-10 flex flex-col items-center gap-6"
                      animate={{ y: [0, -10, 0] }}
                      transition={{ duration: 3, repeat: Infinity }}
                    >
                      <Gamepad2
                        size={64}
                        className="text-[var(--color-primary)]"
                      />
                      <div className="text-center">
                        <p className="text-xl mb-2">
                          🎮 Your game will appear here
                        </p>
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

          {/* WELCOME SCREEN */}
{/* WELCOME SCREEN */}
{/* WELCOME SCREEN */}
<AnimatePresence>
  {!conversationStarted && (
    <motion.div
      layout
      className="flex-1 flex flex-col items-center p-4 md:p-8 backdrop-blur-sm bg-black/20 relative overflow-y-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Spacer for vertical centering when content is short */}
      <div className="flex-grow min-h-[2rem]" />

      {/* Title Section */}
      <motion.div
        className="text-center z-20 mb-6 md:mb-8 lg:mb-12 flex-shrink-0"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1, type: "spring", stiffness: 100 }}
      >
        <motion.h2
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black tracking-tighter mb-2"
          style={{
            backgroundImage:
              "linear-gradient(135deg, #C90D0C 0%, #000000 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          STARCADE
        </motion.h2>
        <motion.p className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#C90D0C] to-red-700">
          AI
        </motion.p>
      </motion.div>

      {/* Description Section */}
      <motion.div
        className="text-center mb-6 md:mb-8 lg:mb-10 z-10 max-w-3xl px-4 flex-shrink-0"
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, type: "spring", stiffness: 100 }}
      >
        <motion.div
          className="inline-flex items-center gap-2 md:gap-3 mb-3 md:mb-4 lg:mb-6 px-3 md:px-4 lg:px-6 py-2 md:py-2.5 lg:py-3 backdrop-blur-sm bg-white/10 rounded-full"
          style={{
            border: "1px solid rgba(255, 255, 255, 0.2)",
            willChange: "auto",
          }}
        >
          <Sparkles
            className="text-[var(--color-primary)] flex-shrink-0"
            size={18}
          />
          <span className="text-xs sm:text-sm text-gray-300 whitespace-nowrap">
            AI-Powered Game Creation
          </span>
        </motion.div>

        <motion.p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-400 max-w-2xl mx-auto">
          Choose your AI companion and bring your game ideas to life
        </motion.p>
      </motion.div>

      {/* Character Wheel */}
      <motion.div
        className="mb-6 md:mb-8 lg:mb-12 z-10 w-full flex-shrink-0"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.5, type: "spring", stiffness: 100 }}
      >
        <CharacterWheel
          selectedId={selectedCharacter}
          onSelect={setSelectedCharacter}
        />
      </motion.div>

      {/* Bottom spacer for centering */}
      <div className="flex-grow min-h-[2rem]" />
    </motion.div>
  )}
</AnimatePresence>


          {/* CHAT SECTION (Rest of the code remains the same) */}
          <motion.div
  layout
  className={`${
    conversationStarted
      ? "h-auto border-t border-white/10"
      : "w-full max-w-3xl mx-auto"
  } backdrop-blur-sm bg-black/40 relative z-10`}
  transition={{ type: "spring", stiffness: 100, damping: 25 }}
>
  {/* Chat Messages Container */}
  <AnimatePresence>
    {conversationStarted && messages.length > 0 && (
      <motion.div
        layout
        initial={{ height: 0, opacity: 0 }}
        animate={{ 
          height: "auto", 
          maxHeight: "min(50vh, 400px)", 
          opacity: 1 
        }}
        exit={{ height: 0, opacity: 0 }}
        className="relative overflow-y-auto p-4 md:p-6 space-y-3 md:space-y-4"
        style={{
          scrollBehavior: "smooth"
        }}
      >
        <div className="flex flex-col gap-3 md:gap-4">
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
              className={`flex ${
                m.from === "ai" ? "justify-start" : "justify-end"
              }`}
            >
              <motion.div
                className={`max-w-[85%] md:max-w-[75%] p-3 md:p-4 rounded-2xl break-words backdrop-blur-sm text-sm leading-relaxed shadow-lg ${
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
                  wordBreak: "break-word",
                  overflowWrap: "break-word",
                }}
                whileHover={{ scale: 1.02, y: -2 }}
              >
                {m.text}
              </motion.div>
            </motion.div>
          ))}
        </div>
        <div ref={chatEndRef} />
      </motion.div>
    )}
  </AnimatePresence>

  {/* Input Section */}
  <motion.div
    layout
    className="relative p-4 md:p-6 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 md:gap-4"
  >
    {/* Mini Avatar (visible only when conversation started) */}
    <AnimatePresence>
      {conversationStarted && (
        <motion.div
          layout
          initial={{ opacity: 0, x: -30, scale: 0 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: -30, scale: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
          className="hidden sm:block flex-shrink-0"
        >
          <MiniAvatar characterId={selectedCharacter} />
        </motion.div>
      )}
    </AnimatePresence>

    {/* Backend Status Check Button */}
    <motion.button
      onClick={async () => {
        setCheckingStatus(true);
        try {
          const response = await fetch("https://game-forge-backend.onrender.com/", {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          });
          const data = await response.json();
          console.log("Backend status:", data);
          setBackendStatus(data.status);
          
          // Show success message
          if (data.status === "ok") {
            console.log(data.message);
          }
          
          setTimeout(() => setBackendStatus(null), 3000);
        } catch (error) {
          console.error("Backend error:", error);
          setBackendStatus("error");
          setTimeout(() => setBackendStatus(null), 3000);
        } finally {
          setCheckingStatus(false);
        }
      }}
      className="w-full sm:w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 backdrop-blur-sm bg-white/10 hover:bg-white/20 transition-all relative group"
      style={{
        border: backendStatus === "ok" 
          ? "2px solid #10b981" 
          : backendStatus === "error"
          ? "2px solid #ef4444"
          : "1px solid rgba(255, 255, 255, 0.2)",
      }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      disabled={checkingStatus}
      title="Check Backend Status"
    >
      {/* Tooltip */}
      <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-black/90 text-white text-xs px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
        {backendStatus === "ok" 
          ? "Backend Running ✓" 
          : backendStatus === "error"
          ? "Backend Error ✗"
          : "Check Status"}
      </span>
      
      {checkingStatus ? (
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <Activity size={18} className="text-gray-300" />
        </motion.div>
      ) : (
        <Activity 
          size={18} 
          className={
            backendStatus === "ok"
              ? "text-green-400"
              : backendStatus === "error"
              ? "text-red-400"
              : "text-gray-300"
          }
        />
      )}
    </motion.button>

    {/* Input Field */}
    <motion.div 
      className="flex-1 relative min-w-0" 
      layout
    >
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
        className="w-full backdrop-blur-sm bg-white/10 text-white rounded-xl px-4 md:px-5 py-3 md:py-4 outline-none text-sm md:text-base transition-all placeholder:text-gray-500 placeholder:text-sm"
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

    {/* Send Button */}
    <motion.button
      onClick={handleSend}
      className="relative w-full sm:w-14 h-12 sm:h-14 font-bold uppercase rounded-xl overflow-hidden flex items-center justify-center flex-shrink-0"
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
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
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

      {/* MODAL (Same as before) */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            className="fixed inset-0 bg-black/90 backdrop-blur-sm flex justify-center items-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
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
                                handleAnswerChange(q.question, e.target.value)
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

      {/* NOTIFICATION TOAST */}
      <AnimatePresence>
        {notification && (
          <motion.div
            className="fixed top-8 right-8 backdrop-blur-sm bg-black/80 text-white px-6 py-4 rounded-xl shadow-2xl z-50 max-w-sm"
            style={{
              border: "1px solid rgba(201, 13, 12, 0.5)",
            }}
            initial={{ opacity: 0, y: -20, x: 50 }}
            animate={{ opacity: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, y: -20, x: 50 }}
            transition={{ type: "spring", stiffness: 200, damping: 25 }}
          >
            <p className="text-sm">{notification}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
