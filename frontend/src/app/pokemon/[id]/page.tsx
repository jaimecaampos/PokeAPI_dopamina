"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Heart } from "lucide-react";
import { motion } from "framer-motion";

const GET_POKEMON_DETAIL = `
  query GetPokemonDetail($name: String!) {
    getPokemonDetail(name: $name) {
      id
      name
      imageUrl
      height
      weight
      description
    }
  }
`;

const SAVE_TO_ROSTER = `
  mutation SaveToRoster($pokemonId: Int!, $name: String!, $imageUrl: String!, $nickname: String) {
    saveToRoster(pokemonId: $pokemonId, name: $name, imageUrl: $imageUrl, nickname: $nickname) {
      pokemonId
      name
      nickname
    }
  }
`;

// Deterministic mocks
function getMockTypes(id: number) {
  const types = ["FIRE", "WATER", "GRASS", "ELECTRIC"];
  return [types[id % types.length], types[(id + 1) % types.length]];
}
function getMockStats(id: number) {
  return {
    hp: 40 + (id * 7) % 80,
    atk: 50 + (id * 13) % 90,
    def: 30 + (id * 11) % 70,
    spd: 60 + (id * 17) % 90,
  };
}
function getStatColor(stat: string) {
  switch (stat) {
    case 'hp': return 'bg-arcade-red';
    case 'atk': return 'bg-arcade-yellow';
    case 'def': return 'bg-arcade-blue';
    case 'spd': return 'bg-arcade-green';
    default: return 'bg-primary';
  }
}

interface PokemonDetail {
  id: number;
  name: string;
  imageUrl: string;
  height: number;
  weight: number;
  description: string;
}

