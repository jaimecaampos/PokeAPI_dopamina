"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, Users, UserRound } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export default function BottomNav() {
  const pathname = usePathname();

  const navItems = [
    { name: "Dex", href: "/", icon: Search },
    { name: "My Team", href: "/squad", icon: Users },
    { name: "Trainer", href: "/trainer", icon: UserRound },
  ];

  return (
    <div className="fixed bottom-0 w-full max-w-md mx-auto bg-background/80 backdrop-blur-xl border-t border-border/40 z-50">
      <nav className="flex justify-around items-center h-20 px-4">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.name}
              href={item.href}
              className="relative flex flex-col items-center justify-center w-full h-full text-xs font-medium"
            >
              <div
                className={cn(
                  "flex flex-col items-center justify-center transition-all duration-300",
                  isActive ? "text-primary scale-110" : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Icon
                  strokeWidth={isActive ? 2.5 : 2}
                  className={cn("w-6 h-6 mb-1 transition-all duration-300", isActive && "drop-shadow-[0_0_8px_rgba(255,75,75,0.8)]")}
                />
                <span>{item.name}</span>
              </div>
              
              {/* Retro Selection Indicator */}
              {isActive && (
                <motion.div
                  layoutId="bottom-nav-indicator"
                  className="absolute bottom-2 w-1.5 h-1.5 bg-primary rounded-full shadow-[0_0_10px_rgba(255,75,75,1)]"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{
                    type: "spring",
                    stiffness: 500,
                    damping: 30,
                  }}
                />
              )}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
