import React from 'react';

const ColaProcesos = ({ queue }) => {
  return (
    <div id="readyQueueContainer" className="min-h-[100px] bg-gray-50 rounded-lg p-4 border border-gray-200 overflow-x-auto">
      {queue.length === 0 ? (
        <p id="readyQueuePlaceholder" className="text-center text-gray-400 italic">No hay procesos en la cola.</p>
      ) : (
        queue.map(p => (
          <div key={p.pid} className="bg-blue-100 border-l-4 border-blue-500 text-blue-800 p-2 mb-2 rounded-lg">
            PID: {p.pid} | Nombre: {p.name} | T. Restante: {p.remainingTime}
          </div>
        ))
      )}
    </div>
  );
};

export default ColaProcesos;