export default function PokemonDetailComponent() {
  const params = useParams();
  const router = useRouter();
  const pokemonName = params.id as string; // from the URL path parameter

  const [data, setData] = useState<{getPokemonDetail: PokemonDetail} | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [saving, setSaving] = useState(false);
  const [nickname, setNickname] = useState("");

  useEffect(() => {
    if (!pokemonName) return;
    
    fetch(process.env.NEXT_PUBLIC_GRAPHQL_URL || "http://localhost:8000/graphql", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query: GET_POKEMON_DETAIL, variables: { name: pokemonName } }),
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
  }, [pokemonName]);

  const handleSave = () => {
    if (!data?.getPokemonDetail) return;
    setSaving(true);
    fetch(process.env.NEXT_PUBLIC_GRAPHQL_URL || "http://localhost:8000/graphql", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        query: SAVE_TO_ROSTER, 
        variables: { 
          pokemonId: data.getPokemonDetail.id,
          name: data.getPokemonDetail.name,
          imageUrl: data.getPokemonDetail.imageUrl,
          nickname: nickname.trim() || null
        } 
      }),
    })
      .then((res) => res.json())
      .then(() => {
        setSaving(false);
        router.push("/squad");
      })
      .catch(() => {
        setSaving(false);
      });
  };

  if (loading) return <div className="min-h-screen p-6 text-primary flex items-center justify-center animate-pulse font-bold text-2xl">LOADING DATA...</div>;
  if (error || !data?.getPokemonDetail) return <div className="min-h-screen p-6 text-destructive">Error loading detail.</div>;

  const pokemon = data.getPokemonDetail;
  const types = getMockTypes(pokemon.id);
  const stats = getMockStats(pokemon.id);
  const primaryType = types[0];

  return (
    <div className="min-h-screen bg-background text-foreground pb-24">
      {/* Header section with gradient */}
      <div className="relative pt-12 px-6 pb-8 overflow-hidden rounded-b-[40px] shadow-2xl">
        {/* Dynamic Background based on type */}
        <div 
          className="absolute inset-0 opacity-40"
          style={{
            background: `radial-gradient(circle at center, var(--arcade-${primaryType.toLowerCase()}) 0%, transparent 70%)`
          }}
        />
        
        {/* Top bar */}
        <div className="relative z-10 flex justify-between items-center mb-8">
          <button onClick={() => router.back()} className="text-white hover:text-primary transition-colors">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div className="text-white font-mono tracking-widest text-sm font-bold">
            NO. {pokemon.id.toString().padStart(3, "0")}
          </div>
          <button onClick={handleSave} className="text-white hover:text-arcade-red transition-colors">
            <Heart className="w-6 h-6" />
          </button>
        </div>

        {/* Pokemon Image with bounce animation */}
        <motion.div 
          className="relative z-10 flex justify-center h-48 mb-4"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", bounce: 0.5 }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img 
            src={pokemon.imageUrl || `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png`} 
            alt={pokemon.name} 
            className="h-full object-contain drop-shadow-[0_0_15px_rgba(255,255,255,0.3)] pixelated"
            style={{ imageRendering: "pixelated" }}
          />
        </motion.div>
      </div>

      {/* Info Section */}
      <div className="px-6 py-8">
        <h1 className="text-4xl font-black text-white capitalize mb-4">{pokemon.name}</h1>
        
        <div className="flex gap-2 mb-4 items-center">
          {types.map((type, i) => (
            <span
              key={i}
              className={`text-xs font-bold px-3 py-1 rounded-full border flex items-center gap-1.5 ${
                type === "FIRE" ? "border-arcade-red text-arcade-red" : type === "WATER" ? "border-arcade-blue text-arcade-blue" : type === "GRASS" ? "border-arcade-green text-arcade-green" : "border-arcade-yellow text-arcade-yellow"
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${
                  type === "FIRE" ? "bg-arcade-red" : type === "WATER" ? "bg-arcade-blue" : type === "GRASS" ? "bg-arcade-green" : "bg-arcade-yellow"
              }`} />
              {type}
            </span>
          ))}
          <span className="text-muted-foreground text-sm ml-2">Mystical Creature</span>
        </div>

        <p className="text-muted-foreground text-sm mb-6 leading-relaxed">
          {pokemon.description || "A mysterious entity from the arcade realm."}
        </p>

        {/* Height and Weight Cards */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-card border border-border/50 rounded-2xl p-4 text-center">
            <div className="text-xl font-bold text-white mb-1">{pokemon.height / 10} M</div>
            <div className="text-xs text-muted-foreground uppercase font-bold">Height</div>
          </div>
          <div className="bg-card border border-border/50 rounded-2xl p-4 text-center">
            <div className="text-xl font-bold text-white mb-1">{pokemon.weight / 10} KG</div>
            <div className="text-xs text-muted-foreground uppercase font-bold">Weight</div>
          </div>
        </div>

        {/* Base Combat Stats */}
        <h2 className="text-sm font-bold text-white mb-4 tracking-widest uppercase">Base Combat Stats</h2>
        <div className="space-y-4 mb-8">
          {Object.entries(stats).map(([stat, value]) => (
            <div key={stat} className="flex items-center gap-4">
              <div className="w-10 text-xs font-bold text-muted-foreground uppercase">{stat}</div>
              <div className="w-8 text-sm font-bold text-white text-right">{value}</div>
              <div className="flex-1 h-2.5 bg-input rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(100, (value as number) / 1.5)}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className={`h-full rounded-full ${getStatColor(stat)}`} 
                />
              </div>
            </div>
          ))}
        </div>

        {/* Nickname Input */}
        <div className="mb-6">
          <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest block mb-2">
            Assign Nickname (Optional)
          </label>
          <input 
            type="text"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            placeholder="e.g. Sparky"
            maxLength={20}
            className="w-full bg-input/50 border border-border/50 text-white text-sm rounded-xl focus:ring-primary focus:border-primary block p-4 transition-all outline-none"
          />
        </div>

        {/* Assign Button */}
        <button 
          onClick={handleSave}
          disabled={saving}
          className="w-full bg-arcade-red text-white font-black py-4 rounded-xl uppercase tracking-wider text-lg shadow-[0_0_15px_rgba(255,75,75,0.5)] hover:shadow-[0_0_25px_rgba(255,75,75,0.8)] transition-all retro-button disabled:opacity-50"
        >
          {saving ? "Assigning..." : "Assign to my squad"}
        </button>
      </div>
    </div>
  );
}
