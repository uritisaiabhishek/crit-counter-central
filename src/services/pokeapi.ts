export interface PokemonDetails {
  id: number;
  name: string;
  types: string[];
  sprite: string;
  moves: {
    fast: string[];
    charged: string[];
  };
  abilities: string[];
  stats: {
    hp: number;
    attack: number;
    defense: number;
    specialAttack: number;
    specialDefense: number;
    speed: number;
  };
  battleRanking?: number;
}

export interface PokemonSearchResult {
  pokemon: PokemonDetails;
  matchType: string;
}

export interface TypeEffectiveness {
  doubleDamageTo: string[];
  doubleDamageFrom: string[];
  halfDamageTo: string[];
  halfDamageFrom: string[];
  noDamageTo: string[];
  noDamageFrom: string[];
}

const POKEAPI_BASE_URL = 'https://pokeapi.co/api/v2';

// Cache for API responses
const cache = new Map<string, any>();

// Filter Pokemon based on game availability
const filterPokemonByGame = (pokemonList: any[], gameId: string): any[] => {
  // Map games to their generation limits
  const getGenerationLimit = (gameId: string): number | null => {
    switch (gameId) {
      // Gen 1 games
      case 'red-blue':
      case 'yellow':
        return 151;
      
      // Gen 2 games
      case 'gold-silver':
      case 'crystal':
        return 251;
      
      // Gen 3 games
      case 'ruby-sapphire':
      case 'emerald':
      case 'firered-leafgreen':
        return 386;
      
      // Gen 4 games
      case 'diamond-pearl':
      case 'platinum':
        return 493;
      
      // Gen 5 games
      case 'black-white':
      case 'black2-white2':
        return 649;
      
      // Gen 6 games
      case 'x-y':
      case 'omega-ruby-alpha-sapphire':
        return 721;
      
      // Gen 7 games
      case 'sun-moon':
      case 'ultra-sun-ultra-moon':
      case 'lets-go':
        return 807;
      
      // Gen 8 games
      case 'sword-shield':
        return 898;
      
      // Gen 9 games
      case 'scarlet-violet':
        return 1010;
      
      // Special games - include all Pokemon
      case 'pokemon-go':
      case 'legends-arceus':
      case 'colosseum':
      case 'xd-gale-of-darkness':
      case 'snap':
      case 'stadium':
      case 'mystery-dungeon':
      case 'ranger':
      case 'conquest':
      case 'battle-revolution':
        return null; // No limit for special games
      
      default:
        return null; // No filtering for unknown games
    }
  };

  const limit = getGenerationLimit(gameId);
  
  if (limit === null) {
    return pokemonList; // Return all Pokemon for special games or unknown games
  }
  
  return pokemonList.filter((p: any) => {
    if (!p.pokemon.url.includes('/pokemon/')) return false;
    const pokemonId = parseInt(p.pokemon.url.split('/')[6]);
    return pokemonId <= limit && pokemonId > 0;
  });
};

// Calculate battle ranking based on stats and type effectiveness
const calculateBattleRanking = (attacker: PokemonDetails, defender: PokemonDetails, gameId?: string): number => {
  let ranking = 0;
  
  // Base stat total
  const baseStatTotal = Object.values(attacker.stats).reduce((sum, stat) => sum + stat, 0);
  ranking += baseStatTotal / 10;
  
  // Type effectiveness bonus
  const attackerTypes = attacker.types;
  const defenderTypes = defender.types;
  
  // Simple type effectiveness calculation (2x damage = +50 points)
  for (const attackType of attackerTypes) {
    for (const defenseType of defenderTypes) {
      // This is simplified - in reality we'd need full type chart
      if (isTypeEffective(attackType, defenseType)) {
        ranking += 50;
      }
    }
  }
  
  // Game-specific bonuses
  if (gameId === 'pokemon-go') {
    // CP-like calculation for Pokemon GO
    ranking = Math.sqrt(attacker.stats.attack) * Math.sqrt(attacker.stats.defense) * Math.sqrt(attacker.stats.hp);
  }
  
  return ranking;
};

