// src/components/SelectorAlgoritmo.js
import React from "react";

function AlgorithmSelector({ onSelectAlgorithm, selectedAlgorithm }) {
  const handleChange = (event) => {
    onSelectAlgorithm(event.target.value);
  };

  return (
    <div className="algorithm-selector">
      <label htmlFor="algorithm">Selecciona el algoritmo: </label>
      <select
        id="algorithm"
        value={selectedAlgorithm}
        onChange={handleChange}
      >
        <option value="FCFS">FCFS (First Come First Served)</option>
        <option value="SJF">SJF (Shortest Job First)</option>
        <option value="SRTF">SRTF (Shortest Remaining Time First)</option>
        <option value="RoundRobin">Round Robin</option>
      </select>
    </div>
  );
}

export default AlgorithmSelector;
