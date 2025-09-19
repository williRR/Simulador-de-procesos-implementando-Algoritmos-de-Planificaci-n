import React, { useState } from 'react';

const FormularioProceso = ({ addProcess }) => {
  const [name, setName] = useState('');
  const [cpuTime, setCpuTime] = useState('');
  const [arrivalTime, setArrivalTime] = useState('');
  const [quantum, setQuantum] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name && cpuTime && arrivalTime) {
      addProcess({
        name,
        cpuTime: parseInt(cpuTime),
        arrivalTime: parseInt(arrivalTime),
        quantum: parseInt(quantum) || 2
      });
      setName('');
      setCpuTime('');
      setArrivalTime('');
      setQuantum('');
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xl">
      <h2 className="text-xl font-semibold text-gray-700 mb-4">Añadir Nuevo Proceso</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="text" id="processName" placeholder="Nombre del Proceso" value={name} onChange={(e) => setName(e.target.value)} required 
          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200" />
        <input type="number" id="cpuTime" placeholder="Tiempo en CPU" value={cpuTime} onChange={(e) => setCpuTime(e.target.value)} min="1" required 
          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200" />
        <input type="number" id="arrivalTime" placeholder="Instante de Llegada" value={arrivalTime} onChange={(e) => setArrivalTime(e.target.value)} min="0" required 
          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200" />
        <input type="number" id="quantum" placeholder="Quantum (solo RR)" value={quantum} onChange={(e) => setQuantum(e.target.value)} min="1" 
          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200" />
        <button type="submit" 
          className="mt-6 w-full text-white font-bold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 btn-blue-gradient">
          Añadir Proceso
        </button>
      </form>
    </div>
  );
};

export default FormularioProceso;