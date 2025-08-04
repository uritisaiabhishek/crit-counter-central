import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";
import GameSelectionModal from "@/components/GameSelectionModal";
import TeraTypeSelector from "@/components/TeraTypeSelector";
import PokemonCard from "@/components/PokemonCard";
import PokemonSearchDropdown from "@/components/PokemonSearchDropdown";
import { useToast } from "@/hooks/use-toast";

type PokemonAPI = {
  id: number;
  name: string;
  sprites: { front_default: string };
  types: { type: { name: string } }[];
};

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
  const [selectedPokemon, setSelectedPokemon] = useState<PokemonAPI | null>(null);
  const [selectedTeraType, setSelectedTeraType] = useState<string | null>(null);
  const [counters, setCounters] = useState<PokemonAPI[]>([]);
  const [weakTo, setWeakTo] = useState<PokemonAPI[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const savedGame = localStorage.getItem("pokemon-game");
    if (savedGame) {
      setSelectedGame(savedGame);
    } else {
      setShowGameModal(true);
    }
  }, []);

  // Fetch Pokémon data from PokéAPI
  const fetchPokemon = async (name: string) => {
    try {
      const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${name.toLowerCase()}`);
      if (!res.ok) throw new Error("Pokémon not found");
      const data: PokemonAPI = await res.json();
      return {
        id: data.id,
        name: data.name.charAt(0).toUpperCase() + data.name.slice(1),
        sprite: data.sprites.front_default,
        types: data.types.map(t => t.type.name.charAt(0).toUpperCase() + t.type.name.slice(1)),
      };
    } catch {
      return null;
    }
  };

  // Fetch type effectiveness from PokéAPI
  const fetchTypeEffectiveness = async (types: string[]) => {
    // Get all type relations
    const promises = types.map(type =>
      fetch(`https://pokeapi.co/api/v2/type/${type.toLowerCase()}`).then(res => res.json())
    );
    const typeData = await Promise.all(promises);

    // Aggregate damage relations
    const doubleDamageFrom = new Set<string>();
    const doubleDamageTo = new Set<string>();
    typeData.forEach(td => {
      td.damage_relations.double_damage_from.forEach((t: any) => doubleDamageFrom.add(t.name));
      td.damage_relations.double_damage_to.forEach((t: any) => doubleDamageTo.add(t.name));
    });

    return { doubleDamageFrom, doubleDamageTo };
  };

  useEffect(() => {
    const getMatchups = async () => {
      if (!selectedPokemon) return;
      const types = selectedTeraType ? [selectedTeraType] : selectedPokemon.types;
      const { doubleDamageFrom, doubleDamageTo } = await fetchTypeEffectiveness(types);

      // For demo: get first 20 Pokémon and filter by type
      const res = await fetch("https://pokeapi.co/api/v2/pokemon?limit=20");
      const list = await res.json();
      const pokemons: PokemonAPI[] = await Promise.all(
        list.results.map((p: any) => fetchPokemon(p.name))
      );

      setCounters(
        pokemons.filter(p =>
          p?.types.some(t => doubleDamageFrom.has(t.toLowerCase()))
        )
      );
      setWeakTo(
        pokemons.filter(p =>
          p?.types.some(t => doubleDamageTo.has(t.toLowerCase()))
        )
      );
    };
    getMatchups();
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

  const handlePokemonSelect = async (pokemon: { name: string }) => {
    const poke = await fetchPokemon(pokemon.name);
    setSelectedPokemon(poke);
    setSelectedTeraType(null);
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
              <PokemonSearchDropdown
                value={searchQuery}
                onSelect={handlePokemonSelect}
                onQueryChange={handleSearchQueryChange}
                placeholder="Search for a Pokémon..."
                className="text-lg py-6"
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
