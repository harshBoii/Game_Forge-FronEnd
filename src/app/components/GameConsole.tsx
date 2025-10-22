"use client";
import { useState } from "react";
import { motion } from "framer-motion";

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
    <div className="max-w-5xl w-full px-4 text-center">
      {/* Title */}
      <motion.h1
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="text-4xl md:text-5xl text-arcade-yellow drop-shadow-[0_0_20px_#ffdd00] mb-4"
      >
        ⚡ GameForge AI ⚡
      </motion.h1>

      <p className="text-xs text-gray-400 mb-8">
        Type your dream mini-game idea & customize it below 👇
      </p>

      {/* Prompt Input */}
      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="💭 Example: A cat flying through pipes like Flappy Bird..."
        className="w-full h-32 p-4 bg-black border-4 border-arcade-red text-arcade-yellow rounded-lg 
                   focus:outline-none focus:ring-4 focus:ring-arcade-red shadow-arcadeGlow placeholder:text-gray-500 text-xs"
      />

      {/* Customization Controls */}
      <div className="flex flex-col md:flex-row justify-center items-center gap-6 mt-8 text-xs">
        <div>
          <label className="block mb-1 text-arcade-yellow">🔫 Weapon</label>
          <select
            value={weapon}
            onChange={(e) => setWeapon(e.target.value)}
            className="bg-black border-2 border-arcade-yellow text-white px-3 py-2 rounded shadow-yellowGlow"
          >
            <option>Laser</option>
            <option>Bullet</option>
            <option>Fireball</option>
            <option>Slime</option>
            <option>Magic Orb</option>
          </select>
        </div>

        <div>
          <label className="block mb-1 text-arcade-yellow">🌆 Vibe</label>
          <select
            value={vibe}
            onChange={(e) => setVibe(e.target.value)}
            className="bg-black border-2 border-arcade-yellow text-white px-3 py-2 rounded shadow-yellowGlow"
          >
            <option>Cyberpunk</option>
            <option>Forest</option>
            <option>Desert</option>
            <option>Underwater</option>
            <option>Space</option>
          </select>
        </div>

        <div>
          <label className="block mb-1 text-arcade-yellow">🎯 Target</label>
          <select
            value={target}
            onChange={(e) => setTarget(e.target.value)}
            className="bg-black border-2 border-arcade-yellow text-white px-3 py-2 rounded shadow-yellowGlow"
          >
            <option>Bottle</option>
            <option>Monster</option>
            <option>Balloon</option>
            <option>Alien</option>
            <option>Zombie</option>
          </select>
        </div>
      </div>

      {/* Generate Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={generateGame}
        disabled={loading}
        className="mt-8 bg-arcade-red text-white font-bold px-6 py-3 rounded-md shadow-arcadeGlow 
                   hover:shadow-yellowGlow transition-all border-2 border-arcade-yellow"
      >
        {loading ? "⚙️ Generating..." : "🚀 Generate Game"}
      </motion.button>

      {/* Game Preview */}
      <div className="mt-10 w-full h-[600px] bg-black border-4 border-arcade-yellow rounded-lg overflow-hidden shadow-yellowGlow">
        {html ? (
          <iframe
            srcDoc={html}
            sandbox="allow-scripts"
            className="w-full h-full"
            title="Game Preview"
          />
        ) : (
          <p className="text-arcade-yellow mt-56 text-xs">
            👾 Your game will appear here 👾
          </p>
        )}
      </div>

      {/* Footer */}
      <footer className="mt-10 text-arcade-yellow text-[10px] opacity-80">
        Built by <span className="text-arcade-red">Harsh</span> 💥 Powered by AI
      </footer>
    </div>
  );
}
