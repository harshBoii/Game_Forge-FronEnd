"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, LogIn, Zap } from "lucide-react";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({ username, password });
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { staggerChildren: 0.1, delayChildren: 0.3 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black overflow-hidden text-white">
      {/* Background with subtle gradient */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(135deg, #0a0a0a 0%, #1a0f0f 50%, #0a0a0a 100%)",
        }}
      />

      {/* Animated Grid Background - GPU optimized */}
      <motion.div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(0deg, #C90D0C 1px, transparent 1px), linear-gradient(90deg, #C90D0C 1px, transparent 1px)`,
          backgroundSize: "50px 50px",
        }}
        animate={{
          backgroundPosition: ["0px 0px", "50px 50px"],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear",
        }}
      />

      {/* Red accent glow - subtle, not heavy blur */}
      <motion.div
        className="absolute top-1/4 -left-48 w-96 h-96 rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, #C90D0C 0%, transparent 70%)",
          filter: "blur(80px)",
          opacity: 0.15,
        }}
        animate={{
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Main Container */}
      <div className="relative z-10 flex w-full h-screen max-h-screen lg:max-h-full lg:h-auto">
        {/* Left Section - Branding & Design */}
        <motion.div
          className="hidden lg:flex lg:w-1/2 flex-col justify-center items-start p-16"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-8"
          >
            {/* Logo/Icon */}
            <motion.div variants={itemVariants} className="flex items-center gap-3">
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: "linear",
                }}
              >
                <Zap className="text-[#C90D0C]" size={32} />
              </motion.div>
              <span className="text-2xl font-bold bg-gradient-to-r from-[#C90D0C] to-[#ff4444] bg-clip-text text-transparent">
                StarCade
              </span>
            </motion.div>

            {/* Tagline */}
            <motion.div variants={itemVariants} className="space-y-4">
              <h2 className="text-5xl font-bold leading-tight">
                Game On,{" "}
                <span className="bg-gradient-to-r from-[#C90D0C] to-[#ff4444] bg-clip-text text-transparent">
                  Level Up
                </span>
              </h2>
              <p className="text-gray-400 text-lg max-w-md">
                Step into the arcade experience. Compete, conquer, and climb the
                leaderboards.
              </p>
            </motion.div>

            {/* Feature List */}
            <motion.div variants={itemVariants} className="space-y-3">
              {["Lightning-fast gameplay", "Real-time multiplayer", "Epic rewards"].map(
                (feature, idx) => (
                  <motion.div
                    key={idx}
                    className="flex items-center gap-3 text-gray-300"
                    whileHover={{ x: 10 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  >
                    <motion.div
                      className="w-2 h-2 bg-[#C90D0C] rounded-full"
                      animate={{
                        scale: [1, 1.5, 1],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        delay: idx * 0.2,
                      }}
                    />
                    <span>{feature}</span>
                  </motion.div>
                )
              )}
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Right Section - Login Form */}
        <motion.div
          className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <motion.div
            className="w-full max-w-sm p-8 rounded-2xl"
            style={{
              background:
                "linear-gradient(145deg, rgba(20,20,20,0.8), rgba(40,20,20,0.4))",
              border: "1px solid rgba(201,13,12,0.3)",
              backdropFilter: "blur(10px)",
            }}
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{
              type: "spring",
              stiffness: 100,
              damping: 15,
              delay: 0.2,
            }}
          >
            {/* Form Header */}
            <motion.div
              className="flex flex-col items-center mb-8"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <motion.div
                variants={itemVariants}
                animate={{ rotate: [0, 360] }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "linear",
                }}
              >
                <Sparkles className="text-[#C90D0C]" size={28} />
              </motion.div>
              <motion.h1 variants={itemVariants} className="text-3xl font-bold mt-4">
                Welcome Back
              </motion.h1>
              <motion.p variants={itemVariants} className="text-gray-500 text-sm mt-2">
                Login to continue
              </motion.p>
            </motion.div>

            {/* Form */}
            <motion.form
              onSubmit={handleLogin}
              className="space-y-4"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {/* Username */}
              <motion.div variants={itemVariants}>
                <label className="block text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wide">
                  Username
                </label>
                <motion.input
                  type="text"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  onFocus={() => setFocusedField("username")}
                  onBlur={() => setFocusedField(null)}
                  className="w-full px-4 py-3 rounded-lg bg-white/5 text-gray-200 placeholder-gray-600 border border-white/10 outline-none transition-colors"
                  style={{
                    borderColor:
                      focusedField === "username"
                        ? "#C90D0C"
                        : "rgba(255,255,255,0.1)",
                    boxShadow:
                      focusedField === "username"
                        ? "0 0 15px rgba(201,13,12,0.3)"
                        : "none",
                  }}
                  animate={{
                    boxShadow:
                      focusedField === "username"
                        ? "0 0 15px rgba(201,13,12,0.3)"
                        : "none",
                  }}
                  transition={{ duration: 0.2 }}
                />
              </motion.div>

              {/* Password */}
              <motion.div variants={itemVariants}>
                <label className="block text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wide">
                  Password
                </label>
                <motion.input
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setFocusedField("password")}
                  onBlur={() => setFocusedField(null)}
                  className="w-full px-4 py-3 rounded-lg bg-white/5 text-gray-200 placeholder-gray-600 border border-white/10 outline-none transition-colors"
                  style={{
                    borderColor:
                      focusedField === "password"
                        ? "#C90D0C"
                        : "rgba(255,255,255,0.1)",
                    boxShadow:
                      focusedField === "password"
                        ? "0 0 15px rgba(201,13,12,0.3)"
                        : "none",
                  }}
                  animate={{
                    boxShadow:
                      focusedField === "password"
                        ? "0 0 15px rgba(201,13,12,0.3)"
                        : "none",
                  }}
                  transition={{ duration: 0.2 }}
                />
              </motion.div>

              {/* Remember & Forgot */}
              <motion.div
                variants={itemVariants}
                className="flex justify-between items-center text-xs"
              >
                <label className="flex items-center gap-2 text-gray-400 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 rounded" />
                  Remember me
                </label>
                <a
                  href="#"
                  className="text-[#C90D0C] hover:text-[#ff4444] transition-colors"
                >
                  Forgot password?
                </a>
              </motion.div>

              {/* Submit Button */}
              <motion.button
                variants={itemVariants}
                type="submit"
                className="w-full py-3 mt-6 text-white font-bold uppercase tracking-wider rounded-lg relative overflow-hidden group"
                style={{
                  background: "linear-gradient(135deg, #C90D0C, #a30b0b)",
                  border: "1px solid rgba(255,255,255,0.2)",
                }}
                whileHover={{
                  scale: 1.02,
                }}
                whileTap={{ scale: 0.98 }}
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
                <span className="relative z-10 flex items-center justify-center gap-2">
                  <LogIn size={18} /> Login
                </span>
              </motion.button>
            </motion.form>

            {/* Footer */}
            <motion.p
              variants={itemVariants}
              className="mt-6 text-center text-xs text-gray-600"
            >
              Don't have an account?{" "}
              <motion.a
                href="#"
                className="text-[#C90D0C] hover:text-[#ff4444] font-semibold transition-colors"
                whileHover={{ x: 2 }}
              >
                Sign up
              </motion.a>
            </motion.p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
