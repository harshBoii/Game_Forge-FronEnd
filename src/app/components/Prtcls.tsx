"use client";
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";
import { useCallback } from "react";

export default function ArcadeParticles() {
  const initParticles = useCallback(async (engine: any) => {
    await loadFull(engine);
  }, []);

  return (
    <Particles
      id="tsparticles"
      init={initParticles}
      options={{
        fullScreen: { enable: true, zIndex: -1 },
        background: { color: "#0b0b0b" },
        fpsLimit: 60,
        interactivity: {
          events: { onHover: { enable: true, mode: "repulse" }, resize: true },
          modes: { repulse: { distance: 100, duration: 0.4 } },
        },
        particles: {
          color: { value: ["#ff0000", "#ffdd00"] },
          links: {
            color: "#ff0000",
            distance: 150,
            enable: true,
            opacity: 0.25,
            width: 1,
          },
          move: { enable: true, speed: 1.2, outModes: "bounce" },
          number: { value: 40, density: { enable: true, area: 800 } },
          opacity: { value: 0.6 },
          shape: { type: "circle" },
          size: { value: { min: 1, max: 3 } },
        },
        detectRetina: true,
      }}
    />
  );
}
