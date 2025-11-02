"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Sparkles,
  Zap,
  Gamepad2,
  Flame,
  ArrowRight,
  Star,
  Menu,
  X,
} from "lucide-react";

export default function LandingPage() {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.12, delayChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  const floatingVariants = {
    animate: {
      y: [0, -20, 0],
      transition: { duration: 4, repeat: Infinity, ease: "easeInOut" },
    },
  };

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* Animated background layers */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {/* Glow orbs */}
        <motion.div
          className="absolute top-0 left-0 w-96 h-96 bg-red-600/30 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.5, 0.8, 0.5],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-20 right-0 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.15, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
        />
        <motion.div
          className="absolute top-1/2 left-1/3 w-72 h-72 bg-yellow-600/15 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
        />
      </div>

      {/* Animated Grid */}
      <motion.div
        className="fixed inset-0 opacity-[0.03]"
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

      {/* Scanlines effect */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.02]">
        <div
          className="w-full h-full"
          style={{
            backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,.05) 2px, rgba(255,255,255,.05) 4px)",
          }}
        />
      </div>

      {/* Navigation */}
      <motion.nav
        className="fixed top-0 w-full z-50 backdrop-blur-xl bg-black/40 border-b-2 border-[#C90D0C]/40"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-4 flex items-center justify-between">
          <motion.div className="flex items-center gap-3" whileHover={{ scale: 1.08 }}>
            <img src="/logo.svg" alt="StarCade" className="w-10 h-10 object-contain" />
            <span className="text-2xl font-black bg-gradient-to-r from-[#C90D0C] via-[#ff4444] to-[#FFD700] bg-clip-text text-transparent">
              STARCADE
            </span>
          </motion.div>

          {/* Desktop menu */}
          <div className="hidden md:flex items-center gap-8">
            {["Features", "Games", "Community", "Docs"].map((link) => (
              <motion.a
                key={link}
                href="#"
                className="text-sm font-bold text-gray-300 hover:text-[#C90D0C] transition-all relative group uppercase tracking-wider"
                whileHover={{ x: 2 }}
              >
                {link}
                <span className="absolute bottom-0 left-0 w-0 h-1 bg-gradient-to-r from-[#C90D0C] to-[#ff4444] group-hover:w-full transition-all duration-300" />
              </motion.a>
            ))}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden text-[#C90D0C]"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* CTA Button */}
          <motion.a
            href="/login"
            className="hidden sm:block px-6 py-2 bg-gradient-to-r from-[#C90D0C] to-[#a30b0b] rounded-lg font-bold text-sm uppercase tracking-wider shadow-lg shadow-[#C90D0C]/50"
            whileHover={{ scale: 1.08, boxShadow: "0 0 20px rgba(201,13,12,0.8)" }}
            whileTap={{ scale: 0.95 }}
          >
            Spawn In
          </motion.a>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <motion.div
            className="md:hidden border-t border-[#C90D0C]/20 bg-black/80 backdrop-blur-sm"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
          >
            <div className="px-6 py-4 space-y-4">
              {["Features", "Games", "Community", "Docs"].map((link) => (
                <a
                  key={link}
                  href="#"
                  className="block text-gray-300 hover:text-[#C90D0C] transition-colors font-semibold"
                >
                  {link}
                </a>
              ))}
              <motion.a
                href="/login"
                className="block w-full px-4 py-2 bg-gradient-to-r from-[#C90D0C] to-[#a30b0b] rounded-lg font-bold text-sm uppercase text-center mt-4"
                whileHover={{ scale: 1.05 }}
              >
                Spawn In
              </motion.a>
            </div>
          </motion.div>
        )}
      </motion.nav>

      {/* Hero Section */}
      <motion.section className="relative pt-40 pb-32 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center space-y-10"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Premium badge */}
            <motion.div
              variants={itemVariants}
              className="inline-flex items-center gap-2 px-5 py-3 backdrop-blur-md bg-gradient-to-r from-[#C90D0C]/20 to-purple-600/20 rounded-full border-2 border-[#C90D0C]/50 shadow-lg shadow-[#C90D0C]/30"
            >
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 3, repeat: Infinity }}>
                <Flame size={16} className="text-[#C90D0C]" />
              </motion.div>
              <span className="text-xs font-black uppercase tracking-widest bg-gradient-to-r from-[#C90D0C] to-[#ff4444] bg-clip-text text-transparent">
                🚀 The Future of Game Making is Here
              </span>
            </motion.div>

            {/* Main Heading */}
            <motion.h1
              variants={itemVariants}
              className="text-7xl md:text-8xl lg:text-9xl font-black leading-tight space-y-4"
            >
              <motion.div
                animate={{ textShadow: ["0 0 20px rgba(201,13,12,0.5)", "0 0 40px rgba(201,13,12,0.8)", "0 0 20px rgba(201,13,12,0.5)"] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <span className="block bg-gradient-to-r from-[#C90D0C] via-[#ff4444] to-[#FFD700] bg-clip-text text-transparent">
                  Drop Your Game
                </span>
              </motion.div>
              <span className="block text-white">
                Ideas.{" "}
                <motion.span
                  className="inline-block bg-gradient-to-r from-[#8B5CF6] via-[#C90D0C] to-[#ff4444] bg-clip-text text-transparent"
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  Let AI
                </motion.span>
              </span>
              <span className="block bg-gradient-to-r from-[#FFD700] to-[#C90D0C] bg-clip-text text-transparent">
                Build the Hype.
              </span>
            </motion.h1>

            {/* Subheading */}
            <motion.p
              variants={itemVariants}
              className="text-lg md:text-2xl text-gray-200 max-w-3xl mx-auto leading-relaxed font-medium"
            >
              No cap. No code. No limits.{" "}
              <span className="text-[#C90D0C] font-bold">Create legendary retro games</span> with AI magic, save them to your arcade library, and watch the world play your creations.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-6 justify-center pt-8"
            >
              <motion.button
                className="px-10 py-5 bg-gradient-to-r from-[#C90D0C] to-[#a30b0b] rounded-xl font-black uppercase tracking-widest text-lg flex items-center justify-center gap-3 shadow-xl shadow-[#C90D0C]/50 relative overflow-hidden group"
                whileHover={{
                  scale: 1.08,
                  boxShadow: "0 0 40px rgba(201,13,12,0.8)",
                }}
                whileTap={{ scale: 0.95 }}
              >
                <motion.div
                  className="absolute inset-0 bg-white/20"
                  animate={{ x: ["-100%", "100%"] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <Gamepad2 size={24} />
                <span className="relative">Start Building</span>
              </motion.button>

              <motion.button
                className="px-10 py-5 border-3 border-[#C90D0C] text-[#C90D0C] rounded-xl font-black uppercase tracking-widest text-lg hover:bg-[#C90D0C]/10 transition-all flex items-center justify-center gap-3 relative group overflow-hidden"
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="relative flex items-center gap-3">
                  Watch Demo
                  <motion.div
                    animate={{ x: [0, 4, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <ArrowRight size={24} />
                  </motion.div>
                </span>
              </motion.button>
            </motion.div>

            {/* Scroll indicator */}
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="pt-8 text-gray-400 text-sm font-semibold"
            >
              ↓ Scroll to explore ↓
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* Featured showcase */}
      <motion.section
        className="relative max-w-6xl mx-auto px-6 lg:px-8 pb-32"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <div className="relative rounded-3xl overflow-hidden border-3 border-[#C90D0C]/50 backdrop-blur-sm bg-gradient-to-br from-black via-[#C90D0C]/5 to-black shadow-2xl shadow-[#C90D0C]/30">
          {/* Corner decorations */}
          <div className="absolute top-4 left-4 w-8 h-8 border-2 border-[#C90D0C]" />
          <div className="absolute top-4 right-4 w-8 h-8 border-2 border-[#C90D0C]" />
          <div className="absolute bottom-4 left-4 w-8 h-8 border-2 border-[#C90D0C]" />
          <div className="absolute bottom-4 right-4 w-8 h-8 border-2 border-[#C90D0C]" />

          <div className="aspect-video bg-gradient-to-br from-[#C90D0C]/30 via-purple-600/20 to-black flex flex-col items-center justify-center space-y-6 relative overflow-hidden">
            {/* Floating elements */}
            <motion.div variants={floatingVariants} animate="animate" className="relative z-10">
              <Gamepad2 size={100} className="text-[#C90D0C]" />
            </motion.div>

            <motion.div
              className="text-center space-y-3"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              viewport={{ once: true }}
            >
              <p className="text-gray-300 text-xl font-bold">Create Your First Game in Minutes</p>
              <motion.div
                className="inline-flex px-6 py-3 bg-[#C90D0C]/20 border border-[#C90D0C]/50 rounded-lg text-[#C90D0C] font-bold"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                🎮 Gameplay Preview Loading...
              </motion.div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Enhanced Features Section */}
      <motion.section className="relative py-32 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-20"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-6xl md:text-7xl font-black mb-6">
              Why Gamers <span className="text-[#C90D0C]">Choose</span> StarCade
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto font-semibold">
              Built for the retro enthusiasts and game builders of tomorrow
            </p>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {[
              {
                icon: Sparkles,
                title: "AI Magic",
                desc: "Just describe what you want. Our AI builds legendary retro games in seconds.",
                color: "#C90D0C",
              },
              {
                icon: Zap,
                title: "Lightning Fast",
                desc: "Deploy your games instantly to millions. No waiting. No complicated setup.",
                color: "#FFD700",
              },
              {
                icon: Star,
                title: "Retro Vibes",
                desc: "Arcade authenticity meets cutting-edge AI. Peak nostalgia meets innovation.",
                color: "#8B5CF6",
              },
              {
                icon: Gamepad2,
                title: "Play Anywhere",
                desc: "Web-based pure magic. Play on any device. Share with anyone, anywhere.",
                color: "#10B981",
              },
              {
                icon: Flame,
                title: "Build Your Legacy",
                desc: "Show off your creations to the world. Get discovered. Become a legend.",
                color: "#ff4444",
              },
              {
                icon: ArrowRight,
                title: "Monetize & Level Up",
                desc: "Sell your games. Earn real money. Turn passion into profit. Get paid.",
                color: "#06B6D4",
              },
            ].map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={idx}
                  variants={itemVariants}
                  className="group"
                  onHoverStart={() => setHoveredCard(idx)}
                  onHoverEnd={() => setHoveredCard(null)}
                >
                  <motion.div
                    className="relative p-8 rounded-2xl backdrop-blur-md bg-gradient-to-br from-white/10 via-white/5 to-black border-2 border-white/10 cursor-pointer overflow-hidden h-full shadow-xl"
                    whileHover={{
                      borderColor: feature.color,
                      boxShadow: `0 0 30px ${feature.color}40`,
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    {/* Border glow on hover */}
                    {hoveredCard === idx && (
                      <motion.div
                        className="absolute inset-0 rounded-2xl"
                        style={{
                          boxShadow: `inset 0 0 20px ${feature.color}20`,
                        }}
                        animate={{ opacity: [0, 1, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                    )}

                    {/* Icon */}
                    <motion.div
                      className="inline-flex p-4 rounded-lg mb-6 relative z-10"
                      style={{
                        background: `linear-gradient(135deg, ${feature.color}40, ${feature.color}10)`,
                        border: `2px solid ${feature.color}`,
                      }}
                      whileHover={{ scale: 1.15, rotate: 10 }}
                    >
                      <Icon size={28} style={{ color: feature.color }} />
                    </motion.div>

                    <h3 className="text-2xl font-black mb-3 text-white">
                      {feature.title}
                    </h3>
                    <p className="text-gray-300 leading-relaxed font-medium">
                      {feature.desc}
                    </p>

                    {/* Hover indicator */}
                    {hoveredCard === idx && (
                      <motion.div
                        className="mt-4 text-sm font-bold text-[#C90D0C]"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                      >
                        → Learn more
                      </motion.div>
                    )}
                  </motion.div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </motion.section>

      {/* How It Works */}
      <motion.section className="relative py-32 px-6 lg:px-8 bg-gradient-to-b from-black via-[#C90D0C]/5 to-black">
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="text-center mb-20"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-6xl md:text-7xl font-black mb-6">
              Three Moves. <span className="text-[#C90D0C]">That's It.</span>
            </h2>
            <p className="text-gray-400 text-lg">From idea to playable game in minutes</p>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-3 gap-12"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {[
              {
                number: "01",
                title: "Drop Your Idea",
                desc: "Tell AI what retro game you want. Be specific or let it surprise you.",
                icon: "🎮",
              },
              {
                number: "02",
                title: "Watch the Magic",
                desc: "Our AI builds your game in real-time with sick animations and retro vibes.",
                icon: "✨",
              },
              {
                number: "03",
                title: "Publish & Flex",
                desc: "Save to library, share with friends, or publish to millions instantly.",
                icon: "🚀",
              },
            ].map((step, idx) => (
              <motion.div
                key={idx}
                variants={itemVariants}
                className="relative group"
              >
                <motion.div
                  className="text-8xl font-black mb-6"
                  style={{
                    backgroundImage: "linear-gradient(135deg, #C90D0C, #ff4444)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                  whileHover={{ scale: 1.2, rotate: 5 }}
                >
                  {step.number}
                </motion.div>

                <div className="text-5xl mb-4">{step.icon}</div>

                <h3 className="text-3xl font-black mb-4 text-white">
                  {step.title}
                </h3>
                <p className="text-gray-300 leading-relaxed text-lg font-medium">
                  {step.desc}
                </p>

                {/* Connector line */}
                {idx < 2 && (
                  <motion.div
                    className="hidden md:block absolute -right-12 top-1/2 -translate-y-1/2"
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <ArrowRight size={48} className="text-[#C90D0C]" />
                  </motion.div>
                )}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* Stats Section */}
      <motion.section className="relative py-32 px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="grid md:grid-cols-4 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {[
              { number: "10K+", label: "Games Built", icon: "🎮" },
              { number: "50M+", label: "Total Plays", icon: "▶️" },
              { number: "1M+", label: "Active Players", icon: "👾" },
              { number: "99.9%", label: "Uptime", icon: "⚡" },
            ].map((stat, idx) => (
              <motion.div
                key={idx}
                variants={itemVariants}
                className="text-center group"
              >
                <motion.div
                  className="text-5xl mb-3"
                  whileHover={{ scale: 1.3, rotate: 10 }}
                >
                  {stat.icon}
                </motion.div>
                <motion.div
                  className="text-6xl font-black text-transparent bg-gradient-to-r from-[#C90D0C] to-[#ff4444] bg-clip-text mb-2"
                  whileInView={{ scale: [0.5, 1.15, 1] }}
                  transition={{ duration: 0.6 }}
                  viewport={{ once: true }}
                >
                  {stat.number}
                </motion.div>
                <p className="text-gray-400 font-black uppercase tracking-wider">
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* Final CTA */}
      <motion.section className="relative py-32 px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-10"
          >
            <motion.h2
              className="text-6xl md:text-7xl font-black"
              animate={{
                textShadow: [
                  "0 0 20px rgba(201,13,12,0.3)",
                  "0 0 40px rgba(201,13,12,0.6)",
                  "0 0 20px rgba(201,13,12,0.3)",
                ],
              }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              Ready to <span className="text-[#C90D0C]">Break</span> the Gaming World?
            </motion.h2>

            <p className="text-2xl text-gray-300 font-bold">
              Join thousands of creators already building and shipping legendary games on StarCade.
            </p>

            <motion.button
              className="px-12 py-6 bg-gradient-to-r from-[#C90D0C] to-[#a30b0b] rounded-xl font-black uppercase tracking-widest text-xl shadow-2xl shadow-[#C90D0C]/60 relative overflow-hidden group"
              whileHover={{
                scale: 1.1,
                boxShadow: "0 0 50px rgba(201,13,12,0.8)",
              }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.div
                className="absolute inset-0 bg-white/20"
                animate={{ x: ["-100%", "100%"] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <span className="relative flex items-center justify-center gap-3">
                Start Building Now
                <Gamepad2 size={28} />
              </span>
            </motion.button>

            <p className="text-gray-500 font-semibold text-sm">
              No credit card needed • Free to start • Unlimited games
            </p>
          </motion.div>
        </div>
      </motion.section>

      {/* Footer */}
      <footer className="relative border-t-2 border-[#C90D0C]/30 py-16 px-6 lg:px-8 bg-black/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-12 mb-16">
            {[
              { title: "Product", links: ["Features", "Pricing", "Security", "Roadmap"] },
              { title: "Community", links: ["Discord", "Twitter", "GitHub", "Docs"] },
              { title: "Company", links: ["About", "Blog", "Careers", "Contact"] },
              { title: "Legal", links: ["Privacy", "Terms", "Cookies", "License"] },
            ].map((col, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                viewport={{ once: true }}
              >
                <h4 className="font-black mb-6 text-lg uppercase tracking-wider">{col.title}</h4>
                <ul className="space-y-3">
                  {col.links.map((link) => (
                    <li key={link}>
                      <a
                        href="#"
                        className="text-gray-400 hover:text-[#C90D0C] transition-all font-semibold duration-300 relative group"
                      >
                        {link}
                        <span className="absolute bottom-0 left-0 w-0 h-1 bg-[#C90D0C] group-hover:w-full transition-all duration-300" />
                      </a>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>

          <div className="border-t border-[#C90D0C]/20 pt-12 flex flex-col lg:flex-row items-center justify-between gap-8">
            <motion.div
              className="flex items-center gap-3"
              whileHover={{ scale: 1.05 }}
            >
              <img src="/logo.svg" alt="StarCade" className="w-10 h-10" />
              <span className="font-black text-lg">
                © 2025 StarCade. All rights reserved.{" "}
                <span className="text-[#C90D0C]">🎮</span>
              </span>
            </motion.div>

            <div className="flex gap-8">
              {["Twitter", "Discord", "GitHub", "YouTube"].map((social) => (
                <motion.a
                  key={social}
                  href="#"
                  className="text-gray-400 hover:text-[#C90D0C] transition-colors font-bold uppercase tracking-wider text-sm"
                  whileHover={{ scale: 1.2 }}
                >
                  {social}
                </motion.a>
              ))}
            </div>
          </div>
        </div>
      </footer>

      <style jsx>{`
        @keyframes glow {
          0%, 100% {
            text-shadow: 0 0 10px rgba(201, 13, 12, 0.5);
          }
          50% {
            text-shadow: 0 0 30px rgba(201, 13, 12, 1);
          }
        }
      `}</style>
    </div>
  );
}
