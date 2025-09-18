import React from 'react';
//import './ColaProcesos.css';

const ColaProcesos = ({ queue }) => {
  return (
    <div className="cola-procesos">
      <h3>Cola de Procesos</h3>
      <ul>
        {queue.length > 0 ? (
          queue.map(p => (
            <li key={p.pid}>
              PID: {p.pid} - {p.name} (T. CPU: {p.cpuTime}, T. Restante: {p.remainingTime})
            </li>
          ))
        ) : (
          <li>No hay procesos en la cola.</li>
        )}
      </ul>
    </div>
  );
};

export default ColaProcesos;