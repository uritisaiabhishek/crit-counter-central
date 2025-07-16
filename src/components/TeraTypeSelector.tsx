import { Badge } from "@/components/ui/badge";

interface TeraTypeSelectorProps {
  selectedType: string | null;
  onTypeSelect: (type: string | null) => void;
}

const teraTypes = [
  { name: "Normal", color: "bg-slate-400" },
  { name: "Fire", color: "bg-red-500" },
  { name: "Water", color: "bg-blue-500" },
  { name: "Electric", color: "bg-yellow-500" },
  { name: "Grass", color: "bg-green-500" },
  { name: "Ice", color: "bg-cyan-400" },
  { name: "Fighting", color: "bg-red-700" },
  { name: "Poison", color: "bg-purple-500" },
  { name: "Ground", color: "bg-yellow-700" },
  { name: "Flying", color: "bg-indigo-400" },
  { name: "Psychic", color: "bg-pink-500" },
  { name: "Bug", color: "bg-green-400" },
  { name: "Rock", color: "bg-yellow-800" },
  { name: "Ghost", color: "bg-purple-700" },
  { name: "Dragon", color: "bg-indigo-700" },
  { name: "Dark", color: "bg-gray-800" },
  { name: "Steel", color: "bg-gray-500" },
  { name: "Fairy", color: "bg-pink-300" }
];

export default function TeraTypeSelector({ selectedType, onTypeSelect }: TeraTypeSelectorProps) {
  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold text-center">Select Tera Type (Optional)</h3>
      <div className="flex flex-wrap gap-2 justify-center max-w-2xl mx-auto">
        <Badge
          variant={selectedType === null ? "default" : "outline"}
          className="cursor-pointer hover:scale-105 transition-transform"
          onClick={() => onTypeSelect(null)}
        >
          No Tera Type
        </Badge>
        {teraTypes.map((type) => (
          <Badge
            key={type.name}
            variant={selectedType === type.name ? "default" : "outline"}
            className={`cursor-pointer hover:scale-105 transition-transform ${
              selectedType === type.name ? type.color + " text-white" : ""
            }`}
            onClick={() => onTypeSelect(type.name)}
          >
            {type.name}
          </Badge>
        ))}
      </div>
    </div>
  );
}