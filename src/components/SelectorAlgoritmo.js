import React from 'react';

const SelectorAlgoritmo = ({ onSelectAlgorithm, selectedAlgorithm }) => {
    return (
        <select
            id="algorithm"
            value={selectedAlgorithm}
            onChange={(e) => onSelectAlgorithm(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
        >
            <option value="FCFS">FCFS (First-Come, First-Served)</option>
            <option value="SJF">SJF (Shortest Job First)</option>
            <option value="SRTF">SRTF (Shortest Remaining Time First)</option>
            <option value="RoundRobin">Round Robin</option>
        </select>
    );
};

export default SelectorAlgoritmo;