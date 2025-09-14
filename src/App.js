import React, { useState, useEffect } from 'react';
import ProcessForm from './components/FormularioProceso';
import AlgorithmSelector from './components/SelectorAlgoritmo';
import ProcessQueue from './components/ColaProcesos';
import ProcessHistory from './components/HistorialProcesos';
import SimulationControls from './components/SimulationControls';

const UNIDAD_TIEMPO_MS = 5000; // 5 segundos

function App() {
  const [processes, setProcesses] = useState([]);
  const [queue, setQueue] = useState([]);
  const [history, setHistory] = useState([]);
  const [currentProcess, setCurrentProcess] = useState(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [selectedAlgorithm, setSelectedAlgorithm] = useState('FCFS');
  const [pidCounter, setPidCounter] = useState(1);

  // Lógica para agregar un proceso
  const addProcess = (newProcess) => {
    setProcesses((prevProcesses) => [...prevProcesses, { ...newProcess, pid: pidCounter }]);
    setPidCounter((prevCounter) => prevCounter + 1);
  };

  // Lógica de simulación
  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setCurrentTime((prevTime) => prevTime + 1);
    }, TIME_UNIT_MS);

    return () => clearInterval(interval);
  }, [isRunning]);

  // Lógica para gestionar la llegada de procesos y la cola
  useEffect(() => {
    // Mover procesos de `processes` a `queue` cuando llega su instante
    const newArrivals = processes.filter(p => p.arrivalTime === currentTime);
    if (newArrivals.length > 0) {
      setQueue(prevQueue => [...prevQueue, ...newArrivals]);
      setProcesses(prevProcesses => prevProcesses.filter(p => p.arrivalTime !== currentTime));
    }

    // Lógica del planificador
    if (!currentProcess && queue.length > 0) {
      let nextProcess;
      switch (selectedAlgorithm) {
        case 'FCFS':
          // FCFS: Elige el primero que llegó
          nextProcess = queue[0];
          setQueue(prevQueue => prevQueue.slice(1));
          break;
        // Agrega aquí la lógica para SJF, SRTF, Round Robin
        case 'SJF':
          // SJF: Elige el proceso con el tiempo de CPU más corto
          const sortedSJF = [...queue].sort((a, b) => a.cpuTime - b.cpuTime);
          nextProcess = sortedSJF[0];
          setQueue(prevQueue => prevQueue.filter(p => p.pid !== nextProcess.pid));
          break;
        case 'SRTF':
          // SRTF: Similar a SJF, pero expropiativo
          // Implementación más compleja, requiere chequear si hay un proceso con menor tiempo restante
          break;
        case 'RoundRobin':
          // Round Robin: Elige el primero, si no termina lo devuelve al final de la cola
          break;
        default:
          nextProcess = queue[0];
          setQueue(prevQueue => prevQueue.slice(1));
          break;
      }
      setCurrentProcess(nextProcess);
    }

    // Lógica para la ejecución del proceso actual
    if (currentProcess) {
      if (currentProcess.remainingTime > 0) {
        // Reducir el tiempo restante
        setCurrentProcess(prev => ({ ...prev, remainingTime: prev.remainingTime - 1 }));
      } else {
        // Proceso terminado
        setHistory(prevHistory => [...prevHistory, { ...currentProcess, finishTime: currentTime }]);
        setCurrentProcess(null);
      }
    }

  }, [currentTime, isRunning, processes, queue, currentProcess, selectedAlgorithm]);

  const handleStartSimulation = () => {
    setIsRunning(true);
  };

  const handleSelectAlgorithm = (algo) => {
    setSelectedAlgorithm(algo);
  };

  return (
    <div className="app-container">
      <h1>Simulador de Planificación de Procesos</h1>
      <div className="controls-section">
        <ProcessForm addProcess={addProcess} />
        <AlgorithmSelector onSelectAlgorithm={handleSelectAlgorithm} selectedAlgorithm={selectedAlgorithm} />
        <SimulationControls onStart={handleStartSimulation} isRunning={isRunning} />
      </div>
      <div className="simulation-status-section">
        <p>Tiempo actual: {currentTime} unidad(es)</p>
        <p>Proceso en CPU: {currentProcess ? currentProcess.name : 'Ninguno'}</p>
        <ProcessQueue queue={queue} />
        <ProcessHistory history={history} />
      </div>
    </div>
  );
}

export default App;