// Simplified type effectiveness check
const isTypeEffective = (attackType: string, defenseType: string): boolean => {
  const effectiveness: Record<string, string[]> = {
    fire: ['grass', 'ice', 'bug', 'steel'],
    water: ['fire', 'ground', 'rock'],
    grass: ['water', 'ground', 'rock'],
    electric: ['water', 'flying'],
    psychic: ['fighting', 'poison'],
    ice: ['grass', 'ground', 'flying', 'dragon'],
    dragon: ['dragon'],
    dark: ['psychic', 'ghost'],
    fighting: ['normal', 'ice', 'rock', 'dark', 'steel'],
    poison: ['grass', 'fairy'],
    ground: ['fire', 'electric', 'poison', 'rock', 'steel'],
    flying: ['grass', 'fighting', 'bug'],
    bug: ['grass', 'psychic', 'dark'],
    rock: ['fire', 'ice', 'flying', 'bug'],
    ghost: ['psychic', 'ghost'],
    steel: ['ice', 'rock', 'fairy'],
    fairy: ['fighting', 'dragon', 'dark']
  };
  
  return effectiveness[attackType]?.includes(defenseType) || false;
};

export const fetchPokemonDetails = async (nameOrId: string): Promise<PokemonDetails | null> => {
  try {
    const cacheKey = `pokemon-${nameOrId.toLowerCase()}`;
    if (cache.has(cacheKey)) {
      return cache.get(cacheKey);
    }

    const response = await fetch(`${POKEAPI_BASE_URL}/pokemon/${nameOrId.toLowerCase()}`);
    if (!response.ok) return null;
    
    const data = await response.json();
    
    const pokemon: PokemonDetails = {
      id: data.id,
      name: data.name,
      types: data.types.map((t: any) => t.type.name),
      sprite: data.sprites.front_default || '/placeholder.svg',
      moves: {
        fast: data.moves.slice(0, 10).map((m: any) => m.move.name),
        charged: data.moves.slice(10, 20).map((m: any) => m.move.name),
      },
      abilities: data.abilities.map((a: any) => a.ability.name),
      stats: {
        hp: data.stats[0].base_stat,
        attack: data.stats[1].base_stat,
        defense: data.stats[2].base_stat,
        specialAttack: data.stats[3].base_stat,
        specialDefense: data.stats[4].base_stat,
        speed: data.stats[5].base_stat,
      }
    };
    
    cache.set(cacheKey, pokemon);
    return pokemon;
  } catch (error) {
    console.error('Error fetching Pokemon:', error);
    return null;
  }
};

export const searchPokemonByName = async (query: string, gameId?: string): Promise<PokemonSearchResult[]> => {
  if (!query || query.length < 2) return [];
  
  try {
    const cacheKey = `search-${query.toLowerCase()}-${gameId || 'all'}`;
    if (cache.has(cacheKey)) {
      return cache.get(cacheKey);
    }

    // Get list of all Pokemon (first 1000)
    const response = await fetch(`${POKEAPI_BASE_URL}/pokemon?limit=1000`);
    const data = await response.json();
    
    // Filter by game first if gameId is provided
    let filteredResults = data.results;
    if (gameId) {
      filteredResults = filterPokemonByGame(data.results.map((p: any) => ({ pokemon: p })), gameId)
        .map((item: any) => item.pokemon);
    }
    
    // Then filter by name
    const matchingNames = filteredResults.filter((p: any) => 
      p.name.toLowerCase().includes(query.toLowerCase())
    ).slice(0, 10); // Limit to 10 results
    
    const results: PokemonSearchResult[] = [];
    
    for (const pokemon of matchingNames) {
      const details = await fetchPokemonDetails(pokemon.name);
      if (details) {
        results.push({
          pokemon: details,
          matchType: 'name'
        });
      }
    }
    
    cache.set(cacheKey, results);
    return results;
  } catch (error) {
    console.error('Error searching Pokemon:', error);
    return [];
  }
};

