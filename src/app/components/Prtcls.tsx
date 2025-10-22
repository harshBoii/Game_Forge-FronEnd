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
      className="absolute inset-0"
      options={{
        fullScreen: { 
          enable: false,
          zIndex: 1
        },
        background: { 
          color: "transparent" 
        },
        fpsLimit: 120,
        interactivity: {
          events: { 
            onHover: { 
              enable: true, 
              mode: "grab" 
            },
            resize: true 
          },
          modes: { 
            grab: { 
              distance: 140, 
              links: { 
                opacity: 0.6,
                color: "#4ecdc4"
              } 
            } 
          },
        },
        particles: {
          color: { 
            value: ["#f7086d", "#4ecdc4", "#fc946c"] 
          },
          links: {
            color: "#4ecdc4",
            distance: 150,
            enable: true,
            opacity: 0.2,
            width: 1.5,
          },
          move: { 
            enable: true, 
            speed: 1, 
            direction: "none",
            outModes: "out",
            random: true,
            straight: false,
          },
          number: { 
            value: 80, 
            density: { 
              enable: true, 
              area: 800 
            } 
          },
          opacity: { 
            value: 0.5,
            random: true,
            animation: {
              enable: true,
              speed: 0.5,
              minimumValue: 0.1,
              sync: false
            }
          },
          shape: { 
            type: "circle" 
          },
          size: { 
            value: { min: 1, max: 3 },
            random: true,
            animation: {
              enable: true,
              speed: 2,
              minimumValue: 0.5,
              sync: false
            }
          },
        },
        detectRetina: true,
      }}
    />
  );
}
