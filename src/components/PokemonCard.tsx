import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface PokemonAPI {
  id: number;
  name: string;
  types: { type: { name: string } }[];
  sprite: string;
  moves: { move: { name: string } }[];
}

interface PokemonCardProps {
  pokemon: PokemonAPI;
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

export default function PokemonCard({ pokemon, effectiveness }: PokemonCardProps) {
  return (
    <Card className={`hover:scale-105 transition-all duration-200 ${
      effectiveness === "counter" ? "border-green-500 shadow-green-500/20" : 
      effectiveness === "weak" ? "border-red-500 shadow-red-500/20" : ""
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
            <CardTitle className="text-lg">{pokemon.name}</CardTitle>
            <div className="flex gap-1 mt-1">
              {pokemon.types.map((typeObj) => (
                <Badge
                  key={typeObj.type.name}
                  className={`${typeColors[typeObj.type.name.toLowerCase()]} text-white text-xs`}
                >
                  {typeObj.type.name.charAt(0).toUpperCase() + typeObj.type.name.slice(1)}
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
              {pokemon.moves.slice(0, 4).map((moveObj, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {moveObj.move.name.charAt(0).toUpperCase() + moveObj.move.name.slice(1)}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}