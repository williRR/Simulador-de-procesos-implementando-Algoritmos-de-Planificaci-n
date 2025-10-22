import React, { useState } from 'react';

const FormularioProceso = ({ agregarProceso, algoritmo }) => {
  const [proceso, setProceso] = useState({
    llegada: 0,
    rafaga: 1,
    prioridad: 1
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (proceso.rafaga <= 0) {
      alert('La ráfaga debe ser mayor que 0');
      return;
    }

    agregarProceso(proceso);
    
    // Resetear formulario
    setProceso({
      llegada: 0,
      rafaga: 1,
      prioridad: 1
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProceso({
      ...proceso,
      [name]: parseInt(value) || 0
    });
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xl">
      <h2 className="text-xl font-semibold text-gray-700 mb-4">Añadir Nuevo Proceso</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="form-group">
          <label>Tiempo de Llegada:</label>
          <input
            type="number"
            name="llegada"
            min="0"
            value={proceso.llegada}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
          />
        </div>

        <div className="form-group">
          <label>Tiempo de Ráfaga (CPU):</label>
          <input
            type="number"
            name="rafaga"
            min="1"
            value={proceso.rafaga}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
          />
        </div>

        {algoritmo === 'Prioridad' && (
          <div className="form-group">
            <label>Prioridad (menor = mayor prioridad):</label>
            <input
              type="number"
              name="prioridad"
              min="1"
              value={proceso.prioridad}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
            />
          </div>
        )}

        <button type="submit" 
          className="mt-6 w-full text-black font-bold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 btn-blue-gradient">
          Añadir Proceso
        </button>
      </form>
    </div>
  );
};

export default FormularioProceso;