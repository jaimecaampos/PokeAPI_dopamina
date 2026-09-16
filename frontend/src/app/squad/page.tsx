"use client";

import { useState, useEffect } from "react";
import { Plus, X } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

const GET_ROSTER = `
  query GetRoster {
    getRoster {
      pokemonId
      name
      imageUrl
      nickname
    }
  }
`;

function getMockTypes(id: number) {
  const types = ["FIRE", "WATER", "GRASS", "ELECTRIC"];
  return [types[id % types.length], types[(id + 1) % types.length]];
}

interface RosterItem {
  pokemonId: number;
  name: string;
  imageUrl: string;
  nickname: string | null;
}

export default function MySquad() {
  const [data, setData] = useState<{getRoster: RosterItem[]} | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch(process.env.NEXT_PUBLIC_GRAPHQL_URL || "http://localhost:8000/graphql", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query: GET_ROSTER }),
    })
      .then((res) => res.json())
      .then((res) => {
        setData(res.data);
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  }, []);

  const roster = data?.getRoster || [];
  const maxSquadSize = 6;
  const emptySlots = Math.max(0, maxSquadSize - roster.length);

  return (
    <div className="min-h-screen bg-background text-foreground p-6 pt-12 pb-32">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-black uppercase tracking-wider text-white">
          My Squad
        </h1>
        <div className="border border-arcade-red text-arcade-red px-3 py-1 rounded-full text-xs font-bold">
          Active ({roster.length}/{maxSquadSize})
        </div>
      </div>
      
      <p className="text-muted-foreground text-sm mb-8 leading-relaxed">
        Assemble your prime squad of mystical companions to boost attributes during tournament battles.
      </p>

      <div className="flex flex-col gap-4">
        {loading && <div className="text-center text-primary animate-pulse py-10">LOADING SQUAD...</div>}
        {error && <div className="text-destructive">Error loading squad.</div>}
        
        {/* Filled Slots */}
        {roster.map((item: RosterItem, index: number) => {
          const types = getMockTypes(item.pokemonId);
          const primaryType = types[0];
          const borderClass =
            primaryType === "FIRE" ? "neon-border-red" : primaryType === "WATER" ? "neon-border-blue" : primaryType === "GRASS" ? "neon-border-green" : "neon-border-yellow";

          return (
            <motion.div
              key={item.pokemonId + index}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className={`bg-card rounded-2xl p-4 flex items-center justify-between border ${borderClass} shadow-lg`}
            >
              <div className="flex items-center gap-4">
                <div className={`w-16 h-16 rounded-xl flex items-center justify-center bg-background border border-border/50`}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.imageUrl || `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${item.pokemonId}.png`}
                    alt={item.name}
                    className="w-full h-full object-contain pixelated"
                    style={{ imageRendering: "pixelated" }}
                  />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white capitalize mb-1">
                    {item.name}
                  </h3>
                  <div className="flex gap-2">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border flex items-center gap-1 ${
                        primaryType === "FIRE" ? "border-arcade-red text-arcade-red" : primaryType === "WATER" ? "border-arcade-blue text-arcade-blue" : primaryType === "GRASS" ? "border-arcade-green text-arcade-green" : "border-arcade-yellow text-arcade-yellow"
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${
                          primaryType === "FIRE" ? "bg-arcade-red" : primaryType === "WATER" ? "bg-arcade-blue" : primaryType === "GRASS" ? "bg-arcade-green" : "bg-arcade-yellow"
                      }`} />
                      {primaryType}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col items-end gap-3">
                <div className="text-muted-foreground text-xs font-bold">
                  #{item.pokemonId.toString().padStart(3, "0")}
                </div>
                <button className="w-6 h-6 rounded-full bg-input flex items-center justify-center text-muted-foreground hover:bg-destructive hover:text-white transition-colors">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </motion.div>
          );
        })}

        {/* Empty Slots */}
        {!loading && Array.from({ length: emptySlots }).map((_, index) => (
          <Link key={`empty-${index}`} href="/">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: (roster.length + index) * 0.1 }}
              className="border-2 border-dashed border-border/60 rounded-2xl p-6 flex items-center justify-center gap-2 text-muted-foreground hover:text-primary hover:border-primary/50 transition-all cursor-pointer group"
            >
              <Plus className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <span className="font-bold text-sm">Assign Faction Buddy</span>
            </motion.div>
          </Link>
        ))}
      </div>
    </div>
  );
}