export const fetchTypeEffectiveness = async (typeName: string): Promise<TypeEffectiveness | null> => {
  try {
    const cacheKey = `type-${typeName.toLowerCase()}`;
    if (cache.has(cacheKey)) {
      return cache.get(cacheKey);
    }

    const response = await fetch(`${POKEAPI_BASE_URL}/type/${typeName.toLowerCase()}`);
    if (!response.ok) return null;
    
    const data = await response.json();
    
    const effectiveness: TypeEffectiveness = {
      doubleDamageTo: data.damage_relations.double_damage_to.map((t: any) => t.name),
      doubleDamageFrom: data.damage_relations.double_damage_from.map((t: any) => t.name),
      halfDamageTo: data.damage_relations.half_damage_to.map((t: any) => t.name),
      halfDamageFrom: data.damage_relations.half_damage_from.map((t: any) => t.name),
      noDamageTo: data.damage_relations.no_damage_to.map((t: any) => t.name),
      noDamageFrom: data.damage_relations.no_damage_from.map((t: any) => t.name),
    };
    
    cache.set(cacheKey, effectiveness);
    return effectiveness;
  } catch (error) {
    console.error('Error fetching type effectiveness:', error);
    return null;
  }
};

export const getCounters = async (pokemon: PokemonDetails, teraType?: string, gameId?: string): Promise<PokemonDetails[]> => {
  const types = teraType ? [teraType] : pokemon.types;
  const counters: PokemonDetails[] = [];
  
  try {
    for (const type of types) {
      const effectiveness = await fetchTypeEffectiveness(type);
      if (effectiveness) {
        // Get Pokemon that are strong against this type
        for (const strongType of effectiveness.doubleDamageFrom) {
          // Get some Pokemon of this type
          const typeResponse = await fetch(`${POKEAPI_BASE_URL}/type/${strongType}`);
          const typeData = await typeResponse.json();
          
          // Filter Pokemon based on game mechanics
          let pokemonList = typeData.pokemon;
          if (gameId) {
            pokemonList = filterPokemonByGame(pokemonList, gameId);
          }
          
          for (const pokemonData of pokemonList.slice(0, 8)) {
            const details = await fetchPokemonDetails(pokemonData.pokemon.name);
            if (details && !counters.find(c => c.id === details.id)) {
              // Add battle ranking based on stats and type advantage
              const battleRanking = calculateBattleRanking(details, pokemon, gameId);
              counters.push({ ...details, battleRanking });
            }
          }
        }
      }
    }
    
    // Sort by battle ranking for better counter suggestions
    counters.sort((a, b) => (b.battleRanking || 0) - (a.battleRanking || 0));
    
  } catch (error) {
    console.error('Error getting counters:', error);
  }
  
  return counters.slice(0, 12); // Limit to 12 counters
};

export const getWeakTo = async (pokemon: PokemonDetails, teraType?: string): Promise<PokemonDetails[]> => {
  const types = teraType ? [teraType] : pokemon.types;
  const weakTo: PokemonDetails[] = [];
  
  try {
    for (const type of types) {
      const effectiveness = await fetchTypeEffectiveness(type);
      if (effectiveness) {
        // Get Pokemon that this type is weak to
        for (const weakType of effectiveness.doubleDamageTo) {
          // Get some Pokemon of this type
          const typeResponse = await fetch(`${POKEAPI_BASE_URL}/type/${weakType}`);
          const typeData = await typeResponse.json();
          
          for (const pokemonData of typeData.pokemon.slice(0, 5)) {
            const details = await fetchPokemonDetails(pokemonData.pokemon.name);
            if (details && !weakTo.find(w => w.id === details.id)) {
              weakTo.push(details);
            }
          }
        }
      }
    }
  } catch (error) {
    console.error('Error getting weak to:', error);
  }
  
  return weakTo.slice(0, 12); // Limit to 12 weak to
};