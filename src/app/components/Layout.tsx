"use client";
import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home,
  Gamepad2,
  BrainCircuit,
  Compass,
  Zap,
  X,
  Menu,
} from "lucide-react";

// Simple pixel spinner
const LoadingSpinner = () => (
  <motion.div
    className="w-12 h-12 border-4 border-[var(--color-primary)] border-t-transparent rounded-full"
    animate={{ rotate: 360 }}
    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
  />
);

export default function StarcadeLayout() {
  const [messages, setMessages] = useState([
    { from: "ai", text: "👾 Welcome to StarCade AI — Your cosmic game builder awaits!" },
  ]);
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
  const chatEndRef = useRef<HTMLDivElement>(null);

  const BACKEND = "https://game-forge-backend.onrender.com";

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

  async function handleSend() {
    if (!input.trim()) return;
    setMessages((prev) => [...prev, { from: "user", text: input }]);
    setInput("");
    setLoading(true);

    try {
      let response;
      if (!sessionId) {
        response = await postJSON("/api/start", { prompt: input });
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
      setMessages((prev) => [
        ...prev,
        { from: "ai", text: res.message },
      ]);
    } else if (res.type === "success") {
      setMessages((prev) => [
        ...prev,
        { from: "ai", text: "✅ Game generated successfully! Preview updated." },
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
    useEffect(() => {
    setIsClient(true);
    if (typeof window !== "undefined") {
        setIsMobile(window.innerWidth < 768);
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }
    }, []);

  return (
    <motion.div
      className="flex flex-col h-screen bg-[var(--color-bg-dark)] text-white overflow-hidden md:overflow-hidden overflow-y-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      {/* === NAVBAR === */}
      <motion.nav
        className="flex items-center justify-between px-6 md:px-8 py-3 bg-[var(--color-primary)] shadow-lg title-font"
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 80 }}
      >
        <div className="flex items-center gap-4">
          <button
            className="md:hidden text-white"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <Menu size={24} />
          </button>
          <h1 className="text-2xl md:text-4xl font-bold tracking-widest drop-shadow-lg">
            STARCADE <span className="text-[#ffffffcc]">AI</span>
          </h1>
        </div>

        <div className="hidden md:flex gap-4 text-sm uppercase pixel-text">
          {["Docs", "Studio", "Support"].map((link) => (
            <motion.a
              key={link}
              href="#"
              whileHover={{ scale: 1.1, color: "#fff" }}
              transition={{ type: "spring", stiffness: 200 }}
              className="text-gray-200 cursor-pointer"
            >
              {link}
            </motion.a>
          ))}
        </div>
      </motion.nav>

      {/* === MAIN LAYOUT === */}
      <div className="flex flex-1 overflow-hidden flex-col md:flex-row">
        {/* SIDEBAR */}
        <AnimatePresence>
            {isClient && (sidebarOpen || !isMobile) && (
            <motion.aside
              key="sidebar"
              initial={{ x: -200, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -200, opacity: 0 }}
              transition={{ type: "spring", stiffness: 70 }}
              className="fixed md:static z-50 top-0 left-0 h-full md:h-auto w-2/3 sm:w-1/3 md:w-1/6 bg-[#111] p-6 flex flex-col gap-3 pixel-text text-gray-300 border-r border-[var(--color-border)]"
            >
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg text-[var(--color-primary)] tracking-wide">
                  MENU
                </h2>
                <button
                  className="md:hidden text-gray-300 hover:text-white"
                  onClick={() => setSidebarOpen(false)}
                >
                  <X size={18} />
                </button>
              </div>

              <ul className="space-y-3">
                {menuItems.map(({ label, icon: Icon }, i) => (
                  <motion.li
                    key={label}
                    className="flex items-center gap-3 cursor-pointer group p-2 rounded-lg hover:bg-[#1a1a1a] transition-all"
                    whileHover={{
                      scale: 1.05,
                      color: "#fff",
                      textShadow: "0 0 12px #C90D0C",
                    }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  >
                    <motion.div
                      className="text-[var(--color-primary)] group-hover:text-white"
                      animate={{ opacity: [1, 0.85, 1, 0.7, 1] }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        repeatType: "loop",
                        ease: "easeInOut",
                        delay: i * 0.2,
                      }}
                      whileHover={{
                        rotate: 8,
                        scale: 1.2,
                        textShadow: "0 0 20px #C90D0C",
                      }}
                    >
                      <Icon size={20} />
                    </motion.div>

                    <motion.span
                      className="group-hover:text-white transition-colors"
                      animate={{ opacity: [1, 0.95, 1] }}
                      transition={{ duration: 3, repeat: Infinity }}
                    >
                      {label}
                    </motion.span>
                  </motion.li>
                ))}
              </ul>
            </motion.aside>
          )}
        </AnimatePresence>

        {/* GAME PREVIEW */}
        <main className="flex-1 flex items-center justify-center bg-[#111] border-y md:border-x md:border-y-0 border-[var(--color-border)] relative overflow-hidden">
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-[#C90D0C20] to-transparent pointer-events-none"
            animate={{ opacity: [0.2, 0.4, 0.2] }}
            transition={{ duration: 3, repeat: Infinity }}
          />

          {loading ? (
            <LoadingSpinner />
          ) : gameHTML ? (
            <motion.iframe
              srcDoc={gameHTML}
              className="w-[90vw] md:w-[800px] h-[60vh] md:h-[600px] glow-border rounded-sm"
              title="StarCade Game Preview"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", damping: 15 }}
            />
          ) : (
            <div className="w-[90vw] md:w-[800px] h-[60vh] md:h-[600px] glow-border flex items-center justify-center pixel-text text-gray-400 text-xs md:text-base">
              🎮 Your game will appear here
            </div>
          )}
        </main>

        {/* CHAT PANEL */}
        <motion.aside
          className="w-full md:w-1/4 panel flex flex-col mt-4 md:mt-0"
          initial={{ x: 120, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 70 }}
        >
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            <AnimatePresence>
              {messages.map((m, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`max-w-[90%] p-3 rounded-md break-words ${
                    m.from === "ai"
                      ? "bg-[var(--color-border)] text-gray-200 self-start"
                      : "bg-[var(--color-primary)] text-white self-end"
                  } pixel-text text-[10px] leading-relaxed`}
                >
                  {m.text}
                </motion.div>
              ))}
            </AnimatePresence>
            <div ref={chatEndRef} />
          </div>

          {/* WAKE BUTTON + NOTIFICATION */}
          <motion.div className="relative">
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
                  const errorMsg = "❌ Couldn’t reach backend. Try again soon.";
                  setMessages((prev) => [...prev, { from: "ai", text: errorMsg }]);
                  setNotification(errorMsg);
                }
              }}
              className="flex items-center justify-center gap-2 mb-3 mx-2 md:mx-4 py-2 rounded-md text-xs md:text-sm font-bold pixel-text uppercase text-white w-[calc(100%-1rem)] md:w-[calc(100%-2rem)]"
              style={{
                background: "linear-gradient(90deg, #C90D0C, #a30b0b)",
                border: "2px solid #C90D0C",
                boxShadow: "0 0 10px #C90D0C88",
              }}
              whileHover={{
                scale: 1.05,
                boxShadow: "0 0 20px #C90D0C",
              }}
              whileTap={{ scale: 0.95 }}
            >
              <Zap size={16} className="text-white" />
              Wake Me Up
            </motion.button>

            <AnimatePresence>
              {notification && (
                <motion.div
                  key="notification"
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 150, damping: 18 }}
                  className="absolute left-1/2 -translate-x-1/2 -top-20 px-4 py-3 rounded-md text-xs font-bold pixel-text text-white flex items-center justify-between w-[90%] shadow-lg border border-[#C90D0C] z-50"
                  style={{
                    backgroundColor: "#C90D0C",
                    boxShadow: "0 0 20px #C90D0C88",
                  }}
                >
                  <motion.span
                    animate={{ opacity: [0.8, 1, 0.8], scale: [1, 1.01, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                    className="tracking-wide"
                  >
                    {notification}
                  </motion.span>

                  <motion.button
                    onClick={() => setNotification(null)}
                    whileHover={{ scale: 1.2, rotate: 90 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    className="ml-3 text-white/90 hover:text-white"
                  >
                    <X size={14} />
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* CHAT INPUT */}
          <div className="p-4 border-t border-[var(--color-border)] flex">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your idea..."
              className="flex-1 bg-[#222] text-white rounded-l-md px-3 py-2 outline-none border border-[#515151] focus:border-[var(--color-primary)] pixel-text text-xs"
            />
            <motion.button
              onClick={handleSend}
              className="px-5 py-2 font-bold pixel-text uppercase rounded-r-md relative overflow-hidden"
              style={{
                background: "linear-gradient(90deg, #C90D0C, #a30b0b)",
                border: "2px solid #C90D0C",
                boxShadow: "0 0 10px #C90D0C88",
              }}
              whileHover={{
                scale: 1.05,
                boxShadow: "0 0 15px #C90D0CFF",
              }}
              whileTap={{ scale: 0.95 }}
              disabled={loading}
            >
              {loading ? "..." : "SEND"}
            </motion.button>
          </div>
        </motion.aside>
      </div>

      {/* === MODAL === */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            className="fixed inset-0 bg-black/80 flex justify-center items-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="panel w-[90vw] md:w-[700px] max-h-[80vh] overflow-y-auto p-6 md:p-8 rounded-lg"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", damping: 20 }}
            >
              <h2 className="title-font text-3xl mb-6 text-[var(--color-primary)]">
                Customize Your Game
              </h2>
              <form className="space-y-6">
                {questions.map((q, i) => (
                  <div key={i} className="border-b border-[var(--color-border)] pb-4">
                    <p className="text-lg mb-3">{q.question}</p>
                    {q.options?.map((opt: string, idx: number) => (
                      <label
                        key={idx}
                        className="flex items-center gap-2 mb-2 cursor-pointer text-sm"
                      >
                        <input
                          type="radio"
                          name={q.question}
                          value={opt}
                          checked={answers[q.question] === opt}
                          onChange={(e) =>
                            handleAnswerChange(q.question, e.target.value)
                          }
                        />
                        {opt}
                      </label>
                    ))}
                    <input
                      type="text"
                      placeholder="Custom answer..."
                      value={
                        q.options?.includes(answers[q.question])
                          ? ""
                          : answers[q.question] || ""
                      }
                      onChange={(e) =>
                        handleAnswerChange(q.question, e.target.value)
                      }
                      className="w-full mt-2 bg-[#111] border border-[#333] px-3 py-2 text-sm rounded pixel-text text-gray-200"
                    />
                  </div>
                ))}
              </form>
              <motion.button
                onClick={handleModalSubmit}
                className="mt-6 w-full py-3 pixel-text font-bold uppercase rounded-md"
                style={{
                  background: "linear-gradient(90deg, #C90D0C, #a30b0b)",
                  border: "2px solid #C90D0C",
                  boxShadow: "0 0 10px #C90D0C88",
                }}
                whileHover={{
                  scale: 1.03,
                  boxShadow: "0 0 20px #C90D0C",
                }}
              >
                Submit
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
