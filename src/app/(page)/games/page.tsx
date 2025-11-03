"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play,
  Trash2,
  Lock,
  Globe,
  Calendar,
  Search,
  Grid3x3,
  List,
  X,
  Menu,
  Sparkles,
  LogOut,
  User,
  BrainCircuit,
  Gamepad2,
  Compass,
  Loader2,
} from "lucide-react";
import { useRouter } from "next/navigation";

interface Game {
  id: string;
  title: string;
  html: string;
  status: "PUBLIC" | "PRIVATE";
  createdAt: string;
  updatedAt: string;
}

export default function GamesPage() {
  const router = useRouter();
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<"ALL" | "PUBLIC" | "PRIVATE">("ALL");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [playingGame, setPlayingGame] = useState<Game | null>(null);
  const [notification, setNotification] = useState<string | null>(null);

  const menuItems = [
    { label: "AI Builder", icon: BrainCircuit, path: "/" },
    { label: "My Games", icon: Gamepad2, path: "/games" },
    { label: "Explore", icon: Compass, path: "/explore" },
  ];

  useEffect(() => {
    setIsClient(true);
    if (typeof window !== "undefined") {
      setIsMobile(window.innerWidth < 768);
      const handleResize = () => setIsMobile(window.innerWidth < 768);
      window.addEventListener("resize", handleResize);

      try {
        const userStr = localStorage.getItem("user");
        if (userStr) {
          setUser(JSON.parse(userStr));
        } else {
          router.push("/auth");
        }
      } catch (error) {
        console.warn("Failed to parse user from localStorage");
        router.push("/auth");
      }

      return () => window.removeEventListener("resize", handleResize);
    }
  }, [router]);

  useEffect(() => {
    if (user) {
      fetchGames();
    }
  }, [user]);

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  async function fetchGames() {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found");
        router.push("/auth");
        return;
      }

      const response = await fetch("/api/games/list", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (response.ok) {
        setGames(data.games);
      } else {
        console.error("Failed to fetch games:", data.message);
        setNotification("❌ Failed to load games");
      }
    } catch (error) {
      console.error("Fetch error:", error);
      setNotification("❌ Connection error");
    } finally {
      setLoading(false);
    }
  }

  async function handleDeleteGame(gameId: string) {
    if (!confirm("Are you sure you want to delete this game?")) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`/api/games/${gameId}/delete`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setGames(games.filter((g) => g.id !== gameId));
        setNotification("✅ Game deleted successfully");
      } else {
        setNotification("❌ Failed to delete game");
      }
    } catch (error) {
      console.error("Delete error:", error);
      setNotification("❌ Failed to delete game");
    }
  }

  async function toggleGameStatus(gameId: string, currentStatus: string) {
    const newStatus = currentStatus === "PUBLIC" ? "PRIVATE" : "PUBLIC";

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`/api/games/${gameId}/update`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        setGames(
          games.map((g) =>
            g.id === gameId ? { ...g, status: newStatus as any } : g
          )
        );
        setNotification(`✅ Game is now ${newStatus.toLowerCase()}`);
      } else {
        setNotification("❌ Failed to update game");
      }
    } catch (error) {
      console.error("Update error:", error);
      setNotification("❌ Failed to update game");
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/auth");
  };

  const filteredGames = games.filter((game) => {
    const matchesSearch = game.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesFilter =
      filterStatus === "ALL" || game.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  return (
    <motion.div
      className="flex flex-col h-screen bg-gradient-to-br from-[#0a0a0a] via-[#111] to-[#0a0a0a] text-white overflow-hidden relative"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      {/* Background gradients */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-0 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-0 right-1/4 w-80 h-80 bg-red-600/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.15, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{ duration: 12, repeat: Infinity }}
        />
      </div>

      {/* NAVBAR */}
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
              <span className="hidden sm:inline text-sm font-medium">Logout</span>
            </motion.button>
          </div>
        </div>
      </motion.nav>

      {/* MAIN LAYOUT */}
      <div className="flex flex-1 overflow-hidden relative z-10">
        {/* SIDEBAR */}
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

                <ul className="space-y-2">
                  {menuItems.map(({ label, icon: Icon, path }) => {
                    const isActive = path === "/games";
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
                              isActive ? "text-white" : "group-hover:text-white"
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
                      <span className="text-sm font-bold truncate">{user.name}</span>
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

        {/* MAIN CONTENT */}
        <div className="flex-1 overflow-y-auto bg-black/20 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto p-6 md:p-8">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <h1 className="text-4xl md:text-5xl font-black mb-3 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                My Game Library
              </h1>
              <p className="text-gray-400 text-lg">
                {games.length} {games.length === 1 ? "game" : "games"} created
              </p>
            </motion.div>

            {/* Controls Bar */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="flex flex-col md:flex-row gap-4 mb-8 items-start md:items-center justify-between"
            >
              {/* Search */}
              <div className="relative flex-1 max-w-md w-full">
                <Search
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  size={20}
                />
                <input
                  type="text"
                  placeholder="Search games..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-gray-500 outline-none focus:border-[var(--color-primary)] transition-colors"
                />
              </div>

              {/* Filters & View Toggle */}
              <div className="flex items-center gap-3 w-full md:w-auto">
                {/* Status Filter */}
                <div className="flex items-center gap-2 bg-white/5 rounded-xl p-1 border border-white/10 flex-1 md:flex-none">
                  {["ALL", "PUBLIC", "PRIVATE"].map((status) => (
                    <motion.button
                      key={status}
                      onClick={() => setFilterStatus(status as any)}
                      className={`px-3 md:px-4 py-2 rounded-lg text-xs md:text-sm font-medium transition-colors flex-1 md:flex-none ${
                        filterStatus === status
                          ? "bg-[var(--color-primary)] text-white"
                          : "text-gray-400 hover:text-white"
                      }`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {status}
                    </motion.button>
                  ))}
                </div>

                {/* View Mode Toggle */}
                <div className="flex items-center gap-1 bg-white/5 rounded-xl p-1 border border-white/10">
                  <motion.button
                    onClick={() => setViewMode("grid")}
                    className={`p-2 rounded-lg ${
                      viewMode === "grid"
                        ? "bg-[var(--color-primary)] text-white"
                        : "text-gray-400 hover:text-white"
                    }`}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Grid3x3 size={18} />
                  </motion.button>
                  <motion.button
                    onClick={() => setViewMode("list")}
                    className={`p-2 rounded-lg ${
                      viewMode === "list"
                        ? "bg-[var(--color-primary)] text-white"
                        : "text-gray-400 hover:text-white"
                    }`}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <List size={18} />
                  </motion.button>
                </div>
              </div>
            </motion.div>

            {/* Loading State */}
            {loading && (
              <div className="flex flex-col items-center justify-center py-20">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                  <Loader2 size={48} className="text-[var(--color-primary)]" />
                </motion.div>
                <p className="text-gray-400 mt-4">Loading your games...</p>
              </div>
            )}

            {/* Empty State */}
            {!loading && filteredGames.length === 0 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center py-20 text-center"
              >
                <div className="w-32 h-32 rounded-full bg-white/5 flex items-center justify-center mb-6">
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Gamepad2 size={48} className="text-gray-600" />
                  </motion.div>
                </div>
                <h3 className="text-2xl font-bold mb-2 text-gray-300">
                  No games found
                </h3>
                <p className="text-gray-500 mb-6">
                  {searchQuery
                    ? "Try adjusting your search or filters"
                    : "Create your first game to get started"}
                </p>
                <motion.button
                  onClick={() => router.push("/")}
                  className="px-6 py-3 bg-[var(--color-primary)] text-white font-bold rounded-xl hover:bg-[var(--color-primary)]/80 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Create Game
                </motion.button>
              </motion.div>
            )}

            {/* Games Grid/List */}
            {!loading && filteredGames.length > 0 && (
              <motion.div
                layout
                className={
                  viewMode === "grid"
                    ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                    : "flex flex-col gap-4"
                }
              >
                <AnimatePresence mode="popLayout">
                  {filteredGames.map((game, index) => (
                    <motion.div
                      key={game.id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ delay: index * 0.05 }}
                      className={`group relative backdrop-blur-sm bg-gradient-to-br from-white/10 to-white/5 rounded-2xl overflow-hidden border border-white/10 hover:border-[var(--color-primary)]/50 transition-all ${
                        viewMode === "list" ? "flex items-center" : ""
                      }`}
                      whileHover={{ y: -4, scale: 1.02 }}
                    >
                      {/* Game Thumbnail */}
                      <div
                        className={`relative ${
                          viewMode === "grid"
                            ? "h-48 w-full"
                            : "w-32 h-32 flex-shrink-0"
                        } bg-gradient-to-br from-purple-600/20 to-red-600/20 flex items-center justify-center overflow-hidden`}
                      >
                        <motion.div
                          className="absolute inset-0 bg-[var(--color-primary)]/10"
                          animate={{
                            scale: [1, 1.2, 1],
                            opacity: [0.5, 0.8, 0.5],
                          }}
                          transition={{ duration: 3, repeat: Infinity }}
                        />
                        <Gamepad2 size={48} className="text-white/40 relative z-10" />

                        {/* Status Badge */}
                        <div className="absolute top-3 right-3 z-20">
                          <motion.button
                            onClick={() => toggleGameStatus(game.id, game.status)}
                            className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold backdrop-blur-sm ${
                              game.status === "PUBLIC"
                                ? "bg-green-500/80 text-white"
                                : "bg-gray-700/80 text-gray-300"
                            }`}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            {game.status === "PUBLIC" ? (
                              <Globe size={12} />
                            ) : (
                              <Lock size={12} />
                            )}
                            {game.status}
                          </motion.button>
                        </div>
                      </div>

                      {/* Game Info */}
                      <div className={`p-4 ${viewMode === "list" ? "flex-1" : ""}`}>
                        <h3 className="text-lg font-bold mb-2 text-white group-hover:text-[var(--color-primary)] transition-colors line-clamp-1">
                          {game.title}
                        </h3>

                        <div className="flex items-center gap-2 text-xs text-gray-400 mb-4">
                          <Calendar size={14} />
                          <span>
                            {new Date(game.createdAt).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </span>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2">
                          <motion.button
                            onClick={() => setPlayingGame(game)}
                            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-[var(--color-primary)] text-white rounded-lg font-medium hover:bg-[var(--color-primary)]/80 transition-colors"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <Play size={16} />
                            Play
                          </motion.button>

                          <motion.button
                            onClick={() => handleDeleteGame(game.id)}
                            className="p-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <Trash2 size={16} />
                          </motion.button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* PLAY GAME MODAL */}
      <AnimatePresence>
        {playingGame && (
          <motion.div
            className="fixed inset-0 bg-black/95 backdrop-blur-sm flex justify-center items-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setPlayingGame(null)}
          >
            <motion.div
              className="relative w-full max-w-6xl max-h-[90vh] overflow-hidden backdrop-blur-sm bg-black/60 rounded-3xl shadow-2xl"
              style={{
                border: "2px solid var(--color-primary)",
              }}
              initial={{ scale: 0.8, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 50 }}
              transition={{ type: "spring", damping: 25 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-white/10">
                <div className="flex items-center gap-4">
                  <Play size={24} className="text-[var(--color-primary)]" />
                  <h2 className="text-2xl font-bold">{playingGame.title}</h2>
                </div>
                <motion.button
                  onClick={() => setPlayingGame(null)}
                  className="p-2 rounded-lg bg-white/10 hover:bg-red-500/20 transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <X size={24} />
                </motion.button>
              </div>

              {/* Game iframe */}
              <div className="p-6">
                <iframe
                  srcDoc={playingGame.html}
                  className="w-full h-[70vh] rounded-lg"
                  title={playingGame.title}
                  style={{
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                  }}
                />
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
