"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, Zap, Gamepad2, Flame, ArrowRight, Star } from "lucide-react";

export default function LandingPage() {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* Background Gradients */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute top-0 left-0 w-96 h-96 bg-red-600/20 rounded-full blur-3xl"
          style={{
            animation: "pulse 8s ease-in-out infinite",
          }}
        />
        <div
          className="absolute bottom-0 right-0 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl"
          style={{
            animation: "pulse 8s ease-in-out infinite 2s",
          }}
        />
      </div>

      {/* Animated Grid */}
      <motion.div
        className="fixed inset-0 opacity-[0.02]"
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

      {/* Navigation */}
      <motion.nav
        className="fixed top-0 w-full z-50 backdrop-blur-md bg-black/30 border-b border-[#C90D0C]/20"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-4 flex items-center justify-between">
          <motion.div className="flex items-center gap-3" whileHover={{ scale: 1.05 }}>
            <img src="/logo.svg" alt="StarCade" className="w-10 h-10 object-contain" />
            <span className="text-2xl font-black bg-gradient-to-r from-[#C90D0C] to-[#ff4444] bg-clip-text text-transparent">
              STARCADE
            </span>
          </motion.div>

          <div className="hidden md:flex items-center gap-8">
            {["Features", "Games", "Community", "Docs"].map((link) => (
              <motion.a
                key={link}
                href="#"
                className="text-sm font-semibold text-gray-300 hover:text-[#C90D0C] transition-colors"
                whileHover={{ x: 2 }}
              >
                {link}
              </motion.a>
            ))}
          </div>

          <motion.a
            href="/login"
            className="px-6 py-2 bg-gradient-to-r from-[#C90D0C] to-[#a30b0b] rounded-lg font-bold text-sm uppercase tracking-wider"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Spawn In
          </motion.a>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <motion.section
        className="relative pt-32 pb-20 px-6 lg:px-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center space-y-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Badge */}
            <motion.div
              variants={itemVariants}
              className="inline-flex items-center gap-2 px-4 py-2 backdrop-blur-sm bg-white/10 rounded-full border border-[#C90D0C]/30"
            >
              <Flame size={16} className="text-[#C90D0C]" />
              <span className="text-xs font-bold uppercase tracking-wider">
                The Future of Game Making is Here
              </span>
            </motion.div>

            {/* Main Heading */}
            <motion.h1 variants={itemVariants} className="text-6xl md:text-8xl font-black leading-tight">
              <span className="bg-gradient-to-r from-[#C90D0C] via-[#ff4444] to-[#FFD700] bg-clip-text text-transparent">
                Drop Your Game Ideas.
              </span>
              <br />
              <span className="text-white">
                Let AI{" "}
                <span className="bg-gradient-to-r from-[#8B5CF6] to-[#C90D0C] bg-clip-text text-transparent">
                  Build the Hype.
                </span>
              </span>
            </motion.h1>

            {/* Subheading */}
            <motion.p
              variants={itemVariants}
              className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed"
            >
              No cap. No code. No limits. Create legendary retro games with AI magic, save them to your arcade library, and watch the world play your creations.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-4 justify-center pt-8"
            >
              <motion.button
                className="px-8 py-4 bg-gradient-to-r from-[#C90D0C] to-[#a30b0b] rounded-xl font-bold uppercase tracking-wider flex items-center justify-center gap-2"
                whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(201,13,12,0.6)" }}
                whileTap={{ scale: 0.95 }}
              >
                <Gamepad2 size={20} />
                Start Building
              </motion.button>
              <motion.button
                className="px-8 py-4 border-2 border-[#C90D0C] text-[#C90D0C] rounded-xl font-bold uppercase tracking-wider hover:bg-[#C90D0C]/10 transition-colors flex items-center justify-center gap-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Watch Demo
                <ArrowRight size={20} />
              </motion.button>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* Hero Animation / Image Placeholder */}
      <motion.section
        className="relative max-w-6xl mx-auto px-6 lg:px-8 pb-20"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <div className="relative rounded-3xl overflow-hidden border border-[#C90D0C]/30 backdrop-blur-sm bg-black/40">
          <div className="aspect-video bg-gradient-to-br from-[#C90D0C]/20 to-purple-600/20 flex items-center justify-center">
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="text-center space-y-4"
            >
              <Gamepad2 size={80} className="text-[#C90D0C] mx-auto" />
              <p className="text-gray-400 text-lg">Your Game Preview Here</p>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Features Section */}
      <motion.section className="relative py-20 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-5xl md:text-6xl font-black mb-4">
              Why Players Love <span className="text-[#C90D0C]">StarCade</span>
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              The sickest features that make game building actually fun
            </p>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-3 gap-6"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {[
              {
                icon: Sparkles,
                title: "AI Magic",
                desc: "Just describe what you want. Our AI builds it in seconds.",
                color: "from-[#C90D0C]",
              },
              {
                icon: Zap,
                title: "Lightning Fast",
                desc: "Deploy your games instantly. No waiting. No BS.",
                color: "from-[#FFD700]",
              },
              {
                icon: Star,
                title: "Retro Vibes",
                desc: "Arcade authenticity meets modern AI. Peak nostalgia.",
                color: "from-[#8B5CF6]",
              },
              {
                icon: Gamepad2,
                title: "Play Anywhere",
                desc: "Web-based games. Play on any device. Share with anyone.",
                color: "from-[#10B981]",
              },
              {
                icon: Flame,
                title: "Build Your Portfolio",
                desc: "Show off your creations. Get noticed. Become a dev.",
                color: "from-[#ff4444]",
              },
              {
                icon: ArrowRight,
                title: "Sell Your Games",
                desc: "Monetize your creations. Earn real money. Level up.",
                color: "from-[#06B6D4]",
              },
            ].map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={idx}
                  variants={itemVariants}
                  className="group relative"
                  onHoverStart={() => setHoveredCard(idx)}
                  onHoverEnd={() => setHoveredCard(null)}
                >
                  <motion.div
                    className="relative p-8 rounded-2xl backdrop-blur-sm bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 cursor-pointer overflow-hidden h-full"
                    whileHover={{
                      borderColor: "rgba(201,13,12,0.5)",
                      boxShadow: "0 0 30px rgba(201,13,12,0.2)",
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    {/* Glow effect on hover */}
                    {hoveredCard === idx && (
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-br from-[#C90D0C]/20 to-transparent opacity-0"
                        animate={{ opacity: [0, 1, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                    )}

                    <motion.div
                      className={`inline-flex p-3 rounded-lg bg-gradient-to-br ${feature.color} to-transparent mb-4`}
                      whileHover={{ scale: 1.1, rotate: 5 }}
                    >
                      <Icon size={24} className="text-white" />
                    </motion.div>

                    <h3 className="text-2xl font-bold mb-2 text-white">
                      {feature.title}
                    </h3>
                    <p className="text-gray-400 leading-relaxed">
                      {feature.desc}
                    </p>
                  </motion.div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </motion.section>

      {/* How It Works */}
      <motion.section className="relative py-20 px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-5xl md:text-6xl font-black mb-4">
              Three Moves. That's It.
            </h2>
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
                number: "01",
                title: "Drop Your Idea",
                desc: "Tell AI what game you want. Be specific or vague—it handles both.",
              },
              {
                number: "02",
                title: "Watch the Magic",
                desc: "AI builds your retro game in real-time. Sick animations included.",
              },
              {
                number: "03",
                title: "Publish & Flex",
                desc: "Save to library, share with friends, or publish to the world.",
              },
            ].map((step, idx) => (
              <motion.div
                key={idx}
                variants={itemVariants}
                className="relative group"
              >
                <motion.div
                  className="text-7xl font-black text-[#C90D0C]/20 mb-4 group-hover:text-[#C90D0C]/40 transition-colors"
                  whileHover={{ scale: 1.1 }}
                >
                  {step.number}
                </motion.div>
                <h3 className="text-2xl font-bold mb-3">{step.title}</h3>
                <p className="text-gray-400 leading-relaxed">{step.desc}</p>

                {idx < 2 && (
                  <motion.div
                    className="hidden md:block absolute -right-4 top-1/2 -translate-y-1/2 text-4xl text-[#C90D0C]/30"
                    animate={{ x: [0, 8, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    →
                  </motion.div>
                )}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* Stats Section */}
      <motion.section className="relative py-20 px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="grid md:grid-cols-4 gap-8 text-center"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {[
              { number: "10K+", label: "Games Built" },
              { number: "50M+", label: "Plays" },
              { number: "1M+", label: "Players" },
              { number: "99.9%", label: "Uptime" },
            ].map((stat, idx) => (
              <motion.div key={idx} variants={itemVariants}>
                <motion.div
                  className="text-5xl font-black text-[#C90D0C] mb-2"
                  whileInView={{ scale: [0.5, 1.1, 1] }}
                  transition={{ duration: 0.6 }}
                  viewport={{ once: true }}
                >
                  {stat.number}
                </motion.div>
                <p className="text-gray-400 font-semibold">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section className="relative py-20 px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <h2 className="text-5xl md:text-6xl font-black">
              Ready to Break the Gaming World?
            </h2>
            <p className="text-xl text-gray-300">
              Join thousands of creators already building and shipping games on StarCade.
            </p>
            <motion.button
              className="px-10 py-4 bg-gradient-to-r from-[#C90D0C] to-[#a30b0b] rounded-xl font-bold uppercase tracking-wider text-lg"
              whileHover={{ scale: 1.05, boxShadow: "0 0 40px rgba(201,13,12,0.6)" }}
              whileTap={{ scale: 0.95 }}
            >
              Start Building Now
            </motion.button>
          </motion.div>
        </div>
      </motion.section>

      {/* Footer */}
      <footer className="relative border-t border-[#C90D0C]/20 py-12 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            {[
              { title: "Product", links: ["Features", "Pricing", "Security", "Roadmap"] },
              { title: "Community", links: ["Discord", "Twitter", "GitHub", "Docs"] },
              { title: "Company", links: ["About", "Blog", "Careers", "Contact"] },
              { title: "Legal", links: ["Privacy", "Terms", "Cookies", "License"] },
            ].map((col, idx) => (
              <div key={idx}>
                <h4 className="font-bold mb-4">{col.title}</h4>
                <ul className="space-y-2">
                  {col.links.map((link) => (
                    <li key={link}>
                      <a href="#" className="text-gray-400 hover:text-[#C90D0C] transition-colors">
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="border-t border-[#C90D0C]/10 pt-8 flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <img src="/logo.svg" alt="StarCade" className="w-8 h-8" />
              <span className="font-bold">© 2025 StarCade. All rights reserved.</span>
            </div>
            <div className="flex gap-6">
              {["Twitter", "Discord", "GitHub"].map((social) => (
                <a
                  key={social}
                  href="#"
                  className="text-gray-400 hover:text-[#C90D0C] transition-colors text-sm"
                >
                  {social}
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>

      <style jsx>{`
        @keyframes pulse {
          0%, 100% {
            opacity: 0.5;
            transform: scale(1);
          }
          50% {
            opacity: 0.8;
            transform: scale(1.1);
          }
        }
      `}</style>
    </div>
  );
}
