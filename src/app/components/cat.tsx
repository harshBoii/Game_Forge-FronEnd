"use client";
import { DotLottiePlayer } from "@dotlottie/react-player";

export default function MyLottie() {
  return (
    <div style={{ height: "25vh", width: "15vw", marginBottom: "-5.9vh" }}>
      <DotLottiePlayer
        src="https://lottie.host/c3e06dfa-cc75-4bbd-a7e0-4155d5d36b6c/djKOati6RO.lottie"
        autoplay
        loop
      />
    </div>
  );
}
