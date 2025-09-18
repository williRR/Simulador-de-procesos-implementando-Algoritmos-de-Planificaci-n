import React from "react";

// Componente ColaProcesos
// Muestra la lista de procesos que están esperando en la cola.
// Recibe como prop `queue`, que es un arreglo de procesos con sus datos.
const ColaProcesos = ({ queue }) => {
  return (
    <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
      {/* Título de la sección */}
      <h3 className="text-lg font-semibold text-blue-700 mb-2">
        Cola de Procesos
      </h3>

      {/* Lista de procesos */}
      <ul className="space-y-2">
        {queue.length > 0 ? (
          queue.map((p) => (
            <li
              key={p.pid}
              className="p-2 bg-white rounded-lg shadow-sm border border-gray-200"
            >
              {/* Información del proceso */}
              <span className="font-bold text-gray-800">PID {p.pid}</span> —{" "}
              <span className="text-gray-700">{p.name}</span>
              <div className="text-sm text-gray-600">
                ⏱ Tiempo CPU: {p.cpuTime} | ⏳ Restante: {p.remainingTime}
              </div>
            </li>
          ))
        ) : (
          // Mensaje si no hay procesos en la cola
          <li className="text-gray-500 italic">No hay procesos en la cola.</li>
        )}
      </ul>
    </div>
  );
};

export default ColaProcesos;
