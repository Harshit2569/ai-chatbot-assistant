interface PersonaSelectorProps {
  persona: string;
  setPersona: (value: string) => void;
}
interface PersonaSelectorProps {
  persona: string;
  setPersona: (persona: string) => void;
}

export function PersonaSelector({ persona, setPersona }: PersonaSelectorProps) {
  const personas = [
    { id: "Teacher", icon: "👩‍🏫", description: "Educational" },
    { id: "Assistant", icon: "🤵", description: "Professional" },
    { id: "Coach", icon: "🏆", description: "Motivational" },
    { id: "Consultant", icon: "💼", description: "Strategic" },
    { id: "Friend", icon: "😊", description: "Casual" },
    { id: "Expert", icon: "🔬", description: "Technical" }
  ];

  return (
    <div className="space-y-3">
      {personas.map((p) => (
        <button
          key={p.id}
          onClick={() => setPersona(p.id)}
          className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all duration-200 ${
            persona === p.id
              ? "border-purple-500 bg-purple-50 shadow-md transform scale-105"
              : "border-gray-200 bg-white hover:border-purple-300 hover:bg-purple-25 hover:shadow-sm"
          }`}
        >
          <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-xl ${
            persona === p.id 
              ? "bg-gradient-to-r from-purple-500 to-blue-500 text-black" 
              : "bg-gray-100 text-gray-600"
          }`}>
            {p.icon}
          </div>
          <div className="flex-1 text-left">
            <h3 className={`font-semibold ${
              persona === p.id ? "text-purple-700" : "text-gray-800"
            }`}>
              {p.id}
            </h3>
            <p className={`text-sm ${
              persona === p.id ? "text-purple-600" : "text-gray-500"
            }`}>
              {p.description}
            </p>
          </div>
          {persona === p.id && (
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          )}
        </button>
      ))}
    </div>
  );
}

