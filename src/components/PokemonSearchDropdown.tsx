import React, { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { searchPokemonByName, PokemonDetails, PokemonSearchResult } from "@/services/pokeapi";

interface PokemonSearchDropdownProps {
  value: string;
  onSelect: (pokemon: PokemonDetails) => void;
  onQueryChange: (query: string) => void;
  placeholder?: string;
  className?: string;
  gameId?: string;
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

const PokemonSearchDropdown: React.FC<PokemonSearchDropdownProps> = ({
  value,
  onSelect,
  onQueryChange,
  placeholder = "Search for a Pokémon...",
  className = "",
  gameId,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<PokemonSearchResult[]>([]);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [isLoading, setIsLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (value.trim().length >= 2) {
        setIsLoading(true);
        try {
          const results = await searchPokemonByName(value, gameId);
          setSuggestions(results);
        } catch (error) {
          console.error('Error fetching suggestions:', error);
          setSuggestions([]);
        } finally {
          setIsLoading(false);
        }
      } else {
        setSuggestions([]);
      }
    };

    const timeoutId = setTimeout(fetchSuggestions, 300); // Debounce
    return () => clearTimeout(timeoutId);
  }, [value, gameId]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
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

  const handleSelect = (pokemon: PokemonDetails) => {
    onSelect(pokemon);
    onQueryChange(pokemon.name);
    setIsOpen(false);
    setHighlightedIndex(-1);
  };

  const handleInputFocus = () => {
    if (suggestions.length > 0) {
      setIsOpen(true);
    }
  };

  return (
    <div className={`relative w-full ${className}`} ref={dropdownRef}>
      <Input
        value={value}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        onFocus={handleInputFocus}
        placeholder={placeholder}
        className="w-full"
        autoComplete="off"
      />
      
      {isOpen && (
        <Card className="absolute top-full left-0 right-0 z-50 mt-1 max-h-60 overflow-y-auto border shadow-lg">
          {isLoading ? (
            <div className="p-4 text-center text-muted-foreground">
              Searching Pokémon...
            </div>
          ) : suggestions.length > 0 ? (
            <div className="p-2">
              {suggestions.map((result, index) => (
                <div
                  key={result.pokemon.id}
                  className={`flex items-center gap-3 p-3 rounded-md cursor-pointer transition-colors ${
                    index === highlightedIndex 
                      ? "bg-accent text-accent-foreground" 
                      : "hover:bg-accent hover:text-accent-foreground"
                  }`}
                  onClick={() => handleSelect(result.pokemon)}
                  onMouseEnter={() => setHighlightedIndex(index)}
                >
                  <img
                    src={result.pokemon.sprite}
                    alt={result.pokemon.name}
                    className="w-10 h-10 object-contain"
                    onError={(e) => {
                      e.currentTarget.src = "/placeholder.svg";
                    }}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="font-medium capitalize">{result.pokemon.name}</div>
                    <div className="flex gap-2">
                      {result.pokemon.types.map((type) => (
                        <Badge
                          key={type}
                          variant="secondary"
                          className={`${typeColors[type as keyof typeof typeColors] || 'bg-gray-500'} text-white`}
                        >
                          {type}
                        </Badge>
                      ))}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      #{result.pokemon.id} • Match: {result.matchType}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : value.trim().length >= 2 ? (
            <div className="p-4 text-center text-muted-foreground">
              No Pokémon found
            </div>
          ) : (
            <div className="p-4 text-center text-muted-foreground">
              Type at least 2 characters to search
            </div>
          )}
        </Card>
      )}
    </div>
  );
};

export default PokemonSearchDropdown;