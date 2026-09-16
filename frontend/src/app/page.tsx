"use client";

import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

const queryStr = `
  query SearchPokemon($query: String!) {
    search_pokemon(query: $query) {
      id
      name
      image_url
    }
  }
`;

function getMockTypes(id: number) {
  const types = ["FIRE", "WATER", "GRASS", "ELECTRIC"];
  return [types[id % types.length], types[(id + 1) % types.length]];
}

interface PokemonItem {
  id: number;
  name: string;
  image_url: string;
}

export default function ArcadeDex() {
  const [data, setData] = useState<{search_pokemon: PokemonItem[]} | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("ALL");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    setLoading(true);
    fetch(process.env.NEXT_PUBLIC_GRAPHQL_URL || "http://localhost:8000/graphql", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query: queryStr, variables: { query: debouncedSearch } }),
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
  }, [debouncedSearch]);

  const filters = ["ALL", "FIRE", "WATER", "GRASS", "ELECTRIC"];

  let filteredPokemon = data?.search_pokemon || [];

  if (activeFilter !== "ALL") {
    filteredPokemon = filteredPokemon.filter((p: PokemonItem) =>
      getMockTypes(p.id).includes(activeFilter)
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground p-6 pt-12 pb-32">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-black uppercase tracking-wider text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">
          Poke Dex
        </h1>
        <div className="bg-primary/20 text-primary px-3 py-1 rounded-full text-xs font-bold neon-border-red">
          {filteredPokemon.length} Found
        </div>
      </div>

      <div className="relative mb-6 group">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-muted-foreground group-focus-within:text-primary transition-colors">
          <Search className="w-5 h-5" />
        </div>
        <input
          type="text"
          className="w-full bg-input/50 border border-border/50 text-white text-sm rounded-xl focus:ring-primary focus:border-primary block pl-10 p-3 transition-all outline-none group-focus-within:neon-border-red"
          placeholder="Search fictional buddy..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="flex gap-2 overflow-x-auto pb-4 no-scrollbar mb-4 -mx-2 px-2">
        {filters.map((filter) => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-bold transition-all duration-300 border ${
              activeFilter === filter
                ? "bg-primary text-white neon-border-red scale-105"
                : "bg-card text-muted-foreground border-border hover:border-primary/50"
            }`}
          >
            {filter === "ALL" && filter}
            {filter !== "ALL" && (
              <span className="flex items-center gap-1.5">
                <span
                  className={`w-2 h-2 rounded-full ${
                    filter === "FIRE"
                      ? "bg-arcade-red shadow-[0_0_5px_var(--arcade-red)]"
                      : filter === "WATER"
                      ? "bg-arcade-blue shadow-[0_0_5px_var(--arcade-blue)]"
                      : filter === "GRASS"
                      ? "bg-arcade-green shadow-[0_0_5px_var(--arcade-green)]"
                      : "bg-arcade-yellow shadow-[0_0_5px_var(--arcade-yellow)]"
                  }`}
                />
                {filter}
              </span>
            )}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-4">
        {loading && <div className="text-center text-primary py-10 animate-pulse">LOADING...</div>}
        {error && (
          <div className="text-destructive font-bold p-6 bg-red-900/20 rounded-xl border border-red-500 text-center">
            <p className="text-lg mb-2">SYSTEM ERROR: NO CONNECTION</p>
            <p className="text-xs text-muted-foreground break-all">
              Failed to connect to: {process.env.NEXT_PUBLIC_GRAPHQL_URL || "http://localhost:8000/graphql"}
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              If you are on Vercel, ensure NEXT_PUBLIC_GRAPHQL_URL is set in your Environment Variables.
            </p>
          </div>
        )}
        
        {filteredPokemon.map((pokemon: PokemonItem, index: number) => {
          const types = getMockTypes(pokemon.id);
          const primaryType = types[0];
          const borderClass =
            primaryType === "FIRE"
              ? "group-hover:neon-border-red"
              : primaryType === "WATER"
              ? "group-hover:neon-border-blue"
              : primaryType === "GRASS"
              ? "group-hover:neon-border-green"
              : "group-hover:neon-border-yellow";

          return (
            <Link key={pokemon.id} href={`/pokemon/${pokemon.name}`}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`group bg-card rounded-2xl p-4 flex items-center gap-4 border border-border/50 transition-all duration-300 cursor-pointer ${borderClass}`}
              >
                <div className={`w-20 h-20 rounded-xl flex items-center justify-center bg-background p-2 transition-all duration-300 border-2 border-transparent ${borderClass}`}>
                  <img
                    src={pokemon.image_url || `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png`}
                    alt={pokemon.name}
                    className="w-full h-full object-contain pixelated"
                    style={{ imageRendering: "pixelated" }}
                  />
                </div>
                <div className="flex-1">
                  <div className="text-muted-foreground text-xs font-bold mb-1">
                    #{pokemon.id.toString().padStart(3, "0")}
                  </div>
                  <h3 className="text-xl font-bold text-white capitalize mb-2">
                    {pokemon.name}
                  </h3>
                  <div className="flex gap-2">
                    {types.map((type, i) => (
                      <span
                        key={i}
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full border flex items-center gap-1 ${
                          type === "FIRE"
                            ? "border-arcade-red text-arcade-red"
                            : type === "WATER"
                            ? "border-arcade-blue text-arcade-blue"
                            : type === "GRASS"
                            ? "border-arcade-green text-arcade-green"
                            : "border-arcade-yellow text-arcade-yellow"
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            type === "FIRE"
                              ? "bg-arcade-red"
                              : type === "WATER"
                              ? "bg-arcade-blue"
                              : type === "GRASS"
                              ? "bg-arcade-green"
                              : "bg-arcade-yellow"
                          }`}
                        />
                        {type}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
