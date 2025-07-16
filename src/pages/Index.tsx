import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Settings } from "lucide-react";
import GameSelectionModal from "@/components/GameSelectionModal";
import TeraTypeSelector from "@/components/TeraTypeSelector";
import PokemonCard from "@/components/PokemonCard";
import { pokemonDatabase, getCounters, getWeakTo, type Pokemon } from "@/data/pokemon";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [selectedGame, setSelectedGame] = useState<string | null>(null);
  const [showGameModal, setShowGameModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPokemon, setSelectedPokemon] = useState<Pokemon | null>(null);
  const [selectedTeraType, setSelectedTeraType] = useState<string | null>(null);
  const [counters, setCounters] = useState<Pokemon[]>([]);
  const [weakTo, setWeakTo] = useState<Pokemon[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const savedGame = localStorage.getItem("pokemon-game");
    if (savedGame) {
      setSelectedGame(savedGame);
    } else {
      setShowGameModal(true);
    }
  }, []);

  useEffect(() => {
    if (selectedPokemon) {
      const counterList = getCounters(selectedPokemon, selectedTeraType || undefined);
      const weakList = getWeakTo(selectedPokemon, selectedTeraType || undefined);
      setCounters(counterList);
      setWeakTo(weakList);
    }
  }, [selectedPokemon, selectedTeraType]);

  const handleGameSelect = (game: string) => {
    localStorage.setItem("pokemon-game", game);
    setSelectedGame(game);
    setShowGameModal(false);
    toast({
      title: "Game Selected!",
      description: `You've selected ${game.replace("-", " ").replace(/\b\w/g, l => l.toUpperCase())}`,
    });
  };

  const handleGameChange = () => {
    localStorage.removeItem("pokemon-game");
    setSelectedGame(null);
    setShowGameModal(true);
    setSelectedPokemon(null);
    setSelectedTeraType(null);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    
    if (query.trim()) {
      const pokemon = pokemonDatabase.find(p => 
        p.name.toLowerCase().includes(query.toLowerCase())
      );
      
      if (pokemon) {
        setSelectedPokemon(pokemon);
        setSelectedTeraType(null);
      } else {
        setSelectedPokemon(null);
      }
    } else {
      setSelectedPokemon(null);
    }
  };

  const getGameDisplayName = (gameId: string) => {
    switch (gameId) {
      case "scarlet-violet": return "Scarlet / Violet";
      case "diamond-pearl": return "Diamond / Pearl";
      case "lets-go": return "Let's Go Eevee / Pikachu";
      default: return gameId;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
      <GameSelectionModal 
        isOpen={showGameModal} 
        onGameSelect={handleGameSelect} 
      />
      
      {/* Navbar */}
      <nav className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-primary">Pokédex Battle</h1>
            {selectedGame && (
              <span className="text-sm text-muted-foreground">
                {getGameDisplayName(selectedGame)}
              </span>
            )}
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={handleGameChange}
            className="gap-2"
          >
            <Settings className="w-4 h-4" />
            Change Game
          </Button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {!selectedPokemon ? (
          <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6">
            <div className="text-center space-y-4">
              <h2 className="text-4xl font-bold">Find Pokémon Battle Info</h2>
              <p className="text-xl text-muted-foreground max-w-md">
                Search for any Pokémon to see what beats it and what it's strong against
              </p>
            </div>
            
            <div className="w-full max-w-lg">
              <Input
                placeholder="Search for a Pokémon..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="text-lg py-6 text-center"
              />
              
              {searchQuery && !selectedPokemon && (
                <p className="text-center text-muted-foreground mt-2">
                  No Pokémon found. Try "Pikachu", "Charizard", or "Mewtwo"
                </p>
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Selected Pokémon Info */}
            <div className="text-center space-y-6">
              <div className="flex flex-col items-center gap-4">
                <Input
                  placeholder="Search for a Pokémon..."
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="max-w-lg"
                />
                
                <div className="flex items-center gap-4">
                  <img
                    src={selectedPokemon.sprite}
                    alt={selectedPokemon.name}
                    className="w-24 h-24 object-contain"
                  />
                  <div>
                    <h2 className="text-3xl font-bold">{selectedPokemon.name}</h2>
                    <div className="flex gap-2 mt-2">
                      {selectedPokemon.types.map((type) => (
                        <span
                          key={type}
                          className="px-3 py-1 bg-primary text-primary-foreground rounded-full text-sm font-medium"
                        >
                          {type}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Tera Type Selection for Scarlet/Violet */}
              {selectedGame === "scarlet-violet" && (
                <TeraTypeSelector
                  selectedType={selectedTeraType}
                  onTypeSelect={setSelectedTeraType}
                />
              )}
            </div>

            {/* Battle Results */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Counters */}
              <div className="space-y-4">
                <h3 className="text-2xl font-bold text-center text-green-600 dark:text-green-400">
                  Best Counters
                  <span className="block text-sm font-normal text-muted-foreground">
                    Pokémon that beat {selectedPokemon.name}
                  </span>
                </h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-1 gap-4">
                  {counters.length > 0 ? counters.map((pokemon) => (
                    <PokemonCard
                      key={pokemon.id}
                      pokemon={pokemon}
                      effectiveness="counter"
                    />
                  )) : (
                    <p className="text-center text-muted-foreground py-8">
                      No strong counters found
                    </p>
                  )}
                </div>
              </div>

              {/* Weak Against */}
              <div className="space-y-4">
                <h3 className="text-2xl font-bold text-center text-red-600 dark:text-red-400">
                  Strong Against
                  <span className="block text-sm font-normal text-muted-foreground">
                    Pokémon that {selectedPokemon.name} beats
                  </span>
                </h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-1 gap-4">
                  {weakTo.length > 0 ? weakTo.map((pokemon) => (
                    <PokemonCard
                      key={pokemon.id}
                      pokemon={pokemon}
                      effectiveness="weak"
                    />
                  )) : (
                    <p className="text-center text-muted-foreground py-8">
                      No advantageous matchups found
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
