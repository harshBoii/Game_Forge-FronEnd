"use client";
import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Home, Gamepad2, BrainCircuit, Compass } from "lucide-react";
// Simple pixel spinner
const LoadingSpinner = () => (
  <motion.div
    className="w-12 h-12 border-4 border-(--color-primary) border-t-transparent rounded-full"
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

  return (
    <motion.div
      className="flex flex-col h-screen bg-(--color-bg-dark) text-white overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      {/* === NAVBAR === */}
      <motion.nav
        className="flex items-center justify-between px-8 py-3 bg-(--color-primary)ow-lg title-font"
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 80 }}
      >
        <h1 className="text-4xl font-bold tracking-widest drop-shadow-lg">
          STARCADE <span className="text-[#ffffffcc]">AI</span>
        </h1>
        <div className="flex gap-4 text-sm uppercase pixel-text">
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
      <div className="flex flex-1 overflow-hidden">
        {/* LEFT MENU */}
        <motion.aside
        className="w-1/6 panel p-6 flex flex-col gap-3 pixel-text text-gray-300 border-r border-(--color-border)"
        initial={{ x: -120, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 70 }}
        >
        <h2 className="text-lg text-(--color-primary) mb-3 tracking-wide">MENU</h2>

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
                {/* FLICKERING ICON */}
                <motion.div
                className="text-(--color-primary) group-hover:text-white"
                animate={{ opacity: [1, 0.85, 1, 0.7, 1] }}
                transition={{
                    duration: 2,
                    repeat: Infinity,
                    repeatType: "loop",
                    ease: "easeInOut",
                    delay: i * 0.2, // slight stagger
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
        {/* CENTER GAME PREVIEW */}
        <main className="flex-1 flex items-center justify-center bg-[#111] border-x border-(--color-border) relative overflow-hidden">
          <motion.div
            className="absolute inset-0 bg-linear-to-br from-[#C90D0C20] to-transparent pointer-events-none"
            animate={{ opacity: [0.2, 0.4, 0.2] }}
            transition={{ duration: 3, repeat: Infinity }}
          />

          {loading ? (
            <LoadingSpinner />
          ) : gameHTML ? (
            <motion.iframe
              srcDoc={gameHTML}
              className="w-[800px] h-[600px] glow-border rounded-sm"
              title="StarCade Game Preview"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", damping: 15 }}
            />
          ) : (
            <div className="w-[800px] h-[600px] glow-border flex items-center justify-center pixel-text text-gray-400">
              🎮 Your game will appear here
            </div>
          )}
        </main>

        {/* RIGHT CHAT PANEL */}
        <motion.aside
          className="w-1/4 panel flex flex-col"
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
                  className={`max-w-[90%] p-3 rounded-md wrap-break-word ${
                    m.from === "ai"
                      ? "bg-(--color-border) text-gray-200 self-start"
                      : "bg-(--color-primary) text-white self-end"
                  } pixel-text text-[10px] leading-relaxed`}
                >
                  {m.text}
                </motion.div>
              ))}
            </AnimatePresence>
            <div ref={chatEndRef} />
          </div>

          {/* Chat Input */}
          <div className="p-4 border-t border-(--color-border) flex">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your idea..."
              className="flex-1 bg-[#222] text-white rounded-l-md px-3 py-2 outline-none border border-[#515151] focus:border-(--color-primary) pixel-text text-xs"
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

      {/* === MODAL (Questions Form) === */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            className="fixed inset-0 bg-black/80 flex justify-center items-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="panel w-[700px] max-h-[80vh] overflow-y-auto p-8 rounded-lg"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", damping: 20 }}
            >
              <h2 className="title-font text-3xl mb-6 text-(--color-primary)">
                Customize Your Game
              </h2>
              <form className="space-y-6">
                {questions.map((q, i) => (
                  <div key={i} className="border-b border-(--color-border) pb-4">
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
