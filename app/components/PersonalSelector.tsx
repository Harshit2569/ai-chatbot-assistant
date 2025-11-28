// interface PersonaSelectorProps {
//   persona: string;
//   setPersona: (value: string) => void;
// }
// interface PersonaSelectorProps {
//   persona: string;
//   setPersona: (persona: string) => void;
// }

// export function PersonaSelector({ persona, setPersona }: PersonaSelectorProps) {
//   const personas = [
//     { id: "Teacher", icon: "👩‍🏫", description: "Educational" },
//     { id: "Assistant", icon: "🤵", description: "Professional" },
//     { id: "Coach", icon: "🏆", description: "Motivational" },
//     { id: "Consultant", icon: "💼", description: "Strategic" },
//     { id: "Friend", icon: "😊", description: "Casual" },
//     { id: "Expert", icon: "🔬", description: "Technical" }
//   ];

//   return (
//     <div className="space-y-3">
//       {personas.map((p) => (
//         <button
//           key={p.id}
//           onClick={() => setPersona(p.id)}
//           className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all duration-200 ${
//             persona === p.id
//               ? "border-purple-500 bg-purple-50 shadow-md transform scale-105"
//               : "border-gray-200 bg-white hover:border-purple-300 hover:bg-purple-25 hover:shadow-sm"
//           }`}
//         >
//           <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-xl ${
//             persona === p.id 
//               ? "bg-gradient-to-r from-purple-500 to-blue-500 text-black" 
//               : "bg-gray-100 text-gray-600"
//           }`}>
//             {p.icon}
//           </div>
//           <div className="flex-1 text-left">
//             <h3 className={`font-semibold ${
//               persona === p.id ? "text-purple-700" : "text-gray-800"
//             }`}>
//               {p.id}
//             </h3>
//             <p className={`text-sm ${
//               persona === p.id ? "text-purple-600" : "text-gray-500"
//             }`}>
//               {p.description}
//             </p>
//           </div>
//           {persona === p.id && (
//             <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
//           )}
//         </button>
//       ))}
//     </div>
//   );
// }


"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react"; // install if not done: npm i lucide-react

interface PersonaSelectorProps {
  persona: string;
  setPersona: (value: string) => void;
}

export function PersonaSelector({ persona, setPersona }: PersonaSelectorProps) {
  const [open, setOpen] = useState(false);

  const personas = [
    { id: "Teacher", icon: "👩‍🏫", description: "Educational" },
    { id: "Assistant", icon: "🤵", description: "Professional" },
    { id: "Coach", icon: "🏆", description: "Motivational" },
    { id: "Consultant", icon: "💼", description: "Strategic" },
    { id: "Friend", icon: "😊", description: "Casual" },
    { id: "Expert", icon: "🔬", description: "Technical" },
  ];

  return (
    <div className="w-full">
      {/* Header for mobile */}
      <div className="flex items-center justify-between sm:hidden mb-3">
        <h2 className="text-base font-semibold text-gray-800 dark:text-gray-200">
          Persona
        </h2>
        <button
          onClick={() => setOpen(!open)}
          className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          aria-label="Toggle personas menu"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Persona List */}
      <div
        className={`space-y-3 overflow-hidden transition-all duration-300 ${
          open
            ? "max-h-[600px] opacity-100"
            : "max-h-0 opacity-0 sm:max-h-none sm:opacity-100"
        } sm:space-y-3 sm:opacity-100 sm:max-h-none`}
      >
        {personas.map((p) => (
          <button
            key={p.id}
            onClick={() => {
              setPersona(p.id);
              setOpen(false); // Close menu on mobile
            }}
            className={`w-full flex items-center gap-4 p-3 sm:p-4 rounded-xl border-2 transition-all duration-200 ${
              persona === p.id
                ? "border-purple-500 bg-purple-50 shadow-md transform scale-105"
                : "border-gray-200 bg-white hover:border-purple-200 hover:bg-purple-50 hover:shadow-sm"
            }`}
          >
            <div
              className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center text-lg sm:text-xl ${
                persona === p.id
                  ? "bg-gradient-to-r from-purple-500 to-blue-500 text-white"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              {p.icon}
            </div>

            <div className="flex-1 text-left">
              <h3
                className={`font-semibold text-sm sm:text-base ${
                  persona === p.id ? "text-purple-700" : "text-gray-800"
                }`}
              >
                {p.id}
              </h3>
              <p
                className={`text-xs sm:text-sm ${
                  persona === p.id ? "text-purple-600" : "text-gray-500"
                }`}
              >
                {p.description}
              </p>
            </div>

            {persona === p.id && (
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
