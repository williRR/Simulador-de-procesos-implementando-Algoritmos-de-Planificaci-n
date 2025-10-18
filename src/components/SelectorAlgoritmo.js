import React from 'react';

const SelectorAlgoritmo = ({ algoritmo, setAlgoritmo, quantum, setQuantum }) => {
  return (
    <div className="selector-algoritmo">
      <h3>Algoritmo de Planificación</h3>
      
      <div className="form-group">
        <label>Seleccionar Algoritmo:</label>
        <select 
          value={algoritmo} 
          onChange={(e) => setAlgoritmo(e.target.value)}
          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
        >
          <option value="FCFS">FCFS (First Come First Served)</option>
          <option value="SJF">SJF (Shortest Job First)</option>
          <option value="Round Robin">Round Robin</option>
          <option value="Prioridad">Por Prioridad</option>
        </select>
      </div>

      {algoritmo === 'Round Robin' && (
        <div className="form-group">
          <label>Quantum:</label>
          <input
            type="number"
            min="1"
            value={quantum}
            onChange={(e) => setQuantum(parseInt(e.target.value) || 1)}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
          />
        </div>
      )}

      <div className="algoritmo-info">
        <small>
          {algoritmo === 'FCFS' && 'El primer proceso que llega es el primero en ejecutarse.'}
          {algoritmo === 'SJF' && 'El proceso con menor tiempo de ráfaga se ejecuta primero.'}
          {algoritmo === 'Round Robin' && 'Cada proceso se ejecuta durante un quantum de tiempo.'}
          {algoritmo === 'Prioridad' && 'Los procesos se ejecutan según su prioridad (menor número = mayor prioridad).'}
        </small>
      </div>
    </div>
  );
};

export default SelectorAlgoritmo;