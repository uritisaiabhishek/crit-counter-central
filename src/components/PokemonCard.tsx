import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PokemonDetails } from "@/services/pokeapi";

interface PokemonCardProps {
  pokemon: PokemonDetails;
  effectiveness?: "counter" | "weak";
}

const typeColors: Record<string, string> = {
  normal: "bg-slate-400",
  fire: "bg-red-500",
  water: "bg-blue-500",
  electric: "bg-yellow-500",
  grass: "bg-green-500",
  ice: "bg-cyan-400",
  fighting: "bg-red-700",
  poison: "bg-purple-500",
  ground: "bg-yellow-700",
  flying: "bg-indigo-400",
  psychic: "bg-pink-500",
  bug: "bg-green-400",
  rock: "bg-yellow-800",
  ghost: "bg-purple-700",
  dragon: "bg-indigo-700",
  dark: "bg-gray-800",
  steel: "bg-gray-500",
  fairy: "bg-pink-300"
};

export const PokemonCard: React.FC<PokemonCardProps> = ({ pokemon, effectiveness }) => {
  return (
    <Card className={`hover:scale-105 transition-all duration-200 ${
      effectiveness === "counter" ? "border-red-500 shadow-red-500/20" : 
      effectiveness === "weak" ? "border-green-500 shadow-green-500/20" : ""
    } shadow-lg`}>
      <CardHeader className="pb-3">
        <div className="flex items-center gap-3">
          <img
            src={pokemon.sprite}
            alt={pokemon.name}
            className="w-16 h-16 object-contain"
            onError={(e) => {
              e.currentTarget.src = "/placeholder.svg";
            }}
          />
          <div className="flex-1">
            <CardTitle className="text-lg capitalize">{pokemon.name}</CardTitle>
            <p className="text-sm text-muted-foreground">#{pokemon.id}</p>
            <div className="flex gap-1 mt-1">
              {pokemon.types.map((type) => (
                <Badge
                  key={type}
                  className={`${typeColors[type.toLowerCase()]} text-white text-xs`}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="space-y-3">
          <div>
            <h4 className="font-semibold text-sm mb-1">Sample Moves</h4>
            <div className="flex flex-wrap gap-1">
              {pokemon.moves.fast.slice(0, 4).map((move, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {move.charAt(0).toUpperCase() + move.slice(1)}
                </Badge>
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-sm mb-1">Stats</h4>
            <div className="grid grid-cols-2 gap-1 text-xs">
              <div>HP: {pokemon.stats.hp}</div>
              <div>ATK: {pokemon.stats.attack}</div>
              <div>DEF: {pokemon.stats.defense}</div>
              <div>SPD: {pokemon.stats.speed}</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};