"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Crosshair, 
  Globe2, 
  Target, 
  Zap, 
  Loader2,
  PlayCircle 
} from "lucide-react";

export default function GameConsole() {
  const [prompt, setPrompt] = useState("");
  const [html, setHtml] = useState("");
  const [loading, setLoading] = useState(false);
  const [weapon, setWeapon] = useState("Laser");
  const [vibe, setVibe] = useState("Cyberpunk");
  const [target, setTarget] = useState("Bottle");

  const generateGame = async () => {
    try {
      const clickSound = new Audio("/arcade-click.mp3");
      clickSound.play().catch(() => {});
    } catch {}

    setLoading(true);
    const fullPrompt = `${prompt}
    Game should have:
    - Weapon: ${weapon}
    - Background vibe: ${vibe}
    - Target type: ${target}
    - Style: Cartoonish, colorful, fun arcade vibe.
    `;

    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt: fullPrompt }),
    });
    const data = await res.json();
    setHtml(data.html || "<p>Failed to generate game 😢</p>");
    setLoading(false);
  };

  return (
    <div className="w-full max-w-7xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-16"
      >
        <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold mb-6 tracking-tight">
          <span className="bg-linear-to-r from-squid-pink via-squid-coral to-squid-teal bg-clip-text text-transparent">
            GameForge AI
          </span>
        </h1>
        <p className="text-slate-400 text-base md:text-lg font-light tracking-wide max-w-2xl mx-auto">
          Transform your ideas into playable games using artificial intelligence
        </p>
      </motion.div>

      {/* Main Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="backdrop-blur-xl bg-white/3 rounded-3xl border border-white/10 
                   shadow-[0_8px_32px_rgba(0,0,0,0.4)] overflow-hidden"
      >
        <div className="p-8 md:p-12">
          {/* Game Concept Input */}
          <div className="mb-10">
            <label className="block text-sm font-semibold text-slate-300 mb-4 tracking-wide uppercase">
              Game Concept
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe your game idea here... (e.g., A space shooter where you defend Earth from asteroids)"
              className="w-full h-40 px-6 py-5 bg-slate-900/60 border border-slate-700/50 
                       text-white rounded-2xl text-base leading-relaxed
                       focus:outline-none focus:border-squid-teal focus:ring-2 focus:ring-squid-teal/30
                       placeholder:text-slate-500 transition-all duration-300 resize-none
                       backdrop-blur-sm"
            />
          </div>

          {/* Configuration Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <SelectInput
              label="Weapon Type"
              icon={<Crosshair className="w-4 h-4" />}
              value={weapon}
              onChange={setWeapon}
              options={["Laser", "Bullet", "Fireball", "Slime", "Magic Orb"]}
              accentColor="pink"
            />
            <SelectInput
              label="Environment"
              icon={<Globe2 className="w-4 h-4" />}
              value={vibe}
              onChange={setVibe}
              options={["Cyberpunk", "Forest", "Desert", "Underwater", "Space"]}
              accentColor="coral"
            />
            <SelectInput
              label="Target Entity"
              icon={<Target className="w-4 h-4" />}
              value={target}
              onChange={setTarget}
              options={["Bottle", "Monster", "Balloon", "Alien", "Zombie"]}
              accentColor="teal"
            />
          </div>

          {/* Generate Button */}
          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            onClick={generateGame}
            disabled={loading || !prompt.trim()}
            className="w-full relative group overflow-hidden rounded-2xl transition-all duration-300
                     disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="absolute inset-0 bg-linear-to-rrom-squid-pink via-squid-coral to-squid-teal 
                          opacity-100 group-hover:opacity-90 transition-opacity" />
            <div className="relative px-8 py-5 flex items-center justify-center gap-3">
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 text-white animate-spin" />
                  <span className="text-white font-semibold text-lg tracking-wide">
                    Generating Your Game...
                  </span>
                </>
              ) : (
                <>
                  <Zap className="w-5 h-5 text-white" />
                  <span className="text-white font-semibold text-lg tracking-wide">
                    Generate Game
                  </span>
                </>
              )}
            </div>
          </motion.button>
        </div>
      </motion.div>

      {/* Preview Window */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="mt-8 backdrop-blur-xl bg-white/3 rounded-3xl border border-white/10 
                   shadow-[0_8px_32px_rgba(0,0,0,0.4)] overflow-hidden"
      >
        {/* Window Header */}
        <div className="px-6 py-4 border-b border-white/5 flex items-center gap-3 bg-slate-900/30">
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500/80" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
            <div className="w-3 h-3 rounded-full bg-green-500/80" />
          </div>
          <span className="text-slate-400 text-sm font-medium tracking-wide">
            Live Preview
          </span>
        </div>

        {/* Preview Content */}
        <div className="p-6">
          <div className="w-full h-[650px] bg-slate-900/40 rounded-2xl overflow-hidden 
                        border border-slate-700/30 relative">
            <AnimatePresence mode="wait">
              {html ? (
                <motion.iframe
                  key="game-iframe"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  srcDoc={html}
                  sandbox="allow-scripts"
                  className="w-full h-full bg-white"
                  title="Generated Game Preview"
                />
              ) : (
                <motion.div
                  key="placeholder"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="w-full h-full flex flex-col items-center justify-center gap-6 p-8"
                >
                  <motion.div
                    animate={{ 
                      y: [0, -10, 0],
                      rotate: [0, 5, -5, 0]
                    }}
                    transition={{ 
                      duration: 4, 
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    <PlayCircle className="w-24 h-24 text-slate-600" strokeWidth={1.5} />
                  </motion.div>
                  <div className="text-center max-w-md">
                    <p className="text-slate-400 text-base font-medium mb-2">
                      Your game will appear here
                    </p>
                    <p className="text-slate-500 text-sm">
                      Describe your game concept above and click generate to begin
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="mt-12 text-center pb-8"
      >
        <p className="text-slate-500 text-sm font-light tracking-wide">
          Built by{" "}
          <span className="text-squid-teal font-medium">Harsh</span>
          {" · "}
          <span className="text-slate-600">Powered by Artificial Intelligence</span>
        </p>
      </motion.footer>
    </div>
  );
}

// Professional Select Component
interface SelectInputProps {
  label: string;
  icon: React.ReactNode;
  value: string;
  onChange: (value: string) => void;
  options: string[];
  accentColor: "pink" | "coral" | "teal";
}

function SelectInput({ label, icon, value, onChange, options, accentColor }: SelectInputProps) {
  const accentClasses = {
    pink: "focus:border-squid-pink focus:ring-squid-pink/30",
    coral: "focus:border-squid-coral focus:ring-squid-coral/30",
    teal: "focus:border-squid-teal focus:ring-squid-teal/30",
  };

  return (
    <div>
      <label className="block text-sm font-semibold text-slate-300 mb-4 tracking-wide uppercase items-center gap-2">
        {icon}
        <span>{label}</span>
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full px-5 py-4 bg-slate-900/60 border border-slate-700/50 text-white rounded-xl
                   text-base font-medium cursor-pointer appearance-none
                   focus:outline-none focus:ring-2 transition-all duration-300
                   backdrop-blur-sm ${accentClasses[accentColor]}
                   bg-[url('data:image/svg+xml;charset=UTF-8,%3csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"%3e%3cpolyline points="6 9 12 15 18 9"%3e%3c/polyline%3e%3c/svg%3e')] 
                   bg-size-[1.25rem] bg-position-[right_1rem_center] bg-no-repeat pr-12`}
      >
        {options.map((option) => (
          <option key={option} value={option} className="bg-slate-900">
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}
