
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface GameSelectionModalProps {
  isOpen: boolean;
  onGameSelect: (game: string) => void;
  onClose?: () => void;
}

const games = [
  {
    id: "scarlet-violet",
    name: "Scarlet / Violet",
    description: "The latest adventure in the Paldea region",
    features: ["Tera Types", "Open World", "New Pokémon"],
    generation: "Gen 9",
    mechanics: ["Tera Types"]
  },
  {
    id: "sword-shield",
    name: "Sword / Shield", 
    description: "Galar region with Dynamax battles",
    features: ["Dynamax", "Max Moves", "Gigantamax"],
    generation: "Gen 8",
    mechanics: ["Dynamax", "Gigantamax"]
  },
  {
    id: "legends-arceus",
    name: "Legends: Arceus",
    description: "Ancient Sinnoh with new battle styles",
    features: ["Agile/Strong Style", "Alpha Pokémon", "New Mechanics"],
    generation: "Gen 8",
    mechanics: ["Strong/Agile Style"]
  },
  {
    id: "sun-moon",
    name: "Sun / Moon",
    description: "Alola region with Z-Moves",
    features: ["Z-Moves", "Alolan Forms", "Trials"],
    generation: "Gen 7",
    mechanics: ["Z-Moves"]
  },
  {
    id: "x-y",
    name: "X / Y",
    description: "Kalos region introducing Mega Evolution",
    features: ["Mega Evolution", "Fairy Type", "3D Battles"],
    generation: "Gen 6",
    mechanics: ["Mega Evolution"]
  },
  {
    id: "black-white",
    name: "Black / White",
    description: "Unova region with new battle mechanics",
    features: ["Triple Battles", "Rotation Battles", "Hidden Abilities"],
    generation: "Gen 5",
    mechanics: ["Triple Battles", "Rotation Battles"]
  },
  {
    id: "diamond-pearl",
    name: "Diamond / Pearl",
    description: "Sinnoh region with physical/special split",
    features: ["Physical/Special Split", "Underground", "Elite Four"],
    generation: "Gen 4",
    mechanics: ["Physical/Special Split"]
  },
  {
    id: "ruby-sapphire",
    name: "Ruby / Sapphire",
    description: "Hoenn region with abilities and double battles",
    features: ["Abilities", "Double Battles", "Weather Effects"],
    generation: "Gen 3",
    mechanics: ["Abilities", "Double Battles"]
  },
  {
    id: "gold-silver",
    name: "Gold / Silver",
    description: "Johto region with breeding and day/night",
    features: ["Breeding", "Day/Night Cycle", "Steel/Dark Types"],
    generation: "Gen 2",
    mechanics: ["Breeding", "Day/Night"]
  },
  {
    id: "red-blue",
    name: "Red / Blue / Yellow",
    description: "The original Kanto adventure",
    features: ["Classic Gameplay", "Original 151", "Gym Leaders"],
    generation: "Gen 1",
    mechanics: ["Classic Battles"]
  },
  {
    id: "pokemon-go",
    name: "Pokémon GO",
    description: "Mobile AR game with unique mechanics",
    features: ["CP System", "Fast/Charged Moves", "Type Effectiveness"],
    generation: "Mobile",
    mechanics: ["CP System", "GO Battle League"]
  },
  {
    id: "lets-go",
    name: "Let's Go Eevee / Pikachu",
    description: "Kanto remake with GO integration", 
    features: ["GO Integration", "Simplified Battles", "Partner Pokémon"],
    generation: "Gen 7",
    mechanics: ["GO Integration"]
  }
];

export default function GameSelectionModal({ isOpen, onGameSelect, onClose }: GameSelectionModalProps) {
  const [selectedGame, setSelectedGame] = useState<string | null>(null);

  const handleConfirm = () => {
    if (selectedGame) {
      onGameSelect(selectedGame);
      onClose?.(); // Close the modal after selection
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle className="text-2xl text-center">Choose Your Pokémon Game</DialogTitle>
          <DialogDescription className="text-center">
            Select which game you want to get battle information for
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 my-6 max-h-96 overflow-y-auto">
          {games.map((game) => (
            <Card 
              key={game.id}
              className={`cursor-pointer transition-all hover:scale-105 ${
                selectedGame === game.id ? 'ring-2 ring-primary' : ''
              }`}
              onClick={() => setSelectedGame(game.id)}
            >
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{game.name}</CardTitle>
                    <CardDescription>{game.description}</CardDescription>
                  </div>
                  <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                    {game.generation}
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div>
                    <h4 className="text-sm font-medium mb-1">Battle Mechanics:</h4>
                    <div className="flex flex-wrap gap-1">
                      {game.mechanics.map((mechanic, index) => (
                        <span key={index} className="text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded">
                          {mechanic}
                        </span>
                      ))}
                    </div>
                  </div>
                  <ul className="space-y-1 text-sm">
                    {game.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="flex justify-center">
          <Button 
            onClick={handleConfirm} 
            disabled={!selectedGame}
            size="lg"
            className="px-8"
          >
            Start Battling!
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
