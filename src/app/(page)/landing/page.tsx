"use client";
import React, { useState, useEffect, useRef } from "react";
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

const COMPANIONS = [
  {
    id: "flash",
    name: "Flash",
    tagline: "Master of Magic",
    src: "/characters/flash.svg",
    color: "#8B5CF6",
    model: "gpt-4.1-turbo",
    desc: "Swift reflexes, mystical powers. Perfect for fast-paced arcade games.",
  },
  {
    id: "titan",
    name: "Titan",
    tagline: "Brave Warrior",
    src: "/characters/titan.svg",
    color: "#EF4444",
    model: "gpt-5",
    desc: "Strength and strategy. Master of combat and epic battles.",
  },
  {
    id: "joe",
    name: "Joe",
    tagline: "Swift Hunter",
    src: "/characters/joe.svg",
    color: "#10B981",
    model: "gpt-5-nano",
    desc: "Precision and stealth. Hunt down the perfect game idea.",
  },
];

export default function LandingPage() {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentCompanion, setCurrentCompanion] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const companionSectionRef = useRef<HTMLDivElement>(null);

  // Detect companion section and lock scroll
  useEffect(() => {
    const handleScroll = () => {
      if (!companionSectionRef.current) return;

      const sectionTop = companionSectionRef.current.offsetTop;
      const sectionHeight = companionSectionRef.current.offsetHeight;
      const windowHeight = window.innerHeight;
      const scrollPosition = window.scrollY;

      const shouldLock =
        scrollPosition + windowHeight / 2 >= sectionTop &&
        scrollPosition < sectionTop + sectionHeight - windowHeight / 2;

      setIsLocked(shouldLock);

      if (shouldLock) {
        document.body.style.overflow = "hidden";
      } else {
        document.body.style.overflow = "auto";
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Handle wheel scroll
  useEffect(() => {
    if (!isLocked) return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();

      if (e.deltaY > 0 && currentCompanion < COMPANIONS.length - 1) {
        setCurrentCompanion((prev) => prev + 1);
      } else if (e.deltaY < 0 && currentCompanion > 0) {
        setCurrentCompanion((prev) => prev - 1);
      } else if (e.deltaY > 0 && currentCompanion === COMPANIONS.length - 1) {
        setIsLocked(false);
        document.body.style.overflow = "auto";
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    return () => window.removeEventListener("wheel", handleWheel);
  }, [isLocked, currentCompanion]);

  // Handle touch gestures
  useEffect(() => {
    if (!isLocked) return;

    let touchStartY = 0;
    let touchStartX = 0;
    let isVerticalScroll = false;

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 2) {
        touchStartY = e.touches[0].clientY;
        touchStartX = e.touches[0].clientX;
        isVerticalScroll = false;
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length !== 2 || touchStartY === 0) return;

      const currentY = e.touches[0].clientY;
      const currentX = e.touches[0].clientX;
      const diffY = touchStartY - currentY;
      const diffX = Math.abs(touchStartX - currentX);

      // Determine if this is a vertical scroll
      if (!isVerticalScroll) {
        if (Math.abs(diffY) > 10) {
          isVerticalScroll = true;
        } else if (diffX > 10) {
          return; // Not a vertical scroll
        }
      }

      if (isVerticalScroll && Math.abs(diffY) > 30) {
        e.preventDefault();

        if (diffY > 0 && currentCompanion < COMPANIONS.length - 1) {
          setCurrentCompanion((prev) => prev + 1);
          touchStartY = currentY;
        } else if (diffY < 0 && currentCompanion > 0) {
          setCurrentCompanion((prev) => prev - 1);
          touchStartY = currentY;
        } else if (diffY > 0 && currentCompanion === COMPANIONS.length - 1) {
          setIsLocked(false);
          document.body.style.overflow = "auto";
        }
      }
    };

    const handleTouchEnd = () => {
      touchStartY = 0;
      touchStartX = 0;
      isVerticalScroll = false;
    };

    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: false });
    window.addEventListener("touchend", handleTouchEnd, { passive: true });

    return () => {
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [isLocked, currentCompanion]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.12, delayChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, type: "spring" as const, stiffness: 100, damping: 25 },
    },
  };

  const floatingVariants = {
    animate: {
      y: [0, -20, 0],
      transition: { duration: 4, repeat: Infinity, repeatType: "loop" as const },
    },
  };

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      {/* Animated background layers */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-0 left-0 w-96 h-96 bg-red-600/30 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.5, 0.8, 0.5],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            repeatType: "loop" as const,
          }}
          style={{ willChange: "transform, opacity" }}
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
            repeatType: "loop" as const,
            delay: 1,
          }}
          style={{ willChange: "transform, opacity" }}
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
            repeatType: "loop" as const,
            delay: 2,
          }}
          style={{ willChange: "transform, opacity" }}
        />
      </div>

      {/* Animated Grid */}
      <motion.div
        className="fixed inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(0deg, #C90D0C 1px, transparent 1px), linear-gradient(90deg, #C90D0C 1px, transparent 1px)`,
          backgroundSize: "50px 50px",
          willChange: "background-position",
        }}
        animate={{
          backgroundPosition: ["0px 0px", "50px 50px"],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          repeatType: "loop" as const,
        }}
      />

      {/* Scanlines effect */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.02]">
        <div
          className="w-full h-full"
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,.05) 2px, rgba(255,255,255,.05) 4px)",
          }}
        />
      </div>

      {/* Navigation */}
      <motion.nav
        className="fixed top-0 w-full z-50 backdrop-blur-xl bg-black/40 border-b-2 border-[#C90D0C]/40"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
        style={{ willChange: "transform" }}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-4 flex items-center justify-between">
          <motion.div className="flex items-center gap-3" whileHover={{ scale: 1.08 }}>
            <img src="/logo.svg" alt="StarCade" className="w-10 h-10 object-contain" />
            <span className="text-2xl font-black bg-gradient-to-r from-[#C90D0C] via-[#ff4444] to-[#FFD700] bg-clip-text text-transparent">
              STARCADE
            </span>
          </motion.div>

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

          <button
            className="md:hidden text-[#C90D0C]"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          <motion.a
            href="/login"
            className="hidden sm:block px-6 py-2 bg-gradient-to-r from-[#C90D0C] to-[#a30b0b] rounded-lg font-bold text-sm uppercase tracking-wider shadow-lg shadow-[#C90D0C]/50"
            whileHover={{ scale: 1.08, boxShadow: "0 0 20px rgba(201,13,12,0.8)" }}
            whileTap={{ scale: 0.95 }}
          >
            Spawn In
          </motion.a>
        </div>

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
            <motion.div
              variants={itemVariants}
              className="inline-flex items-center gap-2 px-5 py-3 backdrop-blur-md bg-gradient-to-r from-[#C90D0C]/20 to-purple-600/20 rounded-full border-2 border-[#C90D0C]/50 shadow-lg shadow-[#C90D0C]/30"
            >
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 3, repeat: Infinity, repeatType: "loop" as const }} style={{ willChange: "transform" }}>
                <Flame size={16} className="text-[#C90D0C]" />
              </motion.div>
              <span className="text-xs font-black uppercase tracking-widest bg-gradient-to-r from-[#C90D0C] to-[#ff4444] bg-clip-text text-transparent">
                🚀 The Future of Game Making is Here
              </span>
            </motion.div>

            <motion.h1
              variants={itemVariants}
              className="text-7xl md:text-8xl lg:text-9xl font-black leading-tight space-y-4"
            >
              <motion.div
                animate={{
                  textShadow: [
                    "0 0 20px rgba(201,13,12,0.5)",
                    "0 0 40px rgba(201,13,12,0.8)",
                    "0 0 20px rgba(201,13,12,0.5)",
                  ],
                }}
                transition={{ duration: 3, repeat: Infinity, repeatType: "loop" as const }}
                style={{ willChange: "text-shadow" }}
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
                  transition={{ duration: 2, repeat: Infinity, repeatType: "loop" as const }}
                  style={{ willChange: "transform" }}
                >
                  Let AI
                </motion.span>
              </span>
              <span className="block bg-gradient-to-r from-[#FFD700] to-[#C90D0C] bg-clip-text text-transparent">
                Build the Hype.
              </span>
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="text-lg md:text-2xl text-gray-200 max-w-3xl mx-auto leading-relaxed font-medium"
            >
              No cap. No code. No limits.{" "}
              <span className="text-[#C90D0C] font-bold">Create legendary retro games</span> with AI magic, save them to your arcade library, and watch the world play your creations.
            </motion.p>

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
                  transition={{ duration: 2, repeat: Infinity, repeatType: "loop" as const }}
                  style={{ willChange: "transform" }}
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
                    transition={{ duration: 2, repeat: Infinity, repeatType: "loop" as const }}
                    style={{ willChange: "transform" }}
                  >
                    <ArrowRight size={24} />
                  </motion.div>
                </span>
              </motion.button>
            </motion.div>

            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatType: "loop" as const }}
              className="pt-8 text-gray-400 text-sm font-semibold"
              style={{ willChange: "transform" }}
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
          <div className="absolute top-4 left-4 w-8 h-8 border-2 border-[#C90D0C]" />
          <div className="absolute top-4 right-4 w-8 h-8 border-2 border-[#C90D0C]" />
          <div className="absolute bottom-4 left-4 w-8 h-8 border-2 border-[#C90D0C]" />
          <div className="absolute bottom-4 right-4 w-8 h-8 border-2 border-[#C90D0C]" />

          <div className="aspect-video bg-gradient-to-br from-[#C90D0C]/30 via-purple-600/20 to-black flex flex-col items-center justify-center space-y-6 relative overflow-hidden">
            <motion.div variants={floatingVariants} animate="animate" className="relative z-10" style={{ willChange: "transform" }}>
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
                transition={{ duration: 2, repeat: Infinity, repeatType: "loop" as const }}
              >
                🎮 Gameplay Preview Loading...
              </motion.div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* AI COMPANIONS SECTION */}
      <motion.section ref={companionSectionRef} className="relative w-full py-32">
        {/* Header */}
        <div className="sticky top-20 z-30 w-full text-center mb-20 px-6 lg:px-8 bg-black/40 backdrop-blur-sm py-8">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-6xl md:text-7xl font-black mb-6">
              Choose Your <span className="text-[#C90D0C]">AI Companion</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto font-semibold">
              Each companion has unique abilities to help you create legendary games
            </p>
          </motion.div>
        </div>

        {/* Carousel */}
        <div className="w-screen h-screen relative overflow-hidden flex items-center">
          <motion.div
            className="flex w-full h-full"
            animate={{ x: -currentCompanion * 100 + "vw" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            style={{ willChange: "transform" }}
          >
            {COMPANIONS.map((companion, idx) => (
              <motion.div
                key={companion.id}
                className="w-screen h-screen flex-shrink-0 flex items-center justify-center px-6 lg:px-8"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={idx === currentCompanion ? { opacity: 1, scale: 1 } : { opacity: 0.3, scale: 0.9 }}
                transition={{ duration: 0.5 }}
              >
                <motion.div
                  className="relative w-full max-w-4xl h-4/5 flex items-center justify-center rounded-3xl overflow-hidden border-3"
                  style={{
                    borderColor: companion.color,
                    boxShadow: idx === currentCompanion ? `0 0 50px ${companion.color}80` : `0 0 20px ${companion.color}30`,
                    willChange: "transform",
                  }}
                  whileHover={idx === currentCompanion ? { scale: 1.02 } : {}}
                >
                  <div
                    className="absolute inset-0 opacity-20"
                    style={{
                      background: `radial-gradient(circle, ${companion.color}, transparent)`,
                    }}
                  />

                  <motion.div
                    className="relative z-10 flex flex-col items-center justify-center text-center space-y-8 px-8"
                    initial={{ opacity: 0, y: 30 }}
                    animate={idx === currentCompanion ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                    transition={{ delay: 0.2, duration: 0.6 }}
                  >
                    <motion.div
                      className="relative w-64 h-64 md:w-80 md:h-80"
                      animate={
                        idx === currentCompanion
                          ? { scale: [1, 1.05, 1], y: [0, -10, 0] }
                          : { scale: 0.8 }
                      }
                      transition={{
                        duration: idx === currentCompanion ? 3 : 0.5,
                        repeat: idx === currentCompanion ? Infinity : 0,
                        repeatType: "loop" as const,
                      }}
                      style={{ willChange: "transform" }}
                    >
                      <img
                        src={companion.src}
                        alt={companion.name}
                        className="w-full h-full object-contain drop-shadow-2xl"
                        draggable={false}
                        style={{ willChange: "auto" }}
                      />
                    </motion.div>

                    <motion.div
                      className="space-y-4"
                      initial={{ opacity: 0 }}
                      animate={idx === currentCompanion ? { opacity: 1 } : { opacity: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      <h3 className="text-6xl font-black" style={{ color: companion.color }}>
                        {companion.name}
                      </h3>
                      <p className="text-2xl font-bold text-gray-300">{companion.tagline}</p>
                      <p className="text-lg text-gray-400 max-w-2xl mx-auto">{companion.desc}</p>
                      <p className="text-sm text-gray-500 font-semibold">Powered by {companion.model}</p>
                    </motion.div>

                    <motion.button
                      className="px-8 py-4 rounded-xl font-black uppercase tracking-widest mt-8 relative overflow-hidden group"
                      style={{
                        background: `linear-gradient(135deg, ${companion.color}, ${companion.color}cc)`,
                        border: `2px solid ${companion.color}`,
                        boxShadow: `0 0 30px ${companion.color}60`,
                        willChange: "transform, box-shadow",
                      }}
                      whileHover={{ scale: 1.08, boxShadow: `0 0 50px ${companion.color}80` }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <span className="relative flex items-center justify-center gap-2">
                        Build with {companion.name}
                        <ArrowRight size={20} />
                      </span>
                    </motion.button>
                  </motion.div>
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Navigation dots */}
        <div className="flex justify-center gap-4 mt-8 relative z-40">
          {COMPANIONS.map((companion, idx) => (
            <motion.button
              key={companion.id}
              className="w-4 h-4 rounded-full cursor-pointer transition-all"
              style={{
                backgroundColor: idx === currentCompanion ? companion.color : "#444",
                willChange: "background-color",
              }}
              whileHover={{ scale: 1.3 }}
              onClick={() => setCurrentCompanion(idx)}
            />
          ))}
        </div>

        {/* Scroll hint */}
        <motion.div
          className="text-center mt-12 text-gray-400 font-semibold"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity, repeatType: "loop" as const }}
          style={{ willChange: "opacity" }}
        >
          {currentCompanion < COMPANIONS.length - 1
            ? "↓ Scroll Down to Meet More ↓"
            : "✓ All Companions Revealed - Scroll to Continue"}
        </motion.div>
      </motion.section>

      {/* Features Section */}
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

          <motion.div className="grid md:grid-cols-3 gap-8">
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
                    style={{ willChange: "border-color, box-shadow" }}
                  >
                    {hoveredCard === idx && (
                      <motion.div
                        className="absolute inset-0 rounded-2xl"
                        style={{
                          boxShadow: `inset 0 0 20px ${feature.color}20`,
                        }}
                        animate={{ opacity: [0, 1, 0] }}
                        transition={{ duration: 2, repeat: Infinity, repeatType: "loop" as const }}
                      />
                    )}

                    <motion.div
                      className="inline-flex p-4 rounded-lg mb-6 relative z-10"
                      style={{
                        background: `linear-gradient(135deg, ${feature.color}40, ${feature.color}10)`,
                        border: `2px solid ${feature.color}`,
                        willChange: "transform",
                      }}
                      whileHover={{ scale: 1.15, rotate: 10 }}
                    >
                      <Icon size={28} style={{ color: feature.color }} />
                    </motion.div>

                    <h3 className="text-2xl font-black mb-3 text-white">{feature.title}</h3>
                    <p className="text-gray-300 leading-relaxed font-medium">{feature.desc}</p>

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
              transition={{ duration: 3, repeat: Infinity, repeatType: "loop" as const }}
              style={{ willChange: "text-shadow" }}
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
              style={{ willChange: "transform, box-shadow" }}
            >
              <motion.div
                className="absolute inset-0 bg-white/20"
                animate={{ x: ["-100%", "100%"] }}
                transition={{ duration: 2, repeat: Infinity, repeatType: "loop" as const }}
                style={{ willChange: "transform" }}
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
            <motion.div className="flex items-center gap-3" whileHover={{ scale: 1.05 }}>
              <img src="/logo.svg" alt="StarCade" className="w-10 h-10" />
              <span className="font-black text-lg">
                © 2025 StarCade. All rights reserved. <span className="text-[#C90D0C]">🎮</span>
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
