"use client";
import dynamic from "next/dynamic";
import { Suspense } from "react";
import GameConsole from "./components/GameConsole";

const ArcadeParticles = dynamic(() => import("./components/Prtcls"), {
  ssr: false,
});

export default function Page() {
  return (
    <>
      <Suspense fallback={null}>
        <ArcadeParticles />
      </Suspense>
      <main className="min-h-screen relative overflow-hidden">
        {/* Gradient Background */}
        <div className="absolute inset-0 bg-linear-to-br from-squid-dark via-[#1a1625] to-[#0f1419]" />
        
        {/* Ambient Effects */}
        <div className="absolute top-20 -left-40 w-[500px] h-[500px] bg-squid-pink/5 rounded-full blur-[100px]" />
        <div className="absolute bottom-20 -right-40 w-[500px] h-[500px] bg-squid-teal/5 rounded-full blur-[100px]" />
        
        {/* Content */}
        <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-12">
          <GameConsole />
        </div>
      </main>
    </>
  );
}
