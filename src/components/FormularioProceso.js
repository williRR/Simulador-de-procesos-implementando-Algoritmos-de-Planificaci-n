import React, { useState } from 'react';
//import './FormularioProceso.css';

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
        remainingTime: parseInt(cpuTime),
        quantum: parseInt(quantum) || 0
      });
      setName('');
      setCpuTime('');
      setArrivalTime('');
      setQuantum('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="formulario-proceso">
      <h3>Crear Proceso</h3>
      <input type="text" placeholder="Nombre" value={name} onChange={(e) => setName(e.target.value)} required />
      <input type="number" placeholder="Tiempo en CPU" value={cpuTime} onChange={(e) => setCpuTime(e.target.value)} min="1" required />
      <input type="number" placeholder="Instante de Llegada" value={arrivalTime} onChange={(e) => setArrivalTime(e.target.value)} min="0" required />
      <input type="number" placeholder="Quantum (si aplica)" value={quantum} onChange={(e) => setQuantum(e.target.value)} min="0" />
      <button type="submit">Agregar Proceso</button>
    </form>
  );
};

export default FormularioProceso;