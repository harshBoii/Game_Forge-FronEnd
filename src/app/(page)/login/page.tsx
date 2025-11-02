"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, LogIn } from "lucide-react";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({ username, password });
  };

  return (
    <motion.div
      className="min-h-screen flex items-center justify-center relative overflow-hidden text-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      style={{
        background: "linear-gradient(135deg, #0a0a0a 30%, #C90D0C 120%)",
      }}
    >
      {/* Background Glow Orbs */}
      <motion.div
        className="absolute top-1/3 left-1/4 w-96 h-96 bg-[#C90D0C]/30 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-1/3 right-1/4 w-[500px] h-[500px] bg-black/40 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.4, 1],
          rotate: [0, 180, 360],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear",
        }}
      />

      {/* Login Card */}
      <motion.div
        className="relative z-10 w-[90%] max-w-md p-10 rounded-3xl backdrop-blur-2xl shadow-2xl"
        style={{
          background:
            "linear-gradient(145deg, rgba(255,255,255,0.05), rgba(255,255,255,0.08))",
          border: "1px solid rgba(255,255,255,0.2)",
          boxShadow:
            "0 0 40px rgba(201,13,12,0.5), inset 0 0 20px rgba(255,255,255,0.1)",
        }}
        initial={{ scale: 0.9, opacity: 0, y: 40 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 120, damping: 20 }}
      >
        {/* Header */}
        <motion.div
          className="flex flex-col items-center mb-10"
          animate={{
            textShadow: [
              "0 0 20px rgba(201,13,12,0.5)",
              "0 0 40px rgba(201,13,12,0.8)",
              "0 0 20px rgba(201,13,12,0.5)",
            ],
          }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          >
            <Sparkles className="text-[#C90D0C]" size={28} />
          </motion.div>
          <h1 className="text-4xl font-bold mt-4 tracking-wide bg-clip-text text-transparent bg-gradient-to-r from-[#C90D0C] to-[#ff4444]">
            Welcome Back
          </h1>
          <p className="text-gray-400 text-sm mt-2 tracking-wide">
            Login to continue your StarCade journey
          </p>
        </motion.div>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-6">
          {/* Username */}
          <motion.div
            className="relative"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 150, damping: 15 }}
          >
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-5 py-3 rounded-xl bg-white/10 text-gray-200 placeholder-gray-500 backdrop-blur-md border border-white/10 outline-none focus:border-[#C90D0C] focus:shadow-[0_0_20px_rgba(201,13,12,0.5)] transition-all"
            />
          </motion.div>

          {/* Password */}
          <motion.div
            className="relative"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 150, damping: 15 }}
          >
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-5 py-3 rounded-xl bg-white/10 text-gray-200 placeholder-gray-500 backdrop-blur-md border border-white/10 outline-none focus:border-[#C90D0C] focus:shadow-[0_0_20px_rgba(201,13,12,0.5)] transition-all"
            />
          </motion.div>

          {/* Submit Button */}
          <motion.button
            type="submit"
            className="w-full py-3 mt-4 text-white font-bold uppercase tracking-widest rounded-xl relative overflow-hidden backdrop-blur-md"
            style={{
              background: "linear-gradient(135deg, #C90D0C, #a30b0b)",
              border: "1px solid rgba(255,255,255,0.2)",
              boxShadow:
                "0 0 25px rgba(201,13,12,0.6), inset 0 1px 2px rgba(255,255,255,0.1)",
            }}
            whileHover={{
              scale: 1.03,
              boxShadow:
                "0 0 40px rgba(201,13,12,0.8), inset 0 1px 2px rgba(255,255,255,0.2)",
            }}
            whileTap={{ scale: 0.98 }}
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
              animate={{ x: ["-100%", "100%"] }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            />
            <span className="relative z-10 flex items-center justify-center gap-2">
              <LogIn size={18} /> Login
            </span>
          </motion.button>
        </form>

        {/* Footer */}
        <p className="mt-8 text-center text-sm text-gray-500">
          Don’t have an account?{" "}
          <span className="text-[#C90D0C] hover:underline cursor-pointer">
            Sign up
          </span>
        </p>
      </motion.div>
    </motion.div>
  );
}
