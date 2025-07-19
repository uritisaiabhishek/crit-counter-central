
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
    features: ["Tera Types", "Open World", "New Pokémon"]
  },
  {
    id: "diamond-pearl",
    name: "Diamond / Pearl",
    description: "Classic Sinnoh region adventure",
    features: ["Traditional Gameplay", "Elite Four", "Champion League"]
  },
  {
    id: "lets-go",
    name: "Let's Go Eevee / Pikachu",
    description: "Kanto region with modern mechanics",
    features: ["GO Integration", "Simplified Battles", "Partner Pokémon"]
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
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-6">
          {games.map((game) => (
            <Card 
              key={game.id}
              className={`cursor-pointer transition-all hover:scale-105 ${
                selectedGame === game.id ? 'ring-2 ring-primary' : ''
              }`}
              onClick={() => setSelectedGame(game.id)}
            >
              <CardHeader>
                <CardTitle className="text-lg">{game.name}</CardTitle>
                <CardDescription>{game.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-1 text-sm">
                  {game.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                      {feature}
                    </li>
                  ))}
                </ul>
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
