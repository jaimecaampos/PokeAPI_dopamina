import type { Metadata } from "next";
import { VT323 } from "next/font/google";
import "./globals.css";
import BottomNav from "@/components/BottomNav";

const retroFont = VT323({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Poke Dex",
  description: "Explore your mystical companions.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`dark ${retroFont.variable}`}>
      <body className="antialiased min-h-screen bg-background text-foreground pb-20 selection:bg-primary selection:text-primary-foreground">
        <div className="max-w-md mx-auto min-h-screen relative shadow-2xl bg-card border-x border-border/50 overflow-x-hidden">
          {children}
          <BottomNav />
        </div>
      </body>
    </html>
  );
}
