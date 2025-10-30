import "./globals.css";
import { Karantina } from "next/font/google";

const karantina = Karantina({ subsets: ["latin"], weight: ["400", "700"] });

export const metadata = {
  title: "StarCade AI",
  description: "AI-powered game generation by StarCade Studios",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={karantina.className}>
      <body>{children}</body>
    </html>
  );
}
