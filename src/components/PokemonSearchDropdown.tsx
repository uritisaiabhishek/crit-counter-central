import { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { searchPokemon, type Pokemon } from "@/data/pokemon";

interface PokemonSearchDropdownProps {
  value: string;
  onSelect: (pokemon: Pokemon) => void;
  onQueryChange: (query: string) => void;
  placeholder?: string;
  className?: string;
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

export default function PokemonSearchDropdown({ 
  value, 
  onSelect, 
  onQueryChange, 
  placeholder = "Search for a Pokémon...",
  className = ""
}: PokemonSearchDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<{ pokemon: Pokemon; matchType: string }[]>([]);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (value.trim()) {
      const results = searchPokemon(value);
      setSuggestions(results);
      setIsOpen(results.length > 0);
      setHighlightedIndex(-1);
    } else {
      setSuggestions([]);
      setIsOpen(false);
    }
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current && 
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onQueryChange(newValue);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen || suggestions.length === 0) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setHighlightedIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : 0
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setHighlightedIndex(prev => 
          prev > 0 ? prev - 1 : suggestions.length - 1
        );
        break;
      case "Enter":
        e.preventDefault();
        if (highlightedIndex >= 0 && highlightedIndex < suggestions.length) {
          handleSelect(suggestions[highlightedIndex].pokemon);
        }
        break;
      case "Escape":
        setIsOpen(false);
        setHighlightedIndex(-1);
        break;
    }
  };

  const handleSelect = (pokemon: Pokemon) => {
    onSelect(pokemon);
    onQueryChange(pokemon.name); // Update the search query to show selected Pokemon name
    setIsOpen(false);
    setHighlightedIndex(-1);
  };

  const handleInputFocus = () => {
    if (suggestions.length > 0) {
      setIsOpen(true);
    }
  };

  return (
    <div className={`relative w-full ${className}`}>
      <Input
        ref={inputRef}
        value={value}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        onFocus={handleInputFocus}
        placeholder={placeholder}
        className="w-full"
        autoComplete="off"
      />
      
      {isOpen && suggestions.length > 0 && (
        <Card 
          ref={dropdownRef}
          className="absolute top-full left-0 right-0 z-50 mt-1 max-h-80 overflow-y-auto border shadow-lg bg-background"
        >
          <div className="p-1">
            {suggestions.map((result, index) => {
              const { pokemon, matchType } = result;
              return (
                <div
                  key={pokemon.id}
                  className={`flex items-center gap-3 p-3 rounded-md cursor-pointer transition-colors ${
                    index === highlightedIndex 
                      ? "bg-accent text-accent-foreground" 
                      : "hover:bg-accent hover:text-accent-foreground"
                  }`}
                  onClick={() => handleSelect(pokemon)}
                  onMouseEnter={() => setHighlightedIndex(index)}
                >
                  <img
                    src={pokemon.sprite}
                    alt={pokemon.name}
                    className="w-10 h-10 object-contain"
                    onError={(e) => {
                      e.currentTarget.src = "/placeholder.svg";
                    }}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="font-medium">{pokemon.name}</div>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex gap-1">
                        {pokemon.types.map((type) => (
                          <Badge
                            key={type}
                            className={`${typeColors[type.toLowerCase()]} text-white text-xs`}
                          >
                            {type}
                          </Badge>
                        ))}
                      </div>
                      <span className="text-xs text-muted-foreground">•</span>
                      <span className="text-xs text-muted-foreground">{pokemon.region}</span>
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {matchType === 'name' && 'Name match'}
                    {matchType === 'type' && 'Type match'}
                    {matchType === 'region' && 'Region match'}
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      )}
      
      {value.trim() && suggestions.length === 0 && (
        <Card className="absolute top-full left-0 right-0 z-50 mt-1 border shadow-lg bg-background">
          <div className="p-4 text-center text-muted-foreground">
            <div>No Pokémon found for "{value}"</div>
            <div className="text-xs mt-1">Try searching by name, type (e.g., "Fire"), or region (e.g., "Kanto")</div>
          </div>
        </Card>
      )}
    </div>
  );
}