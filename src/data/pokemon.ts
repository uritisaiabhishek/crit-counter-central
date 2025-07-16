export interface Pokemon {
  id: number;
  name: string;
  types: string[];
  sprite: string;
  moves: {
    fast: string[];
    charged: string[];
  };
}

export const pokemonDatabase: Pokemon[] = [
  {
    id: 25,
    name: "Pikachu",
    types: ["Electric"],
    sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png",
    moves: {
      fast: ["Thunder Shock", "Quick Attack"],
      charged: ["Thunderbolt", "Thunder", "Agility"]
    }
  },
  {
    id: 6,
    name: "Charizard",
    types: ["Fire", "Flying"],
    sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/6.png",
    moves: {
      fast: ["Fire Fang", "Air Slash"],
      charged: ["Fire Blast", "Dragon Claw", "Solar Beam"]
    }
  },
  {
    id: 9,
    name: "Blastoise",
    types: ["Water"],
    sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/9.png",
    moves: {
      fast: ["Water Gun", "Bite"],
      charged: ["Hydro Pump", "Ice Beam", "Flash Cannon"]
    }
  },
  {
    id: 3,
    name: "Venusaur",
    types: ["Grass", "Poison"],
    sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/3.png",
    moves: {
      fast: ["Vine Whip", "Razor Leaf"],
      charged: ["Solar Beam", "Sludge Bomb", "Frenzy Plant"]
    }
  },
  {
    id: 144,
    name: "Articuno",
    types: ["Ice", "Flying"],
    sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/144.png",
    moves: {
      fast: ["Frost Breath", "Ice Shard"],
      charged: ["Blizzard", "Ice Beam", "Hurricane"]
    }
  },
  {
    id: 145,
    name: "Zapdos",
    types: ["Electric", "Flying"],
    sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/145.png",
    moves: {
      fast: ["Thunder Shock", "Charge Beam"],
      charged: ["Thunder", "Thunderbolt", "Drill Peck"]
    }
  },
  {
    id: 146,
    name: "Moltres",
    types: ["Fire", "Flying"],
    sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/146.png",
    moves: {
      fast: ["Fire Spin", "Wing Attack"],
      charged: ["Fire Blast", "Heat Wave", "Sky Attack"]
    }
  },
  {
    id: 143,
    name: "Snorlax",
    types: ["Normal"],
    sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/143.png",
    moves: {
      fast: ["Lick", "Zen Headbutt"],
      charged: ["Body Slam", "Hyper Beam", "Heavy Slam"]
    }
  },
  {
    id: 150,
    name: "Mewtwo",
    types: ["Psychic"],
    sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/150.png",
    moves: {
      fast: ["Psycho Cut", "Confusion"],
      charged: ["Psychic", "Shadow Ball", "Ice Beam"]
    }
  },
  {
    id: 94,
    name: "Gengar",
    types: ["Ghost", "Poison"],
    sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/94.png",
    moves: {
      fast: ["Shadow Claw", "Hex"],
      charged: ["Shadow Ball", "Sludge Bomb", "Focus Blast"]
    }
  },
  {
    id: 131,
    name: "Lapras",
    types: ["Water", "Ice"],
    sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/131.png",
    moves: {
      fast: ["Water Gun", "Ice Shard"],
      charged: ["Surf", "Ice Beam", "Blizzard"]
    }
  },
  {
    id: 68,
    name: "Machamp",
    types: ["Fighting"],
    sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/68.png",
    moves: {
      fast: ["Counter", "Bullet Punch"],
      charged: ["Dynamic Punch", "Cross Chop", "Heavy Slam"]
    }
  }
];

// Type effectiveness chart (simplified)
export const typeEffectiveness: Record<string, { strong: string[], weak: string[] }> = {
  fire: {
    strong: ["grass", "ice", "bug", "steel"],
    weak: ["water", "ground", "rock"]
  },
  water: {
    strong: ["fire", "ground", "rock"],
    weak: ["electric", "grass"]
  },
  electric: {
    strong: ["water", "flying"],
    weak: ["ground"]
  },
  grass: {
    strong: ["water", "ground", "rock"],
    weak: ["fire", "ice", "poison", "flying", "bug"]
  },
  ice: {
    strong: ["grass", "ground", "flying", "dragon"],
    weak: ["fire", "fighting", "rock", "steel"]
  },
  fighting: {
    strong: ["normal", "ice", "rock", "dark", "steel"],
    weak: ["flying", "psychic", "fairy"]
  },
  poison: {
    strong: ["grass", "fairy"],
    weak: ["ground", "psychic"]
  },
  ground: {
    strong: ["fire", "electric", "poison", "rock", "steel"],
    weak: ["water", "grass", "ice"]
  },
  flying: {
    strong: ["grass", "fighting", "bug"],
    weak: ["electric", "ice", "rock"]
  },
  psychic: {
    strong: ["fighting", "poison"],
    weak: ["bug", "ghost", "dark"]
  },
  bug: {
    strong: ["grass", "psychic", "dark"],
    weak: ["fire", "flying", "rock"]
  },
  rock: {
    strong: ["fire", "ice", "flying", "bug"],
    weak: ["water", "grass", "fighting", "ground", "steel"]
  },
  ghost: {
    strong: ["psychic", "ghost"],
    weak: ["ghost", "dark"]
  },
  dragon: {
    strong: ["dragon"],
    weak: ["ice", "dragon", "fairy"]
  },
  dark: {
    strong: ["psychic", "ghost"],
    weak: ["fighting", "bug", "fairy"]
  },
  steel: {
    strong: ["ice", "rock", "fairy"],
    weak: ["fire", "fighting", "ground"]
  },
  fairy: {
    strong: ["fighting", "dragon", "dark"],
    weak: ["poison", "steel"]
  },
  normal: {
    strong: [],
    weak: ["fighting"]
  }
};

export function getCounters(pokemon: Pokemon, teraType?: string): Pokemon[] {
  const types = teraType ? [teraType.toLowerCase()] : pokemon.types.map(t => t.toLowerCase());
  const counters: Pokemon[] = [];
  
  for (const targetType of types) {
    const effectiveness = typeEffectiveness[targetType];
    if (effectiveness) {
      for (const weakType of effectiveness.weak) {
        const counterPokemon = pokemonDatabase.filter(p => 
          p.types.some(t => t.toLowerCase() === weakType) && p.id !== pokemon.id
        );
        counters.push(...counterPokemon);
      }
    }
  }
  
  // Remove duplicates and return first 6
  const uniqueCounters = counters.filter((p, index, self) => 
    index === self.findIndex(p2 => p2.id === p.id)
  );
  
  return uniqueCounters.slice(0, 6);
}

export function getWeakTo(pokemon: Pokemon, teraType?: string): Pokemon[] {
  const types = teraType ? [teraType.toLowerCase()] : pokemon.types.map(t => t.toLowerCase());
  const weakTo: Pokemon[] = [];
  
  for (const targetType of types) {
    const effectiveness = typeEffectiveness[targetType];
    if (effectiveness) {
      for (const strongType of effectiveness.strong) {
        const weakPokemon = pokemonDatabase.filter(p => 
          p.types.some(t => t.toLowerCase() === strongType) && p.id !== pokemon.id
        );
        weakTo.push(...weakPokemon);
      }
    }
  }
  
  // Remove duplicates and return first 6
  const uniqueWeak = weakTo.filter((p, index, self) => 
    index === self.findIndex(p2 => p2.id === p.id)
  );
  
  return uniqueWeak.slice(0, 6);
}