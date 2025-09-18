// src/components/SelectorAlgoritmo.js
import React from "react";

function AlgorithmSelector({ onSelectAlgorithm, selectedAlgorithm }) {
  const algorithms = [
    { value: "FCFS", label: "FCFS (First Come First Served)" },
    { value: "SJF", label: "SJF (Shortest Job First)" },
    { value: "SRTF", label: "SRTF (Shortest Remaining Time First)" },
    { value: "RoundRobin", label: "Round Robin" },
  ];

  return (
    <div className="p-4 bg-white rounded-2xl shadow-md">
      <p className="font-semibold text-lg mb-2">
        Selecciona el algoritmo de planificación:
      </p>
      <div className="grid gap-2">
        {algorithms.map((algo) => (
          <label
            key={algo.value}
            className={`flex items-center cursor-pointer px-4 py-2 rounded-xl border transition 
              ${
                selectedAlgorithm === algo.value
                  ? "bg-blue-500 text-white border-blue-600 shadow-md"
                  : "bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200"
              }`}
          >
            <input
              type="radio"
              name="algorithm"
              value={algo.value}
              checked={selectedAlgorithm === algo.value}
              onChange={() => onSelectAlgorithm(algo.value)}
              className="hidden"
            />
            {algo.label}
          </label>
        ))}
      </div>
    </div>
  );
}

export default AlgorithmSelector;
