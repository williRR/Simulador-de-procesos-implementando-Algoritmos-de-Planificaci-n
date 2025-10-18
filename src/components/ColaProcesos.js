import React from 'react';

const ColaProcesos = ({ procesos }) => {
  return (
    <div className="cola-procesos">
      <h3>Procesos Ingresados</h3>
      {procesos.length === 0 ? (
        <p className="mensaje-vacio">No hay procesos en la cola</p>
      ) : (
        <div className="lista-procesos">
          {procesos.map((proceso, index) => (
            <div key={proceso.id} className="proceso-item">
              <div className="proceso-header">
                <span className="proceso-numero">P{index + 1}</span>
                <span className="proceso-rafaga">Ráfaga: {proceso.rafaga}</span>
              </div>
              <div className="proceso-detalles">
                <small>Llegada: {proceso.llegada}</small>
                {proceso.prioridad && <small>Prioridad: {proceso.prioridad}</small>}
                <small>Restante: {proceso.tiempoRestante}</small>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ColaProcesos;