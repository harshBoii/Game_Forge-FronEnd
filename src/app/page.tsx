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
      <main className="min-h-screen bg-arcade-black flex items-center justify-center relative">
        <div className="z-10 flex flex-col items-center justify-center">
          <GameConsole />
        </div>
      </main>
    </>
  );
}
