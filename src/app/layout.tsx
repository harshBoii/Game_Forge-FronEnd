import "./globals.css";

export const metadata = {
  title: "GameForge AI 🎮",
  description: "AI-Powered Arcade Game Builder by Harsh",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
