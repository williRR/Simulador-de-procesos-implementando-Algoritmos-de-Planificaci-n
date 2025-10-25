import React from 'react';

const TablaGantt = ({ procesos, tiempoTotal, estadosEjecucion }) => {
  // Generar array de tiempos (columnas)
  const tiempos = Array.from({ length: tiempoTotal + 1 }, (_, i) => i);

  // Obtener color según el estado del proceso en ese tiempo
  const obtenerColor = (procesoId, tiempo) => {
    const estado = estadosEjecucion[tiempo]?.find(e => e.procesoId === procesoId);
    if (!estado) return 'transparent';
    
    switch (estado.estado) {
      case 'ejecutando':
        return '#4caf50'; // Verde
      case 'esperando':
        return '#ff9800'; // Naranja
      case 'finalizado':
        return '#2196f3'; // Azul
      default:
        return '#e0e0e0'; // Gris
    }
  };

  return (
    <div className="tabla-gantt-container">
      <h3>Diagrama de Gantt</h3>
      <div className="tabla-wrapper">
        <table className="tabla-gantt">
          <thead>
            <tr>
              <th>Proceso</th>
              {tiempos.map(t => (
                <th key={t}>{t}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {procesos.map((proceso, index) => (
              <tr key={proceso.id}>
                {/* Mostrar id real si existe (permite ver P0), si no usar índice */}
                <td className="proceso-nombre">{proceso.nombre && proceso.nombre.trim() !== '' ? proceso.nombre : `P${proceso.id !== undefined ? proceso.id : index}`}</td>
                {tiempos.map(tiempo => (
                  <td
                    key={tiempo}
                    className="celda-tiempo"
                    style={{ backgroundColor: obtenerColor(proceso.id, tiempo) }}
                  >
                    {estadosEjecucion[tiempo]?.find(e => e.procesoId === proceso.id)?.estado === 'ejecutando' ? '▮' : ''}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="leyenda">
        <span><div className="color-box ejecutando"></div> Ejecutando</span>
        <span><div className="color-box esperando"></div> Esperando</span>
        <span><div className="color-box finalizado"></div> Finalizado</span>
      </div>
    </div>
  );
};

export default TablaGantt;
