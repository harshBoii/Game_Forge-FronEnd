import "./globals.css";
import { Inter } from 'next/font/google'

export const metadata = {
  title: "GameForge AI 🎮",
  description: "AI-Powered Arcade Game Builder by Harsh",
};

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans">{children}</body>
    </html>
  )
}
