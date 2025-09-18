import React, { useState, useEffect } from 'react';
import FormularioProceso from './components/FormularioProceso';
import SelectorAlgoritmo from './components/SelectorAlgoritmo';
import ColaProcesos from './components/ColaProcesos';
import HistorialProcesos from './components/HistorialProcesos';
import ControlSimulacion from './components/ControlSimulacion';

const TIME_UNIT_MS = 3000; // 1 segundo por unidad de tiempo

function App() {
  const [processes, setProcesses] = useState([]);
  const [queue, setQueue] = useState([]);
  const [history, setHistory] = useState([]);
  const [currentProcess, setCurrentProcess] = useState(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [selectedAlgorithm, setSelectedAlgorithm] = useState('FCFS');
  const [pidCounter, setPidCounter] = useState(1);

  const addProcess = (newProcess) => {
    setProcesses((prevProcesses) => [
      ...prevProcesses,
      {
        ...newProcess,
        pid: pidCounter,
        quantumCount: 0,
        remainingTime: Number(newProcess.cpuTime),
        cpuTime: Number(newProcess.cpuTime),
        arrivalTime: Number(newProcess.arrivalTime),
        quantum: newProcess.quantum ? Number(newProcess.quantum) : 2,
        startTime: -1, // -1 indica que aún no ha iniciado
      },
    ]);
    setPidCounter((prevCounter) => prevCounter + 1);
  };

  // Bucle principal de la simulación (controla el tiempo)
  useEffect(() => {
    if (!isRunning) return;
    const interval = setInterval(() => {
      setCurrentTime((prevTime) => prevTime + 1);
    }, TIME_UNIT_MS);
    return () => clearInterval(interval);
  }, [isRunning]);

  // Lógica de planificación y ejecución (se ejecuta en cada unidad de tiempo)
  useEffect(() => {
    if (!isRunning) return;

    let newCurrentProcess = currentProcess ? { ...currentProcess } : null;
    let newQueue = [...queue];
    let newHistory = [...history];

    // 1. Mover nuevos procesos a la cola
    const newArrivals = processes.filter((p) => p.arrivalTime === currentTime);
    if (newArrivals.length > 0) {
      newQueue = [...newQueue, ...newArrivals];
      setProcesses((prevProcesses) => prevProcesses.filter((p) => p.arrivalTime !== currentTime));
    }

    // 2. Ejecutar el proceso actual
    if (newCurrentProcess) {
      newCurrentProcess.remainingTime--;
      if (selectedAlgorithm === 'RoundRobin') {
        newCurrentProcess.quantumCount++;
      }
    }

    // 3. Lógica de finalización y expropiación
    if (newCurrentProcess && newCurrentProcess.remainingTime <= 0) {
      const finishTime = currentTime;
      const turnaroundTime = finishTime - newCurrentProcess.arrivalTime;
      const waitingTime = turnaroundTime - newCurrentProcess.cpuTime;

      newHistory.push({
        ...newCurrentProcess,
        finishTime: finishTime,
        turnaroundTime: turnaroundTime,
        waitingTime: waitingTime,
      });
      newCurrentProcess = null;
    } else if (newCurrentProcess && selectedAlgorithm === 'RoundRobin' && newCurrentProcess.quantumCount >= newCurrentProcess.quantum) {
      newQueue.push({ ...newCurrentProcess, quantumCount: 0 });
      newCurrentProcess = null;
    } else if (newCurrentProcess && selectedAlgorithm === 'SRTF') {
      const shortestInQueue = newQueue.length > 0 ? [...newQueue].sort((a, b) => a.remainingTime - b.remainingTime)[0] : null;
      if (shortestInQueue && shortestInQueue.remainingTime < newCurrentProcess.remainingTime) {
        newQueue.push(newCurrentProcess);
        newCurrentProcess = null;
      }
    }

    // 4. Elegir el siguiente proceso si la CPU está libre
    if (!newCurrentProcess && newQueue.length > 0) {
      switch (selectedAlgorithm) {
        case 'FCFS':
        case 'RoundRobin':
          newCurrentProcess = newQueue.shift();
          break;
        case 'SJF':
          newQueue.sort((a, b) => a.cpuTime - b.cpuTime);
          newCurrentProcess = newQueue.shift();
          break;
        case 'SRTF':
          newQueue.sort((a, b) => a.remainingTime - b.remainingTime);
          newCurrentProcess = newQueue.shift();
          break;
        default:
          newCurrentProcess = newQueue.shift();
          break;
      }
      if (newCurrentProcess && newCurrentProcess.startTime === -1) {
        newCurrentProcess.startTime = currentTime;
      }
    }

    // 5. Actualizar el estado
    setCurrentProcess(newCurrentProcess);
    setQueue(newQueue);
    setHistory(newHistory);

  }, [currentTime, isRunning, processes, selectedAlgorithm , currentProcess, queue, history]);

  const handleStartSimulation = () => {
    setIsRunning(true);
  };

  const handleStopSimulation = () => {
    setIsRunning(false);
  };

  const handleCleanHistory = () => {
    setHistory([]);
    setCurrentTime(0);
    setProcesses([]);
    setQueue([]);
    setCurrentProcess(null);
    setPidCounter(1);
    setIsRunning(false);
  };

  const handleSelectAlgorithm = (algo) => {
    setSelectedAlgorithm(algo);
    setIsRunning(false);
  };

  return (
    <div className="app-container">
      <h1>Simulador de Planificación de Procesos</h1>
      <div className="controls-section">
        <FormularioProceso addProcess={addProcess} />
        <SelectorAlgoritmo onSelectAlgorithm={handleSelectAlgorithm} selectedAlgorithm={selectedAlgorithm} />
        <ControlSimulacion
          iniciarSimulacion={handleStartSimulation}
          detenerSimulacion={handleStopSimulation}
          limpiarHistorial={handleCleanHistory}
          isRunning={isRunning}
        />
      </div>
      <div className="simulation-status-section">
        <p>Tiempo actual: {currentTime} unidad(es)</p>
        <p>Proceso en CPU: {currentProcess ? `${currentProcess.name} (ID: ${currentProcess.pid}, T. Restante: ${currentProcess.remainingTime})` : 'Ninguno'}</p>
        <ColaProcesos queue={queue} />
        <HistorialProcesos historial={history} />
      </div>
    </div>
  );
}

export default App;