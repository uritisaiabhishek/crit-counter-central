import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import GameSelectionModal from "@/components/GameSelectionModal";
import TeraTypeSelector from "@/components/TeraTypeSelector";
import PokemonSearchDropdown from "@/components/PokemonSearchDropdown";
import { PokemonCard } from "@/components/PokemonCard";
import { 
  PokemonDetails, 
  fetchPokemonDetails, 
  getCounters, 
  getWeakTo 
} from "@/services/pokeapi";

// Type definition for Pokemon API response (using PokemonDetails from service)
interface PokemonAPI extends PokemonDetails {}

// List of Pokémon games
const pokemonGames = [
  { id: "scarlet-violet", name: "Scarlet / Violet" },
  { id: "diamond-pearl", name: "Diamond / Pearl" },
  { id: "lets-go", name: "Let's Go Eevee / Pikachu" },
  { id: "firered-leafgreen", name: "FireRed / LeafGreen" },
  { id: "ruby-sapphire", name: "Ruby / Sapphire" },
  { id: "emerald", name: "Emerald" },
  { id: "red-blue", name: "Red / Blue" },
  { id: "yellow", name: "Yellow" },
  { id: "gold-silver", name: "Gold / Silver" },
  { id: "crystal", name: "Crystal" },
  { id: "black-white", name: "Black / White" },
  { id: "black2-white2", name: "Black 2 / White 2" },
  { id: "x-y", name: "X / Y" },
  { id: "omega-ruby-alpha-sapphire", name: "Omega Ruby / Alpha Sapphire" },
  { id: "sun-moon", name: "Sun / Moon" },
  { id: "ultra-sun-ultra-moon", name: "Ultra Sun / Ultra Moon" },
  { id: "sword-shield", name: "Sword / Shield" },
  { id: "pokemon-go", name: "Pokémon GO" },
  { id: "legends-arceus", name: "Legends: Arceus" },
  { id: "colosseum", name: "Colosseum" },
  { id: "xd-gale-of-darkness", name: "XD: Gale of Darkness" },
  { id: "snap", name: "Pokémon Snap" },
  { id: "stadium", name: "Pokémon Stadium" },
  { id: "mystery-dungeon", name: "Mystery Dungeon" },
  { id: "ranger", name: "Pokémon Ranger" },
  { id: "conquest", name: "Pokémon Conquest" },
  { id: "battle-revolution", name: "Battle Revolution" },
];

const Index = () => {
  const [selectedGame, setSelectedGame] = useState<string | null>(null);
  const [showGameModal, setShowGameModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPokemon, setSelectedPokemon] = useState<PokemonDetails | null>(null);
  const [selectedTeraType, setSelectedTeraType] = useState<string | null>(null);
  const [counters, setCounters] = useState<PokemonDetails[]>([]);
  const [weakTo, setWeakTo] = useState<PokemonDetails[]>([]);
  const [isLoadingBattle, setIsLoadingBattle] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const savedGame = localStorage.getItem("pokemon-game");
    if (savedGame) {
      setSelectedGame(savedGame);
    } else {
      setShowGameModal(true);
    }
  }, []);

  // Remove the old fetchPokemon function as we're using the service now

  const updateBattleData = async (pokemon: PokemonDetails, teraType?: string | null) => {
    if (!pokemon) return;

    setIsLoadingBattle(true);
    try {
      const [counterPokemon, weakToPokemon] = await Promise.all([
        getCounters(pokemon, teraType || undefined, selectedGame || undefined),
        getWeakTo(pokemon, teraType || undefined)
      ]);
      
      setCounters(counterPokemon);
      setWeakTo(weakToPokemon);
    } catch (error) {
      console.error('Error updating battle data:', error);
      toast({
        title: "Error",
        description: "Failed to load battle data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoadingBattle(false);
    }
  };

  useEffect(() => {
    if (selectedPokemon) {
      updateBattleData(selectedPokemon, selectedTeraType);
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

  const handlePokemonSelect = async (pokemon: PokemonDetails) => {
    setSelectedPokemon(pokemon);
    setSelectedTeraType(null);
    setSearchQuery(pokemon.name); // Update search query to show selected Pokemon name
  };

  const handleSearchQueryChange = (query: string) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setSelectedPokemon(null);
    }
  };

  const getGameDisplayName = (gameId: string) => {
    const game = pokemonGames.find(g => g.id === gameId);
    return game ? game.name : gameId.replace(/-/g, " ").replace(/\b\w/g, l => l.toUpperCase());
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
      <GameSelectionModal 
        isOpen={showGameModal} 
        onGameSelect={handleGameSelect}
        onClose={() => setShowGameModal(false)}
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
              <PokemonSearchDropdown
                value={searchQuery}
                onSelect={handlePokemonSelect}
                onQueryChange={handleSearchQueryChange}
                placeholder="Search for a Pokémon..."
                className="text-lg py-6"
                gameId={selectedGame || undefined}
              />
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Selected Pokémon Info */}
            <div className="text-center space-y-6">
              <div className="flex flex-col items-center gap-4">
                <PokemonSearchDropdown
                  value={searchQuery}
                  onSelect={handlePokemonSelect}
                  onQueryChange={handleSearchQueryChange}
                  placeholder="Search for a Pokémon..."
                  className="max-w-lg"
                  gameId={selectedGame || undefined}
                />
                
                <div className="flex items-center gap-4">
                  <img
                    src={selectedPokemon.sprite}
                    alt={selectedPokemon.name}
                    className="w-24 h-24 object-contain"
                  />
                  <div>
                    <h2 className="text-3xl font-bold capitalize">{selectedPokemon.name}</h2>
                    <p className="text-muted-foreground">#{selectedPokemon.id}</p>
                    <div className="flex gap-2 mt-2">
                      {selectedPokemon.types.map((type: string) => (
                        <span
                          key={type}
                          className="px-3 py-1 bg-primary text-primary-foreground rounded-full text-sm font-medium capitalize"
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
            <div className="grid md:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle className="text-red-600">
                    Counters (Strong Against {selectedPokemon.name})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {isLoadingBattle ? (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">Loading battle data...</p>
                    </div>
                  ) : (
                    <>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {counters.map((pokemon) => (
                          <PokemonCard
                            key={pokemon.id}
                            pokemon={pokemon}
                            effectiveness="counter"
                          />
                        ))}
                      </div>
                      {counters.length === 0 && (
                        <p className="text-muted-foreground text-center py-8">
                          No counters found for this Pokémon.
                        </p>
                      )}
                    </>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-green-600">
                    {selectedPokemon.name} is Strong Against
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {isLoadingBattle ? (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">Loading battle data...</p>
                    </div>
                  ) : (
                    <>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {weakTo.map((pokemon) => (
                          <PokemonCard
                            key={pokemon.id}
                            pokemon={pokemon}
                            effectiveness="weak"
                          />
                        ))}
                      </div>
                      {weakTo.length === 0 && (
                        <p className="text-muted-foreground text-center py-8">
                          This Pokémon is not particularly strong against any types.
                        </p>
                      )}
                    </>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;